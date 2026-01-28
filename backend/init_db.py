from sqlmodel import SQLModel
from src.database.database_config import engine
from src.models.user_model import User
from src.models.task_model import Task

def create_tables():
    """Create database tables"""
    print("Creating database tables...")
    SQLModel.metadata.create_all(bind=engine)
    print("Database tables created successfully!")

if __name__ == "__main__":
    create_tables()