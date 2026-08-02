/* ============ FLAMMA · app.js ============ */
(function(){
  "use strict";

  /* ---- datos de contacto (editar aquí) ---- */
  const FLAMMA = {
    email:"info@vitrumsl.es",
    phone:"+34 648 49 55 91",
    whatsapp:"34648495591",
    instagram:"", facebook:"", tiktok:""   // sin perfiles todavía
  };
  window.FLAMMA_INFO = FLAMMA;

  const CART_KEY="flamma_cart_v1";
  const money=n=>n.toLocaleString("es-ES",{minimumFractionDigits:2,maximumFractionDigits:2})+" €";
  const imgFull=r=>`/assets/img/full/${r}.jpg`;
  const imgCard=r=>`/assets/img/card/${r}.jpg`;
  window.flammaMoney=money;

  /* ---------- picada (firma) ---------- */
  function punt(size, flame){
    const s=size||24;
    return `<span class="punt${flame?" punt--flame":""}" aria-hidden="true" style="width:${Math.round(s*0.55)}px;height:${s}px"></span>`;
  }
  window.flammaPunt=punt;

  /* ---------- cart storage ---------- */
  function getCart(){try{return JSON.parse(localStorage.getItem(CART_KEY))||[]}catch(e){return[]}}
  function saveCart(c){localStorage.setItem(CART_KEY,JSON.stringify(c));updateCount();}
  function cartCount(){return getCart().reduce((n,i)=>n+i.qty,0)}
  function cartSubtotal(){return getCart().reduce((n,i)=>n+i.price*i.qty,0)}
  function addToCart(item){
    const c=getCart();
    const key=item.id+(item.variant?("::"+item.variant):"");
    const ex=c.find(i=>(i.id+(i.variant?("::"+i.variant):""))===key);
    if(ex)ex.qty+=item.qty||1; else c.push({...item,qty:item.qty||1});
    saveCart(c);toast(`${item.name} añadido a la cesta`);
  }
  window.flammaAdd=addToCart;
  function updateCount(){
    const n=cartCount();
    document.querySelectorAll("[data-cart-count]").forEach(el=>{el.textContent=n;el.style.display=n?"inline-flex":"none"});
  }

  /* ---------- toast ---------- */
  let toastEl;
  function toast(msg){
    if(!toastEl){toastEl=document.createElement("div");toastEl.className="toast";document.body.appendChild(toastEl);}
    toastEl.innerHTML=punt(18)+`<span>${msg}</span>`;
    toastEl.classList.add("show");
    clearTimeout(toast._t);toast._t=setTimeout(()=>toastEl.classList.remove("show"),2200);
  }

  /* ---------- header / footer inject ---------- */
  function header(){
    const link=(href,txt)=>`<a href="${href}" ${location.pathname===href?'aria-current="page"':''}>${txt}</a>`;
    return `<div class="ticker">Envío gratis a partir de <b>60&nbsp;€</b> · Hecho a mano en Barcelona</div>
    <nav class="nav" id="nav"><div class="wrap"><div class="nav__bar">
      <a class="brand" href="/index.html">${punt(30,true)}<span><b>Flamma</b><small>Barcelona</small></span></a>
      <div class="nav__links">
        ${link("/tienda.html","Tienda")}
        ${link("/tu-botella.html","Tu botella")}
        ${link("/magnum.html","Magnum")}
        ${link("/proceso.html","Proceso")}
        ${link("/sostenibilidad.html","Sostenibilidad")}
        ${link("/historia.html","Historia")}
        ${link("/contacto.html","Contacto")}
      </div>
      <div class="nav__right">
        <a class="cart-btn" href="/carrito.html">Cesta <span class="count" data-cart-count>0</span></a>
        <button class="nav__toggle" aria-label="Menú" onclick="document.getElementById('nav').classList.toggle('open')">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
        </button>
      </div>
    </div></div></nav>`;
  }
  function footer(){
    const y=new Date().getFullYear();
    return `<footer class="footer"><div class="wrap">
      <div class="footer__grid">
        <div>
          <a class="brand" href="/index.html">${punt(30)}<span><b>Flamma</b><small>Barcelona</small></span></a>
          <p class="footer__note">Velas de cera vegetal nacidas de botellas de vino recuperadas. Perfectos imperfectos, hechos a mano.</p>
        </div>
        <div><h4>Tienda</h4><ul>
          <li><a href="/tienda.html">Todas las velas</a></li>
          <li><a href="/magnum.html">Magnum</a></li>
          <li><a href="/tu-botella.html">Tu botella</a></li>
          <li><a href="/tienda.html">Regalo &amp; eventos</a></li>
        </ul></div>
        <div><h4>Casa</h4><ul>
          <li><a href="/historia.html">Historia</a></li>
          <li><a href="/proceso.html">Proceso</a></li>
          <li><a href="/sostenibilidad.html">Sostenibilidad</a></li>
          <li><a href="/catalogo.html">Catálogo</a></li>
          <li><a href="/contacto.html">Contacto</a></li>
          <li><a href="/contacto.html">Bodegas &amp; B2B</a></li>
        </ul></div>
        <div><h4>Contacto</h4><ul>
          <li><a href="mailto:${FLAMMA.email}">${FLAMMA.email}</a></li>
          <li><a href="tel:${FLAMMA.phone.replace(/\s/g,'')}">${FLAMMA.phone}</a></li>
          <li><a href="/legal/aviso-legal.html">Aviso legal</a></li>
          <li><a href="/legal/privacidad.html">Privacidad</a></li>
          <li><a href="/legal/cookies.html">Cookies</a></li>
          <li><a href="/legal/envios-devoluciones.html">Envíos y devoluciones</a></li>
        </ul></div>
      </div>
      <div class="footer__bottom">
        <span>© ${y} Flamma · Vitrum SL</span>
        <span>Upcycling de botellas de vino · Barcelona</span>
      </div>
    </div></footer>`;
  }

  /* ---------- product card ---------- */
  function card(p){
    const badge = p.badge?`<span class="card__badge">${p.badge}</span>`:"";
    return `<article class="card reveal">
      <div class="card__media">
        <span class="card__no">${p.no}</span>${badge}
        <img src="${imgCard(p.img)}" alt="Vela Flamma ${p.name}" loading="lazy">
      </div>
      <div class="card__body">
        <a class="card__link" href="/producto.html?id=${p.id}" aria-label="${p.name}"></a>
        <div class="card__name">${p.name}</div>
        <div class="card__sub">${p.sub}</div>
        <div class="card__foot">
          <div class="card__price">${money(p.price)}</div>
          <button class="add" data-add="${p.id}">Añadir</button>
        </div>
      </div>
    </article>`;
  }
  function wireAdds(){
    document.querySelectorAll("[data-add]").forEach(b=>{
      b.addEventListener("click",e=>{
        e.preventDefault();
        const id=b.getAttribute("data-add");
        const p=[...window.FLAMMA_PRODUCTS,window.FLAMMA_MAGNUM].find(x=>x.id===id);
        if(p)addToCart({id:p.id,name:p.name,price:p.price,img:p.img});
      });
    });
  }
  window.flammaRenderGrid=function(sel,list){
    const el=document.querySelector(sel);if(!el)return;
    el.innerHTML=(list||window.FLAMMA_PRODUCTS).map(card).join("");
    wireAdds();observeReveals();
  };

  /* ---------- product detail ---------- */
  window.flammaRenderProduct=function(){
    const id=new URLSearchParams(location.search).get("id");
    const all=[...window.FLAMMA_PRODUCTS,window.FLAMMA_MAGNUM];
    const p=all.find(x=>x.id===id)||window.FLAMMA_PRODUCTS[0];
    const isMag=p.id==="magnum";
    const specs=(isMag?window.FLAMMA_SPECS.magnum:window.FLAMMA_SPECS.estandar)
      .map(s=>`<li><span>${s[0]}</span><span>${s[1]}</span></li>`).join("");
    const chips=p.notes.map(n=>`<span class="chip">${n}</span>`).join("");
    const variant = isMag ? `<div class="field" style="max-width:320px">
        <label for="frag">Fragancia</label>
        <select id="frag">
          ${window.FLAMMA_PRODUCTS.map(x=>`<option value="${x.name}">${x.name}${x.common?` · ${x.common}`:""}</option>`).join("")}
        </select></div>` : "";
    let selColor="Verde";
    const colorOpts = isMag ? [["Verde","verde","ok"],["Marrón","marron","ok"]]
                            : [["Verde","verde","ok"],["Marrón","marron","ok"],["Azul","azul","limited"]];
    const colorField = `<div class="field" style="max-width:440px">
        <label>Color de la botella</label>
        <div class="swatches" id="colors">
          ${colorOpts.map(([lbl,suf,st],i)=>`<button type="button" class="swatch swatch--${suf}${i===0?" is-sel":""}" data-suf="${suf}" data-lbl="${lbl}" data-st="${st}"><span></span>${lbl}</button>`).join("")}
        </div>
        <p id="colnote" class="colnote" hidden>Azul · Edición limitada — sin stock ahora mismo.</p></div>`;
    document.title=`${p.name} · Flamma`;
    document.querySelector("#pd").innerHTML=`
      <div class="pd__media reveal"><img id="pdimg" src="${imgFull(p.img+'-verde')}" onerror="this.onerror=null;this.src='${imgFull(p.img)}'" alt="Vela Flamma ${p.name}"></div>
      <div class="pd__info reveal">
        <div class="pd__no">${p.no}</div>
        <h1 class="h2">${p.name}</h1>
        ${p.common?`<p class="serif-italic muted" style="margin-top:-.2rem">${p.common}</p>`:""}
        <div class="pd__price">${money(p.price)}</div>
        <p class="lead">${p.desc}</p>
        <div class="chips">${chips}</div>
        ${colorField}
        ${variant}
        <div class="pd__buy">
          <div class="qty">
            <button type="button" data-q="-">−</button>
            <input id="qty" type="text" value="1" inputmode="numeric" aria-label="Cantidad">
            <button type="button" data-q="+">+</button>
          </div>
          <button class="btn btn--gold" id="buy">Añadir a la cesta</button>
        </div>
        <ul class="pd__specs">${specs}</ul>
        <p class="muted" style="font-size:.86rem">Cada botella es distinta: el tono del vidrio y la picada varían de una pieza a otra. No hay dos velas iguales.</p>
      </div>`;
    const qtyEl=document.querySelector("#qty");
    document.querySelectorAll("[data-q]").forEach(b=>b.addEventListener("click",()=>{
      let v=parseInt(qtyEl.value)||1;v+= b.dataset.q==="+"?1:-1;qtyEl.value=Math.max(1,v);
    }));
    const buyBtn=document.querySelector("#buy");
    const colNote=document.querySelector("#colnote");
    document.querySelectorAll("#colors .swatch").forEach(sw=>sw.addEventListener("click",()=>{
      document.querySelectorAll("#colors .swatch").forEach(s=>s.classList.remove("is-sel"));
      sw.classList.add("is-sel"); selColor=sw.dataset.lbl;
      const im=document.querySelector("#pdimg");
      im.onerror=function(){this.onerror=null;this.src=imgFull(p.img);};
      im.src=imgFull(p.img+"-"+sw.dataset.suf);
      const limited=sw.dataset.st==="limited";
      if(colNote) colNote.hidden=!limited;
      buyBtn.disabled=limited;
      buyBtn.textContent=limited?"Sin stock · edición limitada":"Añadir a la cesta";
    }));
    buyBtn.addEventListener("click",()=>{
      if(buyBtn.disabled)return;
      const qty=Math.max(1,parseInt(qtyEl.value)||1);
      const frag=isMag?document.querySelector("#frag").value:null;
      const parts=[selColor]; if(frag)parts.unshift(frag);
      const variant=parts.join(" · ");
      addToCart({id:p.id,name:p.name+" · "+variant,price:p.price,img:p.img,qty,variant});
    });
    observeReveals();
  };

  /* ---------- cart page ---------- */
  window.flammaRenderCart=function(){
    const root=document.querySelector("#cart");if(!root)return;
    const c=getCart();
    if(!c.length){
      root.innerHTML=`<div class="empty">
        <div class="divider" style="margin-top:0">${punt(30)}</div>
        <h2 class="h3">Tu cesta está vacía</h2>
        <p class="muted">Aún no has elegido ninguna vela. Empieza por la colección.</p>
        <a class="btn btn--ink" href="/tienda.html" style="margin-top:14px">Ver la colección</a>
      </div>`;return;
    }
    const lines=c.map((i,idx)=>`<div class="cart-line">
      <img src="${imgCard(i.img)}" alt="${i.name}">
      <div><div class="cart-line__name">${i.name}</div>
        <div class="cart-line__meta">${money(i.price)} · uds:
          <button class="cart-line__rm" data-dec="${idx}">−</button> ${i.qty}
          <button class="cart-line__rm" data-inc="${idx}">+</button></div>
        <button class="cart-line__rm" data-rm="${idx}">Quitar</button>
      </div>
      <div class="cart-line__price" style="font-family:var(--serif);font-weight:600;font-size:1.05rem">${money(i.price*i.qty)}</div>
    </div>`).join("");
    const sub=cartSubtotal();
    const ship=window.FLAMMA_SHIP;
    const shipCost = sub>=ship.freeFrom?0:ship.flat;
    const shipTxt = shipCost===0?"Gratis":money(shipCost);
    const falta = ship.freeFrom-sub;
    root.innerHTML=`<div class="grid" style="grid-template-columns:1.6fr .9fr;gap:clamp(28px,4vw,56px)">
      <div>${lines}
        ${falta>0?`<p class="notice" style="margin-top:20px">Te faltan <b>${money(falta)}</b> para el envío gratis.</p>`:""}
      </div>
      <div class="summary">
        <h3 class="h3" style="font-size:1.4rem;margin-bottom:12px">Resumen</h3>
        <div class="summary__row"><span>Subtotal</span><span>${money(sub)}</span></div>
        <div class="summary__row"><span>Envío</span><span>${shipTxt}</span></div>
        <div class="summary__row summary__row--total"><span>Total</span><span>${money(sub+shipCost)}</span></div>
        <button class="btn btn--gold btn--block" id="checkout" style="margin-top:18px">Finalizar pedido</button>
        <p class="muted" style="font-size:.82rem;margin-top:14px">Al finalizar nos envías el pedido y te confirmamos disponibilidad y forma de pago. El pago con tarjeta online se activará muy pronto.</p>
      </div>
    </div>`;
    root.querySelectorAll("[data-rm]").forEach(b=>b.onclick=()=>{const c=getCart();c.splice(+b.dataset.rm,1);saveCart(c);flammaRenderCart();});
    root.querySelectorAll("[data-inc]").forEach(b=>b.onclick=()=>{const c=getCart();c[+b.dataset.inc].qty++;saveCart(c);flammaRenderCart();});
    root.querySelectorAll("[data-dec]").forEach(b=>b.onclick=()=>{const c=getCart();const i=c[+b.dataset.dec];i.qty=Math.max(1,i.qty-1);saveCart(c);flammaRenderCart();});
    document.querySelector("#checkout").onclick=checkout;
  };

  /* ---------- checkout (interino: email/WhatsApp; luego pasarela) ---------- */
  function checkout(){
    const c=getCart();if(!c.length)return;
    const sub=cartSubtotal();const ship=window.FLAMMA_SHIP;
    const shipCost=sub>=ship.freeFrom?0:ship.flat;
    let body="Hola Flamma, quiero hacer este pedido:%0A%0A";
    c.forEach(i=>{body+=`• ${i.qty} × ${i.name}: ${money(i.price*i.qty)}%0A`;});
    body+=`%0ASubtotal: ${money(sub)}%0AEnvío: ${shipCost?money(shipCost):"Gratis"}%0ATotal: ${money(sub+shipCost)}%0A%0AMis datos (nombre, dirección, teléfono):%0A`;
    // WhatsApp primero (más rápido para ellos); alternativa mailto en el botón de contacto
    window.location.href=`https://wa.me/${FLAMMA.whatsapp}?text=${body}`;
  }

  /* ---------- dónde ya estamos ---------- */
  window.flammaRenderPartners=function(sel){
    const sec=document.querySelector(sel);if(!sec)return;
    const list=window.FLAMMA_PARTNERS||[];
    if(!list.length){sec.remove();return;}   // vacío = la sección no se publica
    sec.querySelector("[data-partners]").innerHTML=list.map(p=>`
      <div class="partner reveal">
        ${p.logo?`<img class="partner__logo" src="/assets/img/brand/${p.logo}.png" alt="${p.name}" loading="lazy">`:punt(24)}
        <div class="partner__name">${p.name}</div>
        <div class="partner__kind">${p.kind||""}</div>
        ${p.note?`<div class="partner__note">${p.note}</div>`:""}
      </div>`).join("");
    observeReveals();
  };

  /* ---------- reveals ---------- */
  let io;
  function observeReveals(){
    if(!("IntersectionObserver" in window)){document.querySelectorAll(".reveal").forEach(e=>e.classList.add("in"));return;}
    io=io||new IntersectionObserver((es)=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target);}}),{threshold:.12});
    document.querySelectorAll(".reveal:not(.in)").forEach(e=>io.observe(e));
  }
  window.flammaReveals=observeReveals;

  /* ---------- boot ---------- */
  document.addEventListener("DOMContentLoaded",()=>{
    // favicon
    if(!document.querySelector("link[rel=icon]")){const l=document.createElement("link");l.rel="icon";l.type="image/png";l.href="/assets/img/brand/favicon.png";document.head.appendChild(l);}
    const h=document.querySelector("[data-header]");if(h)h.innerHTML=header();
    const f=document.querySelector("[data-footer]");if(f)f.innerHTML=footer();
    updateCount();observeReveals();
    // rellenar enlaces de contacto marcados
    document.querySelectorAll("[data-mail]").forEach(a=>a.href="mailto:"+FLAMMA.email);
    document.querySelectorAll("[data-wa]").forEach(a=>a.href=`https://wa.me/${FLAMMA.whatsapp}`);
    document.querySelectorAll("[data-mail-txt]").forEach(a=>a.textContent=FLAMMA.email);
    document.querySelectorAll("[data-phone]").forEach(a=>{a.href="tel:"+FLAMMA.phone.replace(/\s/g,"");a.textContent=FLAMMA.phone;});
    // servicio "Tu botella"
    const C=window.FLAMMA_CUSTOM||{};
    document.querySelectorAll("[data-custom-price]").forEach(e=>{if(C.price)e.textContent=C.price;});
    const msg=encodeURIComponent("Hola Flamma, tengo una botella que me gustaría convertir en vela. Os mando una foto.");
    document.querySelectorAll("[data-wa-custom]").forEach(a=>a.href=`https://wa.me/${FLAMMA.whatsapp}?text=${msg}`);
    document.querySelectorAll("[data-mail-custom]").forEach(a=>a.href=`mailto:${FLAMMA.email}?subject=${encodeURIComponent("Tu botella · quiero convertir la mía")}&body=${msg}`);
  });
})();
