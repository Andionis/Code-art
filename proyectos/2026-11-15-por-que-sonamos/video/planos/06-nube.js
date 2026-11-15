// «Así tu cerebro vuelve a vivir lo que te dolió en el día, pero sin la angustia.»
// El recuerdo: alguien sentado solo en un banco, encogido, bajo una nube negra que llueve y truena.
// - «dolió»: un trueno: el rayo cae detrás y la lluvia arrecia.
// - «sin la angustia»: la nube se aclara y se deshace, deja de llover, sale una luz cálida; él levanta la cabeza.
import * as k from "#kit";
import { v } from "#voz";
import { TAU, camino2D, velo, vineta, vista } from "../mundo.js";

const f8 = v.frase(8);
export const desde = (vv) => vv.frase(8).inicio;
const { suave: su, tramo: tr, mez, azar } = k;
const Tdol = f8.t("dolio"), Tpero = f8.t("pero"), Tang = f8.t("angustia"), Tfin = f8.fin;
const Tray = Tdol + 0.08;

const cam = camino2D([
  [f8.inicio - 0.05, [1.3, 560, 1030]],
  [Tdol + 0.3, [1.5, 580, 1060]],
  [Tfin + 0.3, [1.4, 590, 1000]],
]);
const az = azar(321);
const GOTAS = Array.from({ length: 160 }, () => ({ x: 150 + az() * 820, y: az(), l: 30 + az() * 40, v: 0.9 + az() * 0.5 }));
const BOLAS = Array.from({ length: 16 }, (_, i) => ({ dx: (i / 15 - 0.5) * 760 + (az() - 0.5) * 60, dy: (az() - 0.5) * 90 - Math.sin((i / 15) * Math.PI) * 90, r: 120 + az() * 90 }));

function nube(g, t, claro) {
  const cx = 560, cy = 660 - claro * 40, esc = mez(1, 0.75, claro), al = 1 - su(tr(claro, 0.5, 1)) * 0.75;
  g.save(); g.globalAlpha *= al;
  for (const b of BOLAS) {
    const x = cx + b.dx * esc + Math.sin(t * 0.8 + b.r) * 8, y = cy + b.dy * esc, r = b.r * esc;
    const gr = g.createRadialGradient(x - r * 0.2, y - r * 0.35, r * 0.1, x, y, r);
    gr.addColorStop(0, k.mezColor("#4a4a5e", "#ffffff", claro)); gr.addColorStop(0.7, k.mezColor("#24222e", "#e8eefa", claro)); gr.addColorStop(1, `rgba(${k.mezRgb("20,18,26", "220,230,250", claro)},0)`);
    g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill();
  }
  g.restore();
}
// Alguien sentado en el banco, de lado, mirando a la derecha: encogido (alza 0) o erguido (alza 1).
function sentado(g, alza, t) {
  const hx = 540, hy = 1172, resp = Math.sin(t * 2.2) * 2 * (1 - alza);
  const ang = mez(0.75, 0.12, alza);                  // inclinación del tronco hacia delante
  const sx = hx + Math.sin(ang) * 120, sy = hy - Math.cos(ang) * 120 + resp; // los hombros
  const cab = [sx + Math.sin(ang + mez(0.5, -0.1, alza)) * 48, sy - Math.cos(ang + mez(0.5, -0.1, alza)) * 48];
  const rod = [hx + 110, hy - 10], pie = [hx + 130, 1340];
  g.lineCap = "round"; g.lineJoin = "round";
  // piernas
  g.strokeStyle = "#2a3456"; g.lineWidth = 34; g.beginPath(); g.moveTo(hx, hy); g.lineTo(rod[0], rod[1]); g.lineTo(pie[0], pie[1]); g.stroke();
  g.fillStyle = "#1a1a22"; g.beginPath(); g.ellipse(pie[0] + 14, pie[1] + 6, 26, 11, 0, 0, TAU); g.fill();
  // el tronco (sudadera)
  const tg = g.createLinearGradient(hx - 30, 0, sx + 30, 0); tg.addColorStop(0, "#3a5a8a"); tg.addColorStop(1, "#6a8ac0");
  g.strokeStyle = tg; g.lineWidth = 64; g.beginPath(); g.moveTo(hx - 6, hy - 16); g.lineTo(sx, sy); g.stroke();
  // la cabeza
  g.fillStyle = "#e0a888"; g.beginPath(); g.arc(cab[0], cab[1], 32, 0, TAU); g.fill();
  g.fillStyle = "#2a1a1e"; g.beginPath(); g.arc(cab[0] - 4, cab[1] - 4, 33, Math.PI * mez(0.55, 0.85, alza), Math.PI * mez(1.75, 2.05, alza)); g.fill();
  // el brazo: abraza las rodillas o se apoya en el banco
  const mano = [mez(rod[0] - 10, hx + 40, alza), mez(rod[1] + 20, hy + 2, alza)];
  const codo = [mez((sx + mano[0]) / 2 + 20, sx + 40, alza), mez((sy + mano[1]) / 2 + 30, (sy + hy) / 2, alza)];
  g.strokeStyle = "#5a7ab0"; g.lineWidth = 22; g.beginPath(); g.moveTo(sx, sy + 6); g.lineTo(codo[0], codo[1]); g.lineTo(mano[0], mano[1]); g.stroke();
  g.fillStyle = "#e0a888"; g.beginPath(); g.arc(mano[0], mano[1], 12, 0, TAU); g.fill();
}

export function dibuja(g, t) {
  const [Z, cx, cy] = cam(t);
  vista(g, Z, cx, cy);
  const claro = su(tr(t, Tpero - 0.05, Tang + 0.5));
  // el cielo del atardecer, gris con la tormenta, cálido al aclarar
  const sg = g.createLinearGradient(0, 200, 0, 1350);
  sg.addColorStop(0, k.mezColor("#141826", "#4a8ad8", claro)); sg.addColorStop(1, k.mezColor("#3a3e50", "#ffd2a0", claro));
  g.fillStyle = sg; g.fillRect(-400, -200, 1900, 1560);
  if (claro > 0) { k.brillo(g, 820, 820, 900 * claro + 100, "255,220,150", 0.7 * claro); }
  // el rayo, detrás de la nube
  const ray = k.pulso(t, Tray, 0.07) + 0.6 * k.pulso(t, Tray + 0.2, 0.05);
  if (ray > 0.02) {
    g.fillStyle = `rgba(200,210,255,${0.3 * ray})`; g.fillRect(-400, -200, 1900, 1560);
    const azR = azar(7); let px = 780, py = 700;
    g.strokeStyle = `rgba(240,245,255,${ray})`; g.lineWidth = 8; g.beginPath(); g.moveTo(px, py);
    while (py < 1330) { px += (azR() - 0.4) * 70; py += 40 + azR() * 40; g.lineTo(px, py); }
    g.stroke(); g.save(); g.globalCompositeOperation = "lighter"; k.brillo(g, 780, 900, 500, "200,220,255", 0.6 * ray); g.restore();
  }
  // la ciudad lejos y el suelo del parque
  g.fillStyle = k.mezColor("#1a1c28", "#6a5a7a", claro);
  for (const [x, w, h] of [[-300, 160, 260], [-120, 120, 360], [20, 180, 220], [220, 140, 300], [700, 160, 340], [880, 200, 240], [1100, 140, 300]]) g.fillRect(x, 1350 - h, w, h);
  const pg = g.createLinearGradient(0, 1340, 0, 1900); pg.addColorStop(0, k.mezColor("#2a3a30", "#5a9a5a", claro)); pg.addColorStop(1, "#0a120c");
  g.fillStyle = pg; g.fillRect(-400, 1340, 1900, 700);
  // el charco que refleja
  g.fillStyle = `rgba(${k.mezRgb("120,130,170", "255,220,170", claro)},0.35)`; g.beginPath(); g.ellipse(560, 1390, 300, 26, 0, 0, TAU); g.fill();
  // el banco
  g.fillStyle = "#4a2e1e"; for (const yy of [1182, 1206]) { k.redondo(g, 360, yy, 420, 18, 6); g.fill(); }
  g.fillStyle = "#2a1a12"; g.fillRect(380, 1224, 18, 120); g.fillRect(742, 1224, 18, 120);
  g.fillStyle = "#5a3a26"; k.redondo(g, 360, 1060, 420, 18, 6); g.fill(); k.redondo(g, 360, 1100, 420, 18, 6); g.fill();
  g.fillStyle = "#2a1a12"; g.fillRect(372, 1060, 14, 130);
  sentado(g, su(tr(t, Tang - 0.2, Tang + 0.6)), t);
  // la nube y la lluvia
  nube(g, t, claro);
  const llueve = 1 - su(tr(t, Tpero, Tang + 0.3));
  if (llueve > 0.01) {
    g.strokeStyle = `rgba(190,200,230,${0.55 * llueve})`; g.lineWidth = 3;
    for (const d of GOTAS) { const y = 760 + ((d.y + t * d.v * (1 + 0.5 * k.pulso(t, Tray + 0.3, 0.5))) % 1) * 600; g.beginPath(); g.moveTo(d.x, y); g.lineTo(d.x - 8, y + d.l); g.stroke(); }
  }
  // rayos de sol al final
  if (claro > 0.3) { g.save(); g.globalCompositeOperation = "lighter"; for (let i = 0; i < 6; i++) { const a = -2.2 + i * 0.18; g.fillStyle = `rgba(255,230,170,${0.07 * (claro - 0.3)})`; g.beginPath(); g.moveTo(820, 820); g.lineTo(820 + Math.cos(a) * 1600, 820 + Math.sin(a) * 1600); g.lineTo(820 + Math.cos(a + 0.08) * 1600, 820 + Math.sin(a + 0.08) * 1600); g.fill(); } g.restore(); }
  vineta(g, 0.5 * (1 - claro * 0.5));
  velo(g, 0.35);
}

export const momentos = { rayo: Tray, aclara: Tpero };
