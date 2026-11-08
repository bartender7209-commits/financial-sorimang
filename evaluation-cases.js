/* 금융소리망 5.3: 교육용 합성 위험 발언 검증 문장 100건.
 * 정답 레이블은 개발자가 문장 의미를 기준으로 만든 시연용 주석이며,
 * 금융전문가의 독립 검수 또는 실제 현장 데이터 기반의 정답이 아닙니다.
 * 기존 규칙 엔진의 오탐/미탐을 드러내는 목적으로 구성.
 */
(function(root,factory){const d=factory();if(typeof module==='object'&&module.exports)module.exports=d;if(root)root.SorimangEvaluationCases=d;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
return Object.freeze([
  {
    "id":"R001",
    "text":"이 ELS는 원금이 보장됩니다.",
    "expected":true,
    "group":"원금보장 확약",
    "difficulty":"기본"
  },
  {
    "id":"R002",
    "text":"투자금은 100% 보장됩니다.",
    "expected":true,
    "group":"원금보장 확약",
    "difficulty":"기본"
  },
  {
    "id":"R003",
    "text":"걱정하실 필요 없습니다. 원금 보장해드립니다.",
    "expected":true,
    "group":"원금보장 확약",
    "difficulty":"기본"
  },
  {
    "id":"R004",
    "text":"원금이 무조건 안전한 상품입니다.",
    "expected":true,
    "group":"원금보장 확약",
    "difficulty":"기본"
  },
  {
    "id":"R005",
    "text":"이 투자상품은 투자금 전액 보장되는 상품입니다.",
    "expected":true,
    "group":"원금보장 확약",
    "difficulty":"기본"
  },
  {
    "id":"R006",
    "text":"원금 100% 보장이라는 점만 기억하세요.",
    "expected":true,
    "group":"원금보장 확약",
    "difficulty":"도전"
  },
  {
    "id":"R007",
    "text":"원금은 확실히 안전한 ELS입니다.",
    "expected":true,
    "group":"원금보장 확약",
    "difficulty":"도전"
  },
  {
    "id":"R008",
    "text":"만기까지 보유하시면 원금 보장됩니다.",
    "expected":true,
    "group":"원금보장 확약",
    "difficulty":"도전"
  },
  {
    "id":"R009",
    "text":"어떤 시장 상황에서도 원금은 보장됩니다.",
    "expected":true,
    "group":"원금보장 확약",
    "difficulty":"도전"
  },
  {
    "id":"R010",
    "text":"투자 원금은 제가 책임지고 보전해 드리겠습니다.",
    "expected":true,
    "group":"원금보장 확약",
    "difficulty":"도전"
  },
  {
    "id":"R011",
    "text":"이 상품은 무조건 수익이 납니다.",
    "expected":true,
    "group":"확정수익 단정",
    "difficulty":"기본"
  },
  {
    "id":"R012",
    "text":"수익이 확정됩니다.",
    "expected":true,
    "group":"확정수익 단정",
    "difficulty":"기본"
  },
  {
    "id":"R013",
    "text":"수익은 100% 보장됩니다.",
    "expected":true,
    "group":"확정수익 단정",
    "difficulty":"기본"
  },
  {
    "id":"R014",
    "text":"손해 볼 일 없습니다.",
    "expected":true,
    "group":"확정수익 단정",
    "difficulty":"기본"
  },
  {
    "id":"R015",
    "text":"반드시 돈 벌게 됩니다.",
    "expected":true,
    "group":"확정수익 단정",
    "difficulty":"기본"
  },
  {
    "id":"R016",
    "text":"확실히 수익이 나오는 구조입니다.",
    "expected":true,
    "group":"확정수익 단정",
    "difficulty":"도전"
  },
  {
    "id":"R017",
    "text":"수익을 보장합니다.",
    "expected":true,
    "group":"확정수익 단정",
    "difficulty":"도전"
  },
  {
    "id":"R018",
    "text":"조건과 관계없이 반드시 수익을 받으십니다.",
    "expected":true,
    "group":"확정수익 단정",
    "difficulty":"도전"
  },
  {
    "id":"R019",
    "text":"절대 손해 볼 일 없습니다.",
    "expected":true,
    "group":"확정수익 단정",
    "difficulty":"도전"
  },
  {
    "id":"R020",
    "text":"이 상품은 수익이 무조건 나옵니다.",
    "expected":true,
    "group":"확정수익 단정",
    "difficulty":"도전"
  },
  {
    "id":"R021",
    "text":"ELS지만 안전한 예금 같은 상품입니다.",
    "expected":true,
    "group":"손실 위험 축소",
    "difficulty":"기본"
  },
  {
    "id":"R022",
    "text":"이 상품은 위험 없습니다.",
    "expected":true,
    "group":"손실 위험 축소",
    "difficulty":"기본"
  },
  {
    "id":"R023",
    "text":"투자하셔도 손실 없어요.",
    "expected":true,
    "group":"손실 위험 축소",
    "difficulty":"기본"
  },
  {
    "id":"R024",
    "text":"걱정하지 마세요.",
    "expected":true,
    "group":"손실 위험 축소",
    "difficulty":"기본"
  },
  {
    "id":"R025",
    "text":"이건 절대 안전한 상품입니다.",
    "expected":true,
    "group":"손실 위험 축소",
    "difficulty":"기본"
  },
  {
    "id":"R026",
    "text":"위험이 사실상 없는 구조입니다.",
    "expected":true,
    "group":"손실 위험 축소",
    "difficulty":"도전"
  },
  {
    "id":"R027",
    "text":"원금 손실은 절대 없습니다.",
    "expected":true,
    "group":"손실 위험 축소",
    "difficulty":"도전"
  },
  {
    "id":"R028",
    "text":"예금과 같고 문제 없습니다.",
    "expected":true,
    "group":"손실 위험 축소",
    "difficulty":"도전"
  },
  {
    "id":"R029",
    "text":"돈을 잃을 가능성은 전혀 없습니다.",
    "expected":true,
    "group":"손실 위험 축소",
    "difficulty":"도전"
  },
  {
    "id":"R030",
    "text":"시장이 내려가도 안전한 예금입니다.",
    "expected":true,
    "group":"손실 위험 축소",
    "difficulty":"도전"
  },
  {
    "id":"R031",
    "text":"이 ELS는 예금자보호 대상입니다.",
    "expected":true,
    "group":"예금자보호 오안내",
    "difficulty":"기본"
  },
  {
    "id":"R032",
    "text":"예금자 보호가 적용됩니다.",
    "expected":true,
    "group":"예금자보호 오안내",
    "difficulty":"기본"
  },
  {
    "id":"R033",
    "text":"이 ELS는 예금자보호도 됩니다.",
    "expected":true,
    "group":"예금자보호 오안내",
    "difficulty":"기본"
  },
  {
    "id":"R034",
    "text":"예금보험도 적용됩니다.",
    "expected":true,
    "group":"예금자보호 오안내",
    "difficulty":"기본"
  },
  {
    "id":"R035",
    "text":"ELS에도 예금자보호가 가능합니다.",
    "expected":true,
    "group":"예금자보호 오안내",
    "difficulty":"기본"
  },
  {
    "id":"R036",
    "text":"5천만 원까지 예금자보호가 됩니다.",
    "expected":true,
    "group":"예금자보호 오안내",
    "difficulty":"도전"
  },
  {
    "id":"R037",
    "text":"이 상품은 예금자보호 대상 상품입니다.",
    "expected":true,
    "group":"예금자보호 오안내",
    "difficulty":"도전"
  },
  {
    "id":"R038",
    "text":"은행에서 판매하니 예금자보호 적용됩니다.",
    "expected":true,
    "group":"예금자보호 오안내",
    "difficulty":"도전"
  },
  {
    "id":"R039",
    "text":"이 ELS는 예금자보호를 받을 수 있습니다.",
    "expected":true,
    "group":"예금자보호 오안내",
    "difficulty":"도전"
  },
  {
    "id":"R040",
    "text":"이건 보호되는 예금 상품이라 예금자보호가 돼요.",
    "expected":true,
    "group":"예금자보호 오안내",
    "difficulty":"도전"
  },
  {
    "id":"R041",
    "text":"설명은 나중에 하고 일단 서명부터 하시죠.",
    "expected":true,
    "group":"설명 생략·가입 유도",
    "difficulty":"기본"
  },
  {
    "id":"R042",
    "text":"위험은 복잡하니까 그냥 넘어가셔도 됩니다.",
    "expected":true,
    "group":"설명 생략·가입 유도",
    "difficulty":"기본"
  },
  {
    "id":"R043",
    "text":"서명부터 하시죠.",
    "expected":true,
    "group":"설명 생략·가입 유도",
    "difficulty":"기본"
  },
  {
    "id":"R044",
    "text":"가입부터 진행하겠습니다.",
    "expected":true,
    "group":"설명 생략·가입 유도",
    "difficulty":"기본"
  },
  {
    "id":"R045",
    "text":"이 부분은 그냥 넘어가세요.",
    "expected":true,
    "group":"설명 생략·가입 유도",
    "difficulty":"기본"
  },
  {
    "id":"R046",
    "text":"일단 가입 진행하시죠.",
    "expected":true,
    "group":"설명 생략·가입 유도",
    "difficulty":"도전"
  },
  {
    "id":"R047",
    "text":"먼저 가입하고 설명은 나중에 드릴게요.",
    "expected":true,
    "group":"설명 생략·가입 유도",
    "difficulty":"도전"
  },
  {
    "id":"R048",
    "text":"위험 내용은 생략하고 신청서부터 작성합시다.",
    "expected":true,
    "group":"설명 생략·가입 유도",
    "difficulty":"도전"
  },
  {
    "id":"R049",
    "text":"상품 구조는 복잡하니 읽지 마시고 서명해 주세요.",
    "expected":true,
    "group":"설명 생략·가입 유도",
    "difficulty":"도전"
  },
  {
    "id":"R050",
    "text":"가입하시고 나서 질문하시면 됩니다.",
    "expected":true,
    "group":"설명 생략·가입 유도",
    "difficulty":"도전"
  },
  {
    "id":"N051",
    "text":"이 ELS는 원금이 보장되지 않습니다.",
    "expected":false,
    "group":"올바른 위험 안내",
    "difficulty":"기본"
  },
  {
    "id":"N052",
    "text":"원금의 일부 또는 전액을 잃을 수 있습니다.",
    "expected":false,
    "group":"올바른 위험 안내",
    "difficulty":"기본"
  },
  {
    "id":"N053",
    "text":"조기상환 조건을 충족하지 못하면 수익이 지급되지 않을 수 있습니다.",
    "expected":false,
    "group":"올바른 위험 안내",
    "difficulty":"기본"
  },
  {
    "id":"N054",
    "text":"ELS는 예금자보호 대상이 아닙니다.",
    "expected":false,
    "group":"올바른 위험 안내",
    "difficulty":"기본"
  },
  {
    "id":"N055",
    "text":"상황에 따라 만기에 손실이 발생할 수 있습니다.",
    "expected":false,
    "group":"올바른 위험 안내",
    "difficulty":"기본"
  },
  {
    "id":"N056",
    "text":"중도매도 시 시장가격에 따라 손실이 발생할 수 있습니다.",
    "expected":false,
    "group":"올바른 위험 안내",
    "difficulty":"도전"
  },
  {
    "id":"N057",
    "text":"이 상품은 예금과 같지 않고 투자위험이 있습니다.",
    "expected":false,
    "group":"올바른 위험 안내",
    "difficulty":"도전"
  },
  {
    "id":"N058",
    "text":"원금 보장되지 않으며 전액 손실도 가능합니다.",
    "expected":false,
    "group":"올바른 위험 안내",
    "difficulty":"도전"
  },
  {
    "id":"N059",
    "text":"수익은 확정된 것이 아닙니다.",
    "expected":false,
    "group":"올바른 위험 안내",
    "difficulty":"도전"
  },
  {
    "id":"N060",
    "text":"절대 안전하다는 보장은 없습니다.",
    "expected":false,
    "group":"올바른 위험 안내",
    "difficulty":"도전"
  },
  {
    "id":"N061",
    "text":"원금 100% 보장이라는 표현은 잘못된 안내입니다.",
    "expected":false,
    "group":"부정·정정 표현",
    "difficulty":"기본"
  },
  {
    "id":"N062",
    "text":"무조건 수익이 난다는 설명은 사실이 아닙니다.",
    "expected":false,
    "group":"부정·정정 표현",
    "difficulty":"기본"
  },
  {
    "id":"N063",
    "text":"예금자보호가 된다고 안내한 것은 잘못입니다.",
    "expected":false,
    "group":"부정·정정 표현",
    "difficulty":"기본"
  },
  {
    "id":"N064",
    "text":"걱정하지 마세요라는 말은 부적절합니다.",
    "expected":false,
    "group":"부정·정정 표현",
    "difficulty":"기본"
  },
  {
    "id":"N065",
    "text":"수익을 보장한다는 말은 사용할 수 없습니다.",
    "expected":false,
    "group":"부정·정정 표현",
    "difficulty":"기본"
  },
  {
    "id":"N066",
    "text":"절대 안전이라는 설명은 하지 마세요.",
    "expected":false,
    "group":"부정·정정 표현",
    "difficulty":"도전"
  },
  {
    "id":"N067",
    "text":"과거에 원금이 보장된다는 잘못된 설명을 들으셨군요.",
    "expected":false,
    "group":"부정·정정 표현",
    "difficulty":"도전"
  },
  {
    "id":"N068",
    "text":"원금손실이 없다고 단정하면 안 됩니다.",
    "expected":false,
    "group":"부정·정정 표현",
    "difficulty":"도전"
  },
  {
    "id":"N069",
    "text":"예금과 같다는 표현은 투자상품을 오인하게 만들 수 있습니다.",
    "expected":false,
    "group":"부정·정정 표현",
    "difficulty":"도전"
  },
  {
    "id":"N070",
    "text":"가입부터 하라는 권유는 부적절합니다.",
    "expected":false,
    "group":"부정·정정 표현",
    "difficulty":"도전"
  },
  {
    "id":"N071",
    "text":"방금 고객님이 원금 보장되나요라고 질문하셨습니다.",
    "expected":false,
    "group":"고객 인용·질문 전달",
    "difficulty":"기본"
  },
  {
    "id":"N072",
    "text":"걱정하지 마세요라고 말씀드리지 않았습니다.",
    "expected":false,
    "group":"고객 인용·질문 전달",
    "difficulty":"기본"
  },
  {
    "id":"N073",
    "text":"예금자보호도 됩니다라는 문장은 사실이 아닙니다.",
    "expected":false,
    "group":"고객 인용·질문 전달",
    "difficulty":"기본"
  },
  {
    "id":"N074",
    "text":"제가 방금 손실 없다고 안내했는데 정정하겠습니다.",
    "expected":false,
    "group":"고객 인용·질문 전달",
    "difficulty":"기본"
  },
  {
    "id":"N075",
    "text":"무조건 수익이라는 말은 위험한 표현입니다.",
    "expected":false,
    "group":"고객 인용·질문 전달",
    "difficulty":"기본"
  },
  {
    "id":"N076",
    "text":"서명부터 하라는 방식은 지양하겠습니다.",
    "expected":false,
    "group":"고객 인용·질문 전달",
    "difficulty":"도전"
  },
  {
    "id":"N077",
    "text":"단순히 예금 같은 상품이라고 설명하면 안 됩니다.",
    "expected":false,
    "group":"고객 인용·질문 전달",
    "difficulty":"도전"
  },
  {
    "id":"N078",
    "text":"원금 100% 보장이라는 광고는 잘못됐습니다.",
    "expected":false,
    "group":"고객 인용·질문 전달",
    "difficulty":"도전"
  },
  {
    "id":"N079",
    "text":"문제 없다는 안내는 정확하지 않습니다.",
    "expected":false,
    "group":"고객 인용·질문 전달",
    "difficulty":"도전"
  },
  {
    "id":"N080",
    "text":"가입부터 진행하자는 제안은 철회합니다.",
    "expected":false,
    "group":"고객 인용·질문 전달",
    "difficulty":"도전"
  },
  {
    "id":"N081",
    "text":"홍콩 H지수는 기초자산 중 하나입니다.",
    "expected":false,
    "group":"중립적 상품 설명",
    "difficulty":"기본"
  },
  {
    "id":"N082",
    "text":"오늘은 상품의 기본 구조부터 설명드리겠습니다.",
    "expected":false,
    "group":"중립적 상품 설명",
    "difficulty":"기본"
  },
  {
    "id":"N083",
    "text":"정기적으로 시장가격을 점검하시는 것이 좋습니다.",
    "expected":false,
    "group":"중립적 상품 설명",
    "difficulty":"기본"
  },
  {
    "id":"N084",
    "text":"기준가격과 평가일은 상품설명서에 기재되어 있습니다.",
    "expected":false,
    "group":"중립적 상품 설명",
    "difficulty":"기본"
  },
  {
    "id":"N085",
    "text":"수익 구조는 여러 조건에 따라 달라집니다.",
    "expected":false,
    "group":"중립적 상품 설명",
    "difficulty":"기본"
  },
  {
    "id":"N086",
    "text":"비용과 수수료는 계약 조건을 확인하세요.",
    "expected":false,
    "group":"중립적 상품 설명",
    "difficulty":"도전"
  },
  {
    "id":"N087",
    "text":"손실 발생 가능성은 별도의 설명이 필요합니다.",
    "expected":false,
    "group":"중립적 상품 설명",
    "difficulty":"도전"
  },
  {
    "id":"N088",
    "text":"투자경험을 확인하겠습니다.",
    "expected":false,
    "group":"중립적 상품 설명",
    "difficulty":"도전"
  },
  {
    "id":"N089",
    "text":"고객님은 투자 기간을 몇 년으로 생각하시나요?",
    "expected":false,
    "group":"중립적 상품 설명",
    "difficulty":"도전"
  },
  {
    "id":"N090",
    "text":"예금자보호 여부를 정확하게 살펴보겠습니다.",
    "expected":false,
    "group":"중립적 상품 설명",
    "difficulty":"도전"
  },
  {
    "id":"N091",
    "text":"원금손실은 절대로 없다고 말할 수 없습니다.",
    "expected":false,
    "group":"경계·맥락 사례",
    "difficulty":"기본"
  },
  {
    "id":"N092",
    "text":"원금 보장 상품이 아니므로 손실 위험이 있습니다.",
    "expected":false,
    "group":"경계·맥락 사례",
    "difficulty":"기본"
  },
  {
    "id":"N093",
    "text":"조건이 충족되면 약정된 수익이 지급될 수 있습니다.",
    "expected":false,
    "group":"경계·맥락 사례",
    "difficulty":"기본"
  },
  {
    "id":"N094",
    "text":"만기 때 기준가격보다 높을 경우 정해진 수익을 지급합니다.",
    "expected":false,
    "group":"경계·맥락 사례",
    "difficulty":"기본"
  },
  {
    "id":"N095",
    "text":"ELS는 예금과 같지 않습니다.",
    "expected":false,
    "group":"경계·맥락 사례",
    "difficulty":"기본"
  },
  {
    "id":"N096",
    "text":"제가 설명을 빼먹었다면 지금 다시 말씀드리겠습니다.",
    "expected":false,
    "group":"경계·맥락 사례",
    "difficulty":"도전"
  },
  {
    "id":"N097",
    "text":"서명은 설명을 모두 이해하신 후에 해주세요.",
    "expected":false,
    "group":"경계·맥락 사례",
    "difficulty":"도전"
  },
  {
    "id":"N098",
    "text":"손해 볼 일 없다는 말은 사실이 아닙니다.",
    "expected":false,
    "group":"경계·맥락 사례",
    "difficulty":"도전"
  },
  {
    "id":"N099",
    "text":"무조건 수익이 난다는 표현을 피해야 합니다.",
    "expected":false,
    "group":"경계·맥락 사례",
    "difficulty":"도전"
  },
  {
    "id":"N100",
    "text":"예금자보호가 되는 상품은 예금 등 해당 요건을 충족하는 경우입니다.",
    "expected":false,
    "group":"경계·맥락 사례",
    "difficulty":"도전"
  }
]);
});
