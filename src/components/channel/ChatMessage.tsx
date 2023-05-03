import { useEffect, useState} from "react";

import { cn } from "@/styles/utils";

import { Event } from "nostr-tools";
import { useProfile } from "nostr-react";

type Props = {
    event: Event;
};

export default function ChatMessage({ event }: Props) {
  const { data: userData } = useProfile({
    pubkey: event.pubkey,
  });

  return (
    <>
      <div className="flex flex-1 flex-col-reverse ">
          <div key={event.id} className="flex items-center gap-2 p-2">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <img
                className="w-6 h-6 rounded-full" 
                src={userData?.picture} />
                <div
                  className={cn(
                    "text-xs font-semibold",
                  )}
                >
                  {userData?.name}:
                </div>
              </div>
              <div className="text-sm">{event.content}</div>
            </div>
          </div>
      </div>
    </>
  );
}
