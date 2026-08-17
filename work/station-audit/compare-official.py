from __future__ import annotations

import csv
import json
import re
import unicodedata
from collections import defaultdict
from pathlib import Path

import pandas as pd
from opencc import OpenCC

ROOT = Path(__file__).resolve().parent
TO_TW = OpenCC("s2tw")


def clean(value) -> str:
    if pd.isna(value):
        return ""
    return unicodedata.normalize("NFC", str(value)).strip()


def station_base(value: str) -> str:
    value = clean(value)
    value = value.replace("（", "(").replace("）", ")")
    value = re.sub(r"\s*\([^)]*\)\s*", "", value)
    value = re.sub(r"역$", "", value)
    return re.sub(r"[\s·.\-']", "", value).lower()


def chinese_base(value: str) -> str:
    value = TO_TW.convert(clean(value))
    value = value.replace("（", "(").replace("）", ")")
    value = re.sub(r"\s*\([^)]*\)\s*", "", value)
    return re.sub(r"[\s·.\-']", "", value)


def english_base(value: str) -> str:
    value = clean(value).replace("’", "'")
    value = re.sub(r"\s*\([^)]*\)\s*", "", value)
    value = value.replace("Station", "")
    return re.sub(r"[^a-z0-9]", "", value.lower())


def load_baseline():
    return json.loads((ROOT / "stations-baseline.json").read_text(encoding="utf-8"))


def add_refs(refs, source, frame, ko_col, en_col, zh_col=None, code_col=None, line_id=None):
    for _, row in frame.iterrows():
        ko = clean(row.get(ko_col, ""))
        if not ko:
            continue
        refs.append({
            "source": source,
            "lineId": line_id,
            "ko": ko,
            "en": clean(row.get(en_col, "")),
            "zh": clean(row.get(zh_col, "")) if zh_col else "",
            "stationCode": clean(row.get(code_col, "")) if code_col else "",
        })


def load_refs():
    refs = []

    seoul = pd.read_csv(ROOT / "seoul-official-20260326.csv", encoding="utf-8")
    for number in range(1, 10):
        part = seoul[seoul["호선"].astype(str).eq(f"{number}호선")]
        add_refs(refs, "Seoul Metro multilingual 2026-03-26", part, "한글", "영문", "중국어", line_id=str(number))

    for number in range(1, 10):
        path = ROOT / f"kric-line{number}-official.xlsx"
        if not path.exists():
            continue
        frame = pd.read_excel(path)
        add_refs(
            refs,
            f"KRIC capital line {number}",
            frame,
            "역명",
            "역명(영문)",
            "역명(중국어 번체)",
            line_id=str(number),
        )

    line8_current = pd.read_excel(ROOT / "kric-line8-current-official.xlsx")
    add_refs(refs, "KRIC capital line 8 station codes 2025-06-30", line8_current, "역명", "영어명", "중국어번체", "역번호", "8")

    special = [
        ("ui-sinseol-official.xlsx", "KRIC Ui-Sinseol 2025-06-30", "UI"),
        ("arex-official.xlsx", "KRIC AREX 2025-06-30", "A"),
        ("shinbundang-official.xlsx", "KRIC Shinbundang 2025-06-30", "D"),
        ("bgl-official.xlsx", "KRIC Busan-Gimhae 2025-06-30", "BGL"),
    ]
    for filename, source, line_id in special:
        frame = pd.read_excel(ROOT / filename)
        add_refs(refs, source, frame, "역명", "영어명", "중국어번체", "역번호", line_id)

    dh = pd.read_excel(ROOT / "donghae-official.xlsx")
    add_refs(refs, "KRIC Donghae 2025-06-30", dh, "역명(한글)", "역명(영문)", "역명(중국어번체) ", line_id="DH")

    for number in range(1, 5):
        frame = pd.read_excel(ROOT / f"busan-line{number}-kric.xlsx")
        add_refs(
            refs,
            f"KRIC Busan line {number} multilingual 2025-06-30",
            frame,
            "역명(한글)",
            "역명(영문)",
            "역명(중국어번체) ",
            line_id=f"B{number}",
        )

    busan_bytes = (ROOT / "busan-official-20251031.csv").read_bytes()
    busan_text = busan_bytes.decode("cp949")
    busan = pd.read_csv(pd.io.common.StringIO(busan_text))
    for number in range(1, 5):
        part = busan[busan["호선"].astype(str).eq(f"{number}호선")]
        add_refs(refs, "Busan Metro station info 2025-10-31", part, "역명", "영문", code_col="역번호", line_id=f"B{number}")

    return refs


def main():
    baseline = load_baseline()
    refs = load_refs()
    by_line_ko = defaultdict(list)
    by_ko = defaultdict(list)
    for ref in refs:
        by_line_ko[(ref["lineId"], station_base(ref["ko"]))].append(ref)
        by_ko[station_base(ref["ko"])].append(ref)

    results = []
    for row in baseline:
        matches = by_line_ko.get((row["lineId"], station_base(row["ko"])), [])
        if not matches:
            matches = by_ko.get(station_base(row["ko"]), [])
        result = dict(row)
        result["matches"] = matches
        result["status"] = "matched" if matches else "unmatched"
        result["enMatch"] = any(english_base(row["en"]) == english_base(x["en"]) for x in matches if x["en"])
        result["zhMatch"] = any(chinese_base(row["zh"]) == chinese_base(x["zh"]) for x in matches if x["zh"])
        result["codeMatch"] = any(clean(row["stationCode"]) == clean(x["stationCode"]) for x in matches if x["stationCode"])
        results.append(result)

    (ROOT / "official-comparison.json").write_text(json.dumps(results, ensure_ascii=False, indent=2), encoding="utf-8")

    summary = {
        "baseline": len(baseline),
        "matched": sum(x["status"] == "matched" for x in results),
        "unmatched": sum(x["status"] == "unmatched" for x in results),
        "matchedEnglish": sum(x["status"] == "matched" and x["enMatch"] for x in results),
        "matchedChinese": sum(x["status"] == "matched" and x["zhMatch"] for x in results),
    }
    print(json.dumps(summary, ensure_ascii=False, indent=2))

    for line_id in sorted(set(x["lineId"] for x in results)):
        group = [x for x in results if x["lineId"] == line_id]
        print(line_id, len(group), sum(x["status"] == "matched" for x in group), sum(x["enMatch"] for x in group), sum(x["zhMatch"] for x in group))


if __name__ == "__main__":
    main()
