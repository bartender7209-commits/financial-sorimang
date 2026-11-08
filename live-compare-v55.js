/* 금융소리망 5.5 · 상담 중 규칙 엔진 병렬 비교 (연구·시연용)
 * 기존 가입 통제·D1 API·IndexedDB 저장 코드를 건드리지 않습니다.
 * 현재 화면의 직원 발언만 브라우저에서 읽어 두 엔진에 전달합니다.
 * 데이터 전송(fetch 등)이나 저장은 전혀 수행하지 않습니다.
 */
(function(){
  'use strict';
  const transcript=document.getElementById('transcript');
  const panel=document.getElementById('liveComparePanel');
  const base=window.FinanceVoiceEngine;
  const candidate=window.SorimangRiskV54;
  if(!panel||!transcript)return;
  const $=id=>document.getElementById(id);
  const write=(id,value)=>{const el=$(id);if(el)el.textContent=String(value);};
  const create=(name,cls,text)=>{const el=document.createElement(name);if(cls)el.className=cls;if(text!==undefined)el.textContent=String(text);return el;};
  let signature=null;
  function markBaseline(s){
    const result=base.analyze([{id:1,speaker:'staff',text:s}],{finished:false});
    return (result.alerts||[]).filter(a=>a.kind==='risk');
  }
  function render(force=false){
    if(!base||typeof base.analyze!=='function'||!candidate||typeof candidate.classify!=='function'){
      write('lcStatus','기존 규칙 엔진 또는 개선 후보 파일을 읽지 못했습니다. 파일 경로를 확인하세요.');return;
    }
    const utterances=Array.from(transcript.querySelectorAll('.utterance.staff .body')).map(el=>(el.textContent||'').trim()).filter(Boolean);
    const nextSignature=JSON.stringify(utterances);
    if(!force&&signature===nextSignature)return;
    signature=nextSignature;
    const assessments=utterances.map((sentence,i)=>{
      const a=markBaseline(sentence),b=candidate.classify(sentence);
      return {id:i+1,sentence,old:a.length>0,now:b.predicted,oldAlerts:a,newFlags:b.flags,suppressed:b.excluded};
    });
    const old=assessments.filter(a=>a.old).length,updated=assessments.filter(a=>a.now).length;
    const diffs=assessments.filter(a=>a.old!==a.now);
    write('lcStaff',utterances.length+'건');write('lcBefore',old+'건');write('lcAfter',updated+'건');write('lcDifferent',diffs.length+'건');
    const rows=$('lcResults');rows.replaceChildren();
    if(!utterances.length){write('lcStatus','상담 발언을 기다리는 중입니다.');rows.append(create('p','lc-sub','가상 상담 시나리오를 실행하면 결과가 자동 갱신됩니다.'));return;}
    const display=diffs.length?diffs:assessments.filter(a=>a.old||a.now);
    write('lcStatus',diffs.length?`서로 다른 판정 ${diffs.length}건을 우선 표시합니다. (은행원 발언 ${utterances.length}건 중)`:`두 엔진의 위험/정상 판정이 모두 일치합니다. (은행원 발언 ${utterances.length}건 중)`);
    if(!display.length){rows.append(create('p','lc-sub','현재 두 규칙 모두 위험 표현을 감지하지 않았습니다. 안전성·적법성 확인을 뜻하지는 않습니다.'));return;}
    for(const item of display.slice(0,12)){
      const line=create('article','lc-line'+(item.old!==item.now?' is-difference':''));
      line.append(create('b','',`직원 발언 #${item.id} · 기존 ${item.old?'감지':'미감지'} / 후보 ${item.now?'감지':'미감지'}`));
      line.append(create('p','',item.sentence));
      const why=item.now?item.newFlags.map(x=>x.title).filter((v,i,a)=>a.indexOf(v)===i).join(' · '):item.suppressed.length?'후보 제외 근거: '+item.suppressed.map(x=>x.reason).filter((v,i,a)=>a.indexOf(v)===i).join(' · '):'추가 위험 표현 미탐지';
      line.append(create('small','',why));rows.append(line);
    }
    if(display.length>12)rows.append(create('p','lc-sub',`최초 12건만 표시 중 · 전체 ${display.length}건`));
  }
  // 기존 render()는 전체 대화 DOM을 다시 작성하므로, 그 DOM만 관찰합니다.
  // 비교 패널은 #transcript 밖에 있어 이벤트 재귀 호출이 발생하지 않습니다.
  const observer=new MutationObserver(()=>{try{render();}catch(err){write('lcStatus','후보 비교 오류: '+String(err.message||err));}});
  observer.observe(transcript,{childList:true,subtree:true,characterData:true});
  try{render(true);}catch(err){write('lcStatus','후보 비교 초기화 오류: '+String(err.message||err));}
})();
