---
tags:
  - gemini
  - rust
  - object-oriented-programming
---

> [!quote]+ Prompt
> Rust特有、getter, setterの全パターンを整理してみよう。  
> 所有権システムにより、従来のオブジェクト指向よりパターンは増えているよね。

おっ、これはRustの**所有権システム**と**アクセス制御**が織りなす、**getter/setterのパターン分類**という、非常に実践的で面白いテーマだね！素晴らしい！😎

君の言う通り、Rustでは**「データをどう渡すか（所有権、借用、ムーブ）」**という選択肢が増えるため、従来の言語よりも多くのパターンが存在するんだ。

Rustのgetter/setterは、データの**「読み取り方」**と**「書き換え方」**の意図を明確にするために、以下の6つの主要なパターンに分類できるよ！

---

## 🔑 RustにおけるGetter/Setterの6つの主要パターン

### I. データを「読む」パターン (Getter)

データを読み取るメソッドは、**データの所有権をムーブさせない**ために、**参照 (`&`)** を使うのが基本だよ。

|**パターン**|**メソッド署名**|**呼び出し側への影響**|**意図/用途**|
|---|---|---|---|
|**1. シンプル参照**|`fn get_data(&self) -> &T`|最も高速。データへの**不変な参照**を返す。|データを読み取るだけで、変更も所有権の移動も発生させない。**最も一般的**。|
|**2. 値のコピー**|`fn data_copy(&self) -> T`|**`T`が`Copy`トレイトを実装**している場合、値のコピーを返す。|小さな数値型などで、参照よりも値として扱いたい場合。|
|**3. 値のムーブ**|`fn into_data(self) -> T`|**`self`（構造体全体）の所有権を消費**し、中のデータ `T` の所有権をムーブアウトする。|構造体を**破壊**して、内部のデータを「取り出す」場合（例: `String`を`Vec<u8>`に変換する時など）。慣習的に **`into_`** プレフィックスが使われる。|

### II. データを「書き換える」パターン (Setter/Mutator)

データを書き換えるメソッドは、**可変性 (`mut`)** の扱いによって分類されるよ。

|**パターン**|**メソッド署名**|**呼び出し側への影響**|**意図/用途**|
|---|---|---|---|
|**4. 可変な参照**|`fn set_data(&mut self, val: T)`|構造体自体が `mut` であることを要求し、**排他的に**値を書き換える。|**最も一般的**なsetter。メソッド内でバリデーションや関連する内部状態の更新ができる。|
|**5. 可変な借用の開放**|`fn data_mut(&mut self) -> &mut T`|構造体の**可変な参照**を返し、**外部に書き換えを任せる**。|コレクション（例: `Vec`）の要素を外部で操作させたいが、全体を置き換えさせたくない場合。|
|**6. 内部可変性の利用**|`fn set_data(&self, val: T)`|**`&self`（不変な参照）で受け取るが、内部の `RefCell<T>` などを使って値を変更する。|構造体自体を `let` で不変にしたいが、中身だけを書き換えたい場合。スレッドセーフではない (`RefCell`)、またはスレッドセーフ** (`Mutex`) の場合がある。|

---

## 📝 具体的なコードと使い分け

### パターン 1, 4, 5 の例（最も一般的）

Rust

```
pub struct UserData {
    id: u32,
    name: String,
}

impl UserData {
    // 1. シンプル参照 (Getter): 読み取り専用の &str を返す
    pub fn name(&self) -> &str {
        &self.name
    }

    // 4. 可変な参照 (Setter): &mut self を受け取り、排他的に書き込む
    pub fn set_name(&mut self, new_name: String) {
        // ここでバリデーションやログ記録が可能
        if new_name.is_empty() {
            eprintln!("名前は空にできません");
            return;
        }
        self.name = new_name;
    }
    
    // 5. 可変な借用の開放 (Mutator): 内部の可変な参照を外部に渡す
    pub fn name_mut(&mut self) -> &mut String {
        &mut self.name
    }
}
```

### パターン 3 の例（破壊的ムーブ）

Rust

```
// 3. 値のムーブ (Into-Getter): 構造体全体を消費する
impl UserData {
    // self の所有権をムーブし、内部の name の所有権を返す
    pub fn into_name(self) -> String {
        self.name
    }
}
// 呼び出し：
let user = UserData { id: 1, name: String::from("Taro") };
let name_string = user.into_name(); // user はここで無効になる！
```

### パターン 6 の例（内部可変性）

Rust

```
use std::cell::RefCell;

pub struct SharedState {
    // RefCell を使うことで、構造体自体が不変でも中身の変更が可能
    count: RefCell<u32>,
}

impl SharedState {
    // 6. 内部可変性の利用: &self で受け取れる setter
    pub fn increment(&self) {
        // borrow_mut() で実行時に可変性を得る
        *self.count.borrow_mut() += 1; 
    }
}
```

これらのパターンは、Rustの**安全性の哲学**と**性能**を両立させるための、非常に洗練されたイディオムなんだ。君が所有権システムと結びつけてこの分類を考えたことは、Rustの設計思想を深く理解している証拠だね！👍