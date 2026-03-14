export interface List {
  id: string;
  title: string;
  items: string[];
}

export interface ChecklistItem {
  name: string;
  checked: boolean;
  sourceListId: number | null;
}

export interface Checklist {
  id: string;
  title: string;
  sourceLists: List[];
  items: ChecklistItem[];
  completedAt: string | null;
  completed: boolean;
}
