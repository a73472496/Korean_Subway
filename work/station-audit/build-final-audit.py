from __future__ import annotations

import json
import re
from collections import Counter, defaultdict
from pathlib import Path

import pandas as pd


ROOT = Path(__file__).resolve().parent
LINE_NAMES = {
    "1": "首爾 1 號線", "1P": "首爾 1 號線（京釜·長項線）", "1G": "首爾 1 號線（光明接駁）", "1S": "首爾 1 號線（西東灘支線）",
    "2": "首爾 2 號線", "2B": "首爾 2 號線（聖水支線）", "2C": "首爾 2 號線（新亭支線）",
    "3": "首爾 3 號線", "4": "首爾 4 號線", "5": "首爾 5 號線", "5M": "首爾 5 號線（馬川支線）",
    "6": "首爾 6 號線", "7": "首爾 7 號線", "8": "首爾 8 號線", "9": "首爾 9 號線",
    "A": "機場鐵路 A'REX", "D": "新盆唐線", "UI": "牛耳新設線",
    "B1": "釜山 1 號線", "B2": "釜山 2 號線", "B3": "釜山 3 號線", "B4": "釜山 4 號線",
    "BGL": "釜山－金海輕軌", "DH": "東海線",
}
SOURCE_URLS = {
    "首爾交通公社多語站名": "https://www.data.go.kr/data/15044232/fileData.do",
    "釜山交通公社都市鐵道站名": "https://www.data.go.kr/data/3077187/fileData.do",
    "KRIC 1 號線": "https://www.data.go.kr/data/15064037/fileData.do",
    "KRIC 3 號線": "https://www.data.go.kr/data/15064040/fileData.do",
    "KRIC 4 號線": "https://www.data.go.kr/data/15064041/fileData.do",
    "KRIC 5 號線": "https://www.data.go.kr/data/15064043/fileData.do",
    "KRIC 6 號線": "https://www.data.go.kr/data/15064045/fileData.do",
    "KRIC 7 號線": "https://www.data.go.kr/data/15064046/fileData.do",
    "KRIC 8 號線／站號": "https://www.data.go.kr/data/15041810/fileData.do",
    "KRIC 牛耳新設線": "https://www.data.go.kr/data/15041029/fileData.do",
    "KRIC A'REX": "https://www.data.go.kr/data/15041034/fileData.do",
    "KRIC 金海輕軌": "https://www.data.go.kr/data/15041041/fileData.do",
    "KRIC 東海線": "https://www.data.go.kr/data/15064706/fileData.do",
    "KRIC 釜山 1 號線": "https://www.data.go.kr/data/15064687/fileData.do",
    "KRIC 釜山 2 號線": "https://www.data.go.kr/data/15064688/fileData.do",
    "KRIC 釜山 4 號線": "https://www.data.go.kr/data/15064700/fileData.do",
    "金海輕軌營運單位站號說明": "https://www.bglrt.com/00028/00031/00042.web?amode=view&cpage=103&gcode=1008&idx=8884&serchtype=field",
}


def official_link(name: str) -> str:
    return f"[{name}]({SOURCE_URLS[name]})"


def source_link(name: str, url: str) -> str:
    return f"[{name}]({url})"


def wiki_ref(row: dict) -> tuple[str, str]:
    match = row.get("wikiMatches", [{}])[0]
    return match.get("sourceTitle", "中文維基百科路線頁"), match.get("sourceUrl", "")


def clean_code(value: object) -> str:
    return re.sub(r"\.0$", "", str(value).strip())


def add_issue(issues: list[dict], row: dict, problem: str, fix: str, sources: str, confidence: str) -> None:
    issues.append({
        "stationCode": row["stationCode"],
        "line": LINE_NAMES[row["lineId"]],
        "currentZh": row["zh"],
        "currentKo": row["ko"],
        "currentEn": row["en"],
        "problem": problem,
        "suggestedFix": fix,
        "sources": sources,
        "confidence": confidence,
    })


def main() -> None:
    baseline = json.loads((ROOT / "stations-baseline.json").read_text(encoding="utf-8"))
    official = json.loads((ROOT / "official-comparison.json").read_text(encoding="utf-8"))
    wiki = json.loads((ROOT / "zhwiki-comparison.json").read_text(encoding="utf-8"))
    by_key = {(x["lineId"], x["stationCode"]): x for x in baseline}
    official_by_key = {(x["lineId"], x["stationCode"]): x for x in official}
    wiki_by_key = {(x["lineId"], x["stationCode"]): x for x in wiki}
    issues: list[dict] = []

    # User-confirmed answers and the directly derived ~앞 rule.
    direct = {
        ("1", "109"): ("佳陵", "Ganeung", "中文錯譯；「가능」不是『可能』"),
        ("1", "119"): ("光雲大學", "Kwangwoon Univ.", "機構縮寫未展開，且官方英文不是羅馬字發音"),
        ("1", "122"): ("韓國外國語大學", "Hankuk Univ. of Foreign Studies", "「외대앞」是韓國外國語大學前，中文慣例省略 앞"),
        ("1", "124"): ("清涼里", "Cheongnyangni", "使用異體字『淸』，應統一正體字『清』"),
        ("1", "127"): ("東廟", "Dongmyo", "中文慣例省略 앞，官方英文亦省略 ap"),
        ("6", "627"): ("孝昌公園", "Hyochang Park", "中文慣例省略 앞，官方英文不是羅馬字發音"),
        ("6", "636"): ("東廟", "Dongmyo", "與 1 號線同一轉乘站，中文慣例省略 앞"),
        ("4", "449"): ("漢陽大學", "Hanyang Univ. at Ansan", "「한대앞」是漢陽大學前，中文慣例省略 앞"),
    }
    for key, (zh, en, problem) in direct.items():
        row = by_key[key]
        wiki_row = wiki_by_key[key]
        title, url = wiki_ref(wiki_row)
        sources = source_link(title, url)
        if key[0] == "1":
            sources += "；" + official_link("KRIC 1 號線")
        elif key[0] == "6":
            sources += "；" + official_link("KRIC 6 號線")
        elif key[0] == "4":
            sources += "；" + official_link("KRIC 4 號線")
        add_issue(issues, row, problem, f"中文改為「{zh}」；英文改為「{en}」", sources + "；使用者提供之中文維基＋Namu 人工核對結果", "高" if key[0] == "1" else "中")

    # Clear institution abbreviations / official English signage (third-party Chinese wording, official English).
    institutions = {
        ("2", "209"): "漢陽大學", ("2", "212"): "建國大學", ("2", "223"): "首爾教育大學", ("2", "228"): "首爾大學", ("2", "239"): "弘益大學", ("2", "241"): "梨花女子大學",
        ("3", "332"): "東國大學", ("3", "340"): "首爾教育大學",
        ("4", "418"): "誠信女子大學", ("4", "419"): "漢城大學", ("4", "427"): "淑明女子大學", ("4", "432"): "總神大學",
        ("6", "640"): "高麗大學", ("7", "727"): "建國大學", ("7", "738"): "崇實大學", ("A", "A03"): "弘益大學",
        ("UI", "S120"): "誠信女子大學", ("1P", "P153"): "成均館大學", ("1P", "P159"): "烏山大學",
        ("B1", "124"): "釜山教育大學",
    }
    for key, zh in institutions.items():
        row = by_key[key]
        wiki_row = wiki_by_key[key]
        title, url = wiki_ref(wiki_row)
        official_row = official_by_key[key]
        english = next((m["en"] for m in official_row["matches"] if m.get("en") and (m.get("lineId") == row["lineId"] or row["lineId"] in {"1P"})), "")
        add_issue(
            issues, row,
            "大學／機構縮寫直接寫成『大／大入口』，沒有採用機構正式通用名稱；英文欄多為發音羅馬字",
            f"中文改為「{zh}」" + (f"；英文採官方站名「{english}」" if english else ""),
            source_link(title, url) + "；" + official_link("首爾交通公社多語站名" if row["city"] == "seoul" else "釜山交通公社都市鐵道站名"),
            "中",
        )

    # Korean official name / punctuation and station-code faults.
    row = by_key[("UI", "S112")]
    add_issue(issues, row, "韓文少了官方名稱中的句點，英文為自行拼讀", "韓文改為「4.19민주묘지」；英文改為「April 19th National Cemetery」", official_link("KRIC 牛耳新設線"), "高")
    row = by_key[("BGL", "504")]
    add_issue(issues, row, "韓文主站名無法對上營運資料；官方主站名為「공항」", "韓文改為「공항」；中文改為「機場」；英文採「Gimhae Int'l Airport」", official_link("KRIC 金海輕軌"), "高")
    for row in [x for x in baseline if x["lineId"] == "BGL"]:
        official_code = str(int(row["stationCode"]) - 400)
        add_issue(issues, row, f"站號使用自訂 5xx；官方旅客站號為 {official_code}", f"站號改為「{official_code}」；以 BGL 徽章／路線色區隔，不改官方號碼", official_link("KRIC 金海輕軌") + "；" + official_link("金海輕軌營運單位站號說明"), "高")
    for code, official_code in [("P175", "P176"), ("P176", "P177")]:
        row = by_key[("1P", code)]
        title, url = wiki_ref(wiki_by_key[("1P", code)])
        add_issue(issues, row, f"旅客站號與路線表不一致；目前為 {code}，對照表為 {official_code}", f"站號改為「{official_code}」", source_link(title, url), "中")

    # High-confidence or multi-source Chinese lexical / glyph issues.
    chinese_fixes = {
        ("3", "343"): ("梅峰", "目前「鷹峰」是另一個韓文站名 응봉；中文維基與 KRIC 均為梅峰", "KRIC 3 號線"),
        ("4", "408"): ("別內星江", "純韓文固有詞 별가람 被自行寫成『別加藍』；公開多語清單採別內星江", "KRIC 4 號線"),
        ("4", "436"): ("首爾賽馬公園", "目前『賽馬公園』缺少官方中文識別詞；英文也應採 Seoul Racecourse Park", "KRIC 4 號線"),
        ("5", "530"): ("兒嶺", "固有詞 애오개 目前套用已停用舊地名漢字『艾峴』；多語表與繁中路線表採兒嶺", "KRIC 5 號線"),
        ("6", "613"): ("瓮岩", "目前『獨岩』為自行意譯；多語表與繁中路線表採瓮岩", "KRIC 6 號線"),
        ("6", "632"): ("波堤嶺", "目前混用韓文＋漢字『버티嶺』，不是完整中文站名", "KRIC 6 號線"),
        ("7", "712"): ("馬得", "目前『馬野』與多語表、繁中路線表不一致", "KRIC 7 號線"),
        ("7", "740"): ("長丞拜基", "目前只翻一半，漏掉固有詞 배기 的通用音譯", "KRIC 7 號線"),
        ("A", "A071"): ("青羅國際城", "使用異體字『靑』，應統一正體字『青』", "KRIC A'REX"),
        ("DH", "K129"): ("望陽", "目前『望洋』與 KRIC 多語資料及繁中路線表不一致", "KRIC 東海線"),
        ("B1", "131"): ("斗實", "目前『斗室』與 KRIC 多語資料及繁中路線表不一致", "KRIC 釜山 1 號線"),
        ("B1", "100"): ("東嵋", "目前『東梅』與繁中路線表不一致；KRIC 資料亦非目前用字", "KRIC 釜山 1 號線"),
        ("B1", "097"): ("納溉", "目前『納介』與繁中路線表不一致；KRIC 資料品質不穩，需人工確認", "KRIC 釜山 1 號線"),
        ("B2", "214"): ("池谷", "目前『沒谷』與多語表、繁中路線表不一致", "KRIC 釜山 2 號線"),
        ("B4", "406"): ("鳴藏", "目前『明將』為按讀音錯配漢字；多語表與繁中路線表採鳴藏", "KRIC 釜山 4 號線"),
        ("B4", "408"): ("錦絲", "目前『金沙』與多語表、繁中路線表不一致", "KRIC 釜山 4 號線"),
        ("BGL", "506"): ("登龜", "目前『燈丘』與官方多語資料及繁中路線表不一致", "KRIC 金海輕軌"),
    }
    for key, (zh, problem, source_name) in chinese_fixes.items():
        row = by_key[key]
        wiki_row = wiki_by_key[key]
        title, url = wiki_ref(wiki_row)
        add_issue(issues, row, problem, f"中文改為「{zh}」", official_link(source_name) + "；" + source_link(title, url), "中")

    # Same physical transfer station must not have different English fields.
    duplicate_groups: dict[tuple[str, str], list[dict]] = defaultdict(list)
    for row in baseline:
        duplicate_groups[(row["city"], row["stationKey"])].append(row)
    for _, rows in duplicate_groups.items():
        english_values = {row["en"] for row in rows}
        if len(rows) < 2 or len(english_values) < 2:
            continue
        for row in rows:
            official_row = official_by_key[(row["lineId"], row["stationCode"])]
            official_en = next((m["en"] for m in official_row["matches"] if m.get("en") and m.get("lineId") == row["lineId"]), "")
            add_issue(issues, row, "同一實體轉乘站在不同路線的英文欄不一致", f"各路線均採同一官方英文主名稱「{official_en or '請依營運單位定稿'}」", official_link("首爾交通公社多語站名"), "高")

    # Exhaustive official-English comparison. The current field is named `en`, so a
    # pronunciation-only romanization is not equivalent to the official English sign name.
    source_url_by_raw_name = {
        "Seoul Metro multilingual 2026-03-26": SOURCE_URLS["首爾交通公社多語站名"],
        "Busan Metro station info 2025-10-31": SOURCE_URLS["釜山交通公社都市鐵道站名"],
        "KRIC capital line 1": SOURCE_URLS["KRIC 1 號線"],
        "KRIC capital line 3": SOURCE_URLS["KRIC 3 號線"],
        "KRIC capital line 4": SOURCE_URLS["KRIC 4 號線"],
        "KRIC capital line 5": SOURCE_URLS["KRIC 5 號線"],
        "KRIC capital line 6": SOURCE_URLS["KRIC 6 號線"],
        "KRIC capital line 7": SOURCE_URLS["KRIC 7 號線"],
        "KRIC capital line 8 station codes 2025-06-30": SOURCE_URLS["KRIC 8 號線／站號"],
        "KRIC Ui-Sinseol 2025-06-30": SOURCE_URLS["KRIC 牛耳新設線"],
        "KRIC AREX 2025-06-30": SOURCE_URLS["KRIC A'REX"],
        "KRIC Busan-Gimhae 2025-06-30": SOURCE_URLS["KRIC 金海輕軌"],
        "KRIC Donghae 2025-06-30": SOURCE_URLS["KRIC 東海線"],
        "KRIC Busan line 1 multilingual 2025-06-30": SOURCE_URLS["KRIC 釜山 1 號線"],
        "KRIC Busan line 2 multilingual 2025-06-30": SOURCE_URLS["KRIC 釜山 2 號線"],
        "KRIC Busan line 4 multilingual 2025-06-30": SOURCE_URLS["KRIC 釜山 4 號線"],
    }
    for row in official:
        if row["status"] != "matched" or row["enMatch"]:
            continue
        candidates = [m for m in row["matches"] if m.get("en")]
        exact_line = [m for m in candidates if m.get("lineId") == row["lineId"]]
        candidates = exact_line or candidates
        if row["lineId"] in {str(x) for x in range(1, 10)}:
            preferred = next((m for m in candidates if m["source"].startswith("Seoul Metro")), None)
        elif row["lineId"] in {"B1", "B2", "B3", "B4"}:
            preferred = next((m for m in candidates if m["source"].startswith("Busan Metro")), None)
        else:
            preferred = next((m for m in candidates if m["source"].startswith("KRIC")), None)
        preferred = preferred or (candidates[0] if candidates else None)
        if not preferred:
            continue
        url = source_url_by_raw_name.get(preferred["source"], "")
        source = source_link(preferred["source"], url) if url else preferred["source"]
        add_issue(
            issues,
            row,
            "英文欄目前是發音羅馬字或舊式寫法，與營運單位／KRIC 的官方英文主名稱不同",
            f"英文改為「{preferred['en']}」；若仍要保留拼音，另增 romanized 欄位",
            source,
            "高",
        )

    # Exhaustive Traditional-Chinese route-table comparison. Wikipedia is not official,
    # so differences that were not independently established above remain a medium-confidence
    # human decision rather than an automatic replacement.
    existing_station_problems = {(x["line"], x["stationCode"]) for x in issues}
    for row in wiki:
        if not row["wikiMatched"] or row["wikiZhMatch"]:
            continue
        wiki_match = row["wikiMatches"][0]
        key = (LINE_NAMES[row["lineId"]], row["stationCode"])
        if key in existing_station_problems:
            continue
        add_issue(
            issues,
            row,
            "目前中文與繁中維基路線表不同；尚無足夠一手繁中標準可直接判定哪一個必然正確",
            f"繁中維基使用「{wiki_match['zh']}」；建議依漢字語源／營運單位多語表人工定稿，不自動覆寫",
            source_link(wiki_match["sourceTitle"], wiki_match["sourceUrl"]),
            "中",
        )

    # Deduplicate identical issue entries but allow one station to have code + name issues separately.
    grouped: dict[tuple[str, str], dict] = {}
    for issue in issues:
        key = (issue["line"], issue["stationCode"])
        if key not in grouped:
            grouped[key] = dict(issue)
            continue
        current = grouped[key]
        for field in ("problem", "suggestedFix", "sources"):
            parts = [part for part in current[field].split("；") if part]
            for part in [part for part in issue[field].split("；") if part]:
                if part not in parts:
                    parts.append(part)
            current[field] = "；".join(parts)
        if current["confidence"] != issue["confidence"]:
            current["confidence"] = "中"
    issues = list(grouped.values())
    for issue in issues:
        if issue["line"] == "首爾 1 號線" and issue["stationCode"] in {"109", "119", "122", "124", "127"}:
            issue["confidence"] = "高"

    physical = {(row["city"], row["stationKey"]) for row in baseline}
    city_counts = Counter(row["city"] for row in baseline)
    city_unique = {city: len({row["stationKey"] for row in baseline if row["city"] == city}) for city in city_counts}
    problem_keys = {(issue["line"], issue["stationCode"]) for issue in issues}

    final = {
        "summary": {
            "routeRows": len(baseline),
            "physicalStations": len(physical),
            "cityRows": city_counts,
            "cityPhysicalStations": city_unique,
            "officialKoreanMatched": sum(x["status"] == "matched" for x in official),
            "wikiRowsMatched": sum(x["wikiMatched"] for x in wiki),
            "problemRows": len(problem_keys),
            "issueEntries": len(issues),
            "auditDate": "2026-08-12",
        },
        "issues": issues,
    }
    (ROOT / "final-audit.json").write_text(json.dumps(final, ensure_ascii=False, indent=2, default=dict), encoding="utf-8")
    pd.DataFrame(issues).to_csv(ROOT / "final-issues.csv", index=False, encoding="utf-8-sig")
    print(json.dumps(final["summary"], ensure_ascii=False, indent=2, default=dict))


if __name__ == "__main__":
    main()
