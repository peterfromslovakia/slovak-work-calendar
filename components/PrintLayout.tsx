import React from 'react';
import { MONTH_NAMES_SK } from '../constants';
import { EventData, EventType, EventInfo } from '../types';
import { Icon } from './Icon';
import { tailwindColorToHex } from '../utils';

interface PrintLayoutProps {
  title: string;
  name: string;
  organizationName: string;
  year: number;
  baseAllowance: number;
  carryOverDays: number;
  totalAllowance: number;
  usedDays: number;
  remainingDays: number;
  eventTypes: EventType[];
  eventData: EventData;
  holidays: Map<string, string>;
  eventTypeMap: Map<string, EventType>;
}

export const PrintLayout: React.FC<PrintLayoutProps> = ({ 
    title, name, organizationName, year, 
    baseAllowance, carryOverDays, totalAllowance, usedDays, remainingDays,
    eventTypes, eventData, eventTypeMap 
}) => {
    
    const eventsByMonth = Array.from(eventData.entries())
        .filter(([date]) => date.startsWith(year.toString()))
        .sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime())
        .reduce((acc, [date, info]) => {
            const monthIndex = new Date(date).getMonth();
            const monthName = MONTH_NAMES_SK[monthIndex];
            if (!acc[monthName]) {
                acc[monthName] = [];
            }
            acc[monthName].push({ date, ...info });
            return acc;
        }, {} as Record<string, Array<{date: string} & EventInfo>>);

    const vacationDaysList = Array.from(eventData.entries())
        .filter(([, info]) => info.typeId === 'vacation')
        .filter(([date]) => date.startsWith(year.toString()))
        .sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime())
        .map(([date, info]) => {
            const d = new Date(date);
            const weekday = d.toLocaleDateString('sk-SK', { weekday: 'long' });
            const capitalizedWeekday = weekday.charAt(0).toUpperCase() + weekday.slice(1);
            return {
                date: `${capitalizedWeekday}, ${d.toLocaleDateString('sk-SK', { day: '2-digit', month: '2-digit', year: 'numeric'})}`,
                duration: info.duration === 1 ? 'Celý deň' : 'Pol dňa',
                note: info.note
            };
        });


  return (
    <div style={{ width: '1123px', height: '794px', fontFamily:'Arial, sans-serif', wordSpacing: 'normal', letterSpacing: 'normal' }} className="bg-gray-50 p-8 flex flex-col text-gray-800">
        <header className="flex justify-between items-center pb-4 border-b border-gray-200">
            <div>
                <h1 className="text-2xl font-bold">{title}</h1>
                <p className="text-gray-600 mt-1">{name} / {organizationName}</p>
            </div>
            <h2 className="text-xl font-semibold text-gray-500">Pracovný Kalendár</h2>
        </header>

        <main className="flex-grow grid grid-cols-3 gap-6 mt-6">
            <div className="col-span-1 flex flex-col gap-6">
                <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200/80">
                    <h3 className="text-base font-bold mb-2 border-b pb-2">Súhrn dovolenky</h3>
                    <table className="w-full text-sm">
                        <tbody>
                            <tr><td className="py-1.5">Základný nárok:</td><td className="font-bold text-right">{baseAllowance} dní</td></tr>
                            <tr><td className="py-1.5">Prenos z min. roka:</td><td className="font-bold text-right">{carryOverDays} dní</td></tr>
                            <tr className="border-t"><td className="font-bold pt-2 py-1.5">Spolu nárok:</td><td className="font-bold text-right pt-2">{totalAllowance} dní</td></tr>
                            <tr><td className="py-1.5 text-blue-600">Vyčerpané:</td><td className="font-bold text-right text-blue-600">{usedDays} dní</td></tr>
                            <tr className="border-t"><td className="font-bold text-green-600 pt-2 py-1.5">Zostatok:</td><td className="font-bold text-green-600 text-right pt-2">{remainingDays} dní</td></tr>
                        </tbody>
                    </table>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200/80 flex-grow">
                    <h3 className="text-base font-bold text-gray-800 border-b pb-2 mb-3">Podklady pre mzdovú učtáreň</h3>
                    <p className="text-sm font-semibold mb-2 text-gray-600">Čerpanie dovolenky:</p>
                    <div className="text-xs space-y-1 overflow-y-auto max-h-[200px] pr-2">
                        {vacationDaysList.length > 0 ? (
                            vacationDaysList.map((item, index) => (
                                <p key={index} className="p-1.5 rounded bg-blue-50 border-l-2 border-blue-500">
                                   <span className="font-semibold">{item.date}:</span> {item.duration}
                                </p>
                            ))
                        ) : (
                            <p className="text-gray-500 text-center py-4">V tomto roku nebola čerpaná žiadna dovolenka.</p>
                        )}
                    </div>
                     {vacationDaysList.length > 0 && (
                        <div className="mt-3 pt-3 border-t font-semibold text-sm">
                            <div className="flex justify-between">
                                <span>Spolu čerpané:</span>
                                <span>{usedDays} dní</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
            <div className="col-span-2 bg-white p-4 rounded-xl shadow-md border border-gray-200/80 overflow-y-auto">
                <h3 className="text-base font-bold text-gray-800 border-b pb-2 mb-3">Zoznam všetkých udalostí</h3>
                <div className="space-y-4 pr-2">
                     {Object.entries(eventsByMonth).length > 0 ? 
                        Object.entries(eventsByMonth).map(([monthName, events]) => (
                            <div key={monthName}>
                                <h4 className="font-semibold text-sm mb-2">{monthName} {year}</h4>
                                <div className="space-y-2 pl-2">
                                    {events.map((event, index) => {
                                        const eventType = eventTypeMap.get(event.typeId);
                                        if (!eventType) return null;
                                        const d = new Date(event.date);
                                        const weekday = d.toLocaleDateString('sk-SK', { weekday: 'long' });
                                        const capitalizedWeekday = weekday.charAt(0).toUpperCase() + weekday.slice(1);
                                        const dateFormatted = `${capitalizedWeekday}, ${d.toLocaleDateString('sk-SK', { day: 'numeric', month: 'long'})}`;
                                        return (
                                            <div key={index} className="flex items-start gap-3 text-xs p-2 rounded-lg bg-gray-50/70 border">
                                                <div className="w-28 font-semibold text-gray-600">{dateFormatted}</div>
                                                <div className="flex items-center gap-2 font-semibold" style={{color: tailwindColorToHex(eventType.color)}}>
                                                    <Icon iconName={eventType.icon} className="w-4 h-4" color={tailwindColorToHex(eventType.color)} />
                                                    <span>{eventType.name}</span>
                                                </div>
                                                <div className="text-gray-500 font-medium">({event.duration === 1 ? 'Celý deň' : 'Pol dňa'})</div>
                                                {event.note && <div className="text-gray-500 italic border-l-2 pl-2 ml-2">"{event.note}"</div>}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )) :
                        <p className="text-gray-500 text-center py-10">V tomto roku neboli zaznamenané žiadne udalosti.</p>
                    }
                </div>
            </div>
        </main>
        
        <footer className="w-full mt-6 pt-4 border-t border-gray-200 flex justify-around items-end text-center text-xs text-gray-500">
            <div>
                 <p className="mt-6">Dátum: ...........................................</p>
            </div>
            <div>
                <p className="h-6 border-b border-gray-400 w-56"></p>
                <p className="font-semibold mt-1">Podpis zamestnanca</p>
            </div>
            <div>
                <p className="h-6 border-b border-gray-400 w-56"></p>
                <p className="font-semibold mt-1">Podpis nadriadeného</p>
            </div>
        </footer>
    </div>
  );
};