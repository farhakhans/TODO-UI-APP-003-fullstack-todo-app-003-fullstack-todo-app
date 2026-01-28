# Task CRUD Operations

## Create Tasks

Users must be able to create new tasks with the following capabilities:

- Provide task title and optional description
- Set due date and priority level (optional)
- Associate task with user account automatically
- Validate required fields before submission
- Display success/error feedback to user

## Read Tasks

Users must be able to view their tasks with the following capabilities:

- List all tasks associated with user account
- Filter tasks by status (active, completed)
- Sort tasks by creation date, due date, or priority
- View individual task details
- Pagination for large numbers of tasks

## Update Tasks

Users must be able to modify existing tasks with the following capabilities:

- Edit task title and description
- Update due date and priority level
- Change task status (active ↔ completed)
- Preserve original creation timestamp
- Maintain user ownership unchanged

## Delete Tasks

Users must be able to remove tasks with the following capabilities:

- Remove individual tasks permanently
- Confirm deletion before executing
- Prevent accidental deletions
- Handle deletion failures gracefully
- Update UI to reflect task removal

## Task Completion Toggle

Users must be able to mark tasks as completed or incomplete with:

- Simple toggle mechanism (checkbox or button)
- Immediate visual feedback on status change
- Automatic timestamp recording for completion
- Ability to revert completion status
- Real-time synchronization across devices

## User-Scoped Task Ownership

All task operations must enforce user-specific ownership:

- Users can only access their own tasks
- Attempts to access others' tasks are rejected
- User context is automatically applied to all operations
- Ownership cannot be transferred between users
- Deleted users' tasks are handled according to retention policy