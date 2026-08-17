# KSW-METRO 站名資料核對報告

## 核對總覽
- 總資料列：665（首爾 507、釜山 158）
- 去重後實體站：579（首爾 434、釜山 145；以城市＋程式內 stationKey 去重）
- 已核對資料列：665
- 三語皆與可取得官方欄位相符：506
- 有問題或需人工決策的資料列：136
- 找不到官方繁體中文欄位：47
- 核對日期：2026-08-12

> 判讀原則：韓文與官方英文以營運單位／KRIC 為主。中文沒有全國一致的正式繁中標準，KRIC 繁中欄可作權威對照，但不會把簡繁字形或台灣用語差異直接判成錯誤。

## 主要參考來源
- [首爾交通公社多語站名（2026-03-26）](https://www.data.go.kr/data/15044232/fileData.do)
- [釜山交通公社都市鐵道站名（2025-10-31）](https://www.data.go.kr/data/3077187/fileData.do)
- [KRIC 首都圈 1 號線多語站名](https://www.data.go.kr/data/15064037/fileData.do)（同系列逐線核對 1–9 號線）
- [KRIC 釜山 1 號線多語站名](https://www.data.go.kr/data/15064687/fileData.do)（同系列逐線核對 1–4 號線）
- [KRIC 牛耳新設線](https://www.data.go.kr/data/15041029/fileData.do)、[A'REX](https://www.data.go.kr/data/15041034/fileData.do)、[新盆唐線](https://www.data.go.kr/data/15041033/fileData.do)、[釜山－金海輕軌](https://www.data.go.kr/data/15041041/fileData.do)、[東海線](https://www.data.go.kr/data/15064706/fileData.do)
- [國立國語院：2000 年修訂羅馬字沿革](https://www.korean.go.kr/niklintro2/20years05_01_03.jsp)
- [釜山－金海輕軌官方：站號基準為 101–121](https://www.bglrt.com/00028/00031/00042.web?amode=view&cpage=103&gcode=1008&idx=8884&serchtype=field)

## 問題清單
| 站號 | 路線 | 目前中文 | 目前韓文 | 目前英文 | 問題描述 | 建議修正 | 參考來源 | 信心程度 |
|---|---|---|---|---|---|---|---|---|
| 109 | 首爾 1 號線 | 可能 | 가능 | Ganeung | 目前中文與 KRIC／營運單位多語清單不一致 | 官方對照為「佳陵」；採用前需依繁體中文與台灣用語政策人工確認 | [KRIC capital line 1](https://www.data.go.kr/data/15064037/fileData.do) | 高 |
| 119 | 首爾 1 號線 | 光雲大 | 광운대 | Gwangundae | 目前英文與官方英文站名不一致（多數是把發音羅馬字放進英文欄） | 英文改為「Kwangwoon Univ.」，或拆成 officialEnglish／romanized 兩欄 | [KRIC capital line 1](https://www.data.go.kr/data/15064037/fileData.do) | 中 |
| 122 | 首爾 1 號線 | 外大前 | 외대앞 | Oedaeap | 目前英文與官方英文站名不一致（多數是把發音羅馬字放進英文欄）；目前中文與 KRIC／營運單位多語清單不一致 | 英文改為「Hankuk Univ. of Foreign Studies」，或拆成 officialEnglish／romanized 兩欄；官方對照為「外大앞」；採用前需依繁體中文與台灣用語政策人工確認 | [KRIC capital line 1](https://www.data.go.kr/data/15064037/fileData.do) | 中 |
| 127 | 首爾 1 號線 | 東廟前 | 동묘앞 | Dongmyoap | 目前英文與官方英文站名不一致（多數是把發音羅馬字放進英文欄）；目前中文與 KRIC／營運單位多語清單不一致 | 英文改為「Dongmyo」，或拆成 officialEnglish／romanized 兩欄；官方對照為「东庙」；採用前需依繁體中文與台灣用語政策人工確認 | [Seoul Metro multilingual 2026-03-26](https://www.data.go.kr/data/15044232/fileData.do) | 中 |
| 129 | 首爾 1 號線 | 鐘路5街 | 종로5가 | Jongno 5-ga | 目前中文與 KRIC／營運單位多語清單不一致 | 官方對照為「钟路五街」；採用前需依繁體中文與台灣用語政策人工確認 | [Seoul Metro multilingual 2026-03-26](https://www.data.go.kr/data/15044232/fileData.do) | 中 |
| 130 | 首爾 1 號線 | 鐘路3街 | 종로3가 | Jongno 3-ga | 目前中文與 KRIC／營運單位多語清單不一致 | 官方對照為「钟路三街」；採用前需依繁體中文與台灣用語政策人工確認 | [Seoul Metro multilingual 2026-03-26](https://www.data.go.kr/data/15044232/fileData.do) | 中 |
| 132 | 首爾 1 號線 | 市廳 | 시청 | Sicheong | 目前英文與官方英文站名不一致（多數是把發音羅馬字放進英文欄） | 英文改為「City Hall」，或拆成 officialEnglish／romanized 兩欄 | [Seoul Metro multilingual 2026-03-26](https://www.data.go.kr/data/15044232/fileData.do) | 中 |
| 133 | 首爾 1 號線 | 首爾站 | 서울역 | Seoullyeok | 目前英文與官方英文站名不一致（多數是把發音羅馬字放進英文欄） | 英文改為「Seoul Station」，或拆成 officialEnglish／romanized 兩欄 | [Seoul Metro multilingual 2026-03-26](https://www.data.go.kr/data/15044232/fileData.do) | 中 |
| 201 | 首爾 2 號線 | 市廳 | 시청 | Sicheong | 目前英文與官方英文站名不一致（多數是把發音羅馬字放進英文欄） | 英文改為「City Hall」，或拆成 officialEnglish／romanized 兩欄 | [Seoul Metro multilingual 2026-03-26](https://www.data.go.kr/data/15044232/fileData.do) | 中 |
| 202 | 首爾 2 號線 | 乙支路入口 | 을지로입구 | Euljiroipgu | 目前英文與官方英文站名不一致（多數是把發音羅馬字放進英文欄） | 英文改為「Euljiro 1(il)ga」，或拆成 officialEnglish／romanized 兩欄 | [Seoul Metro multilingual 2026-03-26](https://www.data.go.kr/data/15044232/fileData.do) | 中 |
| 205 | 首爾 2 號線 | 東大門歷史文化公園 | 동대문역사문화공원 | Dongdaemun Yeoksa Munhwa Gongwon | 目前英文與官方英文站名不一致（多數是把發音羅馬字放進英文欄） | 英文改為「Dongdaemun History & Culture Park(DDP)」，或拆成 officialEnglish／romanized 兩欄 | [Seoul Metro multilingual 2026-03-26](https://www.data.go.kr/data/15044232/fileData.do) | 中 |
| 209 | 首爾 2 號線 | 漢陽大 | 한양대 | Hanyangdae | 目前英文與官方英文站名不一致（多數是把發音羅馬字放進英文欄） | 英文改為「Hanyang Univ.」，或拆成 officialEnglish／romanized 兩欄 | [Seoul Metro multilingual 2026-03-26](https://www.data.go.kr/data/15044232/fileData.do) | 中 |
| 212 | 首爾 2 號線 | 建大入口 | 건대입구 | Geondaeipgu | 目前英文與官方英文站名不一致（多數是把發音羅馬字放進英文欄） | 英文改為「Konkuk Univ.」，或拆成 officialEnglish／romanized 兩欄 | [Seoul Metro multilingual 2026-03-26](https://www.data.go.kr/data/15044232/fileData.do) | 中 |
| 218 | 首爾 2 號線 | 綜合運動場 | 종합운동장 | Jonghap Undongjang | 目前英文與官方英文站名不一致（多數是把發音羅馬字放進英文欄） | 英文改為「Sports Complex」，或拆成 officialEnglish／romanized 兩欄 | [Seoul Metro multilingual 2026-03-26](https://www.data.go.kr/data/15044232/fileData.do) | 中 |
| 223 | 首爾 2 號線 | 教大 | 교대 | Gyodae | 目前英文與官方英文站名不一致（多數是把發音羅馬字放進英文欄）；目前中文與 KRIC／營運單位多語清單不一致 | 英文改為「Seoul Nat'l Univ. of Education(Court & Prosecutors’ Office)」，或拆成 officialEnglish／romanized 兩欄；官方對照為「首尔教育大学(法院·检察厅)」；採用前需依繁體中文與台灣用語政策人工確認 | [Seoul Metro multilingual 2026-03-26](https://www.data.go.kr/data/15044232/fileData.do) | 中 |
| 228 | 首爾 2 號線 | 首爾大入口 | 서울대입구 | Seouldaeipgu | 目前英文與官方英文站名不一致（多數是把發音羅馬字放進英文欄）；目前中文與 KRIC／營運單位多語清單不一致 | 英文改為「Seoul Nat‘l Univ. (Gwanakgu Office)」，或拆成 officialEnglish／romanized 兩欄；官方對照為「首尔大学(冠岳区厅)」；採用前需依繁體中文與台灣用語政策人工確認 | [Seoul Metro multilingual 2026-03-26](https://www.data.go.kr/data/15044232/fileData.do) | 中 |
| 232 | 首爾 2 號線 | 九老數碼園區 | 구로디지털단지 | Guro Digital Danji | 目前英文與官方英文站名不一致（多數是把發音羅馬字放進英文欄） | 英文改為「Guro Digital Complex」，或拆成 officialEnglish／romanized 兩欄 | [Seoul Metro multilingual 2026-03-26](https://www.data.go.kr/data/15044232/fileData.do) | 中 |
| 236 | 首爾 2 號線 | 永登浦區廳 | 영등포구청 | Yeongdeungpo Gucheong | 目前英文與官方英文站名不一致（多數是把發音羅馬字放進英文欄） | 英文改為「Yeongdeungpogu Office」，或拆成 officialEnglish／romanized 兩欄 | [Seoul Metro multilingual 2026-03-26](https://www.data.go.kr/data/15044232/fileData.do) | 中 |
| 239 | 首爾 2 號線 | 弘大入口 | 홍대입구 | Hongdaeipgu | 目前英文與官方英文站名不一致（多數是把發音羅馬字放進英文欄） | 英文改為「Hongik Univ.」，或拆成 officialEnglish／romanized 兩欄 | [Seoul Metro multilingual 2026-03-26](https://www.data.go.kr/data/15044232/fileData.do) | 中 |
| 241 | 首爾 2 號線 | 梨大 | 이대 | Idae | 目前英文與官方英文站名不一致（多數是把發音羅馬字放進英文欄） | 英文改為「Ewha Womans Univ.」，或拆成 officialEnglish／romanized 兩欄 | [Seoul Metro multilingual 2026-03-26](https://www.data.go.kr/data/15044232/fileData.do) | 中 |
| 329 | 首爾 3 號線 | 鐘路3街 | 종로3가 | Jongno 3-ga | 目前中文與 KRIC／營運單位多語清單不一致 | 官方對照為「钟路三街」；採用前需依繁體中文與台灣用語政策人工確認 | [Seoul Metro multilingual 2026-03-26](https://www.data.go.kr/data/15044232/fileData.do) | 中 |
| 332 | 首爾 3 號線 | 東大入口 | 동대입구 | Dongdaeipgu | 目前英文與官方英文站名不一致（多數是把發音羅馬字放進英文欄） | 英文改為「Dongguk Univ.」，或拆成 officialEnglish／romanized 兩欄 | [Seoul Metro multilingual 2026-03-26](https://www.data.go.kr/data/15044232/fileData.do) | 中 |
| 339 | 首爾 3 號線 | 高速巴士客運站 | 고속터미널 | Gosok Teomineol | 目前英文與官方英文站名不一致（多數是把發音羅馬字放進英文欄） | 英文改為「Express Bus Terminal」，或拆成 officialEnglish／romanized 兩欄 | [Seoul Metro multilingual 2026-03-26](https://www.data.go.kr/data/15044232/fileData.do) | 中 |
| 340 | 首爾 3 號線 | 教大 | 교대 | Gyodae | 目前英文與官方英文站名不一致（多數是把發音羅馬字放進英文欄）；目前中文與 KRIC／營運單位多語清單不一致 | 英文改為「Seoul Nat'l Univ. of Education(Court & Prosecutors’ Office)」，或拆成 officialEnglish／romanized 兩欄；官方對照為「首尔教育大学(法院·检察厅)」；採用前需依繁體中文與台灣用語政策人工確認 | [Seoul Metro multilingual 2026-03-26](https://www.data.go.kr/data/15044232/fileData.do) | 中 |
| 341 | 首爾 3 號線 | 南部巴士客運站 | 남부터미널 | Nambu Teomineol | 目前英文與官方英文站名不一致（多數是把發音羅馬字放進英文欄）；目前中文與 KRIC／營運單位多語清單不一致 | 英文改為「Nambu Bus Terminal (Seoul Arts Center)」，或拆成 officialEnglish／romanized 兩欄；官方對照為「南部客运站(艺术殿堂)」；採用前需依繁體中文與台灣用語政策人工確認 | [Seoul Metro multilingual 2026-03-26](https://www.data.go.kr/data/15044232/fileData.do) | 中 |
| 343 | 首爾 3 號線 | 鷹峰 | 매봉 | Maebong | 目前中文與 KRIC／營運單位多語清單不一致 | 官方對照為「梅峰」；採用前需依繁體中文與台灣用語政策人工確認 | [Seoul Metro multilingual 2026-03-26](https://www.data.go.kr/data/15044232/fileData.do) | 高 |
| 350 | 首爾 3 號線 | 可樂市場 | 가락시장 | Garaksijang | 目前英文與官方英文站名不一致（多數是把發音羅馬字放進英文欄） | 英文改為「Garak Market」，或拆成 officialEnglish／romanized 兩欄 | [Seoul Metro multilingual 2026-03-26](https://www.data.go.kr/data/15044232/fileData.do) | 中 |
| 351 | 首爾 3 號線 | 警察醫院 | 경찰병원 | Gyeongchal Byeongwon | 目前英文與官方英文站名不一致（多數是把發音羅馬字放進英文欄） | 英文改為「National Police Hospital」，或拆成 officialEnglish／romanized 兩欄 | [Seoul Metro multilingual 2026-03-26](https://www.data.go.kr/data/15044232/fileData.do) | 中 |
| 408 | 首爾 4 號線 | 別內別加藍 | 별내별가람 | ByeollaeByeolgaram | 目前中文與 KRIC／營運單位多語清單不一致 | 官方對照為「別內星江」；採用前需依繁體中文與台灣用語政策人工確認 | [KRIC capital line 4](https://www.data.go.kr/data/15064041/fileData.do) | 高 |
| 418 | 首爾 4 號線 | 誠信女大入口 | 성신여대입구 | Seongsinyeodae Ipgu | 目前英文與官方英文站名不一致（多數是把發音羅馬字放進英文欄） | 英文改為「Sungshin Women's Univ. (Donam)」，或拆成 officialEnglish／romanized 兩欄 | [Seoul Metro multilingual 2026-03-26](https://www.data.go.kr/data/15044232/fileData.do) | 中 |
| 419 | 首爾 4 號線 | 漢城大入口 | 한성대입구 | Hanseongdaeipgu | 目前英文與官方英文站名不一致（多數是把發音羅馬字放進英文欄） | 英文改為「Hansung Univ. (Samseongyo)」，或拆成 officialEnglish／romanized 兩欄 | [Seoul Metro multilingual 2026-03-26](https://www.data.go.kr/data/15044232/fileData.do) | 中 |
| 422 | 首爾 4 號線 | 東大門歷史文化公園 | 동대문역사문화공원 | Dongdaemun Yeoksa Munhwa Gongwon | 目前英文與官方英文站名不一致（多數是把發音羅馬字放進英文欄） | 英文改為「Dongdaemun History & Culture Park(DDP)」，或拆成 officialEnglish／romanized 兩欄 | [Seoul Metro multilingual 2026-03-26](https://www.data.go.kr/data/15044232/fileData.do) | 中 |
| 426 | 首爾 4 號線 | 首爾站 | 서울역 | Seoullyeok | 目前英文與官方英文站名不一致（多數是把發音羅馬字放進英文欄） | 英文改為「Seoul Station」，或拆成 officialEnglish／romanized 兩欄 | [Seoul Metro multilingual 2026-03-26](https://www.data.go.kr/data/15044232/fileData.do) | 中 |
| 427 | 首爾 4 號線 | 淑大入口 | 숙대입구 | Sukdaeipgu | 目前英文與官方英文站名不一致（多數是把發音羅馬字放進英文欄） | 英文改為「Sookmyung Women's Univ. (Seoul Metropolitan Office of Education)」，或拆成 officialEnglish／romanized 兩欄 | [Seoul Metro multilingual 2026-03-26](https://www.data.go.kr/data/15044232/fileData.do) | 中 |
| 432 | 首爾 4 號線 | 總神大入口 | 총신대입구 | Chongsindaeipgu | 目前英文與官方英文站名不一致（多數是把發音羅馬字放進英文欄） | 英文改為「Chongshin Univ. (Isu)」，或拆成 officialEnglish／romanized 兩欄 | [Seoul Metro multilingual 2026-03-26](https://www.data.go.kr/data/15044232/fileData.do) | 中 |
| 436 | 首爾 4 號線 | 賽馬公園 | 경마공원 | Gyeongmagongwon | 目前英文與官方英文站名不一致（多數是把發音羅馬字放進英文欄）；目前中文與 KRIC／營運單位多語清單不一致 | 英文改為「Seoul Racecourse Park」，或拆成 officialEnglish／romanized 兩欄；官方對照為「競馬公園」；採用前需依繁體中文與台灣用語政策人工確認 | [KRIC capital line 4](https://www.data.go.kr/data/15064041/fileData.do) | 高 |
| 437 | 首爾 4 號線 | 大公園 | 대공원 | Daegongwon | 目前英文與官方英文站名不一致（多數是把發音羅馬字放進英文欄） | 英文改為「Seoul Grand Park Station」，或拆成 officialEnglish／romanized 兩欄 | [KRIC capital line 4](https://www.data.go.kr/data/15064041/fileData.do) | 中 |
| 439 | 首爾 4 號線 | 政府果川廳舍 | 정부과천청사 | Jeongbu Gwacheon Cheongsa | 目前英文與官方英文站名不一致（多數是把發音羅馬字放進英文欄） | 英文改為「Government Complex Gwacheon」，或拆成 officialEnglish／romanized 兩欄 | [KRIC capital line 4](https://www.data.go.kr/data/15064041/fileData.do) | 中 |
| 449 | 首爾 4 號線 | 漢大前 | 한대앞 | Hanyang Univ. at Ansan | 目前中文與 KRIC／營運單位多語清單不一致 | 官方對照為「漢大앞」；採用前需依繁體中文與台灣用語政策人工確認 | [KRIC capital line 4](https://www.data.go.kr/data/15064041/fileData.do) | 中 |
| 512 | 首爾 5 號線 | 金浦機場 | 김포공항 | Gimpogonghang | 目前英文與官方英文站名不一致（多數是把發音羅馬字放進英文欄） | 英文改為「Gimpo Int'l Airport」，或拆成 officialEnglish／romanized 兩欄 | [Seoul Metro multilingual 2026-03-26](https://www.data.go.kr/data/15044232/fileData.do) | 中 |
| 523 | 首爾 5 號線 | 永登浦區廳 | 영등포구청 | Yeongdeungpo Gucheong | 目前英文與官方英文站名不一致（多數是把發音羅馬字放進英文欄） | 英文改為「Yeongdeungpogu Office」，或拆成 officialEnglish／romanized 兩欄 | [Seoul Metro multilingual 2026-03-26](https://www.data.go.kr/data/15044232/fileData.do) | 中 |
| 524 | 首爾 5 號線 | 永登浦市場 | 영등포시장 | Yeongdeungpo Sijang | 目前英文與官方英文站名不一致（多數是把發音羅馬字放進英文欄） | 英文改為「Yeongdeungpo Market」，或拆成 officialEnglish／romanized 兩欄 | [Seoul Metro multilingual 2026-03-26](https://www.data.go.kr/data/15044232/fileData.do) | 中 |
| 530 | 首爾 5 號線 | 艾峴 | 애오개 | Aeogae | 目前中文與 KRIC／營運單位多語清單不一致 | 官方對照為「儿岭」；採用前需依繁體中文與台灣用語政策人工確認 | [Seoul Metro multilingual 2026-03-26](https://www.data.go.kr/data/15044232/fileData.do) | 高 |
| 534 | 首爾 5 號線 | 鐘路3街 | 종로3가 | Jongno 3-ga | 目前中文與 KRIC／營運單位多語清單不一致 | 官方對照為「钟路三街(塔谷公园)」；採用前需依繁體中文與台灣用語政策人工確認 | [Seoul Metro multilingual 2026-03-26](https://www.data.go.kr/data/15044232/fileData.do) | 中 |
| 535 | 首爾 5 號線 | 乙支路4街 | 을지로4가 | Euljiro 4-ga | 目前中文與 KRIC／營運單位多語清單不一致 | 官方對照為「乙支路四街」；採用前需依繁體中文與台灣用語政策人工確認 | [Seoul Metro multilingual 2026-03-26](https://www.data.go.kr/data/15044232/fileData.do) | 中 |
| 536 | 首爾 5 號線 | 東大門歷史文化公園 | 동대문역사문화공원 | Dongdaemun Yeoksa Munhwa Gongwon | 目前英文與官方英文站名不一致（多數是把發音羅馬字放進英文欄） | 英文改為「Dongdaemun History & Culture Park(DDP)」，或拆成 officialEnglish／romanized 兩欄 | [Seoul Metro multilingual 2026-03-26](https://www.data.go.kr/data/15044232/fileData.do) | 中 |
| 613 | 首爾 6 號線 | 獨岩 | 독바위 | Dokbawi | 目前中文與 KRIC／營運單位多語清單不一致 | 官方對照為「瓮岩」；採用前需依繁體中文與台灣用語政策人工確認 | [Seoul Metro multilingual 2026-03-26](https://www.data.go.kr/data/15044232/fileData.do) | 高 |
| 616 | 首爾 6 號線 | 新寺 | 새절 | Saejeol | 目前中文與 KRIC／營運單位多語清單不一致 | 官方對照為「赛折(新寺)」；採用前需依繁體中文與台灣用語政策人工確認 | [Seoul Metro multilingual 2026-03-26](https://www.data.go.kr/data/15044232/fileData.do) | 中 |
| 619 | 首爾 6 號線 | 世界盃體育場 | 월드컵경기장 | World Cup Gyeonggijang | 目前英文與官方英文站名不一致（多數是把發音羅馬字放進英文欄） | 英文改為「World Cup Stadium(Seongsan)」，或拆成 officialEnglish／romanized 兩欄 | [Seoul Metro multilingual 2026-03-26](https://www.data.go.kr/data/15044232/fileData.do) | 中 |
| 620 | 首爾 6 號線 | 麻浦區廳 | 마포구청 | Mapogucheong | 目前英文與官方英文站名不一致（多數是把發音羅馬字放進英文欄） | 英文改為「Mapogu Office」，或拆成 officialEnglish／romanized 兩欄 | [Seoul Metro multilingual 2026-03-26](https://www.data.go.kr/data/15044232/fileData.do) | 中 |
| 627 | 首爾 6 號線 | 孝昌公園前 | 효창공원앞 | Hyochanggongwonap | 目前英文與官方英文站名不一致（多數是把發音羅馬字放進英文欄）；目前中文與 KRIC／營運單位多語清單不一致 | 英文改為「Hyochang Park」，或拆成 officialEnglish／romanized 兩欄；官方對照為「孝昌公园」；採用前需依繁體中文與台灣用語政策人工確認 | [Seoul Metro multilingual 2026-03-26](https://www.data.go.kr/data/15044232/fileData.do) | 中 |
| 632 | 首爾 6 號線 | 버티嶺 | 버티고개 | Beotigogae | 目前中文與 KRIC／營運單位多語清單不一致 | 官方對照為「波堤岭」；採用前需依繁體中文與台灣用語政策人工確認 | [Seoul Metro multilingual 2026-03-26](https://www.data.go.kr/data/15044232/fileData.do) | 高 |
| 636 | 首爾 6 號線 | 東廟前 | 동묘앞 | Dongmyoap | 目前英文與官方英文站名不一致（多數是把發音羅馬字放進英文欄）；目前中文與 KRIC／營運單位多語清單不一致 | 英文改為「Dongmyo」，或拆成 officialEnglish／romanized 兩欄；官方對照為「东庙」；採用前需依繁體中文與台灣用語政策人工確認 | [Seoul Metro multilingual 2026-03-26](https://www.data.go.kr/data/15044232/fileData.do) | 中 |
| 640 | 首爾 6 號線 | 高麗大 | 고려대 | Goryeodae | 目前英文與官方英文站名不一致（多數是把發音羅馬字放進英文欄） | 英文改為「Korea Univ.(Jongam)」，或拆成 officialEnglish／romanized 兩欄 | [Seoul Metro multilingual 2026-03-26](https://www.data.go.kr/data/15044232/fileData.do) | 中 |
| 645 | 首爾 6 號線 | 泰陵入口 | 태릉입구 | Taereungipgu | 目前英文與官方英文站名不一致（多數是把發音羅馬字放進英文欄） | 英文改為「Taereung」，或拆成 officialEnglish／romanized 兩欄 | [Seoul Metro multilingual 2026-03-26](https://www.data.go.kr/data/15044232/fileData.do) | 中 |
| 646 | 首爾 6 號線 | 花郎臺 | 화랑대 | Hwarangdae | 目前中文與 KRIC／營運單位多語清單不一致 | 官方對照為「花郞台(首尔女子大学)」；採用前需依繁體中文與台灣用語政策人工確認 | [Seoul Metro multilingual 2026-03-26](https://www.data.go.kr/data/15044232/fileData.do) | 中 |
| 712 | 首爾 7 號線 | 馬野 | 마들 | Madeul | 目前中文與 KRIC／營運單位多語清單不一致 | 官方對照為「马得」；採用前需依繁體中文與台灣用語政策人工確認 | [Seoul Metro multilingual 2026-03-26](https://www.data.go.kr/data/15044232/fileData.do) | 高 |
| 717 | 首爾 7 號線 | 泰陵入口 | 태릉입구 | Taereungipgu | 目前英文與官方英文站名不一致（多數是把發音羅馬字放進英文欄） | 英文改為「Taereung」，或拆成 officialEnglish／romanized 兩欄 | [Seoul Metro multilingual 2026-03-26](https://www.data.go.kr/data/15044232/fileData.do) | 中 |
| 726 | 首爾 7 號線 | 兒童大公園 | 어린이대공원 | Eorini Daegongwon | 目前英文與官方英文站名不一致（多數是把發音羅馬字放進英文欄） | 英文改為「Children's Grand Park(Sejong Univ.)」，或拆成 officialEnglish／romanized 兩欄 | [Seoul Metro multilingual 2026-03-26](https://www.data.go.kr/data/15044232/fileData.do) | 中 |
| 727 | 首爾 7 號線 | 建大入口 | 건대입구 | Geondaeipgu | 目前英文與官方英文站名不一致（多數是把發音羅馬字放進英文欄）；目前中文與 KRIC／營運單位多語清單不一致 | 英文改為「Konkuk Univ.」，或拆成 officialEnglish／romanized 兩欄；官方對照為「建国大学」；採用前需依繁體中文與台灣用語政策人工確認 | [Seoul Metro multilingual 2026-03-26](https://www.data.go.kr/data/15044232/fileData.do) | 中 |
| 730 | 首爾 7 號線 | 江南區廳 | 강남구청 | Gangnamgucheong | 目前英文與官方英文站名不一致（多數是把發音羅馬字放進英文欄） | 英文改為「Gangnamgu Office」，或拆成 officialEnglish／romanized 兩欄 | [Seoul Metro multilingual 2026-03-26](https://www.data.go.kr/data/15044232/fileData.do) | 中 |
| 734 | 首爾 7 號線 | 高速巴士客運站 | 고속터미널 | Gosok Teomineol | 目前英文與官方英文站名不一致（多數是把發音羅馬字放進英文欄） | 英文改為「Express Bus Terminal」，或拆成 officialEnglish／romanized 兩欄 | [Seoul Metro multilingual 2026-03-26](https://www.data.go.kr/data/15044232/fileData.do) | 中 |
| 738 | 首爾 7 號線 | 崇實大入口 | 숭실대입구 | Sungsildaeipgu | 目前英文與官方英文站名不一致（多數是把發音羅馬字放進英文欄） | 英文改為「Soongsil Univ.(Salpijae)」，或拆成 officialEnglish／romanized 兩欄 | [Seoul Metro multilingual 2026-03-26](https://www.data.go.kr/data/15044232/fileData.do) | 中 |
| 740 | 首爾 7 號線 | 長丞 | 장승배기 | Jangseungbaegi | 目前中文與 KRIC／營運單位多語清單不一致 | 官方對照為「长丞拜基」；採用前需依繁體中文與台灣用語政策人工確認 | [Seoul Metro multilingual 2026-03-26](https://www.data.go.kr/data/15044232/fileData.do) | 高 |
| 741 | 首爾 7 號線 | 新大方三岔路口 | 신대방삼거리 | Sindaebangsamgeori | 目前中文與 KRIC／營運單位多語清單不一致 | 官方對照為「新大方丁字路口」；採用前需依繁體中文與台灣用語政策人工確認 | [Seoul Metro multilingual 2026-03-26](https://www.data.go.kr/data/15044232/fileData.do) | 中 |
| 746 | 首爾 7 號線 | 加山數碼園區 | 가산디지털단지 | Gasan Digital Danji | 目前英文與官方英文站名不一致（多數是把發音羅馬字放進英文欄） | 英文改為「Gasan Digital Complex」，或拆成 officialEnglish／romanized 兩欄 | [Seoul Metro multilingual 2026-03-26](https://www.data.go.kr/data/15044232/fileData.do) | 中 |
| 752 | 首爾 7 號線 | 富川綜合運動場 | 부천종합운동장 | Bucheon Jonghap Undongjang | 目前英文與官方英文站名不一致（多數是把發音羅馬字放進英文欄） | 英文改為「Bucheon Stadium」，或拆成 officialEnglish／romanized 兩欄 | [KRIC capital line 7](https://www.data.go.kr/data/15064046/fileData.do) | 中 |
| 755 | 首爾 7 號線 | 富川市廳 | 부천시청 | Bucheonsicheong | 目前英文與官方英文站名不一致（多數是把發音羅馬字放進英文欄） | 英文改為「Bucheon City Hall」，或拆成 officialEnglish／romanized 兩欄 | [KRIC capital line 7](https://www.data.go.kr/data/15064046/fileData.do) | 中 |
| 761 | 首爾 7 號線 | 石南 | 석남 | Seongnam | 目前英文與官方英文站名不一致（多數是把發音羅馬字放進英文欄） | 英文改為「Seongnam (Geobuk Market)」，或拆成 officialEnglish／romanized 兩欄 | [KRIC capital line 7](https://www.data.go.kr/data/15064046/fileData.do) | 中 |
| 823 | 首爾 8 號線 | 南漢山城入口 | 남한산성입구 | Namhansanseong Ipgu | 目前英文與官方英文站名不一致（多數是把發音羅馬字放進英文欄） | 英文改為「Namhansanseong(Seongnam Court & Prosecutors' Office)」，或拆成 officialEnglish／romanized 兩欄 | [Seoul Metro multilingual 2026-03-26](https://www.data.go.kr/data/15044232/fileData.do) | 中 |
| 902 | 首爾 9 號線 | 金浦機場 | 김포공항 | Gimpogonghang | 目前英文與官方英文站名不一致（多數是把發音羅馬字放進英文欄） | 英文改為「Gimpo Int'l Airport」，或拆成 officialEnglish／romanized 兩欄 | [KRIC capital line 9](https://www.data.go.kr/data/15064049/fileData.do) | 中 |
| 903 | 首爾 9 號線 | 機場市場 | 공항시장 | Gonghangsijang | 目前英文與官方英文站名不一致（多數是把發音羅馬字放進英文欄） | 英文改為「Airport Market」，或拆成 officialEnglish／romanized 兩欄 | [KRIC capital line 9](https://www.data.go.kr/data/15064049/fileData.do) | 中 |
| 904 | 首爾 9 號線 | 新傍花 | 신방화 | Sinbanghwa | 目前中文與 KRIC／營運單位多語清單不一致 | 官方對照為「新芳華站」；採用前需依繁體中文與台灣用語政策人工確認 | [KRIC capital line 9](https://www.data.go.kr/data/15064049/fileData.do) | 中 |
| 905 | 首爾 9 號線 | 麻谷渡口 | 마곡나루 | Magongnaru | 目前中文與 KRIC／營運單位多語清單不一致 | 官方對照為「麻谷나루」；採用前需依繁體中文與台灣用語政策人工確認 | [KRIC capital line 9](https://www.data.go.kr/data/15064049/fileData.do) | 中 |
| 914 | 首爾 9 號線 | 國會議事堂 | 국회의사당 | Gukhoeuisadang | 目前英文與官方英文站名不一致（多數是把發音羅馬字放進英文欄） | 英文改為「National Assembly」，或拆成 officialEnglish／romanized 兩欄 | [KRIC capital line 9](https://www.data.go.kr/data/15064049/fileData.do) | 中 |
| 923 | 首爾 9 號線 | 高速巴士客運站 | 고속터미널 | Gosok Teomineol | 目前英文與官方英文站名不一致（多數是把發音羅馬字放進英文欄）；目前中文與 KRIC／營運單位多語清單不一致 | 英文改為「Express Bus Terminal」，或拆成 officialEnglish／romanized 兩欄；官方對照為「高速터미널」；採用前需依繁體中文與台灣用語政策人工確認 | [KRIC capital line 9](https://www.data.go.kr/data/15064049/fileData.do) | 中 |
| 930 | 首爾 9 號線 | 綜合運動場 | 종합운동장 | Jonghap Undongjang | 目前英文與官方英文站名不一致（多數是把發音羅馬字放進英文欄） | 英文改為「Sports Complex」，或拆成 officialEnglish／romanized 兩欄 | [Seoul Metro multilingual 2026-03-26](https://www.data.go.kr/data/15044232/fileData.do) | 中 |
| 936 | 首爾 9 號線 | 奧林匹克公園 | 올림픽공원 | Ollimpik Gongwon | 目前英文與官方英文站名不一致（多數是把發音羅馬字放進英文欄） | 英文改為「Olympic Park(Korea National Sport University)」，或拆成 officialEnglish／romanized 兩欄 | [Seoul Metro multilingual 2026-03-26](https://www.data.go.kr/data/15044232/fileData.do) | 中 |
| 938 | 首爾 9 號線 | 中央報勳醫院 | 중앙보훈병원 | Jungang Bohun Byeongwon | 目前英文與官方英文站名不一致（多數是把發音羅馬字放進英文欄） | 英文改為「VHS Medical Center」，或拆成 officialEnglish／romanized 兩欄 | [Seoul Metro multilingual 2026-03-26](https://www.data.go.kr/data/15044232/fileData.do) | 中 |
| A01 | 機場鐵路 A'REX | 首爾站 | 서울역 | Seoullyeok | 目前英文與官方英文站名不一致（多數是把發音羅馬字放進英文欄） | 英文改為「Seoul Station」，或拆成 officialEnglish／romanized 兩欄 | [KRIC AREX 2025-06-30](https://www.data.go.kr/data/15041034/fileData.do) | 中 |
| A03 | 機場鐵路 A'REX | 弘大入口 | 홍대입구 | Hongdaeipgu | 目前英文與官方英文站名不一致（多數是把發音羅馬字放進英文欄） | 英文改為「Hongik Univ.」，或拆成 officialEnglish／romanized 兩欄 | [KRIC AREX 2025-06-30](https://www.data.go.kr/data/15041034/fileData.do) | 中 |
| A05 | 機場鐵路 A'REX | 金浦機場 | 김포공항 | Gimpogonghang | 目前英文與官方英文站名不一致（多數是把發音羅馬字放進英文欄） | 英文改為「Gimpo Int'l Airport」，或拆成 officialEnglish／romanized 兩欄 | [KRIC AREX 2025-06-30](https://www.data.go.kr/data/15041034/fileData.do) | 中 |
| A071 | 機場鐵路 A'REX | 靑蘿國際城 | 청라국제도시 | Cheongna Gukje Dosi | 目前英文與官方英文站名不一致（多數是把發音羅馬字放進英文欄）；目前中文與 KRIC／營運單位多語清單不一致 | 英文改為「Cheongna Int'l City」，或拆成 officialEnglish／romanized 兩欄；官方對照為「靑羅國際城」；採用前需依繁體中文與台灣用語政策人工確認 | [KRIC AREX 2025-06-30](https://www.data.go.kr/data/15041034/fileData.do) | 高 |
| A09 | 機場鐵路 A'REX | 機場貨運辦公樓 | 공항화물청사 | Gonghang Hwamul Cheongsa | 目前英文與官方英文站名不一致（多數是把發音羅馬字放進英文欄）；目前中文與 KRIC／營運單位多語清單不一致 | 英文改為「Incheon Int'l Airport Cargo Terminal」，或拆成 officialEnglish／romanized 兩欄；官方對照為「機場貨物辦公樓」；採用前需依繁體中文與台灣用語政策人工確認 | [KRIC AREX 2025-06-30](https://www.data.go.kr/data/15041034/fileData.do) | 中 |
| A10 | 機場鐵路 A'REX | 仁川機場1號航廈 | 인천공항1터미널 | Incheon Gonghang 1 Terminal | 目前英文與官方英文站名不一致（多數是把發音羅馬字放進英文欄）；目前中文與 KRIC／營運單位多語清單不一致 | 英文改為「Incheon Int'l Airport Terminal 1」，或拆成 officialEnglish／romanized 兩欄；官方對照為「仁川國際機場1號航站樓」；採用前需依繁體中文與台灣用語政策人工確認 | [KRIC AREX 2025-06-30](https://www.data.go.kr/data/15041034/fileData.do) | 中 |
| A11 | 機場鐵路 A'REX | 仁川機場2號航廈 | 인천공항2터미널 | Incheon Gonghang 2 Terminal | 目前英文與官方英文站名不一致（多數是把發音羅馬字放進英文欄）；目前中文與 KRIC／營運單位多語清單不一致 | 英文改為「Incheon Int'l Airport Terminal 2」，或拆成 officialEnglish／romanized 兩欄；官方對照為「仁川國際機場2號航站樓」；採用前需依繁體中文與台灣用語政策人工確認 | [KRIC AREX 2025-06-30](https://www.data.go.kr/data/15041034/fileData.do) | 中 |
| D05 | 新盆唐線 | 論峴 | 논현 | Nonhyeon | 目前中文與 KRIC／營運單位多語清單不一致 | 官方對照為「论县」；採用前需依繁體中文與台灣用語政策人工確認 | [KRIC Shinbundang 2025-06-30](https://www.data.go.kr/data/15041033/fileData.do) | 中 |
| D14 | 新盆唐線 | 東川 | 동천 | Dongcheon | 目前中文與 KRIC／營運單位多語清單不一致 | 官方對照為「東川站」；採用前需依繁體中文與台灣用語政策人工確認 | [KRIC Shinbundang 2025-06-30](https://www.data.go.kr/data/15041033/fileData.do) | 中 |
| D15 | 新盆唐線 | 水枝區廳 | 수지구청 | Suji-gu Office | 目前英文與官方英文站名不一致（多數是把發音羅馬字放進英文欄） | 英文改為「Suji-gu offic Station」，或拆成 officialEnglish／romanized 兩欄 | [KRIC Shinbundang 2025-06-30](https://www.data.go.kr/data/15041033/fileData.do) | 中 |
| D18 | 新盆唐線 | 光教中央 | 광교중앙 | Gwanggyo Jungang | 目前中文與 KRIC／營運單位多語清單不一致 | 官方對照為「光敎中央(亞洲大)」；採用前需依繁體中文與台灣用語政策人工確認 | [KRIC Shinbundang 2025-06-30](https://www.data.go.kr/data/15041033/fileData.do) | 中 |
| D19 | 新盆唐線 | 光教 | 광교 | Gwanggyo | 目前中文與 KRIC／營運單位多語清單不一致 | 官方對照為「光敎(京畿大)」；採用前需依繁體中文與台灣用語政策人工確認 | [KRIC Shinbundang 2025-06-30](https://www.data.go.kr/data/15041033/fileData.do) | 中 |
| S111 | 牛耳新設線 | 松林公園 | 솔밭공원 | Solbatgongwon | 目前英文與官方英文站名不一致（多數是把發音羅馬字放進英文欄） | 英文改為「Solbat Park」，或拆成 officialEnglish／romanized 兩欄 | [KRIC Ui-Sinseol 2025-06-30](https://www.data.go.kr/data/15041029/fileData.do) | 中 |
| S112 | 牛耳新設線 | 4·19民主墓地 | 419민주묘지 | Sailgu Minju Myoji | 韓文缺少官方名稱中的句點，英文是自行音譯而非官方英文站名；目前中文與 KRIC／營運單位多語清單不一致 | 韓文改為「4.19민주묘지」，英文改為「April 19th National Cemetery」；官方對照為「四一九民主墓地」；採用前需依繁體中文與台灣用語政策人工確認 | [KRIC Ui-Sinseol 2025-06-30](https://www.data.go.kr/data/15041029/fileData.do) | 高 |
| S118 | 牛耳新設線 | 北漢山輔國門 | 북한산보국문 | Bukhansan Bogungmun | 目前英文與官方英文站名不一致（多數是把發音羅馬字放進英文欄） | 英文改為「Bukhansan Bogungmun (Seokyeong Univ.)」，或拆成 officialEnglish／romanized 兩欄 | [KRIC Ui-Sinseol 2025-06-30](https://www.data.go.kr/data/15041029/fileData.do) | 中 |
| S119 | 牛耳新設線 | 貞陵 | 정릉 | Jeongneung | 目前英文與官方英文站名不一致（多數是把發音羅馬字放進英文欄） | 英文改為「Jeongneung (Kookmin Univ.)」，或拆成 officialEnglish／romanized 兩欄 | [KRIC Ui-Sinseol 2025-06-30](https://www.data.go.kr/data/15041029/fileData.do) | 中 |
| S120 | 牛耳新設線 | 誠信女大入口 | 성신여대입구 | Seongsinyeodae Ipgu | 目前英文與官方英文站名不一致（多數是把發音羅馬字放進英文欄） | 英文改為「Sungshin Women's University」，或拆成 officialEnglish／romanized 兩欄 | [KRIC Ui-Sinseol 2025-06-30](https://www.data.go.kr/data/15041029/fileData.do) | 中 |
| P163 | 首爾 1 號線（仁川／京釜方向） | 西井里 | 서정리 | Seojeongni | 目前英文與官方英文站名不一致（多數是把發音羅馬字放進英文欄） | 英文改為「Seojeong-re Station」，或拆成 officialEnglish／romanized 兩欄 | [KRIC capital line 1](https://www.data.go.kr/data/15064037/fileData.do) | 中 |
| P171 | 首爾 1 號線（仁川／京釜方向） | 雙龍 | 쌍용 | Ssangyong | 目前英文與官方英文站名不一致（多數是把發音羅馬字放進英文欄） | 英文改為「Ssangyong (Korea Nazarene Univ.)」，或拆成 officialEnglish／romanized 兩欄 | [KRIC capital line 1](https://www.data.go.kr/data/15064037/fileData.do) | 中 |
| 234-2 | 首爾 2 號線（新亭支線） | 陽川區廳 | 양천구청 | Yangcheongucheong | 目前英文與官方英文站名不一致（多數是把發音羅馬字放進英文欄） | 英文改為「Yangcheongu Office」，或拆成 officialEnglish／romanized 兩欄 | [Seoul Metro multilingual 2026-03-26](https://www.data.go.kr/data/15044232/fileData.do) | 中 |
| 131 | 釜山 1 號線 | 斗室 | 두실 | Dusil | 目前中文與 KRIC／營運單位多語清單不一致 | 官方對照為「斗實」；採用前需依繁體中文與台灣用語政策人工確認 | [Busan Metro station info 2025-10-31](https://www.data.go.kr/data/3077187/fileData.do) | 中 |
| 124 | 釜山 1 號線 | 教大 | 교대 | Busan Nat’l Univ. of Edu. | 目前中文與 KRIC／營運單位多語清單不一致 | 官方對照為「釜山敎育大學」；採用前需依繁體中文與台灣用語政策人工確認 | [Busan Metro station info 2025-10-31](https://www.data.go.kr/data/3077187/fileData.do) | 中 |
| 115 | 釜山 1 號線 | 釜山鎮 | 부산진 | Busanjin | 目前中文與 KRIC／營運單位多語清單不一致 | 官方對照為「釜山鎭」；採用前需依繁體中文與台灣用語政策人工確認 | [Busan Metro station info 2025-10-31](https://www.data.go.kr/data/3077187/fileData.do) | 中 |
| 100 | 釜山 1 號線 | 東梅 | 동매 | Dongmae | 目前中文與 KRIC／營運單位多語清單不一致 | 官方對照為「東山」；採用前需依繁體中文與台灣用語政策人工確認 | [Busan Metro station info 2025-10-31](https://www.data.go.kr/data/3077187/fileData.do) | 中 |
| 097 | 釜山 1 號線 | 納介 | 낫개 | Natgae | 目前中文與 KRIC／營運單位多語清單不一致 | 官方對照為「羅浦」；採用前需依繁體中文與台灣用語政策人工確認 | [Busan Metro station info 2025-10-31](https://www.data.go.kr/data/3077187/fileData.do) | 中 |
| 241 | 釜山 2 號線 | 釜山大學梁山校區 | 부산대양산캠퍼스 | Pusan Nat’l Univ. Yangsan Campus | 目前中文與 KRIC／營運單位多語清單不一致 | 官方對照為「釜山大學梁山分校」；採用前需依繁體中文與台灣用語政策人工確認 | [Busan Metro station info 2025-10-31](https://www.data.go.kr/data/3077187/fileData.do) | 中 |
| 217 | 釜山 2 號線 | 國際金融中心·釜山銀行 | 국제금융센터·부산은행 | Busan Int’l Finance Center·Busan Bank | 目前中文與 KRIC／營運單位多語清單不一致 | 官方對照為「釜山國際金融中心·釜山銀行」；採用前需依繁體中文與台灣用語政策人工確認 | [Busan Metro station info 2025-10-31](https://www.data.go.kr/data/3077187/fileData.do) | 中 |
| 214 | 釜山 2 號線 | 沒谷 | 못골 | Motgol | 目前中文與 KRIC／營運單位多語清單不一致 | 官方對照為「池谷」；採用前需依繁體中文與台灣用語政策人工確認 | [Busan Metro station info 2025-10-31](https://www.data.go.kr/data/3077187/fileData.do) | 中 |
| 303 | 釜山 3 號線 | 盃山 | 배산 | Baesan | 目前中文與 KRIC／營運單位多語清單不一致 | 官方對照為「杯山」；採用前需依繁體中文與台灣用語政策人工確認 | [Busan Metro station info 2025-10-31](https://www.data.go.kr/data/3077187/fileData.do) | 中 |
| 412 | 釜山 4 號線 | 上盤松 | 윗반송 | Witbansong | 目前中文與 KRIC／營運單位多語清單不一致 | 官方對照為「東釜山大學」；採用前需依繁體中文與台灣用語政策人工確認 | [Busan Metro station info 2025-10-31](https://www.data.go.kr/data/3077187/fileData.do) | 中 |
| 409 | 釜山 4 號線 | 盤如農產物市場 | 반여농산물시장 | Banyeo Agricultural Market | 目前中文與 KRIC／營運單位多語清單不一致 | 官方對照為「盤如農産品市場」；採用前需依繁體中文與台灣用語政策人工確認 | [Busan Metro station info 2025-10-31](https://www.data.go.kr/data/3077187/fileData.do) | 中 |
| 408 | 釜山 4 號線 | 金沙 | 금사 | Geumsa | 目前中文與 KRIC／營運單位多語清單不一致 | 官方對照為「錦絲」；採用前需依繁體中文與台灣用語政策人工確認 | [Busan Metro station info 2025-10-31](https://www.data.go.kr/data/3077187/fileData.do) | 中 |
| 406 | 釜山 4 號線 | 明將 | 명장 | Myeongjang | 目前中文與 KRIC／營運單位多語清單不一致 | 官方對照為「鳴藏」；採用前需依繁體中文與台灣用語政策人工確認 | [Busan Metro station info 2025-10-31](https://www.data.go.kr/data/3077187/fileData.do) | 中 |
| 521 | 釜山－金海輕軌 | 加耶大學 | 가야대 | Kaya Univ. | 金海輕軌整線站號被改成 5xx；官方基準為 121 | 站號改為「121」；若要避免和釜山 1 號線混淆，應用路線徽章／前綴顯示，不要改官方數字 | [KRIC Busan-Gimhae 2025-06-30](https://www.data.go.kr/data/15041041/fileData.do) | 高 |
| 520 | 釜山－金海輕軌 | 長神大學 | 장신대 | Presbyterian Univ. | 金海輕軌整線站號被改成 5xx；官方基準為 120 | 站號改為「120」；若要避免和釜山 1 號線混淆，應用路線徽章／前綴顯示，不要改官方數字 | [KRIC Busan-Gimhae 2025-06-30](https://www.data.go.kr/data/15041041/fileData.do) | 高 |
| 519 | 釜山－金海輕軌 | 蓮池公園 | 연지공원 | Yeonji Park | 金海輕軌整線站號被改成 5xx；官方基準為 119 | 站號改為「119」；若要避免和釜山 1 號線混淆，應用路線徽章／前綴顯示，不要改官方數字 | [KRIC Busan-Gimhae 2025-06-30](https://www.data.go.kr/data/15041041/fileData.do) | 高 |
| 518 | 釜山－金海輕軌 | 博物館 | 박물관 | Museum | 目前英文與官方英文站名不一致（多數是把發音羅馬字放進英文欄）；金海輕軌整線站號被改成 5xx；官方基準為 118 | 英文改為「Gimhae National Museum」，或拆成 officialEnglish／romanized 兩欄；站號改為「118」；若要避免和釜山 1 號線混淆，應用路線徽章／前綴顯示，不要改官方數字 | [KRIC Busan-Gimhae 2025-06-30](https://www.data.go.kr/data/15041041/fileData.do) | 高 |
| 517 | 釜山－金海輕軌 | 首露王陵 | 수로왕릉 | Royal Tomb of King Suro | 金海輕軌整線站號被改成 5xx；官方基準為 117 | 站號改為「117」；若要避免和釜山 1 號線混淆，應用路線徽章／前綴顯示，不要改官方數字 | [KRIC Busan-Gimhae 2025-06-30](https://www.data.go.kr/data/15041041/fileData.do) | 高 |
| 516 | 釜山－金海輕軌 | 鳳凰 | 봉황 | Bonghwang | 金海輕軌整線站號被改成 5xx；官方基準為 116 | 站號改為「116」；若要避免和釜山 1 號線混淆，應用路線徽章／前綴顯示，不要改官方數字 | [KRIC Busan-Gimhae 2025-06-30](https://www.data.go.kr/data/15041041/fileData.do) | 高 |
| 515 | 釜山－金海輕軌 | 府院 | 부원 | Buwon | 金海輕軌整線站號被改成 5xx；官方基準為 115 | 站號改為「115」；若要避免和釜山 1 號線混淆，應用路線徽章／前綴顯示，不要改官方數字 | [KRIC Busan-Gimhae 2025-06-30](https://www.data.go.kr/data/15041041/fileData.do) | 高 |
| 514 | 釜山－金海輕軌 | 金海市廳 | 김해시청 | Gimhae City Hall | 金海輕軌整線站號被改成 5xx；官方基準為 114 | 站號改為「114」；若要避免和釜山 1 號線混淆，應用路線徽章／前綴顯示，不要改官方數字 | [KRIC Busan-Gimhae 2025-06-30](https://www.data.go.kr/data/15041041/fileData.do) | 高 |
| 513 | 釜山－金海輕軌 | 仁濟大學 | 인제대 | Inje Univ. | 金海輕軌整線站號被改成 5xx；官方基準為 113 | 站號改為「113」；若要避免和釜山 1 號線混淆，應用路線徽章／前綴顯示，不要改官方數字 | [KRIC Busan-Gimhae 2025-06-30](https://www.data.go.kr/data/15041041/fileData.do) | 高 |
| 512 | 釜山－金海輕軌 | 金海大學 | 김해대학 | Gimhae College | 金海輕軌整線站號被改成 5xx；官方基準為 112 | 站號改為「112」；若要避免和釜山 1 號線混淆，應用路線徽章／前綴顯示，不要改官方數字 | [KRIC Busan-Gimhae 2025-06-30](https://www.data.go.kr/data/15041041/fileData.do) | 高 |
| 511 | 釜山－金海輕軌 | 池內 | 지내 | Jinae | 金海輕軌整線站號被改成 5xx；官方基準為 111 | 站號改為「111」；若要避免和釜山 1 號線混淆，應用路線徽章／前綴顯示，不要改官方數字 | [KRIC Busan-Gimhae 2025-06-30](https://www.data.go.kr/data/15041041/fileData.do) | 高 |
| 510 | 釜山－金海輕軌 | 佛岩 | 불암 | Buram | 金海輕軌整線站號被改成 5xx；官方基準為 110 | 站號改為「110」；若要避免和釜山 1 號線混淆，應用路線徽章／前綴顯示，不要改官方數字 | [KRIC Busan-Gimhae 2025-06-30](https://www.data.go.kr/data/15041041/fileData.do) | 高 |
| 509 | 釜山－金海輕軌 | 大沙 | 대사 | Daesa | 金海輕軌整線站號被改成 5xx；官方基準為 109 | 站號改為「109」；若要避免和釜山 1 號線混淆，應用路線徽章／前綴顯示，不要改官方數字 | [KRIC Busan-Gimhae 2025-06-30](https://www.data.go.kr/data/15041041/fileData.do) | 高 |
| 508 | 釜山－金海輕軌 | 平江 | 평강 | Pyeonggang | 金海輕軌整線站號被改成 5xx；官方基準為 108 | 站號改為「108」；若要避免和釜山 1 號線混淆，應用路線徽章／前綴顯示，不要改官方數字 | [KRIC Busan-Gimhae 2025-06-30](https://www.data.go.kr/data/15041041/fileData.do) | 高 |
| 507 | 釜山－金海輕軌 | 大渚 | 대저 | Daejeo | 金海輕軌整線站號被改成 5xx；官方基準為 107 | 站號改為「107」；若要避免和釜山 1 號線混淆，應用路線徽章／前綴顯示，不要改官方數字 | [KRIC Busan-Gimhae 2025-06-30](https://www.data.go.kr/data/15041041/fileData.do) | 高 |
| 506 | 釜山－金海輕軌 | 燈丘 | 등구 | Deunggu | 金海輕軌整線站號被改成 5xx；官方基準為 106 | 站號改為「106」；若要避免和釜山 1 號線混淆，應用路線徽章／前綴顯示，不要改官方數字 | [KRIC Busan-Gimhae 2025-06-30](https://www.data.go.kr/data/15041041/fileData.do) | 高 |
| 505 | 釜山－金海輕軌 | 德斗 | 덕두 | Deokdu | 金海輕軌整線站號被改成 5xx；官方基準為 105 | 站號改為「105」；若要避免和釜山 1 號線混淆，應用路線徽章／前綴顯示，不要改官方數字 | [KRIC Busan-Gimhae 2025-06-30](https://www.data.go.kr/data/15041041/fileData.do) | 高 |
| 504 | 釜山－金海輕軌 | 金海國際機場 | 김해국제공항 | Gimhae International Airport | 韓文主站名無法對上官方清單；官方名稱為「공항」；金海輕軌整線站號被改成 5xx；官方基準為 104 | 韓文改為「공항」，中文保留「機場」，英文採官方站牌名稱「Gimhae Int'l Airport」；站號改為「104」；若要避免和釜山 1 號線混淆，應用路線徽章／前綴顯示，不要改官方數字 | [釜山－金海輕軌官方站資訊](https://www.bglrt.com/00011/00149.web?scode=904) | 高 |
| 503 | 釜山－金海輕軌 | 西釜山流通園區 | 서부산유통지구 | Seobusan Yutongjigu | 金海輕軌整線站號被改成 5xx；官方基準為 103 | 站號改為「103」；若要避免和釜山 1 號線混淆，應用路線徽章／前綴顯示，不要改官方數字 | [KRIC Busan-Gimhae 2025-06-30](https://www.data.go.kr/data/15041041/fileData.do) | 高 |
| 502 | 釜山－金海輕軌 | 掛法雷諾城 | 괘법르네시떼 | Gwaebeop Renecite | 金海輕軌整線站號被改成 5xx；官方基準為 102 | 站號改為「102」；若要避免和釜山 1 號線混淆，應用路線徽章／前綴顯示，不要改官方數字 | [KRIC Busan-Gimhae 2025-06-30](https://www.data.go.kr/data/15041041/fileData.do) | 高 |
| 501 | 釜山－金海輕軌 | 沙上 | 사상 | Sasang | 金海輕軌整線站號被改成 5xx；官方基準為 101 | 站號改為「101」；若要避免和釜山 1 號線混淆，應用路線徽章／前綴顯示，不要改官方數字 | [KRIC Busan-Gimhae 2025-06-30](https://www.data.go.kr/data/15041041/fileData.do) | 高 |
| K111 | 東海線 | 巨堤日出 | 거제해맞이 | Geojehaemaji | 目前中文與 KRIC／營運單位多語清單不一致 | 官方對照為「巨堤해맞이」；採用前需依繁體中文與台灣用語政策人工確認 | [KRIC Donghae 2025-06-30](https://www.data.go.kr/data/15064706/fileData.do) | 中 |
| K113 | 東海線 | 教大 | 교대 | Busan Nat’l Univ. of Edu. | 目前中文與 KRIC／營運單位多語清單不一致 | 官方對照為「敎大」；採用前需依繁體中文與台灣用語政策人工確認 | [KRIC Donghae 2025-06-30](https://www.data.go.kr/data/15064706/fileData.do) | 中 |
| K129 | 東海線 | 望洋 | 망양 | Mangyang | 目前中文與 KRIC／營運單位多語清單不一致 | 官方對照為「望陽」；採用前需依繁體中文與台灣用語政策人工確認 | [KRIC Donghae 2025-06-30](https://www.data.go.kr/data/15064706/fileData.do) | 高 |

## 系統性問題
- `en` 欄位語義混雜：有些列存官方英文（如 `City Hall`），有些列存發音羅馬字（如 `Sicheong`）。本次有 77 列與官方英文主名稱不同。建議拆為 `officialEnglish` 與 `romanized`，顯示時再決定順序。
- 金海輕軌 21 站全部使用 501–521，但 KRIC 與營運單位使用 101–121。避免和釜山 1 號線混淆應靠路線名稱、顏色或 `BGL 101` 顯示，不應更改官方站號。
- 同一轉乘站不同路線的英文不一致：`가락시장`（Garaksijang / Garak Market）、`가산디지털단지`（Gasan Digital Danji / Gasan Digital Complex）、`올림픽공원`（Ollimpik Gongwon / Olympic Park）。
- 中文欄混合三種策略：漢字語源、官方翻譯、發音音譯；此外還混有簡繁與台灣／中國用語差異。應建立 `zhHantTW` 政策與來源欄位，不能只用 OpenCC 機械轉換。
- 支線與主線共用車站的站名可一致，但資料列仍應保留來源與最後核對日期，否則無法追蹤哪一筆已更新。

## 無法確認的項目
- 47 列沒有可用的官方繁體中文欄位，主要集中於金海輕軌、東海線與部分首爾 9 號線／特殊路線。這些列已保留現狀，沒有自行發明翻譯。
- 站號完整驗證受官方資料欄位限制：A'REX、牛耳新設線、金海輕軌及釜山 1–4 號線有公開站號可直接比對；KRIC 部分首爾資料使用內部四位碼或未提供旅客站號，未把格式差異當成錯誤。
- 釜山 KRIC 多語資料存在疑似舊名或資料品質問題（例如 `동매` 的繁中欄為「東山」、`낫개` 為「羅浦」、4 號線 `윗반송` 為舊副站名「東釜山大學」），已列為中信心待人工確認，不直接覆寫。
- 釜山交通公社 2025-10-31 CSV 把 `수영` 與 `광안` 都列成 209；網站現有 208／209 與實際連續站號一致，因此本報告視為官方來源自身的資料錯誤，不建議把水營改成 209。

## 可重跑方式
1. `extract-stations.js` 從 `index.html` 重新產出基準 CSV／JSON。
2. `compare-official.py` 載入已下載的官方 CSV／XLSX，輸出 `official-comparison.json`。
3. `generate-report.js` 產生本報告及問題清單 CSV。
