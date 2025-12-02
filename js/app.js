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

// 🔥 جلب البيانات من server.js
async function fetchData() {
    try {
        setStatus('🔄 جاري تحديث البيانات...');
        
        const response = await fetch(`${API_BASE}/api/prices`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        latestData = data;
        
        console.log('✅ بيانات الأسعار المستلمة:', data);
        
        renderPricesFromData();
        updateLast(data['تم التحديث'] || data.updatedAt || new Date().toISOString());
        setStatus('✅ تم التحديث الآن');
        
        showNotification(
            currentLanguage === 'ar' ? 'تم تحديث أسعار الذهب' : 'Gold prices updated',
            'success'
        );
        
    } catch (error) {
        console.error('❌ خطأ في جلب البيانات:', error);
        
        latestData = mockApiData;
        renderPricesFromData();
        updateLast(mockApiData['تم التحديث']);
        setStatus('❌ استخدام بيانات محلية');
        
        showNotification(
            currentLanguage === 'ar' ? 'فشل الاتصال، استخدام بيانات محلية' : 'Connection failed, using local data',
            'error'
        );
    }
}

// 🔥 الحصول على سعر الجرام الأساسي
function getGramBase() {
    if (!latestData) return 5790.8;
    
    if (latestData.price_gram_try) {
        return parseFloat(latestData.price_gram_try);
    }
    
    if (latestData.data && latestData.data.gold && latestData.data.gold.gram24) {
        return parseFloat(latestData.data.gold.gram24.buy.TRY || latestData.data.gold.gram24.sell.TRY);
    }
    
    return 5790.8;
}

// 🔥 دالة عرض الأسعار من البيانات
function renderPricesFromData() {
    console.log('🔍 أحدث بيانات:', latestData);
    
    if (!latestData) {
        latestData = mockApiData;
    }

    let buy = 0;
    let sell = 0;
    let foundData = false;

    // المحاولة الأولى: البيانات الجديدة من server.js
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
                console.log('💰 استخدام البيانات الجديدة من server.js');
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

    console.log('💰 الأسعار النهائية:', { buy, sell, currency: selectedCurrency.code });

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

// 🔥 إدارة التفضيلات المحلية
const userPreferences = {
    get() {
        try {
            return JSON.parse(localStorage.getItem('goldAppPrefs')) || {};
        } catch {
            return {};
        }
    },
    
    set(prefs) {
        try {
            localStorage.setItem('goldAppPrefs', JSON.stringify({ ...this.get(), ...prefs }));
        } catch (error) {
            console.warn('Failed to save preferences:', error);
        }
    },
    
    saveCurrentState() {
        this.set({
            language: currentLanguage,
            selectedType: selectedType.id,
            selectedCurrency: selectedCurrency.code,
            quantity: $('#qty')?.value,
            lastUsed: new Date().toISOString()
        });
    }
};

// 🔥 تحميل الإعدادات
function loadUserPreferences() {
    try {
        const savedLang = localStorage.getItem('siteLanguage') || localStorage.getItem('language');
        if (savedLang && ['ar', 'en', 'tr'].includes(savedLang)) {
            changeLanguage(savedLang);
        }

        const prefs = userPreferences.get();
        
        if (prefs.selectedType && typeMap.has(prefs.selectedType)) {
            selectedType = typeMap.get(prefs.selectedType);
        }
        
        if (prefs.selectedCurrency && currencyMap.has(prefs.selectedCurrency)) {
            selectedCurrency = currencyMap.get(prefs.selectedCurrency);
        }
        
        console.log('✅ الإعدادات المحملة:', { 
            type: selectedType.id, 
            currency: selectedCurrency.code,
            language: currentLanguage
        });
    } catch (e) {
        console.warn('فشل في تحميل الإعدادات:', e);
        selectedType = typeMap.get("gram24");
        selectedCurrency = currencyMap.get("TRY");
    }
}

// 🔥 تنظيف الموارد
function cleanup() {
    if (autoTimer) clearInterval(autoTimer);
    if (newsTimer) clearInterval(newsTimer);
    if (debounceTimer) clearTimeout(debounceTimer);
}

// 🔥 إعداد event listeners
function setupEventListeners() {
    $('#refreshBtn')?.addEventListener('click', fetchData);
    
    $('#unitSelect')?.addEventListener('change', (e) => {
        selectType(e.target.value);
    });
    
    $('#qty')?.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            renderPricesFromData();
            userPreferences.saveCurrentState();
        }, 300);
    });
}

// 🔥 التهيئة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 تطبيق أسعار الذهب يعمل...');
    
    loadUserPreferences();
    buildUI();
    
    setTimeout(() => {
        setActiveUI();
        updateAllTexts();
        updateGoldTypeLabels();
        updateCurrencyLabels();
        setupEventListeners();
        fetchData();
        
        autoTimer = setInterval(fetchData, 300000);
    }, 100);
});

// 🔥 التعامل مع اتصال الشبكة
window.addEventListener('online', () => {
    showNotification(
        currentLanguage === 'ar' ? 'تم استعادة الاتصال بالإنترنت' : 'Internet connection restored',
        'success'
    );
    fetchData();
});

window.addEventListener('offline', () => {
    showNotification(
        currentLanguage === 'ar' ? 'فقدان الاتصال بالإنترنت' : 'Internet connection lost',
        'error'
    );
});

window.addEventListener('beforeunload', cleanup);
