import React from 'react';
import { AVAILABLE_ICONS } from '../constants';
import { Icon } from './Icon';

interface IconPickerProps {
    onSelectIcon: (iconName: string) => void;
    onClose: () => void;
}

export const IconPicker: React.FC<IconPickerProps> = ({ onSelectIcon, onClose }) => {
    
    const handleSelect = (iconName: string) => {
        onSelectIcon(iconName);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div 
                className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 relative animate-fade-in max-h-[70vh] flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <h3 className="text-lg font-bold text-gray-800 mb-4">Vyberte ikonu</h3>
                <div className="grid grid-cols-6 md:grid-cols-8 gap-4 overflow-y-auto pr-2">
                    {AVAILABLE_ICONS.map(iconName => (
                        <button
                            key={iconName}
                            onClick={() => handleSelect(iconName)}
                            className="flex items-center justify-center p-3 aspect-square rounded-lg bg-gray-100 hover:bg-blue-100 hover:text-blue-600 transition-all duration-200"
                            title={iconName}
                        >
                            <Icon iconName={iconName} className="w-8 h-8" />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};