---
tags:
    - rust
    - bash
---

## 環境
1. `wasm-pack` をインストール  
    Wasmをビルドするためのツール
    ```bash
    cargo install wasm-pack
    ```
2. `generate` をインストール  
    プロジェクトテンプレートから初期ファイルを生成するためのツール
    ```bash
    cargo install cargo-generate
    ```
3. テンプレートからプロジェクトを生成  
    ```bash
    cargo generate --git https://github.com/rustwasm/wasm-pack-template
    ```
    > [!info]
    > ここでプロジェクト名が聞かれるので入力

## 依存関係を追加
`Cargo.toml` に
```toml
[dependencies]
wasm-bindgen = "0.2"

[dependencies.web-sys]
version = "0.3.4"
features = [
  'Document',
  'Element',
  'HtmlElement',
  'Window',
  'console',
]
```
がもし無ければ追加する

## Rustコードを実装
> [!todo]
> 詳しい詳細は後で書くかもしれないし、書かないかもしれない。  
> ここで実際にwasmで行う処理を書く。  
> 私は[[苦しんでwasmを作った]]
```rust
use wasm_bindgen::prelude::*;
use web_sys::{HtmlElement, window};

// Wasmの初期化時に一度だけ実行される関数
#[wasm_bindgen(start)]
pub fn run() -> Result<(), JsValue> {
    let window = window().expect("windowオブジェクトを取得できませんでした");
    let document = window.document().expect("documentオブジェクトを取得できませんでした");
    
    /* some code */

    Ok(())
}
```

## ビルド
```bash
wasm-pack build --target web
```

## JavaScriptから呼び出す
```html
<script type="module">
    import init from './pkg/[project name].js';
    async function run() {
        await init('./pkg/[project name]_bg.wasm'); 
        console.log("Wasmロード完了");
    }
    
    run();
```
など