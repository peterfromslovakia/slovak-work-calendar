import React, { useState, useMemo, ChangeEvent } from 'react';
import ReactDOM from 'react-dom/client';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Header } from './components/Header';
import { Stats } from './components/Stats';
import { Calendar } from './components/Calendar';
import { Controls } from './components/Controls';
import { EventModal } from './components/EventModal';
import { ManageEventTypesModal } from './components/ManageEventTypesModal';
import { PrintLayout } from './components/PrintLayout';
import { SLOVAK_HOLIDAYS, DEFAULT_EVENT_TYPES } from './constants';
import { Holiday, EventData, EventInfo, EventType } from './types';

declare const jspdf: any;
declare const html2canvas: any;

const App: React.FC = () => {
  const [name, setName] = useLocalStorage<string>('vacationCalendarName', 'Meno a Priezvisko');
  const [organizationName, setOrganizationName] = useLocalStorage<string>('vacationCalendarOrg', 'Názov organizácie');
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear() < 2025 ? 2025 : new Date().getFullYear());
  const [baseAllowance, setBaseAllowance] = useLocalStorage<number>('vacationCalendarBaseAllowance', 30);
  const [carryOverDays, setCarryOverDays] = useLocalStorage<number>('vacationCalendarCarryOver', 0);
  const [eventData, setEventData] = useLocalStorage<EventData>('vacationCalendarEventData', new Map());
  const [eventTypes, setEventTypes] = useLocalStorage<EventType[]>('vacationCalendarEventTypes', DEFAULT_EVENT_TYPES);
  const [showNameDays, setShowNameDays] = useLocalStorage<boolean>('vacationCalendarShowNameDays', false);
  const [showHolidays, setShowHolidays] = useLocalStorage<boolean>('vacationCalendarShowHolidays', false);

  const [eventModalState, setEventModalState] = useState<{isOpen: boolean; date: string | null}>({isOpen: false, date: null});
  const [manageTypesModalOpen, setManageTypesModalOpen] = useState<boolean>(false);
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);

  const totalVacationAllowance = baseAllowance + carryOverDays;

  const vacationDaysThisYear = useMemo(() => {
    return Array.from(eventData.entries())
      .filter(([date, info]) => date.startsWith(currentYear.toString()) && info.typeId === 'vacation')
      .reduce((sum, [, info]) => sum + (info.duration || 1), 0);
  }, [eventData, currentYear]);
  
  const eventTypeMap = useMemo(() => new Map(eventTypes.map(et => [et.id, et])), [eventTypes]);

  const remainingDays = totalVacationAllowance - vacationDaysThisYear;

  const handleOpenEventModal = (date: string) => {
    setEventModalState({ isOpen: true, date });
  };

  const handleCloseEventModal = () => {
    setEventModalState({ isOpen: false, date: null });
  };
  
  const handleSaveEventTypes = (updatedEventTypes: EventType[]) => {
    setEventTypes(updatedEventTypes);
    setManageTypesModalOpen(false);
  };

  const handleSaveEvent = (date: string, info: EventInfo) => {
    setEventData(prevData => {
      const newData = new Map(prevData);
      newData.set(date, info);
      return newData;
    });
    handleCloseEventModal();
  };

  const handleDeleteEvent = (date: string) => {
    setEventData(prevData => {
      const newData = new Map(prevData);
      newData.delete(date);
      return newData;
    });
    handleCloseEventModal();
  };

  const holidaysForYear: Map<string, string> = useMemo(() => {
    const holidays = SLOVAK_HOLIDAYS[currentYear] || [];
    return new Map(holidays.map((h: Holiday) => [h.date, h.name]));
  }, [currentYear]);
  
  const handleExportData = () => {
    const dataToExport = {
        name,
        organizationName,
        baseAllowance,
        carryOverDays,
        eventData: Array.from(eventData.entries()),
        eventTypes,
        showNameDays,
        showHolidays,
    };
    const jsonString = JSON.stringify(dataToExport, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kalendar_data_${name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportData = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result;
          if (typeof text !== 'string') throw new Error("File is not text");
          const data = JSON.parse(text);

          if(typeof data.name === 'string') setName(data.name);
          if(typeof data.organizationName === 'string') setOrganizationName(data.organizationName);
          if(typeof data.baseAllowance === 'number') setBaseAllowance(data.baseAllowance);
          if(typeof data.carryOverDays === 'number') setCarryOverDays(data.carryOverDays);
          if(Array.isArray(data.eventData)) setEventData(new Map(data.eventData));
          if(Array.isArray(data.eventTypes)) setEventTypes(data.eventTypes);
          if(typeof data.showNameDays === 'boolean') setShowNameDays(data.showNameDays);
          if(typeof data.showHolidays === 'boolean') setShowHolidays(data.showHolidays);

          alert('Dáta boli úspešne importované.');
        } catch (error) {
          console.error("Failed to import data:", error);
          alert('Chyba pri importe dát. Súbor je poškodený alebo má nesprávny formát.');
        }
      };
      reader.readAsText(file);
      event.target.value = ''; // Reset file input
    }
  };

  const handleExportPdf = async () => {
    setIsExportingPdf(true);
    const printContainer = document.createElement('div');
    // Styling for off-screen rendering
    printContainer.style.position = 'absolute';
    printContainer.style.left = '-9999px';
    printContainer.style.top = '0';
    // A4 width for layout calculation
    printContainer.style.width = '210mm'; 
    document.body.appendChild(printContainer);

    const eventsThisYear = Array.from(eventData.entries())
      .filter(([date]) => date.startsWith(currentYear.toString()));

    const onlyVacationEvents = eventsThisYear.length > 0 && eventsThisYear.every(([, info]) => info.typeId === 'vacation');

    const pdfTitle = onlyVacationEvents
      ? `Prehľad dovolenky za rok ${currentYear}`
      : `Prehľad dochádzky za rok ${currentYear}`;

    const tempRoot = ReactDOM.createRoot(printContainer);
    
    // Render the layout component
    tempRoot.render(
      <PrintLayout
        title={pdfTitle}
        name={name}
        organizationName={organizationName}
        year={currentYear}
        baseAllowance={baseAllowance}
        carryOverDays={carryOverDays}
        totalAllowance={totalVacationAllowance}
        usedDays={vacationDaysThisYear}
        remainingDays={remainingDays}
        eventTypes={eventTypes}
        eventData={eventData}
        holidays={holidaysForYear}
        eventTypeMap={eventTypeMap}
      />
    );
    
    // Allow time for rendering
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
        const { jsPDF } = jspdf;
        const source = printContainer;
        
        const canvas = await html2canvas(source, {
            scale: 2, // Higher scale for better quality
            useCORS: true,
            logging: false,
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4'); // Portrait, millimeters, A4
        
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        
        // Calculate the height of the image in the PDF to maintain aspect ratio
        const ratio = canvasHeight / canvasWidth;
        const imgHeight = pdfWidth * ratio;
        
        let heightLeft = imgHeight;
        let position = 0;
        
        // Add the first page
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, imgHeight);
        heightLeft -= pdfHeight;
        
        // Add new pages if content overflows
        while (heightLeft > 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
            heightLeft -= pdfHeight;
        }

        pdf.save(`Prehlad_${name.replace(/\s+/g, '_')}_${currentYear}.pdf`);

    } catch (error) {
        console.error("Error generating PDF:", error);
        alert("Nastala chyba pri generovaní PDF.");
    } finally {
        // Cleanup
        tempRoot.unmount();
        document.body.removeChild(printContainer);
        setIsExportingPdf(false);
    }
  };


  return (
    <div id="app-container" className="min-h-screen bg-gray-50 text-gray-800 p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <Header
          name={name}
          setName={setName}
          organizationName={organizationName}
          setOrganizationName={setOrganizationName}
          currentYear={currentYear}
          setCurrentYear={setCurrentYear}
        />
        <main>
          <Stats 
             totalAllowance={totalVacationAllowance}
             usedDays={vacationDaysThisYear}
             remainingDays={remainingDays}
          />
          <Controls
            baseAllowance={baseAllowance}
            setBaseAllowance={setBaseAllowance}
            carryOverDays={carryOverDays}
            setCarryOverDays={setCarryOverDays}
            showNameDays={showNameDays}
            setShowNameDays={setShowNameDays}
            showHolidays={showHolidays}
            setShowHolidays={setShowHolidays}
            onExportData={handleExportData}
            onImportData={handleImportData}
            onManageEventTypes={() => setManageTypesModalOpen(true)}
            onExportPdf={handleExportPdf}
            isExportingPdf={isExportingPdf}
          />
          <Calendar
            year={currentYear}
            eventData={eventData}
            eventTypeMap={eventTypeMap}
            holidays={holidaysForYear}
            onDayClick={handleOpenEventModal}
            showNameDays={showNameDays}
            showHolidays={showHolidays}
          />
        </main>
      </div>
      <footer className="text-center mt-8 text-gray-500 text-sm print-hidden">
        Created by Peter Obala
      </footer>
      {eventModalState.isOpen && eventModalState.date && (
         <EventModal 
            date={eventModalState.date}
            eventTypes={eventTypes}
            currentEvent={eventData.get(eventModalState.date)}
            onSave={handleSaveEvent}
            onDelete={handleDeleteEvent}
            onClose={handleCloseEventModal}
         />
      )}
      {manageTypesModalOpen && (
        <ManageEventTypesModal
          eventTypes={eventTypes}
          eventData={eventData}
          onSave={handleSaveEventTypes}
          onClose={() => setManageTypesModalOpen(false)}
        />
      )}
    </div>
  );
};

export default App;