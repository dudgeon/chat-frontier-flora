const puppeteer = require('puppeteer');

async function inspectCSS() {
  console.log('🔍 Inspecting CSS Generation...');

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1200, height: 800 }
  });

  const page = await browser.newPage();

  try {
    console.log('📍 Navigating to localhost:19006...');
    await page.goto('http://localhost:19006', {
      waitUntil: 'networkidle0',
      timeout: 30000
    });

    // Wait for page to load
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Inspect all stylesheets
    const cssAnalysis = await page.evaluate(() => {
      const stylesheets = Array.from(document.styleSheets);
      const analysis = {
        totalStylesheets: stylesheets.length,
        stylesheetSources: [],
        tailwindClasses: {
          widthClasses: [],
          heightClasses: [],
          backgroundClasses: [],
          borderRadiusClasses: []
        },
        allCSSRules: []
      };

      stylesheets.forEach((sheet, index) => {
        try {
          analysis.stylesheetSources.push({
            index,
            href: sheet.href || 'inline',
            title: sheet.title || 'untitled',
            rulesCount: sheet.cssRules ? sheet.cssRules.length : 0
          });

          if (sheet.cssRules) {
            Array.from(sheet.cssRules).forEach(rule => {
              if (rule.selectorText) {
                const selector = rule.selectorText;
                const cssText = rule.cssText;

                // Look for Tailwind utility classes
                if (selector.includes('.w-10')) analysis.tailwindClasses.widthClasses.push(cssText);
                if (selector.includes('.h-10')) analysis.tailwindClasses.heightClasses.push(cssText);
                if (selector.includes('.bg-red-500')) analysis.tailwindClasses.backgroundClasses.push(cssText);
                if (selector.includes('.rounded-lg')) analysis.tailwindClasses.borderRadiusClasses.push(cssText);

                // Collect all rules for analysis
                analysis.allCSSRules.push({
                  selector,
                  cssText: cssText.substring(0, 200) // Truncate for readability
                });
              }
            });
          }
        } catch (e) {
          console.log(`Could not access stylesheet ${index}: ${e.message}`);
        }
      });

      return analysis;
    });

    console.log('📊 CSS Analysis Results:');
    console.log(`Total Stylesheets: ${cssAnalysis.totalStylesheets}`);

    console.log('\n📄 Stylesheet Sources:');
    cssAnalysis.stylesheetSources.forEach(sheet => {
      console.log(`  ${sheet.index}: ${sheet.href} (${sheet.rulesCount} rules)`);
    });

    console.log('\n🎨 Tailwind Class Analysis:');
    console.log(`Width classes (.w-10): ${cssAnalysis.tailwindClasses.widthClasses.length}`);
    cssAnalysis.tailwindClasses.widthClasses.forEach(rule => console.log(`  ${rule}`));

    console.log(`Height classes (.h-10): ${cssAnalysis.tailwindClasses.heightClasses.length}`);
    cssAnalysis.tailwindClasses.heightClasses.forEach(rule => console.log(`  ${rule}`));

    console.log(`Background classes (.bg-red-500): ${cssAnalysis.tailwindClasses.backgroundClasses.length}`);
    cssAnalysis.tailwindClasses.backgroundClasses.forEach(rule => console.log(`  ${rule}`));

    console.log(`Border radius classes (.rounded-lg): ${cssAnalysis.tailwindClasses.borderRadiusClasses.length}`);
    cssAnalysis.tailwindClasses.borderRadiusClasses.forEach(rule => console.log(`  ${rule}`));

    // Check if any Tailwind base/utilities are present
    const tailwindPresence = await page.evaluate(() => {
      const stylesheets = Array.from(document.styleSheets);
      let hasTailwindBase = false;
      let hasTailwindUtilities = false;
      let sampleRules = [];

      stylesheets.forEach(sheet => {
        try {
          if (sheet.cssRules) {
            Array.from(sheet.cssRules).forEach(rule => {
              const cssText = rule.cssText;
              if (cssText.includes('--tw-')) hasTailwindBase = true;
              if (rule.selectorText && rule.selectorText.startsWith('.')) {
                const selector = rule.selectorText;
                if (selector.match(/\.(w-|h-|bg-|text-|p-|m-|flex|grid)/)) {
                  hasTailwindUtilities = true;
                  if (sampleRules.length < 10) {
                    sampleRules.push(`${selector}: ${rule.style.cssText || 'no styles'}`);
                  }
                }
              }
            });
          }
        } catch (e) {
          // Skip inaccessible stylesheets
        }
      });

      return { hasTailwindBase, hasTailwindUtilities, sampleRules };
    });

    console.log('\n🔧 Tailwind Presence Check:');
    console.log(`Has Tailwind CSS variables (--tw-*): ${tailwindPresence.hasTailwindBase}`);
    console.log(`Has Tailwind utility classes: ${tailwindPresence.hasTailwindUtilities}`);
    console.log('Sample utility rules:');
    tailwindPresence.sampleRules.forEach(rule => console.log(`  ${rule}`));

    // Save detailed analysis
    const fullAnalysis = {
      timestamp: new Date().toISOString(),
      cssAnalysis,
      tailwindPresence
    };

    require('fs').writeFileSync('css-inspection-analysis.json', JSON.stringify(fullAnalysis, null, 2));

    console.log('\n✅ CSS inspection complete!');
    console.log('📁 File created: css-inspection-analysis.json');

  } catch (error) {
    console.error('❌ Error during CSS inspection:', error);
  } finally {
    await browser.close();
  }
}

inspectCSS().catch(console.error);
