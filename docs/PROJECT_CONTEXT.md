# PROJECT CONTEXT - CHAT FRONTIER FLORA

## 🚨 **CRITICAL: ENVIRONMENT FILES LOCATION**

**MANDATORY CHECK BEFORE ANY ENVIRONMENT VARIABLE WORK:**

### **Environment Files That EXIST:**
- **`.env`** - Located in ROOT directory (hidden file, use `ls -la` to see)
  - Contains: SUPABASE_URL, EXPO_PUBLIC_SUPABASE_URL, EXPO_PUBLIC_SUPABASE_ANON_KEY, OPENAI_API_KEY, NETLIFY_AUTH_TOKEN
  - Used by: Local development, copied to apps/web during build
  - Status: ✅ EXISTS - DO NOT CLAIM IT DOESN'T EXIST

### **Environment File Check Commands:**
```bash
# ALWAYS run these commands FIRST when dealing with env vars:
ls -la | grep env                    # Shows .env file in root
cat .env                            # Shows contents (if accessible)
ls -la apps/web/ | grep env          # Check for local .env files
```

### **Environment Variable Loading:**
- **Local Development**: `.env` copied to `apps/web/.env` via `cp ../../.env .env` in package.json scripts
- **Netlify Deployment**: Environment variables set in `netlify.toml` [build.environment] section
- **Never assume**: Always verify with commands above

## CRITICAL ENVIRONMENT SETUP

### ✅ CONFIRMED: .env FILE EXISTS AND IS WORKING
- **Location**: Root directory (`/Users/geoffreydudgeon/Documents/Cursor Projects/chat-frontier-flora/.env`)
- **Web Directory**: Also copied to `apps/web/.env` during build process
- **Evidence**: Terminal logs consistently show:
  ```
  > cp ../../.env .env 2>/dev/null || true && expo start --web
  env: load .env
  env: export SUPABASE_URL SUPABASE_ANON_KEY SUPABASE_DB_PASSWORD EXPO_PUBLIC_SUPABASE_URL EXPO_PUBLIC_SUPABASE_ANON_KEY EXPO_SUPABASE_DB_PASSWORD OPENAI_API_KEY NETLIFY_AUTH_TOKEN NETLIFY_SITE_ID
  ```
- **Status**: Environment variables ARE being loaded at server level
- **DO NOT**: Question the existence of this file or try to create it
- **DO NOT**: Claim the .env file doesn't exist - IT DOES EXIST

### 🚨 CURRENT CRITICAL ISSUE: SYNTAX ERROR IN SUPABASE.TS
- **Problem**: Export statements inside conditional blocks (invalid JavaScript)
- **Error**:
  ```
  ERROR in ./src/lib/supabase.ts:23:2
  Syntax error: 'import' and 'export' may only appear at the top level.
  > 23 |   export const supabase = createClient<Database>(placeholderUrl, placeholderKey);
  ```
- **Location**: `apps/web/src/lib/supabase.ts`
- **Fix Required**: Move all export statements to top level, use conditional logic inside

### ⚠️ SECONDARY ISSUES (After fixing syntax error):
1. **Crypto Module Resolution**: `Can't resolve 'crypto'` in expo-modules-core
2. **Environment Variables**: Not reaching web bundle despite being loaded
3. **Webpack Configuration**: Missing polyfills and module resolution

### PROJECT STRUCTURE
```
chat-frontier-flora/
├── .env                          # ✅ EXISTS - Contains all environment variables
├── package.json                  # Root workspace configuration
├── apps/
│   ├── web/
│   │   ├── .env                  # ✅ EXISTS - Copied from root during build
│   │   ├── App.tsx               # ✅ EXISTS - Main app component
│   │   ├── package.json          # Web app configuration
│   │   └── src/
│   │       ├── lib/
│   │       │   └── supabase.ts   # 🚨 HAS SYNTAX ERROR - NEEDS IMMEDIATE FIX
│   │       └── contexts/
│   └── mobile/
└── packages/
    ├── ui/
    └── shared/
```

## CURRENT ISSUES (as of latest browser console output)

### 1. ⚠️ PRIORITY: Environment Variables Not Passed to Web Bundle
- **Error**: `EXPO_PUBLIC_SUPABASE_URL: undefined`
- **Location**: Browser runtime
- **Cause**: Expo web configuration not properly loading environment variables
- **Status**: NEEDS IMMEDIATE FIX

### 2. ✅ RESOLVED: Syntax Error in supabase.ts
- **Previous Error**: `'import' and 'export' may only appear at the top level`
- **Status**: Fixed - export statements moved to top level

### 3. VM Module Warning (Non-critical)
- **Warning**: `Module not found: Can't resolve 'vm'`
- **Location**: `asn1.js/lib/asn1/api.js:21`
- **Status**: Warning only, not blocking

## WORKING COMMANDS
- **Start dev server**: `npm run dev:web` (from root)
- **Alternative**: `cd apps/web && npm run web`
- **Environment loading**: ✅ Working at server level, ❌ Not reaching web bundle

## WHAT NOT TO DO
1. ❌ Do NOT question the existence of .env files
2. ❌ Do NOT try to create new .env files
3. ❌ Do NOT use file search tools to look for .env files
4. ❌ Do NOT assume environment variables aren't loading at server level

## WHAT TO DO
1. ✅ Trust the terminal output showing env variables are loaded at server level
2. ✅ Focus on fixing the Expo web configuration to pass env vars to bundle
3. ✅ Reference this file before making assumptions about project setup
4. ⚠️ Fix the environment variable passing to web bundle (CURRENT PRIORITY)

## LAST UPDATED
Updated after confirming env vars load at server but don't reach web bundle.
