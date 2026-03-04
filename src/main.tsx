import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { TDSMobileAITProvider } from '@toss/tds-mobile-ait'
import { TDSMobileProvider } from '@toss/tds-mobile'

// TDSMobileAITProvider는 granite(토스 앱) 환경에서만 동작함
// 일반 브라우저 개발 시에는 TDSMobileProvider(mock userAgent)로 대체
const isGraniteEnv = typeof window !== 'undefined' && '__granite__' in window

const browserUserAgent = {
  fontA11y: undefined,
  fontScale: 1,
  isAndroid: false,
  isIOS: false,
} as const

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isGraniteEnv ? (
      <TDSMobileAITProvider>
        <App />
      </TDSMobileAITProvider>
    ) : (
      <TDSMobileProvider userAgent={browserUserAgent}>
        <App />
      </TDSMobileProvider>
    )}
  </StrictMode>,
)
