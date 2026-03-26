import React from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { IconButton } from '@toss/tds-mobile';

export default function SettingsPage({ onBack, detailAddress, onToggleDetailAddress }) {
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
        <h1 className="font-bold text-gray-800 text-base">설정</h1>
      </div>

      {/* 설정 목록 */}
      <div className="flex-1 overflow-y-auto">
        <SectionLabel label="주소" />
        <SettingToggle
          icon={<MapPin size={18} className="text-gray-600" />}
          label="상세 주소 표시"
          description="건물번호까지 표시 (예: 삼안로 12)"
          value={detailAddress}
          onChange={onToggleDetailAddress}
        />
      </div>
    </motion.div>
  );
}

function SectionLabel({ label }) {
  return (
    <p className="px-5 pt-6 pb-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
      {label}
    </p>
  );
}

function SettingToggle({ icon, label, description, value, onChange }) {
  return (
    <div className="flex items-center gap-4 px-5 py-4">
      <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800">{label}</p>
        <p className="text-[11px] text-gray-400 mt-0.5">{description}</p>
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`shrink-0 w-11 h-6 rounded-full transition-colors duration-200 relative ${value ? 'bg-[#2D8B78]' : 'bg-gray-200'}`}
        aria-label={label}
      >
        <span
          className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${value ? 'translate-x-[22px]' : 'translate-x-0.5'}`}
        />
      </button>
    </div>
  );
}
