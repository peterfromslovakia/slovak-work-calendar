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
    <div style={{ fontFamily:'Arial, sans-serif', wordSpacing: 'normal', letterSpacing: 'normal' }} className="bg-white p-6 text-gray-800 flex flex-col gap-4">
        <header className="flex justify-between items-start pb-3 border-b border-gray-200">
            <div>
                <h1 className="text-xl font-bold">{title}</h1>
                <p className="text-gray-600 mt-1 text-sm">{name} / {organizationName}</p>
            </div>
            <h2 className="text-lg font-semibold text-gray-500">Pracovný Kalendár</h2>
        </header>

        <section className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <h3 className="text-base font-bold mb-2 border-b pb-1.5">Súhrn dovolenky</h3>
            <table className="w-full text-sm">
                <tbody>
                    <tr><td className="py-0.5">Základný nárok:</td><td className="font-semibold text-right">{baseAllowance} dní</td></tr>
                    <tr><td className="py-0.5">Prenos z min. roka:</td><td className="font-semibold text-right">{carryOverDays} dní</td></tr>
                    <tr className="border-t"><td className="font-bold pt-1.5 py-0.5">Spolu nárok:</td><td className="font-bold text-right pt-1.5">{totalAllowance} dní</td></tr>
                    <tr><td className="py-0.5 text-blue-600">Vyčerpané:</td><td className="font-semibold text-right text-blue-600">{usedDays} dní</td></tr>
                    <tr className="border-t"><td className="font-bold text-green-600 pt-1.5 py-0.5">Zostatok:</td><td className="font-bold text-green-600 text-right pt-1.5">{remainingDays} dní</td></tr>
                </tbody>
            </table>
        </section>

        <section className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <h3 className="text-base font-bold text-gray-800 border-b pb-1.5 mb-2">Podklady pre mzdovú učtáreň</h3>
            <p className="text-sm font-semibold mb-2 text-gray-700">Čerpanie dovolenky:</p>
            <div className="text-xs space-y-1">
                {vacationDaysList.length > 0 ? (
                    vacationDaysList.map((item, index) => (
                        <p key={index} className="px-2 py-1.5 rounded-md bg-white border-l-4 border-blue-500 shadow-sm">
                           <span className="font-semibold">{item.date}:</span> {item.duration}
                        </p>
                    ))
                ) : (
                    <p className="text-gray-500 text-center py-2">V tomto roku nebola čerpaná žiadna dovolenka.</p>
                )}
            </div>
             {vacationDaysList.length > 0 && (
                <div className="mt-3 pt-2 border-t font-semibold text-sm">
                    <div className="flex justify-between">
                        <span>Spolu čerpané:</span>
                        <span>{usedDays} dní</span>
                    </div>
                </div>
            )}
        </section>
        
        <section className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <h3 className="text-base font-bold text-gray-800 border-b pb-1.5 mb-2">Zoznam všetkých ostatných udalostí</h3>
            <div className="space-y-3">
                 {Object.entries(eventsByMonth).filter(([,events]) => events.some(e => e.typeId !== 'vacation')).length > 0 ? 
                    Object.entries(eventsByMonth).map(([monthName, events]) => {
                        const otherEvents = events.filter(e => e.typeId !== 'vacation');
                        if (otherEvents.length === 0) return null;

                        return (
                        <div key={monthName}>
                            <h4 className="font-semibold text-sm mb-1.5">{monthName} {year}</h4>
                            <div className="space-y-1.5 pl-2">
                                {otherEvents.map((event, index) => {
                                    const eventType = eventTypeMap.get(event.typeId);
                                    if (!eventType) return null;
                                    const d = new Date(event.date);
                                    const weekday = d.toLocaleDateString('sk-SK', { weekday: 'long' });
                                    const capitalizedWeekday = weekday.charAt(0).toUpperCase() + weekday.slice(1);
                                    const dateFormatted = `${capitalizedWeekday}, ${d.toLocaleDateString('sk-SK', { day: 'numeric', month: 'long'})}`;
                                    return (
                                        <div key={index} className="flex items-start gap-3 text-xs p-1.5 rounded-md bg-white border shadow-sm">
                                            <div className="w-32 font-semibold text-gray-600">{dateFormatted}</div>
                                            <div className="flex items-center gap-2 font-semibold" style={{color: tailwindColorToHex(eventType.color)}}>
                                                <Icon iconName={eventType.icon} className="w-4 h-4" color={tailwindColorToHex(eventType.color)} />
                                                <span>{eventType.name}</span>
                                            </div>
                                            <div className="text-gray-600 font-medium">({event.duration === 1 ? 'Celý deň' : 'Pol dňa'})</div>
                                            {event.note && <div className="text-gray-500 italic border-l-2 pl-2 ml-2">"{event.note}"</div>}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}) :
                    <p className="text-gray-500 text-center py-4">Žiadne iné udalosti neboli zaznamenané.</p>
                }
            </div>
        </section>
        
        <footer className="w-full mt-auto pt-6 flex justify-around items-end text-center text-xs text-gray-600">
            <div>
                 <p className="mt-6">Dátum: .......................................</p>
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