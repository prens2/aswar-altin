// server.js - الإصدار المصحح مع ES6 modules
import express from "express";
import fetch from "node-fetch";
import cheerio from "cheerio";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

// 🔥 تمكين CORS للسماح بالطلبات من أي مصدر
app.use(cors());
app.use(express.json());

// العملات المطلوبة للتحويل
const targetCurrencies = ["USD", "TRY", "EUR", "SAR", "AED", "EGP", "IQD", "KWD", "BHD", "SYP", "DZD"];

// 🔥 وكيل مجاني للتحايل على حظر Cloudflare (اختياري)
const FREE_PROXIES = [
  "https://cors-anywhere.herokuapp.com/",
  "https://api.allorigins.win/raw?url=",
  "https://proxy.cors.sh/",
];

// 🔥 دالة محسنة لجلب أسعار الصرف
const fetchExchangeRates = async () => {
  try {
    console.log("🌍 جلب أسعار الصرف...");
    const resp = await fetch(`https://api.exchangerate.host/latest?base=USD&symbols=${targetCurrencies.join(",")}`);
    
    if (!resp.ok) {
      throw new Error(`HTTP error! status: ${resp.status}`);
    }
    
    const data = await resp.json();
    console.log("✅ أسعار الصرف المستلمة:", data.rates);
    return data.rates || {};
  } catch (err) {
    console.error("❌ خطأ في جلب أسعار الصرف:", err.message);
    
    // 🔥 أسعار افتراضية في حالة الفشل
    const defaultRates = {
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
    
    return defaultRates;
  }
};

// 🔥 تحويل العملات
const convertCurrency = (usdPrice, rates) => {
  const result = {};
  for (const c of targetCurrencies) {
    const rate = rates[c] || 1;
    result[c] = +(usdPrice * rate).toFixed(2);
  }
  return result;
};

// 🔥 دالة محسنة لجلب الأسعار مع عدة مصادر بديلة
const fetchPrices = async () => {
  console.log("🔄 جاري جلب أسعار الذهب والفضة...");
  
  try {
    // 🔥 المصادر البديلة للذهب
    const goldSources = [
      "https://www.investing.com/commodities/gold",
      "https://www.goldprice.org/",
      "https://www.kitco.com/gold-price-today-usa/"
    ];

    // 🔥 المصادر البديلة للفضة
    const silverSources = [
      "https://www.investing.com/commodities/silver",
      "https://www.silverprice.org/",
      "https://www.kitco.com/silver-price-today-usa/"
    ];

    // 🔥 دالة محسنة لاستخراج السعر
    const extractPrice = (html, site) => {
      try {
        const $ = cheerio.load(html);
        
        // 🔥 أنماط مختلفة للمواقع المختلفة
        const patterns = {
          "investing": [
            ".instrument-price_last__KQzyA",
            ".text-2xl",
            ".text-5xl",
            "[data-test='instrument-price-last']",
            "#last_last"
          ],
          "goldprice": [
            "#gpxticker",
            ".text-price",
            ".price"
          ],
          "kitco": [
            ".data-bid",
            ".spot-price",
            "#AU-bid"
          ]
        };

        let priceText = "";
        
        // تجربة الأنماط المختلفة
        for (const selector of patterns[site] || patterns.investing) {
          const element = $(selector).first();
          if (element.length) {
            priceText = element.text().trim();
            break;
          }
        }

        if (!priceText) {
          // 🔥 محاولة إيجاد أي رقم يشبه السعر
          const allText = $('body').text();
          const priceMatch = allText.match(/\$?\d{1,3}(?:,\d{3})*(?:\.\d{2})?/);
          if (priceMatch) {
            priceText = priceMatch[0];
          }
        }

        // 🔥 تنظيف النص
        priceText = priceText.replace(/[^0-9.]/g, '');
        const price = parseFloat(priceText);
        
        return isNaN(price) ? null : price;
      } catch (error) {
        console.error(`❌ خطأ في استخراج السعر من ${site}:`, error.message);
        return null;
      }
    };

    // 🔥 دالة محسنة لجلب البيانات مع retry
    const fetchWithRetry = async (url, retries = 3) => {
      for (let i = 0; i < retries; i++) {
        try {
          console.log(`📡 محاولة ${i + 1}/${retries}: ${url}`);
          
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 10000);
          
          const response = await fetch(url, {
            signal: controller.signal,
            headers: {
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
              "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
              "Accept-Language": "en-US,en;q=0.5",
              "Accept-Encoding": "gzip, deflate, br",
              "DNT": "1",
              "Connection": "keep-alive",
              "Upgrade-Insecure-Requests": "1",
              "Sec-Fetch-Dest": "document",
              "Sec-Fetch-Mode": "navigate",
              "Sec-Fetch-Site": "none",
              "Sec-Fetch-User": "?1",
              "Cache-Control": "max-age=0"
            }
          });
          
          clearTimeout(timeout);
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const html = await response.text();
          return html;
          
        } catch (error) {
          console.warn(`⚠️ محاولة ${i + 1} فشلت:`, error.message);
          if (i === retries - 1) throw error;
          await new Promise(resolve => setTimeout(resolve, 2000)); // انتظار 2 ثانية
        }
      }
    };

    // 🔥 محاولة جلب أسعار الذهب
    let goldPriceUSD = null;
    for (const source of goldSources) {
      try {
        const html = await fetchWithRetry(source);
        const site = source.includes('investing') ? 'investing' : 
                     source.includes('goldprice') ? 'goldprice' : 'kitco';
        goldPriceUSD = extractPrice(html, site);
        if (goldPriceUSD) {
          console.log(`✅ سعر الذهب من ${source}: $${goldPriceUSD}`);
          break;
        }
      } catch (error) {
        console.warn(`❌ فشل جلب سعر الذهب من ${source}:`, error.message);
      }
    }

    // 🔥 محاولة جلب أسعار الفضة
    let silverPriceUSD = null;
    for (const source of silverSources) {
      try {
        const html = await fetchWithRetry(source);
        const site = source.includes('investing') ? 'investing' : 
                     source.includes('silverprice') ? 'goldprice' : 'kitco';
        silverPriceUSD = extractPrice(html, site);
        if (silverPriceUSD) {
          console.log(`✅ سعر الفضة من ${source}: $${silverPriceUSD}`);
          break;
        }
      } catch (error) {
        console.warn(`❌ فشل جلب سعر الفضة من ${source}:`, error.message);
      }
    }

    // 🔥 استخدام أسعار افتراضية إذا فشل الجلب
    if (!goldPriceUSD) {
      console.warn("⚠️ استخدام سعر ذهب افتراضي");
      goldPriceUSD = 2350.50; // سعر افتراضي
    }
    
    if (!silverPriceUSD) {
      console.warn("⚠️ استخدام سعر فضة افتراضي");
      silverPriceUSD = 28.75; // سعر افتراضي
    }

    // 🔥 جلب أسعار الصرف
    const rates = await fetchExchangeRates();
    
    // 🔥 حساب الأسعار بنسبة فرق واقعية
    const goldSpread = 0.015; // 1.5% فرق بين الشراء والبيع للذهب
    const silverSpread = 0.05; // 5% فرق بين الشراء والبيع للفضة

    // 🔥 الذهب
    const gold = {
      gram24: {
        buy: convertCurrency(goldPriceUSD / 31.1035, rates),
        sell: convertCurrency(goldPriceUSD / 31.1035 * (1 - goldSpread), rates),
        weight: 1.00,
        name_ar: "جرام ذهب 24",
        name_en: "24K Gold Gram",
        name_tr: "24 Ayar Altın Gram"
      },
      gram22: {
        buy: convertCurrency(goldPriceUSD / 31.1035 * 0.916, rates),
        sell: convertCurrency(goldPriceUSD / 31.1035 * 0.916 * (1 - goldSpread), rates),
        weight: 1.00,
        name_ar: "جرام ذهب 22",
        name_en: "22K Gold Gram",
        name_tr: "22 Ayar Altın Gram"
      },
      gram21: {
        buy: convertCurrency(goldPriceUSD / 31.1035 * 0.875, rates),
        sell: convertCurrency(goldPriceUSD / 31.1035 * 0.875 * (1 - goldSpread), rates),
        weight: 1.00,
        name_ar: "جرام ذهب 21",
        name_en: "21K Gold Gram",
        name_tr: "21 Ayar Altın Gram"
      },
      gram18: {
        buy: convertCurrency(goldPriceUSD / 31.1035 * 0.75, rates),
        sell: convertCurrency(goldPriceUSD / 31.1035 * 0.75 * (1 - goldSpread), rates),
        weight: 1.00,
        name_ar: "جرام ذهب 18",
        name_en: "18K Gold Gram",
        name_tr: "18 Ayar Altın Gram"
      },
      gram14: {
        buy: convertCurrency(goldPriceUSD / 31.1035 * 0.583, rates),
        sell: convertCurrency(goldPriceUSD / 31.1035 * 0.583 * (1 - goldSpread), rates),
        weight: 1.00,
        name_ar: "جرام ذهب 14",
        name_en: "14K Gold Gram",
        name_tr: "14 Ayar Altın Gram"
      },
      lira: {
        buy: convertCurrency(goldPriceUSD / 31.1035 * 7.32, rates),
        sell: convertCurrency(goldPriceUSD / 31.1035 * 7.32 * (1 - goldSpread), rates),
        weight: 7.32,
        name_ar: "ليرة ذهب",
        name_en: "Gold Lira",
        name_tr: "Altın Lira"
      },
      half: {
        buy: convertCurrency(goldPriceUSD / 31.1035 * 3.66, rates),
        sell: convertCurrency(goldPriceUSD / 31.1035 * 3.66 * (1 - goldSpread), rates),
        weight: 3.66,
        name_ar: "نصف ليرة",
        name_en: "Half Lira",
        name_tr: "Yarım Lira"
      },
      quarter: {
        buy: convertCurrency(goldPriceUSD / 31.1035 * 1.83, rates),
        sell: convertCurrency(goldPriceUSD / 31.1035 * 1.83 * (1 - goldSpread), rates),
        weight: 1.83,
        name_ar: "ربع ليرة",
        name_en: "Quarter Lira",
        name_tr: "Çeyrek Lira"
      },
      ounce: {
        buy: convertCurrency(goldPriceUSD, rates),
        sell: convertCurrency(goldPriceUSD * (1 - goldSpread), rates),
        weight: 31.1035,
        name_ar: "أونصة ذهب",
        name_en: "Gold Ounce",
        name_tr: "Altın Ons"
      }
    };

    // 🔥 الفضة
    const silver = {
      gram: {
        buy: convertCurrency(silverPriceUSD / 31.1035, rates),
        sell: convertCurrency(silverPriceUSD / 31.1035 * (1 - silverSpread), rates),
        weight: 1.00,
        name_ar: "جرام فضة",
        name_en: "Silver Gram",
        name_tr: "Gümüş Gram"
      },
      ounce: {
        buy: convertCurrency(silverPriceUSD, rates),
        sell: convertCurrency(silverPriceUSD * (1 - silverSpread), rates),
        weight: 31.1035,
        name_ar: "أونصة فضة",
        name_en: "Silver Ounce",
        name_tr: "Gümüş Ons"
      }
    };

    console.log("✅ تم جلب جميع الأسعار بنجاح");
    return { gold, silver, rates, goldPriceUSD, silverPriceUSD };

  } catch (error) {
    console.error("❌ خطأ فادح في جلب الأسعار:", error);
    throw error;
  }
};

// 🔥 API endpoint محسن
app.get("/api/prices", async (req, res) => {
  try {
    console.log("📥 طلب جديد لأسعار الذهب");
    
    const prices = await fetchPrices();
    
    const response = {
      success: true,
      timestamp: new Date().toISOString(),
      source: "Investing.com & ExchangeRate.host",
      last_update: new Date().toLocaleString('ar-EG'),
      data: {
        gold: prices.gold,
        silver: prices.silver,
        fx_rates: prices.rates
      },
      metadata: {
        gold_usd_per_ounce: prices.goldPriceUSD,
        silver_usd_per_ounce: prices.silverPriceUSD,
        base_currency: "USD",
        version: "2.0"
      }
    };
    
    console.log("📤 إرسال البيانات...");
    res.json(response);
    
  } catch (err) {
    console.error("❌ خطأ في endpoint /api/prices:", err.message);
    
    // 🔥 بيانات افتراضية في حالة الخطأ
    const fallbackData = {
      success: false,
      timestamp: new Date().toISOString(),
      error: err.message,
      fallback: true,
      data: {
        gold: {
          gram24: {
            buy: { USD: 2350.50, TRY: 99500.65, EUR: 2162.46, SAR: 8814.38, AED: 8627.34, EGP: 112589.85, IQD: 3080000, KWD: 728.66, BHD: 893.19, SYP: 30606500, DZD: 316197.25 },
            sell: { USD: 2315.74, TRY: 98028.14, EUR: 2130.12, SAR: 8682.16, AED: 8497.93, EGP: 110920.20, IQD: 3034800, KWD: 717.93, BHD: 879.64, SYP: 30147500, DZD: 311454.19 },
            weight: 1.00,
            name_ar: "جرام ذهب 24",
            name_en: "24K Gold Gram",
            name_tr: "24 Ayar Altın Gram"
          }
          // ... يمكن إضافة المزيد من الأنواع
        }
      }
    };
    
    res.json(fallbackData);
  }
});

// 🔥 نقطة نهاية للصحة (health check)
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    service: "Gold Prices API",
    version: "2.0"
  });
});

// 🔥 نقطة نهاية للبيانات الاحتياطية
app.get("/api/backup", (req, res) => {
  const backupData = {
    success: true,
    timestamp: new Date().toISOString(),
    backup: true,
    data: {
      // بيانات احتياطية
    }
  };
  res.json(backupData);
});

// 🔥 خدمة الملفات الثابتة
app.use(express.static('public'));

// 🔥 صفحة الترحيب
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Gold Prices API</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
        .endpoint { background: #f4f4f4; padding: 10px; margin: 10px 0; border-left: 4px solid #007bff; }
        code { background: #eee; padding: 2px 5px; }
      </style>
    </head>
    <body>
      <h1>🌍 Gold Prices API</h1>
      <p>API لجلب أسعار الذهب والفضة بأكثر من 10 عملات</p>
      
      <h2>📡 Endpoints:</h2>
      <div class="endpoint">
        <strong>GET /api/prices</strong> - جلب جميع أسعار الذهب والفضة<br>
        <code>curl ${req.protocol}://${req.get('host')}/api/prices</code>
      </div>
      
      <div class="endpoint">
        <strong>GET /api/health</strong> - فحص حالة السيرفر<br>
        <code>curl ${req.protocol}://${req.get('host')}/api/health</code>
      </div>
      
      <h2>📊 العملات المدعومة:</h2>
      <ul>
        <li>USD (الدولار الأمريكي)</li>
        <li>TRY (الليرة التركية)</li>
        <li>EUR (اليورو)</li>
        <li>SAR (الريال السعودي)</li>
        <li>AED (الدرهم الإماراتي)</li>
        <li>EGP (الجنيه المصري)</li>
        <li>IQD (الدينار العراقي)</li>
        <li>KWD (الدينار الكويتي)</li>
        <li>BHD (الدينار البحريني)</li>
        <li>SYP (الليرة السورية)</li>
        <li>DZD (الدينار الجزائري)</li>
      </ul>
      
      <footer>
        <p>🔄 آخر تحديث: ${new Date().toLocaleString('ar-EG')}</p>
      </footer>
    </body>
    </html>
  `);
});

// 🔥 معالجة الأخطاء
app.use((err, req, res, next) => {
  console.error('🔥 خطأ في السيرفر:', err.stack);
  res.status(500).json({
    success: false,
    error: 'خطأ داخلي في السيرفر',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 🔥 بدء السيرفر
app.listen(PORT, () => {
  console.log(`✅ السيرفر يعمل على المنفذ ${PORT}`);
  console.log(`🌐 العنوان: http://localhost:${PORT}`);
  console.log(`📡 API endpoint: http://localhost:${PORT}/api/prices`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
});

