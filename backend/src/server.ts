import App from "./app.js";
import { config } from "./config/env.config.js";

const startServer = () => {
  try {
    const appInstance = new App();

    const server = appInstance.app.listen(config.port, () => {
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("🚀 Server Started");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log(`📡 Environment: ${config.nodeEnv}`);
      console.log(`🌐 Server running on port: ${config.port}`);
      console.log(`🔗 Health check: http://localhost:${config.port}/api/health`);
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();