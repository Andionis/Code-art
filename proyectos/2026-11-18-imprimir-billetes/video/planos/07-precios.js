// «En Zimbabue, los precios llegaron a duplicarse cada día.» / «Y en Alemania, un pan que costaba 160 marcos terminó
// costando 200 mil millones en menos de un año.»
// La panadería, sin el cartel: arriba, un calendario de pared; sobre los panes, el precio en grande.
// - Zimbabue: el calendario pasa hojas (DÍA 1, DÍA 2…) y con cada hoja el precio se duplica: 1, 2, 4… 128 billetes.
// - «Alemania»: el calendario vuelve a DIC 1922 y el precio a «160 marcos»; desde «terminó» las hojas pasan mes a mes
//   hasta NOV 1923 mientras el precio corre hasta 200.000.000.000 y detrás crece una montaña de billetes.
// La cámara se acerca un poco al principio y se aleja con la montaña; reposa antes del corte.
import * as k from "#kit";
import { v } from "#voz";
import { escena, billeteTumbado, mezCam, CAM0, FW } from "../panaderia.js";

export const desde = "en";
const { suave: su, tramo: tr, mez } = k;

const f9 = v.frase(9), f10 = v.frase(10);
const T9 = f9.inicio, Tpre = f9.t("precios"), Tdia = f9.t("dia");
const T10 = f10.inicio, T160 = f10.t("160"), Tterm = f10.t("termino"), Tmil = f10.t("millones"), Tmen = f10.t("menos"), Tano = f10.t("ano");
const Tfin = v.frase(11).inicio;

// Zimbabue: ocho hojas, de «precios» a «día»
const HZ = Array.from({ length: 8 }, (_, i) => mez(Tpre - 0.1, Tdia + 0.15, i / 7));
// Alemania: DIC 1922 y luego once hojas, mes a mes, de «terminó» a «millones»
const MESES = ["DIC 1922", "ENE 1923", "FEB 1923", "MAR 1923", "ABR 1923", "MAY 1923", "JUN 1923", "JUL 1923", "AGO 1923", "SEP 1923", "OCT 1923", "NOV 1923"];
const HA = Array.from({ length: 12 }, (_, i) => (i === 0 ? T10 - 0.05 : mez(Tterm, Tmil + 0.35, (i - 1) / 10)));

function hoja(t) {
  if (t < T10 - 0.05) { let n = 0; HZ.forEach((h) => { if (t >= h) n++; }); return { arriba: "ZIMBABUE", abajo: `DÍA ${n + 1}`, n, cambio: n ? HZ[n - 1] : -9 }; }
  let n = 0; HA.forEach((h) => { if (t >= h) n++; });
  return { arriba: "ALEMANIA", abajo: MESES[Math.max(0, n - 1)], n, cambio: HA[Math.max(0, n - 1)], aleman: true };
}
const fmt = (x) => k.fmt(Math.round(x));
function precio(t, h) {
  if (!h.aleman) { const p = Math.pow(2, h.n); return { txt: fmt(p), uni: p === 1 ? "billete" : "billetes", col: "150,255,150" }; }
  const u = tr(t, Tterm, Tmil + 0.35);
  const p = u <= 0 ? 160 : Math.exp(mez(Math.log(160), Math.log(2e11), Math.pow(u, 1.6)));
  return { txt: fmt(u >= 1 ? 2e11 : p > 1e6 ? Math.round(p / 1e6) * 1e6 : p), uni: "marcos", col: "255,210,110" };
}

// el calendario de pared
function calendario(g, t, h) {
  const x = 540, y = 690, w = 380, hh = 330;
  const sube = (u) => { const c = Math.cos(u * Math.PI); return c; };
  g.save(); g.translate(x, y);
  g.shadowColor = "rgba(0,0,0,0.5)"; g.shadowBlur = 30; g.shadowOffsetY = 16;
  g.fillStyle = "#f3eee2"; k.redondo(g, -w / 2, -hh / 2, w, hh, 18); g.fill();
  g.shadowColor = "rgba(0,0,0,0)";
  // la hoja de abajo (la que queda)
  const pagina = (al) => {
    g.fillStyle = "#e23a2c"; k.redondo(g, -w / 2, -hh / 2, w, 92, 18); g.fill(); g.fillRect(-w / 2, -hh / 2 + 60, w, 32);
    g.fillStyle = "#fff"; g.textAlign = "center"; g.textBaseline = "middle"; g.font = "900 46px Figtree"; g.fillText(h.arriba, 0, -hh / 2 + 48);
    g.fillStyle = "#2a1a10"; g.font = h.aleman ? "900 72px Figtree" : "900 96px Figtree"; g.fillText(h.abajo, 0, 50);
  };
  pagina(1);
  // la hoja que se va, levantándose
  const u = tr(t, h.cambio, h.cambio + 0.12);
  if (u > 0 && u < 1) {
    g.save(); g.translate(0, -hh / 2); g.scale(1, Math.max(0.02, Math.cos(u * Math.PI * 0.5)));
    g.fillStyle = `rgba(243,238,226,${1 - u * 0.3})`; k.redondo(g, -w / 2, 0, w, hh, 18); g.fill();
    g.fillStyle = `rgba(150,140,120,${0.5 * u})`; g.fillRect(-w / 2, 0, w, hh);
    g.restore();
  }
  // las anillas
  for (let i = -2; i <= 2; i++) { g.fillStyle = "#3a3a40"; k.redondo(g, i * 66 - 8, -hh / 2 - 22, 16, 44, 8); g.fill(); g.fillStyle = "rgba(255,255,255,0.4)"; g.fillRect(i * 66 - 5, -hh / 2 - 18, 4, 30); }
  g.restore();
  // el clavo y el cordel
  g.strokeStyle = "rgba(230,200,150,0.8)"; g.lineWidth = 4; g.beginPath(); g.moveTo(x - 120, y - hh / 2 - 10); g.lineTo(x, y - hh / 2 - 90); g.lineTo(x + 120, y - hh / 2 - 10); g.stroke();
}

// la montaña de billetes, detrás de los panes, que crece de «terminó» a «millones»
const azM = k.azar(1923);
const MONTE = [];
for (let i = 0; i < 230; i++) { const r = Math.pow(azM(), 0.7), a = azM() * Math.PI; MONTE.push({ x: 880 + Math.cos(a) * r * 270, y: 1500 - Math.sin(a) * r * 640, ang: (azM() - 0.5) * 0.9, w: FW * (0.8 + azM() * 0.3), o: 1 - r }); }
MONTE.sort((a, b) => b.o - a.o);
MONTE.sort((a, b) => a.y - b.y < 0 ? 1 : -1);
const crece = (t) => su(tr(t, Tterm - 0.1, Tmil + 0.5));
function monte(g, t) {
  const c = crece(t);
  if (c <= 0) return;
  const n = Math.floor(MONTE.length * c);
  // de abajo arriba: la base primero, la cima al final
  const orden = MONTE.slice().sort((a, b) => b.y - a.y).slice(0, n);
  orden.reverse();
  for (const b of orden.slice().sort((a, b2) => a.y - b2.y)) billeteTumbado(g, b.x, b.y, b.w, b.ang);
}

const camara = (t) => {
  let c = mezCam(CAM0, { x: 540, y: 1000, z: 1.12 }, su(tr(t, T9, Tpre + 0.4)));
  c = mezCam(c, { x: 560, y: 960, z: 0.97 }, su(tr(t, Tterm, Tmil + 0.6)));
  return c;
};

export function dibuja(g, t) {
  const h = hoja(t), p = precio(t, h);
  escena(g, t, camara(t), {
    fajo1: 20, cartelAl: 0,
    antesMostrador: (g) => calendario(g, t, h),
    extra: (g) => {
      monte(g, t);
      const golpe = k.pulso(t, h.cambio + 0.05, 0.08);
      g.save(); g.translate(540, 1000); g.scale(1 + 0.12 * golpe, 1 + 0.12 * golpe);
      k.pastilla(g, 0, 0, p.txt, p.uni, p.col, 1, h.aleman && p.txt.length > 9 ? 92 : 120);
      g.restore();
    },
  });
}
export const hojas = [...HZ, ...HA.slice(1)];
export const momentos = { aleman: T10, monte: Tterm, millones: Tmil, fin: Tfin };
