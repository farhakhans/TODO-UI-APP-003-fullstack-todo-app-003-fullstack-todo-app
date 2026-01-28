/**
 * Task Management Agent
 * A software agent to handle task-related operations in the todo app
 */

interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
  priority: 'low' | 'medium' | 'high';
}

interface TaskFilterOptions {
  status?: 'all' | 'active' | 'completed';
  priority?: 'low' | 'medium' | 'high';
  searchQuery?: string;
}

class TaskAgent {
  private tasks: Task[] = [];
  private static instance: TaskAgent;

  private constructor() {
    // Load tasks from localStorage if available
    this.loadTasksFromStorage();
  }

  public static getInstance(): TaskAgent {
    if (!TaskAgent.instance) {
      TaskAgent.instance = new TaskAgent();
    }
    return TaskAgent.instance;
  }

  /**
   * Create a new task
   */
  public createTask(title: string, description?: string, dueDate?: Date, priority: 'low' | 'medium' | 'high' = 'medium'): Task {
    const newTask: Task = {
      id: this.generateId(),
      title,
      description,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      dueDate,
      priority
    };

    this.tasks.push(newTask);
    this.saveTasksToStorage();

    return newTask;
  }

  /**
   * Get all tasks with optional filtering
   */
  public getTasks(options: TaskFilterOptions = {}): Task[] {
    let filteredTasks = [...this.tasks];

    if (options.status && options.status !== 'all') {
      if (options.status === 'active') {
        filteredTasks = filteredTasks.filter(task => !task.completed);
      } else if (options.status === 'completed') {
        filteredTasks = filteredTasks.filter(task => task.completed);
      }
    }

    if (options.priority) {
      filteredTasks = filteredTasks.filter(task => task.priority === options.priority);
    }

    if (options.searchQuery) {
      const query = options.searchQuery.toLowerCase();
      filteredTasks = filteredTasks.filter(task =>
        task.title.toLowerCase().includes(query) ||
        (task.description && task.description.toLowerCase().includes(query))
      );
    }

    return filteredTasks;
  }

  /**
   * Get a specific task by ID
   */
  public getTaskById(id: string): Task | undefined {
    return this.tasks.find(task => task.id === id);
  }

  /**
   * Update a task
   */
  public updateTask(id: string, updates: Partial<Task>): Task | null {
    const taskIndex = this.tasks.findIndex(task => task.id === id);

    if (taskIndex === -1) {
      return null;
    }

    const updatedTask = {
      ...this.tasks[taskIndex],
      ...updates,
      updatedAt: new Date()
    };

    this.tasks[taskIndex] = updatedTask;
    this.saveTasksToStorage();

    return updatedTask;
  }

  /**
   * Toggle task completion status
   */
  public toggleTaskCompletion(id: string): Task | null {
    const task = this.getTaskById(id);

    if (!task) {
      return null;
    }

    return this.updateTask(id, {
      completed: !task.completed,
      updatedAt: new Date()
    });
  }

  /**
   * Delete a task
   */
  public deleteTask(id: string): boolean {
    const initialLength = this.tasks.length;
    this.tasks = this.tasks.filter(task => task.id !== id);

    if (this.tasks.length !== initialLength) {
      this.saveTasksToStorage();
      return true;
    }

    return false;
  }

  /**
   * Get task statistics
   */
  public getTaskStats(): { total: number; completed: number; active: number; overdue: number } {
    const total = this.tasks.length;
    const completed = this.tasks.filter(task => task.completed).length;
    const active = total - completed;

    const now = new Date();
    const overdue = this.tasks.filter(task =>
      !task.completed &&
      task.dueDate &&
      task.dueDate < now
    ).length;

    return { total, completed, active, overdue };
  }

  /**
   * Clear all completed tasks
   */
  public clearCompletedTasks(): number {
    const initialCount = this.tasks.length;
    this.tasks = this.tasks.filter(task => !task.completed);
    const removedCount = initialCount - this.tasks.length;

    if (removedCount > 0) {
      this.saveTasksToStorage();
    }

    return removedCount;
  }

  /**
   * Generate a unique ID for tasks
   */
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }

  /**
   * Save tasks to localStorage
   */
  private saveTasksToStorage(): void {
    try {
      const serializedTasks = JSON.stringify(this.tasks, (key, value) => {
        if (value instanceof Date) {
          return { __type: 'Date', value: value.toISOString() };
        }
        return value;
      });
      localStorage.setItem('todo-app-tasks', serializedTasks);
    } catch (error) {
      console.error('Failed to save tasks to localStorage:', error);
    }
  }

  /**
   * Load tasks from localStorage
   */
  private loadTasksFromStorage(): void {
    try {
      const serializedTasks = localStorage.getItem('todo-app-tasks');

      if (serializedTasks) {
        const parsedTasks = JSON.parse(serializedTasks, (key, value) => {
          if (value && typeof value === 'object' && value.__type === 'Date') {
            return new Date(value.value);
          }
          return value;
        });

        this.tasks = parsedTasks.map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          updatedAt: new Date(task.updatedAt),
          dueDate: task.dueDate ? new Date(task.dueDate) : undefined
        }));
      }
    } catch (error) {
      console.error('Failed to load tasks from localStorage:', error);
      this.tasks = [];
    }
  }

  /**
   * Set a reminder for a task
   */
  public setReminder(taskId: string, reminderTime: Date): boolean {
    const task = this.getTaskById(taskId);

    if (!task) {
      return false;
    }

    // Calculate time difference
    const timeDiff = reminderTime.getTime() - Date.now();

    if (timeDiff <= 0) {
      console.warn('Reminder time is in the past');
      return false;
    }

    // Set a browser notification for the reminder
    setTimeout(() => {
      if ('Notification' in window) {
        if (Notification.permission === 'granted') {
          new Notification(`Task Reminder: ${task.title}`, {
            body: task.description || 'Time to work on this task!',
            icon: '/favicon.ico'
          });
        } else if (Notification.permission !== 'denied') {
          Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
              new Notification(`Task Reminder: ${task.title}`, {
                body: task.description || 'Time to work on this task!',
                icon: '/favicon.ico'
              });
            }
          });
        }
      }

      // Optionally update task status or trigger other actions
      console.log(`Reminder triggered for task: ${task.title}`);
    }, timeDiff);

    return true;
  }
}

export { TaskAgent };
export type { Task, TaskFilterOptions };