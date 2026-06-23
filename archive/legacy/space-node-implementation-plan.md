# Space Node Implementation Plan

## 1. System Architecture & Mechanics

### Identity & Registration
*   **Archetype Creation**: Introduce `AA:SP` (Autonomous Agent: Space Provider) within the Shared Types and Identity schemas.
*   **WUID Generation**: Modify the Node Registration flow in Command/Nodld to support passing the `AA:SP` archetype. When this archetype is selected, a unique WUID is securely generated and flagged for headless Space Node environments.
*   **Applying Nodlr IN Label**: During account creation via the Command dashboard, assign the "Nodlr IN" internal label metadata to bypass the public affiliate structures.
*   **Authentication**: The Space Node will authenticate to the backend via a pre-generated, long-lived JWT or secure API token baked into the configuration file along with the `WUID`.

### Runtime & Telemetry
*   **Headless Mode**: Implement a flag or env variable (e.g., `HEADLESS=true`) for the standard Node Operator runtime or compile a slimmed-down binary specifically for Space Node. This will skip loading any GUI components or local web server for the dashboard.
*   **Telemetry Pipeline**: The runtime will execute background heartbeat loops to push minimal telemetry (`uptime`, `tasks_completed`, `resource_usage`) directly to the backend telemetry ingestion endpoints.
*   **Earnings & Bonuses**: The backend earnings pipeline will ingest the `AA:SP` telemetry. Standard compute tasks will be quantified by duration/resources. A bonus multiplier logic will be added for Space Node routing availability. These calculations will be handled purely server-side.

### Command Visibility
*   **Display Logic**: Update Command dashboard queries to include `AA:SP` nodes when fetching the internal network tree, ensuring they remain hidden from the standard affiliate hierarchies. Add filters to display telemetry and accrued earnings/bonuses for these specific nodes.

## 2. Minimal Code Changes Needed

### Identity Service (`nodld` / Shared Types)
*   Add `AA:SP` to the `Archetype` enum.
*   Update authentication handlers to support direct headless token verification.

### Node Registration (Command / Backend)
*   Add API support for admins to explicitly register Space Nodes.
*   Implement backend logic to assign `Nodlr IN` labels upon `AA:SP` account creation.

### Telemetry & Earnings Pipeline (`nodld`)
*   Modify existing telemetry routes to identify the `AA:SP` archetype and process the reduced payload overhead.
*   Update earnings calculation workers to support the specific reward structure for space connectivity.

### Command Backend & UI (`apps/command`)
*   Update internal tree rendering components to accommodate the new node type.
*   Ensure Space Node metrics map correctly to the existing dashboard visualization widgets (e.g., charts).

## 3. Payload Generation Process

*   **Trigger**: Triggered via an admin action in Command ("Generate Space Node Payload").
*   **Included Files**:
    *   `space-node-client` (The headless binary executable)
    *   `config.json` (The secure configuration bundle)
*   **Embedding Data**: The backend generates a secure `config.json` containing:
    *   `wuid`: Automatically generated during provisioning.
    *   `archetype`: "AA:SP"
    *   `auth_token`: A pre-signed secure token for backend API authentication.
    *   `endpoints`: The production URLs for orchestrator, telemetry, and auth APIs.
*   **Deployment**: The payload (binary + config) is provided as a zip/tar archive. The partner handles unpacking and running the executable in their target environment.

## 4. Testing Plan

*   **Local Execution**:
    *   Compile the Space Node in headless mode.
    *   Run the binary locally passing a mock `config.json` pointed at local development services.
*   **Telemetry Simulation**:
    *   Verify the local binary pushes regular, minimal heartbeat payloads.
    *   Use mock scripts to artificially increment `tasks_completed` or fluctuate `resource_usage` to test payload handling.
*   **Earnings Validation**:
    *   Run backend cron workers against the mocked telemetry to confirm earnings and bonuses are calculated correctly for `AA:SP` nodes.
*   **Command Visibility Testing**:
    *   Log into the local Command dashboard.
    *   Verify the mock Space Node appears in the internal admin tree, displaying the correct `Nodlr IN` label.
    *   Verify the live telemetry charts and earnings ledgers match the simulated data.
