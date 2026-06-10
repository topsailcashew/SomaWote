import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import 'dotenv/config';

// Neon serverless driver adapter (required by Prisma 7 "client" engine)
const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });

// Singleton so the server doesn't exhaust connections on hot-reload
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
