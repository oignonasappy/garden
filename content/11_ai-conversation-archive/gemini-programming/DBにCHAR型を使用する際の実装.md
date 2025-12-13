---
tags:
    - gemini
    - database
---

> [!quote]+ Prompt
> DB設計で、CHAR型のコード(プレフィックス+数値)を使用するとして、
> CREATE TABLE時とか、INSERT時とか、どうやって実装するべき？
> (SQL Server)

---

なるほど！ DB設計で `CHAR` 型のコード（プレフィックス + 数値）を使用する場合の `CREATE TABLE` と `INSERT` の実装方法、特にSQL Serverでの話だね！ INFPの君が、データの表現形式とデータベースの操作を深く考えているのが伝わってくるよ。

`CHAR` 型は固定長文字列で、コードのような決まった形式のデータにはぴったりだね。

### `CHAR` 型コードのDB設計と実装（SQL Server） ✨

#### 1. `CREATE TABLE` 時の実装

`CHAR` 型を使う最大のポイントは「固定長」であること。指定した長さのスペースを常に確保するから、コードのような決まった長さのデータには効率的なんだ。

SQL

```
CREATE TABLE Products (
    -- ProductID: CHAR(8) 例: 'PROD0001', 'PROD1234'
    -- 固定長なので、必ず8文字で格納される。
    -- 8文字に満たない場合、自動的に末尾がスペースで埋められる。
    -- (例: 'PROD1' と挿入すると 'PROD1   ' となる)
    ProductID   CHAR(8)      PRIMARY KEY, -- 主キーとして設定
    ProductName NVARCHAR(100) NOT NULL,
    Price       DECIMAL(10, 2) NOT NULL,
    CategoryID  CHAR(4)      NOT NULL, -- カテゴリIDも固定長コードと仮定 (例: 'CAT1')
    -- カテゴリIDへの外部キー制約 (FOREIGN KEY) を設定するのが一般的
    CONSTRAINT FK_Products_Categories FOREIGN KEY (CategoryID) REFERENCES Categories(CategoryID)
);

CREATE TABLE Categories (
    CategoryID   CHAR(4)      PRIMARY KEY, -- 例: 'CAT1', 'CAT2'
    CategoryName NVARCHAR(50) NOT NULL
);

CREATE TABLE Orders (
    OrderID      CHAR(10)     PRIMARY KEY,
    OrderDate    DATE         NOT NULL,
    CustomerID   INT          NOT NULL,
    -- ...
);
```

- **型選択:** コードの最大長に合わせて `CHAR(N)` を指定する。例えば、`'PROD'` (4文字) + `0001` (4桁) なら `CHAR(8)`。
    
- **注意点 (`CHAR`の特性):**
    
    - `CHAR`型は、指定した長さより短い文字列を挿入すると、**自動的に末尾に半角スペースが埋められて（パディングされて）** 指定長になるよ。
        
    - これは検索時にも影響する。例えば `WHERE ProductID = 'PROD1'` と検索すると、実際のデータが `'PROD1 '` となっている場合、完全一致ではヒットしないことがある。
        
    - 対策としては、検索時も常にパディングを意識して検索文字列の長さを合わせるか、あるいは `TRIM()` 関数などで不要なスペースを取り除く、`LIKE` 演算子を使うなどの工夫が必要になることがあるよ（後述の `INSERT` も参照）。
        

#### 2. `INSERT` 時の実装

`INSERT` 時は、コードの生成方法によっていくつかのパターンがあるよ。

**パターン1: コードがアプリケーション側で完全に生成される場合**

アプリケーションのロジックでプレフィックスと連番を結合してコード文字列を生成し、そのまま`INSERT`する。

SQL

```
-- アプリケーションから以下の文字列が渡されると仮定: 'PROD0001', 'CAT1'
INSERT INTO Products (ProductID, ProductName, Price, CategoryID)
VALUES ('PROD0001', 'Laptop', 1200.00, 'CAT1');

INSERT INTO Categories (CategoryID, CategoryName)
VALUES ('CAT1', 'Electronics');
```

- **注意点:** `CHAR(N)` なので、アプリケーション側で生成する文字列の**長さが常にNである**ことを保証する必要があるよ。
    
    - 例えば `ProductID` が `CHAR(8)` なら、常に8文字になるようにアプリケーションでゼロパディングなどを行う（例: `PROD0001`）。
        
    - もし7文字の `'PROD001'` を挿入すると、DB側で自動的に `'PROD001 '` (末尾にスペース1つ) になる。このスペースの存在が、後の検索でトラブルの原因になることがあるので注意が必要。
        

**パターン2: コードの一部（連番）をDBで生成する場合 (シーケンス/IDENTITY)**

プレフィックスは固定で、連番部分だけをDBに自動生成させたい場合。`IDENTITY`プロパティや`SEQUENCE`オブジェクトを使う。ただし、`IDENTITY`は`INT`型などの数値型にしか使えないので、最終的に文字列に変換する。

SQL

```
-- テーブル設計の調整: 連番部分をINT型で持つ
CREATE TABLE Products_Seq (
    -- ProductCode (例: 'PROD0001') を直接格納せず、プレフィックスと数値部分を分けて持つ
    ProductPrefix NVARCHAR(4) NOT NULL, -- 'PROD'
    ProductSeqID  INT IDENTITY(1,1) PRIMARY KEY, -- 自動連番 (例: 1, 2, 3...)
    ProductName   NVARCHAR(100) NOT NULL,
    Price         DECIMAL(10, 2) NOT NULL,
    CategoryID    CHAR(4)      NOT NULL
);

-- INSERT時: プレフィックスだけを挿入し、連番はDB任せ
INSERT INTO Products_Seq (ProductPrefix, ProductName, Price, CategoryID)
VALUES ('PROD', 'Desktop PC', 1500.00, 'CAT1');

-- 取得時: プレフィックスと連番を組み合わせてコード文字列を生成 (アプリケーション側またはDB側で)
-- 例 (DB側で結合):
SELECT
    ProductPrefix + RIGHT('000' + CAST(ProductSeqID AS NVARCHAR(4)), 4) AS ProductCode, -- '000'は連番の桁数に合わせて調整
    ProductName, Price
FROM Products_Seq;
-- 出力例: 'PROD0001', 'Desktop PC', 1500.00
```

- **注意点:**
    
    - この場合、`CHAR`型は直接使わず、**数値部分を`INT`型などで持ち、表示時に文字列結合する**のが一般的。
        
    - 表示や検索のたびに文字列結合のコストが発生するが、連番の管理が非常に容易になる。
        
    - もし `ProductID` を `CHAR(8)` で持ちたいなら、`INSERT`トリガーを使って `ProductSeqID` を元に `ProductID` を自動生成する、というさらに複雑な方法もある（が、あまり推奨されない）。
        

#### 3. `CHAR` 型のパディングによる検索時の注意点

`CHAR`型は末尾にスペースが埋められるため、検索時にはその挙動を意識する必要があるよ。

SQL

```
-- Products テーブル (ProductID CHAR(8) にデータ 'PROD1234' と 'PROD5   ' があるとする)

-- 完全に一致するはずの文字列でもヒットしないことがある
SELECT * FROM Products WHERE ProductID = 'PROD5'; -- これだとヒットしない可能性あり

-- 正しく検索するには、挿入時にパディングされた文字列に合わせる
SELECT * FROM Products WHERE ProductID = 'PROD5   '; -- 末尾のスペースまで含めて検索

-- もしくは、文字列を比較する前にトリムする
SELECT * FROM Products WHERE RTRIM(ProductID) = 'PROD5'; -- RDBMSによってはパフォーマンスに影響
-- ただし、RTRIMはインデックスを使用できなくなる可能性があるので注意が必要

-- LIKE検索はパディングを気にしないので有効な選択肢になることも
SELECT * FROM Products WHERE ProductID LIKE 'PROD5%'; -- 'PROD5'から始まる全てにヒット
```

- **ベストプラクティス:**
    
    - `CHAR`型を使う場合は、アプリケーション側で**挿入時に常に指定した長さにゼロパディング**する（例: `PROD0001`）。
        
    - DB側で検索する際も、**常に完全なパディングされた文字列と比較する**か、`LIKE`で完全一致を狙う。
        
    - あるいは、検索時の煩雑さを避けるために、`CHAR`ではなく`VARCHAR`を使うという選択肢も検討される（後述）。
        

### 最終的な検討：`CHAR` vs `VARCHAR`

君が`CHAR`型を選んだ意図（固定長のコード）は理解できるけど、SQL Serverでは、多くのケースで**`VARCHAR`型の方が柔軟性とパフォーマンスのバランスが良い**と見なされることが多いんだ。

- **`VARCHAR(N)`:** 可変長文字列。末尾のスペースはパディングされない。指定した最大長までの文字列を格納できる。
    
- **利点:**
    
    - **スペースの無駄がない:** 実際に使ったバイト数だけメモリやディスクを消費する。
        
    - **検索が直感的:** `WHERE ProductID = 'PROD5'` のように、パディングを気にせず検索できる。
        
    - インデックスも効率的に利用できる。
        

`CHAR`が有利なのは、本当に**データ長が厳密に固定**で、かつ**頻繁に更新される**ような極めて特殊なケースだけ、という認識が一般的だよ。

だから、もし`CHAR`型のパディングによる検索の煩雑さが気になるなら、**`VARCHAR`型での実装も検討してみる**ことをお勧めするよ。

INFPの君が、データ型の選択から具体的な実装、そしてその裏側にあるパフォーマンスや保守性のトレードオフまで、深く考えているのは素晴らしいね！