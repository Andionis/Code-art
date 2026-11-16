// «El lunes, los empleados abrieron la bóveda y encontraron un hoyo en el piso.
//  No entraron por la puerta: entraron por debajo.»
// La bóveda vacía, con una sola cámara.
// - «El lunes»: la bóveda vacía y a oscuras; la puerta redonda cerrada al fondo; el hoyo en el piso.
// - «abrieron»: la puerta se abre, entra la luz blanca y se ven dos empleados en la puerta; se encienden los tubos.
// - «encontraron un hoyo»: la cámara va hasta el hoyo y mira dentro.
// - «No entraron por la puerta»: mira atrás, a la puerta abierta.
// - «entraron por debajo»: se lanza por el hoyo, baja por el pozo y queda en el túnel, mirando hacia la casa. Reposa.
import * as k from "#kit";
import { v } from "#voz";
import { BOV, PISO, PUERTA, ZH, aCam, caraBoveda, caraTunel, focos, lamparas, luzBoveda, luzTunel, pinta, puerta, varillas, velo } from "../mundo.js";

export const desde = (v) => v.frase(10).inicio;
export const entrada = "corte";

const { suave: su, tramo: tr, mez, mezV, CX, CY, F } = k;
const f10 = v.frase(10), f11 = v.frase(11);
const Tabr = f10.t("abrieron"), Tenc = f10.t("encontraron"), Thoy = f10.t("hoyo"), Tpue = f11.t("puerta"), Tdeb = f11.t("debajo"), Tent2 = f11.t("entraron", 2);
export const momentos = { abre: Tabr + 0.05, luces: Tabr + 0.35, hoyo: Thoy, salto: Tent2 + 0.1, cae: Tdeb + 0.4 };

const PUERTA_C = [0, PUERTA.y, BOV.z0];
function camara(t) {
  // claves de posición y de dónde mira
  const A = { pos: [0.3, PISO + 1.75, BOV.z1 - 0.6], mira: [0, PISO + 0.9, BOV.z0] };
  const B = { pos: [0.15, PISO + 1.45, ZH + 1.35], mira: [0, PISO - 0.4, ZH - 0.1] };
  const C = { pos: [0.1, PISO + 1.4, ZH + 1.0], mira: PUERTA_C };
  const D = { pos: [0, PISO - 0.6, ZH], mira: [0, PISO - 6, ZH + 0.6] };
  const E = { pos: [0, 0.02, ZH + 0.6], mira: [0, -0.05, ZH + 10] };
  const u1 = su(tr(t, Tenc - 0.4, Thoy + 0.1)), u2 = su(tr(t, f11.inicio - 0.05, Tpue + 0.1));
  const u3 = su(tr(t, Tent2 - 0.1, Tdeb + 0.1)), u4 = su(tr(t, Tdeb, Tdeb + 0.75));
  let pos = A.pos, mi = A.mira;
  // se acerca despacio mientras se abre
  pos = mezV(pos, [0.3, PISO + 1.75, BOV.z1 - 1.4], su(tr(t, f10.inicio, Tenc)));
  pos = mezV(pos, B.pos, u1); mi = mezV(mi, B.mira, u1);
  pos = mezV(pos, C.pos, u2); mi = mezV(mi, C.mira, u2);
  pos = mezV(pos, D.pos, u3); mi = mezV(mi, D.mira, u3);
  pos = mezV(pos, E.pos, u4); mi = mezV(mi, E.mira, u4);
  // nunca mirar justo hacia abajo
  const d = [mi[0] - pos[0], mi[1] - pos[1], mi[2] - pos[2]], hz = Math.hypot(d[0], d[2]);
  if (hz < 0.12 * Math.abs(d[1])) mi = [mi[0], mi[1], pos[2] + 0.12 * Math.abs(d[1]) * (d[2] >= 0 ? 1 : -1)];
  return k.mira(pos, mi);
}

// los dos empleados en la puerta: siluetas contra la luz
function empleados(g, cam, al) {
  if (al <= 0) return;
  for (const [x, h] of [[-0.35, 1.72], [0.4, 1.62]]) {
    const pie = aCam(cam, [x, PISO, BOV.z0 - 0.4]), cab = aCam(cam, [x, PISO + h, BOV.z0 - 0.4]);
    if (pie[2] < 0.1) continue;
    const X = CX + (F * pie[0]) / pie[2], Y = CY - (F * pie[1]) / pie[2], Yc = CY - (F * cab[1]) / cab[2], H = Y - Yc;
    g.save(); g.globalAlpha *= al; g.fillStyle = "#1a2228";
    g.beginPath(); g.arc(X, Yc + H * 0.09, H * 0.09, 0, 6.283); g.fill();
    k.redondo(g, X - H * 0.14, Yc + H * 0.19, H * 0.28, H * 0.42, H * 0.06); g.fill();
    g.fillRect(X - H * 0.11, Yc + H * 0.58, H * 0.09, H * 0.42); g.fillRect(X + H * 0.02, Yc + H * 0.58, H * 0.09, H * 0.42);
    g.restore();
  }
}

export function dibuja(g, t) {
  const cam = camara(t);
  const abre = su(tr(t, Tabr - 0.05, Tabr + 0.8)), enc = mez(0.3, 1, su(tr(t, Tabr + 0.25, Tabr + 0.6)));
  g.fillStyle = "#050302"; g.fillRect(0, 0, 1080, 1920);
  const lb = luzBoveda(enc, 0);
  const lt = (P, c) => luzTunel(P, c, 1, 0);
  if (cam.p[1] < PISO) {
    pinta(g, cam, caraBoveda, lb, { lejos: 30 });
    lamparas(g, cam, enc);
    pinta(g, cam, caraTunel, lt, { lejos: 30, niebla: [8, 4, 2] });
    varillas(g, cam, 0.8);
    focos(g, cam, 1);
  } else {
    pinta(g, cam, caraTunel, lt, { lejos: 30, niebla: [8, 4, 2] });
    pinta(g, cam, caraBoveda, lb, { lejos: 30 });
    varillas(g, cam, 0.5 + 0.5 * enc);
    lamparas(g, cam, enc);
    puerta(g, cam, 0.35 + 0.65 * enc, 0, abre);
    empleados(g, cam, su(tr(t, Tabr + 0.4, Tabr + 0.8)));
    // la luz de la puerta abierta
    const P = aCam(cam, PUERTA_C);
    if (P[2] > 0.1) k.brillo(g, CX + (F * P[0]) / P[2], CY - (F * P[1]) / P[2], 2600, "255,248,225", 0.45 * abre);
  }
  velo(g, 0.5);
}
