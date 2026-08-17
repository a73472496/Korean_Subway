from __future__ import annotations

import json
import re
import unicodedata
from collections import defaultdict
from pathlib import Path

import pandas as pd
from opencc import OpenCC


ROOT = Path(__file__).resolve().parent
TO_TW = OpenCC("s2tw")
LINE_MAP = {"1P": "1", "1G": "1", "1S": "1", "2B": "2", "2C": "2", "5M": "5"}


def clean(value: object) -> str:
    if pd.isna(value):
        return ""
    text = unicodedata.normalize("NFC", str(value)).strip()
    text = re.sub(r"\[[^]]*]", "", text)
    return text


def primary(value: object) -> str:
    text = clean(value).replace("\r", "\n")
    text = re.split(r"\n|（|\(", text, maxsplit=1)[0]
    return text.strip()


def ko_key(value: object) -> str:
    text = primary(value)
    text = re.sub(r"역$", "", text)
    return re.sub(r"[\s·.\-']", "", text).lower()


def zh_key(value: object) -> str:
    text = TO_TW.convert(primary(value))
    return re.sub(r"[\s·.\-－—()（）]", "", text)


def en_key(value: object) -> str:
    text = primary(value).replace("’", "'").replace("‘", "'")
    return re.sub(r"[^a-z0-9]", "", text.lower())


def column(frame: pd.DataFrame, label: str) -> str | None:
    return next((name for name in frame.columns if label in str(name)), None)


def load_wiki_rows() -> list[dict]:
    manifest = json.loads((ROOT / "zhwiki-manifest.json").read_text(encoding="utf-8"))
    rows: list[dict] = []
    for page in manifest:
        for table in page["selectedTables"]:
            frame = pd.read_csv(ROOT / "zhwiki-tables" / table["file"])
            code_col = column(frame, "車站編號")
            zh_col = column(frame, "中文站名")
            ko_col = column(frame, "韓文站名")
            en_col = column(frame, "英文站名")
            if not all([code_col, zh_col, ko_col, en_col]):
                continue
            for _, row in frame.iterrows():
                ko = primary(row[ko_col])
                if not ko or ko in {"韓文站名", "-"}:
                    continue
                rows.append({
                    "lineId": page["lineId"],
                    "stationCode": primary(row[code_col]),
                    "zh": primary(row[zh_col]),
                    "ko": ko,
                    "en": primary(row[en_col]),
                    "sourceTitle": page["resolvedTitle"],
                    "sourceUrl": page["url"],
                    "tableFile": table["file"],
                })
    return rows


def main() -> None:
    baseline = json.loads((ROOT / "stations-baseline.json").read_text(encoding="utf-8"))
    wiki_rows = load_wiki_rows()
    index: dict[tuple[str, str], list[dict]] = defaultdict(list)
    for row in wiki_rows:
        index[(row["lineId"], ko_key(row["ko"]))].append(row)

    results = []
    for row in baseline:
        wiki_line = LINE_MAP.get(row["lineId"], row["lineId"])
        matches = index.get((wiki_line, ko_key(row["ko"])), [])
        result = dict(row)
        result["wikiLineId"] = wiki_line
        result["wikiMatches"] = matches
        result["wikiMatched"] = bool(matches)
        result["wikiZhMatch"] = any(zh_key(row["zh"]) == zh_key(x["zh"]) for x in matches)
        result["wikiKoMatch"] = any(ko_key(row["ko"]) == ko_key(x["ko"]) for x in matches)
        result["wikiEnMatch"] = any(en_key(row["en"]) == en_key(x["en"]) for x in matches)
        result["wikiCodeMatch"] = any(clean(row["stationCode"]) == clean(x["stationCode"]) for x in matches)
        results.append(result)

    (ROOT / "zhwiki-comparison.json").write_text(json.dumps(results, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps({
        "rows": len(results),
        "wikiRows": len(wiki_rows),
        "matched": sum(x["wikiMatched"] for x in results),
        "zhMatched": sum(x["wikiZhMatch"] for x in results),
        "enMatched": sum(x["wikiEnMatch"] for x in results),
        "codeMatched": sum(x["wikiCodeMatch"] for x in results),
    }, ensure_ascii=False, indent=2))
    for line_id in sorted({x["lineId"] for x in results}):
        group = [x for x in results if x["lineId"] == line_id]
        print(line_id, len(group), sum(x["wikiMatched"] for x in group), sum(x["wikiZhMatch"] for x in group), sum(x["wikiCodeMatch"] for x in group))


if __name__ == "__main__":
    main()
