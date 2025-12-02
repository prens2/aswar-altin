// ============================================================================
// 🔥 GOLD PRICES APP - COMPLETE VERSION
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

// 3️⃣ الأعلام في الزاوية للترجمة
const cornerFlags = [
    {code: "TRY", flag: "tr", label: "تركيا", lang: "tr"},
    {code: "USD", flag: "us", label: "أمريكا", lang: "en"},
    {code: "SYP", flag: "sy", label: "سوريا", lang: "ar"}
];

// 4️⃣ البيانات الاحتياطية
const mockApiData = {
    "تم التحديث": new Date().toISOString(),
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
        "KWD": "0.31",
        "BHD": "0.38",
        "IQD": "1310.00",
        "EGP": "47.89",
        "SYP": "13000.00",
        "DZD": "134.50"
    },
    "gold_coins": {
        "gram24": {
            "buy": { "TRY": "5790.8", "USD": "136.90", "EUR": "126.05", "SAR": "513.55", "AED": "502.45" },
            "sell": { "TRY": "5721.45", "USD": "135.35", "EUR": "124.61", "SAR": "507.45", "AED": "496.52" }
        }
    }
};

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

// ============================================================================
// 🔥 HELPER FUNCTIONS
// ============================================================================

function $(selector) {
    return document.querySelector(selector);
}

function setStatus(message) {
    const element = $("#apiStatus");
    if (element) {
        element.textContent = message;
        if (message.includes('✅') || message.includes('❌')) {
            element.style.animation = 'fadeInOut 2s ease-in-out';
        }
    }
}

function updateLast(timestamp) {
    const element = $("#last-update");
    if (!element) return;
    
    try {
        if (timestamp) {
            const date = new Date(timestamp);
            element.textContent = date.toLocaleString('ar-EG');
        } else {
            element.textContent = new Date().toLocaleString('ar-EG');
        }
    } catch (error) {
        element.textContent = new Date().toLocaleString('ar-EG');
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
// 🔥 LANGUAGE & TRANSLATION FUNCTIONS
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
// 🔥 UI BUILDING FUNCTIONS
// ============================================================================

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

function buildUI() {
    // بناء الأعلام في الزاوية
    buildCornerFlags();
    
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
    
    if (selectedCurrency) {
        const outCur = $("#outCur");
        const outFlag = $("#outFlag");
        if (outCur) outCur.textContent = selectedCurrency.code;
        if (outFlag) outFlag.src = `https://flagcdn.com/w40/${selectedCurrency.flag}.png`;
    }
    
    // تحديث القائمة المنسدلة
    const select = $("#unitSelect");
    if (select && selectedType) {
        select.value = selectedType.id;
    }
}

// ============================================================================
// 🔥 CORE FUNCTIONS
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
// 🔥 DATA FETCHING FUNCTIONS
// ============================================================================

// 🔥 دالة جلب البيانات مع معالجة خاصة لخطأ 404
async function fetchData() {
    console.group('📥 جلب البيانات من السيرفر');
    
    try {
        setStatus('🔄 جاري تحديث البيانات...');
        
        // 1️⃣ التحقق من اتصال الإنترنت
        if (!navigator.onLine) {
            console.warn('⚠️ الجهاز غير متصل بالإنترنت');
            throw new Error('NO_INTERNET');
        }
        
        // 2️⃣ بناء URL - استخدام الرابط المباشر من الصورة
        // بدلاً من window.location.origin استخدم الرابط المباشر
        const apiUrl = 'https://amap-altin.ueeeel.app/api/prices';
        console.log('📡 رابط API المستخدم:', apiUrl);
        
        // 3️⃣ إعداد الطلب مع تحسين الـ headers
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
            console.warn('⏰ انتهى وقت الانتظار (10 ثوانٍ)');
            controller.abort();
        }, 10000);
        
        // 4️⃣ إرسال الطلب
        console.log('📤 إرسال طلب GET...');
        const response = await fetch(apiUrl, {
            signal: controller.signal,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            },
            mode: 'cors',
            credentials: 'omit'
        });
        
        clearTimeout(timeoutId);
        
        // 5️⃣ تحليل الاستجابة
        console.log('📥 حالة الاستجابة:', {
            status: response.status,
            statusText: response.statusText,
            ok: response.ok,
            url: response.url
        });
        
        // 6️⃣ معالجة خطأ 404 بشكل خاص
        if (response.status === 404) {
            console.error('❌ خطأ 404: نقطة النهاية غير موجودة');
            
            // حاول قراءة محتوى الاستجابة لمعرفة المزيد
            try {
                const errorHtml = await response.text();
                console.log('📄 محتوى خطأ 404 (أول 500 حرف):', errorHtml.substring(0, 500));
                
                // تحقق إذا كان هناك رسالة خطأ محددة
                if (errorHtml.includes('Not Found') || errorHtml.includes('404')) {
                    console.log('🔍 تم تأكيد خطأ 404: صفحة غير موجودة');
                }
            } catch (e) {
                console.warn('⚠️ تعذر قراءة محتوى الخطأ:', e.message);
            }
            
            // حاول استخدام endpoints بديلة
            const alternativeData = await tryAlternativeEndpoints();
            if (alternativeData) {
                console.log('✅ نجحت المحاولة مع endpoint بديل');
                latestData = alternativeData;
            } else {
                throw new Error('API_ENDPOINT_NOT_FOUND');
            }
        } 
        // 7️⃣ معالجة أخطاء HTTP الأخرى
        else if (!response.ok) {
            console.error(`❌ خطأ HTTP: ${response.status} ${response.statusText}`);
            
            // حاول قراءة رسالة الخطأ
            let errorMessage = `HTTP ${response.status}`;
            try {
                const errorText = await response.text();
                if (errorText) {
                    errorMessage = `${errorMessage}: ${errorText.substring(0, 100)}`;
                }
            } catch (e) {
                // تجاهل إذا تعذر قراءة محتوى الخطأ
            }
            
            throw new Error(errorMessage);
        }
        
        // 8️⃣ تحليل محتوى الاستجابة
        const contentType = response.headers.get('content-type') || '';
        console.log('📄 نوع المحتوى:', contentType);
        
        let data;
        
        // تحقق إذا كان المحتوى JSON
        if (contentType.includes('application/json')) {
            data = await response.json();
            console.log('✅ JSON محلل بنجاح');
        } 
        // إذا كان HTML، حاول استخراج JSON منه
        else if (contentType.includes('text/html')) {
            console.warn('⚠️ الاستجابة هي HTML، محاولة استخراج JSON...');
            const html = await response.text();
            
            // ابحث عن JSON في HTML
            const jsonMatch = html.match(/<script[^>]*>.*?({.*}).*?<\/script>/s) || 
                             html.match(/\{.*\}/s);
            
            if (jsonMatch && jsonMatch[1]) {
                try {
                    data = JSON.parse(jsonMatch[1]);
                    console.log('✅ تم استخراج JSON من HTML');
                } catch (parseError) {
                    console.error('❌ فشل في تحليل JSON من HTML:', parseError.message);
                    throw new Error('INVALID_JSON_IN_HTML');
                }
            } else {
                console.error('❌ لم يتم العثور على JSON في HTML');
                throw new Error('NO_JSON_IN_HTML');
            }
        }
        // إذا كان نصاً عادياً، حاول تحليله كـ JSON
        else if (contentType.includes('text/plain')) {
            const text = await response.text();
            try {
                data = JSON.parse(text);
                console.log('✅ JSON محلل من نص عادي');
            } catch (parseError) {
                console.error('❌ النص ليس JSON صالح:', parseError.message);
                throw new Error('INVALID_JSON_TEXT');
            }
        }
        // إذا كان نوع محتوى غير معروف
        else {
            console.warn('⚠️ نوع محتوى غير معروف، محاولة التحليل كـ JSON...');
            try {
                const text = await response.text();
                data = JSON.parse(text);
                console.log('✅ JSON محلل من نوع غير معروف');
            } catch (parseError) {
                console.error('❌ فشل في تحليل البيانات:', parseError.message);
                throw new Error('UNKNOWN_CONTENT_TYPE');
            }
        }
        
        // 9️⃣ التحقق من صحة البيانات
        if (!data || typeof data !== 'object') {
            console.error('❌ بيانات غير صالحة:', data);
            throw new Error('INVALID_DATA');
        }
        
        // 🔟 حفظ البيانات
        latestData = data;
        console.log('✅ البيانات محفوظة:', {
            hasData: !!(data.data || data.gold_coins),
            timestamp: data.timestamp || data['تم التحديث'],
            success: data.success
        });
        
        // 1️⃣1️⃣ تحديث الواجهة
        renderPricesFromData();
        
        // 1️⃣2️⃣ تحديث وقت التحديث الأخير
        const updateTime = data.timestamp || 
                          data.last_update || 
                          data['تم التحديث'] || 
                          data.updatedAt || 
                          new Date().toISOString();
        updateLast(updateTime);
        
        // 1️⃣3️⃣ تحديث الحالة
        setStatus('✅ تم التحديث الآن');
        
        // 1️⃣4️⃣ إظهار إشعار النجاح
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
        
        // 1️⃣5️⃣ حفظ البيانات في localStorage
        try {
            const cacheData = {
                data: latestData,
                fetchedAt: new Date().toISOString(),
                expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 دقيقة
                source: apiUrl
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
        
        // 🔄 معالجة أنواع مختلفة من الأخطاء
        let errorType = 'UNKNOWN';
        let userMessage = '';
        
        if (error.message === 'NO_INTERNET') {
            errorType = 'NO_INTERNET';
            userMessage = currentLanguage === 'ar' 
                ? 'لا يوجد اتصال بالإنترنت' 
                : 'No internet connection';
        } else if (error.message === 'API_ENDPOINT_NOT_FOUND') {
            errorType = 'API_NOT_FOUND';
            userMessage = currentLanguage === 'ar' 
                ? 'API غير موجود (404)' 
                : 'API not found (404)';
        } else if (error.message.includes('HTTP')) {
            errorType = 'HTTP_ERROR';
            userMessage = currentLanguage === 'ar' 
                ? `خطأ في السيرفر: ${error.message}` 
                : `Server error: ${error.message}`;
        } else if (error.name === 'AbortError') {
            errorType = 'TIMEOUT';
            userMessage = currentLanguage === 'ar' 
                ? 'انتهى وقت الاتصال' 
                : 'Connection timeout';
        }
        
        console.log(`📊 نوع الخطأ: ${errorType}`);
        
        // 📂 محاولة استخدام البيانات المخزنة محلياً
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
        
        // 🏗️ إذا لم تكن هناك بيانات مخزنة، استخدم البيانات الافتراضية
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
        
        // 🔄 تحديث الواجهة مع البيانات المتاحة
        renderPricesFromData();
        updateLast(latestData['تم التحديث'] || new Date().toISOString());
        
        // 📊 تسجيل الخطأ للإحصاءات
        try {
            const errorLog = {
                timestamp: new Date().toISOString(),
                error: error.message || error.toString(),
                type: errorType,
                url: 'https://amap-altin.ueeeel.app/api/prices',
                online: navigator.onLine,
                usedCache: usedCachedData,
                userAgent: navigator.userAgent
            };
            
            const errors = JSON.parse(localStorage.getItem('fetchErrors') || '[]');
            errors.push(errorLog);
            if (errors.length > 50) errors.shift();
            localStorage.setItem('fetchErrors', JSON.stringify(errors));
        } catch (logError) {
            console.warn('⚠️ تعذر تسجيل الخطأ:', logError);
        }
        
    } finally {
        console.groupEnd();
    }
}

// 🔥 دالة لمحاولة endpoints بديلة
async function tryAlternativeEndpoints() {
    console.log('🔄 محاولة استخدام endpoints بديلة...');
    
    const baseUrl = 'https://amap-altin.ueeeel.app';
    const alternativeEndpoints = [
        `${baseUrl}/prices`,           // بدون /api
        `${baseUrl}/api/gold-prices`,  // مسار مختلف
        `${baseUrl}/api/data`,         // مسار آخر
        `${baseUrl}/api/`,             // المسار الأساسي
        `${baseUrl}/gold-prices`,      // مسار مباشر
        `${baseUrl}/data`,             // مسار بيانات
        `${baseUrl}/api/v1/prices`,    // إصدار API
        `${baseUrl}/api/v1/gold`       // إصدار API آخر
    ];
    
    for (const endpoint of alternativeEndpoints) {
        try {
            console.log(`🔍 محاولة: ${endpoint}`);
            
            const response = await fetch(endpoint, { 
                signal: AbortSignal.timeout(5000),
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            console.log(`📊 النتيجة: ${response.status} ${response.statusText}`);
            
            if (response.ok) {
                const contentType = response.headers.get('content-type') || '';
                
                if (contentType.includes('application/json')) {
                    const data = await response.json();
                    console.log(`✅ نجحت المحاولة مع ${endpoint}`);
                    return data;
                } else if (contentType.includes('text/html')) {
                    // حاول استخراج JSON من HTML
                    const html = await response.text();
                    const jsonMatch = html.match(/\{.*\}/s);
                    
                    if (jsonMatch) {
                        try {
                            const data = JSON.parse(jsonMatch[0]);
                            console.log(`✅ تم استخراج JSON من HTML في ${endpoint}`);
                            return data;
                        } catch (e) {
                            console.log(`❌ JSON غير صالح في ${endpoint}`);
                        }
                    }
                }
            }
        } catch (error) {
            console.log(`❌ فشلت المحاولة مع ${endpoint}: ${error.message}`);
        }
    }
    
    console.log('❌ جميع المحاولات البديلة فشلت');
    return null;
}

// 🔥 دالة لاختبار الاتصال بالـ API
async function testAPIConnection() {
    console.log('🔍 بدء اختبار اتصال API...');
    
    const endpoints = [
        'https://amap-altin.ueeeel.app/api/prices',
        'https://amap-altin.ueeeel.app/prices',
        'https://amap-altin.ueeeel.app/api',
        'https://amap-altin.ueeeel.app/'
    ];
    
    const results = [];
    
    for (const endpoint of endpoints) {
        try {
            console.log(`🔍 اختبار: ${endpoint}`);
            
            const response = await fetch(endpoint, {
                method: 'GET',
                signal: AbortSignal.timeout(3000),
                headers: {
                    'Accept': 'text/html,application/json'
                }
            });
            
            const contentType = response.headers.get('content-type') || '';
            const isJson = contentType.includes('application/json');
            const isHtml = contentType.includes('text/html');
            
            results.push({
                endpoint,
                status: response.status,
                statusText: response.statusText,
                contentType,
                isJson,
                isHtml,
                ok: response.ok
            });
            
            console.log(`📊 النتيجة: ${response.status} ${response.statusText} (${contentType})`);
            
        } catch (error) {
            results.push({
                endpoint,
                error: error.message,
                ok: false
            });
            console.log(`❌ خطأ: ${error.message}`);
        }
    }
    
    console.table(results);
    return results;
}

// 🔥 تعديل التهيئة لتشمل اختبار API
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 تطبيق أسعار الذهب يعمل...');
    
    // 1. تحميل التفضيلات
    loadUserPreferences();
    
    // 2. بناء الواجهة
    buildUI();
    
    // 3. إعداد الواجهة
    setTimeout(async () => {
        setActiveUI();
        updateAllTexts();
        updateGoldTypeLabels();
        updateCurrencyLabels();
        setupEventListeners();
        
        // 4. اختبار اتصال API أولاً
        console.log('🔍 بدء اختبار اتصال API...');
        const apiTestResults = await testAPIConnection();
        
        // 5. تحليل نتائج الاختبار
        const workingEndpoint = apiTestResults.find(r => r.ok);
        
        if (workingEndpoint) {
            console.log(`✅ تم العثور على endpoint يعمل: ${workingEndpoint.endpoint}`);
            showNotification(`✅ تم الاتصال بـ ${workingEndpoint.endpoint}`, 'success');
        } else {
            console.warn('⚠️ لم يتم العثور على أي endpoint يعمل');
            showNotification('⚠️ السيرفر غير متاح، استخدام بيانات محلية', 'warning');
        }
        
        // 6. جلب البيانات
        await fetchData();
        
        // 7. جدولة التحديث التلقائي (كل 10 دقائق)
        autoTimer = setInterval(fetchData, 10 * 60 * 1000);
        
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
