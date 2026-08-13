import React, { useState, useMemo } from 'react';
import { Search, Filter, Plus, MoreHorizontal, Clock, CheckCircle2, Layers, UserPlus } from 'lucide-react';
import { useTasks } from '../context/TasksContext';
import '../components/Team/Team.css';

export default function TeamView() {
  const { teamMembers, tasks } = useTasks();

  const [searchMember, setSearchMember] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [inviteModalOpen, setInviteModalOpen] = useState(false);

  // Filter members by search & role
  const filteredMembers = useMemo(() => {
    return teamMembers.filter(member => {
      const matchesSearch =
        member.name.toLowerCase().includes(searchMember.toLowerCase()) ||
        member.role.toLowerCase().includes(searchMember.toLowerCase()) ||
        member.email.toLowerCase().includes(searchMember.toLowerCase());
      
      const matchesRole = roleFilter === 'ALL' || member.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [teamMembers, searchMember, roleFilter]);

  const onlineCount = teamMembers.filter(m => m.status === 'online').length;

  return (
    <div className="team-view-container">
      {/* Sub-header Filter & Control Bar */}
      <div className="team-header-bar">
        <div className="team-header-left">
          <h2 className="team-page-title">Team Members</h2>
          
          <div className="search-inline">
            <Search size={14} className="search-icon" />
            <input
              type="text"
              placeholder="Search members..."
              value={searchMember}
              onChange={e => setSearchMember(e.target.value)}
            />
          </div>

          <div className="role-select-box">
            <Filter size={13} className="role-icon" />
            <select
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value)}
            >
              <option value="ALL">All Roles</option>
              <option value="Frontend Lead">Frontend Lead</option>
              <option value="Backend Engineer">Backend Engineer</option>
              <option value="API Engineer">API Engineer</option>
              <option value="Frontend Engineer">Frontend Engineer</option>
              <option value="DevOps">DevOps</option>
              <option value="Designer">Designer</option>
              <option value="QA Engineer">QA Engineer</option>
              <option value="Full-Stack">Full-Stack</option>
            </select>
          </div>
        </div>

        <div className="team-header-right">
          <div className="online-stats-pill">
            <span className="dot-green"></span>
            <span>{onlineCount} online • {teamMembers.length} total</span>
          </div>

          <button
            onClick={() => setInviteModalOpen(true)}
            className="btn-primary invite-btn"
          >
            <Plus size={15} />
            <span>Invite Member</span>
          </button>
        </div>
      </div>

      {/* 4x2 Grid of Member Cards */}
      <div className="team-grid">
        {filteredMembers.map(member => {
          const memberTasks = tasks.filter(t => t.assigneeId === member.id);
          const activeTasks = memberTasks.filter(t => t.columnId === 'inprogress' || t.columnId === 'todo').length;
          const completedTasks = memberTasks.filter(t => t.columnId === 'completed').length;
          const totalTasks = memberTasks.length || member.activeTasksCount || 1;
          const completionPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
          const isOnline = member.status === 'online';

          return (
            <div key={member.id} className="member-card glass-panel">
              {/* Card Top Action */}
              <div className="card-top-action">
                <button className="more-btn" title="Options">
                  <MoreHorizontal size={16} />
                </button>
              </div>

              {/* Avatar with Status Dot */}
              <div className="avatar-wrapper">
                <div
                  className="member-avatar-lg"
                  style={{ backgroundColor: member.color || '#6366f1' }}
                >
                  {member.initials}
                  <span className={`status-dot-badge ${isOnline ? 'online' : 'offline'}`}></span>
                </div>
              </div>

              {/* Member Core Details */}
              <div className="member-details-center">
                <h3 className="member-name">{member.name}</h3>
                <span className="member-role-title">{member.role}</span>
                <span className="member-email">{member.email || `${member.name.toLowerCase().replace(' ', '.')}@syncboard.io`}</span>
                <div className={`status-text-row ${isOnline ? 'online' : 'offline'}`}>
                  <span className="status-bullet"></span>
                  <span>{isOnline ? 'Online now' : 'Offline'}</span>
                </div>
              </div>

              {/* 3-Box Stats Row */}
              <div className="stats-three-boxes">
                <div className="stat-box">
                  <div className="stat-box-val">{activeTasks}</div>
                  <div className="stat-box-lbl">ACTIVE</div>
                </div>
                <div className="stat-box">
                  <div className="stat-box-val">{completedTasks}</div>
                  <div className="stat-box-lbl">DONE</div>
                </div>
                <div className="stat-box">
                  <div className="stat-box-val">{totalTasks}</div>
                  <div className="stat-box-lbl">TOTAL</div>
                </div>
              </div>

              {/* Bottom Completion Progress Bar */}
              <div className="card-completion-section">
                <div className="completion-label-row">
                  <span className="completion-title">Completion</span>
                  <span className="completion-pct-val">{completionPct}%</span>
                </div>
                <div className="completion-bar-track">
                  <div
                    className="completion-bar-fill"
                    style={{
                      width: `${Math.max(3, completionPct)}%`,
                      backgroundColor: completionPct === 100 ? '#10b981' : completionPct > 0 ? member.color : '#64748b'
                    }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Invite Member Popup Modal */}
      {inviteModalOpen && (
        <div className="modal-overlay" onClick={() => setInviteModalOpen(false)}>
          <div className="modal-card invite-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Invite New Team Member</h3>
              <button className="close-btn" onClick={() => setInviteModalOpen(false)}>✕</button>
            </div>
            <div className="modal-form">
              <div className="form-group">
                <label>FULL NAME</label>
                <input type="text" placeholder="e.g. David Vance" required autoFocus />
              </div>
              <div className="form-group">
                <label>EMAIL ADDRESS</label>
                <input type="email" placeholder="e.g. david.vance@syncboard.dev" required />
              </div>
              <div className="form-group">
                <label>ROLE / TITLE</label>
                <select>
                  <option value="Frontend Lead">Frontend Lead</option>
                  <option value="Backend Engineer">Backend Engineer</option>
                  <option value="Designer">UI/UX Designer</option>
                  <option value="DevOps Lead">DevOps Lead</option>
                  <option value="QA Specialist">QA Specialist</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setInviteModalOpen(false)}>Cancel</button>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => {
                    alert('Invitation sent successfully!');
                    setInviteModalOpen(false);
                  }}
                >
                  Send Invitation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
