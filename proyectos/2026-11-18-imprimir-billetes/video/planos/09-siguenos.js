// «Síguenos para más.»
// En «Síguenos»: la panadería, con su lluvia, se oscurece detrás y llega de golpe un botón «SEGUIR +» enorme, rojo, que late,
// con el pan dorado como foto de perfil encima. El pulgar llega desde abajo y lo aprieta en «más»: se hunde, fogonazo
// y confeti, y el botón pasa a «SIGUIENDO ✓». Reposa un momento antes de que el vídeo rebobine.
import * as k from "#kit";
import { v } from "#voz";
import { pulgar } from "#piezas/celular.js";
import { pan } from "../panaderia.js";
import { dibuja as remate } from "./08-remate.js";

export const desde = "siguenos";
const { suave: su, tramo: tr, mez, entra } = k;

const F = v.frase(12);
const Tini = F.inicio, Tmas = F.t("mas");
const Tap = Tmas + 0.02;
export const momentos = { entra: Tini, aprieta: Tap };

const CONFETI = (() => { const az = k.azar(777), l = []; for (let i = 0; i < 80; i++) { const a = az() * Math.PI * 2, s = 600 + az() * 1300; l.push({ vx: Math.cos(a) * s, vy: Math.sin(a) * s - 700, giro: (az() - 0.5) * 16, c: ["#ff3b30", "#ffd23f", "#7ed321", "#ffffff", "#f2a24a", "#3aa3ff"][i % 6], w: 14 + az() * 18 }); } return l; })();

function botonSeguir(g, x, y, hunde, hecho, brilla) {
  const W = 760, H = 200;
  g.save(); g.translate(x, y + 14 * hunde);
  if (brilla > 0) k.brillo(g, 0, 0, 1500, hecho > 0.5 ? "255,255,255" : "255,80,60", 0.5 * brilla);
  const cara = hecho > 0.5 ? ["#d9d9de", "#f4f4f6", "#c7c7cd"] : ["#ff6a5c", "#ff3b30", "#d42a20"];
  k.redondo(g, -W / 2, -H / 2 + 24 * (1 - hunde), W, H, H / 2); g.fillStyle = hecho > 0.5 ? "#8e8e96" : "#8f140d"; g.fill();
  k.redondo(g, -W / 2, -H / 2, W, H, H / 2);
  const bg = g.createLinearGradient(0, -H / 2, 0, H / 2); bg.addColorStop(0, cara[0]); bg.addColorStop(0.5, cara[1]); bg.addColorStop(1, cara[2]);
  g.fillStyle = bg; g.fill();
  g.fillStyle = "rgba(255,255,255,0.3)"; k.redondo(g, -W / 2 + 40, -H / 2 + 16, W - 80, 48, 24); g.fill();
  const col = hecho > 0.5 ? "#2a2a30" : "#ffffff";
  g.strokeStyle = col; g.fillStyle = col; g.lineWidth = 14; g.lineCap = "round"; g.lineJoin = "round";
  g.save(); g.translate(-262, 4);
  if (hecho > 0.5) { g.beginPath(); g.moveTo(-34, 0); g.lineTo(-8, 26); g.lineTo(38, -26); g.stroke(); }
  else { g.beginPath(); g.moveTo(-34, 0); g.lineTo(34, 0); g.moveTo(0, -34); g.lineTo(0, 34); g.stroke(); }
  g.restore();
  g.font = `900 ${hecho > 0.5 ? 84 : 100}px Figtree`; g.textAlign = "center"; g.textBaseline = "middle";
  g.shadowColor = hecho > 0.5 ? "rgba(0,0,0,0)" : "rgba(120,10,5,0.6)"; g.shadowBlur = 10; g.shadowOffsetY = 5;
  g.fillText(hecho > 0.5 ? "SIGUIENDO" : "SEGUIR", 60, 8);
  g.restore();
}

function avatar(g, x, y, r, t) {
  g.save();
  const ag = g.createLinearGradient(x - r, y - r, x + r, y + r); ag.addColorStop(0, "#ffd23f"); ag.addColorStop(0.5, "#ff3b30"); ag.addColorStop(1, "#c13584");
  g.fillStyle = ag; g.beginPath(); g.arc(x, y, r + 14, 0, 6.2832); g.fill();
  g.fillStyle = "#2a1206"; g.beginPath(); g.arc(x, y, r + 4, 0, 6.2832); g.fill();
  const bg = g.createRadialGradient(x, y - r * 0.3, 10, x, y, r); bg.addColorStop(0, "#a65a26"); bg.addColorStop(1, "#4a200c");
  g.fillStyle = bg; g.beginPath(); g.arc(x, y, r, 0, 6.2832); g.fill();
  g.beginPath(); g.arc(x, y, r, 0, 6.2832); g.clip();
  pan(g, x, y + 10 + 4 * Math.sin(t * 3), r * 1.5, -0.1, 1, 0.3);
  g.restore();
}

export function dibuja(g, t) {
  remate(g, t);                                              // la panadería y su lluvia siguen detrás
  g.fillStyle = `rgba(10,4,2,${0.62 * entra(tr(t, Tini - 0.04, Tini + 0.2))})`; g.fillRect(0, 0, 1080, 1920);
  const ent = entra(tr(t, Tini - 0.04, Tini + 0.3));
  const ap = k.pulso(t, Tap + 0.03, 0.07) > 0.05 ? k.pulso(t, Tap + 0.03, 0.07) : 0;
  const hecho = t > Tap + 0.06 ? 1 : 0;
  const late = 0.03 * Math.sin((t - Tini) * 9) * (1 - su(tr(t, Tap - 0.2, Tap)));
  const s = 1.15 * mez(0.5, 1, ent) * (1 + late) * (1 + 0.08 * k.pulso(t, Tap + 0.15, 0.08));
  g.save(); g.translate(540, 1050); g.scale(s, s); g.translate(-540, -1050);
  avatar(g, 540, 760, 150, t);
  botonSeguir(g, 540, 1080, ap, hecho, su(tr(t, Tap, Tap + 0.25)));
  g.restore();
  if (t > Tap) k.fogonazo(g, 540, 1080, (t - Tap) * 1.4, 1000, "255,200,150");
  const w = t - Tap - 0.02;
  if (w > 0 && w < 2.5) for (const p of CONFETI) {
    const x = 540 + p.vx * w * (1 - 0.3 * w), y = 1080 + p.vy * w + 1400 * w * w;
    if (y > 2000) continue;
    g.save(); g.translate(x, y); g.rotate(p.giro * w); g.fillStyle = p.c; g.fillRect(-p.w / 2, -p.w / 4, p.w, p.w / 2); g.restore();
  }
  // el pulgar: llega desde abajo a la derecha, aprieta en «más» y se retira un poco
  const dx = k.claves([[Tini, 1300], [Tap - 0.15, 700], [Tap, 660], [Tap + 0.25, 720], [Tap + 0.8, 800]]);
  const dy = k.claves([[Tini, 2300], [Tap - 0.15, 1150], [Tap, 1120], [Tap + 0.25, 1230], [Tap + 0.8, 1330]]);
  if (t > Tini) pulgar(g, dx(t), dy(t), -0.55, ap, 1700);
}
