---
tags:
    - python
---


PAIZAスキルチェックなどで使う標準入力の方法たち

---

INT型の場合

```python
# 単体 -スカラー
n = int(input())

# 複数 (代入する数が定まっている場合)
n1, n2 = map(int, input().split())

# 複数 (代入する数が定まっていない場合　リストとして渡す)
n = list(map(int, input().split()))
# そのまま変数に渡すとmapオブジェクトして渡されてしまうため、list型に変換する
```

---

STR型の場合

```python
# 単体 -スカラー
a = input()

# 複数 (代入する数が定まっている場合)
a, b = input().split()

# 複数 (代入する数が定まっていない場合　リストとして渡す)
a = list(input().split())
```

---

複数の型が混在する場合

```python
# 作業変数に一度格納
temp = input().split()
a = int(temp[0])
b = temp[1]
```