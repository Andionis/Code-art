// «Pero lo más raro: el aviso viaja por un nervio que también lleva lo que sientes en la frente.» · «Así que tu
// cerebro se confunde, y te duele la frente, no la boca.» · «Por eso casi siempre dura menos de un minuto: en cuanto
// tu boca se calienta, se apaga.»
// La misma cabeza (sigue de la presión).
// - «Pero»: el dolor y el globo bajan; la cámara baja al paladar. «aviso»: una chispa sale del paladar; «nervio»: se
//   enciende el nervio amarillo, con sus ramas. «también lleva... frente»: otra chispa sube por la rama de la frente.
// - «confunde»: la chispa llega al cerebro, que duda (las dos puntas se encienden por turnos, una interrogación);
//   «frente»: la frente estalla en dolor; «no la boca»: la boca, tranquila.
// - «minuto»: un reloj, menos de 1 minuto, que se va llenando. «calienta»: la boca pasa de azul a naranja y la
//   escarcha se derrite. «apaga»: el dolor, el nervio y el globo se apagan.
import * as k from "#kit";
import { v } from "#voz";
import { fondo, vista, sinVista, camino2D, cabeza, granizado, velo, vineta, aPantalla, FRENTE, PALADAR_C, puntoEn, RAMA_FRENTE, RAMA_PALADAR } from "../mundo.js";
import { cam as camAntes, estado as estadoAntes } from "./03-presion.js";

export const desde = "pero";
export const entrada = "sigue";

const { suave: su, tramo: tr, pulso } = k;
const f8 = v.frase(8), f9 = v.frase(9), f10 = v.frase(10);
const Tavi = f8.t("aviso"), Tner = f8.t("nervio"), Ttam = f8.t("tambien"), Tfr1 = f8.t("frente");
const Tcer = f9.t("cerebro"), Tcon = f9.t("confunde"), Tfr2 = f9.t("frente"), Tno = f9.t("no");
const Tmin = f10.t("minuto"), Tcua = f10.t("cuanto"), Tcal = f10.t("calienta"), Tapa = f10.t("apaga");
const T0 = f8.inicio - 0.05;

export const cam = camino2D([
  [T0 - 0.2, camAntes(T0 - 0.2)],
  [T0, camAntes(T0)],
  [Tavi, [1.7, -130, 60]],
  [Tner + 0.3, [1.6, -120, 40]],
  [Tfr1 + 0.2, [1.45, -190, -100]],
  [Tcon + 0.2, [1.25, -120, -130]],
  [Tfr2 + 0.2, [1.25, -170, -120]],
  [Tno + 0.5, [1.0, -150, -40]],
  [Tmin + 0.2, [0.95, -150, -20]],
  [Tcal + 0.3, [1.3, -170, 140]],
  [Tapa + 0.1, [1.25, -170, 110]],
  [f10.fin + 0.2, [1.05, -160, -30]],
]);

const antes = estadoAntes(T0);
// las chispas: [rama, desde, hasta]
const CHISPAS = [[0, Tavi - 0.05, Tner + 0.05], [1, Ttam, Tfr1 + 0.05], [2, Tcer - 0.25, Tcon]];
function chispa(t) {
  for (const [r, a, b] of CHISPAS) if (t >= a && t <= b + 0.1) return [r, su(tr(t, a, b))];
  return null;
}
export const estado = (t) => {
  const baja = su(tr(t, T0, T0 + 0.7)), apaga = su(tr(t, Tapa - 0.3, Tapa + 0.4)), calienta = su(tr(t, Tcua, Tcal + 0.5));
  return {
    ...antes,
    oscuro: antes.oscuro * (1 - baja),
    craneo: antes.craneo * (1 - baja),
    arteria: k.mez(antes.arteria, 1.35, baja) * (1 - apaga) + apaga * 1,
    flujoArteria: 1 - 0.6 * apaga,
    vasos: k.mez(antes.vasos ?? 2, 1, apaga),
    dolor: k.mez(antes.dolor, 0.3, baja) * (1 - su(tr(t, Tavi, Tner))) + 0.95 * su(tr(t, Tfr2 - 0.1, Tfr2 + 0.15)) * (1 - su(tr(t, Tcal - 0.2, Tapa + 0.3))),
    nervio: su(tr(t, Tavi - 0.1, Tner + 0.1)) * (1 - 0.8 * apaga),
    frente: su(tr(t, Ttam + 0.3, Tfr1 + 0.1)) * (1 - apaga),
    chispa: chispa(t),
    bocaFria: antes.bocaFria * (1 - calienta),
    calienta,
  };
};

export function dibuja(g, t) {
  const c = cam(t), e = estado(t);
  fondo(g, t, 1);
  vista(g, ...c);
  granizado(g, t, 0.77, 0);
  cabeza(g, t, e);
  // la boca que se calienta
  k.brillo(g, PALADAR_C[0], PALADAR_C[1] + 30, 600, "255,150,70", 0.85 * e.calienta * (1 - 0.4 * su(tr(t, Tapa, Tapa + 0.6))));
  // el cerebro duda: las dos puntas del nervio se encienden por turnos
  const duda = su(tr(t, Tcon - 0.1, Tcon + 0.2)) * (1 - su(tr(t, Tfr2 - 0.2, Tfr2)));
  if (duda > 0) {
    const s = Math.sin((t - Tcon) * 12);
    const [ax, ay] = puntoEn(RAMA_FRENTE, 1), [bx, by] = puntoEn(RAMA_PALADAR, 0);
    k.brillo(g, ax, ay, 220, "255,240,150", duda * (0.5 + 0.5 * s));
    k.brillo(g, bx, by, 220, "255,240,150", duda * (0.5 - 0.5 * s));
  }
  sinVista(g);
  // la interrogación en el cerebro
  const q = su(tr(t, Tcon - 0.05, Tcon + 0.25)) * (1 - su(tr(t, Tfr2 - 0.3, Tfr2)));
  if (q > 0) {
    const [qx, qy] = aPantalla(c, 40, -280);
    g.save(); g.globalAlpha = q; g.font = "900 220px Figtree"; g.textAlign = "center"; g.textBaseline = "middle";
    g.shadowColor = "rgba(255,220,90,0.9)"; g.shadowBlur = 40; g.fillStyle = "#ffe36a";
    g.translate(qx, qy); g.rotate(0.12 * Math.sin((t - Tcon) * 5)); g.scale(0.7 + 0.3 * q, 0.7 + 0.3 * q); g.fillText("?", 0, 0); g.restore();
  }
  const [fx, fy] = aPantalla(c, FRENTE[0] - 30, FRENTE[1]);
  k.fogonazo(g, fx, fy, t - Tfr2, 900, "255,90,70");
  // el reloj: menos de 1 minuto, con su aro que se va llenando
  const rel = su(tr(t, Tmin - 0.25, Tmin + 0.1)) * (1 - su(tr(t, Tapa + 0.2, f10.fin)));
  if (rel > 0) {
    const x = 790, y = 730;
    k.pastilla(g, x, y, "< 1", "min", "255,236,180", rel, 76);
    g.save(); g.globalAlpha = rel; g.lineCap = "round";
    g.strokeStyle = "rgba(255,255,255,0.15)"; g.lineWidth = 12; g.beginPath(); g.arc(x, y, 135, 0, 6.283); g.stroke();
    g.strokeStyle = "#ffd36a"; g.shadowColor = "rgba(255,200,90,0.9)"; g.shadowBlur = 20;
    g.beginPath(); g.arc(x, y, 135, -Math.PI / 2, -Math.PI / 2 + 1.98 * Math.PI * su(tr(t, Tmin, Tapa))); g.stroke();
    g.restore();
  }
  vineta(g);
  velo(g, 0.45);
}

export const momentos = { aviso: Tavi, nervio: Tner, frente: Tfr1, confunde: Tcon, duele: Tfr2, minuto: Tmin, apaga: Tapa };
