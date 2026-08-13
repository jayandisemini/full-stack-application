import React, { useState, useEffect } from 'react';
import { X, MessageSquare, Clock, Send, CheckCircle2, User } from 'lucide-react';
import { useTasks } from '../context/TasksContext';
import './TaskModal.css';

export default function TaskModal() {
  const { closeModal, selectedTask, addTask, updateTask, teamMembers, defaultColumnId } = useTasks();

  const isEditing = !!selectedTask;
  const [activeTab, setActiveTab] = useState('details');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [columnId, setColumnId] = useState(defaultColumnId || 'backlog');
  const [priority, setPriority] = useState('MEDIUM');
  const [category, setCategory] = useState('Frontend');
  const [assigneeId, setAssigneeId] = useState('sc');
  const [dueDate, setDueDate] = useState('Aug 30, 2026');
  const [storyPoints, setStoryPoints] = useState('5');

  // Comments Stream State
  const [comments, setComments] = useState([
    {
      id: 1,
      author: 'Sarah Chen',
      initials: 'SC',
      color: '#6366f1',
      text: 'Configured CSS custom properties token migration branch. Tested across dark & light theme switches.',
      time: '2 hours ago'
    },
    {
      id: 2,
      author: 'Marcus Webb',
      initials: 'MW',
      color: '#10b981',
      text: 'Reviewed payload structures and confirmed API endpoint rate limits.',
      time: '4 hours ago'
    }
  ]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    if (selectedTask) {
      setTitle(selectedTask.title || '');
      setDescription(selectedTask.description || '');
      setColumnId(selectedTask.columnId || 'backlog');
      setPriority(selectedTask.priority || 'MEDIUM');
      setCategory(selectedTask.category || 'Frontend');
      setAssigneeId(selectedTask.assigneeId || 'sc');
      setDueDate(selectedTask.dueDate || 'Aug 30, 2026');
      setStoryPoints(selectedTask.storyPoints ? String(selectedTask.storyPoints) : '5');
    } else {
      setColumnId(defaultColumnId || 'backlog');
    }
  }, [selectedTask, defaultColumnId]);

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const commentObj = {
      id: Date.now(),
      author: 'Sarah Chen',
      initials: 'SC',
      color: '#6366f1',
      text: newComment.trim(),
      time: 'Just now'
    };

    setComments([commentObj, ...comments]);
    setNewComment('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (isEditing) {
      updateTask(selectedTask.id, {
        title,
        description,
        columnId,
        priority,
        category,
        assigneeId,
        dueDate,
        storyPoints: parseInt(storyPoints, 10)
      });
    } else {
      addTask({
        title,
        description,
        columnId,
        priority,
        category,
        assigneeId,
        dueDate,
        storyPoints: parseInt(storyPoints, 10)
      });
    }

    closeModal();
  };

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <h3>{isEditing ? `Task ${selectedTask.id}` : 'Create New Task'}</h3>
            {isEditing && (
              <div className="modal-tab-bar">
                <button
                  className={`modal-tab-btn ${activeTab === 'details' ? 'active' : ''}`}
                  onClick={() => setActiveTab('details')}
                >
                  Task Details
                </button>
                <button
                  className={`modal-tab-btn ${activeTab === 'comments' ? 'active' : ''}`}
                  onClick={() => setActiveTab('comments')}
                >
                  <MessageSquare size={13} />
                  <span>Comments & Activity ({comments.length})</span>
                </button>
              </div>
            )}
          </div>
          <button className="close-btn" onClick={closeModal}>
            <X size={18} />
          </button>
        </div>

        {activeTab === 'details' ? (
          <form onSubmit={handleSubmit} className="modal-form">
            {/* Title */}
            <div className="form-group">
              <label>TASK TITLE</label>
              <input
                type="text"
                placeholder="e.g. Implement OAuth 2.0 PKCE Flow"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
                autoFocus
              />
            </div>

            {/* Description */}
            <div className="form-group">
              <label>DESCRIPTION</label>
              <textarea
                rows="3"
                placeholder="Brief details about engineering requirements, dependencies..."
                value={description}
                onChange={e => setDescription(e.target.value)}
              ></textarea>
            </div>

            {/* Row 1: Status Column & Priority */}
            <div className="form-row-2">
              <div className="form-group">
                <label>STATUS COLUMN</label>
                <select value={columnId} onChange={e => setColumnId(e.target.value)}>
                  <option value="backlog">Backlog</option>
                  <option value="todo">To Do</option>
                  <option value="inprogress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="form-group">
                <label>PRIORITY</label>
                <select value={priority} onChange={e => setPriority(e.target.value)}>
                  <option value="URGENT">Urgent</option>
                  <option value="HIGH">High</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="LOW">Low</option>
                </select>
              </div>
            </div>

            {/* Row 2: Category & Assignee */}
            <div className="form-row-2">
              <div className="form-group">
                <label>CATEGORY / TAG</label>
                <select value={category} onChange={e => setCategory(e.target.value)}>
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="Design">Design</option>
                  <option value="DevOps">DevOps</option>
                  <option value="Testing">Testing</option>
                  <option value="Database">Database</option>
                  <option value="API Ready">API Ready</option>
                </select>
              </div>

              <div className="form-group">
                <label>ASSIGNEE</label>
                <select value={assigneeId} onChange={e => setAssigneeId(e.target.value)}>
                  {teamMembers.map(member => (
                    <option key={member.id} value={member.id}>
                      {member.name} ({member.role.split(' ')[0]})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 3: Due Date & Story Points */}
            <div className="form-row-2">
              <div className="form-group">
                <label>DUE DATE</label>
                <input
                  type="text"
                  placeholder="e.g. Aug 30, 2026"
                  value={dueDate}
                  onChange={e => setDueDate(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>STORY POINTS</label>
                <input
                  type="number"
                  min="1"
                  max="21"
                  value={storyPoints}
                  onChange={e => setStoryPoints(e.target.value)}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={closeModal}>
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                {isEditing ? 'Save Changes' : 'Create Task'}
              </button>
            </div>
          </form>
        ) : (
          <div className="modal-comments-section">
            {/* New Comment Input */}
            <form onSubmit={handleAddComment} className="add-comment-box">
              <input
                type="text"
                placeholder="Write a comment or update note..."
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
              />
              <button type="submit" className="btn-primary post-btn">
                <Send size={14} />
                <span>Post</span>
              </button>
            </form>

            {/* Activity Stream Feed */}
            <div className="comments-stream">
              {comments.map(c => (
                <div key={c.id} className="comment-item">
                  <div className="comment-avatar" style={{ backgroundColor: c.color }}>
                    {c.initials}
                  </div>
                  <div className="comment-body">
                    <div className="comment-meta">
                      <span className="comment-author">{c.author}</span>
                      <span className="comment-time">{c.time}</span>
                    </div>
                    <p className="comment-text">{c.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
