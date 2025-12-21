---
tags:
  - gemini
  - csharp
---

> [!quote]+ Prompt
> 次に、  
> `new SubForm().Show();`  
> のような方法で表示する時に、同一のフォームが2つ以上表示されないようにするには？

---

### 同一のフォームが複数表示されないようにする方法

次に、`new SubForm().Show();` のようにモードレスでフォームを表示する際に、同じフォームが2つ以上開かないようにする方法だね。これはよくあるニーズで、いくつかの定石があるよ！

ここでは、主に2つの方法を紹介するね。

#### 方法1：フォームのインスタンスをフィールドで保持し、存在チェックする（最も一般的）

これが一番シンプルで分かりやすい方法だよ。メインフォームのフィールド（メンバ変数）に、表示したいサブフォームのインスタンスを保持しておき、開く前にそのインスタンスが存在するか（そして閉じられていないか）を確認するんだ。

C#

```
public partial class MainForm : Form
{
    // SubFormのインスタンスを保持するフィールド
    // 初期値はnullにしておく
    private SubForm _subFormInstance = null;

    public MainForm()
    {
        InitializeComponent();
    }

    private void OpenSubFormButton_Click(object sender, EventArgs e)
    {
        // 1. _subFormInstance が null か、または既に閉じられているか（IsDisposed）をチェック
        if (_subFormInstance == null || _subFormInstance.IsDisposed)
        {
            // インスタンスがないか、既に閉じられていたら新しく作成
            _subFormInstance = new SubForm();

            // 必要に応じてイベントハンドラを登録（例: サブフォームが閉じられたらnullにする）
            _subFormInstance.FormClosed += SubForm_FormClosed;
        }

        // 2. フォームが既に開いている場合は、手前に持ってくる（アクティブにする）
        // フォームが非表示の場合は Show() で表示される
        _subFormInstance.Show();
        _subFormInstance.Activate(); // 既に表示されている場合に手前に持ってくる

        // 注意: モードレスフォームなので、この後のコードはすぐに実行される
        MessageBox.Show("サブフォームを表示しました（またはアクティブにしました）。");
    }

    // サブフォームが閉じられたときに呼ばれるイベントハンドラ
    private void SubForm_FormClosed(object sender, FormClosedEventArgs e)
    {
        // _subFormInstance を null にすることで、次回ボタンクリック時に新しいインスタンスが作成される
        _subFormInstance = null;

        // イベントハンドラの登録解除も忘れずに（メモリリーク防止）
        // sender を SubForm にキャストしてイベント解除
        if (sender is SubForm closedForm)
        {
            closedForm.FormClosed -= SubForm_FormClosed;
        }
    }
}
```

**メリット:**

- 実装がシンプルで理解しやすい。
    
- インスタンスを再利用できる（もしフォームの内部状態を維持したい場合）。
    

**デメリット:**

- フォームが増えるたびに、メインフォーム側にフィールドが増える。
    

#### 方法2：開いているフォームのコレクションを調べてインスタンスを探す

この方法は、アプリケーション全体で開いているフォームのコレクション (`Application.OpenForms`) を調べて、目的のフォームが既に開いていないかを確認するんだ。

C#

```
public partial class MainForm : Form
{
    public MainForm()
    {
        InitializeComponent();
    }

    private void OpenSubFormButton_Click(object sender, EventArgs e)
    {
        // Application.OpenForms コレクションから SubForm のインスタンスを探す
        // as 演算子で型変換を試み、失敗したら null になる
        SubForm existingSubForm = Application.OpenForms.OfType<SubForm>().FirstOrDefault();

        if (existingSubForm == null)
        {
            // SubForm がまだ開いていなければ新しく作成して表示
            SubForm newSubForm = new SubForm();
            newSubForm.Show();
        }
        else
        {
            // 既に開いていればそれをアクティブにする
            existingSubForm.Show(); // 念のため表示状態を確認
            existingSubForm.Activate();
        }
    }
}
```

**メリット:**

- メインフォーム側に個別のフィールドを持つ必要がないため、フォームが増えてもコードがスッキリする。
    
- どのフォームから開かれようとも、既に開いているインスタンスを見つけられる。
    

**デメリット:**

- `Application.OpenForms` をイテレートするため、開いているフォームが多い場合はごくわずかにパフォーマンスオーバーヘッドがある可能性がある（通常は問題ないレベル）。
    
- 複数の異なる`SubForm`インスタンスを、それぞれ異なる目的で同時に開きたい場合はこの方法は使えない。
    

---

### どちらの方法を選ぶべきか？

- **一般的な用途や、開くフォームの種類が少ない場合**: **方法1 (`_subFormInstance`フィールドで管理)** が最もシンプルでおすすめだよ。インスタンスのライフサイクルが分かりやすいからね。
    
- **開くフォームの種類が多い場合や、どのフォームから開かれても一意にしたい場合**: **方法2 (`Application.OpenForms`を調べる)** が便利だよ。
    

これで、モードレスフォームが複数開いてしまう問題を解決できるはずだよ！試してみてね！