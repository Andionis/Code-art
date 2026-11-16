// «Él decía que la había robado para devolverla a Italia, la tierra de Leonardo da Vinci.»
// Un mapa antiguo: una línea roja sale de París y baja hasta Florencia. «Italia»: Italia se enciende con sus colores.
// «Leonardo da Vinci»: aparece Vinci, el pueblo de Leonardo, al lado de Florencia.
import * as k from "#kit";
import { v } from "#voz";
import { mona, ML_W, ML_H, veloArriba } from "../mundo.js";

export const desde = (vz) => vz.frase(18).inicio;
const { suave: su, tramo: tr, mez } = k;
const f = v.frase(18);
const T0 = f.inicio, Tdev = f.t("devolverla"), Tita = f.t("italia"), Tleo = f.t("leonardo"), Fin = f.fin;
export const llega = Tita - 0.05, vinci = Tleo;

// Italia, a mano: la bota (coordenadas del mapa, 1080 × 1920)
const ITALIA = [[430, 760], [520, 720], [610, 735], [680, 700], [740, 760], [700, 830], [720, 900], [790, 990], [860, 1080], [930, 1150], [1010, 1200], [1040, 1260], [990, 1290], [960, 1260], [930, 1300], [960, 1380], [920, 1450], [880, 1440], [890, 1360], [850, 1290], [790, 1230], [720, 1160], [650, 1080], [600, 990], [560, 920], [500, 870], [440, 840]];
const FRANCIA = [[60, 300], [260, 230], [430, 260], [520, 360], [500, 520], [430, 760], [440, 840], [330, 880], [200, 840], [120, 700], [60, 560]];
const PARIS = [300, 380], FLOR = [640, 950], VINCI = [600, 930];

export function dibuja(g, t) {
  // el papel
  const gr = g.createRadialGradient(540, 960, 200, 540, 960, 1300); gr.addColorStop(0, "#e9dbb4"); gr.addColorStop(1, "#9c8458");
  g.fillStyle = gr; g.fillRect(0, 0, 1080, 1920);
  g.save(); g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.2; g.drawImage(k.manchas, 0, 0, 1080, 1920); g.restore();
  const z = mez(1.0, 1.35, su(tr(t, T0, Fin))), cx = mez(540, 600, su(tr(t, T0, Fin))), cy = mez(860, 980, su(tr(t, T0, Fin)));
  g.save(); g.translate(540, 1180); g.scale(z, z); g.translate(-cx, -cy);
  // el mar
  g.fillStyle = "rgba(70,130,170,0.45)"; g.fillRect(-500, 0, 2200, 2400);
  // las tierras
  const tierra = (pts, col) => { g.beginPath(); pts.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.closePath(); g.fillStyle = col; g.fill(); g.strokeStyle = "rgba(70,50,25,0.8)"; g.lineWidth = 4; g.stroke(); };
  tierra([[-500, 0], [1600, 0], [1600, 700], [740, 760], [680, 700], [520, 720], [430, 760], [-500, 900]], "#d8c79a");
  tierra(FRANCIA, "#cdb98a");
  tierra(ITALIA, "#d2c090");
  // Italia se enciende con sus colores
  const it = su(tr(t, llega - 0.1, llega + 0.4));
  if (it > 0) {
    g.save(); g.beginPath(); ITALIA.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.closePath(); g.clip();
    g.globalAlpha = 0.75 * it;
    g.fillStyle = "#2a9a4a"; g.fillRect(380, 650, 230, 900); g.fillStyle = "#f4f0e0"; g.fillRect(610, 650, 230, 900); g.fillStyle = "#d8302a"; g.fillRect(840, 650, 300, 900);
    g.restore();
  }
  // los nombres
  g.fillStyle = "#3a2a14"; g.font = "800 46px Figtree"; g.textAlign = "center";
  g.fillText("FRANCIA", 250, 620);
  if (it > 0.05) { g.globalAlpha = it; g.fillText("ITALIA", 830, 1180); g.globalAlpha = 1; }
  // la ruta: sale de París y baja a Florencia
  const ru = su(tr(t, T0 + 0.2, llega));
  g.strokeStyle = "#c0201a"; g.lineWidth = 9; g.setLineDash([24, 16]); g.beginPath(); g.moveTo(...PARIS);
  const N = 40; for (let i = 1; i <= N * ru; i++) { const u = i / N, x = mez(PARIS[0], FLOR[0], u) + Math.sin(u * Math.PI) * 120, y = mez(PARIS[1], FLOR[1], u); g.lineTo(x, y); }
  g.stroke(); g.setLineDash([]);
  // el cuadro viaja por la ruta
  const u = ru, mx = mez(PARIS[0], FLOR[0], u) + Math.sin(u * Math.PI) * 120, my = mez(PARIS[1], FLOR[1], u);
  const w = 110, h = w * ML_H / ML_W;
  g.save(); g.shadowColor = "rgba(0,0,0,0.5)"; g.shadowBlur = 20; g.drawImage(mona(), mx - w / 2, my - h - 20, w, h); g.restore();
  // las ciudades
  const punto = (p, nombre, al, dx = 0) => { g.globalAlpha = al; g.fillStyle = "#c0201a"; g.beginPath(); g.arc(p[0], p[1], 14, 0, Math.PI * 2); g.fill(); g.fillStyle = "#2a1a0a"; g.font = "800 40px Figtree"; g.textAlign = dx < 0 ? "right" : "left"; g.fillText(nombre, p[0] + (dx || 26), p[1] + 14); g.globalAlpha = 1; };
  punto(PARIS, "París", 1);
  punto(FLOR, "Florencia", su(tr(t, llega - 0.3, llega)));
  const vi = su(tr(t, vinci - 0.1, vinci + 0.25));
  if (vi > 0) { punto(VINCI, "Vinci", vi, -26); k.brillo(g, VINCI[0], VINCI[1], 200, "255,200,120", 0.6 * vi); }
  g.restore();
  veloArriba(g, 0.35);
}
