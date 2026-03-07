import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, MessageSquareHeart, ChevronRight, Footprints } from 'lucide-react';
import { IconButton } from '@toss/tds-mobile';

export default function Sidebar({ open, onClose, onNavigate }) {
  const handleNav = (page) => {
    onClose();
    onNavigate(page);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* 오버레이 */}
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* 사이드바 패널 */}
          <motion.div
            key="panel"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 left-0 z-50 h-full w-4/5 max-w-xs bg-white shadow-2xl flex flex-col"
          >
            {/* 헤더 */}
            <div className="flex items-center justify-between px-5 pt-14 pb-6 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Footprints size={20} className="text-[#FF5A42]" />
                <span className="font-bold text-gray-800 text-lg">발자국 일기</span>
              </div>
              <IconButton name="icon-x-mono" aria-label="닫기" variant="clear" iconSize={18} onClick={onClose} />
            </div>

            {/* 메뉴 */}
            <nav className="flex-1 px-3 py-4 space-y-1">
              <MenuItem
                icon={<BookOpen size={20} className="text-gray-600" />}
                label="로그 모아보기"
                description="날짜별 발자국 기록"
                onClick={() => handleNav('logs')}
              />
              <MenuItem
                icon={<MessageSquareHeart size={20} className="text-gray-600" />}
                label="의견 보내기"
                description="앱 개선에 도움을 주세요"
                onClick={() => handleNav('feedback')}
              />
            </nav>

            {/* 광고 배너 */}
            <div className="mx-4 mb-8 h-14 rounded-2xl bg-gray-100 border border-gray-200 flex items-center justify-center">
              <span className="text-xs text-gray-400 font-medium tracking-wider">AD</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function MenuItem({ icon, label, description, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl hover:bg-gray-50 active:bg-gray-100 transition-colors text-left"
    >
      <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800">{label}</p>
        <p className="text-[11px] text-gray-400 mt-0.5">{description}</p>
      </div>
      <ChevronRight size={16} className="text-gray-300 shrink-0" />
    </button>
  );
}
