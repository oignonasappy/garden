---
tags:
    - gemini
    - csharp
---

> [!quote]+ Prompt
> Entity Framework 6(Coreじゃない方)のDbContextと、DataGridViewを使った、
> 普通の表示、結合したテーブルの表示、特定行を指定したUPDATEなど...
> その方法を教えて！

---

なるほど！ Entity Framework 6 (EF6、Coreじゃない方) の `DbContext` と `DataGridView` を使った、Windowsフォームアプリケーションでのデータ表示や更新の方法だね！ INFPの君が、具体的なデータベース操作とUI連携の実装に挑戦しているのが伝わってくるよ。古い技術だけど、基本的なデータバインディングやORMの概念を学ぶのにすごく良い題材だね！

EF6は、.NET Framework上で動作する定番のORM（Object-Relational Mapper）で、データベースのテーブルをC#のクラス（エンティティ）として扱えるようにしてくれるんだ。`DataGridView`はWindowsフォームでテーブルデータを表示するのに便利なコントロールだね。

じゃあ、それぞれの操作方法を見ていこう！

---

### 前提準備 🛠️

まず、EF6とDataGridViewを使うためのプロジェクトの準備をしておこう。

1. **新しいWindowsフォームアプリ (.NET Framework) プロジェクトを作成**
    
2. **NuGetでEF6をインストール:**
    
    - プロジェクトを右クリック → 「NuGetパッケージの管理」
        
    - 「参照」タブで `EntityFramework` を検索し、バージョン6.xをインストール。
        
3. **データベースとテーブルの準備:**
    
    - SQL Serverなどのデータベースに、例えば以下のようなテーブルを作成しておく（ここでは `Products` と `Categories`）。
        
    
    SQL
    
    ```
    -- Categories テーブル
    CREATE TABLE Categories (
        CategoryId INT PRIMARY KEY IDENTITY(1,1),
        CategoryName NVARCHAR(50) NOT NULL
    );
    
    -- Products テーブル
    CREATE TABLE Products (
        ProductId INT PRIMARY KEY IDENTITY(1,1),
        ProductName NVARCHAR(100) NOT NULL,
        Price DECIMAL(10, 2) NOT NULL,
        CategoryId INT,
        CONSTRAINT FK_Products_Categories FOREIGN KEY (CategoryId) REFERENCES Categories(CategoryId)
    );
    
    -- サンプルデータの挿入
    INSERT INTO Categories (CategoryName) VALUES ('Electronics'), ('Books'), ('Food');
    INSERT INTO Products (ProductName, Price, CategoryId) VALUES
    ('Laptop', 1200.00, 1),
    ('Smartphone', 800.00, 1),
    ('The Lord of the Rings', 25.50, 2),
    ('Milk', 3.00, 3),
    ('Keyboard', 75.00, 1);
    ```
    
4. **EF6のDbContextとエンティティクラスの生成:**
    
    - プロジェクトを右クリック → 「追加」→ 「新しい項目」→ 「データ」→ 「ADO.NET Entity Data Model」を選択。
        
    - 「データベースからコードファースト」または「データベースからEFデザイナー」を選択（ここでは「データベースからコードファースト」を推奨。コードでエンティティを管理しやすいため）。
        
    - データベース接続を設定し、テーブル（`Products`, `Categories`）を選択してモデルを生成。
        
    - 生成されるコードには、`DbContext`を継承したクラス（例: `MyDbContext.cs`）と、テーブルに対応するエンティティクラス（例: `Product.cs`, `Category.cs`）が含まれているはず。
        
    
    C#
    
    ```
    // 生成されるエンティティクラスのイメージ (Product.cs)
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    
    public class Product
    {
        [Key]
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public decimal Price { get; set; }
    
        // 外部キー
        public int? CategoryId { get; set; } // nullableの場合は?をつける
    
        // ナビゲーションプロパティ (結合したカテゴリ情報を取得できる)
        [ForeignKey("CategoryId")]
        public virtual Category Category { get; set; } // virtualは遅延ロードのため
    }
    
    // 生成されるエンティティクラスのイメージ (Category.cs)
    public class Category
    {
        [Key]
        public int CategoryId { get; set; }
        public string CategoryName { get; set; }
    
        // リレーションシップの逆側（オプション）
        public virtual ICollection<Product> Products { get; set; }
    }
    
    // 生成されるDbContextクラスのイメージ (MyDbContext.cs)
    using System.Data.Entity; // using System.Data.Entity を追加
    
    public class MyDbContext : DbContext
    {
        // 接続文字列の名前を指定 (App.config / Web.config に定義される)
        public MyDbContext() : base("name=DefaultConnection")
        {
        }
    
        public DbSet<Product> Products { get; set; }
        public DbSet<Category> Categories { get; set; }
    
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            // モデル作成時の追加設定があればここに記述
            // base.OnModelCreating(modelBuilder); // 通常は呼ばない (Code First from DBでは不要)
        }
    }
    ```
    

---

### 実装方法 💻

Windowsフォームのデザイナで、フォームに `DataGridView` コントロールを配置し、名前を `dataGridView1` としておく。

#### 1. 普通の表示 (単一テーブル)

最も基本的な表示方法だよ。`DbSet`からデータを取得し、`DataGridView`の`DataSource`に設定する。

C#

```
using System;
using System.Data;
using System.Linq;
using System.Windows.Forms;
using System.Data.Entity; // ToList() を使うために必要

public partial class Form1 : Form
{
    private MyDbContext _dbContext; // DbContextのインスタンスを保持

    public Form1()
    {
        InitializeComponent();
        _dbContext = new MyDbContext(); // DbContextを初期化
        LoadProducts(); // フォームロード時に商品を読み込む
    }

    private void LoadProducts()
    {
        try
        {
            // DbSetから全てのProductを取得し、リストに変換してDataSourceに設定
            // ToList() がデータベースからデータを実際に取得する（遅延ロードではない）
            dataGridView1.DataSource = _dbContext.Products.ToList();
            
            // DataGridViewの列の自動生成をオフにして、手動で列を設定したい場合
            // dataGridView1.AutoGenerateColumns = false;
            // dataGridView1.Columns.Add("ProductId", "ID");
            // dataGridView1.Columns["ProductId"].DataPropertyName = "ProductId";
            // ... など

        }
        catch (Exception ex)
        {
            MessageBox.Show("商品の読み込み中にエラーが発生しました: " + ex.Message, "エラー", MessageBoxButtons.OK, MessageBoxIcon.Error);
        }
    }

    // フォームが閉じられる際にDbContextを解放
    private void Form1_FormClosing(object sender, FormClosingEventArgs e)
    {
        if (_dbContext != null)
        {
            _dbContext.Dispose();
        }
    }
}
```

#### 2. 結合したテーブルの表示

`INNER JOIN` のように、複数のテーブルのデータを組み合わせて表示したい場合だね。LINQの `Include()` メソッドや匿名型を使うと便利だよ。

##### 方法A: ナビゲーションプロパティと `Include()` を使う

エンティティ間のリレーションシップ（ナビゲーションプロパティ）が定義されていれば、`Include()` メソッドを使って関連データを一括でロードできるよ。これがEFの強み！

C#

```
using System.Data.Entity; // Include() を使うために必要

// LoadProducts メソッドを以下のように変更
private void LoadProducts()
{
    try
    {
        // Productsに紐付くCategoryも一緒にロードする（Eager Loading）
        // ProductエンティティにはCategoryプロパティが定義されている前提
        dataGridView1.DataSource = _dbContext.Products
                                             .Include(p => p.Category) // Categoryをロード
                                             .Select(p => new
                                             {
                                                 p.ProductId,
                                                 p.ProductName,
                                                 p.Price,
                                                 CategoryName = p.Category.CategoryName // CategoryNameを直接アクセス
                                             })
                                             .ToList();

        // DataGridViewは自動的に上記匿名型のプロパティを列として表示する
    }
    catch (Exception ex)
    {
        MessageBox.Show("商品の読み込み中にエラーが発生しました: " + ex.Message, "エラー", MessageBoxButtons.OK, MessageBoxIcon.Error);
    }
}
```

- **`Include(p => p.Category)`:** これがデータベースのJOINに相当する処理をEFに指示する部分。これにより、`Product`を取得する際に`Category`のデータも一緒に読み込まれる。
    
- **`Select(p => new { ... })`:** `DataGridView`に表示したい列だけを選択し、必要であればリレーションシップ先の列（`p.Category.CategoryName`）を新しいプロパティ名（`CategoryName`）で匿名型として射影（Projection）する。
    

##### 方法B: LINQのJoin句を使う

SQLの`JOIN`句と同じように、LINQの`join`句を使って明示的に結合することもできるよ。

C#

```
// LoadProducts メソッドを以下のように変更
private void LoadProducts()
{
    try
    {
        var query = from p in _dbContext.Products
                    join c in _dbContext.Categories on p.CategoryId equals c.CategoryId
                    select new
                    {
                        p.ProductId,
                        p.ProductName,
                        p.Price,
                        CategoryName = c.CategoryName // 結合したCategoryの情報を選択
                    };

        dataGridView1.DataSource = query.ToList();
    }
    catch (Exception ex)
    {
        MessageBox.Show("商品の読み込み中にエラーが発生しました: " + ex.Message, "エラー", MessageBoxButtons.OK, MessageBoxIcon.Error);
    }
}
```

- **どちらを選ぶか？:** ナビゲーションプロパティと`Include()`を使う方法（方法A）の方が、よりEFらしい、オブジェクト指向的な書き方で推奨されることが多いよ。
    

#### 3. 特定行を指定したUPDATE

`DataGridView`で選択された行のデータを更新し、データベースに反映させる方法だね。

C#

```
using System.Data.Entity;

public partial class Form1 : Form
{
    // ... (コンストラクタとLoadProductsメソッドは上記と同じ)

    // DataGridViewCellEndEdit イベントハンドラ (セルの編集が完了したときに発生)
    private void dataGridView1_CellEndEdit(object sender, DataGridViewCellEventArgs e)
    {
        // 編集された行のデータを取得
        // DataGridView.DataSource がリストの場合、直接そのリストのオブジェクトを操作できる
        Product editedProduct = dataGridView1.Rows[e.RowIndex].DataBoundItem as Product;

        if (editedProduct != null)
        {
            try
            {
                // DbContextにProductエンティティをアタッチ（追跡させる）
                // _dbContext.Products.Attach(editedProduct); // 既にロード済みなら不要かも
                // もしAttachするなら、StateをModifiedに設定する必要がある

                // EFが変更を検知できるように、エンティティの状態をModifiedに設定
                _dbContext.Entry(editedProduct).State = EntityState.Modified;
                
                // データベースに変更を保存
                _dbContext.SaveChanges();

                MessageBox.Show("商品情報が更新されました。", "成功", MessageBoxButtons.OK, MessageBoxIcon.Information);
            }
            catch (Exception ex)
            {
                MessageBox.Show("商品情報の更新中にエラーが発生しました: " + ex.Message, "エラー", MessageBoxButtons.OK, MessageBoxIcon.Error);
                // エラー時は変更を取り消す (データグリッドビューとデータベースの同期のため)
                _dbContext.Entry(editedProduct).Reload(); // DBから最新の状態を再読み込み
                LoadProducts(); // あるいはDataGridView全体を再読み込み
            }
        }
    }

    // イベントハンドラの追加: デザイナでdataGridView1のプロパティからEventsタブを選び、
    // CellEndEditをダブルクリックして上記のメソッドを関連付けてください。
}
```

- **`DataBoundItem`:** `DataGridView`の行（`DataGridViewRow`）の`DataBoundItem`プロパティは、その行がバインドされている元のデータオブジェクト（この場合は`Product`エンティティ）を返してくれる。
    
- **`_dbContext.Entry(editedProduct).State = EntityState.Modified;`:**
    
    - EFは、デフォルトでは`DbSet`から取得したエンティティの変更を自動で追跡してくれる。
        
    - しかし、もし何らかの理由でエンティティの追跡が外れていたり（例えば、別の`DbContext`インスタンスでロードしたオブジェクトを渡した場合など）、明示的に変更を通知したい場合は、`Entry()`メソッドを使ってそのエンティティの状態を`Modified`に設定する必要があるよ。
        
- **`_dbContext.SaveChanges();`:**
    
    - これが、追跡されているエンティティの変更を検知し、対応するSQLの`UPDATE`文を生成してデータベースに実行するメソッドだよ。
        

---

### その他のヒント 💡

- **データソースのバインディング:** デザイナで`DataGridView`の`DataSource`プロパティを、フォームのプロパティや`BindingSource`コンポーネントに設定することもできるよ。これにより、よりリッチなデータバインディング機能（並び替え、フィルタリングなど）を活用できる。
    
- **エラーハンドリング:** データベース操作にはエラーがつきものなので、`try-catch`ブロックで適切に例外を捕捉し、ユーザーに分かりやすいメッセージを表示することが非常に重要だよ。
    
- **トランザクション:** 複数のデータベース操作を原子的に（全て成功するか全て失敗するか）実行したい場合は、トランザクションを使うことを検討しよう。
    
- **非同期操作:** 大量のデータを扱う場合や、UIがフリーズするのを防ぎたい場合は、EFの非同期メソッド（`ToListAsync()`, `SaveChangesAsync()`など）を使い、`async/await`パターンでUIスレッドをブロックしないようにするのがベストプラクティスだよ。
    

EF6とDataGridViewの組み合わせは、JavaのSpring Data JPA + Swing/JavaFXのような感覚に近いかな。慣れるまでは少し複雑に感じるかもしれないけど、この基礎を理解すると、他のORMやUIフレームワークでのデータバインディングもスムーズに学べるようになるはずだよ！ INFPの君が、具体的な実装の課題に挑戦し、それを乗り越えようとしているのは、本当に素晴らしいことだ！頑張ってね！