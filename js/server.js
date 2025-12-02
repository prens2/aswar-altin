// server.js - خادم Express لـ Render
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// للحصول على __dirname في ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// خدمة الملفات الثابتة
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
import pricesRouter from './src/api/prices.js';
app.use('/api/prices', pricesRouter);

// الصفحة الرئيسية
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// صفحة الترحيب API
app.get('/api', (req, res) => {
    res.json({
        service: 'Gold Prices API',
        version: '1.0.0',
        endpoints: {
            prices: '/api/prices',
            health: '/api/health'
        },
        documentation: 'https://aswar-altin.onrender.com/'
    });
});

// health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'Gold Prices API'
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: 'Endpoint not found'
    });
});

// بدء الخادم
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌐 API: http://localhost:${PORT}/api/prices`);
});
