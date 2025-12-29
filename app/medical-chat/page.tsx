"use client";

import React from "react";
import { ChatProvider } from "@/components/medical-chat/chat-context";
import { ChatList } from "@/components/medical-chat/chat-list";
import { ChatWindow } from "@/components/medical-chat/chat-window";

const MedicalChatContent: React.FC = () => {
  return (
    <div className="flex h-full flex-1 overflow-hidden bg-slate-100">
      <div className="hidden md:block w-[280px] shrink-0 p-2">
        <div className="h-full rounded-xl overflow-hidden">
          <ChatList />
        </div>
      </div>
      <div className="flex-1 min-w-0 p-2 pl-0">
        <div className="h-full rounded-xl overflow-hidden bg-white shadow-sm">
          <ChatWindow />
        </div>
      </div>
    </div>
  );
};

export default function MedicalChatPage() {
  return (
    <div className="h-[calc(100vh-4rem)] overflow-hidden">
      <ChatProvider>
        <MedicalChatContent />
      </ChatProvider>
    </div>
  );
}
