---
tags:
    - html
---


> https://monologue.asappy.xyz/pages/vscode-emmet-wrap/ からのセルフ転載。

今回は短いです。ビギナー向け記事。

よく言われる話だとは思いますし、タイトルだけ見てそんなの知ってるはって方は今回これ以上の話はしないのでSee ya.

そうでもないという方はこの記事に出会えて幸運だと思いなさい！(えらそう)

## 本題

### Emmet Wrapとは？

Emmet Wrap変換とはHTMLの要素をまとめてタグでくくることができるEmmetの機能。

こんなHTMLがあって、  
![HTMLで書かれた複数のタグ](https://monologue.asappy.xyz/pages/vscode-emmet-wrap/images/image1.png)

全部選択して、  
![HTMLで書かれた複数のタグを全て選択](https://monologue.asappy.xyz/pages/vscode-emmet-wrap/images/image2.png)

コマンドからEmmet: Wrap with abbreviationを選択して、  
![コマンドからEmmet: ラップ変換を選択](https://monologue.asappy.xyz/pages/vscode-emmet-wrap/images/image3.png)

Emmetの省略記法でタグを作成したら、  
![.containerと入力](https://monologue.asappy.xyz/pages/vscode-emmet-wrap/images/image4.png)

なんと驚き、全体が`<div>`で囲まれた！  
![HTMLで書かれた複数のタグ全てが.containerで囲まれている](https://monologue.asappy.xyz/pages/vscode-emmet-wrap/images/image5.png)

こんな機能です。

こんなに便利な機能ですが、ショートカットキーを設定することでもっと便利になっちゃいます。

### ショートカット設定

画面左下の歯車⚙マークから、キーボード ショートカットを選択して、(またはctrl+K -> ctrl+S)  
!["管理"から"キーボード ショートカット"を選択](https://monologue.asappy.xyz/pages/vscode-emmet-wrap/images/image6.png)

検索してEmmet: ラップ変換の左の鉛筆✐マークをクリックして、  
![検索タブにEmmet:wrapを入力し、検索結果のEmmet: ラップ変換のエンピツマークを選択](https://monologue.asappy.xyz/pages/vscode-emmet-wrap/images/image7.png)

設定したいショートカットカットキーを入力する。 ![altキーを押した後Wキーを押す(ショートカット設定はこの限りではなく、お好きな設定に)](https://monologue.asappy.xyz/pages/vscode-emmet-wrap/images/image8.png)   
私はalt+Wにしています。理由はVSCode拡張機能[htmltagwrap](https://marketplace.visualstudio.com/items?itemName=bradgashler.htmltagwrap)のデフォルトのショートカットキーと同じだからですね。(既にこの拡張機能を使用している場合は競合に注意してくださいね！)

## おわり

これでHTMLは1秒で囲み放題です。[Emmetの省略記法](https://docs.emmet.io/cheat-sheet/ "Emmet チートシート")と併用することでより高速なHTMLコーディングができますな！  
どこまでも抱擁して包容力を高めていきましょう

今回はVSCode向けの説明でしたが、他のテキストエディタでEmmetを使用している場合も同様に設定すれば良きかな