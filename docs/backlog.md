# 백로그

## 완료
- [x] Vite + React + TypeScript 프로젝트 초기 세팅
- [x] @apps-in-toss/web-framework 설치
- [x] npx ait init 실행 (granite.config.ts 생성)
- [x] @toss/tds-mobile, @toss/tds-mobile-ait, @emotion/react 설치
- [x] framer-motion, lucide-react 설치
- [x] TDSMobileAITProvider 설정 (main.tsx, 브라우저/granite 환경 분기)
- [x] Footprint.jsx → src/Footprint.jsx 이동 및 App.tsx 연결
- [x] TDS 컴포넌트 교체: 메모 입력(TextField), 전송(Button), + 발자국 버튼(Button)
- [x] granite.config.ts 설정 (앱명, 색상, 아이콘, 권한, 실기기 호스트)
- [x] GPS 실제 구현 (navigator.geolocation + MOCK_ADDRESSES fallback)
- [x] 역지오코딩 연동 (OpenStreetMap Nominatim, API 키 불필요)
- [x] granite.config.ts permissions에 geolocation 권한 추가
- [x] 모바일 레이아웃 수정 (100dvh, 터치 스크롤, safe area, 팝업 클램핑)
- [x] viewport-fit=cover 적용 (index.html)
- [x] 실기기 테스트 호스트 설정 (192.168.0.29, vite --host)
- [x] granite 포트 8081 충돌 해결 → npm run dev 정상 기동
- [x] Tailwind CSS 설치 및 설정 (@tailwindcss/vite, @import "tailwindcss")
- [x] TDSMobileProvider 브라우저 환경 분기 (흰 화면 원인: ThemeProvider 미적용)
- [x] adb reverse 연결 (tcp:8081, tcp:5173, tcp:5174)
- [x] 앱 시작 시 오늘 날짜로 초기화 (new Date() 하드코딩 제거)
- [x] 날씨 선택 localStorage 저장/복원 (fp-weather 키)
- [x] GPS enableHighAccuracy false, timeout 5초로 단축
- [x] GPS 거부 시 발자국 미추가 + AlertDialog 안내
- [x] ConfirmDialog 문구에 "기기에만 저장" 안내 추가
- [x] HTML lang="en" → lang="ko" 수정

## 진행 중
- [x] 댓글 흰 화면 플래시 해결
- [x] GPS 주소 이상 파악 → 테스트 시 정상 확인 (Nominatim 정상 동작)
- [x] 에뮬레이터 앱 화면 실제 확인 → granite.config host 'localhost' 고정으로 해결
- [x] TDS ConfirmDialog/AlertDialog 투명 배경 문제 해결 (CSS variables, colorPreference, canvas pause)
- [x] 앱 번들 빌드 완료 (footprint-diary.ait)

## 예정
- [x] 날씨/날짜 버튼 TDS 대체 방안 검토 → 날짜 nav IconButton 교체 완료, 날씨 버튼은 TDS 아이콘 미지원으로 lucide 유지
- [x] 토스 검수 대응: viewport 핀치줌 비활성화 (user-scalable=no)
- [x] 토스 검수 대응: GPS 권한 사전 동의 TDS ConfirmDialog 추가
- [x] 토스 검수 대응: UX 항목 코드 점검 완료 (lang, weather 저장, GPS 흐름, ConfirmDialog 동작)
- [ ] 토스 앱 실기기 전체 테스트 (내가 직접)
- [ ] 토스 콘솔 등록 및 검수 제출
- [ ] GitHub 저장소 생성 및 푸시 (로컬 git 초기화 완료, 원격 연결 필요)
- [ ] 앱 검수 완료 후 사이드바 + 광고 추가해서 재신청


## 추후 확인 필요
- [ ] AIT 콘솔에서 브랜드 아이콘(모노톤) 개별 등록 확인 (샌드박스에서 미표시 → 콘솔 등록 후 재확인)
- [ ] 실기기에서 GPS 응답 속도 실측 (체크리스트 "인터랙션 반응 2초 이내" 기준 검증)

- [x] SDK 2.0.1 마이그레이션 (`@apps-in-toss/web-framework` 2.0.1, `ait build` 전환)

## 추후 할 수도 있는 것
- [x] 사이드바: 내 기록 모아보기 (Sidebar.jsx, LogsPage.jsx, FeedbackPage.jsx 구현 완료)
- [x] LogsPage 타임라인 디자인 코드 적용 (pencil 디자인 → 실제 구현, Forest Teal 팔레트)
- [x] LogsPage 메모 최대 2개 표시 정책 구현 (초과 시 "+ N개 더 보기")
- [x] FeedbackPage 구글폼 URL 연결 (src/FeedbackPage.jsx의 FEEDBACK_FORM_URL 교체)
- [ ] 마이그레이션 마크다운 파일 적용 (데이터 마이그레이션)
- [ ] 광고 실 ID 교체 (사업자 등록 → 토스 AIT 콘솔 광고 그룹 ID 발급 → ait-ad-test-banner-id 교체)
- [ ] 데이터 다운받기 버튼
- [ ] 현재 위치 날씨 읽어서 테마 자동 적용 (외부 날씨 API 연동 — 토스 외부 API 허용 여부 확인 필요)
- [ ] 날씨와 연동한 테마
- [ ] 해변가 등 테마 추가
- [ ] 오늘의 일기 로그 쓰기
- [ ] 머문 시간
- [ ] 기록 푸시 설정 기능