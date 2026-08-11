import React from 'react';
import { Mail, CheckCircle2, Circle } from 'lucide-react';
import { useTasks } from '../context/TasksContext';
import '../components/Team/Team.css';

export default function TeamView() {
  const { teamMembers, tasks } = useTasks();

  return (
    <div className="team-view-container">
      <div className="team-header">
        <div>
          <h2>Team Members ({teamMembers.length})</h2>
          <p className="team-sub">Engineering Team • Pro Plan Workspace</p>
        </div>
      </div>

      <div className="team-grid">
        {teamMembers.map(member => {
          const memberTasks = tasks.filter(t => t.assigneeId === member.id);
          const completedCount = memberTasks.filter(t => t.columnId === 'completed').length;

          return (
            <div key={member.id} className="member-card glass-panel">
              <div className="member-card-top">
                <div
                  className="member-avatar-lg"
                  style={{ backgroundColor: member.color }}
                >
                  {member.initials}
                  <span className={`status-indicator ${member.status}`}></span>
                </div>
                <div className="member-info">
                  <h3 className="member-name">{member.name}</h3>
                  <span className="member-role">{member.role}</span>
                  <div className="member-email-row">
                    <Mail size={12} />
                    <span>{member.email}</span>
                  </div>
                </div>
              </div>

              <div className="member-card-stats">
                <div className="m-stat">
                  <span className="m-stat-val">{memberTasks.length}</span>
                  <span className="m-stat-label">Assigned</span>
                </div>
                <div className="m-stat">
                  <span className="m-stat-val green">{completedCount}</span>
                  <span className="m-stat-label">Done</span>
                </div>
                <div className="m-stat">
                  <span className="m-stat-val purple">
                    {memberTasks.reduce((s, t) => s + (t.storyPoints || 0), 0)}
                  </span>
                  <span className="m-stat-label">Points</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
