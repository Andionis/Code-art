// «Su secretario ya había robado estatuillas del Louvre, y dos de ellas las tenía Picasso.»
// Un estante en la sombra: unas estatuillas de piedra con la etiqueta del Louvre; una mano se lleva dos. «Picasso»: las
// dos aparecen en su taller, junto a un lienzo de colores y a su silueta.
import * as k from "#kit";
import { v } from "#voz";
import { persona, fondoCuarto, veloArriba } from "../mundo.js";

export const desde = (vz) => vz.frase(12).inicio;
const { suave: su, tramo: tr, mez } = k;
const f = v.frase(12);
const T0 = f.inicio, Trob = f.t("robado"), Test = f.t("estatuillas"), Tdos = f.t("dos"), Tpic = f.t("picasso"), Fin = f.fin;
export const toman = Trob + 0.1;
export const llegan = Tpic - 0.35;

// una cabeza de piedra antigua (íbera): en (x, y) = la base, de alto h
export function cabeza(g, x, y, h, tono = 0) {
  g.save(); g.translate(x, y); g.scale(h / 400, h / 400);
  const m = g.createLinearGradient(-90, 0, 90, 0); m.addColorStop(0, tono ? "#d8c8a0" : "#c8b890"); m.addColorStop(0.5, "#a89870"); m.addColorStop(1, "#5a4e38");
  g.fillStyle = m;
  g.fillRect(-70, -60, 140, 60);                       // la base
  g.beginPath(); g.ellipse(0, -110, 55, 50, 0, 0, Math.PI * 2); g.fill();   // el cuello y los hombros
  g.beginPath(); g.ellipse(0, -250, 80, 110, 0, 0, Math.PI * 2); g.fill();  // la cabeza
  g.fillStyle = "rgba(60,50,35,0.55)";
  g.beginPath(); g.ellipse(-30, -270, 20, 9, 0, 0, Math.PI * 2); g.ellipse(30, -270, 20, 9, 0, 0, Math.PI * 2); g.fill();
  g.fillRect(-5, -255, 10, 50); g.fillRect(-25, -195, 50, 8);
  g.fillStyle = "rgba(255,255,255,0.15)"; g.beginPath(); g.ellipse(-35, -290, 25, 50, 0.2, 0, Math.PI * 2); g.fill();
  g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.5; g.drawImage(k.manchas, -90, -360, 180, 360);
  g.restore();
}

// un lienzo cubista: planos de colores en ángulo
function lienzoCubista(g, x, y, w, h) {
  g.save(); g.translate(x, y);
  g.fillStyle = "#e8dcc0"; g.fillRect(0, 0, w, h);
  const a = k.azar(12), cols = ["#c8743a", "#3a5a8a", "#d8b04a", "#6a3a2a", "#8aa0a0", "#2a2a2a"];
  for (let i = 0; i < 22; i++) {
    g.fillStyle = cols[i % cols.length]; g.globalAlpha = 0.85; g.beginPath();
    const cx = a() * w, cy = a() * h; g.moveTo(cx, cy);
    for (let j = 0; j < 3; j++) g.lineTo(cx + (a() - 0.5) * w * 0.6, cy + (a() - 0.5) * h * 0.5);
    g.closePath(); g.fill();
  }
  g.globalAlpha = 1; g.strokeStyle = "#5a3a1a"; g.lineWidth = 12; g.strokeRect(0, 0, w, h);
  g.restore();
}

export function dibuja(g, t) {
  // la cámara se va a la derecha: del estante del museo al taller
  const pasa = su(tr(t, llegan - 0.3, Tpic + 0.3));
  g.save(); g.translate(-1080 * pasa, 0);
  // --- el estante del Louvre
  fondoCuarto(g, "#3a2c20", "#0a0806", 540, 1000);
  const est = g.createLinearGradient(0, 1300, 0, 1360); est.addColorStop(0, "#8a6038"); est.addColorStop(1, "#3a2410");
  g.fillStyle = est; g.fillRect(40, 1300, 1000, 60);
  const llev = su(tr(t, toman, toman + 0.6));
  for (let i = 0; i < 3; i++) {
    const x = 220 + i * 320, sale = (i === 0 || i === 2) ? llev : 0;
    if (sale >= 1) continue;
    g.save(); g.globalAlpha = 1 - sale; cabeza(g, x, 1300 - sale * 260, 560, i % 2); g.restore();
  }
  const et = su(tr(t, Test - 0.1, Test + 0.25));
  if (et > 0) k.etiqueta(g, 290, 1420, "Museo del Louvre", "255,220,150", et, 62);
  // --- el taller de Picasso, a la derecha
  g.save(); g.translate(1080, 0);
  fondoCuarto(g, "#4a3a28", "#0c0806", 540, 900);
  g.fillStyle = "#2a1a10"; g.fillRect(0, 1500, 1080, 420);
  lienzoCubista(g, 520, 560, 460, 600);
  persona(g, 300, 1650, 1000, { ropa: "#1a1a20", luz: 0.5 });
  // las dos estatuillas sobre una mesa
  g.fillStyle = "#5a3a1e"; g.fillRect(520, 1330, 480, 40);
  const bri = k.pulso(t, Tpic + 0.05, 0.2);
  cabeza(g, 640, 1330, 400, 1); cabeza(g, 880, 1330, 400, 0);
  if (bri > 0.01) k.brillo(g, 755, 1200, 700, "255,220,150", 0.5 * bri);
  const ep = su(tr(t, Tpic - 0.05, Tpic + 0.25));
  if (ep > 0) k.etiqueta(g, 90, 1720, "Pablo Picasso", "255,220,150", ep, 62);
  g.restore();
  g.restore();
  // «dos»: un 2 grande sobre las dos que se lleva
  const d = su(tr(t, Tdos - 0.1, Tdos + 0.2)) * (1 - pasa);
  if (d > 0) k.pastilla(g, 540, 700, "2", "", "255,220,150", d, 150);
  veloArriba(g, 0.4);
}
