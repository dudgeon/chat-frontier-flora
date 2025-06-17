const puppeteer = require('puppeteer');
const fs = require('fs');

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
    return null;
  }
}

async function investigateCSS() {
  console.log('🔍 Investigating CSS classes and styling...');
  
  const credentials = loadTestCredentials();
  if (!credentials) return false;
  
  const browser = await puppeteer.launch({ 
    headless: false,
    defaultViewport: { width: 1200, height: 800 }
  });
  
  try {
    const page = await browser.newPage();
    
    console.log('📡 Login and send message...');
    await page.goto('http://localhost:8081/login', { waitUntil: 'networkidle0', timeout: 30000 });
    
    await page.type('input[type="email"]', credentials.TEST_LOGIN_EMAIL);
    await page.type('input[type="password"]', credentials.TEST_LOGIN_PASSWORD);
    await page.click('[data-testid="submit-button"]');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    const messageInput = await page.$('[data-testid="message-input"]');
    await messageInput.type('CSS INVESTIGATION MESSAGE');
    await page.click('[data-testid="send-button"]');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('📡 Investigating CSS classes and stylesheets...');
    
    const cssInvestigation = await page.evaluate(() => {
      // Get all stylesheets
      const stylesheets = Array.from(document.styleSheets).map(sheet => {
        try {
          return {
            href: sheet.href,
            rules: Array.from(sheet.cssRules || []).slice(0, 10).map(rule => rule.cssText),
            ruleCount: sheet.cssRules ? sheet.cssRules.length : 0
          };
        } catch (e) {
          return { href: sheet.href, error: 'Cannot access rules (CORS)', rules: [] };
        }
      });
      
      // Search for bg-blue-500 in CSS
      let foundBlueRule = false;
      let foundGreenRule = false;
      
      stylesheets.forEach(sheet => {
        if (sheet.rules) {
          sheet.rules.forEach(rule => {
            if (rule.includes('bg-blue-500')) foundBlueRule = true;
            if (rule.includes('bg-green-500')) foundGreenRule = true;
          });
        }
      });
      
      // Get computed styles of elements with className containing certain patterns
      const elementsWithBg = Array.from(document.querySelectorAll('*')).filter(el => 
        el.className && (el.className.includes('bg-') || el.className.includes('blue') || el.className.includes('green'))
      ).map(el => ({
        tagName: el.tagName,
        className: el.className,
        computedStyle: {
          backgroundColor: window.getComputedStyle(el).backgroundColor,
          color: window.getComputedStyle(el).color,
          textAlign: window.getComputedStyle(el).textAlign,
          alignItems: window.getComputedStyle(el).alignItems
        }
      }));
      
      // Look for any elements containing our message text
      const messageElements = Array.from(document.querySelectorAll('*')).filter(el => 
        el.textContent && el.textContent.includes('CSS INVESTIGATION MESSAGE')
      ).map(el => ({
        tagName: el.tagName,
        className: el.className,
        textContent: el.textContent.trim().substring(0, 100),
        computedStyle: {
          backgroundColor: window.getComputedStyle(el).backgroundColor,
          color: window.getComputedStyle(el).color,
          textAlign: window.getComputedStyle(el).textAlign,
          alignItems: window.getComputedStyle(el).alignItems,
          justifyContent: window.getComputedStyle(el).justifyContent,
          display: window.getComputedStyle(el).display,
          flexDirection: window.getComputedStyle(el).flexDirection
        },
        parent: el.parentElement ? {
          tagName: el.parentElement.tagName,
          className: el.parentElement.className,
          computedStyle: {
            backgroundColor: window.getComputedStyle(el.parentElement).backgroundColor,
            alignItems: window.getComputedStyle(el.parentElement).alignItems,
            justifyContent: window.getComputedStyle(el.parentElement).justifyContent
          }
        } : null
      }));
      
      return {
        stylesheets: stylesheets.map(s => ({ href: s.href, ruleCount: s.ruleCount })),
        foundBlueRule,
        foundGreenRule,
        elementsWithBg,
        messageElements,
        totalStylesheets: stylesheets.length
      };
    });
    
    console.log('📊 CSS Investigation Results:');
    console.log('- Total stylesheets:', cssInvestigation.totalStylesheets);
    console.log('- Found .bg-blue-500 rule:', cssInvestigation.foundBlueRule);
    console.log('- Found .bg-green-500 rule:', cssInvestigation.foundGreenRule);
    console.log('- Elements with bg classes:', cssInvestigation.elementsWithBg.length);
    console.log('- Message elements found:', cssInvestigation.messageElements.length);
    
    if (cssInvestigation.messageElements.length > 0) {
      console.log('📊 Message element details:');
      cssInvestigation.messageElements.forEach((el, i) => {
        console.log(`  Element ${i + 1}:`, {
          tag: el.tagName,
          className: el.className,
          bgColor: el.computedStyle.backgroundColor,
          textAlign: el.computedStyle.textAlign,
          parentBgColor: el.parent?.computedStyle?.backgroundColor
        });
      });
    }
    
    await page.screenshot({ path: 'css-investigation-result.png', fullPage: true });
    console.log('📸 Screenshot saved');
    
    return cssInvestigation;
    
  } catch (error) {
    console.error('❌ Investigation failed:', error.message);
    return { error: error.message };
  } finally {
    await browser.close();
  }
}

investigateCSS().then(result => {
  console.log('🎯 CSS investigation complete');
  process.exit(0);
});