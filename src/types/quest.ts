export type QuestCategory = 'combat' | 'healing' | 'exploration' | 'crafting' | 'diplomacy' | 'default';

export interface Quest {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'completed';
  category: QuestCategory;
  createdAt: number;
  assignedTo?: string; // For simplified work allocation
}
