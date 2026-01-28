from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlmodel import Session
from typing import List, Optional
import uuid
from src.database.database_config import get_session
from src.models.task_model import Task, TaskCreate, TaskUpdate, TaskRead, TaskCompletionUpdate
from src.services.task_service import TaskService
from src.middleware.auth_middleware import get_current_user

router = APIRouter()


@router.get("/", response_model=List[TaskRead])
def get_tasks(
    status_filter: str = Query(None, alias="status", description="Filter tasks by completion status"),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    current_user: dict = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Get all tasks for the authenticated user"""
    user_id = uuid.UUID(current_user["user_id"])

    task_service = TaskService(session)
    tasks = task_service.get_tasks_by_user(user_id, status_filter, limit, offset)
    return tasks


@router.post("/", response_model=TaskRead, status_code=status.HTTP_201_CREATED)
def create_task(
    task: TaskCreate,
    current_user: dict = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Create a new task for the authenticated user"""
    user_id = uuid.UUID(current_user["user_id"])

    task_service = TaskService(session)
    new_task = task_service.create_task(task, user_id)
    return new_task


@router.get("/{id}", response_model=TaskRead)
def get_task(
    id: uuid.UUID,
    current_user: dict = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Get a specific task by ID"""
    user_id = uuid.UUID(current_user["user_id"])

    task_service = TaskService(session)
    task = task_service.get_task_by_id(id, user_id)

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    return task


@router.put("/{id}", response_model=TaskRead)
def update_task(
    id: uuid.UUID,
    task_update: TaskUpdate,
    current_user: dict = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Update a specific task"""
    user_id = uuid.UUID(current_user["user_id"])

    task_service = TaskService(session)
    updated_task = task_service.update_task(id, task_update, user_id)

    if not updated_task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    return updated_task


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(
    id: uuid.UUID,
    current_user: dict = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Delete a specific task"""
    user_id = uuid.UUID(current_user["user_id"])

    task_service = TaskService(session)
    success = task_service.delete_task(id, user_id)

    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    return


@router.patch("/{id}/toggle-complete", response_model=TaskRead)
def toggle_task_completion(
    id: uuid.UUID,
    completion_data: TaskCompletionUpdate,
    current_user: dict = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Toggle task completion status"""
    user_id = uuid.UUID(current_user["user_id"])

    task_service = TaskService(session)
    updated_task = task_service.toggle_task_completion(id, completion_data, user_id)

    if not updated_task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    return updated_task