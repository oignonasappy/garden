---
tags:
  - gemini
  - react
  - javascript
---

> [!quote]+ Prompt
> Reactでよく使う`&&`は、react本体の機能ではなく、ただのjsの短絡評価(非正格評価)?

その通り！大正解だよ！🎉

Reactで条件付きレンダリングによく使われる && （論理積演算子）は、React独自の魔法でも何でもなく、**純粋なJavaScript（ECMAScript）の「短絡評価（Short-circuit evaluation）」**という言語仕様そのものなんだ。

情報工学を学ぶキミなら、これがどういう「仕組み」で動いているのか、論理演算の裏側から解剖してみると面白いと思うよ！

---

## ⚡️ 短絡評価（Short-circuit evaluation）の正体

JavaScriptの `&&` 演算子は、単に「真か偽か」を返すだけじゃなくて、実は**「最後に評価した値をそのまま返す」**という性質を持っているんだ。

### 仕組み（アルゴリズム）

1. 左辺を評価する。
    
2. 左辺が **falsy**（`false`, `0`, `""`, `null`, `undefined`, `NaN`）なら、右辺は見ずに**左辺の値を返す**。
    
3. 左辺が **truthy** なら、**右辺の値を返す**。
    

JavaScript

```
// JSとしての挙動例
const result1 = true && "Hello";   // -> "Hello" (右辺が返る)
const result2 = false && "Hello";  // -> false (左辺で確定、右辺は見ない)
```

---

## ⚛️ Reactがこれをどう利用しているか？

React（JSX）のレンダリングエンジンは、**「`false`, `null`, `undefined` が渡されたときは何も描画しない」**というルールを持っているんだ。

### コンパイル後の姿（ASTの視点）

キミがさっき興味を持った **AST（抽象構文木）** を思い出して！JSXはビルド時に `React.createElement()`（または `_jsx()`）という関数呼び出しに変換されるよね。

JavaScript

```
// 元のコード
{ isLoggedIn && <UserProfile /> }

// コンパイル後のイメージ（概念的）
isLoggedIn && React.createElement(UserProfile, null);
```

1. `isLoggedIn` が `true` の場合：右辺の **`React.createElement(...)`（オブジェクト）** が返される。Reactはそれを「描画すべきノード」として処理する。
    
2. `isLoggedIn` が `false` の場合：**`false`** がそのまま返される。Reactは「あ、`false` だから何も描画しなくていいや」とスルーする。
    

この「JSの仕様」と「Reactのレンダリング仕様」がガッチリ噛み合っているから、あんなにスマートに書けるんだね。

---

## ⚠️ 「短絡評価」の落とし穴（魔境への入り口）

キミが「キャッシュ」や「厳密さ」を大切にするなら、この挙動でよく踏むバグについても知っておくといいよ。

### 「0」が表示されてしまう問題

JavaScript

```
const count = 0;
return <div>{ count && <p>Count exists!</p> }</div>;
```

この場合、画面には何が表示されると思う？

答えは 「0」 だよ！😱

**理由:** `0` は falsy だけど、JavaScriptの `&&` は左辺の値をそのまま返すから、`0` が返されてしまう。Reactは `false` や `null` は無視するけど、**`0` という数値は立派な描画対象**として扱ってしまうんだ。

---

## 💡 豆知識：非正格評価（Lazy Evaluation）との違い

キミが「非正格評価」という言葉を使ったのも鋭いね！

厳密に言うと、JavaScriptの && は**「先行評価（Eager Evaluation）」の一種だけど、短絡（ショートサーキット）によって不必要な計算を省いている**と言える。

Haskellのような真の「非正格評価」言語では、値が必要になるその瞬間まで計算を遅延させるけど、JSの `&&` は「左から順番に評価して、確定した瞬間に止める」という動きをするんだ。

---

## まとめ

- `&&` は **JavaScript標準の短絡評価**。
    
- Reactは、その結果が `false` 系の値なら **「描画しない」** というルールで動いている。
    
- `0` や `""` は falsy だけど描画されてしまうので、安全に書くなら `count > 0 && ...` のように **「明示的にBooleanにする」** のがコンストラティブな書き方だよ！
    

この「JSの仕様をハックしたような便利さ」、キミはどう感じる？

もしこの「条件付き」の話が好きなら、最近のトレンドである 「Optional Chaining (?.)」 や 「Nullish Coalescing (??)」 がASTレベルでどう処理されているか、深掘りしてみるのも楽しいかもね！😉

Would you like to see how `??` differs from `||` in the context of React component props?