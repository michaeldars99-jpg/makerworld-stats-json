import { chromium } from 'playwright';
import fs from 'fs';

const browser = await chromium.launch({ headless: true });

const context = await browser.newContext({
  userAgent:
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36'
});

const page = await context.newPage();

await page.goto('https://makerworld.com/en/@Davson_Art', {
  waitUntil: 'domcontentloaded',
  timeout: 60000
});

// ⏳ DAJEMY STRONIE CZAS NA DYNAMICZNE RENDEROWANIE
await page.waitForTimeout(8000);

// 🔍 WYCIĄGAMY LICZBY Z UI
const stats = await page.evaluate(() => {
  const candidates = Object.entries(window)
    .filter(([key]) =>
      key.toLowerCase().includes('state') ||
      key.toLowerCase().includes('store') ||
      key.toLowerCase().includes('nuxt') ||
      key.toLowerCase().includes('app')
    )
    .map(([key, value]) => ({ key, value }));

  return candidates.map(c => c.key);
});

console.log('WINDOW STATE KEYS:', stats);




console.log('FINAL STATS:', stats);

// 💾 ZAPIS DO PLIKU
fs.writeFileSync('stats.json', JSON.stringify(stats, null, 2));

await browser.close();



