from sqlmodel import Session, select, update
from typing import List, Optional
from src.models.task_model import Task, TaskCreate, TaskUpdate, TaskCompletionUpdate
from src.models.user_model import User
from fastapi import HTTPException, status
import uuid


class TaskService:
    def __init__(self, session: Session):
        self.session = session

    def create_task(self, task_data: TaskCreate, user_id: uuid.UUID) -> Task:
        """Create a new task for a user"""
        task = Task(
            title=task_data.title,
            description=task_data.description,
            completed=task_data.completed,
            due_date=task_data.due_date,
            priority=task_data.priority,
            user_id=user_id
        )

        self.session.add(task)
        self.session.commit()
        self.session.refresh(task)
        return task

    def get_tasks_by_user(self, user_id: uuid.UUID, status_filter: Optional[str] = None, limit: int = 20, offset: int = 0) -> List[Task]:
        """Get all tasks for a specific user"""
        query = select(Task).where(Task.user_id == user_id)

        if status_filter:
            if status_filter.lower() == "active":
                query = query.where(Task.completed == False)
            elif status_filter.lower() == "completed":
                query = query.where(Task.completed == True)

        query = query.offset(offset).limit(limit)
        tasks = self.session.exec(query).all()
        return tasks

    def get_task_by_id(self, task_id: uuid.UUID, user_id: uuid.UUID) -> Optional[Task]:
        """Get a specific task by ID for a specific user"""
        task = self.session.exec(
            select(Task).where(Task.id == task_id, Task.user_id == user_id)
        ).first()
        return task

    def update_task(self, task_id: uuid.UUID, task_data: TaskUpdate, user_id: uuid.UUID) -> Optional[Task]:
        """Update a specific task for a user"""
        task = self.session.exec(
            select(Task).where(Task.id == task_id, Task.user_id == user_id)
        ).first()

        if not task:
            return None

        # Update task fields if provided
        update_data = task_data.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(task, field, value)

        self.session.add(task)
        self.session.commit()
        self.session.refresh(task)
        return task

    def delete_task(self, task_id: uuid.UUID, user_id: uuid.UUID) -> bool:
        """Delete a specific task for a user"""
        task = self.session.exec(
            select(Task).where(Task.id == task_id, Task.user_id == user_id)
        ).first()

        if not task:
            return False

        self.session.delete(task)
        self.session.commit()
        return True

    def toggle_task_completion(self, task_id: uuid.UUID, completion_data: TaskCompletionUpdate, user_id: uuid.UUID) -> Optional[Task]:
        """Toggle the completion status of a task"""
        task = self.session.exec(
            select(Task).where(Task.id == task_id, Task.user_id == user_id)
        ).first()

        if not task:
            return None

        task.completed = completion_data.completed
        self.session.add(task)
        self.session.commit()
        self.session.refresh(task)
        return task