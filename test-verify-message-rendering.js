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

async function verifyMessageRendering() {
  console.log('🔍 Verifying message is being rendered at all...');
  
  const credentials = loadTestCredentials();
  if (!credentials) {
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
    const testMessage = 'UNIQUE_TEST_MESSAGE_12345';
    const messageInput = await page.$('[data-testid="message-input"]');
    await messageInput.type(testMessage);
    await page.click('[data-testid="send-button"]');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log('📡 Searching for message in page content...');
    
    const messageSearch = await page.evaluate((searchText) => {
      // Search for the message text anywhere in the page
      const pageText = document.body.innerText;
      const found = pageText.includes(searchText);
      
      // Get all text nodes containing our message
      const textNodes = [];
      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        null,
        false
      );
      
      let node;
      while (node = walker.nextNode()) {
        if (node.textContent.includes(searchText)) {
          textNodes.push({
            text: node.textContent,
            parentElement: node.parentElement.tagName,
            parentClass: node.parentElement.className,
            parentStyle: node.parentElement.getAttribute('style')
          });
        }
      }
      
      return {
        found,
        pageContainsMessage: pageText.includes(searchText),
        textNodes,
        entirePageText: pageText.substring(pageText.indexOf(searchText) - 100, pageText.indexOf(searchText) + 200)
      };
    }, testMessage);
    
    console.log('📊 Message search results:', messageSearch);
    
    if (messageSearch.found) {
      console.log('✅ Message found in page!');
      console.log('📊 Text nodes containing message:', messageSearch.textNodes);
      console.log('📊 Context around message:', messageSearch.entirePageText);
    } else {
      console.log('❌ Message not found in page');
      console.log('📊 Full page text preview:', messageSearch.entirePageText || 'No page text found');
    }
    
    await page.screenshot({ path: 'message-rendering-verification.png', fullPage: true });
    console.log('📸 Screenshot saved as message-rendering-verification.png');
    
    return messageSearch;
    
  } catch (error) {
    console.error('❌ Verification failed:', error.message);
    return { error: error.message };
  } finally {
    await browser.close();
  }
}

verifyMessageRendering().then(result => {
  console.log('🎯 Message rendering verification complete');
  if (result.error) {
    console.log('❌ Error:', result.error);
  } else if (result.found) {
    console.log('✅ SUCCESS: Message is being rendered');
  } else {
    console.log('❌ FAILED: Message is not being rendered');
  }
  process.exit(0);
});