import { useCallback, useEffect, useMemo, useState, type KeyboardEvent } from "react";
import { Button, Icons, Textarea } from "../ui";

import { NDKFilter, NDKEvent} from "@nostr-dev-kit/ndk";
import ndk from "@/lib/ndk";
import ChatMessage from "./ChatMessage";
import { getStoredPubkey } from "@/lib/user";
import { SimplePool, getEventHash, validateEvent, verifySignature } from "nostr-tools";
import { relayInit } from "nostr-tools";
import 'websocket-polyfill'

export default function Chat() {
  const [events, setEvents] = useState<NDKEvent[]>([]);
  const pool = new SimplePool()

  const relays = ['wss://nos.lol'];

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
  const messageEvent = new NDKEvent(ndk);
  messageEvent.kind = 1;
  messageEvent.tags = [['e', 'ca18c387dc0e79239c74962ae883944d846a8866b17e90d6899dab6a6469f8e9']];

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

  const onSend = useCallback(async () => {
    const relay = relayInit('wss://nos.lol')
    relay.on('connect', () => {
      console.log(`connected to ${relay.url}`)
    })
    relay.on('error', () => {
      console.log(`failed to connect to ${relay.url}`)
    })

    await relay.connect;

    if (message.trim().length > 0) {
      let unpublishedEvent = {
        id: 'null',
        pubkey: getStoredPubkey() as string,
        created_at: Math.round(Date.now() / 1000),
        kind: 1,
        tags: [['e', 'ca18c387dc0e79239c74962ae883944d846a8866b17e90d6899dab6a6469f8e9']],
        content: message,
        sig: 'null'
      }

      unpublishedEvent.id = getEventHash(unpublishedEvent);
      if (window.nostr) {
      unpublishedEvent.sig = (await window.nostr.signEvent(unpublishedEvent)).sig;
      }
      let ok = validateEvent(unpublishedEvent)
      let veryOk = verifySignature(unpublishedEvent)

      console.log(ok);
      console.log(veryOk);

      let pub =  pool.publish(relays, unpublishedEvent);
      pub.on('ok', () => {
        console.log(`${relay.url} has accepted our event`)
      })
      pub.on('failed', (reason: string) => {
        console.log(`failed to publish to ${relay.url}: ${reason}`)
      })
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
          // onKeyDown={onEnter}
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
