import React, { useState } from 'react';
import { CategoryOutflow } from '../types';

interface ChartsScreenProps {
  netWorth: number;
  cashTotal: number;
  investedTotal: number;
  outflows: CategoryOutflow[];
  onOpenAddSpend: () => void;
}

type Timeframe = '1W' | '1M' | '3M' | '1Y' | 'ALL';

interface ChartPoint {
  label: string;
  value: number;
  inflow: number;
  outflow: number;
}

const TIMEFRAME_DATA: Record<Timeframe, ChartPoint[]> = {
  '1W': [
    { label: 'Mon', value: 46100, inflow: 0, outflow: 45 },
    { label: 'Tue', value: 46250, inflow: 200, outflow: 50 },
    { label: 'Wed', value: 46080, inflow: 0, outflow: 170 },
    { label: 'Thu', value: 45950, inflow: 0, outflow: 130 },
    { label: 'Fri', value: 49800, inflow: 3850, outflow: 0 },
    { label: 'Sat', value: 49120, inflow: 0, outflow: 680 },
    { label: 'Sun', value: 48290.50, inflow: 0, outflow: 830 },
  ],
  '1M': [
    { label: 'Apr 01', value: 44200, inflow: 500, outflow: 300 },
    { label: 'Apr 05', value: 45100, inflow: 1200, outflow: 300 },
    { label: 'Apr 10', value: 44800, inflow: 0, outflow: 300 },
    { label: 'Apr 15', value: 48650, inflow: 3850, outflow: 0 },
    { label: 'Apr 17', value: 48290.50, inflow: 0, outflow: 360 },
  ],
  '3M': [
    { label: 'Feb', value: 39500, inflow: 7700, outflow: 3400 },
    { label: 'Mar', value: 43800, inflow: 7700, outflow: 3400 },
    { label: 'Apr', value: 48290.50, inflow: 7700, outflow: 2450 },
  ],
  '1Y': [
    { label: 'May 25', value: 29000, inflow: 6500, outflow: 3200 },
    { label: 'Aug 25', value: 34200, inflow: 6800, outflow: 3100 },
    { label: 'Nov 25', value: 38900, inflow: 7200, outflow: 3300 },
    { label: 'Feb 26', value: 43500, inflow: 7700, outflow: 3100 },
    { label: 'Apr 26', value: 48290.50, inflow: 7700, outflow: 2450 },
  ],
  'ALL': [
    { label: '2023', value: 16500, inflow: 50000, outflow: 35000 },
    { label: '2024', value: 28400, inflow: 65000, outflow: 42000 },
    { label: '2025', value: 41200, inflow: 82000, outflow: 48000 },
    { label: '2026', value: 48290.50, inflow: 30800, outflow: 14200 },
  ],
};

export const ChartsScreen: React.FC<ChartsScreenProps> = ({
  netWorth,
  cashTotal,
  investedTotal,
  outflows,
  onOpenAddSpend,
}) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe>('1M');
  const [activePointIndex, setActivePointIndex] = useState<number | null>(null);

  const points = TIMEFRAME_DATA[selectedTimeframe];
  const activePoint = activePointIndex !== null ? points[activePointIndex] : points[points.length - 1];

  const minVal = Math.min(...points.map((p) => p.value)) * 0.96;
  const maxVal = Math.max(...points.map((p) => p.value)) * 1.04;
  const range = maxVal - minVal || 1;

  // Generate SVG path coordinates (width 360, height 160)
  const svgWidth = 360;
  const svgHeight = 160;
  const paddingX = 20;
  const paddingY = 24;

  const getCoordinates = (p: ChartPoint, i: number) => {
    const x = paddingX + (i / (points.length - 1)) * (svgWidth - paddingX * 2);
    const y = svgHeight - paddingY - ((p.value - minVal) / range) * (svgHeight - paddingY * 2);
    return { x, y };
  };

  const linePoints = points.map(getCoordinates);
  const pathD = linePoints.reduce(
    (acc, pt, i) => (i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`),
    ''
  );
  const areaD = `${pathD} L ${linePoints[linePoints.length - 1].x} ${svgHeight} L ${linePoints[0].x} ${svgHeight} Z`;

  return (
    <div className="flex flex-col w-full px-margin space-y-space-lg pb-12">
      {/* Top Chart Card */}
      <div className="relative w-full rounded-3xl bg-surface-container-lowest p-space-lg shadow-xl overflow-hidden mt-space-sm border border-surface-container-high/40">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-label-sm text-outline uppercase tracking-wider">Growth Trajectory</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <h2 className="font-numeric-hero text-numeric-hero text-on-surface tracking-tight">
                ${activePoint.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h2>
            </div>
            <span className="text-xs text-outline font-medium">{activePoint.label} · Verified Aura Sync</span>
          </div>

          <div className="flex flex-col items-end">
            <span className="inline-flex items-center gap-0.5 px-2.5 py-1 rounded-full bg-primary-fixed/60 text-primary font-semibold text-xs">
              <span className="material-symbols-outlined text-[14px]">trending_up</span>
              +18.4% YTD
            </span>
            <span className="text-[11px] text-outline mt-1">CAGR +14.2%</span>
          </div>
        </div>

        {/* Timeframe Selector */}
        <div className="flex items-center justify-between p-1 rounded-xl bg-surface-container-low mt-space-md gap-1">
          {(['1W', '1M', '3M', '1Y', 'ALL'] as Timeframe[]).map((tf) => (
            <button
              key={tf}
              type="button"
              onClick={() => {
                setSelectedTimeframe(tf);
                setActivePointIndex(null);
              }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedTimeframe === tf
                  ? 'bg-surface-container-lowest text-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>

        {/* Interactive SVG Chart */}
        <div className="relative w-full h-44 mt-4 select-none">
          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full overflow-visible">
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#006948" stopOpacity="0.28" />
                <stop offset="100%" stopColor="#006948" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid horizontal guidelines */}
            <line x1={paddingX} y1={svgHeight * 0.25} x2={svgWidth - paddingX} y2={svgHeight * 0.25} stroke="#dae2fd" strokeDasharray="3 3" opacity="0.6" />
            <line x1={paddingX} y1={svgHeight * 0.65} x2={svgWidth - paddingX} y2={svgHeight * 0.65} stroke="#dae2fd" strokeDasharray="3 3" opacity="0.6" />

            {/* Area fill */}
            <path d={areaD} fill="url(#chartGradient)" />

            {/* Path line */}
            <path d={pathD} fill="none" stroke="#006948" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

            {/* Interactive Data Dots */}
            {linePoints.map((pt, idx) => {
              const isSelected = (activePointIndex === null && idx === linePoints.length - 1) || activePointIndex === idx;
              return (
                <g key={idx} className="cursor-pointer" onClick={() => setActivePointIndex(idx)}>
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isSelected ? 6 : 3.5}
                    className={`transition-all ${
                      isSelected
                        ? 'fill-primary stroke-white stroke-2 shadow-md'
                        : 'fill-white stroke-primary stroke-2 hover:r-5'
                    }`}
                  />
                  {isSelected && (
                    <circle cx={pt.x} cy={pt.y} r={12} className="fill-primary/20 animate-ping" />
                  )}
                </g>
              );
            })}
          </svg>

          {/* X-axis labels */}
          <div className="flex justify-between px-2 pt-1 text-[11px] text-outline font-medium">
            {points.map((p, i) => (
              <span
                key={i}
                className={`cursor-pointer transition-colors ${
                  (activePointIndex === null && i === points.length - 1) || activePointIndex === i
                    ? 'text-primary font-bold'
                    : ''
                }`}
                onClick={() => setActivePointIndex(i)}
              >
                {p.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Cashflow Inflow vs Outflow Metric Cards */}
      <div className="grid grid-cols-2 gap-space-sm">
        <div className="p-space-md rounded-3xl bg-surface-container-lowest shadow-sm border border-surface-container-high/40 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-outline uppercase tracking-wider">Monthly Inflow</span>
            <div className="w-8 h-8 rounded-full bg-primary-fixed/40 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[18px]">south_west</span>
            </div>
          </div>
          <div className="mt-2">
            <span className="font-numeric-metric text-numeric-metric text-primary font-bold">+$7,700.00</span>
            <div className="text-xs text-outline mt-0.5">2 Payroll Directs</div>
          </div>
        </div>

        <div className="p-space-md rounded-3xl bg-surface-container-lowest shadow-sm border border-surface-container-high/40 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-outline uppercase tracking-wider">Monthly Outflow</span>
            <div className="w-8 h-8 rounded-full bg-secondary-fixed/40 flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-[18px]">north_east</span>
            </div>
          </div>
          <div className="mt-2">
            <span className="font-numeric-metric text-numeric-metric text-on-surface font-bold">-$2,450.00</span>
            <div className="text-xs text-outline mt-0.5">38 Transactions</div>
          </div>
        </div>
      </div>

      {/* Net Savings Surplus Highlight */}
      <div className="w-full rounded-3xl p-space-md bg-gradient-to-r from-primary to-primary-container text-on-primary shadow-lg flex items-center justify-between">
        <div className="flex flex-col">
          <span className="font-label-sm uppercase tracking-wider text-primary-fixed font-bold">
            Net Savings Surplus
          </span>
          <h3 className="text-2xl font-bold font-numeric-hero mt-0.5">+$5,250.00</h3>
          <span className="text-xs text-on-primary-container/80 mt-0.5">
            68.1% Savings Rate · In top 5% of Aura peers
          </span>
        </div>
        <button
          type="button"
          onClick={onOpenAddSpend}
          className="px-4 py-2 rounded-xl bg-surface-container-lowest text-primary font-semibold text-xs shadow-sm hover:opacity-90 active:scale-95 transition-all"
        >
          Add Spend
        </button>
      </div>

      {/* Detailed Outflows Distribution */}
      <div className="w-full rounded-3xl p-space-lg bg-surface-container-lowest shadow-sm flex flex-col space-y-space-md border border-surface-container-high/40">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-label-sm text-outline uppercase tracking-wider">Deep Breakdown</span>
            <h3 className="font-headline-md text-headline-md text-on-surface">Category Distribution</h3>
          </div>
          <span className="text-xs text-outline font-semibold">April 2026</span>
        </div>

        {/* Visual Progress Bars with Amounts */}
        <div className="space-y-3">
          {outflows.map((item) => (
            <div key={item.name} className="space-y-1">
              <div className="flex items-center justify-between text-xs font-semibold">
                <div className="flex items-center gap-2 text-on-surface">
                  <span className={`w-2.5 h-2.5 rounded-full ${item.dotColorClass}`} />
                  <span>{item.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-outline font-normal">{item.percentage}%</span>
                  <span className="text-on-surface font-bold font-mono">
                    ${item.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
              <div className="w-full h-2 rounded-full bg-surface-container-high overflow-hidden">
                <div
                  className={`h-full ${item.colorClass} rounded-full transition-all duration-500`}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
