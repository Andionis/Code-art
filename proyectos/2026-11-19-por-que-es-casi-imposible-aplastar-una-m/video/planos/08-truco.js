// «Por eso el truco no es ir más rápido: es apuntar un poco por delante de ella, adonde va a saltar.»
// Corte en «Por» a la mesa desde arriba. La mosca en el centro, mirando hacia arriba, y la flecha de su salto delante.
// - «no es ir más rápido»: la mano cae de golpe sobre la mosca (crece desde la cámara y se encoge al tocar la mesa),
//   pero la mosca ya saltó por su flecha: fallo, un anillo rojo. La mano se va y la mosca vuelve atrás (rebobina).
// - «es apuntar un poco por delante de ella»: una diana se pone al final de la flecha; «delante», late.
// - «adonde va a saltar»: la mano baja hacia la diana; la mosca salta y llega justo debajo: un fogonazo dorado. Quieto.
import * as k from "#kit";
import { v } from "#voz";
import { mesaArriba, moscaArriba, mano } from "../mundo.js";

export const desde = (vz) => vz.frase(11).inicio;
export const entrada = "corte";
const { suave: su, tramo: tr, mez, entra, sale } = k;
const TAU = Math.PI * 2;
const f11 = v.frase(11);
const T0 = f11.inicio, Trap = f11.t("rapido"), Tapu = f11.t("apuntar"), Tdel = f11.t("delante"), Tsal = f11.t("saltar"), Fin = f11.fin;
const Tgolpe1 = Trap + 0.1, Tsalta1 = Tgolpe1 - 0.14;
const Treb0 = Tgolpe1 + 0.45, Treb1 = Tapu - 0.05;
const Tgolpe2 = Tsal + 0.1, Tsalta2 = Tgolpe2 - 0.3;
export const momentos = { golpe1: Tgolpe1, salta1: Tsalta1, diana: Tapu, salta2: Tsalta2, golpe2: Tgolpe2 };

const FX = 540, FY = 1260, LX = 540, LY = 760, FS = 400;

function flecha(g, al) {
  if (al <= 0) return;
  g.save(); g.globalAlpha = al; g.globalCompositeOperation = "lighter"; g.fillStyle = "rgba(255,214,90,0.85)";
  for (let y = FY - 230; y > LY + 60; y -= 34) { g.beginPath(); g.arc(FX, y, 10, 0, TAU); g.fill(); }
  g.beginPath(); g.moveTo(LX, LY + 20); g.lineTo(LX - 26, LY + 70); g.lineTo(LX + 26, LY + 70); g.closePath(); g.fill();
  g.restore();
}
function diana(g, al, late) {
  if (al <= 0) return;
  g.save(); g.globalAlpha = al; const r = 150 * (1 + 0.12 * late);
  g.strokeStyle = "rgba(255,80,60,0.95)"; g.lineWidth = 9;
  g.beginPath(); g.arc(LX, LY, r, 0, TAU); g.stroke(); g.beginPath(); g.arc(LX, LY, r * 0.5, 0, TAU); g.stroke();
  for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { g.beginPath(); g.moveTo(LX + dx * r * 0.7, LY + dy * r * 0.7); g.lineTo(LX + dx * r * 1.25, LY + dy * r * 1.25); g.stroke(); }
  k.brillo(g, LX, LY, 420, "255,80,60", 0.35 * late);
  g.restore();
}
// la mano que cae desde la cámara: grande y borrosa arriba, del tamaño de la mesa al tocar
function manoCae(g, x, y, u, al = 1) {
  if (al <= 0 || u <= 0) return;
  const W = mez(1500, 520, u), sombra = u;
  const sg = g.createRadialGradient(x, y, 0, x, y, 420); sg.addColorStop(0, `rgba(20,8,2,${0.55 * sombra * al})`); sg.addColorStop(1, "rgba(20,8,2,0)");
  g.fillStyle = sg; g.beginPath(); g.arc(x, y, 420, 0, TAU); g.fill();
  mano(g, x, y + 0.35 * W, W, 0.95, al * Math.min(1, u * 3), 0);
}

export function dibuja(g, t) {
  mesaArriba(g);
  flecha(g, entra(tr(t, T0, T0 + 0.4)));
  diana(g, entra(tr(t, Tapu - 0.1, Tapu + 0.25)), k.pulso(t, Tdel + 0.1, 0.25));
  // la mosca: salta (1), vuelve atrás rebobinando, y salta otra vez (2)
  let y = FY, alas = 0;
  if (t > Tsalta1 && t < Treb1) {
    const ida = su(tr(t, Tsalta1, Tsalta1 + 0.25)), vuelta = su(tr(t, Treb0, Treb1));
    y = mez(mez(FY, LY, ida), FY, vuelta); alas = (ida > 0 && ida < 1) || (vuelta > 0 && vuelta < 1) ? 1 : 0;
  } else if (t > Tsalta2) { const ida = su(tr(t, Tsalta2, Tgolpe2 - 0.02)); y = mez(FY, LY, ida); alas = ida < 1 ? 1 : 0; }
  moscaArriba(g, FX, y, FS, 0, { t, alas });
  // la primera mano: rápida, sobre la mosca; falla
  const u1 = t < Tgolpe1 ? Math.pow(tr(t, Tgolpe1 - 0.55, Tgolpe1), 2) : 1 - su(tr(t, Tgolpe1 + 0.15, Treb0 + 0.2));
  manoCae(g, FX, FY, u1, t < Tgolpe1 ? 1 : 1 - su(tr(t, Tgolpe1 + 0.15, Treb0 + 0.2)));
  const fallo = tr(t, Tgolpe1, Tgolpe1 + 0.5);
  if (fallo > 0 && fallo < 1) { g.save(); g.strokeStyle = `rgba(255,60,40,${0.9 * (1 - fallo)})`; g.lineWidth = 12; g.beginPath(); g.arc(FX, FY, 200 + 260 * entra(fallo), 0, TAU); g.stroke(); g.restore(); }
  // la segunda: a la diana, justo cuando llega la mosca
  const u2 = Math.pow(tr(t, Tgolpe2 - 0.6, Tgolpe2), 1.6);
  manoCae(g, LX, LY, u2, 1);
  const zas = tr(t, Tgolpe2, Tgolpe2 + 0.5);
  if (zas > 0 && zas < 1) {
    k.brillo(g, LX, LY, 900, "255,210,90", 0.8 * (1 - zas));
    g.save(); g.strokeStyle = `rgba(255,220,120,${0.9 * (1 - zas)})`; g.lineWidth = 12; g.beginPath(); g.arc(LX, LY, 220 + 300 * entra(zas), 0, TAU); g.stroke(); g.restore();
  }
  const vg = g.createLinearGradient(0, 200, 0, 600); vg.addColorStop(0, "rgba(15,8,4,0.5)"); vg.addColorStop(1, "rgba(15,8,4,0)");
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 600);
}
