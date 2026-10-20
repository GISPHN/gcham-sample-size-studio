# G-CHAM サンプルサイズ設計

研究目的から選ぶ、日本語のサンプルサイズ設計アプリ。`dist/index.html` を静的サイトとして配信します。入力した研究情報はブラウザー内で計算され、サーバーへ送信されません。JSON保存は利用者の端末へのダウンロードです。

公開アプリ（GitHub Pages）: https://gisphn.github.io/gcham-sample-size-studio/

文字の大きさと色は[デジタル庁デザインシステム](https://design.digital.go.jp/dads/)を参考に設計しています。本文と入力に16 CSS px以上、補助情報に14 CSS px以上を使い、主要な文字と背景のコントラスト比を4.5:1以上に設定しています。フォーカス位置も輪郭で示します。公式の部品をそのまま採用した製品ではありません。

## 論文・研究計画書での引用

本アプリを用いて標本数を計算した場合の参考文献例（APA第7版に準じたソフトウェアの表記）：

> Horiike, R. (2026). *G-CHAM sample size studio* (Version 1.1.1) [Web application]. https://github.com/GISPHN/gcham-sample-size-studio

本文中の表記例：`G-CHAM sample size studio（Horiike, 2026）を用いて標本数を計算した。` 使用した版は画面内の表示で確認し、再現性が必要な場合は利用日と[該当するソースのコミット](https://github.com/GISPHN/gcham-sample-size-studio/commits/main/)のSHAも記録してください。

方法欄には、アプリ名だけでなく選択した計算法、入力値とその根拠、許容誤差・有意水準・検出力などの設定、必要解析人数と脱落率による補正を記載してください。計算法を論拠とする場合は、下表の対応する原著論文も引用してください。アプリの引用のみでは計算法や入力値の学術的根拠を示せません。雑誌の投稿規定が異なる場合は、その書式に合わせてください。

## 対応範囲と根拠

| 機能 | 計算法 | 原著論文 |
| --- | --- | --- |
| 単一割合の推定精度 | 予想割合におけるWilsonスコア区間の両端と予想割合との最大距離が許容誤差以内となる最小整数を二分探索 | Wilson EB. Probable inference, the law of succession, and statistical inference. *J Am Stat Assoc*. 1927;22:209–212. DOI: [10.1080/01621459.1927.10502953](https://doi.org/10.1080/01621459.1927.10502953). 区間法の比較: Newcombe RG. *Stat Med*. 1998;17:857–872. [PubMed](https://pubmed.ncbi.nlm.nih.gov/9595616/). |
| 独立2群の平均差 | 正規近似で各群の割付比を考慮。最終的に各群の人数を切り上げ | Hsieh FY, Bloch DA, Larsen MD. A simple method of sample size calculation for linear and logistic regression. *Stat Med*. 1998;17:1623–1634. [PubMed](https://pubmed.ncbi.nlm.nih.gov/9699234/). |
| 独立2群の割合差 | 帰無仮説下のプール割合と対立仮説下の2群の分散を用いる正規近似 | Hsieh, Bloch, Larsen, 1998. |
| 回帰で二値の要因と二値アウトカムの関連を検討 | Hsiehらの二値要因に対する2群の割合差の式に、主要説明変数を他の調整変数で説明するR²に基づく `1/(1−R²)` を乗じる | Hsieh, Bloch, Larsen, 1998. |
| 二値アウトカム予測モデルの新規開発 | 縮小係数0.9以上、見かけと調整後のNagelkerke R²の差0.05以内、全体リスクの許容誤差±0.05の3基準の最大値 | Riley RD et al. Minimum sample size for developing a multivariable prediction model: Part II. *Stat Med*. 2019;38:1276–1296. DOI: [10.1002/sim.7992](https://doi.org/10.1002/sim.7992). 二値アウトカムの計算は原著に基づくRパッケージ [`pmsampsize` の `pmsampsize_bin.R`](https://github.com/cran/pmsampsize/blob/master/R/pmsampsize_bin.R) と照合。生存時間の部分には後発の[訂正](https://doi.org/10.1002/sim.8409)があるため、本アプリは生存時間を扱わない。 |

## 数式と丸め

`z_a = Φ⁻¹(1−α/2)`, `z_b = Φ⁻¹(power)` とします。

平均差では `n_1 = (z_a+z_b)² σ² (1+1/r)/Δ²`、`r = n_2/n_1`。群1の人数を切り上げ、その人数に群間比を掛けて群2の人数も切り上げます。正規近似であり、少数例における非心t分布による厳密検出力ではありません。

割合差では群2の構成割合を `q`、想定割合を `p_0,p_1` とし、`p̄=(1−q)p_0+qp_1` とします。総人数の近似は

`n = {z_a sqrt[p̄(1−p̄)/(q(1−q))] + z_b sqrt[p_0(1−p_0)/(1−q)+p_1(1−p_1)/q]}²/(p_1−p_0)²`。

回帰では、この値に `1/(1−R²)` を乗じて切り上げます。R²はアウトカムモデルのR²ではなく、主要説明変数を調整変数で説明したときの値です。

予測モデルではパラメータ数を `k`、予想Cox–Snell R²を `R`、発生割合を `π`、縮小係数の目標を `S`、`Rmax = 1−exp[2{π ln π+(1−π) ln(1−π)}]` とします。各基準は `ceil[k/{(S−1) ln(1−R/S)}]`、`S₂=R/(R+0.05 Rmax)` を代入した同じ式、`ceil[(1.96/0.05)² π(1−π)]` です。3基準の最大を解析可能人数とします。予想イベント数を併記しますが、固定のイベント数／パラメータ比で判定しません。参照R²は類似した対象集団の調整済み性能または外部検証性能から設定してください。

各方式とも必要解析人数に対し、`1−脱落・未回答等の割合` で除して募集・依頼人数を求めます。2群の場合は群ごとに切り上げます。この補正は非回答バイアスを修正しません。

## 使用範囲

対応のある比較、繰り返し測定、施設・地区などのクラスター標本、複雑な抽出デザイン、生存時間、機械学習モデルの性能保証、予測モデルの外部検証には対応していません。横断研究の便宜抽出から母集団の代表性を保証するものでもありません。初期値は操作例であり、その値を引用可能な先行研究として扱わないでください。

## 再現と検証

```bash
node --test tests/*.test.mjs
```

原著に基づくR実装との代表値照合、数式の独立再計算、無効入力、境界値、群ごとの丸めを試験しています。`dist/calc.mjs` はUIから独立した純粋関数です。公開版では数値欄とスライダーを同期し、前提ごとの曲線、説明文、出典と計算結果を表示します。

`dist/` はGitHub Pagesへ公開する静的サイトです。`.github/workflows/pages.yml` はmainブランチ更新時に計算試験を行い、成功後に`dist/`をGitHub Pagesへデプロイします。初回のみリポジトリの「Settings → Pages → Build and deployment → Source」で「GitHub Actions」を選択してください。`.github/workflows/test.yml` はpushとpull requestの計算試験を実行します。
