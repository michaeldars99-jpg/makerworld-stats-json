import { chromium } from 'playwright';
import fs from 'fs';

const browser = await chromium.launch({ headless: true });

const context = await browser.newContext({
  userAgent:
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36'
});

const page = await context.newPage();

// ⬇️ TU PRZECHWYTUJEMY KONKRETNY RESPONSE
const profilePromise = page.waitForResponse(
  (response) =>
    response.url().includes('/user-service/user/profile') &&
    response.status() === 200,
  { timeout: 60000 }
);

await page.goto('https://makerworld.com/en/@Davson_Art', {
  waitUntil: 'domcontentloaded',
  timeout: 60000
});

// ⬇️ Czekamy aż frontend pobierze profil
const profileResponse = await profilePromise;
const profileJson = await profileResponse.json();

console.log('PROFILE JSON:', JSON.stringify(profileJson, null, 2));

// ⬇️ (na razie tylko zapis surowy – za chwilę go sparsujemy)
fs.writeFileSync('stats.json', JSON.stringify(profileJson, null, 2));

await browser.close();
