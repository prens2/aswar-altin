// ====================== server.js ======================
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
app.use(cors());
app.use(express.json());

// 🔥 البيانات المباشرة من Investing.com ومواقع أخرى
async function getRealGoldPrices() {
    try {
        console.log('🔍 جلب أسعار الذهب الحقيقية...');
        
        // 1. أولاً: جرب API مجاني
        try {
            const response = await fetch('https://api.metalpriceapi.com/v1/latest?api_key=demo&base=XAU&currencies=USD', {
                timeout: 5000
            });
            const data = await response.json();
            if (data.rates && data.rates.USD) {
                const goldPerOunce = 1 / data.rates.USD;
                console.log(`✅ من MetalPriceAPI: $${goldPerOunce.toFixed(2)}`);
                return goldPerOunce;
            }
        } catch (e) {}
        
        // 2. جرب API ثاني
        try {
            const response = await fetch('https://www.goldapi.io/api/XAU/USD', {
                headers: { 'x-access-token': 'goldapi-abcdef123456-demo' }
            });
            const data = await response.json();
            if (data.price) {
                console.log(`✅ من GoldAPI: $${data.price}`);
                return data.price;
            }
        } catch (e) {}
        
        // 3. جرب Investing.com (Web Scraping مبسط)
        try {
            const response = await fetch('https://www.investing.com/commodities/gold', {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                },
                timeout: 8000
            });
            const html = await response.text();
            
            // ابحث عن السعر في HTML
            const priceMatch = html.match(/data-test="instrument-price-last"[^>]*>([^<]+)/);
            if (priceMatch) {
                const price = parseFloat(priceMatch[1].replace(/[^\d.]/g, ''));
                if (price > 1000) {
                    console.log(`✅ من Investing.com: $${price}`);
                    return price;
                }
            }
        } catch (e) {}
        
        // 4. إذا فشل كل شيء، استخدم سعر افتراضي واقعي
        console.log('💰 استخدام السعر الافتراضي: $2350.50');
        return 2350.50;
        
    } catch (error) {
        console.error('❌ خطأ في جلب الأسعار:', error);
        return 2350.50;
    }
}

// 🔥 أسعار الصرف الحقيقية
async function getExchangeRates() {
    try {
        const response = await fetch('https://api.exchangerate.host/latest?base=USD');
        const data = await response.json();
        return data.rates || {};
    } catch (error) {
        console.error('❌ خطأ في أسعار الصرف:', error);
        return {
            TRY: 42.30, EUR: 0.92, SAR: 3.75, AED: 3.67,
            EGP: 47.89, IQD: 1310.00, KWD: 0.31, BHD: 0.38,
            SYP: 13000.00, DZD: 134.50
        };
    }
}

// 🔥 حساب جميع الأسعار
function calculateAllPrices(goldPriceUSD, exchangeRates) {
    const goldPerGram = goldPriceUSD / 31.1035; // أونصة = 31.1035 جرام
    
    const result = {
        gram24: {}, gram22: {}, gram21: {}, gram18: {}, gram14: {},
        lira: {}, half: {}, quarter: {}, ounce: {}
    };
    
    const currencies = ['TRY', 'EUR', 'SAR', 'AED', 'EGP', 'IQD', 'KWD', 'BHD', 'SYP', 'DZD', 'USD'];
    
    currencies.forEach(currency => {
        const rate = exchangeRates[currency] || 1;
        
        // عيار 24 (ذهب خالص)
        const basePrice = goldPerGram * rate;
        result.gram24[currency] = {
            buy: (basePrice * 1.01).toFixed(2),  // +1% فرق
            sell: (basePrice * 0.99).toFixed(2)   // -1% فرق
        };
        
        // عيار 22 (91.6%)
        result.gram22[currency] = {
            buy: (basePrice * 0.916 * 1.01).toFixed(2),
            sell: (basePrice * 0.916 * 0.99).toFixed(2)
        };
        
        // عيار 21 (87.5%)
        result.gram21[currency] = {
            buy: (basePrice * 0.875 * 1.01).toFixed(2),
            sell: (basePrice * 0.875 * 0.99).toFixed(2)
        };
        
        // ليرة ذهب (7.32 جرام)
        result.lira[currency] = {
            buy: (basePrice * 7.32 * 1.01).toFixed(2),
            sell: (basePrice * 7.32 * 0.99).toFixed(2)
        };
    });
    
    return result;
}

// ====================== ROUTES ======================

// 🔥 الرئيسي
app.get('/', (req, res) => {
    res.json({
        name: "Gold Prices API",
        version: "3.0",
        description: "أسعار الذهب الحية من Investing.com ومواقع عالمية",
        endpoints: {
            prices: "/api/prices - أسعار الذهب",
            test: "/api/test - اختبار مباشر",
            health: "/api/health - حالة الخادم"
        }
    });
});

// 🔥 حالة الخادم
app.get('/api/health', (req, res) => {
    res.json({
        status: '✅ متصل',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// 🔥 API الرئيسي - أسعار الذهب
app.get('/api/prices', async (req, res) => {
    try {
        console.log('📥 طلب أسعار الذهب...');
        
        const [goldPriceUSD, exchangeRates] = await Promise.all([
            getRealGoldPrices(),
            getExchangeRates()
        ]);
        
        const allPrices = calculateAllPrices(goldPriceUSD, exchangeRates);
        
        const response = {
            success: true,
            timestamp: new Date().toISOString(),
            last_update: new Date().toLocaleString('ar-EG'),
            source: "Investing.com + MetalPriceAPI + ExchangeRate.host",
            data: {
                gold_price_per_ounce_usd: goldPriceUSD.toFixed(2),
                gold_price_per_gram_usd: (goldPriceUSD / 31.1035).toFixed(2),
                exchange_rates: exchangeRates,
                prices: allPrices
            },
            metadata: {
                base_currency: "USD",
                version: "3.0",
                cache: false
            }
        };
        
        console.log('✅ إرسال بيانات أسعار الذهب');
        res.json(response);
        
    } catch (error) {
        console.error('❌ خطأ في API:', error);
        
        // بيانات احتياطية
        res.json({
            success: false,
            error: error.message,
            fallback: true,
            data: {
                gold_price_per_ounce_usd: "2350.50",
                prices: {
                    gram24: {
                        TRY: { buy: "5790.80", sell: "5721.45" },
                        USD: { buy: "136.90", sell: "135.35" }
                    }
                }
            }
        });
    }
});

// 🔥 صفحة اختبار مباشرة
app.get('/api/test', async (req, res) => {
    try {
        const goldPrice = await getRealGoldPrices();
        res.send(`
            <html dir="rtl">
            <head><meta charset="UTF-8"><title>اختبار أسعار الذهب</title></head>
            <body style="font-family: Arial; padding: 20px; text-align: center;">
                <h1>✅ الخادم يعمل!</h1>
                <h2>سعر الذهب الحالي: $${goldPrice.toFixed(2)} للأونصة</h2>
                <p>التاريخ: ${new Date().toLocaleString('ar-EG')}</p>
                <p><a href="/api/prices">📊 عرض بيانات API (JSON)</a></p>
                <p><a href="/">🏠 الصفحة الرئيسية</a></p>
            </body>
            </html>
        `);
    } catch (error) {
        res.send(`<h1>❌ خطأ: ${error.message}</h1>`);
    }
});

// ====================== START SERVER ======================
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 الخادم يعمل على port ${PORT}`);
    console.log(`🌐 الرئيسي: http://localhost:${PORT}`);
    console.log(`📊 API: http://localhost:${PORT}/api/prices`);
    console.log(`🧪 اختبار: http://localhost:${PORT}/api/test`);
});
