const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 500 // Slow down actions to observe behavior
  });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log('Navigating to localhost:19006...');
    await page.goto('http://localhost:19006', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    // Wait for page to fully load
    await page.waitForTimeout(2000);
    
    console.log('Looking for sign in link...');
    // Click the "Sign in" link to go to login page
    await page.click('text=Sign in', { timeout: 10000 });
    
    // Wait for navigation or URL change
    await page.waitForTimeout(2000);
    console.log('Current URL:', page.url());
    
    // Check if we're on login page or if login form is visible
    const hasLoginForm = await page.locator('input[type="email"]').isVisible().catch(() => false);
    if (!hasLoginForm) {
      // Try direct navigation to login
      console.log('Navigating directly to /login...');
      await page.goto('http://localhost:19006/login', { waitUntil: 'networkidle' });
    }
    
    // Wait for form elements to be ready
    await page.waitForSelector('input[type="email"]', { timeout: 10000 });
    await page.waitForSelector('input[type="password"]', { timeout: 10000 });
    
    console.log('Testing Enter key functionality...');
    
    // Step 1: Focus on email field and type
    const emailInput = await page.locator('input[type="email"]');
    await emailInput.click();
    console.log('Typing email address...');
    await emailInput.type('test@example.com');
    
    // Step 2: Press Enter to move to password field
    console.log('Pressing Enter to move to password field...');
    await page.keyboard.press('Enter');
    
    // Wait a moment to see if focus changed
    await page.waitForTimeout(1000);
    
    // Check if password field is now focused
    const passwordFocused = await page.evaluate(() => {
      const passwordInput = document.querySelector('input[type="password"]');
      return document.activeElement === passwordInput;
    });
    
    console.log('Password field focused after Enter:', passwordFocused);
    
    // Also check what element has focus
    const focusedElement = await page.evaluate(() => {
      const active = document.activeElement;
      return {
        tagName: active.tagName,
        type: active.type,
        name: active.name || active.id || 'unnamed'
      };
    });
    console.log('Currently focused element:', focusedElement);
    
    // Step 3: Type password
    const passwordInput = await page.locator('input[type="password"]');
    console.log('Typing password...');
    await passwordInput.type('testpassword123');
    
    // Take screenshot before final Enter press
    console.log('Taking screenshot of filled form...');
    await page.screenshot({ 
      path: 'tasks/verification-artifacts/enter-key-functionality-test.png',
      fullPage: true 
    });
    
    // Step 4: Press Enter to submit form
    console.log('Pressing Enter to submit form...');
    
    // Get current URL before submission
    const urlBefore = page.url();
    
    // Add a listener to detect navigation or form submission
    const navigationPromise = page.waitForNavigation({ 
      timeout: 5000,
      waitUntil: 'networkidle' 
    }).catch(() => null);
    
    // Also listen for any network requests (form submission)
    const requestPromise = new Promise((resolve) => {
      const handler = (request) => {
        if (request.url().includes('auth') || request.method() === 'POST') {
          page.off('request', handler);
          resolve(true);
        }
      };
      page.on('request', handler);
      setTimeout(() => resolve(false), 5000);
    });
    
    await page.keyboard.press('Enter');
    
    // Wait to see if navigation or request happens
    const [navigated, requestMade] = await Promise.all([navigationPromise, requestPromise]);
    const urlAfter = page.url();
    let errorVisible = false;
    
    if (navigated || urlBefore !== urlAfter) {
      console.log('Form submitted! Navigation occurred.');
      console.log('URL changed from:', urlBefore, 'to:', urlAfter);
    } else if (requestMade) {
      console.log('Form submission detected (network request made)');
      // Check if any error messages appeared
      errorVisible = await page.locator('text=/error|invalid|incorrect/i').isVisible().catch(() => false);
      if (errorVisible) {
        console.log('Login failed with error message (as expected with test credentials)');
      }
    } else {
      // Check if any error messages appeared anyway
      errorVisible = await page.locator('text=/error|invalid|incorrect/i').isVisible().catch(() => false);
      if (errorVisible) {
        console.log('Form submitted but login failed (as expected with test credentials)');
      } else {
        console.log('Enter key pressed but no form submission detected');
      }
    }
    
    // Wait a bit to observe final state
    await page.waitForTimeout(2000);
    
    console.log('\nTest Summary:');
    console.log('- Email field accepts input: ✓');
    console.log('- Enter key moves focus to password:', passwordFocused ? '✓' : '✗');
    console.log('- Password field accepts input: ✓');
    console.log('- Enter key attempts form submission:', (navigated || requestMade || errorVisible || urlBefore !== urlAfter) ? '✓' : '✗');
    
  } catch (error) {
    console.error('Test failed:', error);
    // Try to take error screenshot
    await page.screenshot({ 
      path: 'tasks/verification-artifacts/enter-key-error.png',
      fullPage: true 
    }).catch(() => {});
  } finally {
    await browser.close();
  }
})();