# REST API Endpoints

## Base URL

All API endpoints are accessible under the `/api/` path.

## Authentication Requirements

Every API request must include a valid JWT in the Authorization header:

- Header: `Authorization: Bearer {jwt_token}`
- JWT must be valid and not expired
- All endpoints require authentication except public ones
- Invalid JWTs return 401 Unauthorized
- Expired JWTs return 401 Unauthorized

## Task Management Endpoints

### GET /api/tasks
Retrieve user's tasks
- Response: Array of task objects
- Query params: status (active/completed), sort, limit, offset
- Returns: 200 OK, 401 Unauthorized

### POST /api/tasks
Create a new task
- Request body: {title, description, due_date, priority}
- Response: Created task object with ID
- Returns: 201 Created, 400 Bad Request, 401 Unauthorized

### GET /api/tasks/{id}
Retrieve specific task
- Path param: task ID
- Response: Task object
- Returns: 200 OK, 401 Unauthorized, 403 Forbidden, 404 Not Found

### PUT /api/tasks/{id}
Update a task
- Path param: task ID
- Request body: Fields to update
- Response: Updated task object
- Returns: 200 OK, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found

### DELETE /api/tasks/{id}
Delete a task
- Path param: task ID
- Response: Empty body
- Returns: 204 No Content, 401 Unauthorized, 403 Forbidden, 404 Not Found

### PATCH /api/tasks/{id}/toggle-complete
Toggle task completion status
- Path param: task ID
- Request body: {completed: boolean}
- Response: Updated task object
- Returns: 200 OK, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found

## Authentication Endpoints

### POST /api/auth/signup
User registration
- Request body: {email, password}
- Response: JWT token
- Returns: 201 Created, 400 Bad Request

### POST /api/auth/signin
User login
- Request body: {email, password}
- Response: JWT token
- Returns: 200 OK, 400 Bad Request, 401 Unauthorized

### POST /api/auth/logout
User logout
- Response: Empty body
- Returns: 200 OK, 401 Unauthorized

## Error Handling

All endpoints must return appropriate HTTP status codes:

- **401 Unauthorized**: Missing or invalid JWT
- **403 Forbidden**: Valid JWT but insufficient permissions
- **404 Not Found**: Requested resource doesn't exist
- **400 Bad Request**: Invalid request parameters or body
- **500 Internal Server Error**: Unexpected server errors