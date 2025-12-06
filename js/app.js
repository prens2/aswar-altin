// AltinLira fixed full app.js
const API_BASE = "https://royal-limit-d5a2.mohamad1999mz.workers.dev/";

// 🔥 أنواع الذهب
const types = [
  {id:"lira", labels:{ar:"ليرة ذهب",en:"Gold Lira",tr:"Altın Lira"},img:"images/gold/lira.png", grams:7.32},
  {id:"half", labels:{ar:"نصف ليرة",en:"Half Lira",tr:"Yarım Lira"},img:"images/gold/half.png", grams:3.66},
  {id:"quarter", labels:{ar:"ربع ليرة",en:"Quarter Lira",tr:"Çeyrek Lira"},img:"images/gold/quarter.png", grams:1.83},
  {id:"ounce", labels:{ar:"أونصة ذهب",en:"Gold Ounce",tr:"Altın Ons"},img:"images/gold/gold24.png", grams:31.1035},
  {id:"gram24", labels:{ar:"جرام ذهب 24",en:"24g Gold",tr:"24g Altın"},img:"images/gold/gold24.png", grams:1},
  {id:"gram22", labels:{ar:"جرام ذهب 22",en:"22g Gold",tr:"22g Altın"},img:"images/gold/gold22.png", grams:1},
  {id:"gram21", labels:{ar:"جرام ذهب 21",en:"21g Gold",tr:"21g Altın"},img:"images/gold/gold21.png", grams:1},
  {id:"gram18", labels:{ar:"جرام ذهب 18",en:"18g Gold",tr:"18g Altın"},img:"images/gold/gold18.png", grams:1},
  {id:"gram14", labels:{ar:"جرام ذهب 14",en:"14g Gold",tr:"14g Altın"},img:"images/gold/gold14.png", grams:1},
  {id:"silver", labels:{ar:"فضة",en:"Silver",tr:"Gümüş"},img:"images/gold/silver.png", grams:1}
];

// 🔥 العملات
const currencyList = [
  {code:"TRY", labels:{ar:"الليرة التركية",en:"Turkish Lira",tr:"Türk Lirası"},flag:"tr"},
  {code:"EUR", labels:{ar:"اليورو",en:"Euro",tr:"Euro"},flag:"eu"},
  {code:"SAR", labels:{ar:"الريال السعودي",en:"Saudi Riyal",tr:"Suudi Riyali"},flag:"sa"},
  {code:"AED", labels:{ar:"الدرهم الإماراتي",en:"UAE Dirham",tr:"BAE Dirhemi"},flag:"ae"},
  {code:"USD", labels:{ar:"الدولار الأمريكي",en:"US Dollar",tr:"ABD Doları"},flag:"us"}
];

const currencyMap = new Map(currencyList.map(c=>[c.code,c]));
const typeMap = new Map(types.map(t=>[t.id,t]));

let selectedType = types[0];
let selectedCurrency = currencyList[0];
let latestData = null;
let currentLanguage = 'ar';
let autoTimer = null;
let debounceTimer = null;

// 🔥 دوال مساعدة
function $(s){return document.querySelector(s)}
function setStatus(msg){const e=$("#apiStatus"); if(e) e.textContent=msg}

// 🔥 تنظيف الموارد
function cleanup(){
  if(autoTimer){clearInterval(autoTimer); autoTimer=null;}
  if(debounceTimer){clearTimeout(debounceTimer); debounceTimer=null;}
}

// 🔥 تحميل تفضيلات المستخدم
function loadUserPreferences(){
  try{
    const savedLang = localStorage.getItem('siteLanguage');
    if(savedLang) currentLanguage=savedLang;
    const prefs = JSON.parse(localStorage.getItem('goldAppPrefs')||"{}");
    if(prefs.selectedType) selectedType=typeMap.get(prefs.selectedType)||selectedType;
    if(prefs.selectedCurrency) selectedCurrency=currencyMap.get(prefs.selectedCurrency)||selectedCurrency;
  }catch(e){console.warn(e);}
}

// 🔥 تحديث الواجهة النشطة
function setActiveUI(){
  document.querySelectorAll('.type-pill').forEach(e=>e.classList.remove('active'));
  const s=document.getElementById(selectedType.id); if(s)s.classList.add('active');
  document.querySelectorAll('.currency-tab').forEach(tab=>{
    tab.classList.remove('active');
    if(tab.dataset.currency===selectedCurrency.code) tab.classList.add('active');
  });
  $("#outCur").textContent=selectedCurrency.code;
  $("#outFlag").src=`https://flagcdn.com/w40/${selectedCurrency.flag}.png`;
  $("#unitSelect").value=selectedType.id;
}

// 🔥 اختيار نوع الذهب
function selectType(typeId){
  const type=typeMap.get(typeId); if(!type) return;
  selectedType=type;
  setActiveUI();
  renderPricesFromData();
}

// 🔥 اختيار العملة
function selectCurrency(code){
  const c=currencyMap.get(code); if(!c) return;
  selectedCurrency=c;
  setActiveUI();
  renderPricesFromData();
}

// 🔥 جلب البيانات
async function fetchData(){
  try{
    setStatus('🔄 جاري التحديث...');
    const response = await fetch(API_BASE);
    if(!response.ok) throw new Error('فشل جلب البيانات من Worker');
    const data = await response.json();
    latestData=data;
    setStatus('✅ تم التحديث');
    renderPricesFromData();
  }catch(e){
    console.error('❌ خطأ في جلب البيانات:',e);
    setStatus('❌ استخدام البيانات المحلية');
    latestData=mockApiData;
    renderPricesFromData();
  }
}

// 🔥 عرض الأسعار
function renderPricesFromData(){
  if(!latestData) return;
  const base=parseFloat(latestData.price_gram_try)||5790.8;
  const grams=selectedType.grams||1;
  const price=base*grams;
  const spread=(5790.8-5721.45)/5790.8;
  const buy=+(price*(1+spread/2)).toFixed(2);
  const sell=+(price*(1-spread/2)).toFixed(2);
  $("#buyPrice").textContent=buy;
  $("#sellPrice").textContent=sell;
}

// 🔥 بناء واجهة المستخدم
function buildUI(){
  const tcont=$("#typesScroll");
  if(tcont){tcont.innerHTML='';types.forEach(t=>{
    const d=document.createElement('div'); d.className='type-pill'; d.id=t.id;
    d.innerHTML=`<div class="type-label">${t.labels[currentLanguage]||t.labels.ar}</div>`;
    d.addEventListener('click',()=>selectType(t.id));
    tcont.appendChild(d);
  })}
  document.querySelectorAll('.currency-tab').forEach(tab=>{
    tab.addEventListener('click',()=>selectCurrency(tab.dataset.currency));
  });
}

// 🔥 التهيئة الرئيسية
document.addEventListener('DOMContentLoaded',()=>{
  loadUserPreferences();
  buildUI();
  setActiveUI();
  fetchData();
  autoTimer=setInterval(fetchData,30*1000);
});

// 🔥 تنظيف عند الخروج
window.addEventListener('beforeunload',cleanup);
