const puppeteer = require('puppeteer');

async function inspectCSS() {
  console.log('🔍 Inspecting CSS content for NativeWind classes...');
  
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  try {
    console.log('🌐 Navigating to localhost:19006...');
    await page.goto('http://localhost:19006', { waitUntil: 'networkidle2' });
    
    console.log('⏱️ Waiting for page to load...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Get all stylesheets and their content
    const cssContent = await page.evaluate(() => {
      const stylesheets = Array.from(document.styleSheets);
      const cssData = [];
      
      for (let i = 0; i < stylesheets.length; i++) {
        const sheet = stylesheets[i];
        let rules = [];
        
        try {
          const cssRules = sheet.cssRules || sheet.rules;
          if (cssRules) {
            for (let j = 0; j < cssRules.length; j++) {
              const rule = cssRules[j];
              if (rule.cssText) {
                rules.push(rule.cssText);
              }
            }
          }
        } catch (e) {
          rules.push(`Error accessing rules: ${e.message}`);
        }
        
        cssData.push({
          href: sheet.href || 'inline',
          rulesCount: rules.length,
          rules: rules
        });
      }
      
      return cssData;
    });
    
    console.log('\n📄 CSS Stylesheets Analysis:');
    cssContent.forEach((sheet, i) => {
      console.log(`\n${i + 1}. Stylesheet: ${sheet.href}`);
      console.log(`   Rules count: ${sheet.rulesCount}`);
      
      // Look for NativeWind/Tailwind classes
      const nativeWindRules = sheet.rules.filter(rule => 
        rule.includes('bg-blue-500') || 
        rule.includes('w-10') || 
        rule.includes('h-10') ||
        rule.includes('!bg-blue-500') ||
        rule.includes('!w-10') ||
        rule.includes('!h-10')
      );
      
      if (nativeWindRules.length > 0) {
        console.log('   ✅ NativeWind classes found:');
        nativeWindRules.forEach(rule => {
          console.log(`      ${rule}`);
        });
      } else {
        console.log('   ❌ No NativeWind classes found');
        
        // Show first few rules as sample
        if (sheet.rules.length > 0) {
          console.log('   Sample rules:');
          sheet.rules.slice(0, 3).forEach(rule => {
            console.log(`      ${rule.substring(0, 100)}...`);
          });
        }
      }
    });
    
    // Check if Tailwind base styles are present
    console.log('\n🎨 Checking for Tailwind base styles...');
    const hasTailwindBase = await page.evaluate(() => {
      const allRules = Array.from(document.styleSheets).flatMap(sheet => {
        try {
          const cssRules = sheet.cssRules || sheet.rules;
          return cssRules ? Array.from(cssRules).map(rule => rule.cssText) : [];
        } catch (e) {
          return [];
        }
      });
      
      return {
        hasReset: allRules.some(rule => rule.includes('*,::before,::after') || rule.includes('box-sizing')),
        hasTailwindVariables: allRules.some(rule => rule.includes('--tw-') || rule.includes(':root')),
        totalRules: allRules.length,
        sampleRules: allRules.slice(0, 5)
      };
    });
    
    console.log(`Tailwind reset: ${hasTailwindBase.hasReset ? '✅' : '❌'}`);
    console.log(`Tailwind variables: ${hasTailwindBase.hasTailwindVariables ? '✅' : '❌'}`);
    console.log(`Total CSS rules: ${hasTailwindBase.totalRules}`);
    
    if (hasTailwindBase.sampleRules.length > 0) {
      console.log('Sample CSS rules:');
      hasTailwindBase.sampleRules.forEach(rule => {
        console.log(`   ${rule.substring(0, 100)}...`);
      });
    }
    
    await page.screenshot({ path: 'css-inspection-analysis.png', fullPage: true });
    
  } catch (error) {
    console.error('❌ Error during CSS inspection:', error.message);
    await page.screenshot({ path: 'css-inspection-error.png', fullPage: true });
  } finally {
    await browser.close();
  }
}

inspectCSS().catch(console.error);