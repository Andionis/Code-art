// El corte del suelo, de lado (como una granja de hormigas): la calle arriba, la tierra en capas, la casa a la
// izquierda, el banco a la derecha con su bóveda bajo tierra, y el túnel que va de una a otra a 4 m bajo la calle.
// Mundo en metros (x a la derecha, y arriba; la calle en y = 0). Cámara 2D: { cx, cy, s } (s: píxeles por metro).
import * as k from "#kit";

const { azar, mez } = k;
export const SX = (c, x) => 540 + (x - c.cx) * c.s;
export const SY = (c, y) => 960 - (y - c.cy) * c.s;

export const T = { x0: 5.4, x1: 84.6, y0: -4.75, y1: -3.95 };      // el túnel; x0..x0+0,9 el pozo de la casa
export const CASA = { x0: 0, x1: 8.5, alto: 3.2 };
export const BANCO = { x0: 76, x1: 98, alto: 46 };
export const BOV = { x0: 79.5, x1: 90.5, y0: -2.85, y1: -0.25 };   // la bóveda; su piso, 1,1 m de concreto encima del túnel
export const LOSA = { y0: T.y1, y1: BOV.y0 };
export const HOYO = { x0: 83.7, x1: 84.6 };

// ---------------------------------------------------------------- la tierra
const CAPAS = [
  { y: 0, c0: "#6b3f22", c1: "#5a331b" },
  { y: -0.7, c0: "#a4572c", c1: "#8a4523" },
  { y: -2.2, c0: "#c06a35", c1: "#a5552a" },
  { y: -3.6, c0: "#cf8a4a", c1: "#b3713a" },
  { y: -6.0, c0: "#b06a3a", c1: "#995a32" },
  { y: -9.0, c0: "#8e4f2c", c1: "#7a4226" },
];
const borde = (i, x) => CAPAS[i].y + (i ? 0.18 * Math.sin(x * 0.37 + i * 2) + 0.1 * Math.sin(x * 1.3 + i) : 0);
const azP = azar(2024);
const PIEDRAS = Array.from({ length: 900 }, () => ({ x: -20 + azP() * 140, y: -0.3 - azP() * 12, r: 0.06 + Math.pow(azP(), 3) * 0.35, c: azP(), a: azP() * 3 }));

function tierra(g, c) {
  const xa = c.cx - 560 / c.s, xb = c.cx + 560 / c.s, paso = Math.max(0.2, 8 / c.s);
  for (let i = 0; i < CAPAS.length; i++) {
    const yb = i + 1 < CAPAS.length ? null : -40;
    g.beginPath();
    for (let x = xa; x <= xb + paso; x += paso) { const y = SY(c, borde(i, x)); x === xa ? g.moveTo(SX(c, x), y) : g.lineTo(SX(c, x), y); }
    if (yb === null) for (let x = xb + paso; x >= xa; x -= paso) g.lineTo(SX(c, x), SY(c, borde(i + 1, x)));
    else { g.lineTo(SX(c, xb + paso), SY(c, yb)); g.lineTo(SX(c, xa), SY(c, yb)); }
    g.closePath();
    const gr = g.createLinearGradient(0, SY(c, CAPAS[i].y), 0, SY(c, i + 1 < CAPAS.length ? CAPAS[i + 1].y : -14));
    gr.addColorStop(0, CAPAS[i].c0); gr.addColorStop(1, CAPAS[i].c1);
    g.fillStyle = gr; g.fill();
  }
  // la textura, pegada al mundo (se mueve con la tierra)
  const tile = 7 * c.s, ox = ((SX(c, 0) % tile) + tile) % tile - tile, oy = SY(c, 0);
  g.save(); g.beginPath(); g.rect(0, oy, 1080, 1920); g.clip(); g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.14 * Math.max(0, 1 - c.s / 60);
  for (let x = ox; x < 1080; x += tile) for (let y = oy; y < 1920; y += tile) g.drawImage(k.manchas, x, y, tile + 1, tile + 1);
  g.restore();
  // piedras
  for (const p of PIEDRAS) {
    const X = SX(c, p.x), Y = SY(c, p.y), r = p.r * c.s;
    if (X < -r || X > 1080 + r || Y < -r || Y > 1920 + r || r < 1) continue;
    if (p.y < T.y1 + p.r && p.y > T.y0 - p.r && p.x > T.x0 - p.r && p.x < T.x1 + p.r) continue;
    const gr = g.createRadialGradient(X - r * 0.3, Y - r * 0.4, r * 0.1, X, Y, r);
    const base = p.c < 0.5 ? [200, 170, 130] : [150, 96, 60];
    gr.addColorStop(0, `rgb(${base.map((v) => Math.min(255, v + 50)).join(",")})`); gr.addColorStop(1, `rgb(${base.map((v) => v * 0.6).join(",")})`);
    g.fillStyle = gr; g.beginPath(); g.ellipse(X, Y, r, r * 0.7, p.a, 0, 6.283); g.fill();
  }
}

// ---------------------------------------------------------------- el cielo, la calle, la casa y el banco
function cielo(g, c) {
  const y0 = SY(c, 0);
  if (y0 <= 0) return;
  const gr = g.createLinearGradient(0, 0, 0, y0);
  gr.addColorStop(0, "#2f86e0"); gr.addColorStop(1, "#bfe3ff");
  g.fillStyle = gr; g.fillRect(0, 0, 1080, y0);
  // la ciudad lejos
  const az = azar(55);
  g.fillStyle = "rgba(120,160,200,0.55)";
  for (let x = -40; x < 140; x += 3 + az() * 4) { const h = 4 + az() * 14, w = 2.5 + az() * 3; g.fillRect(SX(c, x), SY(c, h), w * c.s, h * c.s); }
}
function calle(g, c) {
  g.fillStyle = "#4a4c52"; g.fillRect(0, SY(c, 0.22), 1080, 0.22 * c.s + 1);
  g.fillStyle = "#e9d46a";
  for (let x = -40; x < 140; x += 3) g.fillRect(SX(c, x), SY(c, 0.13), 1.5 * c.s, Math.max(1, 0.04 * c.s));
  g.fillStyle = "#b9b2a2"; g.fillRect(0, SY(c, 0.26), 1080, Math.max(1, 0.04 * c.s));
}
function casa(g, c) {
  const x0 = SX(c, CASA.x0), x1 = SX(c, CASA.x1), y0 = SY(c, 0), y1 = SY(c, CASA.alto);
  if (x1 < 0 || x0 > 1080) return;
  // por dentro (en corte): la pared del fondo clara, el piso y el letrero
  g.fillStyle = "#e9e1c8"; g.fillRect(x0, y1, x1 - x0, y0 - y1);
  g.fillStyle = "#6fc46a"; g.fillRect(x0, y1, 0.3 * c.s, y0 - y1); g.fillRect(x1 - 0.3 * c.s, y1, 0.3 * c.s, y0 - y1);
  g.fillStyle = "#f7f4ea"; g.fillRect(x0 - 0.15 * c.s, y1 - 0.25 * c.s, x1 - x0 + 0.3 * c.s, 0.25 * c.s);
  g.fillStyle = "#1f8f3c"; g.fillRect(x0 + 0.6 * c.s, y1 - 1.1 * c.s, x1 - x0 - 1.2 * c.s, 0.8 * c.s);
  g.save(); g.font = `900 ${0.5 * c.s}px Figtree`; g.fillStyle = "#fff7c2"; g.textAlign = "center"; g.textBaseline = "middle";
  g.fillText("PASTO SINTÉTICO", (x0 + x1) / 2, y1 - 0.68 * c.s, x1 - x0 - 1.5 * c.s); g.restore();
  // el piso, con el hoyo del pozo
  g.fillStyle = "#9a9284"; g.fillRect(x0, y0 - 0.15 * c.s, SX(c, T.x0) - x0, 0.15 * c.s); g.fillRect(SX(c, T.x0 + 0.9), y0 - 0.15 * c.s, x1 - SX(c, T.x0 + 0.9), 0.15 * c.s);
  // los sacos de tierra apilados dentro
  for (let i = 0; i < 9; i++) {
    const sx = SX(c, 1.0 + (i % 5) * 0.62 + (i >= 5 ? 0.3 : 0)), sy = SY(c, 0.32 + (i >= 5 ? 0.5 : 0)), r = 0.32 * c.s;
    const gr = g.createRadialGradient(sx - r * 0.3, sy - r * 0.4, r * 0.1, sx, sy, r * 1.2);
    gr.addColorStop(0, "#e9cd96"); gr.addColorStop(1, "#97733f");
    g.fillStyle = gr; g.beginPath(); g.ellipse(sx, sy, r, r * 0.8, 0, 0, 6.283); g.fill();
  }
}
function banco(g, c) {
  const x0 = SX(c, BANCO.x0), x1 = SX(c, BANCO.x1), y0 = SY(c, 0), y1 = SY(c, BANCO.alto);
  if (x1 < 0 || x0 > 1080) return;
  const gr = g.createLinearGradient(x0, 0, x1, 0); gr.addColorStop(0, "#e8e6de"); gr.addColorStop(1, "#c9c6bc");
  g.fillStyle = gr; g.fillRect(x0, y1, x1 - x0, y0 - y1);
  g.fillStyle = "#3d82c4";
  for (let y = 1.6; y < BANCO.alto - 1; y += 2.6) for (let x = BANCO.x0 + 1; x < BANCO.x1 - 1.5; x += 2.2) g.fillRect(SX(c, x), SY(c, y + 1.6), 1.5 * c.s, 1.6 * c.s);
  g.save(); g.font = `900 ${1.6 * c.s}px Figtree`; g.fillStyle = "#16406e"; g.textAlign = "center"; g.textBaseline = "bottom";
  g.fillText("BANCO CENTRAL", (x0 + x1) / 2, y1 - 0.3 * c.s, x1 - x0); g.restore();
}

// ---------------------------------------------------------------- la bóveda bajo el banco y su piso de concreto
// st: { hoyo (0..1: se abre), grietas (0..1), dinero (0..1: lo que queda), luzBov }
function boveda(g, c, st) {
  const x0 = SX(c, BOV.x0), x1 = SX(c, BOV.x1), ya = SY(c, BOV.y1), yb = SY(c, BOV.y0);
  if (x1 < 0 || x0 > 1080) return;
  // las paredes gruesas de concreto alrededor
  g.fillStyle = "#8e9296"; g.fillRect(x0 - 0.6 * c.s, ya - 0.3 * c.s, x1 - x0 + 1.2 * c.s, SY(c, LOSA.y0) - ya + 0.3 * c.s);
  // dentro: acero
  const gr = g.createLinearGradient(0, ya, 0, yb); gr.addColorStop(0, "#4f8496"); gr.addColorStop(1, "#2f5a6a");
  g.fillStyle = gr; g.fillRect(x0, ya, x1 - x0, yb - ya);
  g.strokeStyle = "rgba(10,30,40,0.6)"; g.lineWidth = Math.max(1, 0.03 * c.s);
  for (let x = BOV.x0; x < BOV.x1; x += 0.8) { g.beginPath(); g.moveTo(SX(c, x), ya); g.lineTo(SX(c, x), yb); g.stroke(); }
  // el dinero: pilas de fajos sobre el piso
  const queda = st.dinero ?? 1;
  for (let i = 0; i < 14; i++) {
    const px = BOV.x0 + 0.4 + i * 0.75; if (px > HOYO.x0 - 0.7 && px < HOYO.x1 + 0.1) continue;
    const h = (1.0 + ((i * 37) % 7) * 0.18) * queda; if (h < 0.05) continue;
    const X = SX(c, px), Y = SY(c, BOV.y0), W = 0.62 * c.s, H = h * c.s;
    const gg = g.createLinearGradient(X, 0, X + W, 0); gg.addColorStop(0, "#f0b25e"); gg.addColorStop(1, "#b97a34");
    g.fillStyle = gg; g.fillRect(X, Y - H, W, H);
    g.strokeStyle = "rgba(110,64,20,0.6)"; g.lineWidth = Math.max(1, 0.015 * c.s); g.beginPath();
    for (let y = 0.12; y < h; y += 0.12) { g.moveTo(X, Y - y * c.s); g.lineTo(X + W, Y - y * c.s); } g.stroke();
    g.fillStyle = "rgba(255,240,200,0.85)"; g.fillRect(X + W * 0.42, Y - H, W * 0.14, H);
  }
  // la losa: 1,1 m de concreto con varillas de acero
  const ly0 = SY(c, LOSA.y1), ly1 = SY(c, LOSA.y0);
  const gl = g.createLinearGradient(0, ly0, 0, ly1); gl.addColorStop(0, "#b4b7ba"); gl.addColorStop(1, "#8d9093");
  g.fillStyle = gl; g.fillRect(x0 - 0.6 * c.s, ly0, x1 - x0 + 1.2 * c.s, ly1 - ly0);
  g.save(); g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.25; g.drawImage(k.red, x0 - 0.6 * c.s, ly0, x1 - x0 + 1.2 * c.s, ly1 - ly0); g.restore();
  g.fillStyle = "#7a4a2a";
  for (const fy of [0.25, 0.75]) for (let x = BOV.x0 - 0.4; x < BOV.x1 + 0.4; x += 0.3) { g.beginPath(); g.arc(SX(c, x), mez(ly0, ly1, fy), Math.max(1, 0.06 * c.s), 0, 6.283); g.fill(); }
  // las grietas
  const gri = st.grietas || 0;
  if (gri > 0) {
    g.save(); g.strokeStyle = `rgba(50,44,40,${0.75 * gri})`; g.lineWidth = Math.max(1.5, 0.022 * c.s); g.lineCap = "round";
    const az = azar(8);
    for (let i = 0; i < 6; i++) {
      let x = mez(HOYO.x0, HOYO.x1, az()), y = LOSA.y0;
      g.beginPath(); g.moveTo(SX(c, x), SY(c, y));
      for (let j = 0; j < 6; j++) { x += (az() - 0.5) * 0.4; y += (0.18 + az() * 0.12) * gri; g.lineTo(SX(c, x), SY(c, Math.min(LOSA.y1 + 0.2, y))); }
      g.stroke();
    }
    g.restore();
  }
  // el hoyo abierto en la losa
  const h = st.hoyo || 0;
  if (h > 0) {
    const yTop = mez(LOSA.y0, LOSA.y1 + 0.05, h);
    g.fillStyle = "#1c1410"; g.beginPath();
    g.moveTo(SX(c, HOYO.x0), SY(c, LOSA.y0));
    for (let i = 0; i <= 6; i++) { const u = i / 6; g.lineTo(SX(c, mez(HOYO.x0, HOYO.x0 + 0.1, u)) + Math.sin(i * 3.1) * 0.06 * c.s, SY(c, mez(LOSA.y0, yTop, u))); }
    for (let i = 6; i >= 0; i--) { const u = i / 6; g.lineTo(SX(c, mez(HOYO.x1, HOYO.x1 - 0.1, u)) + Math.cos(i * 2.7) * 0.06 * c.s, SY(c, mez(LOSA.y0, yTop, u))); }
    g.closePath(); g.fill();
    // varillas cortadas que asoman en el borde
    g.strokeStyle = "#7a4a2a"; g.lineWidth = Math.max(1.5, 0.05 * c.s); g.beginPath();
    for (const fy of [0.25, 0.75]) { const y = SY(c, mez(LOSA.y0, LOSA.y1, fy)); if (fy > h + 0.05) continue; g.moveTo(SX(c, HOYO.x0 - 0.05), y); g.lineTo(SX(c, HOYO.x0 + 0.22), y + 0.05 * c.s); g.moveTo(SX(c, HOYO.x1 + 0.05), y); g.lineTo(SX(c, HOYO.x1 - 0.2), y - 0.04 * c.s); }
    g.stroke();
  }
}

// ---------------------------------------------------------------- el túnel en corte
// st: { pozo (0..1 lo que ha bajado), punta (x de la punta), focos (x) → 0..1, aire: { t, al }, gateo: { x, fase } }
const MARCOS = []; for (let x = T.x0 + 1.4; x < T.x1 - 0.3; x += 1.2) MARCOS.push(x);
const FOCOS = []; for (let x = T.x0 + 2; x < T.x1 - 0.5; x += 2.4) FOCOS.push(x);
function tunel(g, c, st, t) {
  const pz = st.pozo ?? 1, punta = st.punta ?? T.x1;
  const top = SY(c, T.y1), bot = SY(c, T.y0);
  // el pozo de la casa
  const yp = mez(-0.15, T.y0, pz);
  g.fillStyle = "#3a2214"; g.fillRect(SX(c, T.x0), SY(c, -0.15), 0.9 * c.s, SY(c, yp) - SY(c, -0.15));
  // escalera en el pozo
  if (pz > 0.2) { g.strokeStyle = "#c48a4e"; g.lineWidth = Math.max(1, 0.05 * c.s); g.beginPath(); g.moveTo(SX(c, T.x0 + 0.2), SY(c, -0.1)); g.lineTo(SX(c, T.x0 + 0.2), SY(c, yp)); g.moveTo(SX(c, T.x0 + 0.7), SY(c, -0.1)); g.lineTo(SX(c, T.x0 + 0.7), SY(c, yp)); for (let y = -0.4; y > yp; y -= 0.35) { g.moveTo(SX(c, T.x0 + 0.2), SY(c, y)); g.lineTo(SX(c, T.x0 + 0.7), SY(c, y)); } g.stroke(); }
  if (punta <= T.x0 + 0.9) return;
  const xa = SX(c, T.x0), xb = SX(c, punta);
  // el hueco: oscuro, con la luz de los focos
  const gr = g.createLinearGradient(0, top, 0, bot); gr.addColorStop(0, "#2e1a10"); gr.addColorStop(1, "#4a2a18");
  g.fillStyle = gr; g.fillRect(xa, top, xb - xa, bot - top);
  // la punta: redondeada, de tierra recién cavada
  g.beginPath(); g.ellipse(xb, (top + bot) / 2, 0.2 * c.s, (bot - top) / 2, 0, -Math.PI / 2, Math.PI / 2); g.fill();
  // la luz de cada foco encendido (cálida, se suma)
  for (const fx of FOCOS) {
    if (fx > punta - 0.3) continue;
    const on = st.focos ? st.focos(fx) : 0; if (on <= 0) continue;
    const X = SX(c, fx), Y = top + 0.14 * c.s;
    g.save(); g.beginPath(); g.rect(xa, top, xb - xa, bot - top); g.clip();
    k.brillo(g, X, Y + 0.2 * c.s, 2.6 * c.s, "255,180,90", 0.75 * on);
    g.restore();
  }
  // los marcos de madera
  for (const mx of MARCOS) {
    if (mx > punta - 0.4) continue;
    const X = SX(c, mx), w = Math.max(2, 0.12 * c.s);
    if (X < -w || X > 1080 + w) continue;
    g.fillStyle = "#b07a42"; g.fillRect(X - w / 2, top, w, bot - top);
    g.fillStyle = "#8a5a2c"; g.fillRect(X - w / 2, top, w * 0.3, bot - top);
  }
  g.fillStyle = "#c08a50"; g.fillRect(xa, top, xb - xa - 0.3 * c.s, Math.max(2, 0.08 * c.s)); // el techo de tablas
  g.fillStyle = "#7a5030"; g.fillRect(xa, bot - Math.max(2, 0.06 * c.s), xb - xa, Math.max(2, 0.06 * c.s)); // el piso
  // la manguera del aire, por el piso
  if (st.aire) {
    const al = st.aire.al;
    g.save(); g.globalAlpha = al;
    const yy = bot - 0.13 * c.s, ww = Math.max(2, 0.12 * c.s);
    g.strokeStyle = "#5d7fa0"; g.lineWidth = ww; g.beginPath(); g.moveTo(SX(c, T.x0 + 0.45), SY(c, -0.2)); g.lineTo(SX(c, T.x0 + 0.45), yy); g.lineTo(Math.min(xb - 0.3 * c.s, SX(c, st.aire.hasta ?? T.x1)), yy); g.stroke();
    g.strokeStyle = "rgba(255,255,255,0.35)"; g.lineWidth = ww * 0.3; g.stroke();
    g.restore();
    // el aire frío: partículas azules que corren por el túnel
    const az = azar(31);
    g.save(); g.beginPath(); g.rect(xa, top, xb - xa, bot - top); g.clip(); g.globalCompositeOperation = "lighter"; g.lineCap = "round";
    for (let i = 0; i < 160; i++) {
      const y = mez(T.y0 + 0.12, T.y1 - 0.12, az()), v = 6 + az() * 5, x = T.x0 + ((az() * 90 + st.aire.t * v) % 82);
      if (x > (st.aire.hasta ?? T.x1)) continue;
      const X = SX(c, x), Y = SY(c, y + 0.05 * Math.sin(x * 2 + i));
      g.strokeStyle = `rgba(150,220,255,${0.55 * al})`; g.lineWidth = Math.max(1.5, 0.04 * c.s);
      g.beginPath(); g.moveTo(X - 0.5 * c.s, Y); g.lineTo(X, Y); g.stroke();
    }
    g.restore();
  }
  // el cable y los focos
  g.strokeStyle = "#1c120c"; g.lineWidth = Math.max(1, 0.025 * c.s); g.beginPath(); g.moveTo(xa, top + 0.06 * c.s); g.lineTo(xb - 0.3 * c.s, top + 0.06 * c.s); g.stroke();
  for (const fx of FOCOS) {
    if (fx > punta - 0.3) continue;
    const on = st.focos ? st.focos(fx) : 0, X = SX(c, fx), Y = top + 0.14 * c.s, r = Math.max(1.5, 0.06 * c.s);
    if (X < -50 || X > 1130) continue;
    g.strokeStyle = "#1c120c"; g.beginPath(); g.moveTo(X, top + 0.06 * c.s); g.lineTo(X, Y); g.stroke();
    g.fillStyle = on > 0 ? `rgb(${mez(120, 255, on)},${mez(110, 240, on)},${mez(100, 180, on)})` : "#8a8478"; g.beginPath(); g.arc(X, Y + r, r, 0, 6.283); g.fill();
    if (on > 0) k.brillo(g, X, Y + r, 0.7 * c.s, "255,220,150", on);
  }
  // el que gatea
  if (st.gateo) gateador(g, c, st.gateo.x, st.gateo.fase, st.gateo.al ?? 1);
}

// una persona a gatas, de lado, mirando a la derecha (x: sus manos)
function gateador(g, c, x, fase, al) {
  const s = c.s, base = SY(c, T.y0 + 0.06), X = SX(c, x);
  const P = (dx, dy) => [X + dx * s, base - dy * s];
  const pa = Math.sin(fase) * 0.09, pb = Math.sin(fase + Math.PI) * 0.09;
  g.save(); g.globalAlpha *= al; g.lineCap = "round"; g.lineJoin = "round";
  const hombro = P(-0.08, 0.4), cadera = P(-0.68, 0.42);
  // piernas (rodillas en el suelo)
  g.strokeStyle = "#2c3550"; g.lineWidth = 0.11 * s;
  for (const [p, o] of [[pa, 0], [pb, 0.04]]) { const rod = P(-0.72 + p, 0.02 + o * 0), pie = P(-1.05 + p * 0.5, 0.05); g.beginPath(); g.moveTo(...cadera); g.lineTo(...rod); g.lineTo(...pie); g.stroke(); }
  // el cuerpo (camiseta)
  g.strokeStyle = "#e05a2c"; g.lineWidth = 0.2 * s; g.beginPath(); g.moveTo(...cadera); g.quadraticCurveTo(...P(-0.38, 0.5), ...hombro); g.stroke();
  // brazos
  g.strokeStyle = "#c98b62"; g.lineWidth = 0.075 * s;
  for (const p of [pb, pa]) { g.beginPath(); g.moveTo(...hombro); g.lineTo(...P(0.02 + p, 0.2)); g.lineTo(...P(0.06 + p, 0.01)); g.stroke(); }
  // la cabeza, con su casco y la linterna
  const cab = P(0.1, 0.5);
  g.fillStyle = "#c98b62"; g.beginPath(); g.arc(cab[0], cab[1], 0.1 * s, 0, 6.283); g.fill();
  g.fillStyle = "#f0c419"; g.beginPath(); g.arc(cab[0] - 0.01 * s, cab[1] - 0.03 * s, 0.11 * s, Math.PI * 1.05, Math.PI * 2.05); g.fill();
  k.brillo(g, cab[0] + 0.1 * s, cab[1] - 0.05 * s, 0.6 * s, "255,240,190", 0.8);
  g.restore();
}

// ---------------------------------------------------------------- la cota (2D)
export function cota(g, ax, ay, bx, by, texto, al = 1, color = "255,214,80", lado = 1) {
  if (al <= 0.003) return;
  g.save(); g.globalAlpha *= al; g.strokeStyle = `rgb(${color})`; g.fillStyle = `rgb(${color})`; g.lineWidth = 6; g.lineCap = "round";
  g.shadowColor = "rgba(0,0,0,0.6)"; g.shadowBlur = 10;
  const dx = bx - ax, dy = by - ay, L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L, nx = -uy, ny = ux, h = Math.min(24, L * 0.3);
  g.beginPath(); g.moveTo(ax, ay); g.lineTo(bx, by);
  g.moveTo(ax + nx * 22, ay + ny * 22); g.lineTo(ax - nx * 22, ay - ny * 22); g.moveTo(bx + nx * 22, by + ny * 22); g.lineTo(bx - nx * 22, by - ny * 22); g.stroke();
  for (const [px, py, sg] of [[ax, ay, 1], [bx, by, -1]]) { g.beginPath(); g.moveTo(px, py); g.lineTo(px + sg * ux * h + nx * h * 0.45, py + sg * uy * h + ny * h * 0.45); g.lineTo(px + sg * ux * h - nx * h * 0.45, py + sg * uy * h - ny * h * 0.45); g.closePath(); g.fill(); }
  g.font = "800 64px Figtree"; g.textAlign = "center"; g.textBaseline = "middle"; g.shadowColor = "rgba(0,0,0,0.9)"; g.shadowBlur = 16;
  g.fillText(texto, (ax + bx) / 2 + nx * 52 * lado, (ay + by) / 2 + ny * 52 * lado);
  g.restore();
}

// ---------------------------------------------------------------- todo junto
export function seccion(g, c, st, t) {
  g.fillStyle = "#3a2214"; g.fillRect(0, 0, 1080, 1920);
  cielo(g, c);
  banco(g, c);
  tierra(g, c);
  boveda(g, c, st);
  tunel(g, c, st, t);
  calle(g, c);
  casa(g, c);
}

// las chispas de tierra en la punta mientras cavan
export function polvo(g, c, x, y, t, al = 1) {
  if (al <= 0) return;
  const az = azar(12);
  for (let i = 0; i < 26; i++) {
    const f = (t * 2.2 + az()) % 1, a = Math.PI * (0.6 + az() * 0.8), v = (0.4 + az() * 0.6) * c.s;
    const X = SX(c, x) + Math.cos(a) * v * f, Y = SY(c, y) - Math.sin(a) * v * f * 0.6 + f * f * 0.5 * c.s, r = Math.max(1.5, (0.03 + az() * 0.05) * c.s);
    g.fillStyle = `rgba(${az() < 0.5 ? "190,110,60" : "120,70,40"},${al * (1 - f)})`; g.beginPath(); g.arc(X, Y, r, 0, 6.283); g.fill();
  }
}
