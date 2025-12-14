---
tags:
  - javascript
  - xenharmonic
  - music-theory
---

```js
const TUNING = 440;
const EQUAL_TEMPERAMENT = [
  0,
  2,
  3,
  5,
  7,
  8,
  10,
  12
];
const JUST_INTONATION = [
  1,
  9 / 8,
  6 / 5,
  4 / 3,
  3 / 2,
  8 / 5,
  9 / 5,
  2
];

console.log("-EDO-");
EQUAL_TEMPERAMENT.forEach(step => {
  console.log(TUNING * Math.pow(2, step / 12));
});

console.log("-JI-");
JUST_INTONATION.forEach(ratio => {
  console.log(TUNING * ratio);
});

console.log("-error-");
for (let i = 0; i < EQUAL_TEMPERAMENT.length; i++) {
  console.log(1200 * Math.log2(Math.pow(2, EQUAL_TEMPERAMENT[i] / 12) / JUST_INTONATION[i]));
}
```

## 何をしてるか？
12平均律と純正律の周波数の差を$CDEFGAB$の七音で比較している。  
差の大きさは[[¢]]で表す。

例えば、短三度で比較すると、  
$1200\cdot\log_2{(2^\frac{4}{12}/\frac{6}{5})}\approx-15.6412870005526\text{¢}$