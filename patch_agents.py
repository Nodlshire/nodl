import os
import glob

base = "/home/obregan/wnode"
agent_files = []
agent_files.append(os.path.join(base, "agents.md"))
agent_files.append(os.path.join(base, "nodld", "agents.md"))
agent_files.append(os.path.join(base, "node-operator", "agents.md"))
for app in ["command", "mesh", "nodlr", "wnoder"]:
    agent_files.append(os.path.join(base, "apps", app, "agents.md"))

auth_rules = """
# Auth Engineering Guidelines
1. **Canonical Login**: `/api/v1/auth/login` is the SINGLE canonical login endpoint.
2. **Forbidden**: `/auth/debug-session` and `debug_disabled` workflows are strictly forbidden.
3. **Cookie Rules**: Frontend manipulation of cookies for login/logout is forbidden. Let the backend manage `Set-Cookie`.
4. **Session Models**: 
   - Command: `cmd_session`
   - Nodlr/Wnoder: `nodlr_session`
   - Mesh: `mesh_session`
"""

for file in agent_files:
    if os.path.exists(file):
        with open(file, "a") as f:
            f.write("\n" + auth_rules)
    else:
        with open(file, "w") as f:
            f.write(auth_rules)

