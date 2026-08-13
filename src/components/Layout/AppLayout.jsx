import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import BoardView from '../../pages/BoardView';
import ListView from '../../pages/ListView';
import AnalyticsView from '../../pages/AnalyticsView';
import TeamView from '../../pages/TeamView';
import SettingsView from '../../pages/SettingsView';
import TaskModal from '../TaskModal';
import CommandPalette from '../CommandPalette';
import { useTasks } from '../../context/TasksContext';

export default function AppLayout() {
  const [activeTab, setActiveTab] = useState('board');
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const { isModalOpen } = useTasks();

  return (
    <div className="app-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="main-content">
        <Header activeTab={activeTab} onOpenPalette={() => setIsPaletteOpen(true)} />
        <div className="page-wrapper">
          {activeTab === 'board' && <BoardView />}
          {activeTab === 'list' && <ListView />}
          {activeTab === 'analytics' && <AnalyticsView />}
          {activeTab === 'team' && <TeamView />}
          {activeTab === 'settings' && <SettingsView />}
        </div>
      </main>

      {/* Task Create & Edit Modal */}
      {isModalOpen && <TaskModal />}

      {/* Global Command Palette (⌘K / Ctrl+K) */}
      <CommandPalette
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={isPaletteOpen}
        setIsOpen={setIsPaletteOpen}
      />
    </div>
  );
}
