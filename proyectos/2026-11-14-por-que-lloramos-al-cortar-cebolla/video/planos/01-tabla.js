// «¿Por qué lloras cada vez que cortas una cebolla? La cebolla no te pone triste: te está atacando.»
// La tabla de cortar, una sola cámara.
// - Fotograma 0: el cuchillo ya baja y parte la cebolla enorme; las mitades se abren y salpica jugo hacia la cámara.
// - «lloras»: lágrimas gigantes caen desde arriba y revientan en la tabla, una tras otra, hasta «cebolla».
// - frase 2: la cámara se acerca a las caras cortadas; empiezan a subir hilos verdes; «atacando»: un chorro de gas sale
//   hacia la cámara y llena la pantalla; se aclara antes del corte.
import * as k from "#kit";
import { v } from "#voz";
import { cocina, tabla, cebolla, mitad, cuchillo, manoCuchillo, lagrima, salpica, hilo, nubeGas, chorro, velo, vista, GAS } from "../mundo.js";

export const desde = 0;
const { suave: su, tramo: tr, mez, entra } = k;
const f1 = v.frase(1), f2 = v.frase(2);
const Tllo = f1.t("lloras"), Tcor = f1.t("cortas"), Tceb = f1.t("cebolla");
const Tla = f2.inicio, Tata = f2.t("atacando"), FIN = v.frase(3).inicio;
export const Tgolpe = 0.13;
const CX = 540, CY = 1150, S = 300, SUELO = CY + 0.86 * S;

// las lágrimas: cuándo empiezan a caer, dónde y de qué tamaño
const az = k.azar(4);
export const lagrimas = [
  { t0: Tllo - 0.15, x: 330, r: 110 }, { t0: Tllo + 0.2, x: 790, r: 90 }, { t0: Tllo + 0.55, x: 180, r: 75 },
  { t0: Tcor - 0.3, x: 690, r: 120 }, { t0: Tcor + 0.1, x: 400, r: 85 }, { t0: Tceb, x: 860, r: 100 }, { t0: Tceb + 0.3, x: 560, r: 80 },
].map((l, i) => ({ ...l, yS: 1560 + (i % 3) * 60, dur: 0.5 }));
lagrimas.forEach((l) => (l.llega = l.t0 + l.dur));
// las gotas de jugo que saltan en el corte, hacia la cámara
const JUGO = Array.from({ length: 34 }, () => ({ a: -Math.PI / 2 + (az() - 0.5) * 2.6, v: 0.5 + az(), r: 6 + az() * 16, z: az() }));

const cam = (t) => {
  const sacude = 14 * k.pulso(t, Tgolpe + 0.03, 0.06) * Math.sin(t * 90);
  const z = mez(1, 1.07, su(tr(t, 0.4, Tceb + 0.5))) * mez(1, 1.28, su(tr(t, Tla, Tata)));
  const cy = mez(1080, 1040, su(tr(t, Tla, Tata)));
  return { x: 540 + sacude, y: cy, z };
};

export function dibuja(g, t) {
  const c = cam(t);
  g.save(); vista(g, c.x, c.y, c.z);
  cocina(g, t); tabla(g);
  // la sombra de la cebolla
  const abre = entra(tr(t, Tgolpe, Tgolpe + 0.55)), sep = 210 * abre;
  const sg = g.createRadialGradient(CX, SUELO, 10, CX, SUELO, 420);
  sg.addColorStop(0, "rgba(30,12,4,0.55)"); sg.addColorStop(1, "rgba(30,12,4,0)");
  g.save(); g.translate(CX, SUELO); g.scale(1 + abre * 0.5, 0.22); g.translate(-CX, -SUELO); g.fillStyle = sg; g.beginPath(); g.arc(CX, SUELO, 420, 0, 6.283); g.fill(); g.restore();
  // la cebolla: entera hasta el golpe, luego dos mitades que se abren y se quedan
  if (t < Tgolpe) cebolla(g, CX, CY, S);
  else {
    const gira = 0.15 + 0.85 * abre, rebote = Math.sin(tr(t, Tgolpe, Tgolpe + 0.5) * Math.PI) * 30;
    mitad(g, CX - 20 - sep, CY + 30 * abre - rebote, S, -1, gira, { ang: -0.12 * abre });
    mitad(g, CX + 20 + sep, CY + 30 * abre - rebote, S, 1, gira, { ang: 0.12 * abre });
  }
  // el cuchillo, en la mano de quien corta: de lado, la punta hacia el fondo a la izquierda; baja de golpe por el
  // centro de la cebolla y vuelve a subir
  const baja = tr(t, -0.12, Tgolpe), sube = su(tr(t, Tgolpe + 0.15, Tgolpe + 0.7));
  const ANG = 0.3, hx = 690, hyG = SUELO + 160 * Math.tan(ANG) + 40; // el talón, cuando el filo toca la tabla en el centro
  const hy = mez(mez(hyG - 620, hyG, baja * baja), hyG - 1500, sube), hxx = hx + 260 * sube;
  if (hy > hyG - 1450) {
    cuchillo(g, hxx, hy, 0.95, ANG);
    manoCuchillo(g, hxx, hy, 0.95, ANG);
  }
  // los hilos de gas, de las caras cortadas (desde el final de la frase 1, cada vez más)
  if (t > Tla - 0.3) {
    for (let i = 0; i < 10; i++) {
      const lado = i % 2 ? 1 : -1, t0 = Tla - 0.3 + i * 0.22;
      hilo(g, t, CX + lado * (150 + (i % 3) * 30), CY - 80 + (i % 4) * 40, t0, 2.4, 40, lado * 40, 650, 1, i);
    }
  }
  g.restore();

  // lo que va pegado a la cámara: el jugo que salta y las lágrimas que caen
  const uj = t - Tgolpe;
  if (uj > 0 && uj < 0.8) {
    for (const d of JUGO) {
      const e = entra(Math.min(1, uj / 0.6)), esc = 1 + d.z * 2.5 * e;
      const x = 540 + Math.cos(d.a) * 600 * d.v * e, y = 1100 + Math.sin(d.a) * 700 * d.v * e + 900 * uj * uj;
      lagrima(g, x, y, d.r * 0.7 * esc, 0.4, 1 - tr(uj, 0.45, 0.8));
    }
    k.brillo(g, 540, 1150, 900, "255,250,220", 0.5 * k.pulso(t, Tgolpe + 0.02, 0.06));
  }
  for (const [i, l] of lagrimas.entries()) {
    const u = tr(t, l.t0, l.llega);
    if (t >= l.t0 && t < l.llega) lagrima(g, l.x, mez(-260, l.yS, u * u), l.r, 1.2 + u * 0.8);
    salpica(g, l.x, l.yS + l.r * 0.6, l.r * 0.8, t - l.llega, i + 3);
  }
  // el chorro de gas en «atacando»: llena la pantalla y se aclara antes del corte
  chorro(g, t, 540, 1150, Tata - 0.12);
  const tinte = 0.5 * su(tr(t, Tata, Tata + 0.4)) * (1 - su(tr(t, Tata + 0.5, FIN - 0.1)));
  nubeGas(g, t, tinte, 540, 1000);
  k.brillo(g, 540, 1100, 1300, GAS, 0.35 * k.pulso(t, Tata + 0.05, 0.12));
  velo(g, 0.35);
}
