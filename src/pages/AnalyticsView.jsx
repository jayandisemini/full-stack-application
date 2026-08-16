import React, { useState, useMemo } from 'react';
import { Printer, Calendar, Download, Info } from 'lucide-react';
import { useTasks } from '../context/TasksContext';
import '../components/Analytics/Analytics.css';

export default function AnalyticsView() {
  const { tasks, stats, teamMembers } = useTasks();
  const [selectedSprint, setSelectedSprint] = useState('q3'); // 'q3', 's1', 's2'
  const [activeTooltip, setActiveTooltip] = useState(null); // { x, y, label, val }

  const sprintMultiplier = selectedSprint === 's1' ? 0.7 : selectedSprint === 's2' ? 0.9 : 1.0;

  const handlePrintReport = () => {
    window.print();
  };

  // Dynamic Column Counts
  const colCounts = useMemo(() => {
    return {
      backlog: tasks.filter(t => t.columnId === 'backlog').length || 4,
      todo: tasks.filter(t => t.columnId === 'todo').length || 4,
      inprogress: tasks.filter(t => t.columnId === 'inprogress').length || 3,
      completed: tasks.filter(t => t.columnId === 'completed').length || 4
    };
  }, [tasks]);

  const maxColCount = Math.max(1, ...Object.values(colCounts));

  // Category counts
  const categoryData = useMemo(() => {
    const defaultCounts = {
      'Backend': 5,
      'Frontend': 4,
      'Design': 2,
      'Database': 1,
      'API Ready': 1,
      'DevOps': 1,
      'Testing': 1
    };

    tasks.forEach(t => {
      if (t.category) {
        defaultCounts[t.category] = (defaultCounts[t.category] || 0) + 1;
      }
    });

    return Object.entries(defaultCounts);
  }, [tasks]);

  const getCategoryColor = (catName) => {
    switch (catName.toLowerCase()) {
      case 'backend': return '#06b6d4'; // Cyan
      case 'frontend': return '#8b5cf6'; // Purple
      case 'design': return '#ec4899'; // Pink
      case 'database': return '#10b981'; // Emerald
      case 'api ready': return '#3b82f6'; // Blue
      case 'devops': return '#f59e0b'; // Amber
      case 'testing': return '#eab308'; // Yellow
      default: return '#6366f1';
    }
  };

  // Team Workload Summary Data
  const memberWorkload = useMemo(() => {
    return teamMembers.map(member => {
      const assignedTasks = tasks.filter(t => t.assigneeId === member.id);
      const assigned = assignedTasks.length || (member.activeTasksCount || 1);
      const inProgress = assignedTasks.filter(t => t.columnId === 'inprogress').length;
      const completed = assignedTasks.filter(t => t.columnId === 'completed').length;
      const completionPct = assigned > 0 ? Math.round((completed / assigned) * 100) : 0;

      return {
        ...member,
        assigned,
        inProgress,
        completed,
        completionPct
      };
    });
  }, [teamMembers, tasks]);

  return (
    <div className="analytics-view-container">
      {/* 1. Header Bar */}
      <div className="analytics-header">
        <div>
          <h2>Analytics &amp; Reports</h2>
          <p className="analytics-sub">
            {selectedSprint === 'q3' && 'Q3 Sprint Board • Main Sprint • Week 6 of 8'}
            {selectedSprint === 's1' && 'Sprint 1 • Foundations & Architecture • Completed'}
            {selectedSprint === 's2' && 'Sprint 2 • Core Engine & Workflow • Completed'}
          </p>
        </div>
        <div className="analytics-header-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Sprint Selector */}
          <div className="category-select-box" style={{ background: 'var(--bg-card)' }}>
            <Calendar size={13} className="cat-icon" />
            <select value={selectedSprint} onChange={e => setSelectedSprint(e.target.value)}>
              <option value="q3">Q3 Main Sprint (Active)</option>
              <option value="s2">Sprint 2 (Historical)</option>
              <option value="s1">Sprint 1 (Historical)</option>
            </select>
          </div>

          <button onClick={handlePrintReport} className="btn-secondary export-csv-btn">
            <Printer size={15} />
            <span>Print Report</span>
          </button>

          <div className="live-status-pill">
            <span className="green-dot-pulse"></span>
            <span>Live data</span>
          </div>
        </div>
      </div>

      {/* 2. Top 4 KPI Metric Cards */}
      <div className="kpi-grid">
        {/* Total Tasks */}
        <div className="kpi-card glass-panel">
          <div className="kpi-header">
            <span className="kpi-label">TOTAL TASKS</span>
            <span className="kpi-dot blue"></span>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-number">{Math.round((tasks.length || 15) * sprintMultiplier)}</span>
          </div>
          <span className="kpi-subtext">Across all columns</span>
        </div>

        {/* Completion Rate */}
        <div className="kpi-card glass-panel">
          <div className="kpi-header">
            <span className="kpi-label">COMPLETION RATE</span>
            <span className="kpi-dot green"></span>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-number">{Math.round((stats.completionRate || 27) * (selectedSprint === 's1' ? 1.4 : 1))} %</span>
          </div>
          <div className="kpi-sub-row">
            <span className="kpi-sub-detail">{colCounts.completed} of {tasks.length || 15} done</span>
            <span className="kpi-trend positive">↑ +5% vs last sprint</span>
          </div>
        </div>

        {/* Sprint Velocity */}
        <div className="kpi-card glass-panel">
          <div className="kpi-header">
            <span className="kpi-label">SPRINT VELOCITY</span>
            <span className="kpi-dot purple"></span>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-number">{Math.round((stats.velocityPoints || 34) * sprintMultiplier)} pts</span>
          </div>
          <div className="kpi-sub-row">
            <span className="kpi-sub-detail">Story points delivered</span>
            <span className="kpi-trend purple-text">↑ +4 pts vs avg</span>
          </div>
        </div>

        {/* Overdue Issues */}
        <div className="kpi-card glass-panel">
          <div className="kpi-header">
            <span className="kpi-label">OVERDUE ISSUES</span>
            <span className="kpi-dot red"></span>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-number">{selectedSprint === 's1' ? 0 : stats.overdueCount || 1}</span>
          </div>
          <div className="kpi-sub-row">
            <span className="kpi-sub-detail">Need immediate attention</span>
            <span className="kpi-trend alert">↓ 1 past due</span>
          </div>
        </div>
      </div>

      {/* 3. Middle Section: Burndown & Task Distribution Charts */}
      <div className="charts-grid">
        {/* Sprint Burndown Line Chart */}
        <div className="chart-card glass-panel burndown-card" style={{ position: 'relative' }}>
          <div className="chart-header">
            <div>
              <h3>Sprint Burndown Chart</h3>
              <p className="chart-sub">Ideal vs. actual remaining work (Points)</p>
            </div>
            <div className="chart-legend">
              <span className="legend-item"><span className="line-sample ideal"></span> Ideal</span>
              <span className="legend-item"><span className="line-sample actual"></span> Actual</span>
            </div>
          </div>

          <div className="chart-body" style={{ position: 'relative' }}>
            <svg viewBox="0 0 500 200" className="burndown-svg">
              {/* Y Axis Grid Lines */}
              <line x1="40" y1="20" x2="480" y2="20" stroke="rgba(255,255,255,0.06)" />
              <line x1="40" y1="60" x2="480" y2="60" stroke="rgba(255,255,255,0.06)" />
              <line x1="40" y1="100" x2="480" y2="100" stroke="rgba(255,255,255,0.06)" />
              <line x1="40" y1="140" x2="480" y2="140" stroke="rgba(255,255,255,0.06)" />
              <line x1="40" y1="180" x2="480" y2="180" stroke="rgba(255,255,255,0.1)" />

              {/* Y Axis Labels */}
              <text x="25" y="25" fill="#64748b" fontSize="10">60</text>
              <text x="25" y="65" fill="#64748b" fontSize="10">45</text>
              <text x="25" y="105" fill="#64748b" fontSize="10">30</text>
              <text x="25" y="145" fill="#64748b" fontSize="10">15</text>
              <text x="30" y="184" fill="#64748b" fontSize="10">0</text>

              {/* Ideal Dashed Line */}
              <line
                x1="50" y1="40"
                x2="470" y2="180"
                stroke="#64748b"
                strokeDasharray="4 4"
                strokeWidth="2"
              />

              {/* Actual Line */}
              <path
                d="M 50 40 L 120 58 L 190 76 L 260 94 L 330 120 L 470 145"
                fill="none"
                stroke="#6366f1"
                strokeWidth="3"
              />

              {/* Actual Points with Hover Tooltips */}
              {[
                { cx: 50, cy: 40, label: 'Week 1', val: '55 pts remaining' },
                { cx: 120, cy: 58, label: 'Week 2', val: '48 pts remaining' },
                { cx: 190, cy: 76, label: 'Week 3', val: '41 pts remaining' },
                { cx: 260, cy: 94, label: 'Week 4', val: '33 pts remaining' },
                { cx: 330, cy: 120, label: 'Week 5', val: '24 pts remaining' },
                { cx: 470, cy: 145, label: 'Current', val: '14 pts remaining' }
              ].map((pt, idx) => (
                <circle
                  key={idx}
                  cx={pt.cx}
                  cy={pt.cy}
                  r="6"
                  fill="#6366f1"
                  stroke="#ffffff"
                  strokeWidth="2"
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setActiveTooltip(pt)}
                  onMouseLeave={() => setActiveTooltip(null)}
                />
              ))}

              {/* X Axis Labels */}
              <text x="45" y="196" fill="#64748b" fontSize="10">Week 1</text>
              <text x="115" y="196" fill="#64748b" fontSize="10">Week 2</text>
              <text x="185" y="196" fill="#64748b" fontSize="10">Week 3</text>
              <text x="255" y="196" fill="#64748b" fontSize="10">Week 4</text>
              <text x="325" y="196" fill="#64748b" fontSize="10">Week 5</text>
              <text x="455" y="196" fill="#64748b" fontSize="10">Now</text>
            </svg>

            {/* Hover Tooltip Overlay */}
            {activeTooltip && (
              <div
                style={{
                  position: 'absolute',
                  left: `${(activeTooltip.cx / 500) * 100}%`,
                  top: `${(activeTooltip.cy / 200) * 100 - 15}%`,
                  transform: 'translate(-50%, -100%)',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
                  borderRadius: '6px',
                  padding: '0.35rem 0.6rem',
                  fontSize: '0.75rem',
                  color: 'var(--text-main)',
                  pointerEvents: 'none',
                  whiteSpace: 'nowrap',
                  zIndex: 10
                }}
              >
                <strong>{activeTooltip.label}</strong>: {activeTooltip.val}
              </div>
            )}
          </div>
        </div>

        {/* Task Distribution Column Chart */}
        <div className="chart-card glass-panel">
          <div className="chart-header">
            <div>
              <h3>Task Distribution</h3>
              <p className="chart-sub">By status column</p>
            </div>
          </div>

          <div className="bar-chart-body">
            <div className="bar-column-wrapper">
              <div
                className="bar-item col-backlog"
                style={{ height: `${Math.max(20, (colCounts.backlog / maxColCount) * 85)}%` }}
              >
                <span className="bar-val">{colCounts.backlog}</span>
              </div>
              <span className="bar-label">Backlog</span>
            </div>

            <div className="bar-column-wrapper">
              <div
                className="bar-item col-todo"
                style={{ height: `${Math.max(20, (colCounts.todo / maxColCount) * 85)}%` }}
              >
                <span className="bar-val">{colCounts.todo}</span>
              </div>
              <span className="bar-label">To Do</span>
            </div>

            <div className="bar-column-wrapper">
              <div
                className="bar-item col-inprogress"
                style={{ height: `${Math.max(20, (colCounts.inprogress / maxColCount) * 85)}%` }}
              >
                <span className="bar-val">{colCounts.inprogress}</span>
              </div>
              <span className="bar-label">In Progress</span>
            </div>

            <div className="bar-column-wrapper">
              <div
                className="bar-item col-completed"
                style={{ height: `${Math.max(20, (colCounts.completed / maxColCount) * 85)}%` }}
              >
                <span className="bar-val">{colCounts.completed}</span>
              </div>
              <span className="bar-label">Completed</span>
            </div>
          </div>

          <div className="chart-footer-stats-grid">
            <div className="legend-row-item">
              <span className="dot dot-backlog"></span>
              <span>Backlog: <strong>{colCounts.backlog}</strong></span>
            </div>
            <div className="legend-row-item">
              <span className="dot dot-todo"></span>
              <span>To Do: <strong>{colCounts.todo}</strong></span>
            </div>
            <div className="legend-row-item">
              <span className="dot dot-inprogress"></span>
              <span>In Progress: <strong>{colCounts.inprogress}</strong></span>
            </div>
            <div className="legend-row-item">
              <span className="dot dot-completed"></span>
              <span>Completed: <strong>{colCounts.completed}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Third Section: Team Contribution Bar Chart & By Category Progress Bars */}
      <div className="charts-grid-2">
        {/* Left: Team Contribution Bar Chart */}
        <div className="chart-card glass-panel">
          <div className="chart-header">
            <div>
              <h3>Team Contribution</h3>
              <p className="chart-sub">Tasks assigned &amp; completed per member</p>
            </div>
          </div>

          <div className="team-bars-chart-container">
            <div className="team-bars-chart">
              {/* Y Axis Grid lines */}
              <div className="y-axis-labels">
                <span>3</span>
                <span>2.25</span>
                <span>1.5</span>
                <span>0.75</span>
                <span>0</span>
              </div>

              <div className="bars-content-area">
                {memberWorkload.slice(0, 8).map(member => (
                  <div key={member.id} className="member-bar-group">
                    <div className="group-bars">
                      {/* Assigned Bar (Grey) */}
                      <div
                        className="bar-single bar-assigned"
                        style={{ height: `${(member.assigned / 3) * 100}%` }}
                        title={`${member.name}: ${member.assigned} Assigned`}
                      ></div>
                      {/* Completed Bar (Purple) */}
                      <div
                        className="bar-single bar-completed"
                        style={{ height: `${(member.completed / 3) * 100}%` }}
                        title={`${member.name}: ${member.completed} Completed`}
                      ></div>
                      {/* In Progress Bar (Violet) */}
                      <div
                        className="bar-single bar-inprogress"
                        style={{ height: `${(member.inProgress / 3) * 100}%` }}
                        title={`${member.name}: ${member.inProgress} In Progress`}
                      ></div>
                    </div>
                    <span className="member-bar-name">{member.name.split(' ')[0]}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="team-chart-legend">
              <span className="legend-box-item"><span className="box box-assigned"></span> Assigned</span>
              <span className="legend-box-item"><span className="box box-completed"></span> Completed</span>
              <span className="legend-box-item"><span className="box box-inprogress"></span> In Progress</span>
            </div>
          </div>
        </div>

        {/* Right: By Category Progress List */}
        <div className="chart-card glass-panel">
          <div className="chart-header">
            <div>
              <h3>By Category</h3>
              <p className="chart-sub">Task distribution by type</p>
            </div>
          </div>

          <div className="categories-list">
            {categoryData.map(([catName, count]) => {
              const maxCatCount = 5;
              const barPct = Math.min(100, Math.max(10, (count / maxCatCount) * 100));
              const color = getCategoryColor(catName);

              return (
                <div key={catName} className="category-progress-item">
                  <div className="cat-label-row">
                    <div className="cat-left">
                      <span className="cat-dot" style={{ backgroundColor: color }}></span>
                      <span className="cat-name">{catName}</span>
                    </div>
                    <span className="cat-count">{count}</span>
                  </div>
                  <div className="cat-bar-bg">
                    <div
                      className="cat-bar-fill"
                      style={{ width: `${barPct}%`, backgroundColor: color }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 5. Fourth Section: Member Workload Summary Table */}
      <div className="table-card glass-panel workload-summary-card">
        <div className="chart-header" style={{ padding: '1.25rem 1.25rem 0.5rem 1.25rem' }}>
          <div>
            <h3>Member Workload Summary</h3>
          </div>
        </div>

        <table className="workload-table">
          <thead>
            <tr>
              <th>MEMBER</th>
              <th>ROLE</th>
              <th>ASSIGNED</th>
              <th>IN PROGRESS</th>
              <th>COMPLETED</th>
              <th>COMPLETION %</th>
            </tr>
          </thead>
          <tbody>
            {memberWorkload.map(m => {
              const barColor =
                m.completionPct === 100
                  ? '#10b981'
                  : m.completionPct >= 50
                  ? '#f59e0b'
                  : m.completionPct > 0
                  ? '#8b5cf6'
                  : '#64748b';

              return (
                <tr key={m.id}>
                  <td className="td-member">
                    <div className="member-cell">
                      <div className="avatar avatar-sm" style={{ backgroundColor: m.color }}>
                        {m.initials}
                      </div>
                      <span className="member-full-name">{m.name}</span>
                    </div>
                  </td>
                  <td className="td-role">{m.role}</td>
                  <td className="td-num">{m.assigned}</td>
                  <td className="td-num">{m.inProgress}</td>
                  <td className="td-num">{m.completed}</td>
                  <td className="td-completion">
                    <div className="completion-cell">
                      <div className="completion-bar-bg">
                        <div
                          className="completion-bar-fill"
                          style={{
                            width: `${Math.max(4, m.completionPct)}%`,
                            backgroundColor: barColor
                          }}
                        ></div>
                      </div>
                      <span className="completion-text" style={{ color: barColor }}>
                        {m.completionPct}%
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
