// 1️⃣ أنواع الذهب بجميع اللغات - مع إضافة عيارات 21 و22
const types = [
    { id: "lira", labels: { ar: "ليرة ذهب", en: "Gold Lira", tr: "Altın Lira" }, img: "images/gold/lira.png", grams: 7.32 },
    { id: "half", labels: { ar: "نصف ليرة", en: "Half Lira", tr: "Yarım Lira" }, img: "images/gold/half.png", grams: 3.66 },
    { id: "quarter", labels: { ar: "ربع ليرة", en: "Quarter Lira", tr: "Çeyrek Lira" }, img: "images/gold/quarter.png", grams: 1.83 },
    { id: "ounce", labels: { ar: "أونصة ذهب", en: "Gold Ounce", tr: "Altın Ons" }, img: "images/gold/gold24.png", grams: 31.1035 },
    { id: "gram24", labels: { ar: "جرام ذهب 24", en: "24g Gold", tr: "24g Altın" }, img: "images/gold/gold24.png", grams: 1 },
    { id: "gram22", labels: { ar: "جرام ذهب 22", en: "22g Gold", tr: "22g Altın" }, img: "images/gold/gold22.png", grams: 1 },
    { id: "gram21", labels: { ar: "جرام ذهب 21", en: "21g Gold", tr: "21g Altın" }, img: "images/gold/gold21.png", grams: 1 },
    { id: "gram18", labels: { ar: "جرام ذهب 18", en: "18g Gold", tr: "18g Altın" }, img: "images/gold/gold18.png", grams: 1 },
    { id: "gram14", labels: { ar: "جرام ذهب 14", en: "14g Gold", tr: "14g Altın" }, img: "images/gold/gold14.png", grams: 1 },
    { id: "silver", labels: { ar: "فضة", en: "Silver", tr: "Gümüş" }, img: "images/gold/silver.png", grams: 1 }
];

// 2️⃣ العملات بجميع اللغات
const currencyList = [
    {code:"TRY", labels: {ar: "الليرة التركية", en: "Turkish Lira", tr: "Türk Lirası"}, flag:"tr"},
    {code:"EUR", labels: {ar: "اليورو", en: "Euro", tr: "Euro"}, flag:"eu"},
    {code:"SAR", labels: {ar: "الريال السعودي", en: "Saudi Riyal", tr: "Suudi Riyali"}, flag:"sa"},
    {code:"AED", labels: {ar: "الدرهم الإماراتي", en: "UAE Dirham", tr: "BAE Dirhemi"}, flag:"ae"},
    {code:"EGP", labels: {ar: "الجنيه المصري", en: "Egyptian Pound", tr: "Mısır Lirası"}, flag:"eg"},
    {code:"IQD", labels: {ar: "الدينار العراقي", en: "Iraqi Dinar", tr: "Irak Dinarı"}, flag:"iq"},
    {code:"KWD", labels: {ar: "الدينار الكويتي", en: "Kuwaiti Dinar", tr: "Kuveyt Dinarı"}, flag:"kw"},
    {code:"USD", labels: {ar: "الدولار الأمريكي", en: "US Dollar", tr: "ABD Doları"}, flag:"us"},
    {code:"SYP", labels: {ar: "الليرة السورية", en: "Syrian Pound", tr: "Suriye Lirası"}, flag:"sy"},
    {code:"BHD", labels: {ar: "الدينار البحريني", en: "Bahraini Dinar", tr: "Bahreyn Dinarı"}, flag:"bh"},
    {code:"DZD", labels: {ar: "الدينار الجزائري", en: "Algerian Dinar", tr: "Cezayir Dinarı"}, flag:"dz"}
];

// 3️⃣ البيانات الاحتياطية - الأسعار المحدثة
const mockApiData = {
    "تم التحديث": "2025-11-23T22:04:30.958Z",
    "price_gram_try": "5790.8",
    "price_gram_usd": "136.8983",
    "price_ounce_usd": "4258.02",
    "المصدر": "Custom Gold Prices",
    "fx": {
        "USD": "1.00",
        "EUR": "0.92",
        "TRY": "42.30",
        "SAR": "3.75",
        "AED": "3.67",
        "KWD": "0.31"
    },
    "gold_coins": {
        "gram24": {
            "buy": "5790.8",
            "sell": "5721.45",
            "weight": "1.00",
            "name_ar": "عيار 24",
            "name_en": "24K Gold",
            "name_tr": "24 Ayar Altın"
        }
        // ... باقي البيانات
    }
};

// 4️⃣ الأعلام في الزاوية للترجمة
const cornerFlags = [
    {code: "TRY", flag: "tr", label: "تركيا", lang: "tr"},
    {code: "USD", flag: "us", label: "أمريكا", lang: "en"},
    {code: "SYP", flag: "sy", label: "سوريا", lang: "ar"}
];

// 5️⃣ الـ Maps للبحث السريع
const typeMap = new Map(types.map(t => [t.id, t]));
const currencyMap = new Map(currencyList.map(c => [c.code, c]));

// 6️⃣ المتغيرات العالمية
let currentLanguage = 'ar';
let goldNews = [];
let selectedType = typeMap.get("gram24");
let selectedCurrency = currencyMap.get("TRY");
let latestData = null;
let autoTimer = null;
let newsTimer = null;
let debounceTimer = null;
const API_BASE = window.location.origin; // التعديل لجلب البيانات من server.js

// 🔥 دالة تنسيق الأرقام - تنسيق موحد لجميع اللغات
function formatNumber(num, currencyCode) {
    if (isNaN(num) || num === null || num === undefined) return '0.00';
    const number = parseFloat(num);
    if (isNaN(number)) return '0.00';

    const englishLocale = 'en-US';

    if (currencyCode === 'IQD' || currencyCode === 'SYP') {
        return Math.round(number).toLocaleString(englishLocale);
    } else if (currencyCode === 'KWD' || currencyCode === 'BHD') {
        return number.toLocaleString(englishLocale, { 
            minimumFractionDigits: 3, 
            maximumFractionDigits: 3 
        });
    } else {
        return number.toLocaleString(englishLocale, { 
            minimumFractionDigits: 2, 
            maximumFractionDigits: 2 
        });
    }
}

// 🔥 دالة تحريك تحديث السعر
function animatePriceUpdate(selector, newValue, changePercent, type) {
    const element = $(selector);
    if (!element) return;

    const oldValue = element.textContent;
    let arrow = '';
    let colorClass = '';

    if (changePercent > 0.1) {
        arrow = '↗';
        colorClass = 'price-up';
    } else if (changePercent < -0.1) {
        arrow = '↘';
        colorClass = 'price-down';
    } else {
        arrow = '→';
        colorClass = 'price-stable';
    }

    element.style.opacity = '0.5';
    element.style.transform = 'translateY(-10px)';
    
    setTimeout(() => {
        element.textContent = `${newValue} ${arrow}`;
        element.className = colorClass;
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
    }, 150);
}

// 🔥 الدوال الأساسية المحسنة
function $(s) { return document.querySelector(s) }

function setStatus(m) {
    const e = $("#apiStatus");
    if(e) {
        e.textContent = m;
        if(m.includes('✅') || m.includes('❌')) {
            e.style.animation = 'fadeInOut 2s ease-in-out';
        }
    }
}

function updateLast(ts) {
    const e = $("#last-update");
    if(!e) return;
    if(ts) {
        try {
            const d = new Date(ts);
            e.textContent = d.toLocaleString('ar-EG');
            return;
        } catch(e) {}
    }
    e.textContent = new Date().toLocaleString('ar-EG');
}

// 🔥 نظام الإشعارات المحسن
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span class="notification-icon">${type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️'}</span>
        <span class="notification-text">${message}</span>
    `;
    
    notification.style.cssText = `
        position: fixed; top: 20px; right: 20px;
        background: ${type === 'error' ? 'rgba(220, 53, 69, 0.95)' : type === 'success' ? 'rgba(40, 167, 69, 0.95)' : 'rgba(23, 162, 184, 0.95)'};
        color: white; padding: 12px 20px; border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 10000;
        animation: slideIn 0.3s ease; backdrop-filter: blur(10px);
        border: 1px solid ${type === 'error' ? '#dc3545' : type === 'success' ? '#28a745' : '#17a2b8'};
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// 🔥 تحديث جميع النصوص
function updateAllTexts() {
    const texts = {
        'brand': {
            ar: 'أسعار الذهب والعملات اليوم',
            en: 'Gold and Currency Prices Today',
            tr: 'Altın ve Döviz Fiyatları'
        },
        'newsLabel': {
            ar: 'أخبار الذهب',
            en: 'Gold News',
            tr: 'Altın Haberleri'
        },
        'refreshBtn': {
            ar: 'تحديث الآن',
            en: 'Refresh Now',
            tr: 'Yenile'
        },
        'chartTitle': {
            ar: 'مخطط أسعار الذهب',
            en: 'Gold Price Chart',
            tr: 'Altın Fiyat Grafiği'
        },
        'syncText': {
            ar: 'المخطط متزامن مع النوع المحدد',
            en: 'Chart synced with selected type',
            tr: 'Grafik seçilen türle senkronize'
        }
    };

    for (const [id, translation] of Object.entries(texts)) {
        const element = $(`#${id}`);
        if (element) {
            element.textContent = translation[currentLanguage] || translation.ar;
        }
    }

    document.querySelectorAll('.card-label').forEach((el, index) => {
        const labels = {
            ar: ['سعر الشراء', 'سعر البيع'],
            en: ['Buy Price', 'Sell Price'],
            tr: ['Alış Fiyatı', 'Satış Fiyatı']
        };
        if (labels[currentLanguage] && labels[currentLanguage][index]) {
            el.textContent = labels[currentLanguage][index];
        }
    });

    updateChartTitles();
}

// 🔥 دالة تحديث عناوين المخطط
function updateChartTitles() {
    const mainChartTitle = document.querySelector('.chart-section h3, .chart-title');
    if (mainChartTitle) {
        const titles = {
            ar: 'مخطط أسعار الذهب',
            en: 'Gold Price Chart',
            tr: 'Altın Fiyat Grafiği'
        };
        mainChartTitle.textContent = titles[currentLanguage] || titles.ar;
    }

    const syncText = document.querySelector('.sync-text');
    if (syncText) {
        const texts = {
            ar: 'المخطط متزامن مع النوع المحدد',
            en: 'Chart synced with selected type',
            tr: 'Grafik seçilen türle senkronize'
        };
        syncText.textContent = texts[currentLanguage] || texts.ar;
    }

    document.querySelectorAll('.time-btn').forEach((btn, index) => {
        const periods = {
            ar: ['أسبوع', 'شهر', '3 أشهر'],
            en: ['Week', 'Month', '3 Months'],
            tr: ['Hafta', 'Ay', '3 Ay']
        };
        if (periods[currentLanguage] && periods[currentLanguage][index]) {
            btn.textContent = periods[currentLanguage][index];
        }
    });
}

// 🔥 تحديث تسميات الذهب
function updateGoldTypeLabels() {
    types.forEach(type => {
        const element = document.getElementById(type.id);
        if (element) {
            const labelElement = element.querySelector('.type-label');
            if (labelElement && type.labels) {
                labelElement.textContent = type.labels[currentLanguage] || type.labels.ar;
            }
        }
    });

    const select = $('#unitSelect');
    if (select) {
        Array.from(select.options).forEach(option => {
            const type = typeMap.get(option.value);
            if (type && type.labels) {
                option.textContent = type.labels[currentLanguage] || type.labels.ar;
            }
        });
    }
}

// 🔥 تحديث تسميات العملات
function updateCurrencyLabels() {
    currencyList.forEach(currency => {
        const element = $(`.flag-card[data-code="${currency.code}"] .flag-label`);
        if (element) {
            element.textContent = currency.labels[currentLanguage] || currency.labels.ar;
        }
    });
}

// 🔥 دالة تغيير اللغة
function changeLanguage(lang) {
    if (!lang || !['ar', 'en', 'tr'].includes(lang)) {
        console.warn('⚠️ لغة غير معترف بها، استخدام العربية كافتراضي:', lang);
        lang = 'ar';
    }

    if (currentLanguage === lang) return;
    
    currentLanguage = lang;
    
    try {
        updateAllTexts();
        updateGoldTypeLabels();
        updateCurrencyLabels();
        
        if (lang === 'ar') {
            document.documentElement.dir = 'rtl';
            document.documentElement.lang = 'ar';
        } else {
            document.documentElement.dir = 'ltr';
            document.documentElement.lang = lang;
        }

        localStorage.setItem('language', lang);
        localStorage.setItem('siteLanguage', lang);
        
        const messages = {
            'ar': 'تم تغيير اللغة إلى العربية',
            'en': 'Language changed to English',
            'tr': 'Dil Türkçe olarak değiştirildi'
        };
        showNotification(messages[lang] || messages['ar'], 'success');
    } catch (error) {
        console.error('❌ خطأ في تغيير اللغة:', error);
        showNotification('حدث خطأ في تغيير اللغة', 'error');
    }
}

// 🔥 بناء الأعلام في الزاوية
function buildCornerFlags() {
    const cornerFlagsContainer = $("#cornerFlags");
    if (!cornerFlagsContainer) return;
    
    cornerFlagsContainer.innerHTML = '';
    cornerFlags.forEach(flag => {
        const flagElement = document.createElement('div');
        flagElement.className = 'corner-flag';
        flagElement.innerHTML = `
            <img src="https://flagcdn.com/w40/${flag.flag}.png" alt="${flag.label}" />
        `;
        flagElement.title = flag.label;
        flagElement.addEventListener('click', () => changeLanguage(flag.lang));
        cornerFlagsContainer.appendChild(flagElement);
    });
}

// 🔥 دالة تغيير العملة
function selectCurrency(code) {
    const c = currencyMap.get(code);
    if (!c) {
        console.log('❌ العملة غير موجودة:', code);
        return;
    }
    
    selectedCurrency = c;
    setActiveUI();
    renderPricesFromData();
    console.log('✅ تم تغيير العملة إلى:', code);
}

// 🔥 دالة تغيير نوع الذهب - تم إصلاح الخطأ هنا
function selectType(typeId) {
    const type = typeMap.get(typeId);
    if (!type) {
        console.log('❌ نوع الذهب غير موجود:', typeId);
        return;
    }
    
    selectedType = type;
    setActiveUI();
    renderPricesFromData();
    console.log('✅ تم تغيير النوع إلى:', typeId);
}

// 🔥 بناء الواجهة
function buildUI() {
    buildCornerFlags();
    
    const tcont = $("#typesScroll");
    if (tcont) {
        tcont.innerHTML = '';
        types.forEach(t => {
            const d = document.createElement('div');
            d.className = 'type-pill';
            d.id = t.id;
            d.innerHTML = `
                <div class="type-pill-content">
                    ${t.karat ? `<div class="karat-badge">${t.karat}</div>` : ''}
                    <div class="type-circle"><img src="${t.img}" alt="${t.labels.ar}"/></div>
                    <div class="type-label">${t.labels[currentLanguage] || t.labels.ar}</div>
                </div>
            `;
            d.addEventListener('click', () => selectType(t.id));
            tcont.appendChild(d);
        });
    }

    const sel = $("#unitSelect");
    if (sel) {
        sel.innerHTML = '';
        types.forEach(t => {
            const o = document.createElement('option');
            o.value = t.id;
            o.textContent = t.labels[currentLanguage] || t.labels.ar;
            sel.appendChild(o);
        });
        
        if (selectedType && selectedType.id) {
            sel.value = selectedType.id;
        } else {
            sel.value = "gram24";
            selectedType = typeMap.get("gram24");
        }
    }
}

// 🔥 تعيين الواجهة النشطة
function setActiveUI() {
    document.querySelectorAll('.type-pill').forEach(e => e.classList.remove('active'));
    
    if (selectedType && selectedType.id) {
        const s = document.getElementById(selectedType.id);
        if (s) s.classList.add('active');
    }

    document.querySelectorAll('.currency-tab').forEach(tab => {
        tab.classList.remove('active');
        if (selectedCurrency && tab.dataset.currency === selectedCurrency.code) {
            tab.classList.add('active');
        }
    });

    document.querySelectorAll('.cur').forEach(e => {
        if (selectedCurrency) {
            e.textContent = selectedCurrency.code;
        }
    });

    if (selectedCurrency) {
        $("#outCur").textContent = selectedCurrency.code;
        $("#outFlag").src = `https://flagcdn.com/w40/${selectedCurrency.flag}.png`;
    }

    const sel = $("#unitSelect");
    if (sel && selectedType && selectedType.id) {
        sel.value = selectedType.id;
    }
}

// 🔥 دالة جلب البيانات من server.js - الإصدار المحسن مع التحقق
async function fetchData() {
    console.group('📥 جلب البيانات من السيرفر');
    
    try {
        // 🔍 1. التحقق من اتصال الإنترنت
        if (!navigator.onLine) {
            console.warn('⚠️ الجهاز غير متصل بالإنترنت');
            showNotification(
                currentLanguage === 'ar' 
                    ? '⚠️ لا يوجد اتصال بالإنترنت' 
                    : '⚠️ No internet connection',
                'warning'
            );
            throw new Error('NO_INTERNET');
        }
        
        setStatus('🔄 جاري تحديث البيانات...');
        
        // 🔍 2. التحقق من تعريف API_BASE
        const apiBase = window.location.origin;
        console.log('🌐 API_BASE:', apiBase);
        
        // 🔍 3. بناء URL
        const apiUrl = `${apiBase}/api/prices`;
        console.log('📡 رابط API:', apiUrl);
        
        // 🔧 4. إعداد الطلب مع timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
            console.warn('⏰ انتهى وقت الانتظار (10 ثوانٍ)');
            controller.abort();
        }, 10000);
        
        // 📡 5. إرسال الطلب
        console.log('📤 إرسال طلب GET...');
        const response = await fetch(apiUrl, {
            signal: controller.signal,
            headers: {
                'Accept': 'application/json',
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache'
            }
        });
        
        clearTimeout(timeoutId);
        
        // 🔍 6. التحقق من استجابة السيرفر
        console.log('📥 حالة الاستجابة:', response.status, response.statusText);
        
        if (!response.ok) {
            console.error('❌ استجابة خاطئة:', response.status);
            
            // محاولة الحصول على رسالة الخطأ
            let errorMessage = `خطأ ${response.status}: ${response.statusText}`;
            try {
                const errorData = await response.text();
                if (errorData) {
                    console.error('📄 محتوى الخطأ:', errorData);
                    errorMessage = `خطأ ${response.status}: ${errorData.substring(0, 100)}`;
                }
            } catch (e) {
                console.warn('⚠️ تعذر قراءة رسالة الخطأ:', e);
            }
            
            throw new Error(`SERVER_ERROR: ${errorMessage}`);
        }
        
        // 🔍 7. التحقق من نوع المحتوى
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            console.error('❌ نوع المحتوى غير متوقع:', contentType);
            throw new Error('INVALID_CONTENT_TYPE');
        }
        
        // 🔍 8. تحليل JSON
        const data = await response.json();
        console.log('✅ بيانات JSON محلاة:', {
            success: data.success,
            timestamp: data.timestamp,
            source: data.source,
            hasData: !!(data.data && data.data.gold)
        });
        
        // 🔍 9. التحقق من هيكل البيانات
        if (!data || typeof data !== 'object') {
            console.error('❌ بيانات غير صالحة');
            throw new Error('INVALID_DATA_STRUCTURE');
        }
        
        // 🔍 10. معالجة البيانات بناءً على الهيكل
        if (data.success === false) {
            console.warn('⚠️ السيرفر أبلغ عن فشل:', data.error);
            
            // إذا كانت هناك بيانات احتياطية
            if (data.fallback && data.data) {
                console.log('📂 استخدام البيانات الاحتياطية من السيرفر');
                latestData = data;
            } else {
                throw new Error(data.error || 'SERVER_REPORTED_FAILURE');
            }
        } else if (data.data && data.data.gold) {
            console.log('✅ بيانات صحيحة مستلمة');
            latestData = data;
        } else if (data.gold_coins) {
            console.log('✅ بيانات قديمة مستلمة');
            latestData = data;
        } else {
            console.warn('⚠️ هيكل بيانات غير متوقع:', Object.keys(data));
            
            // محاولة استخدام البيانات مع التحذير
            latestData = data;
            showNotification(
                currentLanguage === 'ar' 
                    ? '⚠️ هيكل بيانات غير متوقع' 
                    : '⚠️ Unexpected data structure',
                'warning'
            );
        }
        
        // 🔄 11. تحديث الواجهة
        renderPricesFromData();
        
        // ⏰ 12. تحديث وقت التحديث الأخير
        const updateTime = data.timestamp || 
                          data.last_update || 
                          data['تم التحديث'] || 
                          data.updatedAt || 
                          new Date().toISOString();
        updateLast(updateTime);
        
        // ✅ 13. تحديث الحالة
        setStatus('✅ تم التحديث الآن');
        
        // 🎉 14. إظهار إشعار النجاح
        const successTime = new Date().toLocaleTimeString(
            currentLanguage === 'ar' ? 'ar-EG' : 
            currentLanguage === 'tr' ? 'tr-TR' : 'en-US'
        );
        
        showNotification(
            currentLanguage === 'ar' 
                ? `✅ تم تحديث الأسعار (${successTime})`
                : `✅ Prices updated (${successTime})`,
            'success'
        );
        
        // 💾 15. حفظ البيانات محلياً للاستخدام بدون اتصال
        try {
            const cacheData = {
                data: latestData,
                fetchedAt: new Date().toISOString(),
                expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30 دقيقة
            };
            
            localStorage.setItem('goldPricesCache', JSON.stringify(cacheData));
            localStorage.setItem('lastSuccessfulFetch', new Date().toISOString());
            console.log('💾 البيانات محفوظة في localStorage');
        } catch (cacheError) {
            console.warn('⚠️ تعذر حفظ البيانات محلياً:', cacheError.message);
        }
        
        console.log('✅ جلب البيانات اكتمل بنجاح');
        
    } catch (error) {
        console.error('❌ خطأ في جلب البيانات:', error.message || error);
        
        // 🚨 16. معالجة أنواع مختلفة من الأخطاء
        let errorType = 'UNKNOWN';
        let userMessage = '';
        
        if (error.message === 'NO_INTERNET') {
            errorType = 'NO_INTERNET';
            userMessage = currentLanguage === 'ar' 
                ? 'لا يوجد اتصال بالإنترنت' 
                : 'No internet connection';
        } else if (error.message.includes('SERVER_ERROR')) {
            errorType = 'SERVER_ERROR';
            userMessage = currentLanguage === 'ar' 
                ? 'خطأ في السيرفر' 
                : 'Server error';
        } else if (error.message === 'INVALID_CONTENT_TYPE') {
            errorType = 'INVALID_CONTENT_TYPE';
            userMessage = currentLanguage === 'ar' 
                ? 'استجابة غير صالحة من السيرفر' 
                : 'Invalid response from server';
        } else if (error.name === 'AbortError') {
            errorType = 'TIMEOUT';
            userMessage = currentLanguage === 'ar' 
                ? 'انتهى وقت الاتصال' 
                : 'Connection timeout';
        }
        
        // 📂 17. محاولة استخدام البيانات المخزنة محلياً
        let usedCachedData = false;
        
        try {
            const cached = localStorage.getItem('goldPricesCache');
            if (cached) {
                const cache = JSON.parse(cached);
                const expiresAt = new Date(cache.expiresAt);
                
                if (expiresAt > new Date()) {
                    console.log('📂 استخدام البيانات المخزنة محلياً');
                    latestData = cache.data;
                    usedCachedData = true;
                    setStatus('📂 استخدام بيانات محفوظة');
                    
                    showNotification(
                        currentLanguage === 'ar' 
                            ? '📂 استخدام بيانات محفوظة (غير متصل)' 
                            : '📂 Using cached data (offline)',
                        'info'
                    );
                } else {
                    console.log('⏰ البيانات المخزنة منتهية الصلاحية');
                    localStorage.removeItem('goldPricesCache');
                }
            }
        } catch (cacheError) {
            console.warn('⚠️ خطأ في استخدام البيانات المخزنة:', cacheError);
        }
        
        // 🏗️ 18. إذا لم تكن هناك بيانات مخزنة، استخدم البيانات الافتراضية
        if (!usedCachedData) {
            console.log('🏗️ استخدام البيانات الافتراضية');
            latestData = mockApiData;
            setStatus('❌ استخدام بيانات محلية');
            
            showNotification(
                currentLanguage === 'ar' 
                    ? `❌ ${userMessage || 'فشل الاتصال'}. استخدام بيانات محلية`
                    : `❌ ${userMessage || 'Connection failed'}. Using local data`,
                'error'
            );
        }
        
        // 🔄 19. تحديث الواجهة مع البيانات المتاحة
        renderPricesFromData();
        updateLast(latestData['تم التحديث'] || new Date().toISOString());
        
        // 📊 20. تسجيل الخطأ للإحصاءات
        try {
            const errorLog = {
                timestamp: new Date().toISOString(),
                error: error.message || error.toString(),
                type: errorType,
                url: window.location.origin + '/api/prices',
                online: navigator.onLine,
                usedCache: usedCachedData
            };
            
            const errors = JSON.parse(localStorage.getItem('fetchErrors') || '[]');
            errors.push(errorLog);
            if (errors.length > 100) errors.shift();
            localStorage.setItem('fetchErrors', JSON.stringify(errors));
        } catch (logError) {
            console.warn('⚠️ تعذر تسجيل الخطأ:', logError);
        }
        
    } finally {
        // 🔧 21. تنظيف الموارد
        const refreshBtn = document.getElementById('refreshBtn');
        if (refreshBtn) {
            refreshBtn.disabled = false;
            refreshBtn.innerHTML = currentLanguage === 'ar' 
                ? '<i class="fas fa-sync-alt"></i> تحديث'
                : '<i class="fas fa-sync-alt"></i> Refresh';
        }
        
        console.groupEnd();
    }
}

// 🔥 دالة مساعدة لاختبار اتصال السيرفر
async function testServerConnection() {
    try {
        const apiBase = window.location.origin;
        const response = await fetch(`${apiBase}/api/health`, {
            signal: AbortSignal.timeout(3000)
        });
        
        return {
            online: response.ok,
            status: response.status,
            statusText: response.statusText
        };
    } catch (error) {
        return {
            online: false,
            error: error.message
        };
    }
}

// 🔥 التهيئة عند تحميل الصفحة مع التحقق من السيرفر
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 تطبيق أسعار الذهب يعمل...');
    
    // 1. تحميل التفضيلات
    loadUserPreferences();
    
    // 2. بناء الواجهة
    buildUI();
    
    // 3. إعداد الواجهة النشطة
    setTimeout(() => {
        setActiveUI();
        updateAllTexts();
        updateGoldTypeLabels();
        updateCurrencyLabels();
        setupEventListeners();
        
        // 4. اختبار اتصال السيرفر أولاً
        testServerConnection().then(serverStatus => {
            console.log('🔍 حالة السيرفر:', serverStatus);
            
            if (serverStatus.online) {
                // 5. جلب البيانات الجديدة
                fetchData();
                
                // 6. جدولة التحديث التلقائي كل 5 دقائق
                autoTimer = setInterval(fetchData, 5 * 60 * 1000);
            } else {
                // 7. استخدام البيانات المخزنة أو الافتراضية
                console.warn('⚠️ السيرفر غير متوفر:', serverStatus.error);
                
                try {
                    const cached = localStorage.getItem('goldPricesCache');
                    if (cached) {
                        const cache = JSON.parse(cached);
                        if (new Date(cache.expiresAt) > new Date()) {
                            latestData = cache.data;
                            renderPricesFromData();
                            setStatus('📂 استخدام بيانات محفوظة');
                            showNotification(
                                currentLanguage === 'ar' 
                                    ? '📂 استخدام بيانات محفوظة (سيرفر غير متاح)'
                                    : '📂 Using cached data (server unavailable)',
                                'info'
                            );
                            return;
                        }
                    }
                } catch (e) {
                    console.warn('⚠️ خطأ في البيانات المخزنة:', e);
                }
                
                // 8. استخدام البيانات الافتراضية
                latestData = mockApiData;
                renderPricesFromData();
                setStatus('❌ استخدام بيانات محلية');
                showNotification(
                    currentLanguage === 'ar' 
                        ? '❌ السيرفر غير متاح. استخدام بيانات محلية'
                        : '❌ Server unavailable. Using local data',
                    'warning'
                );
            }
        });
        
    }, 100);
});
