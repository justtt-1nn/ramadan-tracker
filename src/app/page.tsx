"use client";
import { useState, useEffect } from 'react';
import { CheckCircle2, Calendar as CalIcon, Quote, Edit2, X, AlertCircle, BarChart3 } from 'lucide-react';

const ACTIVITIES = [
  { id: 'puasa', label: 'Puasa', weight: 10, icon: '🌙', color: '#fb923c', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
  { id: 'sholat5waktu', label: '5 Waktu', weight: 10, icon: '🕌', color: '#60a5fa', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
  { id: 'tarawih', label: 'Tarawih', weight: 7, icon: '✨', color: '#c084fc', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
  { id: 'tadarus', label: 'Tadarus', weight: 5, icon: '📖', color: '#f472b6', bg: 'bg-pink-500/10', border: 'border-pink-500/20' },
  { id: 'dhuha', label: 'Dhuha', weight: 3, icon: '☀️', color: '#fbbf24', bg: 'bg-amber-500/10', border: 'border-amber-500/20' }, // FIXED: Warna lebih deep
  { id: 'tahajud', label: 'Tahajud', weight: 5, icon: '🌌', color: '#818cf8', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
];

const MOTIVATIONS = [
  "Jangan biarkan puasamu hanya menahan lapar dan dahaga.",
  "Ramadhan adalah waktu untuk membersihkan jiwa, bukan cuma menahan nafsu.",
  "Satu langkah kecil ibadah hari ini adalah tabungan untuk akhirat nanti.",
  "Konsistensi lebih dicintai Allah daripada amal yang sekaligus tapi putus."
];

export default function Home() {
  const [history, setHistory] = useState<any>({});
  const [activeDay, setActiveDay] = useState<string>("");
  const [mounted, setMounted] = useState(false);
  const [quote, setQuote] = useState("");
  const [username, setUsername] = useState("USER GABUT");
  const [isEditingName, setIsEditingName] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const getPassedDaysCount = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    const passed = ramadanDates.filter(d => d <= todayStr);
    return passed.length > 0 ? passed.length : 1;
  };

  const calculateGlobalWinrate = () => {
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
    const passedDays = getPassedDaysCount();
    const stats: Record<string, { count: number; wr: number }> = {};
    
    ACTIVITIES.forEach(act => {
      let count = 0;
      Object.values(history).forEach((dayData: any) => {
        if (dayData[act.id]) count += 1;
      });
      const wr = Math.round((count / passedDays) * 100);
      stats[act.id] = { count, wr };
    });
    return stats;
  };

  const toggleActivity = (date: string, id: string) => {
    const newHist = { ...history, [date]: { ...history[date], [id]: !history[date]?.[id] } };
    setHistory(newHist);
    localStorage.setItem('ramadan_v_final_user', JSON.stringify(newHist));
  };

  const openDay = (date: string) => {
    setActiveDay(date);
    setIsModalOpen(true);
  };

  if (!mounted) return null;
  const activityStats = calculateActivityStats();
  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <main className="min-h-screen bg-[#020202] text-zinc-100 p-4 md:p-10 font-sans selection:bg-emerald-500/30">
      <div className="max-w-5xl mx-auto space-y-8 md:space-y-12 pb-20">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-2 pt-4">
          <div className="flex flex-col group cursor-pointer" onClick={() => setIsEditingName(true)}>
            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] mb-1">Ramadan Commander</span>
            {isEditingName ? (
              <input autoFocus className="bg-transparent border-b-4 border-emerald-500 outline-none text-4xl md:text-7xl font-black text-white w-full uppercase tracking-tighter" value={username} onChange={(e) => setUsername(e.target.value)} onKeyDown={handleUsernameSave} onBlur={handleUsernameSave} />
            ) : (
              <h2 className="text-4xl md:text-7xl font-black tracking-tighter text-white uppercase flex items-center gap-4 group-hover:text-emerald-400 transition-colors">
                {username} <Edit2 size={24} className="text-zinc-800" />
              </h2>
            )}
          </div>
          <div className="text-left md:text-right">
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Global Winrate</p>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-emerald-500 leading-none">{calculateGlobalWinrate()}%</h1>
          </div>
        </div>

        {/* ACTIVITY CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          {ACTIVITIES.map((act) => {
            const stat = activityStats[act.id];
            const radius = 30;
            const circumference = 2 * Math.PI * radius;
            const offset = circumference - (stat.wr / 100) * circumference;

            return (
              <div key={act.id} className={`${act.bg} border ${act.border} p-5 rounded-[2rem] flex flex-col items-center relative group`}>
                <div className="relative w-16 h-16 mb-3">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="32" cy="32" r={radius} stroke="currentColor" strokeWidth="5" fill="transparent" className="text-white/5" />
                    <circle cx="32" cy="32" r={radius} stroke={act.color} strokeWidth="5" fill="transparent" strokeDasharray={circumference} style={{ strokeDashoffset: offset, transition: 'stroke-dashoffset 1s' }} strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-xl">{act.icon}</div>
                </div>
                
                <p className="text-[10px] text-zinc-400 font-black uppercase tracking-tighter">{act.label}</p>
                <p className="text-xl font-black text-white mt-1 drop-shadow-md">{stat.wr}%</p>
                <span className="text-[8px] font-bold text-zinc-500 uppercase mt-1 tracking-widest">{stat.count} Hari</span>
              </div>
            );
          })}
        </div>

        {/* CALENDAR */}
        <section className="bg-zinc-900/10 border border-zinc-800/50 p-6 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem]">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xs font-black tracking-widest text-zinc-400 uppercase flex items-center gap-2">
              <BarChart3 size={16} className="text-emerald-500" /> Progression Map
            </h2>
          </div>
          <div className="grid grid-cols-5 md:grid-cols-10 gap-2 md:gap-4">
            {ramadanDates.map((date, i) => {
              const isToday = todayStr === date;
              const isPassed = date < todayStr;
              const dayData = history[date] || {};
              const filledCount = Object.values(dayData).filter(v => v === true).length;
              const isPerfect = filledCount === ACTIVITIES.length;
              const isIncomplete = isPassed && filledCount < ACTIVITIES.length;

              return (
                <button key={date} onClick={() => openDay(date)} className={`aspect-square rounded-2xl flex flex-col items-center justify-center transition-all duration-300 border-2 relative ${
                  isPerfect ? 'bg-emerald-500 border-emerald-400 text-black shadow-lg shadow-emerald-500/20' : 
                  isIncomplete ? 'bg-amber-400 border-amber-600 text-black font-black' : // FIXED: Kontras warna kuning di kalender
                  isToday ? 'border-blue-500 text-blue-500 bg-blue-500/5' : 
                  'bg-zinc-900/50 border-zinc-800 text-zinc-600'
                }`}>
                  <span className="text-[8px] font-black opacity-30 mb-0.5">D{i+1}</span>
                  <span className="text-lg md:text-2xl font-black">{new Date(date).getDate()}</span>
                  {isIncomplete && <AlertCircle size={10} className="absolute top-1 right-1 text-black/40" />}
                </button>
              );
            })}
          </div>
        </section>

        {/* FOOTER */}
        <footer className="p-8 md:p-12 rounded-[2.5rem] bg-zinc-900/20 border border-zinc-800 flex flex-col items-center text-center gap-4">
          <p className="text-sm md:text-base italic text-zinc-400 font-medium px-4">"{quote}"</p>
          <div className="h-px w-12 bg-zinc-800" />
          <h2 className="text-xl font-black text-white tracking-widest uppercase opacity-80">
            Made by <span className="text-emerald-500 underline decoration-2 underline-offset-8">1nn.</span>
          </h2>
        </footer>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-xl bg-zinc-950 border-t md:border border-zinc-800 p-6 md:p-10 rounded-t-[2.5rem] md:rounded-[3rem] shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-between items-start mb-8">
              <div>
                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Day {ramadanDates.indexOf(activeDay) + 1} Log</span>
                <h2 className="text-4xl font-black tracking-tighter mt-2 uppercase italic">Aktivitas</h2>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-3 bg-zinc-900 rounded-full text-zinc-500 border border-zinc-800 hover:text-white"><X size={20}/></button>
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              {ACTIVITIES.map((act) => {
                const isDone = history[activeDay]?.[act.id];
                return (
                  <button key={act.id} onClick={() => toggleActivity(activeDay, act.id)} className={`w-full flex items-center justify-between p-5 rounded-2xl border-2 transition-all ${isDone ? 'bg-emerald-500 border-emerald-500 text-black' : 'bg-zinc-900/50 border-zinc-800 text-zinc-500'}`}>
                    <div className="flex items-center gap-4">
                      <span className="text-2xl">{act.icon}</span>
                      <p className="font-black text-sm uppercase">{act.label}</p>
                    </div>
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${isDone ? 'bg-black border-black text-emerald-500' : 'border-zinc-800'}`}>
                      {isDone ? <CheckCircle2 size={20} strokeWidth={4} /> : <div className="w-1.5 h-1.5 rounded-full bg-zinc-800" />}
                    </div>
                  </button>
                );
              })}
            </div>
            <button onClick={() => setIsModalOpen(false)} className="w-full mt-8 py-5 bg-white text-black font-black uppercase rounded-2xl tracking-[0.2em]">Selesai</button>
          </div>
        </div>
      )}
    </main>
  );
}