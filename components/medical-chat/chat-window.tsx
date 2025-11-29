"use client";

import React, { useState, useRef, useEffect } from "react";
import { useChatContext } from "./chat-context";
import { MessageBubble } from "./message-bubble";
import { VoiceRecorder } from "./voice-recorder";
import { FileUpload } from "./file-upload";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Send,
  Bot,
  AlertCircle,
  X,
  FileText,
  Image as ImageIcon,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

export const ChatWindow: React.FC = () => {
  const { currentChat, loading, sending, sendMessage, sendVoice } =
    useChatContext();
  const [message, setMessage] = useState("");
  const [waitingForResponse, setWaitingForResponse] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [currentChat?.messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !currentChat || sending || waitingForResponse)
      return;

    const messageText = message.trim();
    const filesToSend =
      selectedFiles.length > 0 ? [...selectedFiles] : undefined;

    setMessage("");
    setSelectedFiles([]);
    setWaitingForResponse(true);

    try {
      await sendMessage(currentChat.id, messageText, filesToSend);
    } catch (error) {
      // Error is already handled in context
      setMessage(messageText); // Restore message on error
      if (filesToSend) setSelectedFiles(filesToSend); // Restore files on error
    } finally {
      setWaitingForResponse(false);
    }
  };

  const handleVoiceRecording = async (audioBlob: Blob) => {
    if (!currentChat || sending || waitingForResponse) return;

    setWaitingForResponse(true);
    try {
      await sendVoice(currentChat.id, audioBlob);
    } catch (error) {
      // Error is already handled in context
    } finally {
      setWaitingForResponse(false);
    }
  };

  const handleFileSelect = (file: File) => {
    if (!currentChat) return;

    // Check if we already have 5 files
    if (selectedFiles.length >= 5) {
      toast.error("Maximum 5 files allowed per message");
      return;
    }

    // Add file to selected files
    setSelectedFiles((prev) => [...prev, file]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  if (!currentChat) {
    return (
      <div className="flex items-center justify-center h-full bg-muted/20">
        <div className="text-center space-y-4">
          <Bot className="mx-auto h-16 w-16 text-muted-foreground" />
          <div>
            <h3 className="text-lg font-semibold mb-2">AI Medical Assistant</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              Select a chat or start a new conversation to get medical guidance
              and support.
            </p>
          </div>
          <Alert className="max-w-md mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              This AI assistant provides general health information only and is
              not a replacement for professional medical care.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Messages */}
      <div ref={scrollAreaRef} className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto w-full">
          {loading && currentChat.messages.length === 0 ? (
            <div className="space-y-8 p-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                  <div className="space-y-3 flex-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : currentChat.messages.length === 0 ? (
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center space-y-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <Bot className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">
                    How can I help you today?
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    Ask me anything about your health. I'm here to provide
                    medical guidance and support.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-6">
              {currentChat.messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))}
              {waitingForResponse && (
                <div className="flex gap-4 px-6 py-8 bg-muted/20">
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                    <Bot className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div className="flex-1 space-y-2 pt-1">
                    <div className="flex gap-1">
                      <div className="h-2 w-2 bg-muted-foreground/40 rounded-full animate-bounce" />
                      <div className="h-2 w-2 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <div className="h-2 w-2 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t bg-background shrink-0">
        <div className="max-w-3xl mx-auto w-full p-4">
          {/* Selected Files Display */}
          {selectedFiles.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-2">
              {selectedFiles.map((file, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="pl-2 pr-1 py-1 gap-1.5"
                >
                  {file.type.startsWith("image/") ? (
                    <ImageIcon className="h-3 w-3" />
                  ) : (
                    <FileText className="h-3 w-3" />
                  )}
                  <span className="text-xs max-w-40 truncate">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
          <form onSubmit={handleSendMessage} className="relative">
            <div className="flex items-end gap-2 p-2 rounded-xl border bg-background shadow-sm focus-within:ring-1 focus-within:ring-ring">
              <VoiceRecorder
                onRecordingComplete={handleVoiceRecording}
                disabled={sending || waitingForResponse}
              />
              <FileUpload
                onFileSelect={handleFileSelect}
                disabled={sending || waitingForResponse}
              />
              <Textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Message AI Medical Assistant..."
                disabled={sending || waitingForResponse}
                className="flex-1 min-h-[44px] max-h-[200px] resize-none border-0 bg-transparent px-2 py-2 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
                maxLength={2000}
              />
              <Button
                type="submit"
                size="icon"
                disabled={!message.trim() || sending || waitingForResponse}
                className="h-8 w-8 rounded-lg shrink-0 mb-1"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
          <p className="text-xs text-muted-foreground/60 text-center mt-2">
            AI can make mistakes. This is not a replacement for professional
            medical care.
          </p>
        </div>
      </div>
    </div>
  );
};
