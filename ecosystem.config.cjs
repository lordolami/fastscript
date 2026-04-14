module.exports = {
  apps: [{
    name: "fastscript-app",
    script: "node",
    args: "./src/cli.mjs start",
    instances: "max",
    exec_mode: "cluster",
    env: {
      NODE_ENV: "production",
      PORT: 4173
    }
  }]
};
