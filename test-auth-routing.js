/**
 * Puppeteer Test: Authentication Routing Verification
 * 
 * Tests the real app authentication routing functionality:
 * - Root / shows AuthFlow (login/signup forms) when unauthenticated
 * - /login route shows LoginForm component
 * - /chat route redirects to / when unauthenticated
 * - NativeWind styling verification
 */

const puppeteer = require('puppeteer');

async function testAuthRouting() {
  console.log('🚀 Starting Authentication Routing Test...');
  
  const browser = await puppeteer.launch({ 
    headless: false,
    defaultViewport: { width: 1280, height: 720 }
  });
  
  try {
    const page = await browser.newPage();
    
    // Enable console logging
    page.on('console', msg => console.log('🌐 PAGE LOG:', msg.text()));
    page.on('pageerror', error => console.log('❌ PAGE ERROR:', error.message));
    
    console.log('\n📍 Test 1: Root route (/) shows AuthFlow for unauthenticated users');
    await page.goto('http://localhost:8081', { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Check if we see signup/login forms
    const authFlowElements = await page.evaluate(() => {
      // Look for auth form elements using proper selectors
      const buttons = Array.from(document.querySelectorAll('button'));
      const signUpButton = buttons.find(btn => btn.textContent.includes('Sign Up'));
      const signInButton = buttons.find(btn => btn.textContent.includes('Sign In'));
      
      const emailInput = document.querySelector('input[type="email"]') || 
                        Array.from(document.querySelectorAll('input')).find(input => 
                          input.placeholder && input.placeholder.toLowerCase().includes('email'));
      const passwordInput = document.querySelector('input[type="password"]') ||
                           Array.from(document.querySelectorAll('input')).find(input => 
                             input.placeholder && input.placeholder.toLowerCase().includes('password'));
      
      return {
        hasSignUpButton: !!signUpButton,
        hasSignInButton: !!signInButton,
        hasEmailInput: !!emailInput,
        hasPasswordInput: !!passwordInput,
        title: document.title,
        bodyText: document.body.innerText.substring(0, 500),
        buttonTexts: buttons.map(btn => btn.textContent).filter(text => text.trim()),
        inputTypes: Array.from(document.querySelectorAll('input')).map(input => ({
          type: input.type,
          placeholder: input.placeholder
        }))
      };
    });
    
    console.log('✅ Root route results:', authFlowElements);
    
    console.log('\n📍 Test 2: /login route shows LoginForm component');
    await page.goto('http://localhost:8081/login', { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const loginPageElements = await page.evaluate(() => {
      const emailInput = document.querySelector('input[type="email"]') || 
                        Array.from(document.querySelectorAll('input')).find(input => 
                          input.placeholder && input.placeholder.toLowerCase().includes('email'));
      const passwordInput = document.querySelector('input[type="password"]') ||
                           Array.from(document.querySelectorAll('input')).find(input => 
                             input.placeholder && input.placeholder.toLowerCase().includes('password'));
      
      const buttons = Array.from(document.querySelectorAll('button'));
      const loginButton = buttons.find(btn => 
        btn.textContent.includes('Sign In') || 
        btn.textContent.includes('Login') ||
        btn.type === 'submit'
      );
      
      return {
        hasEmailInput: !!emailInput,
        hasPasswordInput: !!passwordInput,
        hasLoginButton: !!loginButton,
        url: window.location.pathname,
        bodyText: document.body.innerText.substring(0, 500),
        buttonTexts: buttons.map(btn => btn.textContent).filter(text => text.trim())
      };
    });
    
    console.log('✅ /login route results:', loginPageElements);
    
    console.log('\n📍 Test 3: /chat route redirects to / when unauthenticated');
    await page.goto('http://localhost:8081/chat', { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const chatPageRedirect = await page.evaluate(() => {
      return {
        finalUrl: window.location.pathname,
        isRedirectedToRoot: window.location.pathname === '/',
        bodyText: document.body.innerText.substring(0, 200)
      };
    });
    
    console.log('✅ /chat redirect results:', chatPageRedirect);
    
    console.log('\n📍 Test 4: NativeWind styling verification');
    await page.goto('http://localhost:8081', { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const stylingCheck = await page.evaluate(() => {
      // Check for NativeWind-generated styles
      const elements = document.querySelectorAll('*');
      let nativeWindClasses = 0;
      let hasComputedStyles = 0;
      
      elements.forEach(el => {
        const classes = el.className;
        if (typeof classes === 'string' && classes.includes('-')) {
          nativeWindClasses++;
        }
        
        const computedStyle = window.getComputedStyle(el);
        if (computedStyle.backgroundColor !== 'rgba(0, 0, 0, 0)' || 
            computedStyle.color !== 'rgb(0, 0, 0)' ||
            computedStyle.padding !== '0px' ||
            computedStyle.margin !== '0px') {
          hasComputedStyles++;
        }
      });
      
      return {
        totalElements: elements.length,
        elementsWithClasses: nativeWindClasses,
        elementsWithStyles: hasComputedStyles,
        hasStylesheets: document.styleSheets.length > 0
      };
    });
    
    console.log('✅ NativeWind styling results:', stylingCheck);
    
    // Take screenshot for verification
    await page.screenshot({ path: 'auth-routing-test.png', fullPage: true });
    console.log('📸 Screenshot saved as auth-routing-test.png');
    
    console.log('\n🎉 Authentication Routing Test Complete!');
    
    return {
      rootRouteTest: authFlowElements,
      loginRouteTest: loginPageElements,
      chatRedirectTest: chatPageRedirect,
      stylingTest: stylingCheck
    };
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

// Run the test
testAuthRouting()
  .then(results => {
    console.log('\n📊 FINAL TEST RESULTS:');
    console.log(JSON.stringify(results, null, 2));
    process.exit(0);
  })
  .catch(error => {
    console.error('💥 Test suite failed:', error);
    process.exit(1);
  });