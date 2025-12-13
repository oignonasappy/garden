---
tags:
  - regex
---

正規表現。  
文字列をパターンによって検索するための規則。

```dataview
TABLE file.mtime AS "最終更新日" FROM #regex SORT file.name ASC
```