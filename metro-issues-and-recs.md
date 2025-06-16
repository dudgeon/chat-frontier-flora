# **Review of Webpack vs Metro Configuration**

Migrating Expo web bundling from Webpack to Metro requires replicating several key functionalities that the removed Webpack config was handling. The prior Webpack config included critical settings such as:

-   **Polyfills for Node modules:** Webpack was polyfilling Node core modules (e.g. crypto, stream, buffer) for the browser. These need to be aliased in Metro’s resolver (e.g. mapping crypto to crypto-browserify, etc.) .
-   **Environment variables:** Webpack’s DefinePlugin was inlining environment variables (like EXPO\_PUBLIC\_SUPABASE\_URL) into the bundle. Metro doesn’t do this by default. Expo’s Metro may rely on loading .env at runtime or using Expo config. Ensure that your Expo config or code loads needed env vars (e.g. via dotenv in metro.config or using Expo’s manifest constants).
-   **Tailwind CSS processing:** Webpack was running PostCSS with Tailwind to generate the CSS. In Metro, this is handled by NativeWind’s Metro plugin (withNativeWind), which runs Tailwind at bundle-time. It needs a correct tailwind.config.js path and the CSS file with @tailwind directives.
-   **HTML template and static assets:** Webpack dev server served a custom index.html (if any). Metro’s bundler uses a default static HTML page. If you had custom meta tags or scripts in the Webpack HTML template, these might need to be added to a public/index.html in the Expo project to override the default static file . (By default, placing files in a **static/** or **public/** folder will override Expo’s defaults.)

# **Metro Configuration for Expo Web + NativeWind**

To configure Metro for web with NativeWind v4, follow the official guidelines:

-   **Switch Expo to use Metro for web:** In **app.json**, set the web bundler to Metro. For example:

```
{
  "expo": {
    "web": {
      "bundler": "metro"
    }
  }
}
```

-   This ensures npx expo start --web uses Metro instead of Webpack .
-   **Metro config with NativeWind:** Use Expo’s default Metro config and wrap it with NativeWind’s plugin. For example in metro.config.js (at the project root or apps/web/metro.config.js as appropriate):

```
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const config = getDefaultConfig(__dirname);
module.exports = withNativeWind(config, { input: './global.css' });
```

-   This tells Metro to process global.css (containing Tailwind’s @tailwind base; @tailwind components; @tailwind utilities directives) during bundling . Ensure that global.css is imported in your app (e.g. at the top of your entry file or root component) so that it’s included in the bundle .
-   **Tailwind config path:** If your Tailwind config is in the monorepo root (e.g. ../../tailwind.config.js from the app directory), specify the configPath in the NativeWind plugin options, e.g.: withNativeWind(config, { input: './global.css', configPath: '../../tailwind.config.js' }). This resolves the “Cannot find module tailwind.config” error by pointing to the unified config.
-   **Polyfill Node modules in Metro:** Metro doesn’t automatically polyfill Node globals. Add resolver aliases for any Node core modules your app needs. For example, in metro.config.js:

```
config.resolver.alias = {
  ...config.resolver.alias,
  crypto: require.resolve('crypto-browserify'),
  stream: require.resolve('stream-browserify'),
  buffer: require.resolve('buffer')
};
```

-   This replicates Webpack’s fallback for those modules.
-   **Monorepo settings:** The root Metro config should already include watchFolders for packages and adjust nodeModulesPaths to resolve modules from the workspace root. (It looks like your root metro.config.js was correctly configured for the monorepo, which is good.) Double-check that expo/metro-config is being used, as it handles React Native web asset extensions and platform resolution.
-   **Babel config:** Ensure the Babel config has the NativeWind preset and React Native Reanimated plugin as before (this was done already per the logs). This affects transformation but likely isn’t the cause of the hang.

# **Identified Issue: Metro Bundler Unresponsive**

After configuring the above, the Metro dev server **starts** (listening on port 8081) but does not serve the app content. The logs show “**Waiting on http://localhost:8081**” with no further activity, and any requests (e.g. to /index.bundle or /index.html) time out. In other words, Metro is up but not producing a bundle when running expo start --web (with bundler=metro). This suggests the bundler isn’t being triggered to compile the web app.

Potential causes for this “stuck” behavior:

-   **No initial request for the bundle:** Unlike Webpack Dev Server (which automatically serves an index page), Metro waits for a client request for the bundle. If Expo’s CLI didn’t open a browser or request the bundle, Metro would sit idle. In the Expo SDK 50 workflow, running npx expo start --web should launch the app, but there have been reports of it simply logging “Web is waiting on http://localhost:8081” without opening the app in a browser . Manually opening the correct URL or triggering the request is needed.
-   **Incorrect URL or missing HTML:** Hitting http://localhost:8081/ directly may return a JSON status or nothing, since Metro’s dev server isn’t a full web server. Expo usually provides an HTML page (either a default or from public/index.html) that includes the web bundle. If the CLI didn’t open the page automatically, you might need to manually open it. Try visiting **http://localhost:8081/index.html** or **http://localhost:8081/** in a browser _after_ starting Expo – if a JSON blob appears, that’s the Metro packager status, not the app. Instead, the correct address might be served on a different port or path. Often, Expo’s dev server for web (when using Metro) will use **web/index.html** on port 8081 or fallback to a default HTML. Ensure a request is made to load the bundle (e.g. http://localhost:8081/index.bundle?platform=web&dev=true for development) to trigger compilation .
-   **NativeWind plugin hang:** It’s possible the withNativeWind Tailwind processing is hanging or failing silently. A misconfiguration in Tailwind (such as an invalid path in content or a huge glob slowing it down) could cause the bundler to stall. However, if there were an error in Tailwind CSS processing, we’d expect Metro to log it. Still, this is worth testing by elimination (see Debugging steps below).
-   **Missing Expo runtime import:** For Expo SDK ≥49, when using Metro for web **without Expo Router**, you should manually import the Expo Metro runtime to handle bundle loading and ensure Fast Refresh works. Adding import '@expo/metro-runtime' at the top of your entry file (e.g. index.ts) is recommended . This runtime is included by default if you use Expo Router, but in a custom setup it must be imported manually. Its absence could potentially affect Hot Reload or code-splitting, though it shouldn’t completely prevent initial bundle load. It’s still a good practice to include it.
-   **Dev server not triggered via CLI:** If you run expo start --web non-interactively (as an npm script), the CLI might not auto-open the web. Running expo start in interactive mode and pressing **w** (for web) can sometimes work better, as it ensures the CLI requests the web bundle and opens a browser. This could reveal on-screen errors or logs that weren’t visible before.

# **Recommendations: Debugging Steps and Fixes**

To get **Claude code** (the automation) back on track, here are systematic tests and actions to perform:

**1\. Verify Expo Config for Web Metro:** Double-check that app.json/app.config.js has "web": { "bundler": "metro" } set . This seems to be done (since Metro did start), but confirming it ensures we’re using the intended bundler.

**2\. Add Expo Metro runtime import:** In your web entry file (e.g. apps/web/index.ts), add:

```
import '@expo/metro-runtime';
```

at the very top (before importing App). This will enable the chunk loader runtime and Fast Refresh for Metro web . It’s a no-op if already loaded, but important for completeness. After adding, restart the dev server.

**3\. Start Expo in interactive mode (for a one-time test):** Instead of npm run web, run just npx expo start (without the \--web flag) in the project. This should launch the Expo Dev Tools terminal UI. From there, press **w** to start the web bundler. Watch the terminal for any compilation output or errors. This interactive flow often provides more insight:

-   If the bundle compiles, the CLI will usually open a browser window. See if the app appears, or if any error is shown in the browser console.
-   If an error occurs during bundle, it will appear in the terminal. For example, a missing module or syntax error would be logged in red. This might give a clue if something is failing silently when run headless.
**4\. Manually request the web bundle:** If the above still doesn’t yield anything, try manually loading the bundle URL to force Metro to compile:

-   Open a browser (or use a tool like curl) to **http://localhost:8081/index.bundle?platform=web&dev=true&hot=false** (hot can be true/false). This is the typical endpoint Metro serves for the JS bundle.
-   If Metro is functioning, this should trigger a compilation. Monitor the terminal for logs like _“Bundling index.ts”_ or any errors. If you get a JavaScript blob back (or a large JSON if dev), that means the bundle was served. Any visible error or blank screen can then be debugged from the browser console.
-   **Tip:** The expo CLI might also serve an index.html that references the bundle. Try http://localhost:8081/index.html after starting – if it downloads a JSON, that indicates no static HTML was served (perhaps a bug in the CLI).
**5\. Test without the NativeWind plugin:** To isolate if withNativeWind is causing the stall, temporarily edit metro.config.js to **bypass NativeWind**. For example, export the config directly from getDefaultConfig (with your polyfills and watchFolders) _without_ wrapping withNativeWind. Also comment out the CSS import in your App to avoid any unknown CSS handling.

-   Restart Expo and trigger the web build. If the app now responds (even if unstyled), then the issue likely lies in the NativeWind Tailwind pipeline.
-   Possible causes in that case: an infinite loop or extremely slow Tailwind compile. Check the **tailwind.config.js** content paths – are they correct and not scanning unnecessary files? (Your unified config looked comprehensive and correct for apps/\* and packages/\*). Also ensure tailwindcss is at a compatible version (Tailwind 3.4+ as required by NativeWind).
-   If this test makes Metro responsive, try re-enabling withNativeWind but with a minimal Tailwind config (e.g., limit content paths to just one screen) to see if performance is an issue.
**6\. Inspect Metro logs in verbose mode:** Sometimes Metro can run with verbose logging. You can prepend EXPO\_DEBUG=true to the start command, e.g., EXPO\_DEBUG=true npx expo start --web, to get more internal logs. This might print additional information about what Metro is doing or waiting for.

**7\. Ensure dependencies are installed correctly:** You mentioned installing @expo/metro-runtime. Likewise, verify that **nativewind, tailwindcss, react-native-safe-area-context, react-native-reanimated** etc. are installed in the correct places (some in root, some as dev deps). A missing peer could cause Metro to hang if it’s waiting for something (though usually it would error). Based on the logs, these were handled, but double-check versions match (NativeWind v4 and Tailwind CSS v3.4+).

**8\. Consider the Expo CLI version:** Are you using the latest Expo SDK (50 or above) and CLI? Expo’s Metro web support is relatively new and improving. The GitHub issue about the web app showing JSON instead of loading (Expo SDK 50) suggests it might have been a bug . Ensure you have updated expo-cli (or the expo package if using the local CLI via npx expo). If a bug is suspected, upgrading to the latest patch release of SDK 50 (or 51, if available) could resolve it.

**9\. No Webpack re-introduction (as decided):** It’s wise to stick with Metro now to avoid undoing the NativeWind integration. The good news is that **using Metro bundler for web is possible without Expo Router** – many have done it successfully with React Navigation and custom setups. So we’ll focus on fixing Metro rather than falling back to Webpack. (Expo is moving away from Webpack, so this effort is aligned with future support.)

**10\. Check for runtime errors once it loads:** Once you succeed in getting Metro to serve the app, be prepared to handle any runtime issues:

\- If Tailwind classes don’t appear to work, it could be that the CSS wasn’t injected. Ensure the <View style={{ $$css: true, \_: "class" }}> technique isn’t needed (NativeWind v4 should handle it automatically). Also confirm the babel-preset-expo with jsxImportSource "nativewind" is working (if JSX transforms were wrong, styles wouldn’t apply).

\- If environment variables are undefined in the browser, that means Metro did not inline them. Expo will only inline variables starting with **EXPO\_PUBLIC\_**\* in the web bundle . If you still see process.env.X in the compiled code, you might need to use a different approach (for example, using expo-constants or manually replacing them). But this is secondary to getting the bundle to load.

# **Next Actions**

Based on the above, here’s a plan to get things back on track:

-   **Step 1:** Add the missing Expo Metro runtime import and ensure the Metro config is correct (as per NativeWind docs) one more time. Save all changes and clear Metro’s cache (expo start -c) to start fresh.
-   **Step 2:** Run Expo in a way that triggers the web build (interactive or manually hitting the URL) and observe the behavior. If still stuck, proceed to Step 3.
-   **Step 3:** Remove the NativeWind plugin temporarily to see if Metro can serve a basic app. If yes, focus on Tailwind/NW issues; if no, focus on Metro/Expo issues.
-   **Step 4:** Apply fixes accordingly:
    -   If the plugin is at fault, adjust Tailwind config or plugin usage (perhaps update NativeWind to latest, etc., or use Tailwind CLI as a fallback to generate static CSS for web).
    -   If Metro is at fault (no plugin), gather more info (enable debug, update Expo CLI, etc.).
-   **Step 5:** Once the app responds, verify that styling works on web (Tailwind classes taking effect). Then run **expo start** on iOS/Android to ensure nothing in the Metro config broke native bundling. The NativeWind v4 config should equally apply to native (it will ignore the CSS on native and use StyleSheet, as designed).

Throughout this process, take it incrementally and keep an eye on the console output. Each change/test can reveal a new clue. The aim is to reach the point where **Metro serves the web app** and NativeWind’s styles are applied correctly. Given that others have successfully migrated to Metro bundler for web without using Expo Router , we know it’s achievable. It’s likely a small configuration detail or quirk of the Expo CLI causing the holdup.

**Reminder (Lessons Learned):** In hindsight, capturing the Webpack config’s behaviors before removal was crucial. Going forward, apply those learnings:

-   Reintroduce features one by one (and test each) rather than all at once. For example, once Metro serves a “Hello World” app, then enable NativeWind and confirm Tailwind works, rather than changing everything and debugging blindly.
-   Keep the migration log updated in real-time so you and the AI agent stay in sync on which changes are applied (preventing confusion about unsaved edits).

By systematically testing the above, Claude code should be able to pinpoint the cause and fix the Metro web bundling issue. Once Metro is serving the web app, you can proceed to run smoke tests (both web and native) to ensure the unified Metro setup with NativeWind v4 is fully functional.
