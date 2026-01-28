# Data Model for Full-Stack Todo Web Application

## User Entity

### Fields
- **id** (UUID/String): Primary key, unique identifier for user
- **email** (String, unique): User's email address, used for authentication
- **password_hash** (String): Bcrypt hash of user's password
- **created_at** (DateTime): Timestamp of account creation
- **updated_at** (DateTime): Timestamp of last update
- **email_verified** (Boolean, default: false): Email verification status

### Relationships
- One-to-many with Task entity (user has many tasks)

### Validation Rules
- Email must be valid email format
- Email must be unique across all users
- Password must meet minimum strength requirements
- Email cannot be null or empty

## Task Entity

### Fields
- **id** (UUID/Integer): Primary key, unique identifier for task
- **user_id** (UUID/String, foreign key): Reference to owning user
- **title** (String, not null): Task title/summary (max 255 chars)
- **description** (Text, nullable): Detailed task description
- **completed** (Boolean, default: false): Completion status
- **due_date** (DateTime, nullable): Deadline for task completion
- **priority** (Enum: 'low', 'medium', 'high', default: 'medium'): Task priority level
- **created_at** (DateTime): Timestamp of task creation
- **updated_at** (DateTime): Timestamp of last update

### Relationships
- Many-to-one with User entity (task belongs to one user)

### Validation Rules
- Title is required and cannot be empty
- User_id must reference an existing user
- Priority must be one of the defined enum values
- Due date must be a future date if provided
- Completed status can be toggled by task owner only

### State Transitions
- Active (completed: false) → Completed (completed: true)
- Completed (completed: true) → Active (completed: false)

## Database Constraints

### Primary Keys
- Each entity has a unique primary key
- User.id and Task.id are unique across their respective tables

### Foreign Keys
- Task.user_id references User.id
- Referential integrity enforced with cascade options as appropriate

### Indexes
- User table: Index on email for authentication performance
- Task table: Composite index on (user_id, completed) for efficient filtering
- Task table: Index on due_date for deadline-based queries
- Task table: Index on created_at for chronological ordering

## Security Considerations

### Data Isolation
- All task queries must be filtered by user_id to enforce isolation
- Users can only access tasks where user_id matches their own ID
- No direct access to tasks belonging to other users

### Access Control
- Authentication required for all data operations
- Authorization checks performed based on user ownership
- User context validated before any data access