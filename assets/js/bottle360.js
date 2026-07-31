/* ============================================================
   FLAMMA · botella 360° (fotos reales)
   36 vistas encadenadas. Gira sola y se arrastra con
   ratón o dedo. Es la botella real, no un modelo 3D.
   Se activa en [data-bottle360].
   ============================================================ */
(function(){
  "use strict";
  const host=document.querySelector("[data-bottle360]");
  if(!host) return;

  const N=36;                          // número de vistas
  const PATH=i=>`/assets/img/360/b${String(i).padStart(2,"0")}.jpg`;
  const reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // precargar
  const imgs=[]; let loaded=0;
  host.innerHTML=`<div class="b360-stage"><img class="b360-img" alt="Botella Flamma, gírala"><div class="b360-hint">Arrástrame ↔</div></div>`;
  const el=host.querySelector(".b360-img");
  const hint=host.querySelector(".b360-hint");

  for(let i=0;i<N;i++){
    const im=new Image();
    im.onload=()=>{ if(++loaded===1){ el.src=imgs[0].src; } };
    im.src=PATH(i); imgs[i]=im;
  }

  let frame=0, target=0, dragging=false, lastX=0, auto=reduce?0:0.25, moved=false;

  function show(f){
    const idx=((Math.round(f)%N)+N)%N;
    if(imgs[idx] && imgs[idx].complete) el.src=imgs[idx].src;
  }

  host.addEventListener("pointerdown",e=>{dragging=true;lastX=e.clientX;auto=0;host.classList.add("is-grab");});
  window.addEventListener("pointerup",()=>{dragging=false;host.classList.remove("is-grab");});
  window.addEventListener("pointermove",e=>{
    if(!dragging)return;
    const dx=e.clientX-lastX; lastX=e.clientX;
    target += dx*0.15;          // sensibilidad del arrastre
    if(!moved && Math.abs(dx)>2){moved=true; hint&&(hint.style.opacity="0");}
  });

  function tick(){
    requestAnimationFrame(tick);
    target += auto;             // giro automático suave
    frame += (target-frame)*0.15;
    show(frame);
  }
  tick();
})();
