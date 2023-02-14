import { useCallback, useMemo, useState, type KeyboardEvent } from "react";
import { Button, Icons, Textarea } from "../ui";

import { cn } from "@/styles/utils";
import { useChat } from "@livekit/components-react";

type Props = {
  viewerName: string;
};

export default function Chat({ viewerName }: Props) {
  const { chatMessages: messages, send } = useChat();

  const reverseMessages = useMemo(
    () => messages.sort((a, b) => b.timestamp - a.timestamp),
    [messages]
  );

  const [message, setMessage] = useState("");

  const onEnter = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (message.trim().length > 0) {
          send(message).catch((err) => console.error(err));
          setMessage("");
        }
      }
    },
    [message, send]
  );

  const onSend = useCallback(() => {
    if (message.trim().length > 0) {
      send(message).catch((err) => console.error(err));
      setMessage("");
    }
  }, [message, send]);

  return (
    <>
      <div className="flex min-h-0 flex-1 flex-col-reverse overflow-y-auto">
        {reverseMessages.map((message) => (
          <div key={message.timestamp} className="flex items-center gap-2 p-2">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "text-xs font-semibold",
                    viewerName === message.from?.identity && "text-violet-500"
                  )}
                >
                  {message.from?.identity}
                  {viewerName === message.from?.identity && " (you)"}
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </div>
              </div>
              <div className="text-sm">{message.message}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="grid w-full gap-2">
        <Textarea
          value={message}
          className="bg-white dark:bg-slate-900"
          onChange={(e) => {
            setMessage(e.target.value);
          }}
          onKeyDown={onEnter}
          placeholder="Type a message..."
        />
        <Button disabled={message.trim().length === 0} onClick={onSend}>
          <div className="flex items-center gap-2">
            <Icons.send className="h-4 w-4" />
            Send
          </div>
        </Button>
      </div>
    </>
  );
}
