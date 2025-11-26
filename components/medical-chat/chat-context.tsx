'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import type { MedicalChat, ChatMessage } from '@/lib/types';
import * as medicalChatApi from '@/lib/api/medical-chat';
import { toast } from 'sonner';

interface ChatContextType {
  chats: MedicalChat[];
  currentChat: MedicalChat | null;
  loading: boolean;
  sending: boolean;
  loadChats: () => Promise<void>;
  createNewChat: (firstMessage?: string) => Promise<MedicalChat | null>;
  selectChat: (chatId: string) => Promise<void>;
  sendMessage: (chatId: string, message: string, files?: File[]) => Promise<void>;
  sendVoice: (chatId: string, audioBlob: Blob) => Promise<void>;
  archiveChat: (chatId: string) => Promise<void>;
  deleteChat: (chatId: string) => Promise<void>;
  refreshCurrentChat: () => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within ChatProvider');
  }
  return context;
};

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [chats, setChats] = useState<MedicalChat[]>([]);
  const [currentChat, setCurrentChat] = useState<MedicalChat | null>(null);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  const loadChats = useCallback(async () => {
    try {
      setLoading(true);
      const response = await medicalChatApi.getAllChats({
        status: 'active',
        limit: 50,
      });
      setChats(response.data.chats);
    } catch (error: any) {
      console.error('Error loading chats:', error);
      toast.error(error.response?.data?.message || 'Failed to load chats');
    } finally {
      setLoading(false);
    }
  }, []);

  // Load chats on mount
  React.useEffect(() => {
    loadChats();
  }, [loadChats]);

  const createNewChat = useCallback(
    async (firstMessage?: string): Promise<MedicalChat | null> => {
      try {
        setLoading(true);
        const response = await medicalChatApi.createChat(firstMessage);
        const newChat = response.data;
        setChats((prev) => [newChat, ...prev]);
        setCurrentChat(newChat);
        toast.success('New chat created');
        return newChat;
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to create chat');
        console.error('Error creating chat:', error);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const selectChat = useCallback(async (chatId: string) => {
    try {
      setLoading(true);
      const response = await medicalChatApi.getChatById(chatId);
      setCurrentChat(response.data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to load chat');
      console.error('Error loading chat:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshCurrentChat = useCallback(async () => {
    if (!currentChat) return;
    try {
      const response = await medicalChatApi.getChatById(currentChat.id);
      setCurrentChat(response.data);
    } catch (error) {
      console.error('Error refreshing chat:', error);
    }
  }, [currentChat]);

  const sendMessage = useCallback(
    async (chatId: string, message: string, files?: File[]) => {
      try {
        setSending(true);
        
        // Optimistically add user message immediately
        const optimisticUserMessage: ChatMessage = {
          id: `temp-${Date.now()}`,
          chatId,
          role: 'user',
          content: message,
          messageType: files && files.length > 0 ? 'file' : 'text',
          audioUrl: null,
          audioDuration: null,
          transcription: null,
          tokens: null,
          createdAt: new Date().toISOString(),
          attachments: files ? files.map((file, idx) => ({
            id: `temp-att-${idx}`,
            messageId: `temp-${Date.now()}`,
            fileName: file.name,
            fileUrl: '',
            fileType: file.type,
            fileSize: file.size,
            uploadedAt: new Date().toISOString(),
          })) : [],
        };

        // Add optimistic user message to chat
        if (currentChat?.id === chatId) {
          setCurrentChat((prev) => {
            if (!prev) return prev;
            return {
              ...prev,
              messages: [...prev.messages, optimisticUserMessage],
            };
          });
        }

        const response = await medicalChatApi.sendTextMessage(chatId, message, files);

        // Replace optimistic message with real messages from server
        if (currentChat?.id === chatId) {
          setCurrentChat((prev) => {
            if (!prev) return prev;
            // Remove the optimistic message and add real ones
            const messagesWithoutOptimistic = prev.messages.filter(
              (msg) => !msg.id.startsWith('temp-')
            );
            return {
              ...prev,
              messages: [
                ...messagesWithoutOptimistic,
                response.data.userMessage,
                response.data.assistantMessage,
              ],
            };
          });
        }

        // Show success toast for file uploads
        if (files && files.length > 0) {
          toast.success(`Message sent with ${files.length} file(s)`);
        }

        // Update chat list
        await loadChats();
      } catch (error: any) {
        // Remove optimistic message on error
        if (currentChat?.id === chatId) {
          setCurrentChat((prev) => {
            if (!prev) return prev;
            return {
              ...prev,
              messages: prev.messages.filter((msg) => !msg.id.startsWith('temp-')),
            };
          });
        }
        toast.error(error.response?.data?.message || 'Failed to send message');
        throw error;
      } finally {
        setSending(false);
      }
    },
    [currentChat, loadChats]
  );

  const sendVoice = useCallback(
    async (chatId: string, audioBlob: Blob) => {
      try {
        setSending(true);
        
        // Optimistically add voice message placeholder
        const optimisticVoiceMessage: ChatMessage = {
          id: `temp-voice-${Date.now()}`,
          chatId,
          role: 'user',
          content: 'Recording...',
          messageType: 'voice',
          audioUrl: null,
          audioDuration: null,
          transcription: null,
          tokens: null,
          createdAt: new Date().toISOString(),
          attachments: [],
        };

        // Add optimistic voice message to chat
        if (currentChat?.id === chatId) {
          setCurrentChat((prev) => {
            if (!prev) return prev;
            return {
              ...prev,
              messages: [...prev.messages, optimisticVoiceMessage],
            };
          });
        }

        const response = await medicalChatApi.sendVoiceMessage(
          chatId,
          audioBlob
        );

        // Replace optimistic message with real messages from server
        if (currentChat?.id === chatId) {
          setCurrentChat((prev) => {
            if (!prev) return prev;
            // Remove the optimistic message and add real ones
            const messagesWithoutOptimistic = prev.messages.filter(
              (msg) => !msg.id.startsWith('temp-')
            );
            return {
              ...prev,
              messages: [
                ...messagesWithoutOptimistic,
                response.data.userMessage,
                response.data.assistantMessage,
              ],
            };
          });
        }

        toast.success(
          `Voice message sent: "${response.data.transcription.substring(0, 30)}..."`
        );
        await loadChats();
      } catch (error: any) {
        // Remove optimistic message on error
        if (currentChat?.id === chatId) {
          setCurrentChat((prev) => {
            if (!prev) return prev;
            return {
              ...prev,
              messages: prev.messages.filter((msg) => !msg.id.startsWith('temp-')),
            };
          });
        }
        toast.error(
          error.response?.data?.message || 'Failed to send voice message'
        );
        throw error;
      } finally {
        setSending(false);
      }
    },
    [currentChat, loadChats]
  );

  const archiveChat = useCallback(
    async (chatId: string) => {
      try {
        await medicalChatApi.updateChatStatus(chatId, 'archived');
        setChats((prev) => prev.filter((chat) => chat.id !== chatId));
        if (currentChat?.id === chatId) {
          setCurrentChat(null);
        }
        toast.success('Chat archived');
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to archive chat');
      }
    },
    [currentChat]
  );

  const deleteChat = useCallback(
    async (chatId: string) => {
      try {
        await medicalChatApi.deleteChat(chatId);
        setChats((prev) => prev.filter((chat) => chat.id !== chatId));
        if (currentChat?.id === chatId) {
          setCurrentChat(null);
        }
        toast.success('Chat deleted');
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to delete chat');
      }
    },
    [currentChat]
  );

  const value: ChatContextType = {
    chats,
    currentChat,
    loading,
    sending,
    loadChats,
    createNewChat,
    selectChat,
    sendMessage,
    sendVoice,
    archiveChat,
    deleteChat,
    refreshCurrentChat,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
