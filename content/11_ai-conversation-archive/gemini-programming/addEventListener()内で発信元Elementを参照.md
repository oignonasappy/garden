---
tags:
  - gemini
  - javascript
---

> [!quote]+ Prompt
> `.getElementById('button').addEventListener('click', /* ここに記述する無名関数内で#button要素を参照するには？ */)`

---

なるほど！`.getElementById('button').addEventListener('click', /* ... */)` の無名関数内で、`#button`要素自身を参照する方法だね。INFPの君が、イベント処理における「コンテキスト」という、JavaScriptの深い部分を追求しているのが伝わってくるよ。

結論から言うと、イベントリスナーのコールバック関数内で、そのイベントの発生元である要素（この場合は`#button`要素）を参照するには、主に以下の2つの方法があるよ。

1. **`event.currentTarget` または `event.target` を使う**
    
2. **アロー関数とクロージャを使う**
    

それぞれ見ていこう！

### 1. `event.currentTarget` または `event.target` を使う（最も一般的で推奨） ✨

`addEventListener`に渡される無名関数には、引数としてイベントオブジェクトが渡されるんだ。このイベントオブジェクトが、イベントに関するすべての情報を持っていて、その中に**イベントの発生元である要素への参照**が含まれているよ。

- **`event.currentTarget`**: これは**イベントリスナーが登録された要素**を指すよ。今回のように`#button`に直接`addEventListener`を付けている場合、`event.currentTarget`は`#button`要素自身になる。
    
- **`event.target`**: これは**実際にイベントが発生した要素**を指すよ。`#button`内に`<span>`などの子要素があった場合、クリックした場所が`<span>`内であれば、`event.target`は`<span>`になる。ただし、`event.target`はイベントのバブリング（伝播）時に変化する可能性があるため、リスナーが登録された要素を確実に参照したい場合は、**`event.currentTarget`を使うのがより安全で一般的**だよ。
    

JavaScript

```
document.getElementById('button').addEventListener('click', function(event) {
  // `event`オブジェクトがイベントに関する情報を持っている
  // `#button`要素自身を参照するには `event.currentTarget` を使う
  const buttonElement = event.currentTarget;
  
  // `#button`要素のテキストを変更する例
  buttonElement.textContent = 'クリックされました！';
});
```

### 2. アロー関数とクロージャを使う 🔗

アロー関数は、それが定義されたスコープの `this` を「語彙的（lexical）」に束縛する、という特性があったよね（以前話したね！）。この特性を応用して、イベントリスナーとして登録する無名関数内で、`addEventListener`を呼び出した要素をクロージャとして「記憶」させておく、というアプローチも使えるよ。

- **考え方**: `addEventListener`を呼び出す前に、`#button`要素を変数に格納しておく。アロー関数は、その外部スコープにある`buttonElement`変数をクロージャとして保持するから、`buttonElement`を使って要素を参照できるんだ。
    

JavaScript

```
const buttonElement = document.getElementById('button');

buttonElement.addEventListener('click', (event) => {
  // アロー関数は、外側のスコープにある`buttonElement`変数を参照できる
  console.log(buttonElement.textContent);
  
  // もちろん、`event.currentTarget`も使える
  console.log(event.currentTarget.textContent);
});
```

この方法のメリットは、イベントオブジェクトを引数として受け取らなくても、外側のスコープの変数を使って要素を参照できることだね。

### まとめ

- **最も一般的で安全な方法**: `event.currentTarget` を使う。イベントリスナーが登録された要素を確実に参照できる。
    
- **より簡潔な方法**: アロー関数を使い、外部スコープで宣言された変数をクロージャとして参照する。
    

これらの方法を使えば、君が直面している「無名関数内で自身の要素を参照したい」という課題を、クリーンに解決できるはずだよ。

---

> [!quote]+ Prompt
> `event.currentTarget`はHTMLElementがEventTargetインターフェースにアップキャストされてしまうと思って、あまりいい気にならないんだけど、これはどうすべき？

うん、その感覚、すごくよくわかる！`event.currentTarget`が`HTMLElement`から`EventTarget`インターフェースにアップキャストされるのは、なんだか型情報が失われてしまって気持ち悪いよね。INFPの君が、型の厳密さや意図の明確さといった、プログラミングの美学を追求しているのが伝わってくるな。

この問題、特にTypeScriptを使っている開発者にとっては共通の悩みだよ。JavaScriptの動的な特性と、型の静的な厳密さを両立させる上での、一種のトレードオフだね。

### なぜ `EventTarget` にアップキャストされるのか？

まず、`EventTarget`は、イベントを待ち受けて処理する、最も**汎用的なインターフェース**なんだ。`HTMLElement`はもちろん、`Document`や`Window`といったオブジェクトも`EventTarget`を実装している。

`event.currentTarget`が`EventTarget`型で返されるのは、**「イベントリスナーが登録される対象は、必ずしも`HTMLElement`とは限らない」**という、JavaScriptの広い仕様を反映しているからなんだ。これにより、すべてのイベントリスナーで共通のAPIを提供できるというメリットがある。

---

### `HTMLElement`として安全に扱うためのベストプラクティス ✨

君の「いい気にならない」という気持ちを解消し、`event.currentTarget`を`HTMLElement`として安全に扱うための方法は、いくつかあるよ。

#### 1. 明示的な型アサーション (`as` / `is` / `instanceof`)

これが最も一般的で、直接的な方法だ。

##### TypeScriptの場合

TypeScriptでは、`as`キーワードを使って型を明示的に指定できる。

TypeScript

```
// 推奨される方法
const button = document.getElementById('button');
if (button) {
    button.addEventListener('click', (event) => {
        // event.currentTarget を HTMLElement として扱うことを明示
        const target = event.currentTarget as HTMLElement;

        // これで target のプロパティやメソッドが安全に使える
        target.style.backgroundColor = 'red';
        target.textContent = 'Clicked!';
    });
}
```

さらに、より厳密さを求めるなら、`if`文で型ガードを設けることもできる。

TypeScript

```
// より厳密な型ガード
button.addEventListener('click', (event) => {
    // currentTargetがHTMLElementのインスタンスであることを確認
    if (event.currentTarget instanceof HTMLElement) {
        const target = event.currentTarget; // このブロック内ではHTMLElement型として推論される
        target.style.backgroundColor = 'blue';
    }
});
```

`instanceof`を使うと、実行時にも型のチェックが行われるため、より堅牢なコードになるよ。

##### JavaScriptの場合

純粋なJavaScriptでも、`@param` JSDocで型を明示し、IDEの恩恵を受けることができる。

JavaScript

```
const button = document.getElementById('button');
if (button) {
    button.addEventListener('click', function(event) {
        /**
         * @type {HTMLElement}
         */
        const target = event.currentTarget;

        // IDEはここで target を HTMLElement として扱ってくれる
        target.style.backgroundColor = 'green';
        target.textContent = 'Clicked!';
    });
}
```

#### 2. アロー関数とクロージャを使う（以前話した方法）

これは、イベントリスナーが登録された要素を、イベントオブジェクトではなく、外側のスコープからクロージャとして参照する方法だね。

JavaScript

```
const buttonElement = document.getElementById('button');
if (buttonElement) {
    buttonElement.addEventListener('click', () => {
        // buttonElement は最初からHTMLElementなので、そのまま使える
        buttonElement.style.backgroundColor = 'yellow';
        buttonElement.textContent = 'Clicked!';
    });
}
```

この方法のメリットは、型を意識する必要がなく、直感的に書けることだね。

#### 3. イベントリスナーを別の関数として定義する

これも、可読性と再利用性を高めるための良い方法だ。

JavaScript

```
/**
 * @param {HTMLElement} element
 * @param {Event} event
 */
function handleButtonClick(element, event) {
    element.style.backgroundColor = 'purple';
    element.textContent = 'Clicked!';
    console.log(event.type);
}

const button = document.getElementById('button');
if (button) {
    // bind() を使って、第一引数に #button 要素自身を渡す
    button.addEventListener('click', handleButtonClick.bind(null, button));
}
```

この方法なら、イベントリスナー関数の引数に直接`HTMLElement`を渡すことができ、関数内では`HTMLElement`として安全に扱える。

### まとめ

君の感じる「いい気にならない」という感覚は、**型の持つ「情報」が失われることへの違和感**だね。

これを解消し、`HTMLElement`として安全に扱うためのベストプラクティスは、以下の通り。

- **TypeScript:** `event.currentTarget as HTMLElement` のように**明示的な型アサーション**を行う。
    
- **JavaScript:** `event.currentTarget` を変数に代入し、`@type {HTMLElement}` のJSDocコメントを付与してIDEの恩恵を受ける。
    
- **両言語共通:** `event.currentTarget` ではなく、クロージャで外部スコープの変数として要素を参照したり、`bind()` を使って引数として要素を渡したりする。
    

これらの方法を使えば、型の安全性を保ちつつ、`event.currentTarget`の汎用的な特性をうまく回避できるはずだよ！

---

> [!quote]+ Prompt
> `addEventListener()`内の無名関数をこっちの書き方`function(){}`で書くと、thisがHTMLElementになるんだけど、これを過信して使用するのは危険？それとも無名関数は再利用することが無いから問題ない？

---

なるほど！ `addEventListener()` 内の無名関数を `function(){}` で書いたとき、`this` がイベントリスナーが登録された `HTMLElement` になること、そしてそれを過信して使うのは危険かどうか、という疑問だね。INFPの君が、JavaScriptの「暗黙的な挙動」と、その安全性を深く探求しているのが伝わってくるな。

結論から言うと、**`addEventListener()`の無名関数内で`this`が`HTMLElement`になる挙動は、標準仕様で定められたものであり、それを理解して使う限りは「危険」ではない**よ。むしろ、それが無名関数で`HTMLElement`を参照する最も伝統的な方法なんだ。

しかし、**「無名関数だから問題ない」と過信して使うのは、少し注意が必要**だ。

### `this`が`HTMLElement`になるのは仕様通り ✨

まず、君の認識は正しいよ。`addEventListener()`のコールバック関数を`function() {}`という伝統的な書き方（関数式）で定義した場合、その関数の**`this`の値は、イベントリスナーが登録された要素（`HTMLElement`）に自動的に設定される**んだ。

これはJavaScriptの設計思想によるもので、イベントハンドラーの中で「イベントが起きたのはこの要素だ！」というコンテキストを簡単に参照できるようにするためだね。

JavaScript

```
document.getElementById('button').addEventListener('click', function() {
  // this は #button 要素自身を指す
  console.log(this.textContent);
  this.textContent = 'クリックされました！';
});
```

この挙動は、JavaScriptの標準仕様で定義されているから、**主要なブラウザでは安定して動作する**し、それ自体を「危険」と見なす必要はないよ。

### 「無名関数だから問題ない」と過信するのは危険？ ⚠️

君の「無名関数は再利用することが無いから問題ない」という考え方には、以下の注意点があるんだ。

1. **「無名」と「`this`のバインディング」は別の問題:**
    
    - 無名関数であることと、その中の`this`が何になるかは、直接の関係はないんだ。
        
    - `function() {}`は、それが無名であろうと有名であろうと、**呼び出され方によって`this`が変わる**という性質（動的な`this`）を持つよ。`addEventListener`が、その呼び出し時に`this`を意図的に`HTMLElement`に設定しているから、その値になっているだけだ。
        
    - もしこの無名関数を別の場所で呼び出すと、`this`は`Window`オブジェクトなど、全く違う値になってしまう可能性があるんだ。
        
    
    JavaScript
    
    ```
    const myButton = document.getElementById('button');
    let myCallback;
    
    myButton.addEventListener('click', function() {
      // この時点ではthisはmyButton
      myCallback = this;
      console.log(this.textContent);
    });
    
    // myCallback を呼び出すと...
    // myCallback(); // この呼び出し方だとエラーになる（myCallbackは関数ではない）
    
    // 正しい呼び出し方でthisが変わる例
    const obj = { name: '別のオブジェクト' };
    myButton.addEventListener('click', function() {
      console.log(this); // myButton
      this.textContent = 'クリックされた！';
      obj.myFunc = this;
    });
    
    // obj.myFunc() は myButton要素ではなく、objをthisとして呼び出される可能性
    // const newFunc = obj.myFunc;
    // newFunc(); // この呼び出し方だとthisはWindowになる
    ```
    
    これは少し複雑だけど、要は「`this`は常に`HTMLElement`である」と安易に決めつけてしまうと、思わぬバグの原因になりうるということだね。
    
2. **アロー関数との混同:**
    
    - 現代のJavaScript開発では、`function() {}` ではなく、アロー関数 `() => {}` が使われることが多いよね。
        
    - アロー関数は`this`を動的にバインドしない。**`addEventListener`のコールバックにアロー関数を使った場合、`this`は`HTMLElement`にはならず、外側のスコープの`this`を継承する**んだ。
        
    
    JavaScript
    
    ```
    document.getElementById('button').addEventListener('click', () => {
      // この時点でのthisは、この関数が定義されたスコープ（通常はWindow）を指す
      console.log(this); // Window
      console.log(this.textContent); // undefined
      // thisは#button要素を指さないため、この書き方は意図した通りに動かないことが多い
    });
    ```
    
    `this`の挙動が、`function()`とアロー関数で全く違うことを理解していないと、意図しない挙動につながってしまう。
    

### 結論とベストプラクティス 💡

`addEventListener()`内の無名関数で`this`を使うこと自体は、その挙動を理解している限り**危険ではない**し、伝統的な書き方としては有効だよ。

しかし、現代のJavaScriptのベストプラクティスでは、`this`の動的な挙動による混乱を避けるために、**`this`の使用を極力避け、`event.currentTarget`を使うことが推奨される**ことが多いんだ。

|方法|`this`の挙動|メリット|デメリット|
|---|---|---|---|
|**`function() {}`**|**`this`が`HTMLElement`になる**|簡潔に書ける、伝統的な方法|`this`が動的で、他の文脈で再利用すると挙動が変わる可能性がある|
|**`event.currentTarget`**|`event`オブジェクトから常に`HTMLElement`が取得できる|`this`のバインディングを気にしなくてよい、安全|`event`引数を受け取る必要がある|
|**アロー関数**|**`this`が固定（親スコープの`this`）**|`this`の挙動が予測可能、コードが簡潔になる|`this`が`HTMLElement`にならないため、`this`で要素を参照したい場合は使えない|

だから、もし君が`function() {}`を使って`this`を参照するなら、「`this`はこのスコープを離れたら何になるかわからない」という意識を持つこと。そして、`event.currentTarget`という、より明示的で安全な方法もあることを頭に入れておくと、より堅牢なコードを書けるはずだよ！