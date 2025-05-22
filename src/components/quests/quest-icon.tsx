import type { QuestCategory } from '@/types/quest';
import { Swords, FlaskConical, Compass, Hammer, Handshake, ScrollText, IconProps } from 'lucide-react';
import type { LucideProps } from 'lucide-react';

interface QuestIconProps extends LucideProps {
  category: QuestCategory;
}

export function QuestIcon({ category, ...props }: QuestIconProps) {
  switch (category) {
    case 'combat':
      return <Swords {...props} />;
    case 'healing':
      return <FlaskConical {...props} />;
    case 'exploration':
      return <Compass {...props} />;
    case 'crafting':
      return <Hammer {...props} />;
    case 'diplomacy':
      return <Handshake {...props} />;
    case 'default':
    default:
      return <ScrollText {...props} />;
  }
}
