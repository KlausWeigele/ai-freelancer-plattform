import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

/**
 * Health Check Endpoint
 *
 * Returns the health status of the application and its dependencies.
 * Used by:
 * - ECS Health Checks
 * - ALB Target Group Health Checks
 * - Monitoring systems
 *
 * @returns {Object} Health status with timestamp, version, and database status
 */
export async function GET() {
  try {
    // Check database connection by running a simple query
    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json(
      {
        status: 'ok',
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version || '1.0.0',
        database: 'connected',
        environment: process.env.NODE_ENV || 'development',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Health check failed:', error);

    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: 'Database connection failed',
        database: 'disconnected',
        environment: process.env.NODE_ENV || 'development',
      },
      { status: 503 } // Service Unavailable
    );
  }
}
