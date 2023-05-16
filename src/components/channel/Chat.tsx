import { useCallback, useState, type KeyboardEvent } from "react";
import { Button, Icons, Textarea } from "../ui";

import ChatMessage from "./ChatMessage";
import { getStoredPubkey } from "@/lib/user";
import { getEventHash } from "nostr-tools";
import { useNostrEvents } from "nostr-react";
import 'websocket-polyfill'
import { Event } from "nostr-tools";
import { useNostr } from "nostr-react";

export default function Chat() {
  const [message, setMessage] = useState("");
  const { publish } = useNostr();
  const { events } = useNostrEvents({
    filter: {
      '#e':[
        "ca18c387dc0e79239c74962ae883944d846a8866b17e90d6899dab6a6469f8e9",
      ],
      kinds: [1],
    },
  });

  const onEnter = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        onSend();
      }
    },
    [message]
  );

  const onSend = useCallback(async () => {
    if (message.trim().length > 0) {
      const unpublishedEvent: Event = {
        id: 'null',
        content: message,
        kind: 1,
        tags: [['e', 'ca18c387dc0e79239c74962ae883944d846a8866b17e90d6899dab6a6469f8e9']],
        created_at: Math.round(Date.now() / 1000),
        pubkey: getStoredPubkey() as string,
        sig: 'null',
      };

      unpublishedEvent.id = getEventHash(unpublishedEvent);
      if (window.nostr) {
      unpublishedEvent.sig = (await window.nostr.signEvent(unpublishedEvent)).sig;
      }

      publish(unpublishedEvent);
      setMessage("");
    }
  }, [message]);

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
          onKeyDown={onEnter}
          placeholder="Type a message..."
        />
        <Button
          disabled={message.trim().length === 0}
          onClick={onSend}
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