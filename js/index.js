export default {
  async fetch(request, env) {
    const apiKey = env.METALS_API_KEY;

    if (!apiKey) {
      return new Response(
        JSON.stringify({ success: false, error: "METALS_API_KEY غير موجود" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const url = `https://api.metals.dev/v1/latest?api_key=${apiKey}&currency=USD&unit=toz`;

    try {
      const response = await fetch(url, {
        headers: { "Accept": "application/json" },
      });

      if (!response.ok) {
        return new Response(
          JSON.stringify({
            success: false,
            error: `خطأ في جلب بيانات الذهب: ${response.status} ${response.statusText}`,
          }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }

      const data = await response.json();
      const goldPrice = data.rates?.XAU;

      if (!goldPrice) {
        return new Response(
          JSON.stringify({ success: false, error: "تعذر الحصول على سعر الذهب" }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          price_per_ounce_usd: goldPrice,
          raw: data,
        }),
        { headers: { "Content-Type": "application/json" } }
      );
    } catch (error) {
      return new Response(
        JSON.stringify({ success: false, error: "خطأ في السيرفر: " + error.message }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  },
};
