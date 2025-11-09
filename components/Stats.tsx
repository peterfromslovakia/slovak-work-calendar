import React from 'react';

interface StatsProps {
  totalAllowance: number;
  usedDays: number;
  remainingDays: number;
}

const StatCard: React.FC<{ title: string; value: string; color: string; main?: boolean }> = ({ title, value, color, main = false }) => (
  <div className={`p-6 rounded-2xl ${color} flex flex-col justify-between h-36`}>
    <div>
        <div className="text-lg font-semibold opacity-80">{title}</div>
    </div>
    <div className="text-right">
        <span className="text-5xl font-bold">{value}</span>
        <span className="text-lg font-semibold ml-1.5 opacity-80">dní</span>
    </div>
  </div>
);

export const Stats: React.FC<StatsProps> = ({ totalAllowance, usedDays, remainingDays }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-white print-hidden">
      <StatCard title="Spolu dní" value={String(totalAllowance)} color="bg-gray-500" />
      <StatCard title="Vyčerpané" value={String(usedDays)} color="bg-blue-500" />
      <StatCard title="Zostatok" value={String(remainingDays)} color="bg-green-600" />
    </div>
  );
};