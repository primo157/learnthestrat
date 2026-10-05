import React from 'react';

// Visual for the Catalyst PDF.
// To use the real cover: put the image in /public (e.g. public/catalyst-cover.png)
// and pass imageSrc="/catalyst-cover.png". Without it, a styled mockup renders.
const CANDLES = [
  // [x, open, close, high, low] in a 0–100 viewBox, y grows downward
  [8, 70, 66, 62, 74], [18, 66, 68, 63, 72], [28, 68, 64, 61, 70], [38, 64, 65, 60, 69],
  [48, 65, 63, 61, 68], [58, 63, 44, 40, 64], [68, 44, 36, 31, 47], [78, 36, 30, 25, 39], [88, 30, 22, 18, 33],
];

export default function PdfCover({ imageSrc, className = '' }) {
  return (
    <div className={`relative ${className}`} style={{ perspective: '1200px' }}>
      {/* glow */}
      <div className="absolute inset-0 -z-10 bg-green-500/25 blur-3xl rounded-full scale-90"></div>

      <div className="relative" style={{ transform: 'rotateY(-12deg) rotateZ(2deg)', transformStyle: 'preserve-3d' }}>
        {/* page stack */}
        <div className="absolute inset-0 translate-x-3 translate-y-3 rounded-xl bg-slate-800 border border-green-500/10"></div>
        <div className="absolute inset-0 translate-x-1.5 translate-y-1.5 rounded-xl bg-slate-900 border border-green-500/15"></div>

        <div className="relative aspect-[3/4] rounded-xl overflow-hidden border border-green-500/40 shadow-2xl shadow-green-500/30 bg-gradient-to-br from-slate-800 via-slate-900 to-black">
          {imageSrc ? (
            <img src={imageSrc} alt="The Catalyst Guide PDF cover" className="w-full h-full object-cover" loading="eager" />
          ) : (
            <div className="h-full flex flex-col p-5 sm:p-7">
              <div className="flex items-center justify-between">
                <span className="text-[10px] sm:text-xs font-bold tracking-[0.2em] text-green-400">FREE GUIDE</span>
                <span className="text-[10px] sm:text-xs font-semibold text-gray-500">PDF</span>
              </div>

              <div className="mt-5 sm:mt-8">
                <p className="text-4xl sm:text-6xl font-black leading-none bg-gradient-to-r from-green-200 via-green-400 to-green-500 bg-clip-text text-transparent">7</p>
                <p className="mt-2 text-lg sm:text-2xl font-black leading-tight tracking-tight text-white">
                  Catalysts Every Options Trader Should Know
                </p>
              </div>

              <svg viewBox="0 0 100 80" className="mt-auto w-full h-auto" aria-hidden="true">
                <line x1="0" y1="52" x2="100" y2="52" stroke="#22c55e" strokeOpacity="0.25" strokeDasharray="2 2" strokeWidth="0.6" />
                <rect x="53" y="10" width="10" height="66" fill="#22c55e" fillOpacity="0.07" />
                {CANDLES.map(([x, open, close, high, low]) => {
                  const up = close < open;
                  const color = up ? '#4ade80' : '#64748b';
                  return (
                    <g key={x}>
                      <line x1={x} y1={high} x2={x} y2={low} stroke={color} strokeWidth="0.8" />
                      <rect x={x - 2.5} y={Math.min(open, close)} width="5" height={Math.max(Math.abs(open - close), 1)} fill={color} rx="0.5" />
                    </g>
                  );
                })}
              </svg>

              <div className="mt-3 pt-3 border-t border-green-500/20">
                <p className="text-[10px] sm:text-xs text-gray-400 leading-snug">
                  Catalysts bring the volatility.<br />
                  <span className="text-green-300 font-semibold">Price action confirms the trade.</span>
                </p>
                <p className="mt-2 text-[10px] sm:text-xs font-bold tracking-wider text-gray-600">LEARNTHESTRAT.COM</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
