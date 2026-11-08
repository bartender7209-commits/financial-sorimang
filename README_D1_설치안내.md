# 금융소리망 5.2 — Cloudflare D1 서버 상담 요약 통계

## 완료 상태

- 기존 5.0 상담 모니터링/브라우저 IndexedDB/분석 대시보드 유지
- `functions/api/records.js`: Cloudflare Pages Function. `DB` 바인딩으로 D1 연결.
- `cloud-analytics.html` + `cloud-analytics.js`: 가상 상담의 익명 요약 업로드, 서버 누적 데이터 조회·시각화.
- 서버에 상담 원문, 녹취, 상담자 이름, 전화번호 등은 **저장하지 않음**.
- 관리자 단일 비밀키 인증은 경진대회 시연용이며 실제 운영환경의 다중 사용자 인증을 대체하지 못함.

## 이미 완료한 선행 조건

1. Cloudflare D1 `financial-sorimang-db` 생성.
2. 아래 테이블 생성 SQL 실행(기존 생성 내용이 같다면 재실행 불필요):

```sql
CREATE TABLE IF NOT EXISTS consultation_records (
  id TEXT PRIMARY KEY,
  saved_at TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'demo',
  risk_score INTEGER NOT NULL DEFAULT 0,
  record_json TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_consultation_saved_at ON consultation_records(saved_at);
```

3. 금융소리망 Pages 프로젝트에서 D1 binding 이름 `DB`, 대상 `financial-sorimang-db` 설정.

## 반드시 추가할 설정: 서버 비밀키

1. Cloudflare 대시보드 → **Workers & Pages** → GitHub와 연결된 실제 `financial-sorimang` Pages 프로젝트 → **설정(Settings) → 변수 및 비밀(Variables and Secrets)**.
2. **환경: Production**에 비밀키 추가:
   - 변수 이름: `SORIMANG_DEMO_TOKEN`
   - 유형: **Secret** (평문 Environment Variable이 아닌 비밀값으로 등록 권장)
   - 값: 직접 만든 충분히 긴 무작위 문자열(최소 20자, 권장 32자 이상). 예: 비밀번호 생성기 활용. 실제 값은 README, GitHub, 메신저, ChatGPT에 전송하거나 포함하지 마세요.
3. 저장하고 **새 배포를 실행**해야 변경된 바인딩과 비밀키를 실행 환경에서 이용할 수 있습니다.
4. 이 비밀키는 추후 `cloud-analytics.html`의 관리자 인증 칸에 직접 입력합니다. 페이지는 비밀키를 로컬 DB/LocalStorage에 저장하지 않습니다.

## GitHub 배포

**중요: 프로젝트 소스 루트에서 `functions` 폴더 이름과 하위 경로를 유지해야 합니다.**

```text
index.html
analytics.html
analytics.js
engine.js
sorimang-db.js
cloud-analytics.html
cloud-analytics.js
functions/
  api/
    records.js
README.md
README_D1_설치안내.md
```

1. 기존 저장소 https://github.com/bartender7209-commits/financial-sorimang 에서 기존 main 백업 또는 branch 생성.
2. ZIP을 압축 해제하고 최상위 파일과 `functions/api/records.js` 경로를 GitHub 저장소에 반영. GitHub 웹 UI에서는 `Add file → Create new file`에서 파일명을 `functions/api/records.js`로 입력해 하위 폴더까지 만들 수 있습니다. 폴더째 업로드 가능하면 경로가 중첩되지 않게 확인하세요.
3. main 커밋 → Cloudflare Pages의 Git 연동 자동 빌드/배포 완료 확인.
4. https://financial-sorimang.pages.dev/cloud-analytics.html 접속.

**주의:** Pages Functions는 Git 연동이나 Wrangler CLI로 배포해야 합니다. Cloudflare Dashboard에서 ZIP 직접 업로드하면 Functions 코드가 배포되지 않습니다.

## 사용 순서

1. `https://financial-sorimang.pages.dev/analytics.html`에서 `합성 시연 데이터 생성` 클릭 → 이 브라우저에 24건 생성.
2. `https://financial-sorimang.pages.dev/cloud-analytics.html` 접속.
3. Cloudflare에 등록한 서버 비밀키를 입력하고 `서버 데이터 조회` 클릭(처음에는 0건 정상).
4. `모든 업로드 기록이 가상/합성 상담` 체크.
5. `현재 브라우저의 가상 상담 요약 전송` 클릭.
6. 서버 통계 24건 확인 → D1 대시보드 콘솔에서 `SELECT COUNT(*) AS total FROM consultation_records;` 실행하여 대조.

## 장애 대응

- `401`: 입력한 비밀키 오류. GitHub에 등록하는 값이 아니라 **Cloudflare의 Secret 값**과 동일한지 확인.
- `503`: `SORIMANG_DEMO_TOKEN` (20자 이상) 미등록 또는 D1 바인딩 이름 `DB` 오설정. Production에 설정한 뒤 재배포.
- `404` 혹은 HTML 반환: `functions/api/records.js`가 GitHub의 정확한 경로에 없거나 Pages Functions가 배포되지 않음.
- `500`: D1 테이블이 없는지, D1 바인딩/로그를 확인.
- 화면 0건: 서버 연결 직후에는 0건 정상. 합성 상담 데이터 생성 후 업로드 필요.
- Pages의 build output directory가 `.`이면 프로젝트 루트에 `functions` 폴더를 두고 빌드 출력 경로 설정을 수정하지 않습니다.

## 한계 및 주의

- 이 API는 토큰 보유자가 모든 시연 기록 요약을 보고 덮어쓸 수 있는 **단일 관리자** 데모 구조. 실서비스에는 사용자별 인증, 접근 통제, 보존·삭제 정책, 감사 로그, 동의 절차가 필요.
- 서버에는 **원문이 포함되지 않은 익명 요약**만 저장. 일반 사용자에게 비밀키를 공유하면 안 됨.
- 합성 대화 데이터는 실증 상담 데이터, 빅데이터 활용 성과, AI 예측 정확도의 근거가 아님. 점수는 규칙식 결과.
- 데이터 읽기 제한은 최신 500건. 전체 데이터의 대규모 집계를 원하면 서버 집계 쿼리로 확장해야 함.
- 현재 구현은 CSV/JSON 분석 화면의 브라우저 기록을 유지하며 서버는 별도로 운영됨. DB 백업·삭제는 추후 추가 가능.
