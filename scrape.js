import fetch from "node-fetch";
import * as cheerio from "cheerio";
import fs from "fs";

const URL = "https://makerworld.com/en/@Davson_Art";

async function run() {
  const res = await fetch(URL, {
    headers: {
      "User-Agent": "Mozilla/5.0"
    }
  });

  const html = await res.text();
  const $ = cheerio.load(html);

  const numbers = [];

  $("span").each((_, el) => {
    const t = $(el).text().trim();
    if (/^\d+(\.\d+)?k?$/.test(t)) {
      numbers.push(t);
    }
  });

  const boosts = parseInt(numbers[0] ?? "0");
  const likes = parseInt(numbers[1] ?? "0");

  const downloads = numbers[2]?.includes("k")
    ? Math.round(parseFloat(numbers[2]) * 1000)
    : parseInt(numbers[2] ?? "0");

  const views = parseInt(numbers[3] ?? "0");

  const pointsMatch = $("body").text().match(/\b\d{3,4}\b/);
  const points = pointsMatch ? parseInt(pointsMatch[0]) : 0;

  const data = {
    points,
    boosts,
    likes,
    downloads,
    views,
    updated: new Date().toISOString()
  };

  fs.writeFileSync("stats.json", JSON.stringify(data, null, 2));
  console.log("Zapisano stats.json", data);
}

run();
