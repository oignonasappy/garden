---
tags:
  - gemini
  - javascript
  - html
---

> [!quote]+ Prompt
> 以下のようなjavascriptが、外部から`<script src="[パス]" defer></script>`のように読み込まれる  
> `function func(){/* */}`
> 
> そしてHTML内にこのボタンを配置する  
> `<button type="button" onclick="func()">func</button>`
> 
> でも、動かない！一体なぜ？

えーっと、その状況だと、だいたい原因は**`defer`属性**と**`onclick`イベントハンドラ**の組み合わせにあると思うな！ 🤔

結論から言うと、`defer`属性がついていると、HTMLが読み込まれてDOMツリーが構築された後にJavaScriptが実行されるんだ。でも、`onclick`イベントハンドラは、HTMLが解析されるタイミングで、つまりまだJavaScriptが読み込まれる前に**`func`という関数を探してしまう**から、「そんな関数ないよ！」ってエラーになっちゃうんだよね。

じゃあ、なんでかっていうと、ブラウザの処理の流れを分解して考えてみよう。

### 1. ブラウザの処理の流れ

1. **HTMLの解析:** ブラウザがHTMLファイルを上から順に読み込んで、DOMツリーを構築していくよ。このとき、`<button onclick="func()">`の行に差し掛かると、「お、`onclick`イベントハンドラがあるな。`func`っていう関数を探そう」ってなるんだけど、まだJavaScriptは実行されてないから、`func`が見つからなくてエラーになるんだ。
    
2. **JavaScriptのダウンロード:** `<script src="..." defer>`の行を見つけると、ブラウザはバックグラウンドでJavaScriptファイルのダウンロードを開始するよ。`defer`がついているから、ダウンロードはするけど、**実行は後回し**にするんだ。
    
3. **DOMツリーの構築完了:** HTMLファイルの最後まで読み込み、DOMツリーが完全に構築される。
    
4. **JavaScriptの実行:** 最後に、ダウンロードが終わったJavaScriptファイルが実行される。ここでようやく`func`関数が定義されるんだ。
    

このタイムラグが問題なんだよね。`onclick`が関数を呼ぼうとしたときには、まだ関数が定義されてないっていう状況になっちゃってる。

---

### 2. 解決策

この問題を解決する方法はいくつかあるよ！どれもシンプルで、状況に応じて使い分けられるから、知っておくと便利だよー。

#### ① `defer`を外す

これが一番簡単！`defer`属性を外せば、JavaScriptはHTMLの解析中に**同期的に読み込まれて実行**されるようになる。ボタンのHTML要素が解析される前に`func`関数が定義されるから、エラーにならなくなるよ。

HTML

```
<script src="[パス]"></script>
<button type="button" onclick="func()">func</button>
```

#### ② `defer`を残したまま、イベントリスナーを使う

これは個人的におすすめの方法。HTMLとJavaScriptをきれいに分離できるから、メンテナンス性が高くなるんだ。`defer`属性を残したまま、JavaScript内で**`DOMContentLoaded`イベント**を使って、DOMツウザリーが完全に構築された後にイベントリスナーを設定するんだ。

HTML

```
<button type="button" id="myButton">func</button>
<script src="[パス]" defer></script>
```

JavaScript

```
// 外部のJavaScriptファイル内
document.addEventListener('DOMContentLoaded', () => {
  const button = document.getElementById('myButton');
  if (button) {
    button.addEventListener('click', func);
  }
});

function func() {
  // 処理
  console.log('ボタンがクリックされたよ！');
}
```

この方法だと、HTMLが完全に準備できてからイベントリスナーを登録するから、`func`関数が定義されていないってことは起こらないよ！

どう？面白いでしょ？プログラミングって、こういうブラウザの動作の裏側を知ってると、もっと楽しくなるよね！😉