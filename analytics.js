/* 금융소리망 5.0 · 브라우저 로컬 분석. 합성 데이터와 실제 시연 기록 엄격 분리. */
(() => {
  'use strict';
  const el = id => document.getElementById(id);
  const RULES = FinanceVoiceEngine.RULES;
  const LABELS = { manual:'직접 상담', demo:'내장 시나리오', sample:'합성 시연' };
  let allRecords = [];
  let filter = 'all';
  let selectedId = null;
  let search = '';

  function scoreFor(data) {
    const missing = (data.rules || []).filter(x => x.status !== 'done').length;
    return Math.min(100, missing * 6 + (data.unresolvedRiskCount || 0) * 18 + (data.questionCount || 0) * 8);
  }
  function normalizeRecord(record) {
    const a = record.analysis || {};
    const score = Number.isFinite(a.reviewPriority) ? a.reviewPriority : scoreFor(a);
    return {...record, analysis:{...a, reviewPriority:Math.max(0, Math.min(100, score))}};
  }
  const pct = (part, whole) => whole ? (100 * part / whole).toFixed(1) + '%' : '—';
  const dateFormat = iso => {
    try { return new Date(iso).toLocaleString('ko-KR', {month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'}); }
    catch { return '—'; }
  };
  const sourceOf = r => ['manual','demo','sample'].includes(r.source) ? r.source : 'manual';
  function filtered() {
    return allRecords.filter(r => (filter === 'all' || sourceOf(r) === filter) && (!search ||
      String(r.id).toLowerCase().includes(search) ||
      (r.entries || []).some(e => String(e.text || '').toLowerCase().includes(search))));
  }
  function setStatus(message, isError = false) {
    el('status').textContent = message;
    el('status').style.color = isError ? '#b02d42' : '#3d5b7f';
  }
  function nodata(parent, message) {
    parent.replaceChildren();
    const box = document.createElement('div'); box.className = 'empty'; box.textContent = message;
    parent.append(box);
  }
  function addBar(parent, title, value, max, cls = '') {
    const div = document.createElement('div'); div.className = 'barrow';
    const top = document.createElement('div');top.className='barline';
    const label = document.createElement('b');label.textContent=title;
    const number = document.createElement('span');number.textContent=value+'건 · '+pct(value,max);
    top.append(label,number);
    const track=document.createElement('div');track.className='track';
    const fill=document.createElement('div');fill.className='fill '+cls;
    fill.style.width=(max?Math.max(0, Math.min(100, value/max*100)):0)+'%';
    track.append(fill);div.append(top,track);parent.append(div);
  }
  function renderMissing(records){
    const holder=el('missingBars');holder.replaceChildren();
    if(!records.length)return nodata(holder,'먼저 상담 데이터를 저장해 주세요.');
    const items=RULES.map(rule=>({name:rule.label,count:records.filter(record=>(record.analysis.rules||[]).some(x=>x.id===rule.id&&x.status!=='done')).length}));
    items.sort((a,b)=>b.count-a.count);
    for(const item of items) addBar(holder,item.name,item.count,records.length);
  }
  function renderDistribution(records){
    const holder=el('distributionChart');holder.replaceChildren();
    if(!records.length)return nodata(holder,'아직 분석할 상담 기록이 없습니다.');
    const count=[0,0,0];
    for(const rec of records){const s=rec.analysis.reviewPriority;count[s>=60?0:s>=30?1:2]++;}
    const chart=document.createElement('div');chart.className='distribution';
    const colors=['#c74d66','#dca54f','#2ca070'];
    count.forEach((n,i)=>{const segment=document.createElement('span');segment.style.width=(n/records.length*100)+'%';segment.style.backgroundColor=colors[i];chart.append(segment);});
    holder.append(chart);
    const legend=document.createElement('div');legend.className='riskleg';
    ['높음 (60~100)','보통 (30~59)','낮음 (0~29)'].forEach((name,i)=>{
      const row=document.createElement('div');const label=document.createElement('span');
      const circle=document.createElement('span');circle.className='bullet';circle.style.backgroundColor=colors[i];
      label.append(circle,document.createTextNode(name));const value=document.createElement('strong');value.textContent=count[i]+'건 ('+pct(count[i],records.length)+')';row.append(label,value);legend.append(row);
    });
    holder.append(legend);
  }
  function renderRecords(records){
    const tbody=el('rows');tbody.replaceChildren();
    el('noRecords').hidden=records.length>0;
    for(const rec of records){
      const tr=document.createElement('tr');
      const source=sourceOf(rec),done=rec.analysis.done||0,total=rec.analysis.total||10;
      const danger=rec.analysis.reviewPriority;
      function cell(txt){const td=document.createElement('td');td.textContent=String(txt);tr.append(td);return td;}
      cell(dateFormat(rec.savedAt));
      const src=cell('');const pill=document.createElement('span');pill.className='pill '+(source==='manual'?'':source);pill.textContent=LABELS[source];src.append(pill);
      cell((rec.entries||[]).length+'건');cell(done+' / '+total);
      cell((rec.analysis.unresolvedRiskCount||0)+'건');
      const priority=cell('');const pr=document.createElement('span');pr.className='pill '+(danger>=60?'high':danger>=30?'mid':'low');pr.textContent=danger+'점';priority.append(pr);
      const detail=cell('');const button=document.createElement('button');button.type='button';button.className='linkbtn';button.textContent='상세 보기';button.addEventListener('click',()=>showRecord(rec.id));detail.append(button);
      tbody.append(tr);
    }
  }
  function render(){
    const records=filtered();
    const utterances=records.reduce((sum,r)=>sum+(r.entries||[]).length,0);
    const rate=records.reduce((sum,r)=>sum+(r.analysis.total?r.analysis.done/r.analysis.total:0),0);
    const priority=records.reduce((sum,r)=>sum+r.analysis.reviewPriority,0);
    const sampleCount=records.filter(r=>sourceOf(r)==='sample').length;
    el('sessions').textContent=records.length+'건';el('utterances').textContent=utterances+'건';
    el('completion').textContent=records.length?(rate/records.length*100).toFixed(1)+'%':'—';
    el('priority').textContent=records.length?(priority/records.length).toFixed(1)+'점':'—';
    el('sessionsSub').textContent=sampleCount?'합성 시연 '+sampleCount+'건 포함 · 실증 데이터 아님':'현재 브라우저에 저장된 기록';
    renderMissing(records);renderDistribution(records);renderRecords(records);
  }
  async function refresh(){
    try {allRecords=(await SorimangDB.all()).map(normalizeRecord);render();setStatus('브라우저 로컬 DB 연결 완료 · '+allRecords.length+'개 저장 기록');}
    catch (e){setStatus('로컬 DB를 불러오지 못했습니다: '+e.message,true);console.error(e);}
  }
  function showRecord(id){
    const record=allRecords.find(r=>r.id===id);if(!record)return;
    selectedId=id;
    el('detailTitle').textContent='상담 기록 상세 · '+(LABELS[sourceOf(record)]||'시연');
    el('detailMeta').textContent='저장 시각: '+dateFormat(record.savedAt)+' · '+record.id;
    const area=el('detailContent');area.replaceChildren();
    const a=record.analysis;
    const summary=document.createElement('div');summary.className='dialogmsg';
    summary.textContent='설명 근거 '+(a.done||0)+'/'+(a.total||10)+'개 · 위험 경고 '+(a.unresolvedRiskCount||0)+'건 · 검토 우선순위 '+a.reviewPriority+'점 · '+(record.finished?'종료된 상담':'진행 중 저장된 상담');
    area.append(summary);
    const intro=document.createElement('h3');intro.textContent='항목별 규칙 분석';area.append(intro);
    for(const item of a.rules||[]){const row=document.createElement('div');row.className='dialogmsg';row.textContent=item.label+' · '+(item.status==='done'?'발언 근거 확인':item.status==='review'?'추가 검토':'미확인')+(item.reason?' — '+item.reason:'');area.append(row);}
    const title=document.createElement('h3');title.textContent='상담 발언 기록';area.append(title);
    for(const entry of record.entries||[]){const box=document.createElement('div');box.className='uitem '+(entry.speaker==='customer'?'customer':'');
      const h=document.createElement('b');h.textContent=(entry.speaker==='customer'?'고객':'직원')+' · '+dateFormat(entry.at);
      const p=document.createElement('p');p.textContent=entry.text;box.append(h,p);area.append(box);}
    const dlg=el('detail');if(typeof dlg.showModal==='function')dlg.showModal();else dlg.setAttribute('open','');
  }
  function closeDetail(){const dlg=el('detail');if(typeof dlg.close==='function')dlg.close();else dlg.removeAttribute('open');selectedId=null;}
  function blobSave(content,type,name){const url=URL.createObjectURL(new Blob([content],{type}));const a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),5000);}
  function csvEscape(value){let str=String(value??'');if(/^[\s]*[=+@-]/.test(str))str="'"+str;return '"'+str.replace(/"/g,'""')+'"';}
  function exportCSV(){
    const records=filtered();if(!records.length)return alert('내보낼 상담이 없습니다.');
    const headers=['id','saved_at','source','finished','utterance_count','checked_rules','total_rules','unresolved_risk_alerts','question_alerts','review_priority_heuristic'];
    const lines=[headers.map(csvEscape).join(',')];
    for(const r of records){lines.push([r.id,r.savedAt,LABELS[sourceOf(r)],r.finished,(r.entries||[]).length,r.analysis.done,r.analysis.total,r.analysis.unresolvedRiskCount,r.analysis.questionCount,r.analysis.reviewPriority].map(csvEscape).join(','));}
    blobSave('\uFEFF'+lines.join('\r\n'),'text/csv;charset=utf-8','금융소리망_5_상담요약_'+new Date().toISOString().slice(0,10)+'.csv');
  }
  function exportJSON(){const records=filtered();if(!records.length)return alert('내보낼 상담이 없습니다.');
    if(!confirm('상담 발언 원문이 JSON 파일에 포함됩니다. 가상 시연 데이터인지 확인했나요?'))return;
    blobSave(JSON.stringify({format:'financial-sorimang-v5-local-export',exportedAt:new Date().toISOString(),records},null,2),'application/json;charset=utf-8','금융소리망_5_상담백업_'+new Date().toISOString().slice(0,10)+'.json');
  }
  async function deleteSelected(){if(!selectedId)return;const id=selectedId;
    if(!confirm('선택한 상담 기록을 이 브라우저에서 영구 삭제할까요?'))return;
    try{await SorimangDB.remove(id);closeDetail();await refresh();}
    catch(e){alert('삭제 오류: '+e.message);}
  }
  async function clearAll(){if(!allRecords.length)return alert('삭제할 기록이 없습니다.');
    if(!confirm('이 브라우저의 금융소리망 상담 기록 '+allRecords.length+'건을 모두 영구 삭제할까요?'))return;
    try{await SorimangDB.clear();await refresh();}
    catch(e){alert('전체 삭제 오류: '+e.message);}
  }
  function createSampleRecords(){
    // 합성 샘플은 4.0 엔진의 동일한 규칙으로 재분석합니다. 임의의 탐지율 수치를 만들지 않습니다.
    const {DEMOS, analyze} = FinanceVoiceEngine;
    const variants=['bad','good','contrast'];
    const records=[];
    for(let i=0;i<24;i++){
      const kind=variants[i%variants.length];
      const base=DEMOS[kind]||DEMOS.bad;
      const length=Math.max(2,base.length - (i%5===0 ? 3 : i%7===0 ? 2 : 0));
      const savedAt=new Date(Date.now()-(23-i)*86400000).toISOString();
      const entries=base.slice(0,length).map((line,j)=>({id:j+1,speaker:line[0],text:line[1],at:new Date(Date.parse(savedAt)+(j-length)*15000).toISOString()}));
      const analysis=analyze(entries,{finished:true,category:'els'});
      const missing=analysis.states;
      const unresolved=analysis.alerts.filter(a=>a.kind==='risk').length;
      const questions=analysis.alerts.filter(a=>a.kind==='question').length;
      const rules=RULES.map(r=>({id:r.id,label:r.label,status:missing[r.id].status,reason:missing[r.id].reason||''}));
      records.push({id:'sample-v5-'+String(i+1).padStart(2,'0'),version:5,savedAt,createdAt:entries[0]?.at||savedAt,finished:true,source:'sample',product:'가상 홍콩 H지수 ELS',entries,
        analysis:{done:analysis.done,total:analysis.total,rules,alerts:analysis.alerts.map(a=>({kind:a.kind||'other',title:a.title||'',desc:a.desc||'',id:a.id||null})),unresolvedRiskCount:unresolved,questionCount:questions,reviewPriority:Math.min(100,rules.filter(r=>r.status!=='done').length*6+unresolved*18+questions*8),gateReady:false,simulatedApproved:false}});
    }
    return records;
  }
  async function seed(){
    if(!confirm('가상 대화 시나리오를 이용해 합성 시연 기록 24건을 생성할까요? 실제 금융상담 데이터가 아닙니다.'))return;
    try{for(const record of createSampleRecords())await SorimangDB.save(record);filter='all';search='';el('search').value='';
      document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.filter==='all')));
      await refresh();setStatus('합성 시연 기록 24건 생성 완료 · 실제 검증 데이터가 아닙니다.');}
    catch(e){setStatus('시연 기록 생성 실패: '+e.message,true);}
  }
  document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
    filter=button.dataset.filter;document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));render();
  }));
  el('search').addEventListener('input',event=>{search=event.target.value.trim().toLowerCase();render();});
  el('seed').addEventListener('click',()=>{void seed();});
  el('csv').addEventListener('click',exportCSV);
  el('json').addEventListener('click',exportJSON);
  el('clear').addEventListener('click',()=>{void clearAll();});
  el('deleteOne').addEventListener('click',()=>{void deleteSelected();});
  el('closeDetail').addEventListener('click',closeDetail);
  el('closeDetail2').addEventListener('click',closeDetail);
  el('detail').addEventListener('close',()=>{selectedId=null;});
  void refresh();
})();
