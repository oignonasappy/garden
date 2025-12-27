---
tags:
    - java
    - math
---

> https://monologue.asappy.xyz/pages/weird-pi/ からのセルフ転載。

### はじめに

この記事では**まじめに**プログラムで計算をするわけでは**ありません**。  
どちらかと言えば特殊なJavaプログラムについてがメインです。(再帰的無名関数について。任意精度の演算は今回は見送り)

## 突然だが、(チュドノフスキー級数で) π を計算したくなった！

#### Chudnovsky Formula

$$\frac{1}{\pi} = 12 \sum_{k=0}^{\infty} \frac{(-1)^k (6k)! (545140134k + 13591409)}{(3k)! (k!)^3 (640320)^{3k + 3/2}}$$

### 再帰的無名関数

そこで階乗の計算をするんですが、「美しい」階乗のプログラムを書きたくなったのです。**ラムダ式**で。

そこで、このプログラム。

```java
UnaryOperator<Integer> fact = new UnaryOperator<>() {
    @Override
    public Integer apply(Integer n) {
        return ((Function<UnaryOperator<Integer>, UnaryOperator<Integer>>) self -> x -> (x <= 1) ? 1 : x * self.apply(x - 1)).apply(this).apply(n);
    }
};
```

これは、整数を1つ引数にとり、その階乗の値を再帰を用いて計算する関数fact()。  
再帰関数は通常、ラムダ式で書くことは出来ないのですが、  

ここで、Yコンビネータ或は固定点コンビネータの考え方を...  
おい。一体何を言っているんだ、この話はやめだ。

###### Yコンビネータ

Yコンビネータ、もしくは固定点コンビネータをもつ関数とは、  
関数fを引数にとり、その関数fを再帰的に呼び出すための関数gを返す関数です。  
詳しいことは私にはとても書けないので、なんとかご自身で調べてください。

### そんなこんなで実行

はい、ということで、ただのπ計算プログラムはこちらです。

```java
import java.util.function.Function;
import java.util.function.UnaryOperator;

class CalculatePi {
    public static void main(String[] args) {

        UnaryOperator<Integer> fact = new UnaryOperator<>() {
            @Override
            public Integer apply(Integer n) {
                return ((Function<UnaryOperator<Integer>, UnaryOperator<Integer>>) self -> x -> (x <= 1) ? 1 : x * self.apply(x - 1)).apply(this).apply(n);
            }
        };

        Function<Integer, Double> chudnovsky = (n) -> {
            double summa = 0.0;
            for (int i = 0; i < n; i++) {
                summa += (Math.pow(-1, i) * fact.apply(6 * i)) / (fact.apply(3 * i) * Math.pow(fact.apply(i), 3)) * ((13591409.0 + 545140134.0 * i) / Math.pow(640320, 3 * i + 1.5));
            }
            return 1.0 / (12.0 * summa);
        };

        System.out.println("π≒ " + Math.PI + "\n");

        System.out.println("1. " + chudnovsky.apply(1));
        System.out.println("2. " + chudnovsky.apply(2));
        System.out.println("3. " + chudnovsky.apply(3));
        System.out.println("4. " + chudnovsky.apply(4));
        System.out.println("5. " + chudnovsky.apply(5));

    }
}
```

チェドノフスキー級数本来の高速な計算はありません。範囲はdoubleの範囲内までです。  
愚直～

```java
/*
 * π≒ 3.141592653589793
 *
 * 1. 3.1415926535897345
 * 2. 3.1415926535897936
 * 3. 3.1415926535897936
 * 4. 3.1415926535897936
 * 5. 3.1415926535897936
 */
```

速攻で情報落ちしてますね。~~ポンコツ~~  
それもそのはず、チェドノフスキー級数の収束速度は一項ごとに約14桁です。doubleの有効桁数約16桁程度では須臾の間に終わります。

ちゃんともっと任意精度で計算しないのかって？  
日が暮れます。

### おまけ

Chudnovsky FormulaのLaTeX

```LaTeX
\frac{1}{\pi} = 12 \sum_{k=0}^{\infty} \frac{(-1)^k (6k)! (545140134k + 13591409)}{(3k)! (k!)^3 (640320)^{3k + 3/2}}
```

Chudnovsky Formulaのhtml

```html
<math display="block">
    <mfrac>
        <mn>1</mn>
        <mi>&pi;</mi>
    </mfrac>

    <mo>&equals;</mo>

    <mn>12</mn>
    <mo>&InvisibleTimes;</mo>
    <munderover>
        <mo>&sum;</mo>
        <mrow>
            <mi>n</mi>
            <mo>&equals;</mo>
            <mn>0</mn>
        </mrow>
        <mi>&infin;</mi>
    </munderover>
    <mfrac>
        <mrow>
            <msup>
                <mrow>
                    <mo>(</mo>
                    <mn>&minus;1</mn>
                    <mo>)</mo>
                </mrow>
                <mi>n</mi>
            </msup>
            <mo>&InvisibleTimes;</mo>
            <mrow>
                <mo>(</mo>
                <mn>6</mn>
                <mi>n</mi>
                <mo>)</mo>
            </mrow>
            <mo>&excl;</mo>
        </mrow>
        <mrow>
            <mrow>
                <mo>(</mo>
                <mn>3</mn>
                <mi>n</mi>
                <mo>)</mo>
                <mo>&excl;</mo>
            </mrow>
            <mo>&InvisibleTimes;</mo>
            <msup>
                <mrow>
                    <mo>(</mo>
                    <mi>n</mi>
                    <mo>&excl;</mo>
                    <mo>)</mo>
                </mrow>
                <mn>3</mn>
            </msup>
        </mrow>
    </mfrac>
    <mo>&InvisibleTimes;</mo>
    <mfrac>
        <mrow>
            <mn>13591409</mn>
            <mo>+</mo>
            <mn>545140134</mn>
            <mi>n</mi>
        </mrow>
        <msup>
            <mn>640320</mn>
            <mrow>
                <mn>3</mn>
                <mi>n</mi>
                <mo>+</mo>
                <mn>3</mn>
                <mo>/</mo>
                <mn>2</mn>
            </mrow>
        </msup>
    </mfrac>
</math>
```