module.exports = {
  apps: [
    {
      name: "web",
      cwd: "/home/obregan/Documents/nodl/apps/web",
      script: "npm",
      args: "run dev",
      env: { PORT: 3004 }
    },
    {
      name: "command",
      cwd: "/home/obregan/Documents/nodl/apps/command",
      script: "npm",
      args: "start",
      env: { PORT: 3001 }
    },
    {
      name: "nodlr",
      cwd: "/home/obregan/Documents/nodl/apps/nodlr",
      script: "npm",
      args: "start",
      env: { PORT: 3002 }
    },
    {
      name: "mesh",
      cwd: "/home/obregan/Documents/nodl/apps/mesh",
      script: "npm",
      args: "start",
      env: { PORT: 3003 }
    },
    {
      name: "backend",
      cwd: "/home/obregan/Documents/nodl",
      script: "/home/obregan/Documents/nodl/nodld_bin",
      args: "",
      env: { 
        PORT: 8080,
        DEVELOPMENT_MODE: "true"
      }
    }
  ]
}
