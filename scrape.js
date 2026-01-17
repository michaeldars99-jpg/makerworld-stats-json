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
const stats = await page.evaluate(async () => {
  const getStat = (label) => {
    const el = Array.from(document.querySelectorAll('*'))
      .find(e => e.textContent?.trim() === label);

    if (!el) return 0;

    const container = el.closest('div');
    if (!container) return 0;

    const match = container.textContent.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  };

  return {
    points: getStat('Points'),
    likes: getStat('Likes'),
    downloads: getStat('Downloads'),
    views: getStat('Views'),
    updated: new Date().toISOString()
  };
});



console.log('FINAL STATS:', stats);

// 💾 ZAPIS DO PLIKU
fs.writeFileSync('stats.json', JSON.stringify(stats, null, 2));

await browser.close();


