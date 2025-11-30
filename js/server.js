// server.js في موقع aswar-altin.onrender.com
const express = require('express');
const cors = require('cors');
const app = express();

// 🔥 إعداد CORS للسماح لجميع النطاقات أو نطاق محدد
app.use(cors({
  origin: [
    'https://aswar-altin.vercel.app',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'https://aswar-altin.onrender.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// أو السماح للجميع (للتطوير)
// app.use(cors());

app.use(express.json());

// 🔥 نقطة النهاية الرئيسية
app.get('/api/gold-prices', async (req, res) => {
  try {
    console.log('🔄 جلب بيانات الذهب...');
    
    // إضافة headers CORS يدوياً أيضاً
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    const dataSources = {
      royal: 'https://royal-limit-d5a2.mohamad1999mz.workers.dev/',
      metalprice: 'https://api.metalpriceapi.com/v1/latest?api_key=5b88634266343d5a588eb125940fd881&base=USD&currencies=EUR,TRY,SAR,AED,EGP,IQD,KWD,BHD'
    };

    const [royalResponse, exchangeResponse] = await Promise.all([
      fetch(dataSources.royal).catch(e => null),
      fetch(dataSources.metalprice).catch(e => null)
    ]);

    let royalData = null;
    let exchangeRates = {};

    if (royalResponse && royalResponse.ok) {
      royalData = await royalResponse.json();
    }

    if (exchangeResponse && exchangeResponse.ok) {
      const exchangeData = await exchangeResponse.json();
      exchangeRates = exchangeData.rates || {};
    }

    const baseGoldPrice = royalData?.data?.gold?.gram_24k?.buy?.TRY || 5864.17;
    
    const defaultRates = {
      TRY: 42.5, EUR: 0.92, SAR: 3.75, AED: 3.67, 
      EGP: 47.5, IQD: 1310, KWD: 0.307, BHD: 0.377
    };
    
    const finalExchangeRates = { ...defaultRates, ...exchangeRates };

    const result = {
      "تم التحديث": new Date().toISOString(),
      "price_gram_try": baseGoldPrice.toString(),
      "price_gram_usd": (baseGoldPrice / finalExchangeRates.TRY).toFixed(4),
      "price_ounce_usd": ((baseGoldPrice / finalExchangeRates.TRY) * 31.1035).toFixed(2),
      "المصدر": "Royal Source & MetalPriceAPI",
      "fx": {
        "USD": "1.00",
        "EUR": finalExchangeRates.EUR?.toString() || "0.92",
        "TRY": finalExchangeRates.TRY?.toString() || "42.30",
        "SAR": finalExchangeRates.SAR?.toString() || "3.75",
        "AED": finalExchangeRates.AED?.toString() || "3.67",
        "EGP": finalExchangeRates.EGP?.toString() || "47.50",
        "IQD": finalExchangeRates.IQD?.toString() || "1310.00",
        "KWD": finalExchangeRates.KWD?.toString() || "0.307",
        "BHD": finalExchangeRates.BHD?.toString() || "0.377"
      },
      "gold_coins": {
        "gram24": {
          "buy": baseGoldPrice.toString(),
          "sell": (baseGoldPrice * 0.985).toFixed(2),
          "weight": "1.00",
          "name_ar": "عيار 24",
          "name_en": "24K Gold", 
          "name_tr": "24 Ayar Altın"
        },
        "gram22": {
          "buy": (baseGoldPrice * 0.916).toFixed(2),
          "sell": (baseGoldPrice * 0.916 * 0.985).toFixed(2),
          "weight": "1.00",
          "name_ar": "عيار 22",
          "name_en": "22K Gold",
          "name_tr": "22 Ayar Altın"
        },
        "gram21": {
          "buy": (baseGoldPrice * 0.875).toFixed(2),
          "sell": (baseGoldPrice * 0.875 * 0.985).toFixed(2),
          "weight": "1.00",
          "name_ar": "عيار 21",
          "name_en": "21K Gold",
          "name_tr": "21 Ayar Altın"
        },
        "gram18": {
          "buy": (baseGoldPrice * 0.750).toFixed(2),
          "sell": (baseGoldPrice * 0.750 * 0.985).toFixed(2),
          "weight": "1.00",
          "name_ar": "عيار 18",
          "name_en": "18K Gold",
          "name_tr": "18 Ayar Altın"
        },
        "gram14": {
          "buy": (baseGoldPrice * 0.583).toFixed(2),
          "sell": (baseGoldPrice * 0.583 * 0.985).toFixed(2),
          "weight": "1.00",
          "name_ar": "عيار 14",
          "name_en": "14K Gold",
          "name_tr": "14 Ayar Altın"
        },
        "lira": {
          "buy": (baseGoldPrice * 7.008).toFixed(2),
          "sell": (baseGoldPrice * 7.008 * 0.985).toFixed(2),
          "weight": "7.32",
          "name_ar": "ليرة ذهب",
          "name_en": "Gold Lira",
          "name_tr": "Altın Lira"
        },
        "half_lira": {
          "buy": (baseGoldPrice * 3.504).toFixed(2),
          "sell": (baseGoldPrice * 3.504 * 0.985).toFixed(2),
          "weight": "3.66",
          "name_ar": "نصف ليرة",
          "name_en": "Half Lira",
          "name_tr": "Yarım Lira"
        },
        "quarter_lira": {
          "buy": (baseGoldPrice * 1.752).toFixed(2),
          "sell": (baseGoldPrice * 1.752 * 0.985).toFixed(2),
          "weight": "1.83",
          "name_ar": "ربع ليرة",
          "name_en": "Quarter Lira",
          "name_tr": "Çeyrek Lira"
        }
      }
    };

    res.json(result);
    
  } catch (error) {
    console.error('❌ خطأ:', error);
    res.status(500).json({
      success: false,
      message: "فشل في جلب البيانات",
      error: error.message
    });
  }
});

// 🔥 معالجة طلبات OPTIONS يدوياً
app.options('*', cors());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 الخادم يعمل على port ${PORT}`);
  console.log(`🌐 CORS مسموح لـ: https://aswar-altin.vercel.app`);
});
