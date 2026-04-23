import express from "express";
import type { Application, Request, Response } from "express";
import cors from "cors";
import { config } from "./config/env.config.js";
import { errorHandler } from "./presentation/middleware/error.middleware.js";
import { AppResponse } from "./shared/response/AppResponse.js";
import authRoutes from "./presentation/routes/auth.routes.js";
import userRoutes from "./presentation/routes/user.routes.js";
import cookieParser from "cookie-parser";

export default class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares(): void {
    // CORS
    this.app.use(
      cors({
        origin: config.cors.origin,
        credentials: true,
      }),
    );

    // Body parsers
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // Cookies
    this.app.use(cookieParser());

    // Logging for development
    // if (config.nodeEnv === "development") {
    //   this.app.use((_req, _res, next) => {
    //     console.log(`${_req.method} ${_req.path}`);
    //     next();
    //   });
    // }
  }

  private initializeRoutes(): void {
    //Health Check Route
    this.app.get("/api/health", (_req: Request, res: Response) => {
      res.status(200).json(
        new AppResponse(
          200,
          {
            timestamp: new Date().toISOString(),
            environment: config.nodeEnv,
          },
          "API is healthy",
        ),
      );
    });

    // Application Routes to be defined here
    this.app.use('/api/auth', authRoutes);
    this.app.use('/api/user', userRoutes);

    // 404 Route Handle - If the request doesnot match any defined routes
    this.app.use((_req: Request, res: Response) => {
      res.status(404).json(new AppResponse(404, null, "No such Route found"));
    });
  }

  private initializeErrorHandling(): void {
    this.app.use(errorHandler);
  }
}
