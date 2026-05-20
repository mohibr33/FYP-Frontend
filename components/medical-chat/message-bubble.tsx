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
  Sparkles,
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
    if (fileType.startsWith("image/")) return <ImageIcon className="h-4 w-4 text-purple-500" />;
    return <FileText className="h-4 w-4 text-blue-500" />;
  };

  return (
    <div
      className={cn(
        "group px-6 py-6 transition-colors",
        isUser 
          ? "bg-white" 
          : "bg-gradient-to-r from-slate-50 to-slate-100/50"
      )}
    >
      <div className="flex gap-4 max-w-3xl mx-auto">
        <div
          className={cn(
            "h-9 w-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
            isUser 
              ? "bg-gradient-to-br from-teal-500 to-teal-600" 
              : "bg-gradient-to-br from-slate-700 to-black"
          )}
        >
          {isUser ? (
            <User className="h-5 w-5 text-white" />
          ) : (
            <Bot className="h-5 w-5 text-white" />
          )}
        </div>

        <div className="flex-1 space-y-3 pt-0.5 min-w-0">
          {/* Sender Label */}
          <div className="flex items-center gap-2">
            <span className={cn(
              "text-sm font-semibold",
              isUser ? "text-teal-600" : "text-slate-700"
            )}>
              {isUser ? "You" : "AI Assistant"}
            </span>
            <span className="text-xs text-slate-400">
              {format(new Date(message.createdAt), "HH:mm")}
            </span>
          </div>

          <div className="space-y-3">
            {/* Voice message */}
            {message.messageType === "voice" && message.audioUrl && (
              <div className="space-y-2">
                <Badge className="bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-100">
                  <Volume2 className="h-3 w-3 mr-1.5" />
                  Voice Message
                </Badge>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-200 shadow-sm max-w-xs">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handlePlayAudio}
                    className={cn(
                      "h-10 w-10 rounded-full",
                      isPlaying 
                        ? "bg-rose-100 hover:bg-rose-200" 
                        : "bg-emerald-100 hover:bg-emerald-200"
                    )}
                  >
                    {isPlaying ? (
                      <Pause className="h-5 w-5 text-rose-600" />
                    ) : (
                      <Play className="h-5 w-5 text-emerald-600 ml-0.5" />
                    )}
                  </Button>
                  <audio
                    ref={audioRef}
                    src={`${API_BASE_URL}${message.audioUrl}`}
                    onEnded={() => setIsPlaying(false)}
                  />
                  <div className="flex-1">
                    <div className="h-1 bg-slate-200 rounded-full">
                      <div className="h-1 bg-emerald-500 rounded-full w-0" />
                    </div>
                  </div>
                  {message.audioDuration && (
                    <span className="text-xs font-medium text-slate-500 tabular-nums">
                      {Math.floor(message.audioDuration / 60)}:
                      {String(message.audioDuration % 60).padStart(2, "0")}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Message content */}
            {isUser ? (
              <div className="prose prose-sm max-w-none">
                <p className="whitespace-pre-wrap break-words leading-7 text-slate-700">
                  {message.content}
                </p>
              </div>
            ) : (
              <div className="prose prose-sm max-w-none prose-p:leading-7 prose-p:text-slate-700 prose-strong:text-slate-800 prose-pre:bg-black prose-pre:text-slate-100 prose-pre:border-0 prose-pre:rounded-xl prose-code:before:content-none prose-code:after:content-none prose-code:bg-slate-200 prose-code:text-slate-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-sm prose-headings:text-slate-800 prose-headings:mt-4 prose-headings:mb-2 prose-ul:my-2 prose-ol:my-2 prose-li:my-1 prose-li:text-slate-700 prose-ol:text-slate-700">
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
                    className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-white shadow-sm max-w-sm hover:shadow-md transition-shadow"
                  >
                    <div className={cn(
                      "h-10 w-10 rounded-lg flex items-center justify-center",
                      attachment.fileType.startsWith("image/") 
                        ? "bg-purple-100" 
                        : "bg-blue-100"
                    )}>
                      {getFileIcon(attachment.fileType)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-700 truncate">
                        {attachment.fileName}
                      </p>
                      <p className="text-xs text-slate-400">
                        {(attachment.fileSize / 1024).toFixed(1)} KB
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 shrink-0 rounded-lg hover:bg-emerald-100"
                      asChild
                    >
                      <a
                        href={`${API_BASE_URL}${attachment.fileUrl}`}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Download className="h-4 w-4 text-emerald-600" />
                      </a>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Token count for AI messages */}
          {!isUser && message.tokens && (
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Sparkles className="h-3 w-3" />
              <span>{message.tokens} tokens</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
