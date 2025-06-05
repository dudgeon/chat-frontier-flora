import { useState, useEffect } from 'react'
import { ApiClient } from '@chat-frontier-flora/shared'
import './App.css'

console.log('Environment variables:', {
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
  supabaseKey: import.meta.env.VITE_SUPABASE_ANON_KEY ? 'exists' : 'missing',
  openaiKey: import.meta.env.VITE_OPENAI_API_KEY ? 'exists' : 'missing'
});

type Message = {
  id: number
  content: string
  role: 'user' | 'assistant'
  created_at: string
}

function App() {
  console.log('App component rendering');
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, content: "Test message - if you see this, the app is rendering correctly", role: 'assistant', created_at: new Date().toISOString() }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Comment out API client initialization until we have environment variables
  /*
  const apiClient = new ApiClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY,
    import.meta.env.VITE_OPENAI_API_KEY
  )
  */

  useEffect(() => {
    console.log('useEffect running, messages:', messages);
    // Commenting out loadMessages until we have the API client set up
    // loadMessages()
  }, [])

  const loadMessages = async () => {
    /* Commenting out until we have API client
    try {
      const data = await apiClient.getMessages()
      setMessages(data)
    } catch (error) {
      console.error('Error loading messages:', error)
    }
    */
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const content = input.trim()
    setInput('')
    setIsLoading(true)

    try {
      // Temporarily just add the message locally
      setMessages(prev => [...prev, {
        id: Date.now(),
        content,
        role: 'user',
        created_at: new Date().toISOString()
      }])
      /* Comment out API calls until we have environment variables
      await apiClient.sendMessage(content)
      await loadMessages()
      */
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="app">
      <h1>Chat Frontier Flora</h1>
      <div className="messages">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${message.role === 'user' ? 'user' : 'assistant'}`}
          >
            {message.content}
          </div>
        ))}
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
          Send
        </button>
      </form>
    </div>
  )
}

export default App
