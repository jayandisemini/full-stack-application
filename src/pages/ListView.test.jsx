import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import ListView from './ListView';
import { TasksProvider } from '../context/TasksContext';

describe('ListView Page Component', () => {
  test('renders list view table headers and control buttons', () => {
    render(
      <TasksProvider>
        <ListView />
      </TasksProvider>
    );

    expect(screen.getByText('All Tasks')).toBeInTheDocument();
    expect(screen.getByText('Columns')).toBeInTheDocument();
    expect(screen.getByText('Import JSON')).toBeInTheDocument();
    expect(screen.getByText('Export CSV')).toBeInTheDocument();
  });
});
