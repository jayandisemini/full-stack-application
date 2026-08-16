import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Search,
  Download,
  Upload,
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
  Tag,
  Columns,
  X
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
    setSearchQuery,
    addTask
  } = useTasks();

  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('ALL'); // 'ALL', 'OVERDUE', 'TODAY', 'WEEK'
  const [selectedTaskIds, setSelectedTaskIds] = useState([]);

  // Column Visibility State
  const [visibleColumns, setVisibleColumns] = useState({
    id: true,
    title: true,
    status: true,
    priority: true,
    assignee: true,
    dueDate: true,
    storyPoints: true,
    actions: true
  });
  const [isColMenuOpen, setIsColMenuOpen] = useState(false);
  const colMenuRef = useRef(null);

  // Import Modal State
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');

  // Sorting state
  const [sortField, setSortField] = useState('id'); // 'id', 'title', 'status', 'priority', 'dueDate', 'storyPoints'
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc', 'desc'

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(15);

  // Inline Editing State
  const [activeInlineMenu, setActiveInlineMenu] = useState(null); // { taskId, type: 'status' | 'priority' }

  // Close column menu on outside click
  useEffect(() => {
    const handleOutside = (e) => {
      if (colMenuRef.current && !colMenuRef.current.contains(e.target)) {
        setIsColMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  // Filter tasks by status tab, category, and date filter
  const baseFilteredTasks = useMemo(() => {
    return filteredTasks.filter(task => {
      const matchesStatus = statusFilter === 'ALL' || task.columnId === statusFilter;
      const matchesCategory = categoryFilter === 'ALL' || task.category === categoryFilter;
      
      let matchesDate = true;
      if (dateFilter === 'OVERDUE') {
        matchesDate = task.isOverdue || task.notice?.includes('Overdue');
      } else if (dateFilter === 'TODAY') {
        matchesDate = task.dueDate?.includes('Aug 16') || task.isOverdue;
      } else if (dateFilter === 'WEEK') {
        matchesDate = task.dueDate?.includes('Aug') || task.dueDate?.includes('Sep');
      }

      return matchesStatus && matchesCategory && matchesDate;
    });
  }, [filteredTasks, statusFilter, categoryFilter, dateFilter]);

  const toggleColumnVisibility = (colKey) => {
    setVisibleColumns(prev => ({ ...prev, [colKey]: !prev[colKey] }));
  };

  const handleImportSubmit = (e) => {
    e.preventDefault();
    try {
      const parsed = JSON.parse(importJsonText);
      const items = Array.isArray(parsed) ? parsed : [parsed];
      items.forEach(item => {
        addTask({
          title: item.title || 'Imported Task',
          description: item.description || '',
          columnId: item.columnId || 'backlog',
          priority: item.priority || 'MEDIUM',
          category: item.category || 'Frontend',
          dueDate: item.dueDate || 'Aug 30, 2026',
          storyPoints: item.storyPoints || 5
        });
      });
      alert(`Successfully imported ${items.length} task(s)!`);
      setIsImportModalOpen(false);
      setImportJsonText('');
    } catch (err) {
      alert('Invalid JSON format. Please paste a valid JSON array of tasks.');
    }
  };

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

          {/* Date Urgency Filter */}
          <div className="category-select-box">
            <Calendar size={13} className="cat-icon" />
            <select
              value={dateFilter}
              onChange={e => {
                setDateFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="ALL">All Dates</option>
              <option value="OVERDUE">Overdue Only</option>
              <option value="TODAY">Due Today</option>
              <option value="WEEK">Due This Week</option>
            </select>
          </div>
        </div>

        <div className="list-header-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {/* Column Toggle Dropdown */}
          <div className="inline-editable-wrapper" ref={colMenuRef}>
            <button
              onClick={() => setIsColMenuOpen(prev => !prev)}
              className="btn-secondary export-csv-btn"
              title="Configure Column Visibility"
            >
              <Columns size={15} />
              <span>Columns</span>
            </button>
            {isColMenuOpen && (
              <div className="inline-dropdown-menu col-toggle-menu" style={{ right: 0, left: 'auto', minWidth: '180px' }}>
                <div className="menu-header-label" style={{ padding: '0.4rem 0.6rem', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)' }}>
                  TOGGLE COLUMNS
                </div>
                {[
                  { key: 'id', label: 'ID' },
                  { key: 'title', label: 'Title' },
                  { key: 'status', label: 'Status' },
                  { key: 'priority', label: 'Priority' },
                  { key: 'assignee', label: 'Assignee' },
                  { key: 'dueDate', label: 'Due Date' },
                  { key: 'storyPoints', label: 'Points' },
                  { key: 'actions', label: 'Actions' }
                ].map(col => (
                  <button
                    key={col.key}
                    className={`inline-item ${visibleColumns[col.key] ? 'selected' : ''}`}
                    onClick={() => toggleColumnVisibility(col.key)}
                  >
                    <span>{col.label}</span>
                    {visibleColumns[col.key] && <Check size={13} className="text-purple" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Import Tasks Button */}
          <button onClick={() => setIsImportModalOpen(true)} className="btn-secondary export-csv-btn">
            <Upload size={15} />
            <span>Import JSON</span>
          </button>

          {/* Export CSV Button */}
          <button onClick={exportToCSV} className="btn-secondary export-csv-btn">
            <Download size={15} />
            <span>Export CSV</span>
          </button>
        </div>
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
              {visibleColumns.id && (
                <th className="sortable-th" onClick={() => handleSort('id')}>
                  <span>ID</span> {renderSortIcon('id')}
                </th>
              )}
              {visibleColumns.title && (
                <th className="sortable-th" onClick={() => handleSort('title')}>
                  <span>TITLE</span> {renderSortIcon('title')}
                </th>
              )}
              {visibleColumns.status && (
                <th className="sortable-th" onClick={() => handleSort('status')}>
                  <span>STATUS</span> {renderSortIcon('status')}
                </th>
              )}
              {visibleColumns.priority && (
                <th className="sortable-th" onClick={() => handleSort('priority')}>
                  <span>PRIORITY</span> {renderSortIcon('priority')}
                </th>
              )}
              {visibleColumns.assignee && <th>ASSIGNEE</th>}
              {visibleColumns.dueDate && (
                <th className="sortable-th" onClick={() => handleSort('dueDate')}>
                  <span>DUE DATE</span> {renderSortIcon('dueDate')}
                </th>
              )}
              {visibleColumns.storyPoints && (
                <th className="sortable-th" onClick={() => handleSort('storyPoints')}>
                  <span>POINTS</span> {renderSortIcon('storyPoints')}
                </th>
              )}
              {visibleColumns.actions && <th>ACTIONS</th>}
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
                  {visibleColumns.id && <td className="td-id">{task.id}</td>}
                  {visibleColumns.title && (
                    <td className="td-title">
                      <div className="title-cell">
                        <span className="title-text" onClick={() => openEditModal(task)} style={{ cursor: 'pointer' }}>
                          {task.title}
                        </span>
                        <span className="tag-pill tag-small">{task.category}</span>
                      </div>
                    </td>
                  )}
                  {visibleColumns.status && (
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
                  )}
                  {visibleColumns.priority && (
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
                  )}
                  {visibleColumns.assignee && (
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
                  )}
                  {visibleColumns.dueDate && (
                    <td className="td-duedate">
                      <div className={`duedate-cell ${task.isOverdue ? 'overdue' : ''}`}>
                        <Calendar size={13} />
                        <span>{task.dueDate}</span>
                      </div>
                    </td>
                  )}
                  {visibleColumns.storyPoints && (
                    <td className="td-points">
                      <span className="points-pill">{task.storyPoints || 5} pts</span>
                    </td>
                  )}
                  {visibleColumns.actions && (
                    <td className="td-actions">
                      <button onClick={() => openEditModal(task)} className="action-btn" title="Edit">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => deleteTask(task.id)} className="action-btn delete" title="Delete">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  )}
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

      {/* JSON Import Modal */}
      {isImportModalOpen && (
        <div className="modal-overlay" onClick={() => setIsImportModalOpen(false)}>
          <div className="modal-card import-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h3>Import Tasks (JSON)</h3>
              <button className="close-btn" onClick={() => setIsImportModalOpen(false)}>
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleImportSubmit} className="modal-form">
              <div className="form-group">
                <label>PASTE TASKS JSON ARRAY</label>
                <textarea
                  rows={8}
                  style={{
                    width: '100%',
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    color: 'var(--text-main)',
                    fontFamily: 'monospace',
                    fontSize: '0.8rem',
                    padding: '0.75rem'
                  }}
                  placeholder={`[\n  {\n    "title": "New Task Title",\n    "priority": "HIGH",\n    "category": "Backend"\n  }\n]`}
                  value={importJsonText}
                  onChange={e => setImportJsonText(e.target.value)}
                  required
                ></textarea>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setIsImportModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Import Tasks
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
