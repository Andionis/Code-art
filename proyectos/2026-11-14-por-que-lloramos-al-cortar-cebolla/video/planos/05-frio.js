// «Por eso una cebolla fría hace llorar menos: el frío frena la mezcla. Así que no lloras de pena: lloras porque la
//  cebolla se defiende. Envíaselo a un amigo que le pueda interesar.»
// La tabla otra vez (la misma del hook), una sola cámara hasta el final. Se entra con un corte en «Por».
// - «fría»: la cebolla se cubre de escarcha y le cae un vaho frío. «llorar»: la mano baja el cuchillo y la parte;
//   «menos»: solo sube un hilito verde. «frena»: el hilito se para y se congela en cristalitos.
// - «Así que»: la escarcha se va. «pena»: cae una lágrima. «defiende»: las mitades sueltan su chorro verde hacia la
//   cámara, como en el hook.
// - «Envíaselo»: la cámara se aleja hasta ver la tabla entera, con las mitades y el cuchillo apoyado.
import * as k from "#kit";
import { v } from "#voz";
import { cocina, tabla, cebolla, mitad, cuchillo, manoCuchillo, lagrima, salpica, hilo, chorro, nubeGas, velo, vista, GAS } from "../mundo.js";

export const desde = (v) => v.frase(9).inicio;
export const entrada = "corte";
const { suave: su, tramo: tr, mez, entra, azar } = k;
const f9 = v.frase(9), f10 = v.frase(10), f11 = v.frase(11);
const T0 = f9.inicio, Tfria = f9.t("fria"), Tllo = f9.t("llorar"), Tmen = f9.t("menos"), Tfrena = f9.t("frena"), Tmez = f9.t("mezcla");
const Tasi = f10.inicio, Tpena = f10.t("pena"), Tdef = f10.t("defiende");
const Tenv = f11.inicio, Tami = f11.t("amigo");
const CX = 540, CY = 1150, S = 300, SUELO = CY + 0.86 * S;
export const Tgolpe = Tllo + 0.05;
const az = azar(55);
const VAHO = Array.from({ length: 14 }, () => ({ x: (az() - 0.5) * 2, f: az() * 6, r: 0.4 + az() * 0.5 }));
const CRIST = Array.from({ length: 26 }, () => ({ q: az(), dx: (az() - 0.5) * 70, r: 8 + az() * 14, a: az() * 3 }));
export const Tlagrima = Tpena - 0.35, Tcae = Tlagrima + 0.5;

const cam = (t) => {
  const sacude = 10 * k.pulso(t, Tgolpe + 0.03, 0.06) * Math.sin(t * 90);
  let z = mez(1.15, 1.05, su(tr(t, T0, Tfria + 0.4)));
  z = mez(z, 1.25, su(tr(t, Tdef - 0.4, Tdef + 0.1)));
  z = mez(z, 0.9, su(tr(t, Tenv, Tami + 0.6)));
  return { x: 540 + sacude, y: mez(1100, 1060, su(tr(t, Tdef - 0.4, Tdef + 0.1))) + 40 * su(tr(t, Tenv, Tami + 0.6)), z };
};

export function dibuja(g, t) {
  const c = cam(t);
  const frio = su(tr(t, Tfria - 0.2, Tfria + 0.5)) * (1 - su(tr(t, Tasi, Tasi + 0.7)));
  g.save(); vista(g, c.x, c.y, c.z);
  cocina(g, t, 1 - 0.5 * frio); tabla(g);
  // un tinte frío en toda la escena
  if (frio > 0) { g.fillStyle = `rgba(120,170,230,${0.18 * frio})`; g.fillRect(-500, -200, 2100, 2600); }
  const abre = entra(tr(t, Tgolpe, Tgolpe + 0.55)), sep = 210 * abre;
  const sg = g.createRadialGradient(CX, SUELO, 10, CX, SUELO, 420);
  sg.addColorStop(0, "rgba(30,12,4,0.55)"); sg.addColorStop(1, "rgba(30,12,4,0)");
  g.save(); g.translate(CX, SUELO); g.scale(1 + abre * 0.5, 0.22); g.translate(-CX, -SUELO); g.fillStyle = sg; g.beginPath(); g.arc(CX, SUELO, 420, 0, 6.283); g.fill(); g.restore();
  if (t < Tgolpe) cebolla(g, CX, CY, S, { frio });
  else {
    const gira = 0.15 + 0.85 * abre, rebote = Math.sin(tr(t, Tgolpe, Tgolpe + 0.5) * Math.PI) * 30;
    mitad(g, CX - 20 - sep, CY + 30 * abre - rebote, S, -1, gira, { ang: -0.12 * abre, frio });
    mitad(g, CX + 20 + sep, CY + 30 * abre - rebote, S, 1, gira, { ang: 0.12 * abre, frio });
  }
  // el vaho frío que cae por la cebolla
  if (frio > 0) {
    g.save(); g.globalCompositeOperation = "screen";
    for (const b of VAHO) {
      const u = ((t * 0.35 + b.f) % 1), x = CX + b.x * S * 0.9, y = CY - S + u * S * 1.9, r = S * b.r;
      const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, `rgba(220,240,255,${0.22 * frio * Math.sin(u * Math.PI)})`); gr.addColorStop(1, "rgba(220,240,255,0)");
      g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, 6.283); g.fill();
    }
    g.restore();
  }
  // el cuchillo en la mano: baja en «llorar» y se va
  const baja = tr(t, Tgolpe - 0.25, Tgolpe), sube = su(tr(t, Tgolpe + 0.15, Tgolpe + 0.7));
  const ANG = 0.3, hyG = SUELO + 160 * Math.tan(ANG) + 40;
  const hy = mez(mez(hyG - 1500, hyG, entra(baja)), hyG - 1500, sube), hx = 690 + 260 * sube;
  if (t > Tgolpe - 0.3 && hy > hyG - 1450) { cuchillo(g, hx, hy, 0.95, ANG); manoCuchillo(g, hx, hy, 0.95, ANG); }
  // al final, el cuchillo apoyado en la tabla
  const apoya = su(tr(t, Tenv, Tenv + 0.6));
  if (apoya > 0) { g.save(); g.globalAlpha *= apoya; cuchillo(g, 860, 1640, 0.7, -0.08); g.restore(); }
  // «menos»: un solo hilito, que en «frena» se para y se congela
  const xH = CX + 150, yH = CY - 60;
  if (t > Tmen - 0.4 && t < Tasi + 0.5) {
    const tc = Math.min(t, Tfrena + 0.3), hel = su(tr(t, Tfrena, Tfrena + 0.5));
    g.save(); g.globalAlpha *= 1 - hel * 0.85 - su(tr(t, Tasi, Tasi + 0.5)) * 0.15;
    hilo(g, tc, xH, yH, Tmen - 0.4, 3.2, 34, 30, 380, 1.6, 3, "source-over");
    g.restore();
    if (hel > 0) {
      g.save(); g.strokeStyle = `rgba(235,248,255,${0.9 * (1 - su(tr(t, Tasi, Tasi + 0.6)))})`; g.lineWidth = 4; g.lineCap = "round";
      for (const cr of CRIST) {
        if (cr.q > hel) continue;
        const p = cr.q * 0.55, x = xH + 30 * p + Math.sin(p * 5 + 3 * 1.7 + tc * 2) * 30 * 0.9 * p + cr.dx * 0.5, y = yH - 380 * p;
        g.save(); g.translate(x, y); g.rotate(cr.a);
        for (let i = 0; i < 3; i++) { g.rotate(Math.PI / 3); g.beginPath(); g.moveTo(-cr.r, 0); g.lineTo(cr.r, 0); g.stroke(); }
        g.restore(); k.brillo(g, x, y, cr.r * 5, "azul", 0.5);
      }
      g.restore();
    }
  }
  g.restore();
  // «pena»: una lágrima cae a la tabla
  if (t > Tlagrima && t < Tcae) { const u = tr(t, Tlagrima, Tcae); lagrima(g, 300, mez(-250, 1560, u * u), 100, 1.2 + u * 0.8); }
  salpica(g, 300, 1620, 80, t - Tcae, 7);
  // «defiende»: el chorro verde hacia la cámara, como en el hook; se aclara antes de «Envíaselo»
  chorro(g, t, 540, 1150, Tdef - 0.12);
  nubeGas(g, t, 0.5 * su(tr(t, Tdef, Tdef + 0.4)) * (1 - su(tr(t, Tdef + 0.5, Tenv - 0.05))), 540, 1000);
  k.brillo(g, 540, 1100, 1300, GAS, 0.35 * k.pulso(t, Tdef + 0.05, 0.12));
  velo(g, 0.35);
}
