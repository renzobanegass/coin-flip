"use client"

import { useState, useEffect } from "react"

const FIRST_VISIT_KEY = "coin-flip-first-visit"

export function useFirstVisit() {
  const [isFirstVisit, setIsFirstVisit] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      const hasVisited = localStorage.getItem(FIRST_VISIT_KEY)
      if (!hasVisited) {
        setIsFirstVisit(true)
      }
    } catch (error) {
      console.warn("Failed to check first visit status:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const markAsVisited = () => {
    try {
      localStorage.setItem(FIRST_VISIT_KEY, "true")
      setIsFirstVisit(false)
    } catch (error) {
      console.warn("Failed to mark as visited:", error)
    }
  }

  return {
    isFirstVisit,
    isLoading,
    markAsVisited
  }
}