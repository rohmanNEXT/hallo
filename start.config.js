'use strict';

const path = require('path');

module.exports = {
  apps: [
    {
      name: 'api-dev',
      script: 'C:\\Program Files\\nodejs\\node_modules\\npm\\bin\\npm-cli.js',
      args: 'run dev',
      cwd: path.join(__dirname, 'apps', 'api'),
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'development',
      },
    },
    {
      name: 'web-dev',
      script: 'C:\\Program Files\\nodejs\\node_modules\\npm\\bin\\npm-cli.js',
      args: 'run dev',
      cwd: path.join(__dirname, 'apps', 'web'),
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      env: {
        PORT: 8000,
      },
    },
  ],
};
