import React, { useState, useEffect } from 'react';
import { X, Calendar, User, Tag, AlertCircle, Hash } from 'lucide-react';
import { useTasks } from '../context/TasksContext';
import './TaskModal.css';

export default function TaskModal() {
  const { closeModal, selectedTask, addTask, updateTask, teamMembers } = useTasks();

  const isEditing = !!selectedTask;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [columnId, setColumnId] = useState('backlog');
  const [priority, setPriority] = useState('MEDIUM');
  const [category, setCategory] = useState('Frontend');
  const [assigneeId, setAssigneeId] = useState('sc');
  const [dueDate, setDueDate] = useState('Aug 30, 2026');
  const [storyPoints, setStoryPoints] = useState('5');

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
    }
  }, [selectedTask]);

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
          <h3>{isEditing ? `Edit Task (${selectedTask.id})` : 'Create New Task'}</h3>
          <button className="close-btn" onClick={closeModal}>
            <X size={18} />
          </button>
        </div>

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
      </div>
    </div>
  );
}
