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
const NM = 320, NT = 40;
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

// ---------------------------------------------------------------- los átomos: racimos de protones y neutrones
// Cada núcleo es un racimo de bolitas: protones rojos y neutrones gris azulados. Las posiciones se calculan una vez
// (apretadas dentro de una bola, empujándose entre sí) para cada tamaño que sale en el video.
const NUCLEOS = { H: [1, 1], He: [4, 2], C: [12, 6], Fe: [56, 26], Au: [197, 79] };
const racimos = {};
for (const [nombre, [n, p]] of Object.entries(NUCLEOS)) {
  const az = k.azar(900 + n), R = n === 1 ? 0 : 0.92 * Math.cbrt(n), pts = [];
  for (let i = 0; i < n; i++) { let X; do { X = [(az() * 2 - 1) * R, (az() * 2 - 1) * R, (az() * 2 - 1) * R]; } while (pto(X, X) > R * R); pts.push(X); }
  for (let it = 0; it < 80 && n > 1; it++) {
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
      const d = res(pts[i], pts[j]), l = Math.sqrt(pto(d, d)) || 0.01;
      if (l < 1.75) { const m = por(d, ((1.75 - l) / l) * 0.5); pts[i] = sum(pts[i], m); pts[j] = res(pts[j], m); }
    }
    for (let i = 0; i < n; i++) { const l = Math.sqrt(pto(pts[i], pts[i])); if (l > R) pts[i] = por(pts[i], R / l); }
  }
  // los protones, repartidos al azar entre todas
  const tipo = pts.map((_, i) => i < p), mezcla = k.azar(77 + n);
  for (let i = n - 1; i > 0; i--) { const j = Math.floor(mezcla() * (i + 1)); [tipo[i], tipo[j]] = [tipo[j], tipo[i]]; }
  const orden = pts.map((P, i) => [pto(P, P), P, tipo[i]]).sort((a, b) => a[0] - b[0]);
  racimos[nombre] = { pts: orden.map((o) => o[1]), tipo: orden.map((o) => o[2]), R: Math.max(1, R + 1) };
}
export const radioRacimo = (nombre) => racimos[nombre].R;

// Una bolita con luz (de arriba a la izquierda), su color de luz, medio y sombra.
const PROTON = ["#ffc2b0", "#f0503c", "#6e130b"], NEUTRON = ["#eef4ff", "#8fa6c8", "#283850"];
const GRIS = ["#f2f2f2", "#9a9ea6", "#2c2f35"], DORADA = [ORO.luz, ORO.claro, ORO.oscuro];
const aRgb = (c) => (c[0] === "#" ? [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16)) : c.match(/\d+/g).map(Number));
const mezcla = (a, b, u) => { const x = aRgb(a), y = aRgb(b); return `rgb(${[0, 1, 2].map((i) => Math.round(x[i] + (y[i] - x[i]) * u)).join(",")})`; };
const tono = (A, B, u) => (u <= 0 ? A : [0, 1, 2].map((i) => mezcla(A[i], B[i], u)));
function bolita(g, x, y, r, c) {
  const gr = g.createRadialGradient(x - r * 0.35, y - r * 0.4, r * 0.08, x, y, r);
  gr.addColorStop(0, c[0]); gr.addColorStop(0.45, c[1]); gr.addColorStop(1, c[2]);
  g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill();
}

// Un núcleo en (x, y): b es el radio de cada bolita en píxeles; giro, cuánto ha girado; gris y oro, de 0 a 1, cuánto
// se vuelve gris (el hierro) o de oro. desarma: de 0 a 1, las bolitas se separan y se apagan (lo que no llega a formarse).
export function racimo(g, nombre, x, y, b, giro = 0, gris = 0, oro = 0, desarma = 0, cuantos = Infinity) {
  const pts = racimos[nombre].pts.slice(0, Math.max(1, Math.round(cuantos))), tipo = racimos[nombre].tipo, cg = Math.cos(giro), sg = Math.sin(giro), ci = Math.cos(0.35), si = Math.sin(0.35);
  const lista = pts.map((P, i) => {
    let X = P[0] * cg + P[2] * sg, Z = -P[0] * sg + P[2] * cg, Y = P[1];
    const Y2 = Y * ci - Z * si; Z = Y * si + Z * ci; Y = Y2;
    const e = 1 + desarma * 1.6;
    return { x: x + X * b * e, y: y + Y * b * e, z: Z, p: tipo[i] };
  }).sort((a, c) => a.z - c.z);
  const A = g.globalAlpha;
  g.save();
  g.globalAlpha = A * (1 - desarma);
  for (const q of lista) {
    const base = q.p ? PROTON : NEUTRON;
    bolita(g, q.x, q.y, b * (1 + 0.04 * q.z / 4), tono(tono(base, GRIS, gris), DORADA, oro));
  }
  g.restore();
}

// ---------------------------------------------------------------- el centro de una estrella
// Lo de dentro: naranja que hierve, más claro en el medio, con su textura que gira despacio. al: de 0 a 1.
export function centroEstrella(g, t, al = 1, x = 540, y = 1050) {
  if (al <= 0.01) return;
  g.save();
  g.globalAlpha *= al;
  const gr = g.createRadialGradient(x, y, 40, x, y, 1500);
  gr.addColorStop(0, "#fff3c0"); gr.addColorStop(0.18, "#ffc04a"); gr.addColorStop(0.5, "#e8641a"); gr.addColorStop(1, "#5a1404");
  g.fillStyle = gr; g.fillRect(0, 0, 1080, 1920);
  g.globalCompositeOperation = "multiply";
  g.globalAlpha = al * 0.12; k.girado(g, k.red, x, y, 2600, t * 0.05);
  g.globalAlpha = al * 0.45; k.girado(g, k.manchas, x, y, 2900, -t * 0.06 + 1);
  g.globalCompositeOperation = "screen";
  g.globalAlpha = al * 0.4; k.girado(g, k.manchas, x, y, 2400, t * 0.08 + 2);
  g.restore();
}

// ---------------------------------------------------------------- una ciudad de noche
// Una ciudad vista de lado, de noche: edificios azul oscuro con ventanas encendidas, sobre su suelo. Se dibuja una vez
// (900 × 560) y luego se pone donde haga falta: ciudad(g, x, yBase, ancho, al), con x el borde izquierdo.
let laCiudad = null;
function hacerCiudad() {
  const W = 900, H = 560, l = k.lienzo(W, H), c = l.getContext("2d"), az = k.azar(404);
  const cielo = c.createLinearGradient(0, 0, 0, H);
  cielo.addColorStop(0, "rgba(40,60,140,0)"); cielo.addColorStop(1, "rgba(255,170,90,0.35)");
  c.fillStyle = cielo; c.fillRect(0, 0, W, H);
  for (const capa of [0, 1]) {
    let x = -10;
    while (x < W) {
      const w = 40 + az() * 70, h = capa ? 170 + Math.pow(az(), 1.3) * 330 : 280 + az() * 220, y = H - 40 - h;
      const gr = c.createLinearGradient(x, 0, x + w, 0);
      const base = capa ? ["#1c2550", "#2a3670", "#141a3a"] : ["#141a36", "#1d2650", "#0e1228"];
      gr.addColorStop(0, base[0]); gr.addColorStop(0.6, base[1]); gr.addColorStop(1, base[2]);
      c.fillStyle = gr; c.fillRect(x, y, w, h);
      // las ventanas encendidas
      for (let wy = y + 12; wy < H - 52; wy += 18) for (let wx = x + 7; wx < x + w - 10; wx += 14) {
        if (az() < (capa ? 0.45 : 0.25)) { c.fillStyle = az() < 0.8 ? `rgba(255,214,120,${0.6 + az() * 0.4})` : "rgba(180,220,255,0.8)"; c.fillRect(wx, wy, 7, 9); }
      }
      if (capa && az() < 0.3) { c.fillStyle = "#ff4040"; c.fillRect(x + w / 2 - 2, y - 14, 4, 14); }
      x += w + (capa ? 4 : 18) + az() * 10;
    }
  }
  const suelo = c.createLinearGradient(0, H - 40, 0, H);
  suelo.addColorStop(0, "#2a2f45"); suelo.addColorStop(1, "#0b0d16");
  c.fillStyle = suelo; c.fillRect(0, H - 40, W, 40);
  c.globalCompositeOperation = "lighter";
  const luz = c.createLinearGradient(0, H - 120, 0, H - 40);
  luz.addColorStop(0, "rgba(255,180,90,0)"); luz.addColorStop(1, "rgba(255,180,90,0.25)");
  c.fillStyle = luz; c.fillRect(0, H - 120, W, 80);
  return k.fijar(l);
}
export function ciudad(g, x, yBase, ancho, al = 1) {
  if (al <= 0.01) return;
  laCiudad ??= hacerCiudad();
  const h = (ancho * 560) / 900;
  g.save(); g.globalAlpha *= al; g.drawImage(laCiudad, x, yBase - h, ancho, h); g.restore();
}

// ---------------------------------------------------------------- una estrella de neutrones
// Una bola azul blanca que brilla muchísimo, con su resplandor. late: de 0 a 1.
export function neutrones(g, x, y, r, t, late = 0, al = 1) {
  if (al <= 0.01) return;
  k.brillo(g, x, y, r * 7, "azul", (0.55 + 0.35 * late) * al);
  k.brillo(g, x, y, r * 3.2, "255,255,255", (0.35 + 0.4 * late) * al);
  k.estrellaTransparente(g, "azul", x, y, r, t * 0.9, 0.6 + 0.4 * late, al);
  // encima, su luz: casi blanca en el centro, azul en el borde (que no parezca una roca)
  g.save(); g.globalAlpha *= al; g.globalCompositeOperation = "lighter";
  const gr = g.createRadialGradient(x - r * 0.2, y - r * 0.25, 0, x, y, r);
  gr.addColorStop(0, `rgba(255,255,255,${0.75 + 0.2 * late})`); gr.addColorStop(0.55, "rgba(200,225,255,0.45)"); gr.addColorStop(1, "rgba(120,170,255,0.25)");
  g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill();
  g.restore();
}

// Un neutrón suelto (una bolita gris azulada), y un protón.
export const bolaNeutron = (g, x, y, r) => bolita(g, x, y, r, NEUTRON);

// ---------------------------------------------------------------- una Tierra de oro macizo
// La Tierra con sus continentes, pero toda de oro: se dibuja la Tierra, se le da el color del oro (sin perder sus luces
// y sombras) y encima su brillo. Se hace una vez por fotograma a 360 px y se pone donde haga falta.
const TAM_T = 360, tierraL = k.lienzo(TAM_T), mascaraL = k.lienzo(TAM_T);
let tierraGira = null;
export function tierraDeOro(g, x, y, rad, gira, al = 1) {
  if (al <= 0.01 || rad < 1) return;
  if (tierraGira !== gira) {
    tierraGira = gira;
    const m = mascaraL.getContext("2d"), c = tierraL.getContext("2d");
    m.clearRect(0, 0, TAM_T, TAM_T); k.tierra(m, TAM_T / 2, TAM_T / 2, TAM_T * 0.42, gira, -0.8, -0.6);
    c.globalCompositeOperation = "source-over"; c.clearRect(0, 0, TAM_T, TAM_T); c.drawImage(mascaraL, 0, 0);
    c.globalCompositeOperation = "color"; c.fillStyle = "#e8a722"; c.fillRect(0, 0, TAM_T, TAM_T);
    c.globalCompositeOperation = "overlay"; c.fillStyle = "rgba(255,200,80,0.55)"; c.fillRect(0, 0, TAM_T, TAM_T);
    c.globalCompositeOperation = "destination-in"; c.drawImage(mascaraL, 0, 0);
    c.globalCompositeOperation = "source-over";
  }
  const s = rad / (TAM_T * 0.42);
  g.save(); g.globalAlpha *= al;
  k.brillo(g, x, y, rad * 3.2, ORO_RGB, 0.35);
  g.drawImage(tierraL, x - (TAM_T / 2) * s, y - (TAM_T / 2) * s, TAM_T * s, TAM_T * s);
  g.globalCompositeOperation = "lighter";
  const gr = g.createRadialGradient(x - rad * 0.4, y - rad * 0.45, 0, x - rad * 0.3, y - rad * 0.35, rad * 0.7);
  gr.addColorStop(0, "rgba(255,250,220,0.55)"); gr.addColorStop(1, "rgba(255,250,220,0)");
  g.fillStyle = gr; g.beginPath(); g.arc(x, y, rad, 0, Math.PI * 2); g.fill();
  g.restore();
}
