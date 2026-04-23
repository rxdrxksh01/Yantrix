import { PrismaClient } from '@prisma/client';
import { config } from '../../config/env.config.js';

/**
 * Singleton Pattern Implementation for Prisma Client
 * Ensures single database connection pool throughout application lifecycle
 */
class DatabaseClient {
  private static instance: PrismaClient;

  public static getInstance(): PrismaClient {
    if (!DatabaseClient.instance) {
      DatabaseClient.instance = new PrismaClient();
    }
    return DatabaseClient.instance;
  }

  public static async disconnect(): Promise<void> {
    if (DatabaseClient.instance) {
      await DatabaseClient.instance.$disconnect();
    }
  }
}

export default DatabaseClient;  