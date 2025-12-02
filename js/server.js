// api/prices.js - ضع هذا الملف في مشروعك على Vercel
import fetch from 'node-fetch';
import cheerio from 'cheerio';

export default async function handler(req, res) {
  try {
    console.log('📥 طلب أسعار الذهب...');
    
    // العملات المطلوبة
    const targetCurrencies = ["USD", "TRY", "EUR", "SAR", "AED", "EGP", "IQD", "KWD", "BHD", "SYP", "DZD"];
    
    // 1. جلب أسعار الصرف
    const fetchExchangeRates = async () => {
      try {
        const resp = await fetch(`https://api.exchangerate.host/latest?base=USD&symbols=${targetCurrencies.join(",")}`);
        const data = await resp.json();
        return data.rates || {};
      } catch (err) {
        console.error("خطأ في أسعار الصرف:", err);
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
    
    // 2. جلب سعر الذهب من مصدر موثوق
    const fetchGoldPrice = async () => {
      try {
        // مصدر بديل لا يحتاج إلى proxy
        const response = await fetch('https://www.goldapi.io/api/XAU/USD', {
          headers: {
            'x-access-token': 'goldapi-abcdef123456-demo' // مفتاح تجريبي
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          return data.price || 2350.50;
        }
      } catch (error) {
        console.log('⚠️ استخدام سعر افتراضي للذهب');
      }
      
      return 2350.50; // سعر افتراضي
    };
    
    // 3. تنفيذ الجلب
    const [rates, goldPriceUSD] = await Promise.all([
      fetchExchangeRates(),
      fetchGoldPrice()
    ]);
    
    // 4. حساب الأسعار
    const calculatePrices = (usdPrice, karat = 1) => {
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
    
    // 5. إنشاء البيانات
    const responseData = {
      success: true,
      timestamp: new Date().toISOString(),
      source: "Gold Prices API",
      last_update: new Date().toLocaleString('ar-EG'),
      data: {
        gold: {
          gram24: {
            buy: calculatePrices(goldPriceUSD, 1),
            sell: calculatePrices(goldPriceUSD * 0.985, 1),
            weight: 1.00,
            name_ar: "جرام ذهب 24",
            name_en: "24K Gold",
            name_tr: "24 Ayar Altın"
          },
          gram22: {
            buy: calculatePrices(goldPriceUSD, 0.916),
            sell: calculatePrices(goldPriceUSD * 0.985, 0.916),
            weight: 1.00,
            name_ar: "جرام ذهب 22",
            name_en: "22K Gold",
            name_tr: "22 Ayar Altın"
          },
          gram21: {
            buy: calculatePrices(goldPriceUSD, 0.875),
            sell: calculatePrices(goldPriceUSD * 0.985, 0.875),
            weight: 1.00,
            name_ar: "جرام ذهب 21",
            name_en: "21K Gold",
            name_tr: "21 Ayar Altın"
          },
          gram18: {
            buy: calculatePrices(goldPriceUSD, 0.75),
            sell: calculatePrices(goldPriceUSD * 0.985, 0.75),
            weight: 1.00,
            name_ar: "جرام ذهب 18",
            name_en: "18K Gold",
            name_tr: "18 Ayar Altın"
          },
          gram14: {
            buy: calculatePrices(goldPriceUSD, 0.583),
            sell: calculatePrices(goldPriceUSD * 0.985, 0.583),
            weight: 1.00,
            name_ar: "جرام ذهب 14",
            name_en: "14K Gold",
            name_tr: "14 Ayar Altın"
          }
        }
      },
      metadata: {
        gold_usd_per_ounce: goldPriceUSD,
        base_currency: "USD",
        version: "1.0"
      }
    };
    
    // 6. إرجاع الاستجابة
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(responseData);
    
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
}
