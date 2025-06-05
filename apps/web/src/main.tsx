import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Failed to find root element')
}

try {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
  console.log('App mounted successfully')
} catch (error) {
  console.error('Failed to render app:', error)
  document.body.innerHTML = '<div style="color: red; padding: 20px;">Failed to load application</div>'
}
