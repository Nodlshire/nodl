import re

# 1. Update model.go
with open("/home/obregan/wnode/nodld/internal/account/model.go", "r") as f:
    content = f.read()

# Add Domain string after Role UserRole
if "Domain                  string" not in content:
    content = content.replace("	Role                  UserRole        `json:\"role\"`\n", 
                              "	Role                  UserRole        `json:\"role\"`\n	Domain                string          `json:\"domain,omitempty\"`\n")

with open("/home/obregan/wnode/nodld/internal/account/model.go", "w") as f:
    f.write(content)

# 2. Update store.go again
with open("/home/obregan/wnode/nodld/internal/account/store.go", "r") as f:
    content = f.read()

if 'Domain:             "nodlr",' not in content:
    old_block = """			Email:              "stephen@wnode.one",
			DisplayName:        "Stephen Soos",
			Role:               RoleOwner,"""

    new_block = """			Email:              "stephen@wnode.one",
			DisplayName:        "Stephen Soos",
			Role:               RoleOwner,
			Domain:             "nodlr","""
    content = content.replace(old_block, new_block)

with open("/home/obregan/wnode/nodld/internal/account/store.go", "w") as f:
    f.write(content)

