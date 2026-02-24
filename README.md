# Todo 2.0

Todo 2.0 is a desktop application built with **Electron** and **React**, designed for managing tasks and visualizing project/learning roadmaps.

## 🚀 Features

- **Task Management**: Create, view, update, and delete tasks with ease.
- **Interactive Roadmaps**: Visualize your plans using an interactive node-based roadmap editor powered by **React Flow**.
- **Custom Roadmap Nodes**: 
  - **Task Nodes**: Track specific actionable items.
  - **Note Nodes**: Add general information or reminders.
  - **Resource Nodes**: Link to external URLs and documentation.
  - **Milestone Nodes**: Mark significant progress points with due dates.
- **Persistent Storage**: All data is stored locally in a **SQLite** database.

## 🛠️ Technical Stack

- **Frontend**: React, Tailwind CSS, [React Flow](https://reactflow.dev/), React Router.
- **Backend (Main Process)**: Electron, [better-sqlite3](https://github.com/WiseLibs/better-sqlite3).
- **Communication**: IPC (Inter-Process Communication) via Preload scripts.
- **Build Tool**: Vite.

## 📂 Project Structure

- `electron/`: Main process and background services.
  - `main.ts`: Entry point for the Electron main process.
  - `preload.ts`: Exposes secure IPC channels to the renderer process.
  - `services/`: Database interaction logic and roadmap management.
- `src/`: React renderer process.
  - `Pages/`: Main application views (App, Roadmap).
  - `components/`: Reusable UI components and custom Flow nodes.
  - `main.tsx`: Entry point for the React application.

## 🚦 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) installed on your machine.
- [SQLite](https://www.sqlite.org/index.html) (Optional, as `better-sqlite3` handles the engine, but useful for manual inspection).

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Run the application in development mode with hot-reloading:
```bash
npm run dev
```

### Build

To package the application for production:
```bash
npm run build
```

## 🗄️ Database

The application uses **SQLite** for persistence. The database file `todo2.0.db` is automatically created in the project root.

### Schema Initialization

The schema is defined in `electron/services/db.ts` (for tasks) and `electron/services/roadmap.ts` (for roadmaps and nodes). You can find commented-out SQL commands in these files if you need to manually initialize or reset the database.

---
*Created with ❤️ by Yahia Benlaoukli*
