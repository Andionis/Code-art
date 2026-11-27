// «...si fuera un estadio, su núcleo sería una hormiga en el centro.»
// Otro sitio: un estadio de fútbol de noche, visto desde arriba, con sus luces encendidas. Se entra con un corte en
// «estadio».
// - Fotograma 0: el estadio entero, las gradas llenas de color y los focos brillando.
// - «núcleo»: la cámara baja hacia el centro del campo.
// - «hormiga»: en el punto central hay una hormiga, que camina; un anillo rojo la señala. Reposa antes del corte.
import * as k from "#kit";
import { v } from "#voz";

export const desde = "estadio";

const { suave: su, tramo: tr, mez, azar } = k;
const f6 = v.frase(6);
const T0 = f6.t("estadio"), Tnuc = f6.t("nucleo"), Thor = f6.t("hormiga"), Tfin = f6.fin;
const C = [540, 1000];                                    // el centro del campo
const ZOOM = 9;

// el estadio entero, dibujado una vez (1080 × 1920, centrado en C)
// el campo, con sus franjas y sus líneas (a vector: se dibuja también en cada fotograma, nítido aunque se acerque)
function campo(g) {
  const [cx, cy] = C;
  // el campo, con sus franjas de césped
  const W = 470, H = 760, x0 = cx - W / 2, y0 = cy - H / 2;
    for (let i = 0; i < 12; i++) { g.fillStyle = i % 2 ? "#2f9a3e" : "#38ac48"; g.fillRect(x0, y0 + (i * H) / 12, W, H / 12 + 1); }
  g.save(); g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.3; g.drawImage(k.manchas, x0, y0, W, H); g.restore();
  // las líneas
  g.strokeStyle = "rgba(255,255,255,0.9)"; g.lineWidth = 4;
  g.strokeRect(x0 + 14, y0 + 14, W - 28, H - 28);
  g.beginPath(); g.moveTo(x0 + 14, cy); g.lineTo(x0 + W - 14, cy); g.stroke();
  g.beginPath(); g.arc(cx, cy, 70, 0, Math.PI * 1.98); g.stroke();
  g.strokeRect(cx - 110, y0 + 14, 220, 110); g.strokeRect(cx - 110, y0 + H - 124, 220, 110);
  g.fillStyle = "#fff"; g.beginPath(); g.arc(cx, cy, 1.6, 0, Math.PI * 2); g.fill();
}
let hecho = null;
function hacer() {
  const l = k.lienzo(1080, 1920), g = l.getContext("2d"), [cx, cy] = C;
  g.fillStyle = "#06070d"; g.fillRect(0, 0, 1080, 1920);
  // la ciudad oscura alrededor, con luces
  const a = azar(8);
  for (let i = 0; i < 900; i++) { g.fillStyle = `rgba(255,${180 + a() * 60},${100 + a() * 80},${0.15 + a() * 0.45})`; g.fillRect(a() * 1080, a() * 1920, 2 + a() * 3, 2 + a() * 3); }
  // las gradas: anillos de colores, del borde al campo
  const anillos = [[560, 860, "#2b2f3a"], [530, 820, "#c8323a"], [480, 750, "#e0e3ea"], [445, 700, "#2f62c8"], [400, 640, "#f2c230"], [360, 590, "#c8323a"]];
  for (const [rx, ry, col] of anillos) { g.fillStyle = col; g.beginPath(); g.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2); g.fill(); }
  g.fillStyle = "#1b0f0a"; g.beginPath(); g.ellipse(cx, cy, 330, 540, 0, 0, Math.PI * 2); g.fill();
  // las filas de asientos
  g.strokeStyle = "rgba(0,0,0,0.35)"; g.lineWidth = 2;
  for (let f = 0; f < 40; f++) { const u = f / 40; g.beginPath(); g.ellipse(cx, cy, mez(350, 555, u), mez(570, 855, u), 0, f * 0.77, f * 0.77 + Math.PI * 1.98); g.stroke(); }
  // la gente en las gradas: puntitos
  for (let i = 0; i < 9000; i++) {
    const an = a() * Math.PI * 2, d = 0.66 + a() * 0.32;
    g.fillStyle = ["#ffe0c8", "#222", "#ffffff", "#ff5a50", "#5aa0ff"][Math.floor(a() * 5)];
    g.globalAlpha = 0.35; g.fillRect(cx + Math.cos(an) * 540 * d, cy + Math.sin(an) * 830 * d, 3, 3);
  }
  g.globalAlpha = 1;
  g.save(); g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.35; g.drawImage(k.manchas, cx - 560, cy - 860, 1120, 1720); g.restore();
  campo(g);
  return k.fijar(l);
}
const FOCOS = [[150, 330], [930, 330], [150, 1670], [930, 1670]];
// la hormiga, vista desde arriba, mirando hacia ang, de largo L
function hormiga(g, x, y, L, ang, t) {
  g.save(); g.translate(x, y); g.rotate(ang);
  g.strokeStyle = "#140a06"; g.lineWidth = L * 0.035; g.lineCap = "round";
  for (const s of [-1, 1]) for (let i = 0; i < 3; i++) {
    const m = Math.sin(t * 18 + i * 2 + (s > 0 ? Math.PI : 0)) * 0.12;
    g.beginPath(); g.moveTo(L * (0.06 - i * 0.08), 0); g.lineTo(L * (0.1 - i * 0.16 + m), s * L * 0.28); g.lineTo(L * (0.04 - i * 0.22 + m), s * L * 0.42); g.stroke();
  }
  g.beginPath(); g.moveTo(L * 0.32, -L * 0.04); g.quadraticCurveTo(L * 0.46, -L * 0.1, L * 0.5, -L * 0.2); g.moveTo(L * 0.32, L * 0.04); g.quadraticCurveTo(L * 0.46, L * 0.1, L * 0.5, L * 0.2); g.stroke();
  const parte = (px, rx, ry) => { const gr = g.createRadialGradient(px - rx * 0.3, -ry * 0.4, 0, px, 0, rx); gr.addColorStop(0, "#7a3a20"); gr.addColorStop(0.5, "#3a1408"); gr.addColorStop(1, "#140604"); g.fillStyle = gr; g.beginPath(); g.ellipse(px, 0, rx, ry, 0, 0, Math.PI * 2); g.fill(); };
  parte(-L * 0.3, L * 0.22, L * 0.15); parte(0, L * 0.12, L * 0.07); parte(L * 0.24, L * 0.1, L * 0.09);
  g.restore();
}

export function dibuja(g, t) {
  hecho ??= hacer();
  const z = Math.exp(mez(0, Math.log(ZOOM), su(tr(t, Tnuc - 0.1, Thor + 0.15))));
  g.save();
  g.translate(C[0], C[1] - 40 * (z - 1) / (ZOOM - 1)); g.scale(z, z); g.translate(-C[0], -C[1]);
  g.drawImage(hecho, 0, 0);
  if (z > 1.5) campo(g);
  // los focos, que iluminan el campo
  for (const [fx, fy] of FOCOS) { k.brillo(g, fx, fy, 520, "blanca", 0.8); k.brillo(g, fx, fy, 160, "blanca", 1); }
  // la hormiga, caminando despacio por el punto central
  const L = 9;
  hormiga(g, C[0] - 6 + (t - T0) * 1.2, C[1] + 6, L, -0.3 + 0.15 * Math.sin(t * 2), t);
  g.restore();
  // el anillo rojo que la señala, en «hormiga»
  const an = tr(t, Thor - 0.05, Thor + 0.3);
  if (an > 0) {
    const hx = C[0] + (-6 + (t - T0) * 1.2) * z, hy = C[1] - 40 + 6 * z;
    g.strokeStyle = `rgba(255,70,60,${an})`; g.lineWidth = 8;
    g.beginPath(); g.arc(hx, hy, mez(260, 90, k.entra(an)), 0, Math.PI * 1.98); g.stroke();
  }
}
