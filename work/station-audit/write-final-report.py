from __future__ import annotations

import json
from pathlib import Path


ROOT = Path(__file__).resolve().parent
OUTPUT = ROOT.parent.parent / "outputs" / "station-name-audit-20260812"


def esc(value: object) -> str:
    return str(value).replace("|", "\\|").replace("\n", "<br>")


def main() -> None:
    audit = json.loads((ROOT / "final-audit.json").read_text(encoding="utf-8"))
    summary = audit["summary"]
    lines = [
        "# KSW-METRO 站名資料完整核對報告",
        "",
        "## 核對總覽",
        f"- 總站數：{summary['routeRows']} 筆路線資料列；去重後 {summary['physicalStations']} 個實體站（首爾 {summary['cityRows']['seoul']} 筆／{summary['cityPhysicalStations']['seoul']} 站，釜山 {summary['cityRows']['busan']} 筆／{summary['cityPhysicalStations']['busan']} 站）",
        f"- 已核對站數：{summary['routeRows']} 筆；韓文主站名有 {summary['officialKoreanMatched']} 筆可對上官方批次資料，繁中維基路線表有 {summary['wikiRowsMatched']} 筆可用韓文站名對上",
        f"- 發現問題站數：{summary['problemRows']} 筆資料列（高信心為官方韓／英／站號或明確轉乘不一致；中信心為繁中慣用名與漢字語源需人工定稿）",
        "- 主要參考來源：首爾交通公社、釜山交通公社、KRIC／國家鐵道公團公開資料、國立國語院羅馬字規範、各繁中維基路線車站表",
        "",
        "> 重要：`en` 欄目前混用『官方英文站名』與『韓文發音羅馬字』。本報告把兩者分開判斷；例如 `시청 / Sicheong` 的羅馬字可讀音沒有錯，但若欄位語義是英文站名，官方英文應是 `City Hall`。",
        "",
        "## 問題清單",
        "| 站號 | 路線 | 目前中文 | 目前韓文 | 目前英文 | 問題描述 | 建議修正 | 參考來源 | 信心程度 |",
        "|---|---|---|---|---|---|---|---|---|",
    ]
    for issue in audit["issues"]:
        lines.append("| " + " | ".join(esc(issue[key]) for key in ["stationCode", "line", "currentZh", "currentKo", "currentEn", "problem", "suggestedFix", "sources", "confidence"]) + " |")
    lines += [
        "",
        "## 系統性問題（不是單一站的錯）",
        "- **英文欄語義混雜**：官方英文（`City Hall`、`Hongik Univ.`）與發音羅馬字（`Sicheong`、`Hongdaeipgu`）混在同一 `en` 欄。建議拆為 `officialEnglish` 與 `romanized`，否則搜尋、顯示與資料驗證會互相衝突。",
        "- **金海輕軌站號整線錯置**：程式使用 501–521，KRIC 與營運單位為 101–121。避免和釜山 1 號線混淆應靠 `BGL` 徽章／路線色，不應改寫官方站號。",
        "- **機構縮寫未展開**：`광운대`、`외대앞`、`건대입구`、`홍대입구`、`이대` 等大量直接以「大／大入口」呈現，對繁中旅客不夠明確，也與官方英文名稱不一致。",
        "- **`~앞` 規則未一致套用**：`동묘앞`、`효창공원앞`、`한대앞` 等中文仍保留「前」，但使用者指定規則與繁中路線表通常省略 `앞`。",
        "- **正體字與異體字混用**：`淸/清`、`靑/青`、`凉/涼`、`餠/餅` 等沒有統一；應建立人工審核過的 `zhHantTW` 欄位，不用 OpenCC 一鍵覆寫專名。",
        "- **同一轉乘站英文不一致**：目前至少有 `가락시장`、`가산디지털단지`、`올림픽공원` 在不同路線使用不同英文；應以實體站 ID 共用同一名稱物件。",
        "- **中文策略不一致**：目前同時混用漢字語源、機構正式譯名、功能意譯與音譯，沒有來源欄與版本欄；應為每筆中文加 `zhSource`、`verifiedAt`。",
        "",
        "## 無法確認的項目",
        "- 5 號線河南延伸段 5 筆未出現在本次抓到的繁中維基表格中；韓文／英文可由官方資料核對，繁中仍需另找漢字語源或人工確認。",
        "- 金海輕軌目前的 `김해국제공항` 無法以韓文主站名對上官方清單；官方是 `공항`，這一筆不是缺資料，而是應修正。",
        "- 中文維基有少量自身不一致或頁面使用簡體／異體字，故只作中信心參考；沒有第二來源佐證的差異均保留為人工決策。",
        "- KRIC 部分資料使用內部四位碼（例如 8 號線 28xx），不是月台旅客站號；本報告沒有把內部碼與旅客三位碼的格式差異判成錯誤。",
        "- 釜山交通公社 CSV 有個別疑似來源資料錯誤（例如重複站號），遇到來源互相衝突時沒有自動覆寫網站資料。",
        "",
        "## 產物",
        "- `stations-baseline.csv`／`stations-baseline.json`：從 `index.html` 抽出的完整基準資料。",
        "- `ksw-metro-station-name-audit.xlsx`：含總覽、665 筆目前資料、150 筆問題、逐列比對與來源清單。",
        "- `final-issues.csv`：150 筆問題／待確認資料，方便直接篩選與修正。",
    ]
    OUTPUT.mkdir(parents=True, exist_ok=True)
    (OUTPUT / "station-name-audit-report.md").write_text("\n".join(lines) + "\n", encoding="utf-8")
    for name in ("stations-baseline.csv", "stations-baseline.json", "final-issues.csv", "final-audit.json", "zhwiki-manifest.json"):
        (OUTPUT / name).write_bytes((ROOT / name).read_bytes())
    print(OUTPUT / "station-name-audit-report.md")


if __name__ == "__main__":
    main()
