"use client";

import React from "react";
import { useChatContext } from "./chat-context";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  MessageSquarePlus,
  MessageSquare,
  Trash2,
  MoreVertical,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

export const ChatList: React.FC = () => {
  const {
    chats,
    currentChat,
    loading,
    createNewChat,
    selectChat,
    deleteChat,
  } = useChatContext();

  const handleNewChat = async () => {
    await createNewChat();
  };

  const handleDelete = async (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Delete this chat permanently?")) {
      await deleteChat(chatId);
    }
  };

  return (
    <div className="flex flex-col h-full bg-black">
      {/* Dark Header */}
      <div className="bg-black p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 bg-slate-700 rounded-full flex items-center justify-center">
            <MessageSquare className="h-4 w-4 text-teal-400" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">Medical Chat</h2>
            <p className="text-xs text-slate-400">AI Health Assistant</p>
          </div>
        </div>
        <Button
          onClick={handleNewChat}
          className="w-full justify-start gap-2 h-10 bg-slate-700 text-white hover:bg-slate-600 border border-slate-600"
          disabled={loading}
        >
          <MessageSquarePlus className="h-4 w-4 text-teal-400" />
          New chat
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="px-2 py-2">
          {loading && chats.length === 0 ? (
            // Loading skeletons
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="px-3 py-3 mb-1 rounded-lg">
                <Skeleton className="h-4 w-3/4 mb-2 bg-slate-700" />
                <Skeleton className="h-3 w-1/2 bg-slate-700" />
              </div>
            ))
          ) : chats.length === 0 ? (
            <div className="text-center py-16 px-4">
              <MessageSquare className="mx-auto h-10 w-10 text-slate-600 mb-3" />
              <p className="text-sm text-slate-500">
                No conversations yet
              </p>
            </div>
          ) : (
            chats.map((chat) => (
              <div
                key={chat.id}
                className={cn(
                  "group relative px-3 py-3 mb-1 rounded-lg cursor-pointer transition-all",
                  "hover:bg-black hover:shadow-md",
                  currentChat?.id === chat.id 
                    ? "bg-black border-l-2 border-teal-500" 
                    : "border-l-2 border-transparent"
                )}
                onClick={() => selectChat(chat.id)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <MessageSquare className={cn(
                        "h-3.5 w-3.5 shrink-0 transition-colors",
                        currentChat?.id === chat.id ? "text-teal-400" : "text-slate-500"
                      )} />
                      <h3
                        className={cn(
                          "font-medium text-sm truncate transition-colors",
                          currentChat?.id === chat.id ? "text-white" : "text-slate-300"
                        )}
                        title={chat.title}
                      >
                        {chat.title.length > 20
                          ? `${chat.title.substring(0, 20)}...`
                          : chat.title}
                      </h3>
                    </div>
                    <p className={cn(
                      "text-xs ml-5 transition-colors",
                      currentChat?.id === chat.id ? "text-slate-400" : "text-slate-500"
                    )}>
                      {formatDistanceToNow(new Date(chat.updatedAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger
                      asChild
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-white hover:bg-slate-700"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-black border-slate-700">
                      <DropdownMenuItem
                        onClick={(e) => handleDelete(chat.id, e)}
                        className="text-red-400 hover:text-red-300 hover:bg-slate-700 focus:bg-slate-700 focus:text-red-300"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
