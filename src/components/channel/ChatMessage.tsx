import { useEffect, useState} from "react";

import { cn } from "@/styles/utils";

import { Event } from "nostr-tools";
import { useProfile, useNostrEvents } from "nostr-react";

type Props = {
    event: Event;
};

export default function ChatMessage({ event }: Props) {
  const { data: userData } = useProfile({
    pubkey: event.pubkey,
  });

  const { events } = useNostrEvents({
    filter: {
      authors: ['8f44c56131b362668b0e01be8c71b24786598bb68fb909cfd78fabfb058dd0f0'],
      '#p':[
        event.pubkey,
      ],
      kinds: [8],
    },
  });
  let hasBadge = false;
  if (events.length > 0) {
    hasBadge = true;
  }


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
                  {hasBadge && <span className="text-xs font-semibold text-green-500">☕</span>}
                  <br />
                  {userData?.name}
                  :
                </div>
              </div>
              <div className="text-sm">{event.content}</div>
            </div>
          </div>
      </div>
    </>
  );
}
