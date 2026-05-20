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
  MessageSquare,
  Shield,
  Sparkles,
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
      <div className="flex items-center justify-center h-full bg-slate-50">
        <div className="text-center space-y-6 max-w-lg px-6">
          {/* Animated Icon */}
          <div className="relative mx-auto w-24 h-24">
            <div className="absolute inset-0 bg-teal-500/20 rounded-full animate-ping" />
            <div className="relative w-24 h-24 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg">
              <Bot className="h-12 w-12 text-white" />
            </div>
          </div>
          
          {/* Title & Description */}
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-slate-800">AI Medical Assistant</h3>
            <p className="text-slate-600">
              Select a chat or start a new conversation to get medical guidance and support.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <MessageSquare className="h-5 w-5 text-blue-600" />
              </div>
              <p className="text-xs font-medium text-slate-700">Chat Anytime</p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Shield className="h-5 w-5 text-purple-600" />
              </div>
              <p className="text-xs font-medium text-slate-700">Private & Secure</p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Sparkles className="h-5 w-5 text-emerald-600" />
              </div>
              <p className="text-xs font-medium text-slate-700">AI Powered</p>
            </div>
          </div>

          {/* Disclaimer */}
          <Alert className="bg-amber-50 border-amber-200 text-left">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-xs text-amber-800">
              This AI assistant provides general health information only and is
              not a replacement for professional medical care.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-50">
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
              <div className="text-center space-y-6 max-w-md px-4">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-700 to-black flex items-center justify-center mx-auto shadow-lg">
                  <Bot className="h-10 w-10 text-white" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-slate-800">
                    How can I help you today?
                  </h3>
                  <p className="text-sm text-slate-500">
                    Ask me anything about your health. I'm here to provide
                    medical guidance and support.
                  </p>
                </div>
                
                {/* Suggestion Chips */}
                <div className="flex flex-wrap justify-center gap-2 pt-2">
                  <button 
                    onClick={() => setMessage("What are common cold symptoms?")}
                    className="px-4 py-2 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full transition-colors"
                  >
                    Common cold symptoms
                  </button>
                  <button 
                    onClick={() => setMessage("How to improve sleep quality?")}
                    className="px-4 py-2 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full transition-colors"
                  >
                    Sleep tips
                  </button>
                  <button 
                    onClick={() => setMessage("What foods boost immunity?")}
                    className="px-4 py-2 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full transition-colors"
                  >
                    Immunity boosters
                  </button>
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
<div className="h-8 w-8 rounded-full bg-black flex items-center justify-center shrink-0">
                    <Bot className="h-5 w-5 text-white" />
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
      <div className="border-t bg-white shrink-0">
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
                    <ImageIcon className="h-3 w-3 text-purple-500" />
                  ) : (
                    <FileText className="h-3 w-3 text-blue-500" />
                  )}
                  <span className="text-xs max-w-40 truncate">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3 text-red-500" />
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
                className="h-8 w-8 rounded-lg shrink-0 mb-1 bg-black hover:bg-slate-700"
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
