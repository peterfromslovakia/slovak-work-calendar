import React, { useMemo } from 'react';
import { MONTH_NAMES_SK, DAY_NAMES_SK, SLOVAK_NAME_DAYS } from '../constants';
import { EventData, EventType } from '../types';
import { Icon } from './Icon';
import { tailwindColorToHex } from '../utils';

interface CalendarProps {
  year: number;
  eventData: EventData;
  eventTypeMap: Map<string, EventType>;
  holidays: Map<string, string>;
  onDayClick: (date: string) => void;
  showNameDays: boolean;
  showHolidays: boolean;
}

const MonthView: React.FC<{
  year: number;
  month: number;
  eventData: EventData;
  eventTypeMap: Map<string, EventType>;
  holidays: Map<string, string>;
  onDayClick: (date: string) => void;
  showNameDays: boolean;
  showHolidays: boolean;
}> = ({ year, month, eventData, eventTypeMap, holidays, onDayClick, showNameDays, showHolidays }) => {
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const startOffset = (firstDayOfMonth === 0) ? 6 : firstDayOfMonth - 1; 
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const vacationInMonth = useMemo(() => {
    const monthStr = String(month + 1).padStart(2, '0');
    return Array.from(eventData.entries())
      .filter(([date, info]) => 
          date.startsWith(`${year}-${monthStr}`) && info.typeId === 'vacation'
      )
      .reduce((sum, [, info]) => sum + (info.duration || 1), 0);
  }, [eventData, year, month]);


  const dayCells = [];
  for (let i = 0; i < startOffset; i++) {
    dayCells.push(<div key={`empty-start-${i}`} className="border-r border-b border-gray-200/50"></div>);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const monthStr = String(month + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const dateString = `${year}-${monthStr}-${dayStr}`;
    const nameDayKey = `${monthStr}-${dayStr}`;
    const dayOfWeek = date.getDay();
    
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const isHoliday = holidays.has(dateString);
    const eventInfo = eventData.get(dateString);
    const eventType = eventInfo ? eventTypeMap.get(eventInfo.typeId) : null;
    const isSelectable = !isWeekend && !isHoliday;

    const hasExtraContent = showNameDays || showHolidays;
    const dayHeightClass = hasExtraContent ? 'h-24' : 'h-18';

    let dayClasses = `relative p-1.5 ${dayHeightClass} flex flex-col border-r border-b border-gray-200/50 transition-all duration-200 ease-in-out overflow-hidden`;
    
    if (isWeekend || isHoliday) {
      dayClasses += " bg-red-50/50";
    }
    
    if (isSelectable) {
      dayClasses += " cursor-pointer hover:bg-blue-100/50";
    } else {
      dayClasses += " cursor-not-allowed";
    }

    if (eventType) {
      const ringColor = eventType.color.replace('bg-', 'ring-');
      dayClasses += ` ${ringColor} ring-2`; // More prominent ring
    }
    
    let dayNumberColorClass = "font-semibold";
    if (isWeekend || isHoliday) {
        dayNumberColorClass += " text-red-500";
    } else if (eventType) {
        dayNumberColorClass += ` ${eventType.color.replace('bg-','text-')}`;
    } else {
        dayNumberColorClass += " text-gray-700";
    }
    
    const holidayName = holidays.get(dateString);
    const nameDay = SLOVAK_NAME_DAYS[nameDayKey];
    const eventNote = eventInfo?.note;
    
    const title = [
      holidayName,
      nameDay,
      eventType ? `${eventType.name}${eventInfo?.duration === 0.5 ? ' (Pol dňa)' : ''}${eventNote ? `: ${eventNote}`: ''}` : '',
    ].filter(Boolean).join(' | ');

    dayCells.push(
      <div key={dateString} className={dayClasses} onClick={() => isSelectable && onDayClick(dateString)} title={title}>
        <div className={`text-right text-sm ${dayNumberColorClass}`}>
            {day}
        </div>

        <div className="flex-grow flex items-center justify-center">
        {eventInfo && eventType && (
            <div className="relative">
                <Icon 
                    iconName={eventType.icon} 
                    className="w-6 h-6" 
                    color={tailwindColorToHex(eventType.color)}
                />
                {eventInfo.duration === 0.5 && 
                    <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] font-bold text-gray-700 shadow-sm border border-gray-200">
                        ½
                    </span>
                }
            </div>
        )}
        </div>
        
        {hasExtraContent && (
             <div className="text-xs text-gray-600 text-center truncate">
                {showHolidays && holidayName && <span className="font-bold block text-red-600">{holidayName}</span>}
                {showNameDays && nameDay && <span className="block opacity-80">{nameDay}</span>}
            </div>
        )}
      </div>
    );
  }
  
  const totalCells = Math.ceil((startOffset + daysInMonth) / 7) * 7;
  for (let i = dayCells.length; i < totalCells; i++) {
    dayCells.push(<div key={`empty-end-${i}`} className="border-r border-b border-gray-200/50"></div>);
  }

  return (
    <div className="bg-white/50 rounded-xl shadow-md border border-gray-200/80 overflow-hidden flex flex-col">
      <h3 className="text-lg font-semibold text-center py-3 bg-gray-100/70 text-gray-700">{MONTH_NAMES_SK[month]} {year}</h3>
      <div className="grid grid-cols-7 text-center font-medium text-xs text-gray-500 border-b border-gray-200">
        {DAY_NAMES_SK.map(day => <div key={day} className="py-2 border-r border-gray-200/50 last:border-r-0">{day}</div>)}
      </div>
      <div className="grid grid-cols-7">
        {dayCells}
      </div>
      {vacationInMonth > 0 && (
          <div className="text-center text-sm font-medium text-gray-600 bg-gray-50 py-2 mt-auto border-t border-gray-200">
              Dovolenka v tomto mesiaci: <span className="font-bold text-blue-600">{vacationInMonth}</span> {vacationInMonth === 1 || vacationInMonth === 0.5 ? 'deň' : (vacationInMonth > 1 && vacationInMonth < 5 ? 'dni' : 'dní')}
          </div>
      )}
    </div>
  );
};

export const Calendar: React.FC<CalendarProps> = ({ year, eventData, eventTypeMap, holidays, onDayClick, showNameDays, showHolidays }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 calendar-grid">
      {MONTH_NAMES_SK.map((_, index) => (
        <MonthView
          key={index}
          year={year}
          month={index}
          eventData={eventData}
          eventTypeMap={eventTypeMap}
          holidays={holidays}
          onDayClick={onDayClick}
          showNameDays={showNameDays}
          showHolidays={showHolidays}
        />
      ))}
    </div>
  );
};