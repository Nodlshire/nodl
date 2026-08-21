module.exports = {
  apps: [
    {
      name: "web",
      cwd: "/home/obregan/Documents/nodl/apps/web",
      script: "/home/obregan/.local/bin/npm",
      args: "run dev",
      env: { 
        PORT: 3004,
        PATH: "/home/obregan/.local/bin:/usr/local/bin:/usr/bin"
      }
    },
    {
      name: "command",
      cwd: "/home/obregan/Documents/nodl/apps/command",
      script: "/home/obregan/.local/bin/npm",
      args: "start",
      env: { 
        PORT: 3001,
        PATH: "/home/obregan/.local/bin:/usr/local/bin:/usr/bin"
      }
    },
    {
      name: "nodlr",
      cwd: "/home/obregan/Documents/nodl/apps/nodlr",
      script: "/home/obregan/.local/bin/npm",
      args: "start",
      env: { 
        PORT: 3002,
        PATH: "/home/obregan/.local/bin:/usr/local/bin:/usr/bin"
      }
    },
    {
      name: "mesh",
      cwd: "/home/obregan/Documents/nodl/apps/mesh",
      script: "/home/obregan/.local/bin/npm",
      args: "start",
      env: { 
        PORT: 3003,
        PATH: "/home/obregan/.local/bin:/usr/local/bin:/usr/bin"
      }
    },
    {
      name: "backend",
      cwd: "/home/obregan/Documents/nodl",
      script: "/home/obregan/Documents/nodl/nodld_bin",
      args: "",
      env: { 
        PORT: 8080,
        DEVELOPMENT_MODE: "true",
        PATH: "/home/obregan/.local/bin:/usr/local/bin:/usr/bin"
      }
    },
    {
      name: "proxy",
      cwd: "/home/obregan/Documents/nodl",
      script: "/home/obregan/.local/bin/caddy",
      args: "run --config scripts/proxy/Caddyfile",
      env: {
        PATH: "/home/obregan/.local/bin:/usr/local/bin:/usr/bin"
      }
    }
  ]
}
