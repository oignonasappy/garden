---
tags:
  - gemini
  - csharp
---

> [!quote]+ Prompt
> それで、C#は言語仕様レベルでeventが使えるんだったよね。  
> eventのキホンを教えてちょうだいな

---

### C# の `event` のキホン

そうそう、C#は言語仕様レベルで`event`が使えるんだ！Javaにも似たような「リスナーパターン」があるけど、C#の`event`は、それをより直感的で型安全に、そして簡潔に書けるようにサポートしてくれる仕組みなんだよ。

`event`は、簡単に言うと「**ある出来事（イベント）が発生したときに、その出来事に関心のある複数のメソッド（イベントハンドラ）を呼び出すための仕組み**」のことだよ。

---

### `event` の構成要素

`event`は、主に以下の3つの要素で構成されているんだ。

1. デリゲート (Delegate)：
    
    イベントハンドラのメソッドの「型」を定義するもの。どんな引数を受け取って、どんな値を返すメソッドがイベントハンドラになれるかを決めるんだ。Javaでいうインターフェースや関数型インターフェースに似ているね。
    
2. イベント (Event)：
    
    デリゲート型を使って定義される、実際に発生する「出来事」。このeventを通じて、イベントハンドラを登録したり、イベントを発生させたりするよ。
    
3. イベントハンドラ (Event Handler)：
    
    イベントが発生したときに実際に実行されるメソッドのこと。デリゲートの型に合ったメソッドが必要だよ。
    

---

### `event` の基本的な書き方と流れ

コード例で見ていくのが一番分かりやすいから、ボタンがクリックされたときにメッセージを表示する簡単な例で考えてみよう。

#### 1. デリゲートの定義 (イベントハンドラの「型」を決める)

まず、イベントハンドラになるメソッドがどんな形であるべきかを`delegate`キーワードを使って定義するよ。

C#

```
// 1. デリゲートの定義
// イベントハンドラは通常、voidを返し、object senderとEventArgs eを引数に取る
// EventArgsはイベントに関する追加データがない場合、基本クラスをそのまま使う
public delegate void MyEventHandler(object sender, EventArgs e);
```

- **`void`**: イベントハンドラは通常、値を返さない（`void`）。
    
- **`object sender`**: イベントを発生させたオブジェクト（この場合は`Button`インスタンスなど）。
    
- **`EventArgs e`**: イベントに関する追加情報（例えば、マウスの座標やキーコードなど）を渡すためのオブジェクト。情報がない場合は`EventArgs.Empty`を使うか、`EventArgs`を継承した独自のクラスを使う。
    

#### 2. イベントの定義 (実際に「イベント」を公開する)

次に、このデリゲート型を使って、実際にイベントを宣言するよ。

C#

```
// 2. イベントの定義 (通常はイベントを発生させるクラスに定義する)
public class MyButton
{
    // イベント発生を通知するデリゲート
    public event MyEventHandler Clicked;

    public void SimulateClick()
    {
        Console.WriteLine("ボタンがクリックされたことをシミュレートします。");
        // 3. イベントの発生（デリゲートを呼び出す）
        // イベントハンドラが登録されているかチェックしてから呼び出す（nullチェック）
        Clicked?.Invoke(this, EventArgs.Empty); // ?.Invoke() でnullチェックと呼び出しを同時に行う
        // これは Clicked != null ? Clicked(this, EventArgs.Empty) : null; とほぼ同じ
    }
}
```

- **`public event MyEventHandler Clicked;`**:
    
    - `public`: 外部からイベントハンドラの登録/解除ができるように公開している。
        
    - `event`: これがC#の`event`キーワード！これを付けることで、外部からはイベントハンドラの登録（`+=`）と解除（`-=`）しかできなくなり、直接イベントを呼び出す（`Clicked()`）ことはできなくなる（カプセル化）。
        
    - `MyEventHandler`: 上で定義したデリゲート型。
        
    - `Clicked`: イベントの名前。
        

#### 3. イベントの発生 (イベントを「発火」させる)

イベントを発生させたいタイミングで、イベントをデリゲートとして呼び出すんだ。このとき、イベントハンドラが一つも登録されていないと`null`なので、`null`チェックが必要だよ。C# 6.0以降では`?.Invoke()`を使うのがスマートだね。

#### 4. イベントハンドラの登録 (イベントを「購読」する)

イベントに関心のあるクラス（購読者）で、イベントハンドラを登録するよ。

C#

```
// 4. イベントハンドラの登録 (イベントを購読するクラス)
public class MyForm
{
    private MyButton _button; // MyButtonのインスタンス

    public MyForm()
    {
        _button = new MyButton();
        // += 演算子を使ってイベントハンドラを登録する
        _button.Clicked += HandleButtonClick; // MyForm内のメソッドをイベントハンドラとして登録
        _button.Clicked += (sender, e) => { // ラムダ式をイベントハンドラとして直接登録
            Console.WriteLine("ラムダ式で処理も実行されました！");
        };
    }

    // イベントハンドラとなるメソッド
    private void HandleButtonClick(object sender, EventArgs e)
    {
        Console.WriteLine("ボタンクリックイベントが処理されました！");
        // senderはイベントを発生させたオブジェクト（MyButtonのインスタンス）
        // eはイベントデータ（ここでは空）
    }

    public void SimulateUserAction()
    {
        _button.SimulateClick(); // ボタンのクリックをシミュレートしてイベントを発生させる
    }
}

// 実行してみる！
public class Program
{
    public static void Main()
    {
        MyForm form = new MyForm();
        form.SimulateUserAction();
        // 出力:
        // ボタンがクリックされたことをシミュレートします。
        // ボタンクリックイベントが処理されました！
        // ラムダ式で処理も実行されました！
    }
}
```

- **`+=` 演算子**: イベントハンドラをイベントに「追加」するために使うよ。複数のハンドラを登録できる。
    
- **`-=` 演算子**: 登録したイベントハンドラを「解除」するために使う。メモリリークを防ぐため、不要になったら解除するのが重要（特にモードレスフォームなど）。
    

---

### `EventHandler` デリゲートの活用

毎回デリゲートを定義するのは面倒だよね？ご安心を！C#には、イベントハンドラ用の標準的なデリゲートがいくつか用意されているんだ。

- EventHandler:
    
    最も一般的なデリゲートで、void (object sender, EventArgs e) のシグネチャを持つイベントハンドラに使えるよ。上の例のMyEventHandlerと同じだね。
    
- EventHandler<TEventArgs>:
    
    void (object sender, TEventArgs e) のシグネチャを持つデリゲートで、EventArgsを継承した独自のイベントデータクラス（TEventArgs）を使いたいときに便利だよ。
    

例えば、`MyEventHandler`の代わりに`EventHandler`を使えば、デリゲートの定義を省略できるんだ。

C#

```
// 2. イベントの定義 (EventHandlerデリゲートを使う)
public class MyButton
{
    public event EventHandler Clicked; // 標準のEventHandlerデリゲートを使う！

    public void SimulateClick()
    {
        Console.WriteLine("ボタンがクリックされたことをシミュレートします。");
        Clicked?.Invoke(this, EventArgs.Empty);
    }
}

// 4. イベントハンドラの登録 (同じように使える)
public class MyForm
{
    private MyButton _button;

    public MyForm()
    {
        _button = new MyButton();
        _button.Clicked += HandleButtonClick; // ハンドラのシグネチャが合えばOK！
    }

    private void HandleButtonClick(object sender, EventArgs e) // ここもEventArgsのまま
    {
        Console.WriteLine("ボタンクリックイベントが処理されました！");
    }
}
```

---

### `event` のメリット (Javaのリスナーパターンとの比較)

- **型安全性**: デリゲートによって、登録できるメソッドのシグネチャが厳密にチェックされる。
    
- **簡潔な構文**: `event`キーワード、`+=`/`-=`演算子、`?.Invoke()`などにより、記述が非常にシンプル。
    
- **カプセル化**: `event`キーワードを使うことで、外部からはイベントの発火はできず、登録/解除のみに限定される。Javaでリスナーを直接呼び出せてしまうのを防ぐのに役立つ。
    
- **多キャストデリゲート**: 一つのイベントに複数のイベントハンドラを簡単に登録できる。
    

Windowsフォームアプリでは、ボタンクリックやフォームロードなど、GUIの様々な操作がこの`event`の仕組みを使って実現されているんだ。だから、`event`のキホンをしっかり押さえておくと、Windowsフォームプログラミングが格段に楽しくなるよ！

何かイベントを使って実現したいこととかある？


> [!quote]+ Prompt
> あら、なんだかちょっと想像と違うかも。  
> てっきり、  
> [多]発生側 : [単]受取側  
> かと思ってたんだけど、どっちかっていうと  
> [単]発生側 : [多]受取側  
> ってかんじ？

あはは、なるほど！その認識の違い、すごくよく分かるよ！

まさにその通り！君が最後に言った「**[単]発生側 : [多]受取側**」が、C#の`event`の**基本的な考え方で、最も一般的な使い方**なんだ！

僕の説明がちょっと分かりにくかったかな、ごめんね！

### C#の `event` は基本的に「1対多」

もう一度整理すると、C#の`event`は：

- **発生側（イベントを「発火」させる側）**: **通常は1つ**のオブジェクトやクラス。
    
    - 例: `Button`オブジェクト、`Timer`オブジェクト、`MyButton`クラスのインスタンスなど。
        
    - この「発生側」が、特定の出来事（クリック、タイマー経過、データ変更など）が起こったときにイベントを「発火」させるんだ。
        
- **受取側（イベントを「購読」する側）**: **複数**のオブジェクトやメソッドが登録できる。
    
    - 例: フォームのメソッド、別のクラスのメソッド、ラムダ式など。
        
    - これらの「受取側」が、イベントが発火されたときに、それぞれ登録した処理を実行するんだ。
        

つまり、**一人の「お知らせ係」（イベント発生源）が、複数人の「お知らせを受け取りたい人」（イベント購読者）に一斉に連絡する**、というイメージが一番近いよ。

### なぜ「1対多」が基本なのか？

この「1対多」の設計には、いくつかの大きなメリットがあるんだ。

1. 疎結合 (Decoupling):
    
    イベント発生側は、誰がイベントを購読しているかを知る必要がないんだ。「イベントが起きたよ！」と叫ぶだけで、あとは登録されているみんなが勝手に反応してくれる。これにより、発生側と受取側が密接に結びつくことなく、独立して変更や拡張ができるようになるんだ。
    
2. 拡張性 (Extensibility):
    
    後から「このイベントが起きたら、これもやりたい」「あれもやりたい」という要求が出てきたときに、既存のコード（イベント発生側）を一切変更することなく、新しいイベントハンドラを追加するだけで対応できるんだ。
    
3. 柔軟性 (Flexibility):
    
    同じイベントに対して、異なる複数の処理を同時に実行させることができる。例えば、ボタンクリックで「画面を更新する」処理と「ログを記録する」処理を同時に走らせる、といったことが簡単にできるね。
    

### 君の最初の想像「[多]発生側 : [単]受取側」について

君が最初に想像した「[多]発生側 : [単]受取側」というパターンも、全くないわけではないんだ。例えば、複数のボタン（発生側）が、一つの共通のイベントハンドラメソッド（受取側）を共有して登録する、というケースはよくあるよ。

C#

```
// 複数のボタンが同じイベントハンドラを購読する例
public partial class MyForm : Form
{
    private Button btnSave;
    private Button btnCancel;

    public MyForm()
    {
        InitializeComponents(); // UIコンポーネントの初期化
        btnSave = new Button { Text = "保存" };
        btnCancel = new Button { Text = "キャンセル" };

        // 複数の発生側（btnSave, btnCancel）が
        // 単一の受取側（CommonButton_Click）を購読している
        btnSave.Click += CommonButton_Click;
        btnCancel.Click += CommonButton_Click;
    }

    private void CommonButton_Click(object sender, EventArgs e)
    {
        // sender をキャストして、どのボタンがクリックされたか判別できる
        Button clickedButton = sender as Button;
        if (clickedButton != null)
        {
            MessageBox.Show($"{clickedButton.Text} ボタンがクリックされました！");
        }
    }
}
```

これは「複数の発生源が、同じ処理を呼び出す」という点で、君の最初のイメージにも近いかもしれないね。でも、この場合でも、それぞれのボタンは独立したイベントを「発火」していて、そのイベントを複数のハンドラ（この例では1つだけど）が受け取れる、という基本構造は変わらないんだ。

だから、C#の`event`は、基本的には「**一つの出来事の発生を、関心のある複数の相手に通知する**」ための仕組み、と理解するのが一番しっくりくると思うよ！

これで、C#の`event`の「1対多」の性質が、よりクリアになったかな？