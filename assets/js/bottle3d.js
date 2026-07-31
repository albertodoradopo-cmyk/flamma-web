/* ============================================================
   FLAMMA · botella 3D interactiva (Three.js)
   Una botella de vino verde que gira sola y se puede mover
   con el ratón / el dedo. Vidrio translúcido, luz cálida.
   Se activa en cualquier elemento con [data-bottle3d].
   Respeta "reduce movimiento" (queda quieta).
   ============================================================ */
(function(){
  "use strict";
  const host=document.querySelector("[data-bottle3d]");
  if(!host) return;

  // carga Three.js solo si hace falta
  function load(src){return new Promise((ok,err)=>{const s=document.createElement("script");s.src=src;s.onload=ok;s.onerror=err;document.head.appendChild(s);});}

  async function boot(){
    if(!window.THREE){
      try{ await load("https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"); }
      catch(e){ host.style.display="none"; return; }
    }
    const THREE=window.THREE;
    const reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const w=()=>host.clientWidth, h=()=>host.clientHeight||460;
    const scene=new THREE.Scene();
    const cam=new THREE.PerspectiveCamera(35, w()/h(), 0.1, 100);
    cam.position.set(0,0.4,7.2);

    const renderer=new THREE.WebGLRenderer({antialias:true, alpha:true});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
    renderer.setSize(w(),h());
    host.appendChild(renderer.domElement);

    // luces cálidas de estudio
    scene.add(new THREE.AmbientLight(0xffffff,0.55));
    const key=new THREE.DirectionalLight(0xfff2d8,1.5); key.position.set(3,5,4); scene.add(key);
    const rim=new THREE.DirectionalLight(0xA9884F,0.9); rim.position.set(-4,2,-3); scene.add(rim);
    const fill=new THREE.PointLight(0xffd9a0,0.6); fill.position.set(0,-2,4); scene.add(fill);

    // ---- forma de la botella (perfil girado) ----
    const pts=[];
    // radios (x) a distintas alturas (y), de abajo a arriba
    const prof=[
      [0.00,-2.60],[0.95,-2.60],[1.00,-2.45],[1.00,-0.55],
      [0.98,-0.35],[0.86,0.15],[0.55,0.95],[0.34,1.55],
      [0.30,2.10],[0.30,2.62],[0.38,2.72],[0.38,2.98],[0.30,3.02]
    ];
    prof.forEach(p=>pts.push(new THREE.Vector2(p[0],p[1])));
    const geo=new THREE.LatheGeometry(pts, 64);

    // vidrio verde translúcido
    const glass=new THREE.MeshPhysicalMaterial({
      color:0x3a5a34, metalness:0, roughness:0.12,
      transmission:0.72, thickness:1.2, ior:1.45,
      transparent:true, opacity:0.92, side:THREE.DoubleSide,
      clearcoat:0.6, clearcoatRoughness:0.15
    });
    const bottle=new THREE.Mesh(geo,glass);

    // vino dentro (cilindro oscuro)
    const wineGeo=new THREE.CylinderGeometry(0.9,0.9,1.9,48);
    const wineMat=new THREE.MeshStandardMaterial({color:0x3a0d12, roughness:0.5, metalness:0.1});
    const wine=new THREE.Mesh(wineGeo,wineMat); wine.position.y=-1.5; bottle.add(wine);

    // tapón
    const corkGeo=new THREE.CylinderGeometry(0.31,0.31,0.32,32);
    const corkMat=new THREE.MeshStandardMaterial({color:0x8a6a3f, roughness:0.9});
    const cork=new THREE.Mesh(corkGeo,corkMat); cork.position.y=3.05; bottle.add(cork);

    const group=new THREE.Group(); group.add(bottle); scene.add(group);
    group.rotation.z=0.06;

    // ---- interacción con ratón / dedo ----
    let targetY=0, curY=0, dragging=false, lastX=0, autov=reduce?0:0.004;
    function px(e){return e.touches?e.touches[0].clientX:e.clientX;}
    host.style.cursor="grab";
    host.addEventListener("pointerdown",e=>{dragging=true;lastX=e.clientX;host.style.cursor="grabbing";});
    window.addEventListener("pointerup",()=>{dragging=false;host.style.cursor="grab";});
    window.addEventListener("pointermove",e=>{
      if(!dragging)return;
      targetY += (e.clientX-lastX)*0.01; lastX=e.clientX; autov=0.0008;
    });

    function resize(){ cam.aspect=w()/h(); cam.updateProjectionMatrix(); renderer.setSize(w(),h()); }
    window.addEventListener("resize",resize);

    function tick(){
      requestAnimationFrame(tick);
      targetY += autov;
      curY += (targetY-curY)*0.08;
      group.rotation.y = curY;
      group.rotation.x = Math.sin(curY*0.5)*0.04;
      renderer.render(scene,cam);
    }
    tick();
  }
  boot();
})();
