# PRD: Chatbot UI Prototype

## 1. Introduction/Overview

This document outlines the requirements for building a new user interface for the primary chat functionality on the `/chat` route. The goal is to replace the current "Coming Soon" placeholder with a visually styled, UI-only chatbot interface. This initial version will focus on establishing the core layout, message display, and user interaction patterns. The backend logic will be mocked to allow for rapid frontend development and testing of the user experience.

The feature will introduce a three-pane layout: a chat history pane on the left, a central chat dialogue area, and the existing profile menu on the right.

## 2. Goals

*   To implement a responsive, visually appealing chat interface that provides a foundation for future development.
*   To establish the core UI components for chat history, dialogue, and message composition using NativeWind.
*   To create a functional prototype allowing a user to send messages and receive mocked, streamed responses.
*   To ensure the UI is responsive, with a mobile-first approach for the history and profile panes.
*   To validate the visual treatment of user messages versus chatbot responses, including Markdown rendering.

## 3. User Stories

*   **As a user on a desktop computer,** I want to see my chat history on the left side of the screen so I can easily switch between conversations.
*   **As a user on a mobile device,** I want the chat history pane to be hidden by default but accessible via a button, so it doesn't clutter the main screen.
*   **As a user,** I want to type a message in a composition field, press a send button or use a keyboard shortcut (Cmd+Enter), and see my message appear instantly in the chat dialogue.
*   **As a user,** I want to see my sent messages appear on the right side of the dialogue in a speech bubble to easily distinguish them from the chatbot's messages.
*   **As a user,** I want to see responses from the chatbot appear on the left side of the dialogue with clear styling for formatted text (like lists, bold text, or code), so the information is easy to read.
*   **As a user,** I want the chat window to automatically scroll down as new messages arrive so I can always see the latest part of the conversation.
*   **As a user,** I want to click a "New Chat" button to start a fresh conversation.
*   **As a user,** I want to click on a previous chat session in the history pane and have that conversation's dialogue load in the main window.

## 4. Functional Requirements

### 4.1. Layout & Panes

1.  **Main Layout:** The page will use a three-column potential layout.
    *   **Left Pane (Chat History):** Initially hidden on mobile, visible on desktop. Toggled via a menu button in the top nav.
    *   **Center Pane (Chat Interface):** The primary view.
    *   **Right Pane (Profile Menu):** Existing functionality.
2.  **Top Navigation Bar:** The existing top navigation bar shall be made "sticky" so it remains visible at all times, even when a mobile keyboard is active.

### 4.2. Chat History Pane (Left)

1.  **Functionality & Styling:** The pane will replicate the exact slide-in/overlay functionality and visual styling of the existing right-side profile menu.
2.  **Content:**
    *   A **"New Chat"** button shall be present at the top of the pane.
    *   A list of chat sessions will be displayed.
    *   Each list item will show the chat session name and a timestamp.
3.  **Data:** For this prototype, the list of chat sessions will be populated with static, hard-coded data.
    *   **Comment:** The code must include comments indicating this is placeholder data and will be replaced by a dynamic fetch from the database, likely via a Supabase Edge Function.
4.  **Interaction:** Clicking a chat session in the list will load the corresponding (static) dialogue into the center pane.

### 4.3. Chat Interface (Center)

1.  **Dialogue Area:**
    *   This area will display the back-and-forth conversation.
    *   It must automatically scroll to the bottom when a new message is added.
2.  **Message Display:**
    *   **User Messages:** Rendered on the right side, styled within a simple, minimal speech bubble.
    *   **Chatbot Responses:** Rendered on the left side, *not* in a speech bubble.
3.  **Markdown Rendering:** Chatbot responses must be parsed and rendered with appropriate styling for the following Markdown features:
    *   Headings (H1, H2, H3)
    *   Bold (`**text**`) and Italic (`*text*`)
    *   Unordered lists (`- item`) and Ordered lists (`1. item`)
    *   Links (`[text](url)`)
    *   Code blocks (single-line `` `code` `` and multi-line ```` ```code``` ````)
4.  **Message Composition Field:**
    *   A text input field at the bottom of the chat interface.
    *   It should be a single line by default but expand vertically as the user types, up to a maximum of three lines.
    *   The input field must be cleared automatically after a message is sent.
5.  **Send Mechanisms:**
    *   A visible "Send" button.
    *   The `Cmd+Enter` keyboard shortcut will also trigger sending the message.

### 4.4. Mocked Chatbot Behavior

1.  **Response Logic:** Upon the user sending a message, the chatbot will "echo" the exact same message back to the user.
2.  **Response Streaming:** The echoed response must be streamed back to the user gradually (e.g., a few characters at a time) to simulate a real-time, generative response.

## 5. Non-Goals (Out of Scope)

*   Implementing a real backend connection for the chatbot. All responses are mocked.
*   User authentication or profile management changes. (Leverage existing).
*   Saving chat history to the database. (Static data is used for the prototype).
*   Search functionality within chats or chat history.
*   File uploads or attachments.
*   Refactoring the existing header or profile menu to use NativeWind. They will remain as-is.

## 6. Design Considerations

*   **Styling Engine:** All *new* UI components for this feature **must** be built exclusively with NativeWind classes. No new inline styles or `StyleSheet.create` objects should be used for the feature's components.
*   **Component Replication:** Existing visual styles (like the profile menu's card/shadow/button styles) can be replicated using NativeWind to ensure visual consistency.
*   **Responsiveness:** The layout must be fully responsive. The key change is the collapsing of the left history pane on mobile, which should be accessible via a hamburger menu icon or similar UI element in the sticky top nav.

## 7. Technical Considerations

*   **State Management:** Component-level state (`useState`) is sufficient for managing the UI of this prototype (e.g., input field content, message list).
*   **Markdown Parsing Library:** A library like `react-native-markdown-display` or similar should be chosen to handle Markdown rendering on React Native Web.
*   **Streaming Simulation:** The streaming echo can be implemented on the client-side using `setTimeout` or `setInterval` to append characters to the response message state.

## 8. Success Metrics

*   All functional requirements are implemented and verifiable in the UI.
*   The UI is fully responsive and functions correctly on desktop and mobile viewport sizes.
*   The code for new components adheres strictly to the NativeWind-only styling requirement.
*   A junior developer can review the prototype and understand the foundational chat UI, its components, and how they interact.

## 9. Open Questions

*   What should the initial state of the chat dialogue be when a user first lands on the `/chat` page before selecting a session or starting a new one? (Suggestion: A welcome message or a set of example prompts).
