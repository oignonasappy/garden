---
tags:
  - gemini
  - javascript
  - html
---

> [!quote]+ Prompt
> JavaScriptで、
> querySelector()などで要素を選択した後に、
> その要素の親要素や、以前のテキスト、以後のテキスト要素などを取得する方法はある？

---

よしきた！ JavaScriptでDOM操作するなら、要素の親子関係や兄弟関係をたどるのは必須スキルだよね！ 質問ありがとう！

`querySelector()`などで要素を選択した後に、その要素から**親要素**や**兄弟要素（前後のテキストノード含む）** を取得する方法は、もちろんあるよ！ 一緒に見ていこう！

### 1. 親要素を取得する

選択した要素から親要素を取得するには、いくつかのプロパティがあるよ。

- **`parentNode`**:
    
    - **最も汎用的な親ノードの取得方法。** 親が要素（`Element`）だけでなく、テキストノードやコメントノード、DocumentFragmentなども含む、**すべてのノードタイプ**を返す可能性があるよ。
        
    - 通常、HTML要素の親は別のHTML要素だけど、例えばテキストノードの親を取得したい場合などにも使える汎用性があるんだ。
        
    
    JavaScript
    
    ```
    const childElement = document.querySelector('#child');
    const parent = childElement.parentNode;
    console.log(parent); // <div id="parent">...</div>
    ```
    
- **`parentElement`**:
    
    - **親が`Element`型（つまりHTML要素）の場合にのみ**親要素を返す。親がテキストノードなど要素以外のノードだった場合は`null`を返すよ。
        
    - ほとんどのケースでHTML要素の親要素が欲しい場面が多いから、`parentNode`よりこちらを使うことが多いかも。
        
    
    JavaScript
    
    ```
    const childElement = document.querySelector('#child');
    const parent = childElement.parentElement;
    console.log(parent); // <div id="parent">...</div>
    ```
    
    （`html`要素の親は`null`になるよ）
    
- **`closest(selector)`**:
    
    - **指定したセレクタに合致する最も近い祖先要素**（自身も含む）を返すよ。
        
    - 特定のクラスやIDを持つ親要素を探したい場合に便利！
        
    
    HTML
    
    ```
    <div id="grandparent">
      <div class="container">
        <div id="parent">
          <p id="child">子要素</p>
        </div>
      </div>
    </div>
    ```
    
    JavaScript
    
    ```
    const childElement = document.querySelector('#child');
    const closestContainer = childElement.closest('.container');
    console.log(closestContainer); // <div class="container">...</div>
    
    const closestGrandparent = childElement.closest('#grandparent');
    console.log(closestGrandparent); // <div id="grandparent">...</div>
    ```
    

### 2. 兄弟要素（前後の要素、テキストノード含む）を取得する

これは少し複雑だけど、いくつかのプロパティとメソッドがあるよ。

#### テキストノードも含む「すべてのノード」をたどる場合

要素だけでなく、空白文字や改行などのテキストノードも「ノード」として取得したい場合に使うよ。

- **`previousSibling`**: 直前の兄弟ノードを返す。
    
- **`nextSibling`**: 直後の兄弟ノードを返す。
    
- **`firstChild`**: 最初の子ノードを返す。
    
- **`lastChild`**: 最後の子ノードを返す。
    
- **`childNodes`**: すべての子ノード（NodeList形式）を返す。
    

**例:**

HTML

```
<div id="container">
  テキスト1
  <p id="target">ターゲット</p>
  テキスト2
  <span>スパン</span>
</div>
```

JavaScript

```
const targetElement = document.querySelector('#target');

// 直前の兄弟ノード (ここでは「テキスト1」のテキストノード)
const prevNode = targetElement.previousSibling;
console.log(prevNode); // Textノード ("\n  テキスト1\n  ") - HTMLの改行やスペースもノードになる

// 直後の兄弟ノード (ここでは「テキスト2」のテキストノード)
const nextNode = targetElement.nextSibling;
console.log(nextNode); // Textノード ("\n  テキスト2\n  ")
```

#### 要素ノードだけをたどる場合

余計なテキストノード（特にHTMLの整形による空白や改行）を除外して、純粋なHTML要素だけを対象にしたい場合によく使うよ。

- **`previousElementSibling`**: 直前の兄弟要素を返す。
    
- **`nextElementSibling`**: 直後の兄弟要素を返す。
    
- **`firstElementChild`**: 最初の子要素を返す。
    
- **`lastElementChild`**: 最後の子要素を返す。
    
- **`children`**: すべての子要素（HTMLCollection形式）を返す。
    

**例:**

HTML

```
<div id="container">
  <p>最初の要素</p>
  <span id="targetElement">ターゲット</span>
  <div>最後の要素</div>
</div>
```

JavaScript

```
const targetElement = document.querySelector('#targetElement');

// 直前の兄弟要素 (ここでは <p>要素)
const prevElem = targetElement.previousElementSibling;
console.log(prevElem); // <p>最初の要素</p>

// 直後の兄弟要素 (ここでは <div>要素)
const nextElem = targetElement.nextElementSibling;
console.log(nextElem); // <div>最後の要素</div>
```

### 3. 「以前のテキスト」「以後のテキスト」要素について

ここで言う「テキスト要素」が、純粋に`Text`ノードを指すのか、それともテキストコンテンツを持つ`Element`を指すのかで変わってくるけど、上記の「すべてのノードをたどる場合」のプロパティ（`previousSibling`や`nextSibling`）を使えば、対象の要素の直前・直後のテキストノードを取得できるよ。

もし、そのテキストノードの中身が欲しい場合は、取得したノードの`nodeValue`プロパティを使えばいいんだ。

JavaScript

```
const targetElement = document.querySelector('#target'); // 上の例のHTMLを使う

const prevNode = targetElement.previousSibling;
if (prevNode && prevNode.nodeType === Node.TEXT_NODE) { // テキストノードか確認
  console.log('直前のテキスト:', prevNode.nodeValue.trim()); // trim()で余計な空白を削除
}

const nextNode = targetElement.nextSibling;
if (nextNode && nextNode.nodeType === Node.TEXT_NODE) {
  console.log('直後のテキスト:', nextNode.nodeValue.trim());
}
```

INFPの君は、自己表現やアウトプットを大切にすると言ってたよね。DOM操作をマスターすれば、JavaScriptを使ってWebページをよりダイナミックに、より表現豊かに操作できるようになるから、君のクリエイティブなアイデアを形にするのに役立つはずだよ！ ぜひ色々と試してみてね！