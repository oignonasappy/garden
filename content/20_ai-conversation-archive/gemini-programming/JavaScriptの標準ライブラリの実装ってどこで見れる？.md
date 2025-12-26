---
tags:
  - gemini
  - javascript
---

> [!quote]+ Prompt
> Javascriptの標準ライブラリの実装はどこで見れる？

JavaScriptの標準ライブラリ（`Array.map` や `Object.keys` など）の実装を見たいっていうその探究心、最高だね！🚀

結論から言うと、JavaScriptの「標準ライブラリ」という言葉には2つの側面があって、それぞれ見に行く場所が違うんだ。情報工学的に整理して解説するよ！

---

## 1. 「仕様書」としての実装 (ECMAScript)

まず、JavaScriptの「挙動のルール」を決めているのが **ECMAScript (ECMA-262)** という仕様書だよ。

- **場所:** [tc39.es (ECMA-262)](https://tc39.es/ecma262/)
    
- **内容:** ここにはC言語のようなコードではなく、**「アルゴリズム（手順）」**が擬似コードのような形で書かれているんだ。
    
- **楽しみ方:** 例えば `Array.prototype.map` を検索すると、内部でどうループを回し、どうやって新しい配列を生成すべきかが厳密に定義されているよ。
    

---

## 2. 「エンジン」としての実装 (V8, JavaScriptCore etc.)

キミが実際にWindows 11のChromeやUbuntuのNode.jsで動かしているコードの「中身」は、ブラウザの **JavaScriptエンジン** が実装しているよ。ここはまさにキミが好きな **C++** や **Rust**（一部）の宝庫だ！

### 🚀 V8エンジン (Chrome, Node.js, Deno)

Googleが開発している世界最強のエンジン。キミが使っているOS環境ではこれがメインだね。

- **場所:** [v8/v8 (GitHub)](https://github.com/v8/v8)
    
- **見どころ:** `src/builtins` ディレクトリの中に、標準ライブラリの実装が入っているよ。
    
- **面白いポイント:** 最近のV8はパフォーマンス向上のために、標準ライブラリの一部を **Torque** という独自のドメイン固有言語や、JavaScript自身で書いていることもあるんだ（Self-hosting）。
    

### 🍎 JavaScriptCore (Safari, Bun)

Appleが開発しているエンジン。最近勢いのある **Bun** もこれを使っているよ。

- **場所:** [WebKit/WebKit (GitHub)](https://github.com/WebKit/WebKit/tree/main/Source/JavaScriptCore)
    

---

## 3. なぜ「実装」を見るのが難しいのか？

C#やJavaなら「ソースコードへ移動」で簡単に見れるけど、JSはそうはいかないよね。それには理由があるんだ。

1. **ネイティブ実装:** 速度を出すために、多くの関数はC++で直接書かれ、コンパイルされている。
    
2. **インラインキャッシュ:** 実行時にJIT（Just-In-Time）コンパイルされるから、ソースコードがそのまま動いているわけじゃない。
    

---

## 💡 豆知識：一番手軽に「仕組み」を知る方法

エンジンの中身をC++で追うのはかなりハードだけど、**「ポリフィル（Polyfill）」**のコードを見るのが一番勉強になるよ！

`core-js` というライブラリのコードを見れば、「もしJavaScriptで `Array.map` をゼロから実装するならどう書くか？」という論理的な実装がJavaScriptで読めるんだ。

- **場所:** [zloirock/core-js (GitHub)](https://github.com/zloirock/core-js/tree/master/packages/core-js/modules)
    

---

### 次のステップへの提案

キミはUbuntuも使っているから、V8のソースを `git clone` して、`grep` で `Array.prototype.push` の定義を探してみるのはどうかな？「本物のエンジン」のコードを眺めるのは、情報工学徒として最高の贅沢だよ！

もし興味があれば、**「V8の中でJavaScriptとC++がどう連携しているのか（V8 Bindings）」**について深掘りしてみるのも楽しいかもね！やってみたい？😉