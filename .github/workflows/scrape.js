import { chromium } from "playwright";
import fs from "fs";

const URL = "https://makerworld.com/en/@Davson_Art";

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto(URL, { waitUntil: "networkidle", timeout: 60000 });

  const data = await page.evaluate(() => {
    const nums = [...document.querySelectorAll("span")]
      .map(e => e.innerText.trim())
      .filter(t => /^\d+(\.\d+)?k?$/.test(t));

    const toNum = v =>
      v?.includes("k") ? Math.round(parseFloat(v) * 1000) : parseInt(v || "0");

    return {
      boosts: toNum(nums[0]),
      likes: toNum(nums[1]),
      downloads: toNum(nums[2]),
      views: toNum(nums[3])
    };
  });

  const stats = {
    points: data.likes + data.downloads,
    ...data,
    updated: new Date().toISOString()
  };

  fs.writeFileSync("stats.json", JSON.stringify(stats, null, 2));
  await browser.close();
})();
