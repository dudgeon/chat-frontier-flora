// Load environment variables
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

// Check if API key is configured
const isApiConfigured = !!OPENAI_API_KEY;

document.querySelector('#app').innerHTML = `
  <div>
    <h1>Chat Frontier Flora</h1>
    <p>Welcome to the Chat Frontier Flora project!</p>
    ${!isApiConfigured ? `
      <div class="warning">
        <p>⚠️ OpenAI API key not configured!</p>
        <p>Please add your API key to the .env file:</p>
        <pre>VITE_OPENAI_API_KEY=your_api_key_here</pre>
      </div>
    ` : ''}
  </div>

  <style>
    .warning {
      background: #fff3cd;
      border: 1px solid #ffeeba;
      border-radius: 4px;
      padding: 1rem;
      margin: 1rem 0;
    }
    pre {
      background: #f8f9fa;
      padding: 0.5rem;
      border-radius: 4px;
    }
  </style>
` 