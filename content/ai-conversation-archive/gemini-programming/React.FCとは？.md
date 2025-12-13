---
tags:
    - gemini
    - react
---

> [!quote]+ Prompt
> React.FCとは？  
> 特に、functionとの大きな違いは…

それは、**関数コンポーネントの定義方法**における、**TypeScriptユーザーならではの疑問**だね！🚀

結論から言うと、**`React.FC`（Function Component）は、TypeScript環境下で関数コンポーネントを定義するための型**です。しかし、**現代のReact開発では、多くのケースでこれを使わない方が推奨されています**。

---

## 🔑 1. `React.FC` とは？（定義と目的）

`React.FC`（または `React.FunctionComponent`）は、**関数がReactコンポーネントとして動作することを示す型注釈**だよ。

### 目的

- **TypeScriptによる強制**: `React.FC`を使用することで、コンパイラに対して「この関数はReactコンポーネントであり、Reactが期待する振る舞い（Propsを受け取り、JSXを返す）をする」ことを強制し、より厳密な型チェックを行うことができる。
    
- **暗黙的な型付け**: `React.FC`は、コンポーネントのPropsに加えて、**暗黙的に**いくつかの型定義を付与する。
    

---

## ⚔️ 2. `React.FC` と `function` の大きな違い

コンポーネントのロジック自体はどちらも同じだけど、TypeScriptの型システムにおける振る舞いが大きく異なるんだ。

### A. 暗黙的な `children` の有無（過去の主要な論点）

|**項目**|**const MyComponent: React.FC<Props>**|**function MyComponent(props: Props)**|
|---|---|---|
|**`children` の型**|**自動で `children?: ReactNode` が付与される**。|**明示的に `children: ReactNode` を定義しなければ含まれない**。|
|**メリット**|`children`を使うコンポーネントでは定義が楽。|`children`を使わないコンポーネントで、**意図しない`children`の受け入れを防げる**。|

**📌 現状**: 以前は`React.FC`が自動で`children`を含めることが便利だとされていたが、**「`children`を受け取らないコンポーネントにまで不必要に型定義を付与するのは良くない」**という理由で、現在は明示的に定義する方が推奨されているよ。

### B. デフォルト Props の扱い（現在の主要な欠点）

- `React.FC`を使用した場合、関数の外側で定義された **`defaultProps` の型チェックが正しく機能しない**という問題があった（Props型がオプショナルにならない）。
    
- 現在はTypeScriptのバージョンアップで改善されつつあるが、この点が`React.FC`の使用を避ける大きな要因の一つだった。
    

### C. 静的プロパティのサポート

- `React.FC`は、コンポーネント関数自体に静的なプロパティ（例：`MyComponent.displayName`や`MyComponent.propTypes`）を付与する際に、それらのプロパティを**型安全に扱う**ことをサポートしている。
    

---

## 💡 3. 現代のベストプラクティス

現代のReact/TypeScript開発では、特別な理由がない限り、以下の形式で関数コンポーネントを定義するのが**最もシンプルで安全**だと推奨されているよ。

TypeScript

```tsx
// 外部でPropsを明示的に定義する（最も推奨される方法）
type Props = {
  name: string;
  count: number;
  children?: React.ReactNode; // 必要な場合のみ明示的に定義する
};

// 通常の関数形式
const MyComponent = (props: Props) => {
  return <h1>Hello, {props.name}</h1>;
};
```

これにより、Propsの定義が完全に制御下に置かれ、不要な`children`の型や、`defaultProps`の型の問題に悩まされることがなくなるんだ！