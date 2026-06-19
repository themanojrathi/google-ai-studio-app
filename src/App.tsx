/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  Snowflake as SnowflakeIcon, 
  Wind, 
  Trash2, 
  Layers, 
  RefreshCw,
  Clock,
  Terminal,
  PlaySquare,
  Sparkles,
  Info,
  Sun,
  Moon
} from 'lucide-react';
import { EffectType, Particle, ActivityLog } from './types';
import ParticleLayer from './components/ParticleLayer';

export default function App() {
  const [activeEffect, setActiveEffect] = useState<EffectType>('none');
  const [selectedDuration, setSelectedDuration] = useState<number | 'infinite'>(5);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Set up live standard clock for formal presentation environment
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
    };
    updateTime();
    const timerId = setInterval(updateTime, 1000);
    return () => clearInterval(timerId);
  }, []);

  // Set up countdown manager
  useEffect(() => {
    if (activeEffect === 'none') {
      setTimeLeft(0);
      return;
    }

    if (selectedDuration === 'infinite') {
      setTimeLeft(Infinity);
      return;
    }

    // Initialize/reset timeLeft on trigger
    setTimeLeft(selectedDuration);

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === Infinity) {
          return Infinity;
        }
        if (prev <= 0.1) {
          clearInterval(interval);
          setActiveEffect('none');
          return 0;
        }
        return parseFloat((prev - 0.1).toFixed(1));
      });
    }, 100);

    return () => clearInterval(interval);
  }, [activeEffect, selectedDuration]);

  // Method to trigger either effect with custom themed configurations
  const triggerEffect = (effect: EffectType, currentTheme?: 'light' | 'dark') => {
    const activeTheme = currentTheme || theme;
    if (effect === 'none') {
      setActiveEffect('none');
      setParticles([]);
      return;
    }

    // Amount of particles to generate
    const particleCount = effect === 'snowflakes' ? 38 : 22;
    const list: Particle[] = [];

    // Sophisticated, formal corporate celebratory colors for balloons
    // Day vs Night theme balloon colors
    const balloonColors = activeTheme === 'dark' 
      ? [
          '#FF007F', // Neon Fuchsia
          '#00F3FF', // Vaporwave Cyan
          '#39FF14', // Laser Lime
          '#BD00FF', // Radiant Violet
          '#FF5E00', // Neon Orange
          '#00FFD1', // Electric Turquoise
        ]
      : [
          '#DC2626', // Classic Crimson
          '#2563EB', // Royal Cobalt
          '#16A34A', // Forest Emerald
          '#7C3AED', // Regal Violet
          '#EA580C', // Deep Tangerine
          '#0D9488', // Ceremonial Teal
        ];

    for (let i = 0; i < particleCount; i++) {
      const id = `pt_${effect}_${Date.now()}_${i}`;
      // Distribute evenly but randomly across viewport widths (5% to 95%)
      const x = 4 + Math.random() * 92;
      
      // Delay to stagger particles continuously
      const delay = Math.random() * 3.3; 
      
      // Speed of travel (seconds)
      const duration = effect === 'snowflakes'
        ? 6.0 + Math.random() * 5.0 // 6.0 to 11.0 seconds to fall gracefully (natural snow speed)
        : 4.5 + Math.random() * 3.0; // 4.5 to 7.5 seconds to rise smoothly

      // Medium size specification
      const size = effect === 'snowflakes'
        ? 18 + Math.random() * 7   // 18px - 25px
        : 44 + Math.random() * 10;  // 44px - 54px

      // Lateral drift / sway amplitude (positive or negative for left/right drift)
      const swayDir = Math.random() < 0.5 ? -1 : 1;
      const sway = effect === 'snowflakes'
        ? swayDir * (2 + Math.random() * 4)   // -6vw to +6vw smooth organic sway drift
        : swayDir * (3 + Math.random() * 6);   // -9vw to +9vw straight diagonal drift

      // Transparent variations for beautiful depth layering
      const opacity = effect === 'snowflakes'
        ? 0.45 + Math.random() * 0.55
        : 0.85 + Math.random() * 0.15;

      const rotate = Math.random() * 30 - 15;

      list.push({
        id,
        x,
        size,
        delay,
        duration,
        sway,
        opacity,
        rotate,
        color: effect === 'balloons' ? balloonColors[i % balloonColors.length] : undefined,
      });
    }

    setParticles(list);
    setTimeLeft(selectedDuration === 'infinite' ? Infinity : selectedDuration);
    setActiveEffect(effect);

    // Dynamic Activity Log Logging
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    setLogs((prev) => [
      {
        id: `log_${Date.now()}`,
        timestamp: timeStr,
        effect: effect === 'snowflakes' ? 'Snowflakes' : 'Balloons',
        duration: selectedDuration === 'infinite' ? 'Infinite' : `${selectedDuration.toFixed(1)}s`,
      },
      ...prev.slice(0, 7), // Keep only top 8 entries to avoid vertical clutter
    ]);
  };

  // Re-color or modify particles elegantly when theme changes on-the-fly
  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);

    if (activeEffect === 'balloons') {
      const nextColors = nextTheme === 'dark'
        ? ['#FF007F', '#00F3FF', '#39FF14', '#BD00FF', '#FF5E00', '#00FFD1']
        : ['#DC2626', '#2563EB', '#16A34A', '#7C3AED', '#EA580C', '#0D9488'];

      setParticles((prev) =>
        prev.map((p, idx) => ({
          ...p,
          color: nextColors[idx % nextColors.length],
        }))
      );
    }
  };

  // Quick reset for all values
  const handleClearLogs = () => {
    setLogs([]);
  };

  return (
    <div className={`min-h-screen font-sans antialiased relative transition-all duration-1000 flex flex-col justify-between ${
      theme === 'dark'
        ? 'bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950/90 text-slate-100'
        : 'bg-gradient-to-b from-sky-200 via-sky-50 to-amber-50/65 text-slate-800'
    }`}>
      {/* Visual dynamic particle overlay canvas layer */}
      <ParticleLayer activeEffect={activeEffect} particles={particles} theme={theme} />

      {/* Elegant Nav Header */}
      <header className={`w-full border-b px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between z-10 backdrop-blur-md sticky top-0 transition-all duration-700 ${
        theme === 'dark'
          ? 'bg-slate-950/80 border-slate-800/80 text-white'
          : 'bg-white/80 border-sky-200/50 text-slate-900'
      }`}>
        <div className="flex items-center gap-2 sm:gap-3">
          <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center shadow-sm transition-colors duration-500 ${
            theme === 'dark'
              ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
              : 'bg-slate-900 text-white'
          }`}>
            <Layers className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" style={{ animationDuration: '4s' }} />
          </div>
          <div>
            <h1 className="text-xs sm:text-sm font-semibold tracking-wide uppercase font-sans">
              Aether
            </h1>
            <p className={`text-[9px] sm:text-[10px] font-mono tracking-wider uppercase transition-colors duration-500 ${
              theme === 'dark' ? 'text-sky-400' : 'text-slate-400 font-bold'
            }`}>
              {theme === 'dark' ? 'Night Unit' : 'Day Unit'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Day / Night Theme Toggle Switcher */}
          <button
            onClick={toggleTheme}
            className={`px-2 sm:px-3 py-1.5 rounded-md border flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-[11px] font-mono font-bold tracking-tight uppercase transition-all duration-300 cursor-pointer ${
              theme === 'dark'
                ? 'bg-slate-900 border-slate-800 hover:bg-slate-850 hover:border-amber-500/50 text-amber-400'
                : 'bg-amber-50 border-amber-200 hover:bg-amber-100 hover:border-amber-300 text-amber-700'
            }`}
            title={theme === 'dark' ? 'Switch to Daylight Theme' : 'Switch to Midnight Theme'}
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-400/20 animate-[spin_10s_linear_infinite]" />
                <span className="hidden sm:inline">DAY MODE ☀️</span>
              </>
            ) : (
              <>
                <Moon className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-500/10 transition-transform duration-300 hover:rotate-12" />
                <span className="hidden sm:inline">NIGHT MODE 🌙</span>
              </>
            )}
          </button>

          {/* Live System Clock */}
          <div className={`px-2 sm:px-3 py-1.5 rounded-md flex items-center gap-1 sm:gap-1.5 border transition-all duration-500 ${
            theme === 'dark'
              ? 'bg-slate-900/60 text-indigo-300 border-indigo-950/40'
              : 'bg-slate-100 text-slate-600 border-slate-200/50'
          }`}>
            <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span className="text-[10px] sm:text-[11px] font-mono font-medium tracking-tight">
              {currentTime || '12:00:00 PM'}
            </span>
          </div>

          {/* Status Badge */}
          <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md border transition-all duration-500 text-[11px] ${
            theme === 'dark'
              ? 'bg-slate-900/60 border-indigo-950/40 text-indigo-205'
              : 'bg-slate-100 border-slate-200/50 text-slate-600'
          }`}>
            <span
              className={`w-2 h-2 rounded-full ${
                activeEffect !== 'none'
                  ? 'bg-emerald-550 animate-pulse'
                  : 'bg-slate-440'
              }`}
            />
            <span className="font-mono font-medium tracking-wider uppercase">
              {activeEffect !== 'none' ? `PREVIEWING: ${activeEffect.toUpperCase()}` : 'SYSTEM IDLE'}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area - Formally Styled Interface */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-8 md:py-16 flex flex-col justify-center items-center z-10 transition-colors duration-1000">
        <div className="w-full gap-4 sm:gap-6 md:gap-8 grid grid-cols-1 md:grid-cols-12">
          
          {/* LEFT PANEL: Control Console Dashboard */}
          <section className="col-span-1 md:col-span-12 lg:col-span-7 flex flex-col gap-4 sm:gap-6">
            <div className={`border rounded-2xl shadow-sm overflow-hidden transition-all duration-700 ${
              theme === 'dark'
                ? 'bg-slate-900/90 border-slate-800/80 shadow-2xl shadow-indigo-950/30'
                : 'bg-white border-slate-200/80 shadow-md shadow-sky-800/5'
            }`}>
              <div className={`p-4 sm:p-6 md:p-8 border-b transition-colors duration-500 ${
                theme === 'dark' ? 'border-slate-800/60' : 'border-slate-100'
              }`}>
                <span className={`text-[10px] sm:text-xs font-semibold uppercase tracking-widest block mb-1 sm:mb-2 font-mono ${
                  theme === 'dark' ? 'text-cyan-400' : 'text-sky-500'
                }`}>
                  {theme === 'dark' ? 'Celestial Evening Console' : 'Sunny Daylight Console'}
                </span>
                <h2 className={`text-xl sm:text-2xl md:text-3xl font-serif tracking-tight font-medium ${
                  theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
                }`}>
                  Atmospheric Overlay Panel
                </h2>
                <p className={`text-xs sm:text-sm mt-1 sm:mt-2 leading-relaxed transition-colors duration-500 ${
                  theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  Configure and trigger live dynamic particles to cascade down or rise float over the entire viewport. Optimized for high-resolution interactive displays with adaptive visual themes.
                </p>
              </div>

              {/* TWO INTERACTIVE BUTTONS WITH HOVER STATES */}
              <div className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
                {/* TIMER DURATION SELECTION */}
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-1">
                    <label className={`text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                      theme === 'dark' ? 'text-indigo-300' : 'text-slate-500'
                    }`}>
                      <Clock className="w-3.5 h-3.5" />
                      Timer Duration
                    </label>
                    <span className="text-[9px] sm:text-[10px] font-mono text-slate-400">
                      Mode: {selectedDuration === 'infinite' ? 'Continuous (∞)' : 'Scheduled cutoff'}
                    </span>
                  </div>
                  
                  <div className={`grid grid-cols-4 gap-1 p-1 rounded-xl border transition-colors duration-500 ${
                    theme === 'dark'
                      ? 'bg-slate-950/70 border-slate-800/50'
                      : 'bg-slate-100 border-slate-200/40'
                  }`}>
                    {([5, 10, 30, 'infinite'] as const).map((dur) => (
                      <button
                        key={dur}
                        type="button"
                        onClick={() => {
                          setSelectedDuration(dur);
                          // If there's an active effect, reset its timeLeft smoothly to match new choice
                          if (activeEffect !== 'none') {
                            setTimeLeft(dur === 'infinite' ? Infinity : dur);
                          }
                        }}
                        className={`py-1.5 sm:py-2 px-0.5 rounded-lg text-[11px] sm:text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer text-center ${
                          selectedDuration === dur
                            ? theme === 'dark'
                              ? 'bg-cyan-50 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.3)] font-bold'
                              : 'bg-slate-900 text-white shadow-sm'
                            : theme === 'dark'
                              ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                              : 'text-slate-500 hover:text-slate-805 hover:bg-white/50'
                        }`}
                      >
                        {dur === 'infinite' ? 'Infinite ∞' : `${dur}s`}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {/* SNOWFLAKES SELECTION CARD/BUTTON */}
                  <button
                    onClick={() => triggerEffect('snowflakes')}
                    className={`flex flex-col items-center justify-center p-3 sm:p-5 md:p-6 rounded-xl border transition-all duration-500 text-center cursor-pointer min-h-[110px] sm:min-h-0 ${
                      activeEffect === 'snowflakes'
                        ? theme === 'dark'
                          ? 'bg-cyan-950/30 border-cyan-500/80 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.15)] scale-[0.98]'
                          : 'bg-sky-50 border-sky-300 text-sky-900 shadow-md shadow-sky-50/50 scale-[0.98]'
                        : theme === 'dark'
                          ? 'bg-slate-900/45 border-slate-800/80 hover:border-cyan-900 hover:bg-slate-800/20 text-slate-400 hover:text-slate-200'
                          : 'bg-white border-slate-200 hover:border-sky-200 hover:bg-sky-50/20 text-slate-700 hover:text-slate-800 hover:shadow-sm'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mb-1.5 sm:mb-3 transition-colors duration-500 ${
                        activeEffect === 'snowflakes'
                          ? theme === 'dark'
                            ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                            : 'bg-sky-100 text-sky-600'
                          : theme === 'dark'
                            ? 'bg-slate-800/40 text-slate-500'
                            : 'bg-slate-50 text-slate-400'
                      }`}
                    >
                      <SnowflakeIcon
                        className={`w-5 h-5 sm:w-6 sm:h-6 ${
                          activeEffect === 'snowflakes' ? 'animate-spin' : ''
                        }`}
                        style={{ animationDuration: '10s' }}
                      />
                    </div>
                    <span className="font-semibold text-xs sm:text-sm font-sans tracking-tight">
                      Snowflakes
                    </span>
                    <span className="text-[9px] sm:text-[11px] text-slate-400 mt-0.5 sm:mt-1 font-mono">
                      {theme === 'dark' ? 'Glowing' : 'Breeze'} ({selectedDuration === 'infinite' ? '∞' : `${selectedDuration}s`})
                    </span>
                  </button>

                  {/* BALLOONS SELECTION CARD/BUTTON */}
                  <button
                    onClick={() => triggerEffect('balloons')}
                    className={`flex flex-col items-center justify-center p-3 sm:p-5 md:p-6 rounded-xl border transition-all duration-500 text-center cursor-pointer min-h-[110px] sm:min-h-0 ${
                      activeEffect === 'balloons'
                        ? theme === 'dark'
                          ? 'bg-pink-950/30 border-pink-500/80 text-pink-200 shadow-[0_0_15px_rgba(236,72,153,0.15)] scale-[0.98]'
                          : 'bg-rose-50 border-rose-300 text-rose-900 shadow-md shadow-rose-50/50 scale-[0.98]'
                        : theme === 'dark'
                          ? 'bg-slate-900/45 border-slate-800/80 hover:border-pink-900 hover:bg-slate-800/20 text-slate-400 hover:text-slate-200'
                          : 'bg-white border-slate-200 hover:border-rose-200 hover:bg-rose-50/10 text-slate-700 hover:text-slate-805'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mb-1.5 sm:mb-3 transition-colors duration-500 ${
                        activeEffect === 'balloons'
                          ? theme === 'dark'
                            ? 'bg-pink-500/10 text-pink-400 border border-pink-500/20'
                            : 'bg-rose-100 text-rose-600'
                          : theme === 'dark'
                            ? 'bg-slate-800/40 text-slate-500'
                            : 'bg-slate-50 text-slate-400'
                      }`}
                    >
                      <span className="text-sm sm:text-xl">🎈</span>
                    </div>
                    <span className="font-semibold text-xs sm:text-sm font-sans tracking-tight">
                      Balloons
                    </span>
                    <span className="text-[9px] sm:text-[11px] text-slate-400 mt-0.5 sm:mt-1 font-mono">
                      {theme === 'dark' ? 'Cosmic' : 'Sunlit'} ({selectedDuration === 'infinite' ? '∞' : `${selectedDuration}s`})
                    </span>
                  </button>
                </div>

                {/* ACTIVE STATUS TIMER DISPLAY */}
                <div className={`mt-4 pt-4 border-t transition-colors duration-500 ${
                  theme === 'dark' ? 'border-slate-800/60' : 'border-slate-100'
                }`}>
                  {activeEffect !== 'none' ? (
                    <div className="bg-slate-900 text-white border border-slate-800/60 rounded-xl p-3 sm:p-4 flex flex-col gap-2 relative overflow-hidden shadow-xl shadow-black/30">
                      {/* Dynamic elegant depletion slider */}
                      {timeLeft === Infinity ? (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-emerald-450 to-pink-500 animate-[pulse_2s_infinite] rounded-b-xl" />
                      ) : (
                        <div
                          className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-sky-400 to-rose-400 transition-all duration-100 rounded-b-xl"
                          style={{ width: `${(timeLeft / (typeof selectedDuration === 'number' ? selectedDuration : 5)) * 100}%` }}
                        />
                      )}

                      <div className="flex items-center justify-between z-10 gap-1.5 flex-wrap">
                        <div className="flex items-center gap-1.5">
                          <RefreshCw className="w-3.5 h-3.5 text-sky-400 animate-spin" />
                          <span className="text-[10px] sm:text-xs font-mono font-medium tracking-wide text-slate-200 animate-pulse">
                            {activeEffect === 'snowflakes'
                              ? 'SNOWFLAKES CASCADE ACTIVE'
                              : 'BALLOONS RELEASE ACTIVE'}
                          </span>
                        </div>
                        <span className="text-xs sm:text-sm font-mono font-bold text-sky-305 text-sky-300">
                          {timeLeft === Infinity ? '∞' : `${timeLeft.toFixed(1)}s`}
                        </span>
                      </div>

                      <div className="flex items-center justify-between mt-1 z-10 gap-2 flex-wrap">
                        <span className="text-[10px] sm:text-[11px] text-slate-400 leading-tight">
                          {timeLeft === Infinity
                            ? `Continuous ${theme === 'dark' ? 'Midnight' : 'Daylight'} Operation`
                            : `Terminating in ${Math.ceil(timeLeft)} seconds`}
                        </span>
                        <button
                          onClick={() => triggerEffect('none')}
                          className="bg-white/10 hover:bg-white/20 active:bg-white/30 text-white text-[9px] sm:text-[10px] uppercase font-mono px-2 py-1 rounded transition-colors cursor-pointer border border-white/5 whitespace-nowrap"
                        >
                          Cancel Effect
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className={`border border-dashed rounded-xl p-3 sm:p-4 flex items-center justify-center text-center transition-colors duration-500 ${
                      theme === 'dark'
                        ? 'bg-slate-950/40 border-slate-800 text-slate-500'
                        : 'bg-slate-50 border-slate-200/80 text-slate-400'
                    }`}>
                      <p className="text-[10px] sm:text-xs flex items-center justify-center gap-1.5 font-mono">
                        <Info className="w-3.5 h-3.5 shrink-0" />
                        SELECT AND TRIGGER AN OVERLAY EFFECT TO BEGIN PREVIEW
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* RIGHT PANEL: Specifications & Execution Log */}
          <section className="col-span-1 md:col-span-12 lg:col-span-5 flex flex-col gap-4 sm:gap-6">
            {/* System Info Stats */}
            <div className={`border rounded-2xl p-4 sm:p-6 shadow-sm transition-all duration-700 ${
              theme === 'dark'
                ? 'bg-slate-900/90 border-slate-800/80 shadow-2xl shadow-indigo-950/20'
                : 'bg-white border-slate-200/80 shadow-md shadow-sky-800/5'
            }`}>
              <h3 className={`text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 mb-3 sm:mb-4 font-mono transition-colors duration-500 ${
                theme === 'dark' ? 'text-cyan-400' : 'text-slate-400'
              }`}>
                <Terminal className="w-3.5 h-3.5" />
                System Configuration
              </h3>
              
              <div className="space-y-3">
                <div className={`flex justify-between items-center py-1.5 border-b text-xs transition-colors duration-500 ${
                  theme === 'dark' ? 'border-slate-800/60' : 'border-slate-100'
                }`}>
                  <span className={theme === 'dark' ? 'text-indigo-200' : 'text-slate-400'}>Active Theme</span>
                  <span className={`font-mono font-semibold uppercase transition-colors duration-500 ${
                    theme === 'dark' ? 'text-cyan-300' : 'text-amber-600'
                  }`}>
                    {theme === 'dark' ? '🌙 Night Theme' : '☀️ Light Theme'}
                  </span>
                </div>
                <div className={`flex justify-between items-center py-1.5 border-b text-xs transition-colors duration-500 ${
                  theme === 'dark' ? 'border-slate-800/60' : 'border-slate-100'
                }`}>
                  <span className={theme === 'dark' ? 'text-indigo-200' : 'text-slate-400'}>Total Particles</span>
                  <span className={`font-mono font-semibold transition-colors duration-500 ${
                    theme === 'dark' ? 'text-slate-200' : 'text-slate-700'
                  }`}>
                    {activeEffect === 'snowflakes' ? '38 Units' : activeEffect === 'balloons' ? '22 Units' : '0 Units'}
                  </span>
                </div>
                <div className={`flex justify-between items-center py-1.5 border-b text-xs transition-colors duration-500 ${
                  theme === 'dark' ? 'border-slate-800/60' : 'border-slate-100'
                }`}>
                  <span className={theme === 'dark' ? 'text-indigo-200' : 'text-slate-400'}>Target Size</span>
                  <span className={`font-mono font-semibold transition-colors duration-500 ${
                    theme === 'dark' ? 'text-slate-200' : 'text-slate-700'
                  }`}>
                    {activeEffect === 'none' ? '—' : 'Medium Size'}
                  </span>
                </div>
                <div className={`flex justify-between items-center py-1.5 border-b text-xs transition-colors duration-500 ${
                  theme === 'dark' ? 'border-slate-800/60' : 'border-slate-100'
                }`}>
                  <span className={theme === 'dark' ? 'text-indigo-200' : 'text-slate-400'}>Span Timer</span>
                  <span className={`font-mono font-semibold transition-colors duration-500 ${
                    theme === 'dark' ? 'text-cyan-400' : 'text-rose-600'
                  }`}>
                    {selectedDuration === 'infinite' ? '∞ Infinite' : `${selectedDuration}.0 seconds`}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1.5 text-xs">
                  <span className={theme === 'dark' ? 'text-indigo-200' : 'text-slate-400'}>Rendering Path</span>
                  <span className="font-mono text-emerald-500 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-[pulse_2s_infinite]" /> GPU Accelerated
                  </span>
                </div>
              </div>
            </div>

            {/* Run Reports Logs */}
            <div className={`border rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col flex-1 min-h-[200px] transition-all duration-700 ${
              theme === 'dark'
                ? 'bg-slate-900/90 border-slate-800/80 shadow-2xl shadow-indigo-950/20'
                : 'bg-white border-slate-200/80 shadow-md shadow-sky-800/5'
            }`}>
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className={`text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 font-mono transition-colors duration-500 ${
                  theme === 'dark' ? 'text-cyan-400' : 'text-slate-400'
                }`}>
                  <PlaySquare className="w-3.5 h-3.5" />
                  Trigger Audit Log
                </h3>
                {logs.length > 0 && (
                  <button
                    onClick={handleClearLogs}
                    className={`text-[10px] font-mono transition-colors uppercase cursor-pointer flex items-center gap-1 ${
                      theme === 'dark' ? 'text-slate-400 hover:text-red-400' : 'text-slate-400 hover:text-red-500'
                    }`}
                  >
                    <Trash2 className="w-3 h-3" /> Clear
                  </button>
                )}
              </div>

              {logs.length > 0 ? (
                <div className="space-y-2 overflow-y-auto max-h-[180px] flex-1 pr-1 font-mono">
                  {logs.map((log) => (
                    <div
                      key={log.id}
                      className={`p-2.5 border rounded-lg text-xs flex justify-between items-center transition-all duration-305 ${
                        theme === 'dark'
                          ? 'bg-slate-950/50 border-slate-800/50 hover:bg-slate-800/40 text-slate-300'
                          : 'bg-slate-50 border-slate-200/40 hover:bg-slate-100/60 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-400">
                          {log.timestamp}
                        </span>
                        <span
                          className={`font-semibold ${
                            log.effect === 'Snowflakes'
                              ? theme === 'dark' ? 'text-cyan-400' : 'text-sky-600'
                              : theme === 'dark' ? 'text-pink-400' : 'text-rose-600'
                          }`}
                        >
                          {log.effect}
                        </span>
                      </div>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded transition-colors duration-505 ${
                        theme === 'dark' ? 'bg-slate-800 text-slate-400' : 'bg-slate-200/60 text-slate-600'
                      }`}>
                        {log.duration}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={`flex-1 flex flex-col items-center justify-center text-center p-4 border border-dashed rounded-xl transition-colors duration-500 ${
                  theme === 'dark'
                    ? 'border-indigo-950/60 bg-slate-950/40 text-slate-500'
                    : 'border-slate-200 bg-slate-50/50 text-slate-400'
                }`}>
                  <Terminal className="w-5 h-5 text-slate-300 mb-1.5" />
                  <p className="text-[10px] font-mono tracking-wider uppercase">
                    NO PREVIOUS TRIGGERS RECORDED
                  </p>
                </div>
              )}
            </div>
          </section>

        </div>
      </main>

      {/* Elegant Formal Footer */}
      <footer className={`w-full border-t px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] z-10 font-sans transition-all duration-700 ${
        theme === 'dark'
          ? 'bg-slate-950/90 border-slate-900 text-slate-500'
          : 'bg-white/80 border-slate-200/80 text-slate-400'
      }`}>
        <div>
          <span>Aether Simulation Console © 2026. All rights secured.</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <span className={`w-1.5 h-1.5 rounded-full transition-colors duration-500 ${
              theme === 'dark' ? 'bg-indigo-400 animate-pulse' : 'bg-emerald-500'
            }`} /> Web Engine Active
          </span>
          <span>Build Prod-v4.2</span>
        </div>
      </footer>
    </div>
  );
}
