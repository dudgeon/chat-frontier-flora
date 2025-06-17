const puppeteer = require('puppeteer');

async function analyzeLoginButtons() {
  console.log('🔍 Analyzing login form button structure...');
  
  const browser = await puppeteer.launch({ 
    headless: false,
    defaultViewport: { width: 1200, height: 800 }
  });
  
  try {
    const page = await browser.newPage();
    
    console.log('📡 Navigate to /login...');
    await page.goto('http://localhost:8081/login', { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });
    
    console.log('🔍 Analyzing all interactive elements...');
    
    const buttonAnalysis = await page.evaluate(() => {
      // Find all potential clickable elements
      const buttons = Array.from(document.querySelectorAll('button'));
      const roleButtons = Array.from(document.querySelectorAll('[role="button"]'));
      const touchableElements = Array.from(document.querySelectorAll('*')).filter(el => 
        el.style.cursor === 'pointer' || 
        window.getComputedStyle(el).cursor === 'pointer' ||
        el.onclick ||
        el.getAttribute('onPress')
      );
      
      const allClickable = [...new Set([...buttons, ...roleButtons, ...touchableElements])];
      
      return {
        totalButtons: buttons.length,
        totalRoleButtons: roleButtons.length,
        totalTouchableElements: touchableElements.length,
        totalClickable: allClickable.length,
        buttonDetails: buttons.map(btn => ({
          tagName: btn.tagName,
          type: btn.type,
          textContent: btn.textContent?.trim(),
          className: btn.className,
          disabled: btn.disabled,
          style: btn.style.cssText,
          testId: btn.getAttribute('testId') || btn.getAttribute('data-testid'),
          onclick: !!btn.onclick,
          hasEventListeners: btn.getEventListeners ? Object.keys(btn.getEventListeners()).length : 'unknown'
        })),
        roleButtonDetails: roleButtons.map(btn => ({
          tagName: btn.tagName,
          textContent: btn.textContent?.trim(),
          className: btn.className,
          role: btn.getAttribute('role'),
          testId: btn.getAttribute('testId') || btn.getAttribute('data-testid')
        })),
        touchableDetails: touchableElements.map(el => ({
          tagName: el.tagName,
          textContent: el.textContent?.trim().substring(0, 50),
          className: el.className,
          cursor: window.getComputedStyle(el).cursor,
          hasOnclick: !!el.onclick
        }))
      };
    });
    
    console.log('📊 Button Analysis Results:');
    console.log('Total buttons:', buttonAnalysis.totalButtons);
    console.log('Total role="button":', buttonAnalysis.totalRoleButtons);
    console.log('Total touchable elements:', buttonAnalysis.totalTouchableElements);
    console.log('Total clickable:', buttonAnalysis.totalClickable);
    
    console.log('\n🔘 Button Details:');
    buttonAnalysis.buttonDetails.forEach((btn, i) => {
      console.log(`Button ${i + 1}:`, btn);
    });
    
    console.log('\n🔘 Role Button Details:');
    buttonAnalysis.roleButtonDetails.forEach((btn, i) => {
      console.log(`Role Button ${i + 1}:`, btn);
    });
    
    console.log('\n🔘 Touchable Element Details (first 5):');
    buttonAnalysis.touchableDetails.slice(0, 5).forEach((el, i) => {
      console.log(`Touchable ${i + 1}:`, el);
    });
    
    // Try to find Sign In specifically
    const signInSearch = await page.evaluate(() => {
      const textElements = Array.from(document.querySelectorAll('*')).filter(el => 
        el.textContent?.includes('Sign In') || 
        el.textContent?.includes('Sign in') ||
        el.textContent?.includes('LOGIN') ||
        el.textContent?.includes('Submit')
      );
      
      return textElements.map(el => ({
        tagName: el.tagName,
        textContent: el.textContent?.trim(),
        className: el.className,
        clickable: el.tagName === 'BUTTON' || el.getAttribute('role') === 'button' || !!el.onclick,
        testId: el.getAttribute('testId') || el.getAttribute('data-testid')
      }));
    });
    
    console.log('\n🔍 Elements containing "Sign In" text:');
    signInSearch.forEach((el, i) => {
      console.log(`Sign In Element ${i + 1}:`, el);
    });
    
    await page.screenshot({ path: 'button-analysis.png', fullPage: true });
    console.log('📸 Screenshot saved as button-analysis.png');
    
    return buttonAnalysis;
    
  } catch (error) {
    console.error('❌ Analysis failed:', error.message);
    return null;
  } finally {
    await browser.close();
  }
}

analyzeLoginButtons().then(result => {
  console.log('🎯 Button analysis complete');
  process.exit(0);
});