(function(){
'use strict';
const $=id=>document.getElementById(id);
const core=window.SorimangEvaluationCore;
const cases=window.SorimangEvaluationCases;
const engine=window.FinanceVoiceEngine;
let source='기본 합성 데이터',current=cases||[],result=null;
function showMessage(msg,isError){$('message').textContent=msg;$('message').classList.toggle('error',!!isError);}
function fmt(n){return n==null?'—':n.toFixed(1)+'%';}
function setText(id,v){$(id).textContent=v;}
function create(tag,className,text){const el=document.createElement(tag);if(className)el.className=className;if(text!==undefined)el.textContent=String(text);return el;}
function download(name,data,type){const blob=new Blob([data],{type});const href=URL.createObjectURL(blob);const a=document.createElement('a');a.href=href;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(href),5000);}
function groupRow(title,subtitle,numerator,denom,warning){
  const el=create('div','break-row'),left=create('div','left'),nm=create('div','nm',title),st=create('div','st',subtitle),bar=create('div','bar'),fill=create('div','fill'+(warning?' warn':''));
  fill.style.width=(denom>0?(100*numerator/denom):0).toFixed(1)+'%';bar.append(fill);left.append(nm,st,bar);el.append(left,create('div','pct',`${numerator}/${denom}`));return el;
}
function groupsRender(){const pos=$('positiveGroups'),neg=$('negativeGroups'),diff=$('difficultyRows');pos.replaceChildren();neg.replaceChildren();diff.replaceChildren();
  const groups=Array.from(new Set(result.rows.map(x=>x.group)));
  for(const label of groups){const rows=result.rows.filter(x=>x.group===label);const risk=rows.every(x=>x.expected);const ok=rows.filter(x=>risk?x.predicted:x.predicted).length;
    const tgt=risk?pos:neg;tgt.append(groupRow(label, risk?'위험 발언 탐지 수':'정상 발언 오탐 수',ok,rows.length,!risk));
  }
  for(const d of result.difficulties){diff.append(groupRow(d.difficulty+' 문장',`정확도 ${fmt(d.accuracy)} · 오탐 ${d.fp}건 · 미탐 ${d.fn}건`,d.tp+d.tn,d.total,false));}
}
function tableRender(){if(!result)return;
 const filter=$('filter').value;const visible=result.rows.filter(x=>filter==='all'||(filter==='errors'&&(x.outcome==='FP'||x.outcome==='FN'))||(filter==='correct'&&(x.outcome==='TP'||x.outcome==='TN'))||x.outcome.toLowerCase()===filter);
 const tbody=$('resultRows');tbody.replaceChildren();
 if(visible.length===0){const tr=create('tr'),td=create('td','empty','해당 조건에 일치하는 문장이 없습니다.');td.colSpan=6;tr.append(td);tbody.append(tr);return;}
 for(const r of visible){const tr=create('tr');tr.append(create('td','',r.id),create('td','',r.group),create('td','content',r.text),create('td','',r.expected?'위험':'정상'),create('td','',r.predicted?'위험 경고':'정상'),create('td',''));const tag=create('span','tag '+r.outcome.toLowerCase(),r.outcome);tr.lastChild.append(tag);tbody.append(tr);}
}
function update(){if(!result)return;const m=result.summary;
 for(const k of ['accuracy','precision','recall','f1'])setText(k,fmt(m[k]));setText('count',m.total+'건');
 for(const k of ['tp','fp','fn','tn'])setText(k,m[k]+'건');
 groupsRender();tableRender();$('runTime').textContent='평가 대상 '+m.total+'건';
}
function run(){try{result=core.evaluate(current,engine);update();showMessage(`${source} ${result.summary.total}건 평가 완료 · 오탐 ${result.summary.fp}건, 미탐 ${result.summary.fn}건 · D1에는 저장하지 않았습니다.`,false);}catch(err){result=null;showMessage('평가 실행 실패: '+err.message,true);}}
function loadCsv(file){if(!file)return;
 if(file.size>1024*1024){showMessage('파일은 1MB 이하여야 합니다.',true);return;}
 const reader=new FileReader();reader.onerror=()=>showMessage('파일을 읽을 수 없습니다.',true);reader.onload=()=>{try{const rows=core.parseCsv(reader.result);if(rows.length===0)throw Error('평가할 문장이 없습니다.');current=rows;source='불러온 합성 CSV';$('sourceLabel').textContent=`별도 평가 CSV ${rows.length}건 · 위험 ${rows.filter(x=>x.expected).length}건 / 정상 ${rows.filter(x=>!x.expected).length}건`;run();}catch(err){showMessage(err.message,true);}};reader.readAsText(file,'utf-8');
}
$('run').addEventListener('click',run);
$('reset').addEventListener('click',()=>{current=cases;source='기본 합성 데이터';$('sourceLabel').textContent='기본 합성 문장 100건 · 위험 50건 / 정상 50건';$('csvFile').value='';run();});
$('csvFile').addEventListener('change',e=>loadCsv(e.target.files[0]));
$('filter').addEventListener('change',tableRender);
$('template').addEventListener('click',()=>{download('sorimang-evaluation-template.csv','\ufeffid,text,expected,group,difficulty\r\nEX001,"이 ELS는 원금이 보장됩니다.",1,원금보장 확약,기본\r\nEX002,"이 상품은 원금이 보장되지 않습니다.",0,올바른 위험 안내,기본\r\n','text/csv;charset=utf-8');});
$('exportCsv').addEventListener('click',()=>{if(!result)return showMessage('먼저 평가를 실행하세요.',true);download('sorimang-5.3-evaluation.csv',core.makeCsv(result.rows),'text/csv;charset=utf-8');});
$('exportJson').addEventListener('click',()=>{if(!result)return showMessage('먼저 평가를 실행하세요.',true);
  const obj={name:'금융소리망 5.3 규칙기반 위험 발언 탐지 검증',source,createdAt:new Date().toISOString(),limitations:['합성·작성자 레이블 데이터','규칙 기반 직원 발언 탐지 평가만 해당','STT·생성형 AI 성능/법률위반 판정 아님'],summary:result.summary,byGroup:result.groups,byDifficulty:result.difficulties,rows:result.rows};
  download('sorimang-5.3-evaluation.json',JSON.stringify(obj,null,2),'application/json;charset=utf-8');
});
if(!core||!cases||!engine){showMessage('평가에 필요한 engine.js 또는 evaluation 파일을 읽지 못했습니다. GitHub 파일을 확인하세요.',true);$('run').disabled=true;return;}
run();
})();
