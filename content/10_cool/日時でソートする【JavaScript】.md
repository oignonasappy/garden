---
tags:
    - javascript
---

> https://monologue.asappy.xyz/pages/compare-date-js/ からのセルフ転載。

日時(Date)での比較・ソートの方法について。

## Date型の仕様について

JavaScriptにおける`Date`は、それどうしでの**減算**`-`や、**比較**`<, >`が可能です。

これらの演算は内部でミリ秒での計算が行われます。

```js
console.log(new Date("2025-08-11 15:00:01")
          - new Date("2025-08-11 15:00:00")); // 1000

console.log(new Date("2025-08-11 15:00:01")
          > new Date("2025-08-11 15:00:00")); // true
```

## 日付の配列をソートする

Dateオブジェクトの入った配列を新しい順にソートするには、このようにします。

```js
const dateArray = [
  new Date("2025/01/05"),
  new Date("2025/01/02"),
  new Date("2025/01/01"),
  new Date("2025/01/03"),
  new Date("2025/01/04"),
];

// 新しい順
const sortedDateArray = dateArray.toSorted((a, b) => {
  return b - a;
});
/*
 * 2025/01/05
 * 2025/01/04
 * 2025/01/03
 * 2025/01/02
 * 2025/01/01
 */

// Array.prototype.toSorted()メソッドは少々新しい機能のため、
// 使用できない場合は`[...dateArray].sort()`を使用します
```

古い順にソートするには、このようにします。

```js
// 古い順
const sortedDateArray = dateArray.toSorted((a, b) => {
  return a - b;
});
/*
 * 2025/01/01
 * 2025/01/02
 * 2025/01/03
 * 2025/01/04
 * 2025/01/05
 */
```

### NaNも扱う

無効な日付`NaN`が配列に含まれる場合は、ソートが適切に行われないため、`isNaN()`を使用して適切に処理します。

```js
const dateArray = [
  new Date("0000/00/00"), // NaN
  new Date("2025/01/02"),
  new Date("2025/01/01"),
  new Date("0000/00/00"), // NaN
  new Date("2025/01/03"),
  new Date("2025/01/04"),
  new Date("0000/00/00"), // NaN
];

// 新しい順、NaNを後方に送る
const newestBackwardNaN = dateArray.toSorted((a, b) => {
  if (isNaN(b)) return -1;
  return b - a;
});
// [01/04, 01/03, 01/02, 01/01, NaN, NaN, NaN]

// 新しい順、NaNを前方に送る
const newestForwardNaN = dateArray.toSorted((a, b) => {
  if (isNaN(a)) return -1;
  return b - a;
});
// [NaN, NaN, NaN, 01/04, 01/03, 01/02, 01/01]

// 古い順、NaNを後方に送る
const oldestBackwardNaN = dateArray.toSorted((a, b) => {
  if (isNaN(b)) return -1;
  return a - b;
});
// [01/01, 01/02, 01/03, 01/04, NaN, NaN, NaN]

// 古い順、NaNを前方に送る
const oldestForwardNaN = dateArray.toSorted((a, b) => {
  if (isNaN(a)) return -1;
  return a - b;
});
// [NaN, NaN, NaN, 01/01, 01/02, 01/03, 01/04]
```

参考: [MDN Web Docs](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Date)