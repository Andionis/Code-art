// Lo que comparten los planos: el gato naranja (que gira en dos mitades), el cielo con nubes y el pasto.
import * as k from "#kit";

const { mez, tramo, suave } = k;
const TAU = Math.PI * 2;

// ---------- los colores del gato ----------
export const PIEL = { luz: "#ffc070", base: "#f28c28", sombra: "#b8561a", raya: "#a84a12", panza: "#fff3e2", panzaS: "#e9cfae", nariz: "#ff8fa0", ojo: "#7ed957" };

// Una textura de pelo, hecha una vez.
const PELO = (() => {
  const c = k.lienzo(256, 256), g = c.getContext("2d"), az = k.azar(77);
  g.lineCap = "round";
  for (let i = 0; i < 900; i++) {
    const x = az() * 256, y = az() * 256, a = -0.4 + az() * 0.3, l = 6 + az() * 10;
    g.strokeStyle = az() < 0.5 ? "rgba(90,40,10,0.22)" : "rgba(255,230,190,0.25)"; g.lineWidth = 1.4;
    g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); g.stroke();
  }
  return c;
})();
let peloPat = null;
function pelo(g, al = 0.6) {
  peloPat ??= g.createPattern(k.fijar(PELO), "repeat");
  g.save(); g.globalAlpha *= al; g.fillStyle = peloPat; g.fill(); g.restore();
}

function elipse(g, x, y, rx, ry, a = 0) { g.beginPath(); g.ellipse(x, y, Math.max(1, rx), Math.max(1, ry), a, 0, TAU); }

// Una pata de dos trozos: sale de (x, y) hacia (dx, dy) (en pantalla, ya escorzada), con la rodilla doblada `dobla`.
function pata(g, x, y, dx, dy, largo, grosor, dobla, lejos, delantera) {
  const l1 = largo * 0.55, l2 = largo * 0.5;
  const a0 = Math.atan2(dy, dx);
  const kx = x + Math.cos(a0) * l1, ky = y + Math.sin(a0) * l1;
  const a1 = a0 + dobla * (delantera ? -1 : 1);
  const px = kx + Math.cos(a1) * l2, py = ky + Math.sin(a1) * l2;
  const col = lejos ? PIEL.sombra : PIEL.base;
  // un trozo con grosor que va de w0 a w1
  const trozo = (x0, y0, x1, y1, w0, w1, c) => {
    const a = Math.atan2(y1 - y0, x1 - x0), nx = -Math.sin(a), ny = Math.cos(a);
    g.fillStyle = c; g.beginPath();
    g.moveTo(x0 + nx * w0 / 2, y0 + ny * w0 / 2); g.lineTo(x1 + nx * w1 / 2, y1 + ny * w1 / 2);
    g.lineTo(x1 - nx * w1 / 2, y1 - ny * w1 / 2); g.lineTo(x0 - nx * w0 / 2, y0 - ny * w0 / 2); g.closePath(); g.fill();
    elipse(g, x1, y1, w1 / 2, w1 / 2); g.fill();
  };
  elipse(g, x, y, grosor * 0.8, grosor * 0.8); g.fillStyle = col; g.fill();
  trozo(x, y, kx, ky, grosor * 1.45, grosor * 0.85, col);
  trozo(kx, ky, px, py, grosor * 0.85, grosor * 0.7, col);
  // luz por un lado
  g.save(); g.globalAlpha *= lejos ? 0.15 : 0.4;
  trozo(x - grosor * 0.2, y - grosor * 0.25, kx - grosor * 0.15, ky - grosor * 0.2, grosor * 0.5, grosor * 0.25, "#ffd9a0");
  g.restore();
  // rayas en la pata
  g.save(); g.strokeStyle = PIEL.raya; g.globalAlpha *= 0.55; g.lineWidth = grosor * 0.18; g.lineCap = "round";
  for (const u of [0.35, 0.65]) {
    const sx = kx + (px - kx) * u, sy = ky + (py - ky) * u, a = Math.atan2(py - ky, px - kx) + Math.PI / 2;
    g.beginPath(); g.moveTo(sx - Math.cos(a) * grosor * 0.3, sy - Math.sin(a) * grosor * 0.3); g.lineTo(sx + Math.cos(a) * grosor * 0.3, sy + Math.sin(a) * grosor * 0.3); g.stroke();
  }
  g.restore();
  // la almohadilla
  const pr = grosor * 0.62;
  const gr = g.createRadialGradient(px - pr * 0.3, py - pr * 0.3, 1, px, py, pr * 1.2);
  gr.addColorStop(0, lejos ? "#f2dcc0" : "#fff8ee"); gr.addColorStop(1, lejos ? "#b99d80" : "#e2c6a4");
  g.fillStyle = gr; elipse(g, px, py, pr * 1.1, pr * 0.9, a1); g.fill();
}

function cuerpo(g, cx, rx, ry, c, sn, lado) {
  g.save();
  elipse(g, cx, 0, rx, ry);
  const gr = g.createLinearGradient(cx, -ry, cx, ry);
  gr.addColorStop(0, PIEL.luz); gr.addColorStop(0.45, PIEL.base); gr.addColorStop(1, PIEL.sombra);
  g.fillStyle = gr; g.fill();
  g.save(); g.clip();
  // la panza: del lado de las patas; se ve más cuanto más mira a la cámara
  const vp = Math.max(0, sn), pb = 0.3 + 0.38 * vp;
  const py = ry * mez(0.78, 0.15, vp) * c;
  if (sn > -0.85) {
    g.save(); g.globalAlpha *= Math.min(1, (sn + 0.85) * 2);
    const gp = g.createRadialGradient(cx, py, 4, cx, py, rx);
    gp.addColorStop(0, PIEL.panza); gp.addColorStop(0.75, PIEL.panzaS); gp.addColorStop(1, "rgba(233,207,174,0)");
    g.fillStyle = gp; elipse(g, cx + 10 * lado, py, rx * 0.85, ry * pb); g.fill();
    g.restore();
  }
  // las rayas: del lado del lomo
  const vl = Math.max(0, -sn);
  const ly = -ry * mez(0.7, 0.1, vl) * c;
  g.save(); g.globalAlpha *= 0.75;
  g.strokeStyle = PIEL.raya; g.lineCap = "round";
  for (let i = 0; i < 4; i++) {
    const x = cx + lado * (-80 + i * 52);
    const h = ry * mez(0.55, 0.95, vl);
    g.lineWidth = 15 - i * 1.5;
    g.beginPath(); g.moveTo(x - 6, ly - h * 0.5 * Math.sign(c || 1)); g.quadraticCurveTo(x + 12, ly, x - 4, ly + h * 0.5 * Math.sign(c || 1)); g.stroke();
  }
  g.restore();
  elipse(g, cx, 0, rx, ry); pelo(g, 0.55);
  // brillo del lado de la luz
  const gb = g.createRadialGradient(cx - 40, -ry * 0.6, 4, cx - 40, -ry * 0.6, rx * 0.9);
  gb.addColorStop(0, "rgba(255,240,210,0.45)"); gb.addColorStop(1, "rgba(255,240,210,0)");
  g.fillStyle = gb; g.fillRect(cx - rx, -ry, rx * 2, ry * 2);
  g.restore();
  g.restore();
}

// Media mitad del gato (delantera o trasera), en su marco: la cintura en (0,0) y la mitad hacia +x (lado = 1) o -x.
// `rol`: el giro alrededor de la columna (0 = patas abajo, π = patas arriba). `enc`: 0 patas estiradas, 1 encogidas.
function mitad(g, lado, rol, enc, s, t, opc, capa) {
  const c = Math.cos(rol), sn = Math.sin(rol);
  const cx = 78 * lado, rx = 188, ry = 96;
  // patas: dos (cerca y lejos), salen del lado de la panza
  const L = (lado > 0 ? 250 : 270) * mez(1, 0.5, enc);
  const largoV = L * Math.sqrt(c * c * 0.9 + 0.1);
  const dirY = c >= 0 ? 1 : -1;
  // estiradas, las patas se abren un poco hacia fuera; encogidas, se pegan al cuerpo (las de delante hacia la cabeza)
  const abre = (opc.abre ?? 0) * (1 - enc);
  const patas = [];
  for (const [i, lejos] of [[0, true], [1, false]]) {
    const off = (i ? 28 : -28) * lado + 18 * lado;
    const bx = cx + 40 * lado + off * 0.6 - 30 * lado * (i ? 0 : 1);
    const by = ry * 0.55 * c;
    const ag = (opc.agita ?? 0) * Math.sin(t * 13 + i * 2.1 + (lado > 0 ? 0 : 1.3));
    const ang = Math.PI / 2 * dirY + lado * (abre * (i ? 0.55 : 0.25) + ag * 0.35) * dirY + (enc * 0.9 * lado) * -dirY;
    const dx = Math.cos(ang) * largoV, dy = Math.sin(ang) * largoV;
    const dob = mez(0.15, 1.6, enc) * (lado > 0 ? 1 : -1) * dirY * -1;
    patas.push({ lejos, f: () => pata(g, bx, by, dx, dy, largoV, (lado > 0 ? 50 : 56), dob, lejos, lado > 0) });
  }
  const pDelante = sn > 0.25 ? patas : sn < -0.25 ? [] : patas.filter((p) => !p.lejos);
  const pDetras = patas.filter((p) => !pDelante.includes(p));
  if (capa === "detras") { for (const p of pDetras) p.f(); return; }
  if (capa === "delante") { for (const p of pDelante) p.f(); return; }
  // la mitad iluminada (turquesa o rosa) cuando se explica que son «dos gatos pegados»: un aura por detrás
  const halo = lado > 0 ? opc.haloF : opc.haloB;
  if (halo && halo.al > 0) {
    g.save(); g.globalAlpha *= halo.al;
    g.shadowColor = `rgba(${halo.c},1)`; g.shadowBlur = 50;
    g.strokeStyle = `rgb(${halo.c})`; g.lineWidth = 34;
    elipse(g, cx, 0, rx + 8, ry + 8); g.stroke();
    g.restore();
  }
  cuerpo(g, cx, rx, ry, c, sn, lado);
  g.save();
g.restore();
}

function cabeza(g, rol, t, opc) {
  const c = Math.cos(rol), sn = Math.sin(rol);
  const hx = 330, hy = -40 * c, r = 92;
  // el cuello que une la cabeza al cuerpo
  const gn = g.createLinearGradient(0, -90, 0, 90); gn.addColorStop(0, PIEL.luz); gn.addColorStop(0.5, PIEL.base); gn.addColorStop(1, PIEL.sombra);
  g.fillStyle = gn; elipse(g, 225, -18 * c, 95, 78, -0.25 * c); g.fill();
  g.save(); g.fillStyle = PIEL.panza; g.globalAlpha *= 0.85; elipse(g, 245, 30 * c, 60, 34, 0); g.fill(); g.restore();
  // las orejas: del lado del lomo
  const oy = -c, ol = Math.sqrt(c * c * 0.85 + 0.15);
  for (const [dx, lejos] of [[-38, true], [30, false]]) {
    const bx = hx + dx, by = hy + oy * r * 0.62;
    const tx = bx - 6, ty = by + oy * 95 * ol;
    g.fillStyle = lejos ? PIEL.sombra : PIEL.base;
    g.beginPath(); g.moveTo(bx - 40, by); g.lineTo(tx, ty); g.lineTo(bx + 38, by); g.closePath(); g.fill();
    if (!lejos || sn > 0) { g.fillStyle = "#ffb3ae"; g.beginPath(); g.moveTo(bx - 20, by); g.lineTo(tx + 1, ty - oy * 20 * ol); g.lineTo(bx + 18, by); g.closePath(); g.fill(); }
  }
  // la cara
  const gr = g.createRadialGradient(hx - 25, hy - 35, 6, hx, hy, r * 1.1);
  gr.addColorStop(0, PIEL.luz); gr.addColorStop(0.6, PIEL.base); gr.addColorStop(1, PIEL.sombra);
  g.fillStyle = gr; elipse(g, hx, hy, r * 1.04, r * 0.94); g.fill();
  g.save(); elipse(g, hx, hy, r * 1.04, r * 0.94); g.clip(); pelo(g, 0.45);
  // rayas de la frente
  g.strokeStyle = PIEL.raya; g.lineWidth = 9; g.lineCap = "round"; g.save(); g.globalAlpha *= 0.7;
  for (let i = 0; i < 3; i++) { const x = hx - 30 + i * 22; g.beginPath(); g.moveTo(x, hy - c * 88); g.lineTo(x + 4, hy - c * 52); g.stroke(); }
  g.restore();
  g.restore();
  // el hocico (hacia delante) y la barbilla
  const mx = hx + 62, my = hy + 22 * c;
  g.fillStyle = PIEL.panza; elipse(g, mx, my, 44, 32); g.fill();
  g.fillStyle = "rgba(200,160,120,0.35)"; elipse(g, mx + 4, my + 10 * c, 36, 16); g.fill();
  g.fillStyle = PIEL.nariz; g.beginPath(); g.moveTo(mx + 30, my - 14 * c); g.lineTo(mx + 46, my - 12 * c); g.lineTo(mx + 40, my - 1 * c); g.closePath(); g.fill();
  g.strokeStyle = "rgba(80,40,20,0.8)"; g.lineWidth = 4;
  g.beginPath(); g.moveTo(mx + 40, my); g.quadraticCurveTo(mx + 30, my + 14 * c, mx + 16, my + 10 * c); g.stroke();
  // bigotes
  g.strokeStyle = "rgba(255,255,255,0.85)"; g.lineWidth = 3;
  for (let i = -1; i <= 1; i++) { g.beginPath(); g.moveTo(mx + 20, my + i * 9 * c); g.quadraticCurveTo(mx + 80, my + (i * 18 - 6) * c, mx + 135, my + (i * 30 - 4) * c); g.stroke(); }
  // el ojo (abierto, verde) y el de lejos si mira a la cámara
  const parpadea = opc.ojos ?? 1;
  const ojo = (x, y, s) => {
    g.fillStyle = "#fffbe8"; elipse(g, x, y, 22 * s, 20 * s * parpadea); g.fill();
    g.fillStyle = PIEL.ojo; elipse(g, x + 3 * s, y, 17 * s, 17 * s * parpadea); g.fill();
    g.fillStyle = "#14120e"; elipse(g, x + 5 * s, y, 6 * s, 14 * s * parpadea); g.fill();
    g.fillStyle = "#fff"; elipse(g, x - 1 * s, y - 6 * s * parpadea, 5 * s, 5 * s * parpadea); g.fill();
  };
  ojo(hx + 28, hy - 12 * c, 1.15);
  if (sn > 0.3) { g.save(); g.globalAlpha *= Math.min(1, (sn - 0.3) * 3); ojo(hx - 22, hy - 4 * c, 0.85); g.restore(); }
}

function cola(g, rol, t, opc) {
  const c = Math.cos(rol);
  const fase = opc.colaFase ?? t * 4;
  const pts = [];
  let x = -255, y = -30 * c, a = Math.PI + 0.3 * c;
  for (let i = 0; i <= 14; i++) {
    pts.push([x, y]);
    a += (0.11 + 0.08 * Math.sin(fase + i * 0.4)) * -c + (opc.colaArriba ?? 0) * 0.05;
    x += Math.cos(a) * 22; y += Math.sin(a) * 22;
  }
  g.lineCap = "round"; g.lineJoin = "round";
  for (let i = 0; i < pts.length - 1; i++) {
    const w = mez(40, 24, i / pts.length);
    g.strokeStyle = i > 10 ? PIEL.raya : i % 3 === 1 ? PIEL.raya : PIEL.base;
    g.lineWidth = w;
    g.beginPath(); g.moveTo(...pts[i]); g.lineTo(...pts[i + 1]); g.stroke();
  }
  g.strokeStyle = "rgba(255,220,160,0.35)"; g.lineWidth = 9;
  g.beginPath(); g.moveTo(pts[0][0], pts[0][1] - 8); for (const p of pts.slice(1, 12)) g.lineTo(p[0], p[1] - 8); g.stroke();
}

// La cintura: tapa la costura entre las dos mitades cuando giran juntas.
function cintura(g, rf, rb, dobla) {
  const d = Math.abs(rf - rb), al = 1 - k.suave(k.tramo(d, 0.15, 0.5)) - k.suave(k.tramo(Math.abs(dobla), 0.15, 0.4));
  if (al <= 0) return;
  const r = (rf + rb) / 2;
  g.save(); g.globalAlpha *= al;
  g.save(); elipse(g, 0, 0, 150, 96); g.clip();
  cuerpo(g, 0, 190, 96, Math.cos(r), Math.sin(r), 1);
  g.restore(); g.restore();
}

// El gato entero. x, y: la cintura en pantalla; s: tamaño (1 = unos 700 px de largo); ang: giro en el plano.
// rf, rb: el giro de la mitad delantera y de la trasera alrededor de la columna (0 = patas abajo, π = del revés).
// ef, eb: patas delanteras / traseras encogidas (0-1). dobla: lo que se dobla por la cintura (radianes).
// opc: { agita, abre, haloF, haloB: {c:"r,g,b", al}, ojos, colaFase, colaArriba, sombra }
export function gato(g, x, y, s, ang, rf, rb, ef = 0, eb = 0, dobla = 0, t = 0, opc = {}) {
  g.save();
  g.translate(x, y); g.rotate(ang); g.scale(s, s);
  const delante = (f) => { g.save(); g.rotate(-dobla / 2); f(); g.restore(); };
  const detras = (f) => { g.save(); g.rotate(dobla / 2); f(); g.restore(); };
  // sombra suave del gato sobre lo que haya detrás (da volumen)
  g.save(); g.shadowColor = "rgba(0,0,0,0)";
  detras(() => mitad(g, -1, rb, eb, s, t, opc, "detras"));
  delante(() => mitad(g, 1, rf, ef, s, t, opc, "detras"));
  detras(() => cola(g, rb, t, opc));
  detras(() => mitad(g, -1, rb, eb, s, t, opc));
  delante(() => mitad(g, 1, rf, ef, s, t, opc));
  cintura(g, rf, rb, dobla);
  delante(() => { const cs = opc.cabeza ?? 1; g.save(); g.translate(330, 0); g.scale(cs, cs); g.translate(-330, 0); cabeza(g, rf, t, opc); g.restore(); });
  detras(() => mitad(g, -1, rb, eb, s, t, opc, "delante"));
  delante(() => mitad(g, 1, rf, ef, s, t, opc, "delante"));
  g.restore();
  g.restore();
}

// ---------- el cielo con nubes ----------
const NUBE = (() => {
  const c = k.lienzo(520, 300), g = c.getContext("2d"), az = k.azar(5);
  for (let i = 0; i < 16; i++) {
    const x = 90 + az() * 340, y = 120 + az() * 80 - (Math.abs(x - 260) < 120 ? 50 * az() : 0), r = 50 + az() * 60;
    const gr = g.createRadialGradient(x - r * 0.25, y - r * 0.35, r * 0.1, x, y, r);
    gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(0.7, "rgba(240,246,255,0.95)"); gr.addColorStop(1, "rgba(200,220,250,0)");
    g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill();
  }
  // sombra por abajo
  g.globalCompositeOperation = "source-atop";
  const gs = g.createLinearGradient(0, 120, 0, 280); gs.addColorStop(0, "rgba(150,175,220,0)"); gs.addColorStop(1, "rgba(130,160,215,0.55)");
  g.fillStyle = gs; g.fillRect(0, 0, 520, 300);
  return k.fijar(c);
})();
const NUBES = (() => { const az = k.azar(31), l = []; for (let i = 0; i < 13; i++) l.push({ x: az() * 1500 - 210, y: az(), z: 0.35 + az() * 1.3, w: 0.8 + az() * 0.8 }); return l.sort((a, b) => a.z - b.z); })();
const RAYAS = (() => { const az = k.azar(41), l = []; for (let i = 0; i < 18; i++) l.push({ x: az() * 1080, y: az(), l: 80 + az() * 220, a: 0.15 + az() * 0.3 }); return l; })();

// cae: lo que ha bajado la cámara (px); vel: velocidad (px/s) para las rayas de viento; sube: cuánto se ve del suelo.
export function cielo(g, cae, vel = 0) {
  const gr = g.createLinearGradient(0, 0, 0, 1920);
  gr.addColorStop(0, "#1f6fd6"); gr.addColorStop(0.55, "#58a8f2"); gr.addColorStop(1, "#bfe3ff");
  g.fillStyle = gr; g.fillRect(0, 0, 1080, 1920);
  // el sol, arriba a la izquierda
  k.brillo(g, 120, 160, 700, "255,240,200", 0.55);
  const H = 3400;
  for (const n of NUBES) {
    const y = ((((n.y * H - cae * n.z) % H) + H) % H) - 340;
    const w = 520 * n.w * (0.6 + n.z * 0.5), h = 300 * n.w * (0.6 + n.z * 0.5);
    g.save(); g.globalAlpha = Math.min(1, 0.55 + n.z * 0.35);
    g.drawImage(NUBE, n.x - w / 2, y - h / 2, w, h); g.restore();
  }
  if (vel > 200) {
    g.save(); g.lineCap = "round";
    for (const r of RAYAS) {
      const y = ((((r.y * 2200 - cae * 1.6) % 2200) + 2200) % 2200) - 140;
      const l = r.l * Math.min(1.6, vel / 2000);
      const gl = g.createLinearGradient(0, y, 0, y + l); gl.addColorStop(0, "rgba(255,255,255,0)"); gl.addColorStop(1, `rgba(255,255,255,${0.7 * r.a * Math.min(1, (vel - 200) / 1500)})`);
      g.strokeStyle = gl; g.lineWidth = 3;
      g.beginPath(); g.moveTo(r.x, y); g.lineTo(r.x, y + l); g.stroke();
    }
    g.restore();
  }
}

// ---------- el pasto ----------
const BRIZNAS = (() => { const az = k.azar(61), l = []; for (let i = 0; i < 850; i++) l.push({ x: az() * 1180 - 50, y: az(), h: 30 + az() * 60, a: (az() - 0.5) * 0.6, c: az() }); return l.sort((a, b) => a.y - b.y); })();
// y0: dónde empieza el pasto en pantalla (su borde de arriba).
export function pasto(g, y0, t = 0) {
  if (y0 > 1960) return;
  const gr = g.createLinearGradient(0, y0, 0, y0 + 700);
  gr.addColorStop(0, "#7ad04a"); gr.addColorStop(0.4, "#4fae32"); gr.addColorStop(1, "#2f7f22");
  g.fillStyle = gr; g.fillRect(0, y0, 1080, 1920 - y0 + 10);
  g.lineCap = "round";
  for (const b of BRIZNAS) {
    const y = y0 + 10 + b.y * 520;
    if (y > 1960) continue;
    const s = 0.6 + b.y * 0.9, w = 0.15 * Math.sin(t * 1.8 + b.x * 0.01);
    g.strokeStyle = b.c < 0.5 ? "#9be26a" : b.c < 0.8 ? "#3f9a2a" : "#c4f08a"; g.lineWidth = 5 * s;
    g.beginPath(); g.moveTo(b.x, y); g.quadraticCurveTo(b.x + (b.a + w) * 20 * s, y - b.h * s * 0.6, b.x + (b.a + w) * 50 * s, y - b.h * s); g.stroke();
  }
}

// La sombra del gato en el suelo (se encoge cuanto más lejos está).
export function sombraEnSuelo(g, x, y, ancho, al) {
  const gr = g.createRadialGradient(x, y, 4, x, y, ancho);
  gr.addColorStop(0, `rgba(20,50,10,${0.45 * al})`); gr.addColorStop(1, "rgba(20,50,10,0)");
  g.save(); g.translate(x, y); g.scale(1, 0.22); g.translate(-x, -y);
  g.fillStyle = gr; g.beginPath(); g.arc(x, y, ancho, 0, TAU); g.fill(); g.restore();
}

// Una nube de polvo/pasto al aterrizar: u de 0 a 1.
export function polvo(g, x, y, u, ancho = 420) {
  if (u <= 0 || u >= 1) return;
  const az = k.azar(91);
  for (let i = 0; i < 22; i++) {
    const lado = i % 2 ? 1 : -1, v = 0.4 + az() * 0.8, r = 30 + az() * 40;
    const px = x + lado * (ancho * 0.3 + ancho * v * k.entra(u)), py = y - 20 - 60 * az() * k.entra(u);
    g.fillStyle = `rgba(235,240,215,${0.55 * (1 - u)})`; g.beginPath(); g.arc(px, py, r * (0.6 + u), 0, TAU); g.fill();
  }
}

// Un velo azul oscuro suave detrás de los subtítulos (las nubes son blancas).
export function veloArriba(g, al = 1) {
  const gr = g.createLinearGradient(0, 220, 0, 600);
  gr.addColorStop(0, "rgba(8,30,80,0)"); gr.addColorStop(0.45, `rgba(8,30,80,${0.32 * al})`); gr.addColorStop(1, "rgba(8,30,80,0)");
  g.fillStyle = gr; g.fillRect(0, 220, 1080, 380);
}

// ---------- la sala: pared, ventana con luz, alfombra ----------
const SALA = (() => {
  const c = k.lienzo(1080, 1920), g = c.getContext("2d");
  const gp = g.createLinearGradient(0, 0, 0, 1300); gp.addColorStop(0, "#2d6f73"); gp.addColorStop(1, "#4fa3a0");
  g.fillStyle = gp; g.fillRect(0, 0, 1080, 1300);
  // papel pintado: rayas suaves
  g.fillStyle = "rgba(255,255,255,0.05)"; for (let x = 0; x < 1080; x += 90) g.fillRect(x, 0, 40, 1300);
  // la ventana con luz de tarde
  g.fillStyle = "#f7e2b5"; k.redondo(g, 640, 420, 340, 470, 14); g.fill();
  const gv = g.createLinearGradient(640, 420, 980, 890); gv.addColorStop(0, "#fff6d8"); gv.addColorStop(1, "#ffc36b");
  g.fillStyle = gv; k.redondo(g, 660, 440, 300, 430, 10); g.fill();
  g.fillStyle = "#e9d2a6"; g.fillRect(803, 440, 14, 430); g.fillRect(660, 648, 300, 14);
  g.fillStyle = "#d9bb86"; g.fillRect(620, 880, 380, 30);
  // el zócalo y el piso de madera
  g.fillStyle = "#e8e0d0"; g.fillRect(0, 1270, 1080, 40);
  const gm = g.createLinearGradient(0, 1310, 0, 1920); gm.addColorStop(0, "#9a5d34"); gm.addColorStop(1, "#6a3a1c");
  g.fillStyle = gm; g.fillRect(0, 1310, 1080, 610);
  g.strokeStyle = "rgba(40,15,5,0.35)"; g.lineWidth = 3;
  for (let y = 1340, i = 0; y < 1920; y += 34 + i * 4, i++) { g.beginPath(); g.moveTo(0, y); g.lineTo(1080, y); g.stroke(); }
  // la alfombra
  g.fillStyle = "#c8443c"; g.beginPath(); g.ellipse(540, 1640, 520, 170, 0, 0, Math.PI * 2); g.fill();
  g.strokeStyle = "#f2c14e"; g.lineWidth = 12; g.beginPath(); g.ellipse(540, 1640, 470, 140, 0, 0, Math.PI * 2); g.stroke();
  return k.fijar(c);
})();
export function sala(g) {
  g.drawImage(SALA, 0, 0);
  // el rayo de luz de la ventana sobre el piso
  g.save(); g.globalCompositeOperation = "lighter";
  const gl = g.createLinearGradient(800, 650, 500, 1700); gl.addColorStop(0, "rgba(255,200,120,0.25)"); gl.addColorStop(1, "rgba(255,200,120,0)");
  g.fillStyle = gl; g.beginPath(); g.moveTo(660, 880); g.lineTo(960, 880); g.lineTo(800, 1800); g.lineTo(200, 1800); g.closePath(); g.fill();
  g.restore();
}

// Un cojín grande y mullido; `hunde` (0-1) lo aplasta cuando cae algo encima.
export function cojin(g, x, y, w, h, color = ["#ffb347", "#e0702a", "#a8481a"], hunde = 0) {
  const hh = h * (1 - 0.25 * hunde), ww = w * (1 + 0.06 * hunde);
  g.fillStyle = "rgba(30,10,0,0.35)"; g.beginPath(); g.ellipse(x, y + hh * 0.45, ww * 0.55, hh * 0.18, 0, 0, Math.PI * 2); g.fill();
  const gr = g.createLinearGradient(x, y - hh / 2, x, y + hh / 2);
  gr.addColorStop(0, color[0]); gr.addColorStop(0.6, color[1]); gr.addColorStop(1, color[2]);
  g.fillStyle = gr;
  g.beginPath();
  g.moveTo(x - ww / 2, y - hh * 0.3);
  g.quadraticCurveTo(x, y - hh * 0.6 + 30 * hunde, x + ww / 2, y - hh * 0.3);
  g.quadraticCurveTo(x + ww / 2 + 30, y, x + ww / 2, y + hh * 0.35);
  g.quadraticCurveTo(x, y + hh * 0.55, x - ww / 2, y + hh * 0.35);
  g.quadraticCurveTo(x - ww / 2 - 30, y, x - ww / 2, y - hh * 0.3);
  g.closePath(); g.fill();
  g.save(); g.clip(); pelo(g, 0.25); g.restore();
  // el botón del centro y los pliegues
  g.strokeStyle = "rgba(90,30,5,0.35)"; g.lineWidth = 5;
  for (const d of [-1, 1]) { g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + d * ww * 0.2, y - hh * 0.1, x + d * ww * 0.4, y - hh * 0.25); g.stroke(); }
  g.fillStyle = color[2]; g.beginPath(); g.arc(x, y, 12, 0, Math.PI * 2); g.fill();
  g.fillStyle = "rgba(255,255,255,0.3)"; g.beginPath(); g.ellipse(x - ww * 0.2, y - hh * 0.3, ww * 0.2, hh * 0.06, -0.1, 0, Math.PI * 2); g.fill();
}

// El sofá bajo, de lado; el asiento a la altura `ya`.
export function sofa(g, x, ya, w) {
  // patas
  g.fillStyle = "#3b2414"; for (const d of [-0.42, 0.42]) { g.fillRect(x + d * w - 14, ya + 150, 28, 60); }
  // base y asiento
  const gb = g.createLinearGradient(0, ya - 40, 0, ya + 160); gb.addColorStop(0, "#8e7bd8"); gb.addColorStop(1, "#4b3b94");
  g.fillStyle = gb; k.redondo(g, x - w / 2, ya - 30, w, 190, 40); g.fill();
  // respaldo
  const gr = g.createLinearGradient(0, ya - 420, 0, ya); gr.addColorStop(0, "#9f8ce6"); gr.addColorStop(1, "#5b48a8");
  g.fillStyle = gr; k.redondo(g, x - w / 2 + 20, ya - 400, w - 40, 400, 60); g.fill();
  // cojín del asiento
  const gc = g.createLinearGradient(0, ya - 60, 0, ya + 40); gc.addColorStop(0, "#b6a6f2"); gc.addColorStop(1, "#7462c4");
  g.fillStyle = gc; k.redondo(g, x - w / 2 + 30, ya - 70, w - 60, 100, 36); g.fill();
  // brazos
  for (const d of [-1, 1]) {
    const ga = g.createLinearGradient(0, ya - 220, 0, ya + 150); ga.addColorStop(0, "#a593ea"); ga.addColorStop(1, "#4b3b94");
    g.fillStyle = ga; k.redondo(g, x + d * w / 2 - (d > 0 ? 90 : 0), ya - 220, 90, 380, 45); g.fill();
  }
  k.reflejo(g, x - w / 2 + 60, ya - 380, w - 120, 50, 0.18);
}
