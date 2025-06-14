#!/usr/bin/env node

const puppeteer = require('puppeteer');

async function testNativeWindDebug() {
  const browser = await puppeteer.launch({ 
    headless: false,
    args: [
      '--no-first-run',
      '--disable-blink-features=AutomationControlled'
    ]
  });
  
  const page = await browser.newPage();
  
  try {
    console.log('🔍 Testing NativeWind on debug page...');
    
    // Navigate to debug page (no auth required)
    await page.goto('http://localhost:19006/debug', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 3000));
    
    // Check for NativeWind test elements
    const nativeWindTest = await page.evaluate(() => {
      const testBubble = document.querySelector('div[class*="bg-green-500"]');
      if (!testBubble) {
        return { found: false, message: 'No element with bg-green-500 class found' };
      }
      
      const styles = window.getComputedStyle(testBubble);
      const textElement = testBubble.querySelector('text, span, p');
      const textStyles = textElement ? window.getComputedStyle(textElement) : null;
      
      return {
        found: true,
        className: testBubble.className,
        backgroundColor: styles.backgroundColor,
        borderRadius: styles.borderRadius,
        padding: styles.padding,
        textColor: textStyles ? textStyles.color : 'no text element found',
        isGreen: styles.backgroundColor.includes('34, 197, 94') || 
                styles.backgroundColor.includes('rgb(34 197 94') ||
                styles.backgroundColor === 'rgb(34, 197, 94)',
        hasWhiteText: textStyles ? (
          textStyles.color === 'rgb(255, 255, 255)' ||
          textStyles.color === '#ffffff' ||
          textStyles.color === 'white'
        ) : false
      };
    });
    
    console.log('🧪 NativeWind Test Results:', JSON.stringify(nativeWindTest, null, 2));
    
    if (nativeWindTest.found) {
      if (nativeWindTest.isGreen && nativeWindTest.hasWhiteText) {
        console.log('🎉 SUCCESS: NativeWind styling is working correctly!');
        console.log('✅ Green background and white text detected');
      } else if (nativeWindTest.isGreen) {
        console.log('⚠️ PARTIAL: Green background detected but text color may be incorrect');
      } else {
        console.log('❌ ISSUE: Element found but not styled with green background');
        console.log(`📊 Background color: ${nativeWindTest.backgroundColor}`);
      }
    } else {
      console.log('❌ ISSUE: No NativeWind test element found');
    }
    
    await page.screenshot({ path: '/tmp/nativewind-debug-test.png' });
    console.log('📸 Screenshot saved to /tmp/nativewind-debug-test.png');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    console.log('🔍 Keeping browser open for 10 seconds for inspection...');
    await new Promise(r => setTimeout(r, 10000));
    await browser.close();
  }
}

testNativeWindDebug().catch(console.error);