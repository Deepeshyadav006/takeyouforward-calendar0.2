"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  getMonth,
  getDate,
  isToday,
} from "date-fns";
import { SEASONS, STICKERS, STICKER_PREFIX, NOTE_PREFIX, INDIAN_HOLIDAYS, type SeasonData } from "./constants";
import "./calendar.css";

function getSeason(date: Date): SeasonData {
  return SEASONS[getMonth(date)];
}

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [direction, setDirection] = useState(0);
  const [rangeStart, setRangeStart] = useState<Date | null>(null);
  const [rangeEnd, setRangeEnd] = useState<Date | null>(null);
  const [darkModeOverride, setDarkModeOverride] = useState<boolean | null>(null);
  const [selectedDate] = useState<Date | null>(null);
  const [showStickerPicker, setShowStickerPicker] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const [stickers, setStickers] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});

  const hour = new Date().getHours();
  const autoDarkMode = hour >= 19 || hour < 7;
  const isDarkMode = darkModeOverride !== null ? darkModeOverride : autoDarkMode;

  const season = useMemo(() => getSeason(currentDate), [currentDate]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const saved: Record<string, string> = {};
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(STICKER_PREFIX)) {
        saved[key.replace(STICKER_PREFIX, "")] = localStorage.getItem(key)!;
      }
    });
    setStickers(saved);

    const savedNotes: Record<string, string> = {};
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(NOTE_PREFIX)) {
        savedNotes[key.replace(NOTE_PREFIX, "")] = localStorage.getItem(key)!;
      }
    });
    setNotes(savedNotes);
  }, []);

  const days = useMemo(() => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    const startDate = startOfWeek(start);
    const endDate = endOfWeek(end);
    return eachDayOfInterval({ start: startDate, end: endDate });
  }, [currentDate]);

  const navigate = useCallback((delta: number) => {
    setDirection(delta);
    setCurrentDate(prev => delta > 0 ? addMonths(prev, 1) : subMonths(prev, 1));
  }, []);

  const goToToday = useCallback(() => {
    setDirection(0);
    setCurrentDate(new Date());
    setRangeStart(null);
    setRangeEnd(null);
  }, []);

  const handleDayClick = useCallback((date: Date) => {
    if (!rangeStart || (rangeStart && rangeEnd)) {
      setRangeStart(date);
      setRangeEnd(null);
    } else {
      if (date < rangeStart) {
        setRangeEnd(rangeStart);
        setRangeStart(date);
      } else {
        setRangeEnd(date);
      }
    }
    if (isToday(date)) {
      import("canvas-confetti").then((confetti) => {
        confetti.default({
          particleCount: 50,
          spread: 70,
          origin: { x: Math.random(), y: Math.random() * 0.5 },
          colors: [season.accent, "#FFD700", "#FF6B6B"],
        });
      });
    }
  }, [rangeStart, rangeEnd, season.accent]);

  const handleStickerSelect = useCallback((sticker: string) => {
    if (selectedDate) {
      const key = format(selectedDate, "yyyy-MM-dd");
      localStorage.setItem(STICKER_PREFIX + key, sticker);
      setStickers(prev => ({ ...prev, [key]: sticker }));
    }
  }, [selectedDate]);

  const handleStickerRemove = useCallback(() => {
    if (selectedDate) {
      const key = format(selectedDate, "yyyy-MM-dd");
      localStorage.removeItem(STICKER_PREFIX + key);
      setStickers(prev => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  }, [selectedDate]);

  const handleNoteSave = useCallback((note: string) => {
    if (rangeStart && rangeEnd) {
      const startKey = format(rangeStart, "yyyy-MM-dd");
      const endKey = format(rangeEnd, "yyyy-MM-dd");
      const storageKey = NOTE_PREFIX + startKey + "_" + endKey;
      localStorage.setItem(storageKey, note);
      setNotes(prev => ({ ...prev, [startKey + "_" + endKey]: note }));
    }
  }, [rangeStart, rangeEnd]);

  const getDateKey = useCallback(() => {
    if (rangeStart && rangeEnd) return format(rangeStart, "yyyy-MM-dd") + "_" + format(rangeEnd, "yyyy-MM-dd");
    return "";
  }, [rangeStart, rangeEnd]);

  const existingNote = useMemo(() => notes[getDateKey()] || "", [notes, getDateKey]);

  const daysRemaining = useMemo(() => {
    const endOfCurrentMonth = endOfMonth(currentDate);
    return Math.ceil((endOfCurrentMonth.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
  }, [currentDate]);

  const monthName = format(currentDate, "MMMM");
  const yearName = format(currentDate, "yyyy");

  const textColor = isDarkMode ? "#f5e6c8" : "#374151";

  return (
    <div className={`calendar-container ${isDarkMode ? "dark" : "light"}`}>
      <div className="calendar-card" style={{ backgroundColor: isDarkMode ? "#2a2118" : "#ffffff" }}>
        <div className="spiral-binding">
          {Array.from({ length: 22 }).map((_, i) => (
            <div key={i} className="spiral-hole"></div>
          ))}
        </div>

        <div className="nail-icon">
          <svg viewBox="0 0 24 32" fill="none">
            <ellipse cx="12" cy="6" rx="6" ry="4" fill="#8B7355" />
            <rect x="10" y="4" width="4" height="24" rx="1" fill="#6B5344" />
            <ellipse cx="12" cy="28" rx="4" ry="2" fill="#5B4334" />
          </svg>
        </div>

        <div className="hero-section">
          <img src={season.image} alt={season.name} className="hero-image" />
          <div className="hero-overlay" style={{ backgroundColor: `${season.accent}66` }}></div>
          <div className="sparkles">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="sparkle" style={{ left: `${10 + Math.random() * 80}%`, top: `${10 + Math.random() * 80}%`, animationDelay: `${Math.random() * 3}s` }}></div>
            ))}
          </div>
          <div className="season-badge" style={{ backgroundColor: season.accent }}>{season.nameHindi} · {season.name}</div>
          <div className="year-month-box" style={{ backgroundColor: season.accent }}>
            <div className="year">{yearName}</div>
            <div className="month">{monthName}</div>
          </div>
          {isDarkMode && <div className="moon-icon">🌙</div>}
        </div>

        <div className="nav-section">
          <button onClick={() => navigate(-1)} className="nav-btn" style={{ color: textColor }}>❮</button>
          <span className="month-title" style={{ color: textColor }}>{monthName} {yearName}</span>
          <button onClick={() => navigate(1)} className="nav-btn" style={{ color: textColor }}>❯</button>
        </div>

        <GridSection days={days} currentMonth={currentDate} season={season} rangeStart={rangeStart} rangeEnd={rangeEnd} direction={direction} stickers={stickers} isDarkMode={isDarkMode} isMobile={isMobile} onDayClick={handleDayClick} />

        <div className="footer-section">
          <button onClick={goToToday} className="today-btn" style={{ backgroundColor: season.accent }}>Today</button>
          <span className="days-left" style={{ color: isDarkMode ? "#a09080" : "#9ca3af" }}>{daysRemaining} days left</span>
          <button onClick={() => setDarkModeOverride(prev => prev === null ? !isDarkMode : null)} style={{ color: textColor }}>{isDarkMode ? "☀️" : "🌙"}</button>
        </div>

        <NotesSection season={season} dateKey={getDateKey()} existingNote={existingNote} isDarkMode={isDarkMode} onSave={handleNoteSave} />

        <div className="torn-edge" style={{ color: isDarkMode ? "#2a2118" : "#ffffff" }}>
          <svg viewBox="0 0 100 10" preserveAspectRatio="none">
            <path d="M0,10 L0,2 Q5,5 10,2 Q15,0 20,2 Q25,5 30,2 Q35,0 40,2 Q45,5 50,2 Q55,0 60,2 Q65,5 70,2 Q75,0 80,2 Q85,5 90,2 Q95,0 100,2 L100,10 Z" />
          </svg>
        </div>

        <AnimatePresence>
          {showStickerPicker && selectedDate && (
            <StickerPicker date={selectedDate} stickers={stickers} onSelect={handleStickerSelect} onRemove={handleStickerRemove} onClose={() => setShowStickerPicker(false)} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function GridSection({ days, currentMonth, season, rangeStart, rangeEnd, direction, stickers, isDarkMode, isMobile, onDayClick }: {
  days: Date[];
  currentMonth: Date;
  season: SeasonData;
  rangeStart: Date | null;
  rangeEnd: Date | null;
  direction: number;
  stickers: Record<string, string>;
  isDarkMode: boolean;
  isMobile: boolean;
  onDayClick: (date: Date) => void;
}) {
  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const textColor = isDarkMode ? "#f5e6c8" : "#374151";

  const isInRange = useCallback((date: Date): boolean => {
    if (!rangeStart || !rangeEnd) return false;
    return date > rangeStart && date < rangeEnd;
  }, [rangeStart, rangeEnd]);

  const getHoliday = useCallback((date: Date): string | null => {
    return INDIAN_HOLIDAYS[format(date, "yyyy-MM-dd")] || null;
  }, []);

  const getSticker = useCallback((date: Date): string | undefined => {
    return stickers[format(date, "yyyy-MM-dd")];
  }, [stickers]);

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir < 0 ? 300 : -300, opacity: 0 }),
  };

  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div key={format(currentMonth, "yyyy-MM")} custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.35, ease: "easeInOut" }} className="grid-section">
        {!isMobile && dayNames.map(day => (
          <div key={day} className="day-header" style={{ color: season.accent }}>{day}</div>
        ))}
        {days.map((date, i) => {
          const isCurrentMonth = isSameMonth(date, currentMonth);
          const isTodayDate = isToday(date);
          const dayOfWeek = date.getDay();
          const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
          const isRangeStart = rangeStart && isSameDay(date, rangeStart);
          const isRangeEnd = rangeEnd && isSameDay(date, rangeEnd);
          const inRange = isInRange(date);
          const holiday = getHoliday(date);
          const sticker = getSticker(date);

          const bgColor = isTodayDate || isRangeStart || isRangeEnd
            ? season.accent
            : inRange
            ? `${season.accent}26`
            : "transparent";

          const textColorItem = isTodayDate || isRangeStart || isRangeEnd
            ? "white"
            : isWeekend && isCurrentMonth
            ? season.accent
            : textColor;

          return (
            <div key={i} className={`day-cell ${!isCurrentMonth ? "other-month" : ""} ${isWeekend ? "weekend" : ""}`}>
              <div className={`day-circle ${isRangeStart ? "range-start" : ""} ${isRangeEnd ? "range-end" : ""} ${inRange ? "in-range" : ""}`} style={{ backgroundColor: bgColor }} onClick={() => onDayClick(date)}>
                <span style={{ color: textColorItem }}>{getDate(date)}</span>
                {isTodayDate && <div className="today-ring"></div>}
              </div>
              <div className="indicators">
                {holiday && <div className="holiday-dot" title={holiday}></div>}
                {sticker && <span className="sticker">{sticker}</span>}
              </div>
            </div>
          );
        })}
      </motion.div>
    </AnimatePresence>
  );
}

function NotesSection({ season, dateKey, existingNote, isDarkMode, onSave }: {
  season: SeasonData;
  dateKey: string;
  existingNote: string;
  isDarkMode: boolean;
  onSave: (note: string) => void;
}) {
  const [note, setNote] = useState(existingNote);
  const [saved, setSaved] = useState(false);

  useEffect(() => setNote(existingNote), [existingNote]);

  const handleSave = useCallback(() => {
    onSave(note);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [note, onSave]);

  const bgColor = isDarkMode ? "#3a3125" : "#fafafa";
  const lineColor = isDarkMode ? "#4a453a" : "#e5e5e5";
  const textColor = isDarkMode ? "#f5e6c8" : "#374151";

  return (
    <div className="notes-section" style={{ backgroundColor: bgColor }}>
      <div className="ruled-lines" style={{ backgroundImage: `repeating-linear-gradient(transparent, transparent 23px, ${lineColor} 23px, ${lineColor} 24px)` }}></div>
      <div className="notes-label" style={{ color: season.accent }}>Notes</div>
      <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Add your notes..." className="notes-textarea" style={{ fontFamily: "'Caveat', cursive", color: textColor }} maxLength={200}></textarea>
      <div className="char-count">{note.length}/200</div>
      {dateKey && <button onClick={handleSave} className="save-btn" style={{ backgroundColor: season.accent }}>Save</button>}
      {saved && <div className="saved-indicator">✓</div>}
    </div>
  );
}

function StickerPicker({ date, stickers, onSelect, onRemove, onClose }: {
  date: Date;
  stickers: Record<string, string>;
  onSelect: (sticker: string) => void;
  onRemove: () => void;
  onClose: () => void;
}) {
  const dateKey = format(date, "yyyy-MM-dd");
  const selected = stickers[dateKey];

  return (
    <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="sticker-picker">
      <div className="picker-header">
        <span>{format(date, "MMMM d, yyyy")}</span>
        <button onClick={onClose}>✕</button>
      </div>
      <div className="sticker-options">
        {STICKERS.map(sticker => (
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          <button key={sticker} onClick={() => { selected === sticker ? onRemove() : onSelect(sticker); onClose(); }} className={`sticker-btn ${selected === sticker ? "selected" : ""}`}>{sticker}</button>
        ))}
      </div>
    </motion.div>
  );
}