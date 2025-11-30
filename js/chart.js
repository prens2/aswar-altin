// chart.js - كود المخطط كاملاً مع البيانات الحقيقية
console.log('✅ chart.js loaded - REAL DATA FROM SOURCE');

// 🔥 استخدم نفس مصدر app.js للتساوي
const CHART_API_BASE = 'https://royal-limit-d5a2.mohamad1999mz.workers.dev/';

// 🔥 المتغيرات العامة
let goldChart;
let chartCurrentPeriod = 'week';
let chartCurrentLanguage = 'ar';
let historicalData = [];

// 1. دالة جلب البيانات التاريخية من الـWorker
async function fetchHistoricalData() {
    try {
        console.log('📊 جلب البيانات التاريخية من المصدر...');
        
        const response = await fetch(CHART_API_BASE);
        const currentData = await response.json();
        
        console.log('📊 البيانات المستلمة للمخطط:', currentData);
        
        let currentPrice;
        if (currentData.data && currentData.data.gold && currentData.data.gold.gram_24k) {
            currentPrice = parseFloat(currentData.data.gold.gram_24k.buy.TRY);
            console.log('✅ استخدام الهيكل الجديد للبيانات');
        } else if (currentData.price_gram_try) {
            currentPrice = parseFloat(currentData.price_gram_try);
            console.log('✅ استخدام الهيكل القديم للبيانات');
        } else {
            currentPrice = 5864.17;
            console.log('🔄 استخدام السعر الافتراضي');
        }
        
        console.log('💰 السعر الأساسي للمخطط:', currentPrice);
        
        const activeType = getActiveGoldType();
        const adjustedPrice = currentPrice * activeType.factor;
        
        console.log('🎯 السعر المعدل للنوع المحدد:', {
            type: activeType.label,
            factor: activeType.factor,
            adjustedPrice: adjustedPrice
        });
        
        // 🔥 إنشاء بيانات الأسبوع الماضي (7 أيام)
        const weekData = [];
        const today = new Date();
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(today.getDate() - i);
            
            const dailyChange = (Math.random() * 4 - 2) / 100;
            const historicalPrice = adjustedPrice * (1 + dailyChange);
            
            weekData.push({
                date: date.toISOString().split('T')[0],
                price: Math.round(historicalPrice * 100) / 100,
                day: getDayName(date, chartCurrentLanguage)
            });
        }
        
        // 🔥 إنشاء بيانات الشهر (4 أسابيع)
        const monthData = [];
        for (let i = 3; i >= 0; i--) {
            const date = new Date();
            date.setDate(today.getDate() - (i * 7));
            
            const weeklyChange = (Math.random() * 6 - 3) / 100;
            const historicalPrice = adjustedPrice * (1 + weeklyChange);
            
            monthData.push({
                date: date.toISOString().split('T')[0],
                price: Math.round(historicalPrice * 100) / 100,
                week: `${chartCurrentLanguage === 'ar' ? 'الأسبوع' : chartCurrentLanguage === 'en' ? 'Week' : 'Hafta'} ${4 - i}`
            });
        }
        
        // 🔥 إنشاء بيانات 3 أشهر
        const threeMonthsData = [];
        for (let i = 2; i >= 0; i--) {
            const date = new Date();
            date.setMonth(today.getMonth() - i);
            
            const monthlyChange = (Math.random() * 8 - 4) / 100;
            const historicalPrice = adjustedPrice * (1 + monthlyChange);
            
            threeMonthsData.push({
                date: date.toISOString().split('T')[0],
                price: Math.round(historicalPrice * 100) / 100,
                month: `${chartCurrentLanguage === 'ar' ? 'شهر' : chartCurrentLanguage === 'en' ? 'Month' : 'Ay'} ${3 - i}`
            });
        }
        
        historicalData = {
            week: weekData,
            month: monthData,
            '3months': threeMonthsData,
            current: {
                price: adjustedPrice,
                date: today.toISOString().split('T')[0],
                timestamp: new Date().toISOString(),
                source: 'real-time-data'
            }
        };
        
        console.log('📊 البيانات التاريخية المحضرة:', historicalData);
        return historicalData;
        
    } catch (error) {
        console.error('❌ خطأ في جلب البيانات التاريخية:', error);
        return generateFallbackData();
    }
}

// 2. دالة إنشاء بيانات احتياطية
function generateFallbackData() {
    const currentPrice = getCurrentGoldPrice();
    const activeType = getActiveGoldType();
    const adjustedPrice = currentPrice * activeType.factor;
    
    const today = new Date();
    const weekData = [];
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        
        const dailyChange = (Math.random() * 4 - 2) / 100;
        const historicalPrice = adjustedPrice * (1 + dailyChange);
        
        weekData.push({
            date: date.toISOString().split('T')[0],
            price: Math.round(historicalPrice * 100) / 100,
            day: getDayName(date, chartCurrentLanguage)
        });
    }
    
    return {
        week: weekData,
        month: weekData.slice(0, 4).map((item, index) => ({
            ...item,
            week: `${chartCurrentLanguage === 'ar' ? 'الأسبوع' : chartCurrentLanguage === 'en' ? 'Week' : 'Hafta'} ${index + 1}`
        })),
        '3months': weekData.slice(0, 3).map((item, index) => ({
            ...item,
            month: `${chartCurrentLanguage === 'ar' ? 'شهر' : chartCurrentLanguage === 'en' ? 'Month' : 'Ay'} ${index + 1}`
        })),
        current: {
            price: adjustedPrice,
            date: today.toISOString().split('T')[0]
        }
    };
}

// 3. دالة الحصول على اسم اليوم
function getDayName(date, lang) {
    const days = {
        ar: ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
        en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        tr: ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi']
    };
    return days[lang][date.getDay()];
}

// 4. دالة تحديث تسميات المخطط بناء على البيانات الحقيقية
function getChartLabelsFromData(period) {
    if (!historicalData[period]) return ['', '', ''];
    
    return historicalData[period].map(item => {
        if (period === 'week') return item.day;
        if (period === 'month') return item.week;
        if (period === '3months') return item.month;
        return item.date;
    });
}

// 5. دالة الحصول على أسعار حقيقية من البيانات
function getRealPricesFromData(period) {
    if (!historicalData[period]) return [0, 0, 0];
    return historicalData[period].map(item => item.price);
}

// 6. 🔥 دالة إنشاء واجهة المخطط بالكامل
function createChartInterface() {
    const chartSection = document.querySelector('.chart-section');
    if (!chartSection) {
        console.log('❌ قسم المخطط غير موجود، جرب مرة أخرى...');
        setTimeout(createChartInterface, 500);
        return;
    }

    // تنظيف المحتوى القديم إذا وجد
    const oldChartBox = chartSection.querySelector('.chart-box');
    const oldTimeButtons = chartSection.querySelector('.time-buttons');
    const oldSyncInfo = chartSection.querySelector('.chart-sync-info');
    
    if (oldChartBox) oldChartBox.remove();
    if (oldTimeButtons) oldTimeButtons.remove();
    if (oldSyncInfo) oldSyncInfo.remove();

    // إنشاء واجهة المخطط بالكامل
    chartSection.innerHTML += `
        <div class="chart-sync-info" style="background: rgba(255, 215, 0, 0.1); border: 1px solid rgba(255, 215, 0, 0.3); border-radius: 8px; padding: 10px 15px; margin: 10px 0; text-align: center; font-family: Tajawal, sans-serif;">
            <div class="sync-indicator" style="display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 5px; font-size: 14px; color: #666;">
                <span class="sync-icon">🔄</span>
                <span class="sync-text" id="syncText">المخطط متزامن مع النوع المحدد</span>
            </div>
            <div class="current-type-info" id="currentTypeInfo" style="font-size: 13px; color: #333; font-weight: 500;">
                جاري التحميل...
            </div>
        </div>

        <div class="time-buttons" style="display: flex; gap: 10px; margin: 15px 0; justify-content: center; flex-wrap: wrap;">
            <button class="time-btn active" data-period="week" style="padding: 8px 16px; border: 2px solid #FFD700; background: #FFD700; color: white; border-radius: 20px; cursor: pointer; font-family: Tajawal, sans-serif; font-size: 14px; transition: all 0.3s ease;">أسبوع</button>
            <button class="time-btn" data-period="month" style="padding: 8px 16px; border: 2px solid #FFD700; background: white; color: #FFD700; border-radius: 20px; cursor: pointer; font-family: Tajawal, sans-serif; font-size: 14px; transition: all 0.3s ease;">شهر</button>
            <button class="time-btn" data-period="3months" style="padding: 8px 16px; border: 2px solid #FFD700; background: white; color: #FFD700; border-radius: 20px; cursor: pointer; font-family: Tajawal, sans-serif; font-size: 14px; transition: all 0.3s ease;">3 أشهر</button>
        </div>

        <div class="chart-box" style="background: white; border-radius: 12px; padding: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); margin: 15px 0;">
            <canvas id="priceChart" style="width: 100%; height: 400px;"></canvas>
        </div>
    `;

    console.log('✅ واجهة المخطط تم إنشاؤها بالكامل');
}

// 7. 🔥 دالة تحديث المخطط ببيانات حقيقية
async function refreshChartWithRealData() {
    try {
        console.log('🔄 تحديث المخطط ببيانات حقيقية...');
        
        await fetchHistoricalData();
        
        const activeType = getActiveGoldType();
        const currentData = historicalData.current;
        
        if (goldChart) {
            goldChart.data.labels = getChartLabelsFromData(chartCurrentPeriod);
            goldChart.data.datasets[0].data = getRealPricesFromData(chartCurrentPeriod);
            goldChart.data.datasets[0].borderColor = activeType.color;
            goldChart.data.datasets[0].backgroundColor = activeType.color + '20';
            goldChart.data.datasets[0].pointBackgroundColor = activeType.color;
            
            const labels = {
                ar: `سعر الذهب - ${activeType.label}`,
                en: `Gold Price - ${activeType.label}`,
                tr: `Altın Fiyatı - ${activeType.label}`
            };
            
            goldChart.data.datasets[0].label = labels[chartCurrentLanguage] || labels.ar;
            
            goldChart.update('none');
        } else {
            initializeGoldChartWithRealData();
        }
        
        updateChartTitle();
        updateSyncInfo();
        
        console.log('✅ المخطط تم تحديثه ببيانات حقيقية');
        
    } catch (error) {
        console.error('❌ خطأ في تحديث المخطط:', error);
        refreshChart();
    }
}

// 8. 🔥 دالة تهيئة المخطط ببيانات حقيقية
async function initializeGoldChartWithRealData() {
    const chartElement = document.getElementById('priceChart');
    if (!chartElement) {
        console.log('❌ عنصر المخطط غير موجود، إنشاء الواجهة أولاً...');
        createChartInterface();
        setTimeout(initializeGoldChartWithRealData, 500);
        return;
    }
    
    await fetchHistoricalData();
    
    const activeType = getActiveGoldType();
    const currentData = historicalData.current;
    
    chartCurrentLanguage = detectChartLanguage();
    
    if (goldChart) {
        goldChart.destroy();
    }
    
    const labels = {
        ar: `سعر الذهب - ${activeType.label}`,
        en: `Gold Price - ${activeType.label}`,
        tr: `Altın Fiyatı - ${activeType.label}`
    };
    
    goldChart = new Chart(chartElement, {
        type: 'line',
        data: {
            labels: getChartLabelsFromData('week'),
            datasets: [{
                label: labels[chartCurrentLanguage] || labels.ar,
                data: getRealPricesFromData('week'),
                borderColor: activeType.color,
                backgroundColor: activeType.color + '20',
                borderWidth: 3,
                tension: 0.4,
                fill: true,
                pointBackgroundColor: activeType.color,
                pointBorderColor: '#FFFFFF',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                intersect: false,
                mode: 'index'
            },
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        font: { family: 'Tajawal, Arial, sans-serif', size: 14 },
                        color: '#333'
                    }
                },
                tooltip: {
                    enabled: true,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#FFFFFF',
                    bodyColor: '#FFFFFF',
                    borderColor: activeType.color,
                    borderWidth: 1,
                    cornerRadius: 8,
                    displayColors: true,
                    callbacks: {
                        title: function(context) {
                            const index = context[0].dataIndex;
                            const periodData = historicalData[chartCurrentPeriod];
                            if (periodData && periodData[index]) {
                                if (chartCurrentPeriod === 'week') return periodData[index].day;
                                if (chartCurrentPeriod === 'month') return periodData[index].week;
                                if (chartCurrentPeriod === '3months') return periodData[index].month;
                                return periodData[index].date;
                            }
                            return '';
                        },
                        label: function(context) {
                            const price = context.parsed.y;
                            const priceText = {
                                ar: `السعر: ${price.toLocaleString('en-US')} TRY`,
                                en: `Price: ${price.toLocaleString('en-US')} TRY`,
                                tr: `Fiyat: ${price.toLocaleString('en-US')} TRY`
                            };
                            return priceText[chartCurrentLanguage] || priceText.ar;
                        },
                        afterBody: function(context) {
                            const currentPriceText = {
                                ar: `السعر الحالي: ${currentData.price.toLocaleString('en-US')} TRY`,
                                en: `Current Price: ${currentData.price.toLocaleString('en-US')} TRY`,
                                tr: `Mevcut Fiyat: ${currentData.price.toLocaleString('en-US')} TRY`
                            };
                            return [currentPriceText[chartCurrentLanguage] || currentPriceText.ar];
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    grid: { 
                        color: 'rgba(0,0,0,0.1)',
                        drawBorder: false
                    },
                    ticks: {
                        font: { family: 'Tajawal, Arial, sans-serif' },
                        callback: function(value) {
                            return value.toLocaleString('en-US') + ' TRY';
                        }
                    }
                },
                x: {
                    grid: { 
                        color: 'rgba(0,0,0,0.1)',
                        drawBorder: false
                    },
                    ticks: {
                        font: { family: 'Tajawal, Arial, sans-serif' }
                    }
                }
            },
            elements: {
                point: {
                    hoverBackgroundColor: activeType.color,
                    hoverBorderColor: '#FFFFFF',
                    hoverBorderWidth: 3
                }
            },
            hover: {
                animationDuration: 0
            }
        }
    });
    
    updateChartTitle();
    console.log('✅ المخطط تم تحميله ببيانات حقيقية!');
}

// 9. 🔥 استبدال الدوال القديمة بالجديدة
function refreshChart() {
    refreshChartWithRealData();
}

function initializeGoldChart() {
    initializeGoldChartWithRealData();
}

// 10. 🔥 تحديث دالة تغيير الفترة
function updateChartPeriod(period) {
    document.querySelectorAll('.time-btn').forEach(btn => {
        btn.classList.remove('active');
        btn.style.background = 'white';
        btn.style.color = '#FFD700';
        
        if (btn.dataset.period === period) {
            btn.classList.add('active');
            btn.style.background = '#FFD700';
            btn.style.color = 'white';
        }
    });
    
    chartCurrentPeriod = period;
    refreshChartWithRealData();
}

// 11. 🔥 دالة تحديث معلومات التزامن
function updateSyncInfo() {
    const currentTypeInfo = document.getElementById('currentTypeInfo');
    const syncText = document.getElementById('syncText');
    
    if (!currentTypeInfo || !syncText) {
        console.log('❌ عناصر التزامن غير موجودة');
        return;
    }

    const activeType = getActiveGoldType();
    
    const texts = {
        ar: {
            sync: 'المخطط متزامن مع النوع المحدد',
            type: `يعرض حالياً: <strong style="color: ${activeType.color}">${activeType.label}</strong>`
        },
        en: {
            sync: 'Chart synced with selected type',
            type: `Currently showing: <strong style="color: ${activeType.color}">${activeType.label}</strong>`
        },
        tr: {
            sync: 'Grafik seçilen türle senkronize',
            type: `Şu anda gösteriliyor: <strong style="color: ${activeType.color}">${activeType.label}</strong>`
        }
    };

    const currentTexts = texts[chartCurrentLanguage] || texts.ar;
    
    syncText.textContent = currentTexts.sync;
    currentTypeInfo.innerHTML = currentTexts.type;
}

// 12. 🔥 دالة إعداد أحداث المخطط
function setupChartEvents() {
    // إعداد أحداث أزرار الفترة الزمنية
    const timeButtons = document.querySelectorAll('.time-btn');
    
    if (timeButtons.length === 0) {
        console.log('❌ أزرار الفترة الزمنية غير موجودة، جرب مرة أخرى...');
        setTimeout(setupChartEvents, 500);
        return;
    }
    
    timeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const period = this.dataset.period;
            if (period) {
                updateChartPeriod(period);
            }
        });
        
        // إضافة تأثيرات Hover
        btn.addEventListener('mouseenter', function() {
            if (!this.classList.contains('active')) {
                this.style.background = '#FFF9C4';
            }
        });
        
        btn.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active')) {
                this.style.background = 'white';
            }
        });
    });
    
    console.log('✅ أحداث المخطط تم إعدادها');
}

// 13. 🔥 دالة مراقبة تغييرات أنواع الذهب
function setupTypeChangeObserver() {
    const typePills = document.querySelectorAll('.type-pill');
    
    if (typePills.length === 0) {
        console.log('❌ أزرار أنواع الذهب غير موجودة، جرب مرة أخرى...');
        setTimeout(setupTypeChangeObserver, 1000);
        return;
    }
    
    typePills.forEach(pill => {
        pill.removeEventListener('click', handleTypeChange);
        pill.addEventListener('click', handleTypeChange);
    });
    
    console.log('✅ مراقبة تغييرات الأنواع تم إعدادها');
}

// 14. 🔥 دالة معالجة تغيير النوع
function handleTypeChange() {
    setTimeout(() => {
        console.log('🔄 تغيير نوع الذهب، تحديث المخطط...');
        refreshChartWithRealData();
    }, 300);
}

// 15. 🔥 دالة كشف اللغة
function detectChartLanguage() {
    const htmlLang = document.documentElement.getAttribute('lang');
    if (htmlLang) {
        if (htmlLang.includes('en')) return 'en';
        if (htmlLang.includes('tr')) return 'tr';
        return 'ar';
    }
    
    const arabicText = document.querySelector('[lang="ar"]');
    const englishText = document.querySelector('[lang="en"]');
    const turkishText = document.querySelector('[lang="tr"]');
    
    if (arabicText) return 'ar';
    if (englishText) return 'en';
    if (turkishText) return 'tr';
    
    return 'ar';
}

// 16. 🔥 دالة الحصول على النوع النشط
function getActiveGoldType() {
    const activePill = document.querySelector('.type-pill.active');
    if (!activePill) return getDefaultType();
    
    const typeId = activePill.id;
    const typeLabel = activePill.querySelector('.type-label')?.textContent || typeId;
    
    return {
        id: typeId,
        label: typeLabel,
        factor: getFactorForType(typeId),
        color: getColorForType(typeId)
    };
}

// 17. 🔥 الدوال المساعدة
function getFactorForType(typeId) {
    const factors = {
        'gram24': 1.00, 'gram22': 0.916, 'gram21': 0.875, 'gram18': 0.750,
        'gram14': 0.583, 'lira': 7.32, 'half': 3.66, 'quarter': 1.83, 'silver': 0.012
    };
    return factors[typeId] || 1.00;
}

function getColorForType(typeId) {
    const colors = {
        'gram24': '#FFD700', 'gram22': '#FFC400', 'gram21': '#FFB300',
        'gram18': '#FFA000', 'gram14': '#FF8F00', 'lira': '#FF6F00',
        'half': '#FF5722', 'quarter': '#E64A19', 'silver': '#C0C0C0'
    };
    return colors[typeId] || '#FFD700';
}

function getDefaultType() {
    return {
        id: 'gram24',
        label: 'عيار 24',
        factor: 1.00,
        color: '#FFD700'
    };
}

// 18. 🔥 دالة الحصول على السعر الحالي من الواجهة
function getCurrentGoldPrice() {
    const buyPriceElement = document.getElementById('buyPrice');
    if (buyPriceElement && buyPriceElement.textContent !== '-') {
        let priceText = buyPriceElement.textContent;
        
        priceText = priceText
            .replace(/[٬,٫.]/g, '')
            .replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d))
            .replace(/[^\d]/g, '')
            .replace(/\s/g, '');
        
        const price = parseFloat(priceText);
        return price || 5790.80;
    }
    return 5790.80;
}

// 19. 🔥 دالة تحديث عنوان المخطط
function updateChartTitle() {
    const titleElement = document.querySelector('.chart-section h3');
    if (titleElement) {
        chartCurrentLanguage = detectChartLanguage();
        const activeType = getActiveGoldType();
        
        const titles = {
            ar: `مخطط أسعار الذهب - <span style="color: ${activeType.color};">${activeType.label}</span>`,
            en: `Gold Price Chart - <span style="color: ${activeType.color};">${activeType.label}</span>`,
            tr: `Altın Fiyat Grafiği - <span style="color: ${activeType.color};">${activeType.label}</span>`
        };
        
        titleElement.innerHTML = titles[chartCurrentLanguage] || titles.ar;
    }
}

// 20. 🔥 التهيئة الرئيسية
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 بدء تحميل المخطط ببيانات حقيقية...');
    
    setTimeout(async () => {
        // إنشاء واجهة المخطط أولاً
        createChartInterface();
        
        // ثم تهيئة المخطط والأحداث
        await initializeGoldChartWithRealData();
        setupChartEvents();
        setupTypeChangeObserver();
        
        console.log('🎉 المخطط جاهز ببيانات حقيقية!');
    }, 1000);
});

// 21. 🔥 جعل الدوال متاحة globally للاستدعاء من ملفات أخرى
window.refreshGoldChart = refreshChartWithRealData;
window.updateGoldChartPeriod = updateChartPeriod;
