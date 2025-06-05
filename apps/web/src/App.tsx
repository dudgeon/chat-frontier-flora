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

interface Message {
  id: number
  content: string
  role: 'user' | 'assistant'
  created_at: string
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiClient, setApiClient] = useState<ApiClient | null>(null);

  // Initialize API client
  useEffect(() => {
    try {
      const client = new ApiClient(
        import.meta.env.VITE_SUPABASE_URL,
        import.meta.env.VITE_SUPABASE_ANON_KEY,
        import.meta.env.VITE_OPENAI_API_KEY
      );
      setApiClient(client);

      // Load existing messages
      const loadMessages = async () => {
        try {
          const existingMessages = await client.getMessages();
          setMessages(existingMessages);
        } catch (err) {
          console.error('Failed to load messages:', err);
          setError('Failed to load message history. Please refresh to try again.');
        }
      };

      loadMessages();
    } catch (err) {
      console.error('Failed to initialize API client:', err);
      setError('Failed to initialize chat. Please check your API configuration.');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !apiClient) return;

    const userContent = input.trim();
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const { userMessage, aiResponse } = await apiClient.sendMessage(userContent);

      // Update messages with both user message and AI response
      setMessages(prev => [
        ...prev,
        userMessage,
        {
          id: Date.now(), // temporary ID for immediate UI update
          content: aiResponse,
          role: 'assistant',
          created_at: new Date().toISOString()
        }
      ]);
    } catch (err) {
      console.error('Error in chat:', err);
      setError('Failed to send message. Please try again.');
      // Restore input so user doesn't lose their message
      setInput(userContent);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <h1 style={{
        textAlign: 'center',
        color: '#2c3e50',
        marginBottom: '30px'
      }}>
        Chat Frontier Flora
      </h1>

      {error && (
        <div style={{
          padding: '12px',
          marginBottom: '20px',
          backgroundColor: '#fee2e2',
          border: '1px solid #ef4444',
          borderRadius: '6px',
          color: '#dc2626'
        }}>
          {error}
        </div>
      )}

      <div style={{
        border: '1px solid #e1e1e1',
        borderRadius: '8px',
        height: '500px',
        overflowY: 'auto',
        padding: '20px',
        marginBottom: '20px',
        backgroundColor: '#f8f9fa'
      }}>
        {messages.length === 0 && !isLoading && !error && (
          <div style={{
            textAlign: 'center',
            color: '#6b7280',
            marginTop: '200px'
          }}>
            Start a conversation!
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            style={{
              marginBottom: '16px',
              textAlign: message.role === 'user' ? 'right' : 'left'
            }}
          >
            <div style={{
              display: 'inline-block',
              maxWidth: '70%',
              padding: '12px 16px',
              borderRadius: '12px',
              backgroundColor: message.role === 'user' ? '#007AFF' : '#E9ECEF',
              color: message.role === 'user' ? 'white' : 'black',
            }}>
              {message.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div style={{ textAlign: 'left', marginBottom: '16px' }}>
            <div style={{
              display: 'inline-block',
              padding: '12px 16px',
              borderRadius: '12px',
              backgroundColor: '#E9ECEF',
              color: 'black',
            }}>
              Thinking...
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} style={{
        display: 'flex',
        gap: '10px'
      }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={apiClient ? "Type a message..." : "Initializing..."}
          style={{
            flex: 1,
            padding: '12px',
            borderRadius: '6px',
            border: '1px solid #ced4da',
            fontSize: '16px'
          }}
          disabled={isLoading || !apiClient}
        />
        <button
          type="submit"
          disabled={isLoading || !apiClient}
          style={{
            padding: '12px 24px',
            backgroundColor: '#007AFF',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            cursor: (isLoading || !apiClient) ? 'not-allowed' : 'pointer',
            opacity: (isLoading || !apiClient) ? 0.7 : 1
          }}
        >
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
}

export default App;
