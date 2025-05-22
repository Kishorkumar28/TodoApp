import type { TaskCategory } from '@/types/task';
import { Bug, Lightbulb, Settings2, FileText, Wrench, ClipboardList, IconProps } from 'lucide-react';
import type { LucideProps } from 'lucide-react';

interface TaskIconProps extends LucideProps {
  category: TaskCategory;
}

export function TaskIcon({ category, ...props }: TaskIconProps) {
  switch (category) {
    case 'bug':
      return <Bug {...props} />;
    case 'feature':
      return <Lightbulb {...props} />;
    case 'chore':
      return <Settings2 {...props} />;
    case 'documentation':
      return <FileText {...props} />;
    case 'refactor':
      return <Wrench {...props} />;
    case 'general':
    default:
      return <ClipboardList {...props} />;
  }
}
