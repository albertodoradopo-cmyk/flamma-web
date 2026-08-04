// Crea un checkout en SumUp con el importe recibido.
// La clave SECRETA vive en la variable de entorno SUMUP_SECRET_KEY (nunca en el código).
exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }
  const SECRET = process.env.SUMUP_SECRET_KEY;
  const MERCHANT = process.env.SUMUP_MERCHANT_CODE || "MVEJEJA4";
  if (!SECRET) {
    return { statusCode: 500, body: JSON.stringify({ error: "Falta SUMUP_SECRET_KEY en Netlify" }) };
  }
  try {
    const { amount, description } = JSON.parse(event.body || "{}");
    const amt = Math.round(Number(amount) * 100) / 100;
    if (!amt || amt <= 0) {
      return { statusCode: 400, body: JSON.stringify({ error: "Importe inválido" }) };
    }
    const resp = await fetch("https://api.sumup.com/v0.1/checkouts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SECRET}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        checkout_reference: "flamma-" + Date.now(),
        amount: amt,
        currency: "EUR",
        merchant_code: MERCHANT,
        description: description || "Pedido Flamma Candles",
      }),
    });
    const data = await resp.json();
    if (!resp.ok) {
      return { statusCode: resp.status, body: JSON.stringify({ error: "SumUp", detail: data }) };
    }
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: data.id }),
    };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: String(e) }) };
  }
};
