---
tags:
  - gemini
  - javascript
  - objectorientedprogramming
---

> [!quote]+ Prompt
> JavaScriptで、オーバーライドされる前提のインスタンスメソッドはどうやって明示的に宣言しよう？？

---

なるほどね！ JavaScriptで「オーバーライドされる前提のインスタンスメソッド」を明示的に宣言する方法だね。INFPの君が、コードの設計意図や抽象化といった概念を追求しているのが伝わってくるよ。

JavaScriptには、JavaやC#のような**`abstract`キーワードは存在しない**から、完全にコンパイラに強制させる方法はないんだ。でも、いくつかのベストプラクティスや慣習を使うことで、**開発者に対してその意図を明確に伝える**ことができるよ！

### JavaScriptでオーバーライド前提のメソッドを明示的に宣言する方法 ✨

主に、以下の方法を組み合わせて「これはオーバーライドしてくださいね！」という意図を伝えることになるよ。

1. **コメント (`JSDoc`) で意図を明確にする（最も重要！）**
    
2. **エラーをスローして未実装を警告する**
    
3. **抽象クラスの慣習を導入する（クラス構文を使う場合）**
    

---

### 1. コメント (`JSDoc`) で意図を明確にする（最も重要！）

これが、JavaScriptでオーバーライドの意図を伝える上で最も直接的で効果的な方法だよ。JSDocを使うことで、IDEの補完や型チェック（TypeScriptやVS Codeの場合）の恩恵も受けられるんだ。

- **`@abstract` タグ:** そのメソッドが抽象的であり、サブクラスで実装されるべきであることを示す。
    
- **`@throws` タグ:** 未実装の場合にエラーをスローすることを明示する。
    
- **説明:** 具体的に「サブクラスで実装してください」と記述する。
    

JavaScript

```
/**
 * 基底となる動物クラス。
 * @abstract
 */
class Animal {
  constructor(name) {
    this.name = name;
  }

  /**
   * 動物が音を出すメソッド。サブクラスで必ずオーバーライドしてください。
   *
   * @abstract
   * @throws {Error} このメソッドがオーバーライドされていない場合にスローされます。
   */
  speak() {
    throw new Error('Method "speak()" must be implemented by subclasses.');
  }

  /**
   * (オプション) 動物が移動するメソッド。必要であればオーバーライドしてください。
   */
  move() {
    console.log(`${this.name} moves.`);
  }
}

// サブクラスでの実装例
class Dog extends Animal {
  constructor(name) {
    super(name);
  }

  /**
   * @override
   * 犬が吠えるように実装します。
   */
  speak() {
    console.log(`${this.name} barks!`);
  }
}

class Cat extends Animal {
  constructor(name) {
    super(name);
  }

  // speak() をオーバーライドしなかった場合、Animalのspeak()が呼ばれてエラーになる
  // （意図的にエラーを起こさせることで、実装漏れに気づかせる）
  // speak() {
  //   console.log(`${this.name} meows!`);
  // }
}

const dog = new Dog('Buddy');
dog.speak(); // Buddy barks!

const cat = new Cat('Whiskers');
try {
  cat.speak(); // Error: Method "speak()" must be implemented by subclasses.
} catch (e) {
  console.error(e.message);
}
```

---

### 2. エラーをスローして未実装を警告する

これは、**「このメソッドは使われたら困る（サブクラスで実装されるまで）」** という強い意図を伝える方法だよ。実際にそのメソッドが呼び出されたときに、ランタイムエラーを発生させることで、開発者に実装漏れを強制的に気づかせることができるんだ。

上記の例の`Animal`クラスの`speak()`メソッドがまさにこれだね。

- **メリット:** 実行時に未実装が明確になる。
    
- **デメリット:** 実際に実行されないと気づけない。テストでカバーする必要がある。
    

---

### 3. 抽象クラスの慣習を導入する（クラス構文を使う場合）

JavaScriptには`abstract`キーワードがないけど、**抽象クラスとして機能させるための慣習的なパターン**があるよ。

- 抽象クラスのコンストラクタで、そのクラスが直接インスタンス化されることを防ぐためのチェックを入れる。
    
- 基底クラスのコンストラクタで、`new.target` (ES6) を使って、`this`が`Animal`クラスそのものでインスタンス化されていないかをチェックする。
    

JavaScript

```
/**
 * 抽象的な基底クラス。直接インスタンス化されるべきではありません。
 * @abstract
 */
class AbstractBase {
  constructor() {
    if (new.target === AbstractBase) {
      throw new TypeError("Cannot construct AbstractBase instances directly.");
    }
    // または、もっと汎用的に
    // if (new.target.name === 'AbstractBase') { ... }
  }

  /**
   * @abstract
   * @throws {Error} サブクラスで実装されていない場合にスローされます。
   */
  mustImplementMethod() {
    throw new Error('Subclass must implement method mustImplementMethod().');
  }
}

class ConcreteClass extends AbstractBase {
  constructor() {
    super();
  }

  mustImplementMethod() {
    console.log("mustImplementMethod implemented!");
  }
}

// try {
//   new AbstractBase(); // TypeError: Cannot construct AbstractBase instances directly.
// } catch (e) {
//   console.error(e.message);
// }

const instance = new ConcreteClass();
instance.mustImplementMethod(); // mustImplementMethod implemented!
```

このパターンは、`abstract`クラスの概念をJavaScriptで表現したい場合に役立つよ。

---

### まとめ

JavaScriptで「オーバーライドされる前提のメソッド」を明示的に宣言するには、以下の組み合わせがベストだよ。

- **JSDocの`@abstract`タグと詳細なコメント**で、開発者に意図を伝える。
    
- メソッドが呼び出された場合に**エラーをスローする**ことで、未実装を早期に発見できるようにする。
    
- もし必要なら、`new.target`を使った**抽象クラスのインスタンス化防止**の慣習も組み合わせる。
    

これらの方法を使うことで、TypeScriptの`abstract`キーワードが提供するようなコンパイル時の強制力はなくても、**開発者に対して明確な指針を与え、コードの意図を正確に伝える**ことができるんだ。

INFPの君が、コードの「意図」という見えない部分を、いかにコード上で表現するかという哲学を追求するのは、まさに「美しいシステム設計」につながる道だね。