"use client";

import React from "react";
import { useChatContext } from "./chat-context";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  MessageSquarePlus,
  MessageSquare,
  Archive,
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
    archiveChat,
    deleteChat,
  } = useChatContext();

  const handleNewChat = async () => {
    await createNewChat();
  };

  const handleArchive = async (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Archive this chat?")) {
      await archiveChat(chatId);
    }
  };

  const handleDelete = async (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Delete this chat permanently?")) {
      await deleteChat(chatId);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background border-r">
      <div className="p-3">
        <Button
          onClick={handleNewChat}
          className="w-full justify-start gap-2 h-11"
          variant="outline"
          disabled={loading}
        >
          <MessageSquarePlus className="h-4 w-4" />
          New chat
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="px-2 pb-2">
          {loading && chats.length === 0 ? (
            // Loading skeletons
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="px-3 py-3 mb-1 rounded-lg">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))
          ) : chats.length === 0 ? (
            <div className="text-center py-16 px-4">
              <MessageSquare className="mx-auto h-10 w-10 text-muted-foreground/50 mb-3" />
              <p className="text-sm text-muted-foreground">
                No conversations yet
              </p>
            </div>
          ) : (
            chats.map((chat) => (
              <div
                key={chat.id}
                className={cn(
                  "group relative px-3 py-3 mb-1 rounded-lg cursor-pointer transition-all hover:bg-muted/50",
                  currentChat?.id === chat.id && "bg-muted"
                )}
                onClick={() => selectChat(chat.id)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <MessageSquare className="h-3.5 w-3.5 shrink-0" />
                      <h3
                        className="font-medium text-sm truncate"
                        title={chat.title}
                      >
                        {chat.title.length > 20
                          ? `${chat.title.substring(0, 20)}...`
                          : chat.title}
                      </h3>
                    </div>
                    <p className="text-xs text-muted-foreground ml-5">
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
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={(e) => handleArchive(chat.id, e)}
                      >
                        <Archive className="mr-2 h-4 w-4" />
                        Archive
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => handleDelete(chat.id, e)}
                        className="text-destructive"
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
