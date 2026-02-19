"use client";
import { useState, useEffect } from 'react';
import { CheckCircle2, Trophy, Calendar as CalIcon, Quote, Clock, BarChart3, Edit2, Target, X } from 'lucide-react';

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
      ACTIVITIES.forEach(act => { if (dayData[act.id]) stats[act.id] += 1; });
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

  return (
    <main className="min-h-screen bg-[#020202] text-zinc-100 p-4 md:p-10 font-sans selection:bg-emerald-500/30">
      <div className="max-w-5xl mx-auto space-y-8 md:space-y-12 pb-20">
        
        {/* HEADER SECTION */}
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
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-emerald-500 leading-none">{calculateWinrate()}%</h1>
          </div>
        </div>

        {/* STATS STRIP */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {ACTIVITIES.map((act) => (
            <div key={act.id} className="bg-zinc-900/40 border border-zinc-800/50 p-4 rounded-3xl text-center">
              <span className="text-2xl mb-1 block">{act.icon}</span>
              <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-tighter">{act.label}</p>
              <p className="text-xl font-black">{activityStats[act.id]}</p>
            </div>
          ))}
        </div>

        {/* MAIN CALENDAR - FULL WIDTH */}
        <section className="bg-zinc-900/10 border border-zinc-800/50 p-6 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem]">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xs font-black tracking-widest text-zinc-400 uppercase flex items-center gap-2">
              <CalIcon size={16} className="text-emerald-500" /> 30-Day Mission Log
            </h2>
            <div className="text-[10px] font-bold text-zinc-500 uppercase">Tap to update</div>
          </div>
          <div className="grid grid-cols-5 md:grid-cols-10 gap-2 md:gap-4">
            {ramadanDates.map((date, i) => {
              const isToday = new Date().toISOString().split('T')[0] === date;
              const dayData = history[date] || {};
              const filledCount = Object.values(dayData).filter(v => v === true).length;
              const isFullyCompleted = filledCount === ACTIVITIES.length;
              const isPartiallyFilled = filledCount > 0 && filledCount < ACTIVITIES.length;

              return (
                <button key={date} onClick={() => openDay(date)} className={`aspect-square rounded-2xl flex flex-col items-center justify-center transition-all duration-300 border-2 ${
                  isFullyCompleted ? 'bg-emerald-500 border-emerald-400 text-black' : 
                  isPartiallyFilled ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 
                  isToday ? 'border-blue-500 text-blue-500 bg-blue-500/5' : 'bg-zinc-900/50 border-zinc-800 text-zinc-600 hover:border-zinc-500'
                }`}>
                  <span className="text-[8px] font-black opacity-40 mb-1">D{i+1}</span>
                  <span className="text-lg md:text-2xl font-black leading-none">{new Date(date).getDate()}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* QUOTE FOOTER */}
        <footer className="p-8 md:p-12 rounded-[2.5rem] bg-gradient-to-br from-zinc-900/50 to-transparent border border-zinc-800 flex flex-col items-center text-center gap-4">
          <Quote className="text-emerald-500 opacity-50" size={24} />
          <p className="text-lg md:text-xl italic text-zinc-400 font-medium leading-tight px-4">"{quote}"</p>
        </footer>

        {/* WATERMARK SECTION */}
        <div className="flex flex-col items-center pt-8">
          <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] mb-2 opacity-40">System Architect</p>
          <h2 className="text-2xl font-black text-white tracking-[0.2em] uppercase">
            Made by <span className="underline decoration-emerald-500 underline-offset-4">1nn.</span>
          </h2>
        </div>
      </div>

      {/* DAILY LOG MODAL / BOTTOM SHEET */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-xl bg-zinc-950 border-t md:border border-zinc-800 p-6 md:p-10 rounded-t-[2.5rem] md:rounded-[3rem] shadow-2xl slide-in-from-bottom duration-500">
            <div className="flex justify-between items-start mb-8">
              <div>
                <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                  Progress Day {ramadanDates.indexOf(activeDay) + 1}
                </span>
                <h2 className="text-4xl font-black tracking-tighter mt-4 uppercase italic">Daily Log</h2>
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">
                  {new Date(activeDay).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}
                </p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-3 bg-zinc-900 rounded-full text-zinc-500 hover:text-white border border-zinc-800 transition-colors">
                <X size={20}/>
              </button>
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              {ACTIVITIES.map((act) => {
                const isDone = history[activeDay]?.[act.id];
                return (
                  <button 
                    key={act.id} 
                    onClick={() => toggleActivity(activeDay, act.id)} 
                    className={`w-full flex items-center justify-between p-5 rounded-2xl border-2 transition-all duration-200 ${
                      isDone 
                        ? 'bg-emerald-500 border-emerald-500 text-black shadow-lg shadow-emerald-500/10' 
                        : 'bg-zinc-900/50 border-zinc-800 text-zinc-500 hover:border-zinc-600'
                    }`}
                  >
                    <div className="flex items-center gap-4 text-left">
                      <span className={`text-2xl transition-transform ${isDone ? 'scale-110' : 'opacity-40'}`}>
                        {act.icon}
                      </span>
                      <div>
                        <p className="font-black text-sm uppercase leading-none tracking-tight">
                          {act.label}
                        </p>
                        <p className={`text-[9px] font-bold uppercase mt-1 ${isDone ? 'text-black/60' : 'text-zinc-600'}`}>
                          Impact +{act.weight}
                        </p>
                      </div>
                    </div>
                    
                    {/* FIXED CHECKMARK ICON */}
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                      isDone 
                        ? 'bg-black border-black text-emerald-500' 
                        : 'border-zinc-800'
                    }`}>
                      {isDone ? (
                        <CheckCircle2 size={20} strokeWidth={4} /> 
                      ) : (
                        <div className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
            
            <button 
              onClick={() => setIsModalOpen(false)} 
              className="w-full mt-8 py-5 bg-white text-black font-black uppercase rounded-2xl tracking-[0.2em] active:scale-95 transition-all text-sm"
            >
              Close & Save
            </button>
          </div>
        </div>
      )}
    </main>
  );
}