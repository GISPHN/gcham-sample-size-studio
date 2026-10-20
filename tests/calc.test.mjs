import test from 'node:test';
import assert from 'node:assert/strict';
import { CONFIG,calculate,normalQuantile,wilson } from '../dist/calc.mjs';
const defaults=k=>Object.fromEntries(CONFIG[k].fields.map(f=>[f[0],f[2]]));
test('standard normal quantiles match independent published reference values',()=>{
  assert.ok(Math.abs(normalQuantile(.975)-1.95996398454005)<1e-7);
  assert.ok(Math.abs(normalQuantile(.8)-.841621233572914)<1e-7);
});
test('Wilson precision boundary and nonresponse rounding',()=>{
  const o=defaults('precision'),r=calculate('precision',o);
  assert.equal(r.n,381);assert.equal(r.recruit,477);
  const z=normalQuantile(.975);
  assert.ok(Math.max(o.p-wilson(o.p,r.n,z)[0],wilson(o.p,r.n,z)[1]-o.p)<=o.margin);
  assert.ok(Math.max(o.p-wilson(o.p,r.n-1,z)[0],wilson(o.p,r.n-1,z)[1]-o.p)>o.margin);
});
test('two means and two proportions match independent formula values',()=>{
  assert.deepEqual(calculate('means',defaults('means')).groups,[142,142]);
  assert.deepEqual(calculate('proportions',defaults('proportions')).groups,[294,294]);
});
test('unequal group allocation rounds each group conservatively',()=>{
  const o={...defaults('means'),ratio:2};const r=calculate('means',o);
  assert.equal(r.groups[1],r.groups[0]*2);
  assert.equal(r.recruit,r.groups.reduce((sum,n)=>sum+Math.ceil(n/(1-o.loss)),0));
});
test('Hsieh regression adds prespecified covariate information inflation',()=>{
  const o=defaults('regression'), adjusted=calculate('regression',o);
  const unadjusted=calculate('regression',{...o,covr2:0});
  assert.equal(adjusted.n,652);assert.equal(unadjusted.n,587);
  // Inflate the unrounded value before rounding, as specified by Hsieh et al.
  assert.ok(adjusted.n>=unadjusted.n);
});
test('Riley binary model exactly matches pmsampsize criterion formulas',()=>{
  const r=calculate('prediction',defaults('prediction'));
  assert.deepEqual(r.criteria,[549,287,246]);assert.equal(r.n,549);assert.equal(r.recruit,610);
  const publishedExample=calculate('prediction',{...defaults('prediction'),parameters:24,prevalence:.174,csrsq:.288,loss:0});
  assert.deepEqual(publishedExample.criteria,[623,662,221]);
});
test('invalid design assumptions are rejected rather than producing a number',()=>{
  assert.throws(()=>calculate('proportions',{...defaults('proportions'),p1:.2}),/差がありません/);
  assert.throws(()=>calculate('prediction',{...defaults('prediction'),csrsq:.7}),/範囲/);
  assert.throws(()=>calculate('regression',{...defaults('regression'),covr2:1}),/範囲/);
});
