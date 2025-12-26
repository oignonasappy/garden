---
tags:
    - java
---


Javaの標準入力集

---

### 事前準備

(コンソールの入力を受ける場合)

```java
import java.util.Scanner;

class ScanSample {
		public static void main(String[] args) {
				Scanner sc = new Scanner(System.in);

				//任意　大規模なプログラムでは閉じるべき
				sc.close();
		}
}
```

以後、クラス,main云々は省略しまう

- 日本語入力ができない場合は
    
    Visual Studio Codeなどの環境では日本語の入力が文字化けしてしまう場合がある
    
    ```java
    import java.util.Scanner;
    
    class ScanSample {
    		public static void main(String[] args) {
    				Scanner sc = new Scanner(System.in, "Shift-JIS");
    				
    				sc.close();
    		}
    }
    ```
    
    PowerShellに入力されるエンコード方式はShift-JIS
    
    対してJavaのScannerが受け取るエンコード方式はデフォルトでUTF-16のため明示する必要がある
    

---

### 入力を読む

一行を読み込む

```java
Scanner sc = new Scanner(System.in);

String line = sc.nextLine();
```

---

一句(次の空白文字まで)を読み込む

```java
Scanner sc = new Scanner(System.in);

String word = sc.next();
```

---

整数一つ(次の空白文字まで)を読み込む

```java
Scanner sc = new Scanner(System.in);

int num = sc.nextInt();
```

自動で型変換される int型に変換できない場合は例外が発生する

数値の前後に空白文字が無いと認識しない

他の型も同様にして可能です (nextDouble())など

---

### 検索

一行に対して指定した文字列を検索

```java
Scanner sc = new Scanner(System.in);

// hahihuheho

String word = sc.findInLine("hi");
System.out.println(word);
// hi

String word = sc.next();
System.out.println(word);
// huheho
```

指定した文字列まではスキップ 区切り文字は無視する

見つからなかった場合nullを返す

---

### 判定

次の行があるか

```java
Scanner sc = new Scanner(System.in);

if (sc.hasNextLine()) {
		String line = sc.nextLine();
}
```

---

次の語句があるか

```java
Scanner sc = new Scanner(System.in);

if (sc.hasNext()) {
		String word = sc.next();
}
```

---

次の語句がint型か

```java
Scanner sc = new Scanner(System.in);

if (sc.hasNextInt()) {
		String num = sc.nextInt();
}
```

数値の前後に空白文字が無いと認識しない

他の型も同様にして可能です (hasNextBoolean())など

---

### 区切り文字

区切り文字を確認、変更

```java
Scanner sc = new Scanner(System.in);

sc.reset();
System.out.println(sc.delimiter());
// \\p{javaWhitespace}+

sc.useDelimiter(",");

System.out.println(sc.delimiter());
// ,
```

---

もっと詳しい情報は公式リファレンスを見てね