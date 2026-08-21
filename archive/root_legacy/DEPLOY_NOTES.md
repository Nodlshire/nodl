# Deployment & Environment Notes

This file documents the intentional differences between Local Development and Production (`*.wnode.one`) environments regarding Authentication, Cookies, and API routing.

## 1. Authentication Cookies
The `nodld` backend dynamically configures session cookies based on the `DEVELOPMENT_MODE` environment variable.
*   **Production (`DEVELOPMENT_MODE=false`)**:
    *   `Secure=true` (Requires HTTPS).
    *   `Domain=.wnode.one` (Cookies are shared across `cmd.wnode.one`, `nodlr.wnode.one`, `mesh.wnode.one` to enable SSO).
*   **Local Development (`DEVELOPMENT_MODE=true`)**:
    *   `Secure=false` (Allows HTTP localhost).
    *   `Domain=""` (Omitted, binding strictly to the requesting `localhost:300x` port to prevent browser rejection).

### Domain Isolation
Regardless of the environment, the cookie names remain isolated:
*   `cmd_session` -> Expected by Command (CDM) Middleware.
*   `nodlr_session` -> Expected by Nodlr Middleware.
*   `mesh_session` -> Expected by Mesh Middleware.

## 2. API Routing & Environment Variables
*   **Production**: All `NEXT_PUBLIC_API_URL` and `WNODE_BACKEND_URL` variables should point to `https://api.wnode.one`.
*   **Local Development**: All API routing environment variables MUST point to `http://localhost:8081`, as `8081` is the authoritative HTTP API port for the `nodld` engine in dev. Port `10000` is reserved strictly for P2P WebSockets, and port `8082` is deprecated.
