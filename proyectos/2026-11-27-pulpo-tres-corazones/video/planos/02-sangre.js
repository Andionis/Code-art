// «Para empezar, su sangre no es roja: es azul, porque lleva cobre en vez de hierro.»
// Corte en «Para»: una gota de sangre enorme, en el agua oscura.
// - Primer fotograma: la gota roja cae desde arriba; en «sangre» se posa y tiembla.
// - «roja»: roja y brillante. «azul»: el azul nace en su centro y la llena entera, con su brillo.
// - «cobre»: una moneda de cobre llega girando y se queda a su lado, brillando.
// - «hierro»: un clavo de hierro oxidado cae al otro lado y se apaga (no es lo suyo). Reposa antes del corte.
import * as k from "#kit";
import { v } from "#voz";
import { mar, velo } from "../mundo.js";

export const desde = "para";

const { suave: su, tramo: tr, mez, entra, pulso } = k;
const f3 = v.frase(3);
const T0 = f3.inicio, Tsan = f3.t("sangre"), Troj = f3.t("roja"), Tazu = f3.t("azul"), Tcob = f3.t("cobre"), Thie = f3.t("hierro");
export const momentos = { posa: Tsan - 0.05, azul: Tazu, cobre: Tcob + 0.35, hierro: Thie + 0.25 };

const CX = 540, CY = 940, R = 290;
const azG = k.azar(12);
const MOTAS = Array.from({ length: 28 }, () => ({ a: azG() * 6.283, r: Math.sqrt(azG()) * 0.75, s: 10 + azG() * 16, f: azG() * 6.283 }));

function caminoGota(g, x, y, r, aplasta) {
  const ax = 1 + 0.08 * aplasta, ay = 1 - 0.08 * aplasta;
  g.beginPath();
  g.moveTo(x, y - r * 1.55 * ay);
  g.bezierCurveTo(x + r * 0.35 * ax, y - r * 1.05 * ay, x + r * 1.02 * ax, y - r * 0.55 * ay, x + r * ax, y + r * 0.1 * ay);
  g.bezierCurveTo(x + r * ax, y + r * 0.72 * ay, x + r * 0.55 * ax, y + r * 1.0 * ay, x, y + r * ay);
  g.bezierCurveTo(x - r * 0.55 * ax, y + r * 1.0 * ay, x - r * ax, y + r * 0.72 * ay, x - r * ax, y + r * 0.1 * ay);
  g.bezierCurveTo(x - r * 1.02 * ax, y - r * 0.55 * ay, x - r * 0.35 * ax, y - r * 1.05 * ay, x, y - r * 1.55 * ay);
  g.closePath();
}

function relleno(g, x, y, r, col) {
  const rg = g.createRadialGradient(x - r * 0.35, y - r * 0.3, r * 0.05, x, y, r * 1.35);
  rg.addColorStop(0, col[0]); rg.addColorStop(0.45, col[1]); rg.addColorStop(1, col[2]);
  g.fillStyle = rg; g.fill();
}

function moneda(g, x, y, r, giro) {
  const sx = Math.max(0.08, Math.abs(Math.cos(giro)));
  g.save(); g.translate(x, y); g.scale(sx, 1);
  k.brillo(g, 0, 0, r * 4, "255,160,90", 0.5);
  g.fillStyle = "#6b3412"; g.beginPath(); g.arc(6, 8, r, 0, 6.283); g.fill();
  const mg = g.createLinearGradient(-r, -r, r, r);
  mg.addColorStop(0, "#ffd2a4"); mg.addColorStop(0.35, "#e08a4c"); mg.addColorStop(0.7, "#b4572a"); mg.addColorStop(1, "#f0a46e");
  g.fillStyle = mg; g.beginPath(); g.arc(0, 0, r, 0, 6.283); g.fill();
  g.strokeStyle = "rgba(110,45,15,0.7)"; g.lineWidth = 7; g.beginPath(); g.arc(0, 0, r * 0.8, 0, 6.283); g.stroke();
  g.strokeStyle = "rgba(255,225,190,0.7)"; g.lineWidth = 4; g.beginPath(); g.arc(0, 0, r * 0.94, 3.6, 5.4); g.stroke();
  // el «Cu» grabado
  g.fillStyle = "rgba(120,50,18,0.75)"; g.font = `800 ${Math.round(r * 0.8)}px Figtree`; g.textAlign = "center"; g.textBaseline = "middle";
  g.fillText("Cu", 0, 4);
  g.restore();
}

function clavo(g, x, y, ang, apaga) {
  g.save(); g.globalAlpha *= 1 - 0.65 * apaga; g.translate(x, y + 40 * apaga); g.rotate(ang); g.scale(1.25, 1.25);
  const L = 380;
  const mg = g.createLinearGradient(0, -16, 0, 16);
  mg.addColorStop(0, "#cfd3d8"); mg.addColorStop(0.45, "#8d939b"); mg.addColorStop(1, "#3d4248");
  g.fillStyle = mg;
  g.beginPath(); g.moveTo(-L / 2, -14); g.lineTo(L / 2 - 50, -14); g.lineTo(L / 2, 0); g.lineTo(L / 2 - 50, 14); g.lineTo(-L / 2, 14); g.closePath(); g.fill();
  g.fillStyle = "#a4a9b0"; k.redondo(g, -L / 2 - 22, -44, 26, 88, 8); g.fill();
  // el óxido
  g.fillStyle = "rgba(160,70,25,0.75)";
  for (const [px, w] of [[-120, 60], [-20, 40], [70, 70], [-L / 2 - 14, 14]]) { g.beginPath(); g.ellipse(px, 0, w / 2, 13, 0, 0, 6.283); g.fill(); }
  g.restore();
  void apaga;
}

export function dibuja(g, t) {
  const c = { x: 0, y: -600 + 60 * (t - T0), s: 1 };
  mar(g, c, t, {});
  g.fillStyle = "rgba(2,12,30,0.45)"; g.fillRect(0, 0, 1080, 1920);
  // la gota: cae y se posa
  const cae = entra(tr(t, T0, Tsan - 0.05));
  const y = mez(330, CY, cae);
  const golpe = pulso(t, Tsan, 0.3) * 0.9 + 0.25 * Math.sin(t * 9) * Math.exp(-Math.max(0, t - Tsan) * 3) ;
  const zoom = 1 + 0.08 * su(tr(t, Troj, Tazu + 0.5));
  const r = R * zoom;
  const azul = su(tr(t, Tazu - 0.2, Tazu + 0.45));
  // el halo de color alrededor
  k.brillo(g, CX, y, 1300, k.mezRgb("255,40,50", "70,150,255", azul), 0.5);
  caminoGota(g, CX, y, r, golpe);
  relleno(g, CX, y, r, ["#ff8a8a", "#d5121e", "#4a0208"]);
  if (azul > 0) {
    g.save(); caminoGota(g, CX, y, r, golpe); g.clip();
    g.beginPath(); g.arc(CX, y, r * 2 * azul + 1, 0, 6.283);
    const rg = g.createRadialGradient(CX - r * 0.35, y - r * 0.3, r * 0.05, CX, y, r * 1.35);
    rg.addColorStop(0, "#b9e6ff"); rg.addColorStop(0.45, "#1f7fe6"); rg.addColorStop(1, "#04205a");
    g.fillStyle = rg; g.fill();
    g.restore();
  }
  // lo que flota dentro, la textura y los brillos
  g.save(); caminoGota(g, CX, y, r, golpe); g.clip();
  for (const m of MOTAS) {
    const mx = CX + Math.cos(m.a + t * 0.3) * m.r * r, my = y + Math.sin(m.a + t * 0.3) * m.r * r * 0.9 + 8 * Math.sin(t * 2 + m.f);
    g.fillStyle = `rgba(${k.mezRgb("120,0,10", "180,230,255", azul)},0.35)`;
    g.beginPath(); g.ellipse(mx, my, m.s, m.s * 0.6, m.a, 0, 6.283); g.fill();
  }
  g.globalCompositeOperation = "screen"; g.globalAlpha = 0.18; g.drawImage(k.causticas, CX - r * 1.5 + 30 * Math.sin(t), y - r * 1.6, r * 3, r * 3);
  g.restore();
  g.fillStyle = "rgba(255,255,255,0.6)"; g.beginPath(); g.ellipse(CX - r * 0.42, y - r * 0.38, r * 0.2, r * 0.11, -0.7, 0, 6.283); g.fill();
  g.fillStyle = "rgba(255,255,255,0.85)"; g.beginPath(); g.arc(CX - r * 0.2, y - r * 0.62, r * 0.05, 0, 6.283); g.fill();
  g.strokeStyle = "rgba(255,255,255,0.28)"; g.lineWidth = 6; g.beginPath(); g.arc(CX, y + r * 0.05, r * 0.9, 0.3, 1.5); g.stroke();
  // la moneda de cobre: entra girando desde la izquierda y se queda
  const llegaC = entra(tr(t, Tcob - 0.2, Tcob + 0.45));
  if (llegaC > 0) moneda(g, mez(-200, 250, llegaC), mez(1650, 1350, llegaC), 125, (1 - llegaC) * 9 + 0.0001);
  // el clavo de hierro: cae a la derecha y se apaga
  const llegaH = entra(tr(t, Thie - 0.2, Thie + 0.3));
  if (llegaH > 0) clavo(g, mez(1300, 790, llegaH), mez(1000, 1350, llegaH), mez(-1.2, -0.45, llegaH), su(tr(t, Thie + 0.25, Thie + 0.6)));
  velo(g, 0.45);
}
