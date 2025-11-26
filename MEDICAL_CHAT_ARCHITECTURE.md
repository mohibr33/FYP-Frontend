# AI Medical Chat - Component Architecture

## Component Hierarchy

```
MedicalChatPage
  └── ChatProvider (Context)
        ├── State Management
        │     ├── chats: MedicalChat[]
        │     ├── currentChat: MedicalChat | null
        │     ├── loading: boolean
        │     └── sending: boolean
        │
        └── MedicalChatContent
              ├── ChatList
              │     ├── New Chat Button
              │     └── Chat Items
              │           ├── Chat Title
              │           ├── Last Message
              │           ├── Timestamp
              │           └── Actions Menu
              │                 ├── Archive
              │                 └── Delete
              │
              └── ChatWindow
                    ├── Header
                    │     └── AI Assistant Info
                    │
                    ├── Messages Area
                    │     └── MessageBubble (multiple)
                    │           ├── Avatar (User/AI)
                    │           ├── Content
                    │           │     ├── Voice Player (if voice)
                    │           │     ├── Text Content
                    │           │     └── Attachments (if any)
                    │           └── Metadata
                    │                 ├── Timestamp
                    │                 └── Token Count
                    │
                    └── Input Area
                          ├── VoiceRecorder
                          │     ├── Record Button
                          │     └── Timer (when recording)
                          │
                          ├── FileUpload
                          │     └── Upload Button
                          │
                          ├── Text Input
                          │     └── Character Counter
                          │
                          └── Send Button
```

## Data Flow

```
┌─────────────────────────────────────────────────────┐
│                  User Interaction                    │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│              Component Layer                         │
│  (ChatWindow, VoiceRecorder, FileUpload)            │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│              Context Layer                           │
│  (ChatProvider - State Management)                   │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│              API Layer                               │
│  (lib/api/medical-chat.ts)                          │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│              HTTP Client                             │
│  (axios with interceptors)                          │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│              Backend API                             │
│  (Medical Chat API Endpoints)                        │
└─────────────────────────────────────────────────────┘
```

## State Management Flow

```
User Action
    │
    ├─→ Create Chat
    │     └─→ createNewChat()
    │           └─→ POST /api/medical-chat
    │                 └─→ Update chats[], setCurrentChat()
    │
    ├─→ Send Text Message
    │     └─→ sendMessage(chatId, message)
    │           └─→ POST /api/medical-chat/:id/messages
    │                 └─→ Update currentChat.messages[]
    │
    ├─→ Send Voice
    │     └─→ sendVoice(chatId, audioBlob)
    │           └─→ POST /api/medical-chat/:id/voice
    │                 └─→ Update currentChat.messages[]
    │
    ├─→ Upload File
    │     └─→ uploadFile(chatId, messageId, file)
    │           └─→ POST /api/medical-chat/:id/messages/:id/attachments
    │                 └─→ Refresh currentChat
    │
    ├─→ Archive Chat
    │     └─→ archiveChat(chatId)
    │           └─→ PATCH /api/medical-chat/:id/status
    │                 └─→ Remove from chats[], clear currentChat
    │
    └─→ Delete Chat
          └─→ deleteChat(chatId)
                └─→ DELETE /api/medical-chat/:id
                      └─→ Remove from chats[], clear currentChat
```

## Context API Structure

```typescript
ChatContext {
  // State
  chats: MedicalChat[]
  currentChat: MedicalChat | null
  loading: boolean
  sending: boolean

  // Actions
  loadChats: () => Promise<void>
  createNewChat: (firstMessage?) => Promise<MedicalChat | null>
  selectChat: (chatId) => Promise<void>
  sendMessage: (chatId, message) => Promise<void>
  sendVoice: (chatId, audioBlob) => Promise<void>
  uploadFile: (chatId, messageId, file) => Promise<void>
  archiveChat: (chatId) => Promise<void>
  deleteChat: (chatId) => Promise<void>
  refreshCurrentChat: () => Promise<void>
}
```

## Component Communication

```
┌────────────────┐      Select Chat       ┌────────────────┐
│   ChatList     │─────────────────────────▶│  ChatWindow    │
└────────────────┘                         └────────────────┘
        │                                           │
        │           Read/Write State                │
        └──────────────────┬──────────────────────┘
                           │
                           ▼
                  ┌────────────────┐
                  │  ChatContext   │
                  └────────────────┘
                           │
                           ▼
                  ┌────────────────┐
                  │   API Calls    │
                  └────────────────┘
```

## Message Types Flow

### Text Message
```
User types → ChatWindow → sendMessage() → API → AI Response → Update UI
```

### Voice Message
```
User records → VoiceRecorder → Blob → sendVoice() → API 
  → Transcription → AI Response → Update UI
```

### File Attachment
```
User selects file → FileUpload → uploadFile() → API 
  → Store file → Update message → Update UI
```

## Error Handling Flow

```
API Call
    │
    ├─→ Success
    │     └─→ Update State
    │           └─→ Update UI
    │                 └─→ Toast Success (optional)
    │
    └─→ Error
          └─→ Catch in Context
                └─→ Toast Error Message
                      └─→ Restore Previous State (if needed)
                            └─→ Log to Console
```

## Lifecycle Hooks

```typescript
// MedicalChatContent Component
useEffect(() => {
  loadChats(); // Load chats on mount
}, []);

// ChatWindow Component
useEffect(() => {
  // Auto-scroll to bottom on new messages
  scrollToBottom();
}, [currentChat?.messages]);

// VoiceRecorder Component
useEffect(() => {
  // Cleanup media stream on unmount
  return () => {
    stream?.getTracks().forEach(track => track.stop());
  };
}, []);
```

## Type Definitions Relationship

```
MedicalChat
  ├── id: string
  ├── userId: string
  ├── title: string
  ├── status: 'active' | 'archived'
  ├── createdAt: string
  ├── updatedAt: string
  └── messages: ChatMessage[]
        ├── id: string
        ├── chatId: string
        ├── role: 'user' | 'assistant'
        ├── content: string
        ├── messageType: 'text' | 'voice' | 'file'
        ├── audioUrl?: string
        ├── transcription?: string
        ├── tokens?: number
        └── attachments?: ChatAttachment[]
              ├── id: string
              ├── messageId: string
              ├── fileName: string
              ├── fileUrl: string
              ├── fileType: string
              └── fileSize: number
```

## UI Component Dependencies

```
ChatList
  ├── Card (shadcn/ui)
  ├── Button (shadcn/ui)
  ├── ScrollArea (shadcn/ui)
  ├── Skeleton (shadcn/ui)
  ├── DropdownMenu (shadcn/ui)
  └── date-fns (formatDistanceToNow)

ChatWindow
  ├── Textarea (shadcn/ui)
  ├── Button (shadcn/ui)
  ├── ScrollArea (shadcn/ui)
  ├── Card (shadcn/ui)
  ├── Alert (shadcn/ui)
  ├── VoiceRecorder
  ├── FileUpload
  └── MessageBubble

MessageBubble
  ├── Card (shadcn/ui)
  ├── Avatar (shadcn/ui)
  ├── Badge (shadcn/ui)
  ├── Button (shadcn/ui)
  └── date-fns (format)

VoiceRecorder
  ├── Button (shadcn/ui)
  └── Web Audio API

FileUpload
  ├── Button (shadcn/ui)
  └── sonner (toast)
```

## Authentication Flow

```
1. User logs in → JWT token saved to localStorage
                       ↓
2. API client interceptor reads token
                       ↓
3. Token added to Authorization header
                       ↓
4. All API requests authenticated
                       ↓
5. Backend validates token
                       ↓
6. User-specific data returned
```

## Performance Optimizations

```
1. Context Memoization
   - useCallback for all functions
   - Prevents unnecessary re-renders

2. Lazy Loading
   - Messages loaded on chat selection
   - Pagination for chat list (50 limit)

3. Optimistic Updates
   - Add message to UI immediately
   - Rollback on error

4. Auto-scroll Optimization
   - Only scroll on new messages
   - Use ref to access scroll container

5. Component Splitting
   - Separate components for better code-splitting
   - Lazy load heavy components
```

---

## Quick Reference

### Most Important Files
1. `components/medical-chat/chat-context.tsx` - State management
2. `components/medical-chat/chat-window.tsx` - Main UI
3. `lib/api/medical-chat.ts` - API integration
4. `app/medical-chat/page.tsx` - Route entry point

### Key Functions
- `createNewChat()` - Start new conversation
- `sendMessage()` - Send text
- `sendVoice()` - Send audio
- `uploadFile()` - Attach files
- `selectChat()` - Switch conversations

### State Updates
- New chat → `setChats([new, ...prev])`
- New message → `messages: [...prev, user, ai]`
- Archive → `filter(chat.id !== archived)`
- Delete → `filter(chat.id !== deleted)`
