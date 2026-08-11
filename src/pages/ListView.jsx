import React, { useState } from 'react';
import {
  Search,
  Download,
  Calendar,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  CheckSquare,
  Square
} from 'lucide-react';
import { useTasks } from '../context/TasksContext';
import '../components/List/ListView.css';

export default function ListView() {
  const {
    filteredTasks,
    teamMembers,
    openEditModal,
    deleteTask,
    searchQuery,
    setSearchQuery
  } = useTasks();

  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedTaskIds, setSelectedTaskIds] = useState([]);

  // Filter tasks by status tab
  const displayedTasks = filteredTasks.filter(task => {
    if (statusFilter === 'ALL') return true;
    return task.columnId === statusFilter;
  });

  const toggleSelectAll = () => {
    if (selectedTaskIds.length === displayedTasks.length) {
      setSelectedTaskIds([]);
    } else {
      setSelectedTaskIds(displayedTasks.map(t => t.id));
    }
  };

  const toggleSelectTask = (id) => {
    if (selectedTaskIds.includes(id)) {
      setSelectedTaskIds(selectedTaskIds.filter(i => i !== id));
    } else {
      setSelectedTaskIds([...selectedTaskIds, id]);
    }
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Title', 'Status', 'Priority', 'Category', 'Assignee', 'Due Date', 'Story Points'];
    const rows = displayedTasks.map(t => [
      t.id,
      `"${t.title.replace(/"/g, '""')}"`,
      t.columnId,
      t.priority,
      t.category,
      `"${t.assigneeName}"`,
      t.dueDate,
      t.storyPoints
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `syncboard_tasks_export_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (columnId) => {
    switch (columnId) {
      case 'backlog':
        return <span className="status-pill status-backlog"><span className="dot"></span> Backlog</span>;
      case 'todo':
        return <span className="status-pill status-todo"><span className="dot"></span> To Do</span>;
      case 'inprogress':
        return <span className="status-pill status-inprogress"><span className="dot"></span> In Progress</span>;
      case 'completed':
        return <span className="status-pill status-completed"><span className="dot"></span> Completed</span>;
      default:
        return <span className="status-pill">{columnId}</span>;
    }
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'URGENT': return 'badge-urgent';
      case 'HIGH': return 'badge-high';
      case 'MEDIUM': return 'badge-medium';
      case 'LOW': return 'badge-low';
      default: return 'badge-medium';
    }
  };

  return (
    <div className="list-view-container">
      {/* Sub-header Filter Tabs */}
      <div className="list-filter-bar">
        <div className="filter-tabs-left">
          <span className="list-title">All Tasks</span>
          <div className="search-inline">
            <Search size={14} className="search-icon" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="tabs-pill-group">
            {[
              { id: 'ALL', label: 'All' },
              { id: 'backlog', label: 'Backlog' },
              { id: 'todo', label: 'To Do' },
              { id: 'inprogress', label: 'In Progress' },
              { id: 'completed', label: 'Completed' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`tab-btn ${statusFilter === tab.id ? 'active' : ''}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <button onClick={exportToCSV} className="btn-secondary export-csv-btn">
          <Download size={15} />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Tasks Table Card */}
      <div className="table-card glass-panel">
        <table className="tasks-table">
          <thead>
            <tr>
              <th className="th-cb">
                <button onClick={toggleSelectAll} className="cb-btn">
                  {selectedTaskIds.length > 0 && selectedTaskIds.length === displayedTasks.length ? (
                    <CheckSquare size={16} className="cb-checked" />
                  ) : (
                    <Square size={16} className="cb-unchecked" />
                  )}
                </button>
              </th>
              <th>ID</th>
              <th>TITLE</th>
              <th>STATUS</th>
              <th>PRIORITY</th>
              <th>ASSIGNEE</th>
              <th>DUE DATE</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {displayedTasks.map(task => {
              const assignee = teamMembers.find(m => m.id === task.assigneeId) || {
                initials: 'SC',
                color: '#6366f1'
              };
              const isSelected = selectedTaskIds.includes(task.id);

              return (
                <tr key={task.id} className={isSelected ? 'row-selected' : ''}>
                  <td className="td-cb">
                    <button onClick={() => toggleSelectTask(task.id)} className="cb-btn">
                      {isSelected ? (
                        <CheckSquare size={16} className="cb-checked" />
                      ) : (
                        <Square size={16} className="cb-unchecked" />
                      )}
                    </button>
                  </td>
                  <td className="td-id">{task.id}</td>
                  <td className="td-title">
                    <div className="title-cell">
                      <span className="title-text">{task.title}</span>
                      <span className="tag-pill tag-small">{task.category}</span>
                    </div>
                  </td>
                  <td className="td-status">{getStatusBadge(task.columnId)}</td>
                  <td className="td-priority">
                    <span className={`badge ${getPriorityClass(task.priority)}`}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="td-assignee">
                    <div className="assignee-cell">
                      <div
                        className="avatar avatar-sm"
                        style={{ backgroundColor: assignee.color || '#6366f1' }}
                      >
                        {assignee.initials}
                      </div>
                      <span>{task.assigneeName}</span>
                    </div>
                  </td>
                  <td className="td-duedate">
                    <div className={`duedate-cell ${task.isOverdue ? 'overdue' : ''}`}>
                      <Calendar size={13} />
                      <span>{task.dueDate}</span>
                    </div>
                  </td>
                  <td className="td-actions">
                    <button onClick={() => openEditModal(task)} className="action-btn" title="Edit">
                      <Edit2 size={14} />
                    </button>
                    <button onClick={() => deleteTask(task.id)} className="action-btn delete" title="Delete">
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              );
            })}
            {displayedTasks.length === 0 && (
              <tr>
                <td colSpan="8" className="no-tasks-cell">
                  No tasks found matching your filter criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Table Footer / Pagination */}
        <div className="table-footer">
          <div className="footer-left">
            <span>Showing 1-{displayedTasks.length} of {displayedTasks.length} tasks</span>
            <div className="rows-per-page">
              <span>Rows:</span>
              <select defaultValue="15">
                <option value="15">15</option>
                <option value="25">25</option>
                <option value="50">50</option>
              </select>
            </div>
          </div>

          <div className="footer-pagination">
            <button disabled className="page-nav-btn"><ChevronLeft size={16} /></button>
            <button className="page-num active">1</button>
            <button disabled className="page-nav-btn"><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
