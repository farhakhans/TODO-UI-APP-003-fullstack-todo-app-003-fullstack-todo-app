# Authentication System

## Signup with Better Auth

Users must be able to create new accounts using Better Auth with:

- Email and password registration
- Password strength validation
- Email verification requirement (optional)
- Account creation confirmation
- Immediate session establishment after signup
- Proper error handling for duplicate emails

## Signin with Better Auth

Users must be able to authenticate with existing credentials:

- Email and password login
- Account verification checks
- Session establishment upon successful authentication
- Proper error handling for invalid credentials
- Account lockout protection after failed attempts
- Remember me functionality (optional)

## JWT Issuance and Expiry

The system must handle JWT tokens properly:

- Generate JWT upon successful authentication
- Include user identity and permissions in claims
- Set appropriate expiry time (e.g., 1 hour)
- Refresh tokens before expiry (optional)
- Handle token expiry gracefully
- Secure token storage in browser

## Logout Behavior

The system must properly handle user logout:

- Invalidate current session
- Remove JWT from browser storage
- Redirect to login page
- Clear any user-specific cached data
- Prevent back-button access to protected areas
- Provide confirmation feedback to user