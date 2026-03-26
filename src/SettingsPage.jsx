import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Plus } from 'lucide-react';
import { IconButton } from '@toss/tds-mobile';

export default function SettingsPage({ onBack, detailAddress, onToggleDetailAddress, aliases, onAliasAdd, onAliasDelete }) {
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [pendingLocation, setPendingLocation] = useState(null);
  const [aliasName, setAliasName] = useState('');

  const handleAddAlias = () => {
    if (isGettingLocation || pendingLocation) return;
    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsGettingLocation(false);
        setPendingLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude });
        setAliasName('');
      },
      () => setIsGettingLocation(false),
      { enableHighAccuracy: false, timeout: 5000, maximumAge: 30000 }
    );
  };

  const handleConfirmAlias = () => {
    if (!aliasName.trim() || !pendingLocation) return;
    onAliasAdd({ id: Date.now(), name: aliasName.trim(), lat: pendingLocation.lat, lon: pendingLocation.lon, radius: 150 });
    setPendingLocation(null);
    setAliasName('');
  };

  const handleCancelAlias = () => {
    setPendingLocation(null);
    setAliasName('');
  };

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

        <SectionLabel label="위치 별명" />

        <div className="px-5 pt-1 pb-3">
          <button
            onClick={handleAddAlias}
            disabled={isGettingLocation}
            className="flex items-center gap-1.5 text-sm text-[#2D8B78] font-semibold disabled:opacity-50"
          >
            <Plus size={15} />
            {isGettingLocation ? '위치 확인 중...' : '현재 위치 별명 추가'}
          </button>
        </div>

        {aliases.length === 0 ? (
          <p className="px-5 pb-3 text-xs text-gray-400">등록된 별명이 없어요</p>
        ) : (
          aliases.map(alias => (
            <div key={alias.id} className="flex items-center gap-4 px-5 py-3 border-b border-gray-50">
              <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
                <MapPin size={18} className="text-gray-600" />
              </div>
              <p className="flex-1 text-sm font-semibold text-gray-800">{alias.name}</p>
              <button
                onClick={() => onAliasDelete(alias.id)}
                className="text-xs text-gray-400 px-1 py-1"
              >
                삭제
              </button>
            </div>
          ))
        )}
      </div>

      {/* 이름 입력 오버레이 */}
      {pendingLocation && (
        <div className="absolute inset-0 bg-black/40 flex items-end z-10">
          <div className="bg-white w-full rounded-t-2xl px-6 pt-6 pb-8" style={{ paddingBottom: 'max(2rem, env(safe-area-inset-bottom))' }}>
            <h2 className="text-base font-bold text-gray-800 mb-1">위치 별명</h2>
            <p className="text-xs text-gray-400 mb-4">이 위치에 표시할 이름을 입력하세요</p>
            <input
              type="text"
              value={aliasName}
              onChange={e => setAliasName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleConfirmAlias()}
              placeholder="예: 집, 회사, 학교"
              autoFocus
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2D8B78] mb-4"
            />
            <div className="flex gap-2">
              <button
                onClick={handleCancelAlias}
                className="flex-1 py-3 rounded-xl border border-gray-200 text-sm text-gray-500"
              >
                취소
              </button>
              <button
                onClick={handleConfirmAlias}
                disabled={!aliasName.trim()}
                className="flex-1 py-3 rounded-xl bg-[#2D8B78] text-sm text-white font-semibold disabled:opacity-40"
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}
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
