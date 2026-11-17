// «...una cucharadita pesaría más que todas las personas del mundo juntas.»
// - Corte en «cucharadita»: una balanza enorme en un estudio oscuro con un foco; en un plato, gente; la cucharadita
//   con su trocito de estrella azul cae desde arriba.
// - «pesaría»: cae en el plato vacío y lo hunde de golpe; la gente del otro plato sale volando hacia arriba y vuelve
//   a caer. En «más», su cifra: 1.000 millones de toneladas.
// - «todas las personas del mundo»: llueve más gente al otro plato, que ni se mueve. Reposa antes del corte.
import * as k from "#kit";
import { v } from "#voz";

export const desde = "cucharadita";
export const entrada = "corte";

const { suave, tramo, entra, sale, pulso } = k;
const f6 = v.frase(6);
const Tcuch = f6.t("cucharadita"), Tpes = f6.t("pesaria"), Tmas = f6.t("mas"), Tpers = f6.t("personas"), Tfin = f6.fin;

const PX = 540, PY = 820, L = 262, CUELGA = 230, RP = 122, ESC = 1.42;
// el brazo: quieto (meciéndose apenas) hasta el golpe; luego baja a la izquierda con un rebote que se apaga
const angulo = (t) => {
  if (t < Tpes) return 0.015 * Math.sin((t - Tcuch) * 3);
  const u = t - Tpes, extra = 0.025 * pulso(t, Tpers + 0.45, 0.2);
  return 0.36 * (1 - Math.exp(-5 * u) * Math.cos(13 * u)) - extra;
};
const extremos = (a) => [[PX - L * Math.cos(a), PY + L * Math.sin(a)], [PX + L * Math.cos(a), PY - L * Math.sin(a)]];

// ---------------------------------------------------------------- la gente
const az = k.azar(61);
const ROPA = ["#e94b3c", "#3b82f6", "#22c55e", "#f59e0b", "#a855f7", "#ec4899", "#14b8a6", "#f97316", "#eab308", "#6366f1"];
const PIEL = ["#f1c7a3", "#d9a066", "#a86b3c", "#7a4a26", "#ffdcbf"];
const gente = [];
// los que ya están (de pie, en dos filas) y los que llueven en «personas»
for (let i = 0; i < 13; i++) gente.push({ dx: -100 + (i % 7) * 33 + (i >= 7 ? 16 : 0), dy: i >= 7 ? -22 : 0, h: 66 + az() * 14, ropa: ROPA[i % 10], piel: PIEL[Math.floor(az() * 5)], cae: 0, salto: 0.6 + az() * 0.8, gira: (az() - 0.5) * 1.4 });
for (let i = 0; i < 24; i++) gente.push({ dx: -98 + az() * 196, dy: -40 - Math.pow(az(), 0.7) * 110, h: 60 + az() * 14, ropa: ROPA[Math.floor(az() * 10)], piel: PIEL[Math.floor(az() * 5)], cae: Tpers - 0.15 + i * 0.045 + az() * 0.1, salto: 0, gira: (az() - 0.5) * 0.5 });
gente.sort((a, b) => a.dy - b.dy);

function persona(g, x, y, h, ropa, piel, gira) {
  g.save(); g.translate(x, y); g.rotate(gira);
  const s = h / 70;
  // piernas
  g.fillStyle = "#1f2433"; k.redondo(g, -9 * s, -24 * s, 8 * s, 24 * s, 3 * s); g.fill(); k.redondo(g, 1 * s, -24 * s, 8 * s, 24 * s, 3 * s); g.fill();
  // cuerpo
  const gr = g.createLinearGradient(-14 * s, 0, 14 * s, 0);
  gr.addColorStop(0, k.mezColor(ropa, "#ffffff", 0.25)); gr.addColorStop(0.6, ropa); gr.addColorStop(1, k.mezColor(ropa, "#000000", 0.4));
  g.fillStyle = gr; k.redondo(g, -14 * s, -52 * s, 28 * s, 32 * s, 10 * s); g.fill();
  // cabeza
  const cg = g.createRadialGradient(-3 * s, -64 * s, 1, 0, -61 * s, 10 * s);
  cg.addColorStop(0, k.mezColor(piel, "#ffffff", 0.3)); cg.addColorStop(1, k.mezColor(piel, "#000000", 0.3));
  g.fillStyle = cg; g.beginPath(); g.arc(0, -62 * s, 10 * s, 0, Math.PI * 2); g.fill();
  g.restore();
}

// ---------------------------------------------------------------- la balanza
function plato(g, x, y) {
  // las cadenas
  g.strokeStyle = "rgba(220,226,235,0.85)"; g.lineWidth = 3;
  for (const dx of [-RP * 0.92, 0, RP * 0.92]) { g.beginPath(); g.moveTo(x, y - CUELGA); g.lineTo(x + dx, y - 4); g.stroke(); }
  // el plato (un cuenco de latón visto de lado)
  g.beginPath(); g.ellipse(x, y, RP, 26, 0, 0, Math.PI); g.lineTo(x - RP, y); g.closePath();
  const gr = g.createLinearGradient(x - RP, 0, x + RP, 0);
  gr.addColorStop(0, "#6b4a17"); gr.addColorStop(0.3, "#e9c46a"); gr.addColorStop(0.55, "#fff1c1"); gr.addColorStop(0.8, "#b8862e"); gr.addColorStop(1, "#5a3d10");
  g.fillStyle = gr; g.fill();
  g.beginPath(); g.ellipse(x, y, RP, 14, 0, 0, Math.PI * 2); g.fillStyle = "#c9a14a"; g.fill();
  g.strokeStyle = "#fff0b8"; g.lineWidth = 2; g.stroke();
}
function cuchara(g, x, y, ang, t, luz) {
  g.save(); g.translate(x, y); g.rotate(ang);
  // el mango
  g.beginPath(); g.moveTo(-8, 0); g.quadraticCurveTo(40, -6, 150, -10); g.lineTo(150, 0); g.quadraticCurveTo(40, 8, -8, 10); g.closePath();
  k.metal(g, -8, 150);
  // el cuenco
  g.beginPath(); g.ellipse(-45, 2, 48, 30, 0, 0, Math.PI * 2);
  k.metal(g, -93, 3);
  // el trocito de estrella de neutrones, que brilla
  k.brillo(g, -45, -4, 240, "azul", 0.8 * luz);
  k.brillo(g, -45, -4, 90, "255,255,255", 0.9 * luz);
  const bg = g.createRadialGradient(-50, -10, 2, -45, -4, 30);
  bg.addColorStop(0, "#ffffff"); bg.addColorStop(0.6, "#bcd6ff"); bg.addColorStop(1, "#5d86e0");
  g.fillStyle = bg; g.beginPath(); g.ellipse(-45, -2, 32, 20, 0, 0, Math.PI * 2); g.fill();
  g.restore();
}

export function dibuja(g, t) {
  // el estudio: oscuro, con un foco que baja sobre la balanza
  const fg = g.createRadialGradient(540, 760, 50, 540, 960, 1300);
  fg.addColorStop(0, "#2a2f5c"); fg.addColorStop(0.5, "#141733"); fg.addColorStop(1, "#06070f");
  g.fillStyle = fg; g.fillRect(0, 0, 1080, 1920);
  g.save(); g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.25; g.drawImage(k.manchas, 0, 0, 1080, 1920); g.restore();
  g.save(); g.globalCompositeOperation = "lighter";
  const cono = g.createLinearGradient(0, 0, 0, 1500);
  cono.addColorStop(0, "rgba(255,240,200,0.18)"); cono.addColorStop(1, "rgba(255,240,200,0.02)");
  g.fillStyle = cono; g.beginPath(); g.moveTo(420, 0); g.lineTo(660, 0); g.lineTo(1080, 1500); g.lineTo(0, 1500); g.closePath(); g.fill();
  g.restore();
  // el suelo con su luz
  const sg = g.createLinearGradient(0, 1440, 0, 1920);
  sg.addColorStop(0, "#1b1e33"); sg.addColorStop(1, "#05060c");
  g.fillStyle = sg; g.fillRect(0, 1440, 1080, 480);
  g.save(); g.globalCompositeOperation = "lighter";
  const lz = g.createRadialGradient(540, 1460, 10, 540, 1460, 520);
  lz.addColorStop(0, "rgba(255,230,180,0.3)"); lz.addColorStop(1, "rgba(255,230,180,0)");
  g.fillStyle = lz; g.beginPath(); g.ellipse(540, 1460, 520, 90, 0, 0, Math.PI * 2); g.fill();
  g.restore();

  g.save(); g.translate(540, 1000); g.scale(ESC, ESC); g.translate(-540, -1000);
  // la columna y su base
  g.beginPath(); g.moveTo(PX - 22, PY); g.lineTo(PX + 22, PY); g.lineTo(PX + 30, 1420); g.lineTo(PX - 30, 1420); g.closePath(); k.metal(g, PX - 30, PX + 30, ["#5a3d10", "#e9c46a", "#a87a24", "#fff1c1", "#4a3210"]);
  g.beginPath(); g.ellipse(PX, 1440, 170, 34, 0, 0, Math.PI * 2); k.metal(g, PX - 170, PX + 170, ["#4a3210", "#c99a3c", "#8a6420", "#f5dc96", "#3a2608"]);

  const a = angulo(t), [Lx, Rx] = extremos(a);
  const pl = [Lx[0], Lx[1] + CUELGA], pr = [Rx[0], Rx[1] + CUELGA];
  // los platos con lo que llevan
  plato(g, pr[0], pr[1]);
  for (const p of gente) {
    if (p.cae && t < p.cae) continue;
    let y = pr[1] + p.dy * 0.5 - 4, gira = p.gira * 0.15;
    if (p.cae) { const u = entra(tramo(t, p.cae, p.cae + 0.35)); y = k.mez(-300, y, u); gira = p.gira * (1 - u) + p.gira * 0.15; }
    // al golpe, la gente que ya estaba sale volando hacia arriba y vuelve a caer
    const us = t - Tpes;
    if (!p.cae && us > 0 && us < p.salto) { const q = us / p.salto; y -= 360 * p.salto * q * (1 - q) * 2; gira = p.gira * Math.sin(Math.PI * q); }
    persona(g, pr[0] + p.dx, y, p.h, p.ropa, p.piel, gira);
  }
  plato(g, pl[0], pl[1]);
  // la cucharadita: cae desde arriba y aterriza en el plato en «pesaría»
  const uc = sale(tramo(t, Tcuch - 0.05, Tpes));
  const cx = pl[0] + 20, cy = k.mez(pl[1] - 420, pl[1] - 18, uc);
  cuchara(g, cx, cy, -0.12 + 0.12 * uc, t, 1);
  if (t > Tpes) k.fogonazo(g, pl[0], pl[1] - 10, (t - Tpes) * 1.4, 600, "190,215,255");
  // el brazo (encima de las cadenas)
  g.save(); g.translate(PX, PY); g.rotate(-a);
  k.redondo(g, -L - 14, -12, 2 * L + 28, 24, 12); k.metal(g, -L - 14, L + 14, ["#5a3d10", "#e9c46a", "#a87a24", "#fff1c1", "#4a3210"]);
  g.restore();
  for (const E of [Lx, Rx]) { g.beginPath(); g.arc(E[0], E[1], 16, 0, Math.PI * 2); g.fillStyle = "#d8b25a"; g.fill(); }
  g.beginPath(); g.arc(PX, PY, 30, 0, Math.PI * 2); k.metal(g, PX - 30, PX + 30, ["#4a3210", "#e9c46a", "#8a6420", "#fff1c1", "#3a2608"]);
  g.restore();
  // la cifra
  const ap = tramo(t, Tmas + 0.05, Tmas + 0.3);
  k.pastilla(g, 540, 1530, "1.000 millones de toneladas", "", "190,215,255", ap, 58);
}

export const golpe = Tpes;
export const lluvia = Tpers;
