import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import BoardView from '../../pages/BoardView';
import ListView from '../../pages/ListView';
import AnalyticsView from '../../pages/AnalyticsView';
import TeamView from '../../pages/TeamView';
import SettingsView from '../../pages/SettingsView';
import TaskModal from '../TaskModal';
import { useTasks } from '../../context/TasksContext';

export default function AppLayout() {
  const [activeTab, setActiveTab] = useState('board');
  const { isModalOpen } = useTasks();

  return (
    <div className="app-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="main-content">
        <Header activeTab={activeTab} />
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
    </div>
  );
}
