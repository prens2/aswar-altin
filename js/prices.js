// 📍 prices.js - الإصدار النهائي
import express from 'express';

const router = express.Router();

// 🔥 العملات المطلوبة
const currencies = ["USD", "TRY", "EUR", "SAR", "AED", "EGP", "IQD", "KWD", "BHD", "SYP", "DZD"];

// 🔥 بيانات افتراضية ثابتة - حتى تعمل مباشرة
const mockData = {
    success: true,
    timestamp: new Date().toISOString(),
    last_update: new Date().toLocaleString('ar-EG'),
    source: "Gold Prices API",
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
            },
            gram22: {
                buy: {
                    USD: 2155.00, TRY: 91200.50, EUR: 1980.00,
                    SAR: 8078.00, AED: 7905.00, EGP: 103150.00,
                    IQD: 2822000, KWD: 667.50, BHD: 818.00,
                    SYP: 28050000, DZD: 289750.00
                },
                sell: {
                    USD: 2122.00, TRY: 89850.25, EUR: 1950.00,
                    SAR: 7956.00, AED: 7786.50, EGP: 101600.00,
                    IQD: 2779500, KWD: 657.50, BHD: 805.50,
                    SYP: 27620000, DZD: 285400.00
                },
                weight: 1.00,
                name_ar: "جرام ذهب 22",
                name_en: "22K Gold",
                name_tr: "22 Ayar Altın"
            }
        }
    },
    metadata: {
        gold_usd_per_ounce: 2350.50,
        base_currency: "USD",
        version: "2.0"
    }
};

// 🔥 Route رئيسي - يعطي البيانات مباشرة
router.get('/', (req, res) => {
    console.log('📥 طلب أسعار الذهب من:', req.get('origin') || 'مباشر');
    
    // 🔥 CORS headers - مهم جداً
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    
    try {
        // تحديث الوقت
        mockData.timestamp = new Date().toISOString();
        mockData.last_update = new Date().toLocaleString('ar-EG');
        
        console.log('✅ إرسال البيانات إلى:', req.get('origin') || 'Vercel');
        
        // 🔥 إرسال البيانات
        res.json(mockData);
        
    } catch (error) {
        console.error('❌ خطأ في API:', error);
        
        // 🔥 بيانات احتياطية
        const fallback = {
            success: false,
            error: error.message,
            fallback: true,
            timestamp: new Date().toISOString(),
            data: mockData.data
        };
        
        res.status(200).json(fallback);
    }
});

// 🔥 Route للاختبار البسيط
router.get('/test', (req, res) => {
    res.json({
        message: "✅ API يعمل بنجاح!",
        time: new Date().toISOString()
    });
});

export default router;
