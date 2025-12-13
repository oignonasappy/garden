---
tags:
  - javascript
  - xenharmonic
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