// Un billete verde genérico («1», «UN BILLETE», medallón y líneas de seguridad), plano en pantalla o volando en 3D.
//   import { billete, billete3D, billeteTex, BW, BH } from "#piezas/billete.js";
//   billete(g, x, y, ancho, ang, flip, al)      flip voltea sobre su eje largo (aleteo): de canto se ve fino y oscuro
//   billete3D(g, cam, [x, y, z], s, ang, flip)   devuelve { z, dibuja } para k.deLejosACerca (s: ancho en el mundo)
import * as k from "#kit";

const { F } = k;

// ---------------------------------------------------------------- el billete
// La textura se hace la primera vez que se dibuja (nunca fillText al cargar el módulo).
export const BW = 600, BH = 270;            // proporción del billete (como uno de verdad: ~2,2 : 1)
let texBillete = null;
function hacerBillete() {
  const l = k.lienzo(BW, BH), g = l.getContext("2d");
  const bg = g.createLinearGradient(0, 0, BW, BH);
  bg.addColorStop(0, "#1f6a42"); bg.addColorStop(0.35, "#5fae6e"); bg.addColorStop(0.55, "#b9e3a8"); bg.addColorStop(0.75, "#5fae6e"); bg.addColorStop(1, "#1d5e3b");
  k.redondo(g, 0, 0, BW, BH, 14); g.fillStyle = bg; g.fill();
  g.save(); k.redondo(g, 0, 0, BW, BH, 14); g.clip();
  // las líneas finas de seguridad (guilloché)
  g.lineWidth = 1.4;
  for (let i = 0; i < 26; i++) {
    g.strokeStyle = `rgba(${i % 2 ? "230,255,220" : "20,70,40"},0.32)`;
    g.beginPath();
    for (let x = 0; x <= BW; x += 6) { const y = 20 + i * 9.6 + 8 * Math.sin(x / 26 + i * 0.7) + 5 * Math.sin(x / 9 + i); x ? g.lineTo(x, y) : g.moveTo(x, y); }
    g.stroke();
  }
  g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.25; g.drawImage(k.manchas, 0, 0, BW, BH);
  g.restore();
  // los marcos
  g.strokeStyle = "#103d25"; g.lineWidth = 7; k.redondo(g, 14, 14, BW - 28, BH - 28, 10); g.stroke();
  g.strokeStyle = "rgba(235,255,225,0.7)"; g.lineWidth = 2.5; k.redondo(g, 26, 26, BW - 52, BH - 52, 8); g.stroke();
  // el medallón del centro: un sol con rayos
  const mx = BW / 2, my = BH / 2;
  const mg = g.createRadialGradient(mx - 20, my - 25, 8, mx, my, 92);
  mg.addColorStop(0, "#f2ffe8"); mg.addColorStop(0.6, "#8fcf8c"); mg.addColorStop(1, "#215f3d");
  g.fillStyle = mg; g.beginPath(); g.ellipse(mx, my, 80, 92, 0, 0, 6.28); g.fill();
  g.strokeStyle = "#103d25"; g.lineWidth = 5; g.stroke();
  g.strokeStyle = "rgba(16,61,37,0.75)"; g.lineWidth = 3;
  for (let i = 0; i < 24; i++) { const a = (i / 24) * 6.2832; g.beginPath(); g.moveTo(mx + Math.cos(a) * 26, my + Math.sin(a) * 30); g.lineTo(mx + Math.cos(a) * 60, my + Math.sin(a) * 70); g.stroke(); }
  g.fillStyle = "#1c5a37"; g.beginPath(); g.arc(mx, my, 24, 0, 6.28); g.fill();
  // las cifras de las esquinas
  g.fillStyle = "#0f3a23"; g.font = "900 78px Figtree"; g.textBaseline = "middle"; g.textAlign = "center";
  g.fillText("1", 74, 74); g.fillText("1", BW - 74, BH - 72);
  g.font = "800 30px Figtree"; g.fillText("UN BILLETE", BW - 128, 62); g.fillText("UN BILLETE", 128, BH - 60);
  // un brillo suave, como papel satinado
  const sg = g.createLinearGradient(0, 0, BW, BH * 0.6);
  sg.addColorStop(0, "rgba(255,255,255,0.25)"); sg.addColorStop(0.4, "rgba(255,255,255,0)");
  g.fillStyle = sg; k.redondo(g, 0, 0, BW, BH, 14); g.fill();
  return l;
}
export const billeteTex = () => (texBillete ??= hacerBillete());

// Un billete plano en pantalla, centrado en (x, y), de ancho w, girado ang; flip (radianes) lo voltea sobre su eje
// largo (aleteo): de canto se ve fino y más oscuro.
export function billete(g, x, y, w, ang = 0, flip = 0, al = 1) {
  if (al <= 0.003 || w < 2) return;
  const c = Math.cos(flip), h = (w * BH) / BW;
  g.save();
  g.globalAlpha *= al;
  g.translate(x, y); g.rotate(ang); g.scale(1, Math.max(0.04, Math.abs(c)));
  g.shadowColor = "rgba(0,0,0,0.35)"; g.shadowBlur = w * 0.06; g.shadowOffsetY = w * 0.03;
  g.drawImage(billeteTex(), -w / 2, -h / 2, w, h);
  g.shadowColor = "rgba(0,0,0,0)";
  // la luz según hacia dónde mira: de cara, brillo; de canto o del revés, sombra
  const osc = (1 - Math.abs(c)) * 0.55 + (c < 0 ? 0.18 : 0);
  if (osc > 0.02) { g.fillStyle = `rgba(4,20,12,${osc})`; g.fillRect(-w / 2, -h / 2, w, h); }
  const luz = Math.max(0, c) * Math.max(0, Math.sin(flip * 0.7 + ang * 2)) * 0.35;
  if (luz > 0.02) { g.globalCompositeOperation = "lighter"; g.fillStyle = `rgba(220,255,210,${luz})`; g.fillRect(-w / 2, -h / 2, w, h); }
  g.restore();
}

// Un billete en el mundo 3D: centro X, ancho s (unidades del mundo).
export function billete3D(g, cam, X, s, ang, flip, al = 1) {
  const p = k.proyecta(cam, X);
  if (!p || p.z < 0.3) return null;
  const w = (F * s) / p.z;
  if (w > 2600 || p.x < -w || p.x > 1080 + w || p.y < -w || p.y > 1920 + w) return null;
  return { z: p.z, dibuja: () => billete(g, p.x, p.y, w, ang, flip, al * Math.min(1, (p.z - 0.3) / 0.6)) };
}
