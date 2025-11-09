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
    <div className="flex flex-col gap-4 my-6 p-4 bg-gray-50 rounded-xl border border-gray-200/80 print-hidden">
        <div className="flex flex-col md:flex-row gap-x-8 gap-y-4 md:items-end">
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
                label="Nevyčerpaná dovolenka z minulého roka:"
                value={carryOverDays}
                onChange={setCarryOverDays}
                step={0.5}
                min={0}
            />
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-gray-200 mt-2">
             <div className="flex items-center gap-4">
                <ToggleSwitch id="show-holidays" label="Zobraziť sviatky" checked={showHolidays} onChange={setShowHolidays} />
                <ToggleSwitch id="show-namedays" label="Zobraziť meniny" checked={showNameDays} onChange={setShowNameDays} />
            </div>
             <div className="flex items-center gap-3">
                <button
                    onClick={onManageEventTypes}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
                >
                    Spravovať typy udalostí
                </button>
             </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-end items-center gap-3 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-3">
                 <button
                    onClick={onExportData}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                  >
                    Exportovať dáta
                </button>
                 <label
                    htmlFor="import-file"
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 cursor-pointer"
                  >
                    Importovať dáta
                </label>
                <input id="import-file" type="file" accept=".json" className="hidden" onChange={onImportData} />
            </div>
            <button
                onClick={onExportPdf}
                disabled={isExportingPdf}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-600 transition-all duration-200 disabled:bg-gray-400"
            >
                {isExportingPdf ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Generuje sa...
                    </>
                ) : (
                    <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
                        </svg>
                        Exportovať do PDF
                    </>
                )}
            </button>
        </div>
    </div>
  );
};