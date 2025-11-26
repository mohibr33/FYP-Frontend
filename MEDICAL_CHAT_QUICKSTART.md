# AI Medical Chat - Quick Start Guide

## 🚀 Getting Started

### Prerequisites
- Backend API running at `https://digitalhealth.apiv1.wyvt.com`
- User must be authenticated (JWT token in localStorage)
- HTTPS required for voice recording feature

### Installation
No additional packages needed - all dependencies already installed:
- ✅ `axios` - HTTP client
- ✅ `date-fns` - Date formatting
- ✅ `sonner` - Toast notifications
- ✅ `lucide-react` - Icons

### Usage

1. **Start your development server:**
   ```bash
   pnpm dev
   ```

2. **Login to your account** at `/auth/login`

3. **Navigate to AI Chat** at `/medical-chat` or click "AI Chat" in the navbar

4. **Start chatting!**

## 💬 How to Use Features

### Text Messages
1. Type your message in the input field
2. Press `Enter` or click the Send button
3. Use `Shift + Enter` for new lines
4. Max 2000 characters

### Voice Messages
1. Click the microphone icon 🎤
2. Allow browser microphone access (if prompted)
3. Speak your message
4. Click the stop button ⏹️
5. Message is automatically transcribed and sent

### File Attachments
1. Send a text message first
2. Click the paperclip icon 📎
3. Select a file (max 10MB)
4. Supported: JPEG, PNG, PDF, DOC, DOCX, TXT
5. File is attached to your last message

### Chat Management
- **New Chat**: Click "New Chat" button
- **Select Chat**: Click on any chat in the sidebar
- **Archive**: Click ⋮ menu → Archive
- **Delete**: Click ⋮ menu → Delete (permanent!)

## 📱 Interface Overview

```
┌─────────────────────────────────────────┐
│  AI Medical Chat                        │
│  Get instant medical guidance...        │
├──────────┬──────────────────────────────┤
│          │  ┌─ AI Medical Assistant ─┐ │
│  New     │  │                         │ │
│  Chat    │  │  Messages appear here  │ │
│  ────    │  │                         │ │
│          │  │  • User (right, blue)  │ │
│  Chat 1  │  │  • AI (left, gray)     │ │
│  Chat 2  │  │                         │ │
│  Chat 3  │  └─────────────────────────┘ │
│          │  ┌─────────────────────────┐ │
│          │  │ 🎤 📎 [Type...] [Send] │ │
│          │  └─────────────────────────┘ │
└──────────┴──────────────────────────────┘
```

## 🎯 Example Workflows

### Medical Question Workflow
```
1. Click "New Chat"
2. Type: "I have a headache for 3 days"
3. AI responds with possible causes
4. Continue conversation
5. AI provides recommendations
```

### Voice Message Workflow
```
1. Select existing chat or create new
2. Click microphone icon
3. Say: "What should I do for fever?"
4. Stop recording
5. AI receives transcribed text
6. AI responds with advice
```

### Upload Medical Report Workflow
```
1. Send message: "I have my blood test results"
2. AI responds
3. Click paperclip icon
4. Select your PDF report
5. File uploads to your message
6. Continue discussing results
```

## ⚡ Keyboard Shortcuts

| Key Combination | Action |
|----------------|--------|
| `Enter` | Send message |
| `Shift + Enter` | New line |
| `Esc` | Clear input (if empty) |

## 🔐 Important Notes

### Medical Disclaimer
- ⚠️ This is an AI assistant, NOT a doctor
- ⚠️ Not a replacement for professional medical care
- ⚠️ For emergencies, call 1122 (Pakistan) or local emergency services
- ⚠️ Always consult a real doctor for serious concerns

### Privacy
- All chats are private to your account
- Messages stored securely on server
- Only you can access your chat history

### Rate Limits
- Messages: 60 per minute
- File uploads: 20 per minute
- Chat creation: 10 per minute

## 🐛 Common Issues & Solutions

### "Microphone access denied"
**Solution:** 
1. Click the lock icon in browser address bar
2. Allow microphone access
3. Refresh the page

### "File too large"
**Solution:**
- Max file size is 10MB
- Compress large PDFs/images
- Split into multiple files

### "Message not sending"
**Solution:**
1. Check internet connection
2. Verify you're logged in
3. Check character limit (2000 max)
4. Refresh page if needed

### Voice recording only works on HTTPS
**Solution:**
- Development: Use `https://localhost:3000`
- Production: Deploy with SSL certificate

## 📊 Features Summary

| Feature | Status | Notes |
|---------|--------|-------|
| Text Chat | ✅ | Up to 2000 characters |
| Voice Messages | ✅ | Requires HTTPS |
| File Attachments | ✅ | Max 10MB |
| Chat History | ✅ | Unlimited storage |
| Archive Chats | ✅ | Hide from main view |
| Delete Chats | ✅ | Permanent deletion |
| Mobile Support | ✅ | Fully responsive |
| Dark Mode | ✅ | Auto theme support |

## 🎨 Customization

### Change Theme Colors
Edit `app/globals.css` or use the theme provider

### Modify Character Limit
Edit `chat-window.tsx`:
```tsx
maxLength={2000}  // Change this value
```

### Change File Size Limit
Edit `file-upload.tsx`:
```tsx
maxSizeMB={10}  // Change this value
```

## 📚 API Endpoints Used

- `POST /api/medical-chat` - Create chat
- `GET /api/medical-chat` - Get all chats
- `GET /api/medical-chat/:id` - Get specific chat
- `POST /api/medical-chat/:id/messages` - Send text
- `POST /api/medical-chat/:id/voice` - Send voice
- `POST /api/medical-chat/:id/messages/:id/attachments` - Upload file
- `PATCH /api/medical-chat/:id/status` - Archive/unarchive
- `DELETE /api/medical-chat/:id` - Delete chat

## 🎓 Tips for Best Experience

1. **Be specific** - Provide detailed symptoms
2. **Include duration** - "3 days", "since morning"
3. **Mention severity** - "mild", "moderate", "severe"
4. **Share context** - Age, existing conditions, medications
5. **Upload documents** - Lab results, prescriptions, images

## 🌐 Browser Compatibility

| Browser | Support | Voice | Files |
|---------|---------|-------|-------|
| Chrome | ✅ Full | ✅ | ✅ |
| Firefox | ✅ Full | ✅ | ✅ |
| Safari | ✅ Full | ✅ | ✅ |
| Edge | ✅ Full | ✅ | ✅ |
| Mobile Safari | ✅ Full | ✅ | ✅ |
| Mobile Chrome | ✅ Full | ✅ | ✅ |

## 💡 Pro Tips

1. Use voice messages for complex descriptions
2. Upload images for visible symptoms
3. Archive old chats to keep sidebar clean
4. Start new chat for different health topics
5. Review chat history before doctor appointments

---

## Need Help?

- 📖 Full documentation: `MEDICAL_CHAT_IMPLEMENTATION.md`
- 🔧 API reference: `AI_CHAT_API.md`
- 📝 Summary: `MEDICAL_CHAT_SUMMARY.md`

**Happy chatting! 🎉**
