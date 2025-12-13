---
tags:
    - gemini
    - database
---

> [!quote]+ Prompt
> SQL Serverにて、
> IDENTITY列が含まれるテーブルにINSERTするときのクエリの書き方として、
> `INSERT table VALUES(/* ... */);` のように、テーブル名の後ろにカラム名を記述せず、なおかつIDENTITY列には想定通りに連番が振られるようにすることはできる？

---

なるほどね！ SQL Serverで、`IDENTITY` 列が含まれるテーブルに `INSERT` するとき、テーブル名の後ろにカラム名を記述せず（つまり `INSERT table VALUES(...)` の形式で）、なおかつ `IDENTITY` 列に想定通りに連番が振られるようにしたい、ということだね。

残念ながら、SQL Serverでは**それはできない**んだ。

### `IDENTITY` 列を含むテーブルへの `INSERT` 時の制約 🚫

SQL Serverにおいて、`IDENTITY` 列が含まれるテーブルに `INSERT` する場合、以下のルールがあるよ。

1. カラムリストの省略は、全てのカラムに値を提供する時のみ可能:
    
    INSERT INTO TableName VALUES (...) という構文は、テーブルの全てのカラムに対して、その順番通りに値を提供する場合にのみ使用できるんだ。
    
2. IDENTITY 列には、通常、値を明示的に提供できない:
    
    IDENTITY 列は、データベースが自動的に値を生成するものだよね。そのため、通常は INSERT 文でその列に値を指定することはできないんだ。値を指定しようとするとエラーになるよ。
    

これらのルールが組み合わさると、君が意図するような書き方は不可能になるんだ。

#### なぜできないのか？

- もし `IDENTITY` 列を含むテーブルに対してカラムリストを省略して `VALUES` を記述した場合、SQL Serverは「全てのカラムに値が提供される」と解釈する。
    
- しかし、`IDENTITY` 列はデータベースが自動生成する列なので、君はそこに値を指定しない（指定できない）ことになる。
    
- 結果として、`IDENTITY` 列に値を提供しようとしていないのに、提供すべきカラム数が足りないと判断され、エラーになるんだ。
    

### `IDENTITY` 列を含むテーブルに `INSERT` する正しい方法 ✨

`IDENTITY` 列を含むテーブルに `INSERT` する場合は、**必ずカラムリストを明示的に記述し、その中に `IDENTITY` 列を含めない**ようにするんだ。

SQL

```
CREATE TABLE Products (
    ProductID INT IDENTITY(1,1) PRIMARY KEY, -- IDENTITY 列
    ProductName NVARCHAR(100) NOT NULL,
    Price DECIMAL(10, 2) NOT NULL
);

-- 正しい INSERT の書き方: カラムリストを明示し、IDENTITY 列を含めない
INSERT INTO Products (ProductName, Price)
VALUES ('Laptop', 1200.00);

-- もう一例
INSERT INTO Products (ProductName, Price)
VALUES ('Mouse', 25.50);

SELECT * FROM Products;
/*
ProductID | ProductName | Price
----------|-------------|-------
1         | Laptop      | 1200.00
2         | Mouse       | 25.50
*/
```

このようにすることで、SQL Serverは `IDENTITY` 列には自動的に連番を振り、それ以外の指定されたカラムにのみ値を挿入してくれるんだ。

### まとめ

SQL Serverでは、`IDENTITY` 列が含まれるテーブルに `INSERT` する際、**テーブル名の後ろにカラム名を省略して `VALUES` 句だけを書くことはできない**よ。これは、`IDENTITY` 列に値を自動生成させるというデータベースの設計と、カラム省略時のSQLの構文ルールによるものなんだ。

**常にカラムリストを明示的に記述し、`IDENTITY` 列はリストから除外する**のが、`IDENTITY` 列を持つテーブルへの `INSERT` の正しい書き方だよ。