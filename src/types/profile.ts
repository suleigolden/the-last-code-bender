export interface StackItem {
  tech: string;
  category: 'language' | 'framework' | 'db' | 'devops' | 'other';
}

export interface StackData {
  primary: StackItem[];
  familiar: StackItem[];
  aware: StackItem[];
}
