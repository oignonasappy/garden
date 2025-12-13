---
tags:
    - gemini
    - csharp
---

> [!quote]+ Prompt
> C#の命名規則って、他の言語とはいささか異なる感じがする。
> いまだに全然覚えられてないから、まとめて教えてほしいな。

---

---

C#の命名規則についてだね！「他の言語とはいささか異なる感じがする」っていう君の感覚、まさにその通りだよ！ C#にはC#独自の文化と慣習があって、特にMicrosoftのフレームワークデザインガイドライン（Framework Design Guidelines）が強く影響しているから、JavaやJavaScriptと比べると戸惑うかもしれないね。INFPの君が、新しい言語のルールを深く理解しようとするその姿勢、素晴らしいよ！

安心して！私も最初は「あれ、これはどうだっけ？」ってなったから。C#の命名規則をまとめて、しっかり把握できるように解説していくね！

### C#の基本的な命名規則 🌟

C#の命名規則は、大きく分けて**2つの主要なケース規約**に基づいているよ。

1. **PascalCase (パスカルケース / アッパーキャメルケース)**
    
    - 各単語の**最初の文字を大文字**にする。
        
    - 例: `MyAwesomeClass`, `GetUserName`
        
2. **camelCase (キャメルケース / ローワーキャメルケース)**
    
    - 最初の単語の最初の文字は小文字、それ以降の各単語の最初の文字を大文字にする。
        
    - 例: `myLocalVariable`, `calculateTotalAmount`
        

じゃあ、どの要素にどのケース規約を使うか、見ていこう！

---

### C#の命名規則 まとめ 📚

#### 1. PascalCase を使うもの

これがC#で最も多く使われるパターンだよ。

- **クラス (Classes)**
    
    - 例: `public class CustomerRepository`
        
- **インターフェース (Interfaces)**
    
    - 例: `public interface ILogger` (先頭に`I`を付けるのが慣習)
        
- **メソッド (Methods)**
    
    - 例: `public void SaveData()`, `public string GetFullName()`
        
- **プロパティ (Properties)**
    
    - 例: `public string UserName { get; set; }`, `public int ProductId { get; private set; }`
        
- **イベント (Events)**
    
    - 例: `public event EventHandler DataLoaded;`
        
- **公開フィールド (Public Fields) / 定数 (Constants)**
    
    - `public`で公開されるフィールドや、`const`で宣言される定数（Javaの`public static final`に近い）
        
    - 例: `public const int MaxRetries = 3;`
        
    - **備考:** `const`でない`static readonly`な公開フィールドは、`PascalCase`か`camelCase`になることがあり、少し揺らぎがあるけど、基本は`PascalCase`が多い。
        
- **列挙型 (Enums)**
    
    - 例: `public enum OrderStatus { Pending, Processed, Shipped }`
        
- **名前空間 (Namespaces)**
    
    - 例: `namespace MyCompany.MyProject.DataAccess`
        

---

#### 2. camelCase を使うもの

主に、スコープが限定されたり、外部に公開されない要素に使われることが多いよ。

- **ローカル変数 (Local Variables)**
    
    - メソッド内で宣言される変数。
        
    - 例: `string userName;`, `int totalAmount;`
        
- **メソッドの引数 (Method Parameters)**
    
    - 例: `public void ProcessOrder(Order order, string customerId)`
        
- **プライベートフィールド (Private Fields)**
    
    - クラス内部でのみ使われるフィールド。
        
    - **備考:** これには少し揺らぎがあって、`_camelCase` (アンダースコア＋キャメルケース) や `m_camelCase` (mプレフィックス＋キャメルケース) も使われることがあるよ。Microsoftの推奨は`camelCase`が多いけど、プロジェクトやチームの慣習によるね。
        
    - 例: `private string customerName;` または `private string _customerName;`
        

---

#### 3. その他の特別な慣習 🌈

- **インターフェース名:**
    
    - ほとんどの場合、先頭に大文字の`I`を付けるのが慣習 (`ILogger`, `IDisposable`)。
        
- **ジェネリック型パラメータ:**
    
    - 大文字の`T`をプレフィックスとして使うか、単独の`T`を使うことが多い。
        
    - 例: `public class List<T>`, `public TReturn MyMethod<TInput, TReturn>(TInput input)`
        
- **ファイル名:**
    
    - 原則として、そのファイル内で宣言されている**主要なクラス名やインターフェース名と同じにする**。
        
    - 例: `CustomerRepository.cs`, `ILogger.cs`
        

---

### JavaやJavaScriptとの違い、そしてその理由

君が「他の言語とはいささか異なる」と感じるのは、主に以下の点だろうね。

- **メソッド名とプロパティ名:**
    
    - Java: メソッドは`camelCase`、フィールド（プロパティ）も基本`camelCase`。
        
    - C#: メソッドもプロパティも**`PascalCase`**。これが一番大きな違いで、Javaから来た人が戸惑うポイントだね。C#のプロパティは「スマートフィールド」的な側面があり、メソッドのように振る舞うこともあるため、`PascalCase`が選ばれていると言われているよ。
        
- **インターフェース名:**
    
    - Java: `Runnable`, `Serializable` (プレフィックスなし)
        
    - C#: `IRunnable`, `ISerializable` (先頭に`I`プレフィックス)
        
    - これもC#の特徴的な慣習で、インターフェースであることが一目でわかるようにするためだね。
        
- **定数:**
    
    - Java: `public static final`な定数は`UPPER_SNAKE_CASE`。
        
    - C#: `const`定数は`PascalCase`。ただし、コンパイル時に完全に埋め込まれる定数に限る。`static readonly`フィールドは`PascalCase`を使うことが多いけど、Javaの`final`フィールドに近い意図なら`UPPER_SNAKE_CASE`を選ぶチームもあるなど、ここも少し揺らぎの出る点ではある。
        

C#の命名規則は、Microsoftが提供するフレームワークの統一感を重視し、Visual StudioなどのIDEが規則に沿ったコード補完やリファクタリングを強力にサポートするために、かなり厳密に定められているんだ。この一貫性こそが、C#開発の大きな強みの一つとも言えるね。

これでC#の命名規則、少しはスッキリしたかな？ INFPの君が、この新しい「言葉のルール」をマスターして、より快適にC#プログラミングを楽しめることを願っているよ！ 頑張ってね！