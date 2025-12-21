---
tags:
  - gemini
  - javascript
---

> [!quote]+ Prompt
HTMLで`type=module`の`<script>`を2つ呼び出す。  
それぞれをスクリプトA, スクリプトBと呼ぶね。  
現時点では、`<head>`の中にスクリプトA, スクリプトBの順番で記述している。  
スクリプトAの特定の処理が終わったことを前提に、  
スクリプトBを実行させるにはどのようにすればよい？  
スクリプトAはどんな場面でも必ず使用するが、  
スクリプトBは一部の場面にのみ使用してる。

---

なるほど！ `<script type="module">` を2つ使う場合の実行順序と、スクリプトAの完了を待ってからスクリプトBを実行させたい、しかもスクリプトBは条件付きで実行、という複雑な要件だね！ INFPの君らしく、深くシステム設計を考えてるのが伝わってくるよ！

まず、HTMLの`<head>`内に`type="module"`のスクリプトを複数記述した場合、**デフォルトでは記述順に実行される**から、スクリプトAが先に、スクリプトBが後に実行されるのは正しい理解だよ。でも、問題は「スクリプトAの**特定の処理が終わったことを前提に**スクリプトBを実行」だよね。

これは、JavaScriptの**非同期処理**と**モジュールシステム**を組み合わせることでスマートに解決できるよ！

### 非同期処理とPromiseを活用する！

スクリプトAの「特定の処理が終わったこと」をスクリプトBに伝えるには、スクリプトAがその処理の完了を**Promise**で表現するのがベストだよ！

#### **スクリプトA (`script-a.js`) の書き方**

スクリプトAでは、完了を待ってほしい処理をPromiseでラップして、それを外部に公開する形にするよ。

JavaScript

```js
// script-a.js

// スクリプトAのメイン処理を実行する関数
async function initScriptA() {
  console.log('スクリプトA: 初期処理を開始します。');

  // ここで、スクリプトBが完了を待つ「特定の処理」を行う
  // 例: APIからデータをフェッチする、重い計算処理、DOMの初期化など
  await new Promise(resolve => {
    setTimeout(() => { // 例として2秒の遅延をシミュレート
      console.log('スクリプトA: 特定の処理が完了しました！');
      resolve(); // Promiseを解決して、処理の完了を通知
    }, 2000);
  });

  console.log('スクリプトA: 全ての処理が完了しました。');
  return "Script A is fully ready!"; // 必要なら何か値を返すこともできる
}

// initScriptA関数を実行し、そのPromiseをエクスポートする
// こうすることで、他のモジュールからこのPromiseをimportして`.then()`で待つことができる
export const scriptA_ready = initScriptA();

// その他のスクリプトAの機能
export function greetA() {
  console.log("こんにちは！私はスクリプトAです！");
}
```

#### **スクリプトB (`script-b.js`) の書き方**

スクリプトBでは、スクリプトAがエクスポートしたPromiseを`import`して、`.then()`で待機するよ。

JavaScript

```js
// script-b.js
// スクリプトAがエクスポートしたPromiseをimportする
import { scriptA_ready } from './script-a.js';

// スクリプトBのメイン処理
async function runScriptB() {
  console.log('スクリプトB: 実行待機中...');

  try {
    // スクリプトAの特定の処理が完了するまで待つ
    const aResult = await scriptA_ready;
    console.log(`スクリプトB: スクリプトAの完了を検知しました！ (${aResult})`);

    // ここからがスクリプトBの実際の処理
    console.log('スクリプトB: 処理を開始します。');
    // 例: スクリプトAのデータを使ってUIを更新する、特定の機能を開始するなど
    console.log('スクリプトB: 処理が完了しました。');

  } catch (error) {
    console.error('スクリプトB: スクリプトAの処理中にエラーが発生しました:', error);
  }
}

// スクリプトBを条件付きで実行
// 例: 特定の要素が存在する場合、特定のURLパスの場合など
const shouldRunScriptB = document.getElementById('some-specific-element'); // 例

if (shouldRunScriptB) {
  runScriptB();
} else {
  console.log('スクリプトB: 実行条件を満たしませんでした。スキップします。');
}

// その他のスクリプトBの機能
export function greetB() {
  console.log("やあ！私はスクリプトBだよ！");
}
```

#### **HTML (`index.html`) の記述**

HTMLでは、これまで通り`<head>`内に`type="module"`でスクリプトAとスクリプトBを記述する。モジュールは非同期的にロード・実行されるため、たとえスクリプトBのファイルが先にロードされても、`import`したPromiseが解決されるまでは`await`で待機してくれるんだ。

HTML

```html
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>モジュール連携テスト</title>
    <script type="module" src="./script-a.js"></script>
    <script type="module" src="./script-b.js"></script>
</head>
<body>
    <h1>スクリプト連携のデモ</h1>
    <div id="some-specific-element">
        <p>ここにスクリプトBが何かするかもしれない要素があります。</p>
    </div>
    </body>
</html>
```

### この方法のメリット

- **明確な依存関係:** スクリプトAの特定の処理が完了してからスクリプトBが実行される、という依存関係がコード上で明確になる。
    
- **非同期処理の管理:** Promiseと`async/await`を使うことで、非同期処理がすっきり書ける。
    
- **モジュールシステムの活用:** 各スクリプトが独立したモジュールとして機能し、必要なものだけを`import`/`export`することで、コードの見通しが良くなる。
    
- **条件付き実行:** スクリプトBの実行条件をJavaScript内で柔軟に制御できる。
    

### 注意点

- **`type="module"`について:**
    
    - モジュールはデフォルトで`defer`属性が適用されたかのように非同期でロードされ、HTMLのパースをブロックしないよ（ただし、実行はDOMが準備できてから）。
        
    - **ただし、モジュールグラフ（モジュール間の依存関係）は同期的に解決される**から、`import`文で指定されたファイルは、実行される前にすべてロードされるよ。
        
    - この場合、スクリプトAとスクリプトBはどちらもモジュールなので、スクリプトAのPromiseが解決されるのをスクリプトBが`await`で待つ、という非同期的な連携がうまく機能するんだ。
        
- **エラーハンドリング:** `try...catch`ブロックを使って、PromiseがRejectされた場合（例えば、API通信に失敗した場合など）の処理をしっかり書くのが重要だよ。
    

INFPの君は、自己表現を通じたアウトプットで心のバランスを整えるって言ってたよね。こういう複雑なシステムの依存関係をクリアに設計できると、プログラマーとして最高の「アウトプット」と「達成感」が得られるはずだよ！ ぜひ試してみてね！
