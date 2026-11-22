// «Tanta, que si la sacaras toda y la repartieras por los continentes, haría una...»
// Corte en «Tanta» al espacio: la Tierra entera, grande, girando despacio.
// - «sacaras»: de los mares sube la sal, una nube de granos blancos que se aparta de la Tierra.
// - «repartieras por los continentes»: los granos vuelven a caer y los continentes se quedan blancos.
//   La Tierra sigue girando, quieta la cámara, hasta el corte en «capa».
import * as k from "#kit";
import { v } from "#voz";
import { tierraSal, grano, velo } from "../mundo.js";

export const desde = "tanta";

const { suave: su, tramo: tr, mez, azar } = k;
const f11 = v.frase(11), T0 = f11.inicio, Tsac = f11.t("sacaras"), Trep = f11.t("repartieras"), Tcon = f11.t("continentes"), Tcorte = f11.t("capa") - 0.04;
export const momentos = { sube: Tsac, cae: Trep, blanco: Tcon };
const CX = 540, CY = 1120, R = 430;
const cam = k.mira([0, 0, 30], [0, 0, 0]), CIELO = k.cielo(71, 1400);
const az = azar(717);
const GR = Array.from({ length: 160 }, (_, i) => { const a = az() * 6.28, d = Math.sqrt(az()) * 0.95; return { x: Math.cos(a) * d, y: Math.sin(a) * d, ang: az() * 6.28, lejos: 1.25 + az() * 0.5, d: az() * 0.3, sem: i }; });

export function dibuja(g, t) {
  k.fondo(g, cam); k.estrellas(g, cam, null, CIELO);
  const entra = k.entra(tr(t, T0 - 0.04, T0 + 0.5));
  const r = R * mez(0.85, 1, entra), gira = 0.42 + (t - T0) * 0.03;
  const salada = su(tr(t, Trep + 0.2, Tcon + 0.5));
  tierraSal(g, CX, CY, r, gira, salada);
  // la sal: sube de los mares (se aleja) y vuelve a caer sobre los continentes
  const sube = su(tr(t, Tsac - 0.15, Tsac + 0.7)), cae = su(tr(t, Trep, Tcon + 0.4));
  if (sube > 0 && cae < 1) for (const q of GR) {
    const u = Math.max(0, Math.min(1, (sube - q.d) / (1 - q.d))) * (1 - Math.max(0, Math.min(1, (cae - q.d) / (1 - q.d))));
    const d = mez(1, q.lejos, u);
    const x = CX + (q.x * r) * d + Math.cos(q.ang) * 260 * u, y = CY + (q.y * r) * d + Math.sin(q.ang) * 260 * u - 120 * u;
    grano(g, x, y, mez(5, 13, u), t, q.sem, Math.min(1, u * 4), 0.7);
  }
  // el destello blanco cuando cae la sal sobre los continentes
  k.brillo(g, CX, CY, r * 2.6, "255,255,255", 0.35 * k.pulso(t, Tcon + 0.1, 0.4));
  velo(g, 0.3);
}
