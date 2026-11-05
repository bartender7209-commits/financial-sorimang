
/* 금융소리망 3.0 - 홍콩 H지수 ELS 교육/시연용 규칙 기반 점검 엔진.
 * 실제 법률 위반, 상품 적합성, 완전판매 여부를 판단하지 않습니다.
 * 일부 문장의 특징을 확인하는 휴리스틱이며 법률/상품별 심사 대체 불가.
 */
(function(root,factory){const e=factory();if(typeof module==='object'&&module.exports)module.exports=e;if(root)root.FinanceVoiceEngine=e;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const RULES = [
 {id:'underlying',label:'기초자산·상품 유형',description:'H지수와 ELS의 연계구조 안내',advice:'홍콩 H지수(HSCEI) 등 기초자산과 ELS가 해당 지수에 연계되는 구조를 안내하세요.'},
 {id:'payoff',label:'조기상환·수익 지급 조건',description:'평가 시점과 수익 지급의 조건 설명',advice:'조기상환 평가 주기, 기초자산 기준가격, 조건 충족 시 수익 지급 구조를 실제 설명서에 맞게 안내하세요.'},
 {id:'maturity',label:'만기·낙인·손실 판정',description:'만기 조건 및 낙인/노낙인 구조',advice:'만기와 낙인(Knock-in) 또는 노낙인 구조, 최종 손실 결정 조건을 구체적으로 안내하세요.'},
 {id:'loss',label:'원금손실·최대손실',description:'원금 비보장과 최악의 손실 시나리오',advice:'원금 비보장 및 조건에 따라 원금 전액까지 손실 가능할 수 있다는 점을 설명서 기준으로 명확히 안내하세요.'},
 {id:'early',label:'중도매도·환매 위험',description:'만기 이전 현금화의 위험과 가격',advice:'중도 매도·환매 가능 여부, 가격 산정 방식, 원금손실 가능성과 적용 비용을 상품별로 안내하세요.'},
 {id:'fee',label:'수수료·기타 비용',description:'비용 존재 여부와 부과 기준',advice:'수수료·보수·중도매도 비용의 유무와 적용 기준을 실제 상품설명서로 확인하여 안내하세요.'},
 {id:'deposit',label:'예금자보호 비대상',description:'ELS는 예금이 아닌 투자상품임을 구분',advice:'ELS는 예금자보호 대상이 아닌 투자상품임을 분명하게 안내하세요.'},
 {id:'issuer',label:'발행사 신용위험',description:'기초자산 이외에 발행사 위험 설명',advice:'발행사의 신용상태 악화·부도 시 지급불능 등 신용위험이 있음을 설명하세요.'},
 {id:'suitability',label:'고객 투자성향 확인 단서',description:'투자목적·경험·손실 감내 수준 질문과 응답',advice:'투자목적, 거래 경험과 손실 감수 가능 수준을 확인하고 별도의 공식 적합성 심사 절차를 진행하세요.'},
 {id:'comprehension',label:'고객 이해 확인 단서',description:'주요 위험을 다시 확인하는 질문과 고객 답변',advice:'손실 구조 등 주요 위험에 관한 고객의 이해를 확인하고 필요한 경우 추가 설명하세요.'},
];
const RULE_BY_ID=Object.fromEntries(RULES.map(r=>[r.id,r]));
const DEMOS={
 bad:[
  ['staff','이건 홍콩 H지수 ELS인데 안전한 예금 같은 상품입니다. 원금은 100% 보장됩니다.'],
  ['customer','홍콩 H지수가 크게 떨어지면 제 원금도 손실이 날 수 있나요?'],
  ['staff','아니요, 걱정하지 마세요. 무조건 수익이 나는 상품입니다.'],
  ['customer','조기상환 조건이나 낙인 조건은 뭔가요?'],
  ['staff','조건은 복잡하니까 그냥 넘어가셔도 됩니다.'],
  ['customer','만기 전 중도에 팔면 손해 볼 수도 있나요?'],
  ['staff','그건 나중에 보시고 일단 서명부터 하시죠.'],
  ['customer','예금자보호도 되나요?'],
  ['staff','네, 예금자보호도 됩니다.']
 ],
 good:[
  ['staff','이 가상 상품은 홍콩 H지수 HSCEI에 연계되는 주가연계증권 ELS이며 만기는 3년입니다.'],
  ['staff','시연용 조건에서는 6개월마다 조기상환을 평가하며 기초자산이 기준가격의 90% 이상이면 약정된 수익과 함께 조기상환됩니다. 실제 상환 기준은 상품마다 다릅니다.'],
  ['customer','지수가 많이 떨어지면 원금도 잃을 수 있나요?'],
  ['staff','네, 원금이 보장되지 않고 지수가 하락하면 원금 일부 또는 전액을 손실할 수 있습니다.'],
  ['staff','이 가상 상품은 만기 3년이고 낙인 50% 조건을 가정합니다. 낙인 발생 후 만기 회복 조건을 충족하지 못하면 손실이 결정됩니다. 실제 약관을 확인하셔야 합니다.'],
  ['customer','그럼 만기 전 매도하면 어떻게 되나요?'],
  ['staff','만기 전에 중도매도하면 시장가격으로 정산되어 원금손실이 발생할 수 있고 비용이 적용될 수 있습니다.'],
  ['staff','이 가상 사례는 가입수수료 0.5%로 설정했습니다. 실제 비용과 요율은 상품설명서를 기준으로 확인해야 합니다.'],
  ['customer','은행에서 파는데 예금자보호가 되나요?'],
  ['staff','아니요. ELS는 예금자보호 대상이 아닙니다.'],
  ['staff','또한 발행사 신용상태가 악화되거나 부도 나면 지급금을 돌려받지 못할 위험도 있습니다.'],
  ['staff','고객님의 투자목적과 투자경험, 원금손실을 감내할 수 있는 수준은 어떠신가요?'],
  ['customer','투자 경험이 있고 여유자금이며 원금 전액 손실 가능성을 감수할 수 있는 범위입니다.'],
  ['staff','그렇다면 ELS가 고객님께 적합한지는 별도의 공식 투자성향 절차로 확인해야 합니다. 말씀드린 원금 전액 손실 가능성과 중도매도 위험을 이해하셨나요?'],
  ['customer','네, 원금 전액 손실 가능성과 중도매도 위험을 이해했습니다.']
 ],
 contrast:[
  ['staff','이 상품은 원금이 100% 보장되는 상품이 아닙니다.'],
  ['staff','무조건 수익이 난다는 표현은 사실이 아닙니다.'],
  ['customer','그럼 ELS라도 손해가 날 수 있다는 거죠?'],
  ['staff','맞습니다. 원금손실이 발생할 수 있고, 경우에 따라 전액 손실도 가능합니다.'],
  ['staff','그럼에도 이 상품은 사실상 예금과 같아서 위험이 없다고 볼 수도 있습니다.'],
  ['customer','낙인 조건과 조기상환 기준을 더 자세히 듣고 싶습니다.']
 ]
};
const norm=t=>String(t||'').replace(/\s+/g,' ').trim();
const test=(s,r)=>r.test(s);
const sentences=t=>String(t||'').split(/(?<=[.!?。])\s+|\n+/).map(norm).filter(Boolean);
const question=s=>/[?？]|(?:나요|까요|습니까|인가요|뭔가요|무엇|어떻게|얼마|궁금)/.test(s);
// Negated guarantee and profit claims should not be classified as actual promises.
function denial(s){return /(?:보장|확정|수익|손실\s*없).{0,22}(?:아니|않|못|없|틀립|잘못|불가능|정확하지|사실이\s*아)|(?:보장|확정)\s*(?:안|비)|(?:보장|확정)되는\s*상품이\s*(?:아니|아닙)|(?:무조건|확실히).{0,16}(?:표현|말)은?\s*(?:잘못|틀림|거짓)/.test(s);}
function lossDenial(s){return /(?:손실|위험|손해).{0,17}(?:없(?:습|어|다)|안\s*납니다|발생하지\s*않|걱정\s*마|문제\s*없|제로)|원금손실은\s*절대\s*없|위험하지\s*않/.test(s);}
function guaranteeClaim(s){
 if(denial(s)||/(?:보장되지|보장되지\s*않|보장하지\s*않|보장되는\s*것은\s*아니|보장되는\s*상품이\s*아니|보장이\s*안|비보장)/.test(s))return false;
 return /(?:원금|투자금).{0,17}(?:100\s*%|전액)?\s*보장(?:됩니다|돼요|해드|합니다|이에요|이죠|되는\s*상품|받을\s*수\s*있)|(?:원금|투자금)(?:은|이)?\s*(?:무조건|절대|확실히)\s*안전|원금\s*100\s*%\s*보장/.test(s);
}
function profitClaim(s){if(denial(s))return false;return /(?:무조건|반드시|절대|확실히)\s*(?:수익|돈\s*벌)|수익(?:이|은|을)?\s*(?:100\s*%\s*)?(?:확정|보장)(?:됩니다|돼요|해드|합니다)|손해\s*볼\s*일\s*없/.test(s);}
function misleadingSafe(s){if(denial(s))return false;return /(?:예금\s*같|예금과\s*같|안전한\s*예금|위험\s*없|손실\s*없|절대\s*안전|걱정하지\s*마|걱정\s*안\s*해도|문제\s*없)/.test(s);}
const full=(why)=>({score:2,why});const partial=why=>({score:1,why});const none=()=>({score:0,why:''});
function assess(id, text){
 const t=norm(text);if(!t)return none();
 const mention=(re,why='관련 발언은 있지만 핵심 설명이 충분한지는 확인되지 않습니다.')=>test(t,re)?partial(why):none();
 switch(id){
 case 'underlying':
   if(test(t,/(?:홍콩\s*H\s*지수|H\s*지수|HSCEI|항셍\s*중국기업)/i)&&test(t,/(?:기초자산|연계|ELS|주가연계증권|수익\s*구조)/)&&!question(t))return full('H지수와 ELS 기초자산의 연관성을 설명한 발언입니다.');
   return mention(/(?:ELS|홍콩|지수|기초자산|주가연계)/i);
 case 'payoff':
   if(test(t,/(?:조기\s*상환|조기상환|수익\s*지급|상환\s*조건)/)&&test(t,/(?:\d\s*개월|매\s*\d\s*개월|평가일|매\s*분기|6개월|평가\s*시점)/)&&test(t,/(?:\d+(?:\.\d+)?\s*%|기준\s*가격|조건\s*충족|기초자산).{0,50}/)&&!question(t))return full('조기상환 평가 시점과 조건을 구체적으로 언급했습니다(시연 기준 검출).');
   return mention(/(?:조기\s*상환|조기상환|평가일|상환\s*조건|수익\s*지급)/);
 case 'maturity':
   if(test(t,/(?:만기|상환\s*시점)/)&&test(t,/(?:낙인|녹인|knock.?in|노낙인|노녹인|손실\s*판정|손실\s*조건)/i)&&test(t,/(?:\d+\s*(?:년|개월|%)|회복|미충족|조건|기준가격)/)&&!question(t))return full('만기와 낙인/손실 판정 조건을 연계해 설명했습니다.');
   return mention(/(?:만기|낙인|녹인|노낙인|노녹인|손실\s*판정)/);
 case 'loss':
   if(test(t,/(?:원금|투자금).{0,40}(?:전액|일부|100\s*%|모두).{0,12}(?:손실|잃|날아|없어)/)&&test(t,/(?:가능|수\s*있|발생|될\s*수)/)&&!lossDenial(t))return full('원금 일부/전액 손실 가능성을 명확히 설명했습니다.');
   if(test(t,/(?:원금|투자금).{0,27}(?:손실|잃을\s*수|보장되지|비보장|보장하지\s*않)/)&&!lossDenial(t))return partial('원금손실 가능성은 언급했지만 최악의 손실 범위까지 확인해 주세요.');
   return mention(/(?:원금|손실|보장|투자금)/);
 case 'early':
   if(test(t,/(?:중도\s*(?:매도|환매|해지)|만기\s*전\s*(?:매도|환매|매각)|환매\s*가격)/)&&test(t,/(?:시장\s*가격|시가|환매\s*가격|가격\s*산정|원금\s*손실|가격에\s*따라|불이익)/)&&!question(t))return full('만기 전 현금화와 가격/손실 위험을 설명했습니다.');
   return mention(/(?:중도\s*(?:매도|환매|해지)|환매|만기\s*전)/);
 case 'fee':
   if(!test(t,/(?:수수료|비용|보수|판매보수|환매\s*비용)/))return none();
   if(test(t,/(?:수수료|보수|비용).{0,30}(?:\d+(?:\.\d+)?\s*(?:%|원|퍼센트)|없습니다|없어요|면제|부과\s*기준|적용\s*조건)/)&&!question(t)&&!test(t,/(?:신경\s*쓰지|걱정하지\s*마|상관없)/))return full('비용의 수준/유무 또는 적용 기준을 언급했습니다(실제 상품과 대조 필요).');
   return partial('비용을 언급했지만 구체적인 유무·요율·산정 조건이 부족합니다.');
 case 'deposit':
   if(!test(t,/(?:예금자\s*보호|예금\s*보험)/))return none();
   if(test(t,/(?:비대상|대상(?:이|은)?\s*(?:아니|아닙)|적용(?:되지|되지\s*않|안)|보호(?:되지|받지\s*못|받을\s*수\s*없))/)&&!question(t))return full('ELS가 예금자보호 비대상임을 설명했습니다.');
   return partial('예금자보호 여부가 명확히 안내되었는지 확인하세요.');
 case 'issuer':
   if(test(t,/(?:발행사|발행\s*회사|증권사).{0,32}(?:부도|신용|파산|지급\s*불능|못\s*받|신용\s*상태)/)&&!question(t))return full('발행사 신용위험을 설명했습니다.');
   return mention(/(?:발행사|발행\s*회사|신용위험|파산)/);
 case 'suitability':
   return mention(/(?:투자\s*성향|투자\s*목적|투자\s*경험|손실\s*감수|손실\s*감내|위험\s*성향|투자\s*기간|노후\s*자금)/,'투자성향 관련 질문/언급이 있습니다. 고객 답변과 공식 심사는 별도로 필요합니다.');
 case 'comprehension':
   return mention(/(?:이해\s*하셨|이해\s*되셨|이해\s*했는지|이해\s*하십|이해\s*하셨나요|설명\s*이해|질문\s*있으|궁금한\s*점)/,'이해 확인 질문이 있습니다. 고객의 명시적 답변을 확인해야 합니다.');
 }
 return none();
}
function customerTopics(text){const t=norm(text),arr=[];const keys=[
 ['underlying',/(?:홍콩|H\s*지수|ELS|기초자산)/i],['payoff',/(?:조기\s*상환|상환\s*조건|수익률|수익은)/],['maturity',/(?:낙인|녹인|만기\s*(?:상환|판정|시점|조건|에)|손실\s*조건)/],['loss',/(?:원금|손실|보장|잃|위험)/],['early',/(?:중도\s*(?:매도|환매|해지)|만기\s*전)/],['fee',/(?:수수료|보수|비용)/],['deposit',/(?:예금자\s*보호|예금\s*보험)/],['issuer',/(?:발행사|신용위험|부도)/]
 ];for(const [id,re]of keys)if(test(t,re))arr.push(id);return arr;}
function explicitUnderstood(t){return test(t,/(?:이해했|이해했습니다|이해했어요|알겠습니다|잘\s*알겠|이해하고\s*있|확인했습니다)/)&&!test(t,/(?:못|안\s*되|어렵|헷갈|잘\s*모르|아직\s*모르)/);}
function confusing(t){return test(t,/(?:이해\s*못|이해가\s*안|잘\s*모르|어렵|헷갈|다시\s*설명|무슨\s*뜻|잘\s*이해가\s*되지)/);}
function customerSubstance(t){return test(t,/(?:경험|주식|펀드|채권|노후|은퇴|안정|공격|위험|손실|감수|감내|투자\s*목적|자금|투자\s*기간|몇\s*년)/);}
function analyze(entries,opts={}){
 const finished=!!opts.finished;
 const data=(entries||[]).map((e,i)=>({id:e.id??i+1,speaker:e.speaker==='customer'?'customer':'staff',text:norm(e.text),at:e.at||null})).filter(e=>e.text);
 const states={}, alerts=[];
 const add=(a)=>{const o={...a,priority:a.priority??2};if(!alerts.some(x=>x.kind===o.kind&&x.id===o.id&&x.ruleId===o.ruleId&&x.title===o.title))alerts.push(o);};
 // Process conversational pairs. Latest customer answer may invalidate earlier understanding confirmation.
 for(const rule of RULES){
  let best={score:0,why:'',entry:null,responseId:null};
  for(let i=0;i<data.length;i++){
    const e=data[i];if(e.speaker!=='staff')continue;
    const check=assess(rule.id,e.text);if(check.score===0)continue;
    let candidate={...check,entry:e,responseId:null};
    if(rule.id==='suitability'||rule.id==='comprehension'){
      const reply=data.slice(i+1).find(n=>n.speaker==='customer');
      if(reply){
        if(rule.id==='suitability'&&customerSubstance(reply.text))candidate={score:2,why:'직원 질문과 고객의 투자 관련 답변을 확인했습니다. 공식 적합성 평가는 별도입니다.',entry:e,responseId:reply.id};
        if(rule.id==='comprehension'&&explicitUnderstood(reply.text))candidate={score:2,why:'직원의 이해 확인 질문과 고객의 명시적 응답을 확인했습니다. 실제 이해의 충분성은 별도 검토가 필요합니다.',entry:e,responseId:reply.id};
        if(rule.id==='comprehension'&&confusing(reply.text))candidate={score:1,why:'고객이 이해가 어렵다고 답했습니다. 설명을 보완해야 합니다.',entry:reply,responseId:null};
      }
    }
    if(candidate.score>best.score || (candidate.score===best.score&&candidate.entry&&(!best.entry||candidate.entry.id>best.entry.id)))best=candidate;
  }
  // Customer expressed unresolved confusion after the last understood reply.
  if(rule.id==='comprehension'&&best.score===2){
    const later=data.find(e=>e.speaker==='customer'&&e.id>(best.responseId||0)&&confusing(e.text));
    if(later)best={score:1,why:'이해 확인 뒤 고객이 다시 이해의 어려움을 표현했습니다.',entry:later,responseId:null};
  }
  const status=best.score===2?'done':best.score===1?'review':finished?'missing':'pending';
  states[rule.id]={...rule,status,score:best.score,entryId:best.entry?best.entry.id:null,responseId:best.responseId,reason:best.why};
  if(best.score===1)add({kind:'review',ruleId:rule.id,id:best.entry?.id||null,title:`설명 보완 검토 · ${rule.label}`,desc:best.why+' '+rule.advice,evidence:best.entry?.text||'',priority:2});
  if(finished&&best.score===0)add({kind:'missing',ruleId:rule.id,id:null,title:`상담 종료 후 근거 미확인 · ${rule.label}`,desc:rule.advice,evidence:'대화 기록에서 해당 항목의 명확한 설명을 찾지 못했습니다.',priority:3});
 }
 for(const e of data){
   if(e.speaker!=='staff')continue;
   for(const s of sentences(e.text)){
     if(guaranteeClaim(s))add({kind:'risk',ruleId:'loss',id:e.id,title:'원금보장 확약 가능성',desc:'원금 비보장 ELS 상담에서 원금보장을 확약하는 듯한 표현입니다. 손실 구조를 설명하고 발언을 정정하세요.',evidence:s,priority:0});
     if(profitClaim(s))add({kind:'risk',ruleId:'payoff',id:e.id,title:'확정수익·무조건 수익 표현',desc:'ELS 수익은 약정 조건에 따릅니다. 수익 조건과 손실 가능성을 함께 설명하세요.',evidence:s,priority:0});
     if((lossDenial(s)||misleadingSafe(s))&&!denial(s))add({kind:'risk',ruleId:'loss',id:e.id,title:'손실 위험 축소·예금 오인 표현',desc:'실제 ELS를 예금처럼 안전하다고 단정하는 설명은 위험할 수 있습니다. 구조화된 위험 설명을 제공하세요.',evidence:s,priority:0});
     if(test(s,/(?:예금자\s*보호|예금\s*보험)/)&&test(s,/(?:적용\s*됩니다|대상\s*입니다|보호(?:됩니다|받을\s*수\s*있)|도\s*됩니다)/)&&!test(s,/(?:아니|않|안\s*됩|되지|비대상|없)/))add({kind:'risk',ruleId:'deposit',id:e.id,title:'예금자보호 가능하다는 잘못된 안내 의심',desc:'ELS는 예금자보호 대상이 아닙니다. 해당 안내를 검토하고 정정하세요.',evidence:s,priority:0});
     if(test(s,/(?:일단\s*(?:서명|가입)|서명부터|설명은\s*나중|가입부터|그냥\s*넘어가|복잡하니까\s*넘어가)/))add({kind:'risk',ruleId:'comprehension',id:e.id,title:'설명 생략·가입 우선 유도 의심',desc:'핵심 상품 내용·위험 설명과 고객 이해 확인을 먼저 진행하세요.',evidence:s,priority:0});
   }
 }
 // Match open customer questions to subsequent banker explanations; unanswered if weak or entirely missing.
 for(let i=0;i<data.length;i++){
   const e=data[i];if(e.speaker!=='customer'||!question(e.text))continue;
   const following=data.slice(i+1);
   // 이전 고객 질문의 후속 보완 설명도 인정 (시연용 휴리스틱).
   const staffWindow=following.filter(x=>x.speaker==='staff');
   for(const id of customerTopics(e.text)){
     const strong=staffWindow.some(s=>assess(id,s.text).score===2);
     if(strong)continue;
     const replied=staffWindow.find(s=>assess(id,s.text).score>0);
     const base=RULE_BY_ID[id];
     add({kind:'question',ruleId:id,id:e.id,title:`고객 질문 미해결 가능성 · ${base.label}`,desc:(replied?'관련 언급은 있지만 충분한 답변 여부를 재확인하세요. ':'질문에 대한 구체적인 답변이 기록되지 않았습니다. ')+base.advice,evidence:e.text,priority:1});
   }
 }
 alerts.sort((a,b)=>a.priority-b.priority||(a.id||0)-(b.id||0));
 return {states,alerts,done:Object.values(states).filter(x=>x.status==='done').length,total:RULES.length,entries:data};
}
return {RULES,DEMOS,analyze,assess,guaranteeClaim,profitClaim,denial,customerTopics};
});

