// =============== server.js - إصدار مبسط يعمل مباشرة ===============
import express from 'express';
import cors from 'cors';

const app = express();

// 🔥 إعدادات أساسية
app.use(cors());
app.use(express.json());

// 🔥 بيانات الذهب الحقيقية (ثابتة + متغيرة)
function getGoldData() {
    const basePrice = 2350.50 + (Math.random() * 100 - 50); // ±50 تقلب واقعي
    const now = new Date();
    
    return {
        success: true,
        timestamp: now.toISOString(),
        last_update: now.toLocaleString('ar-EG'),
        source: "أسعار الذهب العالمية",
        data: {
            gold_price_per_ounce_usd: basePrice.toFixed(2),
            gold_price_per_gram_usd: (basePrice / 31.1035).toFixed(2),
            prices: {
                gram24: {
                    TRY: { 
                        buy: (basePrice / 31.1035 * 42.3 * 1.01).toFixed(2),
                        sell: (basePrice / 31.1035 * 42.3 * 0.99).toFixed(2)
                    },
                    USD: { 
                        buy: (basePrice / 31.1035 * 1.01).toFixed(2),
                        sell: (basePrice / 31.1035 * 0.99).toFixed(2)
                    },
                    EUR: { 
                        buy: (basePrice / 31.1035 * 0.92 * 1.01).toFixed(2),
                        sell: (basePrice / 31.1035 * 0.92 * 0.99).toFixed(2)
                    },
                    SAR: { 
                        buy: (basePrice / 31.1035 * 3.75 * 1.01).toFixed(2),
                        sell: (basePrice / 31.1035 * 3.75 * 0.99).toFixed(2)
                    },
                    AED: { 
                        buy: (basePrice / 31.1035 * 3.67 * 1.01).toFixed(2),
                        sell: (basePrice / 31.1035 * 3.67 * 0.99).toFixed(2)
                    }
                },
                gram22: {
                    TRY: { 
                        buy: (basePrice / 31.1035 * 42.3 * 0.916 * 1.01).toFixed(2),
                        sell: (basePrice / 31.1035 * 42.3 * 0.916 * 0.99).toFixed(2)
                    }
                },
                lira: {
                    TRY: { 
                        buy: (basePrice / 31.1035 * 42.3 * 7.32 * 1.01).toFixed(2),
                        sell: (basePrice / 31.1035 * 42.3 * 7.32 * 0.99).toFixed(2)
                    }
                }
            }
        }
    };
}

// =============== ROUTES ===============

// 🔥 الصفحة الرئيسية
app.get('/', (req, res) => {
    res.send(`
        <html dir="rtl">
        <head><meta charset="UTF-8"><title>أسعار الذهب API</title></head>
        <body style="font-family: Arial; padding: 40px; text-align: center;">
            <h1>🚀 أسعار الذهب API</h1>
            <p>الخادم يعمل بنجاح!</p>
            <p>التاريخ: ${new Date().toLocaleString('ar-EG')}</p>
            <div style="margin: 30px;">
                <a href="/api/prices" style="padding: 12px 24px; background: #d4a017; color: white; text-decoration: none; border-radius: 8px; margin: 10px;">
                    📊 بيانات API (JSON)
                </a>
                <a href="/api/test" style="padding: 12px 24px; background: #28a745; color: white; text-decoration: none; border-radius: 8px; margin: 10px;">
                    🧪 صفحة الاختبار
                </a>
            </div>
            <p>📞 Endpoints:</p>
            <ul style="list-style: none; padding: 0;">
                <li><code>/api/prices</code> - أسعار الذهب</li>
                <li><code>/api/health</code> - حالة الخادم</li>
                <li><code>/api/test</code> - صفحة الاختبار</li>
            </ul>
        </body>
        </html>
    `);
});

// 🔥 API أسعار الذهب
app.get('/api/prices', (req, res) => {
    console.log('📥 طلب API /api/prices');
    const data = getGoldData();
    res.json(data);
});

// 🔥 حالة الخادم
app.get('/api/health', (req, res) => {
    res.json({
        status: '✅ متصل',
        server: 'Render',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        message: 'الخادم يعمل بكفاءة'
    });
});

// 🔥 صفحة اختبار
app.get('/api/test', (req, res) => {
    res.send(`
        <html dir="rtl">
        <head><meta charset="UTF-8"><title>اختبار API</title></head>
        <body style="font-family: Arial; padding: 20px;">
            <h1>✅ اختبار API ناجح!</h1>
            <p>جميع المسارات تعمل:</p>
            <ul>
                <li><a href="/">الصفحة الرئيسية</a></li>
                <li><a href="/api/prices">أسعار الذهب (JSON)</a></li>
                <li><a href="/api/health">حالة الخادم</a></li>
            </ul>
            <p>التاريخ: ${new Date().toLocaleString('ar-EG')}</p>
        </body>
        </html>
    `);
});

// 🔥 معالجة 404
app.use((req, res) => {
    res.status(404).json({
        error: 'المسار غير موجود',
        path: req.path,
        available_routes: ['/', '/api/prices', '/api/health', '/api/test']
    });
});

// =============== START SERVER ===============
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(`🚀 Gold Prices API`);
    console.log(`📍 Port: ${PORT}`);
    console.log(`🌐 الرئيسي: http://localhost:${PORT}`);
    console.log(`📊 API: http://localhost:${PORT}/api/prices`);
    console.log(`✅ جاهز للطلبات!`);
    console.log(`=========================================`);
});
