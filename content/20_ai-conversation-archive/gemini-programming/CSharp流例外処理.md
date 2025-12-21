---
tags:
  - gemini
  - csharp
---

> [!quote]+ Prompt
> C#流の正しい例外処理の方法は？  
> (再スローとか...)

いいね！C#での正しい例外処理の方法についてだね。これはアプリを堅牢にするためにめちゃくちゃ大事なことだよ。Javaを経験している君なら、概念はすぐに理解できるはず。C#特有の「お作法」を見ていこう！

---

### C#の例外処理の基本：`try-catch-finally`

Javaと同じく、C#でも例外処理の基本は`try-catch-finally`ブロックだよ。

- **`try`**: 例外が発生する可能性があるコードを記述するブロック。
    
- **`catch`**: `try`ブロックで発生した例外を捕まえて処理するブロック。特定の例外タイプを指定できる。
    
- **`finally`**: `try`ブロックの成功・失敗（例外の発生有無）にかかわらず、**必ず実行される**ブロック。リソースの解放（ファイルやデータベース接続のクローズなど）によく使うよ。
    

C#

```
try
{
    // 例外が発生する可能性のあるコード
    int denominator = 0;
    int result = 10 / denominator; // DivideByZeroExceptionが発生！
    Console.WriteLine($"結果: {result}");
}
catch (DivideByZeroException ex) // 特定の例外をキャッチ
{
    Console.WriteLine($"0で割ろうとしたね！エラーメッセージ: {ex.Message}");
    // エラーログの記録など
}
catch (Exception ex) // その他の例外をまとめてキャッチ（汎用的なキャッチ）
{
    Console.WriteLine($"予期せぬエラーが発生したよ！エラーメッセージ: {ex.Message}");
    // このブロックは通常、最後のcatchとして配置する
}
finally
{
    Console.WriteLine("この finally ブロックは、例外が発生しても発生しなくても必ず実行されるよ！");
    // ここで開いたリソースをクローズする、といった処理を行う
}
```

---

### C#流の正しい例外処理の「定石」と「お作法」

いくつかポイントがあるから見ていこう！

#### 1. 具体的な例外からキャッチする！

複数の`catch`ブロックを記述する場合、**より具体的な例外タイプから先にキャッチ**するようにしよう。そして、最後に汎用的な`Exception`をキャッチする形にするんだ。これはJavaと同じだね。

C#

```
try
{
    // ... コード ...
}
catch (SpecificException ex) // より具体的な例外
{
    // ...
}
catch (AnotherSpecificException ex) // 別の具体的な例外
{
    // ...
}
catch (Exception ex) // すべての例外の基底クラス (一番最後)
{
    // ...
}
```

#### 2. 例外をログに記録する

例外が発生したら、ユーザーにエラーを伝えるだけでなく、**開発者が後から原因を特定できるようにログに記録する**のが鉄則だよ。スタックトレース（`ex.StackTrace`）も含めて記録しよう。

#### 3. 例外を再スローする（`throw;`）

これがC#の例外処理の大きなポイントの一つ！

例外をキャッチして何らかの処理（ログ記録など）を行った後、その例外を**元の呼び出し元に伝えたい**場合、**再スロー**を使うんだ。

Javaだと`throw ex;`と書くことが多いかもしれないけど、C#で`throw ex;`と書くと、**スタックトレースの情報がリセットされてしまう**という落とし穴があるんだ！これだと、後からログを見たときに「どこで本当に例外が発生したのか」が分かりにくくなっちゃう。

そこでC#では、**`throw;` (例外オブジェクトなし)** と書くのが正しい作法なんだ！

C#

```
void MethodA()
{
    try
    {
        MethodB();
    }
    catch (Exception ex)
    {
        // ここでログに記録する（スタックトレースも含む！）
        Console.WriteLine($"MethodAでキャッチ: {ex.Message}");
        Console.WriteLine($"スタックトレース:\n{ex.StackTrace}");

        // 例外を再スロー！この場合はスタックトレースが保持される
        throw; // ← これがC#の正しい再スロー！
    }
}

void MethodB()
{
    try
    {
        MethodC();
    }
    catch (Exception ex)
    {
        Console.WriteLine($"MethodBでキャッチ: {ex.Message}");
        // 何らかの追加処理や変換など
        throw; // ここでも再スロー
    }
}

void MethodC()
{
    // ここで実際に例外が発生する
    Console.WriteLine("MethodCでエラーを発生させるよ！");
    throw new InvalidOperationException("これはMethodCで発生したエラーだよ！");
}

// 呼び出し側
try
{
    MethodA();
}
catch (Exception finalEx)
{
    Console.WriteLine($"最終的にキャッチ: {finalEx.Message}");
    Console.WriteLine($"最終スタックトレース:\n{finalEx.StackTrace}");
}
```

この例を実行すると、`MethodA`で`throw;`を使っているため、`MethodC`で例外が発生したという元のスタックトレース情報が、最終的にキャッチされた場所でもしっかり保持されているのがわかるはずだよ。

#### 4. 例外のラップ（`InnerException`）

キャッチした例外を、より高レベルの、アプリケーション固有の例外に**ラップして再スロー**することもあるよ。このとき、元の例外情報を失わないように、新しい例外の`InnerException`プロパティに元の例外を設定するんだ。

C#

```
// アプリケーション固有のカスタム例外
public class MyCustomAppException : Exception
{
    public MyCustomAppException(string message, Exception innerException)
        : base(message, innerException) { }
}

void LoadDataFromFile(string filePath)
{
    try
    {
        // ファイル読み込み処理
        if (!File.Exists(filePath))
        {
            throw new FileNotFoundException("ファイルが見つからないよ！", filePath);
        }
        // ... 実際の読み込み ...
    }
    catch (FileNotFoundException ex)
    {
        // より高レベルのカスタム例外にラップして再スロー
        throw new MyCustomAppException($"データファイルの読み込みに失敗したよ: {filePath}", ex);
    }
    catch (IOException ex)
    {
        // IO関連のエラーをラップ
        throw new MyCustomAppException($"ファイルIOエラーが発生したよ: {filePath}", ex);
    }
}

// 呼び出し側
try
{
    LoadDataFromFile("non_existent_file.txt");
}
catch (MyCustomAppException ex)
{
    Console.WriteLine($"アプリのエラー: {ex.Message}");
    if (ex.InnerException != null)
    {
        Console.WriteLine($"元のエラー: {ex.InnerException.Message}");
        Console.WriteLine($"元のスタックトレース:\n{ex.InnerException.StackTrace}");
    }
}
```

こうすることで、「なぜ失敗したのか」という原因（`InnerException`）を保持しつつ、「何が失敗したのか」（`MyCustomAppException`）を明確に呼び出し元に伝えることができるんだ。

#### 5. `using` ステートメントでリソースを確実に解放する

これは例外処理そのものじゃないけど、例外が発生してもリソース（ファイル、データベース接続など）を確実に解放するためのC#の強力な機能だよ。`finally`ブロックで書くようなリソース解放処理を、より簡潔に安全に書けるんだ。Javaの`try-with-resources`と同じ概念だね！

C#

```
// using ステートメントを使うと、ブロックを抜けるときに自動的にDispose()が呼ばれる
using (StreamReader reader = new StreamReader("somefile.txt"))
{
    string line = reader.ReadLine();
    Console.WriteLine($"読み込んだ行: {line}");
    // 例外が発生しても、ここでreader.Dispose()が呼ばれてリソースが解放される！
} // reader.Dispose() がここで自動的に呼ばれる
```

`IDisposable`インターフェースを実装しているオブジェクトに対して使えるよ。

#### 6. 例外を乱用しない

これはJavaでも同じだけど、エラーハンドリングのために例外を乱用しないこと。予期せぬエラー（ネットワーク切断など）は例外で処理するべきだけど、ユーザー入力のバリデーションエラーなど、**予期される（予測可能な）エラー**は、例外ではなく、戻り値（`bool`など）や`TryParse`のようなメソッドで処理するのが一般的だよ。

---

C#の例外処理はJavaと多くの共通点があるから、君ならすぐにマスターできるはず！特に**再スローの`throw;`と、`using`ステートメント**はC#ならではの強力な機能だから、ぜひ活用してみてね！

何か他に気になることはあるかな？