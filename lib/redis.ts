export interface MockRedis {
  get: <T>(key: string) => Promise<T | null>
  set: (key: string, value: any) => Promise<void>
  del: (key: string) => Promise<void>
}

const mockRedis: MockRedis = {
  async get<T>(key: string): Promise<T | null> {
    // Mock implementation - in real app this would use localStorage or memory
    return null
  },
  async set(key: string, value: any): Promise<void> {
    // Mock implementation
    console.log(`[Mock Redis] SET ${key}:`, value)
  },
  async del(key: string): Promise<void> {
    // Mock implementation
    console.log(`[Mock Redis] DEL ${key}`)
  },
}

export const redis = mockRedis
