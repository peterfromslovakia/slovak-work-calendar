import React, { useState, useEffect } from 'react';
import { EventInfo, EventType } from '../types';
import { Icon } from './Icon';
import { tailwindColorToHex } from '../utils';

interface EventModalProps {
  date: string;
  eventTypes: EventType[];
  currentEvent?: EventInfo;
  onSave: (date: string, info: EventInfo) => void;
  onDelete: (date: string) => void;
  onClose: () => void;
}

export const EventModal: React.FC<EventModalProps> = ({ date, eventTypes, currentEvent, onSave, onDelete, onClose }) => {
  const [selectedTypeId, setSelectedTypeId] = useState<string | null>(currentEvent?.typeId || null);
  const [note, setNote] = useState<string>(currentEvent?.note || '');
  const [duration, setDuration] = useState<number>(currentEvent?.duration || 1);


  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleSave = () => {
    if (selectedTypeId) {
      onSave(date, { typeId: selectedTypeId, note, duration });
    }
  };
  
  const handleDelete = () => {
      onDelete(date);
  }

  const formattedDate = new Date(date).toLocaleDateString('sk-SK', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div 
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4 print-hidden"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <h2 className="text-xl font-bold text-gray-800 mb-1">Udalosť pre dátum</h2>
        <p className="text-gray-500 mb-4">{formattedDate}</p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Typ udalosti:</label>
            <div className="flex flex-wrap gap-2">
              {eventTypes.map(type => (
                <button
                  key={type.id}
                  onClick={() => setSelectedTypeId(type.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 text-sm font-semibold rounded-full border-2 transition-all duration-200 ${
                    selectedTypeId === type.id 
                      ? `${type.color} ${type.textColor} border-transparent shadow-md` 
                      : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <Icon 
                    iconName={type.icon} 
                    className="w-6 h-6" 
                    color={selectedTypeId === type.id ? 'currentColor' : tailwindColorToHex(type.color)}
                  />
                  {type.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Trvanie:</label>
            <div className="flex gap-2">
                <button 
                    onClick={() => setDuration(1)}
                    className={`w-full py-2 px-4 rounded-lg font-semibold border-2 transition-all ${duration === 1 ? 'bg-blue-500 text-white border-transparent' : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'}`}
                >
                    Celý deň
                </button>
                <button
                    onClick={() => setDuration(0.5)}
                    className={`w-full py-2 px-4 rounded-lg font-semibold border-2 transition-all ${duration === 0.5 ? 'bg-blue-500 text-white border-transparent' : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'}`}
                >
                    Pol dňa
                </button>
            </div>
          </div>
          
          <div>
              <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-2">Poznámka:</label>
              <textarea
                  id="note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Pridať poznámku..."
                  rows={3}
                  className="w-full p-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <button 
            onClick={handleSave} 
            disabled={!selectedTypeId}
            className="w-full flex-1 bg-blue-600 text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
          >
            Uložiť
          </button>
          {currentEvent && (
            <button 
              onClick={handleDelete} 
              className="w-full sm:w-auto bg-red-500 text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
            >
              Odstrániť udalosť
            </button>
          )}
        </div>
      </div>
       <style>{`
          @keyframes fade-in {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
          .animate-fade-in {
            animation: fade-in 0.2s ease-out forwards;
          }
        `}</style>
    </div>
  );
};
