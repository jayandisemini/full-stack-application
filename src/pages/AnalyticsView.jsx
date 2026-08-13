import React, { useState, useMemo } from 'react';
import { Download, Calendar, ShieldCheck, Zap } from 'lucide-react';
import { useTasks } from '../context/TasksContext';
import '../components/Analytics/Analytics.css';

export default function AnalyticsView() {
  const { tasks, stats, teamMembers } = useTasks();
  const [timeframe, setTimeframe] = useState('q3');
  const [activeTooltip, setActiveTooltip] = useState(null);

  // Dynamic Column Distribution Counts
  const colCounts = useMemo(() => {
    return {
      backlog: tasks.filter(t => t.columnId === 'backlog').length,
      todo: tasks.filter(t => t.columnId === 'todo').length,
      inprogress: tasks.filter(t => t.columnId === 'inprogress').length,
      completed: tasks.filter(t => t.columnId === 'completed').length
    };
  }, [tasks]);

  const maxColCount = Math.max(1, ...Object.values(colCounts));

  // Compute category counts and gradients
  const categoryCounts = useMemo(() => {
    return tasks.reduce((acc, task) => {
      const cat = task.category || 'Other';
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {});
  }, [tasks]);

  const sortedCategories = useMemo(() => {
    return Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]);
  }, [categoryCounts]);

  const getCategoryColor = (catName) => {
    switch (catName.toLowerCase()) {
      case 'backend': return '#22d3ee';
      case 'frontend': return '#c084fc';
      case 'design': return '#f472b6';
      case 'database': return '#34d399';
      case 'devops': return '#60a5fa';
      case 'testing': return '#fbbf24';
      default: return '#818cf8';
    }
  };

  // Export Analytics Summary Report
  const exportAnalyticsReport = () => {
    const reportText = `SyncBoard Analytics Report (${new Date().toLocaleDateString()})
=====================================================
Timeframe: ${timeframe.toUpperCase()}
Total Tasks: ${tasks.length}
Completed Tasks: ${colCounts.completed} (${stats.completionRate}%)
Sprint Velocity: ${stats.velocityPoints} Story Points
Overdue Issues: ${stats.overdueCount}

Task Distribution by Status:
- Backlog: ${colCounts.backlog}
- To Do: ${colCounts.todo}
- In Progress: ${colCounts.inprogress}
- Completed: ${colCounts.completed}

Category Distribution:
${sortedCategories.map(([cat, count]) => `- ${cat}: ${count}`).join('\n')}
`;

    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `syncboard_analytics_report_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Burndown Data Points
  const burndownPoints = [
    { week: 'Week 1', points: 60, cx: 50, cy: 40 },
    { week: 'Week 2', points: 52, cx: 120, cy: 58 },
    { week: 'Week 3', points: 44, cx: 190, cy: 76 },
    { week: 'Week 4', points: 36, cx: 260, cy: 94 },
    { week: 'Week 5', points: 24, cx: 330, cy: 120 },
    { week: 'Week 6 (Now)', points: 18, cx: 470, cy: 145 }
  ];

  return (
    <div className="analytics-view-container">
      {/* Top Title & Timeframe Selector Bar */}
      <div className="analytics-header">
        <div>
          <h2>Analytics &amp; Reports</h2>
          <p className="analytics-sub">Q3 Sprint Board • Main Sprint • Week 6 of 8</p>
        </div>

        <div className="analytics-header-controls">
          {/* Timeframe Pill Switcher */}
          <div className="timeframe-pill-group">
            {[
              { id: 'q3', label: 'Q3 Sprint' },
              { id: 'q2', label: 'Q2 Sprint' },
              { id: 'all', label: 'All Time' }
            ].map(tf => (
              <button
                key={tf.id}
                onClick={() => setTimeframe(tf.id)}
                className={`tf-btn ${timeframe === tf.id ? 'active' : ''}`}
              >
                {tf.label}
              </button>
            ))}
          </div>

          <button onClick={exportAnalyticsReport} className="btn-secondary export-report-btn">
            <Download size={14} />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* 4 Metric KPI Cards */}
      <div className="kpi-grid">
        {/* Total Tasks */}
        <div className="kpi-card glass-panel">
          <div className="kpi-header">
            <span className="kpi-label">TOTAL TASKS</span>
            <span className="kpi-dot blue"></span>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-number">{tasks.length}</span>
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
            <span className="kpi-number">{stats.completionRate}%</span>
          </div>
          <div className="kpi-trend positive">
            <span>↑ +5% vs last sprint</span>
          </div>
        </div>

        {/* Sprint Velocity */}
        <div className="kpi-card glass-panel">
          <div className="kpi-header">
            <span className="kpi-label">SPRINT VELOCITY</span>
            <span className="kpi-dot purple"></span>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-number">{stats.velocityPoints} pts</span>
          </div>
          <div className="kpi-trend purple-text">
            <span>↑ +4 pts vs avg</span>
          </div>
        </div>

        {/* Overdue Issues */}
        <div className="kpi-card glass-panel">
          <div className="kpi-header">
            <span className="kpi-label">OVERDUE ISSUES</span>
            <span className="kpi-dot red"></span>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-number">{stats.overdueCount}</span>
          </div>
          <div className="kpi-trend alert">
            <span>↓ {stats.overdueCount} past due</span>
          </div>
        </div>
      </div>

      {/* Sprint Health Score Banner */}
      <div className="sprint-health-banner glass-panel">
        <div className="health-badge-group">
          <div className="health-icon-circle">
            <ShieldCheck size={22} />
          </div>
          <div>
            <span className="health-title">Sprint Health Index</span>
            <span className="health-desc">Velocity is 15% above target and completion on track</span>
          </div>
        </div>
        <div className="health-score-pill">
          <Zap size={14} className="zap-icon" />
          <span>Score: 96 / 100 • Excellent</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        {/* Sprint Burndown Line Chart (SVG) */}
        <div className="chart-card glass-panel burndown-card">
          <div className="chart-header">
            <div>
              <h3>Sprint Burndown Chart</h3>
              <p className="chart-sub">Ideal vs. actual remaining work - Q3 Sprint</p>
            </div>
            <div className="chart-legend">
              <span className="legend-item"><span className="line-sample ideal"></span> Ideal</span>
              <span className="legend-item"><span className="line-sample actual"></span> Actual</span>
            </div>
          </div>

          <div className="chart-body relative">
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

              {/* Actual Line Gradient Area */}
              <path
                d="M 50 40 L 120 58 L 190 76 L 260 94 L 330 120 L 470 145"
                fill="none"
                stroke="#6366f1"
                strokeWidth="3"
              />

              {/* Interactive Actual Points */}
              {burndownPoints.map((pt, idx) => (
                <circle
                  key={idx}
                  cx={pt.cx}
                  cy={pt.cy}
                  r="6"
                  fill="#6366f1"
                  stroke="#ffffff"
                  strokeWidth="2"
                  className="burndown-interactive-point"
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

            {/* Hover Tooltip Popup */}
            {activeTooltip && (
              <div className="burndown-tooltip-popup">
                <strong>{activeTooltip.week}</strong>
                <span>{activeTooltip.points} story points remaining</span>
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Task Distribution Column Chart */}
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
                style={{ height: `${Math.max(15, (colCounts.backlog / maxColCount) * 85)}%` }}
              >
                <span className="bar-val">{colCounts.backlog}</span>
              </div>
              <span className="bar-label">Backlog</span>
            </div>

            <div className="bar-column-wrapper">
              <div
                className="bar-item col-todo"
                style={{ height: `${Math.max(15, (colCounts.todo / maxColCount) * 85)}%` }}
              >
                <span className="bar-val">{colCounts.todo}</span>
              </div>
              <span className="bar-label">To Do</span>
            </div>

            <div className="bar-column-wrapper">
              <div
                className="bar-item col-inprogress"
                style={{ height: `${Math.max(15, (colCounts.inprogress / maxColCount) * 85)}%` }}
              >
                <span className="bar-val">{colCounts.inprogress}</span>
              </div>
              <span className="bar-label">In Progress</span>
            </div>

            <div className="bar-column-wrapper">
              <div
                className="bar-item col-completed"
                style={{ height: `${Math.max(15, (colCounts.completed / maxColCount) * 85)}%` }}
              >
                <span className="bar-val">{colCounts.completed}</span>
              </div>
              <span className="bar-label">Completed</span>
            </div>
          </div>

          <div className="chart-footer-stats">
            <div className="legend-row">
              <span className="dot dot-backlog"></span> Backlog: <strong>{colCounts.backlog}</strong>
              <span className="dot dot-todo"></span> To Do: <strong>{colCounts.todo}</strong>
            </div>
            <div className="legend-row">
              <span className="dot dot-inprogress"></span> In Progress: <strong>{colCounts.inprogress}</strong>
              <span className="dot dot-completed"></span> Completed: <strong>{colCounts.completed}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Lower Row: Category Breakdown & Team Contribution */}
      <div className="charts-grid-2">
        {/* Category Breakdown */}
        <div className="chart-card glass-panel">
          <div className="chart-header">
            <div>
              <h3>By Category</h3>
              <p className="chart-sub">Task distribution by type</p>
            </div>
          </div>

          <div className="categories-list">
            {sortedCategories.map(([catName, count]) => {
              const pct = tasks.length > 0 ? Math.round((count / tasks.length) * 100) : 0;
              const color = getCategoryColor(catName);
              return (
                <div key={catName} className="category-progress-item">
                  <div className="cat-label-row">
                    <span className="cat-name">{catName}</span>
                    <span className="cat-count">{count} ({pct}%)</span>
                  </div>
                  <div className="cat-bar-bg">
                    <div
                      className="cat-bar-fill"
                      style={{ width: `${pct}%`, backgroundColor: color }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Team Contribution */}
        <div className="chart-card glass-panel">
          <div className="chart-header">
            <div>
              <h3>Team Contribution</h3>
              <p className="chart-sub">Tasks assigned &amp; completed per member</p>
            </div>
          </div>

          <div className="team-contribution-list">
            {teamMembers.slice(0, 5).map(member => {
              const assigned = tasks.filter(t => t.assigneeId === member.id).length;
              const done = tasks.filter(t => t.assigneeId === member.id && t.columnId === 'completed').length;
              const pct = assigned > 0 ? Math.round((done / assigned) * 100) : 0;

              return (
                <div key={member.id} className="team-contrib-item">
                  <div className="contrib-member">
                    <div className="avatar avatar-sm" style={{ backgroundColor: member.color }}>
                      {member.initials}
                    </div>
                    <div className="member-info">
                      <span className="member-name">{member.name}</span>
                      <span className="member-role">{member.role}</span>
                    </div>
                  </div>

                  <div className="contrib-bar-group">
                    <div className="contrib-progress-bg">
                      <div className="contrib-progress-fill" style={{ width: `${pct}%` }}></div>
                    </div>
                    <div className="contrib-metrics">
                      <span className="done-tag">{done} Done</span>
                      <span className="total-tag">{assigned} Assigned</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
