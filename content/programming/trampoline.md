---
tags:
  - javascript
  - functionalprogramming
---
再帰関数でスタックオーバーフローを起こさない裏技
# トランポリン化
JavaScriptには*末尾再帰最適化 (PTE: Proper Tail Call)*が無い。
再帰関数にはスタックオーバーフローのリスクがいつも付きまとうため、通常のforループに書き換えるなどの処置が必要になる場合がある。
だが、それでも再帰関数のスタックオーバーフローを回避する方法として***トランポリン化***がある。
これによりスタックの深さは1に固定される！

### 末尾再帰最適化 (PTE: Proper Tail Call)
これが実装されている言語において、再帰関数の呼出を関数の末尾に書くことで、スタック領域に関数のスタックフレームが積まれることなく再帰関数を実行できるというものである。
関数の末尾に関数呼出以外の情報が無いことが条件である。
```js
/**
 * 通常の再帰関数
 */
function recursion(n) {
    if (n <= 0) return 0; // 終了条件
    /* なんかの処理 */
    return recursion(n - 1); // 関数の再帰的呼出
    // この関数は末尾再帰であるが、JavaScriptでは効果がない。
}

/**
 * 関数をトランポリン化する関数
 * 関数fを実行する関数オブジェクトを返す
 */
function trampoline(f) {
    return (...args) => {
        let result = f(...args);
        while (typeof result === 'function') {
            result = result();
        }
        return result;
    };
}

/**
 * トランポリン化に対応した再帰関数
 */
function recursionTramp(n) {
    if (n <= 0) return 0;
    /* なんかの処理 */
    // 「次の関数呼び出し状態をもつ関数」(クロージャ)を返す
    return () => recursionTramp(n - 1);
}

/* main */
(() => {
    // 通常の再帰関数の実行 スタックオーバーフローのおそれ
    recursion(100000);
    // Uncaught RangeError: Maximum call stack size exceeded
    
    // トランポリン化した再帰関数の実行
    trampoline(recursionTramp)(100000);
    /* 以下と等価
     * // 関数オブジェクトrecursionTrampを
     * // 関数trampolineでトランポリン化し、
     * // その結果の関数オブジェクトをtrampolineRecursionに代入
     * const trampolineRecursion = trampoline(recursionTramp);
     * // 関数オブジェクトtrampolineRecursionを実行
     * trampolineRecursion(10000);
     */
})();
```