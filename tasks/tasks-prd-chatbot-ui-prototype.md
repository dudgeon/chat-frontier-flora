## Relevant Files

- `tasks/prd-chatbot-ui-prototype.md` -  The main PRD for this Feature
- `apps/web/src/components/ChatPage.tsx` - The main component for the chat route. Will be modified to orchestrate the new UI components.
- `apps/web/src/components/chat/ChatHistoryPane.tsx` - (New) Component for the left-side slide-out pane showing chat history.
- `apps/web/src/components/chat/ChatInterface.tsx` - (New) Component for the central area containing the message dialogue and composer.
- `apps/web/src/components/chat/MessageList.tsx` - (New) Component to display the list of messages in the dialogue.
- `apps/web/src/components/chat/Message.tsx` - (New) Component for rendering a single user or chatbot message.
- `apps/web/src/components/chat/MessageComposer.tsx` - (New) Component for the text input field and send button.
- `apps/web/src/components/ChatPage.test.tsx` - For testing the overall chat page structure and interactions.
- `docs/CHAT_UI_COMPONENT_REFERENCE.md` - Canonical reference list of chat UI elements (must be updated when new UI elements are added).

### Notes

- Create a new directory `apps/web/src/components/chat/` to house the new chat-specific components.
- All new components must be styled using **NativeWind classes only**.
- Unit tests should be created for new components where logic is involved (e.g., message handling, state changes).
- Use `npx jest [optional/path/to/test/file]` to run tests.

## Tasks

- [x] 1.0 **Setup Core Chat Layout and Components**
  - [x] 1.1 Modify `ChatPage.tsx` to remove the current "Coming Soon" placeholder content.
  - [x] 1.2 Create the new component files: `ChatHistoryPane.tsx`, `ChatInterface.tsx`, and `MessageComposer.tsx` inside `apps/web/src/components/chat/`.
  - [x] 1.3 In `ChatPage.tsx`, set up the main flexbox layout to accommodate a left pane and a center content area.
  - [x] 1.4 Import and render the placeholder `ChatHistoryPane` and `ChatInterface` components within `ChatPage.tsx`.
  - [x] 1.5 Modify the root view in `ChatPage.tsx` to make the top navigation bar "sticky" at the top of the viewport.

- [x] 2.0 **Implement Chat History Pane (Left Side)**
  - [x] 2.1 In `ChatPage.tsx`, add state (`showHistoryPane`, `setShowHistoryPane`) to manage the visibility of the history pane.
  - [x] 2.2 Add a new toggle button (e.g., hamburger icon) in the `ChatPage`'s sticky header to update the `showHistoryPane` state.
  - [x] 2.3 In `ChatHistoryPane.tsx`, implement the slide-in/overlay functionality, replicating the behavior of the existing `ProfileMenu`. Use absolute positioning and apply NativeWind classes for a smooth transition.
  - [x] 2.4 Add a "New Chat" button at the top of the `ChatHistoryPane.tsx` component.
  - [x] 2.5 Populate the `ChatHistoryPane.tsx` with a hard-coded array of chat session data (e.g., `{ id: 1, name: 'My First Chat', timestamp: '10:45 AM' }`).
  - [x] 2.6 Map over the static data to render a list of chat sessions, each styled with NativeWind.
  - [x] 2.7 Add a code comment explicitly stating that the chat history data is static and will be replaced by a dynamic database call in the future.
  - [x] 2.8 Update `CHAT_UI_COMPONENT_REFERENCE.md` with any new or renamed elements added in tasks 2.x.

- [x] 3.0 **Build the Core Chat Interface (Center Pane)**
  - [x] 3.1 Create `MessageList.tsx` and `Message.tsx` component files.
  - [x] 3.2 In `ChatInterface.tsx`, render the `MessageList` and `MessageComposer` components.
  - [x] 3.3 In `Message.tsx`, add logic to conditionally apply different styles based on a prop (e.g., `author: 'user' | 'bot'`).
  - [x] 3.4 Style user messages using NativeWind: right-aligned with a speech bubble background.
  - [x] 3.5 Style chatbot messages using NativeWind: left-aligned with a plain background.
  - [x] 3.6 Integrate a Markdown rendering library (e.g., `react-native-markdown-display`) into `Message.tsx` to parse and display content from chatbot messages.
  - [x] 3.7 In `MessageComposer.tsx`, create a `TextInput` component and a "Send" button.
  - [x] 3.8 Style the `TextInput` to be multi-line and expand automatically up to 3 lines.
  - [x] 3.9 Update `CHAT_UI_COMPONENT_REFERENCE.md` with new elements from the Core Chat Interface.

- [ ] 4.0 **Implement Mocked Chat Logic and Message Handling**
  - [x] 4.1 In `ChatInterface.tsx`, create state to manage the list of messages (`messages`, `setMessages`).
  - [x] 4.2 Create an `onSendMessage` function that adds the user's message to the `messages` state and clears the input field.
  - [x] 4.3 After the user message is added, trigger a mock response function that simulates streaming by using `setInterval` or `setTimeout` to append characters of the echoed message to a new bot message object in the `messages` state.
  - [x] 4.4 Implement the `Cmd+Enter` keyboard shortcut on the `TextInput` in `MessageComposer.tsx` to trigger the `onSendMessage` function.
  - [x] 4.5 In `MessageList.tsx`, use a `ref` on the `ScrollView` or `FlatList` and the `scrollToEnd()` method to ensure the view automatically scrolls down when a new message is added.
  - [x] 4.6 Update `CHAT_UI_COMPONENT_REFERENCE.md` with any new state or logic-related elements if UI changes.

**CRITICAL ISSUES FIXED:**
- **✅ Fixed Issue 4.1**: User messages now appear right-aligned in blue speech bubbles, bot messages left-aligned WITHOUT speech bubbles (per PRD 4.3.2) using NativeWind classes
- **✅ Fixed Issue 4.4**: Keyboard shortcut now works properly - Cmd+Enter (Mac) or Ctrl+Enter (Windows/Linux) sends messages

- [ ] 5.0 **Finalize Styling, Responsiveness, and Testing**
  - [ ] 5.1 Thoroughly test the responsiveness of the entire `ChatPage` on both desktop and mobile screen sizes.
  - [ ] 5.2 Verify the history pane properly collapses on mobile and is accessible via its toggle button. And that it defaults open on desktop (but without the overlay on desktop)
  - [ ] 5.3 Confirm that the sticky top navigation bar remains visible when the mobile keyboard is open.
  - [ ] 5.4 Manually test all user stories and functional requirements from the PRD to ensure they are met.
  - [ ] 5.5 (Optional) Write basic Jest/React Testing Library tests for the `MessageComposer` to ensure the input state is updated correctly.
  - [ ] 5.6 Check and update all prior tests in e2e to ensure compatibility with the new chat interface, i.e. to no longer expect 'coming soon', and to check for the expected new /chat/ elements
  - [ ] 5.7 Update `CHAT_UI_COMPONENT_REFERENCE.md` to reflect final UI structure after feature completion.
