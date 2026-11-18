// Lo que comparten los planos: tu cabeza de perfil (mirando a la izquierda), hecha de luz, con lo de dentro (el
// cerebro, el cráneo, la boca con el paladar y sus vasos, la arteria de detrás de la frente y el nervio), la escarcha y
// el dolor de la frente, y el granizado con su pajita. Todo en 2D, en coordenadas del mundo (px con zoom 1); vista()
// pone la cámara. La cabeza tiene su centro (la oreja) en (0, 0) y mide unos 1.100 de alto.
import * as k from "#kit";

const { azar, lienzo, suave: su, tramo: tr, mez, mezRgb } = k;

// ---------------------------------------------------------------- la cámara 2D
export function vista(g, Z, cx, cy) { g.setTransform(Z, 0, 0, Z, 540 - cx * Z, 960 - cy * Z); }
export const sinVista = (g) => g.setTransform(1, 0, 0, 1, 0, 0);
// Una cámara que pasa por claves [t, [Z, cx, cy]] sin tirones (el zoom, en log).
export function camino2D(claves) {
  const Zs = k.claves(claves.map(([t, c]) => [t, Math.log(c[0])])), X = k.claves(claves.map(([t, c]) => [t, c[1]])), Y = k.claves(claves.map(([t, c]) => [t, c[2]]));
  return (t) => [Math.exp(Zs(t)), X(t), Y(t)];
}
// De mundo a pantalla, con la cámara [Z, cx, cy].
export const aPantalla = (c, x, y) => [540 + (x - c[1]) * c[0], 960 + (y - c[2]) * c[0]];

// ---------------------------------------------------------------- el fondo
// Azul noche, con la luz fría de abajo (el granizado) y la cálida de la cabeza.
const motas = k.tenir(k.ruido(256, 77, 4, 4, "manchas"), "#3a5a9a");
export function fondo(g, t, calor = 0) {
  g.save(); sinVista(g);
  g.fillStyle = "#050813"; g.fillRect(0, 0, 1080, 1920);
  const a = g.createRadialGradient(380, 1350, 60, 380, 1350, 1300);
  a.addColorStop(0, "rgba(40,120,255,0.38)"); a.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = a; g.fillRect(0, 0, 1080, 1920);
  const b = g.createRadialGradient(700, 700, 60, 700, 700, 1100);
  b.addColorStop(0, `rgba(${mezRgb("120,60,160", "255,90,70", calor)},0.32)`); b.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = b; g.fillRect(0, 0, 1080, 1920);
  g.globalCompositeOperation = "screen"; g.globalAlpha = 0.18; g.drawImage(motas, -300 - t * 6, -200, 1700, 2400);
  g.restore();
}
export function vineta(g, al = 0.55) {
  g.save(); sinVista(g);
  const vg = g.createRadialGradient(540, 960, 480, 540, 960, 1250);
  vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, `rgba(0,0,0,${al})`);
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 1920); g.restore();
}
// Un velo oscuro arriba, detrás del subtítulo.
export function velo(g, al = 0.5) {
  if (al <= 0.01) return;
  g.save(); sinVista(g);
  const vg = g.createLinearGradient(0, 200, 0, 640);
  vg.addColorStop(0, `rgba(4,6,14,${al})`); vg.addColorStop(0.6, `rgba(4,6,14,${al * 0.6})`); vg.addColorStop(1, "rgba(4,6,14,0)");
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 640); g.restore();
}

// ---------------------------------------------------------------- caminos
// Una curva suave cerrada (o abierta) que pasa cerca de los puntos (por sus puntos medios).
function curvaPor(g, P, cerrada = true) {
  const n = P.length, m = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  if (cerrada) {
    const s = m(P[n - 1], P[0]); g.moveTo(s[0], s[1]);
    for (let i = 0; i < n; i++) { const q = m(P[i], P[(i + 1) % n]); g.quadraticCurveTo(P[i][0], P[i][1], q[0], q[1]); }
    g.closePath();
  } else {
    g.moveTo(P[0][0], P[0][1]);
    for (let i = 1; i < n - 1; i++) { const q = m(P[i], P[i + 1]); g.quadraticCurveTo(P[i][0], P[i][1], q[0], q[1]); }
    g.lineTo(P[n - 1][0], P[n - 1][1]);
  }
}
// Un punto a la fracción u (0-1) de una polilínea, y su largo.
export function puntoEn(P, u) {
  let L = 0; const ls = [];
  for (let i = 1; i < P.length; i++) { const d = Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]); ls.push(d); L += d; }
  let r = Math.max(0, Math.min(1, u)) * L;
  for (let i = 0; i < ls.length; i++) {
    if (r <= ls[i] || i === ls.length - 1) { const f = ls[i] ? Math.min(1, r / ls[i]) : 0; return [mez(P[i][0], P[i + 1][0], f), mez(P[i][1], P[i + 1][1], f)]; }
    r -= ls[i];
  }
  return P[P.length - 1];
}
// Una polilínea suavizada (más puntos) para que lo que corre por ella no vaya a tirones.
function suaviza(P, n = 12) {
  const out = [];
  for (let i = 0; i < P.length - 1; i++) {
    const p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(P.length - 1, i + 2)];
    for (let j = 0; j < n; j++) {
      const s = j / n, s2 = s * s, s3 = s2 * s;
      out.push([0, 1].map((c) => 0.5 * (2 * p1[c] + (-p0[c] + p2[c]) * s + (2 * p0[c] - 5 * p1[c] + 4 * p2[c] - p3[c]) * s2 + (-p0[c] + 3 * p1[c] - 3 * p2[c] + p3[c]) * s3)));
    }
  }
  out.push(P[P.length - 1]);
  return out;
}

// ---------------------------------------------------------------- la cabeza
// El perfil, mirando a la izquierda: coronilla, nuca, cuello, barbilla, labios (entreabiertos con la pajita), nariz y
// frente.
const PERFIL = [
  [-40, -565], [140, -548], [295, -470], [392, -330], [420, -150], [402, 30], [352, 170], [292, 292], [252, 410], [246, 580], [252, 850], [320, 960], [560, 1050], [720, 1250], [730, 2600],
  [-600, 2600], [-590, 1250], [-430, 1060], [-170, 965], [-114, 860], [-118, 580], [-150, 452],
  [-252, 432], [-312, 398], [-334, 342], [-326, 300],
  [-350, 278], [-356, 258], [-332, 246],
  [-356, 228], [-350, 206], [-330, 186],
  [-342, 168], [-388, 152], [-440, 128], [-448, 100], [-414, 40], [-384, -40], [-378, -100],
  [-398, -142], [-388, -205], [-362, -325], [-300, -455], [-190, -535],
];
export const BOCA = [-338, 246];          // donde entra la pajita
export const FRENTE = [-300, -270];       // donde duele
export const PALADAR_C = [-150, 170];     // el centro del paladar
export function caminoCabeza(g) { g.beginPath(); curvaPor(g, PERFIL); }

// El cerebro: una forma grande arriba, con el cerebelo detrás.
const CEREBRO = [
  [-300, -260], [-250, -420], [-120, -495], [60, -500], [220, -440], [330, -320], [360, -160], [320, -30], [230, 30],
  [120, 10], [30, -20], [-80, -20], [-200, -40], [-280, -110],
];
const CEREBELO = [[150, 40], [240, 20], [320, 40], [330, 110], [260, 150], [170, 120]];
// Sus pliegues, dibujados una vez.
const pliegues = (() => {
  const W = 800, H = 600, l = lienzo(W, H), c = l.getContext("2d"), az = azar(4141);
  c.fillStyle = "rgb(236,120,150)"; c.fillRect(0, 0, W, H);
  c.globalAlpha = 0.5; c.drawImage(k.tenir(k.ruido(256, 31, 5, 3, "manchas"), "#ff9ab6"), 0, 0, W, H); c.globalAlpha = 1;
  c.lineCap = "round"; c.lineJoin = "round";
  for (let i = 0; i < 150; i++) {
    let x = az() * W, y = az() * H, a = az() * 6.28;
    const pts = [[x, y]];
    for (let j = 0; j < 6; j++) { a += (az() - 0.5) * 2.8; x += Math.cos(a) * 22; y += Math.sin(a) * 22; pts.push([x, y]); }
    c.strokeStyle = "rgba(110,15,55,0.8)"; c.lineWidth = 9; c.beginPath(); curvaPor(c, pts, false); c.stroke();
    c.save(); c.translate(-3, -4); c.strokeStyle = "rgba(255,210,225,0.55)"; c.lineWidth = 3; c.beginPath(); curvaPor(c, pts, false); c.stroke(); c.restore();
  }
  return k.fijar(l);
})();

// La boca por dentro: el hueco, con el paladar arriba (de los dientes a la garganta) y la lengua abajo.
const PALADAR = [[-318, 214], [-260, 186], [-170, 160], [-60, 158], [30, 180], [80, 220]];
const HUECO = [[-336, 244], ...PALADAR, [100, 300], [80, 380], [-60, 360], [-200, 320], [-300, 282]];
const LENGUA = [[-300, 270], [-220, 236], [-100, 220], [20, 240], [70, 300], [40, 360], [-120, 352], [-250, 312]];
// Los vasos del paladar: tres líneas onduladas a lo largo, justo encima del techo de la boca.
const VASOS = [0, 1, 2].map((j) => suaviza(PALADAR.slice(0, 5).map(([x, y], i) => [x + 10, y - 10 - j * 14 + Math.sin(i * 1.7 + j) * 6])));
// La arteria de detrás de la frente: sube desde el cuello por detrás de la boca y se curva hacia delante, detrás de la
// frente.
export const ARTERIA = suaviza([[60, 700], [70, 420], [40, 200], [-30, 40], [-140, -40], [-240, -150], [-275, -300], [-230, -440]]);
// El nervio: el nudo detrás de la nariz, una rama al paladar, otra a la frente y otra al cerebro.
export const NUDO = [10, 70];
export const RAMA_PALADAR = suaviza([[-150, 168], [-100, 130], [-30, 100], NUDO]);
export const RAMA_FRENTE = suaviza([NUDO, [-90, 20], [-210, -40], [-300, -130], [-330, -240]]);
export const RAMA_CEREBRO = suaviza([NUDO, [60, 20], [110, -60], [130, -150]]);

// La escarcha: grietas de hielo que salen de un centro, dibujadas una vez.
const escarcha = (() => {
  const W = 700, l = lienzo(W, W), c = l.getContext("2d"), az = azar(909);
  const fg = c.createRadialGradient(W / 2, W / 2, 0, W / 2, W / 2, W / 2);
  fg.addColorStop(0, "rgba(170,225,255,0.55)"); fg.addColorStop(0.5, "rgba(110,180,255,0.3)"); fg.addColorStop(1, "rgba(120,190,255,0)");
  c.fillStyle = fg; c.fillRect(0, 0, W, W);
  c.lineCap = "round";
  const rama = (x, y, a, L, w, n) => {
    if (n <= 0 || L < 8) return;
    const x2 = x + Math.cos(a) * L, y2 = y + Math.sin(a) * L;
    c.strokeStyle = `rgba(255,255,255,${0.5 + w / 12})`; c.lineWidth = w; c.beginPath(); c.moveTo(x, y); c.lineTo(x2, y2); c.stroke();
    rama(x2, y2, a + (az() - 0.5) * 0.6, L * 0.78, w * 0.75, n - 1);
    if (az() < 0.7) rama(x2, y2, a + (az() < 0.5 ? -1 : 1) * (0.6 + az() * 0.5), L * 0.55, w * 0.6, n - 2);
  };
  for (let i = 0; i < 14; i++) rama(W / 2, W / 2, (i / 14) * 6.283 + az() * 0.3, 60 + az() * 30, 6, 6);
  // cristalitos
  for (let i = 0; i < 160; i++) { const r = Math.pow(az(), 0.7) * W * 0.45, a = az() * 6.283; c.fillStyle = `rgba(255,255,255,${0.4 + az() * 0.5})`; c.beginPath(); c.arc(W / 2 + Math.cos(a) * r, W / 2 + Math.sin(a) * r, 1.5 + az() * 3, 0, 6.283); c.fill(); }
  return k.fijar(l);
})();

// Los rayos del dolor: líneas quebradas fijas (con semilla) que salen de la frente.
const RAYOS_DOLOR = (() => {
  const az = azar(313);
  return Array.from({ length: 9 }, (_, i) => {
    const a = -Math.PI * 0.95 + (i / 8) * Math.PI * 0.9 + (az() - 0.5) * 0.15, pts = [[0, 0]];
    let r = 0, x = 0, y = 0;
    for (let j = 0; j < 5; j++) { r = 40 + j * 45; const q = a + (az() - 0.5) * 0.5; x = Math.cos(q) * r; y = Math.sin(q) * r; pts.push([x, y]); }
    return pts;
  });
})();
// El dolor en (x, y): un resplandor rojo que late y sus rayos. al: 0 a 1.
export function dolor(g, x, y, al, t, escala = 1) {
  if (al <= 0.01) return;
  g.save(); g.globalCompositeOperation = "lighter";
  const late = 0.85 + 0.15 * Math.sin(t * 14);
  const R = 260 * escala * (0.8 + 0.3 * al), rg = g.createRadialGradient(x, y, 0, x, y, R);
  rg.addColorStop(0, `rgba(255,90,70,${0.85 * al * late})`); rg.addColorStop(0.4, `rgba(255,40,40,${0.45 * al * late})`); rg.addColorStop(1, "rgba(255,0,0,0)");
  g.fillStyle = rg; g.beginPath(); g.arc(x, y, R, 0, 6.283); g.fill();
  g.lineJoin = "round"; g.lineCap = "round";
  const largo = escala * (0.35 + 0.65 * al);
  for (const rayo of RAYOS_DOLOR) {
    g.beginPath(); rayo.forEach(([px, py], i) => { const X = x + px * largo, Y = y + py * largo; i ? g.lineTo(X, Y) : g.moveTo(X, Y); });
    g.strokeStyle = `rgba(255,60,50,${0.5 * al})`; g.lineWidth = 16 * escala; g.stroke();
    g.strokeStyle = `rgba(255,220,200,${0.9 * al})`; g.lineWidth = 5 * escala; g.stroke();
  }
  g.restore();
}

// Puntos que corren por un camino (la sangre o el aviso): n puntos, a velocidad vel (vueltas por segundo).
function corre(g, P, t, n, vel, color, tam, al) {
  if (al <= 0.01) return;
  for (let i = 0; i < n; i++) {
    const u = ((i / n + t * vel) % 1 + 1) % 1, [x, y] = puntoEn(P, u);
    k.brillo(g, x, y, tam, color, al * Math.sin(u * Math.PI));
  }
}
function tubo(g, P, w, oscuro, claro, al = 1) {
  if (al <= 0.01 || w <= 0.2) return;
  g.save(); g.globalAlpha *= al; g.lineCap = "round"; g.lineJoin = "round";
  g.beginPath(); P.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y)));
  g.strokeStyle = oscuro; g.lineWidth = w; g.stroke();
  g.strokeStyle = claro; g.lineWidth = w * 0.4; g.translate(-w * 0.15, -w * 0.15); g.stroke();
  g.restore();
}

// La cabeza entera. o (todo de 0 a 1 salvo donde se dice):
//   trans: lo transparente que es la piel (0: cabeza de cristal azul; 1: se ve todo lo de dentro)
//   calor: el cerebro, cálido y latiendo · frio: la escarcha de la frente · fuera: hasta dónde llega (0-1, crece)
//   bocaFria: el frío azul en la boca · paladar: el paladar encendido · vasos: el ancho de sus vasos (1 normal, 0,3
//   cerrados, 1,8 abiertos) · flujo: la sangre que corre por ellos · arteria: 0 apagada, 1 se ve, 2 inflada
//   craneo: el cráneo encendido · nervio: 0 a 1 (se ve) · chispa: [rama, u] el aviso que corre · frente: la rama de la
//   frente encendida · dolor: el dolor de la frente
export function cabeza(g, t, o = {}) {
  const trans = o.trans ?? 0, late = 0.5 + 0.5 * Math.sin(t * 6.5);
  // la sombra y el halo de la cabeza
  g.save();
  caminoCabeza(g);
  g.shadowColor = "rgba(80,170,255,0.55)"; g.shadowBlur = 90;
  const piel = g.createLinearGradient(-450, -560, 420, 820);
  piel.addColorStop(0, `rgba(70,150,255,${mez(0.55, 0.16, trans)})`); piel.addColorStop(0.5, `rgba(30,80,190,${mez(0.5, 0.12, trans)})`); piel.addColorStop(1, `rgba(10,30,90,${mez(0.6, 0.2, trans)})`);
  g.fillStyle = piel; g.fill();
  g.restore();
  g.save(); caminoCabeza(g); g.clip();
  // la textura de la piel
  g.globalCompositeOperation = "screen"; g.globalAlpha = 0.22 * (1 - trans * 0.6); g.drawImage(k.red, -800, -600, 1600, 1600); g.drawImage(k.red, -800, 1000, 1600, 1600);
  g.globalCompositeOperation = "source-over"; g.globalAlpha = 1;
  // lo de dentro
  const dentro = Math.max(0.15, trans);
  g.globalAlpha = dentro;
  // el cráneo
  const cr = o.craneo ?? 0;
  g.save(); g.translate(30, -110); g.scale(0.9, 0.9); g.translate(-30, 110);
  g.beginPath(); curvaPor(g, PERFIL.slice(30).concat(PERFIL.slice(0, 8)), false);
  g.strokeStyle = `rgba(${mezRgb("255,236,205", "255,120,90", cr)},${0.65 + 0.35 * cr})`; g.lineWidth = 16 + 10 * cr; g.lineCap = "round";
  if (cr > 0) { g.shadowColor = `rgba(255,90,60,${cr})`; g.shadowBlur = 40; }
  g.stroke(); g.restore();
  // el cerebro
  const cal = o.calor ?? 0;
  g.save();
  g.beginPath(); curvaPor(g, CEREBRO); curvaPor(g, CEREBELO);
  if (cal > 0) { g.shadowColor = `rgba(255,120,120,${0.6 * cal * (0.7 + 0.3 * late)})`; g.shadowBlur = 70; }
  g.fillStyle = "#c85a7c"; g.fill(); g.shadowBlur = 0; g.clip();
  g.drawImage(pliegues, -330, -520, 720, 680);
  const lu = g.createRadialGradient(-150, -400, 30, 0, -250, 520);
  lu.addColorStop(0, `rgba(255,230,220,${0.45 + 0.2 * cal})`); lu.addColorStop(0.5, "rgba(255,150,170,0.05)"); lu.addColorStop(1, "rgba(60,0,40,0.55)");
  g.fillStyle = lu; g.fillRect(-400, -560, 820, 760);
  if (cal > 0) { g.globalCompositeOperation = "lighter"; g.fillStyle = `rgba(255,110,60,${0.16 * cal * (0.6 + 0.4 * late)})`; g.fillRect(-400, -560, 820, 760); }
  g.restore();
  // la boca por dentro
  g.save();
  g.beginPath(); curvaPor(g, HUECO);
  const hb = g.createLinearGradient(-330, 160, 100, 380); hb.addColorStop(0, "#4a0a1c"); hb.addColorStop(1, "#1a0410");
  g.fillStyle = hb; g.fill();
  g.beginPath(); curvaPor(g, LENGUA);
  const lg = g.createLinearGradient(0, 220, 0, 360); lg.addColorStop(0, "#f07a8e"); lg.addColorStop(1, "#8a2440");
  g.fillStyle = lg; g.fill();
  // el paladar: una banda rosa con sus surcos
  const pal = o.paladar ?? 0;
  g.lineCap = "round"; g.lineJoin = "round";
  g.beginPath(); curvaPor(g, PALADAR, false);
  g.strokeStyle = `rgb(${mezRgb("200,90,120", "255,150,170", pal)})`; g.lineWidth = 34; g.stroke();
  g.strokeStyle = `rgba(255,220,230,${0.35 + 0.4 * pal})`; g.lineWidth = 8; g.translate(0, -8); g.stroke(); g.translate(0, 8);
  for (let i = 0; i < 6; i++) { const [x, y] = puntoEn(PALADAR, 0.06 + i * 0.07); g.strokeStyle = "rgba(140,30,60,0.6)"; g.lineWidth = 4; g.beginPath(); g.moveTo(x - 6, y - 10); g.quadraticCurveTo(x + 4, y, x - 6, y + 12); g.stroke(); }
  if (pal > 0) k.brillo(g, PALADAR_C[0], PALADAR_C[1] - 10, 520, "255,140,170", 0.55 * pal);
  // sus vasos
  const w = 7 * (o.vasos ?? 1);
  for (const V of VASOS) tubo(g, V, w, "#b0102a", "#ff5a6a", Math.max(0.3, pal));
  corre(g, VASOS[1], t, 9, 1.4 * (o.vasos ?? 1), "255,70,60", 34 + w * 3, o.flujo ?? 0);
  // el frío en la boca
  const bf = o.bocaFria ?? 0;
  if (bf > 0) {
    g.globalCompositeOperation = "lighter";
    const fg = g.createRadialGradient(-200, 230, 10, -200, 230, 260);
    fg.addColorStop(0, `rgba(150,220,255,${0.8 * bf})`); fg.addColorStop(1, "rgba(60,140,255,0)");
    g.fillStyle = fg; g.fillRect(-500, 0, 640, 460);
    g.globalCompositeOperation = "source-over";
    g.save(); g.beginPath(); curvaPor(g, HUECO); g.clip(); g.globalAlpha *= 0.55 * bf; g.globalCompositeOperation = "screen"; g.drawImage(escarcha, -420, 60, 460, 460); g.restore();
  }
  g.restore();
  // la arteria
  const ar = o.arteria ?? 0;
  if (ar > 0) {
    const inf = Math.max(0, ar - 1), wa = 14 + 40 * inf;
    if (inf > 0) { g.save(); g.globalCompositeOperation = "lighter"; g.beginPath(); ARTERIA.slice(55).forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.strokeStyle = `rgba(255,60,50,${0.35 * inf})`; g.lineWidth = wa * 2.4; g.lineCap = "round"; g.stroke(); g.restore(); }
    // el ancho crece hacia la frente cuando se infla
    const n = ARTERIA.length;
    for (let i = 1; i < n; i++) {
      const s = i / n, wi = 14 + 40 * inf * su(tr(s, 0.5, 0.8));
      g.save(); g.globalAlpha *= Math.min(1, ar); g.lineCap = "round";
      g.beginPath(); g.moveTo(...ARTERIA[i - 1]); g.lineTo(...ARTERIA[i]);
      g.strokeStyle = "#a0102a"; g.lineWidth = wi; g.stroke();
      g.strokeStyle = "rgba(255,120,120,0.85)"; g.lineWidth = wi * 0.35; g.translate(-wi * 0.15, -wi * 0.12); g.stroke();
      g.restore();
    }
    corre(g, ARTERIA, t, 12, 0.9, "255,80,70", 40 + 30 * inf, (o.flujoArteria ?? 0) * Math.min(1, ar));
  }
  // el nervio
  const nv = o.nervio ?? 0;
  if (nv > 0) {
    const ramas = [RAMA_PALADAR, RAMA_FRENTE, RAMA_CEREBRO];
    ramas.forEach((R, i) => {
      const enc = i === 1 ? (o.frente ?? 0) : 0;
      g.save(); g.globalAlpha *= nv; g.lineCap = "round"; g.lineJoin = "round";
      g.beginPath(); R.forEach(([x, y], j) => (j ? g.lineTo(x, y) : g.moveTo(x, y)));
      g.shadowColor = `rgba(255,220,80,${0.6 + 0.4 * enc})`; g.shadowBlur = 30 + 30 * enc;
      g.strokeStyle = `rgb(${mezRgb("230,190,60", "255,250,190", enc)})`; g.lineWidth = 12 + 6 * enc; g.stroke();
      g.restore();
    });
    k.brillo(g, NUDO[0], NUDO[1], 160, "amarilla", 0.8 * nv);
    if (o.chispa) { const [r, u] = o.chispa, [x, y] = puntoEn(ramas[r], u); k.brillo(g, x, y, 190, "255,240,150", nv); k.brillo(g, x, y, 70, "blanca", nv); }
  }
  g.restore(); // fin del clip de la cabeza
  // el borde de luz de la cabeza
  g.save(); caminoCabeza(g);
  g.strokeStyle = "rgba(150,215,255,0.9)"; g.lineWidth = 6; g.shadowColor = "rgba(120,200,255,0.9)"; g.shadowBlur = 24; g.stroke();
  g.restore();
  // la escarcha de la frente (encima de la piel, dentro de la cabeza)
  const fr = o.frio ?? 0;
  if (fr > 0.01) {
    const R = 160 + 420 * (o.fuera ?? fr), cx = FRENTE[0] - 30, cy = FRENTE[1];
    g.save(); caminoCabeza(g); g.clip();
    g.globalAlpha *= Math.min(1, fr); g.globalCompositeOperation = "screen"; g.drawImage(escarcha, cx - R * 0.7, cy - R * 0.7, 1.4 * R, 1.4 * R);
    g.drawImage(escarcha, cx - R, cy - R, 2 * R, 2 * R);
    g.restore();
  }
  dolor(g, FRENTE[0] - 30, FRENTE[1], o.dolor ?? 0, t);
}

// ---------------------------------------------------------------- el granizado
// Hielo picado azul, con sus cristales, dibujado una vez.
const hielo = (() => {
  const W = 400, H = 700, l = lienzo(W, H), c = l.getContext("2d"), az = azar(5150);
  const bg = c.createLinearGradient(0, 0, W, 0); bg.addColorStop(0, "#1a5cff"); bg.addColorStop(0.45, "#39a8ff"); bg.addColorStop(1, "#0c2f9a");
  c.fillStyle = bg; c.fillRect(0, 0, W, H);
  for (let i = 0; i < 900; i++) {
    const x = az() * W, y = az() * H, r = 3 + az() * 9;
    c.fillStyle = az() < 0.5 ? `rgba(200,240,255,${0.3 + az() * 0.5})` : `rgba(10,40,150,${0.3 + az() * 0.4})`;
    c.beginPath(); c.moveTo(x, y - r); c.lineTo(x + r * 0.8, y); c.lineTo(x, y + r); c.lineTo(x - r * 0.7, y); c.closePath(); c.fill();
  }
  return k.fijar(l);
})();
// El vaso: de pie en (x, y) (la base), alto h; nivel (0-1) de granizado; pajita hasta (px, py); sorbe: 0-1 (el
// granizado sube por la pajita).
export const VASO = { x: -640, y: 960, h: 480 };
export function granizado(g, t, nivel = 0.85, sorbe = 0, pajita = BOCA, V = VASO) {
  const { x, y, h } = V, wb = h * 0.27, wt = h * 0.38, top = y - h;
  const ancho = (yy) => mez(wb, wt, (y - yy) / h);
  // la pajita (por detrás, la parte de dentro del vaso)
  // una pajita de las que se doblan: sube recta por el centro de la tapa, se dobla y entra entre los labios
  const px = x + wt * 0.12, codo = Math.min(top - h * 0.3, pajita[1] + 40), R = 60;
  const fin = [pajita[0] + 6, pajita[1]];
  const ang = Math.atan2(fin[1] - (codo - R), fin[0] - (px + R));
  const pajitaCamino = (c) => {
    c.beginPath(); c.moveTo(px, y - h * 0.12); c.lineTo(px, codo);
    c.quadraticCurveTo(px, codo - R, px + R * Math.cos(ang) * 0.9 + R * 0.1, codo - R + R * Math.sin(ang) * 0.9);
    c.lineTo(fin[0], fin[1]);
  };
  const acordeon = () => {
    const A = [px, codo + 24], C = [px, codo - R], E = [px + R * Math.cos(ang) * 0.9 + R * 0.1, codo - R + R * Math.sin(ang) * 0.9];
    g.save(); g.lineCap = "round"; g.strokeStyle = "rgba(255,225,228,0.75)"; g.lineWidth = 3.5;
    for (let q = 0.12; q < 0.95; q += 0.14) {
      const m = 1 - q, X = m * m * A[0] + 2 * m * q * C[0] + q * q * E[0], Y = m * m * A[1] + 2 * m * q * C[1] + q * q * E[1];
      const dx = 2 * m * (C[0] - A[0]) + 2 * q * (E[0] - C[0]), dy = 2 * m * (C[1] - A[1]) + 2 * q * (E[1] - C[1]), L = Math.hypot(dx, dy);
      g.beginPath(); g.moveTo(X - dy / L * 14, Y + dx / L * 14); g.lineTo(X + dy / L * 14, Y - dx / L * 14); g.stroke();
    }
    g.restore();
  };
  // el granizado
  const yN = y - h * nivel;
  g.save();
  g.beginPath(); g.moveTo(x - wb, y); g.lineTo(x - ancho(yN), yN); g.quadraticCurveTo(x, yN - h * 0.12, x + ancho(yN), yN); g.lineTo(x + wb, y); g.closePath();
  g.clip(); g.drawImage(hielo, x - wt, top - h * 0.15, wt * 2, h * 1.2);
  const sh = g.createLinearGradient(x - wt, 0, x + wt, 0); sh.addColorStop(0, "rgba(0,0,40,0.35)"); sh.addColorStop(0.35, "rgba(255,255,255,0.12)"); sh.addColorStop(1, "rgba(0,0,40,0.55)");
  g.fillStyle = sh; g.fillRect(x - wt, top - 100, wt * 2, h + 200);
  g.restore();
  k.brillo(g, x, y - h * 0.5, h * 1.5, "60,150,255", 0.35);
  // la pajita: un tubo transparente con el granizado subiendo
  g.save(); g.lineCap = "round";
  pajitaCamino(g); g.strokeStyle = "rgba(255,80,90,0.95)"; g.lineWidth = 30; g.stroke();
  pajitaCamino(g); g.strokeStyle = "rgba(255,200,205,0.9)"; g.lineWidth = 8; g.translate(-6, -4); g.stroke(); g.translate(6, 4);
  if (sorbe > 0) {
    pajitaCamino(g); g.setLineDash([26, 14]); g.lineDashOffset = -t * 520; g.strokeStyle = `rgba(80,190,255,${sorbe})`; g.lineWidth = 18; g.stroke(); g.setLineDash([]);
  }
  acordeon();
  g.restore();
  // el vaso de plástico, con su tapa de cúpula
  g.save();
  g.beginPath(); g.moveTo(x - wb, y); g.lineTo(x - wt, top); g.lineTo(x + wt, top); g.lineTo(x + wb, y); g.closePath();
  const vg = g.createLinearGradient(x - wt, 0, x + wt, 0);
  vg.addColorStop(0, "rgba(255,255,255,0.28)"); vg.addColorStop(0.12, "rgba(255,255,255,0.05)"); vg.addColorStop(0.75, "rgba(255,255,255,0.02)"); vg.addColorStop(0.9, "rgba(255,255,255,0.22)"); vg.addColorStop(1, "rgba(255,255,255,0.05)");
  g.fillStyle = vg; g.fill(); g.strokeStyle = "rgba(220,240,255,0.7)"; g.lineWidth = 5; g.stroke();
  k.reflejo(g, x - wt * 0.72, top + h * 0.08, wt * 0.16, h * 0.8, 0.35);
  // la tapa
  g.beginPath(); g.ellipse(x, top, wt * 1.04, h * 0.035, 0, 0, Math.PI * 2); g.fillStyle = "rgba(230,245,255,0.55)"; g.fill();
  g.beginPath(); g.ellipse(x, top, wt * 0.95, h * 0.24, 0, Math.PI, Math.PI * 2); g.fillStyle = "rgba(200,230,255,0.12)"; g.fill(); g.strokeStyle = "rgba(230,245,255,0.6)"; g.lineWidth = 4; g.stroke();
  g.restore();
  // la escarcha del vaso (gotitas)
  const az = azar(77);
  g.save(); g.globalCompositeOperation = "lighter";
  for (let i = 0; i < 40; i++) { const yy = top + az() * h, xx = x + (az() - 0.5) * 2 * ancho(yy) * 0.9; g.fillStyle = `rgba(200,235,255,${0.3 + az() * 0.4})`; g.beginPath(); g.arc(xx, yy, 2 + az() * 4, 0, 6.283); g.fill(); }
  g.restore();
}

// Los trozos de hielo que salen volando hacia la cámara (en pantalla): u de 0 a 1.
const TROZOS = (() => { const az = azar(616); return Array.from({ length: 70 }, () => ({ a: az() * 6.283, v: 0.4 + az() * 0.9, r: 6 + az() * 20, giro: az() * 6, c: az() })); })();
export function trozos(g, x, y, u, al = 1) {
  if (u <= 0 || u >= 1 || al <= 0) return;
  g.save(); sinVista(g);
  for (const p of TROZOS) {
    const d = 1500 * p.v * k.entra(u), X = x + Math.cos(p.a) * d, Y = y + Math.sin(p.a) * d * 1.1, r = p.r * (1 + 3 * u);
    g.save(); g.translate(X, Y); g.rotate(p.giro + u * 4);
    g.globalAlpha = al * (1 - u);
    g.fillStyle = p.c < 0.5 ? "rgba(200,240,255,0.9)" : "rgba(70,160,255,0.9)";
    g.beginPath(); g.moveTo(0, -r); g.lineTo(r * 0.8, 0); g.lineTo(0, r); g.lineTo(-r * 0.7, 0); g.closePath(); g.fill();
    g.restore();
  }
  g.restore();
}
