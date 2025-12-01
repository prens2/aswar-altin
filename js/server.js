// server.js
import express from "express";
import fetch from "node-fetch";
import cheerio from "cheerio";

const app = express();
const PORT = process.env.PORT || 3000;

// العملات المطلوبة للتحويل
const targetCurrencies = ["USD", "TRY", "EUR", "SAR", "AED", "EGP", "IQD", "KWD", "BHD"];

// جلب أسعار الصرف
const fetchExchangeRates = async () => {
  try {
    const resp = await fetch(`https://api.exchangerate.host/latest?base=USD&symbols=${targetCurrencies.join(",")}`);
    const data = await resp.json();
    return data.rates || {};
  } catch (err) {
    console.error("خطأ في جلب أسعار الصرف:", err);
    return targetCurrencies.reduce((acc, c) => ({ ...acc, [c]: 1 }), {});
  }
};

// تحويل العملات
const convertCurrency = (usdPrice, rates) => {
  const result = {};
  for (const c of targetCurrencies) {
    result[c] = +(usdPrice * (rates[c] || 1)).toFixed(2);
  }
  return result;
};

// جلب أسعار الذهب والفضة من Investing.com
const fetchPrices = async () => {
  const urls = {
    gold: "https://www.investing.com/commodities/gold",
    silver: "https://www.investing.com/commodities/silver",
  };

  const getPrice = async (url) => {
    const html = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } }).then(r => r.text());
    const $ = cheerio.load(html);
    const priceText = $(".instrument-price_last__KQzyA").first().text().replace(/,/g, "");
    return parseFloat(priceText);
  };

  const [goldPriceUSD, silverPriceUSD] = await Promise.all([getPrice(urls.gold), getPrice(urls.silver)]);
  const rates = await fetchExchangeRates();

  // الذهب
  const gold = {
    gram_24k: { buy: convertCurrency(goldPriceUSD, rates), sell: convertCurrency(goldPriceUSD * 0.985, rates) },
    gram_22k: { buy: convertCurrency(goldPriceUSD * 0.916, rates), sell: convertCurrency(goldPriceUSD * 0.916 * 0.985, rates) },
    gram_21k: { buy: convertCurrency(goldPriceUSD * 0.875, rates), sell: convertCurrency(goldPriceUSD * 0.875 * 0.985, rates) },
    gram_18k: { buy: convertCurrency(goldPriceUSD * 0.75, rates), sell: convertCurrency(goldPriceUSD * 0.75 * 0.985, rates) },
    gram_14k: { buy: convertCurrency(goldPriceUSD * 0.583, rates), sell: convertCurrency(goldPriceUSD * 0.583 * 0.985, rates) },
    gold_coin: { buy: convertCurrency(goldPriceUSD * 7.008, rates), sell: convertCurrency(goldPriceUSD * 7.008 * 0.985, rates) },
    half_gold_coin: { buy: convertCurrency(goldPriceUSD * 3.504, rates), sell: convertCurrency(goldPriceUSD * 3.504 * 0.985, rates) },
    quarter_gold_coin: { buy: convertCurrency(goldPriceUSD * 1.752, rates), sell: convertCurrency(goldPriceUSD * 1.752 * 0.985, rates) },
    ounce: { buy: convertCurrency(goldPriceUSD * 31.1035, rates), sell: convertCurrency(goldPriceUSD * 31.1035 * 0.985, rates) },
  };

  // الفضة
  const silver = {
    gram: { buy: convertCurrency(silverPriceUSD, rates), sell: convertCurrency(silverPriceUSD * 0.95, rates) },
    ounce: { buy: convertCurrency(silverPriceUSD * 31.1035, rates), sell: convertCurrency(silverPriceUSD * 31.1035 * 0.95, rates) },
  };

  return { gold, silver };
};

// API endpoint
app.get("/prices", async (req, res) => {
  try {
    const prices = await fetchPrices();
    res.json({ success: true, timestamp: new Date().toISOString(), source: "Investing.com", ...prices });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


