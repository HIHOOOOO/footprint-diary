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

## 진행 중
- [ ] 댓글 흰 화면 플래시 재현 및 원인 확정 (ThrottleRef + CSS max-height 전환 적용했으나 미해결)
- [ ] GPS 주소 이상 파악 (Nominatim rate limiting 의심, 코드 미변경)
- [x] 에뮬레이터 앱 화면 실제 확인 → granite.config host 'localhost' 고정으로 해결

## 예정
- [ ] 날씨/날짜 버튼 TDS 대체 방안 검토 (현재 lucide 아이콘 사용으로 IconButton 미적용)
- [ ] 토스 앱 실기기 전체 테스트
- [ ] 토스 콘솔 등록 및 검수 제출
- [ ] GitHub 저장소 생성 및 푸시 (로컬 git 초기화 완료, 원격 연결 필요)


## 추후 할 수도 있는 것
- [ ] 사이드바: 내 기록 모아보기
- [ ] 데이터 다운받기 버튼
- [ ] 날씨와 연동한 테마
- [ ] 해변가 등 테마 추가
- [ ] 오늘의 일기 로그 쓰기
- [ ] 머문 시간
- [ ] 기록 푸시 설정 기능
- [ ] 광고 달기