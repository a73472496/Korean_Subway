from __future__ import annotations

import json
import time
from io import StringIO
from pathlib import Path
from urllib.parse import urlencode
from urllib.error import HTTPError
from urllib.request import Request, urlopen

import pandas as pd


ROOT = Path(__file__).resolve().parent
PAGES = {
    "1": "首都圈電鐵1號線",
    "2": "首爾地鐵2號線",
    "3": "首都圈電鐵3號線",
    "4": "首都圈電鐵4號線",
    "5": "首爾地鐵5號線",
    "6": "首爾地鐵6號線",
    "7": "首爾地鐵7號線",
    "8": "首都圈電鐵8號線",
    "9": "首爾地鐵9號線",
    "A": "仁川國際機場鐵道",
    "D": "新盆唐線",
    "UI": "牛耳新設線",
    "B1": "釜山都市鐵道1號線",
    "B2": "釜山都市铁道2号线",
    "B3": "釜山都市铁道3号线",
    "B4": "釜山都市铁道4号线",
    "BGL": "釜山—金海轻电铁",
    "DH": "广域电铁东海线",
}


def get_page_html(page: str) -> tuple[str, str]:
    query = urlencode({
        "action": "parse",
        "page": page,
        "prop": "text",
        "format": "json",
        "formatversion": "2",
        "redirects": "1",
    })
    url = f"https://zh.wikipedia.org/w/api.php?{query}"
    request = Request(url, headers={"User-Agent": "KSW-METRO-station-audit/1.0 (personal QA audit)"})
    for attempt in range(5):
        try:
            with urlopen(request, timeout=30) as response:
                data = json.loads(response.read().decode("utf-8"))
            break
        except HTTPError as error:
            if error.code != 429 or attempt == 4:
                raise
            time.sleep(10 * (attempt + 1))
    return data["parse"]["title"], data["parse"]["text"]


def flatten_column(column) -> str:
    if isinstance(column, tuple):
        parts = [str(x).strip() for x in column if str(x).strip() and not str(x).startswith("Unnamed")]
        return " / ".join(dict.fromkeys(parts))
    return str(column).strip()


def main() -> None:
    manifest = []
    output_dir = ROOT / "zhwiki-tables"
    output_dir.mkdir(exist_ok=True)
    for line_id, requested_page in PAGES.items():
        title, html = get_page_html(requested_page)
        tables = pd.read_html(StringIO(html))
        selected = []
        for index, table in enumerate(tables):
            table.columns = [flatten_column(col) for col in table.columns]
            columns = "|".join(table.columns)
            if "車站編號" not in columns or ("中文站名" not in columns and "韓文站名" not in columns):
                continue
            file_name = f"{line_id}-{index}.csv"
            table.to_csv(output_dir / file_name, index=False, encoding="utf-8-sig")
            selected.append({"tableIndex": index, "file": file_name, "rows": len(table), "columns": list(table.columns)})
        manifest.append({
            "lineId": line_id,
            "requestedPage": requested_page,
            "resolvedTitle": title,
            "url": "https://zh.wikipedia.org/wiki/" + title.replace(" ", "_"),
            "selectedTables": selected,
        })
        print(line_id, title, sum(x["rows"] for x in selected), len(selected))
        time.sleep(3)
    (ROOT / "zhwiki-manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")


if __name__ == "__main__":
    main()
