/* 금융소리망 5.4 · 브라우저 내 평가 비교; 서버 요청 없음 */
(function(){
'use strict';
const $=id=>document.getElementById(id),core=window.SorimangEvaluationCore,base=window.FinanceVoiceEngine,improved=window.SorimangRiskV54;
const datasets={holdout:window.SorimangHoldoutV54,development:window.SorimangEvaluationCases};
let current=null;
const text=(id,value)=>{$(id).textContent=String(value);};
const perc=n=>n===null||n===undefined?'—':Number(n).toFixed(1)+'%';
const node=(tag,cls,value)=>{const el=document.createElement(tag);if(cls)el.className=cls;if(value!==undefined)el.textContent=String(value);return el;};
function metricsBlock(which,m){
 const el=$(which);el.replaceChildren();
 const items=[['','탐지: 위험','탐지: 정상'],['실제: 위험',`${m.tp}건`,`${m.fn}건`],['실제: 정상',`${m.fp}건`,`${m.tn}건`]];
 for(let row=0;row<3;row++){for(let col=0;col<3;col++){
   const value=items[row][col]??'';const c=node('div',row>0&&col>0?((row===1&&col===1)||(row===2&&col===2)?'ok':'err'):col===0?'side':'',value);
   if(row>0&&col>0){c.textContent='';c.append(node('b','',value),node('small','',row===1?(col===1?'TP 정탐':'FN 미탐'):(col===1?'FP 오탐':'TN 정탐')));}
   el.append(c);
 }}
}
function summaryStats(oldm,newm){
 for(const k of ['accuracy','precision','recall','f1']){
   text(k+'Before','기존 '+perc(oldm[k]));text(k+'After',perc(newm[k]));
   const delta=newm[k]===null||oldm[k]===null?null:newm[k]-oldm[k];const el=$(k+'Delta');
   el.className='delta '+(delta===null||Math.abs(delta)<0.0001?'zero':delta>0?'pos':'neg');
   el.textContent=delta===null?'비교 불가':(delta>0?'+':'')+delta.toFixed(1)+'%p';
 }
 metricsBlock('matrixBefore',oldm);metricsBlock('matrixAfter',newm);
 for(const [id,m] of [['errorBefore',oldm],['errorAfter',newm]]){const el=$(id);el.replaceChildren();el.append(node('span','','오탐 '+m.fp+'건'),node('span','','미탐 '+m.fn+'건'),node('span','','정상 판정 '+(m.tp+m.tn)+'건'))}
 text('barLabelBefore',`기존 · ${oldm.tp+oldm.tn}/${oldm.total}건 (${perc(oldm.accuracy)})`);
 text('barLabelAfter',`개선 · ${newm.tp+newm.tn}/${newm.total}건 (${perc(newm.accuracy)})`);
 $('barBefore').style.width=oldm.accuracy+'%';$('barAfter').style.width=newm.accuracy+'%';
}
function changeType(a,b){const ac=a.expected===a.predicted,bc=b.expected===b.predicted;if(ac&&!bc)return 'regression';if(!ac&&bc)return 'fixed';if(!ac&&!bc)return 'bothwrong';return 'correct';}
const names={fixed:'개선 성공',regression:'퇴행',bothwrong:'양쪽 오류',correct:'정상 유지'};
function renderTable(){if(!current)return;const filter=$('filter').value;const rows=$('rows');rows.replaceChildren();let shown=0;
 for(let i=0;i<current.original.rows.length;i++){
  const a=current.original.rows[i],b=current.updated.rows[i],type=changeType(a,b);
  if(filter==='changed'&&a.predicted===b.predicted)continue;if(!['all','changed'].includes(filter)&&type!==filter)continue;
  const tr=node('tr');tr.append(node('td','',a.id),node('td','sentence',a.text),node('td','',a.expected?'위험':'정상'),node('td','',a.predicted?'위험':'정상'),node('td','',b.predicted?'위험':'정상'));
  const col=node('td');col.append(node('span','result '+type,names[type]));tr.append(col);rows.append(tr);shown++;
 }
 if(!shown){const tr=node('tr'),col=node('td','','표시할 사례가 없습니다.');col.colSpan=6;tr.append(col);rows.append(tr);}
}
function run(){
 try{
  if(!core||!base||!improved||!datasets.holdout||!datasets.development)throw Error('평가 파일을 모두 읽지 못했습니다. GitHub 파일을 확인하세요.');
  const set=$('dataset').value,cases=datasets[set];if(!cases||cases.length===0)throw Error('평가 사례가 없습니다.');
  const original=core.evaluate(cases,base);
  const newRows=original.rows.map((a,i)=>{
    const next=improved.classify(cases[i].text);
    const result={...a,predicted:next.predicted,flags:next.flags.map(x=>x.title),suppressed:next.excluded.map(x=>x.reason)};
    result.outcome=result.expected?(result.predicted?'TP':'FN'):(result.predicted?'FP':'TN');return result;
  });
  const updated={rows:newRows,summary:core.metrics(newRows)};
  current={set,original,updated};summaryStats(original.summary,updated.summary);renderTable();
  const counts={fixed:0,regression:0,bothwrong:0,correct:0};for(let i=0;i<original.rows.length;i++)counts[changeType(original.rows[i],updated.rows[i])]++;
  text('changeSummary',`개선 성공 ${counts.fixed}건 · 성능 퇴행 ${counts.regression}건 · 양쪽 오류 ${counts.bothwrong}건 · 정상 유지 ${counts.correct}건`);
  text('status',(set==='holdout'?'별도 작성 합성 사례 40건':'개발에 사용한 합성 사례 100건')+` 비교 완료. 기존 오탐 ${original.summary.fp}건·미탐 ${original.summary.fn}건 / 개선 오탐 ${updated.summary.fp}건·미탐 ${updated.summary.fn}건. D1에는 저장하지 않았습니다.`);
 }catch(err){text('status','평가 실패: '+err.message);console.error(err);}
}
function csv(v){const s=String(v??'');return '"'+s.replace(/"/g,'""')+'"';}
function download(filename,body,type){const blob=new Blob([body],{type}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=filename;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),5000);}
function exportFile(type){if(!current)return text('status','먼저 평가를 실행하세요.');const {set,original,updated}=current;
 const rows=original.rows.map((r,i)=>({id:r.id,text:r.text,group:r.group,expected:r.expected,baseline:r.predicted,improved:updated.rows[i].predicted,change:changeType(r,updated.rows[i]),candidateFlags:updated.rows[i].flags}));
 if(type==='json')return download('sorimang-5.4-'+set+'.json',JSON.stringify({version:'5.4 evaluation prototype',dataset:set,scope:'규칙기반 위험 발언 분류; 실제 상담/음성인식/생성형 AI 평가 아님',limitations:['합성·작성자 라벨','전문가 독립 검수 없음','개발 100건을 규칙 보완에 사용','추가 40건은 작성자가 별도 생성, 대표성 없음'],baseline:original.summary,improved:updated.summary,rows},null,2),'application/json;charset=utf-8');
 const header=['id','text','group','expected','baseline','improved','change','candidateFlags'];
 const lines=rows.map(r=>header.map(k=>csv(k==='candidateFlags'?r[k].join('|'):typeof r[k]==='boolean'?(r[k]?'1':'0'):r[k])).join(','));
 return download('sorimang-5.4-'+set+'.csv','\ufeff'+header.join(',')+'\r\n'+lines.join('\r\n'),'text/csv;charset=utf-8');
}
$('run').addEventListener('click',run);$('dataset').addEventListener('change',run);$('filter').addEventListener('change',renderTable);$('csv').addEventListener('click',()=>exportFile('csv'));$('json').addEventListener('click',()=>exportFile('json'));run();
})();
