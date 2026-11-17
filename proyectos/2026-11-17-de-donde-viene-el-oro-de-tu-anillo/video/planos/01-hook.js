// «¿De dónde viene el oro de tu anillo? No se hizo en la Tierra: se hizo en un choque de estrellas, antes de que
// existiera el Sol.»
// - Fotograma 0: el anillo de oro, enorme, girando y acercándose deprisa; chispas doradas le llegan del fondo. Al
//   fondo, por el agujero, dos puntos azules que giran (las estrellas que van a chocar). En «oro», un destello lo recorre.
// - «No se hizo en la Tierra»: el anillo termina de girar hasta mirarnos de frente y la cámara lo cruza por el agujero.
// - «choque de estrellas»: al otro lado, las dos estrellas en espiral, cada vez más rápido; chocan en «choque»:
//   fogonazo y una nube de chispas de oro que vuela hacia la cámara.
// - «antes de que existiera el Sol»: la nube dorada se abre despacio y se calma antes del corte.
import * as k from "#kit";
import { v } from "#voz";
import { anillo, chispa, destello, espiral, puntoAnillo, veloArriba, ORO_RGB } from "../mundo.js";

export const desde = 0;

const { suave, tramo, sum, por, uni, proyecta, F } = k;
const Toro = v.t("oro"), Tno = v.t("no"), Tchoque = v.t("choque") + 0.06, Tfin = v.frase(2).fin;

// ---------------------------------------------------------------- la cámara: se acerca, cruza el anillo y sigue
const camZ = k.claves([[-1, 3.9], [0, 3.35], [Toro, 2.95], [Tno, 2.6], [Tno + 0.9, 1.2], [Tno + 1.45, -0.6], [Tchoque, -3.2], [Tfin, -4.6]]);
const camY = k.claves([[-1, 0.2], [Tno, 0.16], [Tno + 1.2, 0.02], [Tfin, 0]]);
const camX = k.claves([[-1, 0.12], [Tno, 0.05], [Tno + 1.2, 0], [Tfin, 0]]);
const C2 = [0, 0.1, -12];
const camara = (t) => {
  const p = [camX(t), camY(t), camZ(t)];
  return k.mira(p, [0, mezY(t), -40]);
};
const mezY = (t) => k.mez(0.6, 0.15, suave(tramo(t, Tno, Tno + 1.2)));

// el anillo gira sobre sí mismo hasta quedar de frente justo antes de cruzarlo
const giroTh = k.claves([[-1, -1.9], [0, -1.2], [Toro, -0.8], [Tno, -0.35], [Tno + 0.75, 0]]);
const giroPs = k.claves([[-1, 0.55], [0, 0.42], [Tno, 0.15], [Tno + 0.75, 0]]);
const ejeAnillo = (t) => { const th = giroTh(t), ps = giroPs(t); return [Math.sin(th) * Math.cos(ps), Math.sin(ps), Math.cos(th) * Math.cos(ps)]; };

// ---------------------------------------------------------------- el cielo y las chispas
const cielo = k.cielo(7, 2600, [0, 0, -30], 260, 6);
const az = k.azar(31);
// chispas que llegan del fondo (de donde chocarán las estrellas) y pasan alrededor del anillo
const llegan = Array.from({ length: 70 }, () => ({
  a: [C2[0] + (az() - 0.5) * 3, C2[1] + (az() - 0.5) * 3, C2[2]],
  b: [(az() - 0.5) * 5, (az() - 0.5) * 6, 2 + az() * 3],
  fase: az(), vel: 0.22 + az() * 0.18, tam: 0.03 + az() * 0.05,
}));
// la nube del choque: chispas que salen en todas direcciones, más hacia la cámara
const nube = Array.from({ length: 260 }, () => {
  const d = uni([az() - 0.5, (az() - 0.5) * 0.9, az() - 0.35]);
  return { d, vel: 1.2 + Math.pow(az(), 0.8) * 5.5, tam: 0.05 + az() * 0.14, c: az() < 0.25 ? "255,236,170" : az() < 0.5 ? "255,170,60" : ORO_RGB };
});

export function dibuja(g, t) {
  const cam = camara(t), antes = camara(t - 1 / 60);
  const flash = t > Tchoque ? Math.exp(-(t - Tchoque) * 3) : 0;
  k.fondo(g, cam, 1);
  k.estrellas(g, cam, antes, cielo, 1 - 0.5 * flash);

  // ---- al fondo: las dos estrellas en espiral y su choque
  const C = proyecta(cam, C2);
  if (C) {
    if (t < Tchoque) {
      const prox = suave(tramo(t, Tchoque - 1.6, Tchoque));
      const rad = 0.42 + 0.06 * prox;
      // su estela: dónde estaban hace un momento
      for (let j = 6; j >= 1; j--) {
        const [a, b] = espiral(C2, t - j * 0.03, Tchoque, 3, 4.4, 5);
        for (const X of [a, b]) { const Q = proyecta(cam, X); if (Q) k.brillo(g, Q.x, Q.y, (F * rad * 3) / Q.z, "azul", 0.18 * (1 - j / 7)); }
      }
      const [a, b] = espiral(C2, t, Tchoque, 3, 4.4, 5);
      const qa = proyecta(cam, a), qb = proyecta(cam, b);
      if (qa && qb) {
        k.brillo(g, C.x, C.y, (F * 6) / C.z, "azul", 0.25 + 0.5 * prox);
        for (const Q of qa.z > qb.z ? [qa, qb] : [qb, qa]) k.estrella(g, "azul", Q.x, Q.y, (F * rad) / Q.z, t * 0.8, 0.4 + 0.6 * prox);
      }
    } else {
      const u = t - Tchoque;
      // lo que queda en el centro, y la nube de oro que se abre
      k.brillo(g, C.x, C.y, Math.min(1500, (F * (5 + 6 * (1 - Math.exp(-u * 1.5)))) / C.z), ORO_RGB, 0.75 * Math.exp(-u * 0.35));
      k.brillo(g, C.x, C.y, Math.min(900, (F * (2 + 2 * (1 - Math.exp(-u)))) / C.z), "255,236,190", 0.7 * Math.exp(-u * 0.6));
      g.save(); g.globalAlpha = Math.exp(-u * 1.4); k.estallido(g, C.x, C.y, u * 0.7, ORO_RGB, 0.42, 44, 110, 0); g.restore();
      k.fogonazo(g, C.x, C.y, u * 1.3, 1300, "255,222,150");
      k.estrellaTransparente(g, "blanca", C.x, C.y, ((F * 0.5) / C.z) * (0.5 + 0.5 * Math.exp(-u)), t, 1, 1 - suave(tramo(u, 0.6, 1.8)));
      // chispas de oro que salen disparadas (frenan con el tiempo: al final casi quietas)
      const e = (1 - Math.exp(-u * 1.6)) / 1.6 + 0.04 * u, e0 = (1 - Math.exp(-(u - 1 / 60) * 1.6)) / 1.6 + 0.04 * (u - 1 / 60);
      for (const p of nube) {
        const X = sum(C2, por(p.d, p.vel * e)), Xa = sum(C2, por(p.d, p.vel * Math.max(0, e0)));
        const Q = proyecta(cam, X); if (!Q || Q.z < 0.3) continue;
        const B = proyecta(antes, Xa);
        const s = Math.min(140, (F * p.tam) / Q.z), al = 0.95;
        if (B) {
          const dx = Q.x - B.x, dy = Q.y - B.y, l = Math.hypot(dx, dy);
          if (l > 2) { const c = Math.min(1, 130 / l); g.save(); g.globalCompositeOperation = "lighter"; g.lineCap = "round"; g.strokeStyle = `rgba(${p.c},${0.5 * al})`; g.lineWidth = Math.max(1.5, s * 0.25); g.beginPath(); g.moveTo(Q.x - dx * c * 2, Q.y - dy * c * 2); g.lineTo(Q.x, Q.y); g.stroke(); g.restore(); }
        }
        k.brillo(g, Q.x, Q.y, Math.max(8, s), p.c, al);
      }
    }
  }

  // ---- chispas que llegan del fondo hacia el anillo (se apagan al llegar, sin saltos)
  if (t < Tchoque) {
    const al0 = 1 - suave(tramo(t, Tno + 0.6, Tno + 1.4));
    for (const c of llegan) {
      const f = (c.fase + t * c.vel) % 1, X = k.mezV(c.a, c.b, f), Xa = k.mezV(c.a, c.b, Math.max(0, f - c.vel / 60));
      chispa(g, cam, null, X, c.tam, al0 * Math.sin(Math.PI * f) * 0.9);
      void Xa;
    }
  }

  // ---- el anillo
  const brilla = k.pulso(t, Toro + 0.1, 0.22);
  if (cam.p[2] > -0.5) anillo(g, cam, [0, 0, 0], ejeAnillo(t), 1, 0.17, brilla);
  // el destello que lo recorre en «oro»: arriba a la izquierda del aro, donde le da la luz
  if (brilla > 0.02) {
    const Q = proyecta(cam, puntoAnillo([0, 0, 0], ejeAnillo(t), [-0.7, 0.75, 0.4]));
    if (Q) destello(g, Q.x, Q.y, 520, brilla);
  }
  // cuando el aro llena la pantalla, un velo arriba para el subtítulo
  veloArriba(g, 0.45 * (1 - tramo(t, Tno + 0.9, Tno + 1.3)) + 0.3 * flash);
}

export const choque = Tchoque;
export const cruce = Tno + 1.2;
