const puppeteer = require('puppeteer');
const fs = require('fs');

// Load test credentials
function loadTestCredentials() {
  try {
    const envContent = fs.readFileSync('.env.stagehand', 'utf8');
    const credentials = {};
    envContent.split('\n').forEach(line => {
      const [key, value] = line.split('=');
      if (key && value) {
        credentials[key] = value;
      }
    });
    return credentials;
  } catch (error) {
    console.error('❌ Could not load test credentials from .env.stagehand:', error.message);
    return null;
  }
}

async function inspectChatHTML() {
  console.log('🔍 Inspecting chat HTML structure after sending message...');
  
  const credentials = loadTestCredentials();
  if (!credentials || !credentials.TEST_LOGIN_EMAIL || !credentials.TEST_LOGIN_PASSWORD) {
    console.error('❌ Test credentials not found in .env.stagehand');
    return false;
  }
  
  const browser = await puppeteer.launch({ 
    headless: false,
    defaultViewport: { width: 1200, height: 800 }
  });
  
  try {
    const page = await browser.newPage();
    
    // Enable console logging
    page.on('console', msg => {
      console.log('🌐 PAGE LOG:', msg.text());
    });
    
    console.log('📡 Login and navigate to chat...');
    await page.goto('http://localhost:8081/login', { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });
    
    // Login
    await page.type('input[type="email"]', credentials.TEST_LOGIN_EMAIL);
    await page.type('input[type="password"]', credentials.TEST_LOGIN_PASSWORD);
    await page.click('[data-testid="submit-button"]');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    console.log('📡 Send test message...');
    const messageInput = await page.$('[data-testid="message-input"]');
    await messageInput.type('Test HTML inspection message');
    await page.click('[data-testid="send-button"]');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('📡 Inspecting chat HTML structure...');
    
    const htmlAnalysis = await page.evaluate(() => {
      // Get all elements with background colors
      const bgElements = Array.from(document.querySelectorAll('*')).filter(el => {
        const style = window.getComputedStyle(el);
        return style.backgroundColor && style.backgroundColor !== 'rgba(0, 0, 0, 0)' && style.backgroundColor !== 'transparent';
      });
      
      // Get all elements with class containing 'bg-'
      const bgClassElements = Array.from(document.querySelectorAll('[class*="bg-"]'));
      
      // Get all message-related elements
      const messageElements = Array.from(document.querySelectorAll('[class*="items-"], [class*="my-"], [class*="px-"], [class*="rounded"]'));
      
      // Get full chat page HTML
      const chatPage = document.querySelector('[data-testid="chat-page"]');
      
      return {
        bgElements: bgElements.map(el => ({
          tagName: el.tagName,
          className: el.className,
          computedBg: window.getComputedStyle(el).backgroundColor,
          text: el.textContent.trim().substring(0, 50)
        })),
        bgClassElements: bgClassElements.map(el => ({
          tagName: el.tagName,
          className: el.className,
          text: el.textContent.trim().substring(0, 50)
        })),
        messageElements: messageElements.map(el => ({
          tagName: el.tagName,
          className: el.className,
          text: el.textContent.trim().substring(0, 50)
        })),
        chatPageHTML: chatPage ? chatPage.innerHTML.substring(0, 2000) : 'Chat page not found',
        hasBlueElements: document.querySelectorAll('.bg-blue-500').length,
        allClassNames: Array.from(new Set(Array.from(document.querySelectorAll('*')).map(el => el.className).filter(cn => cn && cn.includes('bg-'))))
      };
    });
    
    console.log('📊 Background color elements:', htmlAnalysis.bgElements);
    console.log('📊 Elements with bg- classes:', htmlAnalysis.bgClassElements);
    console.log('📊 Message-related elements:', htmlAnalysis.messageElements);
    console.log('📊 Blue elements found:', htmlAnalysis.hasBlueElements);
    console.log('📊 All background class names:', htmlAnalysis.allClassNames);
    console.log('📊 Chat page HTML preview:', htmlAnalysis.chatPageHTML);
    
    await page.screenshot({ path: 'chat-html-inspection.png', fullPage: true });
    console.log('📸 Screenshot saved as chat-html-inspection.png');
    
    return htmlAnalysis;
    
  } catch (error) {
    console.error('❌ Inspection failed:', error.message);
    return { error: error.message };
  } finally {
    await browser.close();
  }
}

inspectChatHTML().then(result => {
  console.log('🎯 HTML inspection complete');
  if (result.error) {
    console.log('❌ Error:', result.error);
  } else {
    console.log('✅ Inspection successful');
  }
  process.exit(0);
});