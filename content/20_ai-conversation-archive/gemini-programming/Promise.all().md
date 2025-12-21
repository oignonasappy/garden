---
tags:
  - gemini
  - javascript
---

前回[[ESModuleにて条件を満たすと実行する]]

> [!quote]+ Prompt
wowすごい！できた～  
次に、ある処理があって、その処理が終了すると通知する`Promise`を作りたい  
その処理とは、  
`fetch()`が3つ下並びであり、それぞれが独立して動いている。  
その3つの`fetch()`すべてが完了した時に`resolve()`で通知する  
これはシンプルに書けるかな？  
>
あとちょっと話それるんだけど、  
あなたみたいにコード・コードブロックをメッセージで表したいんだけど、  
そんな感じの機能ある？  
ないならgoogleに言っといて～(笑)  

---

やったー！できたんだね！おめでとう！🎉 それを聞くと私もテンション上がるよ！

さて、次の課題も面白いね！ 3つの独立した`fetch()`が全て完了した時に`resolve()`で通知するPromiseかぁ。これはね、**`Promise.all()`** を使うと、めちゃくちゃシンプルに書けちゃうんだ！

### `Promise.all()` で複数のPromiseの完了を待つ

`Promise.all()` は、引数に渡された複数のPromiseが**全て解決（resolve）されるまで待機し、全て解決されたら自分自身も解決する**っていう、まさにこのシチュエーションにぴったりのメソッドなんだ。もし1つでも拒否（reject）されたら、その時点で全体も拒否されるよ。

コードはこんな感じ！

JavaScript

```javascript
async function fetchAllDataAndNotify() {
  console.log("すべてのデータフェッチ処理を開始します...");

  // 各fetch()のPromiseを配列に入れる
  const fetchPromises = [
    fetch('https://api.example.com/data1').then(response => response.json()),
    fetch('https://api.example.com/data2').then(response => response.json()),
    fetch('https://api.example.com/data3').then(response => response.json())
  ];

  try {
    // Promise.all() で全てのfetchが完了するのを待つ
    // 結果は、それぞれのfetchが解決した値（ここではJSONデータ）の配列として返ってくる
    const allResults = await Promise.all(fetchPromises);

    console.log("すべてのデータフェッチが完了しました！");
    console.log("取得データ:", allResults);

    // ここで、この関数（fetchAllDataAndNotify）のPromiseを解決
    // 外部からこのPromiseを待つ場合、allResults を渡すこともできる
    return allResults; // この関数自体がPromiseを返すので、これがresolveされる
    
  } catch (error) {
    console.error("データフェッチ中にエラーが発生しました:", error);
    // エラーが発生した場合は、この関数（Promise）を拒否する
    throw error; 
  }
}

// 関数の実行と完了の待機
fetchAllDataAndNotify()
  .then(data => {
    console.log("外部: 全てのデータフェッチ処理が完全に終了しました。次の処理に進みます。", data);
    // 全てのデータが揃った後の次の処理をここに書ける
  })
  .catch(error => {
    console.error("外部: 処理全体でエラーが発生しました:", error);
  });
```

**解説：**

1. **`fetchPromises`配列:** 3つの`fetch()`呼び出しを、それぞれ`then(response => response.json())`でJSONパースするPromiseとして配列に入れているよ。
    
2. **`Promise.all(fetchPromises)`:** この部分がミソ！ この行で、`fetchPromises`配列内の全てのPromiseが解決されるまで`await`で待機するんだ。
    
3. **`allResults`:** 全ての`fetch`が成功すると、`allResults`にはそれぞれの`fetch`から返ってきたJSONデータの配列が入るよ。
    
4. **`try...catch`:** `Promise.all()`は、引数の一つでもPromiseが拒否されたら、その時点で全体のPromiseも拒否されるから、`try...catch`でエラーハンドリングしておくのが大切！
    

これなら、シンプルかつパワフルに複数の非同期処理の完了を待てるよね！

### あなたみたいにコード・コードブロックをメッセージで表したいんだけど、そんな感じの機能ある？

うわー！私みたいにコードやコードブロックを表示したいって思ってくれてるんだね！ めっちゃ嬉しい！✨

君が言ってるのは、いわゆる**「マークダウン（Markdown）」**っていう記法のことだよ！ 私が使ってるのはまさにこれで、テキストを装飾したり、コードをきれいに表示したりするのに使われるんだ。

具体的な記法はこんな感じ！

- コードブロック:
    
    行頭にバッククォートを3つ（ ）続けて、その後に言語名（javascriptとかhtmlとか）を書いて、改行。コードを書いて、最後にまたバッククォートを3つ（ ）書く。
    
    JavaScript
    
    ```js
    // JavaScriptのコードだよ！
    console.log("ハローワールド！");
    ```
    
- インラインコード（行の中に短いコードを入れる時）:
    
    バッククォート1つ（ ）で囲むだけ。
    
    例えば、console.log()って書くときとかね。
    

この記法は、GitHubのREADMEとか、技術ブログとか、チャットツールとか、本当にいろんなところで使われてるから、覚えておくとめっちゃ便利だよ！ プログラマーとして、これからのアウトプットにきっと役立つはず！

「ないならGoogleに言っといて～(笑)」

フフフ、任せてくれ！ 君のその熱い要望、しっかり心に刻んだぜ！ いやもう、君はすでにMarkdownを使いこなせるようになる準備ができたも同然だから、ガンガン使ってみて、私みたいにコードをビシッと表現しちゃおう！

INFPの君が、自己表現を通して、より楽しくプログラミングライフを送れるように、これからも全力で応援するからね！ またいつでも質問してきてくれ！