// «Pero la gravedad es tan fuerte que mete los electrones dentro del núcleo, y todo se vuelve neutrones. Ya no queda
// ni un hueco: pegados unos con otros...»
// Dentro de la materia otra vez: una red de átomos, de frente.
// - «Pero la gravedad»: los átomos se aprietan unos contra otros; sus nubes se pisan.
// - «mete los electrones»: los electrones caen en espiral dentro de cada núcleo.
// - «todo se vuelve neutrones»: uno tras otro, cada núcleo destella y sus protones rojos se vuelven neutrones grises.
// - «Ya no queda ni un hueco»: la cámara entra; las bolitas de todos los núcleos se juntan hasta llenar la pantalla,
//   pegadas, sin un hueco, y siguen apretándose. Reposa antes del corte a «canicas».
import * as k from "#kit";
import { v } from "#voz";
import { atomo, particula, RACIMO } from "../mundo.js";

export const desde = "pero";

const { suave: su, tramo: tr, mez, entra, azar } = k;
const f7 = v.frase(7), f8 = v.frase(8);
const T0 = f7.inicio, Tfue = f7.t("fuerte"), Tmete = f7.t("mete"), Tnuc = f7.t("nucleo"), Ttodo = f7.t("todo"), Tneu = f7.t("neutrones");
const Tya = f8.inicio, Thue = f8.t("hueco"), Tpeg = f8.t("pegados"), Tcan = f8.t("canicas");

// la red de átomos: 3 × 5 y una fila más por cada lado, para que no se vea el borde al apretarse
const COLS = 5, FILAS = 7, R = 165;
const sep = (t) => mez(360, 250, su(tr(t, T0, Tfue + 0.3)));
const centroAt = (i, j, t) => [540 + (i - (COLS - 1) / 2) * sep(t), 960 + (j - (FILAS - 1) / 2) * sep(t)];
const RN = R * 0.2;                                       // el núcleo, más grande que en el plano de antes
const ATS = [];
for (let j = 0; j < FILAS; j++) for (let i = 0; i < COLS; i++) ATS.push({ i, j, sem: i * 7 + j * 3, tn: mez(Ttodo - 0.2, Tneu + 0.15, ((i * 3 + j * 5) % 11) / 10) });

// las bolitas: cada una sale de su núcleo y acaba en su sitio de una red apretada que llena la pantalla
const RB = 60, DX = RB * 2.02, DY = RB * 1.75;
const RED = [];
for (let r = -1; r * DY < 1920 + RB; r++) for (let c = -1; c * DX < 1080 + RB * 2; c++) RED.push([c * DX + (r % 2 ? RB : 0), 60 + r * DY]);
const BOLAS = [];
ATS.forEach((a) => RACIMO.forEach(([dx, dy]) => BOLAS.push({ a, dx, dy })));
// a cada sitio de la red, la bolita más cercana que quede libre (al apretar); los sitios que sobran se llenan con
// bolitas que entran desde fuera
const az = azar(13), libres = BOLAS.map((b, n) => n);
const ini = (b) => { const c = centroAt(b.a.i, b.a.j, Tya); return [c[0] + b.dx * RN, c[1] + b.dy * RN]; };
const ASIG = RED.map((p) => {
  let mejor = -1, md = 1e9;
  for (const n of libres) { const q = ini(BOLAS[n]); const d = Math.hypot(q[0] - p[0], q[1] - p[1]); if (d < md) { md = d; mejor = n; } }
  if (mejor >= 0 && md < 400) { libres.splice(libres.indexOf(mejor), 1); return { fin: p, b: BOLAS[mejor] }; }
  const an = Math.atan2(p[1] - 960, p[0] - 540);
  return { fin: p, de: [p[0] + Math.cos(an) * 700, p[1] + Math.sin(an) * 700], f: az() * 6 };
});
const junta = (t) => su(tr(t, Tya - 0.1, Thue + 0.15));

export function dibuja(g, t) {
  g.fillStyle = "#040611"; g.fillRect(0, 0, 1080, 1920);
  const fg = g.createRadialGradient(540, 960, 0, 540, 960, 1200);
  fg.addColorStop(0, "rgba(40,60,140,0.45)"); fg.addColorStop(1, "rgba(10,10,40,0)"); g.fillStyle = fg; g.fillRect(0, 0, 1080, 1920);
  const u = junta(t);
  if (u < 0.02) {
    // los átomos: se aprietan, sus electrones caen dentro y se vuelven neutrones
    for (const a of ATS) {
      const [x, y] = centroAt(a.i, a.j, t);
      const cae = su(tr(t, Tmete - 0.1, Tnuc + 0.3));
      const neutro = su(tr(t, a.tn, a.tn + 0.25));
      atomo(g, x, y, R, t, a.sem, { ratio: RN / R, cae, neutro });
      k.brillo(g, x, y, 300, "blanca", 0.9 * k.pulso(t, a.tn + 0.1, 0.12));
    }
    return;
  }
  // las bolitas se juntan hasta llenar la pantalla, y siguen apretadas, temblando
  const aprieta = su(tr(t, Tpeg - 0.1, Tcan - 0.4));
  for (const s of ASIG) {
    const tiembla = (1 + 2 * aprieta) * (1 - tr(t, Tcan - 0.5, Tcan - 0.25)) * Math.sin(t * 31 + s.fin[0] * 0.05 + s.fin[1] * 0.03);
    let x, y, r;
    if (s.b) {
      const p = ini(s.b);
      x = mez(p[0], s.fin[0], u); y = mez(p[1], s.fin[1], u); r = mez(RN * 0.42, RB, u);
    } else {
      x = mez(s.de[0], s.fin[0], entra(u)); y = mez(s.de[1], s.fin[1], entra(u)); r = RB * entra(u);
    }
    particula(g, x + tiembla, y - tiembla * 0.6, r * (1 + 0.03 * aprieta), "n");
  }
  k.brillo(g, 540, 960, 1500, "azul", 0.35 * u);
  // un velo arriba para que se lea el subtítulo sobre las bolitas
  const vg = g.createLinearGradient(0, 200, 0, 640);
  vg.addColorStop(0, `rgba(3,5,14,${0.7 * u})`); vg.addColorStop(0.6, `rgba(3,5,14,${0.5 * u})`); vg.addColorStop(1, "rgba(3,5,14,0)");
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 640);
}
