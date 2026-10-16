'use client';

import React, { useState, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { Snowflake, Flame, Zap, Thermometer, Wind, ShieldCheck, Droplets, ChevronUp, ChevronDown, Check } from 'lucide-react';

type Mode = 'cool' | 'heat' | 'auto';

export function ACDashboard() {
  const [mode, setMode] = useState<Mode>('cool');
  const [temperature, setTemperature] = useState(22);
  const [coolingPower, setCoolingPower] = useState(60);
  const [heatingPower, setHeatingPower] = useState(0);
  const [heatingEnabled, setHeatingEnabled] = useState(false);

  const tempUp = useCallback(() => setTemperature(t => Math.min(t + 1, 30)), []);
  const tempDown = useCallback(() => setTemperature(t => Math.max(t - 1, 16)), []);

  const coolUp = useCallback(() => setCoolingPower(p => Math.min(p + 20, 100)), []);
  const coolDown = useCallback(() => setCoolingPower(p => Math.max(p - 20, 0)), []);
  const heatUp = useCallback(() => setHeatingPower(p => Math.min(p + 20, 100)), []);
  const heatDown = useCallback(() => setHeatingPower(p => Math.max(p - 20, 0)), []);

  const toggleHeat = useCallback(() => {
    setHeatingEnabled(h => !h);
    if (!heatingEnabled) setHeatingPower(40);
    else setHeatingPower(0);
  }, [heatingEnabled]);

  const switchMode = useCallback((m: Mode) => {
    setMode(m);
    if (m === 'cool') { setHeatingEnabled(false); setHeatingPower(0); setCoolingPower(60); }
    if (m === 'heat') { setHeatingEnabled(true); setHeatingPower(60); setCoolingPower(0); }
    if (m === 'auto') { setCoolingPower(50); setHeatingEnabled(false); setHeatingPower(0); }
  }, []);

  const powerLevel = useCallback((v: number) => v >= 80 ? 'HIGH' : v >= 40 ? 'MEDIUM' : 'LOW', []);
  const airQuality = useMemo(() => coolingPower >= 40 || heatingPower >= 40 ? 'GOOD' : 'FAIR', [coolingPower, heatingPower]);
  const isCooling = mode === 'cool' || mode === 'auto';
  const isHeating = mode === 'heat';

  return (
    <div className="relative select-none" style={{ perspective: '1200px' }}>
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, rgba(2,22,42,0.95), rgba(3,27,49,0.92), rgba(2,22,42,0.95))',
          border: '1px solid rgba(0,217,255,0.2)',
          boxShadow: '0 30px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(0,217,255,0.1)',
          transform: 'rotateY(-1deg) rotateX(1deg)',
        }}
      >
        {/* ── MODE TABS ── */}
        <div className="flex items-center justify-center gap-2 pt-4 pb-2 px-4">
          {([
            { id: 'cool' as Mode, icon: <Snowflake className="w-3.5 h-3.5" />, label: 'COOL' },
            { id: 'heat' as Mode, icon: <Flame className="w-3.5 h-3.5" />, label: 'HEAT' },
            { id: 'auto' as Mode, icon: <Zap className="w-3.5 h-3.5" />, label: 'AUTO' },
          ]).map(m => (
            <button
              key={m.id}
              onClick={() => switchMode(m.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                mode === m.id
                  ? m.id === 'heat'
                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/50 shadow-[0_0_12px_rgba(249,115,22,0.2)]'
                    : 'bg-[#00d9ff]/15 text-[#00d9ff] border border-[#00d9ff]/50 shadow-[0_0_12px_rgba(0,217,255,0.2)]'
                  : 'bg-white/5 text-white/50 border border-white/10 hover:bg-white/10 hover:text-white/80'
              }`}
            >
              {m.icon} {m.label}
            </button>
          ))}

          {/* AMC Badge */}
          <div className="ml-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#00d9ff]/10 border border-[#00d9ff]/30">
            <ShieldCheck className="w-3.5 h-3.5 text-[#00d8f3]" />
            <span className="text-[10px] font-bold text-[#00d8f3]">AMC Available</span>
          </div>
        </div>

        {/* ── TEMPERATURE DISPLAY ── */}
        <div className="text-center py-2">
          <div className="flex items-center justify-center gap-4 text-white/50 text-[11px] font-mono">
            {isCooling && <span>28°C → 20°C</span>}
            {isHeating && <span>18°C → 28°C</span>}
          </div>
          <div className="flex items-center justify-center gap-3 mt-1">
            <button onClick={tempDown} className="w-8 h-8 rounded-full bg-white/5 border border-white/15 flex items-center justify-center text-white/70 hover:bg-[#00d9ff]/20 hover:text-[#00d9ff] hover:border-[#00d9ff]/50 transition-all">
              <ChevronDown className="w-4 h-4" />
            </button>
            <div className="flex items-baseline gap-0.5">
              <span className="text-5xl font-black text-white tabular-nums" style={{ textShadow: isCooling ? '0 0 30px rgba(0,217,255,0.3)' : '0 0 30px rgba(249,115,22,0.3)' }}>
                {temperature}
              </span>
              <span className="text-2xl font-light text-white/70">°C</span>
            </div>
            <button onClick={tempUp} className="w-8 h-8 rounded-full bg-white/5 border border-white/15 flex items-center justify-center text-white/70 hover:bg-[#00d9ff]/20 hover:text-[#00d9ff] hover:border-[#00d9ff]/50 transition-all">
              <ChevronUp className="w-4 h-4" />
            </button>
          </div>
          <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Target Temperature</span>
        </div>

        {/* ── MAIN BODY: Cooling | AC | Heating ── */}
        <div className="flex items-stretch px-3 pb-3 gap-3">

          {/* LEFT: Cooling Control */}
          <div className="w-[100px] flex-shrink-0 rounded-xl p-3 flex flex-col items-center"
            style={{ background: 'rgba(0,217,255,0.05)', border: '1px solid rgba(0,217,255,0.15)' }}>
            <div className="flex items-center gap-1 mb-2">
              <Snowflake className="w-3.5 h-3.5 text-[#00d9ff]" />
              <span className="text-[9px] font-black text-[#00d9ff] uppercase tracking-wider">Cooling</span>
            </div>

            {/* Gauge */}
            <div className="relative w-5 h-[100px] rounded-full overflow-hidden my-2" style={{ background: 'rgba(0,30,55,0.8)', border: '1px solid rgba(0,217,255,0.25)' }}>
              <div
                className="absolute bottom-0 left-0 right-0 rounded-full transition-all duration-500"
                style={{
                  height: `${coolingPower}%`,
                  background: 'linear-gradient(to top, #00d9ff, #00a0cc)',
                  boxShadow: coolingPower > 0 ? '0 0 12px rgba(0,217,255,0.5)' : 'none',
                }}
              />
            </div>

            <div className="flex gap-1.5 my-1.5">
              <button onClick={coolDown} className="w-6 h-6 rounded bg-white/5 border border-white/15 flex items-center justify-center text-white/60 hover:bg-[#00d9ff]/20 transition-all text-xs">−</button>
              <button onClick={coolUp} className="w-6 h-6 rounded bg-white/5 border border-white/15 flex items-center justify-center text-white/60 hover:bg-[#00d9ff]/20 transition-all text-xs">+</button>
            </div>

            <span className="text-[20px] font-black text-[#00d9ff]">{coolingPower}%</span>
            <span className="text-[8px] text-white/40 font-bold uppercase">{powerLevel(coolingPower)}</span>

            <div className="flex items-center gap-1 mt-2">
              <Droplets className="w-3 h-3 text-[#00d9ff]/60" />
              <Droplets className="w-3 h-3 text-[#00d9ff]/60" />
            </div>
          </div>

          {/* CENTER: AC Unit */}
          <div className="flex-grow flex flex-col items-center justify-center relative min-h-[200px]">
            {/* AC Image */}
            <div className="relative w-full max-w-[320px]">
              <Image
                src="/hero-ac.png"
                alt="Prime Cooling Solutions AC Unit"
                width={320}
                height={220}
                className="w-full h-auto relative z-[2] object-contain"
                style={{ filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.4))' }}
              />
              {/* Animated airflow overlay */}
              {isCooling && coolingPower > 0 && (
                <div className="absolute bottom-0 left-[10%] right-[10%] h-[40px] flex justify-around pointer-events-none z-[3]">
                  {[0, 0.2, 0.4, 0.6, 0.8].map((d, i) => (
                    <span key={i} className="w-6 h-10 rounded-[50%]"
                      style={{
                        background: `linear-gradient(to bottom, rgba(0,220,255,${0.3 + coolingPower/200}), transparent)`,
                        filter: 'blur(6px)',
                        animation: `airFlow 1.5s ease-in-out infinite ${d}s`,
                      }} />
                  ))}
                </div>
              )}
              {isHeating && heatingPower > 0 && (
                <div className="absolute bottom-0 left-[10%] right-[10%] h-[40px] flex justify-around pointer-events-none z-[3]">
                  {[0, 0.2, 0.4, 0.6, 0.8].map((d, i) => (
                    <span key={i} className="w-6 h-10 rounded-[50%]"
                      style={{
                        background: `linear-gradient(to bottom, rgba(249,115,22,${0.3 + heatingPower/200}), transparent)`,
                        filter: 'blur(6px)',
                        animation: `airFlow 1.5s ease-in-out infinite ${d}s`,
                      }} />
                  ))}
                </div>
              )}
            </div>

            {/* Component labels */}
            <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mt-2">
              {['Airflow Channel', 'Air Filter', 'Air Outlet', 'Louvers'].map(label => (
                <span key={label} className="text-[8px] text-white/35 font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-white/5 border border-white/5">{label}</span>
              ))}
            </div>
          </div>

          {/* RIGHT: Heating Control */}
          <div className="w-[100px] flex-shrink-0 rounded-xl p-3 flex flex-col items-center"
            style={{ background: 'rgba(249,115,22,0.05)', border: '1px solid rgba(249,115,22,0.15)' }}>
            <div className="flex items-center gap-1 mb-2">
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              <span className="text-[9px] font-black text-orange-400 uppercase tracking-wider">Heating</span>
            </div>

            {/* Heat Toggle */}
            <button
              onClick={toggleHeat}
              className={`mb-2 px-3 py-1 rounded text-[9px] font-black uppercase tracking-wider transition-all duration-300 ${
                heatingEnabled
                  ? 'bg-orange-500/20 text-orange-400 border border-orange-500/50'
                  : 'bg-white/5 text-white/40 border border-white/10'
              }`}
            >
              {heatingEnabled ? 'ON' : 'OFF'}
            </button>

            {/* Gauge */}
            <div className="relative w-5 h-[100px] rounded-full overflow-hidden my-2" style={{ background: 'rgba(30,15,0,0.6)', border: '1px solid rgba(249,115,22,0.25)' }}>
              <div
                className="absolute bottom-0 left-0 right-0 rounded-full transition-all duration-500"
                style={{
                  height: `${heatingEnabled ? heatingPower : 0}%`,
                  background: 'linear-gradient(to top, #f97316, #dc2626)',
                  boxShadow: heatingEnabled && heatingPower > 0 ? '0 0 12px rgba(249,115,22,0.5)' : 'none',
                }}
              />
            </div>

            <div className="flex gap-1.5 my-1.5">
              <button onClick={heatDown} disabled={!heatingEnabled} className="w-6 h-6 rounded bg-white/5 border border-white/15 flex items-center justify-center text-white/60 hover:bg-orange-500/20 transition-all text-xs disabled:opacity-30">−</button>
              <button onClick={heatUp} disabled={!heatingEnabled} className="w-6 h-6 rounded bg-white/5 border border-white/15 flex items-center justify-center text-white/60 hover:bg-orange-500/20 transition-all text-xs disabled:opacity-30">+</button>
            </div>

            <span className="text-[20px] font-black text-orange-400">{heatingEnabled ? heatingPower : 0}%</span>
            <span className="text-[8px] text-white/40 font-bold uppercase">{heatingEnabled ? powerLevel(heatingPower) : 'OFF'}</span>

            <div className="flex items-center gap-1 mt-2">
              <Thermometer className="w-3 h-3 text-orange-400/50" />
              <Wind className="w-3 h-3 text-orange-400/50" />
            </div>
          </div>
        </div>

        {/* ── STATUS PANEL ── */}
        <div className="mx-3 mb-3 rounded-xl p-3"
          style={{ background: 'rgba(0,20,38,0.7)', border: '1px solid rgba(0,217,255,0.12)' }}>
          <div className="text-[9px] font-black text-white/50 uppercase tracking-widest mb-2">Current Status</div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px]">
            <div className="flex flex-col">
              <span className="text-white/40 text-[9px] uppercase">Mode</span>
              <span className={`font-bold uppercase ${isCooling ? 'text-[#00d9ff]' : 'text-orange-400'}`}>{mode}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-white/40 text-[9px] uppercase">Temperature</span>
              <span className="font-bold text-white">{temperature}°C</span>
            </div>
            <div className="flex flex-col">
              <span className="text-white/40 text-[9px] uppercase">Cooling Power</span>
              <span className="font-bold text-[#00d9ff]">{coolingPower}%</span>
            </div>
            <div className="flex flex-col">
              <span className="text-white/40 text-[9px] uppercase">Air Quality</span>
              <span className="font-bold text-green-400 flex items-center gap-1"><Check className="w-3 h-3" /> {airQuality}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-white/40 text-[9px] uppercase">Protection</span>
              <span className="font-bold text-green-400 flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> ON</span>
            </div>
          </div>
        </div>

        {/* Bottom tagline */}
        <div className="text-center pb-3">
          <span className="text-[10px] text-white/20 font-bold uppercase tracking-[4px]">Cooler Spaces • Better Lives</span>
        </div>
      </div>
    </div>
  );
}
