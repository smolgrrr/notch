import Footer from "@/components/Footer";
import { NavBar } from "@/components/NavBar";
import { api } from "@/lib/api";
import "@/styles/globals.css";
import { cn } from "@/styles/utils";
import { ThemeProvider } from "next-themes";
import { type AppType } from "next/app";
import { NostrProvider } from "nostr-react";
import { relayUrls } from "@/consts/consts";

declare global {
  interface Window {
    webln?: any;
  }
}

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <NostrProvider relayUrls={relayUrls} debug={true}>
    <ThemeProvider>
      <main
        className={cn(
          "flex min-h-screen flex-col bg-white font-sans text-zinc-900 antialiased dark:bg-zinc-900 dark:text-zinc-50",
        )}
      >
        <NavBar />
        <Component {...pageProps} />
      </main>
    </ThemeProvider>
    </NostrProvider>
  );
};

export default api.withTRPC(MyApp);
