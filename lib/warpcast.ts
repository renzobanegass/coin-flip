import { env } from "@/lib/env";

/**
 * Get the farcaster manifest for the frame, generate yours from Warpcast Mobile
 *  On your phone to Settings > Developer > Domains > insert website hostname > Generate domain manifest
 * @returns The farcaster manifest for the frame
 */
export async function getFarcasterManifest() {
  let frameName = "Flip the Coin";
  let noindex = false;
  const appUrl = env.NEXT_PUBLIC_URL;
  if (appUrl.includes("localhost")) {
    frameName += " Local";
    noindex = true;
  } else if (appUrl.includes("ngrok")) {
    frameName += " NGROK";
    noindex = true;
  } else if (appUrl.includes("https://dev.")) {
    frameName += " Dev";
    noindex = true;
  }
  return {
    accountAssociation: {
      header: env.NEXT_PUBLIC_FARCASTER_HEADER,
      payload: env.NEXT_PUBLIC_FARCASTER_PAYLOAD,
      signature: env.NEXT_PUBLIC_FARCASTER_SIGNATURE,
    },
    frame: {
      version: "1.1",
      name: "Flip the Coin",
      iconUrl: "${appUrl}/icon.png",
      homeUrl: "${appUrl}",
      imageUrl: "${appUrl}/icon.png",
      buttonTitle: "Launch Coin Flip",
      splashImageUrl: "${appUrl}/icon.png",
      splashBackgroundColor: "#FFFFFF",
      webhookUrl: "${appUrl}/api/webhook",
      subtitle: "Pick heads or tails", 
      description: "Join global rounds of coin flips. Choose heads or tails, pool your stake, and win your share if your side lands. Simple, social, and viral.",
      primaryCategory: "social",
      tags: ["coinflip", "game", "social", "crypto", "bets"],
      tagline: "Win by flipping a coin",
      ogTitle: "Flip the Coin – Global Rounds",
      ogDescription: "Stake, flip, and win with people worldwide. Heads or tails, every round is global.",
      screenshotUrls: [
        "${appUrl}/icon.png"
      ],
      heroImageUrl: "${appUrl}/icon.png",
      ogImageUrl: "${appUrl}/icon.png",
      noindex: false
    },
  };
}
