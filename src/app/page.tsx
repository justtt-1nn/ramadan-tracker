"use client";
import { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Trophy, Calendar as CalIcon, Quote, Clock, BarChart3, Edit2, Target } from 'lucide-react';

const ACTIVITIES = [
  { id: 'puasa', label: 'Puasa', weight: 10, icon: '🌙' },
  { id: 'sholat5waktu', label: '5 Waktu', weight: 10, icon: '🕌' },
  { id: 'tarawih', label: 'Tarawih', weight: 7, icon: '✨' },
  { id: 'tadarus', label: 'Tadarus', weight: 5, icon: '📖' },
  { id: 'dhuha', label: 'Dhuha', weight: 3, icon: '☀️' },
  { id: 'tahajud', label: 'Tahajud', weight: 5, icon: '🌌' },
];

const MOTIVATIONS = [
  "Jangan biarkan puasamu hanya menahan lapar dan dahaga.",
  "Ramadhan adalah waktu untuk membersihkan jiwa, bukan cuma menahan nafsu.",
  "Satu langkah kecil ibadah hari ini adalah tabungan untuk akhirat nanti.",
  "Konsistensi lebih dicintai Allah daripada amal yang sekaligus tapi putus.",
  "Jadikan setiap detik di bulan ini sebagai jalan menuju perubahan diri.",
  "Winrate tinggi itu bagus, tapi keikhlasan hati itu yang utama."
];

export default function Home() {
  const [history, setHistory] = useState<any>({});
  const [activeDay, setActiveDay] = useState<string>("");
  const [mounted, setMounted] = useState(false);
  const [quote, setQuote] = useState("");
  const [username, setUsername] = useState("USER GABUT");
  const [isEditingName, setIsEditingName] = useState(false);

  const startDate = new Date('2026-02-19');
  const ramadanDates = Array.from({ length: 30 }, (_, i) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    return date.toISOString().split('T')[0];
  });

  useEffect(() => {
    setMounted(true);
    const todayStr = new Date().toISOString().split('T')[0];
    setActiveDay(ramadanDates.includes(todayStr) ? todayStr : ramadanDates[0]);
    setQuote(MOTIVATIONS[Math.floor(Math.random() * MOTIVATIONS.length)]);
    
    const saved = localStorage.getItem('ramadan_v_final_user');
    if (saved) setHistory(JSON.parse(saved));

    const savedName = localStorage.getItem('ramadan_username');
    if (savedName) setUsername(savedName);
  }, []);

  const handleUsernameSave = (e: any) => {
    if (e.key === 'Enter' || e.type === 'blur') {
      setIsEditingName(false);
      localStorage.setItem('ramadan_username', username.toUpperCase());
    }
  };

  const calculateWinrate = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    const passedDates = ramadanDates.filter(d => d <= todayStr);
    if (passedDates.length === 0) return "0.0";
    let score = 0;
    passedDates.forEach(d => {
      ACTIVITIES.forEach(a => { if (history[d]?.[a.id]) score += a.weight; });
    });
    const maxScore = passedDates.length * ACTIVITIES.reduce((a, b) => a + b.weight, 0);
    return ((score / maxScore) * 100).toFixed(1);
  };

  const calculateActivityStats = () => {
    const stats: Record<string, number> = {};
    ACTIVITIES.forEach(act => stats[act.id] = 0);
    Object.values(history).forEach((dayData: any) => {
      ACTIVITIES.forEach(act => {
        if (dayData[act.id]) stats[act.id] += 1;
      });
    });
    return stats;
  };

  const toggleActivity = (date: string, id: string) => {
    const newHist = { ...history, [date]: { ...history[date], [id]: !history[date]?.[id] } };
    setHistory(newHist);
    localStorage.setItem('ramadan_v_final_user', JSON.stringify(newHist));
  };

  if (!mounted) return null;
  const activityStats = calculateActivityStats();

  return (
    <main className="min-h-screen bg-[#020202] text-zinc-100 p-4 md:p-10 font-sans selection:bg-emerald-500/30">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* BIG USERNAME SECTION (LEFT) */}
        <div className="flex justify-start items-center px-2">
          <div className="flex flex-col group cursor-pointer" onClick={() => setIsEditingName(true)}>
            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] mb-1">
              Ramadan Commander
            </span>
            {isEditingName ? (
              <input
                autoFocus
                className="bg-transparent border-b-4 border-emerald-500 outline-none text-5xl md:text-7xl font-black text-white w-full max-w-2xl uppercase tracking-tighter"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={handleUsernameSave}
                onBlur={handleUsernameSave}
              />
            ) : (
              <div className="flex items-center gap-6">
                <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white group-hover:text-emerald-400 transition-all duration-300 uppercase">
                  {username}
                </h2>
                <Edit2 size={32} className="text-zinc-800 group-hover:text-emerald-500 transition-colors opacity-0 group-hover:opacity-100" />
              </div>
            )}
          </div>
        </div>

        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-8 space-y-8">
            {/* HEADER / SCORE CARD */}
            <header className="bg-gradient-to-br from-zinc-900/50 to-zinc-950 border border-zinc-800 p-10 rounded-[3.5rem] backdrop-blur-xl flex flex-col md:flex-row justify-between gap-8 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
                  <BarChart3 size={200} />
              </div>
              <div className="space-y-4 relative z-10">
                <div className="flex items-center gap-2 text-emerald-500 font-black text-xs uppercase tracking-[0.3em]">
                  <Clock size={16} /> 19 FEB — 20 MAR 2026
                </div>
                <div className="flex flex-col">
                    <h1 className="text-8xl font-black tracking-tighter bg-gradient-to-b from-white to-zinc-700 bg-clip-text text-transparent leading-none">
                    {calculateWinrate()}%
                    </h1>
                    <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest mt-4">Total Spiritual Winrate</p>
                </div>
              </div>
              <div className="bg-emerald-500/5 border border-emerald-500/10 p-8 rounded-[2.5rem] flex items-center gap-6 relative z-10 h-fit self-center">
                <div className="text-right">
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Cycle Progress</p>
                  <p className="text-2xl font-black text-emerald-500 tracking-tight">30 DAYS</p>
                </div>
                <div className="w-16 h-16 bg-emerald-500/10 rounded-[1.5rem] flex items-center justify-center border border-emerald-500/20">
                  <Trophy size={32} className="text-emerald-400" />
                </div>
              </div>
            </header>

            {/* MILESTONE RECAP */}
            <section className="bg-zinc-900/20 border border-zinc-800/50 p-8 rounded-[3rem] backdrop-blur-md shadow-inner">
              <h2 className="text-sm font-black tracking-widest text-zinc-400 uppercase mb-8 flex items-center gap-2">
                <Target size={18} className="text-emerald-500" /> Milestone Accumulation
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                {ACTIVITIES.map((act) => (
                  <div key={act.id} className="bg-zinc-900/40 border border-zinc-800/50 p-6 rounded-[2.2rem] flex items-center gap-5 hover:border-emerald-500/30 transition-all duration-300 group">
                    <span className="text-4xl group-hover:scale-110 transition-transform">{act.icon}</span>
                    <div>
                      <p className="text-[10px] text-zinc-500 font-bold uppercase mb-1 tracking-tighter">{act.label}</p>
                      <p className="text-3xl font-black text-white leading-none">
                        {activityStats[act.id]} <span className="text-[10px] text-zinc-600 font-black uppercase tracking-normal">Days</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* CALENDAR */}
            <section className="bg-zinc-900/10 border border-zinc-800/50 p-8 rounded-[3rem]">
              <h2 className="text-sm font-black tracking-widest text-zinc-400 uppercase mb-8 flex items-center gap-2">
                <CalIcon size={18} className="text-emerald-500" /> 30-Day Mission Log
              </h2>
              <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-3">
                {ramadanDates.map((date, i) => {
                  const isSelected = activeDay === date;
                  const isToday = new Date().toISOString().split('T')[0] === date;
                  const dayData = history[date] || {};
                  const filledCount = Object.values(dayData).filter(v => v === true).length;
                  const isFullyCompleted = filledCount === ACTIVITIES.length;
                  const isPartiallyFilled = filledCount > 0 && filledCount < ACTIVITIES.length;
                  return (
                    <button
                      key={date}
                      onClick={() => setActiveDay(date)}
                      className={`aspect-square rounded-[1.2rem] flex flex-col items-center justify-center transition-all duration-300 border-2 relative ${
                        isSelected ? 'bg-white border-white text-black scale-110 z-10 shadow-[0_0_30px_rgba(255,255,255,0.2)]' : 
                        isFullyCompleted ? 'bg-emerald-500 border-emerald-400 text-black font-black' : 
                        isPartiallyFilled ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' : 
                        isToday ? 'border-blue-500 text-blue-500 bg-blue-500/5' : 'bg-zinc-900/50 border-zinc-800 text-zinc-600 hover:border-zinc-500'
                      }`}
                    >
                      <span className={`text-[9px] font-black leading-none mb-1 ${isSelected || isFullyCompleted ? 'opacity-50' : 'opacity-30'}`}>D-{i+1}</span>
                      <span className="text-xl font-black leading-none">{new Date(date).getDate()}</span>
                      {isPartiallyFilled && !isSelected && <div className="absolute bottom-2 w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                    </button>
                  );
                })}
              </div>
            </section>

            <footer className="p-10 rounded-[3rem] bg-gradient-to-r from-zinc-900/40 to-transparent border border-zinc-800 flex items-start gap-6">
              <Quote className="text-emerald-500 shrink-0" size={32} />
              <p className="text-xl italic text-zinc-300 font-medium leading-relaxed tracking-tight select-none">"{quote}"</p>
            </footer>
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-4">
            <aside className="sticky top-10 bg-zinc-900/50 border border-zinc-800 p-10 rounded-[3.5rem] backdrop-blur-3xl shadow-2xl border-t-zinc-700/50">
              <div className="mb-10 border-b border-zinc-800 pb-8">
                <div className="inline-block px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-6">
                  Phase: Day {ramadanDates.indexOf(activeDay) + 1}
                </div>
                <h2 className="text-5xl font-black tracking-tighter leading-none">DAILY LOG</h2>
                <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest mt-3">
                  {new Date(activeDay).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}
                </p>
              </div>
              <div className="space-y-4">
                {ACTIVITIES.map((act) => {
                  const isDone = history[activeDay]?.[act.id];
                  return (
                    <button
                      key={act.id}
                      onClick={() => toggleActivity(activeDay, act.id)}
                      className={`w-full group flex items-center justify-between p-6 rounded-[2rem] border-2 transition-all duration-300 ${
                        isDone ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400 shadow-lg shadow-emerald-900/10' : 'bg-zinc-900/40 border-transparent text-zinc-500 hover:bg-zinc-900/80 hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-center gap-5 text-left">
                        <span className="text-3xl group-hover:scale-125 transition-transform duration-500">{act.icon}</span>
                        <div>
                          <p className={`font-black text-lg tracking-tight ${isDone ? 'text-emerald-400' : 'text-zinc-300'}`}>{act.label}</p>
                          <p className="text-[10px] font-black opacity-30 uppercase tracking-[0.15em]">Impact +{act.weight}</p>
                        </div>
                      </div>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                        isDone ? 'bg-emerald-500 border-emerald-500 text-black shadow-lg shadow-emerald-500/40 scale-110' : 'border-zinc-800 group-hover:border-zinc-600'
                      }`}>
                        {isDone && <CheckCircle2 size={18} strokeWidth={4} />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </aside>
          </div>
        </div>
      </div>
      {/* WATERMARK SECTION - BIG & BOLD */}
    <div className="flex flex-col items-center justify-center py-20 border-t border-zinc-900/50 mt-10">
      <div className="group flex flex-col items-center gap-2">
        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.5em] opacity-50 group-hover:opacity-100 transition-opacity">
          Authorized Dashboard
        </span>
        <h2 className="text-[20px] md:text-[20px] font-black text-white tracking-[0.2em] uppercase transition-all duration-500 group-hover:tracking-[0.3em] group-hover:text-emerald-400">
          Made by <span className="underline decoration-emerald-500 underline-offset-8">1nn.</span>
        </h2>
        <div className="flex gap-4 mt-4 opacity-20 group-hover:opacity-100 transition-all duration-700">
          <div className="h-[2px] w-8 bg-zinc-500" />
          <div className="h-[2px] w-8 bg-emerald-500" />
          <div className="h-[2px] w-8 bg-zinc-500" />
        </div>
      </div>
    </div>
    </main>
  );
}