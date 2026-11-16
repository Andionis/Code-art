// Lo que comparten los planos: un pequeño motor de caras en 3D (para estar DENTRO del túnel y de la bóveda), el túnel
// (tierra roja, marcos de madera, focos), el pozo de concreto y la bóveda (acero, estantes con fajos de 50, la puerta
// redonda y el hoyo en el piso). Unidades: metros. El túnel va hacia -z; su techo, en y = 0,4.
import * as k from "#kit";

const { azar, mez, CX, CY, F } = k;

// ---------------------------------------------------------------- el motor de caras
// Una cara: { p: [[x,y,z]...], c: [r,g,b], luz?: (centro) → factor, emite?: true, borde?: "rgba", sesgo?: número
// (se dibuja como si estuviera más cerca), al?: 0..1 }.
const NEAR = 0.06;
function aCam(cam, X) {
  const dx = X[0] - cam.p[0], dy = X[1] - cam.p[1], dz = X[2] - cam.p[2], e = cam.e;
  return [dx * e.r[0] + dy * e.r[1] + dz * e.r[2], dx * e.u[0] + dy * e.u[1] + dz * e.u[2], dx * e.f[0] + dy * e.f[1] + dz * e.f[2]];
}
function recorta(P) { // los puntos detrás del plano cercano se recortan
  const out = [];
  for (let i = 0; i < P.length; i++) {
    const a = P[i], b = P[(i + 1) % P.length], ia = a[2] >= NEAR, ib = b[2] >= NEAR;
    if (ia) out.push(a);
    if (ia !== ib) { const u = (NEAR - a[2]) / (b[2] - a[2]); out.push([mez(a[0], b[0], u), mez(a[1], b[1], u), NEAR]); }
  }
  return out;
}
const clamp = (v) => (v < 0 ? 0 : v > 255 ? 255 : Math.round(v));

// Dibuja todas las caras de lejos a cerca. luz(centro, cara) → [r,g,b] multiplicador (0..~2). niebla: [r,g,b], lejos.
export function pinta(g, cam, caras, luz, o = {}) {
  const lista = [];
  const lejos = o.lejos ?? 40;
  for (const c of caras) {
    const Q = c.p.map((X) => aCam(cam, X));
    let zmax = -1e9, zs = 0;
    for (const q of Q) { if (q[2] > zmax) zmax = q[2]; zs += q[2]; }
    if (zmax < NEAR) continue;
    const zm = zs / Q.length;
    if (zm > lejos) continue;
    const R = recorta(Q);
    if (R.length < 3) continue;
    let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
    const S = R.map((q) => { const x = CX + (F * q[0]) / q[2], y = CY - (F * q[1]) / q[2]; if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; return [x, y]; });
    if (x1 < -50 || x0 > 1130 || y1 < -50 || y0 > 1970) continue;
    lista.push({ c, S, z: zm - (c.sesgo || 0) });
  }
  lista.sort((a, b) => b.z - a.z);
  const nie = o.niebla || [0, 0, 0];
  for (const { c, S, z } of lista) {
    const cen = c.cen || (c.cen = c.p.reduce((a, p) => [a[0] + p[0] / c.p.length, a[1] + p[1] / c.p.length, a[2] + p[2] / c.p.length], [0, 0, 0]));
    const m = c.emite ? [1, 1, 1] : luz(cen, c);
    const fog = Math.min(1, Math.max(0, (z - lejos * 0.45) / (lejos * 0.55)));
    const col = [0, 1, 2].map((i) => clamp(mez(c.c[i] * m[i], nie[i], fog)));
    g.beginPath(); g.moveTo(S[0][0], S[0][1]); for (let i = 1; i < S.length; i++) g.lineTo(S[i][0], S[i][1]); g.closePath();
    g.globalAlpha = c.al ?? 1;
    g.fillStyle = `rgb(${col[0]},${col[1]},${col[2]})`; g.fill();
    // un hilo del mismo color tapa las juntas entre caras
    g.strokeStyle = g.fillStyle; g.lineWidth = 1.2; g.stroke();
    if (c.borde) { g.strokeStyle = c.borde; g.lineWidth = Math.max(1, Math.min(6, 9 / z)); g.stroke(); }
    if (c.rayas) c.rayas(g, S, z, col);
    g.globalAlpha = 1;
  }
}

// Las seis caras de una caja (con giro en y y en x alrededor de su centro). col: [r,g,b] o { arriba, frente... }.
export function cubo(cen, dim, col, o = {}) {
  const [w, h, d] = dim.map((v) => v / 2), ry = o.ry || 0, rx = o.rx || 0, rz = o.rz || 0;
  const cy = Math.cos(ry), sy = Math.sin(ry), cx = Math.cos(rx), sx = Math.sin(rx), cz = Math.cos(rz), sz = Math.sin(rz);
  const T = ([x, y, z]) => {
    let X = x * cz - y * sz, Y = x * sz + y * cz; x = X; y = Y;      // giro en z
    Y = y * cx - z * sx; let Z = y * sx + z * cx; y = Y; z = Z;          // en x
    X = x * cy + z * sy; Z = -x * sy + z * cy;                           // en y
    return [cen[0] + X, cen[1] + y, cen[2] + Z];
  };
  const v = [[-w, -h, -d], [w, -h, -d], [w, h, -d], [-w, h, -d], [-w, -h, d], [w, -h, d], [w, h, d], [-w, h, d]].map(T);
  const pick = (n) => (Array.isArray(col) ? col : col[n] || col.frente);
  const f = (ids, n, tono) => ({ p: ids.map((i) => v[i]), c: pick(n).map((x) => x * tono), sesgo: o.sesgo, al: o.al, borde: o.borde, rayas: o.rayas?.[n] });
  return [
    f([3, 2, 6, 7], "arriba", 1.08), f([0, 1, 5, 4], "abajo", 0.6),
    f([4, 5, 6, 7], "frente", 0.95), f([1, 0, 3, 2], "fondo", 0.85),
    f([5, 1, 2, 6], "derecha", 0.8), f([0, 4, 7, 3], "izquierda", 0.88),
  ];
}

// ---------------------------------------------------------------- el túnel
export const TUN = { x: 0.48, y0: -0.4, y1: 0.42, z0: 3, z1: -38 }; // el final del túnel, en z1
export const POZO = { x: 0.48, z0: TUN.z1, z1: TUN.z1 + 0.96 };       // el pozo sube desde el techo, al final
export const PISO = 1.62;                                            // el piso de la bóveda (1,1 m de concreto encima)
export const ZH = (POZO.z0 + POZO.z1) / 2;                           // el centro del hoyo

const azT = azar(707);
// las vetas de la madera: líneas a lo largo de la cara más larga
function vetas(g, S, z, col) {
  if (z > 9 || S.length !== 4) return;
  const [a, b, c, d] = S, lab = Math.hypot(b[0] - a[0], b[1] - a[1]), lad = Math.hypot(d[0] - a[0], d[1] - a[1]);
  const [p0, p1, q0, q1] = lab > lad ? [a, b, d, c] : [a, d, b, c];
  g.save(); g.strokeStyle = `rgba(${col.map((x) => clamp(x * 0.6)).join(",")},0.7)`; g.lineWidth = Math.max(1, 3 / z); g.beginPath();
  for (const u of [0.2, 0.37, 0.55, 0.71, 0.86]) { g.moveTo(mez(p0[0], q0[0], u), mez(p0[1], q0[1], u)); g.lineTo(mez(p1[0], q1[0], u + 0.04), mez(p1[1], q1[1], u + 0.04)); }
  g.stroke(); g.restore();
}
const TIERRA = [[150, 72, 40], [168, 86, 46], [128, 60, 34], [178, 98, 54], [140, 70, 44]];
export const caraTunel = [];
{
  const paso = 0.32;
  for (let z = TUN.z0; z > TUN.z1; z -= paso) {
    const za = z, zb = Math.max(TUN.z1, z - paso);
    const enPozo = zb >= POZO.z0 - 1e-6 && za <= POZO.z1 + 1e-6;
    const N = 3;
    for (let i = 0; i < N; i++) {
      const xa = mez(-TUN.x, TUN.x, i / N), xb = mez(-TUN.x, TUN.x, (i + 1) / N);
      const ya = mez(TUN.y0, TUN.y1, i / N), yb = mez(TUN.y0, TUN.y1, (i + 1) / N);
      const t = () => TIERRA[Math.floor(azT() * TIERRA.length)].map((c) => c * (0.84 + azT() * 0.3));
      caraTunel.push({ p: [[xa, TUN.y0, za], [xb, TUN.y0, za], [xb, TUN.y0, zb], [xa, TUN.y0, zb]], c: t().map((c) => c * 0.8) }); // piso
      if (!enPozo) caraTunel.push({ p: [[xa, TUN.y1, za], [xb, TUN.y1, za], [xb, TUN.y1, zb], [xa, TUN.y1, zb]], c: t().map((c) => c * 0.9) }); // techo
      caraTunel.push({ p: [[-TUN.x, ya, za], [-TUN.x, yb, za], [-TUN.x, yb, zb], [-TUN.x, ya, zb]], c: t() });
      caraTunel.push({ p: [[TUN.x, ya, za], [TUN.x, yb, za], [TUN.x, yb, zb], [TUN.x, ya, zb]], c: t() });
    }
  }
  // la pared del fondo
  caraTunel.push({ p: [[-TUN.x, TUN.y0, TUN.z1], [TUN.x, TUN.y0, TUN.z1], [TUN.x, TUN.y1, TUN.z1], [-TUN.x, TUN.y1, TUN.z1]], c: [120, 58, 32] });
  // los marcos de madera, cada 1,2 m: dos postes y el travesaño, y una tabla en el piso
  const MAD = [196, 138, 78];
  for (let z = TUN.z0 - 0.6; z > TUN.z1 + 1.2; z -= 1.2) {
    const s = 0.12, m = MAD.map((c) => c * (0.9 + azT() * 0.2)), b = "rgba(70,36,12,0.75)", rv = { frente: vetas, fondo: vetas, izquierda: vetas, derecha: vetas, abajo: vetas };
    caraTunel.push(...cubo([-TUN.x + 0.05, 0, z], [0.1, TUN.y1 - TUN.y0, s], m, { sesgo: 0.08, borde: b, rayas: rv }));
    caraTunel.push(...cubo([TUN.x - 0.05, 0, z], [0.1, TUN.y1 - TUN.y0, s], m, { sesgo: 0.08, borde: b, rayas: rv }));
    caraTunel.push(...cubo([0, TUN.y1 - 0.05, z], [TUN.x * 2, 0.1, s], m, { sesgo: 0.1, borde: b, rayas: rv }));
  }
  // el pozo: la tierra abajo (hasta 0,52) y el concreto gris con varillas (hasta el piso de la bóveda)
  const C = [[150, 150, 156], [138, 140, 146], [162, 160, 164]];
  for (let y = TUN.y1; y < PISO; y += 0.18) {
    const ya = y, yb = Math.min(PISO, y + 0.18), tierra = ya < 0.52;
    const col = () => (tierra ? TIERRA[Math.floor(azT() * 5)] : C[Math.floor(azT() * 3)]).map((c) => c * (0.88 + azT() * 0.24));
    const { x, z0, z1 } = POZO;
    caraTunel.push({ p: [[-x, ya, z0], [x, ya, z0], [x, yb, z0], [-x, yb, z0]], c: col() });
    caraTunel.push({ p: [[-x, ya, z1], [x, ya, z1], [x, yb, z1], [-x, yb, z1]], c: col() });
    caraTunel.push({ p: [[-x, ya, z0], [-x, ya, z1], [-x, yb, z1], [-x, yb, z0]], c: col() });
    caraTunel.push({ p: [[x, ya, z0], [x, ya, z1], [x, yb, z1], [x, yb, z0]], c: col() });
  }
}
// piedras y terrones en las paredes y el piso
for (let i = 0; i < 520; i++) {
  const z = mez(TUN.z0, TUN.z1 + 0.2, azT()), lado = Math.floor(azT() * 3), r = 0.02 + azT() * 0.05, n = 6, a0 = azT() * 6;
  const col = (azT() < 0.35 ? [196, 180, 150] : TIERRA[Math.floor(azT() * 5)].map((c) => c * 1.25)).map((c) => c * (0.8 + azT() * 0.4));
  const p = [];
  if (lado === 2) { const x = mez(-TUN.x + 0.08, TUN.x - 0.08, azT()); for (let j = 0; j < n; j++) { const a = a0 + (j / n) * 6.283, rr = r * (0.7 + 0.5 * ((j * 7919) % 5) / 5); p.push([x + Math.cos(a) * rr, TUN.y0 + 0.004, z + Math.sin(a) * rr]); } }
  else { const sx = lado ? 1 : -1, y = mez(TUN.y0 + 0.05, TUN.y1 - 0.05, azT()); for (let j = 0; j < n; j++) { const a = a0 + (j / n) * 6.283, rr = r * (0.7 + 0.5 * ((j * 7919) % 5) / 5); p.push([sx * (TUN.x - 0.004), y + Math.sin(a) * rr, z + Math.cos(a) * rr]); } }
  caraTunel.push({ p, c: col, sesgo: 0.3 });
}
// los focos: uno cada 2,4 m, colgando del techo
export const FOCOS = [];
for (let z = TUN.z0 - 1.2; z > TUN.z1 + 0.6; z -= 2.4) FOCOS.push([0, TUN.y1 - 0.12, z]);
FOCOS.push([0, TUN.y1 - 0.12, TUN.z1 + 1.6]);

// la luz del túnel: cálida, de los focos, y se apaga lejos
export function luzTunel(P, cara, enc = 1, extra = null) {
  let l = 0.1;
  for (const f of FOCOS) {
    const dz = P[2] - f[2];
    if (dz > 4 || dz < -4) continue;
    const d2 = (P[0] - f[0]) ** 2 + (P[1] - f[1]) ** 2 + dz * dz;
    l += (enc * 1.1) / (1 + d2 * 3.2);
  }
  // la luz blanca que baja por el pozo desde la bóveda
  if (extra) { const d2 = (P[0]) ** 2 + (P[2] - ZH) ** 2 + Math.max(0, PISO - P[1]) ** 2 * 0.15; l += extra / (1 + d2 * 1.5); }
  return [l * 1.15, l * 0.98, l * 0.78];
}

// dibuja los focos con su brillo y el cable
export function focos(g, cam, enc = 1) {
  g.save(); g.strokeStyle = "rgba(20,12,8,0.9)"; g.lineWidth = 3; g.beginPath();
  let ant = null;
  for (const f of FOCOS) {
    const Q = aCam(cam, [f[0], TUN.y1 - 0.06, f[2]]);
    if (Q[2] < NEAR) { ant = null; continue; }
    const x = CX + (F * Q[0]) / Q[2], y = CY - (F * Q[1]) / Q[2];
    if (ant) { g.moveTo(ant[0], ant[1]); g.lineTo(x, y); }
    ant = [x, y];
  }
  g.stroke(); g.restore();
  for (const f of FOCOS) {
    const Q = aCam(cam, f);
    if (Q[2] < 0.15 || Q[2] > 34) continue;
    const x = CX + (F * Q[0]) / Q[2], y = CY - (F * Q[1]) / Q[2], r = (F * 0.05) / Q[2];
    g.save(); g.globalAlpha = enc;
    const gr = g.createRadialGradient(x - r * 0.3, y - r * 0.3, 0, x, y, r);
    gr.addColorStop(0, "#fffbe8"); gr.addColorStop(0.6, "#ffd77a"); gr.addColorStop(1, "#d98a2a");
    g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, 6.283); g.fill(); g.restore();
    k.brillo(g, x, y, r * 16, "255,190,110", 0.55 * enc);
    k.brillo(g, x, y, r * 5, "255,235,190", 0.8 * enc);
  }
}

// las varillas de acero que asoman en el borde del hoyo (segmentos 3D)
const azV = azar(99);
export const VARILLAS = [];
for (let i = 0; i < 16; i++) {
  const lado = i % 4, u = azV() * 2 - 1, y = PISO - 0.08 - azV() * 0.85;
  const base = lado === 0 ? [-POZO.x, y, ZH + u * 0.45] : lado === 1 ? [POZO.x, y, ZH + u * 0.45] : lado === 2 ? [u * 0.45, y, POZO.z0] : [u * 0.45, y, POZO.z1];
  const dir = lado === 0 ? [1, 0.25, 0] : lado === 1 ? [-1, 0.25, 0] : lado === 2 ? [0, 0.25, 1] : [0, 0.25, -1];
  const L = 0.12 + azV() * 0.22;
  VARILLAS.push([base, [base[0] + dir[0] * L, base[1] + dir[1] * L + (azV() - 0.5) * 0.1, base[2] + dir[2] * L]]);
}
export function varillas(g, cam, luzF = 1) {
  g.save(); g.lineCap = "round";
  for (const [A, B] of VARILLAS) {
    const a = aCam(cam, A), b = aCam(cam, B);
    if (a[2] < NEAR || b[2] < NEAR) continue;
    const w = Math.max(1.5, (F * 0.022) / ((a[2] + b[2]) / 2));
    g.strokeStyle = `rgb(${clamp(120 * luzF)},${clamp(64 * luzF)},${clamp(36 * luzF)})`; g.lineWidth = w;
    g.beginPath(); g.moveTo(CX + (F * a[0]) / a[2], CY - (F * a[1]) / a[2]); g.lineTo(CX + (F * b[0]) / b[2], CY - (F * b[1]) / b[2]); g.stroke();
  }
  g.restore();
}

// ---------------------------------------------------------------- la bóveda
export const BOV = { x: 2.6, z0: TUN.z1 - 3.4, z1: TUN.z1 + 4.6, alto: 3.1 }; // la puerta, en la pared z0
export const PUERTA = { y: PISO + 1.35, r: 1.15 };
const ACERO = [86, 128, 140], ACERO2 = [70, 108, 122];
export const caraBoveda = [];
{
  const Y0 = PISO, Y1 = PISO + BOV.alto;
  // el piso de concreto, en losas alineadas con el hoyo (sin la losa del hoyo)
  const cortes = (a, b, extra) => { const L = [a]; for (let x = a + 0.48; x < b - 0.05; x += 0.48) L.push(x); L.push(b, ...extra); return [...new Set(L.map((x) => +x.toFixed(4)))].sort((m, n) => m - n); };
  const XS = cortes(-BOV.x, BOV.x, [-POZO.x, POZO.x]).filter((x, i, A) => i === 0 || x - A[i - 1] > 0.05 || x === -POZO.x || x === POZO.x);
  const ZS = cortes(BOV.z0, BOV.z1, [POZO.z0, POZO.z1]).filter((z, i, A) => i === 0 || z - A[i - 1] > 0.05 || z === POZO.z0 || z === POZO.z1);
  for (let i = 0; i + 1 < XS.length; i++) for (let j = 0; j + 1 < ZS.length; j++) {
    const x = XS[i], xb = XS[i + 1], z = ZS[j], zb = ZS[j + 1];
    if (x >= -POZO.x - 1e-6 && xb <= POZO.x + 1e-6 && z >= POZO.z0 - 1e-6 && zb <= POZO.z1 + 1e-6) continue;
    const v = 0.9 + azT() * 0.2;
    caraBoveda.push({ p: [[x, Y0, z], [xb, Y0, z], [xb, Y0, zb], [x, Y0, zb]], c: [112 * v, 116 * v, 122 * v], borde: "rgba(30,34,40,0.5)" });
  }
  // las paredes de placas de acero, con sus juntas
  const placa = (p, i) => ({ p, c: (i % 2 ? ACERO : ACERO2).map((c) => c * (0.92 + azT() * 0.16)), borde: "rgba(18,30,36,0.85)" });
  let i = 0;
  for (let y = Y0; y < Y1 - 1e-6; y += 0.62) {
    const yb = Math.min(Y1, y + 0.62);
    for (let z = BOV.z0; z < BOV.z1 - 1e-6; z += 0.8) {
      const zb = Math.min(BOV.z1, z + 0.8);
      caraBoveda.push(placa([[-BOV.x, y, z], [-BOV.x, y, zb], [-BOV.x, yb, zb], [-BOV.x, yb, z]], i++));
      caraBoveda.push(placa([[BOV.x, y, z], [BOV.x, y, zb], [BOV.x, yb, zb], [BOV.x, yb, z]], i++));
    }
    for (let x = -BOV.x; x < BOV.x - 1e-6; x += 0.85) {
      const xb = Math.min(BOV.x, x + 0.85);
      caraBoveda.push(placa([[x, y, BOV.z0], [xb, y, BOV.z0], [xb, yb, BOV.z0], [x, yb, BOV.z0]], i++));
      caraBoveda.push(placa([[x, y, BOV.z1], [xb, y, BOV.z1], [xb, yb, BOV.z1], [x, yb, BOV.z1]], i++));
    }
  }
  // el techo, oscuro, con dos tubos de luz
  for (let x = -BOV.x; x < BOV.x - 1e-6; x += 1.7) for (let z = BOV.z0; z < BOV.z1 - 1e-6; z += 1) {
    caraBoveda.push({ p: [[x, Y1, z], [x + 1.7, Y1, z], [x + 1.7, Y1, Math.min(BOV.z1, z + 1)], [x, Y1, Math.min(BOV.z1, z + 1)]], c: [60, 70, 78] });
  }
  // los estantes: a lo largo de las paredes de los lados, cuatro tablas
  for (const sx of [-1, 1]) {
    const xp = sx * (BOV.x - 0.36);
    for (const yy of [0.32, 0.92, 1.52, 2.12]) caraBoveda.push(...cubo([xp, PISO + yy, (BOV.z0 + BOV.z1) / 2 + 0.2], [0.66, 0.04, BOV.z1 - BOV.z0 - 1.6], [150, 160, 170], { sesgo: 0.02 }));
    for (const zz of [BOV.z0 + 0.6, BOV.z1 - 1.0, (BOV.z0 + BOV.z1) / 2 + 0.2]) {
      caraBoveda.push(...cubo([sx * (BOV.x - 0.04), PISO + 1.2, zz], [0.05, 2.4, 0.05], [140, 150, 160]));
      caraBoveda.push(...cubo([sx * (BOV.x - 0.68), PISO + 1.2, zz], [0.05, 2.4, 0.05], [140, 150, 160]));
    }
  }
}
export const LAMPARAS = [[-1.2, PISO + BOV.alto - 0.02], [1.2, PISO + BOV.alto - 0.02]];

// los fajos de billetes de 50, en bloques sobre los estantes
export const DINERO = [214, 150, 74];
const azD = azar(5150);
export const BLOQUES = [];
for (const sx of [-1, 1]) for (const yy of [0.32, 0.92, 1.52, 2.12]) {
  for (let z = BOV.z0 + 0.95; z < BOV.z1 - 1.2; z += 0.5) {
    const h = 0.32 + azD() * 0.18;
    BLOQUES.push({ c: [sx * (BOV.x - 0.36), PISO + yy + 0.02 + h / 2, z + 0.22], dim: [0.5, h, 0.44], sale: azD(), sem: azD() });
  }
}
// las pilas de fajos en el piso, a los dos lados del hoyo: bloques de 0,36 m de alto, unos encima de otros
for (const sx of [-1, 1]) for (const xx of [0.95, 1.7]) for (let z = BOV.z0 + 0.7; z < BOV.z1 - 1.7; z += 0.82) {
  const n = 2 + Math.floor(azD() * 3);
  for (let j = 0; j < n; j++) BLOQUES.push({ c: [sx * xx, PISO + 0.18 + j * 0.37, z], dim: [0.68, 0.36, 0.74], sale: azD(), sem: azD(), piso: true });
}

// las rayas de un bloque de fajos: los billetes apilados (líneas finas) y la faja de papel en medio
export function rayasFajo(n = 6) {
  return (g, S, z, col) => {
    if (z > 18 || S.length !== 4) return;
    const [a, b, c, d] = S; // a-b abajo, d-c arriba
    g.save(); g.beginPath(); g.moveTo(a[0], a[1]); for (const q of S.slice(1)) g.lineTo(q[0], q[1]); g.closePath(); g.clip();
    g.strokeStyle = `rgba(${col.map((x) => clamp(x * 0.55)).join(",")},0.8)`; g.lineWidth = Math.max(1, 6 / z);
    g.beginPath();
    for (let i = 1; i < n * 3; i++) { const u = i / (n * 3); g.moveTo(mez(a[0], d[0], u), mez(a[1], d[1], u)); g.lineTo(mez(b[0], c[0], u), mez(b[1], c[1], u)); }
    g.stroke();
    // las fajas: dos bandas claras verticales
    g.fillStyle = `rgba(${clamp(col[0] * 1.5 + 40)},${clamp(col[1] * 1.5 + 40)},${clamp(col[2] * 1.4 + 30)},0.9)`;
    for (const u0 of [0.22, 0.68]) {
      const u1 = u0 + 0.1, P = [[mez(a[0], b[0], u0), mez(a[1], b[1], u0)], [mez(a[0], b[0], u1), mez(a[1], b[1], u1)], [mez(d[0], c[0], u1), mez(d[1], c[1], u1)], [mez(d[0], c[0], u0), mez(d[1], c[1], u0)]];
      g.beginPath(); g.moveTo(P[0][0], P[0][1]); for (const q of P.slice(1)) g.lineTo(q[0], q[1]); g.closePath(); g.fill();
    }
    g.restore();
  };
}
const RAYAS = { frente: rayasFajo(), fondo: rayasFajo(), izquierda: rayasFajo(), derecha: rayasFajo() };
export function fajo(cen, dim, o = {}) { return cubo(cen, dim, DINERO, { ...o, rayas: RAYAS }); }

// la luz de la bóveda: blanca y fría de los tubos, más un poco de oro del dinero. enc: 0..1
export function luzBoveda(enc = 1, extraPozo = 0) {
  return (P) => {
    let l = 0.12 + 0.18 * enc;
    for (const [lx, ly] of LAMPARAS) { const d2 = (P[0] - lx) ** 2 + (P[1] - ly) ** 2 * 0.6; l += (0.75 * enc) / (1 + d2 * 0.35); }
    let r = l, gg = l, b = l * 1.08;
    if (extraPozo) { const d2 = P[0] ** 2 + (P[2] - ZH) ** 2 + (P[1] - PISO) ** 2; r += extraPozo * 0.6 / (1 + d2 * 2); gg += extraPozo * 0.42 / (1 + d2 * 2); b += extraPozo * 0.2 / (1 + d2 * 2); }
    return [r, gg, b];
  };
}

// los tubos de luz del techo
export function lamparas(g, cam, enc = 1) {
  for (const [lx, ly] of LAMPARAS) {
    const P = [[lx - 0.08, ly, BOV.z0 + 0.5], [lx + 0.08, ly, BOV.z0 + 0.5], [lx + 0.08, ly, BOV.z1 - 0.5], [lx - 0.08, ly, BOV.z1 - 0.5]].map((X) => aCam(cam, X));
    const R = recorta(P); if (R.length < 3) continue;
    g.beginPath(); R.forEach((q, i) => { const x = CX + (F * q[0]) / q[2], y = CY - (F * q[1]) / q[2]; i ? g.lineTo(x, y) : g.moveTo(x, y); }); g.closePath();
    g.fillStyle = `rgba(${clamp(60 + 180 * enc)},${clamp(70 + 182 * enc)},${clamp(80 + 175 * enc)},1)`; g.fill();
    g.save(); g.globalCompositeOperation = "lighter"; g.shadowColor = `rgba(200,235,255,${0.8 * enc})`; g.shadowBlur = 40; g.fillStyle = `rgba(160,210,255,${0.25 * enc})`; g.fill(); g.restore();
  }
}

// la puerta redonda de la bóveda, en la pared del fondo. raya: la luz por la rendija (0..1); abre: 0..1
export function puerta(g, cam, luzF = 1, raya = 0, abre = 0) {
  const z = BOV.z0 + 0.03, N = 48;
  const circ = (r, dz = 0, cx = 0) => Array.from({ length: N }, (_, i) => { const a = (i / N) * 6.2832; return [cx + Math.cos(a) * r, PUERTA.y + Math.sin(a) * r, z + dz]; });
  const pr = (pts) => { const S = []; for (const X of pts) { const q = aCam(cam, X); if (q[2] < NEAR) return null; S.push([CX + (F * q[0]) / q[2], CY - (F * q[1]) / q[2]]); } return S; };
  const path = (S) => { g.beginPath(); S.forEach((s, i) => (i ? g.lineTo(s[0], s[1]) : g.moveTo(s[0], s[1]))); g.closePath(); };
  const l = luzF;
  // el marco
  const M = pr(circ(PUERTA.r * 1.12)); if (!M) return;
  path(M); g.fillStyle = `rgb(${clamp(70 * l)},${clamp(84 * l)},${clamp(92 * l)})`; g.fill();
  // la luz de detrás (cuando se abre o por la rendija)
  const H = pr(circ(PUERTA.r, -0.01));
  if (H && (abre > 0 || raya > 0)) {
    path(H); g.fillStyle = `rgba(255,250,235,${Math.min(1, abre * 1.5)})`; g.fill();
  }
  // la hoja de la puerta: gira sobre su bisagra (a la derecha) hacia la cámara
  const ang = abre * 1.75;
  const hoja = (r, dz) => Array.from({ length: N }, (_, i) => { const a = (i / N) * 6.2832; const lx = Math.cos(a) * r - PUERTA.r, lz = dz; const X = PUERTA.r + lx * Math.cos(ang) - lz * Math.sin(ang), Z = lx * Math.sin(ang) + lz * Math.cos(ang); return [X, PUERTA.y + Math.sin(a) * r, z + 0.02 + Z]; });
  const D = pr(hoja(PUERTA.r * 0.98, 0.0)); if (!D) return;
  path(D);
  const gr = g.createLinearGradient(D[24][0], D[36][1], D[0][0], D[12][1]);
  gr.addColorStop(0, `rgb(${clamp(150 * l)},${clamp(170 * l)},${clamp(180 * l)})`); gr.addColorStop(0.5, `rgb(${clamp(215 * l)},${clamp(228 * l)},${clamp(232 * l)})`); gr.addColorStop(1, `rgb(${clamp(110 * l)},${clamp(126 * l)},${clamp(136 * l)})`);
  g.fillStyle = gr; g.fill();
  g.strokeStyle = `rgba(20,30,36,0.8)`; g.lineWidth = 4; g.stroke();
  for (const rr of [0.82, 0.55]) { const A = pr(hoja(PUERTA.r * rr, 0.0)); if (A) { path(A); g.strokeStyle = `rgba(30,40,46,0.55)`; g.lineWidth = 5; g.stroke(); } }
  // los pernos alrededor
  const B = pr(hoja(PUERTA.r * 0.9, 0.0));
  if (B) { g.fillStyle = `rgb(${clamp(230 * l)},${clamp(236 * l)},${clamp(240 * l)})`; for (let i = 0; i < N; i += 4) { g.beginPath(); g.arc(B[i][0], B[i][1], 7, 0, 6.283); g.fill(); } }
  // el volante del centro
  const W = pr(hoja(PUERTA.r * 0.3, 0.0)), C = pr(hoja(0.001, 0.0));
  if (W && C) {
    g.strokeStyle = `rgb(${clamp(200 * l)},${clamp(170 * l)},${clamp(90 * l)})`; g.lineWidth = 10; g.lineCap = "round";
    path(W); g.stroke();
    g.beginPath(); for (let i = 0; i < N; i += 8) { g.moveTo(C[0][0], C[0][1]); g.lineTo(W[i][0], W[i][1]); } g.stroke();
  }
  // la rendija iluminada
  if (raya > 0) {
    path(M); g.save(); g.globalCompositeOperation = "lighter";
    const S = pr(circ(PUERTA.r * 0.99));
    if (S) { path(S); g.strokeStyle = `rgba(255,245,215,${raya})`; g.lineWidth = 6; g.shadowColor = `rgba(255,240,200,${raya})`; g.shadowBlur = 40; g.stroke(); g.stroke(); }
    g.restore();
  }
}

// el oscuro de arriba, detrás de los subtítulos
export function velo(g, al = 0.55) {
  const vg = g.createLinearGradient(0, 200, 0, 640);
  vg.addColorStop(0, `rgba(6,4,2,${al})`); vg.addColorStop(1, "rgba(6,4,2,0)");
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 640);
}

export { aCam };
