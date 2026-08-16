import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import TaskCard from './TaskCard';
import { TasksProvider } from '../../context/TasksContext';

const mockTask = {
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
};

describe('TaskCard Component', () => {
  test('renders task ID, title, description, and priority badge', () => {
    render(
      <TasksProvider>
        <TaskCard task={mockTask} />
      </TasksProvider>
    );

    expect(screen.getByText('SYNC-101')).toBeInTheDocument();
    expect(screen.getByText('Migrate Auth to OAuth2 & JWT Refresh Tokens')).toBeInTheDocument();
    expect(screen.getByText('HIGH')).toBeInTheDocument();
    expect(screen.getByText('Backend')).toBeInTheDocument();
    expect(screen.getByText('Sarah')).toBeInTheDocument();
  });
});
