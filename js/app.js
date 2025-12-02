// ============================================================================
// 🔥 أسعار الذهب - التطبيق الكامل
// ============================================================================

// 1️⃣ أنواع الذهب بجميع اللغات
const types = [
    { id: "gram24", labels: { ar: "جرام ذهب 24", en: "24K Gold", tr: "24 Ayar Altın" }, img: "images/gold/gold24.png", grams: 1, karat: "24K" },
    { id: "gram22", labels: { ar: "جرام ذهب 22", en: "22K Gold", tr: "22 Ayar Altın" }, img: "images/gold/gold22.png", grams: 1, karat: "22K" },
    { id: "gram21", labels: { ar: "جرام ذهب 21", en: "21K Gold", tr: "21 Ayar Altın" }, img: "images/gold/gold21.png", grams: 1, karat: "21K" },
    { id: "gram18", labels: { ar: "جرام ذهب 18", en: "18K Gold", tr: "18 Ayar Altın" }, img: "images/gold/gold18.png", grams: 1, karat: "18K" },
    { id: "gram14", labels: { ar: "جرام ذهب 14", en: "14K Gold", tr: "14 Ayar Altın" }, img: "images/gold/gold14.png", grams: 1, karat: "14K" },
    { id: "lira", labels: { ar: "ليرة ذهب", en: "Gold Lira", tr: "Altın Lira" }, img: "images/gold/lira.png", grams: 7.32 },
    { id: "half", labels: { ar: "نصف ليرة", en: "Half Lira", tr: "Yarım Lira" }, img: "images/gold/half.png", grams: 3.66 },
    { id: "quarter", labels: { ar: "ربع ليرة", en: "Quarter Lira", tr: "Çeyrek Lira" }, img: "images/gold/quarter.png", grams: 1.83 },
    { id: "ounce", labels: { ar: "أونصة ذهب", en: "Gold Ounce", tr: "Altın Ons" }, img: "images/gold/gold24.png", grams: 31.1035 },
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

// 3️⃣ البيانات الاحتياطية
const mockApiData = {
    "تم التحديث": new Date().toISOString(),
    "price_gram_try": "5790.8",
    "price_gram_usd": "136.8983",
    "price_ounce_usd": "4258.02",
    "المصدر": "أسعار الذهب",
    "fx": {
        "USD": "1.00",
        "EUR": "0.92",
        "TRY": "42.30",
        "SAR": "3.75",
        "AED": "3.67",
        "KWD": "0.31",
        "BHD": "0.38",
        "IQD": "1310.00",
        "EGP": "47.89",
        "SYP": "13000.00",
        "DZD": "134.50"
    },
    "gold_coins": {
        "gram24": {
            "buy": { "TRY": "5790.8", "USD": "136.90", "EUR": "126.05", "SAR": "513.55", "AED": "502.45", "KWD": "42.45", "BHD": "51.95", "IQD": "179000", "EGP": "277500", "SYP": "75300000", "DZD": "77850" },
            "sell": { "TRY": "5721.45", "USD": "135.35", "EUR": "124.61", "SAR": "507.45", "AED": "496.52", "KWD": "41.95", "BHD": "51.35", "IQD": "177000", "EGP": "274000", "SYP": "74300000", "DZD": "76800" },
            "weight": "1.00",
            "name_ar": "جرام ذهب 24",
            "name_en": "24K Gold",
            "name_tr": "24 Ayar Altın"
        }
    }
};

// 4️⃣ الـ Maps للبحث السريع
const typeMap = new Map(types.map(t => [t.id, t]));
const currencyMap = new Map(currencyList.map(c => [c.code, c]));

// 5️⃣ المتغيرات العالمية
let currentLanguage = 'ar';
let goldNews = [];
let selectedType = typeMap.get("gram24");
let selectedCurrency = currencyMap.get("TRY");
let latestData = null;
let autoTimer = null;
let newsTimer = null;
let debounceTimer = null;

// ============================================================================
// 🔥 الدوال المساعدة
// ============================================================================

function $(selector) {
    return document.querySelector(selector);
}

function setStatus(message) {
    const element = $("#apiStatus");
    if (element) {
        element.textContent = message;
    }
}

function updateLast(timestamp) {
    const element = $("#last-update");
    if (element && timestamp) {
        try {
            const date = new Date(timestamp);
            element.textContent = date.toLocaleString('ar-EG');
        } catch (e) {
            element.textContent = new Date().toLocaleString('ar-EG');
        }
    }
}

// 🔥 دالة تنسيق الأرقام
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

    element.textContent = `${newValue} ${arrow}`;
    element.className = colorClass;
}

// 🔥 نظام الإشعارات
function showNotification(message, type = 'info') {
    console.log(`📢 ${type.toUpperCase()}: ${message}`);
    
    // إنشاء عنصر الإشعار
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span class="notification-icon">
            ${type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️'}
        </span>
        <span class="notification-text">${message}</span>
    `;
    
    // إضافة الأنماط
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? 'rgba(220, 53, 69, 0.95)' : 
                     type === 'success' ? 'rgba(40, 167, 69, 0.95)' : 
                     'rgba(23, 162, 184, 0.95)'};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        backdrop-filter: blur(10px);
        border: 1px solid ${type === 'error' ? '#dc3545' : 
                         type === 'success' ? '#28a745' : 
                         '#17a2b8'};
    `;
    
    // إضافة الإشعار إلى الصفحة
    document.body.appendChild(notification);
    
    // إزالة الإشعار بعد 4 ثواني
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// ============================================================================
// 🔥 دوال اللغة والترجمة
// ============================================================================

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
        }
    };

    // تحديث النصوص حسب ID
    for (const [id, translation] of Object.entries(texts)) {
        const element = $(`#${id}`);
        if (element) {
            element.textContent = translation[currentLanguage] || translation.ar;
        }
    }

    // تحديث تسميات الشراء والبيع
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
}

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

function updateCurrencyLabels() {
    currencyList.forEach(currency => {
        const element = $(`.currency-tab[data-currency="${currency.code}"] .currency-label`);
        if (element) {
            element.textContent = currency.labels[currentLanguage] || currency.labels.ar;
        }
    });
}

function changeLanguage(lang) {
    if (!lang || !['ar', 'en', 'tr'].includes(lang)) {
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

// ============================================================================
// 🔥 دوال بناء الواجهة
// ============================================================================

function buildUI() {
    // بناء أنواع الذهب
    const typesContainer = $("#typesScroll");
    if (typesContainer) {
        typesContainer.innerHTML = '';
        types.forEach(type => {
            const div = document.createElement('div');
            div.className = 'type-pill';
            div.id = type.id;
            div.innerHTML = `
                <div class="type-pill-content">
                    ${type.karat ? `<div class="karat-badge">${type.karat}</div>` : ''}
                    <div class="type-circle">
                        <img src="${type.img}" alt="${type.labels.ar}" />
                    </div>
                    <div class="type-label">${type.labels[currentLanguage] || type.labels.ar}</div>
                </div>
            `;
            div.addEventListener('click', () => selectType(type.id));
            typesContainer.appendChild(div);
        });
    }
    
    // بناء أزرار العملات
    const currencyContainer = $(".currency-tabs");
    if (currencyContainer) {
        currencyContainer.innerHTML = '';
        currencyList.forEach(currency => {
            const button = document.createElement('button');
            button.className = 'currency-tab';
            button.dataset.currency = currency.code;
            button.innerHTML = `
                <img src="https://flagcdn.com/w20/${currency.flag}.png" alt="${currency.code}" />
                <span class="currency-label">${currency.labels[currentLanguage] || currency.labels.ar}</span>
            `;
            button.addEventListener('click', () => selectCurrency(currency.code));
            currencyContainer.appendChild(button);
        });
    }
    
    // بناء القائمة المنسدلة
    const select = $("#unitSelect");
    if (select) {
        select.innerHTML = '';
        types.forEach(type => {
            const option = document.createElement('option');
            option.value = type.id;
            option.textContent = type.labels[currentLanguage] || type.labels.ar;
            select.appendChild(option);
        });
        
        if (selectedType) {
            select.value = selectedType.id;
        }
    }
}

function setActiveUI() {
    // تفعيل نوع الذهب المختار
    document.querySelectorAll('.type-pill').forEach(el => {
        el.classList.remove('active');
    });
    
    if (selectedType && selectedType.id) {
        const activeType = document.getElementById(selectedType.id);
        if (activeType) activeType.classList.add('active');
    }
    
    // تفعيل العملة المختارة
    document.querySelectorAll('.currency-tab').forEach(el => {
        el.classList.remove('active');
    });
    
    if (selectedCurrency && selectedCurrency.code) {
        const activeCurrency = $(`.currency-tab[data-currency="${selectedCurrency.code}"]`);
        if (activeCurrency) activeCurrency.classList.add('active');
    }
    
    // تحديث الرموز
    document.querySelectorAll('.cur').forEach(el => {
        if (selectedCurrency) {
            el.textContent = selectedCurrency.code;
        }
    });
}

// ============================================================================
// 🔥 الدوال الأساسية
// ============================================================================

function selectCurrency(code) {
    const currency = currencyMap.get(code);
    if (!currency) {
        console.log('❌ العملة غير موجودة:', code);
        return;
    }
    
    selectedCurrency = currency;
    setActiveUI();
    renderPricesFromData();
    saveUserPreferences();
    console.log('✅ تم تغيير العملة إلى:', code);
}

function selectType(typeId) {
    const type = typeMap.get(typeId);
    if (!type) {
        console.log('❌ نوع الذهب غير موجود:', typeId);
        return;
    }
    
    selectedType = type;
    setActiveUI();
    renderPricesFromData();
    saveUserPreferences();
    console.log('✅ تم تغيير النوع إلى:', typeId);
}

// ============================================================================
// 🔥 إدارة التفضيلات
// ============================================================================

function loadUserPreferences() {
    try {
        // تحميل اللغة
        const savedLang = localStorage.getItem('siteLanguage') || localStorage.getItem('language');
        if (savedLang && ['ar', 'en', 'tr'].includes(savedLang)) {
            changeLanguage(savedLang);
        }

        // تحميل التفضيلات الأخرى
        const prefs = JSON.parse(localStorage.getItem('goldAppPrefs') || '{}');
        
        if (prefs.selectedType && typeMap.has(prefs.selectedType)) {
            selectedType = typeMap.get(prefs.selectedType);
        }
        
        if (prefs.selectedCurrency && currencyMap.has(prefs.selectedCurrency)) {
            selectedCurrency = currencyMap.get(prefs.selectedCurrency);
        }
        
        console.log('✅ التفضيلات المحملة:', { 
            language: currentLanguage,
            type: selectedType.id,
            currency: selectedCurrency.code
        });
    } catch (error) {
        console.warn('⚠️ خطأ في تحميل التفضيلات:', error);
        // استخدام القيم الافتراضية
        selectedType = typeMap.get("gram24");
        selectedCurrency = currencyMap.get("TRY");
    }
}

function saveUserPreferences() {
    try {
        const prefs = {
            language: currentLanguage,
            selectedType: selectedType.id,
            selectedCurrency: selectedCurrency.code,
            quantity: $('#qty')?.value || 1,
            lastUsed: new Date().toISOString()
        };
        
        localStorage.setItem('goldAppPrefs', JSON.stringify(prefs));
    } catch (error) {
        console.warn('⚠️ خطأ في حفظ التفضيلات:', error);
    }
}

// ============================================================================
// 🔥 دوال حساب الأسعار
// ============================================================================

function getGramBase() {
    if (!latestData) return 5790.8;
    
    if (latestData.price_gram_try) {
        return parseFloat(latestData.price_gram_try);
    }
    
    if (latestData.data && latestData.data.gold && latestData.data.gold.gram24) {
        return parseFloat(latestData.data.gold.gram24.buy?.TRY || 
                         latestData.data.gold.gram24.sell?.TRY || 5790.8);
    }
    
    return 5790.8;
}

function renderPricesFromData() {
    if (!latestData) {
        latestData = mockApiData;
    }

    let buy = 0;
    let sell = 0;
    let foundData = false;

    // المحاولة الأولى: البيانات من موقعك
    if (latestData.data && latestData.data.gold) {
        const goldData = latestData.data.gold;
        const selectedGold = goldData[selectedType.id];
        
        if (selectedGold && selectedGold.buy && selectedGold.sell) {
            buy = selectedGold.buy[selectedCurrency.code];
            sell = selectedGold.sell[selectedCurrency.code];
            
            if (buy && sell) {
                buy = parseFloat(buy);
                sell = parseFloat(sell);
                foundData = true;
                console.log('💰 استخدام البيانات من موقعك');
            }
        }
    }

    // المحاولة الثانية: البيانات القديمة
    if (!foundData && latestData.gold_coins) {
        const coinData = latestData.gold_coins;
        const coinKey = selectedType.id;
        
        if (coinData[coinKey]) {
            const coin = coinData[coinKey];
            
            if (coin.buy && typeof coin.buy === 'object') {
                buy = coin.buy[selectedCurrency.code];
                sell = coin.sell[selectedCurrency.code];
            } else {
                buy = coin.buy;
                sell = coin.sell;
            }
            
            if (buy && sell) {
                buy = parseFloat(buy);
                sell = parseFloat(sell);
                foundData = true;
                console.log('💰 استخدام البيانات القديمة');
            }
        }
    }

    // المحاولة الثالثة: الحساب اليدوي
    if (!foundData) {
        console.log('🔄 استخدام الحساب اليدوي...');
        const gramTry = getGramBase();
        let fxRate = 1;
        
        if (latestData.fx && typeof latestData.fx === 'object') {
            const fxMap = new Map(Object.entries(latestData.fx));
            if (fxMap.has(selectedCurrency.code)) {
                fxRate = parseFloat(fxMap.get(selectedCurrency.code));
            }
        }

        let finalPrice = gramTry;
        
        switch(selectedType.id) {
            case "gram24": finalPrice *= 1; break;
            case "gram22": finalPrice *= 0.916; break;
            case "gram21": finalPrice *= 0.875; break;
            case "gram18": finalPrice *= 0.75; break;
            case "gram14": finalPrice *= 0.583; break;
            case "lira": finalPrice *= 7.32; break;
            case "half": finalPrice *= 3.66; break;
            case "quarter": finalPrice *= 1.83; break;
            case "ounce": finalPrice *= 31.1035; break;
            case "silver": finalPrice *= 0.012; break;
            default: finalPrice *= 1; break;
        }

        finalPrice *= fxRate;
        const spread = 0.012;
        buy = +(finalPrice * (1 + spread/2)).toFixed(2);
        sell = +(finalPrice * (1 - spread/2)).toFixed(2);
    }

    console.log('💰 الأسعار النهائية:', { 
        buy, 
        sell, 
        currency: selectedCurrency.code,
        type: selectedType.id 
    });

    const previousBuy = parseFloat($("#buyPrice")?.textContent?.replace(/[^\d.]/g, '')) || buy;
    const previousSell = parseFloat($("#sellPrice")?.textContent?.replace(/[^\d.]/g, '')) || sell;
    
    const buyChangePercent = previousBuy ? ((buy - previousBuy) / previousBuy) * 100 : 0;
    const sellChangePercent = previousSell ? ((sell - previousSell) / previousSell) * 100 : 0;

    animatePriceUpdate('#buyPrice', formatNumber(buy, selectedCurrency.code), buyChangePercent, 'buy');
    animatePriceUpdate('#sellPrice', formatNumber(sell, selectedCurrency.code), sellChangePercent, 'sell');

    const qty = parseFloat($("#qty")?.value) || 1;
    const resultValue = sell * qty;
    
    if ($("#result")) {
        $("#result").value = formatNumber(resultValue, selectedCurrency.code) + ' ' + selectedCurrency.code;
    }
}

// ============================================================================
// 🔥 دوال جلب البيانات
// ============================================================================

async function fetchData() {
    console.group('📥 جلب البيانات من السيرفر');
    
    try {
        setStatus('🔄 جاري تحديث البيانات...');
        
        // التحقق من اتصال الإنترنت
        if (!navigator.onLine) {
            throw new Error('NO_INTERNET');
        }
        
        // 🔥 استخدام موقعك: https://aswar-altin.vercel.app
        const apiUrl = 'https://aswar-altin.vercel.app/api/prices';
        console.log('📡 رابط موقعك:', apiUrl);
        
        // إعداد الطلب مع timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
            controller.abort();
        }, 10000);
        
        // إرسال الطلب
        const response = await fetch(apiUrl, {
            signal: controller.signal,
            headers: {
                'Accept': 'application/json',
                'Cache-Control': 'no-cache'
            }
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // تحليل JSON
        const data = await response.json();
        console.log('✅ البيانات المستلمة من موقعك:', data);
        
        // حفظ البيانات
        latestData = data;
        
        // تحديث الواجهة
        renderPricesFromData();
        
        // تحديث وقت التحديث الأخير
        const updateTime = data.timestamp || 
                          data.last_update || 
                          data['تم التحديث'] || 
                          data.updatedAt || 
                          new Date().toISOString();
        updateLast(updateTime);
        
        // تحديث الحالة
        setStatus('✅ تم التحديث الآن');
        
        // إظهار إشعار النجاح
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
        
        // حفظ البيانات في localStorage
        try {
            const cacheData = {
                data: latestData,
                fetchedAt: new Date().toISOString(),
                expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString()
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
        
        // محاولة استخدام البيانات المخزنة
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
                }
            }
        } catch (cacheError) {
            console.warn('⚠️ خطأ في استخدام البيانات المخزنة:', cacheError);
        }
        
        // استخدام البيانات الافتراضية
        if (!usedCachedData) {
            console.log('🏗️ استخدام البيانات الافتراضية');
            latestData = mockApiData;
            setStatus('❌ استخدام بيانات محلية');
            
            showNotification(
                currentLanguage === 'ar' 
                    ? '❌ فشل الاتصال. استخدام بيانات محلية'
                    : '❌ Connection failed. Using local data',
                'error'
            );
        }
        
        // تحديث الواجهة
        renderPricesFromData();
        updateLast(latestData['تم التحديث'] || new Date().toISOString());
        
    } finally {
        console.groupEnd();
    }
}

// ============================================================================
// 🔥 مستمعو الأحداث
// ============================================================================

function setupEventListeners() {
    // زر التحديث
    const refreshBtn = $("#refreshBtn");
    if (refreshBtn) {
        refreshBtn.addEventListener('click', fetchData);
    }

    // القائمة المنسدلة للأنواع
    const unitSelect = $("#unitSelect");
    if (unitSelect) {
        unitSelect.addEventListener('change', (e) => {
            selectType(e.target.value);
        });
    }

    // حقل الكمية
    const qtyInput = $("#qty");
    if (qtyInput) {
        qtyInput.addEventListener('input', () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                renderPricesFromData();
                saveUserPreferences();
            }, 300);
        });
    }
}

function cleanup() {
    if (autoTimer) clearInterval(autoTimer);
    if (newsTimer) clearInterval(newsTimer);
    if (debounceTimer) clearTimeout(debounceTimer);
}

// ============================================================================
// 🔥 التهيئة الرئيسية
// ============================================================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 تطبيق أسعار الذهب يعمل...');
    console.log('🌐 موقعك: https://aswar-altin.vercel.app');
    
    // 1. تحميل التفضيلات
    loadUserPreferences();
    
    // 2. بناء الواجهة
    buildUI();
    
    // 3. إعداد الواجهة
    setTimeout(() => {
        setActiveUI();
        updateAllTexts();
        updateGoldTypeLabels();
        updateCurrencyLabels();
        setupEventListeners();
        
        // 4. جلب البيانات
        fetchData();
        
        // 5. جدولة التحديث التلقائي (كل 5 دقائق)
        autoTimer = setInterval(fetchData, 5 * 60 * 1000);
        
        console.log('✅ التطبيق مهيأ وجاهز للعمل');
    }, 100);
});

// تنظيف الموارد عند إغلاق الصفحة
window.addEventListener('beforeunload', cleanup);
window.addEventListener('pagehide', cleanup);

// التعامل مع اتصال الشبكة
window.addEventListener('online', () => {
    showNotification(
        currentLanguage === 'ar' 
            ? '🌐 تم استعادة الاتصال بالإنترنت'
            : '🌐 Internet connection restored',
        'success'
    );
    fetchData();
});

window.addEventListener('offline', () => {
    showNotification(
        currentLanguage === 'ar' 
            ? '⚠️ فقدان الاتصال بالإنترنت'
            : '⚠️ Internet connection lost',
        'warning'
    );
});
