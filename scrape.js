import { chromium } from 'playwright';

const url = 'https://makerworld.com/en/@Davson_Art';

const browser = await chromium.launch({ headless: true });

const context = await browser.newContext({
  userAgent:
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36'
});

const page = await context.newPage();



await page.goto(url, {
  waitUntil: 'domcontentloaded',
  timeout: 60000
});

await page.waitForTimeout(3000);
const stats = await page.evaluate(async () => {
  const res = await fetch(
    'https://makerworld.com/api/v1/user-service/user/profile?username=Davson_Art'
  );
  return await res.json();
});

console.log('RAW STATS:', JSON.stringify(stats, null, 2));




// 🔎 TEST – potwierdzenie że strona się załadowała
console.log('PAGE TITLE:', await page.title());

const content = await page.content();
console.log(content.slice(0, 2000));


await browser.close();





