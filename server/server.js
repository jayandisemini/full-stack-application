import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

// Initial Seed Data
let teamMembers = [
  { id: 'user-1', name: 'Alex Rivers', email: 'alex.rivers@syncboard.io', role: 'Frontend Lead', initials: 'AR', color: '#6366f1', status: 'online', activeTasksCount: 3 },
  { id: 'user-2', name: 'Sarah Chen', email: 'sarah.chen@syncboard.io', role: 'Backend Engineer', initials: 'SC', color: '#10b981', status: 'online', activeTasksCount: 4 },
  { id: 'user-3', name: 'Marcus Vance', email: 'marcus.vance@syncboard.io', role: 'API Engineer', initials: 'MV', color: '#a855f7', status: 'online', activeTasksCount: 2 },
  { id: 'user-4', name: 'Elena Rostova', email: 'elena.rostova@syncboard.io', role: 'UI/UX Designer', initials: 'ER', color: '#ec4899', status: 'offline', activeTasksCount: 1 },
  { id: 'user-5', name: 'David Kim', email: 'david.kim@syncboard.io', role: 'DevOps Lead', initials: 'DK', color: '#f59e0b', status: 'online', activeTasksCount: 2 }
];

let tasks = [
  {
    id: 'SYNC-101',
    title: 'Migrate Auth to OAuth2 & JWT Refresh Tokens',
    description: 'Replace legacy session storage with secure HTTP-only cookie JWT tokens.',
    columnId: 'inprogress',
    priority: 'HIGH',
    category: 'Backend',
    assigneeId: 'user-2',
    assigneeName: 'Sarah Chen',
    dueDate: 'Aug 22, 2026',
    storyPoints: 8,
    isOverdue: false,
    notice: 'In Review'
  },
  {
    id: 'SYNC-102',
    title: 'Refactor Kanban Drag-and-Drop Drop Targets',
    description: 'Improve drop visual feedback and smooth CSS transitions on board column hover.',
    columnId: 'todo',
    priority: 'MEDIUM',
    category: 'Frontend',
    assigneeId: 'user-1',
    assigneeName: 'Alex Rivers',
    dueDate: 'Aug 25, 2026',
    storyPoints: 5,
    isOverdue: false,
    notice: null
  },
  {
    id: 'SYNC-103',
    title: 'Stripe Payment Gateway Webhook Handler',
    description: 'Implement idempotent webhook listener for failed recurring subscription events.',
    columnId: 'backlog',
    priority: 'URGENT',
    category: 'API Ready',
    assigneeId: 'user-3',
    assigneeName: 'Marcus Vance',
    dueDate: 'Aug 15, 2026',
    storyPoints: 13,
    isOverdue: true,
    notice: 'Overdue'
  },
  {
    id: 'SYNC-104',
    title: 'Design System Glassmorphism Component Library',
    description: 'Audit dark mode CSS variables and add responsive drawer overlays.',
    columnId: 'completed',
    priority: 'LOW',
    category: 'Design',
    assigneeId: 'user-4',
    assigneeName: 'Elena Rostova',
    dueDate: 'Aug 10, 2026',
    storyPoints: 3,
    isOverdue: false,
    notice: null
  }
];

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'SyncBoard Backend API', timestamp: new Date() });
});

// REST API: Tasks
app.get('/api/tasks', (req, res) => {
  res.json(tasks);
});

app.post('/api/tasks', (req, res) => {
  const newTaskData = req.body;
  const nextIdNumber = tasks.reduce((max, t) => {
    const num = parseInt(t.id.replace('SYNC-', ''), 10);
    return isNaN(num) ? max : Math.max(max, num);
  }, 100) + 1;

  const assignee = teamMembers.find(m => m.id === newTaskData.assigneeId) || teamMembers[0];

  const newTask = {
    id: `SYNC-${nextIdNumber}`,
    title: newTaskData.title || 'Untitled Task',
    description: newTaskData.description || '',
    columnId: newTaskData.columnId || 'backlog',
    priority: newTaskData.priority || 'MEDIUM',
    category: newTaskData.category || 'Frontend',
    assigneeId: assignee.id,
    assigneeName: assignee.name,
    dueDate: newTaskData.dueDate || 'Aug 30, 2026',
    storyPoints: parseInt(newTaskData.storyPoints, 10) || 5,
    isOverdue: false,
    notice: null
  };

  tasks.unshift(newTask);
  io.emit('task_created', newTask);
  res.status(201).json(newTask);
});

app.put('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const updatedFields = req.body;
  
  let targetTask = null;
  tasks = tasks.map(t => {
    if (t.id === id) {
      const assignee = updatedFields.assigneeId
        ? teamMembers.find(m => m.id === updatedFields.assigneeId) || { id: t.assigneeId, name: t.assigneeName }
        : { id: t.assigneeId, name: t.assigneeName };

      targetTask = {
        ...t,
        ...updatedFields,
        assigneeId: assignee.id,
        assigneeName: assignee.name
      };
      return targetTask;
    }
    return t;
  });

  if (targetTask) {
    io.emit('task_updated', targetTask);
    res.json(targetTask);
  } else {
    res.status(404).json({ error: 'Task not found' });
  }
});

app.delete('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  tasks = tasks.filter(t => t.id !== id);
  io.emit('task_deleted', { id });
  res.json({ success: true, id });
});

// REST API: Team Members
app.get('/api/members', (req, res) => {
  res.json(teamMembers);
});

app.post('/api/members', (req, res) => {
  const newMemberData = req.body;
  const nextId = `user-${Date.now()}`;
  const initials = newMemberData.name
    ? newMemberData.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'TM';

  const memberObj = {
    id: nextId,
    name: newMemberData.name,
    email: newMemberData.email,
    role: newMemberData.role || 'Software Engineer',
    initials,
    color: '#8b5cf6',
    status: 'online',
    activeTasksCount: 0
  };

  teamMembers.unshift(memberObj);
  io.emit('member_created', memberObj);
  res.status(201).json(memberObj);
});

// Socket.io Connection & Event Handling
io.on('connection', (socket) => {
  console.log(`[Socket.io] Client connected: ${socket.id}`);

  socket.on('move_task', ({ taskId, targetColumnId }) => {
    let movedTask = null;
    tasks = tasks.map(t => {
      if (t.id === taskId) {
        movedTask = { ...t, columnId: targetColumnId };
        return movedTask;
      }
      return t;
    });

    if (movedTask) {
      socket.broadcast.emit('task_moved', movedTask);
    }
  });

  socket.on('disconnect', () => {
    console.log(`[Socket.io] Client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 SyncBoard Backend Server running on http://localhost:${PORT}`);
  console.log(`⚡ WebSockets listening for live real-time synchronization`);
  console.log(`====================================================`);
});
