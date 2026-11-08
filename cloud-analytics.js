/* 금융소리망 5.2 D1 합성 상담 통계 — 기록 원문 전송 금지 */
(() => {
  'use strict';
  const el = id => document.getElementById(id);
  const RULE_LABELS = {
    underlying:'기초자산·상품 유형',payoff:'조기상환·수익 지급 조건',
    maturity:'만기·낙인·손실 판정',loss:'원금손실·최대손실',
    early:'중도매도·환매 위험',fee:'수수료·기타 비용',
    deposit:'예금자보호 비대상',issuer:'발행사 신용위험',
    suitability:'투자성향 확인',comprehension:'고객 이해 확인'
  };
  const SOURCES = {sample:'합성 시연',demo:'내장 시나리오',manual:'직접 가상 상담'};
  let serverRows = [];
  const token = () => el('token').value.trim();
  const status = (value, error = false) => {el('status').textContent=value;el('status').style.color=error?'#b42343':'#2b5b88';};
  const kpi = (id, value) => el(id).textContent = value;
  const pct = (p,n) => n ? (100*p/n).toFixed(1)+'%' : '—';
  async function callApi(method, payload) {
    if (token().length < 20) throw new Error('Cloudflare에서 설정한 비밀키를 입력해 주세요.');
    const res = await fetch('/api/records', {
      method, cache:'no-store', credentials:'omit',
      headers:{Authorization:'Bearer '+token(),...(payload?{'Content-Type':'application/json'}:{})},
      ...(payload?{body:JSON.stringify(payload)}:{})
    });
    let body;
    try{ body = await res.json(); }catch{ throw new Error('API 응답을 확인할 수 없습니다. Pages Functions 배포 여부를 확인하세요.'); }
    if (!res.ok) throw new Error(body.error || 'API 오류 '+res.status);
    return body;
  }
  function node(tag, txt, className){const n=document.createElement(tag);n.textContent=txt;if(className)n.className=className;return n;}
  function show(rows) {
    serverRows=rows;
    const n=rows.length;
    kpi('count',n+'건');
    kpi('utterances',rows.reduce((sum,r)=>sum+(r.analysis.utteranceCount||0),0)+'건');
    kpi('completion',pct(rows.reduce((sum,r)=>sum+(r.analysis.done||0),0),rows.reduce((sum,r)=>sum+(r.analysis.total||0),0)));
    kpi('risk',n?(rows.reduce((sum,r)=>sum+r.riskScore,0)/n).toFixed(1)+'점':'—');
    const missing=el('missing');missing.replaceChildren();
    for(const [id,count] of Object.keys(RULE_LABELS).map(id=>[id,rows.filter(r=>(r.analysis.rules||[]).some(rule=>rule.id===id && rule.status!=='done')).length]).sort((a,b)=>b[1]-a[1])){
      const row=node('div','', 'bar');const head=node('div','', 'barhead');head.append(node('strong',RULE_LABELS[id]),node('span',count+'건 · '+pct(count,n)));
      const track=node('div','', 'track');const fill=document.createElement('span');fill.style.width=n?Math.min(100,count/n*100)+'%':'0%';track.append(fill);row.append(head,track);missing.append(row);
    }
    const distribution=el('distribution');distribution.replaceChildren();
    const bands=[['높음 · 60~100점',0,'#c74d66'],['보통 · 30~59점',0,'#e3a244'],['낮음 · 0~29점',0,'#1f9b72']];
    rows.forEach(r=>bands[r.riskScore>=60?0:r.riskScore>=30?1:2][1]++);
    for(const [label,count,color] of bands){const p=node('p',`${label}: ${count}건 (${pct(count,n)})`);p.style.borderLeft='5px solid '+color;p.style.paddingLeft='10px';distribution.append(p);}
    const tbody=el('records');tbody.replaceChildren();
    if(!n){const tr=document.createElement('tr');const cell=node('td','서버에 저장된 상담 기록이 없습니다.');cell.colSpan=6;tr.append(cell);tbody.append(tr);}
    for(const r of rows){const tr=document.createElement('tr');const a=r.analysis||{};
      const date=new Date(r.savedAt);[Number.isNaN(date.getTime())?'—':date.toLocaleString('ko-KR'),SOURCES[r.source]||'시연',a.utteranceCount||0,(a.done||0)+'/'+(a.total||0),a.unresolvedRiskCount||0,r.riskScore+'점'].forEach(t=>tr.append(node('td',String(t))));tbody.append(tr);
    }
  }
  async function reload() {
    status('D1 서버 기록을 조회하는 중…');
    try {const body=await callApi('GET');show(body.rows||[]);status('D1 조회 완료 · '+serverRows.length+'건 (가상/시연 요약 데이터)');}
    catch(error){status(error.message,true);}
  }
  async function sync() {
    if(!el('synthetic').checked){status('가상 데이터 확인 체크박스를 선택해 주세요.',true);return;}
    status('브라우저의 시연 기록을 D1에 업로드하는 중…');
    try {
      const local=await SorimangDB.all();
      if(!local.length) return status('브라우저에 저장된 상담이 없습니다. 먼저 분석 화면에서 합성 데이터를 생성해 주세요.',true);
      if(local.some(r=>!['sample','demo','manual'].includes(r.source)))throw new Error('지원되지 않는 상담 출처가 있습니다.');
      const data=local.map(r=>({
        id:r.id, savedAt:r.savedAt, source:r.source, finished:r.finished === true,
        utteranceCount:(r.entries||[]).length,
        analysis:{
          rules:(r.analysis?.rules||[]).map(x=>({id:x.id,status:x.status})),
          unresolvedRiskCount:r.analysis?.unresolvedRiskCount||0,
          questionCount:r.analysis?.questionCount||0
        }
      }));
      let count=0;
      for(let i=0;i<data.length;i+=50){const result=await callApi('POST',{records:data.slice(i,i+50)});count+=result.saved||0;}
      status(count+'건의 가상 상담 요약을 D1에 저장했습니다. 상담 발언 원문은 전송하지 않았습니다.');
      await reload();
    }catch(error){status('서버 저장 실패: '+error.message,true);}
  }
  el('connect').addEventListener('click',()=>{void reload();});
  el('reload').addEventListener('click',()=>{void reload();});
  el('sync').addEventListener('click',()=>{void sync();});
  el('token').addEventListener('keydown',event=>{if(event.key==='Enter')void reload();});
})();
