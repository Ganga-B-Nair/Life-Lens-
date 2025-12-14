import { OutputMode } from './types';
import { FileText, ListTodo, Code, Table, GraduationCap, CalendarClock } from 'lucide-react';

export const MODE_OPTIONS: { id: OutputMode; label: string; icon: any; description: string }[] = [
  { 
    id: 'summary', 
    label: 'Clean Summary', 
    icon: FileText,
    description: 'Concise overview of the content.'
  },
  { 
    id: 'tasks', 
    label: 'Task Extraction', 
    icon: ListTodo,
    description: 'Identify actionable items and priorities.'
  },
  { 
    id: 'json', 
    label: 'Convert to JSON', 
    icon: Code,
    description: 'Structured data for developers.'
  },
  { 
    id: 'table', 
    label: 'Convert to Table', 
    icon: Table,
    description: 'Organized rows and columns.'
  },
  { 
    id: 'study', 
    label: 'Study Materials', 
    icon: GraduationCap,
    description: 'Flashcards and study plans.'
  },
  { 
    id: 'action', 
    label: 'Action Plan', 
    icon: CalendarClock,
    description: 'Timeline with strict deadlines.'
  },
];

export const PLACEHOLDER_IMAGE = "https://picsum.photos/400/300";
