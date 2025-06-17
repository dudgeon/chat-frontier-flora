# Test info

- Name: 🏠 Stagehand Authentication Flow [Localhost] >> 🏠 Complete signup and authentication flow on Localhost
- Location: /Users/geoffreydudgeon/Documents/Cursor Projects/chat-frontier-flora/e2e/stagehand-auth-test.spec.ts:97:7

# Error details

```
Error: proxy.goto: Target page, context or browser has been closed
Call log:
  - navigating to "http://localhost:19006/login", waiting until "load"

    at _StagehandPage.<anonymous> (/Users/geoffreydudgeon/Documents/Cursor Projects/chat-frontier-flora/node_modules/@browserbasehq/stagehand/dist/index.js:3152:85)
    at /Users/geoffreydudgeon/Documents/Cursor Projects/chat-frontier-flora/node_modules/@browserbasehq/stagehand/dist/index.js:79:61
    at __async (/Users/geoffreydudgeon/Documents/Cursor Projects/chat-frontier-flora/node_modules/@browserbasehq/stagehand/dist/index.js:63:10)
    at Proxy.goto (/Users/geoffreydudgeon/Documents/Cursor Projects/chat-frontier-flora/node_modules/@browserbasehq/stagehand/dist/index.js:3150:40)
    at /Users/geoffreydudgeon/Documents/Cursor Projects/chat-frontier-flora/e2e/stagehand-auth-test.spec.ts:105:16
```

# Test source

```ts
   5 |
   6 | // Load test credentials from .env.stagehand file
   7 | config({ path: '.env.stagehand' });
   8 |
   9 | /**
   10 |  * 🎭 STAGEHAND AUTHENTICATION FLOW TESTS
   11 |  *
   12 |  * This test suite automatically detects the environment and includes it in test names
   13 |  * for clear reporting while maintaining a single unified test file.
   14 |  *
   15 |  * 🛡️ CRITICAL: 3-PHASE TEST ARCHITECTURE FOR FALSE FAILURE PREVENTION
   16 |  *
   17 |  * This test uses a 3-phase architecture to prevent cleanup errors from causing false failures:
   18 |  *
   19 |  * PHASE 1: CORE FUNCTIONALITY (MUST PASS)
   20 |  * - Authentication flow execution
   21 |  * - User verification and state checking
   22 |  * - Critical success assertions
   23 |  * - 🚨 THROWS ERRORS on failure (real issues)
   24 |  *
   25 |  * PHASE 2: SECONDARY FEATURES (NON-CRITICAL)
   26 |  * - Profile menu interactions
   27 |  * - Logout functionality testing
   28 |  * - 📝 LOGS WARNINGS ONLY (environmental issues)
   29 |  *
   30 |  * PHASE 3: CLEANUP (NON-CRITICAL)
   31 |  * - Final state capture for debugging
   32 |  * - Resource cleanup operations
   33 |  * - 📝 NEVER FAILS TESTS (cleanup errors are expected)
   34 |  *
   35 |  * KEY PRINCIPLE: If Phase 1 passes, the test is successful regardless of later phases.
   36 |  *
   37 |  * ⚠️ WARNING: DO NOT add 'throw error' statements to Phase 2 or 3
   38 |  * See docs/TEST_FAILURE_PREVENTION_STRATEGY.md for complete details
   39 |  */
   40 |
   41 | // Dynamic environment detection
   42 | function getEnvironmentInfo() {
   43 |   const deployPreviewUrl = process.env.DEPLOY_PREVIEW_URL;
   44 |   const testProduction = process.env.TEST_PRODUCTION === 'true';
   45 |
   46 |   if (testProduction) {
   47 |     return {
   48 |       name: 'Production',
   49 |       baseUrl: 'https://frontier-family-flora.netlify.app',
   50 |       icon: '🌐'
   51 |     };
   52 |   } else if (deployPreviewUrl) {
   53 |     return {
   54 |       name: 'Preview',
   55 |       baseUrl: deployPreviewUrl,
   56 |       icon: '🔍'
   57 |     };
   58 |   } else {
   59 |     return {
   60 |       name: 'Localhost',
   61 |       baseUrl: 'http://localhost:19006',
   62 |       icon: '🏠'
   63 |     };
   64 |   }
   65 | }
   66 |
   67 | // Get environment info once at module load
   68 | const ENV = getEnvironmentInfo();
   69 |
   70 | // Dynamic test suite with environment-aware naming
   71 | test.describe(`${ENV.icon} Stagehand Authentication Flow [${ENV.name}]`, () => {
   72 |   let stagehand: Stagehand;
   73 |
   74 |   test.beforeEach(async () => {
   75 |     // Initialize Stagehand with our OpenAI API key
   76 |     stagehand = new Stagehand({
   77 |       env: 'LOCAL',
   78 |       apiKey: process.env.OPENAI_API_KEY,
   79 |       modelName: 'gpt-4o-mini', // Cost-effective model for testing
   80 |       modelClientOptions: {
   81 |         apiKey: process.env.OPENAI_API_KEY,
   82 |       },
   83 |     });
   84 |
   85 |     await stagehand.init();
   86 |     console.log(`🎭 Initializing Stagehand tests for ${ENV.name} environment (${ENV.baseUrl})`);
   87 |   });
   88 |
   89 |   test.afterEach(async () => {
   90 |     // 🛡️ PROTECTION: This cleanup MUST be wrapped in try/catch if it ever becomes complex
   91 |     // Browser context closure can fail in some environments
   92 |     // If this section grows, ensure it cannot fail the test
   93 |     await stagehand.close();
   94 |   });
   95 |
   96 |   // Core authentication test with environment in name
   97 |   test(`${ENV.icon} Complete signup and authentication flow on ${ENV.name}`, async () => {
   98 |     // Increase timeout for authentication flow which involves network requests
   99 |     test.setTimeout(300000); // 5 minutes for multi-browser testing
  100 |     console.log(`🎭 Testing Stagehand-powered authentication flow on ${ENV.name}...`);
  101 |
  102 |     const page = stagehand.page;
  103 |
  104 |     // Navigate directly to login page to avoid form detection complexity
> 105 |     await page.goto(`${ENV.baseUrl}/login`);
      |                ^ Error: proxy.goto: Target page, context or browser has been closed
  106 |
  107 |     // Core Functionality Phase (Must Pass)
  108 |     console.log('🎯 Phase 1: Core Functionality Testing');
  109 |
  110 |     try {
  111 |       // Wait for login form to load
  112 |       const pageLoadPromise = page.act('wait until the login form is visible');
  113 |       await Promise.race([
  114 |         pageLoadPromise,
  115 |         new Promise((_, reject) =>
  116 |           setTimeout(() => reject(new Error('Login page load timeout after 15s')), 15000)
  117 |         )
  118 |       ]);
  119 |
  120 |       console.log('✅ Login form loaded – proceeding with authentication test');
  121 |
  122 |       // Use existing test credentials from .env.stagehand for login
  123 |       const testEmail = process.env.TEST_LOGIN_EMAIL;
  124 |       const testPassword = process.env.TEST_LOGIN_PASSWORD;
  125 |
  126 |       if (!testEmail || !testPassword) {
  127 |         throw new Error('TEST_LOGIN_EMAIL and TEST_LOGIN_PASSWORD must be set in .env.stagehand');
  128 |       }
  129 |
  130 |       console.log(`📝 Logging in with: ${testEmail} on ${ENV.name}`);
  131 |
  132 |       // Fill out the login form using natural language with timeout
  133 |       const formFillPromise = (async () => {
  134 |         await page.act(`fill in the email field with "${testEmail}"`);
  135 |         await page.act(`fill in the password field with "${testPassword}"`);
  136 |         // Ensure form fields are properly "touched" by clicking outside or pressing tab
  137 |         await page.act('click outside the form fields to trigger validation');
  138 |       })();
  139 |
  140 |       await Promise.race([
  141 |         formFillPromise,
  142 |         new Promise((_, reject) =>
  143 |           setTimeout(() => reject(new Error('Form fill timeout after 15s')), 15000)
  144 |         )
  145 |       ]);
  146 |
  147 |       // Extract form state to verify everything is filled correctly
  148 |       const formState = await page.extract({
  149 |         instruction: 'extract the current state of the login form',
  150 |         schema: z.object({
  151 |           submitButtonEnabled: z.boolean().describe('whether the submit/login button is enabled'),
  152 |           emailFilled: z.boolean().describe('whether the email field is filled'),
  153 |           passwordFilled: z.boolean().describe('whether the password field is filled'),
  154 |         }),
  155 |       });
  156 |
  157 |       console.log(`📊 ${ENV.name} login form state:`, formState);
  158 |
  159 |       // Core validation - submit button must be enabled
  160 |       expect(formState.submitButtonEnabled).toBe(true);
  161 |
  162 |       // 🛡️ ROBUST BUTTON INTERACTION: Multi-strategy approach to prevent button text changes from breaking tests
  163 |       // This comprehensive approach handles all possible button states and text variations
  164 |       const submitButtonInteraction = async () => {
  165 |         // First, validate button state before attempting interaction
  166 |         const buttonState = await page.extract({
  167 |           instruction: 'analyze the submit button state before clicking',
  168 |           schema: z.object({
  169 |             isVisible: z.boolean().describe('whether the submit button is visible'),
  170 |             isEnabled: z.boolean().describe('whether the submit button is enabled'),
  171 |             buttonText: z.string().describe('the current text on the submit button'),
  172 |             isLoading: z.boolean().describe('whether the button shows loading state'),
  173 |           }),
  174 |         });
  175 |
  176 |         console.log(`🔍 Button state before interaction on ${ENV.name}:`, buttonState);
  177 |
  178 |         // Log button state for debugging but don't fail on visibility
  179 |         // React Native Web buttons may not be detected as "visible" by AI but still work
  180 |         console.log(`🔍 Button detection: visible=${buttonState.isVisible}, enabled=${buttonState.isEnabled}, text="${buttonState.buttonText}"`);
  181 |         
  182 |         if (!buttonState.isEnabled && buttonState.buttonText !== 'Sign In') {
  183 |           throw new Error(`Submit button is disabled. Current text: "${buttonState.buttonText}"`);
  184 |         }
  185 |
  186 |         // Try direct Playwright click first, then fall back to Stagehand AI
  187 |         console.log(`🎯 Attempting direct Playwright click on submit button`);
  188 |         try {
  189 |           // Use direct Playwright selector for React Native Web testID
  190 |           await page.click('[data-testid="submit-button"]');
  191 |           console.log(`✅ Direct Playwright click successful`);
  192 |           
  193 |           // Add wait for login process to start
  194 |           await new Promise(resolve => setTimeout(resolve, 1000));
  195 |           
  196 |         } catch (directClickError) {
  197 |           console.log(`⚠️ Direct click failed: ${directClickError}. Trying Stagehand AI strategies...`);
  198 |           
  199 |           // Fallback to Stagehand AI strategies
  200 |           const strategies = [
  201 |             'click the button with text "Sign In"',
  202 |             'click the submit button at the bottom of the form',
  203 |             'click the blue button that submits the login form'
  204 |           ];
  205 |
```