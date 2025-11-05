import { Router, Request, Response } from "express";
import mongoose from "mongoose";

const router = Router();

router.get("/health", async (req: Request, res: Response) => {
  const healthcheck = {
    uptime: process.uptime(),
    message: "OK",
    timestamp: Date.now(),
    environment: process.env.NODE_ENV,
    checks: {
      api: "healthy" as string,
      database: "unknown" as string,
      redis: "unknown" as string,
    },
  };

  try {
    if (mongoose.connection.readyState === 1) {
      healthcheck.checks.database = "healthy";
    } else {
      healthcheck.checks.database = "unhealthy";
    }

    const redisClient = req.app.locals.redisClient;
    if (redisClient?.isReady) {
      await redisClient.ping();
      healthcheck.checks.redis = "healthy";
    } else {
      healthcheck.checks.redis = "unhealthy";
    }
  } catch (error) {
    console.error("Health check error:", error);
    healthcheck.checks.api = "unhealthy";
    if (error instanceof Error) {
      healthcheck.message = error.message;
    }
  }

  const allHealthy = Object.values(healthcheck.checks).every(
    (status) => status === "healthy"
  );

  res.status(allHealthy ? 200 : 503).json(healthcheck);
});

router.get("/health/live", (req: Request, res: Response) => {
  res.status(200).json({ status: "alive" });
});

router.get("/health/ready", async (req: Request, res: Response) => {
  try {
    const mongoReady = mongoose.connection.readyState === 1;
    const redisClient = req.app.locals.redisClient;
    const redisReady = redisClient?.isReady;

    if (mongoReady && redisReady) {
      res.status(200).json({ status: "ready" });
    } else {
      res.status(503).json({
        status: "not ready",
        mongo: mongoReady,
        redis: redisReady,
      });
    }
  } catch (error) {
    res.status(503).json({
      status: "not ready",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
