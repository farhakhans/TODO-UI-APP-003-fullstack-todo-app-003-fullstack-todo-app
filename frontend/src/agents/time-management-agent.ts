/**
 * Time Management Agent
 * Helps optimize time allocation and scheduling for tasks
 */

import { Task } from './task-agent-api';

interface TimeSlot {
  start: Date;
  end: Date;
  task?: Task;
  isAvailable: boolean;
}

interface ScheduleRecommendation {
  taskId: string;
  recommendedTime: Date;
  reason: string;
  duration: number; // in minutes
}

interface TimeAnalysis {
  availableTimeSlots: TimeSlot[];
  scheduleRecommendations: ScheduleRecommendation[];
  timeEfficiencyScore: number; // 0-100
  suggestedSchedule: { time: Date; task: Task }[];
}

class TimeManagementAgent {
  private static instance: TimeManagementAgent;

  private constructor() {
    // Private constructor for singleton
  }

  public static getInstance(): TimeManagementAgent {
    if (!TimeManagementAgent.instance) {
      TimeManagementAgent.instance = new TimeManagementAgent();
    }
    return TimeManagementAgent.instance;
  }

  /**
   * Analyze tasks and recommend optimal scheduling
   */
  public async analyzeTimeManagement(tasks: Task[], workHours: { start: number; end: number } = { start: 9, end: 17 }): Promise<TimeAnalysis> {
    const now = new Date();
    const incompleteTasks = tasks.filter(task => !task.completed);

    // Generate available time slots for the next 7 days
    const availableTimeSlots: TimeSlot[] = this.generateTimeSlots(now, workHours);

    // Generate schedule recommendations
    const scheduleRecommendations: ScheduleRecommendation[] = [];
    const suggestedSchedule: { time: Date; task: Task }[] = [];

    // Sort tasks by priority and urgency
    const sortedTasks = [...incompleteTasks].sort((a, b) => {
      // Prioritize urgent tasks first
      const aUrgent = this.isTaskUrgent(a) ? 1 : 0;
      const bUrgent = this.isTaskUrgent(b) ? 1 : 0;

      if (aUrgent !== bUrgent) {
        return bUrgent - aUrgent;
      }

      // Then by priority
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority as keyof typeof priorityOrder] -
             priorityOrder[a.priority as keyof typeof priorityOrder];
    });

    // Assign tasks to available time slots
    let slotIndex = 0;
    for (const task of sortedTasks) {
      const estimatedDuration = this.estimateTaskDuration(task);

      // Find an appropriate time slot for this task
      const suitableSlot = this.findSuitableTimeSlot(availableTimeSlots, slotIndex, estimatedDuration, task);

      if (suitableSlot) {
        // Assign task to slot
        suitableSlot.task = task;
        suitableSlot.isAvailable = false;

        // Add to schedule
        suggestedSchedule.push({
          time: suitableSlot.start,
          task: task
        });

        // Add recommendation
        scheduleRecommendations.push({
          taskId: task.id,
          recommendedTime: suitableSlot.start,
          reason: this.generateSchedulingReason(task, suitableSlot.start),
          duration: estimatedDuration
        });

        // Move slot index past this assignment
        slotIndex = availableTimeSlots.indexOf(suitableSlot) + Math.ceil(estimatedDuration / 60);
      }
    }

    // Calculate time efficiency score
    const efficiencyScore = this.calculateTimeEfficiency(tasks, availableTimeSlots);

    return {
      availableTimeSlots,
      scheduleRecommendations,
      timeEfficiencyScore: Math.round(efficiencyScore),
      suggestedSchedule
    };
  }

  /**
   * Generate time slots for scheduling
   */
  private generateTimeSlots(startDate: Date, workHours: { start: number; end: number }, days: number = 7): TimeSlot[] {
    const slots: TimeSlot[] = [];
    const slotDuration = 60; // 1 hour slots

    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);

      // Set to start of work day
      date.setHours(workHours.start, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setHours(workHours.end, 0, 0, 0);

      // Create hourly slots for the work day
      while (date < endOfDay) {
        const slotEnd = new Date(date);
        slotEnd.setMinutes(date.getMinutes() + slotDuration);

        slots.push({
          start: new Date(date),
          end: slotEnd,
          isAvailable: true
        });

        date.setMinutes(date.getMinutes() + slotDuration);
      }
    }

    return slots;
  }

  /**
   * Find a suitable time slot for a task
   */
  private findSuitableTimeSlot(timeSlots: TimeSlot[], startIndex: number, duration: number, task: Task): TimeSlot | null {
    const slotsNeeded = Math.ceil(duration / 60); // Convert minutes to number of slots needed

    // Look for consecutive available slots
    for (let i = startIndex; i <= timeSlots.length - slotsNeeded; i++) {
      // Check if enough consecutive slots are available
      let consecutiveAvailable = true;
      for (let j = 0; j < slotsNeeded; j++) {
        if (!timeSlots[i + j].isAvailable) {
          consecutiveAvailable = false;
          break;
        }
      }

      if (consecutiveAvailable) {
        // Check if this time slot is appropriate for the task
        const candidateSlot = timeSlots[i];
        if (this.isSlotAppropriateForTask(candidateSlot, task)) {
          return candidateSlot;
        }
      }
    }

    // If no consecutive slots found, try to find the first available slot
    for (let i = startIndex; i < timeSlots.length; i++) {
      if (timeSlots[i].isAvailable && this.isSlotAppropriateForTask(timeSlots[i], task)) {
        return timeSlots[i];
      }
    }

    return null; // No suitable slot found
  }

  /**
   * Check if a time slot is appropriate for a task
   */
  private isSlotAppropriateForTask(slot: TimeSlot, task: Task): boolean {
    const dueDate = task.due_date ? new Date(task.due_date) : null;

    if (dueDate) {
      // Make sure the slot is before the due date
      if (slot.start > dueDate) {
        return false;
      }
    }

    // Additional logic could be added here for other constraints
    return true;
  }

  /**
   * Estimate duration for a task in minutes
   */
  private estimateTaskDuration(task: Task): number {
    // Base time estimation based on title length and priority
    let timeEstimate = 15; // Base time in minutes

    // Longer titles might indicate more complex tasks
    if (task.title.length > 50) {
      timeEstimate += 15;
    }

    // Priority affects time allocation
    switch(task.priority) {
      case 'high':
        timeEstimate += 30;
        break;
      case 'medium':
        timeEstimate += 20;
        break;
      case 'low':
        timeEstimate += 10;
        break;
    }

    // Description length might indicate complexity
    if (task.description && task.description.length > 100) {
      timeEstimate += 20;
    }

    return timeEstimate;
  }

  /**
   * Generate a reason for scheduling recommendation
   */
  private generateSchedulingReason(task: Task, scheduledTime: Date): string {
    const dueDate = task.due_date ? new Date(task.due_date) : null;
    const now = new Date();

    if (dueDate && dueDate < new Date(now.getTime() + 24 * 60 * 60 * 1000)) {
      return 'Task is due soon, scheduling immediately';
    }

    if (task.priority === 'high') {
      return 'High priority task, scheduling early in the day';
    }

    if (task.priority === 'low') {
      return 'Low priority task, scheduling in available time slots';
    }

    return 'Recommended time slot based on availability and priority';
  }

  /**
   * Calculate time efficiency score
   */
  private calculateTimeEfficiency(tasks: Task[], timeSlots: TimeSlot[]): number {
    // Calculate how efficiently the time is being used
    const incompleteTasks = tasks.filter(task => !task.completed);
    const availableSlots = timeSlots.filter(slot => slot.isAvailable).length;
    const bookedSlots = timeSlots.length - availableSlots;

    // Efficiency is based on how many tasks are scheduled vs available time
    if (bookedSlots === 0 && incompleteTasks.length === 0) {
      return 100; // Perfect efficiency if no tasks and no booked time
    }

    if (bookedSlots === 0) {
      return 20; // Low efficiency if tasks exist but no time booked
    }

    // Calculate based on how well tasks are distributed
    const idealBookedSlots = Math.min(incompleteTasks.length * 2, timeSlots.length); // Assume 2 slots per task on average
    const utilization = Math.min(1, bookedSlots / idealBookedSlots);

    // Also factor in priority distribution
    const highPriorityCount = incompleteTasks.filter(t => t.priority === 'high').length;
    const highPriorityPercentage = incompleteTasks.length > 0 ? highPriorityCount / incompleteTasks.length : 0;

    // Higher percentage of high priority tasks might indicate better efficiency
    const priorityFactor = 0.7 + (highPriorityPercentage * 0.3); // 0.7-1.0

    return Math.min(100, Math.round(utilization * 100 * priorityFactor));
  }

  /**
   * Check if a task is urgent
   */
  private isTaskUrgent(task: Task): boolean {
    if (task.completed) return false;

    const dueDate = task.due_date ? new Date(task.due_date) : null;
    if (!dueDate) return false;

    const timeUntilDue = dueDate.getTime() - Date.now();
    const hoursUntilDue = timeUntilDue / (1000 * 60 * 60);

    // Urgent if due within 24 hours
    return hoursUntilDue <= 24;
  }

  /**
   * Generate a weekly schedule for tasks
   */
  public generateWeeklySchedule(tasks: Task[], workHours: { start: number; end: number } = { start: 9, end: 17 }): { [date: string]: { time: string; task: Task }[] } {
    const analysis = this.analyzeTimeManagementSync(tasks, workHours);
    const weeklySchedule: { [date: string]: { time: string; task: Task }[] } = {};

    for (const scheduled of analysis.suggestedSchedule) {
      const dateKey = scheduled.time.toISOString().split('T')[0]; // YYYY-MM-DD
      const timeString = scheduled.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      if (!weeklySchedule[dateKey]) {
        weeklySchedule[dateKey] = [];
      }

      weeklySchedule[dateKey].push({
        time: timeString,
        task: scheduled.task
      });
    }

    return weeklySchedule;
  }

  /**
   * Synchronous version of analyzeTimeManagement for internal use
   */
  private analyzeTimeManagementSync(tasks: Task[], workHours: { start: number; end: number } = { start: 9, end: 17 }): TimeAnalysis {
    const now = new Date();
    const incompleteTasks = tasks.filter(task => !task.completed);

    // Generate available time slots for the next 7 days
    const availableTimeSlots: TimeSlot[] = this.generateTimeSlots(now, workHours);

    // Generate schedule recommendations
    const scheduleRecommendations: ScheduleRecommendation[] = [];
    const suggestedSchedule: { time: Date; task: Task }[] = [];

    // Sort tasks by priority and urgency
    const sortedTasks = [...incompleteTasks].sort((a, b) => {
      // Prioritize urgent tasks first
      const aUrgent = this.isTaskUrgent(a) ? 1 : 0;
      const bUrgent = this.isTaskUrgent(b) ? 1 : 0;

      if (aUrgent !== bUrgent) {
        return bUrgent - aUrgent;
      }

      // Then by priority
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority as keyof typeof priorityOrder] -
             priorityOrder[a.priority as keyof typeof priorityOrder];
    });

    // Assign tasks to available time slots
    let slotIndex = 0;
    for (const task of sortedTasks) {
      const estimatedDuration = this.estimateTaskDuration(task);

      // Find an appropriate time slot for this task
      const suitableSlot = this.findSuitableTimeSlot(availableTimeSlots, slotIndex, estimatedDuration, task);

      if (suitableSlot) {
        // Assign task to slot
        suitableSlot.task = task;
        suitableSlot.isAvailable = false;

        // Add to schedule
        suggestedSchedule.push({
          time: suitableSlot.start,
          task: task
        });

        // Add recommendation
        scheduleRecommendations.push({
          taskId: task.id,
          recommendedTime: suitableSlot.start,
          reason: this.generateSchedulingReason(task, suitableSlot.start),
          duration: estimatedDuration
        });

        // Move slot index past this assignment
        slotIndex = availableTimeSlots.indexOf(suitableSlot) + Math.ceil(estimatedDuration / 60);
      }
    }

    // Calculate time efficiency score
    const efficiencyScore = this.calculateTimeEfficiency(tasks, availableTimeSlots);

    return {
      availableTimeSlots,
      scheduleRecommendations,
      timeEfficiencyScore: Math.round(efficiencyScore),
      suggestedSchedule
    };
  }
}

export type { TimeSlot, ScheduleRecommendation, TimeAnalysis };
export { TimeManagementAgent };