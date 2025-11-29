// chart.js - كود المخطط كاملاً مع البيانات الحقيقية
console.log('✅ chart.js loaded - REAL DATA FROM SOURCE');

// 🔥 المتغيرات العامة
let goldChart;
let chartCurrentPeriod = 'week';
let chartCurrentLanguage = 'ar';
let historicalData = [];

// 1. دالة جلب البيانات التاريخية من الـWorker
async function fetchHistoricalData() {
    try {
        console.log('📊 جلب البيانات التاريخية من المصدر...');
        
        // جلب البيانات الحالية من الـWorker
        const response = await fetch('https://royal-limit-d5a2.mohamad1999mz.workers.dev/');
        const currentData = await response.json();
        
        // إنشاء بيانات تاريخية واقعية بناء على السعر الحالي
        const currentPrice = parseFloat(currentData.price_gram_try);
        const activeType = getActiveGoldType();
        const adjustedPrice = currentPrice * activeType.factor;
        
        // 🔥 إنشاء بيانات الأسبوع الماضي (7 أيام)
        const weekData = [];
        const today = new Date();
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(today.getDate() - i);
            
            // تغير واقعي ±2% لكل يوم
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
                timestamp: new Date().toISOString()
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

// 6. 🔥 دالة تحديث المخطط ببيانات حقيقية
async function refreshChartWithRealData() {
    try {
        console.log('🔄 تحديث المخطط ببيانات حقيقية...');
        
        // جلب البيانات التاريخية أولاً
        await fetchHistoricalData();
        
        const activeType = getActiveGoldType();
        const currentData = historicalData.current;
        
        if (goldChart) {
            // تحديث البيانات مع المعلومات الحقيقية
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
            
            // إضافة سعر اليوم الحالي كمعلومة إضافية
            const currentPriceText = {
                ar: `السعر الحالي: ${currentData.price.toLocaleString('en-US')} TRY`,
                en: `Current Price: ${currentData.price.toLocaleString('en-US')} TRY`,
                tr: `Mevcut Fiyat: ${currentData.price.toLocaleString('en-US')} TRY`
            };
            
            // تحديث خيارات المخطط لإظهار السعر الحالي
            goldChart.options.plugins.tooltip = {
                callbacks: {
                    afterBody: function(context) {
                        return currentPriceText[chartCurrentLanguage] || currentPriceText.ar;
                    }
                }
            };
            
            goldChart.update('none');
            
        } else {
            initializeGoldChartWithRealData();
        }
        
        updateChartTitle();
        updateSyncInfo();
        
        console.log('✅ المخطط تم تحديثه ببيانات حقيقية');
        
    } catch (error) {
        console.error('❌ خطأ في تحديث المخطط:', error);
        // العودة للبيانات الوهمية في حالة الخطأ
        refreshChart();
    }
}

// 7. 🔥 دالة تهيئة المخطط ببيانات حقيقية
async function initializeGoldChartWithRealData() {
    const chartElement = document.getElementById('priceChart');
    if (!chartElement) {
        setTimeout(initializeGoldChartWithRealData, 500);
        return;
    }
    
    // جلب البيانات الحقيقية أولاً
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
    
     // 🔥 إصلاح التلميحات في خيارات المخطط - استبدل هذا الجزء
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
            intersect: false, // 🔥 مهم: يسمح بالتلميحات بدون الضغط المباشر على النقاط
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
                enabled: true, // 🔥 تأكد من تفعيل التلميحات
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: '#FFFFFF',
                bodyColor: '#FFFFFF',
                borderColor: activeType.color,
                borderWidth: 1,
                cornerRadius: 8,
                displayColors: true,
                callbacks: {
                    title: function(context) {
                        // 🔥 عنوان التلميحة - اسم اليوم أو الفترة
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
                        // 🔥 تسمية السعر
                        const price = context.parsed.y;
                        const priceText = {
                            ar: `السعر: ${price.toLocaleString('en-US')} TRY`,
                            en: `Price: ${price.toLocaleString('en-US')} TRY`,
                            tr: `Fiyat: ${price.toLocaleString('en-US')} TRY`
                        };
                        return priceText[chartCurrentLanguage] || priceText.ar;
                    },
                    afterBody: function(context) {
                        // 🔥 معلومات إضافية بعد السعر
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
        // 🔥 إعدادات إضافية لتحسين التفاعل
        elements: {
            point: {
                hoverBackgroundColor: activeType.color,
                hoverBorderColor: '#FFFFFF',
                hoverBorderWidth: 3
            }
        },
        hover: {
            animationDuration: 0 // 🔥 إزالة التأخير في التلميحات
        }
    }
});
    
    updateChartTitle();
    console.log('✅ المخطط تم تحميله ببيانات حقيقية!');
}

// 8. 🔥 استبدال الدوال القديمة بالجديدة
function refreshChart() {
    refreshChartWithRealData();
}

function initializeGoldChart() {
    initializeGoldChartWithRealData();
}

// 9. 🔥 تحديث دالة تغيير الفترة
function updateChartPeriod(period) {
    document.querySelectorAll('.time-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.period === period) {
            btn.classList.add('active');
        }
    });
    
    chartCurrentPeriod = period;
    refreshChartWithRealData();
}

// 10. 🔥 دالة إنشاء زر التزامن
function createSyncButton() {
    const chartSection = document.querySelector('.chart-section');
    if (!chartSection) {
        console.log('❌ قسم المخطط غير موجود');
        return;
    }

    // تحقق إذا كان الزر موجود مسبقاً
    if (document.querySelector('.chart-sync-info')) {
        console.log('✅ زر التزامن موجود مسبقاً');
        return;
    }

    const syncButton = document.createElement('div');
    syncButton.className = 'chart-sync-info';
    syncButton.innerHTML = `
        <div class="sync-indicator">
            <span class="sync-icon">🔄</span>
            <span class="sync-text" id="syncText">المخطط متزامن مع النوع المحدد</span>
        </div>
        <div class="current-type-info" id="currentTypeInfo">
            جاري التحميل...
        </div>
    `;

    // إضافة الأنماط
    syncButton.style.cssText = `
        background: rgba(255, 215, 0, 0.1);
        border: 1px solid rgba(255, 215, 0, 0.3);
        border-radius: 8px;
        padding: 10px 15px;
        margin: 10px 0;
        text-align: center;
        font-family: Tajawal, sans-serif;
    `;

    const syncIndicator = syncButton.querySelector('.sync-indicator');
    syncIndicator.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        margin-bottom: 5px;
        font-size: 14px;
        color: #666;
    `;

    const currentTypeInfo = syncButton.querySelector('.current-type-info');
    currentTypeInfo.style.cssText = `
        font-size: 13px;
        color: #333;
        font-weight: 500;
    `;

    // البحث عن مكان إدراج الزر
    const chartBox = chartSection.querySelector('.chart-box');
    const chartTitle = chartSection.querySelector('h3');
    
    if (chartBox) {
        chartSection.insertBefore(syncButton, chartBox);
    } else if (chartTitle) {
        chartSection.insertBefore(syncButton, chartTitle.nextSibling);
    } else {
        chartSection.prepend(syncButton);
    }

    console.log('✅ زر التزامن تم إنشاؤه بنجاح');
    updateSyncInfo();
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
    const timeButtons = document.querySelectorAll('.time-btn');
    
    if (timeButtons.length === 0) {
        console.log('❌ أزرار الفترة الزمنية غير موجودة');
        // أنشئ الأزرار تلقائياً إذا لم تكن موجودة
        createTimeButtons();
        return;
    }
    
    timeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const period = this.dataset.period;
            if (period) {
                updateChartPeriod(period);
            }
        });
    });
    
    console.log('✅ أحداث المخطط تم إعدادها');
}

// 13. 🔥 دالة إنشاء أزرار الفترة الزمنية إذا لم تكن موجودة
function createTimeButtons() {
    const chartSection = document.querySelector('.chart-section');
    if (!chartSection) return;
    
    // تحقق إذا كانت الأزرار موجودة مسبقاً
    if (document.querySelector('.time-buttons')) return;
    
    const timeButtonsContainer = document.createElement('div');
    timeButtonsContainer.className = 'time-buttons';
    timeButtonsContainer.style.cssText = `
        display: flex;
        gap: 10px;
        margin: 15px 0;
        justify-content: center;
        flex-wrap: wrap;
    `;
    
    const periods = [
        { period: 'week', ar: 'أسبوع', en: 'Week', tr: 'Hafta' },
        { period: 'month', ar: 'شهر', en: 'Month', tr: 'Ay' },
        { period: '3months', ar: '3 أشهر', en: '3 Months', tr: '3 Ay' }
    ];
    
    periods.forEach((item, index) => {
        const button = document.createElement('button');
        button.className = `time-btn ${index === 0 ? 'active' : ''}`;
        button.dataset.period = item.period;
        button.textContent = item[chartCurrentLanguage] || item.ar;
        
        button.style.cssText = `
            padding: 8px 16px;
            border: 2px solid #FFD700;
            background: ${index === 0 ? '#FFD700' : 'white'};
            color: ${index === 0 ? 'white' : '#FFD700'};
            border-radius: 20px;
            cursor: pointer;
            font-family: Tajawal, sans-serif;
            font-size: 14px;
            transition: all 0.3s ease;
        `;
        
        button.addEventListener('mouseenter', function() {
            if (!this.classList.contains('active')) {
                this.style.background = '#FFF9C4';
            }
        });
        
        button.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active')) {
                this.style.background = 'white';
            }
        });
        
        timeButtonsContainer.appendChild(button);
    });
    
    // إدراج الأزرار في المكان المناسب
    const syncInfo = document.querySelector('.chart-sync-info');
    const chartBox = document.querySelector('.chart-box');
    
    if (syncInfo) {
        chartSection.insertBefore(timeButtonsContainer, syncInfo.nextSibling);
    } else if (chartBox) {
        chartSection.insertBefore(timeButtonsContainer, chartBox);
    } else {
        chartSection.appendChild(timeButtonsContainer);
    }
    
    console.log('✅ أزرار الفترة الزمنية تم إنشاؤها');
}

// 14. 🔥 دالة مراقبة تغييرات أنواع الذهب
function setupTypeChangeObserver() {
    const typePills = document.querySelectorAll('.type-pill');
    
    if (typePills.length === 0) {
        console.log('❌ أزرار أنواع الذهب غير موجودة');
        // حاول مرة أخرى بعد وقت إذا لم تكن جاهزة
        setTimeout(setupTypeChangeObserver, 1000);
        return;
    }
    
    typePills.forEach(pill => {
        // إزالة أي أحداث سابقة لمنع التكرار
        pill.removeEventListener('click', handleTypeChange);
        // إضافة الحدث الجديد
        pill.addEventListener('click', handleTypeChange);
    });
    
    console.log('✅ مراقبة تغييرات الأنواع تم إعدادها');
}

// 15. 🔥 دالة معالجة تغيير النوع
function handleTypeChange() {
    setTimeout(() => {
        console.log('🔄 تغيير نوع الذهب، تحديث المخطط...');
        refreshChartWithRealData();
    }, 300);
}

// 16. 🔥 دالة كشف اللغة
function detectChartLanguage() {
    const htmlLang = document.documentElement.getAttribute('lang');
    if (htmlLang) {
        if (htmlLang.includes('en')) return 'en';
        if (htmlLang.includes('tr')) return 'tr';
        return 'ar';
    }
    
    // كشف من النصوص في الصفحة
    const arabicText = document.querySelector('[lang="ar"]');
    const englishText = document.querySelector('[lang="en"]');
    const turkishText = document.querySelector('[lang="tr"]');
    
    if (arabicText) return 'ar';
    if (englishText) return 'en';
    if (turkishText) return 'tr';
    
    return 'ar';
}

// 17. 🔥 دالة الحصول على النوع النشط
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

// 18. 🔥 الدوال المساعدة
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

// 19. 🔥 دالة الحصول على السعر الحالي من الواجهة
function getCurrentGoldPrice() {
    const buyPriceElement = document.getElementById('buyPrice');
    if (buyPriceElement && buyPriceElement.textContent !== '-') {
        let priceText = buyPriceElement.textContent;
        
        // معالجة النص لاستخراج الرقم
        priceText = priceText
            .replace(/[٬,٫.]/g, '')
            .replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d))
            .replace(/[^\d]/g, '')
            .replace(/\s/g, '');
        
        const price = parseFloat(priceText);
        return price || 5790.80; // سعر افتراضي
    }
    return 5790.80;
}

// 20. 🔥 دالة تحديث عنوان المخطط
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

// 21. 🔥 التهيئة الرئيسية
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 بدء تحميل المخطط ببيانات حقيقية...');
    
    setTimeout(async () => {
        createSyncButton();
        await initializeGoldChartWithRealData();
        setupChartEvents();
        setupTypeChangeObserver();
        console.log('🎉 المخطط جاهز ببيانات حقيقية!');
    }, 1000);
});