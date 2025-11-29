// netlify/functions/gold-prices.js
exports.handler = async (event, context) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }

  try {
    // 🔥 هذا سيعمل في Netlify!
    const response = await fetch('https://api.genelpara.com/embed/altin.json');
    const turkishData = await response.json();
    
    // استخراج الأسعار الحقيقية
    const liveBuyPrice24 = parseFloat(turkishData.GA.alis.replace(',', ''));
    const liveSellPrice24 = parseFloat(turkishData.GA.satis.replace(',', ''));
    
    // ... نفس الكود السابق للعيارات والعملات
    
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
      body: JSON.stringify(responseData, null, 2)
    };

  } catch (err) {
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
      body: JSON.stringify({
        "error": "جاري التحديث",
        "message": "سيتم إصلاح المصدر قريباً",
        "timestamp": new Date().toISOString()
      })
    };
  }
};