import re

with open("/home/obregan/wnode/nodld/internal/account/store.go", "r") as f:
    content = f.read()

# Find the block for stephen@wnode.one
# Let's insert 'Domain: "nodlr",' after 'Role:               RoleOwner,'
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

