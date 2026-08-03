/* Catálogo Flamma · fuente única de productos.
   Para editar precios o textos, cambia aquí y se actualiza en toda la web. */
window.FLAMMA_PRODUCTS = [
  {
    id:"jasminum", no:"No. 01", name:"Jasminum", common:"Jazmín", price:21,
    family:"Floral", notes:["Jazmín","Cremoso","Verde fresco"],
    sub:"Jazmín en flor",
    desc:"Jazmín en flor, dulce y con un fondo verde. Llena bastante la habitación, así que con una basta. Va bien en el salón o el dormitorio.",
    img:"a01"
  },
  {
    id:"lavandula", no:"No. 02", name:"Lavandula Angustifolia", common:"Lavanda", price:21,
    family:"Herbal", notes:["Lavanda","Herbáceo","Alcanforado"],
    sub:"Lavanda de verdad",
    desc:"Lavanda de verdad, limpia y un punto alcanforada, no la lavanda dulzona de detergente. La típica para leer o antes de dormir.",
    img:"a02"
  },
  {
    id:"orchidaceae", no:"No. 03", name:"Orchidaceae", common:"Orquídea", price:21,
    family:"Floral", notes:["Floral exótico","Empolvado","Dulce"],
    sub:"Floral suave y discreto",
    desc:"Floral suave, con un fondo empolvado. Es discreta, no cansa. Para quien no quiere que la casa huela a mucho, solo a limpio y agradable.",
    img:"a03"
  },
  {
    id:"bursera", no:"No. 04", name:"Bursera Graveolens", common:"Palo Santo", price:21,
    family:"Amaderado", notes:["Palo santo","Resina","Cítrico"],
    sub:"Madera y palo santo",
    desc:"Palo santo: madera, algo de resina y un toque cítrico. Cálida y con carácter. La que encienden los que huyen de lo floral.",
    img:"a04"
  },
  {
    id:"citrus", no:"No. 05", name:"Citrus Bergamia", common:"Bergamota", price:22,
    family:"Cítrico", notes:["Bergamota","Chispeante","Floral ligero"],
    sub:"Bergamota, cítrico fresco",
    desc:"Bergamota: cítrico fresco pero no a limpiacristales, con un fondo un poco floral. La de por la mañana, en la cocina o el estudio.",
    img:"a05"
  },
  {
    id:"rosa", no:"No. 06", name:"Rosa Rubiginosa", common:"Rosa Mosqueta", price:22,
    family:"Floral", notes:["Rosa silvestre","Terroso","Cálido"],
    sub:"Rosa de campo",
    desc:"Rosa mosqueta, más de campo que de floristería: algo terrosa y cálida. Una rosa para gente a la que no suele gustarle la rosa.",
    img:"a06"
  },
  {
    id:"cinnamomum", no:"No. 07", name:"Cinnamomum & Aurantium", common:"Naranja y Canela", price:23,
    family:"Especiado", notes:["Naranja","Canela","Reconfortante"],
    sub:"Naranja y canela",
    desc:"Naranja y canela. Huele a casa en invierno, a sobremesa. La que más se vende en Navidad, por algo será.",
    img:"a07"
  },
  {
    id:"original", no:"No. 00", name:"Flamma Original", common:"Sin aroma", price:19,
    family:"Sin aroma", notes:["Sin fragancia","Cera vegetal","Atemporal"],
    sub:"Sin aroma, solo la luz",
    desc:"Sin aroma. Solo la luz y el vidrio. Para quien es sensible a los perfumes, para una mesa donde ya hay comida, o para regalar sin arriesgar con el olor.",
    img:"a00"
  }
];

/* Magnum · pieza mayor, numerada a mano. Ancla de la colección. */
window.FLAMMA_MAGNUM = {
  id:"magnum", no:"Edición Magnum", name:"Magnum", common:"Serie limitada", price:39,
  family:"500 g · 75 h",
  notes:["500 g","75 horas","Numerada a mano"],
  sub:"El doble de cera, muchas más horas de luz",
  desc:"Sale de una botella magnum, la grande. El doble de cera y unas 75 horas de luz. Para salones amplios, mesas largas y para cuando el regalo tiene que notarse. Va numerada a mano y la hacemos en cualquiera de las siete fragancias, o sin aroma.",
  img:"mag2"
};

/* Especificaciones compartidas */
window.FLAMMA_SPECS = {
  estandar:[
    ["Formato","275 g · ~50 horas"],
    ["Cera","100% vegetal (5% coco)"],
    ["Mecha","Algodón"],
    ["Vaso","Botella de vino recuperada, con la picada visible"],
    ["Origen","Hecho a mano en Barcelona"]
  ],
  magnum:[
    ["Formato","500 g · ~75 horas"],
    ["Serie","Numerada a mano, una a una"],
    ["Cera","100% vegetal (5% coco)"],
    ["Mecha","Algodón"],
    ["Vaso","Botella magnum recuperada"],
    ["Origen","Hecho a mano en Barcelona"]
  ]
};

/* ─────────────────────────────────────────────────────────────
   TU BOTELLA · servicio a medida (el cliente aporta su botella)
   Cambia aquí el precio y aparece actualizado en toda la web.
   ───────────────────────────────────────────────────────────── */
window.FLAMMA_CUSTOM = {
  price: 30,            // € por vela a partir de la botella del cliente
  minAviso: true        // muestra el aviso de que la botella puede romperse
};

/* Política de envío (protege margen: el vidrio pesa) */
window.FLAMMA_SHIP = { flat:4.90, freeFrom:60 };

/* ─────────────────────────────────────────────────────────────
   DÓNDE YA ESTAMOS · bodegas, tiendas y clientes
   IMPORTANTE: escribe aquí SOLO nombres que te hayan autorizado
   por escrito a aparecer. Nada de "clientes" sin permiso.
   Si dejas la lista vacía (= []), la sección desaparece sola.
   ───────────────────────────────────────────────────────────── */
window.FLAMMA_PARTNERS = [
  { name:"Cellers Augustus Forum", kind:"Bodega · Penedès", logo:"p-augustus" },
  { name:"Recaredo",               kind:"Corpinnat · Des de 1924", logo:"p-recaredo" },
  { name:"Bosque de Matasnos",     kind:"Bodega · Ribera del Duero", logo:"p-matasnos" },
  { name:"Conde de Valicourt",     kind:"Cava · Des de 1940", logo:"p-valicourt" }
];
