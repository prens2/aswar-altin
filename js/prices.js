// src/api/prices.js
import fetch from 'node-fetch';
import cheerio from 'cheerio';
import express from 'express';

const router = express.Router();

// العملات المطلوبة
const targetCurrencies = ["USD", "TRY", "EUR", "SAR", "AED", "EGP", "IQD", "KWD", "BHD", "SYP", "DZD"];

// 1. جلب أسعار الصرف
const fetchExchangeRates = async () => {
  try {
    const resp = await fetch(`https://api.exchangerate.host/latest?base=USD&symbols=${targetCurrencies.join(",")}`);
    const data = await resp.json();
    console.log('✅ أسعار الصرف:', data.rates);
    return data.rates || {};
  } catch (err) {
    console.error("❌ خطأ في أسعار الصرف:", err);
    // أسعار افتراضية
    return {
      "USD": 1.00,
      "TRY": 42.30,
      "EUR": 0.92,
      "SAR": 3.75,
      "AED": 3.67,
      "EGP": 47.89,
      "IQD": 1310.00,
      "KWD": 0.31,
      "BHD": 0.38,
      "SYP": 13000.00,
      "DZD": 134.50
    };
  }
};

// 2. جلب سعر الذهب
const fetchGoldPrice = async () => {
  const sources = [
    {
      name: 'GoldAPI',
      url: 'https://www.goldapi.io/api/XAU/USD',
      headers: { 'x-access-token': 'goldapi-abcdef123456-demo' },
      parser: (data) => data.price
    },
    {
      name: 'MetalPriceAPI',
      url: 'https://api.metalpriceapi.com/v1/latest?api_key=demo&base=USD&currencies=XAU',
      parser: (data) => 1 / data.rates.XAU
    },
    {
      name: 'Investing.com Fallback',
      url: 'https://www.investing.com/commodities/gold',
      parser: async (html) => {
        const $ = cheerio.load(html);
        const priceText = $('span[data-test="instrument-price-last"]').text().replace(/[^\d.]/g, '');
        return parseFloat(priceText) || 2350.50;
      }
    }
  ];

  for (const source of sources) {
    try {
      console.log(`🔍 محاولة ${source.name}...`);
      
      const response = await fetch(source.url, {
        headers: source.headers || {},
        timeout: 5000
      });

      if (response.ok) {
        if (source.name === 'Investing.com Fallback') {
          const html = await response.text();
          const price = await source.parser(html);
          if (price && price > 1000) {
            console.log(`✅ ${source.name}: $${price}`);
            return price;
          }
        } else {
          const data = await response.json();
          const price = source.parser(data);
          if (price && price > 1000) {
            console.log(`✅ ${source.name}: $${price}`);
            return price;
          }
        }
      }
    } catch (error) {
      console.log(`⚠️ ${source.name} فشل:`, error.message);
      continue;
    }
  }

  console.log('💰 استخدام السعر الافتراضي: $2350.50');
  return 2350.50;
};

// 3. حساب الأسعار
const calculatePrices = (usdPrice, rates, karat = 1) => {
  const result = {};
  const goldPricePerGram = usdPrice / 31.1035;
  const finalPrice = goldPricePerGram * karat;
  const spread = 0.015; // 1.5% فرق

  for (const currency of targetCurrencies) {
    const rate = rates[currency] || 1;
    const price = finalPrice * rate;
    result[currency] = {
      buy: +(price * (1 + spread/2)).toFixed(2),
      sell: +(price * (1 - spread/2)).toFixed(2)
    };
  }
  return result;
};

// 4. Route Handler
router.get('/', async (req, res) => {
  try {
    console.log('📥 طلب أسعار الذهب...');
    
    // جلب البيانات
    const [rates, goldPriceUSD] = await Promise.all([
      fetchExchangeRates(),
      fetchGoldPrice()
    ]);

    // إنشاء الاستجابة
    const responseData = {
      success: true,
      timestamp: new Date().toISOString(),
      source: "Gold Prices API - Render",
      last_update: new Date().toLocaleString('ar-EG'),
      data: {
        gold: {
          gram24: {
            buy: calculatePrices(goldPriceUSD, rates, 1),
            sell: calculatePrices(goldPriceUSD * 0.985, rates, 1),
            weight: 1.00,
            name_ar: "جرام ذهب 24",
            name_en: "24K Gold",
            name_tr: "24 Ayar Altın"
          },
          gram22: {
            buy: calculatePrices(goldPriceUSD, rates, 0.916),
            sell: calculatePrices(goldPriceUSD * 0.985, rates, 0.916),
            weight: 1.00,
            name_ar: "جرام ذهب 22",
            name_en: "22K Gold",
            name_tr: "22 Ayar Altın"
          },
          gram21: {
            buy: calculatePrices(goldPriceUSD, rates, 0.875),
            sell: calculatePrices(goldPriceUSD * 0.985, rates, 0.875),
            weight: 1.00,
            name_ar: "جرام ذهب 21",
            name_en: "21K Gold",
            name_tr: "21 Ayar Altın"
          },
          gram18: {
            buy: calculatePrices(goldPriceUSD, rates, 0.75),
            sell: calculatePrices(goldPriceUSD * 0.985, rates, 0.75),
            weight: 1.00,
            name_ar: "جرام ذهب 18",
            name_en: "18K Gold",
            name_tr: "18 Ayar Altın"
          },
          gram14: {
            buy: calculatePrices(goldPriceUSD, rates, 0.583),
            sell: calculatePrices(goldPriceUSD * 0.985, rates, 0.583),
            weight: 1.00,
            name_ar: "جرام ذهب 14",
            name_en: "14K Gold",
            name_tr: "14 Ayar Altın"
          },
          lira: {
            buy: calculatePrices(goldPriceUSD, rates, 7.32),
            sell: calculatePrices(goldPriceUSD * 0.985, rates, 7.32),
            weight: 7.32,
            name_ar: "ليرة ذهب",
            name_en: "Gold Lira",
            name_tr: "Altın Lira"
          },
          half: {
            buy: calculatePrices(goldPriceUSD, rates, 3.66),
            sell: calculatePrices(goldPriceUSD * 0.985, rates, 3.66),
            weight: 3.66,
            name_ar: "نصف ليرة",
            name_en: "Half Lira",
            name_tr: "Yarım Lira"
          },
          quarter: {
            buy: calculatePrices(goldPriceUSD, rates, 1.83),
            sell: calculatePrices(goldPriceUSD * 0.985, rates, 1.83),
            weight: 1.83,
            name_ar: "ربع ليرة",
            name_en: "Quarter Lira",
            name_tr: "Çeyrek Lira"
          },
          ounce: {
            buy: calculatePrices(goldPriceUSD, rates, 31.1035),
            sell: calculatePrices(goldPriceUSD * 0.985, rates, 31.1035),
            weight: 31.1035,
            name_ar: "أونصة ذهب",
            name_en: "Gold Ounce",
            name_tr: "Altın Ons"
          },
          silver: {
            buy: calculatePrices(goldPriceUSD * 0.012, rates, 1),
            sell: calculatePrices(goldPriceUSD * 0.012 * 0.95, rates, 1),
            weight: 1.00,
            name_ar: "فضة",
            name_en: "Silver",
            name_tr: "Gümüş"
          }
        }
      },
      metadata: {
        gold_usd_per_ounce: goldPriceUSD,
        base_currency: "USD",
        version: "2.0"
      }
    };

    // إرجاع الاستجابة
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json(responseData);

  } catch (error) {
    console.error('❌ خطأ في API:', error);
    
    // بيانات احتياطية
    const fallbackData = {
      success: false,
      timestamp: new Date().toISOString(),
      error: error.message,
      fallback: true,
      data: {
        gold: {
          gram24: {
            buy: { 
              USD: 2350.50, TRY: 99500.65, EUR: 2162.46, 
              SAR: 8814.38, AED: 8627.34, EGP: 112589.85, 
              IQD: 3080000, KWD: 728.66, BHD: 893.19, 
              SYP: 30606500, DZD: 316197.25 
            },
            sell: { 
              USD: 2315.74, TRY: 98028.14, EUR: 2130.12, 
              SAR: 8682.16, AED: 8497.93, EGP: 110920.20, 
              IQD: 3034800, KWD: 717.93, BHD: 879.64, 
              SYP: 30147500, DZD: 311454.19 
            },
            weight: 1.00,
            name_ar: "جرام ذهب 24",
            name_en: "24K Gold",
            name_tr: "24 Ayar Altın"
          }
        }
      }
    };
    
    res.status(200).json(fallbackData);
  }
});

export default router;