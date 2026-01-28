'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Task } from '@/types/task';
import { AIAgentService } from '@/services/ai-agent-service';

interface AIChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

interface AIChatProps {
  tasks: Task[];
  onTaskAction?: (action: string, taskId?: string, params?: any) => void;
}

const AIChat: React.FC<AIChatProps> = ({ tasks, onTaskAction }) => {
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: '1',
      content: "Hello! I'm your AI task assistant. How can I help you with your tasks today?",
      role: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const aiAgentService = new AIAgentService();
  const { user } = useAuth();

  // Scroll to bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    // Add user message
    const userMessage: AIChatMessage = {
      id: Date.now().toString(),
      content: inputValue,
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Process user request and generate AI response
      const aiResponse = await processUserRequest(inputValue, tasks);
      
      const assistantMessage: AIChatMessage = {
        id: (Date.now() + 1).toString(),
        content: aiResponse.response,
        role: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Execute any suggested actions
      if (aiResponse.action) {
        if (onTaskAction) {
          onTaskAction(aiResponse.action.type, aiResponse.action.taskId, aiResponse.action.params);
        }
      }
    } catch (error) {
      console.error('Error processing AI request:', error);
      
      const errorMessage: AIChatMessage = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I encountered an issue processing your request. Could you try again?",
        role: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const processUserRequest = async (request: string, currentTasks: Task[]): Promise<any> => {
    const requestLower = request.toLowerCase();

    // Handle different types of requests
    if (requestLower.includes('suggest') || requestLower.includes('recommend')) {
      // Analyze tasks and provide recommendations
      const analysis = await aiAgentService.analyzeTasks(currentTasks);
      const recommendations = analysis.aiRecommendations.slice(0, 3); // Limit to 3
      
      if (recommendations.length > 0) {
        const recText = recommendations.map(r => `- ${r.recommendation}`).join('\n');
        return {
          response: `Based on your tasks, I recommend:\n${recText}\n\n${analysis.timeManagement.suggestions[0] || ''}`,
          action: null
        };
      } else {
        return {
          response: "I've analyzed your tasks and everything looks well organized. Keep up the good work!",
          action: null
        };
      }
    } 
    else if (requestLower.includes('add') || requestLower.includes('create') || requestLower.includes('new task')) {
      // Extract task details from request
      const titleMatch = request.match(/(?:to|for|that|should)\s+(.+?)(?:\s+with|\s+and|\s+by|$)/i);
      let title = titleMatch ? titleMatch[1].trim() : request.replace(/(add|create|new task\s+)/gi, '').trim();
      
      if (title.endsWith('?')) title = title.slice(0, -1).trim();
      
      // Check for priority keywords
      let priority: 'low' | 'medium' | 'high' = 'medium';
      if (requestLower.includes('high') || requestLower.includes('urgent') || requestLower.includes('important')) {
        priority = 'high';
      } else if (requestLower.includes('low') || requestLower.includes('later')) {
        priority = 'low';
      }
      
      return {
        response: `I can help you add "${title}" to your task list with ${priority} priority. Would you like me to create this task?`,
        action: {
          type: 'createTask',
          params: { title, priority }
        }
      };
    }
    else if (requestLower.includes('complete') || requestLower.includes('done') || requestLower.includes('finish')) {
      // Find task to complete
      const taskName = extractTaskName(request, currentTasks);
      if (taskName) {
        const taskToComplete = currentTasks.find(t => 
          t.title.toLowerCase().includes(taskName.toLowerCase()) && !t.completed
        );
        
        if (taskToComplete) {
          return {
            response: `I found the task "${taskToComplete.title}". Would you like me to mark it as completed?`,
            action: {
              type: 'toggleTask',
              taskId: taskToComplete.id,
              params: { completed: true }
            }
          };
        }
      }
      
      return {
        response: "I couldn't find a matching task to complete. Could you specify which task you want to mark as done?",
        action: null
      };
    }
    else if (requestLower.includes('delete') || requestLower.includes('remove')) {
      // Find task to delete
      const taskName = extractTaskName(request, currentTasks);
      if (taskName) {
        const taskToDelete = currentTasks.find(t => 
          t.title.toLowerCase().includes(taskName.toLowerCase())
        );
        
        if (taskToDelete) {
          return {
            response: `I found the task "${taskToDelete.title}". Are you sure you want to delete it?`,
            action: {
              type: 'deleteTask',
              taskId: taskToDelete.id
            }
          };
        }
      }
      
      return {
        response: "I couldn't find a matching task to delete. Could you specify which task you want to remove?",
        action: null
      };
    }
    else if (requestLower.includes('schedule') || requestLower.includes('plan') || requestLower.includes('today')) {
      // Generate daily schedule
      const schedule = await aiAgentService.generateDailySchedule();
      
      if (schedule.length > 0) {
        const scheduleText = schedule.slice(0, 5).map(item => `- ${item.title} (${item.priority})`).join('\n');
        return {
          response: `Here's a suggested schedule for today:\n${scheduleText}\n\nFocus on high-priority items first!`,
          action: null
        };
      } else {
        return {
          response: "You don't have any active tasks to schedule. Add some tasks first!",
          action: null
        };
      }
    }
    else if (requestLower.includes('hello') || requestLower.includes('hi') || requestLower.includes('hey')) {
      const userName = user?.name || user?.email?.split('@')[0] || 'there';
      return {
        response: `Hello ${userName}! I'm your AI task assistant. You can ask me to suggest tasks, create new ones, mark tasks as complete, or help organize your schedule.`,
        action: null
      };
    }
    else {
      // Default response for unrecognized requests
      return {
        response: `I understand you're saying: "${request}". I can help you manage your tasks by suggesting, creating, completing, or organizing them. For example, you can say "suggest tasks", "create a new task to buy groceries", or "mark my meeting as complete".`,
        action: null
      };
    }
  };

  const extractTaskName = (request: string, tasks: Task[]): string | null => {
    // Look for task names in the request
    for (const task of tasks) {
      if (request.toLowerCase().includes(task.title.toLowerCase())) {
        return task.title;
      }
    }
    
    // If no exact match, try to extract potential task name
    const match = request.match(/(?:task|to|for)\s+(.+?)(?:\s+is|\.|$)/i);
    return match ? match[1].trim() : null;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-indigo-600 text-white p-4">
        <h3 className="text-lg font-semibold flex items-center">
          <span className="mr-2">🤖</span> AI Task Assistant
        </h3>
        <p className="text-indigo-200 text-sm">Ask me to manage your tasks</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-96">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-indigo-100 text-gray-800 rounded-br-none'
                  : 'bg-gray-100 text-gray-800 rounded-bl-none'
              }`}
            >
              <div className="whitespace-pre-wrap">{message.content}</div>
              <div className={`text-xs mt-1 ${message.role === 'user' ? 'text-indigo-600' : 'text-gray-500'}`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-800 rounded-lg rounded-bl-none p-3">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="border-t p-3 bg-gray-50">
        <div className="flex">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me to manage your tasks..."
            className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !inputValue.trim()}
            className="bg-indigo-600 text-white px-4 py-2 rounded-r-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Send
          </button>
        </div>
        <div className="mt-2 text-xs text-gray-500 flex flex-wrap gap-2">
          <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded">Try: "Add a task"</span>
          <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded">"Mark task as done"</span>
          <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded">"Suggest tasks"</span>
        </div>
      </div>
    </div>
  );
};

export default AIChat;