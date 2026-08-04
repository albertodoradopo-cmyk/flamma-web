// Envía email de confirmación al dueño y al cliente tras un pago.
// Requiere RESEND_API_KEY en Netlify. Verifica el pago en SumUp antes de enviar.
exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };

  const RESEND = process.env.RESEND_API_KEY;
  const SUMUP = process.env.SUMUP_SECRET_KEY;
  const OWNER = process.env.ORDER_EMAIL || "info@vitrumsl.es";
  const FROM = process.env.ORDER_FROM || "Flamma Candles <onboarding@resend.dev>";
  if (!RESEND) return { statusCode: 500, body: JSON.stringify({ error: "Falta RESEND_API_KEY" }) };

  try {
    const { checkoutId, customer = {}, items = [], total = "" } = JSON.parse(event.body || "{}");

    // Verificar que el checkout está pagado (best-effort: si claramente NO está pagado, no enviamos)
    if (SUMUP && checkoutId) {
      try {
        const cr = await fetch(`https://api.sumup.com/v0.1/checkouts/${checkoutId}`, {
          headers: { Authorization: `Bearer ${SUMUP}` },
        });
        const cd = await cr.json();
        if (cr.ok && cd && cd.status && cd.status !== "PAID") {
          return { statusCode: 200, body: JSON.stringify({ skipped: "checkout no pagado" }) };
        }
      } catch (e) { /* si falla la verificación, seguimos y enviamos */ }
    }

    const esc = (s) => String(s || "").replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c]));
    const itemsHtml = items.map((i) => `<li>${esc(i.qty)} × ${esc(i.name)}${i.lineTotal ? " — " + esc(i.lineTotal) : ""}</li>`).join("");
    const addr = `${esc(customer.dir)}, ${esc(customer.cp)} ${esc(customer.ciudad)}`;
    const nombre = esc(customer.nombre);
    const first = nombre.split(" ")[0] || "";

    const ownerHtml = `<div style="font-family:Arial,sans-serif;font-size:15px;color:#1C2733">
      <h2 style="color:#1C2733">Nuevo pedido — ${esc(total)}</h2>
      <p><b>${nombre}</b><br>${esc(customer.email)} · ${esc(customer.tel)}<br>${addr}</p>
      <ul>${itemsHtml}</ul>
      <p style="color:#888;font-size:13px">Ref. de pago: ${esc(checkoutId)}</p></div>`;

    const custHtml = `<div style="font-family:Arial,sans-serif;font-size:15px;color:#1C2733">
      <h2 style="color:#1C2733">¡Gracias por tu pedido${first ? ", " + first : ""}!</h2>
      <p>Hemos recibido tu pedido y lo estamos preparando a mano. Te avisaremos cuando salga hacia tu casa.</p>
      <h3>Tu pedido</h3>
      <ul>${itemsHtml}</ul>
      <p><b>Total: ${esc(total)}</b></p>
      <p>Envío a: ${addr}</p>
      <p style="margin-top:24px">Con cariño,<br>Flamma Candles · Barcelona</p></div>`;

    const send = (to, subject, html, replyTo) =>
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${RESEND}`, "Content-Type": "application/json" },
        body: JSON.stringify({ from: FROM, to: [to], subject, html, reply_to: replyTo }),
      }).then((r) => r.json().then((d) => ({ ok: r.ok, d })));

    const results = {};
    results.owner = await send(OWNER, `Nuevo pedido — ${nombre} (${total})`, ownerHtml, customer.email);
    if (customer.email) {
      results.customer = await send(customer.email, "Tu pedido en Flamma Candles", custHtml, OWNER);
    }
    return { statusCode: 200, body: JSON.stringify({ ok: true, results }) };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: String(e) }) };
  }
};
