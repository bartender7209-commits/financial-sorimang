# 금융소리망 5.7 — 인디고 바이올렛 공식 브랜드 적용

## 무엇을 변경했나
- 사용자 확정 **인디고 바이올렛 귀 로고**를 그대로 사용. 기존 로고를 다시 그리거나 형태를 변형하지 않음.
- 기존 백색 배경만 투명화해 사이드 메뉴에 표시할 수 있는 `financial-sorimang-ear.png` 생성.
- 파비콘(`financial-sorimang-favicon.png`)과 앱 아이콘(`financial-sorimang-app-icon.png`) 추가.
- 공통 사이드바와 각 페이지의 기본 버튼·비위험 분석 막대에 인디고 바이올렛 브랜드 팔레트 적용.
- 위험·정상·경고의 의미 구분(빨강·초록·주황)은 가능한 한 그대로 유지.
- 메뉴 너비, 순서, 링크, 분석 로직, D1 서버/API, 관리자 비밀키 및 저장 구조 변경 없음.

## GitHub 업데이트 방법
1. 압축을 해제하고 **ZIP 자체가 아닌 파일 10개**를 GitHub 저장소 최상위(root)에 업로드.
2. 기존 `index.html`, `analytics.html`, `cloud-analytics.html`, `evaluation.html`, `evaluation-compare.html`, `financial-sorimang-shell.css` 파일은 같은 이름으로 덮어써야 함. **`index (1).html`처럼 이름을 바꾸지 않도록 주의.**
3. 새 이미지 3개 `financial-sorimang-ear.png`, `financial-sorimang-favicon.png`, `financial-sorimang-app-icon.png`와 이 안내문(`README_5.7_브랜드적용.md`)도 함께 업로드.
4. `functions/api/records.js`, `engine.js`, `cloud-analytics.js`, `sorimang-db.js` 등 백엔드/분석 JS 파일은 절대 수정하지 않음.
5. Commit Changes → Cloudflare Pages 최신 Deploy 성공 확인. 기존 캐시가 남으면 강력 새로고침(Ctrl+Shift+R).

## 점검 항목
- 5개 페이지 공통 메뉴와 로고가 똑같이 표시되는지.
- 선택 메뉴 활성 표시와 주요 버튼이 보라색인지.
- 기존 상담 마이크, 설명 누락 점검, 가입 차단, 데이터 기록 기능에 오류가 없는지.
- /api/records 주소가 인증 없이 접근할 때 기존과 같이 `인증이 필요합니다` 응답을 반환하는지.
- D1 서버 관리 비밀키를 코드나 GitHub에 업로드하지 않았는지.

## 기록
- **실제 금융상담 원문을 업로드하지 말고**, 경진대회 시연에는 가상·합성 데이터만 사용.
- 이 패키지는 시각 디자인 변경만 포함. Cloudflare 배포 환경에서의 최종 실사용 검증은 별도로 필요함.
