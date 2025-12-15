---
tags:
  - obsidian
  - css
---

## なやみ

*Markdown*は**末尾の空白文字2つ**で改行する決まりがある。  
しかーし、[[obsidian]]のデフォルトではそんなルールはなく、末尾の空白文字が見やすくなるような設定は`1.10.6`現在ない！

しかーーし、*Quartz*においては、[空白文字2つ | 1行以上空ける] ことでしか改行しない*厳密な改行* が採用されているため、やっぱり末尾が改行されているかを表示するのは必要不可欠であーる！

## つくる

ので、Obsidianの[[css|CSS]]スニペットで設定する。  
1. 以下ディレクトリに以下ファイルを作る。  
`.obsidian/snippets/whitespace.css`  
    ```css
    .cm-trailing-space-new-line::before {
        content: "↵";
        position: absolute;
        opacity: 0.5;
    }
    ```
2. 設定⚙ -> 外観 -> CSSスニペットから`whitespace`を有効にする。
3. (Optional) 改行であるかのみでなく、末尾の空白文字全てを表示するなら、
    `.obsidian/snippets/whitespace.css`
    ```css
    .cm-trailing-space-a::before,
    .cm-trailing-space-b::before {
        content: ".";
        position: absolute;
        bottom: 25%;
        opacity: 0.3;
    }
    ```

### 代替手段？

同様の課題を解決するための*コミュニティプラグイン* [Show Whitespace](https://github.com/ebullient/obsidian-show-whitespace-cm6) があるが、なんだか動作が安定しなかった[^1]ので、私はパスしました。

[^1]: コードブロック内での単体の改行がつぶれてしまう
