module.exports = {
  apps: [
    {
      name: 'backend',
      script: './nodld_bin',
      cwd: './nodld',
      watch: false,
      env: {
        NODE_ENV: 'development',
        DEVELOPMENT_MODE: 'true',
        DEVELOPER_MODE: 'true'
      }
    },
    {
      name: 'command',
      script: 'npm',
      args: 'run start --prefix apps/command -- -p 3001',
      cwd: '.',
      watch: false,
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'mesh',
      script: 'npm',
      args: 'run start --prefix apps/mesh',
      cwd: '.',
      watch: false,
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'nodlr',
      script: 'npm',
      args: 'run start --prefix apps/nodlr -- -p 3002',
      cwd: '.',
      watch: false,
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'web',
      script: 'npm',
      args: 'run start --prefix apps/web',
      cwd: '.',
      watch: false,
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};
