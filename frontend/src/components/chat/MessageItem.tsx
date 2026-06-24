import { cn, formatMessageTime } from "@/lib/utils";
import type { Conversation, Message, Participant } from "@/types/chat";
import UserAvatar from "./UserAvatar";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";

interface MessageItemProps {
  message: Message;
  index: number;
  messages: Message[];
  selectedConvo: Conversation;
  lastMessageStatus: "delivered" | "seen";
}

const MessageItem = ({
  message,
  index,
  messages,
  selectedConvo,
  lastMessageStatus,
}: MessageItemProps) => {
  const prev = index + 1 < messages.length ? messages[index + 1] : undefined;

  const isShowTime =
    index === 0 ||
    new Date(message.createdAt).getTime() -
      new Date(prev?.createdAt || 0).getTime() >
      300000; // 5 phút

  const isGroupBreak = isShowTime || message.senderId !== prev?.senderId;

  const participant = selectedConvo.participants.find(
    (p: Participant) => p._id.toString() === message.senderId.toString()
  );

  return (
    <>
      {/* time */}
      {isShowTime && (
        <span className="flex justify-center text-xs text-muted-foreground px-1">
          {formatMessageTime(new Date(message.createdAt))}
        </span>
      )}

      <div
        className={cn(
          "flex gap-2 message-bounce mt-1",
          message.isOwn ? "justify-end" : "justify-start"
        )}
      >
        {/* avatar */}
        {!message.isOwn && (
          <div className="w-8">
            {isGroupBreak && (
              <UserAvatar
                type="chat"
                name={participant?.displayName ?? "Moji"}
                avatarUrl={participant?.avatarUrl ?? undefined}
              />
            )}
          </div>
        )}

        {/* tin nhắn */}
        <div
          className={cn(
            "max-w-[75%] lg:max-w-md space-y-0.5 flex flex-col",
            message.isOwn ? "items-end" : "items-start"
          )}
        >
          <Card
            className={cn(
              "p-3 shadow-sm transition-all duration-200",
              message.isOwn
                ? "chat-bubble-sent border-0 text-white rounded-2xl rounded-tr-none"
                : "chat-bubble-received rounded-2xl rounded-tl-none"
            )}
          >
            <p className="text-sm leading-relaxed break-words">{message.content}</p>
          </Card>

          {/* time & status */}
          <div
            className={cn(
              "flex flex-col gap-0.5 mt-0.5",
              message.isOwn ? "items-end mr-1" : "items-start ml-1"
            )}
          >
            <span className="text-[10px] text-muted-foreground/70 font-medium tracking-tight">
              {formatMessageTime(new Date(message.createdAt))}
            </span>

            {message.isOwn && message._id === selectedConvo.lastMessage?._id && (
              <Badge
                variant="outline"
                className={cn(
                  "text-[10px] px-1.5 py-0 h-4 border-0 font-semibold",
                  lastMessageStatus === "seen"
                    ? "bg-primary/10 text-primary"
                    : "bg-muted/50 text-muted-foreground"
                )}
              >
                {lastMessageStatus === "seen" ? "Đã xem" : "Đã chuyển"}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MessageItem;