import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Clock, MapPin, MessageSquare } from 'lucide-react';
import { IconButton } from '@toss/tds-mobile';

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
        <h1 className="font-bold text-gray-800 text-base">로그 모아보기</h1>
      </div>

      {/* 기간 필터 */}
      <div className="px-5 pt-4 pb-3 border-b border-gray-50">
        <p className="text-[11px] text-gray-400 font-medium mb-2">기간 검색</p>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="flex-1 text-[13px] border border-gray-200 rounded-xl px-3 py-2.5 outline-none focus:border-gray-400 bg-gray-50"
          />
          <span className="text-gray-300">~</span>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="flex-1 text-[13px] border border-gray-200 rounded-xl px-3 py-2.5 outline-none focus:border-gray-400 bg-gray-50"
          />
        </div>
      </div>

      {/* 로그 목록 */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {filteredLogs.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-3">👣</p>
            <p className="text-sm text-gray-400">해당 기간에 발자국 기록이 없어요</p>
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
    <div className="rounded-2xl border border-gray-100 overflow-hidden">
      {/* 날짜 헤더 */}
      <button
        onClick={() => onDateSelect(new Date(dateStr + 'T00:00:00'))}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
      >
        <span className="text-[13px] font-bold text-gray-700">{formatDateLabel(dateStr)}</span>
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-gray-400">발자국 {footprints.length}개</span>
          <span className="text-gray-300 text-xs">›</span>
        </div>
      </button>

      {/* 발자국 목록 */}
      <div className="divide-y divide-gray-50">
        {footprints.map((fp) => (
          <FootprintRow key={fp.id} fp={fp} />
        ))}
      </div>
    </div>
  );
}

function FootprintRow({ fp }) {
  const firstComment = fp.comments?.[0];
  const preview = firstComment
    ? firstComment.text.slice(0, 25) + (firstComment.text.length > 25 ? '...' : '')
    : null;

  return (
    <div className="px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-gray-500">
          <Clock size={12} className="text-gray-400" />
          <span className="text-[13px] font-semibold">{fp.time}</span>
        </div>
        <div className="flex items-center gap-1 flex-1 min-w-0">
          <MapPin size={12} className="text-gray-400 shrink-0" />
          <span className="text-[12px] text-gray-500 truncate">{fp.address}</span>
        </div>
      </div>
      {preview && (
        <div className="flex items-start gap-1.5 mt-1.5 pl-0.5">
          <MessageSquare size={11} className="text-gray-300 mt-0.5 shrink-0" />
          <p className="text-[12px] text-gray-400 italic">{preview}</p>
        </div>
      )}
    </div>
  );
}
