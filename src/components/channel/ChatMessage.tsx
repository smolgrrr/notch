import { useEffect, useState} from "react";

import { cn } from "@/styles/utils";

import { NDKEvent } from "@nostr-dev-kit/ndk";
import { getUserInfo } from "@/lib/user";

type Props = {
    event: NDKEvent;
};

export default function ChatMessage({ event }: Props) {
  const [name, setName] = useState('');
  const [imageLink, setImageLink] = useState('');
  
  useEffect(() => {
      async function fetchUserInfo() {
          const userInfo = await getUserInfo(event.pubkey);
          setName(userInfo.name ?? '');
          setImageLink(userInfo.image ?? '');
      }
  
      fetchUserInfo();
  }, []);

  return (
    <>
      <div className="flex flex-1 flex-col-reverse ">
          <div key={event.id} className="flex items-center gap-2 p-2">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <img
                className="w-6 h-6 rounded-full" 
                src={imageLink} />
                <div
                  className={cn(
                    "text-xs font-semibold",
                  )}
                >
                  {name}:
                </div>
              </div>
              <div className="text-sm">{event.content}</div>
            </div>
          </div>
      </div>
    </>
  );
}
