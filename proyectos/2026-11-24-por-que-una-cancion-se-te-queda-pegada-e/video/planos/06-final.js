// «Por eso, si intentas taparla con otra canción, muchas veces es peor. ¿Lo que sí ayuda? Masticar chicle: tu boca se
//  ocupa y le cuesta seguir cantándola. Así que no es que la canción no se vaya: es que tú la sigues cantando sin darte
//  cuenta. Envíaselo a un amigo que le pueda interesar.»
// La cabeza de luz del hook, con su bucle de notas girando.
// - «otra canción»: entra por la oreja un río de notas azules que gira al revés; se enredan. «peor»: el bucle de antes
//   se hace más grande y más rápido y echa a las azules.
// - «Masticar»: la cámara baja a la boca; la mandíbula mastica. «chicle»: un globo de chicle rosado se infla.
//   «cuesta»: el bucle se frena y se apaga.
// - «Así que»: el globo se desinfla y la cámara se aleja. «tú la sigues cantando»: de la boca, por dentro, sube una
//   fila de notas hasta el cerebro y el bucle se vuelve a encender.
// - «Envíaselo»: la cámara se aleja un poco y las notas giran como al principio; reposa al final.
import * as k from "#kit";
import { v } from "#voz";
import { NEON, cabeza, fondo, nota, CEREBRO, OREJA, BOCA, velo } from "../mundo.js";

export const desde = (vv) => vv.frase(9).inicio;

const { suave: su, tramo: tr, mez, pulso } = k;
const f9 = v.frase(9), f10 = v.frase(10), f11 = v.frase(11), f12 = v.frase(12);
const Tini = f9.inicio, Totra = f9.t("otra"), Tpeor = f9.t("peor");
const Tmas = f10.t("masticar"), Tchi = f10.t("chicle"), Tcue = f10.t("cuesta"), Tf10 = f10.fin;
const Tasi = f11.inicio, Tsig = f11.t("sigues"), Tcan = f11.t("cantando"), Tf11 = f11.fin;
const Tenv = f12.inicio, Tami = f12.t("amigo"), Tfin = v.duracion ?? f12.fin + 0.8;
export const momentos = { otra: Totra, peor: Tpeor, chicle: Tchi, mastica: Tmas, cantando: Tcan, amigo: Tami };

const HX = 480, HY = 1060, S = 1000;

// la velocidad del bucle (rad/s) y su ángulo acumulado
const vel = (t) => {
  let w = 2.1 + 1.6 * su(tr(t, Tpeor - 0.2, Tpeor + 0.3)) * (1 - su(tr(t, Tmas - 0.5, Tmas + 0.3)));
  w *= 1 - 0.8 * su(tr(t, Tchi, Tcue + 0.3)) * (1 - su(tr(t, Tcan - 0.4, Tcan + 0.3)));
  w *= 1 - su(tr(t, f12.fin, f12.fin + 0.6));
  return w;
};
const PASOS = []; for (let tt = Tini - 0.2, a = 0; tt < Tini + 25; tt += 1 / 120) { PASOS.push(a); a += vel(tt) / 120; }
const angulo = (t) => PASOS[Math.max(0, Math.min(PASOS.length - 1, Math.round((t - Tini + 0.2) * 120)))];

const BUCLE = Array.from({ length: 12 }, (_, i) => ({ th0: (i / 12) * 6.2832, c: NEON[i % NEON.length], tipo: i % 3, m: 0.62 + (i % 3) * 0.14, r: 0.034 + (i % 4) * 0.004 }));
const AZUL = Array.from({ length: 8 }, (_, i) => ({ nace: Totra - 0.1 + i * 0.08, th0: (i / 8) * 6.2832, tipo: (i + 1) % 3, c: i % 2 ? "70,140,255" : "120,200,255" }));

// la cámara: un zoom (z) alrededor de un punto propio (fx, fy) que se coloca en (px, py) de la pantalla
function camara(t) {
  const boca = su(tr(t, Tmas - 0.8, Tchi - 0.1)) * (1 - su(tr(t, Tasi - 0.1, Tasi + 0.9)));
  const lejos = su(tr(t, Tenv - 0.1, Tami + 0.3));
  const z = mez(1, 1.2, boca) * mez(1, 0.88, lejos);
  const fx = mez(0, BOCA[0], boca), fy = mez(0, BOCA[1], boca);
  const px = mez(HX, 560, boca), py = mez(HY, 1150, boca) + mez(0, -40, lejos);
  return { z, fx, fy, px, py };
}

export function dibuja(g, t) {
  const c = camara(t), Sz = S * c.z;
  const P = (lx, ly) => [c.px + (lx - c.fx) * Sz, c.py + (ly - c.fy) * Sz];
  const o = P(0, 0);
  fondo(g, o[0], o[1] - 200);
  // la mandíbula mastica
  const mastica = su(tr(t, Tmas - 0.1, Tmas + 0.2)) * (1 - su(tr(t, Tf10 - 0.1, Tf10 + 0.3)));
  const mand = 0.035 * mastica * Math.abs(Math.sin((t - Tmas) * 6.5));
  // el bucle: tamaño, brillo
  const grande = 1 + 0.28 * su(tr(t, Tpeor - 0.2, Tpeor + 0.25)) * (1 - su(tr(t, Tmas - 0.6, Tmas + 0.2)));
  const luz = 1 - 0.7 * su(tr(t, Tcue - 0.3, Tcue + 0.4)) * (1 - su(tr(t, Tcan - 0.3, Tcan + 0.4)));
  cabeza(g, o[0], o[1], Sz, { mandibula: mand, brilloCerebro: 0.3 + 0.6 * luz + 0.5 * pulso(t, Tpeor + 0.05, 0.2) + 0.5 * pulso(t, Tcan + 0.2, 0.25) });
  // las notas azules: la otra canción
  for (const q of AZUL) {
    if (t < q.nace) continue;
    const en = su(tr(t, q.nace, q.nace + 0.5)), fuera = su(tr(t, Tpeor - 0.1, Tpeor + 0.5));
    const th = q.th0 - 2.6 * (t - q.nace);
    const m = 0.45 + 1.0 * fuera;
    let lx = CEREBRO.x + Math.cos(th) * CEREBRO.rx * m, ly = CEREBRO.y + Math.sin(th) * CEREBRO.ry * m;
    lx = mez(OREJA[0], lx, en); ly = mez(OREJA[1], ly, en);
    const p = P(lx, ly);
    k.brillo(g, p[0], p[1], 0.2 * Sz, "80,150,255", 0.6 * en * (1 - fuera));
    nota(g, p[0], p[1], 0.042 * Sz, q.c, 0.3 * Math.sin(t * 3 + q.th0), en * (1 - fuera), q.tipo);
  }
  // el bucle
  const a = angulo(t);
  for (const [i, q] of BUCLE.entries()) {
    const th = q.th0 + a, m = q.m * grande;
    const p = P(CEREBRO.x + Math.cos(th) * CEREBRO.rx * m, CEREBRO.y + Math.sin(th) * CEREBRO.ry * m);
    nota(g, p[0], p[1], q.r * Sz * (1 + 0.1 * Math.sin(a * 3 + i)), q.c, 0.25 * Math.sin(a * 1.5 + i), 0.35 + 0.65 * luz, q.tipo);
  }
  k.brillo(g, P(CEREBRO.x, CEREBRO.y)[0], P(CEREBRO.x, CEREBRO.y)[1], 900, "255,120,200", 0.5 * pulso(t, Tpeor + 0.05, 0.15));
  // la vocecita: notas que suben de la boca al cerebro, por dentro
  for (let i = 0; i < 9; i++) {
    const t0 = Tsig - 0.2 + i * 0.17, u = su(tr(t, t0, t0 + 1.0));
    if (u <= 0 || u >= 1) continue;
    const lx = mez(BOCA[0] + 0.1, CEREBRO.x - 0.05, u) + 0.04 * Math.sin(u * 7 + i), ly = mez(BOCA[1] - 0.02, CEREBRO.y + 0.05, u);
    const p = P(lx, ly);
    nota(g, p[0], p[1], 0.034 * Sz, NEON[(i + 2) % NEON.length], 0.2 * Math.sin(i + u * 4), Math.min(1, Math.sin(u * Math.PI) * 1.5), i % 3);
  }
  // el globo de chicle
  const infla = k.entra(tr(t, Tchi - 0.1, Tchi + 1.2)) * (1 - su(tr(t, Tf10 + 0.1, Tasi + 0.4)));
  if (infla > 0.01) {
    const r = 0.13 * infla * (1 + 0.04 * Math.sin(t * 5)) * Sz, lab = P(-0.405, 0.175 + mand * 0.6);
    const bx = lab[0] - r * 0.92, by = lab[1];
    g.save();
    const gg = g.createRadialGradient(bx - r * 0.35, by - r * 0.35, r * 0.05, bx, by, r);
    gg.addColorStop(0, "rgba(255,225,240,0.95)"); gg.addColorStop(0.5, "rgba(255,120,190,0.92)"); gg.addColorStop(1, "rgba(200,40,130,0.95)");
    g.fillStyle = gg; g.beginPath(); g.arc(bx, by, r, 0, 6.2832); g.fill();
    g.strokeStyle = "rgba(255,200,230,0.8)"; g.lineWidth = Math.max(2, r * 0.03); g.stroke();
    g.fillStyle = "rgba(255,255,255,0.8)"; g.beginPath(); g.ellipse(bx - r * 0.4, by - r * 0.42, r * 0.22, r * 0.11, -0.6, 0, 6.2832); g.fill();
    g.restore();
  }
  velo(g, 0.55);
}
