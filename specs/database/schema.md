# Database Schema

## Task Table

The tasks table stores all user tasks with the following structure:

**Fields**:
- id (UUID/Integer): Primary key, unique identifier
- user_id (UUID/String): Foreign key linking to user
- title (String, not null): Task title/summary
- description (Text, nullable): Detailed task description
- completed (Boolean, default false): Completion status
- due_date (DateTime, nullable): Deadline for task
- priority (Enum: low, medium, high, default medium): Task priority level
- created_at (DateTime): Timestamp of creation
- updated_at (DateTime): Timestamp of last update

**Constraints**:
- Primary key on id
- Foreign key constraint on user_id
- Required fields: id, user_id, title, created_at
- Index on user_id for efficient user-based queries
- Index on completed for filtering
- Index on due_date for sorting

## User Table

The users table stores user account information:

**Fields**:
- id (UUID/String): Primary key, unique identifier
- email (String, unique, not null): User email address
- password_hash (String, not null): Hashed password
- created_at (DateTime): Account creation timestamp
- updated_at (DateTime): Last update timestamp
- email_verified (Boolean, default false): Email verification status

**Constraints**:
- Primary key on id
- Unique constraint on email
- Required fields: id, email, password_hash, created_at
- Index on email for login efficiency

## Indexing Strategy

For optimal performance, the following indexes are implemented:

- Task table: Index on user_id for user-specific queries
- Task table: Composite index on (user_id, completed) for combined filtering
- Task table: Index on due_date for deadline-based queries
- User table: Index on email for authentication queries
- Task table: Index on created_at for chronological ordering