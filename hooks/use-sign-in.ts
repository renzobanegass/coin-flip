"use client"

import { MESSAGE_EXPIRATION_TIME } from "@/lib/constants"
import type { NeynarUser } from "@/lib/neynar"
import { useAuthenticate, useMiniKit } from "@coinbase/onchainkit/minikit"
import { useCallback, useEffect, useState } from "react"

export const useSignIn = ({ autoSignIn = false }: { autoSignIn?: boolean }) => {
  const { context } = useMiniKit()
  const { signIn } = useAuthenticate()
  const [user, setUser] = useState<NeynarUser | null>(null)
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSignIn = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      if (!context || !context.user) {
        // Create a mock user when context is not available (development mode)
        const mockUser: NeynarUser = {
          fid: "12345",
          username: "mockuser",
          display_name: "Mock User",
          pfp_url: "/images/icon.png",
          custody_address: "0x1234567890123456789012345678901234567890",
          verifications: [],
        }

        setUser(mockUser)
        setIsSignedIn(true)
        return { user: mockUser }
      }

      const result = await signIn({
        nonce: Math.random().toString(36).substring(2),
        notBefore: new Date().toISOString(),
        expirationTime: new Date(Date.now() + MESSAGE_EXPIRATION_TIME).toISOString(),
      })

      if (!result) {
        throw new Error("Sign in failed")
      }

      const mockUser: NeynarUser = {
        fid: context.user.fid.toString(),
        username: `user${context.user.fid}`,
        display_name: `User ${context.user.fid}`,
        pfp_url: "/images/icon.png",
        custody_address: "0x1234567890123456789012345678901234567890",
        verifications: [],
      }

      setUser(mockUser)
      setIsSignedIn(true)
      return { user: mockUser }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Sign in failed"
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [context, signIn])

  useEffect(() => {
    if (autoSignIn) {
      handleSignIn()
    }
  }, [autoSignIn, handleSignIn])

  return { signIn: handleSignIn, isSignedIn, isLoading, error, user }
}
