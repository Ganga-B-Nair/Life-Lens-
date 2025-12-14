export type ContextCategory = 
  | 'Health' 
  | 'Education' 
  | 'Business' 
  | 'Planning' 
  | 'Accessibility' 
  | 'General';

export type OutputMode = 
  | 'summary' 
  | 'tasks' 
  | 'json' 
  | 'table' 
  | 'study' 
  | 'action';

export interface FileData {
  base64: string;
  mimeType: string;
  name: string;
}

export interface AnalysisResponse {
  visual_summary: string;
  context: ContextCategory;
  reasoning: string;
  title: string;
  content: string; // Markdown formatted string
}

export interface ProcessingState {
  isAnalyzing: boolean;
  error: string | null;
  result: AnalysisResponse | null;
}