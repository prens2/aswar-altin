// 📍 server.js - الإصدار النهائي
import express from 'express';
import cors from 'cors';
import pricesRouter from './prices.js';

const app = express();

// 🔥 CORS كامل - يسمح للجميع
app.use(cors({
    origin: '*',
    methods: ['GET', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// 🔥 Route رئيسي للتأكد
app.get('/', (req, res) => {
    res.json({
        name: "Gold Prices API",
        version: "2.0",
        endpoints: [
            "/api/prices - أسعار الذهب",
            "/api/health - حالة الخادم"
        ],
        source: "Render + Vercel"
    });
});

// 🔥 حالة الخادم
app.get('/api/health', (req, res) => {
    res.json({
        status: '✅ متصل',
        timestamp: new Date().toISOString(),
        server: 'Render',
        uptime: process.uptime()
    });
});

// 🔥 استخدم router الأسعار
app.use('/api/prices', pricesRouter);

// 🔥 404 لجميع المسارات الأخرى
app.use('*', (req, res) => {
    res.status(404).json({ error: 'المسار غير موجود' });
});

// 🔥 معالجة الأخطاء
app.use((err, req, res, next) => {
    console.error('❌ خطأ:', err);
    res.status(500).json({
        error: 'خطأ داخلي في الخادم',
        message: err.message
    });
});

// 🔥 البورت ديناميكي لـ Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 الخادم يعمل على: http://localhost:${PORT}`);
    console.log(`🌐 جاهز للطلبات من Vercel`);
});
