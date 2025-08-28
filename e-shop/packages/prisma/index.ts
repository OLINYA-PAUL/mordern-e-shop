// prisma.ts
import { PrismaClient } from "@prisma/client";

declare global {
  // Prevent multiple instances in dev mode (Next.js, hot reloads)
  // @ts-ignore
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") global.prisma = prisma;

export default prisma;
