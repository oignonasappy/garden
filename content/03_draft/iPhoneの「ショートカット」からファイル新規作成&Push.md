## 今回のゴール
1. ショートカットの入力からMarkdownファイル名・ファイル内容を入力
2. GithubのAPIを叩く
3. リポジトリの特定ディレクトリ内にファイルが新規作成される

## 手順

### トークンを発行
1. GitHubにログインして `Settings` -> `Developer settings` -> `Personal access tokens` -> `Tokens (classic)` に行く。
2. Generate new token (classic) をクリック。
3. Note: 「iPhone Shortcut」とか分かりやすい名前で。
4. Expiration: 期限はお好みで（テストなら30日とか）。
5. Scopes: repo (Full control of private repositories) にチェックを入れる。  
6. 生成されたトークン（ghp_から始まる文字列）をコピーして、iPhoneのメモ帳などに一時保存しておく。

### ショートカットを作成
(あくまで一例。自分好みにカスタマイズするもよし)  
(値を[]で囲みます)  
> [!todo] あとでちゃんとMermaidを書く

```mermaid
flowchart TD
    %% ノードのスタイル定義
    classDef startend fill:#f9f,stroke:#333,stroke-width:2px,color:black;
    classDef process fill:#e1f5fe,stroke:#0277bd,stroke-width:2px,color:black;
    classDef critical fill:#fff9c4,stroke:#fbc02d,stroke-width:4px,color:black;
    classDef api fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px,color:black;
    classDef github fill:#24292e,stroke:#fff,stroke-width:2px,color:white;

    Start([📱 ショートカット起動]):::startend --> Input1[/"📝 入力を要求 (Input: メモの内容)"/]:::.process
    
    Input1 --> Date["📅 現在の日付を取得 (Format: yyyy-MM-dd-HHmmss)"]:::process

    %% 並列処理の表現
    Date --> URL_Step
    Date --> Content_Step

    subgraph URL_Logic [URL構築ロジック]
        direction TB
        URL_Step["🔗 テキスト結合 (BaseURL + 日付 + .md)"]:::process
        URL_Step --> Cast_URL["⚡️ 変数の型を『URL』に指定 (※拡張子消失を防ぐ重要設定)"]:::critical
    end

    subgraph Payload_Logic [ペイロード生成ロジック]
        direction TB
        Content_Step["📄 Markdown結合 (Frontmatter + Input)"]:::process
        Content_Step --> Base64[🔒 Base64エンコード]:::process
        Base64 --> JSON["📦 JSON辞書作成 { message: '...', content: 'Base64...' }"]:::process
    end

    %% 合流してリクエスト
    Cast_URL --> Request
    JSON --> Request

    Request[["🚀 URLの内容を取得 (Method: PUT, Headers: Auth, UA)"]]:::api
    
    Request --> GitHub[(🐱 GitHub API)]:::github
    
    GitHub -- Response JSON --> Check{ステータスコード確認}
    Check -- 201 Created --> Success([✅ 完了通知]):::startend
    Check -- 4xx / 5xx --> Error([❌ エラー表示]):::startend
```

