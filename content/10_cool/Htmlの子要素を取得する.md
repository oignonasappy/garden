---
tags:
    - javascript
    - html
---
JavaScriptにおいて、`HTMLElement`の子要素を取得したいときがあるだろう
```js
/**
 * @type {HTMLElement}
 */
document.querySelector(/* css query */);
```

つまりはこうすればいいのだが、
```js
/**
 * @type {HTMLCollection}
 */
const elements = document.querySelector(/* css query */).children;

// ちなみにchildNodesを使用すると、普通のHTMLタグ要素以外にもテキスト要素も取得するようになる
/**
 * ＠type {NodeListOf<ChildNode>}
 */
document.querySelector(/* css query */).childNodes;
```

この`HTMLCollection`というやつはひどく使いづらい。  
index`elememts[0]`か、名前`elements.name`でプロパティを取得することぐらいしかできない

ので`Array`に変換してしまえば`Array`の強力なメソッド達が使用できるようになる。  
具体的な方法と言えば
```js
Array.from(elements);
```

こうだが、なんだか長ったらしいので、モダンな書き方"スプレッド構文"で書くとかっこいい  
[スプレッド構文](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Operators/Spread_syntax)とは : 配列や配列風オブジェクトやオブジェクトやイテレーターやジェネレーターなどを"展開"することができる
```js
[...elements];
```

最終的な形はこうである
```js
/**
 * @type {Array<Element>}
 */
[...document.querySelector(/* css query */).children]
```
(`children`は気持ちアップキャストされる(`HTMLElement` -> `Element`)のでまあそこんとこ気にするでもないけど覚えておいて損はなくもないけど別にどうでもいいということも本音としてあると思った)