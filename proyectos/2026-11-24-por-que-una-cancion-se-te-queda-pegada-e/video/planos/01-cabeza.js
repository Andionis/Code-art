// «¿Por qué una canción se te queda pegada en la cabeza y no hay forma de sacarla?»
// - Fotograma 0: la cámara vuela entre notas de neón gigantes que pasan a toda velocidad.
// - «canción»: las notas giran en remolino hacia el centro. «pegada»: se meten todas en un punto, con un fogonazo.
// - Hacia «cabeza»: la cámara se aleja y ese punto era la oreja de una cabeza de luz; las notas entran y giran dentro.
// - «sacarla»: una nota se lanza hacia la frente, choca con la pared y rebota al bucle.
import * as k from "#kit";
import { v } from "#voz";
import { NEON, cabeza, fondo, nota, OREJA, CEREBRO, velo } from "../mundo.js";

export const desde = 0;

const { suave: su, tramo: tr, mez, azar, F } = k;
const f1 = v.frase(1);
const Tcan = f1.t("cancion"), Tpeg = f1.t("pegada"), Tcab = f1.t("cabeza"), Tsac = f1.t("sacarla");
export const momentos = { pegada: Tpeg + 0.05, cabeza: Tcab, choque: Tsac + 0.05 };

// la cabeza, ya alejada: (0,0) propio en HX, HY; S píxeles por unidad
const HX = 480, HY = 1060, S = 1000;
const orejaFinal = [HX + OREJA[0] * S, HY + OREJA[1] * S];
// el zoom: de muy cerca de la oreja (10) a la cabeza entera (1)
const zoom = (t) => Math.exp(mez(Math.log(11), 0, su(tr(t, Tpeg + 0.02, Tcab + 0.35))));
const orejaPantalla = (t) => {
  const u = su(tr(t, Tpeg + 0.02, Tcab + 0.35));
  return [mez(540, orejaFinal[0], u), mez(960, orejaFinal[1], u)];
};
// un punto propio de la cabeza en pantalla
const enPantalla = (t, lx, ly) => {
  const z = zoom(t), o = orejaPantalla(t);
  return [o[0] + (lx - OREJA[0]) * S * z, o[1] + (ly - OREJA[1]) * S * z];
};

// lo que avanza la cámara entre las notas: muy deprisa y frena al llegar a «pegada»
const vel = (t) => 26 * (1 - su(tr(t, 0.1, Tpeg + 0.1))) + 1;
const PASOS = []; for (let tt = 0, d = 0; tt < 6; tt += 1 / 120) { PASOS.push(d); d += vel(tt) / 120; }
const avance = (t) => PASOS[Math.max(0, Math.min(PASOS.length - 1, Math.round(t * 120)))];

const az = azar(9001);
const CAMPO = Array.from({ length: 110 }, (_, i) => {
  let x = (az() - 0.5) * 12, y = (az() - 0.5) * 20;
  if (Math.abs(x) < 0.8 && Math.abs(y) < 0.8) x += 1.5;
  return { x, y, z: 1.5 + az() * 60, c: NEON[i % NEON.length], ang: (az() - 0.5) * 0.9, tipo: Math.floor(az() * 3), giro: (az() - 0.5) * 2 };
});

// las notas del bucle: salen de la oreja y se ponen a girar dentro del cerebro
const BUCLE = Array.from({ length: 12 }, (_, i) => ({
  nace: Tpeg + 0.05 + i * 0.09, th0: Math.PI * 0.15 + (i / 12) * 6.2832, c: NEON[i % NEON.length],
  tipo: i % 3, m: 0.62 + (i % 3) * 0.14, r: 0.032 + (i % 4) * 0.004,
}));
const W = 2.1; // la velocidad del bucle (rad/s)
// antes del corte, el bucle frena y reposa: un tiempo propio que se para
const PA = Tsac + 0.5, PB = f1.fin + 0.3;
const tb = (t) => { if (t < PA) return t; const x = Math.min(t, PB) - PA, L = PB - PA; return PA + x - (x * x) / (2 * L); };
const posBucle = (q, t) => {
  const th = q.th0 + W * (tb(t) - q.nace);
  return [CEREBRO.x + Math.cos(th) * CEREBRO.rx * q.m, CEREBRO.y + Math.sin(th) * CEREBRO.ry * q.m];
};

export function dibuja(g, t) {
  const z = zoom(t), o = orejaPantalla(t);
  fondo(g, o[0], o[1]);
  // la cabeza (se ve en cuanto la cámara empieza a alejarse)
  const vis = su(tr(t, Tpeg - 0.1, Tpeg + 0.4));
  if (vis > 0) {
    const c = enPantalla(t, 0, 0);
    cabeza(g, c[0], c[1], S * z, { al: vis, brilloCerebro: 0.4 + 0.6 * su(tr(t, Tcab - 0.2, Tcab + 0.5)) + 0.4 * k.pulso(t, Tsac + 0.05, 0.15) });
  }
  // el campo de notas, que vuela hacia la cámara y luego se arremolina hacia la oreja
  const d = avance(t), atrae = su(tr(t, Tcan - 0.1, Tpeg + 0.05));
  if (atrae < 0.999) {
    const cosas = [];
    for (const q of CAMPO) {
      const rel = q.z - d;
      if (rel < 0.35) continue;
      let px = (F * q.x) / rel, py = (F * q.y) / rel;
      const ang = atrae * 2.6 + q.giro * atrae, enc = Math.pow(1 - atrae, 1.4);
      const rx = (px * Math.cos(ang) - py * Math.sin(ang)) * enc, ry = (px * Math.sin(ang) + py * Math.cos(ang)) * enc;
      const r = ((F * 0.32) / rel) * (1 - 0.6 * atrae);
      const al = Math.min(1, (rel - 0.35) / 0.6) * Math.min(1, (60 - rel) / 15);
      cosas.push({ z: rel, dibuja: () => nota(g, o[0] + rx, o[1] + ry, r, q.c, q.ang + ang * 0.3, al, q.tipo) });
    }
    k.deLejosACerca(cosas);
  }
  // el fogonazo en «pegada»: todas se meten por la oreja
  k.brillo(g, o[0], o[1], 1600, "255,160,230", 0.6 * k.pulso(t, Tpeg + 0.05, 0.12));
  // las notas del bucle
  for (const [i, q] of BUCLE.entries()) {
    if (t < q.nace) continue;
    const entra = su(tr(t, q.nace, q.nace + 0.55));
    let p = posBucle(q, t);
    // entran desde la oreja
    p = [mez(OREJA[0], p[0], entra), mez(OREJA[1], p[1], entra)];
    // la que intenta salir en «sacarla»: se lanza hacia la frente, choca y vuelve
    if (i === 0) {
      const va = su(tr(t, Tsac - 0.45, Tsac + 0.02)), vuelve = su(tr(t, Tsac + 0.05, Tsac + 0.55));
      const pared = [-0.33, -0.38];
      const u = va * (1 - vuelve);
      p = [mez(p[0], pared[0], u), mez(p[1], pared[1], u)];
    }
    // las notas se aprietan contra la pared en «pegada» (laten un poco con el bucle)
    const s = enPantalla(t, p[0], p[1]);
    const late = 1 + 0.12 * Math.sin(tb(t) * 8 + i);
    nota(g, s[0], s[1], q.r * S * z * late, q.c, 0.25 * Math.sin(tb(t) * 3 + i), entra, q.tipo);
  }
  // el choque con la pared
  const pc = enPantalla(t, -0.36, -0.41);
  k.brillo(g, pc[0], pc[1], 420, "255,230,120", 0.9 * k.pulso(t, Tsac + 0.04, 0.1));
  velo(g, 0.5);
}
