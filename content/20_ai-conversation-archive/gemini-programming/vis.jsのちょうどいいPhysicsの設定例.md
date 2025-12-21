---
tags:
  - gemini
  - javascript
---

> [!quote]+ Prompt
> vis.jsによる、ObsidianのGraph Viewライクな、動くNetwork Graphの表示をしたいんだけど、  
> Physicsの設定が難しすぎてすぐにカオスが訪れる。  
> いいPhysicsの設定は知らない？
> 
> グラフのノードの構造はおおまかに、  
> 合計20個程度の中規模な表示。  
> 主役となる(フォーカスされた)ノードが1つ存在する。  
> 主役ノードに、系統をまとめるノードが3つほど接続されていて、  
> 系統ノードには、その系統のノードが1~10つほど接続されている  
> 主役ノードからの関連の深さはおよそ1~3ほど、  
> 主役ノードに直接関連しているノードの数は控えめで、系統ノードに直接関連しているノードの数は多めになる。

ObsidianのGraph Viewのような「ふわふわ浮遊感」がありつつ、でも「カオスにならない（暴れない）」設定ですね！任せてください！

`vis.js`のPhysics（物理演算）は、パラメータが一つ違うだけで爆発したり、逆にガチガチに固まったりして、調整が本当に沼ですよね…。

あなたの提示してくれた「全20ノード程度」「主役（1）→系統（3）→末端（多）」という構造は、**ハブとスポークがはっきりしている構造**なので、それに合わせた「安定しつつも有機的な」おすすめ設定（ゴールデンレシピ）を紹介します！

### 結論：この設定コピペしてみて！

Obsidianのような「少し引力が強めで、でもバネは緩やか」な挙動を目指しつつ、20個程度のノードが重ならないように調整した設定です。

JavaScript

```js
var options = {
  nodes: {
    shape: "dot",
    size: 16,
  },
  physics: {
    // 【重要】カオスを防ぐ安定化設定
    enabled: true,
    stabilization: {
      enabled: true,
      iterations: 1000, // 表示前に裏で1000回計算して落ち着かせる
      updateInterval: 25,
      onlyDynamicEdges: false,
      fit: true,
    },
    // ここがObsidian風の挙動のキモ
    solver: "forceAtlas2Based", 
    forceAtlas2Based: {
      gravitationalConstant: -50, // 反発力（マイナスが大きいほど広がる）
      centralGravity: 0.005,      // 中心に引っ張る力（小さいほどふわふわ広がる）
      springLength: 100,          // バネの自然長
      springConstant: 0.08,       // バネの強さ（小さいほどゆるい）
      damping: 0.4,               // 減衰（1に近いほどすぐ止まる。0.4は適度な余韻）
      avoidOverlap: 0             // 計算コスト回避のため0推奨（反発力でカバー）
    },
    // 予備のソルバー（もしforceAtlas2Basedが気に入らない場合）
    /*
    solver: "barnesHut",
    barnesHut: {
      gravitationalConstant: -3000,
      centralGravity: 0.3,
      springLength: 95,
      springConstant: 0.04,
      damping: 0.09,
      avoidOverlap: 0.1
    },
    */
    minVelocity: 0.75 // これ以下になったら計算を止める（揺れ防止）
  }
};
```

---

### 解説：なぜこの設定なのか？

カオス脱却のポイントは以下の3点です。

#### 1. ソルバーを `forceAtlas2Based` にする

デフォルトの `barnesHut` は階層構造には強いですが、Obsidianのような「均等に広がる有機的な美しさ」を出すには `forceAtlas2Based` の方が向いています。特に20ノード程度なら、こちらの方が「クラスター（系統）」が綺麗に分かれます。

#### 2. `centralGravity` を極端に下げる

デフォルト値だと中心への引力が強すぎて、ノードが真ん中で「ギュッ」と潰れて重なりがちです。ここを `0.01` 以下まで下げることで、画面全体を使ってゆったりと広がるようになります。

#### 3. 「主役ノード」を物理的に重くする（超重要！）

設定ファイルだけでなく、データ構造側でちょっとした工夫をすると劇的に安定します。

vis.js では各ノードに mass（質量）を設定できます。

あなたの構造に合わせて、以下のように `mass` を割り振ってみてください。これだけで「主役がどっしり構えて、周りが従う」動きになります。

- **主役ノード:** `mass: 3` （重いので中心から動かない）
    
- **系統ノード:** `mass: 2` （中くらい）
    
- **末端ノード:** `mass: 1` （軽いのでひらひら動く）
    

JavaScript

```js
// データ例
var nodes = [
    { id: 1, label: "主役", mass: 3 }, // 重くする！
    { id: 2, label: "系統A", mass: 2 },
    { id: 3, label: "系統B", mass: 2 },
    { id: 4, label: "末端1", mass: 1 },
    // ...
];
```

### 必殺技：GUIでリアルタイム調整する

実は `vis.js` には、ブラウザ上でスライダーを動かしながら物理演算を調整できる「デバッグモード」があります。これで自分の好みの「プルプル具合」を探すのが一番早いです！

JavaScript

```js
var options = {
  physics: {
    enabled: true,
    // ...他の設定
  },
  // 開発中だけこれをtrueにする
  configure: {
    enabled: true,
    filter: 'physics, nodes', // 調整したい項目だけ出す
    showButton: true
  }
};
```

これを有効にすると、グラフの下に設定パネルが出現します。

「あ、これだ！」という動きになったら、その時の値を「Generate options」ボタンで出力して、コードに書き写せば完了です！

ぜひ、`forceAtlas2Based` と `mass` の設定、試してみてください！Obsidianっぽい「あの感じ」が出るはずですよ！