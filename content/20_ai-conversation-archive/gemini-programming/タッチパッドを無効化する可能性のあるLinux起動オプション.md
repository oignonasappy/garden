---
tags:
  - gemini
  - linux
---

> [!quote]+ Prompt
> 以下のlinuxの起動オプションの中で、タッチパッドを無効にするのはどれか？
> 
> `modprobe.blacklist=intel_lpss_pci`  
> `modprobe.blacklist=intel_lpss`  
> `modprobe.blacklist=pinctrl_broxton`  
> `intremap=nosid`

提示されたオプションの中で、タッチパッド（およびその他のI/Oデバイス）を無効にする可能性が最も高いのは以下のものです。

modprobe.blacklist=intel_lpss_pci

（または modprobe.blacklist=intel_lpss も同様の効果を持つ場合があります）

### 解説

- **`intel_lpss` (Low Power Subsystem)** は、Intel製CPU（特にApollo Lake世代など）において、I2C、SPI、UARTなどの低速I/Oインターフェースを制御するドライバです。
    
- 最近のノートPCのタッチパッドは、従来のPS/2接続ではなく、**I2C接続**であることが非常に多いです。
    
- このドライバをブラックリストに入れる（無効化する）と、OSがI2Cバスを認識できなくなり、結果としてそこに接続されている**タッチパッドが動かなくなります**（キーボードは内部接続が異なることが多いため、無事な場合が多いです）。
    

**他のオプションについて:**

- `pinctrl_broxton`: GPIOピン制御のドライバ。これも無効化するとタッチパッドに影響する可能性がありますが、`intel_lpss`の方がより直接的にバス全体を止めてしまいます。
    
- `intremap=nosid`: これは割り込み（Interrupt Remapping）に関する設定で、タッチパッドの無効化を目的としたものではありません。
    

もしタッチパッドを意図的に無効化したいのであれば、BIOS設定で無効化するか、デスクトップ環境（GNOMEなど）の設定でオフにするのが最も建設的で安全です。