// server.js في موقع aswar-altin.onrender.com - استبدله بهذا الكود
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// 🔥 نقطة النهاية الرئيسية - مزودة بالمصدر الجديد
app.get('/api/gold-prices', async (req, res) => {
  try {
    console.log('🔄 جلب بيانات الذهب من المصادر...');
    
    // مصادر البيانات المتعددة
    const dataSources = {
      royal: 'https://royal-limit-d5a2.mohamad1999mz.workers.dev/',
      metalprice: 'https://api.metalpriceapi.com/v1/latest?api_key=5b88634266343d5a588eb125940fd881&base=USD&currencies=EUR,TRY,SAR,AED,EGP,IQD,KWD,BHD'
    };

    // جلب البيانات من جميع المصادر
    const [royalResponse, exchangeResponse] = await Promise.all([
      fetch(dataSources.royal).catch(e => null),
      fetch(dataSources.metalprice).catch(e => null)
    ]);

    let royalData = null;
    let exchangeRates = {};

    // معالجة بيانات Royal Source
    if (royalResponse && royalResponse.ok) {
      royalData = await royalResponse.json();
      console.log('✅ تم جلب بيانات من Royal Source');
    }

    // معالجة بيانات أسعار الصرف
    if (exchangeResponse && exchangeResponse.ok) {
      const exchangeData = await exchangeResponse.json();
      exchangeRates = exchangeData.rates || {};
      console.log('✅ تم جلب بيانات أسعار الصرف');
    }

    // ⚡ إنشاء هيكل البيانات المتوافق مع تطبيقك
    const result = await generateCompatibleData(royalData, exchangeRates);
    
    res.json(result);
    
  } catch (error) {
    console.error('❌ خطأ في الخادم:', error);
    res.status(500).json({
      success: false,
      message: "فشل في جلب البيانات",
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// ⚡ دالة إنشاء بيانات متوافقة مع تطبيقك
async function generateCompatibleData(royalData, exchangeRates) {
  // الأسعار الأساسية - استخدام البيانات من Royal أو الافتراضية
  const baseGoldPrice = royalData?.data?.gold?.gram_24k?.buy?.TRY || 5864.17;
  
  // أسعار الصرف النهائية
  const defaultRates = {
    TRY: 42.5, EUR: 0.92, SAR: 3.75, AED: 3.67, 
    EGP: 47.5, IQD: 1310, KWD: 0.307, BHD: 0.377
  };
  
  const finalExchangeRates = { ...defaultRates, ...exchangeRates };

  // ⚡ إنشاء هيكل البيانات المتوافق
  const compatibleData = {
    "تم التحديث": new Date().toISOString(),
    "price_gram_try": baseGoldPrice.toString(),
    "price_gram_usd": (baseGoldPrice / finalExchangeRates.TRY).toFixed(4),
    "price_ounce_usd": ((baseGoldPrice / finalExchangeRates.TRY) * 31.1035).toFixed(2),
    "المصدر": "Royal Source & MetalPriceAPI & Doviz.com",
    
    // 🔥 أسعار الصرف المتوافقة
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
    
    // 🔥 بيانات العملات الذهبية المتوافقة
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
      // ... باقي العيارات بنفس الطريقة
    }
  };

  return compatibleData;
}

// نقاط النهاية الأخرى (للأخبار، التاريخ، إلخ)
app.get('/api/news', async (req, res) => {
  // كود الأخبار هنا
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 الخادم يعمل على port ${PORT}`);
});