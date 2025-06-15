# Webpack Configuration Guidelines for **NativeWind v4**

These recommendations assume **React Native Web ≥ 0.17**, **Webpack 4 or 5**, and that you already have `nativewind`, `tailwindcss`, `react-native-reanimated`, and `react-native-safe-area-context` installed.

---

## 1 · Core Prerequisites

| Requirement | Why it matters |
|-------------|----------------|
| **Tailwind CSS with the `nativewind` preset** | NativeWind’s compiler relies on Tailwind’s CLI/output. |
| **React Native Web** ≥ 0.17 | Provides `StyleSheet` ↔︎ CSS bridge. |
| **Automatic JSX runtime** with `jsxImportSource: "nativewind"` | Ensures JSX transforms inject `nativewind`’s styling helpers. |

---

## 2 · Update `tailwind.config.js`

```js
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require("nativewind/preset")],
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    // any other paths containing classNames
  ],
  theme: {
    extend: {},
  },
};
```

---

## 3 · Configure Babel (via `babel.config.js`)

```js
module.exports = {
  presets: [
    ["babel-preset-expo", { jsxImportSource: "nativewind" }], // or @babel/preset-react
    "nativewind/babel",                                       // **preset** – not a plugin
  ],
  plugins: [
    "react-native-reanimated/plugin",
  ],
};
```

---

## 4 · Minimal `webpack.config.js` snippet

```js
// webpack.config.js
const path = require("path");

module.exports = {
  mode: process.env.NODE_ENV ?? "development",

  entry: "./index.web.js",          // your web entry point
  output: { filename: "bundle.js", path: path.resolve(__dirname, "dist") },

  resolve: {
    alias: {                         // map RN imports to the web implementation
      "react-native$": "react-native-web",
    },
    extensions: [
      ".web.tsx", ".web.ts", ".web.jsx", ".web.js",
      ".tsx", ".ts", ".jsx", ".js",
    ],
  },

  module: {
    rules: [
      /** Transpile JS/TS (including uncompiled RN deps) **/
      {
        test: /\.[jt]sx?$/,
        include: [
          path.resolve(__dirname, "src"),
          // 🛠 add specific node_modules that ship un-transpiled JS
          /node_modules\/(nativewind|react-native|react-native-reanimated|react-native-safe-area-context)/,
        ],
        use: {
          loader: "babel-loader",
          options: { cacheDirectory: true },
        },
      },

      /** Process global CSS (Tailwind) **/
      {
        test: /\.css$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: { importLoaders: 1 },
          },
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [
                  require("tailwindcss"),
                  require("autoprefixer"),
                ],
              },
            },
          },
        ],
      },
    ],
  },

  devServer: {
    static: path.resolve(__dirname, "public"),
    hot: true,
    port: 8080,
    historyApiFallback: true,
  },
};
```

> **Expo Web users:** Expo CLI still defaults to **Webpack 4**. Pin loaders (`css-loader@5`, `postcss-loader@4`, etc.) to the latest versions that *explicitly* support Webpack 4, or opt-in to Expo’s experimental Webpack 5 behaviour.
> Make sure HMR remains enabled (`devServer.hot = true`) for rapid style tweaking.

---

## 5 · Import the generated stylesheet once

Add the following at the top level of your web entry (e.g. `index.web.js`):

```js
import "nativewind/css";   // exposes the Tailwind output
```

---

## 6 · Troubleshooting Checklist

1. **Tailwind sanity check**
   Render `<div class="w-10 h-10 bg-red-500" />` — you should see a red square.
2. **React Native Web sanity check**
   Render
   ```jsx
   <View style={{ $$css: true, test: "w-10 h-10 bg-blue-500" }} />
   ```
   You should see a blue square.
3. **JSX runtime** — if the square above fails, confirm `jsxImportSource: "nativewind"` and that Babel is using the automatic runtime.
4. **Un-transpiled modules** — Webpack errors such as “Unexpected token <” often indicate a React-Native package that ships ESNext code. Add it to the `include` list (or use `babel-loader`’s `@svgr/webpack` work-around).
5. **Expo + Webpack 4 loader mismatch** — double-check loader major versions; `css-loader@6` will silently fail on Webpack 4.
6. **Storybook** — pass `babelPresets: ['nativewind/babel']` and `babelPresetReactOptions: { jsxImportSource: 'nativewind' }` in `.storybook/main.js`, and add `nativewind` to `modulesToTranspile`.

---

## 7 · CI Hints

* Cache `tailwindcss` CLI output (`postcss-loader` respects `NODE_ENV=production`).
* Generate the CSS **once** during build (`tailwindcss -i ./src/index.css -o ./dist/tailwind.css`) and reference the file in the Webpack entry to simplify serverless deployments.
* Enforce lint-time checks with `eslint-plugin-tailwindcss`.

---

## 8 · Reference Versions

| Package | Suggested Version |
|---------|------------------|
| nativewind | `^4.x` |
| tailwindcss | `^3.4` |
| react-native-web | `^0.19` |
| webpack | 4 (via Expo) **or** 5+ |
| babel-loader | `^9` (works with Babel 8) |
| postcss-loader | `^7` (v4 if using Webpack 4) |

---

### Done ✔︎
