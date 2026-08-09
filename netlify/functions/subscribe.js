// Suscripción al newsletter: envía el código -10% al suscriptor y avisa al dueño.
// Reutiliza RESEND_API_KEY, ORDER_FROM y ORDER_EMAIL (ya configuradas).
exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };
  const RESEND = process.env.RESEND_API_KEY;
  const OWNER = process.env.ORDER_EMAIL || "info@vitrumsl.es";
  const FROM = process.env.ORDER_FROM || "Flamma Candles <onboarding@resend.dev>";
  if (!RESEND) return { statusCode: 500, body: JSON.stringify({ error: "Falta RESEND_API_KEY" }) };
  try {
    const { email } = JSON.parse(event.body || "{}");
    if (!email || !/.+@.+\..+/.test(email)) return { statusCode: 400, body: JSON.stringify({ error: "email inválido" }) };

    const send = (to, subject, html) =>
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${RESEND}`, "Content-Type": "application/json" },
        body: JSON.stringify({ from: FROM, to: [to], subject, html }),
      });

    const welcome = `<div style="font-family:Arial,sans-serif;font-size:15px;color:#1C2733">
      <h2 style="color:#1C2733">¡Bienvenido/a a Flamma! 🕯️</h2>
      <p>Gracias por suscribirte. Aquí tienes tu <b>10% de descuento</b> para tu primer pedido:</p>
      <p style="font-size:24px;letter-spacing:1px"><b>BIENVENIDA10</b></p>
      <p>Escríbelo en el carrito, en <a href="https://flammacandles.es">flammacandles.es</a>.</p>
      <p style="margin-top:22px">Cada vela nuestra empezó siendo una botella de vino. Gracias por darle una segunda vida.</p>
      <p>— Flamma Candles · Barcelona</p></div>`;

    await send(email, "Tu 10% de bienvenida en Flamma", welcome);
    // aviso al dueño para ir guardando la lista de suscriptores
    try { await send(OWNER, "Nuevo suscriptor en Flamma", `<p>Nuevo email suscrito: <b>${email}</b></p>`); } catch (e) {}

    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: String(e) }) };
  }
};
