import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });

const context = await browser.newContext({
  userAgent:
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36'
});

const page = await context.newPage();

// 🔍 logujemy WSZYSTKIE odpowiedzi JSON
page.on('response', async (response) => {
  const url = response.url();
  const ct = response.headers()['content-type'] || '';

  if (ct.includes('application/json')) {
    try {
      const json = await response.json();
      console.log('JSON FROM:', url);
      console.log(JSON.stringify(json, null, 2).slice(0, 2000));
    } catch {
      // ignorujemy
    }
  }
});

await page.goto('https://makerworld.com/en/@Davson_Art', {
  waitUntil: 'domcontentloaded',
  timeout: 60000
});

// ⏳ DAJEMY STRONIE CZAS (Cloudflare + SPA)
await page.waitForTimeout(15000);

await browser.close();
