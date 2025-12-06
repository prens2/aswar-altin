// app.js

// -------------------- الإعدادات --------------------
const API_URL = "https://royal-limit-d5a2.mohamad1999mz.workers.dev/"; // رابط الـ Worker
const REFRESH_INTERVAL = 60000; // 60 ثانية
const currencyTabs = document.querySelectorAll(".currency-tab");
const lastUpdateEl = document.getElementById("last-update");
const buyPriceEl = document.getElementById("buyPrice");
const sellPriceEl = document.getElementById("sellPrice");
const buyChangeEl = document.getElementById("buyChange");
const sellChangeEl = document.getElementById("sellChange");
const outFlagEl = document.getElementById("outFlag");
const outCurEl = document.getElementById("outCur");
const qtyEl = document.getElementById("qty");
const resultEl = document.getElementById("result");
const unitSelectEl = document.getElementById("unitSelect");
const swapBtnEl = document.getElementById("swapBtn");
const typesScrollEl = document.getElementById("typesScroll");

let currentCurrency = "TRY";
let goldPriceUSD = 0;
let silverPriceUSD = 0;

// -------------------- تحويل العملات --------------------
const currencyRates = {
  USD: 1,
  TRY: 27,  // مثال، ضع السعر الفعلي اليومي
  EUR: 0.93,
  SAR: 3.75,
  AED: 3.67,
  EGP: 30.9,
  IQD: 1450,
  KWD: 0.31,
  SYP: 25000,
  BHD: 0.38,
  DZD: 140
};

// تحويل السعر حسب العملة
function convertCurrency(valueUSD) {
  return (valueUSD * (currencyRates[currentCurrency] || 1)).toFixed(2);
}

// -------------------- تحديث الواجهة --------------------
function updateUI() {
  buyPriceEl.textContent = convertCurrency(goldPriceUSD);
  sellPriceEl.textContent = convertCurrency(goldPriceUSD); // في هذه النسخة نضع نفس السعر للشراء والبيع
  lastUpdateEl.textContent = new Date().toLocaleTimeString();
  outCurEl.textContent = currentCurrency;
}

// -------------------- جلب البيانات --------------------
async function fetchData() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();

    if (!data.success) throw new Error(data.error || "خطأ في جلب البيانات");

    goldPriceUSD = data.gold_price_per_ounce_usd;
    silverPriceUSD = data.silver_price_per_ounce_usd;

    updateUI();

  } catch (err) {
    console.error("❌ خطأ في جلب البيانات:", err.message);
  }
}

// -------------------- اختيار العملة --------------------
currencyTabs.forEach(tab => {
  tab.addEventListener("click", () => {
    currencyTabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    currentCurrency = tab.dataset.currency;
    updateUI();
    updateConversion();
  });
});

// -------------------- المحول --------------------
function updateConversion() {
  const unit = unitSelectEl.value || "ounce";
  const qty = parseFloat(qtyEl.value) || 0;

  let priceUSD = goldPriceUSD; // افتراضي الذهب
  if (unit === "gram") priceUSD = goldPriceUSD / 31.1035; // تحويل الأونصة إلى جرام

  const converted = (priceUSD * qty * (currencyRates[currentCurrency] || 1)).toFixed(2);
  resultEl.value = converted;
}

unitSelectEl.addEventListener("change", updateConversion);
qtyEl.addEventListener("input", updateConversion);
swapBtnEl.addEventListener("click", () => {
  currentCurrency = currentCurrency === "USD" ? "TRY" : "USD";
  currencyTabs.forEach(t => t.classList.toggle("active"));
  updateUI();
  updateConversion();
});

// -------------------- التحميل الأولي --------------------
fetchData();
updateConversion();

// -------------------- تحديث دوري --------------------
setInterval(() => {
  fetchData();
  updateConversion();
}, REFRESH_INTERVAL);
