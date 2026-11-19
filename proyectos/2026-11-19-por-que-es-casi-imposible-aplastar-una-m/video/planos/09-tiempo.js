// «No es que tú seas lento: es que ella vive en otro tiempo.»
// Corte en «No» a la cocina, de lado y de cerca: el tiempo de la mosca.
// - Una gota de agua cae despacísimo, casi quieta en el aire, y el polvo flota sin moverse; la mosca vuela a su lado
//   y se le ven las alas batir una a una, tranquilas.
// - «vive en otro tiempo»: la mosca rodea la gota.
// - «otro tiempo»: la cámara se aleja y la mosca se posa en la mesa, frotándose las patas, como en el primer
//   fotograma del video. Sigue el plano del botón de seguir.
import * as k from "#kit";
import { v } from "#voz";
import { cocina, mosca } from "../mundo.js";

export const desde = (vz) => vz.frase(12).inicio;
export const entrada = "corte";
const { suave: su, tramo: tr, mez, azar } = k;
const TAU = Math.PI * 2;
const f12 = v.frase(12);
const T0 = f12.inicio, Tviv = f12.t("vive"), Ttie = f12.t("tiempo"), Fin = f12.fin;
const Tc = Ttie - 0.4, Tami = Fin - 0.6;  // la cámara se aleja y la mosca se posa al acabar la frase
export const momentos = { gota: T0 + 0.2, posa: Tami + 0.3 };

const azP = azar(515);
const POLVO = Array.from({ length: 40 }, () => ({ x: azP() * 1080, y: 500 + azP() * 900, r: 2 + azP() * 5, f: azP() * 6 }));

function gota(g, x, y, r) {
  g.save(); g.translate(x, y);
  g.beginPath(); g.moveTo(0, -r * 1.9); g.bezierCurveTo(r * 0.35, -r * 1.2, r, -r * 0.6, r, 0); g.arc(0, 0, r, 0, Math.PI); g.bezierCurveTo(-r, -r * 0.6, -r * 0.35, -r * 1.2, 0, -r * 1.9); g.closePath();
  const gg = g.createRadialGradient(-r * 0.3, -r * 0.3, r * 0.1, 0, 0, r * 1.3);
  gg.addColorStop(0, "rgba(230,245,255,0.55)"); gg.addColorStop(0.6, "rgba(150,200,240,0.3)"); gg.addColorStop(1, "rgba(90,140,200,0.65)");
  g.fillStyle = gg; g.fill();
  g.strokeStyle = "rgba(255,255,255,0.6)"; g.lineWidth = 3; g.stroke();
  // la ventana reflejada y la luz que la atraviesa
  g.globalCompositeOperation = "lighter";
  g.fillStyle = "rgba(255,255,255,0.85)"; g.beginPath(); g.ellipse(-r * 0.4, -r * 0.35, r * 0.18, r * 0.28, -0.4, 0, TAU); g.fill();
  const lg = g.createRadialGradient(r * 0.25, r * 0.45, 0, r * 0.25, r * 0.45, r * 0.6); lg.addColorStop(0, "rgba(255,230,180,0.6)"); lg.addColorStop(1, "rgba(255,230,180,0)");
  g.fillStyle = lg; g.fillRect(-r, -r, 2 * r, 2 * r);
  g.restore();
}

export function dibuja(g, t) {
  // la cámara: cerca de la gota; en el cierre se aleja hasta el encuadre del primer fotograma
  const sal = su(tr(t, Tc - 0.1, Tami + 0.6));
  const z = mez(1.3, 1, sal), cx = mez(600, 540, sal), cy = mez(1000, 1150, sal);
  g.save(); g.translate(540, cy); g.scale(z, z); g.translate(-cx, -cy);
  cocina(g, 1150);
  // el polvo, casi quieto
  g.save(); g.globalCompositeOperation = "lighter";
  for (const p of POLVO) { const y = p.y + (t - T0) * 6, x = p.x + Math.sin(t * 0.3 + p.f) * 6; k.brillo(g, x, y, p.r * 8, "255,235,200", 0.5); }
  g.restore();
  // la gota, cayendo despacísimo
  const gy = mez(760, 880, tr(t, T0, Fin));
  gota(g, 640, gy, 60);
  // la mosca: vuela alrededor de la gota con aleteos lentos; en el cierre baja a la mesa
  const ang = mez(Math.PI * 0.9, Math.PI * 2.2, su(tr(t, T0, Tc)));
  const ox = 600 + Math.cos(ang) * 230, oy = gy + 200 + Math.sin(ang) * 90;
  const baja = su(tr(t, Tc + 0.1, Tami + 0.5));
  const x = mez(ox, 520, baja), y = mez(oy + 166, 1330, baja);
  const enAire = 1 - tr(t, Tami + 0.3, Tami + 0.5);
  const aleteo = -0.5 + 0.55 * Math.sin(t * 7);     // las alas, una a una, lentas
  mosca(g, x, y, mez(520, 660, baja), { t, aire: enAire, alaAng: enAire > 0.02 ? aleteo : null, frota: tr(t, Tami + 0.5, Tami + 0.8), suelo: 1330 });
  g.restore();
  const vg = g.createLinearGradient(0, 200, 0, 620); vg.addColorStop(0, "rgba(15,8,4,0.5)"); vg.addColorStop(1, "rgba(15,8,4,0)");
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 620);
}
