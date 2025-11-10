import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * Version Endpoint
 *
 * Returns version information about the deployed application.
 * Useful for:
 * - Deployment verification
 * - Debugging (which version is running?)
 * - Rollback decisions
 *
 * @returns {Object} Version, commit hash, build time, environment
 */
export async function GET() {
  try {
    // Read version from package.json
    const packageJsonPath = join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
    const version = packageJson.version || 'unknown';

    // Try to get git commit hash (if available)
    let commitHash = 'unknown';
    try {
      const gitHeadPath = join(process.cwd(), '.git', 'HEAD');
      const head = readFileSync(gitHeadPath, 'utf-8').trim();

      if (head.startsWith('ref:')) {
        // HEAD points to a branch reference
        const refPath = head.substring(5).trim();
        const refFile = join(process.cwd(), '.git', refPath);
        commitHash = readFileSync(refFile, 'utf-8').trim().substring(0, 7);
      } else {
        // HEAD is detached (direct commit hash)
        commitHash = head.substring(0, 7);
      }
    } catch {
      // Git info not available (e.g., in Docker container without .git)
      // Use environment variable if available (set during build)
      commitHash = process.env.GIT_COMMIT_HASH || 'unknown';
    }

    // Build timestamp (if available from environment)
    const buildTime = process.env.BUILD_TIMESTAMP || 'unknown';

    return NextResponse.json(
      {
        version,
        commit: commitHash,
        buildTime,
        environment: process.env.NODE_ENV || 'development',
        nodeVersion: process.version,
        platform: process.platform,
        uptime: process.uptime(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Version endpoint error:', error);

    return NextResponse.json(
      {
        error: 'Failed to retrieve version information',
        environment: process.env.NODE_ENV || 'development',
      },
      { status: 500 }
    );
  }
}
