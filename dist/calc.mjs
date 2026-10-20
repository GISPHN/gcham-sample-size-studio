// Transparent implementations for the supported, prespecified designs.
// References and applicability are described in README.md and the UI.

export const CONFIG = {
  precision: {
    label: '割合を推定する', subtitle: '信頼区間の幅を決める', citation: 'Wilson (1927); Newcombe (1998)',
    doi: 'https://doi.org/10.1080/01621459.1927.10502953',
    fields: [
      ['p', '予想される割合', .5, 0.01, .99, .01, '先行研究で報告された割合。分からない場合の0.50は必要数が大きくなる設定です。', '%'],
      ['margin', '許容する誤差', .05, .005, .2, .005, '例：±5ポイント以内なら5%。', '%'],
      ['confidence', '信頼水準', .95, .8, .999, .01, '通常は95%。研究目的に合わせて事前に決めます。', '%'],
      ['loss', '未回答・欠測の割合', .2, 0, .9, .01, '解析に使えない人数を見込んで募集人数へ換算します。', '%'],
    ],
    note: '単純無作為抽出の単一割合を対象に、予想割合を中心としたWilsonスコア信頼区間の端までの距離を指定幅以下にします。便宜抽出の代表性は保証しません。'
  },
  means: {
    label: '2群の平均を比較する', subtitle: '検出したい平均差を決める', citation: 'Hsieh, Bloch & Larsen (1998)',
    doi: 'https://pubmed.ncbi.nlm.nih.gov/9699234/',
    fields: [
      ['delta', '意味のある最小の平均差', 5, .1, 100, .1, 'アウトカムの元の単位で入力します。', ''],
      ['sd', '共通の標準偏差', 15, .1, 100, .1, '同じ対象集団での先行研究または予備データを参照。', ''],
      ['ratio', '群2／群1の人数比', 1, .2, 5, .1, '例：同数なら1、群2が2倍なら2。', '倍'],
      ['alpha', '両側有意水準', .05, .001, .2, .001, '複数の主要評価項目がある場合は別途調整を検討。', '%'],
      ['power', '目標検出力', .8, .5, .99, .01, '差が実際にある場合に検出する確率。', '%'],
      ['loss', '脱落・欠測の割合', .15, 0, .9, .01, '群ごとに見込む割合。', '%'],
    ],
    note: '独立した2群、共通の標準偏差、連続アウトカムの平均差を対象とする正規近似です。小標本のt検定、対応のある測定、反復測定にはこの計算を用いません。'
  },
  proportions: {
    label: '2群の割合を比較する', subtitle: '検出したい割合の差を決める', citation: 'Hsieh, Bloch & Larsen (1998)',
    doi: 'https://pubmed.ncbi.nlm.nih.gov/9699234/',
    fields: [
      ['p0', '群1の予想割合', .2, .001, .999, .001, '比較の基準となる群の割合。', '%'],
      ['p1', '群2の予想割合', .3, .001, .999, .001, '検出したい差を反映した群2の割合。', '%'],
      ['ratio', '群2／群1の人数比', 1, .2, 5, .1, '同数なら1。', '倍'],
      ['alpha', '両側有意水準', .05, .001, .2, .001, '事前に設定する有意水準。', '%'],
      ['power', '目標検出力', .8, .5, .99, .01, '一般的な設定例は80%。', '%'],
      ['loss', '脱落・欠測の割合', .15, 0, .9, .01, '群ごとに見込む割合。', '%'],
    ],
    note: '独立した2群の二値アウトカムを対象とする正規近似です。非常にまれなイベントや少数例では近似の妥当性を別途確認してください。'
  },
  regression: {
    label: '回帰で関連を調べる', subtitle: '主要な要因と二値アウトカム', citation: 'Hsieh, Bloch & Larsen (1998)',
    doi: 'https://pubmed.ncbi.nlm.nih.gov/9699234/',
    fields: [
      ['p0', '要因なし群のイベント割合', .2, .001, .999, .001, '比較する二値の主要説明変数が0の群。', '%'],
      ['p1', '要因あり群のイベント割合', .3, .001, .999, .001, '主要説明変数が1の群。差を事前に根拠づけます。', '%'],
      ['exposure', '要因あり群の割合', .5, .05, .95, .01, '対象全体のうち説明変数が1の割合。', '%'],
      ['covr2', '主要要因と調整変数のR²', .1, 0, .8, .01, '主要要因を他の調整変数で説明したときのR²。多重共線性による増分に使用。', ''],
      ['alpha', '両側有意水準', .05, .001, .2, .001, '事前に設定する有意水準。', '%'],
      ['power', '目標検出力', .8, .5, .99, .01, '例：80%。', '%'],
      ['loss', '欠測の割合', .15, 0, .9, .01, '主要変数やアウトカムの欠測を見込む。', '%'],
    ],
    note: '二値アウトカム、二値の主要説明変数の係数を検出するロジスティック回帰の近似です。調整変数との相関による分散増加を反映します。交絡調整の妥当性、まれなイベント、交互作用、非線形項、クラスター構造を保証する計算ではありません。'
  },
  prediction: {
    label: '予測モデルを作る', subtitle: '二値アウトカムの新規モデル', citation: 'Riley et al. (2019), Part II',
    doi: 'https://doi.org/10.1002/sim.7992',
    fields: [
      ['parameters', '候補の予測パラメータ数', 10, 1, 100, 1, '変数の数ではなく自由度。例：4水準カテゴリは3、二次項は追加で1。', '個'],
      ['prevalence', 'アウトカムの発生割合', .2, .005, .9, .005, '開発対象集団での発生割合。', '%'],
      ['csrsq', '予想されるCox–Snell R²', .15, .001, .7, .001, '過去の類似モデルの調整済み値、または外部検証値。通常のR²やAUCをそのまま入れないでください。', ''],
      ['shrinkage', '目標の縮小係数', .9, .8, .99, .01, '原著の既定値0.90以上を推奨。', ''],
      ['loss', '解析できない割合', .1, 0, .9, .01, '開発用データとして使えない割合。', '%'],
    ],
    note: 'Rileyらの二値アウトカム予測モデル開発の3基準を実装しています。候補パラメータの縮小、Nagelkerke R²の楽観度、全体リスクの精度を評価します。機械学習モデルの性能保証や外部検証用の計算ではありません。'
  }
};

const valid = (x, lo, hi, label) => {
  if (!Number.isFinite(x) || x < lo || x > hi) throw new Error(`${label}は${lo}から${hi}の範囲で入力してください。`);
};

// Acklam's inverse standard normal CDF approximation, max relative error ≈ 1.15e-9.
export function normalQuantile(p) {
  valid(p, Number.EPSILON, 1 - Number.EPSILON, '確率');
  const a=[-39.69683028665376,220.9460984245205,-275.9285104469687,138.357751867269, -30.66479806614716,2.506628277459239];
  const b=[-54.47609879822406,161.5858368580409,-155.6989798598866,66.80131188771972,-13.28068155288572];
  const c=[-.007784894002430293,-.3223964580411365,-2.400758277161838,-2.549732539343734,4.374664141464968,2.938163982698783];
  const d=[.007784695709041462,.3224671290700398,2.445134137142996,3.754408661907416];
  const low=.02425, high=1-low;
  if(p<low){const q=Math.sqrt(-2*Math.log(p));return (((((c[0]*q+c[1])*q+c[2])*q+c[3])*q+c[4])*q+c[5])/((((d[0]*q+d[1])*q+d[2])*q+d[3])*q+1);}
  if(p>high) return -normalQuantile(1-p);
  const q=p-.5, r=q*q;
  return (((((a[0]*r+a[1])*r+a[2])*r+a[3])*r+a[4])*r+a[5])*q/(((((b[0]*r+b[1])*r+b[2])*r+b[3])*r+b[4])*r+1);
}

function common(o) { valid(o.loss,0,.9,'未回答・欠測率'); }
function recruit(n, loss) { return Math.ceil(n/(1-loss)); }
function response(result, o, details, method) {
  return { ...result, eligible: result.n, recruit: result.groups
    ? result.groups.map(n=>recruit(n,o.loss)).reduce((a,b)=>a+b,0)
    : recruit(result.n,o.loss), details, method };
}

export function wilson(p,n,z) {
  const t=z*z/n, center=(p+t/2)/(1+t), half=z*Math.sqrt(p*(1-p)/n+t/(4*n))/(1+t);
  return [center-half,center+half];
}
export function precision(o) {
  common(o); valid(o.p,.001,.999,'予想割合');valid(o.margin,.001,.3,'許容誤差');valid(o.confidence,.5,.9999,'信頼水準');
  const z=normalQuantile((1+o.confidence)/2);
  const ok=n=>{const [lo,hi]=wilson(o.p,n,z);return Math.max(o.p-lo,hi-o.p)<=o.margin;};
  let lo=0,hi=1;while(!ok(hi)&&hi<1e9)hi*=2;
  if(hi>=1e9)throw new Error('この設定では計算範囲を超えます。');
  while(hi-lo>1){const mid=Math.floor((hi+lo)/2);if(ok(mid))hi=mid;else lo=mid;}
  const interval=wilson(o.p,hi,z);
  return response({n:hi,interval},o,[`想定する信頼区間: ${(interval[0]*100).toFixed(1)}% ～ ${(interval[1]*100).toFixed(1)}%`], 'Wilsonスコア区間の幅');
}
function zPair(o){valid(o.alpha,.0001,.3,'有意水準');valid(o.power,.5,.999,'検出力');return [normalQuantile(1-o.alpha/2),normalQuantile(o.power)];}
function allocate(total, ratio){let a=Math.max(2,Math.ceil(total/(1+ratio))),b=Math.max(2,Math.ceil(a*ratio));return [a,b];}
export function means(o) {
  common(o);valid(o.delta,.000001,1e6,'平均差');valid(o.sd,.000001,1e6,'標準偏差');valid(o.ratio,.1,10,'人数比');
  const [za,zb]=zPair(o), n0=(za+zb)**2*o.sd**2*(1+1/o.ratio)/o.delta**2;
  const groups=allocate(Math.ceil(n0*(1+o.ratio)),o.ratio);
  return response({n:groups[0]+groups[1],groups},o,[`標準化平均差: ${(o.delta/o.sd).toFixed(3)}`,`正規近似・群間比 ${o.ratio}:1`],'独立2群の平均差');
}
function proportionBase(o,q){valid(o.p0,.0001,.9999,'群1の割合');valid(o.p1,.0001,.9999,'群2の割合');valid(q,.01,.99,'群2の構成割合');
  if(Math.abs(o.p1-o.p0)<1e-12)throw new Error('2群の割合に差がありません。検出したい差を入力してください。');
  const [za,zb]=zPair(o), pbar=(1-q)*o.p0+q*o.p1;
  const nullTerm=Math.sqrt(pbar*(1-pbar)/(q*(1-q)));
  const alternative=Math.sqrt(o.p0*(1-o.p0)/(1-q)+o.p1*(1-o.p1)/q);
  return (za*nullTerm+zb*alternative)**2/(o.p1-o.p0)**2;
}
export function proportions(o) {
  common(o);valid(o.ratio,.1,10,'人数比');const total=proportionBase(o,o.ratio/(1+o.ratio));
  const groups=allocate(Math.ceil(total),o.ratio);
  return response({n:groups[0]+groups[1],groups},o,[`検出する差: ${(100*(o.p1-o.p0)).toFixed(1)}ポイント`], '独立2群の割合差');
}
export function regression(o) {
  common(o);valid(o.exposure,.01,.99,'要因あり割合');valid(o.covr2,0,.95,'調整変数とのR²');
  const unadjusted=proportionBase(o,o.exposure);
  const n=Math.ceil(unadjusted/(1-o.covr2));
  const odds=(o.p1/(1-o.p1))/(o.p0/(1-o.p0));
  return response({n},o,[`想定オッズ比: ${odds.toFixed(2)}`,`調整変数との相関に伴う倍率: ${(1/(1-o.covr2)).toFixed(2)}`, `予想イベント数: ${Math.round(n*((1-o.exposure)*o.p0+o.exposure*o.p1))}`], '二値要因のロジスティック回帰');
}
export function prediction(o) {
  common(o);valid(o.parameters,1,10000,'候補パラメータ数');
  if(!Number.isInteger(o.parameters))throw new Error('候補パラメータ数は整数で入力してください。');
  valid(o.prevalence,.0001,.9999,'発生割合');valid(o.shrinkage,.8,.999,'縮小係数');
  const v=o.prevalence, maxR2=1-Math.exp(2*(v*Math.log(v)+(1-v)*Math.log(1-v)));
  valid(o.csrsq,.000001,maxR2,'Cox–Snell R²');
  if(o.csrsq>=o.shrinkage || o.csrsq>=maxR2)throw new Error('R²が指定した縮小係数または発生割合に対応する上限以上です。');
  const n1=Math.ceil(o.parameters/((o.shrinkage-1)*Math.log(1-o.csrsq/o.shrinkage)));
  const s2=o.csrsq/(o.csrsq+.05*maxR2);
  if(s2<=o.csrsq)throw new Error('R²と発生割合の組合せでは基準2を評価できません。入力値の根拠を確認してください。');
  const n2=Math.ceil(o.parameters/((s2-1)*Math.log(1-o.csrsq/s2)));
  const n3=Math.ceil((1.96/.05)**2*v*(1-v));
  const n=Math.max(n1,n2,n3);
  return response({n,criteria:[n1,n2,n3],events:Math.ceil(n*v),maxR2},o,[`縮小係数の基準: ${n1.toLocaleString()}人`,`R²の楽観度の基準: ${n2.toLocaleString()}人`,`全体リスクの精度: ${n3.toLocaleString()}人`,`予想イベント数: 約${Math.round(n*v).toLocaleString()}件`,`イベント数／パラメータ: ${(n*v/o.parameters).toFixed(1)}（判定基準ではありません）`], 'Rileyらの二値予測モデル開発');
}
export const calculators={precision,means,proportions,regression,prediction};
export function calculate(type, inputs) {
  if(!calculators[type])throw new Error('研究目的を選んでください。');
  const o=Object.fromEntries(CONFIG[type].fields.map(([key])=>[key,Number(inputs[key])]));
  return calculators[type](o);
}
