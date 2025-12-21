---
tags:
  - gemini
  - java
  - functional-programming
---

> [!quote]+ Prompt
> 多くの場合に、  
> メソッドの戻り値がvoidよりは、メソッドチェーンができるように戻り値をthisにした方が直感的に効率的だと思ったんだけど、  
> それほど多用されないように感じる。いったい何がデメリットとなっているの？

---

なるほどね！ メソッドの戻り値が `void` よりも `this` にしてメソッドチェーンできるようにする方が直感的に効率的だと感じているのに、それほど多用されない理由、そしてデメリットについてだね。INFPの君が、コードの「流れるような書き心地」と、その裏側にある設計のトレードオフを深く見つめているのが伝わってくるよ。

君の直感は鋭くて、メソッドチェーンは確かに特定の状況で非常にパワフルで効率的な書き方なんだ。でも、それが「多用されない」のには、いくつかの明確なデメリットと、設計思想の違いが関係しているんだよ。

### メソッドチェーン（`this`を返す）のデメリットと多用されない理由 🤔

メソッドチェーンは、オブジェクトの状態を変更する（セッターのような）メソッドでよく見られるパターンだね。

Java

```
// メソッドチェーンの例 (Java)
public class User {
    private String name;
    private int age;

    public User setName(String name) {
        this.name = name;
        return this; // thisを返す
    }

    public User setAge(int age) {
        this.age = age;
        return this; // thisを返す
    }

    // Builderパターンでよく使われる
    public static void main(String[] args) {
        User user = new User()
            .setName("Alice")
            .setAge(30); // メソッドチェーン
        System.out.println(user.getName() + ", " + user.getAge());
    }
}
```

この書き方は一見スマートだけど、いくつかのデメリットがあるんだ。

#### 1. 可読性の低下（特に複雑なチェーンやデバッグ時）

- **長いチェーンの読みにくさ:** メソッド呼び出しが何重にも連なると、一行が非常に長くなり、コードが読みにくくなることがある。横スクロールが必要になったり、処理の流れを追うのが難しくなったりするね。
    
- **デバッグの困難さ:** デバッガーでステップ実行する際、一つのチェーン全体が一行に見えるため、チェーンの中の特定のメソッドの戻り値や中間状態を確認するのが難しくなることがある。
    

#### 2. 戻り値の喪失（メソッドが何かを返す必要がある場合）

- メソッドチェーンは、メソッドが`this`（つまり自分自身）を返すことで成立するよね。
    
- もし、メソッドが**処理結果として`this`以外の意味のある値**（例えば、`save()`メソッドが保存されたIDを返す、`process()`メソッドが処理成功のブーリアンを返すなど）を返したい場合、**メソッドチェーンのパターンとは両立できない**んだ。
    
    Java
    
    ```
    // 悪い例: メソッドチェーンと意味のある戻り値が衝突
    // public User save() {
    //     // DBに保存し、生成されたIDを返したい！
    //     long generatedId = ...;
    //     return this; // IDが返せない！
    // }
    ```
    

#### 3. 不変性 (Immutability) との相性の悪さ

- メソッドチェーンは、通常、**オブジェクトの内部状態を「変更」する**（ミュータブルな）メソッドで使われる。
    
- しかし、関数型プログラミングの台頭や、並行処理での安全性、予測可能性の向上といった理由から、近年はオブジェクトの内部状態を変更しない**「不変なオブジェクト（Immutable Object）」**の設計が推奨されることが多いんだ。
    
- 不変なオブジェクトの場合、`setName()`のようなメソッドは、**新しいオブジェクトのインスタンスを生成して返す**ことになる。この場合もチェーンは可能だけど、それは`this`を返しているわけではなく、新しいオブジェクトを返している。`User`ではなく`User newInstance`のような型を返す感じだね。
    
    Java
    
    ```
    // 不変なオブジェクトでのチェーン（Builderパターンなどに近い）
    public class ImmutableUser {
        private final String name;
        private final int age;
    
        public ImmutableUser(String name, int age) {
            this.name = name;
            this.age = age;
        }
    
        public ImmutableUser withName(String name) { // 新しいインスタンスを生成して返す
            return new ImmutableUser(name, this.age);
        }
    
        public ImmutableUser withAge(int age) { // 新しいインスタンスを生成して返す
            return new ImmutableUser(this.name, age);
        }
    }
    
    // 利用例:
    ImmutableUser user = new ImmutableUser("Alice", 30)
        .withName("Bob") // 新しいUserインスタンスが返る
        .withAge(31);     // さらに新しいUserインスタンスが返る
    ```
    

#### 4. 設計上の混乱（メソッドの役割の曖昧化）

- 本来、メソッドは単一の責任を持つべき、という原則があるよね。
    
- メソッドチェーンを意識しすぎると、メソッドが「状態を変更する」だけでなく、「次のチェーンのために自分自身を返す」という**二重の役割**を持つように見えてしまうことがある。
    
- これにより、メソッドの意図が曖昧になり、設計が複雑になる可能性があるんだ。
    

### どんなときにメソッドチェーンが「ベスト」なプラクティスとなるか？ ✨

これらのデメリットがあるにもかかわらず、メソッドチェーンが**非常に強力で適切**な場面ももちろんあるよ。

1. **ビルダーパターン (Builder Pattern):**
    
    - 複雑なオブジェクトをステップバイステップで構築する際に、メソッドチェーンは絶大な効果を発揮する。読みやすく、簡潔にオブジェクトを初期化できるんだ。
        
    
    Java
    
    ```
    // JavaのBuilderパターン
    public class UserBuilder {
        private String name;
        private int age;
    
        public UserBuilder setName(String name) { this.name = name; return this; }
        public UserBuilder setAge(int age) { this.age = age; return this; }
        public User build() { return new User(name, age); } // 最後にビルドメソッドでオブジェクトを生成
    }
    
    // 利用例:
    User user = new UserBuilder()
        .setName("Charlie")
        .setAge(25)
        .build();
    ```
    
2. **流れるようなAPI (Fluent API):**
    
    - 特定のドメイン固有言語（DSL）のような、自然言語に近い読みやすいAPIを設計したい場合。
        
    - 例えば、クエリビルダー (`query.where(...).and(...).orderBy(...)`) や、アニメーションライブラリ (`animate.from(...).to(...).duration(...)`) など。
        
3. **セッターなど、副作用のみが目的のメソッド:**
    
    - メソッドの主な目的がオブジェクトの状態を変更するだけで、他の戻り値が不要な場合。ただし、この場合でも`void`にすることで「このメソッドは何も返さない（副作用のみ）」という意図を明確にする選択肢もある。
        

### まとめ

メソッドチェーンは、コードを簡潔にし、流れるような書き心地を提供する強力なパターンだけど、それが「多用されない」のは、主に**戻り値の喪失、可読性の低下、不変性との相性の悪さ**といったデメリットがあるからなんだ。

特に、メソッドが単に`void`であるべきか、それとも`this`を返すべきかという選択は、そのメソッドの**「責任」と「戻り値の意図」** に深く依存するよ。

INFPの君が、コードの書き方一つとっても、その裏にある設計原則やトレードオフといった哲学を深掘りするのは、まさにプログラミングにおける「美と実用性」のバランスを追求するようだね！