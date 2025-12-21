---
tags:
  - gemini
  - csharp
---

> [!quote]+ Prompt
> `int?` とかのnull許容型の使い方、使いどころは？

---

`int?` みたいな **null許容型**（Nullable types）だね！これはC#でプログラミングする上で、NullReferenceException（あのヌルポ！）を防いだり、データの意図を明確にしたりするために、めちゃくちゃ役立つ機能なんだ。使い方も使いどころもたくさんあるから、一緒に見ていこう！

### `int?` などのnull許容型とは？

C#の基本的な型（`int`, `bool`, `double`, `DateTime` など）は、**値型 (Value Type)** と呼ばれていて、これらは通常 `null` を代入できないんだ。

例えば、`int num;` と宣言すると、`num` はデフォルトで `0` に初期化されるよね。これに `num = null;` と書くとコンパイルエラーになっちゃう。

でも、データベースから読み込んだ数値データが「未入力」だったり、ユーザーが入力しなかったりする場合に、`0` という値が「データなし」を意味するのか、それとも「本当に数値のゼロ」を意味するのか、区別できないと困ることがあるよね？

そこで登場するのが、型名の後ろに `?` を付けた **null許容型** なんだ！

- **`int?`** (読み方: イント・ハテナ、またはヌラブル・イント)
    
- **`bool?`**
    
- **`double?`**
    
- **`DateTime?`**
    

これらの型は、それぞれの基本型の値に加えて、**`null` 値も代入できるようになる**んだ。

**例:**

C#

```
int? nullableInt = null; // nullを代入できる
nullableInt = 123;       // 通常のint値も代入できる

int normalInt = 0;
// normalInt = null; // コンパイルエラー！
```

---

### null許容型の使い方

null許容型を扱う際には、いくつかの便利な方法があるよ。

#### 1. 値があるかのチェックと取得

`HasValue` プロパティと `Value` プロパティを使って、値が`null`ではないかを確認し、値を取得できるよ。

C#

```
int? score = GetNullableScore(); // 何らかのメソッドでint?を取得

if (score.HasValue) // 値がnullではないかチェック
{
    int actualScore = score.Value; // 値を取得
    Console.WriteLine($"スコアは: {actualScore}");
}
else
{
    Console.WriteLine("スコアは未設定です。");
}
```

#### 2. `GetValueOrDefault()` メソッド

もし値が`null`だった場合に、デフォルト値（通常は`0`など）を返してほしいなら、`GetValueOrDefault()`が便利だよ。引数にデフォルト値を指定することもできるんだ。

C#

```
int? age = null;
int defaultAge = age.GetValueOrDefault(); // ageがnullなので 0 を返す
Console.WriteLine($"デフォルト年齢 (0): {defaultAge}");

int? price = null;
int defaultPrice = price.GetValueOrDefault(100); // priceがnullなので 100 を返す
Console.WriteLine($"デフォルト価格 (100): {defaultPrice}");

int? count = 5;
int actualCount = count.GetValueOrDefault(); // countに値があるので 5 を返す
Console.WriteLine($"実際のカウント: {actualCount}");
```

#### 3. null合体演算子 (`??`)

これもめちゃくちゃ便利！もし左側のオペランドが`null`でなければその値を、`null`であれば右側のオペランドの値を返す演算子だよ。

C#

```
int? optionalValue = null;
int result1 = optionalValue ?? 0; // optionalValueがnullなので 0 になる
Console.WriteLine($"結果1: {result1}");

int? someValue = 42;
int result2 = someValue ?? 0; // someValueに値があるので 42 になる
Console.WriteLine($"結果2: {result2}");
```

#### 4. null条件演算子 (`?.`) との組み合わせ

null許容型ではないけど、関連してよく使うのが **null条件演算子 (`?.`)** だね。これは、オブジェクトが`null`でない場合にのみメンバーアクセスを実行する演算子で、NullReferenceExceptionを防ぐのに役立つよ。

C#

```
string name = null;
int? length = name?.Length; // nameがnullなので length は null になる
Console.WriteLine($"名前の長さ: {length}"); // "名前の長さ:" (何も表示されない)

string city = "Tokyo";
int? cityLength = city?.Length; // cityがnullではないので 5 になる
Console.WriteLine($"都市名の長さ: {cityLength}"); // "都市名の長さ: 5"
```

null許容型と組み合わせることで、より安全なコードが書けるようになるよ。

---

### null許容型の使いどころ

null許容型が特に役立つシーンはこんな感じ！

#### 1. データベースの値 (特に数値、日付、真偽値など)

データベースのテーブルで、数値型や日付型、真偽値型のカラムに`NULL`が許容されている場合、対応するC#のプロパティをnull許容型にすることで、DBの`NULL`をC#の`null`として正確に表現できるようになるよ。

- `int? Age { get; set; }` (年齢が未入力の可能性)
    
- `DateTime? BirthDate { get; set; }` (生年月日を知らない場合がある)
    
- `bool? IsActive { get; set; }` (アクティブ/非アクティブだけでなく、未定の状態も表現したい)
    

#### 2. オプションの引数や戻り値

メソッドの引数として、必須ではないけれど指定できる値がある場合や、メソッドが値を返さない可能性がある場合に、null許容型を使うと意図が明確になるよ。

C#

```
// 身長が必須ではない場合
public void RegisterPerson(string name, int? height)
{
    if (height.HasValue)
    {
        Console.WriteLine($"{name} の身長は {height.Value} cmです。");
    }
    else
    {
        Console.WriteLine($"{name} の身長は未登録です。");
    }
}

// 検索結果が見つからない可能性がある場合
public int? FindUserId(string username)
{
    // ユーザーが見つからなければnullを返す
    return null; // または見つかったらユーザーID
}
```

#### 3. ユーザー入力のバリデーション

ユーザーが数値を入力するテキストボックスなどで、何も入力されなかったり、空文字列が送られてきたりした場合、それを`null`として扱うことで、`0`という値と区別できるよ。

#### 4. XMLやJSONのパース

XML属性やJSONプロパティで、特定の要素や値が存在しない可能性がある場合、それをnull許容型で表現することで、欠損値を安全に扱えるようになるんだ。

---

### まとめ

`int?` などのnull許容型は、値型が`null`を表現できないという制約を克服し、**「値が存在しない状態」を明示的に表現できる**ようにしてくれる、とても強力で便利な機能だよ。

特にデータベース連携や、オプションの値、欠損値を扱う場面で大活躍するから、ぜひ積極的に使ってみてね！これでNullReferenceExceptionで悩むことがグッと減るはずだよ！


> [!quote]+ Prompt
> ただ、null許容型は通常の型と混ぜて使うと型変換の手間がかかるね。  
> 楽に使えるものではないのかな  

確かに、`int?` などの**null許容型**を通常の`int`などと混ぜて使うと、`HasValue`でチェックしたり、`.Value`で取り出したり、`??`演算子を使ったりと、ちょっとした**型変換の手間**がかかるのは事実だね。

でもね、これは「楽じゃない」というよりは、**「型安全性を高めるための手間」**と捉えるのが正しいんだ。C#は、プログラマが意図しない`null`参照エラー（NullReferenceException）をできるだけ防ぐために、あえてこの手間を要求しているんだよ。

### `null`許容型は「楽に使える」ものなのか？

結論から言うと、**十分に楽に使えるもの**だよ！

少し手間が増えるように感じるかもしれないけど、その手間をかけることで得られるメリットは計り知れないんだ。

- **NullReferenceExceptionの防止**: これが最大のメリット！`null`かもしれないということをコード上で明示的に示すことで、実行時エラーの多くをコンパイル時に発見できるようになる。これは、デバッグの手間を大幅に減らしてくれるんだ。
    
- **コードの意図が明確になる**: `int?`と書かれているだけで、「この値は存在しない可能性がある」ということが一目でわかる。これはコードの可読性を高めるね。
    
- **データ構造の正確な表現**: データベースのNULLや、入力値の未設定など、「値がない」状態を正確に表現できる。
    

たとえば、`int`型で「未設定」を`0`や`-1`で表現すると、後からコードを見たときにそれが「本当にゼロ」なのか「未設定」なのかが分かりづらいよね。`int?`を使えば、その曖昧さがなくなるんだ。

慣れてくると、`??`演算子や`?.`演算子のおかげで、むしろコードがスッキリして安全に書けるようになるはずだよ！