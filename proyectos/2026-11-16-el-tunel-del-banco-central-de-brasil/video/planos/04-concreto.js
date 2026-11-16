// «Al final llegaron justo debajo de la bóveda y rompieron más de un metro de concreto con acero.»
// Sigue el corte del suelo, con la misma cámara que dentro del túnel.
// - «Al final»: la cámara sale del túnel, corre hacia la derecha a lo largo de él y llega bajo el banco: arriba, la
//   bóveda llena de fajos, con su piso gordo de concreto y varillas.
// - «rompieron»: chispas y grietas en el concreto, justo encima del final del túnel. «metro»: la cota «1,1 m».
// - «acero»: se abre el hoyo y los trozos caen al túnel. Reposa antes del corte.
import * as k from "#kit";
import { v } from "#voz";
import { BOV, HOYO, LOSA, SX, SY, T, cota, polvo, seccion } from "../corte.js";
import { velo } from "../mundo.js";
import { camara as camAntes } from "./03-corte.js";

export const desde = "al";
export const entrada = "sigue";

const { suave: su, tramo: tr, mez, azar } = k;
const f6 = v.frase(6), f7 = v.frase(7);
const Tal = f7.inicio, Tbov = f7.t("boveda"), Trom = f7.t("rompieron"), Tmet = f7.t("metro"), Tace = f7.t("acero");
export const momentos = { llega: Tbov, rompe: Trom, golpes: [Trom + 0.1, Trom + 0.45, Trom + 0.8, Tmet + 0.2, Tmet + 0.55], abre: Tace + 0.05 };

const C0 = camAntes(Tal - 1 / 60);
const C1 = { cx: 84.4, cy: -2.3, s: 165 };
function camara(t) {
  const u = su(tr(t, Tal, Tbov + 0.05));
  const s = Math.exp(mez(Math.log(C0.s), Math.log(C1.s), u) - 1.1 * Math.sin(Math.PI * u));
  const lento = 1 + 0.08 * su(tr(t, Tbov, f7.fin + 0.3));
  return { cx: mez(C0.cx, C1.cx, su(tr(t, Tal + 0.1, Tbov))), cy: mez(C0.cy, C1.cy, u), s: s * lento };
}

// los trozos de concreto que caen al túnel
const az = azar(1111);
const TROZOS = Array.from({ length: 14 }, () => ({ x: mez(HOYO.x0 + 0.1, HOYO.x1 - 0.1, az()), y: mez(LOSA.y0 + 0.1, LOSA.y1 - 0.2, az()), r: 0.08 + az() * 0.12, d: az() * 0.25, giro: (az() - 0.5) * 8, n: 5 + Math.floor(az() * 3), sem: az() * 6 }));
function trozos(g, c, t) {
  for (const p of TROZOS) {
    const t0 = Tace + p.d, dt = Math.max(0, t - t0);
    const suelo = T.y0 + p.r * 0.8, y = Math.max(suelo, p.y - 4.9 * dt * dt), toca = y <= suelo;
    const X = SX(c, p.x + (toca ? 0 : dt * 0.3 * (p.sem - 3) / 3)), Y = SY(c, y), r = p.r * c.s, a = toca ? p.giro * 0.4 : p.giro * dt;
    g.save(); g.translate(X, Y); g.rotate(a);
    g.fillStyle = "#a6a9ac"; g.beginPath();
    for (let i = 0; i < p.n; i++) { const an = (i / p.n) * 6.283, rr = r * (0.7 + 0.3 * Math.sin(i * 2.3 + p.sem)); i ? g.lineTo(Math.cos(an) * rr, Math.sin(an) * rr) : g.moveTo(Math.cos(an) * rr, Math.sin(an) * rr); }
    g.closePath(); g.fill(); g.strokeStyle = "rgba(60,60,64,0.8)"; g.lineWidth = 2; g.stroke();
    g.restore();
  }
}

export function dibuja(g, t) {
  const c = camara(t);
  const st = {
    pozo: 1, punta: T.x1, focos: () => 1,
    aire: { t: t - f6.t("aire"), al: 1 },
    grietas: su(tr(t, Trom - 0.05, Tace)),
    hoyo: su(tr(t, Tace - 0.02, Tace + 0.3)),
  };
  seccion(g, c, st, t);
  // la broca: chispas en el concreto mientras rompen
  const rompe = tr(t, Trom - 0.1, Tace + 0.1) > 0 && t < Tace + 0.1;
  if (rompe) {
    const x = (HOYO.x0 + HOYO.x1) / 2, y = mez(LOSA.y0, LOSA.y1, 0.35 * tr(t, Trom, Tace));
    polvo(g, c, x, y, t * 1.7, 1);
    k.brillo(g, SX(c, x), SY(c, y), 160, "255,220,150", 0.5 + 0.35 * Math.sin(t * 60));
  }
  if (t >= Tace) trozos(g, c, t);
  // el polvo al abrirse
  k.brillo(g, SX(c, (HOYO.x0 + HOYO.x1) / 2), SY(c, LOSA.y0), 420, "230,220,200", 0.6 * k.pulso(t, Tace + 0.08, 0.15));
  // la cota del concreto
  const a = su(tr(t, Tmet - 0.2, Tmet + 0.1));
  cota(g, SX(c, HOYO.x1 + 1.1), SY(c, LOSA.y1), SX(c, HOYO.x1 + 1.1), SY(c, LOSA.y0), "1,1 m", a, "255,214,80", 1);
  velo(g, 0.4);
}
