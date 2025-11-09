import React, { useState, useEffect, useMemo } from 'react';
import { EventType, EventData } from '../types';
import { Icon } from './Icon';
import { IconPicker } from './IconPicker';
import { tailwindColorToHex } from '../utils';

interface ManageEventTypesModalProps {
    eventTypes: EventType[];
    eventData: EventData;
    onSave: (updatedEventTypes: EventType[]) => void;
    onClose: () => void;
}

const colors = [
    { name: 'Blue', value: 'bg-blue-500', text: 'text-white' },
    { name: 'Green', value: 'bg-green-500', text: 'text-white' },
    { name: 'Orange', value: 'bg-orange-500', text: 'text-white' },
    { name: 'Purple', value: 'bg-purple-500', text: 'text-white' },
    { name: 'Pink', value: 'bg-pink-500', text: 'text-white' },
    { name: 'Teal', value: 'bg-teal-500', text: 'text-white' },
    { name: 'Red', value: 'bg-red-500', text: 'text-white' },
    { name: 'Indigo', value: 'bg-indigo-500', text: 'text-white' },
    { name: 'Yellow', value: 'bg-yellow-400', text: 'text-black' },
    { name: 'Gray', value: 'bg-gray-400', text: 'text-white' },
];


export const ManageEventTypesModal: React.FC<ManageEventTypesModalProps> = ({ eventTypes, eventData, onSave, onClose }) => {
    const [localEventTypes, setLocalEventTypes] = useState<EventType[]>(JSON.parse(JSON.stringify(eventTypes)));
    const [newEventType, setNewEventType] = useState<Omit<EventType, 'id' | 'isDeletable'>>({ name: '', icon: 'question-mark-circle', color: 'bg-gray-400', textColor: 'text-white' });
    const [isIconPickerOpen, setIconPickerOpen] = useState<boolean>(false);
    const [editingIconForId, setEditingIconForId] = useState<string | 'new' | null>(null);

    const usedEventTypeIds = useMemo(() => {
        const ids = new Set<string>();
        for (const info of eventData.values()) {
            ids.add(info.typeId);
        }
        return ids;
    }, [eventData]);

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [onClose]);
    
    const handleOpenIconPicker = (id: string | 'new') => {
        setEditingIconForId(id);
        setIconPickerOpen(true);
    };
    
    const handleSelectIcon = (iconName: string) => {
        if (editingIconForId === 'new') {
            setNewEventType(prev => ({...prev, icon: iconName}));
        } else if (editingIconForId) {
            handleUpdateType(editingIconForId, 'icon', iconName);
        }
    };

    const handleUpdateType = (id: string, field: keyof EventType, value: any) => {
        setLocalEventTypes(prev =>
            prev.map(et => (et.id === id ? { ...et, [field]: value } : et))
        );
    };
    
    const handleColorChange = (id: string, color: {value: string, text: string}) => {
        setLocalEventTypes(prev =>
            prev.map(et => (et.id === id ? { ...et, color: color.value, textColor: color.text } : et))
        );
    }
    
     const handleNewColorChange = (color: {value: string, text: string}) => {
        setNewEventType(prev => ({ ...prev, color: color.value, textColor: color.text }));
    }

    const handleDeleteType = (id: string) => {
        setLocalEventTypes(prev => prev.filter(et => et.id !== id));
    };

    const handleAddType = () => {
        if (newEventType.name.trim() === '') {
            alert('Názov typu udalosti nemôže byť prázdny.');
            return;
        }
        const newType: EventType = {
            id: `custom-${Date.now()}`,
            ...newEventType,
            isDeletable: true,
        };
        setLocalEventTypes(prev => [...prev, newType]);
        setNewEventType({ name: '', icon: 'question-mark-circle', color: 'bg-gray-400', textColor: 'text-white' });
    };
    
    const handleSave = () => {
        onSave(localEventTypes);
    };

    return (
        <>
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4 print-hidden" onClick={onClose}>
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 relative animate-fade-in max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Spravovať typy udalostí</h2>

                    <div className="overflow-y-auto pr-2 flex-grow space-y-3">
                        {localEventTypes.map(type => (
                            <div key={type.id} className="flex items-center gap-3 p-2 border rounded-lg">
                                <button onClick={() => handleOpenIconPicker(type.id)} className="p-2 bg-gray-100 rounded-md hover:bg-gray-200">
                                    <Icon 
                                        iconName={type.icon} 
                                        className="w-7 h-7" 
                                        color={tailwindColorToHex(type.color)}
                                    />
                                </button>
                                <input type="text" value={type.name} onChange={e => handleUpdateType(type.id, 'name', e.target.value)} className="flex-grow p-2 border rounded-md" />
                                <div className="flex gap-1">
                                    {colors.map(c => (
                                        <button key={c.name} onClick={() => handleColorChange(type.id, c)} className={`w-6 h-6 rounded-full ${c.value} border-2 ${type.color === c.value ? 'border-black' : 'border-transparent'}`}></button>
                                    ))}
                                </div>
                                <button 
                                    onClick={() => handleDeleteType(type.id)}
                                    disabled={!type.isDeletable || usedEventTypeIds.has(type.id)}
                                    title={!type.isDeletable ? "Tento typ nie je možné zmazať" : usedEventTypeIds.has(type.id) ? "Tento typ je použitý v kalendári" : "Zmazať"}
                                    className="p-2 text-red-500 hover:bg-red-100 rounded-full disabled:text-gray-300 disabled:hover:bg-transparent disabled:cursor-not-allowed">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg>
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 pt-4 border-t">
                        <h3 className="text-lg font-semibold mb-2">Pridať nový typ</h3>
                        <div className="flex items-center gap-3 p-2 border rounded-lg bg-gray-50">
                            <button onClick={() => handleOpenIconPicker('new')} className="p-2 bg-white rounded-md hover:bg-gray-100 border">
                                <Icon 
                                    iconName={newEventType.icon} 
                                    className="w-7 h-7" 
                                    color={tailwindColorToHex(newEventType.color)}
                                />
                            </button>
                            <input type="text" placeholder="Názov" value={newEventType.name} onChange={e => setNewEventType(p => ({...p, name: e.target.value}))} className="flex-grow p-2 border rounded-md" />
                            <div className="flex gap-1">
                                {colors.map(c => (
                                    <button key={c.name} onClick={() => handleNewColorChange(c)} className={`w-6 h-6 rounded-full ${c.value} border-2 ${newEventType.color === c.value ? 'border-black' : 'border-transparent'}`}></button>
                                ))}
                            </div>
                            <button onClick={handleAddType} className="p-2 bg-green-500 text-white hover:bg-green-600 rounded-lg">Pridať</button>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <button onClick={onClose} className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300">Zrušiť</button>
                        <button onClick={handleSave} className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700">Uložiť zmeny</button>
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
            </div>
            {isIconPickerOpen && (
                <IconPicker 
                    onSelectIcon={handleSelectIcon}
                    onClose={() => setIconPickerOpen(false)}
                />
            )}
        </>
    );
};
