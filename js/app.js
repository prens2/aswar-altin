

// 1️⃣ أنواع الذهب بجميع اللغات - مع إضافة عيارات 21 و22
const types = [
  {
    id: "lira", 
    labels: { ar: "ليرة ذهب", en: "Gold Lira", tr: "Altın Lira" },
    img: "images/gold/lira.png", 
    grams: 7.32
  },
  {
    id: "half", 
    labels: { ar: "نصف ليرة", en: "Half Lira", tr: "Yarım Lira" },
    img: "images/gold/half.png", 
    grams: 3.66
  },
  {
    id: "quarter", 
    labels: { ar: "ربع ليرة", en: "Quarter Lira", tr: "Çeyrek Lira" },
    img: "images/gold/quarter.png", 
    grams: 1.83
  },
  {
    id: "ounce", 
    labels: { ar: "أونصة ذهب", en: "Gold Ounce", tr: "Altın Ons" },
    img: "images/gold/gold24.png", 
    grams: 31.1035
  },
  {
    id: "gram24",
    labels: { ar: "جرام ذهب 24", en: "24g Gold", tr: "24g Altın" },
    img: "images/gold/gold24.png", 
    grams: 1
  },
  {
    id: "gram22",
    labels: { ar: "جرام ذهب 22", en: "22g Gold", tr: "22g Altın" },
    img: "images/gold/gold22.png", 
    grams: 1
  },
  {
    id: "gram21",
    labels: { ar: "جرام ذهب 21", en: "21g Gold", tr: "21g Altın" },
    img: "images/gold/gold21.png", 
    grams: 1
  },
  {
    id: "gram18", 
    labels: { ar: "جرام ذهب 18", en: "18g Gold", tr: "18g Altın" },
    img: "images/gold/gold18.png", 
    grams: 1
  },
  {
    id: "gram14",
    labels: { ar: "جرام ذهب 14", en: "14g Gold", tr: "14g Altın" },
    img: "images/gold/gold14.png", 
    grams: 1
  },
  {
    id: "silver", 
    labels: { ar: "فضة", en: "Silver", tr: "Gümüş" },
    img: "images/gold/silver.png", 
    grams: 1
  }
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

// 3️⃣ البيانات الاحتياطية - الأسعار المحدثة من Workers
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
        },
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

// 7️⃣ باقي الدوال والكود...
// 🔥 دالة تنسيق الأرقام - تنسيق موحد لجميع اللغات
function formatNumber(num, currencyCode) {
  if (isNaN(num) || num === null || num === undefined) return '0.00';
  
  const number = parseFloat(num);
  if (isNaN(number)) return '0.00';
  
  // 🔥 استخدم التنسيق الإنجليزي دائماً بغض النظر عن اللغة الحالية
  const englishLocale = 'en-US';
  
  // تنسيق بناءً على العملة
  if (currencyCode === 'IQD' || currencyCode === 'SYP') {
    // العملات ذات القيم الكبيرة - بدون كسور
    return Math.round(number).toLocaleString(englishLocale);
  } else if (currencyCode === 'KWD' || currencyCode === 'BHD') {
    // عملات ذات قيم عالية - 3 خانات عشرية
    return number.toLocaleString(englishLocale, {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3
    });
  } else {
    // معظم العملات - خانتان عشريتان
    return number.toLocaleString(englishLocale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }
}

// 🔥 دالة توحيد تنسيق الأرقام في الواجهة - جديدة
function unifyNumberFormatting() {
    console.log('🔢 توحيد تنسيق الأرقام...');
    
    // تحديث أسعار الشراء والبيع
    const buyPriceElement = document.getElementById('buyPrice');
    const sellPriceElement = document.getElementById('sellPrice');
    
    if (buyPriceElement && sellPriceElement) {
        const currentBuy = buyPriceElement.textContent;
        const currentSell = sellPriceElement.textContent;
        
        // استخراج الأرقام فقط
        const buyNumber = parseFloat(currentBuy.replace(/[^\d.]/g, ''));
        const sellNumber = parseFloat(currentSell.replace(/[^\d.]/g, ''));
        
        // إعادة التنسيق بشكل موحد
        if (!isNaN(buyNumber)) {
            buyPriceElement.textContent = formatNumber(buyNumber, 'TRY');
        }
        if (!isNaN(sellNumber)) {
            sellPriceElement.textContent = formatNumber(sellNumber, 'TRY');
        }
    }
}

// 🔥 دالة تحريك تحديث السعر
function animatePriceUpdate(selector, newValue, changePercent, type) {
  const element = $(selector);
  if (!element) return;
  
  const oldValue = element.textContent;
  
  // إضافة سهم للتغير
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
  
  // تطبيق الأنيميشن
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
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'error' ? 'rgba(220, 53, 69, 0.95)' : type === 'success' ? 'rgba(40, 167, 69, 0.95)' : 'rgba(23, 162, 184, 0.95)'};
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 10000;
    animation: slideIn 0.3s ease;
    backdrop-filter: blur(10px);
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
    // 🔥 أضف عناوين المخطط
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
  
  // 🔥 تحديث عناوين المخطط إذا كانت موجودة
  updateChartTitles();
}

// 🔥 دالة تحديث عناوين المخطط
function updateChartTitles() {
  // تحديث العنوان الرئيسي للمخطط
  const mainChartTitle = document.querySelector('.chart-section h3, .chart-title');
  if (mainChartTitle) {
    const titles = {
      ar: 'مخطط أسعار الذهب',
      en: 'Gold Price Chart',
      tr: 'Altın Fiyat Grafiği'
    };
    mainChartTitle.textContent = titles[currentLanguage] || titles.ar;
  }
  
  // تحديث نص التزامن
  const syncText = document.querySelector('.sync-text');
  if (syncText) {
    const texts = {
      ar: 'المخطط متزامن مع النوع المحدد',
      en: 'Chart synced with selected type',
      tr: 'Grafik seçilen türle senkronize'
    };
    syncText.textContent = texts[currentLanguage] || texts.ar;
  }
  
  // تحديث أزرار الفترة الزمنية
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

// 🔥 تحديث تسميات الذهب - مصححة تماماً
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

// 🔥 دالة حماية المخطط من الاختفاء
function protectChartFromDisappearing() {
  const chartElements = [
    '#priceChart',
    '.chart-container',
    '.chart-section',
    '.chart-box'
  ];
  
  chartElements.forEach(selector => {
    const element = document.querySelector(selector);
    if (element) {
      element.style.display = 'block';
      element.style.visibility = 'visible';
      element.style.opacity = '1';
    }
  });
}

// 🔥 دالة تغيير اللغة المحسنة
function changeLanguage(lang) {
    // 🔥 تحقق من أن lang معرف وصحيح
    if (!lang || !['ar', 'en', 'tr'].includes(lang)) {
        console.error('❌ lang is undefined or invalid:', lang);
        lang = 'ar'; // استخدم العربية كافتراضي
    }
    
    console.log('🔄 Changing language to:', lang);
    currentLanguage = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    
    setTimeout(() => {
        updateAllTexts();
        updateGoldTypeLabels();
        updateCurrencyLabels();
        updateNewsDisplay();
        
        // 🔥 توحيد تنسيق الأرقام بعد تغيير اللغة
        unifyNumberFormatting();
        
        // 🔥 استدعاء المخطط من app.js فقط
        if (typeof handleLanguageChange === 'function') {
            handleLanguageChange();
        }
        
    }, 100);
    
    localStorage.setItem('siteLanguage', lang);
    showNotification(
        lang === 'ar' ? 'تم تغيير اللغة إلى العربية' : 
        lang === 'en' ? 'Language changed to English' : 'Dil Türkçe olarak değiştirildi',
        'success'
    );
}
    
// 🔥 حل بديل فوري - أضف هذا في النهاية
function forceChartUpdate() {
    const chartElement = document.getElementById('priceChart');
    if (chartElement) {
        // إعادة إنشاء المخطط كامل
        if (window.goldChart) {
            window.goldChart.destroy();
        }
        // أعط وقت لـ chart.js لتحميل الدوال
        setTimeout(() => {
            if (typeof initializeGoldChart === 'function') {
                initializeGoldChart();
            }
        }, 500);
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
    flagElement.innerHTML = `<img src="https://flagcdn.com/w40/${flag.flag}.png" alt="${flag.label}" />`;
    flagElement.title = flag.label;
    flagElement.addEventListener('click', () => changeLanguage(flag.lang));
    cornerFlagsContainer.appendChild(flagElement);
  });
}
 
// 🔥 دالة أخبار الذهب الأساسية (محدثة بـ REST API Call)
async function fetchGoldNews() {
    try {
        // 🔗 REST API Call لجلب الأخبار المالية الحية
        const apiUrl = 'https://black-haze-a892.mohamad1999mz.workers.dev/api/news';
        const response = await fetch(apiUrl);
        const result = await response.json();
        
        if (result.success && result.data.length > 0) {
            // 🔄 تحويل بيانات API للتنسيق المتوقع
            goldNews = result.data.map(item => ({
                title: {
                    ar: item.title?.ar || item.title?.en || "خبر مالي",
                    en: item.title?.en || item.title?.ar || "Financial News",
                    tr: item.title?.en || item.title?.ar || "Finansal Haber"
                },
                description: {
                    ar: item.description?.ar || item.description?.en || "تفاصيل الخبر المالي",
                    en: item.description?.en || item.description?.ar || "Financial news details", 
                    tr: item.description?.en || item.description?.ar || "Finansal haber detayları"
                },
                source: {
                    ar: `المصدر: ${item.source || "مصدر مالي"}`,
                    en: `Source: ${item.source || "Financial Source"}`,
                    tr: `Kaynak: ${item.source || "Finansal Kaynak"}`
                },
                urlToImage: item.image || getDefaultGoldImage(),
                publishedAt: item.publishedAt || new Date().toISOString(),
                priceChange: item.priceChange || 0,
                category: item.category || "اقتصاد",
                trend: item.trend || "مستقر",
                isLive: item.isLive || false
            }));
        } else {
            // استخدام بيانات افتراضية إذا فشل API
            useFallbackNews();
        }
        
        updateNewsDisplay();
        
    } catch (error) {
        console.log('❌ فشل REST API Call، استخدام البيانات الافتراضية:', error);
        useFallbackNews();
    }
}

// 📦 بيانات افتراضية (كنسخة احتياطية)
function useFallbackNews() {
    const arabicNews = [
        {
            title: {
                ar: "📈 ارتفاع أسعار الذهب في الأسواق العالمية",
                en: "📈 Gold prices rise in global markets", 
                tr: "📈 Küresel piyasalarda altın fiyatları yükseliyor"
            },
            description: {
                ar: "ارتفعت أسعار الذهب اليوم مع تراجع الدولار الأمريكي أمام العملات الرئيسية في التعاملات الآسيوية.",
                en: "Gold prices rose today as the US dollar declined against major currencies in Asian trading.",
                tr: "Asya işlemlerinde ABD dolarının büyük para birimleri karşısında düşüşüyle altın fiyatları bugün yükseldi."
            },
            source: {
                ar: "المصدر: وكالة رويترز",
                en: "Source: Reuters",
                tr: "Kaynak: Reuters"
            },
            urlToImage: "https://images.unsplash.com/photo-1580330069902-0c8c3e19a8a1?w=400",
            publishedAt: new Date().toISOString(),
            priceChange: 2.3,
            category: "ذهب",
            trend: "صاعد",
            isLive: false
        },
        {
            title: {
                ar: "🛡️ الذهب يحقق مكاسب أسبوعية كملاذ آمن",
                en: "🛡️ Gold achieves weekly gains as safe haven",
                tr: "🛡️ Altın güvenli liman olarak haftalık kazanç sağlıyor"
            },
            description: {
                ar: "زيادة الطلب على الذهب كاستثمار آمن amid التقلبات الاقتصادية العالمية.",
                en: "Increased demand for gold as a safe investment amid global economic fluctuations.",
                tr: "Küresel ekonomik dalgalanmalar arasında güvenli yatırım olarak altına olan talep arttı."
            },
            source: {
                ar: "المصدر: بلومبرغ",
                en: "Source: Bloomberg", 
                tr: "Kaynak: Bloomberg"
            },
            urlToImage: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=400",
            publishedAt: new Date(Date.now() - 86400000).toISOString(),
            priceChange: -1.2,
            category: "ذهب",
            trend: "هابط",
            isLive: false
        }
    ];
    
    goldNews = arabicNews;
}

// 🖼️ صور افتراضية للذهب
function getDefaultGoldImage() {
    const goldImages = [
        "https://images.unsplash.com/photo-1580330069902-0c8c3e19a8a1?w=400",
        "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=400",
        "https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=400"
    ];
    return goldImages[Math.floor(Math.random() * goldImages.length)];
}

// 🔥 دالة تحديث عرض الأخبار (محدثة بنسبة التغير)
function updateNewsDisplay() {
    const newsContainer = document.getElementById("newsContainer");
    if (!newsContainer) return;
    
    if (goldNews.length === 0) {
        newsContainer.innerHTML = `<div class="news-item"><p>${getLoadingText()}</p></div>`;
        return;
    }
    
    newsContainer.innerHTML = goldNews.map(news => `
        <div class="news-item">
            <img src="${news.urlToImage}" alt="${news.title[currentLanguage]}" class="news-image">
            <div class="news-content">
                <h4>${news.title[currentLanguage] || news.title.ar}</h4>
                <p>${news.description[currentLanguage] || news.description.ar}</p>
                <div class="news-meta">
                    <span class="news-source">${news.source[currentLanguage] || news.source.ar}</span>
                    ${news.priceChange ? `
                        <span class="price-change ${news.trend === 'صاعد' ? 'positive' : 'negative'}">
                            ${news.trend === 'صاعد' ? '↗' : '↘'} ${Math.abs(news.priceChange)}%
                        </span>
                    ` : ''}
                    ${news.isLive ? '<span class="live-badge">🔴 مباشر</span>' : ''}
                </div>
                <div class="news-footer">
                    <small>${new Date(news.publishedAt).toLocaleDateString(getLocale())}</small>
                    <span class="news-category">${news.category}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// 🌐 دوال مساعدة للغات
function getLoadingText() {
    const texts = {
        ar: 'جاري جلب الأخبار المالية...',
        en: 'Fetching financial news...', 
        tr: 'Finansal haberler getiriliyor...'
    };
    return texts[currentLanguage] || texts.ar;
}

function getLocale() {
    const locales = {
        ar: 'ar-EG',
        en: 'en-US',
        tr: 'tr-TR'
    };
    return locales[currentLanguage] || locales.ar;
}

// 🔄 تحديث تلقائي كل ساعة
function initializeAutoRefresh() {
    // جلب البيانات أول مرة
    fetchGoldNews();
    
    // تحديث كل ساعة (3600000 مللي ثانية)
    setInterval(fetchGoldNews, 60 * 60 * 1000);
}

// 🚀 بدء التشغيل
document.addEventListener('DOMContentLoaded', function() {
    initializeAutoRefresh();
});

// 🔥 دالة تغيير العملة
function selectCurrency(code){ 
  const c = currencyMap.get(code);
  if(!c) {
    console.log('❌ العملة غير موجودة:', code);
    return;
  } 
  selectedCurrency = c; 
  setActiveUI(); 
  renderPricesFromData();
  console.log('✅ تم تغيير العملة إلى:', code);
}

// 🔥 دالة لإعداد أزرار العملات
function setupCurrencyTabs() {
  const tabsContainer = document.querySelector('.currency-tabs');
  if (!tabsContainer) {
    console.log('❌ لم يتم العثور على .currency-tabs');
    return;
  }
  
  console.log('✅ تم العثور على أزرار العملات:', tabsContainer.children.length);
  
  document.querySelectorAll('.currency-tab').forEach(tab => {
    tab.addEventListener('click', function() {
      // إزالة النشط من الجميع
      document.querySelectorAll('.currency-tab').forEach(t => {
        t.classList.remove('active');
      });
      
      // إضافة النشط للزر المختار
      this.classList.add('active');
      
      // تغيير العملة
      const currencyCode = this.dataset.currency;
      console.log('🔄 تغيير العملة إلى:', currencyCode);
      selectCurrency(currencyCode);
    });
  });
  
  console.log('✅ أزرار العملات جاهزة!');
}

// 🔥 بناء الواجهة
function buildUI(){
  buildCornerFlags();
  
  const tcont = $("#typesScroll"); 
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
  
  // 🟢 الكود الجديد - أزرار العملات المبسطة
setupCurrencyTabs();

const sel = $("#unitSelect"); 
sel.innerHTML = ''; 
types.forEach(t => {
  const o = document.createElement('option'); 
  o.value = t.id; 
  o.textContent = t.labels[currentLanguage] || t.labels.ar; 
  sel.appendChild(o);
}); 

// 🔥 الإصلاح هنا - تحقق من وجود selectedType
if (selectedType && selectedType.id) {
  sel.value = selectedType.id;
} else {
  // تعيين قيمة افتراضية إذا كان selectedType غير معرف
  sel.value = "gram24";
  selectedType = typeMap.get("gram24");
  console.log('🔄 تعيين النوع الافتراضي: gram24');
}
}

// 🔥 تعيين الواجهة النشطة
function setActiveUI(){
  document.querySelectorAll('.type-pill').forEach(e => e.classList.remove('active')); 
  
  // 🔥 تحقق من وجود selectedType قبل استخدامه
  if (selectedType && selectedType.id) {
    const s = document.getElementById(selectedType.id); 
    if(s) s.classList.add('active'); 
  } else {
    // إذا لم يكن selectedType معرف، استخدم الافتراضي
    selectedType = typeMap.get("gram24");
    const s = document.getElementById("gram24"); 
    if(s) s.classList.add('active');
  }
  
  // 🟢 الكود الجديد بدلاً من flag-card القديم
  document.querySelectorAll('.currency-tab').forEach(tab => {
    tab.classList.remove('active');
    if(selectedCurrency && tab.dataset.currency === selectedCurrency.code) {
      tab.classList.add('active');
    }
  });
  
  document.querySelectorAll('.cur').forEach(e => {
    if(selectedCurrency) {
      e.textContent = selectedCurrency.code;
    }
  }); 
  
  if(selectedCurrency) {
    $("#outCur").textContent = selectedCurrency.code; 
    $("#outFlag").src = `https://flagcdn.com/w40/${selectedCurrency.flag}.png`;
  }
  
  // 🔥 الإصلاح هنا أيضاً
  const sel = $("#unitSelect");
  if(sel && selectedType && selectedType.id) {
    sel.value = selectedType.id;
  }
}

async function updateData() {
    try {
        const response = await fetch(API_BASE + '/prices');
        const data = await response.json();
        latestData = data;
        setStatus('✅ تم تحديث البيانات بنجاح');
        renderPricesFromData(); // تحديث الأسعار بعد الحصول على البيانات
    } catch (error) {
        console.error('❌ خطأ في تحديث البيانات:', error);
        setStatus('❌ خطأ في تحميل البيانات');
    }
}

// 🔥 دالة الحصول على سعر الجرام الأساسي
function getGramBase() {
    if (!latestData) return 5790.8; // السعر الافتراضي المحدث
    
    // استخدام الأسعار المباشرة من البيانات
    if (latestData.price_gram_try) {
        return parseFloat(latestData.price_gram_try);
    }
    
    return 5790.8; // السعر الافتراضي المحدث
}

// 🔥 دالة تصحيح الأسعار - جديدة
function correctGoldPrices() {
    if (latestData && latestData.price_gram_try) {
        const currentPrice = parseFloat(latestData.price_gram_try);
        
        // إذا السعر غير واقعي (أعلى من 6000 أو أقل من 4000)
        if (currentPrice > 6000 || currentPrice < 4000) {
            console.log('🔧 تصحيح سعر غير واقعي:', currentPrice);
            
            // استخدم سعر واقعي
            latestData.price_gram_try = "5790.8";
            latestData.price_gram_usd = "136.8983";
            
            renderPricesFromData();
        }
    }
}

// 🔥 دالة فحص الحسابات
function debugCalculations() {
    console.log('🔍 فحص الحسابات:');
    console.log('السعر الأساسي:', getGramBase());
    console.log('العملة المختارة:', selectedCurrency);
    console.log('النوع المختار:', selectedType);
    
    const gramTry = getGramBase();
    const spread = (5790.8 - 5721.45) / 5790.8; // 1.2% فرق واقعي
    const buy = +(gramTry * (1 + spread/2)).toFixed(2);
    const sell = +(gramTry * (1 - spread/2)).toFixed(2);
    
    console.log('🔢 النتائج المتوقعة:', { buy, sell });
}

// 🔥 دالة عرض الأسعار من البيانات - محدثة للهيكل الجديد
function renderPricesFromData(){ 
  // 🔥 أضف فحص الحسابات
  debugCalculations();
  
  console.log('🔍 أحدث بيانات:', latestData);
  
  // 🔥 أولاً: جرب البيانات الجديدة من المصدر (الهيكل الجديد)
  if (latestData && latestData.data && latestData.data.gold) {
    const goldData = latestData.data.gold;
    const selectedGold = goldData[selectedType.id];
    
    if (selectedGold && selectedGold.buy && selectedGold.sell) {
      const buy = selectedGold.buy[selectedCurrency.code];
      const sell = selectedGold.sell[selectedCurrency.code];
      
      if (buy && sell) {
        console.log('💰 استخدام البيانات الحية الجديدة:', { 
          type: selectedType.id, 
          currency: selectedCurrency.code,
          buy, 
          sell 
        });
        
        // 🔥 حساب التغير بناء على السعر السابق
        const previousBuy = parseFloat($("#buyPrice")?.textContent?.replace(/[^\d.]/g, '')) || buy;
        const previousSell = parseFloat($("#sellPrice")?.textContent?.replace(/[^\d.]/g, '')) || sell;
        
        const buyChangePercent = ((buy - previousBuy) / previousBuy) * 100;
        const sellChangePercent = ((sell - previousSell) / previousSell) * 100;
        
        console.log('📊 التغير:', { 
          previousBuy, previousSell, 
          buyChangePercent, sellChangePercent 
        });
        
        // 🔥 تحديث الأسعار مع الأسهم
        animatePriceUpdate('#buyPrice', formatNumber(buy, selectedCurrency.code), buyChangePercent, 'buy');
        animatePriceUpdate('#sellPrice', formatNumber(sell, selectedCurrency.code), sellChangePercent, 'sell');
        
        const qty = parseFloat($("#qty")?.value) || 1; 
        const resultValue = sell * qty;
        if ($("#result")) {
          $("#result").value = formatNumber(resultValue, selectedCurrency.code) + ' ' + selectedCurrency.code;
        }
        
        return; // توقف هنا لأننا استخدمنا البيانات الجديدة
      }
    }
  }
  
  // 🔥 ثانياً: جرب البيانات القديمة (الهيكل القديم)
  if (latestData && latestData.gold_coins) {
    const coinData = latestData.gold_coins;
    let coinKey = selectedType.id;
    
    if (coinData[coinKey] && coinData[coinKey].buy && coinData[coinKey].buy[selectedCurrency.code]) {
      const buy = parseFloat(coinData[coinKey].buy[selectedCurrency.code]);
      const sell = parseFloat(coinData[coinKey].sell[selectedCurrency.code]);
      
      console.log('💰 استخدام البيانات القديمة من API:', { 
        coinKey, 
        currency: selectedCurrency.code,
        buy, 
        sell 
      });
      
      // تحديث الأسعار...
      animatePriceUpdate('#buyPrice', formatNumber(buy, selectedCurrency.code), 0, 'buy');
      animatePriceUpdate('#sellPrice', formatNumber(sell, selectedCurrency.code), 0, 'sell');
      
      const qty = parseFloat($("#qty")?.value) || 1; 
      const resultValue = sell * qty;
      if ($("#result")) {
        $("#result").value = formatNumber(resultValue, selectedCurrency.code) + ' ' + selectedCurrency.code;
      }
      
      return;
    }
  }
  
// 🔥 استخدام البيانات المحلية إذا فشل كل شيء
console.log('🔄 استخدام البيانات المحلية...');

const gramTry = getGramBase() || 5790.8;
const cur = selectedCurrency.code;

// تحويل العملة إذا متاح
let fxRate = 1;
if(latestData && latestData.fx && typeof latestData.fx === 'object'){ 
    const fxMap = new Map(Object.entries(latestData.fx));
    if(fxMap.has(cur)) {
        fxRate = parseFloat(fxMap.get(cur));
    }
}

// دالة حساب السعر النهائي لأي نوع ذهب
function calculatePrice(selectedType) {
    const base24 = parseFloat(latestData?.price_gram_try || gramTry);
    let finalPrice = base24;

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

    // تحويل العملة
    finalPrice *= fxRate;

    // فرق البنك (spread)
    const spread = (5790.8 - 5721.45) / 5790.8; // فرق تقريبي
    const buy = +(finalPrice * (1 + spread/2)).toFixed(2);
    const sell = +(finalPrice * (1 - spread/2)).toFixed(2);

    return { buy, sell };
}

// استدعاء الدالة للحصول على الأسعار
const { buy, sell } = calculatePrice(selectedType);

// طباعة الأسعار للتأكد
console.log('💰 الأسعار الاحتياطية:', { buy, sell });

// تحديث الأسعار النهائية في واجهة المستخدم
animatePriceUpdate('#buyPrice', formatNumber(buy, selectedCurrency.code), 0, 'buy');
animatePriceUpdate('#sellPrice', formatNumber(sell, selectedCurrency.code), 0, 'sell');

// حساب النتيجة حسب الكمية
const qty = parseFloat($("#qty")?.value) || 1; 
const resultValue = sell * qty;
if ($("#result")) {
    $("#result").value = formatNumber(resultValue, selectedCurrency.code) + ' ' + selectedCurrency.code;
}

function selectType(typeId) {
  const type = typeMap.get(typeId);
  if (!type) return;
  selectedType = type;
  setActiveUI();
  renderPricesFromData(); // 🔥 هذا يحسب الأسعار الجديدة
}
  selectedType = type;
  setActiveUI();
  renderPricesFromData();
  console.log('✅ تم تغيير النوع إلى:', typeId);
}

// 🔥 تأثير تحديث السعر مع الأسهم
function animatePriceUpdate(selector, newValue, changePercent, type) {
  const element = $(selector);
  if (!element) return;
  
  const changeElement = type === 'buy' ? $('#buyChange') : $('#sellChange');
  
  // 🔥 تحديد حالة السهم
  let arrowClass, changeClass, arrowSymbol;
  if (changePercent > 0.1) {
    arrowClass = 'up';
    changeClass = 'up';
    arrowSymbol = '↗';
  } else if (changePercent < -0.1) {
    arrowClass = 'down';
    changeClass = 'down';
    arrowSymbol = '↘';
  } else {
    arrowClass = 'neutral';
    changeClass = 'neutral';
    arrowSymbol = '→';
  }
  
  // 🔥 تحديث السهم والنسبة
  if (changeElement) {
    changeElement.innerHTML = `
      <span class="arrow ${arrowClass}">${arrowSymbol}</span>
      <span>${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(2)}%</span>
    `;
    changeElement.className = `price-change ${changeClass}`;
  }
  
  // 🔥 تأثير السعر
  element.style.transform = 'scale(1.1)';
  element.style.transition = 'transform 0.2s ease, color 0.2s ease';
  
  setTimeout(() => {
    element.textContent = newValue;
    element.style.transform = 'scale(1)';
  }, 150);
}

// 🔥 إدارة التفضيلات المحلية المحسنة
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
      localStorage.setItem('goldAppPrefs', JSON.stringify({
        ...this.get(),
        ...prefs
      }));
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
    const saved = localStorage.getItem('siteLanguage');
    console.log('🔍 Saved language:', saved);
    if (saved) {
      changeLanguage(saved);
    }
    
    const prefs = userPreferences.get();
    if (prefs.selectedType) {
      selectedType = typeMap.get(prefs.selectedType) || selectedType;
    }
    if (prefs.selectedCurrency) {
      selectedCurrency = currencyMap.get(prefs.selectedCurrency) || selectedCurrency;
    }
  } catch (e) {
    console.warn('Failed to load preferences:', e);
  }
}

// 🔥 تنظيف الموارد
function cleanup() {
  if (autoTimer) {
    clearInterval(autoTimer);
    autoTimer = null;
  }
  
  if (newsTimer) {
    clearInterval(newsTimer);
    newsTimer = null;
  }
  
  if (debounceTimer) {
    clearTimeout(debounceTimer);
    debounceTimer = null;
  }
}

// 🔥 تحميل الإعدادات
function loadUserPreferences() {
  try {
    const saved = localStorage.getItem('siteLanguage');
    console.log('🔍 Saved language:', saved);
    if (saved) {
      changeLanguage(saved);
    }
    
    const prefs = userPreferences.get();
    
    // 🔥 الإصلاح: تحقق من القيم قبل التعيين واستخدم قيم افتراضية
    if (prefs.selectedType && typeMap.has(prefs.selectedType)) {
      selectedType = typeMap.get(prefs.selectedType);
    } else {
      selectedType = typeMap.get("gram24") || types[0];
      console.log('🔄 استخدام النوع الافتراضي: gram24');
    }
    
    if (prefs.selectedCurrency && currencyMap.has(prefs.selectedCurrency)) {
      selectedCurrency = currencyMap.get(prefs.selectedCurrency);
    } else {
      selectedCurrency = currencyMap.get("TRY") || currencyList[0];
      console.log('🔄 استخدام العملة الافتراضية: TRY');
    }
    
    console.log('✅ الإعدادات المحملة:', { 
      type: selectedType.id, 
      currency: selectedCurrency.code 
    });
    
  } catch (e) {
    console.warn('فشل في تحميل الإعدادات:', e);
    // 🔥 قيم افتراضية في حالة الخطأ
    selectedType = typeMap.get("gram24") || types[0];
    selectedCurrency = currencyMap.get("TRY") || currencyList[0];
  }
}

// 🔥 تنظيف الموارد
function cleanup() {
  if (autoTimer) {
    clearInterval(autoTimer);
    autoTimer = null;
  }
  
  if (newsTimer) {
    clearInterval(newsTimer);
    newsTimer = null;
  }
  
  if (debounceTimer) {
    clearTimeout(debounceTimer);
    debounceTimer = null;
  }
}

// 🔥 إعداد event listeners
function setupEventListeners() {
  $('#refreshBtn')?.addEventListener('click', () => fetchData()); 
  $('#unitSelect')?.addEventListener('change', (e) => selectType(e.target.value)); 
  
  $('#qty')?.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      renderPricesFromData();
      userPreferences.saveCurrentState();
    }, 300);
  });
  
  document.addEventListener('click', (e) => {
    if (e.target.closest('.type-pill') || e.target.closest('.flag-card')) {
      setTimeout(() => userPreferences.saveCurrentState(), 500);
    }
  });
}

// 🔥 التهيئة الرئيسية
document.addEventListener('DOMContentLoaded', () => { 
  // 🔥 الإصلاح: تهيئة المتغيرات أولاً
  if (!selectedType) selectedType = typeMap.get("gram24") || types[0];
  if (!selectedCurrency) selectedCurrency = currencyMap.get("TRY") || currencyList[0];
  
  loadUserPreferences();
  buildUI(); 
  
  setTimeout(() => {
    setActiveUI(); 
    updateAllTexts();
    updateGoldTypeLabels();
    updateCurrencyLabels();
    
    setupEventListeners();
    
    updateData();
    fetchGoldNews();
    
    cleanup();
    autoTimer = setInterval(fetchData, 30 * 1000);
    newsTimer = setInterval(fetchGoldNews, 300000);
    
  }, 100);
});

// 🔥 إدارة دورة حياة الصفحة
window.addEventListener('beforeunload', cleanup);
window.addEventListener('pagehide', cleanup);

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
