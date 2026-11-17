// «Las estrellas fabrican elementos apretando átomos en su centro: hidrógeno, helio, carbono... hasta el hierro.
// Pero ahí se atascan: para hacer algo más pesado, como el oro, no les alcanza la fuerza.»
// - Corte en «Las»: una estrella amarilla enorme que hierve; la cámara se lanza hacia ella y entra en «apretando».
// - Dentro: el centro naranja que hierve, lleno de bolitas que corren (átomos de hidrógeno).
// - «hidrógeno»: un protón llega al medio y se queda. «helio», «carbono», «hierro»: en cada nombre, otro racimo choca
//   contra él con un destello y el núcleo crece (1, 4, 12, 56 bolitas). El hierro, más gris.
// - «Pero ahí se atascan»: la cámara se aleja un poco; otro hierro choca contra el primero y rebota, sin destello;
//   alrededor aparecen más hierros.
// - «algo más pesado, como el oro»: arriba, un racimo de oro fantasma, enorme, que no llega a formarse.
// - «no les alcanza la fuerza»: los dos hierros se empujan y no se juntan; el oro se deshace. Reposa antes del final.
import * as k from "#kit";
import { v } from "#voz";
import { centroEstrella, racimo, veloArriba, ORO_RGB } from "../mundo.js";

export const desde = "las";
export const entrada = "corte";

const { suave, tramo, entra, sale, pulso } = k;
const f3 = v.frase(3), f4 = v.frase(4);
const Tlas = f3.inicio, Tapr = f3.t("apretando"), Th = f3.t("hidrogeno"), The = f3.t("helio"), Tc = f3.t("carbono"), Tfe = f3.t("hierro");
const Tpero = f4.inicio, Tatas = f4.t("atascan"), Tpes = f4.t("pesado"), Toro = f4.t("oro"), Tno = f4.t("no"), Tfuerza = f4.t("fuerza"), Tfin = f4.fin;

// ---------------------------------------------------------------- fuera: la estrella a la que se entra
const cielo = k.cielo(12, 1500, [0, 0, 0], 300, 20);
const camFuera = k.mira([0, 0, 10], [0, 0, 0]);
const radFuera = (t) => Math.exp(k.claves([[Tlas - 1, Math.log(380)], [Tlas, Math.log(470)], [Tapr, Math.log(1100)], [Tapr + 0.55, Math.log(5200)]])(t));
const dentro = (t) => suave(tramo(t, Tapr + 0.15, Tapr + 0.55));

// ---------------------------------------------------------------- dentro: el plasma (hidrógeno que corre)
const az = k.azar(21);
const plasma = Array.from({ length: 70 }, () => ({ x: az() * 1300 - 110, y: az() * 2100 - 90, vx: (az() - 0.5) * 900, vy: (az() - 0.5) * 900, b: 14 + az() * 14, f: az() }));

// ---------------------------------------------------------------- el núcleo que crece
const pasos = [
  { T: Th, nombre: "H", viene: null },
  { T: The, nombre: "He", viene: { nombre: "H", de: [-1, 0.25] } },
  { T: Tc, nombre: "C", viene: { nombre: "He", de: [1, -0.3] } },
  { T: Tfe, nombre: "Fe", viene: { nombre: "C", de: [-0.9, -0.5] } },
];
const CX = 540, CY = 1130;
// después de «Pero»: los bolitas se hacen más pequeñas (la cámara se aleja) y el núcleo se corre a la izquierda
const bMain = (t) => k.mez(78, 40, suave(tramo(t, Tpero, Tatas - 0.2)));
const xMain = (t) => k.mez(CX, 360, suave(tramo(t, Tpero, Tatas - 0.2)));
// el segundo hierro: entra desde la derecha, choca en «atascan» y rebota
const x2 = k.claves([[Tatas - 0.75, 1400], [Tatas, 712], [Tatas + 0.55, 770], [Tno, 770], [Tfuerza, 748], [Tfuerza + 0.5, 775]]);
const empuje = (t) => suave(tramo(t, Tno, Tfuerza)) * (1 - suave(tramo(t, Tfuerza, Tfuerza + 0.5)));
// más hierros al fondo, que se juntan en el centro de la estrella
const fondoFe = Array.from({ length: 6 }, (_, i) => ({ x: [140, 950, 130, 950, 420, 680][i], y: [1520, 1560, 760, 740, 1640, 1660][i], t0: Tpero + 0.4 + i * 0.22, giro: az() * 6 }));

export function dibuja(g, t) {
  const din = dentro(t);
  // ---- fuera
  if (din < 1) {
    k.fondo(g, camFuera);
    k.estrellas(g, camFuera, null, cielo);
    k.estrella(g, "amarilla", 540, 1050, radFuera(t), t * 0.15, 0.7);
  }
  // ---- dentro
  if (din > 0) {
    centroEstrella(g, t, din, 540, CY);
    g.save(); g.globalAlpha = din;
    // el plasma: bolitas que corren y chocan sin parar (salen por un borde y entran por el otro, siempre apagándose antes)
    for (const p of plasma) {
      const f = (p.f + (t - Tapr) * 0.5) % 1;
      const x = p.x + p.vx * f, y = p.y + p.vy * f;
      g.globalAlpha = din * Math.sin(Math.PI * f) * 0.85;
      racimo(g, "H", x, y, p.b, 0);
    }
    g.restore();
    // los hierros del fondo
    for (const q of fondoFe) {
      const u = entra(tramo(t, q.t0, q.t0 + 0.6));
      if (u <= 0) continue;
      g.save(); g.globalAlpha = u * 0.85;
      racimo(g, "Fe", q.x + (540 - q.x) * 0.06 * u, q.y, 20, q.giro + t * 0.3, 0.55);
      g.restore();
    }
    // el oro fantasma: aparece en «pesado» y en «oro»; se deshace en «no les alcanza la fuerza»
    const ap = suave(tramo(t, Tpes - 0.1, Toro + 0.1)), des = suave(tramo(t, Tno, Tfuerza + 0.35));
    if (ap > 0 && des < 1) {
      k.brillo(g, 540, 720, 1100, ORO_RGB, 0.7 * ap * (1 - des));
      g.save(); g.globalAlpha = 0.72 * ap;
      racimo(g, "Au", 540, 720, 34 * (0.8 + 0.2 * ap), t * 0.25, 0, 1, des);
      g.restore();
    }
    // el núcleo principal
    let paso = null;
    for (const p of pasos) if (t >= p.T - 0.02) paso = p;
    if (paso || t > Th - 0.6) {
      const b = bMain(t), x = xMain(t) - 14 * empuje(t) * (1 + 0.15 * Math.sin(t * 31)), gris = 0.7 * suave(tramo(t, Tfe, Tfe + 0.3));
      // lo que llega en cada paso (acelera hasta chocar)
      for (const p of pasos) {
        if (t >= p.T - 0.02 || t < p.T - 0.55) continue;
        const u = sale(tramo(t, p.T - 0.55, p.T));
        if (!p.viene) { racimo(g, "H", k.mez(-120, CX, entra(tramo(t, p.T - 0.55, p.T))), k.mez(1500, CY, entra(tramo(t, p.T - 0.55, p.T))), b, t); continue; }
        racimo(g, p.viene.nombre, CX + p.viene.de[0] * 700 * (1 - u), CY + p.viene.de[1] * 700 * (1 - u), b, t * 1.5);
      }
      if (paso) {
        const crece = 1 + 0.18 * pulso(t, paso.T + 0.08, 0.12);
        if (paso.viene) k.brillo(g, x, CY, 900, "255,244,210", 0.9 * pulso(t, paso.T + 0.03, 0.12));
        racimo(g, paso.nombre, x, CY, b * crece, t * 0.4, gris);
        if (paso.viene) k.fogonazo(g, x, CY, (t - paso.T) * 1.6, 650, "255,236,190");
      }
      // el segundo hierro
      if (t > Tatas - 0.75) {
        const x2b = x2(t) + 14 * empuje(t) * (1 + 0.15 * Math.sin(t * 29 + 1));
        racimo(g, "Fe", x2b, CY + 10, bMain(t), -t * 0.4 + 2, 0.7);
      }
    }
    veloArriba(g, 0.5 * din);
  }
}

// Para el sonido.
export const fusiones = pasos.filter((p) => p.viene).map((p) => p.T);
export const golpeHierro = Tatas;
export const finEscena = Tfin;
