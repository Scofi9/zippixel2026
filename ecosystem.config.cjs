module.exports = {
  apps: [
    {
      name: "zippixel-web",
      cwd: "/root/zippixel-web",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production",
        PORT: 3001,
      },
      env_file: "/root/zippixel-web/.env.local",
    },
  ],
};
