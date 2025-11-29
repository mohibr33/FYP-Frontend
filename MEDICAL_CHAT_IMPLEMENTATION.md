# AI Medical Chat Module - Implementation Guide

## Overview

The AI Medical Chat module is a complete implementation of the Medical Chat API with support for:

- ✅ Text messaging with AI assistant
- ✅ Voice messages with automatic transcription
- ✅ File attachments (images, PDFs, documents)
- ✅ Real-time chat interface
- ✅ Chat history and management
- ✅ Archive and delete functionality

## Structure

```
lib/
├── api/
│   └── medical-chat.ts          # API integration functions
└── types.ts                      # TypeScript definitions

components/
└── medical-chat/
    ├── chat-context.tsx          # State management & API calls
    ├── chat-list.tsx             # Sidebar with all chats
    ├── chat-window.tsx           # Main chat interface
    ├── message-bubble.tsx        # Individual message component
    ├── voice-recorder.tsx        # Web Audio API recording
    ├── file-upload.tsx           # File attachment handler
    └── index.ts                  # Exports

app/
└── medical-chat/
    └── page.tsx                  # Main page route
```

## Features

### 1. **Text Chat**

- Send and receive text messages up to 2000 characters
- Real-time AI responses powered by GPT-4
- Message history with timestamps
- Token usage tracking

### 2. **Voice Messages**

- Record audio using Web Audio API
- Automatic transcription on server
- Audio playback controls
- Recording timer display
- Supports: WebM, MP3, WAV, OGG, M4A

### 3. **File Attachments**

- Upload images, PDFs, documents
- Max file size: 10MB
- Supported formats: JPEG, PNG, PDF, DOC, DOCX, TXT
- Download attached files
- File preview in messages

### 4. **Chat Management**

- Create new chat sessions
- View all active chats
- Archive chats
- Delete chats permanently
- Auto-generated chat titles
- Last message preview
- Relative timestamps

### 5. **UI/UX Features**

- Responsive design (mobile + desktop)
- Split-screen layout on desktop
- Auto-scroll to latest message
- Loading states and skeletons
- Error handling with toast notifications
- Typing indicators
- Character counter
- Keyboard shortcuts (Enter to send, Shift+Enter for new line)

## API Integration

All API endpoints are integrated in `lib/api/medical-chat.ts`:

```typescript
-createChat() - // Create new chat
  getAllChats() - // Get all chats
  getChatById() - // Get specific chat
  sendTextMessage() - // Send text message
  sendVoiceMessage() - // Send voice recording
  uploadAttachment() - // Upload file to message
  updateChatStatus() - // Archive/unarchive
  deleteChat() - // Delete permanently
  getChatStats(); // Get usage statistics
```

## Context Provider

The `ChatProvider` component wraps the entire chat module and provides:

- Global state management
- API call handlers
- Error handling
- Loading states
- Toast notifications

## Usage

### Basic Implementation

```tsx
import { ChatProvider } from "@/components/medical-chat";

export default function MedicalChatPage() {
  return (
    <ChatProvider>
      <YourChatUI />
    </ChatProvider>
  );
}
```

### Using Context

```tsx
import { useChatContext } from "@/components/medical-chat";

function YourComponent() {
  const {
    chats,
    currentChat,
    loading,
    sending,
    sendMessage,
    sendVoice,
    uploadFile,
  } = useChatContext();

  // Use the context...
}
```

## Configuration

### API Base URL

Update in `lib/api-config.ts`:

```typescript
export const API_BASE_URL = "https://digitalhealth.apiv1.wyvt.com";
```

### Authentication

The API client automatically includes JWT tokens from `localStorage`:

```typescript
const token = localStorage.getItem("authToken");
```

## Key Components

### ChatList

- Displays all active chats
- Shows last message preview
- Archive/delete options
- New chat button
- Responsive sidebar

### ChatWindow

- Message display area
- Text input with character limit
- Voice recorder button
- File upload button
- Send button
- Loading states

### MessageBubble

- User vs Assistant styling
- Voice message playback
- File attachment display
- Download buttons
- Token usage display

### VoiceRecorder

- Start/stop recording
- Recording timer
- Browser permission handling
- WebM audio format
- Visual recording indicator

### FileUpload

- File size validation (10MB max)
- File type validation
- Hidden file input
- Error notifications

## Permissions Required

### Browser Permissions

- **Microphone**: Required for voice messages
- **File System**: Required for file uploads

## Error Handling

All errors are handled gracefully with:

- Toast notifications (using Sonner)
- Console error logging
- User-friendly error messages
- Fallback UI states

## Styling

Built with:

- Tailwind CSS
- Radix UI components
- Custom animations
- Dark mode support
- Responsive breakpoints

## Security

- JWT authentication on all endpoints
- User can only access their own chats
- File type validation
- File size limits
- XSS protection

## Performance

- Lazy loading of chat messages
- Optimized re-renders with React.memo
- Debounced API calls
- Pagination support (50 chats max)
- Auto-scroll optimization

## Accessibility

- Keyboard navigation support
- ARIA labels
- Semantic HTML
- Focus management
- Screen reader friendly

## Future Enhancements

Potential additions:

- [ ] Real-time chat with WebSockets
- [ ] Message reactions
- [ ] Export chat history
- [ ] Search within chats
- [ ] Image preview modal
- [ ] Audio waveform visualization
- [ ] Message editing
- [ ] Message deletion
- [ ] Read receipts
- [ ] Push notifications

## Troubleshooting

### Voice Recording Not Working

- Check browser permissions
- Ensure HTTPS (required for getUserMedia)
- Check browser compatibility

### File Upload Fails

- Verify file size < 10MB
- Check file type is supported
- Ensure network connection

### Messages Not Sending

- Check authentication token
- Verify API connection
- Check network tab for errors

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Dependencies

```json
{
  "date-fns": "4.1.0", // Date formatting
  "axios": "^1.13.2", // HTTP client
  "sonner": "^1.7.4", // Toast notifications
  "lucide-react": "^0.454.0" // Icons
}
```

## Navigation

The AI Chat link is added to the navbar for authenticated users:

- Desktop: Top navigation bar
- Mobile: Hamburger menu

---

**Created:** November 26, 2025  
**Status:** ✅ Complete and ready to use
