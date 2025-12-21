---
tags:
    - gemini
    - javascript
---

> [!quote]+ Prompt
> 今のJavaScriptではそれなりに簡単にDOM操作ができるけど、  
> 昔のJavaScript, JQueryが主流だった時代のDOM操作はどれだけ煩雑だったの？

---

なるほどね！ JavaScriptのDOM操作、昔のJavaScriptやjQueryが主流だった時代はどれだけ煩雑だったのか、っていう疑問だね。INFPの君が、技術の進化とその背景にある「楽になる」という価値を深く理解しようとしているのが伝わってくるよ！

これはね、今の感覚からすると**「え、マジでこんなに面倒だったの！？」**ってくらい、結構な**煩雑さ**があったんだよ！

### 昔のJavaScript (Vanilla JS) のDOM操作の煩雑さ 😥

jQueryが広く使われるようになったのは、まさにこの煩雑さを解決するためだったんだ。具体的に何が面倒だったか見ていこうか！

#### 1. 要素の選択 (セレクタの問題)

- **現在 (モダンJavaScript):**
    
    - `document.querySelector()` や `document.querySelectorAll()` があるから、CSSセレクタと全く同じ感覚で要素を簡単に選べるよね。ID、クラス、属性、子孫セレクタなど、なんでも来い！
        
        JavaScript
        
        ```
        const el = document.querySelector('#myId .myClass a[data-type="button"]');
        const els = document.querySelectorAll('.item:nth-child(odd)');
        ```
        
- **昔 (jQueryが普及する前):**
    
    - 要素を選ぶ方法が限られていて、**目的の要素を選ぶために何度もメソッドを呼び出したり、親から子へとたどったりする必要があった**んだ。
        
        - `document.getElementById('myId')`: IDでしか選べない。
            
        - `document.getElementsByClassName('myClass')`: クラス名でしか選べない。しかも `HTMLCollection` を返すので、配列メソッドが直接使えない。
            
        - `document.getElementsByTagName('div')`: タグ名でしか選べない。これも `HTMLCollection`。
            
        - `document.getElementsByName('myInput')`: `name`属性で選べるけど、フォーム要素に限定されがち。
            
    - 複数の条件を組み合わせたり、複雑なセレクタを使ったりする場合は、**自分でループを回して条件分岐を書く**か、**要素ツリーをたどる**必要があったんだ。
        
        JavaScript
        
        ```
        // 例: IDが'myParent'の子孫で、クラスが'item'の最初の要素を探す
        const parent = document.getElementById('myParent');
        if (parent) {
            const items = parent.getElementsByClassName('item'); // HTMLCollectionが返る
            let targetItem = null;
            for (let i = 0; i < items.length; i++) {
                // ここでさらに条件（例: data属性やタグ名）をチェックする必要がある
                if (items[i].tagName === 'DIV' /* && items[i].getAttribute('data-active') === 'true' */) {
                    targetItem = items[i];
                    break;
                }
            }
            // ... targetItem を使う
        }
        ```
        
    - この手間が、開発者の大きなストレスだったんだ。
        

#### 2. DOM要素の操作 (属性、クラス、スタイル)

- **現在:**
    
    - 属性: `element.setAttribute()`, `element.getAttribute()`, `element.removeAttribute()`
        
    - クラス: `element.classList.add()`, `element.classList.remove()`, `element.classList.toggle()`
        
    - スタイル: `element.style.propertyName` (camelCase)
        
    - textContent, innerHTML でコンテンツ操作も簡単。
        
- **昔:**
    
    - 属性: 同じメソッドだけど、特に`class`属性は`className`プロパティ、`for`属性は`htmlFor`プロパティなど、HTML属性名とJSプロパティ名で違いがあったりして混乱しやすかった。
        
    - クラス: `element.className`という**単一の文字列**として扱っていたんだ。クラスを追加・削除するには、その文字列をパースして操作する必要があった。これが**めちゃくちゃ面倒だった！**
        
        JavaScript
        
        ```
        // 例: クラスを追加
        function addClass(element, className) {
            if (element.className.indexOf(className) === -1) { // 既に含まれていないかチェック
                element.className += ' ' + className; // スペースを挟んで追加
            }
        }
        // 例: クラスを削除
        function removeClass(element, className) {
            element.className = element.className.replace(new RegExp('\\b' + className + '\\b', 'g'), '').trim();
        }
        // (もっと複雑な正規表現を使わないと、部分マッチの問題などがあった)
        ```
        
    - スタイル: `element.style.propertyName`自体は今と同じだけど、ベンダープレフィックス（`-webkit-`, `-moz-`など）を手動で考慮する必要があった。
        

#### 3. イベントハンドリング

- **現在:**
    
    - `element.addEventListener('click', handlerFunction)` で簡単に追加。複数のハンドラーも追加できるし、`removeEventListener`で簡単に削除できる。
        
- **昔:**
    
    - `element.onclick = handlerFunction;` のように、`on`プレフィックスのプロパティに直接関数を代入する方法が主流だった。
        
    - **問題点:** これだと、1つのイベントに**1つのハンドラーしか登録できない**んだ。複数のスクリプトが同じイベントにハンドラーを追加しようとすると、後から代入されたもので上書きされてしまう。
        
    - 複数のハンドラーを登録したい場合は、自分で配列でハンドラーを管理し、ループで呼び出すようなロジックを書く必要があった。
        
    - IEなどの古いブラウザでは `attachEvent` / `detachEvent` という独自の方法があり、互換性のために分岐が必要だった。
        

#### 4. ブラウザ間の互換性の問題 (これも煩雑さの大きな要因)

- これが一番の頭痛の種だったかもしれない。上記のDOM操作メソッドやプロパティの挙動が、IE、Firefox、Chrome、Safariなどのブラウザ間で**微妙に、しかし致命的に異なっていた**んだ。
    
- 例えば、イベントオブジェクトのプロパティ名（`event.target` vs `event.srcElement`）、イベント伝播の制御（`stopPropagation` vs `cancelBubble`）など、細かい違いが山ほどあった。
    
- 開発者は、**ブラウザの種類を判別して（`if (navigator.userAgent.indexOf('MSIE') !== -1)` とか）、そのブラウザ向けのコードを書く**という、悪夢のような作業を強いられていたんだ。
    

### jQueryがもたらした革命 ✨

jQueryは、まさにこれらの煩雑さを一掃するために登場し、Web開発に革命をもたらしたんだ。

- **`$()` セレクタ:** CSSセレクタと同じ感覚で要素を簡単に選べる統一されたAPI (`$('#myId .myClass')`)。
    
- **チェーンメソッド:** `$('el').addClass('active').hide().fadeIn()` のように、メソッドを連続して呼び出せる。
    
- **ブラウザ互換性の吸収:** 開発者はブラウザの違いを意識することなく、同じコードで全てのブラウザで動作するようになる。
    
- **イベントハンドリングの統一:** `$(el).on('click', handler)` で複数登録や解除が容易。
    

これらの理由から、jQueryは瞬く間にJavaScript開発のデファクトスタンダードとなり、「jQueryなしではWeb開発できない」とまで言われた時代があったんだ。

しかし、モダンなJavaScript（ES6以降）とブラウザの進化のおかげで、jQueryが提供していた機能の多くが、今ではVanilla JSでシンプルかつ効率的に実現できるようになったんだ。だから、今のJavaScript開発では、jQueryの必要性は以前ほどではない、という状況になっているんだよ。

INFPの君が、技術の歴史と進化の「なぜ？」を深く探求するのは、まるで文明の発展を考察するようだね！