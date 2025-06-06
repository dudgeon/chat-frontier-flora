import { useState, useEffect } from 'react'
import { ApiClient } from '@chat-frontier-flora/shared'
import './App.css'

console.log('Starting app initialization...');

// Add error boundary
const ErrorMessage = ({ error }: { error: Error }) => (
  <div className="error-message">
    <h2>Something went wrong</h2>
    <pre>{error.message}</pre>
  </div>
);

function App() {
  console.log('App component rendering');
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  // Verify environment variables
  useEffect(() => {
    console.log('Checking environment variables:', {
      supabaseUrl: import.meta.env.VITE_SUPABASE_URL ? 'set' : 'missing',
      supabaseKey: import.meta.env.VITE_SUPABASE_ANON_KEY ? 'set' : 'missing',
      openaiKey: import.meta.env.VITE_OPENAI_API_KEY ? 'set' : 'missing'
    });
  }, []);

  // Initialize API client with error handling
  let apiClient: ApiClient;
  try {
    apiClient = new ApiClient(
      import.meta.env.VITE_SUPABASE_URL,
      import.meta.env.VITE_SUPABASE_ANON_KEY,
      import.meta.env.VITE_OPENAI_API_KEY
    );
    console.log('API client initialized successfully');
  } catch (err) {
    console.error('Failed to initialize API client:', err);
    const error = err instanceof Error ? err : new Error('Failed to initialize API client');
    setError(error);
    return <ErrorMessage error={error} />;
  }

  useEffect(() => {
    console.log('Loading initial messages');
    loadMessages()
  }, [])

  const loadMessages = async () => {
    try {
      console.log('Fetching messages...');
      const data = await apiClient.getMessages()
      console.log('Loaded messages:', data);
      setMessages(data)
    } catch (err) {
      console.error('Error loading messages:', err)
      const error = err instanceof Error ? err : new Error('Failed to load messages');
      setError(error);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const content = input.trim()
    setInput('')
    setIsLoading(true)
    setError(null)

    try {
      console.log('Sending message:', content);
      const { userMessage, aiResponse } = await apiClient.sendMessage(content)
      console.log('Received response:', { userMessage, aiResponse });
      await loadMessages()
    } catch (err) {
      console.error('Error sending message:', err)
      const error = err instanceof Error ? err : new Error('Failed to send message');
      setError(error);
    } finally {
      setIsLoading(false)
    }
  }

  // If there's an error, show it
  if (error) {
    return <ErrorMessage error={error} />;
  }

  return (
    <div className="app">
      <h1>Chat Frontier Flora</h1>
      <div className="messages">
        {messages.length === 0 && !isLoading && (
          <div className="message system">
            No messages yet. Start a conversation!
          </div>
        )}
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${message.role === 'user' ? 'user' : 'assistant'}`}
          >
            {message.content}
          </div>
        ))}
        {isLoading && (
          <div className="message assistant">
            Thinking...
          </div>
        )}
      </div>
      <form onSubmit={handleSubmit} className="input-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  )
}

type Message = {
  id: number
  content: string
  role: 'user' | 'assistant'
  created_at: string
}

export default App
