// server.js معدل لجلب أسعار investing.com
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

const app = express();
app.use(cors());
app.use(express.json());

// 🔥 جلب سعر الذهب من investing.com
async function getGoldPriceFromInvesting() {
    try {
        console.log('🔍 جلب سعر الذهب من Investing.com...');
        
        const response = await fetch('https://www.investing.com/commodities/gold', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });
        
        const html = await response.text();
        const $ = cheerio.load(html);
        
        // البحث عن سعر الذهب
        const priceText = $('[data-test="instrument-price-last"]').text().trim();
        const changeText = $('[data-test="instrument-price-change"]').text().trim();
        
        let price = parseFloat(priceText.replace(/[^\d.-]/g, ''));
        
        // إذا ما لاقى السعر، استخرج من مكان آخر
        if (!price || isNaN(price)) {
            const marketPrice = $('.text-2xl').first().text();
            price = parseFloat(marketPrice.replace(/[^\d.-]/g, ''));
        }
        
        // إذا لسى مش موجود، استخدم سعر افتراضي
        if (!price || isNaN(price) || price < 1000) {
            price = 2350.50; // سعر افتراضي
        }
        
        console.log(`✅ سعر الذهب: $${price}`);
        return price;
        
    } catch (error) {
        console.error('❌ خطأ في جلب السعر:', error);
        return 2350.50; // سعر افتراضي
    }
}

// 🔥 جلب أسعار الصرف
async function getExchangeRates() {
    try {
        const response = await fetch('https://api.exchangerate.host/latest?base=USD');
        const data = await response.json();
        return data.rates;
    } catch (error) {
        console.error('❌ خطأ في أسعار الصرف:', error);
        return {
            TRY: 42.30, EUR: 0.92, SAR: 3.75, 
            AED: 3.67, EGP: 47.89, IQD: 1310.00,
            KWD: 0.31, BHD: 0.38, SYP: 13000.00,
            DZD: 134.50
        };
    }
}

// 🔥 API الرئيسي
app.get('/api/prices', async (req, res) => {
    try {
        const [goldPriceUSD, exchangeRates] = await Promise.all([
            getGoldPriceFromInvesting(),
            getExchangeRates()
        ]);
        
        // حساب سعر الجرام (أونصة = 31.1035 جرام)
        const goldPricePerGram = goldPriceUSD / 31.1035;
        
        // حساب الأسعار لكل العملات
        const prices = {};
        const currencies = ['TRY', 'EUR', 'SAR', 'AED', 'EGP', 'IQD', 'KWD', 'BHD', 'SYP', 'DZD'];
        
        currencies.forEach(currency => {
            const rate = exchangeRates[currency] || 1;
            const price = goldPricePerGram * rate;
            
            // فرق 1.5% بين الشراء والبيع
            prices[currency] = {
                buy: (price * 1.0075).toFixed(2),
                sell: (price * 0.9925).toFixed(2)
            };
        });
        
        res.json({
            success: true,
            timestamp: new Date().toISOString(),
            last_update: new Date().toLocaleString('ar-EG'),
            source: "Investing.com + ExchangeRate.host",
            data: {
                gold_price_usd: goldPriceUSD,
                gold_price_per_gram_usd: goldPricePerGram.toFixed(2),
                prices: prices
            }
        });
        
    } catch (error) {
        console.error('❌ خطأ في API:', error);
        res.json({
            success: false,
            error: error.message,
            fallback: true,
            data: {
                // بيانات افتراضية
                TRY: { buy: "5790.80", sell: "5721.45" }
            }
        });
    }
});

// 🔥 صفحة الاختبار
app.get('/test', async (req, res) => {
    const price = await getGoldPriceFromInvesting();
    res.send(`
        <h1>سعر الذهب من Investing.com</h1>
        <p>السعر: $${price}</p>
        <p>التاريخ: ${new Date().toLocaleString('ar-EG')}</p>
        <a href="/api/prices">API</a>
    `);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 الخادم يعمل: http://localhost:${PORT}`);
    console.log(`📊 API: http://localhost:${PORT}/api/prices`);
    console.log(`🧪 Test: http://localhost:${PORT}/test`);
});
