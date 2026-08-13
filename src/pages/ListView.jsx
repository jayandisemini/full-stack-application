import React, { useState, useMemo } from 'react';
import {
  Search,
  Download,
  Calendar,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  CheckSquare,
  Square,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Filter,
  Check,
  Zap,
  Tag
} from 'lucide-react';
import { useTasks } from '../context/TasksContext';
import '../components/List/ListView.css';

export default function ListView() {
  const {
    tasks,
    filteredTasks,
    teamMembers,
    openEditModal,
    updateTask,
    deleteTask,
    searchQuery,
    setSearchQuery
  } = useTasks();

  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [selectedTaskIds, setSelectedTaskIds] = useState([]);
  
  // Sorting state
  const [sortField, setSortField] = useState('id'); // 'id', 'title', 'status', 'priority', 'dueDate', 'storyPoints'
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc', 'desc'

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(15);

  // Inline Editing State
  const [activeInlineMenu, setActiveInlineMenu] = useState(null); // { taskId, type: 'status' | 'priority' }

  // Filter tasks by status tab and category
  const baseFilteredTasks = useMemo(() => {
    return filteredTasks.filter(task => {
      const matchesStatus = statusFilter === 'ALL' || task.columnId === statusFilter;
      const matchesCategory = categoryFilter === 'ALL' || task.category === categoryFilter;
      return matchesStatus && matchesCategory;
    });
  }, [filteredTasks, statusFilter, categoryFilter]);

  // Sort tasks
  const sortedTasks = useMemo(() => {
    const priorityRank = { URGENT: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
    const statusRank = { backlog: 1, todo: 2, inprogress: 3, completed: 4 };

    return [...baseFilteredTasks].sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (sortField === 'priority') {
        valA = priorityRank[a.priority] || 0;
        valB = priorityRank[b.priority] || 0;
      } else if (sortField === 'status') {
        valA = statusRank[a.columnId] || 0;
        valB = statusRank[b.columnId] || 0;
      } else if (sortField === 'storyPoints') {
        valA = a.storyPoints || 0;
        valB = b.storyPoints || 0;
      } else if (sortField === 'dueDate') {
        valA = new Date(a.dueDate).getTime();
        valB = new Date(b.dueDate).getTime();
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [baseFilteredTasks, sortField, sortOrder]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(sortedTasks.length / rowsPerPage));
  const paginatedTasks = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return sortedTasks.slice(start, start + rowsPerPage);
  }, [sortedTasks, currentPage, rowsPerPage]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const toggleSelectAll = () => {
    if (selectedTaskIds.length === paginatedTasks.length) {
      setSelectedTaskIds([]);
    } else {
      setSelectedTaskIds(paginatedTasks.map(t => t.id));
    }
  };

  const toggleSelectTask = (id) => {
    if (selectedTaskIds.includes(id)) {
      setSelectedTaskIds(selectedTaskIds.filter(i => i !== id));
    } else {
      setSelectedTaskIds([...selectedTaskIds, id]);
    }
  };

  // Bulk Actions
  const handleBulkStatusChange = (newColumnId) => {
    selectedTaskIds.forEach(id => updateTask(id, { columnId: newColumnId }));
    setSelectedTaskIds([]);
  };

  const handleBulkPriorityChange = (newPriority) => {
    selectedTaskIds.forEach(id => updateTask(id, { priority: newPriority }));
    setSelectedTaskIds([]);
  };

  const handleBulkDelete = () => {
    selectedTaskIds.forEach(id => deleteTask(id));
    setSelectedTaskIds([]);
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Title', 'Status', 'Priority', 'Category', 'Assignee', 'Due Date', 'Story Points'];
    const rows = sortedTasks.map(t => [
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

  const renderSortIcon = (field) => {
    if (sortField !== field) return <ArrowUpDown size={12} className="sort-icon-idle" />;
    return sortOrder === 'asc' ? (
      <ArrowUp size={12} className="sort-icon-active" />
    ) : (
      <ArrowDown size={12} className="sort-icon-active" />
    );
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

          {/* Status Tabs */}
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
                onClick={() => {
                  setStatusFilter(tab.id);
                  setCurrentPage(1);
                }}
                className={`tab-btn ${statusFilter === tab.id ? 'active' : ''}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Category Dropdown */}
          <div className="category-select-box">
            <Tag size={13} className="cat-icon" />
            <select
              value={categoryFilter}
              onChange={e => {
                setCategoryFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="ALL">All Categories</option>
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="Design">Design</option>
              <option value="DevOps">DevOps</option>
              <option value="Testing">Testing</option>
              <option value="Database">Database</option>
              <option value="API Ready">API Ready</option>
            </select>
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
                  {selectedTaskIds.length > 0 && selectedTaskIds.length === paginatedTasks.length ? (
                    <CheckSquare size={16} className="cb-checked" />
                  ) : (
                    <Square size={16} className="cb-unchecked" />
                  )}
                </button>
              </th>
              <th className="sortable-th" onClick={() => handleSort('id')}>
                <span>ID</span> {renderSortIcon('id')}
              </th>
              <th className="sortable-th" onClick={() => handleSort('title')}>
                <span>TITLE</span> {renderSortIcon('title')}
              </th>
              <th className="sortable-th" onClick={() => handleSort('status')}>
                <span>STATUS</span> {renderSortIcon('status')}
              </th>
              <th className="sortable-th" onClick={() => handleSort('priority')}>
                <span>PRIORITY</span> {renderSortIcon('priority')}
              </th>
              <th>ASSIGNEE</th>
              <th className="sortable-th" onClick={() => handleSort('dueDate')}>
                <span>DUE DATE</span> {renderSortIcon('dueDate')}
              </th>
              <th className="sortable-th" onClick={() => handleSort('storyPoints')}>
                <span>POINTS</span> {renderSortIcon('storyPoints')}
              </th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {paginatedTasks.map(task => {
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
                      <span className="title-text" onClick={() => openEditModal(task)} style={{ cursor: 'pointer' }}>
                        {task.title}
                      </span>
                      <span className="tag-pill tag-small">{task.category}</span>
                    </div>
                  </td>
                  <td className="td-status">
                    <div className="inline-editable-wrapper">
                      <button
                        className="inline-edit-btn"
                        onClick={() =>
                          setActiveInlineMenu(prev =>
                            prev?.taskId === task.id && prev?.type === 'status' ? null : { taskId: task.id, type: 'status' }
                          )
                        }
                      >
                        {getStatusBadge(task.columnId)}
                      </button>
                      {activeInlineMenu?.taskId === task.id && activeInlineMenu?.type === 'status' && (
                        <div className="inline-dropdown-menu">
                          {['backlog', 'todo', 'inprogress', 'completed'].map(col => (
                            <button
                              key={col}
                              className={`inline-item ${task.columnId === col ? 'selected' : ''}`}
                              onClick={() => {
                                updateTask(task.id, { columnId: col });
                                setActiveInlineMenu(null);
                              }}
                            >
                              {getStatusBadge(col)}
                              {task.columnId === col && <Check size={13} />}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="td-priority">
                    <div className="inline-editable-wrapper">
                      <button
                        className="inline-edit-btn"
                        onClick={() =>
                          setActiveInlineMenu(prev =>
                            prev?.taskId === task.id && prev?.type === 'priority' ? null : { taskId: task.id, type: 'priority' }
                          )
                        }
                      >
                        <span className={`badge ${getPriorityClass(task.priority)}`}>
                          {task.priority}
                        </span>
                      </button>
                      {activeInlineMenu?.taskId === task.id && activeInlineMenu?.type === 'priority' && (
                        <div className="inline-dropdown-menu">
                          {['URGENT', 'HIGH', 'MEDIUM', 'LOW'].map(prio => (
                            <button
                              key={prio}
                              className={`inline-item ${task.priority === prio ? 'selected' : ''}`}
                              onClick={() => {
                                updateTask(task.id, { priority: prio });
                                setActiveInlineMenu(null);
                              }}
                            >
                              <span className={`badge ${getPriorityClass(prio)}`}>{prio}</span>
                              {task.priority === prio && <Check size={13} />}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
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
                  <td className="td-points">
                    <span className="points-pill">{task.storyPoints || 5} pts</span>
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
            {paginatedTasks.length === 0 && (
              <tr>
                <td colSpan="9" className="no-tasks-cell">
                  No tasks found matching your search or filter criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Table Footer / Pagination */}
        <div className="table-footer">
          <div className="footer-left">
            <span>
              Showing {sortedTasks.length > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0}-
              {Math.min(currentPage * rowsPerPage, sortedTasks.length)} of {sortedTasks.length} tasks
            </span>
            <div className="rows-per-page">
              <span>Rows per page:</span>
              <select
                value={rowsPerPage}
                onChange={e => {
                  setRowsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
              >
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="25">25</option>
                <option value="50">50</option>
              </select>
            </div>
          </div>

          <div className="footer-pagination">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              className="page-nav-btn"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="page-num active">{currentPage} / {totalPages}</span>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              className="page-nav-btn"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Floating Bulk Actions Bar */}
      {selectedTaskIds.length > 0 && (
        <div className="bulk-actions-floating-bar">
          <div className="bulk-count-badge">
            <CheckSquare size={16} />
            <span>{selectedTaskIds.length} tasks selected</span>
          </div>

          <div className="bulk-actions-group">
            <select
              defaultValue=""
              onChange={e => {
                if (e.target.value) handleBulkStatusChange(e.target.value);
                e.target.value = "";
              }}
              className="bulk-select"
            >
              <option value="" disabled>Move Status...</option>
              <option value="backlog">Move to Backlog</option>
              <option value="todo">Move to To Do</option>
              <option value="inprogress">Move to In Progress</option>
              <option value="completed">Move to Completed</option>
            </select>

            <select
              defaultValue=""
              onChange={e => {
                if (e.target.value) handleBulkPriorityChange(e.target.value);
                e.target.value = "";
              }}
              className="bulk-select"
            >
              <option value="" disabled>Set Priority...</option>
              <option value="URGENT">Set Urgent</option>
              <option value="HIGH">Set High</option>
              <option value="MEDIUM">Set Medium</option>
              <option value="LOW">Set Low</option>
            </select>

            <button onClick={handleBulkDelete} className="bulk-btn bulk-btn-delete">
              <Trash2 size={14} />
              <span>Delete Selected</span>
            </button>

            <button onClick={() => setSelectedTaskIds([])} className="bulk-btn bulk-btn-cancel">
              Deselect All
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
