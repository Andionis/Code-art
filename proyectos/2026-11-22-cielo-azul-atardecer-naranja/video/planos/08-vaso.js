// «Lo puedes ver en tu casa con un vaso de agua, unas gotas de leche y la linterna del celular.»
// «De lado, el agua se ve azulada. Mirando la luz de frente, naranja: un atardecer en un vaso.»
// Corte en «Lo»: una mesa de madera de noche, un vaso de agua grande que tiembla un poco. «leche»: caen gotas de leche
// que se abren en nubecitas blancas. «linterna»: un celular a la izquierda enciende su luz y el haz cruza el vaso.
// «azulada»: el agua brilla azul donde pasa el haz. «Mirando la luz de frente»: la cámara gira hasta quedar frente a la
// linterna, detrás del vaso: «naranja», la luz se ve naranja, como un Sol; «atardecer en un vaso».
import * as k from "#kit";
import { v } from "#voz";

const f12 = v.frase(12), f13 = v.frase(13);
export const desde = () => f12.inicio - 0.03;
const T0 = f12.inicio, Tvaso = f12.t("vaso"), Tlec = f12.t("leche"), Tlin = f12.t("linterna"), Tcel = f12.t("celular");
const Tlado = f13.t("lado"), Tazu = f13.t("azulada"), Tmir = f13.t("mirando"), Tfre = f13.t("frente"), Tnar = f13.t("naranja"), Tate = f13.t("atardecer"), Tfin = f13.fin;
export const momentos = { gotas: [], luz: Tlin, gira: Tmir, naranja: Tnar };

const { suave: su, tramo: tr, mez, entra, azar } = k;
const GX = 540, GT = 740, GB = 1460, GW = 260; // el vaso: centro, arriba, abajo, medio ancho
const AGUA = 900; // nivel del agua
const GOTAS = [0, 0.28, 0.5].map((d, i) => ({ t: Tlec - 0.45 + d, x: GX + [-40, 30, -5][i] }));
for (const g of GOTAS) momentos.gotas.push(g.t + 0.32);

// la madera de la mesa, una vez
const MESA = (() => {
  const c = k.lienzo(1080, 700), x = c.getContext("2d"), az = azar(77);
  const gr = x.createLinearGradient(0, 0, 0, 700); gr.addColorStop(0, "#3a2418"); gr.addColorStop(1, "#1a0e08");
  x.fillStyle = gr; x.fillRect(0, 0, 1080, 700);
  for (let i = 0; i < 60; i++) { x.strokeStyle = `rgba(${az() < 0.5 ? "90,55,30" : "20,10,5"},${0.25 + az() * 0.3})`; x.lineWidth = 1 + az() * 3; x.beginPath(); const y = az() * 700; x.moveTo(0, y); x.bezierCurveTo(300, y + (az() - 0.5) * 40, 700, y + (az() - 0.5) * 40, 1080, y + (az() - 0.5) * 30); x.stroke(); }
  return c;
})();

function celular(g, x, y, s, luz, de) {
  // de: 0 = de lado (la luz apunta a la derecha), 1 = de frente (la luz apunta a la cámara)
  g.save(); g.translate(x, y); g.scale(s, s);
  const w = mez(64, 200, de), h = 400;
  g.save(); g.globalAlpha *= 1 - su(tr(de, 0.5, 0.8));
  k.redondo(g, -w / 2, -h / 2, w, h, mez(18, 34, de));
  const cg = g.createLinearGradient(-w / 2, 0, w / 2, 0); cg.addColorStop(0, "#9aa3b2"); cg.addColorStop(0.3, "#e6eaf0"); cg.addColorStop(0.7, "#7b8494"); cg.addColorStop(1, "#4a5160");
  g.fillStyle = cg; g.fill(); g.strokeStyle = "#2a2f38"; g.lineWidth = 3; g.stroke();
  // la cámara y la linterna (en la cara de atrás, que mira al vaso)
  if (de > 0.3) { g.fillStyle = "#0b0c10"; k.redondo(g, -60, -170, 120, 120, 30); g.fill(); }
  g.restore();
  const lx = mez(w / 2, 0, de), ly = -110;
  if (luz > 0) { g.save(); g.globalCompositeOperation = "lighter"; k.brillo(g, lx, ly, 160 + 300 * de, "255,255,245", luz); g.restore(); g.fillStyle = `rgba(255,255,250,${luz})`; g.beginPath(); g.arc(lx, ly, 16, 0, Math.PI * 2); g.fill(); }
  g.restore();
}

export function dibuja(g, t) {
  const gira = su(tr(t, Tmir - 0.25, Tfre + 0.45)); // la cámara gira alrededor del vaso
  const luz = su(tr(t, Tlin - 0.1, Tlin + 0.25));
  const leche = su(tr(t, Tlec, Tlin + 0.6));
  const acerca = mez(1, 1.12, su(tr(t, T0 - 0.3, Tlin + 1))) * mez(1, 1.15, su(tr(t, Tnar - 0.4, Tfin + 0.3)));
  g.save(); g.translate(540, 1150); g.scale(acerca, acerca); g.translate(-540, -1150);
  // la habitación
  const bg = g.createRadialGradient(540, 900, 100, 540, 900, 1300);
  bg.addColorStop(0, "#1b2236"); bg.addColorStop(1, "#05060b"); g.fillStyle = bg; g.fillRect(0, 0, 1080, 1920);
  g.drawImage(MESA, 0, 1300, 1080, 620);
  // el celular: a la izquierda de lado → detrás del vaso, de frente
  const cx = mez(150, GX, gira), cy = mez(1220, 1120, gira), cs = mez(0.9, 0.75, gira);
  const detras = gira > 0.5;
  const dibujaCel = () => celular(g, cx, cy, cs, luz, gira);
  if (detras) dibujaCel();
  // el haz de la linterna, de lado
  const lado = 1 - gira;
  if (luz > 0 && lado > 0) {
    const y = cy - 110 * cs;
    g.save(); g.globalCompositeOperation = "lighter"; g.globalAlpha = luz * lado;
    const gr = g.createLinearGradient(cx, 0, 1080, 0); gr.addColorStop(0, "rgba(255,255,240,0.4)"); gr.addColorStop(1, "rgba(255,255,240,0.03)");
    g.fillStyle = gr; g.beginPath(); g.moveTo(cx + 20, y - 10); g.lineTo(1080, y - 120); g.lineTo(1080, y + 120); g.lineTo(cx + 20, y + 10); g.fill();
    g.restore();
  }
  // el vaso con el agua
  const sombra = g.createRadialGradient(GX, GB + 10, 20, GX, GB + 10, GW * 1.3); sombra.addColorStop(0, "rgba(0,0,0,0.6)"); sombra.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = sombra; g.beginPath(); g.ellipse(GX, GB + 10, GW * 1.3, 40, 0, 0, Math.PI * 2); g.fill();
  const cuerpo = (path) => { g.beginPath(); g.moveTo(GX - GW, GT); g.lineTo(GX - GW * 0.86, GB - 30); g.quadraticCurveTo(GX - GW * 0.84, GB, GX - GW * 0.7, GB); g.lineTo(GX + GW * 0.7, GB); g.quadraticCurveTo(GX + GW * 0.84, GB, GX + GW * 0.86, GB - 30); g.lineTo(GX + GW, GT); if (path) g.closePath(); };
  // el agua: algo lechosa; azulada de lado donde pasa el haz, naranja de frente
  const ola = 9 * Math.sin(t * 3.4);
  g.save(); cuerpo(true); g.clip();
  const ag = g.createLinearGradient(0, AGUA, 0, GB);
  ag.addColorStop(0, `rgba(${k.mezRgb("90,130,190", "235,235,240", leche * 0.6)},0.55)`); ag.addColorStop(1, `rgba(${k.mezRgb("40,70,130", "200,205,220", leche * 0.6)},0.7)`);
  g.fillStyle = ag; g.beginPath(); g.moveTo(GX - GW - 10, AGUA + ola); g.quadraticCurveTo(GX, AGUA - ola, GX + GW + 10, AGUA + ola); g.lineTo(GX + GW + 10, GB + 10); g.lineTo(GX - GW - 10, GB + 10); g.fill();
  // las nubecitas de leche
  for (const d of GOTAS) {
    const w = t - d.t - 0.32; if (w < 0) continue;
    const r = 30 + 160 * entra(Math.min(1, w / 1.4));
    const gr = g.createRadialGradient(d.x, AGUA + 60 + 120 * Math.min(1, w / 1.4), 5, d.x, AGUA + 60 + 120 * Math.min(1, w / 1.4), r);
    gr.addColorStop(0, `rgba(255,255,255,${0.6 * (1 - 0.6 * Math.min(1, w / 2.5))})`); gr.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = gr; g.fillRect(d.x - r, AGUA, 2 * r, GB - AGUA);
  }
  // el azul, de lado: el haz dentro del agua se ve azul
  const azul = luz * lado * leche;
  if (azul > 0) {
    const y = cy - 110 * cs;
    g.save(); g.beginPath(); g.rect(0, AGUA + 8, 1080, GB - AGUA); g.clip(); g.globalCompositeOperation = "lighter";
    const brilla = 0.6 + 0.4 * su(tr(t, Tlado, Tazu + 0.3));
    const gr = g.createLinearGradient(GX - GW, 0, GX + GW, 0); gr.addColorStop(0, `rgba(40,110,255,${0.9 * azul * brilla})`); gr.addColorStop(1, `rgba(30,80,255,${0.6 * azul * brilla})`);
    g.fillStyle = gr; g.beginPath(); g.ellipse(GX, y, GW + 40, 150, 0, 0, Math.PI * 2); g.fill();
    k.brillo(g, GX - 60, y, 800, "40,110,255", 0.8 * azul * brilla);
    g.restore();
  }
  // de frente: la linterna vista a través del agua, naranja como un Sol
  const nar = su(tr(t, Tnar - 0.6, Tnar + 0.2)) * gira;
  if (gira > 0.4) {
    const y = cy - 110 * cs;
    g.save(); g.globalCompositeOperation = "lighter";
    const col = k.mezRgb("255,250,235", "255,110,15", nar);
    k.brillo(g, GX, y, 900, col, 0.8 * luz * su(tr(gira, 0.4, 1)));
    g.fillStyle = `rgba(${col},${luz * su(tr(gira, 0.4, 1))})`; g.beginPath(); g.arc(GX, y, 85, 0, Math.PI * 2); g.fill();
    g.fillStyle = `rgba(255,230,170,${0.7 * luz * su(tr(gira, 0.4, 1))})`; g.beginPath(); g.arc(GX, y, 45, 0, Math.PI * 2); g.fill();
    g.restore();
    // el resto del agua, teñida de atardecer
    g.fillStyle = `rgba(255,105,25,${0.42 * nar})`; g.fillRect(GX - GW - 10, AGUA, 2 * GW + 20, GB - AGUA);
  }
  g.restore();
  // las gotas que caen
  for (const d of GOTAS) {
    const w = t - d.t; if (w < 0 || w > 0.32) continue;
    const y = mez(560, AGUA, (w / 0.32) ** 2);
    g.fillStyle = "#fbfbf7"; g.beginPath(); g.arc(d.x, y, 16, 0, Math.PI * 2); g.fill();
    g.beginPath(); g.moveTo(d.x - 15, y - 4); g.quadraticCurveTo(d.x, y - 50, d.x + 15, y - 4); g.fill();
  }
  // el cristal
  cuerpo(false); k.vidrio(g, GX - GW, GX + GW, 0.55);
  g.save(); g.strokeStyle = "rgba(255,255,255,0.5)"; g.lineWidth = 4; g.beginPath(); g.ellipse(GX, GT, GW, 34, 0, 0, Math.PI * 2); g.stroke(); g.restore();
  k.reflejo(g, GX + GW * 0.55, GT + 60, 18, 520, 0.3);
  k.reflejo(g, GX - GW * 0.78, GT + 80, 10, 400, 0.18);
  if (!detras) dibujaCel();
  // «atardecer»: un resplandor naranja alrededor
  const at = su(tr(t, Tate - 0.2, Tate + 0.5));
  if (at > 0) { g.save(); g.globalCompositeOperation = "lighter"; k.brillo(g, GX, 1000, 1700, "255,120,40", 0.35 * at); g.restore(); }
  g.restore();
}
