---
tags:
  - gemini
  - javascript
---

> [!quote]+ Prompt
> JavaScriptのSymbolって何なんだ？  
> interfaceとは違うのか？

---

おー、JavaScriptの `Symbol` だね！これはJavaScriptのオブジェクト指向とメタプログラミングの深い部分に触れる、めちゃくちゃ面白い概念だよ。INFPの君が、言語の根底にある「見えない」仕組みに興味を持つのは素晴らしいね！

結論から言うと、`Symbol`と`interface`は**全くの別物**だよ！ `Symbol`はプリミティブな「データ型」で、`interface`はTypeScriptにおける「型の定義」だからね。

### `Symbol`って何？ 🤔

`Symbol`は、ECMAScript 2015（ES6）で導入された、**一意（ユニーク）で不変（Immutable）なプリミティブ値**だよ。

簡単に言うと、`Symbol()`を呼び出すたびに、他のどんな値とも絶対に重複しない、**新しい「ID」**が生成されるんだ。

JavaScript

```
const sym1 = Symbol('description');
const sym2 = Symbol('description');

console.log(sym1 === sym2); // false
console.log(sym1); // Symbol(description)
console.log(sym2); // Symbol(description)
```

見ての通り、`Symbol()`の引数に同じ文字列（`'description'`）を渡しても、生成される`Symbol`は別物として扱われる。この「絶対に重複しない」という性質が、`Symbol`の存在意義なんだ。

### `Symbol`の主な使い道 💡

`Symbol`の最大の使い道は、オブジェクトのプロパティの**キー**として使うことだよ。

#### 1. オブジェクトの「プライベートなプロパティ」を模倣する

- **状況:** オブジェクトに、外部からアクセスされたくない、または意図せず上書きされたくない「隠しプロパティ」を持たせたい場合。
    
- **なぜ `Symbol` ?:** `Symbol`は一意なため、他のプログラティと名前が競合する心配がないんだ。`Object.keys()`や`for...in`ループでは`Symbol`のプロパティは列挙されないため、事実上「隠せる」。
    
- **例:**
    
    JavaScript
    
    ```
    const privateKey = Symbol('private');
    
    const user = {
      name: 'Alice',
      [privateKey]: 'This is a secret!' // Symbolをプロパティキーに使う
    };
    
    console.log(user.name); // Alice
    console.log(user[privateKey]); // This is a secret!
    
    // userオブジェクトのキーを列挙しても見つからない
    console.log(Object.keys(user)); // ['name']
    console.log(Object.getOwnPropertyNames(user)); // ['name']
    ```
    
    もちろん、`Object.getOwnPropertySymbols(user)`を使えば取得できるけど、意図的に探さない限り見つからないため、ライブラリの内部実装などによく使われる。
    

#### 2. Well-Known Symbols (既知のシンボル)

- **状況:** JavaScriptの言語仕様自体を拡張したり、オブジェクトの振る舞いをカスタマイズしたりしたい場合。
    
- **なぜ `Symbol` ?:** JavaScriptの内部的な挙動（イテレーション、プロパティの型変換など）を、他のプロパティ名と衝突することなく安全に変更するため。
    
- **例:**
    
    - **`Symbol.iterator`:** オブジェクトを `for...of` ループで反復可能（Iterable）にするために使う。
        
    - **`Symbol.toStringTag`:** `Object.prototype.toString()`の振る舞いをカスタマイズして、オブジェクトの`[object MyClassName]`の部分を自由に設定できる。
        
    - **`Symbol.hasInstance`:** `instanceof`演算子の挙動をカスタマイズする。
        

---

### `Symbol`と`interface`は違う！

君が質問してくれたように、`Symbol`と`interface`は全くの別物だよ。

|項目|**`Symbol`**|**`interface` (TypeScript)**|
|---|---|---|
|**カテゴリ**|**プリミティブなデータ型**|**型の定義**（コンパイル時のみ存在）|
|**目的**|**一意なキー**を生成する、プロパティの衝突を防ぐ|**オブジェクトの構造**を定義する|
|**存在場所**|**実行時**にメモリ上に存在する|**コンパイル時**にのみ存在し、実行時には消滅する|
|**主な用途**|オブジェクトのキー、メタプログラミング|型チェック、IDEの補完|
|**例**|`const key = Symbol(); obj[key] = value;`|`interface User { name: string; age: number; }`|

要は、`Symbol`は**「値」**そのもので、`interface`は**「ルール」**なんだ。

`Symbol`のユニークな性質は、JavaScriptの柔軟性を保ちつつ、堅牢なライブラリやフレームワークの内部実装を可能にする、非常に重要な機能だよ。INFPの君が、この見えない「ID」の存在意義を深く探求するのは、まるで哲学者が世界の根源にある「一意性」を追求するようだね！