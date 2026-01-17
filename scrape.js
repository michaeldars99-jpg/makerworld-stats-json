import { chromium } from 'playwright';

const url = 'https://makerworld.com/en/@Davson_Art';

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

await page.waitForTimeout(5000);
const response = await page.request.get(
  'https://makerworld.com/api/v1/user-service/user/profile?username=Davson_Art',
  {
    headers: {
      'accept': 'application/json',
      'user-agent':
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36'
    }
  }
);

const stats = await response.json();
console.log('RAW STATS:', JSON.stringify(stats, null, 2));



console.log('RAW STATS:', JSON.stringify(stats, null, 2));




// 🔎 TEST – potwierdzenie że strona się załadowała
console.log('PAGE TITLE:', await page.title());

const content = await page.content();
console.log(content.slice(0, 2000));


await browser.close();






