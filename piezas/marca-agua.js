// La marca de agua del creador: una carita de gato y su nombre («Michi Lyrics»), blanca y semitransparente, abajo a
// la izquierda, dentro de la zona que no tapa Instagram ni TikTok (encima de la descripción, lejos de los botones).
// Cada plano la llama al final de su dibuja, en todos los videos:
//   import { marcaDeAgua } from "#piezas/marca-agua.js";   ...   marcaDeAgua(g);
// Opciones: marcaDeAgua(g, { texto: "Michi Lyrics", x: 64, y: 1392, alfa: 0.7, tam: 40 })
// (el texto se dibuja al llamarla, nunca al cargar el módulo: así no se pierden las tildes de los subtítulos).

import { createCanvas } from "@napi-rs/canvas";

function michi(g, cx, cy, r) {
  // la cabeza: un óvalo ancho con dos orejas en punta
  g.beginPath();
  g.moveTo(cx - r * 0.95, cy - r * 0.15);
  g.lineTo(cx - r * 0.85, cy - r * 1.15); // oreja izquierda
  g.lineTo(cx - r * 0.35, cy - r * 0.72);
  g.quadraticCurveTo(cx, cy - r * 0.86, cx + r * 0.35, cy - r * 0.72);
  g.lineTo(cx + r * 0.85, cy - r * 1.15); // oreja derecha
  g.lineTo(cx + r * 0.95, cy - r * 0.15);
  g.bezierCurveTo(cx + r * 1.05, cy + r * 0.75, cx - r * 1.05, cy + r * 0.75, cx - r * 0.95, cy - r * 0.15);
  g.closePath();
  g.fill();
  // los ojos y la nariz, recortados
  g.save();
  g.globalCompositeOperation = "destination-out";
  for (const s of [-1, 1]) { g.beginPath(); g.ellipse(cx + s * r * 0.38, cy - r * 0.08, r * 0.13, r * 0.19, 0, 0, Math.PI * 1.98); g.fill(); }
  g.beginPath(); g.moveTo(cx - r * 0.1, cy + r * 0.2); g.lineTo(cx + r * 0.1, cy + r * 0.2); g.lineTo(cx, cy + r * 0.32); g.closePath(); g.fill();
  g.restore();
  // los bigotes
  g.lineWidth = Math.max(1.5, r * 0.06); g.lineCap = "round";
  g.beginPath();
  for (const s of [-1, 1]) for (const dy of [-0.06, 0.12]) { g.moveTo(cx + s * r * 0.75, cy + r * 0.22); g.lineTo(cx + s * r * 1.35, cy + r * (0.12 + dy)); }
  g.stroke();
}

export function marcaDeAgua(g, { texto = "Michi Lyrics", x = 64, y = 1392, alfa = 0.7, tam = 40 } = {}) {
  // se dibuja en un lienzo aparte para que los recortes de los ojos no agujereen el video
  const c = hacerLienzo(tam);
  const m = c.getContext("2d");
  m.setTransform(1, 0, 0, 1, 0, 0); m.clearRect(0, 0, c.width, c.height);
  const r = tam * 0.62;
  m.fillStyle = "#ffffff"; m.strokeStyle = "#ffffff";
  michi(m, r * 1.5, c.height / 2 + r * 0.2, r);
  m.font = `800 ${tam}px Figtree`; m.textBaseline = "middle"; m.textAlign = "left";
  m.fillText(texto, r * 3.1, c.height / 2 + tam * 0.05);
  g.save();
  g.setTransform(1, 0, 0, 1, 0, 0);
  g.globalCompositeOperation = "source-over"; g.filter = "none";
  g.globalAlpha = alfa;
  g.shadowColor = "rgba(0,0,0,0.6)"; g.shadowBlur = 10; g.shadowOffsetY = 2;
  g.drawImage(c, x - r * 0.5, y - c.height / 2);
  g.restore();
}

const LIENZOS = new Map();
function hacerLienzo(tam) {
  if (!LIENZOS.has(tam)) LIENZOS.set(tam, createCanvas(Math.round(tam * 14), Math.round(tam * 3)));
  return LIENZOS.get(tam);
}
