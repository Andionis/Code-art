// «...la misma sal que tienes en el salero de tu cocina.»
// Corte en «misma» a una cocina: una mesa de madera con luz cálida y un salero de vidrio.
// - Fotograma 0: el salero ya está inclinado entrando por arriba.
// - «misma sal»: se sacude y caen los mismos cubitos de sal, que rebotan y forman un montoncito en la mesa.
// - «salero»: deja de sacudirse; los últimos granos caen y todo reposa antes del corte.
import * as k from "#kit";
import { v } from "#voz";
import { marcaDeAgua } from "#piezas/marca-agua.js";
import { grano, velo } from "../mundo.js";

export const desde = "misma";

const { suave: su, tramo: tr, mez, azar } = k;
const f5 = v.frase(5), T0 = f5.t("misma") - 0.04, Tsal = f5.t("sal"), Tsalero = f5.t("cocina"), Tfin = v.frase(6).inicio;
const MESA = 1330;
const az = azar(606);
const GRANOS = Array.from({ length: 140 }, (_, i) => ({ t0: mez(T0 + 0.2, Tsalero, az()), dx: (az() - 0.5) * 50, vx: (az() - 0.5) * 140, r: 5 + az() * 6, sem: 100 + i, px: (az() - 0.5) * 2, py: az() }));
export const sacudidas = (() => { const s = []; for (let t = T0 + 0.25; t < Tsalero; t += 0.18) s.push(t); return s; })();

export function dibuja(g, t) {
  // la pared de la cocina, cálida y desenfocada
  const gr = g.createLinearGradient(0, 0, 0, MESA);
  gr.addColorStop(0, "#3a2418"); gr.addColorStop(1, "#7a4a2c");
  g.fillStyle = gr; g.fillRect(0, 0, 1080, MESA);
  k.brillo(g, 820, 520, 900, "255,200,140", 0.45);
  k.brillo(g, 180, 900, 500, "255,170,110", 0.25);
  // la mesa de madera
  const mg = g.createLinearGradient(0, MESA, 0, 1920);
  mg.addColorStop(0, "#c98d55"); mg.addColorStop(1, "#6e4224");
  g.fillStyle = mg; g.fillRect(0, MESA, 1080, 590);
  g.save(); g.strokeStyle = "rgba(90,50,25,0.35)"; g.lineWidth = 3;
  for (let i = 0; i < 26; i++) { const y = MESA + 12 + i * i * 0.9; g.beginPath(); g.moveTo(0, y); g.bezierCurveTo(300, y + 6 * Math.sin(i), 700, y - 8 * Math.cos(i), 1080, y + 4); g.stroke(); }
  g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.25; g.drawImage(k.red, 0, MESA, 1080, 590);
  g.restore();
  g.fillStyle = "rgba(255,230,190,0.35)"; g.fillRect(0, MESA, 1080, 4);

  // el salero: entra inclinado, se sacude y se para
  const llega = k.entra(tr(t, T0 - 0.1, T0 + 0.3));
  const sac = su(tr(t, T0 + 0.2, T0 + 0.3)) * (1 - su(tr(t, Tsalero - 0.1, Tsalero + 0.15)));
  const sx = mez(820, 600, llega) + 10 * Math.sin((t - T0) * 34) * sac, sy = mez(500, 720, llega) + 18 * Math.sin((t - T0) * 34 + 1) * sac;
  const ang = 2.35 + 0.08 * Math.sin((t - T0) * 34) * sac;
  const boca = [sx + Math.sin(ang) * 400, sy - Math.cos(ang) * 400];
  // los granos que caen y el montón
  let monton = 0;
  for (const q of GRANOS) {
    const u = t - q.t0;
    if (u < 0) continue;
    const caida = (Math.sqrt(400 * 400 + 4 * 2400 * (MESA - 30 - boca[1])) - 400) / 4800;
    if (u < caida) grano(g, boca[0] + q.dx * 0.4 + q.vx * u, boca[1] + 400 * u + 2400 * u * u, q.r, t, q.sem, 1, 0.5);
    else monton++;
  }
  // el montoncito de sal en la mesa
  const n = Math.min(GRANOS.length, monton), alto = 8 + n * 0.9, cx = boca[0] - 10;
  if (n > 0) {
    const hg = g.createRadialGradient(cx - alto * 0.3, MESA - alto * 0.8, 4, cx, MESA, alto * 2.2);
    hg.addColorStop(0, "#ffffff"); hg.addColorStop(0.6, "#e6eef6"); hg.addColorStop(1, "#b9c6d4");
    g.fillStyle = "rgba(60,30,10,0.35)"; g.beginPath(); g.ellipse(cx + 20, MESA + 8, alto * 2.4, alto * 0.35, 0, 0, Math.PI * 2); g.fill();
    g.fillStyle = hg; g.beginPath(); g.moveTo(cx - alto * 2.1, MESA + 4); g.quadraticCurveTo(cx - alto * 0.6, MESA - alto * 1.3, cx, MESA - alto); g.quadraticCurveTo(cx + alto * 0.6, MESA - alto * 1.3, cx + alto * 2.1, MESA + 4); g.closePath(); g.fill();
    GRANOS.slice(0, Math.min(40, n)).forEach((q, i) => grano(g, cx + q.px * alto * 1.5, MESA - q.py * alto * (1 - Math.abs(q.px) * 0.45), q.r * 0.9, t, q.sem, 1, 0.7));
  }
  salero(g, sx, sy, ang);
  velo(g, 0.3);
  marcaDeAgua(g);
}

// El salero: un cuerpo de vidrio lleno de sal con tapa de metal agujereada, girado ang (la tapa hacia arriba en 0).
function salero(g, x, y, ang) {
  g.save(); g.translate(x, y); g.rotate(ang - Math.PI); g.scale(1.6, 1.6);
  // el cuerpo: x de -95 a 95, y de -170 (abajo del todo) a 150 (cuello)
  const cuerpo = () => { g.beginPath(); k.redondo(g, -100, -150, 200, 300, 40); };
  // la sal de dentro (la mitad de abajo del salero, que ahora está arriba)
  g.save(); cuerpo(); g.clip();
  const sg = g.createLinearGradient(-100, 0, 100, 0);
  sg.addColorStop(0, "#d9e3ee"); sg.addColorStop(0.5, "#ffffff"); sg.addColorStop(1, "#c3cfdc");
  g.fillStyle = sg; g.fillRect(-100, -160, 200, 190);
  g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.25; g.drawImage(k.red2, -100, -160, 200, 190);
  g.restore();
  cuerpo(); g.fillStyle = "rgba(200,225,245,0.12)"; g.fill();
  cuerpo(); k.vidrio(g, -100, 100, 0.6);
  k.reflejo(g, -78, -120, 18, 230, 0.45);
  // la tapa de metal
  g.beginPath(); k.redondo(g, -92, 140, 184, 80, 18); k.metal(g, -92, 92);
  g.fillStyle = "rgba(20,20,24,0.85)";
  for (let i = -2; i <= 2; i++) { g.beginPath(); g.arc(i * 28, 214, 6, 0, Math.PI * 2); g.fill(); }
  g.restore();
}
