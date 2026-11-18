// «Detrás de tu frente, una arteria se infla como un globo.» · «Y como tu cabeza es una caja cerrada, los
// científicos creen que esa presión es lo que duele.»
// La misma cabeza (sigue del paladar): la cámara llega a la frente siguiendo la sangre.
// - «arteria»: el cerebro se oscurece y la arteria de detrás de la frente brilla; «infla»/«globo»: se hincha, roja,
//   latiendo como un globo que se llena.
// - «caja cerrada»: la cámara se aleja hasta la cabeza entera y el cráneo se enciende alrededor, sin salida.
// - «presión»: ondas rojas salen de la arteria y chocan contra el cráneo; «duele»: la frente estalla en dolor.
import * as k from "#kit";
import { v } from "#voz";
import { fondo, vista, sinVista, camino2D, cabeza, granizado, velo, vineta, aPantalla, caminoCabeza, FRENTE, puntoEn, ARTERIA, GLOBO_U } from "../mundo.js";
import { cam as camAntes, estado as estadoAntes } from "./02-paladar.js";

export const desde = "detras";
export const entrada = "sigue";

const { suave: su, tramo: tr, pulso } = k;
const f6 = v.frase(6), f7 = v.frase(7);
const Tart = f6.t("arteria"), Tinf = f6.t("infla"), Tglo = f6.t("globo");
const Tcaj = f7.t("caja"), Tcer = f7.t("cerrada"), Tpre = f7.t("presion"), Tdue = f7.t("duele");
const T0 = f6.inicio - 0.05;
const CENTRO = puntoEn(ARTERIA, GLOBO_U);   // la parte de la arteria que se infla

export const cam = camino2D([
  [T0 - 0.2, camAntes(T0 - 0.2)],
  [T0, camAntes(T0)],
  [Tart + 0.2, [1.9, -230, -250]],
  [Tglo + 0.5, [2.0, -235, -260]],
  [Tcaj - 0.1, [1.85, -220, -240]],
  [Tcer + 0.6, [1.0, -110, -150]],
  [Tpre - 0.2, [1.05, -130, -160]],
  [Tdue + 0.3, [1.05, -160, -170]],
  [f7.fin + 0.25, [1.05, -160, -170]],
]);

const antes = estadoAntes(T0);
export const estado = (t) => {
  const infla = su(tr(t, Tinf - 0.1, Tglo + 0.3));
  const latido = infla * 0.08 * Math.sin((t - Tinf) * 7.5);
  return {
    ...antes,
    bocaFria: antes.bocaFria,
    paladar: antes.paladar * (1 - 0.5 * su(tr(t, T0, Tart))),
    arteria: 1 + infla + latido,
    flujoArteria: 1,
    oscuro: su(tr(t, Tart - 0.3, Tart + 0.3)) * (1 - 0.5 * su(tr(t, Tcaj, Tcer + 0.4))),
    craneo: su(tr(t, Tcaj, Tcer + 0.3)),
    dolor: 0.9 * su(tr(t, Tdue - 0.08, Tdue + 0.15)) + 0.25 * pulso(t, Tdue + 0.1, 0.12),
  };
};

// las ondas de la presión: anillos rojos que salen de la arteria y chocan contra el cráneo
function ondas(g, t) {
  const on = (0.45 * su(tr(t, Tcer + 0.2, Tcer + 0.8)) + 0.55 * su(tr(t, Tpre - 0.3, Tpre + 0.1))) * (1 - su(tr(t, f7.fin, f7.fin + 0.2)));
  if (on <= 0) return;
  g.save(); caminoCabeza(g); g.clip(); g.globalCompositeOperation = "lighter"; g.lineWidth = 14;
  for (let i = 0; i < 4; i++) {
    const u = (((t - Tcer) * 1.2 + i / 4) % 1 + 1) % 1, R = 60 + 420 * u;
    g.strokeStyle = `rgba(255,80,60,${0.85 * on * (1 - u)})`;
    g.beginPath(); g.arc(CENTRO[0], CENTRO[1], R, 0, 6.283); g.stroke();
  }
  g.restore();
}

export function dibuja(g, t) {
  const c = cam(t), e = estado(t);
  fondo(g, t, 1);
  vista(g, ...c);
  granizado(g, t, 0.77, 0);
  cabeza(g, t, e);
  ondas(g, t);
  // el brillo del globo que se infla
  k.brillo(g, CENTRO[0], CENTRO[1], 380, "255,70,60", 0.3 * su(tr(t, Tinf, Tglo + 0.3)) * (0.8 + 0.2 * Math.sin(t * 7.5)));
  sinVista(g);
  const [fx, fy] = aPantalla(c, FRENTE[0] - 30, FRENTE[1]);
  k.fogonazo(g, fx, fy, t - Tdue, 900, "255,90,70");
  vineta(g);
  velo(g, 0.45);
}

export const momentos = { infla: Tinf, globo: Tglo, cerrada: Tcer, presion: Tpre, duele: Tdue };
