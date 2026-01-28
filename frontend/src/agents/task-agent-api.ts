/**
 * API-Compatible Task Management Agent
 * A software agent that works with your existing API system
 */

import apiClient from '../services/api-client';

interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  due_date: string;
  priority: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

interface TaskFilterOptions {
  status?: 'all' | 'active' | 'completed';
  priority?: string;
  searchQuery?: string;
}

class TaskAgent {
  private static instance: TaskAgent;

  private constructor() {
    // Private constructor for singleton
  }

  public static getInstance(): TaskAgent {
    if (!TaskAgent.instance) {
      TaskAgent.instance = new TaskAgent();
    }
    return TaskAgent.instance;
  }

  /**
   * Create a new task via API
   */
  public async createTask(title: string, description?: string, dueDate?: string, priority: string = 'medium'): Promise<Task> {
    const taskData = {
      title: title.trim(),
      description: description?.trim() || undefined,
      due_date: dueDate || undefined,
      priority
    };

    const newTask = await apiClient.createTask(taskData);
    return newTask;
  }

  /**
   * Get tasks from API with optional filtering
   */
  public async getTasks(status: 'all' | 'active' | 'completed' = 'all'): Promise<Task[]> {
    return await apiClient.getTasks(status);
  }

  /**
   * Get a specific task by ID
   */
  public async getTaskById(id: string): Promise<Task> {
    // Since we don't have a specific API method for getting a single task,
    // we'll get all tasks and filter
    const allTasks = await this.getTasks('all');
    const task = allTasks.find(t => t.id === id);

    if (!task) {
      throw new Error(`Task with id ${id} not found`);
    }

    return task;
  }

  /**
   * Update a task via API
   */
  public async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
    // For now, we'll assume the API has an update method
    // If not, we might need to implement this differently
    const updatedTask = await apiClient.updateTask(id, updates);
    return updatedTask;
  }

  /**
   * Toggle task completion status via API
   */
  public async toggleTaskCompletion(id: string, completed: boolean): Promise<Task> {
    const updatedTask = await apiClient.toggleTaskCompletion(id, !completed);
    return updatedTask;
  }

  /**
   * Delete a task via API
   */
  public async deleteTask(id: string): Promise<boolean> {
    try {
      await apiClient.deleteTask(id);
      return true;
    } catch (error) {
      console.error('Failed to delete task:', error);
      return false;
    }
  }

  /**
   * Get task statistics
   */
  public async getTaskStats(): Promise<{ total: number; completed: number; active: number; overdue: number }> {
    const allTasks = await this.getTasks('all');
    const completedTasks = allTasks.filter(task => task.completed);
    const activeTasks = allTasks.filter(task => !task.completed);

    // Calculate overdue tasks (tasks that are not completed and have a due date in the past)
    const now = new Date();
    const overdueTasks = allTasks.filter(task => {
      if (task.completed || !task.due_date) {
        return false;
      }

      const dueDate = new Date(task.due_date);
      return dueDate < now;
    });

    return {
      total: allTasks.length,
      completed: completedTasks.length,
      active: activeTasks.length,
      overdue: overdueTasks.length
    };
  }

  /**
   * Clear all completed tasks
   */
  public async clearCompletedTasks(): Promise<number> {
    const completedTasks = await this.getTasks('completed');
    let deletedCount = 0;

    for (const task of completedTasks) {
      try {
        await this.deleteTask(task.id);
        deletedCount++;
      } catch (error) {
        console.error(`Failed to delete task ${task.id}:`, error);
      }
    }

    return deletedCount;
  }

  /**
   * Filter tasks locally based on options
   */
  public filterTasks(tasks: Task[], options: TaskFilterOptions = {}): Task[] {
    let filteredTasks = [...tasks];

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
        task.description.toLowerCase().includes(query)
      );
    }

    return filteredTasks;
  }

  /**
   * Set a reminder for a task with voice notification
   */
  public setReminder(taskId: string, reminderTime: Date, taskTitle: string, taskDescription?: string): boolean {
    // Calculate time difference
    const timeDiff = reminderTime.getTime() - Date.now();

    if (timeDiff <= 0) {
      console.warn('Reminder time is in the past');
      return false;
    }

    // Set a browser notification for the reminder
    setTimeout(() => {
      // Play voice notification
      this.playVoiceNotification(`Task reminder: ${taskTitle}. ${taskDescription || ''}`);

      if ('Notification' in window) {
        if (Notification.permission === 'granted') {
          new Notification(`Task Reminder: ${taskTitle}`, {
            body: taskDescription || 'Time to work on this task!',
            icon: '/favicon.ico'
          });
        } else if (Notification.permission !== 'denied') {
          Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
              new Notification(`Task Reminder: ${taskTitle}`, {
                body: taskDescription || 'Time to work on this task!',
                icon: '/favicon.ico'
              });
            }
          });
        }
      }

      // Optionally update task status or trigger other actions
      console.log(`Reminder triggered for task: ${taskTitle}`);
    }, timeDiff);

    return true;
  }

  /**
   * Play voice notification using Web Speech API
   */
  private playVoiceNotification(text: string): void {
    if ('speechSynthesis' in window) {
      // Function to speak with available voices
      const speakWithVoice = () => {
        const utterance = new SpeechSynthesisUtterance(text);

        // Configure voice properties
        utterance.volume = 1; // 0 to 1
        utterance.rate = 1; // 0.1 to 10
        utterance.pitch = 1; // 0 to 2

        // Try to select a good voice
        const voices = speechSynthesis.getVoices();
        const englishVoice = voices.find(voice =>
          voice.lang.includes('en') || voice.lang.includes('en-US')
        ) || voices[0]; // Fallback to first voice

        if (englishVoice) {
          utterance.voice = englishVoice;
        }

        // Speak the text
        speechSynthesis.speak(utterance);
      };

      // Check if voices are already loaded
      const voices = speechSynthesis.getVoices();
      if (voices.length > 0) {
        speakWithVoice();
      } else {
        // Wait for voices to load
        speechSynthesis.onvoiceschanged = function() {
          speakWithVoice();
          // Reset the event handler to avoid multiple calls
          speechSynthesis.onvoiceschanged = null;
        };
      }
    } else {
      console.warn('Web Speech API is not supported in this browser');
    }
  }
}

export type { Task, TaskFilterOptions };
export { TaskAgent };