/* 금융소리망 5.3 · 규칙 기반 위험 표현 분류의 성능 검증.
 * 개인정보/서버 저장/음성인식을 수행하지 않음. 전부 로컬 브라우저 평가.
 */
(function(root,factory){const e=factory();if(typeof module==='object'&&module.exports)module.exports=e;if(root)root.SorimangEvaluationCore=e;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
function div(a,b){return b>0?a/b:null;}
function rate(n){return n===null?null:Math.round(n*10000)/100;}
function metrics(items){
  const tp=items.filter(x=>x.expected&&x.predicted).length;
  const fn=items.filter(x=>x.expected&&!x.predicted).length;
  const fp=items.filter(x=>!x.expected&&x.predicted).length;
  const tn=items.filter(x=>!x.expected&&!x.predicted).length;
  const precision=div(tp,tp+fp), recall=div(tp,tp+fn);
  return {total:items.length,tp,fn,fp,tn,accuracy:rate(div(tp+tn,items.length)),precision:rate(precision),recall:rate(recall),specificity:rate(div(tn,tn+fp)),f1:rate(precision!==null&&recall!==null&&precision+recall>0?2*precision*recall/(precision+recall):null)};
}
function evaluate(cases,engine){
  if(!engine||typeof engine.analyze!=='function')throw Error('기존 FinanceVoiceEngine.analyze를 불러오지 못했습니다.');
  const rows=cases.map((c,i)=>{
    if(typeof c.text!=='string'||typeof c.expected!=='boolean')throw Error((i+1)+'번째 데이터의 text/expected 형식 오류');
    const result=engine.analyze([{id:1,speaker:'staff',text:c.text}],{finished:false});
    const flags=(result.alerts||[]).filter(x=>x.kind==='risk');
    const predicted=flags.length>0;
    return {id:String(c.id||('T'+(i+1))),text:c.text,group:String(c.group||'기타'),difficulty:String(c.difficulty||'사용자'),expected:c.expected,predicted,flags:flags.map(x=>x.title),outcome: c.expected?(predicted?'TP':'FN'):(predicted?'FP':'TN')};
  });
  const groups=Array.from(new Set(rows.map(x=>x.group))).map(group=>({group,...metrics(rows.filter(x=>x.group===group))}));
  const difficulties=Array.from(new Set(rows.map(x=>x.difficulty))).map(difficulty=>({difficulty,...metrics(rows.filter(x=>x.difficulty===difficulty))}));
  return {rows,summary:metrics(rows),groups,difficulties};
}
function csvEscape(value){const s=String(value??'');return '"'+s.replace(/"/g,'""')+'"';}
function makeCsv(rows){
 const headers=['id','text','expected','predicted','outcome','group','difficulty','flags'];
 return '\ufeff'+headers.join(',')+'\r\n'+rows.map(row=>headers.map(k=>csvEscape(k==='flags'?row.flags.join(' | '):(['expected','predicted'].includes(k)?(row[k]?'1':'0'):row[k]))).join(',')).join('\r\n');
}
// Local CSV parser with quoted commas/newlines and escaped quotes, no external dependencies.
function parseCsv(raw){
 const s=String(raw||'').replace(/^\ufeff/,'');
 let q=false,field='',row=[],rows=[];
 for(let i=0;i<s.length;i++){
  const ch=s[i];
  if(ch==='"'){
   if(q&&s[i+1]==='"'){field+='"';i++;}else q=!q;
  }else if(ch===','&&!q){row.push(field);field='';}
  else if((ch==='\n'||ch==='\r')&&!q){if(ch==='\r'&&s[i+1]==='\n')i++;row.push(field);field='';if(row.some(v=>v.trim()!==''))rows.push(row);row=[];}
  else field+=ch;
 }
 if(q)throw Error('CSV 따옴표가 닫히지 않았습니다.');
 row.push(field);if(row.some(v=>v.trim()!==''))rows.push(row);
 if(rows.length===0)throw Error('데이터가 없는 CSV입니다.');
 const columns=rows.shift().map(x=>x.trim().toLowerCase());
 for(const k of ['text','expected'])if(!columns.includes(k))throw Error('필수 열이 없습니다: '+k);
 if(rows.length>500)throw Error('500건 이하의 평가 문장만 업로드할 수 있습니다.');
 const ix=k=>columns.indexOf(k),get=(r,k)=>ix(k)<0?'':String(r[ix(k)]||'').trim();
 const truthy=new Set(['1','true','risk','positive','위험','위험발언','y','yes']);
 const falsy=new Set(['0','false','normal','negative','정상','일반','n','no']);
 return rows.map((r,i)=>{
  const v=get(r,'expected').toLowerCase();
  if(!truthy.has(v)&&!falsy.has(v))throw Error(`${i+2}행 expected가 올바르지 않습니다 (1 또는 0 필요).`);
  const text=get(r,'text');
  if(!text||text.length>500)throw Error(`${i+2}행 text는 1~500글자여야 합니다.`);
  return {id:get(r,'id')||('CSV'+String(i+1).padStart(3,'0')),text,expected:truthy.has(v),group:get(r,'group')||'외부 평가',difficulty:get(r,'difficulty')||'사용자'};
 });
}
return {evaluate,metrics,makeCsv,parseCsv};
});
