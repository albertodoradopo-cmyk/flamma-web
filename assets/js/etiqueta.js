/* ============================================================
   FLAMMA · personalizador de etiqueta
   Vista previa en vivo. "Flamma Candles" y el marco quedan
   FIJOS (no editables). El cliente cambia aroma, nº, gramos,
   horas y "natural". Al enviar, llega el pedido por WhatsApp
   o email con los datos exactos para imprimir en Canva.
   ============================================================ */
(function(){
  "use strict";

  const F = window.FLAMMA || {};
  const WA = F.whatsapp || "34648495591";
  const MAIL = F.email || "info@vitrumsl.es";

  const CAMPOS = [
    { id:"aroma",  label:"Nombre del aroma", val:"LAVANDULA ANGUSTIFOLIA", max:28, ph:"Ej: JAZMÍN, o el nombre que quieras" },
    { id:"num",    label:"Número",           val:"No. 02", max:8 },
    { id:"sub",    label:"Línea inferior",   val:"From wine bottles", max:24 },
    { id:"gramos", label:"Gramos",           val:"275 g", max:10 },
    { id:"horas",  label:"Horas",            val:"50 Hours", max:12 },
    { id:"natural",label:"Arriba derecha",   val:"100% Natural", max:14 }
  ];

  function esc(s){return (s||"").replace(/[<>&"]/g,c=>({"<":"&lt;",">":"&gt;","&":"&amp;",'"':"&quot;"}[c]));}

  function svgEtiqueta(v){
    // Etiqueta tipo Flamma: marco doble, cabecera fija "Flamma Candles"
    return `
    <svg viewBox="0 0 300 240" xmlns="http://www.w3.org/2000/svg" class="lbl-svg" role="img" aria-label="Vista previa de la etiqueta">
      <rect x="1" y="1" width="298" height="238" fill="#F7F1E4"/>
      <rect x="10" y="10" width="280" height="220" fill="none" stroke="#1C2733" stroke-width="1.4"/>
      <rect x="15" y="15" width="270" height="210" fill="none" stroke="#1C2733" stroke-width="0.7"/>
      <text x="26" y="40" font-family="Inter,sans-serif" font-size="9" fill="#1C2733">${esc(v.num)}</text>
      <text x="274" y="40" text-anchor="end" font-family="Inter,sans-serif" font-size="9" fill="#1C2733">${esc(v.natural)}</text>
      <!-- FIJO -->
      <text x="150" y="72" text-anchor="middle" font-family="Georgia,'Times New Roman',serif" font-style="italic" font-size="12" fill="#1C2733">Flamma Candles</text>
      <!-- EDITABLE (aroma, puede ir en 1 o 2 líneas) -->
      ${aromaLineas(v.aroma)}
      <text x="150" y="150" text-anchor="middle" font-family="Inter,sans-serif" font-size="9.5" fill="#1C2733">${esc(v.sub)}</text>
      <text x="150" y="168" text-anchor="middle" font-family="Inter,sans-serif" font-size="8.5" fill="#1C2733">Made in Barcelona</text>
      <text x="26" y="212" font-family="Inter,sans-serif" font-size="8.5" fill="#1C2733">${esc(v.gramos)}</text>
      <text x="274" y="212" text-anchor="end" font-family="Inter,sans-serif" font-size="8.5" fill="#1C2733">${esc(v.horas)}</text>
    </svg>`;
  }

  function aromaLineas(txt){
    txt=(txt||"").trim().toUpperCase();
    // parte en 2 líneas si es largo
    let l1=txt,l2="";
    if(txt.length>14){
      const words=txt.split(" ");
      if(words.length>1){
        let acc=""; for(const w of words){ if((acc+" "+w).trim().length<=14){acc=(acc+" "+w).trim();} else {l2+=(l2?" ":"")+w;} }
        l1=acc||txt;
      }
    }
    const size = (l1.length>13||l2) ? 16 : 20;
    if(l2){
      return `<text x="150" y="102" text-anchor="middle" font-family="Georgia,serif" font-size="${size}" letter-spacing="1" fill="#1C2733">${esc(l1)}</text>
              <text x="150" y="122" text-anchor="middle" font-family="Georgia,serif" font-size="${size}" letter-spacing="1" fill="#1C2733">${esc(l2)}</text>`;
    }
    return `<text x="150" y="112" text-anchor="middle" font-family="Georgia,serif" font-size="${size}" letter-spacing="1.5" fill="#1C2733">${esc(l1)}</text>`;
  }

  function init(){
    const root=document.querySelector("[data-etiqueta]"); if(!root)return;
    const v={}; CAMPOS.forEach(c=>v[c.id]=c.val);

    const inputs = CAMPOS.map(c=>`
      <label class="lbl-field">
        <span>${c.label}</span>
        <input type="text" data-f="${c.id}" value="${esc(c.val)}" maxlength="${c.max}" ${c.ph?`placeholder="${esc(c.ph)}"`:""}>
      </label>`).join("");

    root.innerHTML = `
      <div class="lbl-wrap">
        <div class="lbl-preview">
          <div class="lbl-card" data-preview>${svgEtiqueta(v)}</div>
          <p class="lbl-note">La cabecera <b>Flamma Candles</b> y el marco no se pueden cambiar: son la firma de la casa.</p>
        </div>
        <div class="lbl-form">
          <span class="eyebrow">Personaliza tu etiqueta</span>
          <h3 class="h3" style="margin:.2rem 0 1rem">Escribe y ve el resultado</h3>
          ${inputs}
          <label class="lbl-field"><span>Tu nombre / referencia del pedido</span>
            <input type="text" data-f="ref" maxlength="40" placeholder="Para saber de quién es"></label>
          <div class="lbl-actions">
            <a class="btn btn--gold" data-send-wa target="_blank" rel="noopener">Enviar por WhatsApp</a>
            <a class="btn btn--ghost" data-send-mail>Enviar por email</a>
          </div>
          <p class="lbl-hint">Al enviar nos llega tu etiqueta con estos datos. La montamos, te confirmamos cómo queda y la imprimimos.</p>
        </div>
      </div>`;

    const preview=root.querySelector("[data-preview]");
    function refresh(){ preview.innerHTML=svgEtiqueta(v); armarEnvio(); }

    root.querySelectorAll("input[data-f]").forEach(inp=>{
      inp.addEventListener("input",()=>{ v[inp.dataset.f]=inp.value; refresh(); });
    });

    function textoPedido(){
      return [
        "Hola Flamma, quiero personalizar una etiqueta:",
        "",
        "• Aroma: "+(v.aroma||"-"),
        "• Número: "+(v.num||"-"),
        "• Línea inferior: "+(v.sub||"-"),
        "• Gramos: "+(v.gramos||"-"),
        "• Horas: "+(v.horas||"-"),
        "• Arriba derecha: "+(v.natural||"-"),
        v.ref?("• Pedido de: "+v.ref):"",
        "",
        "(Flamma Candles y el marco van fijos)"
      ].filter(Boolean).join("\n");
    }
    function armarEnvio(){
      const t=encodeURIComponent(textoPedido());
      const wa=root.querySelector("[data-send-wa]");
      const ml=root.querySelector("[data-send-mail]");
      if(wa) wa.href=`https://wa.me/${WA}?text=${t}`;
      if(ml) ml.href=`mailto:${MAIL}?subject=${encodeURIComponent("Etiqueta personalizada · "+(v.aroma||""))}&body=${t}`;
    }
    armarEnvio();
  }

  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",init);
  else init();
})();
