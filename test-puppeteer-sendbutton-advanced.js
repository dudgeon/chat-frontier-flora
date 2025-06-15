#!/usr/bin/env node

const puppeteer = require('puppeteer');
const fs = require('fs');

async function documentSendButtonAdvanced() {
  console.log('🚀 Starting Advanced SendButton Documentation...');

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1200, height: 800 },
    slowMo: 100 // Slow down for better observation
  });

  try {
    const page = await browser.newPage();

    // Navigate to the development server
    console.log('📍 Navigating to localhost:19006...');
    await page.goto('http://localhost:19006', { waitUntil: 'networkidle2' });

    // Wait for page to load
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Take initial screenshot
    console.log('📸 Taking initial page screenshot...');
    await page.screenshot({
      path: 'sendbutton-step1-initial.png',
      fullPage: true
    });

    // Check current page state
    const pageState = await page.evaluate(() => {
      const signupForm = document.querySelector('[data-testid="signup-form"]');
      const loginForm = document.querySelector('[data-testid="login-form"]');
      const chatInterface = document.querySelector('[data-testid="chat-interface"]');
      const messageComposer = document.querySelector('.message-composer');
      const textarea = document.querySelector('textarea');
      const sendButton = document.querySelector('button[type="submit"]') ||
                        document.querySelector('button[aria-label*="send"]') ||
                        document.querySelector('button[aria-label*="Send"]');

      return {
        hasSignupForm: !!signupForm,
        hasLoginForm: !!loginForm,
        hasChatInterface: !!chatInterface,
        hasMessageComposer: !!messageComposer,
        hasTextarea: !!textarea,
        hasSendButton: !!sendButton,
        currentPath: window.location.pathname,
        allButtons: Array.from(document.querySelectorAll('button')).map(btn => ({
          text: btn.textContent?.trim(),
          type: btn.type,
          className: btn.className,
          ariaLabel: btn.getAttribute('aria-label')
        }))
      };
    });

    console.log('📊 Current Page State:', JSON.stringify(pageState, null, 2));

    if (pageState.hasSendButton && pageState.hasTextarea) {
      console.log('✅ Found SendButton and textarea - documenting chat interface!');

      // Focus on the message composer area
      const messageArea = await page.$('textarea');
      if (messageArea) {
        await messageArea.screenshot({ path: 'sendbutton-step2-composer.png' });
        console.log('📸 Captured message composer with SendButton');

        // Get detailed SendButton styling
        const sendButtonDetails = await page.evaluate(() => {
          const sendBtn = document.querySelector('button[type="submit"]') ||
                         document.querySelector('button[aria-label*="send"]') ||
                         document.querySelector('button[aria-label*="Send"]');

          if (!sendBtn) return null;

          const styles = window.getComputedStyle(sendBtn);
          return {
            width: styles.width,
            height: styles.height,
            backgroundColor: styles.backgroundColor,
            borderRadius: styles.borderRadius,
            color: styles.color,
            fontSize: styles.fontSize,
            padding: styles.padding,
            margin: styles.margin,
            boxShadow: styles.boxShadow,
            border: styles.border,
            display: styles.display,
            alignItems: styles.alignItems,
            justifyContent: styles.justifyContent,
            position: styles.position,
            innerHTML: sendBtn.innerHTML,
            outerHTML: sendBtn.outerHTML.substring(0, 200) + '...'
          };
        });

        console.log('🎨 SendButton Styling Details:', JSON.stringify(sendButtonDetails, null, 2));
        fs.writeFileSync('sendbutton-styling-details.json', JSON.stringify(sendButtonDetails, null, 2));
      }

    } else if (pageState.hasSignupForm || pageState.hasLoginForm) {
      console.log('📝 On authentication page - need to navigate to chat');
      console.log('💡 For now, documenting the auth page buttons as reference');

      // Document auth page buttons for comparison
      const authButtons = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('button')).map(btn => {
          const styles = window.getComputedStyle(btn);
          return {
            text: btn.textContent?.trim(),
            type: btn.type,
            className: btn.className,
            width: styles.width,
            height: styles.height,
            backgroundColor: styles.backgroundColor,
            borderRadius: styles.borderRadius,
            color: styles.color,
            padding: styles.padding,
            innerHTML: btn.innerHTML
          };
        });
      });

      console.log('🔘 Auth Page Buttons:', JSON.stringify(authButtons, null, 2));
      fs.writeFileSync('sendbutton-auth-buttons.json', JSON.stringify(authButtons, null, 2));

    } else {
      console.log('❓ Unexpected page state - documenting for analysis');
    }

    // Save comprehensive analysis
    const fullAnalysis = {
      timestamp: new Date().toISOString(),
      pageState,
      url: await page.url(),
      title: await page.title(),
      screenshots: [
        'sendbutton-step1-initial.png',
        pageState.hasTextarea ? 'sendbutton-step2-composer.png' : null
      ].filter(Boolean)
    };

    fs.writeFileSync('sendbutton-full-analysis.json', JSON.stringify(fullAnalysis, null, 2));

    console.log('✅ Advanced documentation complete!');
    console.log('📁 Files created:');
    console.log('  - sendbutton-step1-initial.png');
    if (pageState.hasTextarea) console.log('  - sendbutton-step2-composer.png');
    if (pageState.hasSendButton) console.log('  - sendbutton-styling-details.json');
    console.log('  - sendbutton-auth-buttons.json');
    console.log('  - sendbutton-full-analysis.json');

  } catch (error) {
    console.error('❌ Error during advanced documentation:', error);
  } finally {
    await browser.close();
  }
}

// Run the advanced documentation
documentSendButtonAdvanced().catch(console.error);
