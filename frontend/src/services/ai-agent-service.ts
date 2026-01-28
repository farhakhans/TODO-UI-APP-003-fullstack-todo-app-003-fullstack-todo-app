/**
 * Enhanced AI Agent Service
 * Connects frontend to backend AI capabilities
 */

import { Task } from '@/types/task';

interface AIRecommendation {
  taskId: string;
  title: string;
  recommendation: string;
  priorityAdjustment?: 'higher' | 'lower' | 'same';
}

interface AIAnalysisResult {
  aiRecommendations: AIRecommendation[];
  priorityAdjustments: {
    taskCounts: { high: number; medium: number; low: number };
    priorityBalanceScore: number;
    suggestions: string[];
  };
  timeManagement: {
    timeEfficiencyScore: number;
    suggestions: string[];
    estimatedCompletionTime: number;
  };
  timestamp: string;
}

interface DailyScheduleItem {
  id: string;
  title: string;
  priority: 'low' | 'medium' | 'high';
  estimatedTime: number;
  dueDate?: string;
}

interface DailyScheduleResponse {
  schedule: DailyScheduleItem[];
}

class AIAgentService {
  private baseUrl: string;
  private token: string | null;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    this.token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  /**
   * Analyze tasks using backend AI agent
   */
  async analyzeTasks(tasks: Task[]): Promise<AIAnalysisResult> {
    try {
      const response = await fetch(`${this.baseUrl}/api/ai/analyze-tasks`, {
        method: 'POST',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`AI analysis failed: ${response.statusText}`);
      }

      const data: AIAnalysisResult = await response.json();
      return data;
    } catch (error) {
      console.error('Error in AI task analysis:', error);
      
      // Return mock data if backend call fails
      return this.generateMockAnalysis(tasks);
    }
  }

  /**
   * Generate daily schedule using backend AI agent
   */
  async generateDailySchedule(): Promise<DailyScheduleItem[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/ai/generate-daily-schedule`, {
        method: 'POST',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Daily schedule generation failed: ${response.statusText}`);
      }

      const data: DailyScheduleResponse = await response.json();
      return data.schedule;
    } catch (error) {
      console.error('Error generating daily schedule:', error);
      
      // Return empty array if backend call fails
      return [];
    }
  }

  /**
   * Generate mock analysis data when backend is unavailable
   */
  private generateMockAnalysis(tasks: Task[]): AIAnalysisResult {
    const activeTasks = tasks.filter(task => !task.completed);
    
    // Generate mock recommendations
    const recommendations: AIRecommendation[] = [];
    for (const task of activeTasks) {
      if (Math.random() > 0.7) { // Randomly generate some recommendations
        recommendations.push({
          taskId: task.id,
          title: task.title,
          recommendation: `Consider focusing on "${task.title}" today`,
          priorityAdjustment: Math.random() > 0.5 ? 'higher' : 'lower'
        });
      }
    }

    // Generate mock priority analysis
    const priorityCounts = {
      high: activeTasks.filter(t => t.priority === 'high').length,
      medium: activeTasks.filter(t => t.priority === 'medium').length,
      low: activeTasks.filter(t => t.priority === 'low').length
    };

    const priorityBalanceScore = Math.min(100, 100 - Math.abs(priorityCounts.high - priorityCounts.medium) * 10);

    // Generate mock time management insights
    const timeEfficiencyScore = Math.max(20, 100 - activeTasks.length * 2);

    return {
      aiRecommendations: recommendations,
      priorityAdjustments: {
        taskCounts: priorityCounts,
        priorityBalanceScore,
        suggestions: ['Try to balance your task priorities', 'Focus on high-priority items first']
      },
      timeManagement: {
        timeEfficiencyScore,
        suggestions: ['Try to complete tasks ahead of deadlines'],
        estimatedCompletionTime: activeTasks.length * 45 // Average 45 mins per task
      },
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Suggest priority for a new task based on its characteristics
   */
  suggestPriorityForNewTask(title: string, description: string, dueDate?: string): 'low' | 'medium' | 'high' {
    // Analyze title and description for urgency indicators
    const urgentKeywords = ['urgent', 'asap', 'immediate', 'today', 'now', 'critical', 'important'];
    const titleLower = title.toLowerCase();
    const descLower = description?.toLowerCase() || '';

    // Check for urgent keywords
    const hasUrgentKeyword = urgentKeywords.some(keyword => 
      titleLower.includes(keyword) || descLower.includes(keyword)
    );

    // Check if due date is soon
    let isDueSoon = false;
    if (dueDate) {
      const due = new Date(dueDate);
      const now = new Date();
      const diffDays = (due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
      isDueSoon = diffDays <= 1; // Due today or tomorrow
    }

    // Determine priority based on factors
    if (hasUrgentKeyword || isDueSoon) {
      return 'high';
    } else if (title.length > 50 || (description && description.length > 100)) {
      return 'medium'; // Longer descriptions might indicate importance
    } else {
      return 'medium'; // Default to medium
    }
  }

  /**
   * Auto-adjust priorities based on AI analysis
   */
  async autoAdjustPriorities(tasks: Task[]): Promise<Array<{taskId: string, oldPriority: string, newPriority: string}>> {
    try {
      const analysis = await this.analyzeTasks(tasks);
      const adjustments = [];

      for (const rec of analysis.aiRecommendations) {
        const task = tasks.find(t => t.id === rec.taskId);
        if (task && rec.priorityAdjustment) {
          let newPriority = task.priority;
          
          if (rec.priorityAdjustment === 'higher' && task.priority !== 'high') {
            if (task.priority === 'medium') newPriority = 'high';
            if (task.priority === 'low') newPriority = 'medium';
          } else if (rec.priorityAdjustment === 'lower' && task.priority !== 'low') {
            if (task.priority === 'high') newPriority = 'medium';
            if (task.priority === 'medium') newPriority = 'low';
          }

          if (newPriority !== task.priority) {
            adjustments.push({
              taskId: task.id,
              oldPriority: task.priority,
              newPriority
            });
          }
        }
      }

      return adjustments;
    } catch (error) {
      console.error('Error auto-adjusting priorities:', error);
      return [];
    }
  }
}

export type { 
  AIRecommendation, 
  AIAnalysisResult, 
  DailyScheduleItem, 
  DailyScheduleResponse 
};
export { AIAgentService };