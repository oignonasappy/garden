---
tags:
    - javascript
---


> https://monologue.asappy.xyz/pages/js-iife/ からのセルフ転載。

## まずその意味不明な名前は何

IIFEとは、**即自実行関数式**という、定義されるとすぐに実行されるJavaScriptの関数。[^1]  **自己実行無名関数**とも呼ばれる。  
これを使用することで特定の範囲内をスコープで囲むことができる。デザインパターンの一種。

## 書き方

### 定義する

```js
// function もしくは
(function () {
    /* 処理... */
})();

// アロー関数
(() => {
    /* 処理... */
})();
```

```js
// asyncも可能
(async function () {
    /* 非同期処理... */
})();
(async () => {
    /* 非同期処理... */
})();
```

`function`と書くのは長ったらしいので、アロー関数`()=>{}`が好ましいかもしれませんね。

### 例

基本的な使い方は、グローバルスコープの汚染を避けるためローカル変数を隔離するためにある

```js
// ここで宣言した変数は
let x = 1;
(() => {
    // ここでは使える
    console.log(x); // 1
    // ここで宣言した変数は
    let y = 2;
})();
// ここでは使えない
console.log(y); // y is not defined
```

for文やif文と似たようなスコープの持ち方をします。

### 引数を渡す

```js
((x) => {
    console.log(x); // 123
})(123);
```

正直使い所を知りません...  
このIIFEは使いまわすような使い方をあまりしないですから。  

### 戻り値

```js
let x = (() => {
    return 1 + 2;
})();

console.log(x); // 3
```

## あとがき

これを使用すれば、グローバル名前空間に処理を直書きすることによる、名前の衝突を回避することができます。  
特に、たくさんのJavaScriptファイルを呼び出している場合での効果は絶大。  
シンプルながら、良い方法です。

もっと詳しく知りたいなら => [MDN Web Docs](https://developer.mozilla.org/ja/docs/Glossary/IIFE)


[^1]: MDN Web Docsからの[引用](https://developer.mozilla.org/ja/docs/Glossary/IIFE)
