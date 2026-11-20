// Lo que comparten los planos: el piso de la cocina visto desde arriba, a escala de hormiga (unidades del mundo: una
// hormiga mide 40), la concha, la taza, el hueco del zócalo (el hormiguero), las hormigas, sus caminos y el rastro de
// olor (cian). Todo en 2D; vista() pone la cámara (zoom Z, centro cx, cy).
import * as k from "#kit";

const { azar, lienzo, suave: su, tramo: tr, mez, entra } = k;
export const TAU = Math.PI * 2;

// ---------------------------------------------------------------- la cámara 2D
export function vista(g, Z, cx, cy) { g.setTransform(Z, 0, 0, Z, 540 - cx * Z, 960 - cy * Z); }
export const sinVista = (g) => g.setTransform(1, 0, 0, 1, 0, 0);
// lo que se ve del mundo con esa cámara (con margen)
const visible = (c, m = 0) => ({ x0: c[1] - 540 / c[0] - m, x1: c[1] + 540 / c[0] + m, y0: c[2] - 960 / c[0] - m, y1: c[2] + 960 / c[0] + m });

// ---------------------------------------------------------------- el sitio
export const NIDO = [-150, -905];          // el hueco del zócalo
export const PARED = -930;                 // donde empieza el zócalo (más arriba, la pared)
export const CONCHA = [40, 430], RC = 270; // la concha (pan dulce) y su radio
export const TAZA = [-50, -330], RT = 150; // la taza de café

// un camino suave que pasa por esos puntos, medido a lo largo (at(s) → {x, y, a}); s de 0 (el nido) a L
export function camino(P) {
  const pts = [];
  const cr = (p0, p1, p2, p3, u) => 0.5 * (2 * p1 + (-p0 + p2) * u + (2 * p0 - 5 * p1 + 4 * p2 - p3) * u * u + (-p0 + 3 * p1 - 3 * p2 + p3) * u * u * u);
  for (let i = 0; i < P.length - 1; i++) {
    const a = P[Math.max(0, i - 1)], b = P[i], c = P[i + 1], d = P[Math.min(P.length - 1, i + 2)];
    for (let j = 0; j < 40; j++) { const u = j / 40; pts.push([cr(a[0], b[0], c[0], d[0], u), cr(a[1], b[1], c[1], d[1], u)]); }
  }
  pts.push(P[P.length - 1]);
  const acc = [0];
  for (let i = 1; i < pts.length; i++) acc.push(acc[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const L = acc[acc.length - 1], PASO = 2, N = Math.ceil(L / PASO), X = new Float32Array(N + 1), Y = new Float32Array(N + 1);
  for (let n = 0, i = 0; n <= N; n++) {
    const s = Math.min(L, n * PASO);
    while (i < acc.length - 2 && acc[i + 1] < s) i++;
    const u = (s - acc[i]) / (acc[i + 1] - acc[i] || 1);
    X[n] = mez(pts[i][0], pts[i + 1][0], u); Y[n] = mez(pts[i][1], pts[i + 1][1], u);
  }
  const at = (s) => {
    const q = Math.max(0, Math.min(N - 1e-6, s / PASO)), n = Math.floor(q), u = q - n, m = Math.min(N, n + 1);
    const x = mez(X[n], X[m], u), y = mez(Y[n], Y[m], u);
    const n0 = Math.max(0, n - 2), n1 = Math.min(N, n + 3);
    return { x, y, a: Math.atan2(Y[n1] - Y[n0], X[n1] - X[n0]) };
  };
  return { L, at };
}
// los dos caminos del nido a la concha: el largo, por el lado del asa (el de la exploradora), y el corto
export const LARGO = camino([NIDO, [-120, -760], [90, -600], [235, -470], [295, -320], [250, -160], [150, -20], [95, 100], [85, 172]]);
export const CORTO = camino([NIDO, [-175, -760], [-225, -560], [-240, -330], [-195, -140], [-90, 40], [-5, 175]]);
// el paseo al azar de la exploradora, del nido hasta tocar la concha (por la izquierda, dando vueltas)
export const PASEO = camino([NIDO, [-260, -820], [-420, -690], [-330, -560], [-470, -420], [-560, -250], [-430, -120], [-520, 20], [-380, 110], [-300, -10], [-170, 60], [-120, 190], [-20, 80], [60, 130], [85, 172]]);

// ---------------------------------------------------------------- el piso
const azP = azar(77);
const TONO = Array.from({ length: 400 }, () => azP());
const LADO = 240; // baldosa
export function piso(g, c) {
  const V = visible(c, 20);
  g.fillStyle = "#e9c99a"; g.fillRect(V.x0, V.y0, V.x1 - V.x0, V.y1 - V.y0);
  // cada baldosa con su tono, su degradado de luz y su textura
  const i0 = Math.floor(V.x0 / LADO), i1 = Math.floor(V.x1 / LADO), j0 = Math.floor(V.y0 / LADO), j1 = Math.floor(V.y1 / LADO);
  for (let i = i0; i <= i1; i++) for (let j = j0; j <= j1; j++) {
    const h = TONO[((i * 31 + j * 17) % 400 + 400) % 400], x = i * LADO, y = j * LADO;
    const gr = g.createLinearGradient(x, y, x + LADO, y + LADO);
    gr.addColorStop(0, `rgb(${246 - h * 10},${222 - h * 12},${184 - h * 16})`); gr.addColorStop(1, `rgb(${232 - h * 12},${200 - h * 14},${158 - h * 14})`);
    g.fillStyle = gr; g.fillRect(x, y, LADO, LADO);
  }
  g.save(); g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.1;
  const M = 900, mi0 = Math.floor(V.x0 / M), mi1 = Math.floor(V.x1 / M), mj0 = Math.floor(V.y0 / M), mj1 = Math.floor(V.y1 / M);
  for (let i = mi0; i <= mi1; i++) for (let j = mj0; j <= mj1; j++) g.drawImage(k.manchas, i * M, j * M, M, M);
  g.restore();
  // las juntas: hundidas, con su borde de luz
  g.save(); g.lineCap = "butt";
  for (let pase = 0; pase < 2; pase++) {
    g.strokeStyle = pase ? "rgba(255,244,222,0.55)" : "rgba(150,110,70,0.75)";
    g.lineWidth = pase ? 1.6 : 5;
    const o = pase ? 3 : 0;
    g.beginPath();
    for (let i = i0; i <= i1 + 1; i++) { g.moveTo(i * LADO + o, V.y0); g.lineTo(i * LADO + o, V.y1); }
    for (let j = j0; j <= j1 + 1; j++) { g.moveTo(V.x0, j * LADO + o); g.lineTo(V.x1, j * LADO + o); }
    g.stroke();
  }
  g.restore();
}
// el zócalo (y la pared detrás), con el hueco del hormiguero; dentro, oscuro
export function zocalo(g, c) {
  const V = visible(c, 20);
  if (V.y0 > PARED + 40) return;
  // la sombra que el zócalo echa en el piso
  const sg = g.createLinearGradient(0, PARED, 0, PARED + 70); sg.addColorStop(0, "rgba(90,50,20,0.45)"); sg.addColorStop(1, "rgba(90,50,20,0)");
  g.fillStyle = sg; g.fillRect(V.x0, PARED, V.x1 - V.x0, 70);
  // el frente del zócalo: madera blanca, con su borde de luz arriba
  const zg = g.createLinearGradient(0, PARED - 120, 0, PARED);
  zg.addColorStop(0, "#fffaf0"); zg.addColorStop(0.12, "#f3ead8"); zg.addColorStop(0.85, "#d9cbb0"); zg.addColorStop(1, "#b9a682");
  g.fillStyle = zg; g.fillRect(V.x0, PARED - 120, V.x1 - V.x0, 120);
  g.fillStyle = "rgba(255,255,255,0.8)"; g.fillRect(V.x0, PARED - 122, V.x1 - V.x0, 4);
  // la pared, de un verde agua, con la luz del sol
  const pg = g.createLinearGradient(0, PARED - 900, 0, PARED - 120);
  pg.addColorStop(0, "#1f6f74"); pg.addColorStop(1, "#3fa3a0");
  g.fillStyle = pg; g.fillRect(V.x0, PARED - 1400, V.x1 - V.x0, 1280);
  g.save(); g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.25; g.drawImage(k.manchas, V.x0, PARED - 1400, Math.max(900, V.x1 - V.x0), 1280); g.restore();
  // el hueco: un arco negro, con su profundidad
  hueco(g);
}
export function hueco(g) {
  const [x, y] = NIDO;
  g.save();
  g.beginPath(); g.moveTo(x - 70, PARED); g.quadraticCurveTo(x - 66, y - 70, x - 10, y - 74); g.quadraticCurveTo(x + 60, y - 76, x + 74, PARED); g.closePath();
  const hg = g.createRadialGradient(x, PARED, 4, x, PARED - 20, 90);
  hg.addColorStop(0, "#050201"); hg.addColorStop(0.7, "#160b05"); hg.addColorStop(1, "#4a3220");
  g.fillStyle = hg; g.fill();
  g.strokeStyle = "rgba(255,245,225,0.6)"; g.lineWidth = 2.5; g.stroke();
  g.restore();
}
// recorta lo que entra en el hueco (las hormigas que se meten): solo se ve lo que está en el piso o en la boca del hueco
export function recortePiso(g) {
  const [x] = NIDO;
  g.beginPath(); g.rect(-5000, PARED, 10000, 10000);
  g.moveTo(x - 70, PARED); g.quadraticCurveTo(x - 66, NIDO[1] - 70, x - 10, NIDO[1] - 74); g.quadraticCurveTo(x + 60, NIDO[1] - 76, x + 74, PARED); g.closePath();
  g.clip();
}

// ---------------------------------------------------------------- la concha (pan dulce rosa), hecha una vez
const PXC = 3.2; // píxeles del lienzo por unidad del mundo
const conchaImg = (() => {
  const D = Math.ceil((RC + 40) * 2 * PXC), L = lienzo(D), x = L.getContext("2d"), c = D / 2, R = RC * PXC, az = azar(303);
  // el pan: dorado, con su borde tostado
  const pg = x.createRadialGradient(c - R * 0.3, c - R * 0.3, R * 0.2, c, c, R);
  pg.addColorStop(0, "#f6c27a"); pg.addColorStop(0.75, "#d98d3f"); pg.addColorStop(1, "#9b5620");
  x.fillStyle = pg; x.beginPath(); x.arc(c, c, R, 0, TAU); x.fill();
  // la costra de azúcar rosa: algo más pequeña, con las rayas de concha
  const Rc = R * 0.9;
  x.save(); x.beginPath(); x.arc(c, c, Rc, 0, TAU); x.clip();
  const cg = x.createRadialGradient(c - Rc * 0.35, c - Rc * 0.4, Rc * 0.1, c, c, Rc * 1.05);
  cg.addColorStop(0, "#ffd6e4"); cg.addColorStop(0.5, "#f79ab9"); cg.addColorStop(1, "#d8628c");
  x.fillStyle = cg; x.fillRect(0, 0, D, D);
  // las rayas: un abanico desde abajo, y arcos que lo cruzan; la grieta deja ver el pan
  const fx = c, fy = c + Rc * 1.05;
  // cada raya: un surco que deja ver el pan, con su sombra blanda y su borde de luz (la costra abombada a los lados)
  const raya = (dib) => {
    x.save(); x.filter = `blur(${R * 0.02}px)`; x.strokeStyle = "rgba(150,40,70,0.45)"; x.lineWidth = R * 0.07; x.lineCap = "round"; dib(); x.stroke(); x.restore();
    x.strokeStyle = "#d9893f"; x.lineWidth = R * 0.03; x.lineCap = "round"; dib(); x.stroke();
    x.strokeStyle = "rgba(120,60,20,0.6)"; x.lineWidth = R * 0.012; dib(); x.stroke();
    x.save(); x.translate(-R * 0.02, -R * 0.024); x.strokeStyle = "rgba(255,235,242,0.8)"; x.lineWidth = R * 0.01; dib(); x.stroke(); x.restore();
  };
  const az2 = azar(808);
  for (let i = -6; i <= 6; i++) { const a = -Math.PI / 2 + i * 0.2 + (az2() - 0.5) * 0.05; raya(() => { x.beginPath(); x.moveTo(fx, fy); x.quadraticCurveTo(fx + Math.cos(a) * Rc * 1.1 + (az2() - 0.5) * 20, fy + Math.sin(a) * Rc * 1.1 + Rc * 0.1, fx + Math.cos(a) * Rc * 2.3, fy + Math.sin(a) * Rc * 2.3); }); }
  for (let j = 1; j <= 5; j++) raya(() => { x.beginPath(); x.arc(fx, fy, Rc * 0.38 * j + (az2() - 0.5) * 10, Math.PI, TAU); });
  // granitos de azúcar
  for (let i = 0; i < 2600; i++) { const a = az() * TAU, r = Math.sqrt(az()) * Rc; x.fillStyle = az() < 0.5 ? "rgba(255,255,255,0.7)" : "rgba(200,70,110,0.25)"; x.fillRect(c + Math.cos(a) * r, c + Math.sin(a) * r, 2 + az() * 3, 2 + az() * 3); }
  x.globalCompositeOperation = "multiply"; x.globalAlpha = 0.25; x.drawImage(k.manchas, 0, 0, D, D);
  x.restore();
  // el borde de la costra, con sombra hacia abajo a la derecha
  x.strokeStyle = "rgba(150,60,40,0.35)"; x.lineWidth = R * 0.03; x.beginPath(); x.arc(c + R * 0.01, c + R * 0.015, Rc, 0, TAU); x.stroke();
  // la luz de arriba a la izquierda y la sombra del otro lado
  const lg = x.createLinearGradient(c - R, c - R, c + R, c + R);
  lg.addColorStop(0, "rgba(255,255,255,0.22)"); lg.addColorStop(0.5, "rgba(255,255,255,0)"); lg.addColorStop(1, "rgba(80,20,10,0.3)");
  x.fillStyle = lg; x.beginPath(); x.arc(c, c, R, 0, TAU); x.fill();
  return L;
})();
// la concha, de 0 (no queda nada) a 1 (entera): se la van comiendo desde el borde
export function concha(g, entera = 1) {
  if (entera <= 0.01) return;
  const [cx, cy] = CONCHA, W = conchaImg.width / PXC;
  // su sombra en el piso
  const sg = g.createRadialGradient(cx + 25, cy + 35, RC * 0.6, cx + 25, cy + 35, RC * 1.25);
  sg.addColorStop(0, `rgba(110,60,25,${0.45 * entera})`); sg.addColorStop(1, "rgba(110,60,25,0)");
  g.fillStyle = sg; g.beginPath(); g.arc(cx + 25, cy + 35, RC * 1.25, 0, TAU); g.fill();
  g.save();
  if (entera < 1) {
    // mordida: el borde se come en bocados irregulares
    const R = RC * Math.sqrt(entera), az = azar(55);
    g.beginPath();
    for (let i = 0; i <= 60; i++) { const a = (i / 60) * TAU, r = R * (0.9 + 0.1 * Math.sin(a * 9 + 1) + 0.05 * Math.sin(a * 23)); i ? g.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r) : g.moveTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r); }
    g.closePath(); g.clip();
    void az;
  }
  g.drawImage(conchaImg, cx - W / 2, cy - W / 2, W, W);
  g.restore();
}

// ---------------------------------------------------------------- la taza (desde arriba), hecha una vez
const PXT = 3;
const tazaImg = (() => {
  const D = Math.ceil((RT + 110) * 2 * PXT), L = lienzo(D), x = L.getContext("2d"), c = D / 2, R = RT * PXT;
  // el asa, a la derecha
  x.lineCap = "round";
  x.strokeStyle = "#c98a10"; x.lineWidth = R * 0.2; x.beginPath(); x.arc(c + R * 1.02, c, R * 0.34, -1.35, 1.35); x.stroke();
  x.strokeStyle = "#ffcf3a"; x.lineWidth = R * 0.12; x.beginPath(); x.arc(c + R * 1.0, c - R * 0.01, R * 0.34, -1.3, 1.3); x.stroke();
  // el borde: cerámica amarilla con brillo
  const bg = x.createRadialGradient(c - R * 0.4, c - R * 0.4, R * 0.1, c, c, R);
  bg.addColorStop(0, "#fff1a8"); bg.addColorStop(0.6, "#ffc928"); bg.addColorStop(1, "#d8930c");
  x.fillStyle = bg; x.beginPath(); x.arc(c, c, R, 0, TAU); x.fill();
  // el café dentro
  const ri = R * 0.84;
  const cf = x.createRadialGradient(c + ri * 0.2, c + ri * 0.2, ri * 0.1, c, c, ri);
  cf.addColorStop(0, "#5a2e12"); cf.addColorStop(0.8, "#3a1a08"); cf.addColorStop(1, "#1d0c04");
  x.fillStyle = cf; x.beginPath(); x.arc(c, c, ri, 0, TAU); x.fill();
  // la espuma en el borde del café y el reflejo de la ventana
  x.strokeStyle = "rgba(210,160,110,0.55)"; x.lineWidth = R * 0.05; x.beginPath(); x.arc(c, c, ri * 0.95, 0, TAU); x.stroke();
  x.fillStyle = "rgba(255,255,255,0.35)"; x.beginPath(); x.ellipse(c - ri * 0.35, c - ri * 0.4, ri * 0.28, ri * 0.1, -0.7, 0, TAU); x.fill();
  // el labio del borde, con su luz
  x.strokeStyle = "rgba(255,255,230,0.9)"; x.lineWidth = R * 0.02; x.beginPath(); x.arc(c, c, R * 0.92, Math.PI * 0.9, Math.PI * 1.6); x.stroke();
  x.strokeStyle = "rgba(150,90,0,0.5)"; x.lineWidth = R * 0.03; x.beginPath(); x.arc(c, c, ri, 0, TAU); x.stroke();
  return L;
})();
export function taza(g) {
  const [cx, cy] = TAZA, W = tazaImg.width / PXT;
  const sg = g.createRadialGradient(cx + 45, cy + 55, RT * 0.5, cx + 45, cy + 55, RT * 1.45);
  sg.addColorStop(0, "rgba(110,60,25,0.5)"); sg.addColorStop(1, "rgba(110,60,25,0)");
  g.fillStyle = sg; g.beginPath(); g.arc(cx + 45, cy + 55, RT * 1.45, 0, TAU); g.fill();
  g.drawImage(tazaImg, cx - W / 2, cy - W / 2, W, W);
}

// ---------------------------------------------------------------- granos de azúcar por el piso, junto a la concha
const azA = azar(919);
export const GRANOS = Array.from({ length: 70 }, () => { const a = azA() * TAU, r = RC * (1.05 + Math.pow(azA(), 1.5) * 0.9); return { x: CONCHA[0] + Math.cos(a) * r, y: CONCHA[1] + Math.sin(a) * r, s: 3 + azA() * 5, a: azA() * TAU }; });
// un cristal de azúcar: un cubito con sus caras y un destello
export function cristal(g, x, y, s, a, al = 1) {
  g.save(); g.translate(x, y); g.rotate(a); g.globalAlpha *= al;
  g.fillStyle = "rgba(120,80,40,0.25)"; g.fillRect(-s + s * 0.25, -s + s * 0.35, 2 * s, 2 * s);
  const gr = g.createLinearGradient(-s, -s, s, s); gr.addColorStop(0, "#ffffff"); gr.addColorStop(0.55, "#eef4ff"); gr.addColorStop(1, "#b8c4d8");
  g.fillStyle = gr; g.fillRect(-s, -s, 2 * s, 2 * s);
  g.fillStyle = "rgba(255,255,255,0.95)"; g.beginPath(); g.moveTo(-s, -s); g.lineTo(s, -s); g.lineTo(s * 0.55, -s * 0.55); g.lineTo(-s * 0.55, -s * 0.55); g.closePath(); g.fill();
  g.fillStyle = "rgba(150,165,195,0.6)"; g.beginPath(); g.moveTo(s, -s); g.lineTo(s, s); g.lineTo(s * 0.55, s * 0.55); g.lineTo(s * 0.55, -s * 0.55); g.closePath(); g.fill();
  g.strokeStyle = "rgba(255,255,255,0.9)"; g.lineWidth = s * 0.08; g.strokeRect(-s * 0.55, -s * 0.55, s * 1.1, s * 1.1);
  g.restore();
}
export function granos(g, c) {
  const V = visible(c, 20);
  for (const q of GRANOS) if (q.x > V.x0 && q.x < V.x1 && q.y > V.y0 && q.y < V.y1) cristal(g, q.x, q.y, q.s, q.a);
}

// ---------------------------------------------------------------- la hormiga (de arriba; mira hacia +x; mide 40)
// fase: lo que ha andado (mueve las patas); ant: cuánto mueve las antenas (0-1+); carga: "azucar" | "rosa" | null;
// punta: 0-1, la punta del abdomen toca el piso; boca: 0-1, la cabeza baja a morder.
const CUERPO = { gaster: "#2a150a", luz: "#7a4724" };
export function hormiga(g, x, y, ang, o = {}) {
  const { fase = 0, ant = 0.4, carga = null, t = 0, semilla = 0, punta = 0, boca = 0, al = 1, zoom = 1 } = o;
  const px = 40 * zoom; // lo que mide en pantalla
  g.save(); g.translate(x, y); g.rotate(ang); g.globalAlpha *= al;
  const tripode = Math.sin(fase * 0.32), tri2 = -tripode;
  // la sombra en el piso
  g.fillStyle = "rgba(90,45,15,0.22)";
  for (const [ex, rx, ry] of [[-11, 10, 7.5], [5, 6.6, 3.7], [14.5, 5.3, 4.9]]) { g.beginPath(); g.ellipse(ex + 2.5, 3.5, rx, ry, 0, 0, TAU); g.fill(); }
  if (px < 16) {
    // de lejos: tres manchas y las patas en trazos
    g.strokeStyle = CUERPO.gaster; g.lineWidth = 1.6;
    g.beginPath();
    for (const lado of [-1, 1]) for (let i = 0; i < 3; i++) { const b = [6.5, 4.5, 2.5][i], sw = (i % 2 ? tri2 : tripode) * lado * 3; g.moveTo(b, 0); g.lineTo(b + [9, 1, -9][i] + sw, lado * 12); }
    g.stroke();
    g.fillStyle = CUERPO.gaster;
    g.beginPath(); g.ellipse(-11, 0, 10, 7.5, 0, 0, TAU); g.fill();
    g.beginPath(); g.ellipse(5, 0, 6.5, 3.6, 0, 0, TAU); g.fill();
    g.beginPath(); g.ellipse(14.5, 0, 5.2, 4.8, 0, 0, TAU); g.fill();
    if (carga) cargaDibujo(g, carga);
    g.restore(); return;
  }
  // las patas: tres pares, en trípode alterno; muslo y pierna, con codo
  g.lineCap = "round"; g.lineJoin = "round";
  const PATAS = [[7, 0.75, 9, 8], [4.5, 1.6, 10, 9], [2, 2.45, 11, 11]];
  for (const lado of [-1, 1]) PATAS.forEach(([bx, a0, l1, l2], i) => {
    const sw = (i % 2 ? tri2 : tripode) * (lado > 0 ? 1 : -1);
    const a = (a0 + sw * 0.28) * lado, kx = bx + Math.cos(a) * l1, ky = Math.sin(a) * l1 * 1.05;
    const a2 = a + lado * (i === 0 ? -0.55 : i === 1 ? 0.15 : 0.5), fx = kx + Math.cos(a2) * l2, fy = ky + Math.sin(a2) * l2;
    const a3 = a2 + lado * (i === 2 ? 0.35 : -0.35), tx = fx + Math.cos(a3) * 3.5, ty = fy + Math.sin(a3) * 3.5;
    g.strokeStyle = "#1c0e06";
    g.lineWidth = 1.9; g.beginPath(); g.moveTo(bx, 0); g.lineTo(kx, ky); g.stroke();
    g.lineWidth = 1.25; g.beginPath(); g.moveTo(kx, ky); g.lineTo(fx, fy); g.stroke();
    g.lineWidth = 0.75; g.beginPath(); g.moveTo(fx, fy); g.lineTo(tx, ty); g.stroke();
    g.fillStyle = "#2a160a"; g.beginPath(); g.arc(kx, ky, 1.1, 0, TAU); g.fill(); g.beginPath(); g.arc(fx, fy, 0.75, 0, TAU); g.fill();
    g.strokeStyle = "rgba(190,130,85,0.5)"; g.lineWidth = 0.4; g.beginPath(); g.moveTo(bx, -0.5); g.lineTo(kx, ky - 0.5); g.lineTo(fx, fy - 0.35); g.stroke();
  });
  // el abdomen (gaster), con su brillo y sus anillos; la punta baja al piso
  const bulto = (cx, cy, rx, ry, base = CUERPO.gaster, luz = CUERPO.luz) => {
    const gr = g.createRadialGradient(cx + rx * 0.2, cy - ry * 0.45, Math.min(rx, ry) * 0.1, cx, cy, Math.max(rx, ry) * 1.05);
    gr.addColorStop(0, luz); gr.addColorStop(0.55, base); gr.addColorStop(1, "#0c0502");
    g.fillStyle = gr; g.beginPath(); g.ellipse(cx, cy, rx, ry, 0, 0, TAU); g.fill();
    g.fillStyle = "rgba(255,235,210,0.5)"; g.beginPath(); g.ellipse(cx + rx * 0.15, cy - ry * 0.5, rx * 0.45, ry * 0.16, 0, 0, TAU); g.fill();
  };
  const gx = -11 - punta * 1.5;
  bulto(gx, 0, 10 + punta * 0.6, 7.5);
  g.strokeStyle = "rgba(0,0,0,0.45)"; g.lineWidth = 0.9;
  for (const dx of [-4, 0.5, 4.5]) { g.beginPath(); g.ellipse(gx + dx, 0, 2.2, 7 - Math.abs(dx) * 0.35, 0, -1.3, 1.3); g.stroke(); }
  g.strokeStyle = "rgba(255,220,190,0.35)"; g.lineWidth = 0.6;
  for (const dx of [-3, 1.5]) { g.beginPath(); g.ellipse(gx + dx, 0, 2.2, 6.6, 0, -1.2, -0.3); g.stroke(); }
  // el pecíolo (la cinturita) y el tórax
  bulto(-0.8, 0, 2.4, 2.2);
  bulto(5, 0, 6.6, 3.7);
  // la cabeza, con sus ojos y sus mandíbulas
  const hx = 14.5 + boca * 1.2;
  g.fillStyle = "#1a0c05";
  for (const lado of [-1, 1]) { g.beginPath(); g.moveTo(hx + 3.5, lado * 1.6); g.quadraticCurveTo(hx + 7.5, lado * 3.6, hx + 8.6, lado * 0.6); g.lineTo(hx + 7.4, lado * 0.3); g.quadraticCurveTo(hx + 6.4, lado * 2.2, hx + 3.6, lado * 0.6); g.closePath(); g.fill(); }
  bulto(hx, 0, 5.3, 4.9);
  g.fillStyle = "#050302"; for (const lado of [-1, 1]) { g.beginPath(); g.ellipse(hx - 0.2, lado * 4.1, 1.5, 1.0, 0.2 * lado, 0, TAU); g.fill(); }
  g.fillStyle = "rgba(255,255,255,0.7)"; for (const lado of [-1, 1]) { g.beginPath(); g.arc(hx - 0.5, lado * 4.0 - 0.3, 0.35, 0, TAU); g.fill(); }
  if (carga) cargaDibujo(g, carga, boca);
  // las antenas: el primer tramo (escapo) hacia fuera, el codo, y el resto hacia delante, moviéndose
  for (const lado of [-1, 1]) {
    const w1 = Math.sin(t * 7.3 + semilla + lado) * ant, w2 = Math.sin(t * 9.1 + semilla * 1.7 + lado * 2) * ant;
    const bx = hx + 3.2, by = lado * 2.3;
    const a1 = lado * (0.95 + 0.25 * w1), ex = bx + Math.cos(a1) * 7, ey = by + Math.sin(a1) * 7;
    const a2 = lado * (-0.15 + 0.45 * w2), tx = ex + Math.cos(a2) * 9, ty = ey + Math.sin(a2) * 9;
    g.strokeStyle = "#241206"; g.lineWidth = 1.1; g.beginPath(); g.moveTo(bx, by); g.lineTo(ex, ey); g.quadraticCurveTo(ex + Math.cos(a2) * 4, ey + Math.sin(a2) * 4, tx, ty); g.stroke();
    g.strokeStyle = "rgba(200,140,90,0.5)"; g.lineWidth = 0.5; g.beginPath(); g.moveTo(bx, by - 0.4); g.lineTo(ex, ey - 0.4); g.stroke();
    g.fillStyle = "#241206"; g.beginPath(); g.ellipse(tx - Math.cos(a2) * 1.2, ty - Math.sin(a2) * 1.2, 1.6, 1.05, a2, 0, TAU); g.fill();
    if (o.puntasLuz) k.brillo(g, tx, ty, 16, o.puntasColor || "255,170,200", o.puntasLuz);
  }
  g.restore();
}
// dónde quedan las puntas de las antenas, la boca y la punta del abdomen (para la luz y los efectos)
export const PUNTA_ABDOMEN = -21.5, BOCA = 23;
function cargaDibujo(g, carga, boca = 0) {
  const x = 23.5 + boca;
  if (carga === "azucar") cristal(g, x + 3, 0, 4.2, 0.5);
  else {
    g.save(); g.translate(x + 2.5, 0);
    const gr = g.createRadialGradient(-1, -1.5, 0.5, 0, 0, 5); gr.addColorStop(0, "#ffd7e6"); gr.addColorStop(0.6, "#f590b2"); gr.addColorStop(1, "#c25a2c");
    g.fillStyle = gr; g.beginPath(); g.moveTo(-3.5, -3); g.lineTo(3.5, -4); g.lineTo(5, 1.5); g.lineTo(1, 4.5); g.lineTo(-4, 2.5); g.closePath(); g.fill();
    g.fillStyle = "rgba(255,255,255,0.8)"; g.fillRect(-1.5, -2.5, 1.2, 1.2); g.fillRect(1.5, 0, 1, 1);
    g.restore();
  }
}

// ---------------------------------------------------------------- la colonia: hormigas que van y vuelven por un camino
// Cada una sale del nido en d (segundos de su reloj), va por su camino, entra en la concha hasta un punto, come un
// rato y vuelve cargada. Todo sale del reloj tau: si tau va hacia atrás, vuelven andando de espaldas.
export function colonia(n, semilla, { d0, d1, ritmo = 1, eligeCorto }) {
  const az = azar(semilla);
  return Array.from({ length: n }, (_, i) => {
    const u = Math.pow((i + az()) / n, 1 / ritmo);
    const d = mez(d0, d1, u);
    const a = az() * TAU, r = Math.sqrt(az()) * RC * 0.78;
    return {
      d, v: 470 + az() * 120, lado: (az() - 0.5) * 26, P: [CONCHA[0] + Math.cos(a) * r, CONCHA[1] + Math.sin(a) * r],
      come: 1.0 + az() * 1.6, gira: 1.5 + az() * 2, carga: az() < 0.45 ? "azucar" : "rosa", semilla: az() * 10,
      corto: eligeCorto ? eligeCorto(d, az()) : false, i,
    };
  });
}
// dónde está esa hormiga en tau (null: en el nido)
export function donde(h, tau) {
  const ruta = h.corto ? CORTO : LARGO, L = ruta.L, u = tau - h.d;
  if (u < 0) return null;
  const tA = L / h.v, E = ruta.at(L), dP = Math.hypot(h.P[0] - E.x, h.P[1] - E.y), tB = dP / (h.v * 0.45);
  const fin = tA + tB + h.come + tB + tA;
  if (u > fin) return null;
  const sobre = (s, atras) => { const p = ruta.at(s), nx = -Math.sin(p.a), ny = Math.cos(p.a); return { x: p.x + nx * h.lado, y: p.y + ny * h.lado, a: atras ? p.a + Math.PI : p.a }; };
  let p, carga = null, anda;
  if (u < tA) { p = sobre(u * h.v); anda = u * h.v; }
  else if (u < tA + tB) { const w = (u - tA) / tB; p = { x: mez(E.x, h.P[0], w), y: mez(E.y, h.P[1], w), a: Math.atan2(h.P[1] - E.y, h.P[0] - E.x) }; anda = L + w * dP; }
  else if (u < tA + tB + h.come) {
    const w = u - tA - tB, r = 10 * Math.sin(w * 1.4);
    p = { x: h.P[0] + Math.cos(w * h.gira) * r, y: h.P[1] + Math.sin(w * h.gira) * r, a: Math.atan2(h.P[1] - E.y, h.P[0] - E.x) + Math.sin(w * h.gira) * 1.2 };
    anda = L + dP + w * 60; carga = w > h.come * 0.6 ? h.carga : null;
  } else if (u < tA + 2 * tB + h.come) { const w = (u - tA - tB - h.come) / tB; p = { x: mez(h.P[0], E.x, w), y: mez(h.P[1], E.y, w), a: Math.atan2(E.y - h.P[1], E.x - h.P[0]) }; anda = L + dP * (1 + w) + h.come * 60; carga = h.carga; }
  else { const w = u - tA - 2 * tB - h.come; p = sobre(L - w * h.v, true); anda = 2 * L + 2 * dP + h.come * 60 - L + w * h.v; carga = h.carga; }
  return { ...p, anda, carga, vuelve: carga != null };
}
// dibuja una colonia (lo que se ve), de abajo arriba
export function dibujaColonia(g, c, lista, tau, t, extra = {}) {
  const V = visible(c, 40);
  for (const h of lista) {
    const p = donde(h, tau);
    if (!p || p.x < V.x0 || p.x > V.x1 || p.y < V.y0 || p.y > V.y1) continue;
    hormiga(g, p.x, p.y, p.a, { fase: p.anda, carga: p.carga, t, semilla: h.semilla, zoom: c[0], ant: extra.ant ?? 0.35, al: extra.al ?? 1 });
  }
}

// ---------------------------------------------------------------- el rastro de olor (cian)
export const OLOR = "120,235,255";
const azR = azar(4242);
const migas = (ruta) => { const M = []; for (let s = 6; s < ruta.L; s += 9 + azR() * 6) { const p = ruta.at(s), off = (azR() - 0.5) * 7; M.push({ s, x: p.x - Math.sin(p.a) * off, y: p.y + Math.cos(p.a) * off, r: 1.6 + azR() * 1.8, f: azR() * 6, a: azR() * TAU }); } return M; };
export const MIGAS = { largo: migas(LARGO), corto: migas(CORTO) };
// el rastro de un camino, de s0 a s1, con su fuerza (0-1+); pan: 0-1, las migas se ven de pan
export function rastro(g, cual, s0, s1, fuerza, t, { pan = 0, ancho = 1, ola = null } = {}) {
  if (fuerza <= 0.005 && pan <= 0.005) return;
  const ruta = cual === "corto" ? CORTO : LARGO;
  g.save();
  // un velo continuo, suave, por debajo
  if (fuerza > 0.01) {
    g.globalCompositeOperation = "lighter"; g.lineCap = "round"; g.lineJoin = "round";
    for (const [w, a] of [[26 * ancho, 0.07], [12 * ancho, 0.12], [4 * ancho, 0.22]]) {
      g.strokeStyle = `rgba(${OLOR},${Math.min(1, a * fuerza)})`; g.lineWidth = w; g.beginPath();
      for (let s = Math.max(0, s0); s <= Math.min(ruta.L, s1); s += 8) { const p = ruta.at(s); s === Math.max(0, s0) ? g.moveTo(p.x, p.y) : g.lineTo(p.x, p.y); }
      g.stroke();
    }
  }
  // las gotitas de olor (o migas de pan)
  for (const m of MIGAS[cual]) {
    if (m.s < s0 || m.s > s1) continue;
    const olaF = ola ? ola(m.s) : 1;
    const f = fuerza * olaF * (0.75 + 0.25 * Math.sin(t * 3 + m.f));
    if (pan > 0.01) {
      g.globalCompositeOperation = "source-over";
      g.save(); g.translate(m.x, m.y); g.rotate(m.a); g.globalAlpha *= pan;
      const r = m.r * 1.9, gr = g.createRadialGradient(-r * 0.3, -r * 0.3, 0.2, 0, 0, r * 1.2);
      gr.addColorStop(0, "#ffe6a8"); gr.addColorStop(0.6, "#e2a24c"); gr.addColorStop(1, "#9c5a1e");
      g.fillStyle = "rgba(90,45,15,0.3)"; g.beginPath(); g.ellipse(r * 0.3, r * 0.4, r * 1.1, r * 0.8, 0, 0, TAU); g.fill();
      g.fillStyle = gr; g.beginPath(); g.moveTo(-r, -r * 0.5); g.lineTo(r * 0.2, -r); g.lineTo(r, -r * 0.1); g.lineTo(r * 0.6, r * 0.8); g.lineTo(-r * 0.7, r * 0.7); g.closePath(); g.fill();
      g.restore();
    }
    if (f > 0.01) {
      g.globalCompositeOperation = "lighter";
      k.brillo(g, m.x, m.y, 22 * m.r * ancho, OLOR, Math.min(1, 0.5 * f));
      g.fillStyle = `rgba(220,255,255,${Math.min(1, 0.85 * f)})`; g.beginPath(); g.arc(m.x, m.y, m.r * 0.9 * Math.min(1.6, ancho), 0, TAU); g.fill();
    }
  }
  g.restore();
}

// ---------------------------------------------------------------- el olor del azúcar: cintas rosa dorado que suben del pan
export function olorAzucar(g, x, y, hacia, t, al) {
  if (al <= 0.01) return;
  g.save(); g.globalCompositeOperation = "lighter"; g.lineCap = "round";
  for (let i = 0; i < 7; i++) {
    const f = i * 1.37, fase = (t * 0.55 + i / 7) % 1;
    const sx = x + Math.sin(f * 3) * 40, sy = y + Math.cos(f * 2) * 25;
    const ex = mez(sx, hacia[0], fase), ey = mez(sy, hacia[1], fase);
    const a = al * Math.sin(fase * Math.PI) * 0.6;
    g.strokeStyle = `rgba(255,${170 + i * 8},${150 + i * 6},${a * 0.35})`; g.lineWidth = 14;
    g.beginPath(); g.moveTo(sx, sy);
    for (let j = 1; j <= 10; j++) { const w = j / 10; g.lineTo(mez(sx, ex, w) + Math.sin(w * 7 + t * 2.3 + f) * 9 * w, mez(sy, ey, w) + Math.cos(w * 6 + t * 2 + f) * 6 * w); }
    g.stroke();
    g.strokeStyle = `rgba(255,220,200,${a * 0.6})`; g.lineWidth = 3; g.stroke();
  }
  g.restore();
}

// ---------------------------------------------------------------- la luz y el velo, en pantalla
export function luzCocina(g) {
  g.save(); sinVista(g);
  g.globalCompositeOperation = "soft-light";
  const lg = g.createLinearGradient(0, 0, 1080, 1920); lg.addColorStop(0, "rgba(255,230,170,0.55)"); lg.addColorStop(1, "rgba(60,20,0,0.4)");
  g.fillStyle = lg; g.fillRect(0, 0, 1080, 1920);
  g.globalCompositeOperation = "source-over";
  const vg = g.createRadialGradient(540, 1000, 560, 540, 1000, 1300); vg.addColorStop(0, "rgba(40,15,0,0)"); vg.addColorStop(1, "rgba(40,15,0,0.55)");
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 1920);
  const tg = g.createLinearGradient(0, 160, 0, 680); tg.addColorStop(0, "rgba(30,12,4,0.7)"); tg.addColorStop(1, "rgba(30,12,4,0)");
  g.fillStyle = tg; g.fillRect(0, 0, 1080, 680);
  g.restore();
}
export { visible };
