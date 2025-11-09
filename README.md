

    
# Work Attendance Calendar

A modern, frontend-only work calendar and attendance planner built with React & TypeScript. This interactive application allows users to track vacation days, sick leave, home office, and other custom events. It features a clean, Apple-inspired UI, professional PDF exports for payroll, and full data persistence in the browser's local storage.


## Key Features

- **Interactive Yearly Calendar:** View the entire year at a glance (2025-2030).
- **Custom Event Types:** Track not just vacation, but also home office, doctor's visits, and business trips. Users can create, edit, and delete their own event types with custom names, colors, and icons.
- **Vacation Tracking:** Manage your annual vacation allowance, including carry-over days from the previous year. The app automatically calculates used and remaining days.
- **Half-Day Support:** Log events for full or half days with precise tracking.
- **Slovak Localization:** Includes built-in support for Slovak public holidays and name days, which can be toggled on or off.
- **Professional PDF Export:** Generate a clean, detailed attendance report perfect for payroll. The report intelligently lists only relevant vacation data in a dedicated section.
- **Data Persistence:** All data (name, organization, events, settings) is saved locally in your browser.
- **Import/Export Data:** Easily back up your data to a JSON file or transfer it to another device.
- **Fully Frontend:** No backend or database required. The application runs entirely in the browser.

## Tech Stack

- **Framework:** React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS (via CDN)
- **PDF Generation:** jsPDF & html2canvas
- **Build Tool:** Vite

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You need to have [Node.js](https://nodejs.org/) (which includes npm) installed on your computer.

### Installation & Running

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/work-attendance-calendar.git
    cd work-attendance-calendar
    ```

2.  **Install dependencies:**
    This project uses npm to manage its packages.
    ```bash
    npm install
    ```

3.  **Run the development server:**
    This command will start the Vite development server, typically on `http://localhost:5173`.
    ```bash
    npm run dev
    ```

The application will automatically open in your default browser. Any changes you make to the source code will be reflected instantly.

## Building for Production

To create a production-ready build of the application, run the following command:

```bash
npm run build

  
