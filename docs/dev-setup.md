# 개발 환경 설정

## 개발 시작

```bash
npm run dev        # granite 서버(8081) + Vite(5173) 동시 기동
                   # predev 스크립트가 8081/5173 포트 자동 Kill 후 실행
adb-toss           # 에뮬레이터 adb reverse 연결 (전역 별칭)
```

브라우저: http://localhost:5173
샌드박스 앱 Metro 서버 입력: `http://localhost:8081`

## adb-toss 별칭

`~/.bashrc`에 등록된 전역 별칭. AIT 앱 전반에서 사용 가능.

```bash
alias adb-toss='adb reverse tcp:8081 tcp:8081 && adb reverse tcp:5173 tcp:5173'
```

## 샌드박스 제약 사항

| 기능 | 샌드박스 |
|------|---------|
| 인앱 광고 | ❌ 불가 — 실제 토스앱 QR로만 확인 |
| 토스 로그인 | ✅ |
| 토스 페이 | ✅ |

## 광고

- 테스트 ID (리스트형): `ait-ad-test-banner-id`
- 테스트 ID (피드형): `ait-ad-test-native-image-id`
- 실제 ID: 사업자 등록 후 토스 AIT 콘솔에서 발급

## 주의사항

- `npm install` 시 항상 `--legacy-peer-deps` (React 19 vs TDS Mobile 충돌)
- `npm audit fix --force` 절대 금지
- TDS `IconButton`은 TDS 자체 아이콘(`icon-*-mono`)만 지원, lucide 아이콘 불가
