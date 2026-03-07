import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';
import { IconButton } from '@toss/tds-mobile';

const TEAL       = '#2D8B78';
const TEAL_LIGHT = '#D4EDE7';
const TEAL_LINE  = '#B0DCCF';
const TEAL_DARK  = '#1A3D35';
const PAGE_BG    = '#EEF7F5';

const toDateKey = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

const loadAllLogs = () => {
  const logs = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key.startsWith('fp-') || key === 'fp-weather' || key.startsWith('fp-feedback-')) continue;
    const dateStr = key.slice(3);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) continue;
    try {
      const data = JSON.parse(localStorage.getItem(key));
      if (Array.isArray(data) && data.length > 0) {
        logs.push({ dateStr, footprints: data });
      }
    } catch {
      // 파싱 실패 무시
    }
  }
  return logs.sort((a, b) => b.dateStr.localeCompare(a.dateStr));
};

const formatDateLabel = (dateStr) => {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' });
};

const getDefaultFrom = () => {
  const d = new Date();
  d.setDate(d.getDate() - 30);
  return toDateKey(d);
};

const getDefaultTo = () => toDateKey(new Date());

export default function LogsPage({ onBack, onDateSelect }) {
  const [fromDate, setFromDate] = useState(getDefaultFrom);
  const [toDate, setToDate] = useState(getDefaultTo);

  const filteredLogs = useMemo(() => {
    const all = loadAllLogs();
    return all.filter(({ dateStr }) => dateStr >= fromDate && dateStr <= toDate);
  }, [fromDate, toDate]);

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed inset-0 z-50 flex flex-col"
      style={{ backgroundColor: PAGE_BG, paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {/* 헤더 */}
      <div className="flex items-center gap-2 px-4 pt-12 pb-4" style={{ backgroundColor: TEAL }}>
        <IconButton
          name="icon-arrow-left-small-mono"
          aria-label="뒤로"
          variant="clear"
          iconSize={20}
          onClick={onBack}
          style={{ color: 'white' }}
        />
        <h1 className="font-bold text-base" style={{ color: 'white' }}>로그 모아보기</h1>
      </div>

      {/* 기간 필터 */}
      <div className="px-4 pt-3 pb-4" style={{ backgroundColor: TEAL_LIGHT }}>
        <p className="text-[13px] font-bold mb-2" style={{ color: TEAL_DARK }}>기간 검색</p>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="flex-1 text-[13px] rounded-xl px-3 py-2.5 outline-none font-semibold bg-white"
            style={{ border: `1.5px solid ${TEAL}`, color: TEAL_DARK }}
          />
          <span className="font-bold" style={{ color: TEAL }}>~</span>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="flex-1 text-[13px] rounded-xl px-3 py-2.5 outline-none font-semibold bg-white"
            style={{ border: `1.5px solid ${TEAL}`, color: TEAL_DARK }}
          />
        </div>
      </div>

      {/* 로그 목록 */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {filteredLogs.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-3">👣</p>
            <p className="text-sm" style={{ color: '#6D9E93' }}>해당 기간에 발자국 기록이 없어요</p>
          </div>
        ) : (
          filteredLogs.map(({ dateStr, footprints }) => (
            <DateGroup
              key={dateStr}
              dateStr={dateStr}
              footprints={footprints}
              onDateSelect={(d) => { onDateSelect(d); onBack(); }}
            />
          ))
        )}
      </div>
    </motion.div>
  );
}

function DateGroup({ dateStr, footprints, onDateSelect }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden">
      {/* 날짜 헤더 */}
      <button
        onClick={() => onDateSelect(new Date(dateStr + 'T00:00:00'))}
        className="w-full flex items-center justify-between px-4 pt-4 pb-3 text-left"
      >
        <span className="text-[15px] font-bold" style={{ color: TEAL_DARK }}>{formatDateLabel(dateStr)}</span>
        <span
          className="text-[11px] font-semibold px-3 py-1 rounded-full"
          style={{ backgroundColor: TEAL, color: 'white' }}
        >
          🐾 {footprints.length}개
        </span>
      </button>

      {/* 발자국 목록 - 타임라인 */}
      <div className="mx-4 mb-4 pl-4" style={{ borderLeft: `2px solid ${TEAL_LINE}` }}>
        {footprints.map((fp) => (
          <FootprintRow key={fp.id} fp={fp} />
        ))}
      </div>
    </div>
  );
}

function FootprintRow({ fp }) {
  const memos = fp.comments ?? [];
  const visible = memos.slice(0, 2);
  const extra = memos.length - visible.length;

  return (
    <div className="relative py-2.5">
      {/* 타임라인 dot */}
      <div
        className="absolute rounded-full"
        style={{ width: 10, height: 10, backgroundColor: TEAL, left: -21, top: 10 }}
      />
      {/* 시간 · 주소 */}
      <div className="flex items-center gap-1.5 flex-1 min-w-0">
        <span className="text-[13px] font-semibold" style={{ color: '#1A1918' }}>{fp.time}</span>
        <span style={{ color: '#D1D0CD' }}>·</span>
        <span className="text-[13px] font-medium truncate" style={{ color: '#6D6C6A' }}>{fp.address}</span>
      </div>
      {/* 메모 (최대 2개) */}
      {visible.map((c, i) => (
        <div key={i} className="flex items-center gap-1.5 mt-1">
          <MessageSquare size={13} style={{ color: TEAL, flexShrink: 0 }} />
          <p className="text-[12px] font-medium" style={{ color: '#3D5C55' }}>
            {c.text.slice(0, 30)}{c.text.length > 30 ? '...' : ''}
          </p>
        </div>
      ))}
      {extra > 0 && (
        <p className="text-[11px] font-semibold mt-1 pl-5" style={{ color: TEAL }}>
          + {extra}개 더 보기
        </p>
      )}
    </div>
  );
}
