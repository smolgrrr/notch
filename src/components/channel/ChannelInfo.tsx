import { cn } from "@/styles/utils";
import { useParticipants } from "@livekit/components-react";
import { type Participant } from "livekit-client";
import { useCallback } from "react";
import { Icons } from "../ui";
import Presence from "./Presence";
import ZapButton from "./ZapButton";
import { useNostrEvents } from "nostr-react";

type Props = {
  username: string;
};

export default function ChannelInfo({ username }: Props) {
  const filterFn = useCallback((p: Participant) => p.videoTracks.size > 0, []);
  const participants = useParticipants({
    filter: filterFn,
  });
  const isLive = participants.length > 0;

  const { events } = useNostrEvents({
    filter: {
        kinds: [0],
        authors: ['8f44c56131b362668b0e01be8c71b24786598bb68fb909cfd78fabfb058dd0f0'],
        },
    });

  return (
    <div className="space-y-6 border-t px-8 py-6 dark:border-t-zinc-800">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="grid place-items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className={cn(
                "h-16 w-16 rounded-full border-2 border-white bg-gray-500 dark:border-zinc-900",
                isLive && "ring-2 ring-red-600"
              )}
              src="https://i.imgur.com/VGpUNFS.jpg" alt="Fancy Bobo" 
            />
            <img />
            {isLive && (
              <div className="absolute mt-14 w-12 rounded-xl border-2 border-white bg-red-600 p-1 text-center text-xs font-bold uppercase text-white transition-all dark:border-zinc-900">
                Live
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold">{username}</h1>
              <div className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-500">
                <Icons.check className="h-3 w-3 text-white dark:text-zinc-900" />
              </div>
            </div>
            <h2 className="text-sm font-medium">Running nostwitch</h2>
            <div className="-ml-0.5 flex gap-1 pt-1.5 text-xs font-medium">
              <div className="rounded-lg bg-zinc-200 px-2 py-0.5 dark:bg-zinc-800">
                #nostr
              </div>
              <div className="rounded-lg bg-zinc-200 px-2 py-0.5 dark:bg-zinc-800">
                #livekit
              </div>
              <div className="rounded-lg bg-zinc-200 px-2 py-0.5 dark:bg-zinc-800">
                #livestream
              </div>
            </div>
          </div>
        </div>
        <div>
        <a>
        <ZapButton metadata={events[0]}/></a>
        <Presence />
        </div>
      </div>
    </div>
  );
}
