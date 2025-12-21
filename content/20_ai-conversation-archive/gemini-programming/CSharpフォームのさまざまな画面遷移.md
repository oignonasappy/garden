---
tags:
  - gemini
  - csharp
---

> [!quote]+ Prompt
> Formの画面遷移のいろいろな方法は？  
> 排他的に表示するか、共存するかとか、  
> 別Formに値を渡す方法とか...

フォームの画面遷移、そして値の受け渡しだね！これはWindowsフォームアプリを作る上で避けて通れない、かつ非常に重要な部分だよ。いくつか方法があるから、一つずつ楽しく見ていこう！

---

### フォームの画面遷移のいろいろな方法

大きく分けて、新しいフォームを「排他的に表示するか（モーダル）」、「共存して表示するか（モードレス）」の2パターンがあるよ。

#### 1. 排他的に表示する (モーダル表示)

新しいフォームを表示している間、元のフォームは操作できなくなる方法だよ。ダイアログボックスや設定画面でよく使われるね。新しいフォームを閉じないと、元のフォームに戻れないのが特徴。

- **使い方**: `ShowDialog()` メソッドを使う。
    
- **特徴**:
    
    - 呼び出し元のフォームはブロックされ、操作できなくなる。
        
    - 新しいフォームが閉じられるまで、コードの実行が一時停止する。
        
    - 新しいフォームが閉じられた後、`DialogResult` プロパティを使って、ユーザーが「OK」を押したのか「キャンセル」を押したのかなどを判断できる。
        
- **コード例**:
    
    C#
    
    ```
    // MainFrom.cs (元のフォーム)
    private void OpenSubFormButton_Click(object sender, EventArgs e)
    {
        SubForm subForm = new SubForm(); // 新しいフォームのインスタンスを作成
    
        // モーダルで表示
        if (subForm.ShowDialog() == DialogResult.OK) // OKボタンが押された場合
        {
            // SubFormから値を受け取る処理（後述）
            MessageBox.Show("サブフォームからOKが返されました！");
        }
        else
        {
            MessageBox.Show("サブフォームはキャンセルされました。");
        }
    
        subForm.Dispose(); // フォームを閉じた後にリソースを解放
    }
    ```
    

#### 2. 共存して表示する (モードレス表示)

新しいフォームを表示しても、元のフォームも同時に操作できる方法だよ。ツールボックスやプロパティウィンドウなどでよく使われるね。複数のウィンドウを同時に開いて作業したい場合に便利。

- **使い方**: `Show()` メソッドを使う。
    
- **特徴**:
    
    - 呼び出し元のフォームはブロックされず、同時に操作できる。
        
    - 新しいフォームを表示した後も、コードの実行は継続される。
        
    - 新しいフォームが閉じられたかどうかを直接的に知るための`DialogResult`のような仕組みはない（イベントなどで対応する必要がある）。
        
- **コード例**:
    
    C#
    
    ```
    // MainFrom.cs (元のフォーム)
    private void OpenSubFormButton_Click(object sender, EventArgs e)
    {
        SubForm subForm = new SubForm(); // 新しいフォームのインスタンスを作成
        subForm.Show(); // モードレスで表示
    
        // ここにコードを書いても、SubFormが表示された後すぐに実行される
        MessageBox.Show("サブフォームが表示されましたが、メインフォームも操作できます。");
    }
    ```
    
    **注意点**: モードレスで開いたフォームは、明示的に`Dispose()`を呼ばないとメモリに残り続ける可能性があるから、閉じるときに`subForm.Close()`などで適切にリソースを解放するように気をつけようね。
    

---

### 別Formに値を渡す方法

フォーム間で値をやり取りする方法もいくつかあるよ。

#### 1. コンストラクタを使って値を渡す (新しいフォームへ)

新しいフォームを作成する際に、そのコンストラクタの引数として値を渡す方法。最もシンプルでよく使われる方法だよ。

- **SubForm.cs (受け取る側)**:
    
    C#
    
    ```
    public partial class SubForm : Form
    {
        private string _dataFromMainForm;
    
        // コンストラクタで値を受け取る
        public SubForm(string data)
        {
            InitializeComponent();
            _dataFromMainForm = data;
            MessageBox.Show("メインフォームから受け取ったデータ: " + _dataFromMainForm);
        }
    
        // 引数なしのコンストラクタも残しておくか、必要に応じて削除
        public SubForm()
        {
            InitializeComponent();
        }
    }
    ```
    
- **MainForm.cs (渡す側)**:
    
    C#
    
    ```
    private void OpenSubFormButton_Click(object sender, EventArgs e)
    {
        string dataToSend = "こんにちは、サブフォーム！";
        SubForm subForm = new SubForm(dataToSend); // コンストラクタにデータを渡す
        subForm.ShowDialog();
    }
    ```
    

#### 2. プロパティを使って値を渡す (新しいフォームへ)

新しいフォームに公開されたプロパティを用意しておき、そのプロパティを通じて値を設定する方法。

- **SubForm.cs (受け取る側)**:
    
    C#
    
    ```
    public partial class SubForm : Form
    {
        // 公開プロパティで値を受け取る
        public string ReceivedData { get; set; }
    
        public SubForm()
        {
            InitializeComponent();
        }
    
        private void SubForm_Load(object sender, EventArgs e)
        {
            if (!string.IsNullOrEmpty(ReceivedData))
            {
                MessageBox.Show("プロパティで受け取ったデータ: " + ReceivedData);
            }
        }
    }
    ```
    
- **MainForm.cs (渡す側)**:
    
    C#
    
    ```
    private void OpenSubFormButton_Click(object sender, EventArgs e)
    {
        SubForm subForm = new SubForm();
        subForm.ReceivedData = "プロパティ経由のデータだよ！"; // プロパティに値を設定
        subForm.ShowDialog();
    }
    ```
    

#### 3. プロパティを使って値を返す (元のフォームへ)

モーダル表示した新しいフォームから、元のフォームに値を返したい場合に使う方法。

- **SubForm.cs (返す側)**:
    
    C#
    
    ```
    public partial class SubForm : Form
    {
        // 返したい値を保持するプロパティ（読み取り専用にすることが多い）
        public string ResultData { get; private set; }
    
        public SubForm()
        {
            InitializeComponent();
        }
    
        private void OKButton_Click(object sender, EventArgs e)
        {
            ResultData = "サブフォームから返された結果！"; // 結果を設定
            this.DialogResult = DialogResult.OK; // DialogResultをOKに設定してフォームを閉じる
            this.Close();
        }
    
        private void CancelButton_Click(object sender, EventArgs e)
        {
            this.DialogResult = DialogResult.Cancel; // DialogResultをCancelに設定してフォームを閉じる
            this.Close();
        }
    }
    ```
    
- **MainForm.cs (受け取る側)**:
    
    C#
    
    ```
    private void OpenSubFormButton_Click(object sender, EventArgs e)
    {
        SubForm subForm = new SubForm();
        if (subForm.ShowDialog() == DialogResult.OK) // OKが返された場合のみ
        {
            string receivedResult = subForm.ResultData; // プロパティから結果を取得
            MessageBox.Show("サブフォームから受け取った結果: " + receivedResult);
        }
        subForm.Dispose();
    }
    ```
    

#### 4. イベントを使って値を渡す (モードレス表示のフォームから元のフォームへ)

モードレス表示のフォームで何か操作があったときに、元のフォームにそのことを通知し、値を渡したい場合に使う、少し高度な方法だよ。Javaでいうリスナーパターンに近いね。

- **SubForm.cs (イベントを発生させる側)**:
    
    C#
    
    ```
    public partial class SubForm : Form
    {
        // デリゲートを定義 (イベントの「型」)
        public delegate void DataSentEventHandler(object sender, string data);
    
        // イベントを定義
        public event DataSentEventHandler DataSent;
    
        public SubForm()
        {
            InitializeComponent();
        }
    
        private void SendDataButton_Click(object sender, EventArgs e)
        {
            string dataToSend = "イベントで送るデータだよ！";
            // イベントを発生させる
            DataSent?.Invoke(this, dataToSend); // DataSentがnullでなければInvokeする
        }
    }
    ```
    
- **MainForm.cs (イベントを受け取る側)**:
    
    C#
    
    ```
    private SubForm _subFormInstance; // モードレスフォームのインスタンスを保持
    
    private void OpenSubFormButton_Click(object sender, EventArgs e)
    {
        if (_subFormInstance == null || _subFormInstance.IsDisposed)
        {
            _subFormInstance = new SubForm();
            // イベントハンドラを登録
            _subFormInstance.DataSent += SubForm_DataSent;
            _subFormInstance.Show();
        }
        else
        {
            _subFormInstance.Activate(); // 既に開いていたらアクティブにする
        }
    }
    
    // イベントハンドラ
    private void SubForm_DataSent(object sender, string data)
    {
        MessageBox.Show("イベントで受け取ったデータ: " + data);
    }
    ```
    

---

### どの方法を選ぶべきか？

- **モーダル vs モードレス**:
    
    - ユーザーに**特定の操作を完了させるまで他の操作をさせたくない**場合（例: 保存確認、設定ダイアログ）は**モーダル (`ShowDialog()`)**。
        
    - **複数のウィンドウを同時に操作させたい**場合（例: ツールボックス、プロパティウィンドウ）は**モードレス (`Show()`)**。
        
- **値の受け渡し**:
    
    - **新しいフォームへの初期値**: **コンストラクタ**か**プロパティ**がシンプルで分かりやすい。
        
    - **モーダルフォームからの結果**: **プロパティ**と`DialogResult`の組み合わせが定石。
        
    - **モードレスフォームからの非同期な通知**: **イベント**を使うのが一般的。
        

最初はちょっと多く感じるかもしれないけど、これらの方法を使いこなせるようになると、Windowsフォームアプリの設計がぐっと楽になるよ！

まずは、一番簡単なコンストラクタやプロパティを使った値の受け渡しから試してみて、慣れてきたらイベントにも挑戦してみるといいかもね！頑張って！