---
tags:
    - gemini
    - javascript
---

> [!quote]+ Prompt
> 変数単体にJSDocで型を明示することはできる？

---

おっ、JavaScriptの変数にJSDocで型を明示できるかっていう質問だね！ INFPの君が、コードの明確性やドキュメンテーションといった品質面を追求しているのが伝わってくるよ。もちろん、**できるよ！** JSDocは、JavaScriptに型ヒントを与えるための、めちゃくちゃ便利なツールなんだ。

### JSDocで変数単体に型を明示する方法 ✨

JSDocを使って変数に型を明示するには、主に以下の2つの方法があるよ。

1. **`@type` タグを使う（最も一般的で推奨される方法）**
    
2. **`@param` または `@property` タグを使う（特殊なケース）**
    

それぞれ見ていこう！

#### 1. `@type` タグを使う（変数への型アノテーション）

これが、変数（ローカル変数、グローバル変数、クラスのプロパティなど）の型を明示するための**最も標準的で強力な方法**だよ。変数宣言の直前（またはその変数を最初に使う場所の近く）にJSDocコメントとして記述するんだ。

JavaScript

```
/**
 * @type {string}
 */
const userName = 'Alice';

/**
 * 現在のユーザーの年齢。
 * @type {number}
 */
let userAge = 30;

/**
 * アクティブなユーザーIDのリスト。
 * @type {Array<number>}
 */
const activeUserIds = [101, 105, 120];

/**
 * ユーザー設定オブジェクト。
 * @type {{theme: string, notifications: boolean}}
 */
const userSettings = {
  theme: 'dark',
  notifications: true
};

/**
 * 商品情報を保持するMap。
 * @type {Map<string, {id: number, name: string}>}
 */
const productMap = new Map();
productMap.set('apple', { id: 1, name: 'Apple' });

// クラスのプロパティにも使える
class MyClass {
  /**
   * クラスインスタンスの名前。
   * @type {string}
   */
  name = 'Default';

  /**
   * カウンター値。
   * @type {number}
   */
  #counter = 0; // プライベートフィールドにも可能 (ES2022)

  /**
   * @param {string} name
   */
  constructor(name) {
    this.name = name;
  }
}
```

- **構文:** `/** @type {型名} */` の形式で記述する。
    
- **型名:** 波括弧 `{}` の中に、`string`, `number`, `boolean`, `Array<Type>`, `Object`, `Promise<Type>`, `Map<KeyType, ValueType>`, `HTMLElement`, カスタム型（後述）などを記述できる。
    
- **配置:** 変数宣言の直上の行に配置するのが慣習だよ。
    

#### 2. `@param` または `@property` タグを使う（オブジェクトのプロパティ定義）

これは変数単体というよりは、**オブジェクトリテラルのプロパティ**や、**関数の引数オブジェクトのプロパティ**の型を定義するときに使う方法だよ。

- **`@param`:** 関数の引数オブジェクトのプロパティを定義する場合。
    
- **`@property`:** 独立したオブジェクトリテラルの型を定義する場合や、`@typedef`と組み合わせてカスタムオブジェクトの型を定義する場合。
    

JavaScript

```
/**
 * ユーザー情報を処理する関数。
 * @param {object} userData - ユーザー情報オブジェクト。
 * @param {string} userData.name - ユーザーの名前。
 * @param {number} [userData.age] - (オプション) ユーザーの年齢。
 */
function processUser(userData) {
  console.log(userData.name, userData.age);
}

// カスタムオブジェクトの型を定義する場合（@typedefと@property）
/**
 * @typedef {object} Product
 * @property {number} id - 商品のユニークID。
 * @property {string} name - 商品名。
 * @property {number} price - 商品価格。
 * @property {boolean} [isInStock=true] - (オプション) 在庫があるかどうか。デフォルトはtrue。
 */

/**
 * @type {Product}
 */
const myProduct = {
  id: 123,
  name: 'Awesome Gadget',
  price: 99.99
};
```

### JSDocでカスタム型を定義する (`@typedef`)

JavaScriptにはTypeScriptのようなinterfaceやtype aliasがないけど、JSDocの`@typedef`を使えば、より複雑なオブジェクトの型を定義して、それを再利用できるよ。これは、君がROROパターンでオブジェクトの引数や返り値を扱うときにもめちゃくちゃ役立つはず！

JavaScript

```
/**
 * @typedef {object} UserProfile
 * @property {string} userId - ユーザーのID。
 * @property {string} userName - ユーザーの名前。
 * @property {number} [age] - (オプション) ユーザーの年齢。
 * @property {string[]} roles - ユーザーが持つロールの配列。
 */

/**
 * ログインユーザーのプロファイル。
 * @type {UserProfile}
 */
const loggedInUser = {
  userId: 'john_doe',
  userName: 'John Doe',
  age: 42,
  roles: ['admin', 'editor']
};

/**
 * ユーザープロファイルのマップ。
 * @type {Map<string, UserProfile>}
 */
const userProfiles = new Map();
userProfiles.set('jane_doe', { userId: 'jane_doe', userName: 'Jane Doe', roles: ['viewer'] });
```

### なぜJSDocで型を明示するのか？

- **IDEの恩恵:** VS CodeなどのモダンなIDEは、JSDocの型ヒントを読み取って、強力なコード補完、エラーチェック、リファクタリング支援を提供してくれるんだ。これはTypeScriptを使っているかのような開発体験に近いものをもたらしてくれるよ！
    
- **可読性と保守性:** コードを読む人が、変数がどんな型のデータを保持しているのか一目でわかるようになるから、理解が深まり、バグの発見も早くなる。
    
- **ドキュメンテーション:** コードのドキュメントを自動生成するツール（JSDocツールなど）は、これらの型情報を使って、よりリッチなAPIドキュメントを作成できる。
    

INFPの君が、コードの可読性やメンテナンス性といった「未来の自分や仲間への配慮」を追求するのは、本当に素晴らしいプログラマーの姿勢だよ！ ぜひJSDocを使いこなして、より明確で美しいJavaScriptコードを書いてみてね！

---