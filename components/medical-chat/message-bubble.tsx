"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { ChatMessage as ChatMessageType } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Bot,
  User,
  Volume2,
  FileText,
  Image as ImageIcon,
  Download,
  Play,
  Pause,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { API_BASE_URL } from "@/lib/api-config";

interface MessageBubbleProps {
  message: ChatMessageType;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === "user";
  const [isPlaying, setIsPlaying] = React.useState(false);
  const audioRef = React.useRef<HTMLAudioElement>(null);

  const handlePlayAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) return <ImageIcon className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
  };

  return (
    <div
      className={cn(
        "group px-6 py-8 transition-colors hover:bg-muted/30",
        !isUser && "bg-muted/20"
      )}
    >
      <div className="flex gap-4 max-w-full">
        <div
          className={cn(
            "h-8 w-8 rounded-full flex items-center justify-center shrink-0",
            isUser ? "bg-muted" : "bg-primary"
          )}
        >
          {isUser ? (
            <User className="h-5 w-5" />
          ) : (
            <Bot className="h-5 w-5 text-primary-foreground" />
          )}
        </div>

        <div className="flex-1 space-y-3 pt-1 min-w-0">
          <div className="space-y-2">
            {/* Voice message */}
            {message.messageType === "voice" && message.audioUrl && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs font-normal">
                    <Volume2 className="h-3 w-3 mr-1" />
                    Voice Message
                  </Badge>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handlePlayAudio}
                    className="h-9 w-9 rounded-full"
                  >
                    {isPlaying ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>
                  <audio
                    ref={audioRef}
                    src={`${API_BASE_URL}${message.audioUrl}`}
                    onEnded={() => setIsPlaying(false)}
                  />
                  {message.audioDuration && (
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {Math.floor(message.audioDuration / 60)}:
                      {String(message.audioDuration % 60).padStart(2, "0")}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Message content */}
            {isUser ? (
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <p className="whitespace-pre-wrap break-words leading-7">
                  {message.content}
                </p>
              </div>
            ) : (
              <div className="prose prose-sm dark:prose-invert max-w-none prose-p:leading-7 prose-pre:bg-muted prose-pre:border prose-code:before:content-none prose-code:after:content-none prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-headings:mt-4 prose-headings:mb-2 prose-ul:my-2 prose-ol:my-2 prose-li:my-0">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {message.content}
                </ReactMarkdown>
              </div>
            )}

            {/* Attachments */}
            {message.attachments && message.attachments.length > 0 && (
              <div className="space-y-2">
                {message.attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="flex items-center gap-3 p-3 rounded-lg border bg-card"
                  >
                    {getFileIcon(attachment.fileType)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {attachment.fileName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {(attachment.fileSize / 1024).toFixed(1)} KB
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0"
                      asChild
                    >
                      <a
                        href={`${API_BASE_URL}${attachment.fileUrl}`}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Download className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground/70">
            <span>{format(new Date(message.createdAt), "HH:mm")}</span>
            {message.tokens && <span>• {message.tokens} tokens</span>}
          </div>
        </div>
      </div>
    </div>
  );
};
