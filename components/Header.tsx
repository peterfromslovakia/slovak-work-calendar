import React from 'react';

interface HeaderProps {
  name: string;
  setName: (name: string) => void;
  organizationName: string;
  setOrganizationName: (name: string) => void;
  currentYear: number;
  setCurrentYear: (year: number | ((prevYear: number) => number)) => void;
}

export const Header: React.FC<HeaderProps> = ({ name, setName, organizationName, setOrganizationName, currentYear, setCurrentYear }) => {
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
    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 tracking-tight">Pracovný Kalendár</h1>
        <div className="flex items-center gap-2 mt-2">
            <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                className="text-lg text-gray-600 bg-transparent outline-none w-48"
                placeholder="Meno a Priezvisko"
            />
            <span className="text-lg text-gray-400">/</span>
             <input 
                type="text" 
                value={organizationName} 
                onChange={(e) => setOrganizationName(e.target.value)}
                className="text-lg text-gray-600 bg-transparent outline-none w-48"
                placeholder="Názov organizácie"
            />
        </div>
      </div>
      <div className="flex items-center gap-2 self-start sm:self-center">
        <button onClick={() => handleYearChange(-1)} disabled={currentYear <= 2025} className="p-2 rounded-full bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm border border-gray-200">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
        </button>
        <span className="text-xl font-bold w-24 text-center text-gray-700">{currentYear}</span>
        <button onClick={() => handleYearChange(1)} disabled={currentYear >= 2030} className="p-2 rounded-full bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm border border-gray-200">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
        </button>
      </div>
    </header>
  );
};