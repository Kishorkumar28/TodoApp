export type TaskCategory = 'bug' | 'feature' | 'chore' | 'documentation' | 'refactor' | 'general';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'completed';
  category: TaskCategory;
  createdAt: number;
  assignedTo?: string; // For simplified work allocation
}
