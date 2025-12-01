// server.js
import express from "express";
import puppeteer from "puppeteer";

const app = express();
const PORT = process.env.PORT || 3000;

// العملات المطلوبة للتحويل
const targetCurrencies = ["USD", "TRY", "EUR", "SAR", "AED", "EGP", "IQD", "KWD", "BHD"];

// دالة تحويل الأسعار للعملات (مثال ثابت)
const convertCurrency = (usdPrice) => {
  const rates = {
    USD: 1,
    TRY: 35,
    EUR: 0.95,
    SAR: 3.75,
    AED: 3.67,
    EGP: 30.5,
    IQD: 1450,
    KWD: 0.31,
    BHD: 0.38,
  };
  const result = {};
  for (const c of targetCurrencies) {
    result[c] = +(usdPrice * (rates[c] || 1)).toFixed(2);
  }
  return result;
};

// دالة لجلب الأسعار من Investing.com
const fetchPrices = async () => {
  const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });
  const page = await browser.newPage();

  // الذهب
  await page.goto("https://www.investing.com/commodities/gold", { waitUntil: "networkidle2" });
  const goldPriceUSD = await page.$eval(
    ".instrument-price_last__KQzyA",
    el => parseFloat(el.innerText.replace(/,/g, ""))
  );

  // الفضة
  await page.goto("https://www.investing.com/commodities/silver", { waitUntil: "networkidle2" });
  const silverPriceUSD = await page.$eval(
    ".instrument-price_last__KQzyA",
    el => parseFloat(el.innerText.replace(/,/g, ""))
  );

  await browser.close();

  // حساب الذهب بالعيارات المختلفة والقطع
  const gold = {
    gram_24k: { buy: convertCurrency(goldPriceUSD), sell: convertCurrency(goldPriceUSD * 0.985) },
    gram_22k: { buy: convertCurrency(goldPriceUSD * 0.916), sell: convertCurrency(goldPriceUSD * 0.916 * 0.985) },
    gram_21k: { buy: convertCurrency(goldPriceUSD * 0.875), sell: convertCurrency(goldPriceUSD * 0.875 * 0.985) },
    gram_18k: { buy: convertCurrency(goldPriceUSD * 0.75), sell: convertCurrency(goldPriceUSD * 0.75 * 0.985) },
    gram_14k: { buy: convertCurrency(goldPriceUSD * 0.583), sell: convertCurrency(goldPriceUSD * 0.583 * 0.985) },

    gold_coin: { buy: convertCurrency(goldPriceUSD * 7.008), sell: convertCurrency(goldPriceUSD * 7.008 * 0.985) },
    half_gold_coin: { buy: convertCurrency(goldPriceUSD * 3.504), sell: convertCurrency(goldPriceUSD * 3.504 * 0.985) },
    quarter_gold_coin: { buy: convertCurrency(goldPriceUSD * 1.752), sell: convertCurrency(goldPriceUSD * 1.752 * 0.985) },

    ounce: { buy: convertCurrency(goldPriceUSD * 31.1035), sell: convertCurrency(goldPriceUSD * 31.1035 * 0.985) },
  };

  // الفضة
  const silver = {
    gram: { buy: convertCurrency(silverPriceUSD), sell: convertCurrency(silverPriceUSD * 0.95) },
    ounce: { buy: convertCurrency(silverPriceUSD * 31.1035), sell: convertCurrency(silverPriceUSD * 31.1035 * 0.95) },
  };

  return { gold, silver };
};

// إعداد API
app.get("/prices", async (req, res) => {
  try {
    const prices = await fetchPrices();
    res.json({ success: true, timestamp: new Date().toISOString(), source: "Investing.com", ...prices });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


