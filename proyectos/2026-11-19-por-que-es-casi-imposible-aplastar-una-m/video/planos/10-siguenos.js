// «Síguenos para más.»
// Sigue en la cocina, con la mosca en la mesa frotándose las patas (como en el primer fotograma).
// - «Síguenos»: un botón rojo «SEGUIR» salta delante; el pulgar llega desde abajo.
// - «más»: el pulgar lo aprieta: el botón se hunde, pasa a «SIGUIENDO ✓» y sale confeti.
// - Al acabar la voz: el botón se va hacia arriba, aparece el símbolo de rebobinar y la mano vuelve a entrar desde
//   arriba hasta quedar como en el primer fotograma del video, para que empiece de nuevo sin que se note.
import * as k from "#kit";
import { v } from "#voz";
import { pulgar } from "#piezas/celular.js";
import { cocina, mosca, mano } from "../mundo.js";

export const desde = (vz) => vz.frase(13).inicio;
export const entrada = "sigue";
const { suave: su, tramo: tr, mez, entra, sale } = k;
const TAU = Math.PI * 2;
const f13 = v.frase(13);
const T0 = f13.inicio, Tmas = f13.t("mas"), Fin = f13.fin, END = v.duracion;
const Tap = Tmas + 0.05, Tva = Fin + 0.35, Treb = Tva + 0.35, Tmano = END - 1.25;
export const momentos = { entra: T0 + 0.05, aprieta: Tap, sevan: Tva, rebobina: Treb, mano: Tmano };

const BX = 540, BY = 880;
const CONFETI = (() => { const az = k.azar(1919), l = []; for (let i = 0; i < 80; i++) { const a = az() * TAU, s = 500 + az() * 1200; l.push({ vx: Math.cos(a) * s, vy: Math.sin(a) * s - 600, giro: (az() - 0.5) * 16, c: ["#ff3b30", "#ffd23f", "#4a90e2", "#7ed321", "#bd10e0", "#ffffff"][i % 6], w: 14 + az() * 16 }); } return l; })();

function boton(g, x, y, esc, hunde, seguido, brilla) {
  const W = 660, H = 180;
  g.save(); g.translate(x, y + 12 * hunde); g.scale(esc, esc);
  if (brilla > 0) k.brillo(g, 0, 0, 1300, "255,80,60", 0.5 * brilla);
  g.save(); g.shadowColor = "rgba(0,0,0,0.5)"; g.shadowBlur = 50; g.shadowOffsetY = 20;
  k.redondo(g, -W / 2, -H / 2 + 22 * (1 - hunde), W, H, H / 2); g.fillStyle = seguido ? "#1e1e22" : "#8f140d"; g.fill(); g.restore();
  k.redondo(g, -W / 2, -H / 2, W, H, H / 2);
  const bg = g.createLinearGradient(0, -H / 2, 0, H / 2);
  if (seguido) { bg.addColorStop(0, "#5a5a62"); bg.addColorStop(1, "#33333a"); } else { bg.addColorStop(0, "#ff6a5c"); bg.addColorStop(0.5, "#ff3b30"); bg.addColorStop(1, "#d42a20"); }
  g.fillStyle = bg; g.fill();
  g.fillStyle = "rgba(255,255,255,0.25)"; k.redondo(g, -W / 2 + 40, -H / 2 + 14, W - 80, 44, 22); g.fill();
  // el icono: persona con un «+», o una marca de hecho
  g.save(); g.translate(-W / 2 + 105, 4); g.fillStyle = "#fff"; g.strokeStyle = "#fff"; g.lineCap = "round"; g.lineJoin = "round";
  if (seguido) { g.lineWidth = 16; g.beginPath(); g.moveTo(-30, 0); g.lineTo(-8, 24); g.lineTo(34, -26); g.stroke(); }
  else {
    g.beginPath(); g.arc(-8, -22, 22, 0, TAU); g.fill();
    g.beginPath(); g.moveTo(-48, 40); g.quadraticCurveTo(-46, 4, -8, 4); g.quadraticCurveTo(30, 4, 32, 40); g.closePath(); g.fill();
    g.lineWidth = 9; g.beginPath(); g.moveTo(44, -18); g.lineTo(44, 12); g.moveTo(29, -3); g.lineTo(59, -3); g.stroke();
  }
  g.restore();
  g.fillStyle = "#fff"; g.textAlign = "center"; g.textBaseline = "middle";
  g.font = `900 ${seguido ? 70 : 84}px Figtree`; g.fillText(seguido ? "SIGUIENDO" : "SEGUIR", 48, 6);
  g.restore();
}

export function dibuja(g, t) {
  cocina(g, 1150);
  mosca(g, 520, 1330, 660, { t, frota: 1 });
  // un velo suave para que el botón destaque, que se va antes de volver a empezar
  const velo = su(tr(t, T0, T0 + 0.3)) * (1 - su(tr(t, Tva, Treb + 0.3)));
  g.fillStyle = `rgba(10,5,2,${0.35 * velo})`; g.fillRect(0, 0, 1080, 1920);
  // el botón
  const ap = k.pulso(t, Tap, 0.07);
  const ent = entra(tr(t, T0 - 0.02, T0 + 0.35)), va = sale(tr(t, Tva, Tva + 0.4));
  const late = 0.03 * Math.sin((t - T0) * 6) * (1 - tr(t, Tap - 0.2, Tap));
  if (va < 1) {
    const an = tr(t, Tap, Tap + 0.8);
    if (an > 0 && an < 1) { g.save(); g.strokeStyle = `rgba(255,214,150,${0.8 * (1 - an)})`; g.lineWidth = 14 * (1 - an) + 2; g.beginPath(); g.ellipse(BX, BY, 360 + 420 * an, 110 + 260 * an, 0, 0, TAU); g.stroke(); g.restore(); }
    boton(g, BX, mez(BY, -300, va), mez(0.5, 1, ent) * (1 + late) * mez(1, 0.6, va), ap, t > Tap, su(tr(t, Tap, Tap + 0.3)) * (1 - va));
  }
  // el confeti
  const w = t - Tap;
  if (w > 0 && w < 2.2) for (const p of CONFETI) {
    const x = BX + p.vx * w * (1 - 0.3 * w), y = BY + p.vy * w + 1400 * w * w;
    if (y > 2000) continue;
    g.save(); g.translate(x, y); g.rotate(p.giro * w); g.fillStyle = p.c; g.globalAlpha = 1 - tr(w, 1.4, 2.2); g.fillRect(-p.w / 2, -p.w / 4, p.w, p.w / 2); g.restore();
  }
  // el pulgar: llega desde abajo a la derecha, aprieta en «más» y se va
  const dx = k.claves([[T0, 1300], [Tap - 0.15, 690], [Tap, 650], [Tap + 0.25, 720], [Tva + 0.3, 1300]]);
  const dy = k.claves([[T0, 2300], [Tap - 0.15, 950], [Tap, 925], [Tap + 0.25, 1050], [Tva + 0.3, 2300]]);
  if (t > T0 && t < Tva + 0.3) pulgar(g, dx(t), dy(t), -0.55, ap, 1700);
  // rebobinar: el símbolo late un momento en el centro
  const rb = su(tr(t, Treb - 0.1, Treb + 0.2)) * (1 - su(tr(t, Tmano + 0.2, Tmano + 0.6)));
  if (rb > 0.01) {
    g.save(); g.globalAlpha = rb; g.translate(540, 860); const s = 1 + 0.08 * Math.sin((t - Treb) * 9);
    g.scale(s, s);
    g.fillStyle = "rgba(10,10,14,0.6)"; g.beginPath(); g.arc(0, 0, 130, 0, TAU); g.fill();
    g.strokeStyle = "rgba(255,255,255,0.3)"; g.lineWidth = 4; g.stroke();
    g.fillStyle = "#fff";
    for (const ox of [-6, 58]) { g.beginPath(); g.moveTo(ox - 70, 0); g.lineTo(ox, -52); g.lineTo(ox, 52); g.closePath(); g.fill(); }
    g.restore();
  }
  // la mano vuelve a entrar desde arriba y se queda como en el primer fotograma
  const m = entra(tr(t, Tmano, END));
  if (t > Tmano) mano(g, 540, mez(-900, -230, m), 620, 0.62, 1, Math.PI);
  const vg = g.createLinearGradient(0, 200, 0, 620); vg.addColorStop(0, "rgba(15,8,4,0.5)"); vg.addColorStop(1, "rgba(15,8,4,0)");
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 620);
}
