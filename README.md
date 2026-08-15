# 🚀 SyncBoard — Real-Time Team Collaboration & Work Management

**SyncBoard** is a modern, high-performance Agile project management and team collaboration web application designed for engineering, product, and operations teams to streamline workflow, track task execution, monitor sprint velocity, and balance team workloads.

---

## 📌 System Overview

SyncBoard brings together visual project tracking, keyboard-driven productivity, real-time status updates, and deep sprint analytics into a single responsive dark/light glassmorphic interface. It empowers software teams to manage sprint backlogs, avoid task conflicts, track deadlines, and maintain visibility across all active projects.

---

## ✨ Key Features & Views

### 1. 📋 Drag-and-Drop Kanban Board (`Board View`)
* **Status Columns**: Visual workflow stages — *Backlog*, *To Do*, *In Progress*, and *Completed*.
* **Task Badges & Priority Tags**: Clear urgency labeling (*Urgent*, *High*, *Medium*, *Low*) alongside department tags (*Backend*, *Frontend*, *Design*, *Editing*, *API Ready*).
* **Conflict & Overdue Alerts**: Real-time visual alerts indicating overdue deadlines or merge conflicts.
* **Assignee Avatars**: Quick identification of task owners and team assignments.

### 2. 📑 Advanced Tabular List View (`List View`)
* **Dense Task Spreadsheet**: High-density view optimized for viewing and editing multiple tasks simultaneously.
* **Filtering & Sorting**: Filter tasks by priority, status, assignee, or tag, with column multi-sorting.
* **Batch Operations**: Bulk status changes, priority updates, and multi-task management.

### 3. ⌨️ Global Command Palette (`⌘K` / `Ctrl+K`)
* **Instant Keyboard Navigation**: Jump across views, search tasks by title or ID, and perform quick actions without touching the mouse.
* **Fuzzy Search**: Rapid query searching across workspace tasks, members, and settings.

### 4. 📊 Analytics & Sprint Reporting (`Analytics View`)
* **Sprint Velocity Charting**: Track velocity trends across active and historical sprints.
* **Burndown Tracking**: Monitor daily work remaining against targeted sprint deadlines.
* **Priority Distribution & Completion Ratios**: Interactive metrics displaying task health and completion velocity.
* **Workload Allocation**: Visual workload breakdown per team member to prevent developer burnout.

### 5. 👥 Team & Workspace Management (`Team View`)
* **Member Directory**: View role assignments (*Admin*, *Member*, *Viewer*), team capacity, active tasks, and member statuses.
* **Member Workload Metrics**: Monitor distribution of tasks across team members.

### 6. ⚙️ Customization & Preview Tools (`Settings & Utilities`)
* **Dark / Light Glassmorphism Theme**: Seamless dark/light theme switching with modern visual aesthetics.
* **Mock Mode & Preview States**: Built-in state preview tools (*Normal*, *Loading*, *Error*, *404 Task*) for testing UI resilience under edge cases.

---

## 💡 System Advantages & Key Use Cases

| Advantage | Benefit |
| :--- | :--- |
| **Dual View Flexibility** | Switch seamlessly between visual Kanban cards and high-density spreadsheet lists depending on context. |
| **Data-Driven Sprints** | Automated velocity charts and burndown metrics keep sprint goals predictable and measurable. |
| **Keyboard-First Workflow** | Command palette (`⌘K`) significantly increases navigation speed and productivity for daily users. |
| **Proactive Conflict Avoidance** | Automated overdue indicators and task conflict warnings reduce project delivery risks. |
| **Modern UX/UI Design** | Clean glassmorphic design system with vibrant cues and smooth micro-animations. |

---

## 🛠️ Technology Stack

* **Core Framework**: [React 18](https://react.dev/) + [JavaScript (ES6+)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
* **Build Tool & Dev Server**: [Vite](https://vitejs.dev/)
* **Iconography**: [Lucide React](https://lucide.dev/)
* **State Management**: React Context API (`TasksContext`, `AuthContext`, `ThemeContext`)
* **Styling**: Vanilla CSS (Custom Design System with CSS variables and responsive glassmorphism)

---

## 📁 Directory Structure

```
full-stack-application/
├── src/
│   ├── components/       # UI Components (Kanban, List, Analytics, TaskModal, Layout)
│   ├── context/          # Context Providers (Tasks, Auth, Theme)
│   ├── data/             # Initial Mock Data & Workspace Seeds
│   ├── pages/            # View Pages (BoardView, ListView, AnalyticsView, TeamView, SettingsView)
│   ├── App.jsx           # Application Root & Layout Routing
│   ├── main.jsx          # DOM Entry Point
│   └── index.css         # Global CSS Design Tokens & Utilities
├── index.html            # HTML5 Base Template
├── vite.config.js        # Vite Configuration File
└── package.json          # Node Dependencies & Scripts
```

---

## 🚀 Getting Started

### Prerequisites
* **Node.js** (v18 or higher recommended)
* **npm** (v9 or higher)

### Installation & Local Setup

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd full-stack-application
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start the Development Server**
   ```bash
   npm run dev
   ```
   *Note: On Windows PowerShell, if script execution is restricted, run `cmd /c npm run dev`.*

4. **Access the Application**
   Open your browser and navigate to:
   ```
   http://localhost:3000/
   ```

---

## 📜 Available Scripts

| Command | Action |
| :--- | :--- |
| `npm run dev` | Runs the Vite development server on `http://localhost:3000/` |
| `npm run build` | Builds the optimized production bundle to `/dist` |
| `npm run preview` | Previews the production build locally |

---

*Developed for high-efficiency team collaboration with modern React tooling.*
