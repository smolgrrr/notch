import { useEffect, useState} from "react";

import { cn } from "@/styles/utils";

import { NDKEvent } from "@nostr-dev-kit/ndk";
import { getUserInfo } from "@/lib/user";

type Props = {
    viewerName: string;
    event: NDKEvent;
};

export default function ChatMessage({ viewerName, event }: Props) {
    const [name, setName] = useState('')
    useEffect(() => {
        async function fetchEvents() {
            setName(await getUserInfo(event.pubkey) as string);
        }
    
        fetchEvents();
      }, []);

  return (
    <>
      <div className="flex flex-1 flex-col-reverse ">
          <div key={event.id} className="flex items-center gap-2 p-2">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "text-xs font-semibold",
                    viewerName === name && "text-blue-500"
                  )}
                >
                  {name}:
                  {viewerName === name && " (you)"}
                </div>
              </div>
              <div className="text-sm">{event.content}</div>
            </div>
          </div>
      </div>
    </>
  );
}
