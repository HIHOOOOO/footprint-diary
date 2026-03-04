import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CloudRain, Sun, Snowflake, Plus,
  MapPin, Clock, MessageCircle, Send, Flower
} from 'lucide-react';
import { Button, TextField, IconButton, ConfirmDialog, AlertDialog } from '@toss/tds-mobile';

// --- 유틸리티 ---
const MOCK_ADDRESSES = ["성수이로 123", "서울숲길 45", "뚝섬로 11", "왕십리로 88", "아차산로 5"];

const toDateKey = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

const loadFromStorage = (date) => {
  try {
    const raw = localStorage.getItem(`fp-${toDateKey(date)}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const saveToStorage = (date, footprints) => {
  try {
    localStorage.setItem(`fp-${toDateKey(date)}`, JSON.stringify(footprints));
  } catch {
    // 저장 실패 무시 (용량 초과 등)
  }
};

const getBgColor = (w) =>
  w === 'Rainy' ? '#cbd5e1'
  : w === 'Snowy' ? '#e2e8f0'
  : w === 'Sunny' ? '#ecfccb'
  : '#fff1f2';

const generateTime = () => {
  const now = new Date();
  return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
};

// --- 컴포넌트: 미니 달력 ---
const MiniCalendar = ({ selectedDate, onSelect, onClose }) => {
  const [viewDate, setViewDate] = useState(new Date(selectedDate));
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDay }, (_, i) => i);
  const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      className="absolute top-14 left-1/2 -translate-x-1/2 z-50 bg-white rounded-[2rem] shadow-2xl p-5 w-64 border border-gray-100 pointer-events-auto"
    >
      <div className="flex justify-between items-center mb-4 px-1">
        <IconButton name="icon-arrow-left-small-mono" aria-label="이전 달" variant="clear" iconSize={16} onClick={(e) => { e.stopPropagation(); setViewDate(new Date(year, month - 1, 1)); }} />
        <span className="font-bold text-gray-700 text-sm">{viewDate.toLocaleDateString('en-US', { month: 'long' })}</span>
        <IconButton name="icon-arrow-right-small-mono" aria-label="다음 달" variant="clear" iconSize={16} onClick={(e) => { e.stopPropagation(); setViewDate(new Date(year, month + 1, 1)); }} />
      </div>
      <div className="grid grid-cols-7 gap-1 text-center mb-1">
        {weekDays.map((d, i) => <span key={i} className="text-[10px] font-bold text-gray-300">{d}</span>)}
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {blanks.map(b => <div key={`b-${b}`} />)}
        {days.map(d => {
          const isSelected = selectedDate.getDate() === d && selectedDate.getMonth() === month && selectedDate.getFullYear() === year;
          return (
            <button
              key={d}
              onClick={() => { onSelect(new Date(year, month, d)); onClose(); }}
              className={`text-[11px] font-semibold w-7 h-7 flex items-center justify-center rounded-full transition-all
                ${isSelected ? 'bg-[#FF5A42] text-white shadow-md shadow-red-200' : 'text-gray-600 hover:bg-gray-50'}
              `}
            >
              {d}
            </button>
          );
        })}
      </div>
    </motion.div>
  );
};

export default function App() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  
  const [weather, setWeather] = useState(() => localStorage.getItem('fp-weather') ?? 'Rainy');
  const [date, setDate] = useState(() => new Date());
  const [footprints, setFootprints] = useState(() => loadFromStorage(new Date()) ?? []);
  const [selectedId, setSelectedId] = useState(null);
  const [isLocating, setIsLocating] = useState(false); 
  const [showCalendar, setShowCalendar] = useState(false);
  
  const [popupPos, setPopupPos] = useState({ x: 0, y: 0 });
  const [newComment, setNewComment] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [showGpsConsent, setShowGpsConsent] = useState(false);
  const [showGpsRequired, setShowGpsRequired] = useState(false);
  const pendingLocate = useRef(null);

  const particlesRef = useRef([]);
  const footprintsRef = useRef([]);
  const scrollYRef = useRef(0);
  const targetScrollYRef = useRef(0);
  const requestRef = useRef();
  const touchStartYRef = useRef(0);
  const lastPopupPosRef = useRef({ x: 0, y: 0 });
  const geocodeCache = useRef({});
  const selectedIdRef = useRef(selectedId);
  useEffect(() => { selectedIdRef.current = selectedId; }, [selectedId]);

  const getEmptyStateContent = () => {
    switch(weather) {
      case 'Sunny': return { text: "초원 위의 첫 발자국을 남겨보세요", emoji: "🌿" };
      case 'Rainy': return { text: "빗속의 첫 발자국을 남겨보세요", emoji: "☔" };
      case 'Snowy': return { text: "눈 위의 첫 발자국을 남겨보세요", emoji: "⛄" };
      case 'CherryBlossom': return { text: "봄날의 첫 발자국을 남겨보세요", emoji: "🌸" };
      default: return { text: "첫 발자국을 남겨보세요", emoji: "👣" };
    }
  };

  // footprints 변경 시 localStorage에 저장
  useEffect(() => {
    saveToStorage(date, footprints);
  }, [footprints, date]);

  useEffect(() => {
    localStorage.setItem('fp-weather', weather);
    particlesRef.current = [];
  }, [weather]);
  
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = container.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.scale(dpr, dpr);
  }, []);

  useEffect(() => {
    resizeCanvas();
    const resizeObserver = new ResizeObserver(() => resizeCanvas());
    if (containerRef.current) resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [resizeCanvas]);

  useEffect(() => {
    footprintsRef.current = footprints;
  }, [footprints]);

  const drawFootprintShape = (ctx, x, y, rotation, type, weather, isSelected) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation + Math.PI); 
    if (type === 'right') ctx.scale(-1, 1);
    ctx.shadowColor = "rgba(0,0,0,0.15)";
    ctx.shadowBlur = 6;
    ctx.shadowOffsetY = -2;
    ctx.scale(1.2, 1.2);

    // 공통 부츠 베이스 그리기
    const drawBootBase = (color) => {
      ctx.fillStyle = color;
      ctx.beginPath(); ctx.ellipse(0, -10, 10, 18, 0, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(0, 15, 9, 12, 0, 0, Math.PI * 2); ctx.fill();
    };

    if (weather === 'Rainy') {
      ctx.fillStyle = isSelected ? "#1e293b" : "#334155"; 
      ctx.beginPath(); ctx.moveTo(0, -25); ctx.bezierCurveTo(-12, -25, -12, 10, -10, 20); 
      ctx.bezierCurveTo(-5, 30, 5, 30, 10, 20); ctx.bezierCurveTo(12, 10, 12, -25, 0, -25); ctx.fill();
    } else if (weather === 'Sunny') {
      // 요구사항 2: 초원 배경은 진한 초록색 발자국
      const greenColor = isSelected ? "#064e3b" : "#14532d"; 
      drawBootBase(greenColor);
      // 초원 디테일 (작은 풀잎)
      ctx.fillStyle = "#65a30d"; ctx.beginPath(); ctx.arc(-6, -15, 1.5, 0, Math.PI * 2); ctx.fill();
    } else if (weather === 'CherryBlossom') {
      drawBootBase(isSelected ? "#502020" : "#8a4b4b");
      ctx.fillStyle = "#fbcfe8"; ctx.beginPath(); ctx.arc(5, -12, 2.5, 0, Math.PI * 2); ctx.fill();
    } else if (weather === 'Snowy') {
      // 요구사항 1: 눈 발자국 가로줄 자국 추가
      drawBootBase(isSelected ? "#0f172a" : "#1e293b");
      
      ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      // 부츠 밑창 패턴 (가로줄)
      ctx.moveTo(-7, -16); ctx.lineTo(7, -16);
      ctx.moveTo(-8, -10); ctx.lineTo(8, -10);
      ctx.moveTo(-8, -4); ctx.lineTo(8, -4);
      ctx.moveTo(-7, 2); ctx.lineTo(7, 2);
      // 뒤꿈치 패턴
      ctx.moveTo(-6, 12); ctx.lineTo(6, 12);
      ctx.moveTo(-6, 18); ctx.lineTo(6, 18);
      ctx.stroke();
    }
    
    if (isSelected) {
      ctx.strokeStyle = weather === 'Sunny' ? "#65a30d" : weather === 'CherryBlossom' ? "#f472b6" : "#3b82f6"; 
      ctx.lineWidth = 2; ctx.strokeRect(-15, -30, 30, 60); 
    }
    ctx.restore();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const render = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;
      ctx.clearRect(0, 0, width, height);
      
      if (weather === 'Rainy') ctx.fillStyle = '#cbd5e1'; 
      else if (weather === 'Snowy') ctx.fillStyle = '#e2e8f0'; 
      else if (weather === 'Sunny') ctx.fillStyle = '#ecfccb'; 
      else ctx.fillStyle = '#fff1f2'; 
      ctx.fillRect(0, 0, width, height);

      scrollYRef.current += (targetScrollYRef.current - scrollYRef.current) * 0.1;
      const scrollY = scrollYRef.current;
      const cameraFocusY = height * 0.3;

      footprintsRef.current.forEach(fp => {
        const screenY = fp.y - scrollY + cameraFocusY;
        if (screenY < -100 || screenY > height + 100) return;
        drawFootprintShape(ctx, fp.x + width / 2, screenY, fp.rotation, fp.type, weather, fp.id === selectedIdRef.current);
        if (fp.id === selectedIdRef.current) {
          const nx = fp.x + width / 2, ny = screenY;
          if (Math.abs(nx - lastPopupPosRef.current.x) > 1 || Math.abs(ny - lastPopupPosRef.current.y) > 1) {
            lastPopupPosRef.current = { x: nx, y: ny };
            setPopupPos({ x: nx, y: ny });
          }
        }
      });

      const particleLimit = weather === 'Rainy' ? 45 : 100;
      if (particlesRef.current.length < particleLimit) {
        particlesRef.current.push({
          x: Math.random() * width,
          y: Math.random() * height,
          speed: weather === 'Rainy' ? 6 + Math.random() * 3 : weather === 'Snowy' ? 0.8 + Math.random() : 0.5,
          radius: weather === 'Snowy' ? 1.5 + Math.random() * 2.5 : 1,
          length: weather === 'Rainy' ? 8 + Math.random() * 4 : 10,
          opacity: weather === 'Rainy' ? 0.4 + Math.random() * 0.2 : Math.random() * 0.5 + 0.4, 
          waveOffset: Math.random() * Math.PI * 2
        });
      }

      particlesRef.current.forEach((p) => {
        p.y += p.speed;
        if (weather !== 'Rainy') {
            p.x += Math.sin(p.y * 0.02 + p.waveOffset) * (weather === 'Snowy' ? 1.2 : 0.6);
        }
        if (p.y > height + 30) { p.y = -30; p.x = Math.random() * width; }
        
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.globalAlpha = p.opacity;

        if (weather === 'Rainy') {
          ctx.strokeStyle = '#1e3a8a'; 
          ctx.lineWidth = 1; 
          ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, p.length); ctx.stroke();
        } else if (weather === 'Snowy') {
          ctx.fillStyle = 'white'; ctx.shadowColor = 'white'; ctx.shadowBlur = 4;
          ctx.beginPath(); ctx.arc(0, 0, p.radius, 0, Math.PI * 2); ctx.fill();
        } else if (weather === 'Sunny') {
          ctx.fillStyle = 'rgba(163, 230, 53, 0.6)'; ctx.beginPath(); ctx.ellipse(0, 0, 1.5, 4, 0, 0, Math.PI * 2); ctx.fill();
        } else if (weather === 'CherryBlossom') {
          ctx.fillStyle = '#fbcfe8'; ctx.beginPath(); ctx.moveTo(0, 0);
          ctx.bezierCurveTo(-3, -4, -6, -1, 0, 5); ctx.bezierCurveTo(6, -1, 3, -4, 0, 0); ctx.fill();
        }
        ctx.restore();
      });
      requestRef.current = requestAnimationFrame(render);
    };
    render();
    return () => cancelAnimationFrame(requestRef.current);
  }, [weather]);

  const reverseGeocode = async (lat, lon) => {
    const key = `${lat.toFixed(3)},${lon.toFixed(3)}`;
    if (geocodeCache.current[key]) return geocodeCache.current[key];
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=ko`,
        { headers: { 'Accept-Language': 'ko' } }
      );
      if (!res.ok) throw new Error('geocode failed');
      const data = await res.json();
      const a = data.address;
      // 도로명 > 동네 > 시/군 순으로 의미있는 주소 조합
      const road = a.road || a.pedestrian || a.suburb || a.neighbourhood || '';
      const district = a.city_district || a.borough || a.town || a.village || '';
      const result = road ? `${district ? district + ' ' : ''}${road}` : (a.city || a.county || '알 수 없는 위치');
      geocodeCache.current[key] = result;
      return result;
    } catch {
      return MOCK_ADDRESSES[Math.floor(Math.random() * MOCK_ADDRESSES.length)];
    }
  };

  const doAddFootprint = (useGps) => {
    setIsLocating(true);

    const appendFootprint = (address) => {
      const id = Date.now();
      const idx = footprintsRef.current.length;
      const yPos = idx * 120;
      const xOffset = Math.sin(idx * 0.5) * 60;
      const angle = Math.cos(idx * 0.5) * 0.5;
      setFootprints(prev => [
        ...prev,
        { id, x: xOffset, y: yPos, rotation: angle, type: idx % 2 === 0 ? 'left' : 'right', time: generateTime(), address, comments: [] },
      ]);
      targetScrollYRef.current = yPos;
      setIsLocating(false);
    };

    if (!useGps || !navigator.geolocation) {
      appendFootprint(MOCK_ADDRESSES[Math.floor(Math.random() * MOCK_ADDRESSES.length)]);
      return;
    }

    const getCurrentPosition = () =>
      new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: false,
          timeout: 5000,
          maximumAge: 30000,
        })
      );

    getCurrentPosition()
      .then(pos => reverseGeocode(pos.coords.latitude, pos.coords.longitude))
      .then(address => appendFootprint(address))
      .catch(() => appendFootprint(MOCK_ADDRESSES[Math.floor(Math.random() * MOCK_ADDRESSES.length)]));
  };

  const addFootprint = () => {
    if (isLocating) return;
    const consent = localStorage.getItem('gps-consent');
    if (consent === null) {
      pendingLocate.current = (granted) => doAddFootprint(granted);
      setShowGpsConsent(true);
      return;
    }
    doAddFootprint(consent === 'true');
  };

  const handleCanvasClick = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const scrollY = scrollYRef.current;
    const cameraFocusY = rect.height * 0.3; 
    let clickedId = null;
    for (let i = footprints.length - 1; i >= 0; i--) {
      const fp = footprints[i];
      const screenY = fp.y - scrollY + cameraFocusY;
      if (Math.sqrt((e.clientX - rect.left - centerX - fp.x)**2 + (e.clientY - rect.top - screenY)**2) < 45) { 
        clickedId = fp.id;
        setPopupPos({ x: fp.x + centerX, y: screenY });
        setShowComments(false);
        break;
      }
    }
    setSelectedId(prev => prev === clickedId ? null : clickedId);
  };

  const addComment = () => {
    if (!newComment.trim() || !selectedId) return;
    setFootprints(prev => prev.map(fp => fp.id === selectedId ? { ...fp, comments: [...fp.comments, { id: Date.now(), text: newComment, time: generateTime() }] } : fp));
    setNewComment("");
  };

  const emptyContent = getEmptyStateContent();

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden font-sans select-none" style={{ height: '100dvh', backgroundColor: getBgColor(weather) }} onWheel={(e) => { targetScrollYRef.current = Math.max(0, targetScrollYRef.current + e.deltaY); }}>
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        onTouchStart={(e) => { touchStartYRef.current = e.touches[0].clientY; }}
        onTouchMove={(e) => {
          const delta = touchStartYRef.current - e.touches[0].clientY;
          targetScrollYRef.current = Math.max(0, targetScrollYRef.current + delta);
          touchStartYRef.current = e.touches[0].clientY;
        }}
        className="block w-full h-full cursor-pointer touch-none"
      />

      {footprints.length === 0 && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none opacity-60 z-10 w-full">
           <div className="text-5xl mb-4 text-slate-500 font-light rotate-12">{emptyContent.emoji}</div>
           <p className="text-slate-600 font-bold bg-white/60 px-6 py-3 rounded-2xl backdrop-blur-md shadow-sm inline-block">{emptyContent.text}</p>
        </div>
      )}

      <header className="fixed top-0 w-full z-20 flex justify-center pt-4 pointer-events-none">
        <div className="bg-white/90 backdrop-blur shadow-sm rounded-full px-5 py-2.5 flex items-center gap-4 pointer-events-auto border border-gray-100 relative">
          <IconButton name="icon-arrow-left-small-mono" aria-label="이전 날짜" variant="clear" iconSize={20} onClick={() => { const d = new Date(date); d.setDate(d.getDate() - 1); setDate(d); setFootprints(loadFromStorage(d) ?? []); setSelectedId(null); }} />
          <button onClick={() => setShowCalendar(!showCalendar)} className="font-bold text-gray-800 text-sm min-w-[100px] hover:text-[#FF5A42] transition-colors">
            {date.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' })}
          </button>
          <IconButton name="icon-arrow-right-small-mono" aria-label="다음 날짜" variant="clear" iconSize={20} onClick={() => { const d = new Date(date); d.setDate(d.getDate() + 1); setDate(d); setFootprints(loadFromStorage(d) ?? []); setSelectedId(null); }} />
          <AnimatePresence>{showCalendar && <MiniCalendar selectedDate={date} onSelect={(d) => { setDate(d); setFootprints(loadFromStorage(d) ?? []); setSelectedId(null); }} onClose={() => setShowCalendar(false)} />}</AnimatePresence>
        </div>
      </header>

      <div className="fixed top-24 right-4 z-20 flex flex-col gap-3 bg-white/70 p-2.5 rounded-2xl backdrop-blur-md shadow-sm border border-gray-100">
        <button onClick={() => setWeather('CherryBlossom')} className={`p-2.5 rounded-xl transition-all ${weather === 'CherryBlossom' ? 'bg-pink-100 text-pink-600 shadow-inner' : 'text-gray-400'}`}><Flower size={20}/></button>
        <button onClick={() => setWeather('Sunny')} className={`p-2.5 rounded-xl transition-all ${weather === 'Sunny' ? 'bg-lime-200 text-lime-800 shadow-inner' : 'text-gray-400'}`}><Sun size={20}/></button>
        <button onClick={() => setWeather('Rainy')} className={`p-2.5 rounded-xl transition-all ${weather === 'Rainy' ? 'bg-slate-300 text-slate-800 shadow-inner' : 'text-gray-400'}`}><CloudRain size={20}/></button>
        <button onClick={() => setWeather('Snowy')} className={`p-2.5 rounded-xl transition-all ${weather === 'Snowy' ? 'bg-blue-100 text-blue-600 shadow-inner' : 'text-gray-400'}`}><Snowflake size={20}/></button>
      </div>

      <AnimatePresence>
        {selectedId && footprints.find(f => f.id === selectedId) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: -20 }} animate={{ opacity: 1, scale: 1, x: 0 }} exit={{ opacity: 0, scale: 0.8, x: -20 }}
            className="absolute z-30 w-[240px] bg-white rounded-[2rem] shadow-2xl border border-gray-100 p-5"
            style={{
              left: `${Math.min(popupPos.x + 30, window.innerWidth - 260)}px`,
              top: `${Math.max(72, Math.min(popupPos.y - 60, window.innerHeight - 220))}px`,
            }}
          >
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2"><Clock size={16} className="text-gray-400" /><span className="font-bold text-gray-800 text-lg">{footprints.find(f => f.id === selectedId).time}</span></div>
              <button onClick={() => setShowComments(!showComments)} className={`p-2 rounded-full transition-all ${showComments ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:bg-gray-50'}`}><MessageCircle size={18}/></button>
            </div>
            <p className="text-gray-500 text-[11px] mb-3 flex items-center gap-1 font-medium"><MapPin size={12} /> {footprints.find(f => f.id === selectedId).address}</p>
            <div className={`overflow-hidden transition-all duration-200 ease-in-out ${showComments ? 'max-h-48 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                  <div className="bg-gray-50/50 rounded-2xl p-2 border border-gray-100">
                    <div className="max-h-24 overflow-y-auto mb-2 space-y-1.5 px-1 scrollbar-hide text-[10px]">
                      {footprints.find(f => f.id === selectedId)?.comments.map(c => <div key={c.id} className="bg-white p-2 rounded-xl shadow-sm border border-gray-100"><p className="text-gray-700">{c.text}</p></div>)}
                    </div>
                    <div className="flex gap-2 px-1 items-center">
                      <input
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addComment()}
                        placeholder="메모..."
                        className="flex-1 min-w-0 bg-white border border-gray-200 rounded-xl px-3 py-1.5 outline-none focus:border-blue-300"
                        style={{ fontSize: '12px' }}
                      />
                      <button
                        onClick={addComment}
                        className="shrink-0 rounded-full p-1.5 flex items-center justify-center"
                        style={{ backgroundColor: '#1e293b', color: 'white' }}
                      >
                        <Send size={12} />
                      </button>
                    </div>
                  </div>
                </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 z-30" style={{ paddingBottom: 'max(40px, env(safe-area-inset-bottom))' }}>
        <Button
          whileTap={{ scale: 0.9 }}
          onClick={addFootprint}
          loading={isLocating}
          disabled={isLocating}
          className={`w-16 h-16 rounded-full shadow-2xl border-4 border-white/20 ${isLocating ? 'bg-gray-400' : weather === 'Sunny' ? 'bg-lime-600' : weather === 'Rainy' ? 'bg-slate-700' : weather === 'Snowy' ? 'bg-blue-400' : 'bg-pink-500'}`}
          style={{ minWidth: 0 }}
        >
          <Plus size={32} />
        </Button>
      </div>

      <AlertDialog
        open={showGpsRequired}
        onClose={() => setShowGpsRequired(false)}
        title="위치 권한이 필요해요"
        description="발자국 기록에는 현재 위치 접근 권한이 필요해요. 발자국을 남기려면 위치 권한을 허용해 주세요."
        alertButton={<Button onClick={() => setShowGpsRequired(false)}>확인</Button>}
      />

      <ConfirmDialog
        open={showGpsConsent}
        title="위치 권한 안내"
        description="발자국을 남기려면 현재 위치 접근 권한이 필요해요. 위치 정보는 서버에 전송되지 않고 내 기기에만 저장돼요."
        cancelButton={
          <Button onClick={() => { setShowGpsConsent(false); setShowGpsRequired(true); }}>
            허용 안 할게요
          </Button>
        }
        confirmButton={
          <Button onClick={() => { localStorage.setItem('gps-consent', 'true'); setShowGpsConsent(false); pendingLocate.current?.(true); }}>
            허용할게요
          </Button>
        }
      />
    </div>
  );
}