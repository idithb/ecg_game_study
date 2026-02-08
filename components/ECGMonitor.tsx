
import React, { useEffect, useRef, useCallback } from 'react';
import { ActivityLevel } from '../types';
import { BPM_MAP, ECG_COLORS } from '../constants';

interface ECGMonitorProps {
  activity: ActivityLevel;
  height?: number;
  showLabels?: boolean;
  timeLabel?: string;
}

const ECGMonitor: React.FC<ECGMonitorProps> = ({ activity, height = 400, showLabels = true, timeLabel }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dataPointsRef = useRef<number[]>([]);
  const frameRef = useRef<number>(0);
  const cycleTimeRef = useRef<number>(0);
  const currentActivityRef = useRef<ActivityLevel>(activity);

  // Configuration for 1200px width canvas
  const STEP = 1.5; 
  const MAX_POINTS = 801; // (1200 / 1.5) + 1

  // Pre-fill buffer to avoid "cutting" at start
  useEffect(() => {
    if (dataPointsRef.current.length === 0) {
      dataPointsRef.current = new Array(MAX_POINTS).fill(0);
    }
  }, []);

  useEffect(() => {
    currentActivityRef.current = activity;
  }, [activity]);

  const generateHeartbeat = (t: number, bpm: number, isCrisis: boolean): number => {
    if (isCrisis) {
      const randomType = Math.floor(Date.now() / 2000) % 3;
      if (randomType === 0) return (Math.random() - 0.5) * 45; 
      if (randomType === 1) return Math.sin(t * 60) * 20; 
      return (Math.random() - 0.5) * 5; 
    }
    const cyclePos = t % 1.0;
    if (cyclePos < 0.1) return 0;
    if (cyclePos < 0.2) return Math.sin((cyclePos - 0.1) * 10 * Math.PI) * 5;
    if (cyclePos < 0.25) return 0;
    if (cyclePos < 0.27) return -(cyclePos - 0.25) * 200;
    if (cyclePos < 0.32) return (cyclePos - 0.27) * 800 - 4;
    if (cyclePos < 0.35) return -(cyclePos - 0.32) * 500 + 36;
    if (cyclePos < 0.45) return 0;
    if (cyclePos < 0.6) return Math.sin((cyclePos - 0.45) * 6.6 * Math.PI) * 8;
    return 0;
  };

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const canvasHeight = canvas.height;
    const midY = canvasHeight / 2;

    const activeActivity = currentActivityRef.current;
    const bpm = BPM_MAP[activeActivity];
    const isCrisis = activeActivity === ActivityLevel.CRISIS;
    
    const cycleSpeed = isCrisis ? 0.04 : (bpm / 60) * 0.012;
    cycleTimeRef.current = (cycleTimeRef.current + cycleSpeed) % 1.0;

    const newY = generateHeartbeat(cycleTimeRef.current, bpm, isCrisis);
    dataPointsRef.current.push(newY);
    
    if (dataPointsRef.current.length > MAX_POINTS) {
      dataPointsRef.current.shift();
    }

    ctx.fillStyle = '#000800';
    ctx.fillRect(0, 0, width, canvasHeight);

    // Grid
    ctx.strokeStyle = ECG_COLORS.grid;
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 40) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvasHeight); ctx.stroke();
    }
    for (let y = 0; y < canvasHeight; y += 40) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
    }

    // ECG Line
    ctx.beginPath();
    ctx.strokeStyle = ECG_COLORS.line;
    ctx.lineWidth = 2.5;
    ctx.shadowBlur = 8;
    ctx.shadowColor = ECG_COLORS.glow;
    ctx.lineJoin = 'round';

    const points = dataPointsRef.current;
    // Always start from 0 to width to avoid jumping
    for (let i = 0; i < points.length; i++) {
      const x = i * STEP;
      const y = midY - (points[i] * (canvasHeight / 400));
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Leader dot at the right edge
    if (points.length > 0) {
      const lastY = midY - (points[points.length - 1] * (canvasHeight / 400));
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(width, lastY, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    frameRef.current = requestAnimationFrame(draw);
  }, []);

  useEffect(() => {
    frameRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frameRef.current);
  }, [draw]);

  return (
    <div className="relative w-full h-full bg-black border-4 border-slate-400 rounded-2xl overflow-hidden shadow-xl" dir="ltr">
      {showLabels && (
        <>
          <div className="absolute top-3 left-4 flex flex-col gap-2 z-10">
            <div className="text-[10px] md:text-xs font-mono text-green-500 uppercase tracking-widest opacity-80">
              ניטור רציף - LEAD II
            </div>
            {timeLabel && (
              <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-green-500/50 text-white font-mono text-xl shadow-lg animate-pulse">
                <span className="text-green-400">🕒</span>
                <span>{timeLabel}</span>
              </div>
            )}
          </div>
          <div className="absolute top-3 right-4 flex flex-col items-end z-10 opacity-80">
            <div className="text-[10px] md:text-xs font-mono text-green-500 uppercase">דופק (BPM)</div>
            <div className="text-2xl font-mono text-green-400 font-bold">
              {activity === ActivityLevel.CRISIS ? '???' : BPM_MAP[activity]}
            </div>
          </div>
        </>
      )}
      <canvas 
        ref={canvasRef} 
        width={1200} 
        height={height} 
        className="w-full h-full"
      />
    </div>
  );
};

export default ECGMonitor;
