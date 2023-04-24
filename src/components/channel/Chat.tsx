import { useCallback, useEffect, useMemo, useState, type KeyboardEvent } from "react";
import { Button, Icons, Textarea } from "../ui";

import { cn } from "@/styles/utils";
import { useChat } from "@livekit/components-react";

import { NDKFilter, NDKEvent, NDKUser, NDKUserProfile} from "@nostr-dev-kit/ndk";
import ndk from "@/lib/ndk";
import { getUserInfo } from "@/lib/user";
import ChatMessage from "./ChatMessage";

export default function Chat() {
  const [events, setEvents] = useState<NDKEvent[]>([]);

  useEffect(() => {
    async function fetchEvents() {
      // Now connect to specified relays
      await ndk.connect();

      const filter: NDKFilter = { kinds: [1], '#e': ['ca18c387dc0e79239c74962ae883944d846a8866b17e90d6899dab6a6469f8e9'], limit: 20 };
      const fetchedEvents = await ndk.fetchEvents(filter);
      const eventsArray = Array.from(fetchedEvents);
      setEvents(eventsArray);
    }

    fetchEvents();
  }, []);

  const [message, setMessage] = useState("");

  // const onEnter = useCallback(
  //   (e: KeyboardEvent<HTMLTextAreaElement>) => {
  //     if (e.key === "Enter" && !e.shiftKey) {
  //       e.preventDefault();
  //       if (message.trim().length > 0) {
  //         send(message).catch((err) => console.error(err));
  //         setMessage("");
  //       }
  //     }
  //   },
  //   [message, send]
  // );

  // const onSend = useCallback(() => {
  //   if (message.trim().length > 0) {
  //     send(message).catch((err) => console.error(err));
  //     setMessage("");
  //   }
  // }, [message, send]);

  return (
    <>
      <div className="flex min-h-0 flex-1 flex-col-reverse overflow-y-auto">
      {events.map((event) => <ChatMessage key={event.id} event={event}/>)}
      </div>
      <div className="flex w-full gap-2">
        <Textarea
          value={message}
          className="border-box h-10 bg-white dark:bg-zinc-900"
          onChange={(e) => {
            setMessage(e.target.value);
          }}
          // onKeyDown={onEnter}
          placeholder="Type a message..."
        />
        <Button
          disabled={message.trim().length === 0}
          // onClick={onSend}
          className="bg-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          <div className="flex items-center gap-2">
            <Icons.send className="h-4 w-4" />
          </div>
        </Button>
      </div>
    </>
  );
}
