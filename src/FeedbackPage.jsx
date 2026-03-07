import React from 'react';
import { motion } from 'framer-motion';
import { IconButton } from '@toss/tds-mobile';

// 구글폼 URL을 여기에 넣으세요
export const FEEDBACK_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSduWPGWpWN621lt9MmWYc1QFCXWQHU_5DB2SaXASdJrg05_nA/viewform?embedded=true";

const isPlaceholder = FEEDBACK_FORM_URL.includes('YOUR_FORM_ID');

export default function FeedbackPage({ onBack }) {
  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed inset-0 z-50 bg-white flex flex-col"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {/* 헤더 */}
      <div className="flex items-center gap-2 px-4 pt-12 pb-4 border-b border-gray-100">
        <IconButton
          name="icon-arrow-left-small-mono"
          aria-label="뒤로"
          variant="clear"
          iconSize={20}
          onClick={onBack}
        />
        <h1 className="font-bold text-gray-800 text-base">의견 보내기</h1>
      </div>

      {/* 컨텐츠 */}
      {isPlaceholder ? (
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-4">
          <p className="text-4xl">💌</p>
          <p className="text-sm font-semibold text-gray-700">구글폼 URL을 설정해 주세요</p>
          <p className="text-xs text-gray-400 leading-relaxed">
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-[11px]">src/FeedbackPage.jsx</code>의<br />
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-[11px]">FEEDBACK_FORM_URL</code>을 교체하면<br />
            여기에 폼이 표시돼요.
          </p>
        </div>
      ) : (
        <iframe
          src={FEEDBACK_FORM_URL}
          className="flex-1 w-full border-0"
          title="의견 보내기"
        />
      )}
    </motion.div>
  );
}
