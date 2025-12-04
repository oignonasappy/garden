---
tags:
  - gemini
  - javascript
  - functionalprogramming
---

> [!quote]+ Prompt
> JavaScriptで、
(疎配列である)2次元配列の列方向の要素数の最大値を求める方法!

なるほど、面白いね！疎配列っていうのは、要素がまばらに存在する配列のことだ。JavaScriptで2次元配列の列方向の要素数の最大値を求めるには、いくつかの方法があるよ。どれもシンプルだから、一緒に見ていこう！

### 1. `reduce`メソッドを使う方法

配列の要素を1つずつ処理して、最大値を求めるのに**`reduce()`**メソッドはとっても便利だよ。

JavaScript

```
const sparseArray = [
  [1, 2, 3],
  [4, 5],
  [6, 7, 8, 9],
  [],
];

const maxLength = sparseArray.reduce((max, row) => {
  return Math.max(max, row.length);
}, 0);

console.log(maxLength); // 4
```

- `sparseArray.reduce(...)`で、配列を1つの値に集約する。
    
- `(max, row) => ...`は、`max`がこれまでの最大値、`row`が現在の行（配列）だよ。
    
- `Math.max(max, row.length)`で、これまでの最大値と現在の行の長さ（要素数）を比較して、大きい方を返す。
    
- `0`は初期値。もし空の配列だった場合でも、ちゃんと`0`が返るように設定してる。
    

---

### 2. `map`と`Math.max`を組み合わせる方法

この方法は、一度すべての行の長さを取得してから、その中から最大値を求める方法だ。これもスッキリしていて分かりやすいよ。

JavaScript

```
const sparseArray = [
  [1, 2, 3],
  [4, 5],
  [6, 7, 8, 9],
  [],
];

// 各行の長さを新しい配列に格納
const lengths = sparseArray.map(row => row.length);
// [3, 2, 4, 0]

// その配列の中から最大値を求める
const maxLength = Math.max(...lengths);

console.log(maxLength); // 4
```

- `sparseArray.map(row => row.length)`で、各行の要素数を新しい配列`lengths`として生成している。
    
- **スプレッド構文 (`...`)** を使って`Math.max`に配列の要素を展開しているのがポイントだ。
    

---

### まとめ

どちらの方法もJavaScriptらしい書き方で、簡潔に書けるのがいいところだね。

- `reduce`は1回のループで最大値を求めるから、処理の効率がいい。
    
- `map`と`Math.max`の組み合わせは、処理の流れが直感的で、コードが読みやすいかもしれない。
    

君はJavaScriptに詳しいから、これらの書き方はすぐに理解できるはずだ。用途や好みに合わせて使い分けてみてね！😉