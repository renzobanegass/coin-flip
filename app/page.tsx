import App from "@/components/App";
import { env } from "@/lib/env";
import { Metadata } from "next";

const appUrl = env.NEXT_PUBLIC_URL;

const frame = {
  version: "next",
  imageUrl: `${appUrl}/icon.png`,
  button: {
    title: "Launch App",
    action: {
      type: "launch_frame",
      name: "Flip the Coin",
      url: appUrl,
      splashImageUrl: `${appUrl}/icon.png`,
      splashBackgroundColor: "#ffffff",
    },
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Flip the Coin",
    openGraph: {
      title: "Flip the Coin",
      description: "Join global rounds of coin flips. Choose heads or tails, pool your stake, and win your share if your side lands. Simple, social, and viral.",
    },
    other: {
      "fc:frame": JSON.stringify(frame),
    },
  };
}

export default function Home() {
  return <App />;
}
