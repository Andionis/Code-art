// «Todo empieza en el techo de tu boca: el paladar.» · «El frío lo golpea, y sus vasos de sangre se cierran de golpe
// para guardar el calor.» · «Un segundo después se abren, y la sangre entra a toda velocidad.»
// La misma cabeza (sigue del hook): la cámara baja y entra en la boca.
// - «paladar»: el paladar se enciende, con sus surcos y sus vasos.
// - «golpea»: una ola de granizado entra por la pajita y choca contra el paladar con un fogonazo azul; se escarcha.
// - «vasos»: la cámara se acerca a los vasos; «cierran»: se estrechan de golpe y la sangre se para. Encima, el calor
//   del cerebro se queda guardado (naranja).
// - «abren»: se ensanchan de golpe; «sangre»: la sangre corre por ellos y por la arteria hacia arriba; la cámara la
//   sigue hacia la frente.
import * as k from "#kit";
import { v } from "#voz";
import { fondo, vista, sinVista, camino2D, cabeza, granizado, velo, vineta, aPantalla, BOCA, PALADAR_C } from "../mundo.js";
import { cam as camHook } from "./01-hook.js";

export const desde = "todo";
export const entrada = "sigue";

const { suave: su, tramo: tr, pulso, entra } = k;
const f3 = v.frase(3), f4 = v.frase(4), f5 = v.frase(5);
const Tbo = f3.t("boca"), Tpal = f3.t("paladar");
const Tgol = f4.t("golpea"), Tvas = f4.t("vasos"), Tcie = f4.t("cierran"), Tcal = f4.t("calor");
const Tabr = f5.t("abren"), Tsan = f5.t("sangre"), Tvel = f5.t("velocidad");
const T0 = f3.inicio - 0.05;

export const cam = camino2D([
  [T0 - 0.2, camHook(T0 - 0.2)],
  [T0, camHook(T0)],
  [Tbo + 0.3, [2.3, -150, 205]],
  [Tgol + 0.6, [2.3, -150, 200]],
  [Tvas + 0.4, [3.4, -140, 168]],
  [Tcie + 0.5, [3.3, -140, 165]],
  [Tabr - 0.1, [2.8, -140, 160]],
  [Tabr + 0.4, [3.0, -140, 165]],
  [Tsan + 0.5, [2.2, -90, 90]],
  [Tvel + 0.3, [1.5, -150, -60]],
  [f5.fin + 0.25, [1.45, -170, -110]],
]);

// la ola de granizado: entra por la pajita y choca contra el paladar
const Tch = Tgol + 0.04;
const az = k.azar(7272);
const OLA = Array.from({ length: 40 }, () => ({ d: az() * 0.25, x: PALADAR_C[0] - 120 + az() * 200, y: PALADAR_C[1] - 5 + az() * 20, r: 6 + az() * 10, gir: az() * 6 }));
function ola(g, t) {
  for (const p of OLA) {
    const u = tr(t, Tch - 0.35 + p.d * 0.5, Tch + p.d * 0.5);
    if (u <= 0 || u >= 1) continue;
    const x = k.mez(BOCA[0] + 6, p.x, entra(u)), y = k.mez(BOCA[1], p.y, entra(u));
    g.save(); g.translate(x, y); g.rotate(p.gir + u * 5); g.globalAlpha *= 1 - u * 0.4;
    g.fillStyle = "rgba(170,230,255,0.95)"; g.beginPath(); g.moveTo(0, -p.r); g.lineTo(p.r * 0.8, 0); g.lineTo(0, p.r); g.lineTo(-p.r * 0.7, 0); g.closePath(); g.fill();
    g.restore();
  }
}

const az2 = k.azar(818);
const CALOR = Array.from({ length: 26 }, () => ({ d: az2() * 1.6, x: PALADAR_C[0] - 150 + az2() * 300, dx: (az2() - 0.5) * 200, dy: (az2() - 0.5) * 70 }));

export const estado = (t) => {
  const cierra = su(tr(t, Tcie - 0.05, Tcie + 0.35)), abre = su(tr(t, Tabr - 0.05, Tabr + 0.3));
  return {
    trans: 1, calor: 1,
    bocaFria: Math.max(0.65 * (1 - su(tr(t, T0, Tbo))) + 0.35, su(tr(t, Tch - 0.05, Tch + 0.3))) * (1 - 0.5 * su(tr(t, Tabr, Tvel))),
    paladar: su(tr(t, Tpal - 0.15, Tpal + 0.35)),
    vasos: 1 - 0.72 * cierra + 1.1 * abre,
    flujo: 0.55 * su(tr(t, Tpal, Tpal + 0.5)) * (1 - cierra) + abre,
    arteria: su(tr(t, Tsan - 0.1, Tsan + 0.4)),
    flujoArteria: su(tr(t, Tsan, Tsan + 0.4)),
  };
};

export function dibuja(g, t) {
  const c = cam(t), e = estado(t);
  fondo(g, t, 1);
  vista(g, ...c);
  granizado(g, t, 0.77, su(tr(t, Tgol - 0.6, Tgol - 0.3)) * (1 - su(tr(t, Tch + 0.2, Tch + 0.6))));
  cabeza(g, t, e);
  ola(g, t);
  // el calor que se guarda: encima del paladar, el naranja del cerebro se queda dentro mientras están cerrados
  const guarda = su(tr(t, Tcie, Tcie + 0.4)) * (1 - su(tr(t, Tabr, Tabr + 0.4)));
  k.brillo(g, PALADAR_C[0], PALADAR_C[1] - 110, 420, "255,150,60", 0.35 * guarda);
  // el calor sube del paladar y se queda guardado arriba: chispas naranjas que suben y se juntan
  for (const p of CALOR) {
    const u = tr(t, Tcie + p.d, Tcie + p.d + 1.4);
    if (u <= 0 || guarda <= 0.01) continue;
    const x = k.mez(p.x, PALADAR_C[0] + p.dx * 0.3, su(u)), y = k.mez(PALADAR_C[1] - 20, PALADAR_C[1] - 95 + p.dy * 0.3, su(u));
    k.brillo(g, x, y, 34, "255,170,70", guarda * Math.min(1, u * 4));
  }
  sinVista(g);
  const [px, py] = aPantalla(c, PALADAR_C[0], PALADAR_C[1]);
  k.fogonazo(g, px, py, t - Tch, 1000, "160,215,255");
  k.fogonazo(g, px, py, t - Tabr, 800, "255,110,90");
  vineta(g);
  velo(g, 0.45);
}

export const momentos = { choque: Tch, cierran: Tcie, abren: Tabr, sangre: Tsan };
