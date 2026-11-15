// «Por dentro está hecha de millones de cajitas, y en cada una guarda dos cosas por separado. Pero el cuchillo revienta
//  las cajitas, y las dos se mezclan. Esa mezcla fabrica un gas invisible, que...»
// Dentro de la cebolla, una sola cámara: un campo de cajitas de cristal (sus células), con luz por detrás.
// - «Por dentro»: entramos; las cajitas llenan la pantalla. «millones»: la cámara se aleja y son miles.
// - «cada una»: se acerca a una; «dos cosas»: su bolsa azul y sus bolitas amarillas se encienden; «separado»: brilla la
//   pared de la bolsa, entre las dos.
// - «Pero»: se aleja un poco; «cuchillo»: el filo enorme baja; «revienta»: las cajitas estallan a su paso; azul y
//   amarillo salen y se arremolinan juntos hasta «mezclan».
// - «Esa mezcla»: donde se tocan, saltan chispas y nace un hilo verde; «gas»: suben muchos; la cámara sube con ellos y
//   se para antes del corte al ojo.
import * as k from "#kit";
import { v } from "#voz";
import { vista, hilo, cuchillo, velo, GAS } from "../mundo.js";
import { sombraSubtitulos } from "#piezas/subtitulos.js";

export const desde = (v) => v.frase(3).inicio;
export const entrada = "corte";
const { suave: su, tramo: tr, mez, entra, azar } = k;
const f3 = v.frase(3), f4 = v.frase(4), f5 = v.frase(5);
const T0 = f3.inicio, Tmil = f3.t("millones"), Tcada = f3.t("cada"), Tdos = f3.t("dos"), Tcosas = f3.t("cosas"), Tsep = f3.t("separado");
const Tpero = f4.inicio, Tcuch = f4.t("cuchillo"), Trev = f4.t("revienta"), Tmez = f4.t("mezclan");
const Tesa = f5.inicio, Tgas = f5.t("gas"), Tsube = f5.t("sube");

const W = 280, H = 120, AZUL = "90,150,255", AMAR = "255,205,60";
const az = azar(808);
const CELDAS = [];
for (let r = -26; r <= 26; r++) for (let c = -8; c <= 8; c++) {
  const x = c * W + (r & 1) * W / 2, y = r * H;
  const beads = Array.from({ length: 12 }, (_, i) => { const a = (i + az() * 0.5) / 12 * 6.283; return { x: Math.cos(a) * W * 0.44, y: Math.sin(a) * H * 0.37, r: 6 + az() * 3 }; });
  const azules = Array.from({ length: 7 }, () => ({ x: (az() - 0.5) * W * 0.5, y: (az() - 0.5) * H * 0.4, r: 7 + az() * 4 }));
  CELDAS.push({ x, y, r, c, beads, azules, j: az(), t: az() });
}
// la cajita que se mira de cerca: la más cercana al centro, un poco a la derecha (la corta el cuchillo)
const C0 = CELDAS.reduce((m, q) => (Math.hypot(q.x - 70, q.y) < Math.hypot(m.x - 70, m.y) ? q : m));

// el cuchillo: un filo vertical en x = 0 que baja; revienta lo que está a menos de CORTE de él
const CORTE = W * 0.95, K0 = Tcuch - 0.05, K1 = Tcuch + 1.1, Y0 = -1100, Y1 = 1300;
const filo = (t) => mez(Y0, Y1, tr(t, K0, K1));
const revienta = (q) => K0 + ((q.y - Y0) / (Y1 - Y0)) * (K1 - K0) + 0.02;
for (const q of CELDAS) q.rota = Math.abs(q.x) < CORTE ? revienta(q) : Infinity;
export const estallidos = CELDAS.filter((q) => q.rota < 99 && Math.abs(q.y) < 700).map((q) => q.rota);

// las partículas de las cajitas rotas: salen hacia el corte y se arremolinan juntas
const PART = [];
for (const q of CELDAS) {
  if (q.rota === Infinity || Math.abs(q.y) > 1400) continue;
  const lado = Math.sign(q.x) || 1;
  for (const b of q.beads) PART.push({ q, x0: q.x + b.x, y0: q.y + b.y, r: b.r, col: AMAR, tx: (az() - 0.5) * 220, ty: q.y + (az() - 0.5) * 160, w: (az() < 0.5 ? -1 : 1) * (1.2 + az()), rr: 30 + az() * 60, f: az() * 6 });
  for (const b of q.azules) PART.push({ q, x0: q.x + b.x, y0: q.y + b.y, r: b.r, col: AZUL, tx: (az() - 0.5) * 220, ty: q.y + (az() - 0.5) * 160, w: (az() < 0.5 ? -1 : 1) * (1.2 + az()), rr: 30 + az() * 60, f: az() * 6 });
}
function posPart(p, t) {
  const u = t - p.q.rota;
  if (u <= 0) return [p.x0, p.y0];
  const e = entra(Math.min(1, u / 1.4)), giro = p.f + p.w * u * 1.6;
  return [mez(p.x0, p.tx, e) + Math.cos(giro) * p.rr * e, mez(p.y0, p.ty, e) + Math.sin(giro) * p.rr * 0.7 * e];
}
// las chispas: donde se tocan un azul y un amarillo nace un hilo de gas
const CHISPAS = Array.from({ length: 34 }, (_, i) => {
  const p = PART[Math.floor(az() * PART.length)];
  const t = mez(Tesa + 0.1, Tgas + 0.6, i / 34) + az() * 0.1;
  return { p, t, s: i };
}).filter((c) => Math.abs(c.p.ty) < 600);
export const chispas = CHISPAS.map((c) => c.t);

const cam = (t) => {
  const pasos = [
    [T0, 2.1], [T0 + 1.0, 1.55], [Tmil - 0.1, 1.55], [Tmil + 0.8, 0.45], [Tcada - 0.1, 0.42], [Tcada + 0.75, 3.0],
    [Tpero, 3.0], [Tcuch + 0.05, 1.25], [Tesa, 1.25], [Tsube - 0.2, 1.05],
  ];
  let z = pasos[0][1];
  for (let i = 1; i < pasos.length; i++) { const [a, za] = pasos[i - 1], [b, zb] = pasos[i]; if (t >= a) z = mez(za, zb, su(tr(t, a, b))); }
  // hacia la cajita de cerca, y luego al corte; al final sube con el gas
  const haciaC0 = su(tr(t, Tcada - 0.1, Tcada + 0.75)) * (1 - su(tr(t, Tpero, Tcuch + 0.05)));
  const x = mez(0, C0.x, haciaC0), y = mez(0, C0.y, haciaC0) - 260 * su(tr(t, Tgas, Tsube - 0.2));
  return { x, y, z };
};

function fondo(g) {
  const bg = g.createRadialGradient(540, 900, 50, 540, 960, 1300);
  bg.addColorStop(0, "#5a3a10"); bg.addColorStop(0.5, "#2a1806"); bg.addColorStop(1, "#0b0703");
  g.fillStyle = bg; g.fillRect(0, 0, 1080, 1920);
}

function celda(g, q, t, z, op) {
  const { x, y } = q, w = W - 10, h = H - 10;
  const u = t - q.rota;
  if (u > 0) {
    // rota: las paredes salen volando en trozos, lejos del corte
    if (u > 0.9) return;
    const al = 1 - u / 0.9, lado = Math.sign(x) || 1;
    g.save(); g.strokeStyle = `rgba(255,236,180,${0.8 * al})`; g.lineWidth = 5 / Math.min(z, 1.5);
    const tramos = [[-w / 2, -h / 2, w / 2, -h / 2], [w / 2, -h / 2, w / 2, h / 2], [w / 2, h / 2, -w / 2, h / 2], [-w / 2, h / 2, -w / 2, -h / 2]];
    tramos.forEach(([a, b, c, d], i) => {
      const mx = (a + c) / 2, my = (b + d) / 2, dx = (mx >= 0 ? 1 : -1) * lado, vy = (i - 1.5) * 60;
      g.save(); g.translate(x + mx + dx * 260 * u, y + my + vy * u + 300 * u * u); g.rotate((i % 2 ? 1 : -1) * u * 3);
      g.beginPath(); g.moveTo(a - mx, b - my); g.lineTo(c - mx, d - my); g.stroke(); g.restore();
    });
    g.restore();
    return;
  }
  // el temblor de las que quedan junto al corte
  const sac = Math.abs(x) < CORTE * 2.2 ? 4 * Math.sin(t * 60) * k.pulso(t, revienta(q), 0.08) : 0;
  g.save(); g.translate(x + sac, y);
  // la cajita: un cristal con luz dentro
  k.redondo(g, -w / 2, -h / 2, w, h, 18);
  const cg = g.createLinearGradient(0, -h / 2, 0, h / 2);
  cg.addColorStop(0, "rgba(255,240,190,0.20)"); cg.addColorStop(1, "rgba(255,200,120,0.08)");
  g.fillStyle = cg; g.fill();
  g.strokeStyle = "rgba(255,236,180,0.85)"; g.lineWidth = 4 / Math.min(z, 1.5) + 2; g.stroke();
  if (z > 0.6) { g.strokeStyle = "rgba(255,255,240,0.5)"; g.lineWidth = 1.5; k.redondo(g, -w / 2 + 5, -h / 2 + 5, w - 10, h - 10, 14); g.stroke(); }
  // la bolsa azul (lo de dentro)
  const enc = op.encBolsa || 0, mem = op.membrana || 0;
  g.beginPath(); g.ellipse(0, 0, W * 0.36, H * 0.3, 0, 0, 6.283);
  const sg = g.createRadialGradient(-W * 0.1, -H * 0.1, 4, 0, 0, W * 0.36);
  sg.addColorStop(0, `rgba(170,210,255,${0.55 + 0.4 * enc})`); sg.addColorStop(1, `rgba(${AZUL},${0.35 + 0.4 * enc})`);
  g.fillStyle = sg; g.fill();
  g.strokeStyle = `rgba(200,225,255,${0.5 + 0.5 * mem})`; g.lineWidth = 2 + 5 * mem; g.stroke();
  if (z > 0.38) {
    for (const b of q.azules) { g.fillStyle = `rgba(150,195,255,${0.8})`; g.beginPath(); g.arc(b.x, b.y, b.r, 0, 6.283); g.fill(); g.fillStyle = "rgba(255,255,255,0.7)"; g.beginPath(); g.arc(b.x - b.r * 0.3, b.y - b.r * 0.3, b.r * 0.3, 0, 6.283); g.fill(); }
    for (const b of q.beads) { g.fillStyle = `rgba(${AMAR},${0.9})`; g.beginPath(); g.arc(b.x, b.y, b.r, 0, 6.283); g.fill(); g.fillStyle = "rgba(255,255,230,0.8)"; g.beginPath(); g.arc(b.x - b.r * 0.3, b.y - b.r * 0.3, b.r * 0.35, 0, 6.283); g.fill(); }
  }
  g.restore();
  if (op.brilloA) { for (const b of q.azules) k.brillo(g, x + b.x, y + b.y, 60, AZUL, op.brilloA); }
  if (op.brilloB) { for (const b of q.beads) k.brillo(g, x + b.x, y + b.y, 50, AMAR, op.brilloB); }
  if (mem > 0) { g.save(); g.globalCompositeOperation = "lighter"; g.strokeStyle = `rgba(220,240,255,${0.6 * mem})`; g.lineWidth = 10; g.beginPath(); g.ellipse(x, y, W * 0.36, H * 0.3, 0, 0, 6.283); g.stroke(); g.restore(); }
}

export function dibuja(g, t) {
  fondo(g);
  const c = cam(t);
  g.save(); vista(g, c.x, c.y, c.z);
  const mx = 540 / c.z + W, my = 960 / c.z + H;
  const encA = k.pulso(t, Tdos + 0.15, 0.35) * 0 + su(tr(t, Tdos - 0.1, Tdos + 0.2)) * (1 - su(tr(t, Tsep + 0.6, Tpero)));
  const encB = su(tr(t, Tcosas - 0.05, Tcosas + 0.25)) * (1 - su(tr(t, Tsep + 0.6, Tpero)));
  const mem = su(tr(t, Tsep - 0.1, Tsep + 0.25)) * (1 - su(tr(t, Tsep + 0.7, Tpero)));
  for (const q of CELDAS) {
    if (Math.abs(q.x - c.x) > mx || Math.abs(q.y - c.y) > my) continue;
    const yo = q === C0;
    celda(g, q, t, c.z, yo ? { encBolsa: encA, membrana: mem, brilloA: 0.5 * encA, brilloB: 0.5 * encB } : {});
  }
  // las partículas que salen de las cajitas rotas
  if (t > K0) {
    for (const p of PART) {
      if (t < p.q.rota) continue;
      const [x, y] = posPart(p, t);
      if (Math.abs(x - c.x) > mx || Math.abs(y - c.y) > my) continue;
      g.fillStyle = `rgba(${p.col},0.95)`; g.beginPath(); g.arc(x, y, p.r * 1.2, 0, 6.283); g.fill();
      g.fillStyle = "rgba(255,255,255,0.6)"; g.beginPath(); g.arc(x - p.r * 0.35, y - p.r * 0.35, p.r * 0.4, 0, 6.283); g.fill();
    }
  }
  // las chispas y sus hilos de gas
  for (const ch of CHISPAS) {
    if (t < ch.t - 0.05) continue;
    const [x, y] = posPart(ch.p, ch.t);
    k.brillo(g, x, y, 160, GAS, 0.9 * k.pulso(t, ch.t, 0.08));
    hilo(g, t, x, y, ch.t, 2.6, 50, (ch.s % 2 ? 1 : -1) * 60, 900, 2.2, ch.s);
  }
  // el cuchillo: un filo enorme que baja por x = 0
  if (t > K0 - 0.1 && t < K1 + 0.1) {
    const e = filo(t);
    g.save(); g.translate(0, e - 990 * 2.2); g.scale(0.6, 1); cuchillo(g, 0, 0, 2.2, -Math.PI / 2); g.restore();
    k.brillo(g, 0, e, 260, "blanca", 0.8);
  }
  g.restore();
  velo(g, 0.45);
  sombraSubtitulos(g, t);
}
