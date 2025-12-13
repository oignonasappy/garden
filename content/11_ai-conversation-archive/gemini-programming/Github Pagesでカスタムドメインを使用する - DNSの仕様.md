---
tags:
  - gemini
  - git
  - infrastructure
---

> [!quote]+ Prompt
> github pagesのカスタムドメインについて…  
> github pagesで従来のuser.github.io/blogからblog.mydomain.comへカスタムドメインを設定し、  
> DNSプロバイダからblog.mydomain.comからuser.github.ioへのCNAMEのDNSレコードを設定した。  
> その後、どちらのドメインへアクセスした場合でも、urlにはblog.mydomain.comが表示される。  
> ここでは何が起きている？  
> また、user.github.io/blogへのリクエストを送る場合とblog.mydomain.comへリクエストを送る場合ではどのような違いがある？

それはGitHub Pagesの**「強制リダイレクト（Enforced Redirect）」**機能が完璧に動作している状態だね！🎉

君の設定は正しく、DNSとGitHub側の設定が見事に連携している証拠だ。

ここで起きている現象と、リクエストの裏側で起きている技術的な違いを、情報工学を学ぶ君向けに**HTTPプロトコル**と**DNS解決**のレベルで解説するよ！

---

## 🧐 1. 何が起きている？：正規化と301リダイレクト

どちらのURLにアクセスしても `blog.mydomain.com` が表示される現象は、GitHub Pagesのサーバーが**「URLの正規化（Canonicalization）」**を行っているからだ。

### メカニズム

1. **設定の検知**: 君がGitHubのリポジトリ設定でカスタムドメイン（`blog.mydomain.com`）を設定した瞬間、GitHubのロードバランサ（サーバー）は、「このリポジトリの正当な住所（Canonical URL）は `blog.mydomain.com` である」と記憶する。
    
2. **アクセスの検知**: ユーザーが旧アドレス（`user.github.io/blog`）にアクセスしてくると、サーバーは「あ、このリポジトリは引越し済みだ」と判断する。
    
3. **強制転送**: サーバーはコンテンツ（HTML）を返す代わりに、**HTTPステータスコード `301 Moved Permanently`** を返し、ブラウザに「新しい住所（`blog.mydomain.com`）へ行きなさい」と命令する。
    

**なぜこれをするの？**

- **SEO（検索エンジン最適化）のため**: 同じコンテンツが2つの異なるURLで存在すると、検索エンジンが「重複コンテンツ」とみなし、評価が分散してしまう（カニバリゼーション）。これを防ぐため、一つのURLに統一しているんだ。
    

---

## ⚡ 2. リクエストの違い：パケットの旅路

ここが一番面白いところだ！ユーザーがブラウザにURLを打ち込んだ時、裏側で起きている通信フローは全く異なるよ。

### パターンA：`user.github.io/blog` へリクエストした場合

**（2往復の旅：リダイレクト発生）**

1. **DNS解決**: ブラウザは `user.github.io` のIPアドレスを引く。
    
2. **HTTPリクエスト (1回目)**:
    
    - `GET /blog HTTP/1.1`
        
    - `Host: user.github.io`
        
3. **サーバーの応答**: GitHubサーバーは設定を見て、301を返す。
    
    - `HTTP/1.1 301 Moved Permanently`
        
    - `Location: https://blog.mydomain.com/`
        
4. **ブラウザの再アクション**: ブラウザはLocationヘッダを見て、自動的に新しいURLへリクエストを投げ直す（ここからパターンBへ合流）。
    

### パターンB：`blog.mydomain.com` へリクエストした場合

**（1往復の旅：直接解決）**

1. **DNS解決 (CNAMEチェーン)**:
    
    - ブラウザ「`blog.mydomain.com` のIPは？」
        
    - DNS「それは `user.github.io` の別名（CNAME）だよ」
        
    - ブラウザ「じゃあ `user.github.io` のIPは？」→ IPを取得（GitHubのサーバーIP）。
        
2. **HTTPリクエスト**:
    
    - `GET / HTTP/1.1` （※サブドメイン運用の場合、パスが変わることがある）
        
    - `Host: blog.mydomain.com` (**ここが重要！**)
        
3. **サーバーの応答**:
    
    - GitHubサーバーは `Host` ヘッダを見る。
        
    - 「お、`blog.mydomain.com` 宛てのリクエストだな。このドメインに関連付けられたリポジトリの中身を表示しよう」
        
    - `HTTP/1.1 200 OK` （HTMLボディを返す）
        

---

## 🔑 まとめ：技術的な差異

|**項目**|**旧URL (user.github.io/blog)**|**新URL (blog.mydomain.com)**|
|---|---|---|
|**DNS解決**|直接Aレコード（またはCNAME）を解決|CNAMEを経由して解決|
|**Hostヘッダ**|`user.github.io`|`blog.mydomain.com`|
|**HTTPステータス**|**301** (リダイレクト)|**200** (成功)|
|**ラウンドトリップ**|**2回** (遅延がわずかに発生)|**1回** (最速)|
|**サーバーの挙動**|Locationヘッダを返して追い返す|コンテンツを生成して返す|

君の設定は、ユーザーが古いブックマークからアクセスしてきても自動的に正しい場所へ誘導し、かつSEO的にも正しい評価を得られる、**最も理想的な状態**になっているよ！自信を持って運用してね！🚀


> [!quote]+ Prompt
> ならば、ここで問題になるのが、今までuser.github.io/blogで運用していたページをblog.mydomain.comへ移行したときのルートの変化か。  
> もしPATHの書き方を`/blog/resources/image.png`のように書いていた場合、ドメインの変化が発生すると壊れるね？  
> しかし、`https://user.github.io/blog/resources/image.png`のような書き方であれば壊れない。

その現象の分析は**非常に鋭い**よ！そして、その問題は**プロジェクトサイトのカスタムドメイン移行**で開発者が必ず直面する、最も古典的な課題なんだ！🚀

君の分析は概ね正しいけど、問題の**パスの種類の解釈**を明確にすることで、解決策が見えてくるよ。

---

## 🔑 1. なぜPATHの書き換えが必要か？

問題の核心は、**デプロイの構造変化**にあるんだ。

|**項目**|**旧URLでの役割 (user.github.io)**|**新URLでの役割 (https://www.google.com/url?sa=E&source=gmail&q=blog.mydomain.com)**|
|---|---|---|
|**`/blog/`**|**リポジトリのベースディレクトリ**|**サブディレクトリ**（単なるフォルダ名）|
|**`resources/image.png`**|`/blog/`からの相対パス|`/blog/`からの相対パス|

### 🚨 なぜ `/blog/...` が壊れるのか？

君が挙げたパス `/blog/resources/image.png` は、**ルートからの絶対パス**（Root-Relative Path）と呼ばれるものだよ。

1. **旧環境**: `https://user.github.io/blog/` がサイトの**ベースURL**。
    
    - ブラウザは `/blog/resources/image.png` を `https://user.github.io` **のルートから**解決し、`user.github.io/blog/resources/image.png` に到達する。
        
2. **新環境**: `https://blog.mydomain.com/` がサイトの**ルートURL**になる。
    
    - ブラウザは `/blog/resources/image.png` を `https://blog.mydomain.com` **のルートから**解決しようとする。
        
    - 結果: **`https://blog.mydomain.com/blog/resources/image.png`** を要求するが、GitHub Pagesは `blog.mydomain.com` のルート直下に `resources` を期待しているため、この `blog` フォルダが見つからず**404 Not Found**となる。
        

つまり、**`/blog/`というパスの部分が、リポジトリ名からドメインのルートに変わった**ために、パスが壊れるんだ。

### ✅ なぜ絶対URL (`https://user.github.io/...`) が壊れないのか？

`https://user.github.io/blog/resources/image.png` のような**完全修飾URL（Fully Qualified URL）**は、ドメインがカスタムドメインに変わっても壊れない。

- **理由**: ブラウザに対して「**ドメイン名も含めて**ここへ行け」と指示しているため、カスタムドメインの設定を完全に無視し、元のGitHubのホスティングサーバーに直接リクエストを送り続けるからだ。
    
- **デメリット**: これではカスタムドメインを使う意味がなく、画像リクエストだけが常にリダイレクトを経て元のサーバーに飛び、**速度とSEO的にマイナス**になる。
    

---

## 🛠️ 2. ベストプラクティスによる解決策

この問題を解決し、**すべてのパスを一発で解決**できるようにするベストな方法は2つあるよ。

### A. ドキュメント相対パス (Document-Relative Path) を使う

最もシンプルで堅牢な方法。HTMLファイルがどこにあっても、そのHTMLファイルからの相対的な位置を示す。

- **例**: `index.html`と同じディレクトリにある画像の場合 $\rightarrow$ **`resources/image.png`**
    
- **例**: ひとつ上のディレクトリにある画像の場合 $\rightarrow$ **`../image.png`**
    
- **メリット**: どのドメイン、どのパス階層でデプロイされても、HTMLファイルと画像ファイルの位置関係が変わらない限り、絶対に壊れない。
    

### B. `<base>`タグを使う（推奨）

これがカスタムドメイン移行時の最もクリーンな解決策だよ。

HTMLの`<head>`タグ内に、**サイトの基点（ベースURL）**を指定する。

HTML

```
<base href="https://blog.mydomain.com/"> 
```

- **効果**: HTML内の全ての相対URL（`/resources/image.png`など）は、この`<base>`タグで指定されたURLを**ルート**として解決されるようになる。
    
- **メリット**: コード内のパスをいじる必要がなくなり、**カスタムドメインのルート直下**から画像やリソースを探してくれるようになるため、パスの管理が劇的にシンプルになるよ！


> [!quote]+ Prompt
> そういえば、CNAMEレコードでsub.mydomain.comからmydomain.comへリダイレクトするようにしたならば、sub.mydomain.comは、mydomain.comのIPアドレスを利用して、mydomain.comにsub.mydomain.comの処理をさせるようにするということになる？

その理解は、**DNSの仕組みとWebサーバーの動作**に関する洞察として**完全に正しい**よ！🎉

君の推測通り、CNAMEレコードを設定することで、以下の2つのことが実現しているんだ。

1. **IPアドレスの共有**: `sub.mydomain.com` は、`mydomain.com` と**同じIPアドレス**を利用する。
    
2. **サーバーの処理**: `mydomain.com` のIPアドレスで待ち受けている**同じWebサーバー**が、`sub.mydomain.com` へのリクエストも処理することになる。
    

---

## 🔑 サーバーがドメインを識別する仕組み

CNAMEによって複数のドメイン名が同じIPアドレスを指すとき、Webサーバー（ApacheやNGINXなど）が**「どのドメイン宛てのリクエストか」**を識別するために利用するのが、**Hostヘッダー**だよ。

### 1. DNSレベルの解決 (CNAMEの役割)

- ブラウザが `sub.mydomain.com` のIPアドレスを問い合わせる。
    
- DNSサーバーは CNAME レコードを見て、**「これは `mydomain.com` の別名だ」**と返す。
    
- ブラウザは最終的に `mydomain.com` のIPアドレスを取得する。
    

### 2. HTTPレベルの識別 (Hostヘッダーの役割)

- ブラウザは、取得したIPアドレスに接続するが、その際にHTTPリクエストに必ず**Hostヘッダー**を付ける。
    
    - **リクエスト例**: `Host: sub.mydomain.com`
        
- Webサーバーは、そのIPアドレスで待ち受けているが、届いたリクエストの**Hostヘッダー**を確認する。
    
- サーバーは、自身の設定ファイル（Apacheの**Virtual Host**やNGINXの**Server Block**）を参照し、Hostヘッダーが `sub.mydomain.com` に一致する設定に基づいてコンテンツを処理・応答するんだ。
    

### 💡 CNAMEは「リダイレクト」ではない！

君がこの設定を「リダイレクト」として使っているかもしれないけど、厳密に言えば、**CNAMEはDNSレベルでの「別名（エイリアス）」**であり、ブラウザを別のURLへ転送する**HTTPリダイレクト（301/302）**とは異なるよ。

CNAMEは**同じコンテンツを複数の名前で表示させる**ために使われる一方、もし `sub.mydomain.com` にアクセスしたら、URL欄を `mydomain.com` に変えたい場合は、サーバー側で**HTTP 301リダイレクト**を設定する必要があるんだ。


> [!quote]+ Prompt
> 再びDNSの話だけど、www.mydomain.comおよびmydomain.comにアクセスした際に、Github Pagesのuser.github.io/userのindex.htmlを表示するときの正しい設定は？  
> 特に、この場合にアクセスした際の最終的に表示されるURLはどれが最適か？  
> また、DNSレコードの設定と、Github Pages側から設定するドメインはwww.mydomain.comとmydomain.comのどちらか？

これはWebサイト運営で**最も躓きやすいポイント**の一つだけど、ここを理解すればドメインマスターになれるよ！🚀

結論から言うと、GitHub Pagesは**「wwwあり」と「wwwなし（Apex）」のどちらか一方を「正規（Canonical）」として設定し、もう片方を自動的にリダイレクトさせる**という賢い機能を持っているんだ。

それぞれの設定の正解と、最適解について整理するね！

---

## 🎯 1. 最終的に表示されるURLの最適解

**最適解：** **`www.mydomain.com` を正規（メイン）にするのが、技術的に最もトラブルが少ないよ。**

- **理由**: DNSの仕様上、ルートドメイン（`mydomain.com`）にCNAMEを設定することは非推奨（または多くのプロバイダで不可）とされているため、ルートには固定IP（Aレコード）を設定する必要がある。一方、`www` などのサブドメインはCNAMEで柔軟に管理できる。
    
- **挙動**:
    
    - ユーザーが `mydomain.com` にアクセス $\rightarrow$ 自動で `www.mydomain.com` にリダイレクト。
        
    - ユーザーが `www.mydomain.com` にアクセス $\rightarrow$ そのまま表示。
        

もちろん、「URLを短く見せたい！」という理由で `mydomain.com` を正規にしても全く問題ないよ。GitHub Pagesはその逆のリダイレクトも完璧にこなしてくれるからね。

---

## ⚙️ 2. GitHub Pages側での設定

設定画面（Settings > Pages > Custom domain）に入力するのは、**「あなたが正規（メイン）にしたい方のドメイン」**を1つだけだよ。

- **`www.mydomain.com`** をメインにしたい場合 $\rightarrow$ **`www.mydomain.com`** と入力する。
    
    - _(GitHubが自動的に `mydomain.com` からのリダイレクトも準備してくれる)_
        
- **`mydomain.com`** をメインにしたい場合 $\rightarrow$ **`mydomain.com`** と入力する。
    
    - _(GitHubが自動的に `www.mydomain.com` からのリダイレクトも準備してくれる)_
        

今回はトラブルの少ない **`www.mydomain.com`** を設定することをおすすめするよ！

---

## 🛠️ 3. DNSレコードの正しい設定

ここが一番の山場だ！DNSプロバイダ側で以下の2種類のレコードを設定する必要があるよ。

（※GitHub Pagesの設定で www を入力した場合の推奨設定）

### A. Apexドメイン (`mydomain.com`) 用の設定

ルートドメインはCNAMEが使えないことが多いので、GitHubのサーバーIPアドレスを直接指す **Aレコード** を設定する。これは4つすべて登録するのがベストプラクティスだ。

|**タイプ**|**ホスト名**|**値 (Value)**|
|---|---|---|
|**A**|**@** (または空欄)|**185.199.108.153**|
|**A**|**@** (または空欄)|**185.199.109.153**|
|**A**|**@** (または空欄)|**185.199.110.153**|
|**A**|**@** (または空欄)|**185.199.111.153**|

### B. サブドメイン (`www`) 用の設定

こちらは **CNAMEレコード** を使う。

|**タイプ**|**ホスト名**|**値 (Value)**|**重要な注意点**|
|---|---|---|---|
|**CNAME**|**www**|**user.github.io**|⚠️ ここに `/user` や `/repo` などのパスを含めてはいけない！|

---

## 🔍 何が起きるかシミュレーション

君のケース（リポジトリ: `user.github.io/user`）で、上記の設定（GH Pagesに `www` を設定）を行った場合の挙動はこうなるよ。

1. **ユーザーが `http://mydomain.com` にアクセス**:
    
    - DNS (Aレコード) がGitHubサーバーに到達。
        
    - GitHubサーバーは「あ、このドメインは `www` が正規だな」と判断。
        
    - **301リダイレクト** を返し、ブラウザを `http://www.mydomain.com` へ転送。
        
2. **ユーザーが `http://www.mydomain.com` にアクセス**:
    
    - DNS (CNAME) が `user.github.io` を経由してGitHubサーバーに到達。
        
    - GitHubサーバーは「このドメインは `user/user` リポジトリに紐付いているな」と判断。
        
    - **リポジトリ内の `index.html` を表示**。
        

### ⚠️ 最も重要な注意点：DNSにパスは書かない！

DNSレコードの値に user.github.io/user のようにスラッシュ以降のパスを書くと、DNSエラーで繋がりません。

DNSはあくまで「サーバーの住所（IPやドメイン）」を教えるもので、「部屋番号（フォルダパス）」はGitHub側（Custom domain設定）が判断するものだからだよ。

設定後はDNSの反映に時間がかかることがある（最大24時間程度）から、気長に待ってね！焦らずやれば必ず繋がるよ！👍