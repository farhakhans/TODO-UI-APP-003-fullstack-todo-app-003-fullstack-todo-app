<!--
Sync Impact Report:
- Version change: N/A → 1.0.0 (Initial constitution creation)
- Modified principles: N/A (New constitution)
- Added sections: All sections (New constitution)
- Removed sections: None
- Templates requiring updates: N/A
- Follow-up TODOs: None
-->
# TODO-UI-APP Constitution
<!-- Full-Stack Web Application following Spec-Driven, Agentic Development -->

## Core Principles

### I. Spec-Driven Development (NON-NEGOTIABLE)
All behavior must be defined via specifications before any implementation. No manual coding by humans is allowed - Claude Code is the sole implementation agent. Every change must be traceable to a spec.
<!-- Rationale: Ensures predictable, auditable development process where all changes are planned and documented before implementation -->

### II. Agentic Development Workflow
Follow a strict Spec-Driven, Agentic Development workflow where specifications drive all implementation. Claude Code implements all features based on detailed specifications, with no ad-hoc coding allowed.
<!-- Rationale: Maintains consistency and quality by ensuring all development follows a standardized, specification-first approach -->

### III. Full-Stack Monorepo Architecture
Implement both frontend and backend within a single monorepo context with clear separation of concerns. Maintain production-grade responsiveness and accessibility across all components.
<!-- Rationale: Enables efficient development while maintaining clear boundaries between different layers of the application -->

### IV. Multi-User Security & Isolation
Enforce JWT-based user isolation with no cross-user data access permitted. All endpoints must be secured post-authentication with Better Auth providing secure, stateless authentication.
<!-- Rationale: Critical for protecting user data and maintaining privacy in a multi-user environment -->

### V. Technology Stack Commitment
Use the mandated technology stack: Next.js 16+ (App Router, TypeScript, Tailwind) for frontend, FastAPI (Python) for backend, SQLModel for ORM, Neon Serverless PostgreSQL for database, and Better Auth with JWT for authentication.
<!-- Rationale: Ensures consistency, compatibility, and maintainability across the entire application -->

### VI. RESTful API Design with Responsive UI
Design all backend services following RESTful API principles with fully responsive UI that works across mobile, tablet, and desktop devices.
<!-- Rationale: Provides clean, scalable architecture with consistent user experience across all device types -->

## Architecture Mandates
Maintain clear separation of concerns between frontend and backend, follow RESTful API design principles, and ensure production-grade responsiveness and accessibility. The application must be a full-stack web application with multi-user, secure, stateless authentication capabilities.
<!-- Technology stack requirements: Next.js 16+, FastAPI, SQLModel, Neon PostgreSQL, Better Auth -->

## Development Workflow
Follow a spec-driven development process where all changes begin with detailed specifications. No implementation should occur without a corresponding specification. Claude Code acts as the implementation agent, translating specifications into code. All development occurs within a single monorepo context with clear separation between frontend and backend components.
<!-- Code review requirements: Verify compliance with constitutional principles; All changes must be traceable to specifications -->

## Governance
This constitution supersedes all other development practices and must be followed without exception. All amendments require formal documentation and approval. The constitution governs all development activities and serves as the authoritative source for development practices.

All pull requests and reviews must verify compliance with constitutional principles. Any deviation must be justified and documented. The constitution ensures that development follows the spec-driven, agentic workflow with the mandated technology stack and security requirements.

**Version**: 1.0.0 | **Ratified**: 2026-01-07 | **Last Amended**: 2026-01-07
<!-- Initial constitution for TODO-UI-APP project -->
