'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isWithinInterval,
  addMonths,
  subMonths,
  isToday,
  getMonth,
} from 'date-fns'
import { getSeason, Season } from '@/hooks/useSeason'

const getSeasonFromMonth = (date: Date): Season => {
  return getSeason(getMonth(date) + 1)
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const SPRING_COLORS = {
  bgPage: '#f0faf0',
  bgCard: '#ffffff',
  accent: '#3B6D11',
  accentLight: '#EAF3DE',
  accentText: '#166534',
  border: '#e5e7eb',
  text: '#1f2937',
  textMuted: '#6b7280',
}

export default function Calendar() {
  const [displayDate, setDisplayDate] = useState(new Date())
  const [selectedRange, setSelectedRange] = useState<{ start: Date | null; end: Date | null }>({ start: null, end: null })
  const [notes, setNotes] = useState<Record<string, string>>({})
  const [currentNote, setCurrentNote] = useState('')
  const [isTransitioning, setIsTransitioning] = useState(false)

  const season = useMemo(() => getSeasonFromMonth(displayDate), [displayDate])

  const rangesWithNotes = useMemo(() => {
    return Object.keys(notes).map(key => {
      const [start, end] = key.replace('note_', '').split('_')
      return { start: new Date(start + 'T00:00:00'), end: new Date(end + 'T00:00:00') }
    })
  }, [notes])

  useEffect(() => {
    const stored = localStorage.getItem('calendar-notes')
    if (stored) {
      const parsed = JSON.parse(stored)
      setNotes(parsed)
    }
  }, [])

  useEffect(() => {
    if (Object.keys(notes).length > 0) {
      localStorage.setItem('calendar-notes', JSON.stringify(notes))
    }
  }, [notes])

  const days = useMemo(() => {
    const monthStart = startOfMonth(displayDate)
    const monthEnd = endOfMonth(displayDate)
    const calStart = startOfWeek(monthStart)
    const calEnd = endOfWeek(monthEnd)

    return eachDayOfInterval({ start: calStart, end: calEnd }).map(date => {
      const hasNote = notes[`note_${format(date, 'yyyy-MM-dd')}_${format(date, 'yyyy-MM-dd')}`]?.length > 0
      const hasNoteOnRange = rangesWithNotes.some(
        range => isWithinInterval(date, { start: range.start, end: range.end }) && isSameDay(date, range.start)
      )
      return {
        date,
        isCurrentMonth: isSameMonth(date, displayDate),
        hasNote: hasNote || hasNoteOnRange,
        hasNoteOnRange,
      }
    })
  }, [displayDate, notes, rangesWithNotes])

  const getDayState = useCallback((date: Date): 'default' | 'today' | 'start' | 'end' | 'in-range' => {
    if (isToday(date)) return 'today'
    if (!selectedRange.start) return 'default'
    if (!selectedRange.end) return isSameDay(date, selectedRange.start) ? 'start' : 'default'
    if (isSameDay(date, selectedRange.start)) return 'start'
    if (isSameDay(date, selectedRange.end)) return 'end'
    if (isWithinInterval(date, { start: selectedRange.start, end: selectedRange.end })) return 'in-range'
    return 'default'
  }, [selectedRange])

  const handleDayClick = useCallback((date: Date) => {
    if (!selectedRange.start || (selectedRange.start && selectedRange.end)) {
      setSelectedRange({ start: date, end: null })
    } else {
      if (date < selectedRange.start) {
        setSelectedRange({ start: date, end: selectedRange.start })
      } else {
        setSelectedRange({ start: selectedRange.start, end: date })
      }
    }
  }, [selectedRange])

  const handlePrevMonth = useCallback(() => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setDisplayDate(subMonths(displayDate, 1))
  }, [displayDate, isTransitioning])

  const handleNextMonth = useCallback(() => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setDisplayDate(addMonths(displayDate, 1))
  }, [displayDate, isTransitioning])

  const saveNote = useCallback(() => {
    if (!currentNote.trim() || !selectedRange.start || !selectedRange.end) return
    const key = `note_${format(selectedRange.start, 'yyyy-MM-dd')}_${format(selectedRange.end, 'yyyy-MM-dd')}`
    setNotes(prev => ({ ...prev, [key]: currentNote }))
    setCurrentNote('')
  }, [currentNote, selectedRange])

  const rangeKey = selectedRange.start && selectedRange.end
    ? `note_${format(selectedRange.start, 'yyyy-MM-dd')}_${format(selectedRange.end, 'yyyy-MM-dd')}`
    : null
  const savedNote = rangeKey ? notes[rangeKey] : undefined

  useEffect(() => {
    const timer = setTimeout(() => setIsTransitioning(false), 50)
    return () => clearTimeout(timer)
  }, [displayDate])

  return (
    <div
      data-season={season.name}
      className="w-screen h-screen overflow-hidden"
      style={{ backgroundColor: SPRING_COLORS.bgPage }}
    >
      <div className="w-full h-full flex flex-col lg:flex-row">
        <motion.aside
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full lg:w-80 xl:w-[320px] lg:min-w-[320px] h-full flex flex-col"
        >
          <div className="relative h-[180px] lg:h-1/2 xl:h-[320px] overflow-hidden rounded-t-2xl">
            <div 
              className="absolute inset-0 bg-gradient-to-br"
              style={{ 
                background: `linear-gradient(135deg, ${SPRING_COLORS.accentLight} 0%, ${SPRING_COLORS.accent}20 50%, ${SPRING_COLORS.accent}40 100%)` 
              }} 
            />
            <img
              src="https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&q=80"
              alt="Spring botanical"
              className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50"
            />
            <div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-black/60 via-black/30 to-transparent rounded-t-2xl">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl lg:text-4xl xl:text-5xl font-bold text-white tracking-tight"
              >
                Vasant
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-white/80 text-lg mt-1"
              >
                Spring · Flowers & Holi season
              </motion.p>
            </div>
          </div>

          <div 
            className="flex-1 p-4 lg:p-6 overflow-hidden rounded-b-2xl"
            style={{ backgroundColor: SPRING_COLORS.bgCard }}
          >
            <div className="text-xs font-medium uppercase tracking-wider opacity-60 mb-3" style={{ color: SPRING_COLORS.accentText }}>
              Mini Calendar
            </div>
            <div className="grid grid-cols-7 gap-1 text-center">
              {WEEKDAYS.map((day) => (
                <div 
                  key={day} 
                  className="text-[10px] lg:text-xs font-medium opacity-70"
                  style={{ color: SPRING_COLORS.accentText }}
                >
                  {day}
                </div>
              ))}
              {days.slice(0, 35).map(({ date, isCurrentMonth, hasNote }, idx) => {
                const state = getDayState(date)
                const isCurrentDay = isSameDay(date, displayDate)
                return (
                  <div
                    key={idx}
                    className="relative aspect-square flex items-center justify-center text-xs lg:text-sm rounded-lg transition-all"
                    style={{
                      backgroundColor: isCurrentDay || hasNote ? SPRING_COLORS.accent : 'transparent',
                      color: isCurrentDay || hasNote ? '#ffffff' : SPRING_COLORS.textMuted,
                      opacity: isCurrentMonth ? 1 : 0.25,
                      fontWeight: isCurrentDay ? 600 : 400,
                      borderRadius: '0.5rem',
                    }}
                  >
                    {format(date, 'd')}
                  </div>
                )
              })}
            </div>
          </div>
        </motion.aside>

        <main className="flex-1 flex flex-col overflow-hidden">
          <motion.header
            layout
            className="sticky top-0 z-10 flex items-center justify-between px-4 lg:px-6 py-3 lg:py-4 bg-white/90 backdrop-blur-sm border-b border-gray-200"
          >
            <button
              onClick={handlePrevMonth}
              className="p-2 lg:p-3 rounded-full hover:scale-105 transition-transform active:scale-95"
              style={{ backgroundColor: SPRING_COLORS.accentLight, color: SPRING_COLORS.accentText }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h2 className="text-lg lg:text-xl font-semibold" style={{ color: SPRING_COLORS.accentText }}>
              {format(displayDate, 'MMMM yyyy')}
            </h2>
            <button
              onClick={handleNextMonth}
              className="p-2 lg:p-3 rounded-full hover:scale-105 transition-transform active:scale-95"
              style={{ backgroundColor: SPRING_COLORS.accentLight, color: SPRING_COLORS.accentText }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </motion.header>

          <div className="flex-1 overflow-auto p-4 lg:p-6">
            <motion.div
              className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm"
              style={{ 
                border: `1px solid ${SPRING_COLORS.border}`,
                borderRadius: '1rem',
              }}
            >
              <div 
                className="grid grid-cols-7 gap-1 lg:gap-2 mb-2 lg:mb-4"
                style={{ willChange: 'transform' }}
              >
                {WEEKDAYS.map(day => (
                  <div 
                    key={day} 
                    className="text-center text-xs lg:text-sm font-semibold py-2 lg:py-3 uppercase tracking-wider rounded-lg"
                    style={{ 
                      backgroundColor: SPRING_COLORS.accentLight, 
                      color: SPRING_COLORS.accentText,
                      borderRadius: '0.5rem',
                    }}
                  >
                    {day}
                  </div>
                ))}
              </div>

              <motion.div
                layout
                className="grid grid-cols-7 gap-1 lg:gap-2"
                style={{ willChange: 'transform' }}
              >
                {days.map(({ date, isCurrentMonth, hasNote }, idx) => {
                  const state = getDayState(date)
                  return (
                    <motion.button
                      key={idx}
                      layoutId={`day-${format(date, 'yyyy-MM-dd')}`}
                      onClick={() => handleDayClick(date)}
                      className="relative min-h-[44px] lg:min-h-[64px] flex flex-col items-center justify-center rounded-xl lg:rounded-2xl transition-all duration-200 hover:scale-105 active:scale-95"
                      style={{
                        backgroundColor: state === 'today' 
                          ? SPRING_COLORS.accent 
                          : state === 'start' || state === 'end'
                            ? SPRING_COLORS.accent
                            : state === 'in-range'
                              ? SPRING_COLORS.accentLight
                              : 'transparent',
                        color: state === 'today' || state === 'start' || state === 'end' 
                          ? '#ffffff' 
                          : isCurrentMonth ? SPRING_COLORS.text : SPRING_COLORS.textMuted,
                        opacity: isCurrentMonth ? 1 : 0.3,
                        borderRadius: state === 'in-range' ? 0 : undefined,
                        border: state === 'in-range' ? 'none' : undefined,
                      }}
                    >
                      <span className="text-sm lg:text-base font-medium">
                        {format(date, 'd')}
                      </span>
                      {hasNote && isCurrentMonth && (
                        <span 
                          className="absolute bottom-1.5 lg:bottom-2 w-1.5 h-1.5 rounded-full" 
                          style={{ 
                            backgroundColor: state === 'default' ? SPRING_COLORS.accent : '#ffffff' 
                          }} 
                        />
                      )}
                    </motion.button>
                  )
                })}
              </motion.div>
            </motion.div>

            <motion.div
              layout
              className="mt-4 lg:mt-6 bg-white rounded-2xl p-4 lg:p-6 shadow-sm"
              style={{ 
                border: `1px solid ${SPRING_COLORS.border}`,
                borderRadius: '1rem',
              }}
            >
              <h3 
                className="text-base lg:text-lg font-semibold mb-3 lg:mb-4"
                style={{ color: SPRING_COLORS.accentText }}
              >
                Notes
              </h3>
              {selectedRange.start && selectedRange.end ? (
                <>
                  <p className="text-sm text-gray-500 mb-3 lg:mb-4">
                    {format(selectedRange.start, 'MMM d')} – {format(selectedRange.end, 'MMM d, yyyy')}
                  </p>
                  {savedNote && (
                    <div 
                      className="p-3 lg:p-4 rounded-xl mb-3 lg:mb-4"
                      style={{ backgroundColor: SPRING_COLORS.accentLight }}
                    >
                      <p className="text-sm lg:text-base" style={{ color: SPRING_COLORS.accentText }}>{savedNote}</p>
                    </div>
                  )}
                  <textarea
                    value={currentNote}
                    onChange={e => setCurrentNote(e.target.value)}
                    placeholder="Add a note for this date range..."
                    className="w-full h-24 lg:h-32 p-3 lg:p-4 text-sm lg:text-base border-2 border-gray-200 rounded-xl resize-none focus:outline-none focus:border-gray-300 focus:ring-2 focus:ring-gray-100 transition-all"
                  />
                  <button
                    onClick={saveNote}
                    className="mt-3 lg:mt-4 px-5 lg:px-6 py-2.5 lg:py-3 text-white rounded-xl font-medium text-sm lg:text-base hover:opacity-90 active:scale-95 transition-all"
                    style={{ 
                      backgroundColor: SPRING_COLORS.accent, 
                      borderRadius: '0.75rem',
                    }}
                  >
                    Save Note
                  </button>
                </>
              ) : (
                <p className="text-gray-400 text-sm">
                  Select a date range to add a note
                </p>
              )}
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  )
}