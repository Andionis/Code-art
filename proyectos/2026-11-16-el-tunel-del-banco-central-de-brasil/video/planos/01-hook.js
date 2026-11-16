// «¿Sabías que unos ladrones cavaron un túnel hasta el Banco Central de Brasil y se llevaron 164 millones de reales?
//  Y nadie se dio cuenta hasta el lunes.»
// Una sola cámara, del túnel a la bóveda.
// - Fotograma 0: volando a toda velocidad por el túnel, entre marcos de madera y focos que pasan.
// - «túnel»: frena al final, bajo el pozo; mira arriba y sube por el concreto roto; sale a la bóveda en «Banco».
// - Se echa atrás y se ve la bóveda: estantes llenos de fajos de 50, la puerta redonda al fondo y el hoyo en el piso.
// - «llevaron»: los fajos saltan de los estantes y se van por el hoyo, como por un desagüe; «164 millones»: la cifra corre.
// - «nadie»: la bóveda vacía; las luces bajan. «lunes»: una raya de luz por la rendija de la puerta. Reposa.
import * as k from "#kit";
import { v } from "#voz";
import { BLOQUES, BOV, PISO, POZO, TUN, ZH, caraBoveda, caraTunel, fajo, focos, lamparas, luzBoveda, luzTunel, pinta, puerta, varillas, velo, aCam } from "../mundo.js";

export const desde = 0;

const { suave: su, tramo: tr, mez, mezV, azar, CX, CY, F } = k;
const f1 = v.frase(1), f2 = v.frase(2);
const Ttun = f1.t("tunel"), Tban = f1.t("banco"), Tlle = f1.t("llevaron"), T164 = f1.t("164"), Trea = f1.t("reales");
const Tnad = f2.t("nadie"), Tlun = f2.t("lunes");

const Tfrena = Ttun - 0.1;            // llega bajo el pozo
const Tsale = Tban + 0.12;            // asoma en la bóveda
export const momentos = { pasa: [], sale: Tsale, golpe: Tsale - 0.05 };

// ---------------------------------------------------------------- la cámara
const Z0 = 2.4;
function camara(t) {
  // el viaje: arranca a toda velocidad y frena bajo el pozo
  const u = tr(t, 0, Tfrena), z = Z0 - (Z0 - ZH) * (1 - Math.pow(1 - u, 2.1));
  // sube por el pozo
  const sube = su(tr(t, Tfrena - 0.1, Tsale - 0.32));
  let pos = [0, mez(0.02, PISO + 1.45, sube), z];
  // mira: adelante → arriba → a la bóveda (hacia la puerta)
  const arriba = su(tr(t, Tfrena - 0.55, Tfrena + 0.1));
  let dir = mezV([0, -0.03, -1], [0, 1, -0.55], arriba);
  const vuelve = su(tr(t, Tsale - 0.78, Tsale - 0.2));
  dir = mezV(dir, [0, -0.15, -1], vuelve);
  // se echa atrás para ver la bóveda entera; en la segunda frase, un poco más
  const atras = su(tr(t, Tsale - 0.4, Tsale + 0.9)), mas = su(tr(t, f2.inicio - 0.2, f2.fin + 0.2));
  pos = mezV(pos, [0, PISO + 1.7, BOV.z1 - 0.35], atras);
  pos = mezV(pos, [0.15, PISO + 1.85, BOV.z1 - 0.1], mas);
  const d = Math.hypot(...dir);
  return k.mira(pos, [pos[0] + dir[0] / d, pos[1] + dir[1] / d, pos[2] + dir[2] / d]);
}

// ---------------------------------------------------------------- los fajos que se van
const az = azar(316);
const SALE = BLOQUES.map((b) => mez(Tlle - 0.05, Trea - 0.25, Math.pow(b.sale, 0.85)));
const VUELO = 0.8;
// cada bloque: en su estante; luego vuela al hoyo girando y se hunde
function bloques(t) {
  const caras = [];
  BLOQUES.forEach((b, i) => {
    const t0 = SALE[i], u = tr(t, t0, t0 + VUELO);
    if (u >= 1) return;
    if (u <= 0) { caras.push(...fajo(b.c, b.dim)); return; }
    const A = b.c, C = [A[0] * 0.35, Math.max(A[1], PISO + 1.2) + 0.5, mez(A[2], ZH, 0.5)], B = [0, PISO - 0.5, ZH];
    const w = k.sale(u) * 0.85 + u * 0.15;
    const p = [0, 1, 2].map((j) => (1 - w) * (1 - w) * A[j] + 2 * (1 - w) * w * C[j] + w * w * B[j]);
    if (p[1] < PISO - 0.12) return;
    const s = 1 - (b.piso ? 0.55 : 0.4) * w;
    caras.push(...fajo(p, b.dim.map((x) => x * s), { ry: (b.sem - 0.5) * 6 * w, rx: 2.5 * w * (b.sem > 0.5 ? 1 : -1), rz: 1.5 * w }));
  });
  return caras;
}
// los billetes sueltos que giran alrededor del hoyo antes de caer
const SUELTOS = Array.from({ length: 46 }, () => ({ t0: mez(Tlle + 0.1, Trea - 0.2, az()), a0: az() * 6.28, r0: 0.7 + az() * 1.6, h0: 0.5 + az() * 1.6, gira: az() * 6, dur: 1.0 + az() * 0.6 }));
function sueltos(t) {
  const caras = [];
  for (const s of SUELTOS) {
    const u = tr(t, s.t0, s.t0 + s.dur);
    if (u <= 0 || u >= 1) continue;
    const r = s.r0 * (1 - k.sale(u)) + 0.05, a = s.a0 + u * 5, y = PISO + s.h0 * (1 - u * u) - 0.4 * u * u;
    if (y < PISO - 0.1) continue;
    const c = [Math.cos(a) * r, y, ZH + Math.sin(a) * r];
    caras.push(...fajo(c, [0.3, 0.006, 0.14], { ry: a + s.gira, rx: Math.sin(u * 9 + s.gira) * 0.9 }).slice(0, 1).map((f) => ({ ...f, c: [222, 168, 100], rayas: null })));
  }
  return caras;
}

// ---------------------------------------------------------------- el dibujo
export function dibuja(g, t) {
  const cam = camara(t);
  const enc = 1 - 0.68 * su(tr(t, Tnad - 0.1, Tnad + 0.6));
  const luzPozo = su(tr(t, Tfrena - 0.6, Tfrena)) * 0.7;
  const dentro = cam.p[1] < PISO;
  const lt = (P, c) => luzTunel(P, c, dentro ? 1 : 0.35, dentro ? luzPozo : 0);
  const lb = luzBoveda(enc, 0.5 * (1 - su(tr(t, Tsale, Tsale + 1))));
  g.fillStyle = "#050302"; g.fillRect(0, 0, 1080, 1920);
  const bov = [...caraBoveda, ...bloques(t), ...sueltos(t)];
  if (cam.p[1] < PISO) {
    pinta(g, cam, bov, lb, { lejos: 30 });
    lamparas(g, cam, enc);
    pinta(g, cam, caraTunel, lt, { lejos: 30, niebla: [8, 4, 2] });
    varillas(g, cam, 0.7 + luzPozo * 0.3);
    focos(g, cam, 1);
    g.save(); g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.22; g.drawImage(k.manchas, -200, -200, 1480, 2320); g.restore();
    // la luz blanca que entra por el hoyo
    const H = aCam(cam, [0, PISO, ZH]);
    if (H[2] > 0.1) k.brillo(g, CX + (F * H[0]) / H[2], CY - (F * H[1]) / H[2], 2600 / Math.max(0.6, H[2]), "220,236,255", 0.3 * luzPozo);
  } else {
    pinta(g, cam, caraTunel, lt, { lejos: 30, niebla: [8, 4, 2] });
    pinta(g, cam, bov, lb, { lejos: 30 });
    varillas(g, cam, 0.6 + 0.4 * enc);
    lamparas(g, cam, enc);
    puerta(g, cam, 0.35 + 0.65 * enc, su(tr(t, Tlun - 0.05, Tlun + 0.35)), 0);
    // el resplandor dorado del dinero mientras se va
    const H = aCam(cam, [0, PISO, ZH]);
    if (H[2] > 0.1) k.brillo(g, CX + (F * H[0]) / H[2], CY - (F * H[1]) / H[2], 1400, "255,190,90", 0.35 * k.pulso(t, (Tlle + Trea) / 2, 1.4) * enc);
  }
  // el golpe al salir por el piso: polvo y un fogonazo corto
  // la cifra que corre
  const c = su(tr(t, T164 - 0.15, Trea + 0.1)), al = su(tr(t, T164 - 0.25, T164)) * (1 - su(tr(t, f1.fin + 0.2, f1.fin + 0.6)));
  if (al > 0) k.pastilla(g, 540, 640, "R$ " + k.fmt(Math.round(164 * c) * 1e6), "", "255,214,120", al, 104);
  velo(g, 0.55);
}
