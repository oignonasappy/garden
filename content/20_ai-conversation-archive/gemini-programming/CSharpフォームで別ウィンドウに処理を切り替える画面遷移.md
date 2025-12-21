---
tags:
  - gemini
  - csharp
---

> [!quote]+ Prompt
> エントリポイント`Login`Form と、その次の画面`Menu`Formがある。  
> `Login`のログイン処理が正常に完了したら、`Login`を閉じて`Menu`を表示したいんだけど、  
> 普通にやると`Login`を閉じた段階でアプリケーションが終了してしまい`Menu`を開くことができない。  
> 例えばこんなかんじ  
> ```C#
> /* Form.cs */
> 
> Menu menu = new Menu();
> menu.Show();
> this.Close();
> ```

---

なるほど！`Login`フォームを閉じたらアプリが終了しちゃって、`Menu`フォームが開けない問題だね。これはWindowsフォームアプリの「エントリポイント」と「アプリケーションのライフサイクル」を理解すると、スッキリ解決できるよ！

### アプリケーションが終了してしまう理由

君の書いたコード

C#

```
Menu menu = new Menu();
menu.Show();
this.Close(); // Loginフォームを閉じる
```

でアプリが終了してしまうのは、Windowsフォームアプリケーションのデフォルトの動作が関係しているんだ。

アプリケーションの**エントリポイント**は通常、`Program.cs`ファイルにある`Main`メソッドで、ここで**最初に表示するフォーム（通常はLoginフォーム）を指定**しているよね。

C#

```
// Program.cs
static class Program
{
    [STAThread]
    static void Main()
    {
        Application.EnableVisualStyles();
        Application.SetCompatibleTextRenderingDefault(false);
        Application.Run(new LoginForm()); // ← ここでLoginFormが最初のメインフォームとして登録される
    }
}
```

`Application.Run()`メソッドは、引数として渡されたフォームが閉じられると、アプリケーション全体を終了させる、という役割を持っているんだ。だから、Loginフォームが閉じられた瞬間に、「あ、メインのフォームが閉じられたな。じゃあアプリも終了だ！」と判断されちゃうんだね。

---

### 正しい画面遷移の方法：`Program.cs`を調整する

この問題を解決する最もシンプルで一般的な方法は、`Program.cs`の`Main`メソッドのロジックを少し変更することだよ。

#### 1. `Login`フォームでログイン処理を行い、次のフォームのインスタンスを生成

`Login`フォームのログインボタンクリックイベントなどで、ログイン処理が成功したら、**次のフォーム（`Menu`フォーム）のインスタンスを生成して返す**ようにするんだ。

C#

```
// LoginForm.cs の一部 (ログインボタンクリックイベントなど)
public partial class LoginForm : Form
{
    public LoginForm()
    {
        InitializeComponent();
    }

    // ログイン成功時に、次のフォームのインスタンスを格納するプロパティ
    public Form NextForm { get; private set; }

    private void btnLogin_Click(object sender, EventArgs e)
    {
        string username = txtUsername.Text;
        string password = txtPassword.Text;

        // ここで実際のログイン認証処理を行う
        if (AuthenticateUser(username, password)) // 仮の認証メソッド
        {
            // ログイン成功！
            // 次のフォーム（MenuForm）のインスタンスを作成し、プロパティにセット
            NextForm = new MenuForm();

            // このフォーム（Loginフォーム）を閉じることを示すDialogResultを設定
            this.DialogResult = DialogResult.OK; // これが重要！
            this.Close(); // これでLoginFormが閉じられる
        }
        else
        {
            MessageBox.Show("ユーザー名またはパスワードが間違っています。", "ログイン失敗", MessageBoxButtons.OK, MessageBoxIcon.Warning);
        }
    }

    private bool AuthenticateUser(string username, string password)
    {
        // 実際にはDBアクセスやハッシュ値の比較などを行う
        return username == "test" && password == "password";
    }
}
```

#### 2. `Program.cs`でフローを制御する

`Program.cs`で、`Login`フォームの`ShowDialog()`の結果を見て、次のフォームを表示するかどうかを判断するんだ。

C#

```
// Program.cs
static class Program
{
    [STAThread]
    static void Main()
    {
        Application.EnableVisualStyles();
        Application.SetCompatibleTextRenderingDefault(false);

        // ログインフォームのインスタンスを作成
        LoginForm loginForm = new LoginForm();

        // Loginフォームをモーダルで表示する
        // ShowDialog() はフォームが閉じられるまで処理をブロックするよ
        if (loginForm.ShowDialog() == DialogResult.OK)
        {
            // LoginフォームがDialogResult.OKで閉じられた場合（＝ログイン成功）
            // LoginフォームのNextFormプロパティに設定された次のフォームを表示する
            Application.Run(loginForm.NextForm); // ← ここでMenuFormを表示！
        }
        else
        {
            // LoginフォームがOK以外で閉じられた場合（例: キャンセルボタン、閉じるボタン）
            // アプリケーションはここで終了する
            MessageBox.Show("ログインがキャンセルされました。アプリケーションを終了します。", "終了", MessageBoxButtons.OK, MessageBoxIcon.Information);
        }

        // Loginフォームのリソースを解放
        loginForm.Dispose();
    }
}
```

---

### この方法のポイント

- **`Application.Run()`の切り替え**: `Application.Run()`で最初に実行するフォームを`LoginForm`にし、ログイン成功後、そのフォームが返す`NextForm`（`MenuForm`）を再度`Application.Run()`で実行することで、アプリケーションのメインフォームを切り替えているんだ。
    
- **モーダル表示 (`ShowDialog()`)**: `LoginForm`を`ShowDialog()`で表示しているから、ユーザーがログインを完了（またはキャンセル）するまで、`Program.cs`の処理はそこで一時停止するよ。
    
- **`DialogResult.OK`**: `LoginForm`でログインが成功した場合に`this.DialogResult = DialogResult.OK;`を設定することで、`Program.cs`側でログインの成否を判断できるようにしているんだ。
    

これで、`Login`フォームを閉じてもアプリが終了せず、無事に`Menu`フォームが開かれるようになるはずだよ！試してみてね！