import React from 'react';
import { TrendingUp, CheckCircle, AlertCircle, Award, Radio } from 'lucide-react';
import { useTasks } from '../context/TasksContext';
import '../components/Analytics/Analytics.css';

export default function AnalyticsView() {
  const { tasks, stats, teamMembers } = useTasks();

  // Compute category counts
  const categoryCounts = tasks.reduce((acc, task) => {
    const cat = task.category || 'Other';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  const sortedCategories = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]);

  return (
    <div className="analytics-view-container">
      {/* Top Title Bar */}
      <div className="analytics-header">
        <div>
          <h2>Analytics &amp; Reports</h2>
          <p className="analytics-sub">Q3 Sprint Board • Main Sprint • Week 6 of 8</p>
        </div>
        <div className="live-status-pill">
          <span className="green-dot-pulse"></span>
          <span>Live data • Updated just now</span>
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
            <span className="kpi-number">{stats.total}</span>
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
            <span>↓ 1 past due</span>
          </div>
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

          <div className="chart-body">
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
              <defs>
                <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                </linearGradient>
              </defs>

              <path
                d="M 50 40 L 120 55 L 190 70 L 260 85 L 330 110 L 400 135 L 470 145"
                fill="none"
                stroke="#6366f1"
                strokeWidth="3"
              />

              {/* Actual Line Points */}
              {[[50, 40], [120, 55], [190, 70], [260, 85], [330, 110], [400, 135], [470, 145]].map(([cx, cy], idx) => (
                <circle key={idx} cx={cx} cy={cy} r="4" fill="#6366f1" stroke="#ffffff" strokeWidth="2" />
              ))}

              {/* X Axis Labels */}
              <text x="45" y="196" fill="#64748b" fontSize="10">Week 1</text>
              <text x="115" y="196" fill="#64748b" fontSize="10">Week 2</text>
              <text x="185" y="196" fill="#64748b" fontSize="10">Week 3</text>
              <text x="255" y="196" fill="#64748b" fontSize="10">Week 4</text>
              <text x="325" y="196" fill="#64748b" fontSize="10">Week 5</text>
              <text x="455" y="196" fill="#64748b" fontSize="10">Now</text>
            </svg>
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
              <div className="bar-item col-backlog" style={{ height: '70%' }}>
                <span className="bar-val">4</span>
              </div>
              <span className="bar-label">Backlog</span>
            </div>

            <div className="bar-column-wrapper">
              <div className="bar-item col-todo" style={{ height: '70%' }}>
                <span className="bar-val">4</span>
              </div>
              <span className="bar-label">To Do</span>
            </div>

            <div className="bar-column-wrapper">
              <div className="bar-item col-inprogress" style={{ height: '55%' }}>
                <span className="bar-val">3</span>
              </div>
              <span className="bar-label">In Progress</span>
            </div>

            <div className="bar-column-wrapper">
              <div className="bar-item col-completed" style={{ height: '70%' }}>
                <span className="bar-val">4</span>
              </div>
              <span className="bar-label">Completed</span>
            </div>
          </div>

          <div className="chart-footer-stats">
            <div className="legend-row">
              <span className="dot dot-backlog"></span> Backlog: <strong>4</strong>
              <span className="dot dot-todo"></span> To Do: <strong>4</strong>
            </div>
            <div className="legend-row">
              <span className="dot dot-inprogress"></span> In Progress: <strong>3</strong>
              <span className="dot dot-completed"></span> Completed: <strong>4</strong>
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
              const pct = Math.round((count / tasks.length) * 100);
              return (
                <div key={catName} className="category-progress-item">
                  <div className="cat-label-row">
                    <span className="cat-name">{catName}</span>
                    <span className="cat-count">{count}</span>
                  </div>
                  <div className="cat-bar-bg">
                    <div className="cat-bar-fill" style={{ width: `${pct * 2}%` }}></div>
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
              return (
                <div key={member.id} className="team-contrib-item">
                  <div className="contrib-member">
                    <div className="avatar avatar-sm" style={{ backgroundColor: member.color }}>
                      {member.initials}
                    </div>
                    <span>{member.name}</span>
                  </div>
                  <div className="contrib-metrics">
                    <span className="done-tag">{done} Done</span>
                    <span className="total-tag">{assigned} Assigned</span>
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
