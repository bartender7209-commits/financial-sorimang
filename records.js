/**
 * 금융소리망 5.2 — Cloudflare Pages Functions + D1.
 * 경진대회용 가상/합성 상담의 익명화된 요약 통계만 저장합니다.
 * 상담 원문, 음성, 고객명, 금융계좌, 연락처는 서버에 보관하지 않습니다.
 * 단일 데모 관리자 비밀키 방식: 실제 금융기관 사용에 적합한 사용자 인증은 별도 필요.
 */
const JSON_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff'
};
const RULE_IDS = new Set([
  'underlying','payoff','maturity','loss','early','fee','deposit','issuer','suitability','comprehension'
]);
const SOURCE = new Set(['sample', 'demo', 'manual']);
const STATUSES = new Set(['done', 'review', 'missing', 'none', 'unknown', 'pending']);
function respond(obj, status = 200) {
  return new Response(JSON.stringify(obj), {status, headers: JSON_HEADERS});
}
function equalConstantTime(a, b) {
  const left = new TextEncoder().encode(a);
  const right = new TextEncoder().encode(b);
  let bad = left.length ^ right.length;
  const length = Math.max(left.length, right.length);
  for (let i = 0; i < length; i++) bad |= (left[i] || 0) ^ (right[i] || 0);
  return bad === 0;
}
function check(context) {
  const token = context.env.SORIMANG_DEMO_TOKEN;
  if (!context.env.DB || !token || token.length < 20) {
    return respond({error: 'D1 바인딩 또는 서버 비밀키가 설정되지 않았습니다.'}, 503);
  }
  const header = context.request.headers.get('Authorization') || '';
  const prefix = 'Bearer ';
  const supplied = header.startsWith(prefix) ? header.slice(prefix.length) : '';
  if (!supplied || !equalConstantTime(supplied, token)) return respond({error:'인증이 필요합니다.'}, 401);
  return null;
}
function integer(value, max) {
  const n = Number(value);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(max, Math.trunc(n)));
}
function parseRecord(source) {
  if (!source || typeof source !== 'object' || Array.isArray(source)) throw new Error('레코드 형식 오류');
  const id = source.id;
  if (typeof id !== 'string' || id.length < 1 || id.length > 120 || !/^[\w-]+$/.test(id)) throw new Error('상담 ID 형식 오류');
  if (!SOURCE.has(source.source)) throw new Error('알 수 없는 데이터 출처');
  if (typeof source.savedAt !== 'string' || source.savedAt.length > 40 || !Number.isFinite(Date.parse(source.savedAt))) throw new Error('저장 시각 오류');
  const analysis = source.analysis;
  if (!analysis || typeof analysis !== 'object' || Array.isArray(analysis)) throw new Error('분석 데이터 누락');
  const r = Array.isArray(analysis.rules) ? analysis.rules : [];
  if (r.length > 20) throw new Error('분석 항목 제한 초과');
  const rules = [];
  const seen = new Set();
  for (const entry of r) {
    if (!entry || !RULE_IDS.has(entry.id) || seen.has(entry.id) || !STATUSES.has(entry.status)) throw new Error('분석 항목 형식 오류');
    seen.add(entry.id);
    rules.push({id: entry.id, status: entry.status}); // 원문/사유 업로드 금지
  }
  const missing = rules.filter(x => x.status !== 'done').length;
  const unresolvedRiskCount = integer(analysis.unresolvedRiskCount, 1000);
  const questionCount = integer(analysis.questionCount, 1000);
  const reviewPriority = Math.min(100, missing * 6 + unresolvedRiskCount * 18 + questionCount * 8);
  const record = {
    version: 5.2,
    source: source.source,
    finished: source.finished === true,
    utteranceCount: integer(source.utteranceCount, 10000),
    done: rules.filter(x => x.status === 'done').length,
    total: rules.length,
    missingCount: missing,
    unresolvedRiskCount,
    questionCount,
    reviewPriority,
    rules
  };
  // 필드 화이트리스트만 저장: 임의의 텍스트나 entries/alerts는 전혀 사용하지 않음
  return {
    id,
    saved_at: new Date(source.savedAt).toISOString(),
    source: source.source,
    risk_score: reviewPriority,
    record_json: JSON.stringify(record)
  };
}
export async function onRequestGet(context) {
  const unauthorized = check(context); if (unauthorized) return unauthorized;
  try {
    const {results} = await context.env.DB.prepare(
      'SELECT id, saved_at, source, risk_score, record_json FROM consultation_records ORDER BY saved_at DESC LIMIT 500'
    ).all();
    const rows = results.map(r => ({
      id: r.id, savedAt: r.saved_at, source: r.source, riskScore: r.risk_score,
      analysis: JSON.parse(r.record_json)
    }));
    return respond({rows, limit: 500, dataType:'synthetic-demo-summary'});
  } catch (error) {
    console.error('D1 read error:', error?.name || 'Error');
    return respond({error:'데이터베이스 조회에 실패했습니다.'}, 500);
  }
}
export async function onRequestPost(context) {
  const unauthorized = check(context); if (unauthorized) return unauthorized;
  if (!(context.request.headers.get('content-type') || '').toLowerCase().includes('application/json')) {
    return respond({error:'application/json 형식으로 요청해 주세요.'}, 415);
  }
  try {
    const text = await context.request.text();
    if (text.length > 250000) return respond({error:'요청 크기 제한(250KB)을 초과했습니다.'}, 413);
    const body = JSON.parse(text);
    if (!body || !Array.isArray(body.records) || body.records.length < 1 || body.records.length > 100) {
      return respond({error:'1~100건의 records 배열이 필요합니다.'}, 400);
    }
    const rows = body.records.map(parseRecord); // 어떤 데이터도 저장하기 전에 모두 검증
    const statement = context.env.DB.prepare(
      'INSERT INTO consultation_records (id, saved_at, source, risk_score, record_json) VALUES (?1, ?2, ?3, ?4, ?5) ' +
      'ON CONFLICT(id) DO UPDATE SET saved_at=excluded.saved_at, source=excluded.source, risk_score=excluded.risk_score, record_json=excluded.record_json'
    );
    await context.env.DB.batch(rows.map(r => statement.bind(r.id, r.saved_at, r.source, r.risk_score, r.record_json)));
    return respond({saved:rows.length, dataType:'synthetic-demo-summary'});
  } catch (error) {
    if (error instanceof SyntaxError) return respond({error:'JSON 형식 오류'}, 400);
    if (error instanceof Error && /형식 오류|제한 초과|누락|알 수 없는/.test(error.message)) return respond({error:error.message},400);
    console.error('D1 write error:', error?.name || 'Error');
    return respond({error:'데이터베이스 저장에 실패했습니다.'}, 500);
  }
}
