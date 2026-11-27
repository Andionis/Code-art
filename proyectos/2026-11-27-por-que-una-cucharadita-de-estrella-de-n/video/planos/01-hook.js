// «¿Por qué una cucharadita de estrella de neutrones pesaría más que una montaña? Una sola cucharadita: más de mil
// millones de toneladas.»
// El valle al atardecer con un balancín gigante: la montaña en un plato, la cucharita en el otro.
// - Fotograma 0: la cucharita, con su luz azul, cae a toda velocidad hacia el plato vacío; el balancín está inclinado
//   hacia la montaña (pesa más, como es normal).
// - En 0,42 s golpea: fogonazo, el balancín da la vuelta de golpe y la montaña sale lanzada hacia arriba, vuelve a caer
//   en su plato, ahora en lo alto, y se queda ahí. En «montaña», la montaña tiembla.
// - «Una sola cucharadita»: la cámara entra hasta la cucharita, que late; en «mil millones» corre la cifra hasta
//   1.000.000.000 t en «toneladas». Reposa antes del corte.
import * as k from "#kit";
import { v } from "#voz";
import { balancin, valle, PIV, BI, CUCH_ALTO, marcaDeAgua } from "../mundo.js";

export const desde = 0;

const { suave: su, tramo: tr, mez, entra } = k;
const f1 = v.frase(1), f2 = v.frase(2);
const Tmont = f1.t("montana"), Tuna = f2.inicio, Tmil = f2.t("mil"), Tton = f2.t("toneladas");
export const Ti = 0.42;                                    // el golpe

// la inclinación: hacia la montaña hasta el golpe; da la vuelta en 0,13 s y rebota un poco
const ANG0 = 0.15, ANG1 = -0.3;
const angulo = (t) => {
  if (t < Ti) return ANG0;
  const u = t - Ti;
  if (u < 0.13) return mez(ANG0, ANG1 - 0.03, entra(u / 0.13));
  return ANG1 - 0.03 * Math.exp(-(u - 0.13) * 7) * Math.cos((u - 0.13) * 26) - 0.006 * k.pulso(t, Tmont + 0.1, 0.12) * Math.sin(t * 60);
};
// la montaña sale volando y vuelve a su plato (dos botes)
const V0 = 1200, G = 3200, T1 = (2 * V0) / G, V1 = 380, T2 = (2 * V1) / G;
export const aterriza = [Ti + 0.08 + T1, Ti + 0.08 + T1 + T2];
const alza = (t) => {
  const u = t - Ti - 0.08;
  if (u < 0) return 0;
  if (u < T1) return V0 * u - 0.5 * G * u * u;
  if (u < T1 + T2) { const w = u - T1; return V1 * w - 0.5 * G * w * w; }
  return 0;
};
const giroM = (t) => {
  const u = t - Ti - 0.08;
  const vuelo = u > 0 && u < T1 + T2 ? 0.16 * Math.sin((u / T1) * Math.PI) : 0;
  return vuelo + 0.025 * k.pulso(t, Tmont + 0.12, 0.14) * Math.sin(t * 55);
};
// dónde queda la cucharita en la pantalla, en su plato, con la inclinación a
const enPlato = (a) => [PIV[0] + Math.cos(a) * (-BI + 30) + Math.sin(a) * CUCH_ALTO, PIV[1] + Math.sin(a) * (-BI + 30) - Math.cos(a) * CUCH_ALTO];
const P0 = enPlato(ANG0), P1 = enPlato(ANG1);
// la caída: desde arriba, cada vez más rápida
const Y0 = 600;
const cayendo = (t) => ({ x: P0[0], y: mez(Y0, P0[1], Math.pow(tr(t, -0.12, Ti), 2)), ang: 0 });
// la cámara: entra hasta la cucharita en «Una sola cucharadita»
const zoom = (t) => su(tr(t, Tuna - 0.05, Tuna + 1.3));
const ESC = 2.3, CEN = [560, 930];

const az = k.azar(77);
const motas = Array.from({ length: 40 }, () => ({ t0: az() * 3, dx: (az() - 0.5) * 90, v: 60 + az() * 80, s: 10 + az() * 22 }));
const polvo = Array.from({ length: 50 }, () => ({ a: -Math.PI * az(), v: 200 + az() * 500, s: 30 + az() * 60 }));

export function dibuja(g, t) {
  const a = angulo(t), z = zoom(t);
  const P = t < Ti ? [P0[0], cayendo(t).y] : enPlato(a);
  // el golpe sacude la imagen un instante
  const sac = t > Ti ? 16 * Math.exp(-(t - Ti) * 12) * Math.sin((t - Ti) * 70) : 0;
  g.save();
  // mientras se hace la pregunta, la cámara entra despacio hacia el balancín
  const s0 = 1 + 0.12 * su(tr(t, Ti + 0.6, Tmont + 0.6)) * (1 - z);
  g.translate(560, 1050); g.scale(s0, s0); g.translate(-560, -1050);
  const s = mez(1, ESC, z);
  g.translate(mez(0, CEN[0] - P1[0] * ESC, z), mez(sac, CEN[1] - P1[1] * ESC, z));
  g.scale(s, s);
  valle(g);
  // late en «estrella», en «neutrones» y, más fuerte, en «toneladas»
  const brilla = 0.5 * k.pulso(t, f1.t("estrella") + 0.1, 0.2) + 0.5 * k.pulso(t, f1.t("neutrones") + 0.1, 0.2) + k.pulso(t, Tton + 0.15, 0.25) + 0.9 * Math.exp(-Math.max(0, t - Ti) * 5) * (t > Ti ? 1 : 0);
  // la estela azul de la caída
  if (t < Ti + 0.05) {
    const c = cayendo(Math.min(t, Ti));
    for (let i = 1; i <= 8; i++) k.brillo(g, c.x, c.y - i * 34, 200 - i * 14, "azul", (0.5 - i * 0.05) * (1 - tr(t, Ti - 0.02, Ti + 0.05)));
  }
  balancin(g, t, a, { alzaMontana: alza(t), giroM: giroM(t), cuch: t < Ti ? cayendo(t) : null, brilla });
  // el golpe: fogonazo y polvo que sale del plato
  if (t > Ti && t < Ti + 1.2) {
    const u = t - Ti;
    k.fogonazo(g, P[0], P[1] + 40, u, 520, "170,200,255");
    for (const q of polvo) {
      const d = q.v * u * (1 - Math.min(1, u) * 0.5), al = 0.4 * (1 - u / 1.2);
      g.fillStyle = `rgba(190,160,170,${al})`; g.beginPath();
      g.arc(P[0] + Math.cos(q.a) * d, P[1] + 60 + Math.sin(q.a) * d * 0.35, q.s * (0.5 + u), 0, Math.PI * 2); g.fill();
    }
  }
  // motas de luz azul que suben de la cucharita, todo el rato
  if (t > Ti) {
    for (const q of motas) {
      const u = ((t - Ti + q.t0) % 3) / 3;
      k.brillo(g, P[0] + q.dx * (0.4 + u), P[1] - 50 - u * q.v * 2, q.s, "azul", 0.8 * Math.sin(u * Math.PI));
    }
  }
  g.restore();
  // la cifra: corre en «mil millones» y para en «toneladas»
  const cuenta = entra(tr(t, Tmil - 0.1, Tton + 0.1)), al = tr(t, Tmil - 0.3, Tmil);
  if (al > 0) k.pastilla(g, 540, 1235, k.fmt(Math.round(1e9 * cuenta)), "t", "170,205,255", al, 104);
  marcaDeAgua(g);
}
