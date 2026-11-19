// «Así que te ve venir, aunque llegues por detrás.»
// Corte en «Así» a la mesa vista desde arriba. La mosca en el centro, mirando hacia arriba.
// - «Así que te ve»: alrededor de ella se abre, girando, su campo de visión: casi un círculo entero.
// - «venir, aunque llegues por detrás»: la mano llega desde abajo a la derecha, por detrás de la mosca; cuando entra en
//   el círculo, esa parte se enciende en rojo; «detrás», el rojo late y sus ojos brillan. Todo quieto antes del corte.
import * as k from "#kit";
import { v } from "#voz";
import { mesaArriba, moscaArriba, mano } from "../mundo.js";

export const desde = (vz) => vz.frase(7).inicio;
export const entrada = "corte";
const { suave: su, tramo: tr, mez, entra } = k;
const TAU = Math.PI * 2;
const f7 = v.frase(7);
const T0 = f7.inicio, Tven = f7.t("venir"), Tdet = f7.t("detras"), Fin = f7.fin;
export const momentos = { campo: T0 + 0.1, detras: Tdet };

const FX = 540, FY = 1000, RAD = 420;
const CIEGO = Math.PI / 2, ANCHO_CIEGO = 0.3;   // el hueco ciego, justo detrás
const AMANO = Math.PI / 2 - 0.62;               // por dónde llega la mano (abajo a la derecha)

export function dibuja(g, t) {
  mesaArriba(g);
  // el campo de visión: se abre girando
  const abre = su(tr(t, T0 + 0.05, Tven - 0.05));
  if (abre > 0) {
    const a0 = -Math.PI / 2, total = (TAU - 2 * ANCHO_CIEGO) * abre;
    g.save();
    for (const [lado, signo] of [[a0, 1], [a0, -1]]) {
      const fin = lado + signo * total / 2;
      g.beginPath(); g.moveTo(FX, FY); g.arc(FX, FY, RAD, Math.min(lado, fin), Math.max(lado, fin)); g.closePath();
      const rg = g.createRadialGradient(FX, FY, 60, FX, FY, RAD); rg.addColorStop(0, "rgba(120,220,255,0.35)"); rg.addColorStop(0.85, "rgba(120,220,255,0.18)"); rg.addColorStop(1, "rgba(160,235,255,0.45)");
      g.fillStyle = rg; g.fill();
    }
    g.strokeStyle = `rgba(190,240,255,${0.7 * abre})`; g.lineWidth = 5;
    g.beginPath(); g.arc(FX, FY, RAD, a0 - total / 2, a0 + total / 2); g.stroke();
    g.restore();
  }
  // la mano, desde abajo a la derecha, hacia la mosca
  const llega = su(tr(t, Tven - 0.3, Tdet + 0.1));
  const hx = FX + Math.cos(AMANO) * mez(1900, 960, llega), hy = FY + Math.sin(AMANO) * mez(1900, 960, llega);
  // la parte del campo por donde entra, en rojo
  const rojo = tr(llega, 0.55, 0.9) + 0.6 * k.pulso(t, Tdet + 0.1, 0.18);
  if (rojo > 0) {
    g.save(); g.globalCompositeOperation = "lighter";
    g.beginPath(); g.moveTo(FX, FY); g.arc(FX, FY, RAD, AMANO - 0.45, AMANO + 0.45); g.closePath();
    const rg = g.createRadialGradient(FX, FY, 60, FX, FY, RAD); rg.addColorStop(0, `rgba(255,60,40,${0.15 * rojo})`); rg.addColorStop(1, `rgba(255,70,50,${0.6 * Math.min(1, rojo)})`);
    g.fillStyle = rg; g.fill(); g.restore();
  }
  moscaArriba(g, FX, FY, 470, 0, { t });
  // los ojos brillan cuando la ve
  const ve = Math.min(1, rojo);
  if (ve > 0) { k.brillo(g, FX - 35, FY - 148, 140, "255,90,60", 0.7 * ve); k.brillo(g, FX + 35, FY - 148, 140, "255,90,60", 0.7 * ve); }
  mano(g, hx, hy, 560, 0.85, 1, AMANO - Math.PI / 2);
  const vg = g.createLinearGradient(0, 200, 0, 600); vg.addColorStop(0, "rgba(15,8,4,0.5)"); vg.addColorStop(1, "rgba(15,8,4,0)");
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 600);
}
