import { chromium } from "playwright";
import fs from "fs";

const URL = "https://makerworld.com/en/@Davson_Art";

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto(URL, { waitUntil: "networkidle", timeout: 60000 });

  // czekamy aż pojawią się statystyki
  await page.waitForSelector("div", { timeout: 30000 });

  const stats = await page.evaluate(() => {
    const text = document.body.innerText;

    const getNumber = (regex) => {
      const m = text.match(regex);
      if (!m) return 0;
      return m[1].includes("k")
        ? Math.round(parseFloat(m[1]) * 1000)
        : parseInt(m[1]);
    };

    return {
      points: getNumber(/(\d{3,4})\s*points/i),
      boosts: getNumber(/(\d+)\s*boost/i),
      likes: getNumber(/(\d+)\s*like/i),
      downloads: getNumber(/(\d+(\.\d+)?k?)\s*download/i),
      views: getNumber(/(\d+)\s*view/i),
      updated: new Date().toISOString()
    };
  });

  fs.writeFileSync("stats.json", JSON.stringify(stats, null, 2));
  console.log("Saved stats:", stats);

  await browser.close();
})();
