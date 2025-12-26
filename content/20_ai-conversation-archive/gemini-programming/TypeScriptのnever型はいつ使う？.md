---
tags:
  - gemini
  - javascript
---

> [!quote]+ Prompt
> Tsのnever型はいつ使えばいい？

おっと、ついに**「虚無（never）」の型に辿り着いたね！

TypeScriptにおける never 型は、情報工学的に言うと「ボトム型（Bottom Type）」。つまり、「いかなる値も持つことができない型」**なんだ。

一見すると「値を持てない型なんて、いつ使うんだ？」と思うかもしれないけど、キミが好きな「制限による安全性」を極めるなら、これほど頼もしい守護神はいないよ。

`never` を使いこなすべき「3つの聖域」を解剖しよう！

---

## 1. 網羅性チェック (Exhaustiveness Check)

これが最もコンストラティブな使い方だよ。

例えば、キミがTiptapの機能を switch 文で分岐させているとする。将来、新しい機能を追加した時に「実装し忘れ」をコンパイルエラーで教えてくれる魔法の仕組みだ。

TypeScript

```
type Feature = "bold" | "italic" | "image";

function handleFeature(feature: Feature) {
  switch (feature) {
    case "bold": return "太字";
    case "italic": return "斜体";
    case "image": return "画像";
    default:
      // ここがポイント！
      // もし将来 Feature に "link" が追加されたら、
      // feature は "link" 型になり、never 型に代入できなくなってエラーが出る。
      const _exhaustiveCheck: never = feature;
      return _exhaustiveCheck;
  }
}
```

これは、**「すべての道（ケース）を塞いだはずだ。もしここへ到達する値があるなら、それは論理的な矛盾だ」**とコンパイラに宣言しているんだ。心地よい制限だろ？

---

## 2. 「絶対に返らない」関数の戻り値

関数が最後まで実行されない、つまり「呼び出し元に制御が戻ることが絶対にない」ことを明示する時に使うよ。

- **例外を投げる関数:** `throw new Error()` で終わる。
    
- **無限ループする関数:** プログラムが終了するまで動き続ける。
    

TypeScript

```
function reportFatalError(): never {
  throw new Error("システムに致命的な不協和音が走りました！");
}
```

これを `void`（何も返さない）ではなく `never`（返ることがない）にすることで、それ以降のコードが**デッドコード（実行されない領域）**であることをコンパイラが理解し、最適化に繋がるんだ。

---

## 3. 型パズルでの「除外」フィルタ

キミが興味を持っていた「型パズル」の世界では、never は**「消しゴム」**として活躍するよ。

条件に合わない型を never に飛ばすと、その型は Union 型の中から消滅するんだ。

TypeScript

```
// T から string 以外の型を除去するパズル
type OnlyStrings<T> = T extends string ? T : never;

type Result = OnlyStrings<string | number | boolean>; 
// -> 結果は string 型だけになる！（number と boolean は never になり、消える）
```

---

## 💡 豆知識：`never` と `any` の対極性

- **`any`**: 何でも受け入れる「混沌（エントロピー最大）」
    
- **`never`**: 何も受け入れない「虚無（秩序の極致）」
    

`never` を適切に配置することは、プログラムの宇宙に**「絶対にありえない境界線」**を引くことなんだ。

---

## 🌟 結論：`never` は「規律の証」

キミが「自由を制限することが心地よい」と感じるなら、never 型を愛せるはずだ。

それは、「論理的な矛盾を許さない」というキミの強い意志を型システムに刻み込む行為だからね。

「この変数にはもう何も入る余地はない」と確信したとき、そこに `never` が現れる。美しくないかい？😉

次は、この `never` を使って、さらに複雑な **「テンプレートリテラル型を使った高度なバリデーションパズル」** に挑戦してみる？それとも、別の型の深淵へ行く？