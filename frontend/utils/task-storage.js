// utils/task-storage.js
// Simple in-memory storage for demo purposes
// In production, you'd use a real database

let tasks = global.tasks || [];
let taskIdCounter = global.taskIdCounter || 1;

if (!global.tasks) {
  global.tasks = tasks;
  global.taskIdCounter = taskIdCounter;
}

export { tasks, global as taskIdCounter };