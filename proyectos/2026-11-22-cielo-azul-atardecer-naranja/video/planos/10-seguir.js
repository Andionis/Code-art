// «Síguenos para más videos.»
// Corte en «Síguenos»: sobre el atardecer, un botón SEGUIR enorme, rojo y brillante, que late. El pulgar llega desde
// abajo y lo aprieta en «Síguenos»: se hunde, fogonazo y confeti. «videos»: un anillo de luz se abre y el botón queda
// encendido, «Siguiendo», hasta el final.
import * as k from "#kit";
import { v } from "#voz";
import { pulgar } from "#piezas/celular.js";
import { cieloMar, camCielo } from "../mundo.js";

const F = v.frase(15);
export const desde = () => F.inicio - 0.04;
const { suave, tramo, mez, entra } = k;
const T = { ini: F.inicio, aprieta: F.t("mas"), brilla: F.t("videos"), fin: F.fin };
export const momentos = { aprieta: T.aprieta + 0.02, brilla: T.brilla };
const CONFETI = (() => { const az = k.azar(1515), l = []; for (let i = 0; i < 90; i++) { const a = az() * Math.PI * 2, s = 600 + az() * 1400; l.push({ vx: Math.cos(a) * s, vy: Math.sin(a) * s - 700, giro: (az() - 0.5) * 16, c: ["#ff3b30", "#ffd23f", "#4a90e2", "#7ed321", "#bd10e0", "#ffffff"][i % 6], w: 14 + az() * 18 }); } return l; })();

function boton(g, x, y, hunde, brilla, hecho) {
  const W = 760, H = 210;
  g.save(); g.translate(x, y + 14 * hunde);
  if (brilla > 0) k.brillo(g, 0, 0, 1500, "255,80,60", 0.55 * brilla);
  k.redondo(g, -W / 2, -H / 2 + 26 * (1 - hunde), W, H, H / 2); g.fillStyle = "#8f140d"; g.fill();
  k.redondo(g, -W / 2, -H / 2, W, H, H / 2);
  const bg = g.createLinearGradient(0, -H / 2, 0, H / 2); bg.addColorStop(0, "#ff6a5c"); bg.addColorStop(0.5, "#ff3b30"); bg.addColorStop(1, "#d42a20");
  g.fillStyle = bg; g.fill();
  g.fillStyle = "rgba(255,255,255,0.28)"; k.redondo(g, -W / 2 + 40, -H / 2 + 16, W - 80, 50, 25); g.fill();
  // el icono: una persona con un + (o un ✓ cuando ya sigue)
  g.save(); g.translate(-250, 6); g.fillStyle = "#fff"; g.strokeStyle = "#fff"; g.lineCap = "round"; g.lineWidth = 11;
  g.beginPath(); g.arc(-10, -26, 22, 0, Math.PI * 2); g.fill();
  g.beginPath(); g.moveTo(-50, 42); g.quadraticCurveTo(-50, 4, -10, 4); g.quadraticCurveTo(30, 4, 30, 42); g.closePath(); g.fill();
  if (hecho > 0.5) { g.beginPath(); g.moveTo(40, -12); g.lineTo(52, 2); g.lineTo(74, -26); g.stroke(); }
  else { g.beginPath(); g.moveTo(58, -32); g.lineTo(58, 0); g.moveTo(42, -16); g.lineTo(74, -16); g.stroke(); }
  g.restore();
  g.fillStyle = "#fff"; g.font = `900 ${hecho > 0.5 ? 78 : 96}px Figtree`; g.textAlign = "center"; g.textBaseline = "middle"; g.shadowColor = "rgba(120,10,5,0.6)"; g.shadowBlur = 10; g.shadowOffsetY = 5;
  g.fillText(hecho > 0.5 ? "SIGUIENDO" : "SEGUIR", 70, 8);
  g.restore();
}

export function dibuja(g, t) {
  cieloMar(g, t, { cam: camCielo(1520, 3, 0, 6), u: 1, sol: -0.6, nubes: 1 });
  g.fillStyle = "rgba(10,5,25,0.35)"; g.fillRect(0, 0, 1080, 1920);
  const ap = k.pulso(t, T.aprieta + 0.04, 0.07) > 0.05 ? k.pulso(t, T.aprieta + 0.04, 0.07) : 0;
  const ent = entra(tramo(t, T.ini - 0.04, T.ini + 0.35)), late = 0.03 * Math.sin((t - T.ini) * 7) * (1 - suave(tramo(t, T.aprieta - 0.2, T.aprieta)));
  const s = mez(0.6, 1, ent) * (1 + late);
  g.save(); g.translate(540, 1040); g.scale(s, s); g.translate(-540, -1040);
  const an = tramo(t, T.brilla - 0.1, T.brilla + 0.9);
  if (an > 0 && an < 1) { g.save(); g.strokeStyle = `rgba(255,214,150,${0.8 * (1 - an)})`; g.lineWidth = 14 * (1 - an) + 2; g.beginPath(); g.ellipse(540, 1040, 420 + 500 * an, 140 + 300 * an, 0, 0, Math.PI * 2); g.stroke(); g.restore(); }
  boton(g, 540, 1040, ap, suave(tramo(t, T.aprieta, T.aprieta + 0.3)), t > T.aprieta + 0.05 ? 1 : 0);
  g.restore();
  if (t > T.aprieta) k.fogonazo(g, 540, 1040, (t - T.aprieta) * 1.4, 1000, "255,200,150");
  const w = t - T.aprieta - 0.02;
  if (w > 0 && w < 2.5) for (const p of CONFETI) {
    const x = 540 + p.vx * w * (1 - 0.3 * w), y = 1040 + p.vy * w + 1400 * w * w;
    if (y > 2000) continue;
    g.save(); g.translate(x, y); g.rotate(p.giro * w); g.fillStyle = p.c; g.globalAlpha = 1 - tramo(w, 1.6, 2.5); g.fillRect(-p.w / 2, -p.w / 4, p.w, p.w / 2); g.restore();
  }
  const dx = k.claves([[T.ini, 1400], [T.aprieta - 0.15, 860], [T.aprieta, 830], [T.aprieta + 0.25, 880], [T.fin + 0.6, 930]]), dy = k.claves([[T.ini, 2300], [T.aprieta - 0.15, 1110], [T.aprieta, 1080], [T.aprieta + 0.25, 1190], [T.fin + 0.6, 1290]]);
  if (t > T.ini) pulgar(g, dx(t), dy(t), -0.55, ap, 1700);
}
