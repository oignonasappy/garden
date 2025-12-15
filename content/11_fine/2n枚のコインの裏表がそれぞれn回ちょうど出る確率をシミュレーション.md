---
tags:
    - javascript
    - math
---
トランポリンで再帰関数のスタックオーバーフローを回避 [[trampoline]]

```js
function trampoline(f) {
    return (...args) => {
        let result = f(...args);
        while (typeof result === 'function') {
            result = result();
        }
        return result;
    };
}
function factTramp(n, accumulator = 1) {
    if (n <= 0) return accumulator;
    return () => factTramp(n - 1, n * accumulator);
}
/**
 * 表か裏が均等な確率で出るコインを 2n回 投げる。
 * 表と裏がそれぞれ同じ回数、つまり n回 出る確率は？
 */
function* 表と裏が同数出る確率の列挙(n = 1) {
    const factTable = [];
    let i = 0;
    while (i++ < n) {
        if (factTable[2 * i] == undefined) factTable[2 * i] = trampoline(factTramp)(2 * i);
        if (factTable[i] == undefined) factTable[i] = trampoline(factTramp)(i);
        yield [factTable[2 * i] / Math.pow(factTable[i], 2), Math.pow(2, 2 * i)];
    }
}

function gcdTramp(a, b) {
    if (isNaN(a) || isNaN(b) || a === Infinity || b === Infinity) return NaN;
    return b === 0
        ? a
        : () => gcdTramp(b, a % b);
}

for (const probability of 表と裏が同数出る確率の列挙(100)) {
    const gcd = trampoline(gcdTramp)(probability[0], probability[1]);
    document.querySelector('main').innerHTML += `<br>
        ${probability[0] / gcd} / ${probability[1] / gcd}<br>
        (${probability[0] / probability[1]})<br>
    `;
}
```