
import React from 'react';

interface HeaderProps {
  name: string;
  setName: (name: string) => void;
  organizationName: string;
  setOrganizationName: (name: string) => void;
  currentYear: number;
  setCurrentYear: (year: number | ((prevYear: number) => number)) => void;
  totalAllowance: number;
  usedDays: number;
  remainingDays: number;
}

const StatCard: React.FC<{ title: string; value: number; color: string }> = ({ title, value, color }) => (
  <div className={`p-4 rounded-xl ${color}`}>
    <div className="text-sm font-medium opacity-80">{title}</div>
    <div className="text-2xl lg:text-3xl font-bold">{value}</div>
  </div>
);

export const Header: React.FC<HeaderProps> = ({ name, setName, organizationName, setOrganizationName, currentYear, setCurrentYear, totalAllowance, usedDays, remainingDays }) => {
  const handleYearChange = (increment: number) => {
    setCurrentYear(prev => {
      const newYear = prev + increment;
      if (newYear >= 2025 && newYear <= 2030) {
        return newYear;
      }
      return prev;
    });
  };

  return (
    <header className="mb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 tracking-tight">Pracovný Kalendár</h1>
            <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                className="text-lg text-gray-600 bg-transparent border-b-2 border-transparent focus:border-blue-500 outline-none transition-colors duration-300 ease-in-out mt-1"
                placeholder="Meno a Priezvisko"
            />
             <input 
                type="text" 
                value={organizationName} 
                onChange={(e) => setOrganizationName(e.target.value)}
                className="text-md text-gray-500 bg-transparent border-b-2 border-transparent focus:border-blue-500 outline-none transition-colors duration-300 ease-in-out"
                placeholder="Názov organizácie"
            />
        </div>
        <div className="flex items-center gap-2 bg-gray-100/80 p-1.5 rounded-xl">
          <button onClick={() => handleYearChange(-1)} disabled={currentYear <= 2025} className="p-2 rounded-lg bg-white hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
          </button>
          <span className="text-lg font-bold w-24 text-center text-gray-700">{currentYear}</span>
          <button onClick={() => handleYearChange(1)} disabled={currentYear >= 2030} className="p-2 rounded-lg bg-white hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-white print-hidden">
        <StatCard title="Spolu dní" value={totalAllowance} color="bg-gray-400" />
        <StatCard title="Vyčerpané" value={usedDays} color="bg-blue-500" />
        <StatCard title="Zostatok" value={remainingDays} color="bg-green-600" />
      </div>
    </header>
  );
};