import re

with open("/home/obregan/wnode/node-operator/src/auth/auth.go", "r") as f:
    content = f.read()

content = content.replace('url := fmt.Sprintf("%s/api/cmd/auth/debug-session", strings.TrimRight(apiBase, "/"))', 
                          'url := fmt.Sprintf("%s/api/v1/auth/login", strings.TrimRight(apiBase, "/"))')
content = content.replace('url := fmt.Sprintf("%s/api/v1/auth/debug-session", strings.TrimRight(apiBase, "/"))', 
                          'url := fmt.Sprintf("%s/api/v1/auth/login", strings.TrimRight(apiBase, "/"))')

with open("/home/obregan/wnode/node-operator/src/auth/auth.go", "w") as f:
    f.write(content)
