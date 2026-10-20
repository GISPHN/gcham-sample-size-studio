import {CONFIG,calculate} from './calc.mjs';

const $=s=>document.querySelector(s);
const format=n=>n.toLocaleString('ja-JP');
const pct=v=>`${(v*100).toFixed(v*100%1===0?0:1)}%`;
let selected='precision';
const values=Object.fromEntries(Object.entries(CONFIG).map(([type,c])=>[type,Object.fromEntries(c.fields.map(([key,,value])=>[key,value]))]));
const evidence=Object.fromEntries(Object.keys(CONFIG).map(k=>[k,'']));
const icons={precision:'◎',means:'≍',proportions:'◫',regression:'↗',prediction:'◇'};
const badges={precision:'推定の精度',means:'2群比較',proportions:'2群比較',regression:'関連の検証',prediction:'モデル開発'};

function choices(){
  $('#choices').innerHTML=Object.entries(CONFIG).map(([key,c],i)=>`<button class="choicecard ${key===selected?'chosen':''}" data-type="${key}" aria-pressed="${key===selected}"><span class="choicetop"><span class="choiceicon">${icons[key]}</span><span class="choicenum">0${i+1}</span></span><span class="choicetitle">${c.label}</span><span class="choicesub">${c.subtitle}</span><span class="choicebottom">${badges[key]} <span>↗</span></span></button>`).join('');
  document.querySelectorAll('.choicecard').forEach(b=>b.addEventListener('click',()=>{evidence[selected]=$('#evidenceInput').value;selected=b.dataset.type;render();}));
}
function valueString(v,unit){return unit==='%'?pct(v):String(v);}
function fields(){
  const c=CONFIG[selected];$('#selectedName').textContent=c.label;$('#selectedSub').textContent=c.subtitle;
  $('#fields').innerHTML=c.fields.map(([key,label,def,min,max,step,hint,unit])=>{
    const v=values[selected][key],factor=unit==='%'?100:1;
    const shown=Number((v*factor).toFixed(4));
    return `<div class="field"><div class="fieldtop"><label for="number_${key}">${label}</label><span class="fieldvalue"><input id="number_${key}" data-key="${key}" data-scale="${factor}" type="number" min="${min*factor}" max="${max*factor}" step="${step*factor}" value="${shown}" aria-label="${label}"><span>${unit}</span></span></div><input type="range" id="range_${key}" data-key="${key}" min="${min}" max="${max}" step="${step}" value="${v}" aria-label="${label}を調整"><small>${hint}</small></div>`;
  }).join('');
  document.querySelectorAll('.field input').forEach(input=>input.addEventListener('input',()=>{
    const key=input.dataset.key;
    const v=input.type==='range'?Number(input.value):Number(input.value)/Number(input.dataset.scale);
    if(!Number.isFinite(v))return;
    values[selected][key]=v;
    const sibling=$(`#${input.type==='range'?'number':'range'}_${key}`);
    if(input.type==='range')sibling.value=Number((v*Number(sibling.dataset.scale)).toFixed(4));else sibling.value=v;
    update();
  }));
  $('#evidenceInput').value=evidence[selected];
  $('#evidenceInput').oninput=()=>{evidence[selected]=$('#evidenceInput').value;update();};
}
function draft(r){
  const o=values[selected],c=CONFIG[selected];
  let core='';
  if(selected==='precision')core=`予想割合${pct(o.p)}、信頼水準${pct(o.confidence)}、許容誤差±${pct(o.margin)}としてWilsonスコア信頼区間に基づき算出した。`;
  if(selected==='means')core=`独立した2群の平均差${o.delta}、共通標準偏差${o.sd}、群2／群1の人数比${o.ratio}、両側有意水準${pct(o.alpha)}、検出力${pct(o.power)}を設定し、正規近似により算出した。`;
  if(selected==='proportions')core=`独立した2群の割合を${pct(o.p0)}および${pct(o.p1)}、群2／群1の人数比${o.ratio}、両側有意水準${pct(o.alpha)}、検出力${pct(o.power)}として、割合差の正規近似により算出した。`;
  if(selected==='regression')core=`二値アウトカムに対する二値の主要説明変数の関連を検討する。要因なし群のイベント割合${pct(o.p0)}、要因あり群${pct(o.p1)}、要因あり群の構成割合${pct(o.exposure)}、主要説明変数と調整変数のR²=${o.covr2}、両側有意水準${pct(o.alpha)}、検出力${pct(o.power)}を設定した。Hsiehらの2群割合の近似に1/(1−R²)を乗じた。`;
  if(selected==='prediction')core=`二値アウトカムの予測モデル開発について、候補パラメータ${o.parameters}個、アウトカム発生割合${pct(o.prevalence)}、予想Cox–Snell R²=${o.csrsq}、目標縮小係数${o.shrinkage}を設定した。Rileyらの縮小係数、見かけと調整後のNagelkerke R²の差、全体リスクの推定精度という3基準（それぞれ${r.criteria.map(format).join('、')}人）を評価した。`;
  return `標本数は${c.citation}に基づいて事前に設定した。入力値の根拠は「${evidence[selected].trim()}」である。${core}解析に必要な人数は${format(r.n)}人${r.groups?`（群1 ${format(r.groups[0])}人、群2 ${format(r.groups[1])}人）`:''}と算出された。${pct(o.loss)}の脱落・未回答等を見込み、募集・依頼人数は${format(r.recruit)}人とした。`;
}
function chart(){
  const c=CONFIG[selected],o=values[selected];
  const key={precision:'p',means:'delta',proportions:'p1',regression:'p1',prediction:'csrsq'}[selected];
  const f=c.fields.find(x=>x[0]===key),v=o[key], min=f[3],max=f[4];
  const lo=Math.max(min,v*.6),hi=Math.min(max,v*1.4);
  const pts=[];for(let i=0;i<=20;i++){const x=lo+(hi-lo)*i/20;try{pts.push([x,calculate(selected,{...o,[key]:x}).n]);}catch{}}
  $('#chartCaption').textContent=`${f[1]}を変えた場合`;
  if(pts.length<2){$('#chart').textContent='この範囲では曲線を表示できません。';return;}
  const upper=Math.max(...pts.map(x=>x[1]))*1.05, lower=Math.min(...pts.map(x=>x[1]))*.9;
  const X=x=>34+258*(x-lo)/(hi-lo),Y=y=>112-94*(y-lower)/(upper-lower||1);
  const points=pts.map(([x,y])=>`${X(x).toFixed(1)},${Y(y).toFixed(1)}`).join(' ');
  const baseline=calculate(selected,o).n;
  $('#chart').innerHTML=`<svg viewBox="0 0 310 153" role="img" aria-label="${f[1]}と必要人数の関係"><line x1="34" y1="18" x2="34" y2="112" class="axis"/><line x1="34" y1="112" x2="292" y2="112" class="axis"/><line x1="34" y1="65" x2="292" y2="65" class="gridline"/><polyline points="${points}" class="graphline"/><circle cx="${X(v)}" cy="${Y(baseline)}" r="5" class="graphdot"/><text x="34" y="138">${valueString(lo,f[7])}</text><text x="292" y="138" text-anchor="end">${valueString(hi,f[7])}</text><text x="36" y="13">${format(Math.round(upper))}人</text><text x="290" y="54" text-anchor="end">現在 ${format(baseline)}人</text></svg>`;
}
function update(){
  const err=$('#error'), body=$('#resultContent');
  try{
    const r=calculate(selected,values[selected]),c=CONFIG[selected];
    err.hidden=true;body.hidden=false;
    $('#sampleCount').textContent=format(r.n);$('#recruitCount').textContent=`${format(r.recruit)} 人`;
    $('#groupCount').textContent=r.groups?`群1 ${format(r.groups[0])}人 · 群2 ${format(r.groups[1])}人`:'';
    $('#detailRows').innerHTML=r.details.map(x=>`<div class="detailrow"></div>`).join('');
    [...$('#detailRows').children].forEach((el,i)=>el.textContent=r.details[i]);
    $('#assumption').textContent=c.note;
    const a=$('#citationLink');a.href=c.doi;a.textContent=c.citation+' ↗';
    $('#extraCitation').hidden=selected!=='precision';
    if(selected==='precision')$('#extraCitation').href='https://pubmed.ncbi.nlm.nih.gov/9595616/';
    chart();
    const complete=evidence[selected].trim().length>=15;
    $('#protocolText').textContent=complete?draft(r):'入力値の出典と、その研究が今回の対象集団に適用できる理由を左側に記録すると、文章を作成します。';
    $('#draftState').textContent=complete?'入力根拠を含む下書き':'入力値の根拠を記入してください';
    $('#copyButton').disabled=!complete;
  }catch(e){err.textContent=e.message;err.hidden=false;body.hidden=true;}
}
function render(){choices();fields();update();}
$('#copyButton').addEventListener('click',async()=>{
  try{await navigator.clipboard.writeText($('#protocolText').textContent);$('#copyButton').textContent='コピーしました';setTimeout(()=>$('#copyButton').textContent='文章をコピー',1800);}catch{alert('コピーできませんでした。文章を選択してコピーしてください。');}
});
$('#downloadButton').addEventListener('click',()=>{
  const record={application:'G-CHAM サンプルサイズ設計',version:'1.0',savedAt:new Date().toISOString(),design:selected,inputs:values[selected],inputEvidence:evidence[selected],methodCitation:CONFIG[selected].citation,methodURL:CONFIG[selected].doi,result:calculate(selected,values[selected])};
  const a=document.createElement('a'),url=URL.createObjectURL(new Blob([JSON.stringify(record,null,2)],{type:'application/json'}));a.href=url;a.download='sample_size_design.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),500);
});
render();
