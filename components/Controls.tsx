import React, { ChangeEvent } from 'react';
import { ToggleSwitch } from './ToggleSwitch';
import { NumberInputWithSteppers } from './NumberInputWithSteppers';

interface ControlsProps {
  baseAllowance: number;
  setBaseAllowance: (days: number) => void;
  carryOverDays: number;
  setCarryOverDays: (days: number) => void;
  showNameDays: boolean;
  setShowNameDays: (show: boolean) => void;
  showHolidays: boolean;
  setShowHolidays: (show: boolean) => void;
  onExportData: () => void;
  onImportData: (event: ChangeEvent<HTMLInputElement>) => void;
  onManageEventTypes: () => void;
  onExportPdf: () => void;
  isExportingPdf: boolean;
}

export const Controls: React.FC<ControlsProps> = ({ 
    baseAllowance, setBaseAllowance,
    carryOverDays, setCarryOverDays, 
    showNameDays, setShowNameDays, 
    showHolidays, setShowHolidays,
    onExportData, onImportData,
    onManageEventTypes,
    onExportPdf, isExportingPdf
}) => {
  
  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-200/60 mb-8 print-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
        {/* Column 1: Allowance Settings */}
        <div className="flex flex-col gap-4">
            <NumberInputWithSteppers
                id="baseAllowance"
                label="Základný ročný nárok:"
                value={baseAllowance}
                onChange={setBaseAllowance}
                step={0.5}
                min={0}
            />
            <NumberInputWithSteppers
                id="carryover"
                label="Nevyčerpaná dovolenka z min. roka:"
                value={carryOverDays}
                onChange={setCarryOverDays}
                step={0.5}
                min={0}
            />
        </div>

        {/* Column 2: Display Toggles */}
        <div className="flex flex-col gap-4 pt-8">
            <ToggleSwitch id="show-holidays" label="Zobraziť sviatky" checked={showHolidays} onChange={setShowHolidays} />
            <ToggleSwitch id="show-namedays" label="Zobraziť meniny" checked={showNameDays} onChange={setShowNameDays} />
        </div>

        {/* Column 3: Action Buttons */}
        <div className="flex flex-col gap-3 lg:items-end">
            <button
                onClick={onManageEventTypes}
                className="w-full lg:w-auto bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition-all duration-200"
            >
                Spravovať typy udalostí
            </button>
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto">
                 <button
                    onClick={onExportData}
                    className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition-all duration-200"
                  >
                    Exportovať dáta
                </button>
                 <label
                    htmlFor="import-file"
                    className="w-full text-center bg-green-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-600 transition-all duration-200 cursor-pointer"
                  >
                    Importovať dáta
                </label>
                <input id="import-file" type="file" accept=".json" className="hidden" onChange={onImportData} />
            </div>
             <button
                onClick={onExportPdf}
                disabled={isExportingPdf}
                className="w-full lg:w-auto flex items-center justify-center gap-2 bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-800 transition-all duration-200 disabled:bg-gray-400"
            >
                {isExportingPdf ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Generuje sa...
                    </>
                ) : (
                    <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a2 2 0 00-2 2v2H6a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H6V8h2a1 1 0 100-2H6V4a2 2 0 00-2-2H4a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2h-2a2 2 0 00-2-2h-4z" /><path d="M10 6a1 1 0 011 1v5.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 111.414-1.414L9 12.586V7a1 1 0 011-1z" /></svg>
                        Exportovať do PDF
                    </>
                )}
            </button>
        </div>
    </div>
    </div>
  );
};