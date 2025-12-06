// AltinLira - COMPLETE app.js
const API_BASE = "https://royal-limit-d5a2.mohamad1999mz.workers.dev/";

const types = [
  {id: "lira", labels:{ar:"ليرة ذهب",en:"Gold Lira",tr:"Altın Lira"}, img:"images/gold/lira.png", grams:7.32},
  {id: "half", labels:{ar:"نصف ليرة",en:"Half Lira",tr:"Yarım Lira"}, img:"images/gold/half.png", grams:3.66},
  {id: "quarter", labels:{ar:"ربع ليرة",en:"Quarter Lira",tr:"Çeyrek Lira"}, img:"images/gold/quarter.png", grams:1.83},
  {id:"ounce", labels:{ar:"أونصة ذهب",en:"Gold Ounce",tr:"Altın Ons"}, img:"images/gold/gold24.png", grams:31.1035},
  {id:"gram24", labels:{ar:"جرام ذهب 24",en:"24g Gold",tr:"24g Altın"}, img:"images/gold/gold24.png", grams:1},
  {id:"gram22", labels:{ar:"جرام ذهب 22",en:"22g Gold",tr:"22g Altın"}, img:"images/gold/gold22.png", grams:1},
  {id:"gram21", labels:{ar:"جرام ذهب 21",en:"21g Gold",tr:"21g Altın"}, img:"images/gold/gold21.png", grams:1},
  {id:"gram18", labels:{ar:"جرام ذهب 18",en:"18g Gold",tr:"18g Altın"}, img:"images/gold/gold18.png", grams:1},
  {id:"gram14", labels:{ar:"جرام ذهب 14",en:"14g Gold",tr:"14g Altın"}, img:"images/gold/gold14.png", grams:1},
  {id:"silver", labels:{ar:"فضة",en:"Silver",tr:"Gümüş"}, img:"images/gold/silver.png", grams:1}
];

const mockApiData = {
  "تم التحديث":"2025-11-23T22:04:30.958Z",
  "price_gram_try":"5790.8",
  "price_gram_usd":"136.8983",
  "price_ounce_usd":"4258.02",
  "المصدر":"Custom Gold Prices",
  "fx":{"USD":"1.00","EUR":"0.92","TRY":"42.30","SAR":"3.75","AED":"3.67","KWD":"0.31"},
  "gold_coins":{
    "gram24":{"buy":"5790.8","sell":"5721.45","weight":"1.00"},
    "gram22":{"buy":"5304.37","sell":"5240.85","weight":"1.00"},
    "gram21":{"buy":"5066.95","sell":"5006.27","weight":"1.00"},
    "gram18":{"buy":"4343.10","sell":"4291.09","weight":"1.00"},
    "gram14":{"buy":"3376.04","sell":"3335.61","weight":"1.00"},
    "lira":{"buy":"42388.66","sell":"41881.01","weight":"7.32"},
    "half_lira":{"buy":"21194.33","sell":"20940.51","weight":"3.66"},
    "quarter_lira":{"buy":"10597.16","sell":"10470.25","weight":"1.83"}
  }
};

const currencyList = [
  {code:"TRY", labels:{ar:"الليرة التركية",en:"Turkish Lira",tr:"Türk Lirası"}, flag:"tr"},
  {code:"EUR", labels:{ar:"اليورو",en:"Euro",tr:"Euro"}, flag:"eu"},
  {code:"SAR", labels:{ar:"الريال السعودي",en:"Saudi Riyal",tr:"Suudi Riyali"}, flag:"sa"},
  {code:"AED", labels:{ar:"الدرهم الإماراتي",en:"UAE Dirham",tr:"BAE Dirhemi"}, flag:"ae"},
  {code:"EGP", labels:{ar:"الجنيه المصري",en:"Egyptian Pound",tr:"Mısır Lirası"}, flag:"eg"},
  {code:"IQD", labels:{ar:"الدينار العراقي",en:"Iraqi Dinar",tr:"Irak Dinarı"}, flag:"iq"},
  {code:"KWD", labels:{ar:"الدينار الكويتي",en:"Kuwaiti Dinar",tr:"Kuveyt Dinarı"}, flag:"kw"},
  {code:"USD", labels:{ar:"الدولار الأمريكي",en:"US Dollar",tr:"ABD Doları"}, flag:"us"},
  {code:"SYP", labels:{ar:"الليرة السورية",en:"Syrian Pound",tr:"Suriye Lirası"}, flag:"sy"},
  {code:"BHD", labels:{ar:"الدينار البحريني",en:"Bahraini Dinar",tr:"Bahreyn Dinarı"}, flag:"bh"},
  {code:"DZD", labels:{ar:"الدينار الجزائري",en:"Algerian Dinar",tr:"Cezayir Dinarı"}, flag:"dz"}
];

const currencyMap = new Map(currencyList.map(c=>[c.code,c]));
const typeMap = new Map(types.map(t=>[t.id,t]));

let selectedType = types[0];
let selectedCurrency = currencyList[0];
let latestData = null;
let autoTimer = null;
let debounceTimer = null;
let currentLanguage = 'ar';

// ---------------- Utility Functions ----------------

function $(s){return document.querySelector(s);}
function formatNumber(num,currencyCode){
  if(isNaN(num)||num===null||num===undefined) return '0.00';
  const number = parseFloat(num);
  if(isNaN(number)) return '0.00';
  const englishLocale='en-US';
  if(currencyCode==='IQD'||currencyCode==='SYP') return Math.round(number).toLocaleString(englishLocale);
  if(currencyCode==='KWD'||currencyCode==='BHD') return number.toLocaleString(englishLocale,{minimumFractionDigits:3,maximumFractionDigits:3});
  return number.toLocaleString(englishLocale,{minimumFractionDigits:2,maximumFractionDigits:2});
}

// ---------------- UI Update Functions ----------------

function setActiveUI(){
  document.querySelectorAll('.type-pill').forEach(e=>e.classList.remove('active'));
  const s=document.getElementById(selectedType.id);
  if(s)s.classList.add('active');
  document.querySelectorAll('.currency-tab').forEach(tab=>{
    tab.classList.remove('active');
    if(tab.dataset.currency===selectedCurrency.code) tab.classList.add('active');
  });
  document.querySelectorAll('.cur').forEach(e=>e.textContent=selectedCurrency.code);
  $("#outCur").textContent=selectedCurrency.code;
  $("#outFlag").src=`https://flagcdn.com/w40/${selectedCurrency.flag}.png`;
  $("#unitSelect").value=selectedType.id;
}

function buildUI(){
  const tcont=$("#typesScroll"); tcont.innerHTML='';
  types.forEach(t=>{
    const d=document.createElement('div'); d.className='type-pill'; d.id=t.id;
    d.innerHTML=`<div class="type-pill-content"><div class="type-circle"><img src="${t.img}" alt="${t.labels.ar}"/></div><div class="type-label">${t.labels[currentLanguage]||t.labels.ar}</div></div>`;
    d.addEventListener('click',()=>selectType(t.id));
    tcont.appendChild(d);
  });

  const sel=$("#unitSelect"); sel.innerHTML='';
  types.forEach(t=>{ const o=document.createElement('option'); o.value=t.id; o.textContent=t.labels[currentLanguage]||t.labels.ar; sel.appendChild(o); });
}

function selectType(typeId){
  const type = typeMap.get(typeId); if(!type) return;
  selectedType=type; setActiveUI(); renderPricesFromData();
}

function selectCurrency(code){
  const c=currencyMap.get(code); if(!c) return;
  selectedCurrency=c; setActiveUI(); renderPricesFromData();
}

function updateLast(ts){
  const e=$("#last-update"); if(!e) return;
  try{ const d=new Date(ts); e.textContent=d.toLocaleString('ar-EG'); }catch(e){ e.textContent=new Date().toLocaleString('ar-EG'); }
}

// ---------------- Data Fetch ----------------

async function fetchData(){
  try{
    const response=await fetch(API_BASE);
    if(!response.ok) throw new Error('فشل جلب البيانات من Worker');
    const data=await response.json();
    latestData=data;
    updateLast(data["تم التحديث"]);
    renderPricesFromData();
  }catch(err){
    console.warn(err);
    latestData=mockApiData;
    updateLast(mockApiData["تم التحديث"]);
    renderPricesFromData();
  }
}

// ---------------- Render Prices ----------------

function getGramBase(){ return latestData?.price_gram_try ? parseFloat(latestData.price_gram_try) : 5790.8; }

function renderPricesFromData(){
  const gramTry=getGramBase();
  const grams=selectedType.grams||1;
  let finalPrice=gramTry*grams;
  // فرق البنك 1.2%
  const spread=(5790.8-5721.45)/5790.8;
  const buy=+(finalPrice*(1+spread/2)).toFixed(2);
  const sell=+(finalPrice*(1-spread/2)).toFixed(2);
  $("#buyPrice").textContent=formatNumber(buy,selectedCurrency.code);
  $("#sellPrice").textContent=formatNumber(sell,selectedCurrency.code);
  const qty=parseFloat($("#qty")?.value)||1;
  if($("#result")) $("#result").value=formatNumber(sell*qty,selectedCurrency.code)+' '+selectedCurrency.code;
}

// ---------------- Event Listeners ----------------

document.addEventListener('DOMContentLoaded',()=>{
  buildUI();
  setActiveUI();
  fetchData();

  document.querySelectorAll('.currency-tab').forEach(tab=>{
    tab.addEventListener('click',()=>selectCurrency(tab.dataset.currency));
  });

  $("#unitSelect")?.addEventListener('change',e=>selectType(e.target.value));
  $("#qty")?.addEventListener('input',renderPricesFromData);
  $("#refreshBtn")?.addEventListener('click',fetchData);

  autoTimer=setInterval(fetchData,30*1000);
});
