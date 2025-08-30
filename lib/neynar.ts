export interface NeynarUser {
  fid: string
  username: string
  display_name: string
  pfp_url: string
  custody_address: string
  verifications: string[]
}

export const fetchUser = async (fid: string): Promise<NeynarUser> => {
  // Mock user data for simplified implementation
  return {
    fid,
    username: `user${fid}`,
    display_name: `User ${fid}`,
    pfp_url: "/images/icon.png",
    custody_address: "0x1234567890123456789012345678901234567890",
    verifications: [],
  }
}
