# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

Project overview
- Monorepo with:
  - backend: Spring Boot 3 (Java 17, Maven), OAuth2 Resource Server (JWT), H2 in-memory DB
  - frontend: React + TypeScript + Vite (React Compiler enabled)

Prerequisites
- Backend: Java 17+, Maven 3.9+
- Frontend: Node 18+ and npm

Common commands
Backend (from repo root)
- Install/build: mvn -f backend/pom.xml clean package
- Run app: mvn -f backend/pom.xml spring-boot:run
- Run tests: mvn -f backend/pom.xml test
- Run a single test class: mvn -f backend/pom.xml -Dtest=FullyQualifiedTestClassName test
- Run a single test method: mvn -f backend/pom.xml -Dtest=FullyQualifiedTestClassName#methodName test
- Notable endpoints while running:
  - H2 console: http://localhost:8080/h2-console (open access)
  - Actuator: http://localhost:8080/actuator/** (open access)

Frontend (from repo root)
- Install deps: npm --prefix frontend install
- Dev server: npm --prefix frontend run dev (defaults to http://localhost:5173)
- Build: npm --prefix frontend run build
- Lint: npm --prefix frontend run lint
- Preview built app: npm --prefix frontend run preview
- Tests: not configured in package.json as of now

Configuration and environment
- CORS: backend allows origin from app.cors.allowed-origin (default http://localhost:5173)
- Auth0/JWT config (defaults provided in application.properties; override via env for real tokens):
  - spring.security.oauth2.resourceserver.jwt.issuer-uri = ${AUTH0_ISSUER_URI}
  - app.auth0.audience = ${AUTH0_AUDIENCE}
  - app.auth0.roles-claim = ${AUTH0_ROLES_CLAIM:roles}
- On PowerShell, set env vars before running the backend (replace placeholders accordingly):
  - $env:AUTH0_ISSUER_URI = "{{AUTH0_ISSUER_URI}}"
  - $env:AUTH0_AUDIENCE = "{{AUTH0_AUDIENCE}}"
  - $env:AUTH0_ROLES_CLAIM = "roles"  # or your custom claim namespace

High-level architecture
Backend
- Entry point: backend/src/main/java/com/example/mugmanager/MugManagerApplication.java
- Security configuration: backend/src/main/java/com/example/mugmanager/config/SecurityConfig.java
  - OAuth2 Resource Server with JWT validation
  - CORS enabled using app.cors.allowed-origin
  - Method security enabled (@EnableMethodSecurity) with @PreAuthorize on controller methods
  - Roles are read from a configurable JWT claim (app.auth0.roles-claim, default "roles") and mapped with prefix ROLE_
    - Example: claim value "admin" becomes authority "ROLE_admin"
  - Public paths: /actuator/** and /h2-console/**; all others require authentication
- Domain model: Mug (id, name, description, ownerSub)
  - Entity: backend/src/main/java/com/example/mugmanager/model/Mug.java
- Persistence: Spring Data JPA with H2 (in-memory)
  - Repository: backend/src/main/java/com/example/mugmanager/repo/MugRepository.java
  - Query helper: findByOwnerSub(String ownerSub)
- Web/API layer: backend/src/main/java/com/example/mugmanager/web/MugController.java
  - Base path: /api/mugs
  - GET /api/mugs: requires role "admin" (@PreAuthorize("hasRole('admin')"))
  - GET /api/mugs/me: authenticated user’s mugs (uses Authentication.getName() as JWT subject)
  - POST /api/mugs: creates a mug owned by the authenticated user
  - DELETE /api/mugs/{id}: allowed for the owner or users with ROLE_admin; otherwise AccessDeniedException
- Configuration: backend/src/main/resources/application.properties
  - H2 console enabled; JPA ddl-auto=update; SQL logging enabled
  - Default JWT issuer/audience placeholders; adjust env vars for real token validation

Frontend
- Vite + React + TypeScript scaffold (React Compiler enabled via babel plugin)
- Key files:
  - Vite config: frontend/vite.config.ts (react plugin with babel-plugin-react-compiler)
  - ESLint config: frontend/eslint.config.js (ESLint 9 + TS + react-hooks + react-refresh)
  - App entry: frontend/src/main.tsx; root component: frontend/src/App.tsx
- Note: React Compiler may impact dev/build performance (see frontend/README.md)

Local development workflow
- Start backend (with env configured if validating real JWTs): mvn -f backend/pom.xml spring-boot:run
- Start frontend: npm --prefix frontend run dev
- CORS defaults align with http://localhost:5173 → http://localhost:8080

Conventions and structure
- Backend packages follow a typical Spring layering:
  - com.example.mugmanager.model → JPA entities
  - com.example.mugmanager.repo → Spring Data repositories
  - com.example.mugmanager.web → REST controllers
  - com.example.mugmanager.config → framework/security configuration
- Security decisions are enforced primarily at the controller layer via @PreAuthorize; ownership checks are performed in-controller for DELETE.
