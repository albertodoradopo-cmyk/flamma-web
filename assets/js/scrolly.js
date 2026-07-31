/* ============================================================
   FLAMMA · scrollytelling del proceso (estilo "panel fijo")
   Panel de foto fijo que cambia al entrar cada paso.
   Barra de progreso arriba. Textos que pasan por el lado.
   Sin dependencias. Respeta "reduce movimiento".
   ============================================================ */
(function(){
  "use strict";

  const STEPS = [
    { img:"f01", tag:"01 · La botella",   t:"Una botella con historia",
      d:"Una botella de vino que ya cumplió su primera vida. Buen vidrio, grueso y con carácter. Aquí empieza todo." },
    { img:"f02", tag:"02 · El corte",     t:"Se parte en dos",
      d:"Separamos la mitad inferior con un corte limpio y preciso. Cada tipo de vidrio se comporta distinto, así que el corte se ajusta pieza a pieza." },
    { img:"f03", tag:"03 · El pulido",    t:"Un borde de cristalería",
      d:"Rebajamos y pulimos el borde a mano hasta dejarlo suave y seguro. Y conservamos la picada, el culo de botella, a la vista." },
    { img:"f04", tag:"04 · La mecha",     t:"Algodón, bien centrado",
      d:"Colocamos una mecha de algodón, centrada y a la altura justa, para una llama estable y una combustión pareja de principio a fin." },
    { img:"f05", tag:"05 · La cera",      t:"Cera vegetal, sin prisa",
      d:"Vertemos cera 100% vegetal a la temperatura exacta y la dejamos reposar hasta una superficie lisa y pareja." },
    { img:"f06", tag:"06 · La etiqueta",  t:"Su nombre y sus horas",
      d:"Cada pieza recibe su etiqueta: el número, la fragancia, el gramaje y las horas de luz. Hecha en Barcelona." },
    { img:"f07", tag:"07 · La primera llama", t:"Arde como debe",
      d:"La encendemos una vez para comprobar que la llama prende bien y la mecha queda a punto para ti." },
    { img:"f08", tag:"08 · La caja",      t:"Lista para regalar",
      d:"Se guarda en su caja kraft con su tarjeta y su viruta de madera, lista para encender en casa o para regalar." }
  ];

  const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
  const ease=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;

  function build(root){
    const panels = STEPS.map((s,i)=>
      `<img src="/assets/img/sc/${s.img}.jpg" alt="${s.t}" data-fig="${i}" ${i?'':'class="is-on"'} loading="${i<2?'eager':'lazy'}">`
    ).join("");
    const steps = STEPS.map((s,i)=>`
      <article class="sc-step" data-step="${i}">
        <div class="sc-step__inner">
          <span class="sc-step__tag">${s.tag}</span>
          <h3 class="sc-step__t">${s.t}</h3>
          <p class="sc-step__d">${s.d}</p>
        </div>
      </article>`).join("");

    root.innerHTML = `
      <div class="sc-rail">
        <div class="sc-progress">
          <span class="sc-progress__label">El proceso</span>
          <div class="sc-progress__track"><div class="sc-progress__fill" data-fill></div></div>
          <span class="sc-progress__count"><b data-count>01</b> / 0${STEPS.length}</span>
        </div>
      </div>
      <div class="sc-stage">
        <div class="sc-visual">
          <div class="sc-figure">${panels}</div>
          <div class="sc-hint">Sigue bajando</div>
          <div class="sc-dots">${STEPS.map((s,i)=>`<button class="sc-dot${i?'':' is-on'}" data-goto="${i}" aria-label="${s.t}"></button>`).join("")}</div>
        </div>
        <div class="sc-steps">${steps}
          <div class="sc-endcap" aria-hidden="true"></div>
        </div>
      </div>`;
  }

  function init(){
    const root=document.querySelector("[data-scrolly]"); if(!root)return;
    build(root);
    const figs=[...root.querySelectorAll("[data-fig]")];
    const stepsEls=[...root.querySelectorAll(".sc-step")];
    const dots=[...root.querySelectorAll(".sc-dot")];
    const fill=root.querySelector("[data-fill]");
    const count=root.querySelector("[data-count]");
    let current=-1;

    function show(i){
      if(i===current)return; current=i;
      figs.forEach((f,k)=>f.classList.toggle("is-on",k===i));
      dots.forEach((d,k)=>{d.classList.toggle("is-on",k===i);d.classList.toggle("is-done",k<i);});
      count.textContent=String(i+1).padStart(2,"0");
    }

    const reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if(reduce){ root.classList.add("sc-static"); show(STEPS.length-1); if(fill)fill.style.width="100%"; return; }

    // paso activo = el que está más cerca del centro de la pantalla
    let ticking=false;
    function update(){
      ticking=false;
      const rr=root.getBoundingClientRect();
      const total=root.offsetHeight-window.innerHeight;
      const p=clamp((-rr.top)/(total||1),0,1);
      if(fill)fill.style.width=(p*100).toFixed(1)+"%";
      const idx=clamp(Math.floor(p*STEPS.length*1.0001),0,STEPS.length-1);
      show(idx);
      if(p>0.02)root.classList.add("started");
    }
    function onScroll(){ if(!ticking){ticking=true;requestAnimationFrame(update);} }
    window.addEventListener("scroll",onScroll,{passive:true});
    window.addEventListener("resize",onScroll);

    dots.forEach(b=>b.addEventListener("click",()=>{
      const i=+b.dataset.goto;
      const el=stepsEls[i]; const r=el.getBoundingClientRect();
      window.scrollTo({top:window.scrollY+r.top-(window.innerHeight/2)+r.height/2,behavior:"smooth"});
    }));

    update();
  }

  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",init);
  else init();
})();
