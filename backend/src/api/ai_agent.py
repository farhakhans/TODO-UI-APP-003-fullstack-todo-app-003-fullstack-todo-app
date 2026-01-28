from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
import uuid
from datetime import datetime, timedelta
from typing import List, Dict, Any
from src.database.database_config import get_session
from src.models.task_model import Task
from src.middleware.auth_middleware import get_current_user

router = APIRouter()


@router.post("/analyze-tasks")
def analyze_tasks_with_ai(
    current_user: dict = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    AI-powered task analysis that provides recommendations, priority adjustments,
    and time management insights
    """
    user_id = uuid.UUID(current_user["user_id"])

    # Get all tasks for the user
    tasks = session.exec(
        select(Task).where(Task.user_id == user_id)
    ).all()

    # Perform AI analysis
    analysis_result = perform_task_analysis(tasks)
    
    return analysis_result


def perform_task_analysis(tasks: List[Task]) -> Dict[str, Any]:
    """
    Perform AI analysis on tasks to provide recommendations
    """
    # Convert tasks to dictionaries for easier processing
    task_dicts = []
    for task in tasks:
        task_dict = {
            "id": str(task.id),
            "title": task.title,
            "description": task.description,
            "completed": task.completed,
            "due_date": task.due_date.isoformat() if task.due_date else None,
            "priority": task.priority,
            "created_at": task.created_at.isoformat() if task.created_at else None
        }
        task_dicts.append(task_dict)

    # Analyze tasks and generate recommendations
    recommendations = generate_recommendations(task_dicts)
    priority_analysis = analyze_priorities(task_dicts)
    time_management_insights = analyze_time_management(task_dicts)

    return {
        "aiRecommendations": recommendations,
        "priorityAdjustments": priority_analysis,
        "timeManagement": time_management_insights,
        "timestamp": datetime.utcnow().isoformat()
    }


def generate_recommendations(tasks: List[Dict]) -> List[Dict]:
    """
    Generate AI recommendations based on task analysis
    """
    recommendations = []
    
    for task in tasks:
        if task["completed"]:
            continue
            
        rec = {"taskId": task["id"], "title": task["title"]}
        
        # Check if task is overdue
        if task["due_date"]:
            due_date = datetime.fromisoformat(task["due_date"].replace('Z', '+00:00'))
            now = datetime.utcnow()
            
            if due_date < now:
                rec["recommendation"] = f'Task "{task["title"]}" is overdue. Immediate attention required.'
                rec["priorityAdjustment"] = "higher"
            elif due_date < now + timedelta(hours=24):
                rec["recommendation"] = f'Task "{task["title"]}" is due soon. Consider working on it now.'
                rec["priorityAdjustment"] = "higher"
        
        # Check priority levels
        elif task["priority"] == "high" and not task["completed"]:
            rec["recommendation"] = 'High priority task "' + task["title"] + '" detected. Consider moving this up in your queue.'
            rec["priorityAdjustment"] = "same"
        
        # General recommendation for medium priority tasks
        elif task["priority"] == "medium" and not task["completed"]:
            rec["recommendation"] = 'Consider scheduling "' + task["title"] + '" for later today or tomorrow.'
            rec["priorityAdjustment"] = "same"
        
        # Low priority tasks
        elif task["priority"] == "low" and not task["completed"]:
            rec["recommendation"] = '"' + task["title"] + '" is a low priority task. You can defer this if needed.'
            rec["priorityAdjustment"] = "same"
        
        if "recommendation" in rec:
            recommendations.append(rec)
    
    return recommendations


def analyze_priorities(tasks: List[Dict]) -> Dict:
    """
    Analyze task priorities and provide balance insights
    """
    active_tasks = [t for t in tasks if not t["completed"]]
    
    if not active_tasks:
        return {
            "taskCounts": {"high": 0, "medium": 0, "low": 0},
            "priorityBalanceScore": 100,
            "suggestions": ["No active tasks to analyze"]
        }
    
    # Count tasks by priority
    priority_counts = {"high": 0, "medium": 0, "low": 0}
    for task in active_tasks:
        priority_counts[task["priority"]] += 1
    
    # Calculate priority balance score (0-100)
    total_active = len(active_tasks)
    high_ratio = priority_counts["high"] / total_active if total_active > 0 else 0
    
    # A balanced distribution would be roughly equal numbers of each priority
    # Score is higher when priorities are more evenly distributed
    ideal_count = total_active / 3
    deviation = abs(priority_counts["high"] - ideal_count) + abs(priority_counts["medium"] - ideal_count) + abs(priority_counts["low"] - ideal_count)
    max_deviation = total_active * 2  # Maximum possible deviation
    balance_score = max(0, 100 - (deviation / max_deviation) * 100)
    
    suggestions = []
    if priority_counts["high"] > total_active * 0.5:
        suggestions.append("You have too many high-priority tasks. Consider delegating or postponing some.")
    elif priority_counts["high"] == 0 and priority_counts["medium"] > 0:
        suggestions.append("Consider elevating some medium-priority tasks to high priority.")
    
    return {
        "taskCounts": priority_counts,
        "priorityBalanceScore": round(balance_score, 2),
        "suggestions": suggestions
    }


def analyze_time_management(tasks: List[Dict]) -> Dict:
    """
    Analyze time management and provide efficiency insights
    """
    active_tasks = [t for t in tasks if not t["completed"]]
    
    if not active_tasks:
        return {
            "timeEfficiencyScore": 100,
            "suggestions": ["No active tasks to analyze"],
            "estimatedCompletionTime": 0
        }
    
    # Calculate time efficiency based on due dates and priorities
    urgent_tasks = 0
    overdue_tasks = 0
    
    for task in active_tasks:
        if task["due_date"]:
            due_date = datetime.fromisoformat(task["due_date"].replace('Z', '+00:00'))
            now = datetime.utcnow()
            
            if due_date < now:
                overdue_tasks += 1
            elif due_date < now + timedelta(days=1):
                urgent_tasks += 1
    
    # Calculate efficiency score (0-100)
    # Lower scores for more overdue/urgent tasks
    total_active = len(active_tasks)
    overdue_ratio = overdue_tasks / total_active if total_active > 0 else 0
    urgent_ratio = urgent_tasks / total_active if total_active > 0 else 0
    
    # Base score is 100, subtract points for overdue and urgent tasks
    efficiency_score = 100 - (overdue_ratio * 50) - (urgent_ratio * 20)
    efficiency_score = max(0, efficiency_score)  # Ensure it doesn't go below 0
    
    suggestions = []
    if overdue_tasks > 0:
        suggestions.append(f"You have {overdue_tasks} overdue task(s). Address these immediately.")
    if urgent_tasks > total_active * 0.5:
        suggestions.append("More than half of your tasks are urgent. Consider better planning.")
    
    return {
        "timeEfficiencyScore": round(efficiency_score, 2),
        "suggestions": suggestions,
        "estimatedCompletionTime": estimate_total_completion_time(active_tasks)
    }


def estimate_total_completion_time(tasks: List[Dict]) -> float:
    """
    Estimate total time needed to complete all tasks
    """
    # Simple estimation based on priority and task count
    time_estimate = 0
    
    for task in tasks:
        # Base time estimate based on priority
        if task["priority"] == "high":
            time_estimate += 60  # 60 minutes for high priority
        elif task["priority"] == "medium":
            time_estimate += 45  # 45 minutes for medium priority
        else:  # low
            time_estimate += 30  # 30 minutes for low priority
    
    return time_estimate


@router.post("/generate-daily-schedule")
def generate_daily_schedule(
    current_user: dict = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Generate a daily schedule based on tasks and priorities
    """
    user_id = uuid.UUID(current_user["user_id"])

    # Get all tasks for the user
    tasks = session.exec(
        select(Task).where(Task.user_id == user_id)
    ).all()

    # Generate daily schedule
    schedule = create_daily_schedule(tasks)
    
    return {"schedule": schedule}


def create_daily_schedule(tasks: List[Task]) -> List[Dict]:
    """
    Create a prioritized daily schedule from tasks
    """
    # Filter out completed tasks
    incomplete_tasks = [task for task in tasks if not task.completed]
    
    # Sort tasks by priority and urgency
    sorted_tasks = sorted(incomplete_tasks, key=lambda x: (
        0 if x.due_date and x.due_date < datetime.utcnow() + timedelta(days=1) else 1,  # Urgent first
        {"high": 3, "medium": 2, "low": 1}[x.priority],  # Then by priority
        x.created_at.timestamp()  # Finally by creation date (older first)
    ), reverse=True)
    
    schedule = []
    for task in sorted_tasks:
        task_info = {
            "id": str(task.id),
            "title": task.title,
            "priority": task.priority,
            "estimatedTime": estimate_task_time(task),
            "dueDate": task.due_date.isoformat() if task.due_date else None
        }
        schedule.append(task_info)
    
    return schedule


def estimate_task_time(task: Task) -> int:
    """
    Estimate time required for a task
    """
    # Base time estimation based on priority
    time_estimates = {
        "high": 60,    # 60 minutes
        "medium": 45,  # 45 minutes
        "low": 30      # 30 minutes
    }
    
    base_time = time_estimates.get(task.priority, 30)
    
    # Adjust based on title length (longer titles might indicate more complex tasks)
    if len(task.title) > 50:
        base_time += 15
        
    # Adjust based on description length
    if task.description and len(task.description) > 100:
        base_time += 20
        
    return base_time