// =============== server.js ===============
import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

// 🔥 رابط Cloudflare Worker الخاص بك
const WORKER_URL = "https://royal-limit-d5a2.mohamad1999mz.workers.dev/";

// ======================================================
// 🔥 دالة تجلب السعر الحقيقي من الـ Worker
// ======================================================
async function fetchGoldFromWorker() {
    try {
        const res = await fetch(WORKER_URL);

        if (!res.ok) {
            throw new Error(`Worker Error: ${res.status}`);
        }

        const data = await res.json();

        return {
            success: true,
            timestamp: data.timestamp || new Date().toISOString(),
            gold_price_per_ounce_usd: data.gold_price_per_ounce_usd,
            silver_price_per_ounce_usd: data.silver_price_per_ounce_usd,
            raw: data.raw || data,
        };
    } catch (err) {
        return {
            success: false,
            error: "تعذر الاتصال بالـ Worker",
            details: err.message
        };
    }
}

// ======================================================
// 🔥 Endpoint: API أسعار الذهب
// ======================================================
app.get("/api/prices", async (req, res) => {
    console.log("📥 طلب أسعار الذهب الحقيقي...");

    const data = await fetchGoldFromWorker();
    res.json(data);
});

// ======================================================
// 🔥 صفحة فحص
// ======================================================
app.get("/", (req, res) => {
    res.send(`
        <html dir="rtl">
        <head><meta charset="UTF-8"><title>Gold API</title></head>
        <body style="font-family: Arial; padding: 20px; text-align:center;">
            <h1>🚀 Gold Prices API</h1>
            <p>الخادم يعمل بنجاح</p>
            <a href="/api/prices" style="padding: 12px 24px; 
                background: #d4a017; color: white; border-radius: 6px;">
                عرض الأسعار JSON
            </a>
        </body>
        </html>
    `);
});

// ======================================================
// 🔥 تشغيل الخادم
// ======================================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("=====================================");
    console.log("🚀 Gold API Server يعمل الآن");
    console.log("🌐 http://localhost:" + PORT);
    console.log("🔗 يستخدم Cloudflare Worker لسعر الذهب");
    console.log("=====================================");
});
