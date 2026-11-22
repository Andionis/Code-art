// «...cada litro de mar tiene casi dos cucharadas de sal.»
// Corte en «cada» a la cocina de antes: una jarra de vidrio con un litro de agua de mar, en la mesa.
// - Fotograma 0: la jarra en el centro, con el agua aún moviéndose. «litro»: la marca «1 litro».
// - «dos»: una cuchara llena de sal entra y la vuelca dentro; «cucharadas»: entra la segunda y la vuelca.
//   La sal cae en el agua, brilla y se disuelve; la cuchara se va. Reposa antes del corte.
import * as k from "#kit";
import { v } from "#voz";
import { cocina, grano, MESA, velo } from "../mundo.js";

export const desde = () => v.frase(10).t("cada") - 0.04;

const { suave: su, tramo: tr, mez, azar } = k;
const f10 = v.frase(10), T0 = f10.t("cada") - 0.04, Tlit = f10.t("litro"), Tdos = f10.t("dos"), Tcuc = f10.t("cucharadas"), Tfin = v.frase(11).inicio;
const VUELCA = [Tdos + 0.05, Tcuc + 0.45];
export const momentos = { vuelca: VUELCA };
const JX = 500, JTOP = 560, JBOT = MESA, JW = 300;   // la jarra: centro, arriba, abajo y medio ancho
const NIVEL = 700;
const az = azar(808);
const GRANOS = VUELCA.map((tv, j) => Array.from({ length: 40 }, () => ({ dx: (az() - 0.5) * 60, v: az(), r: 10 + az() * 9, sem: j * 100 + Math.floor(az() * 99) })));

export function dibuja(g, t) {
  cocina(g);
  // la sombra de la jarra
  g.fillStyle = "rgba(50,25,10,0.4)"; g.beginPath(); g.ellipse(JX + 40, JBOT + 6, JW * 1.15, 26, 0, 0, Math.PI * 2); g.fill();
  // el agua de mar dentro
  const ola = 14 * Math.exp(-(t - T0) * 2) * Math.sin((t - T0) * 9);
  g.save();
  const cuerpo = () => { g.beginPath(); g.moveTo(JX - JW, JTOP); g.lineTo(JX - JW * 0.92, JBOT - 20); g.quadraticCurveTo(JX - JW * 0.9, JBOT, JX - JW * 0.7, JBOT); g.lineTo(JX + JW * 0.7, JBOT); g.quadraticCurveTo(JX + JW * 0.9, JBOT, JX + JW * 0.92, JBOT - 20); g.lineTo(JX + JW, JTOP); g.closePath(); };
  cuerpo(); g.clip();
  const ag = g.createLinearGradient(0, NIVEL, 0, JBOT);
  ag.addColorStop(0, "rgba(90,200,215,0.85)"); ag.addColorStop(1, "rgba(16,96,140,0.92)");
  g.fillStyle = ag; g.beginPath(); g.moveTo(JX - JW - 10, NIVEL + ola);
  for (let x = -JW - 10; x <= JW + 10; x += 20) g.lineTo(JX + x, NIVEL + ola * Math.sin(x * 0.02 + t * 6));
  g.lineTo(JX + JW + 10, JBOT + 10); g.lineTo(JX - JW - 10, JBOT + 10); g.closePath(); g.fill();
  g.globalCompositeOperation = "screen"; g.globalAlpha = 0.25; g.drawImage(k.causticas, JX - JW, NIVEL, JW * 2, JBOT - NIVEL);
  g.globalCompositeOperation = "source-over"; g.globalAlpha = 1;
  // la sal que cae dentro y se disuelve
  VUELCA.forEach((tv, j) => GRANOS[j].forEach((q) => {
    const u = t - tv - q.v * 0.15;
    if (u < 0 || u > 1.4) return;
    const y = 520 + 900 * u * u + 300 * u, x = JX + 70 + q.dx * 1.6 + 30 * u;
    const dentro = y > NIVEL ? Math.max(0, 1 - (y - NIVEL) / 260) : 1;
    if (y < JBOT) grano(g, x, y, q.r * (y > NIVEL ? dentro : 1), t, q.sem, dentro, 0.8);
  }));
  g.restore();
  // el vidrio
  cuerpo(); g.fillStyle = "rgba(220,240,255,0.08)"; g.fill();
  cuerpo(); k.vidrio(g, JX - JW, JX + JW, 0.7);
  k.reflejo(g, JX - JW + 30, JTOP + 40, 22, 480, 0.4);
  // el asa
  g.save(); g.strokeStyle = "rgba(230,245,255,0.55)"; g.lineWidth = 22; g.lineCap = "round";
  g.beginPath(); g.moveTo(JX + JW - 6, JTOP + 80); g.bezierCurveTo(JX + JW + 170, JTOP + 80, JX + JW + 170, JTOP + 360, JX + JW * 0.95 - 4, JTOP + 400); g.stroke(); g.restore();
  // las marcas y «1 litro»
  g.save(); g.strokeStyle = "rgba(255,255,255,0.7)"; g.lineWidth = 4;
  for (let i = 0; i < 4; i++) { const y = NIVEL + i * 105; g.beginPath(); g.moveTo(JX - JW * 0.85, y); g.lineTo(JX - JW * 0.85 + (i ? 40 : 70), y); g.stroke(); }
  g.restore();
  k.pastilla(g, JX, NIVEL + 260, "1", "litro", "255,255,255", su(tr(t, Tlit - 0.1, Tlit + 0.2)), 130);
  // las cucharas: entran, vuelcan y se van
  VUELCA.forEach((tv, j) => {
    const entra = k.entra(tr(t, tv - 0.45, tv - 0.05)), vuelca = su(tr(t, tv - 0.08, tv + 0.2)), sale = su(tr(t, tv + 0.45, tv + 0.85));
    if (entra <= 0 || sale >= 1) return;
    const x = mez(1250, JX + 120, entra) + 700 * sale, y = mez(260, 450, entra) - 300 * sale;
    g.save(); g.translate(x, y); g.scale(1.3, 1.3); cuchara(g, 0, 0, -0.35 + 1.1 * vuelca, 1 - vuelca); g.restore();
  });
  velo(g, 0.3);
}

// Una cuchara sopera de metal, con su montoncito de sal (lleno: 0-1). (x, y) es el centro del cazo.
function cuchara(g, x, y, ang, lleno) {
  g.save(); g.translate(x, y); g.rotate(ang);
  g.beginPath(); k.redondo(g, 60, -14, 420, 28, 14); k.metal(g, 60, 480);
  g.beginPath(); g.ellipse(0, 0, 105, 70, 0, 0, Math.PI * 2); k.metal(g, -105, 105, ["#5c626a", "#f4f6f9", "#9aa2ad", "#e8ecf1", "#6d737c"]);
  g.fillStyle = "rgba(40,40,50,0.35)"; g.beginPath(); g.ellipse(4, 6, 86, 54, 0, 0, Math.PI * 2); g.fill();
  if (lleno > 0.02) {
    g.fillStyle = "#f4f8fc"; g.beginPath(); g.ellipse(0, -10 * lleno, 84, 40 + 30 * lleno, 0, Math.PI, 0); g.fill();
    g.fillStyle = "#dfe8f1"; g.beginPath(); g.ellipse(0, 0, 84, 30, 0, 0, Math.PI); g.fill();
  }
  g.restore();
}
