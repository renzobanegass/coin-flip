import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
  server: {
    // Mock values for simplified implementation
    NEYNAR_API_KEY: z.string().optional().default("mock-neynar-key"),
    JWT_SECRET: z.string().optional().default("mock-jwt-secret-for-development"),
    REDIS_URL: z.string().optional().default("mock-redis-url"),
    REDIS_TOKEN: z.string().optional().default("mock-redis-token"),
  },
  client: {
    NEXT_PUBLIC_URL: z.string().optional().default("http://localhost:3000"),
    NEXT_PUBLIC_APP_ENV: z.enum(["development", "production"]).optional().default("development"),
    NEXT_PUBLIC_MINIKIT_PROJECT_ID: z.string().optional().default("mock-minikit-project-id"),
    NEXT_PUBLIC_FARCASTER_HEADER: z.string().optional().default("mock-farcaster-header"),
    NEXT_PUBLIC_FARCASTER_PAYLOAD: z.string().optional().default("mock-farcaster-payload"),
    NEXT_PUBLIC_FARCASTER_SIGNATURE: z.string().optional().default("mock-farcaster-signature"),
  },
  // For Next.js >= 13.4.4, you only need to destructure client variables:
  experimental__runtimeEnv: {
    NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
    NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV,
    NEXT_PUBLIC_MINIKIT_PROJECT_ID: process.env.NEXT_PUBLIC_MINIKIT_PROJECT_ID,
    NEXT_PUBLIC_FARCASTER_HEADER: process.env.NEXT_PUBLIC_FARCASTER_HEADER,
    NEXT_PUBLIC_FARCASTER_PAYLOAD: process.env.NEXT_PUBLIC_FARCASTER_PAYLOAD,
    NEXT_PUBLIC_FARCASTER_SIGNATURE: process.env.NEXT_PUBLIC_FARCASTER_SIGNATURE,
  },
})
