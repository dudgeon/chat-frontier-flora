#!/usr/bin/env node

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function documentSendButton() {
  console.log('🚀 Starting SendButton visual documentation...');

  const browser = await puppeteer.launch({
    headless: false, // Show browser for debugging
    defaultViewport: { width: 1200, height: 800 }
  });

  try {
    const page = await browser.newPage();

    // Navigate to the development server
    console.log('📍 Navigating to localhost:19006...');
    await page.goto('http://localhost:19006', { waitUntil: 'networkidle2' });

    // Wait for the page to load
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Take full page screenshot
    console.log('📸 Taking full page screenshot...');
    await page.screenshot({
      path: 'sendbutton-full-page.png',
      fullPage: true
    });

    // Try to find and focus on the message composer area
    console.log('🔍 Looking for MessageComposer...');

    // Check if we can find the chat interface
    const chatExists = await page.$('[data-testid="chat-interface"]') ||
                      await page.$('.message-composer') ||
                      await page.$('textarea') ||
                      await page.$('input[type="text"]');

    if (chatExists) {
      console.log('✅ Found chat interface elements');

      // Take screenshot of the message input area
      const messageArea = await page.$('textarea') || await page.$('input[type="text"]');
      if (messageArea) {
        await messageArea.screenshot({ path: 'sendbutton-message-area.png' });
        console.log('📸 Captured message area screenshot');
      }
    } else {
      console.log('⚠️ Chat interface not immediately visible, checking for auth forms...');

      // Check if we're on auth page
      const authForm = await page.$('[data-testid="signup-form"]') ||
                      await page.$('[data-testid="login-form"]') ||
                      await page.$('form');

      if (authForm) {
        console.log('📝 Found authentication form - need to login first');
        await authForm.screenshot({ path: 'sendbutton-auth-form.png' });
      }
    }

    // Extract page info
    const pageInfo = await page.evaluate(() => {
      return {
        title: document.title,
        url: window.location.href,
        hasTextarea: !!document.querySelector('textarea'),
        hasButton: !!document.querySelector('button'),
        buttonCount: document.querySelectorAll('button').length,
        formCount: document.querySelectorAll('form').length
      };
    });

    console.log('📊 Page Analysis:', pageInfo);

    // Save analysis to file
    fs.writeFileSync('sendbutton-analysis.json', JSON.stringify(pageInfo, null, 2));

    console.log('✅ Visual documentation complete!');
    console.log('📁 Files created:');
    console.log('  - sendbutton-full-page.png');
    console.log('  - sendbutton-message-area.png (if found)');
    console.log('  - sendbutton-auth-form.png (if on auth page)');
    console.log('  - sendbutton-analysis.json');

  } catch (error) {
    console.error('❌ Error during documentation:', error);
  } finally {
    await browser.close();
  }
}

// Run the documentation
documentSendButton().catch(console.error);
