// «Todo en menos de lo que dura un parpadeo.»
// Corte en «Todo»: la misma mesa, ahora a velocidad de verdad. La mosca otra vez en su sitio y la mano arriba.
// - «en menos»: la mano baja de golpe y la mosca ya no está (sale disparada por su flecha); «0,2 s».
// - «parpadeo»: unos párpados cierran la imagen y se abren: la mano en la mesa, la mosca ya lejos. Todo quieto.
import * as k from "#kit";
import { v } from "#voz";
import { cocina, mosca, mano, golpe } from "../mundo.js";

export const desde = (vz) => vz.frase(10).inicio;
export const entrada = "sigue";
const { suave: su, tramo: tr, mez, entra } = k;
const f10 = v.frase(10);
const T0 = f10.inicio, Tmen = f10.t("menos"), Tpar = f10.t("parpadeo"), Fin = f10.fin;
const Tsal = Tmen + 0.14, Tgol = Tmen + 0.29;
const Tvuelve = T0 + 0.55; // rebobina: la mano sube y la mosca vuelve a su sitio
const Tcierra = Tpar - 0.05, Tabre = Tpar + 0.35;
export const momentos = { salta: Tsal, golpe: Tgol, parpadeo: Tcierra };

const MX = 500, MY = 1380, MS = 660;
const P0 = [MX + 40, MY - 200], P1 = [MX + 280, MY - 560], P2 = [1240, MY - 900];
const bez = (u) => [(1 - u) ** 2 * P0[0] + 2 * (1 - u) * u * P1[0] + u * u * P2[0], (1 - u) ** 2 * P0[1] + 2 * (1 - u) * u * P1[1] + u * u * P2[1]];

function parpados(g, u) {
  if (u <= 0) return;
  const h = 960 * u, curva = 220 * (1 - u) + 30;
  // borde de cada párpado: una curva que baja (o sube) en el centro
  const borde = (s, x) => { const q = (x - 540) / 560; return s < 0 ? h + curva * (1 - q * q) : 1920 - h - curva * 0.6 * (1 - q * q); };
  for (const s of [-1, 1]) {
    g.beginPath(); g.moveTo(-20, s < 0 ? -20 : 1940);
    for (let x = -20; x <= 1100; x += 40) g.lineTo(x, borde(s, x));
    g.lineTo(1100, s < 0 ? -20 : 1940); g.closePath();
    const y0 = s < 0 ? 0 : 1920, y1 = borde(s, 540);
    const pg = g.createLinearGradient(0, y0, 0, y1); pg.addColorStop(0, "#a8664a"); pg.addColorStop(0.75, "#d0906a"); pg.addColorStop(0.93, "#b26e4e"); pg.addColorStop(1, "#4a2014");
    g.fillStyle = pg; g.fill();
    g.save(); g.clip(); g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.18; g.drawImage(k.manchas, 0, 0, 1080, 1920); g.restore();
    // el pliegue
    g.strokeStyle = "rgba(90,40,25,0.5)"; g.lineWidth = 6; g.beginPath();
    for (let x = -20; x <= 1100; x += 40) g.lineTo(x, borde(s, x) + (s < 0 ? -120 : 90));
    g.stroke();
  }
  // las pestañas, a lo largo del párpado de arriba
  g.strokeStyle = "#1a0f0a"; g.lineWidth = 6; g.lineCap = "round";
  for (let i = 0; i <= 26; i++) { const x = 20 + i * 40, y = borde(-1, x), d = (x - 540) / 540; g.beginPath(); g.moveTo(x, y - 6); g.quadraticCurveTo(x + d * 20, y + 30, x + d * 45, y + 60); g.stroke(); }
}

export function dibuja(g, t) {
  cocina(g, 1180, 0.9);
  const vuelo = tr(t, Tsal, Tsal + 0.28);
  let volando = null;
  const rebob = 1 - su(tr(t, T0, Tvuelve));          // 1 al empezar (como acabó el plano de antes), 0 ya en su sitio
  if (t < Tvuelve) {
    const [bx, by] = bez(Math.min(1, rebob * 1.05));
    mosca(g, bx - 40, by + 200, MS, { t, aire: Math.min(1, rebob * 5), alas: rebob > 0.02 ? 1 : 0, inclina: -0.35 * Math.min(1, rebob * 3), suelo: 1380 });
  } else if (vuelo < 1) {
    let x = MX, y = MY;
    if (vuelo > 0) { const [bx, by] = bez(vuelo); x = bx - 40; y = by + 200; }
    const pinta = () => mosca(g, x, y, MS, { t, frota: vuelo > 0 ? 0 : 1, inclina: vuelo > 0 ? -0.35 : 0, aire: Math.min(1, vuelo * 5), alas: vuelo > 0 ? 1 : 0, suelo: 1380 });
    if (vuelo > 0) volando = pinta; else pinta();
  } else {
    // ya lejos: pequeña, arriba a la derecha
    const x = mez(860, 900, tr(t, Tsal + 0.28, Fin)), y = mez(760, 730, tr(t, Tsal + 0.28, Fin));
    mosca(g, x, y, 200, { t, aire: 1, alas: 1, inclina: -0.2, sombra: 0 });
  }
  // la mano: vuelve arriba rebobinando y luego baja de golpe
  const baja = Math.pow(tr(t, Tvuelve + 0.1, Tgol), 2);
  const hx = t < Tvuelve + 0.1 ? mez(-120, 120, rebob) : mez(-120, 380, baja), hy = t < Tvuelve + 0.1 ? mez(120, 620, rebob) : mez(120, 900, baja);
  mano(g, hx, hy, 640, 0.6, 1, 2.45, 140 * tr(t, Tgol - 0.3, Tgol) * (t < Tgol ? 1 : 0));
  if (volando) volando();
  golpe(g, 520, 1380, tr(t, Tgol, Tgol + 0.45), 760);
  // la cifra
  k.pastilla(g, 760, 1560 - 300, "0,2", "s", "255,214,90", entra(tr(t, Tgol + 0.1, Tgol + 0.4)), 100);
  // el parpadeo
  const p = t < Tabre - 0.2 ? su(tr(t, Tcierra, Tcierra + 0.12)) : 1 - su(tr(t, Tabre - 0.2, Tabre));
  parpados(g, p);
  const vg = g.createLinearGradient(0, 200, 0, 600); vg.addColorStop(0, "rgba(15,8,4,0.55)"); vg.addColorStop(1, "rgba(15,8,4,0)");
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 600);
}
