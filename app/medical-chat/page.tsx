'use client';

import React from 'react';
import { ChatProvider } from '@/components/medical-chat/chat-context';
import { ChatList } from '@/components/medical-chat/chat-list';
import { ChatWindow } from '@/components/medical-chat/chat-window';

const MedicalChatContent: React.FC = () => {
  return (
    <div className="flex h-full flex-1 overflow-hidden">
      <div className="hidden md:block w-[280px] shrink-0">
        <ChatList />
      </div>
      <div className="flex-1 min-w-0">
        <ChatWindow />
      </div>
    </div>
  );
};

export default function MedicalChatPage() {
  return (
    <div className="fixed inset-0 top-16 bottom-0">
      <ChatProvider>
        <MedicalChatContent />
      </ChatProvider>
    </div>
  );
}
