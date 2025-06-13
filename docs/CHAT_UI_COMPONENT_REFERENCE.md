# Chat UI Component & Element Reference

A hierarchical map of all components and UI elements associated with the Chat feature. Use these **canonical reference names** when discussing or searching for UI elements.

> **Numbering key**
> * **1** – Top-level page/component
> * **1.1** – Child element/component
> * **1.1.1** – Nested child, etc.

---

## 1 `ChatPage` *(apps/web/src/components/ChatPage.tsx)*

| Ref ID | Canonical Name | Description |
|--------|----------------|-------------|
| **1** | ChatPage.Root | Root wrapper `View` containing entire `/chat` route layout. |
| **1.1** | ChatPage.HeaderBar | Sticky top navigation bar. |
| **1.1.1** | ChatPage.Header.HistoryToggleButton | "☰" hamburger button that toggles the History pane. |
| **1.1.2** | ChatPage.Header.AppTitleText | Title text "Frontier.Family". |
| **1.1.3** | ChatPage.Header.ProfileMenuButton | "👤" button that toggles the Profile menu. |
| **1.2** | ChatPage.MainContentArea | Flex column containing scrollable chat area. |
| **1.2.1** | ChatPage.ChatScrollView | `ScrollView` that holds chat dialogue. |
| **1.2.1.1** | ChatInterface.Component | Renders chat dialogue & composer. |
| **1.3** | ChatPage.OverlayComponents | Absolute-positioned overlays rendered when active. |
| **1.3.1** | ChatHistoryPane.Component | Slide-in pane from left (history sessions). |
| **1.3.2** | ProfileMenu.Component | Slide-in pane from right (user profile). |

---

## 2 `ChatHistoryPane` *(apps/web/src/components/chat/ChatHistoryPane.tsx)*

| Ref ID | Canonical Name | Description |
|--------|----------------|-------------|
| **2** | ChatHistoryPane.Root | Absolute-positioned wrapper `View`. |
| **2.1** | ChatHistoryPane.Overlay | Semi-transparent backdrop. |
| **2.2** | ChatHistoryPane.Sidebar | White sidebar container (width = 300). |
| **2.2.1** | ChatHistoryPane.Sidebar.Header | Header row inside sidebar. |
| **2.2.1.1** | ChatHistoryPane.CloseButton | "×" button to close the pane. |
| **2.2.1.2** | ChatHistoryPane.TitleText | "History" title. |
| **2.2.2** | ChatHistoryPane.SessionList | `View` that will list chat sessions. |
| **2.2.2.1** | ChatHistoryPane.SessionListItem | Individual session item (static for now). |
| **2.2.3** | ChatHistoryPane.NewChatButton | Button to create a new chat session. |

---

## 3 `ChatInterface` *(apps/web/src/components/chat/ChatInterface.tsx)*

| Ref ID | Canonical Name | Description |
|--------|----------------|-------------|
| **3** | ChatInterface.Root | Wrapper `View` for chat dialogue & composer with message state management. |
| **3.1** | MessageList.Component | Lists chat messages with auto-scroll functionality. |
| **3.1.1** | MessageList.ScrollView | `ScrollView` with auto-scroll to bottom on new messages. |
| **3.1.2** | MessageList.MessageItem | Individual message components rendered from state. |
| **3.2** | MessageComposer.Component | Input field & send button with message handling. |
| **3.2.1** | MessageComposer.InputField | Expanding `TextInput` with Enter key send functionality. |
| **3.2.2** | MessageComposer.SendButton | Send button with dynamic state (enabled/disabled). |

---

## 4 `MessageList` *(apps/web/src/components/chat/MessageList.tsx)*

| Ref ID | Canonical Name | Description |
|--------|----------------|-------------|
| **4** | MessageList.Root | `ScrollView` container for all messages. |
| **4.1** | MessageList.ScrollView | Auto-scrolling `ScrollView` with ref for programmatic control. |
| **4.2** | MessageList.MessageItem | Individual `Message` components mapped from messages array. |

---

## 5 `Message` *(apps/web/src/components/chat/Message.tsx)*

| Ref ID | Canonical Name | Description |
|--------|----------------|-------------|
| **5** | Message.Root | Wrapper `View` with conditional alignment (user: right, bot: left). |
| **5.1** | Message.UserBubble | Blue speech bubble for user messages (right-aligned). |
| **5.2** | Message.BotBubble | Gray bubble for bot messages with Markdown rendering (left-aligned). |

---

## 6 `MessageComposer` *(apps/web/src/components/chat/MessageComposer.tsx)*

| Ref ID | Canonical Name | Description |
|--------|----------------|-------------|
| **6** | MessageComposer.Root | Container `View` with input and send button. |
| **6.1** | MessageComposer.InputField | Multi-line `TextInput` with auto-expanding height (max 3 lines). |
| **6.2** | MessageComposer.SendButton | Circular send button with dynamic styling based on input state. |

---

## 7 Message State Management & Logic

| Feature | Implementation | Description |
|---------|----------------|-------------|
| **Message State** | `ChatInterface.tsx` | `useState<MessageType[]>` manages all messages with id, author, text, timestamp. |
| **Send Handler** | `ChatInterface.handleSendMessage` | Adds user message to state and triggers bot response. |
| **Streaming Response** | `ChatInterface.simulateStreamingResponse` | Character-by-character streaming simulation using `setInterval`. |
| **Auto-scroll** | `MessageList.tsx` | `useRef` + `useEffect` automatically scrolls to bottom on new messages. |
| **Keyboard Shortcuts** | `MessageComposer.tsx` | Enter key sends message via `onSubmitEditing`. |

---

### How to reference elements in conversation

Use the **Canonical Name** in back-ticks. Example: *"Add margin-bottom to `Message.BotBubble`"*.

---

### TODO markers inserted in code

Each file now contains inline comments (beginning with `// Ref:`) indicating the canonical reference name for key UI elements. This enables quick searching via `grep "Ref:"`.

---

### Message Flow Architecture

1. **User Input**: `MessageComposer.InputField` captures text input
2. **Send Trigger**: Enter key or `MessageComposer.SendButton` calls `onSendMessage`
3. **State Update**: `ChatInterface.handleSendMessage` adds user message to state
4. **Bot Response**: `simulateStreamingResponse` creates streaming bot reply
5. **Auto-scroll**: `MessageList` automatically scrolls to show new messages
6. **UI Update**: All components re-render with new message state
