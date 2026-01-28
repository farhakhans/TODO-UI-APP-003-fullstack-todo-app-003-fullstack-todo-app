export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  due_date: string | null; // Making it nullable since not all tasks may have due dates
  priority: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}