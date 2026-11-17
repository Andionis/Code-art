// Lo que comparten los planos de este video: el anillo de oro (hook, remate y cierre), los colores del oro, las chispas
// doradas y los racimos de átomos (protones y neutrones), para que de un plano al siguiente sea siempre la misma cosa.
import * as k from "#kit";

const { sum, por, res, uni, cruz, pto, proyecta, F } = k;

// ---------------------------------------------------------------- el oro
export const ORO = { luz: "#fff4c2", claro: "#ffd65a", medio: "#e3a11e", oscuro: "#94560a", fondo: "#3e2003" };
export const ORO_RGB = "255,206,96";      // la luz del oro (brillos, chispas)
export const ORO_CALIDO = "255,170,60";   // la luz del oro al rojo

// Un destello de cuatro puntas (la chispa de algo pulido), en (x, y), de tam píxeles, intensidad al.
export function destello(g, x, y, tam, al = 1, color = "255,244,200") {
  if (al <= 0.01 || tam < 2) return;
  g.save();
  g.globalCompositeOperation = "lighter";
  k.brillo(g, x, y, tam * 0.7, color, al);
  for (const [dx, dy, l] of [[1, 0, 1], [0, 1, 1], [0.7, 0.7, 0.45], [0.7, -0.7, 0.45]]) {
    const L = (tam / 2) * l, lg = g.createLinearGradient(x - dx * L, y - dy * L, x + dx * L, y + dy * L);
    lg.addColorStop(0, `rgba(${color},0)`); lg.addColorStop(0.5, `rgba(255,255,255,${al})`); lg.addColorStop(1, `rgba(${color},0)`);
    g.strokeStyle = lg; g.lineWidth = Math.max(1.5, tam * 0.012 * (l > 0.5 ? 1 : 0.7));
    g.beginPath(); g.moveTo(x - dx * L, y - dy * L); g.lineTo(x + dx * L, y + dy * L); g.stroke();
  }
  g.restore();
}

// ---------------------------------------------------------------- el anillo
// Un anillo de oro en 3D: una malla de toro (tubo de radio r alrededor de un círculo de radio R, centrado en C, con su
// eje). Cada cara se pinta con lo que refleja: un estudio de luz (arriba claro, el horizonte cálido, abajo oscuro) teñido
// de oro, más el brillo de la luz principal. Así parece metal pulido y no un tubo de plástico. brilla: destello de más.
const NM = 240, NT = 34;
const toro = [];
for (let i = 0; i < NM; i++) for (let j = 0; j < NT; j++) {
  const f = (i / NM) * Math.PI * 2, q = (j / NT) * Math.PI * 2;
  toro.push([Math.cos(f), Math.sin(f), Math.cos(q), Math.sin(q)]);
}
const hexRgb = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const ENV = [[-1, "#1a0c02"], [-0.4, "#4a2706"], [-0.08, "#b06c10"], [0.06, "#ffe28e"], [0.2, "#e09a22"], [0.45, "#c98418"], [0.75, "#ffd97a"], [1, "#fff4d0"]].map(([y, c]) => [y, hexRgb(c)]);
const envTabla = Array.from({ length: 256 }, (_, n) => {
  const y = -1 + (2 * n) / 255;
  let i = 0; while (i < ENV.length - 2 && y > ENV[i + 1][0]) i++;
  const [y0, c0] = ENV[i], [y1, c1] = ENV[i + 1], u = Math.max(0, Math.min(1, (y - y0) / (y1 - y0)));
  return [0, 1, 2].map((c) => c0[c] + (c1[c] - c0[c]) * u);
});
const LUZ = uni([-0.5, 0.7, 0.55]);
export function anillo(g, cam, C, eje, R = 1, r = 0.17, brilla = 0) {
  const A = uni(eje), ref = Math.abs(A[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0], u = uni(cruz(A, ref)), w = cruz(A, u);
  const P = new Array(toro.length), N = new Array(toro.length), Q = new Array(toro.length);
  for (let n = 0; n < toro.length; n++) {
    const [cf, sf, cq, sq] = toro[n], rad = sum(por(u, cf), por(w, sf)), nor = sum(por(rad, cq), por(A, sq));
    N[n] = nor; P[n] = sum(C, sum(por(rad, R), por(nor, r))); Q[n] = proyecta(cam, P[n]);
  }
  const caras = [];
  for (let i = 0; i < NM; i++) for (let j = 0; j < NT; j++) {
    const a = i * NT + j, b = ((i + 1) % NM) * NT + j, c = ((i + 1) % NM) * NT + ((j + 1) % NT), d = i * NT + ((j + 1) % NT);
    const qa = Q[a], qb = Q[b], qc = Q[c], qd = Q[d];
    if (!qa || !qb || !qc || !qd || qa.z < 0.05 || qb.z < 0.05 || qc.z < 0.05 || qd.z < 0.05) continue;
    const mx = Math.max(qa.x, qb.x, qc.x, qd.x), nx = Math.min(qa.x, qb.x, qc.x, qd.x), my = Math.max(qa.y, qb.y, qc.y, qd.y), ny = Math.min(qa.y, qb.y, qc.y, qd.y);
    if (mx < -20 || nx > 1100 || my < -20 || ny > 1940) continue;
    const n = uni(sum(sum(N[a], N[b]), sum(N[c], N[d]))), M = por(sum(sum(P[a], P[b]), sum(P[c], P[d])), 0.25);
    const V = uni(res(cam.p, M)), nv = pto(n, V);
    if (nv < -0.05) continue;
    caras.push({ q: [qa, qb, qc, qd], z: (qa.z + qb.z + qc.z + qd.z) / 4, n, V, nv });
  }
  caras.sort((x, y) => y.z - x.z);
  g.save();
  g.lineJoin = "round"; g.lineWidth = 1.2;
  for (const f of caras) {
    const { n, V, nv } = f;
    // lo que refleja esta cara: R = 2(n·V)n − V, en los ejes de la cámara (arriba/abajo del estudio)
    const Rf = res(por(n, 2 * nv), V), ry = pto(Rf, cam.e.u), rx = pto(Rf, cam.e.r);
    const e = envTabla[Math.max(0, Math.min(255, Math.round((ry * 0.85 + 0.12 * Math.sin(rx * 3) + 1) * 127.5)))];
    const sp = Math.pow(Math.max(0, pto(Rf, LUZ)), 40) * (1 + 0.8 * brilla), caja = Math.pow(Math.max(0, rx), 6) * 0.5;
    const fres = 0.85 + 0.25 * (1 - Math.max(0, nv));
    const col = [0, 1, 2].map((c) => Math.min(255, Math.round(e[c] * fres * (1 + 0.25 * brilla) + 255 * sp * [1, 0.97, 0.85][c] + caja * [255, 210, 120][c])));
    const s = `rgb(${col[0]},${col[1]},${col[2]})`;
    g.fillStyle = s; g.strokeStyle = s;
    const [a, b, c, d] = f.q;
    g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.lineTo(c.x, c.y); g.lineTo(d.x, d.y); g.closePath(); g.fill(); g.stroke();
  }
  g.restore();
}

// ---------------------------------------------------------------- chispas doradas
// Puntos de oro que brillan y dejan su estela: lista de { a, b } (de dónde a dónde en el mundo), cada una con su tiempo.
export function chispa(g, cam, antes, X, tam, al, color = ORO_RGB) {
  const Q = proyecta(cam, X);
  if (!Q || Q.z < 0.2 || al <= 0.01) return;
  const s = Math.min(160, (F * tam) / Q.z);
  if (antes) {
    const B = proyecta(antes, X);
    if (B) {
      const dx = Q.x - B.x, dy = Q.y - B.y, l = Math.hypot(dx, dy);
      if (l > 2) {
        const c = Math.min(1, 140 / l);
        g.save(); g.globalCompositeOperation = "lighter"; g.lineCap = "round";
        g.strokeStyle = `rgba(${color},${0.6 * al})`; g.lineWidth = Math.max(1.5, s * 0.22);
        g.beginPath(); g.moveTo(Q.x - dx * c * 1.6, Q.y - dy * c * 1.6); g.lineTo(Q.x, Q.y); g.stroke(); g.restore();
      }
    }
  }
  k.brillo(g, Q.x, Q.y, Math.max(8, s), color, al);
}

// ---------------------------------------------------------------- un velo arriba para el subtítulo
export function veloArriba(g, fuerza = 0.5) {
  if (fuerza <= 0.01) return;
  const vg = g.createLinearGradient(0, 160, 0, 700);
  vg.addColorStop(0, `rgba(3,4,8,${fuerza})`); vg.addColorStop(0.6, `rgba(3,4,8,${fuerza * 0.7})`); vg.addColorStop(1, "rgba(3,4,8,0)");
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 700);
}

// ---------------------------------------------------------------- dos estrellas de neutrones en espiral
// Antes del choque (en Tc), cada una gira alrededor del centro, cada vez más juntas y más rápido (como de verdad: la
// separación cae con (Tc - t)^¼ y el giro se acelera). Devuelve las dos posiciones en el mundo.
export function espiral(C, t, Tc, sep0 = 3, dur = 3, vueltas = 4.2, inclina = 0.35) {
  const q = Math.max(0, (Tc - t) / dur), s = sep0 * Math.pow(Math.min(1.6, q), 0.25) * 0.5;
  const fase = -vueltas * 2 * Math.PI * Math.pow(Math.min(1.6, q), 0.625);
  const d = [Math.cos(fase) * s, Math.sin(fase) * s * Math.sin(inclina), Math.sin(fase) * s * Math.cos(inclina)];
  return [sum(C, d), res(C, d)];
}

// Un punto de la superficie del anillo, en el lado del aro que más mira hacia dir (para poner ahí un destello).
export function puntoAnillo(C, eje, dir, R = 1, r = 0.17) {
  const A = uni(eje), d = res(dir, por(A, pto(dir, A))), n = uni(d);
  return sum(C, sum(por(n, R), por(uni(sum(n, por(A, 0.3))), r)));
}
