// Lo que comparten los planos: el mar, el pulpo (por fuera y transparente, con sus tres corazones, sus branquias y su
// sangre azul) y la cámara 2D con la que se mira.
import * as k from "#kit";

const { azar, mez, suave: su, tramo: tr } = k;
const TAU = Math.PI * 2;

// ---------------------------------------------------------------- utilidades
// La cámara: el punto del mundo (x, y) queda en el centro de la pantalla, con zoom s.
export const enCam = (g, c) => { g.translate(540, 960); g.scale(c.s, c.s); g.translate(-c.x, -c.y); };
export const aPantalla = (c, x, y) => [540 + (x - c.x) * c.s, 960 + (y - c.y) * c.s];

// Lo que avanza algo con una velocidad que cambia (la sangre, un paso): se integra una vez, todo sale de t.
export function integra(vel, tmax = 60, paso = 1 / 120) {
  const A = [];
  for (let t = 0, d = 0; t <= tmax + 1; t += paso) { A.push(d); d += vel(t) * paso; }
  return (t) => A[Math.max(0, Math.min(A.length - 1, Math.round(t / paso)))];
}

// Un latido: 0 en reposo, sube rápido y baja (bpm latidos por minuto, desfase en vueltas).
export function latido(t, bpm = 80, desfase = 0) {
  const u = ((t * bpm) / 60 + desfase) % 1;
  return u < 0.12 ? su(u / 0.12) : u < 0.4 ? 1 - su((u - 0.12) / 0.28) : 0;
}

// El velo de arriba, para que el subtítulo se lea.
export function velo(g, al = 0.55) {
  const vg = g.createLinearGradient(0, 200, 0, 640);
  vg.addColorStop(0, `rgba(2,14,30,${al})`); vg.addColorStop(1, "rgba(2,14,30,0)");
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 640);
}

// ---------------------------------------------------------------- el mar
const azM = azar(777);
const NIEVE = Array.from({ length: 220 }, () => ({ x: azM() * 1400 - 160, y: azM() * 2400 - 240, p: 0.35 + azM() * 1.1, r: 1.5 + azM() * 3.5, f: azM() * TAU }));
const BURBUJAS = Array.from({ length: 70 }, () => ({ x: azM() * 1200 - 60, y: azM() * 4200, p: 0.5 + azM() * 1.2, r: 10 + azM() * 38, v: 160 + azM() * 260, f: azM() * TAU }));

// El agua: degradado según la hondura (c.y), rayos de luz desde arriba, la nieve marina con su paralaje.
// o: { burbujas (0-1), suelo (y del suelo en el mundo, o null) }
export function mar(g, c, t, o = {}) {
  const hondo = su(Math.min(1, Math.max(0, (c.y + 2500) / 3500)));
  const fg = g.createLinearGradient(0, 0, 0, 1920);
  fg.addColorStop(0, k.mezColor("#2aa5d8", "#0b5d93", hondo));
  fg.addColorStop(0.55, k.mezColor("#0d6aa6", "#063a6b", hondo));
  fg.addColorStop(1, k.mezColor("#063f74", "#021a38", hondo));
  g.fillStyle = fg; g.fillRect(0, 0, 1080, 1920);
  k.brillo(g, 380, -100, 1500, "150,230,255", 0.45 - 0.2 * hondo);
  k.rayos(g, t, 1700, 1.3 - 0.5 * hondo, 7, "190,240,255");
  // las causticas del agua, muy suaves, moviéndose
  g.save(); g.globalCompositeOperation = "screen"; g.globalAlpha = 0.07;
  g.drawImage(k.causticas, -200 + 40 * Math.sin(t * 0.4), -300 - (c.y * 0.05) % 300, 1500, 2600); g.restore();
  // el suelo de arena y piedras
  if (o.suelo != null) suelo(g, c, t, o.suelo);
  // la nieve marina: puntitos que flotan, con paralaje (los cercanos se mueven más)
  g.save(); g.globalCompositeOperation = "lighter";
  for (const q of NIEVE) {
    const sx = (((q.x - c.x * q.p * 0.35 + 18 * Math.sin(t * 0.5 + q.f)) % 1400) + 1400) % 1400 - 160;
    const sy = (((q.y - c.y * q.p * 0.35 - t * 14 * q.p) % 2400) + 2400) % 2400 - 240;
    g.fillStyle = `rgba(200,235,255,${0.22 * q.p})`;
    g.beginPath(); g.arc(sx, sy, q.r * q.p, 0, TAU); g.fill();
  }
  g.restore();
  // burbujas que suben (en el hook pasan a toda velocidad)
  if (o.burbujas > 0) burbujas(g, c, t, o.burbujas);
}

function burbujas(g, c, t, al) {
  for (const q of BURBUJAS) {
    const sx = q.x + 20 * Math.sin(t * 3 + q.f);
    const sy = ((((q.y - t * q.v) - c.y * q.p * 0.9) % 4200) + 4200) % 4200 - 600;
    if (sy < -100 || sy > 2020) continue;
    const r = q.r * q.p;
    g.save(); g.globalAlpha *= al;
    const bg = g.createRadialGradient(sx - r * 0.3, sy - r * 0.35, r * 0.1, sx, sy, r);
    bg.addColorStop(0, "rgba(255,255,255,0.55)"); bg.addColorStop(0.6, "rgba(170,225,255,0.12)"); bg.addColorStop(1, "rgba(220,245,255,0.5)");
    g.fillStyle = bg; g.beginPath(); g.arc(sx, sy, r, 0, TAU); g.fill();
    g.strokeStyle = "rgba(230,250,255,0.7)"; g.lineWidth = Math.max(1.5, r * 0.08); g.stroke();
    g.restore();
  }
}

const azS = azar(31);
const PIEDRAS = Array.from({ length: 16 }, (_, i) => ({ x: -1600 + i * 230 + azS() * 120, r: 50 + azS() * 90, s: i * 3 + 5 }));
function suelo(g, c, t, yS) {
  const [, sy] = aPantalla(c, 0, yS);
  if (sy > 2000) return;
  const sg = g.createLinearGradient(0, sy - 40, 0, 1920);
  sg.addColorStop(0, "#c9b27c"); sg.addColorStop(0.25, "#9c8656"); sg.addColorStop(1, "#4a3c22");
  g.fillStyle = sg; g.beginPath(); g.moveTo(0, sy + 30);
  for (let x = 0; x <= 1080; x += 40) g.lineTo(x, sy + 22 * Math.sin((x + c.x * c.s) * 0.006));
  g.lineTo(1080, 1920); g.lineTo(0, 1920); g.closePath(); g.fill();
  // la luz del agua sobre la arena
  g.save(); g.beginPath(); g.rect(0, sy, 1080, 1920); g.clip();
  g.globalCompositeOperation = "screen"; g.globalAlpha = 0.32;
  g.drawImage(k.causticas, -300 - ((c.x * c.s * 0.8) % 600) + 30 * Math.sin(t * 0.7), sy - 100, 1800, 1400);
  g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.3; g.drawImage(k.manchas, -200 - ((c.x * c.s) % 400), sy, 1600, 1600);
  g.restore();
  // piedras redondas medio enterradas
  for (const p of PIEDRAS) {
    const [px, py] = aPantalla(c, p.x, yS + 20);
    const r = p.r * c.s;
    if (px < -r || px > 1080 + r) continue;
    const pg = g.createRadialGradient(px - r * 0.35, py - r * 0.5, r * 0.1, px, py, r);
    pg.addColorStop(0, "#8d9a8c"); pg.addColorStop(0.6, "#4d5a52"); pg.addColorStop(1, "#1f2823");
    g.fillStyle = pg; g.beginPath(); g.ellipse(px, py, r, r * 0.62, 0, Math.PI, TAU); g.closePath(); g.fill();
  }
}

// ---------------------------------------------------------------- el pulpo
// Coordenadas propias: el centro del manto en (0, -250), los ojos en y -60, los brazos salen de y ≈ 10 hacia abajo.
// En el mundo va en (x, y), con escala s y giro rot (radianes).
export const ANAT = {
  branquia: [[-118, -270], [118, -270]],
  corB: [[-100, -138], [100, -138]],
  corG: [0, -228],
};

const COL = { luz: "#ff9a6a", base: "#d4462a", sombra: "#6a140c" };

// Cada brazo, como una lista de puntos [x, y, ancho]. pose: { relax, nada, camina } (pesos que suman 1).
function brazo(i, t, pose, contrae) {
  const lado = i < 4 ? -1 : 1, d = i - 3.5;
  const bx = d * 30 * (1 - 0.35 * contrae), by = 6;
  const L = 560 * pose.relax + 640 * pose.nada + 520 * pose.camina;
  const pts = [];
  let x = bx, y = by;
  const n = 26;
  for (let j = 0; j <= n; j++) {
    const u = j / n;
    const aR = 90 - d * 19 - lado * 75 * Math.pow(u, 1.6) + 14 * Math.sin(u * 7 - t * 1.7 + i * 1.3);
    const aN = 90 - d * (4 + 14 * contrae) + 7 * Math.sin(u * 9 - t * 7 + i);
    const paso = Math.sin(t * 5.2 + i * 1.57);
    const aC = 90 - d * 13 - lado * mez(0, 70, su(tr(u, 0.45, 0.95))) + 16 * u * paso;
    const a = (aR * pose.relax + aN * pose.nada + aC * pose.camina) * Math.PI / 180;
    const w = 46 * Math.pow(1 - u, 0.85) + 3;
    pts.push([x, y, w]);
    x += Math.cos(a) * L / n; y += Math.sin(a) * L / n;
  }
  return pts;
}

function bordeBrazo(pts) {
  const izq = [], der = [];
  for (let j = 0; j < pts.length; j++) {
    const a = pts[Math.max(0, j - 1)], b = pts[Math.min(pts.length - 1, j + 1)];
    let nx = -(b[1] - a[1]), ny = b[0] - a[0];
    const l = Math.hypot(nx, ny) || 1; nx /= l; ny /= l;
    izq.push([pts[j][0] + nx * pts[j][2] / 2, pts[j][1] + ny * pts[j][2] / 2]);
    der.push([pts[j][0] - nx * pts[j][2] / 2, pts[j][1] - ny * pts[j][2] / 2]);
  }
  return { izq, der };
}

function dibujaBrazo(g, pts, atras) {
  const { izq, der } = bordeBrazo(pts);
  g.beginPath(); g.moveTo(izq[0][0], izq[0][1]);
  for (const p of izq) g.lineTo(p[0], p[1]);
  const pt = pts[pts.length - 1]; g.lineTo(pt[0], pt[1]);
  for (let j = der.length - 1; j >= 0; j--) g.lineTo(der[j][0], der[j][1]);
  g.closePath();
  const bg = g.createLinearGradient(-200, -100, 200, 500);
  bg.addColorStop(0, atras ? "#c4492c" : COL.luz); bg.addColorStop(0.5, atras ? "#8e2516" : COL.base); bg.addColorStop(1, atras ? "#4a0e08" : "#8e2516");
  g.fillStyle = bg; g.fill();
  // el borde de luz por un lado y las ventosas por el otro
  g.lineCap = "round"; g.lineJoin = "round";
  g.strokeStyle = atras ? "rgba(255,170,130,0.25)" : "rgba(255,200,160,0.55)"; g.lineWidth = 5;
  g.beginPath(); izq.forEach((p, j) => (j ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]))); g.stroke();
  for (let j = 2; j < der.length - 1; j++) {
    const r = pts[j][2] * 0.2;
    if (r < 1.5) continue;
    const x = mez(der[j][0], pts[j][0], 0.25), y = mez(der[j][1], pts[j][1], 0.25);
    g.fillStyle = atras ? "rgba(210,150,120,0.55)" : "#f4c7a6"; g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill();
    g.fillStyle = "rgba(120,40,30,0.55)"; g.beginPath(); g.arc(x, y, r * 0.45, 0, TAU); g.fill();
  }
}

function caminoCuerpo(g, contrae) {
  const w = 1 - 0.2 * contrae, h = 1 + 0.08 * contrae;
  g.beginPath();
  g.moveTo(-150, 20);
  g.bezierCurveTo(-178, -40, -150, -100, -168 * w, -170 * h);
  g.bezierCurveTo(-205 * w, -300 * h, -190 * w, -470 * h, 0, -520 * h);
  g.bezierCurveTo(190 * w, -470 * h, 205 * w, -300 * h, 168 * w, -170 * h);
  g.bezierCurveTo(150, -100, 178, -40, 150, 20);
  g.bezierCurveTo(90, 52, -90, 52, -150, 20);
  g.closePath();
}

const azP = azar(55);
const BULTOS = Array.from({ length: 60 }, () => ({ x: azP() * 340 - 170, y: -azP() * 520, r: 4 + azP() * 9 }));

function ojo(g, x, y, t, lado) {
  const og = g.createRadialGradient(x - 8, y - 12, 4, x, y, 42);
  og.addColorStop(0, "#ffb488"); og.addColorStop(1, "#a12d1a");
  g.fillStyle = og; g.beginPath(); g.ellipse(x, y, 42, 38, 0, 0, TAU); g.fill();
  g.fillStyle = "#f3d9a0"; g.beginPath(); g.ellipse(x, y + 4, 26, 22, 0, 0, TAU); g.fill();
  g.fillStyle = "#17090a"; g.beginPath(); g.ellipse(x + lado * 2, y + 4, 19, 6.5, 0, 0, TAU); g.fill();
  g.fillStyle = "rgba(255,255,255,0.85)"; g.beginPath(); g.arc(x - 9, y - 6, 6, 0, TAU); g.fill();
  // el párpado de arriba
  g.fillStyle = "#b8371f"; g.beginPath(); g.ellipse(x, y - 12, 44, 22, 0, Math.PI, TAU); g.fill();
}

// Un corazón: con volumen, brillo y su latido (b 0-1). on: 0 apagado (gris oscuro), 1 vivo.
export function corazon(g, x, y, r, b, on = 1, al = 1) {
  if (al <= 0.01) return;
  g.save(); g.globalAlpha *= al; g.translate(x, y); const s = 1 + 0.2 * b * on; g.scale(s, s);
  if (on > 0.02) k.brillo(g, 0, 0, r * 6, "255,70,140", (0.35 + 0.5 * b) * on);
  g.beginPath();
  g.moveTo(0, r * 0.95);
  g.bezierCurveTo(-r * 1.25, r * 0.15, -r * 1.05, -r * 0.95, -r * 0.42, -r * 0.92);
  g.bezierCurveTo(-r * 0.15, -r * 0.9, 0, -r * 0.65, 0, -r * 0.5);
  g.bezierCurveTo(0, -r * 0.65, r * 0.15, -r * 0.9, r * 0.42, -r * 0.92);
  g.bezierCurveTo(r * 1.05, -r * 0.95, r * 1.25, r * 0.15, 0, r * 0.95);
  g.closePath();
  const cg = g.createRadialGradient(-r * 0.4, -r * 0.45, r * 0.08, 0, 0, r * 1.2);
  cg.addColorStop(0, k.mezColor("#8a7f88", "#ffd0e4", on)); cg.addColorStop(0.45, k.mezColor("#4f4650", "#ff3d7f", on)); cg.addColorStop(1, k.mezColor("#1f1a20", "#7a0b35", on));
  g.fillStyle = cg; g.fill();
  g.save(); g.clip(); g.globalCompositeOperation = "multiply"; g.globalAlpha *= 0.4; g.drawImage(k.red, -r * 2, -r * 2, r * 4, r * 4); g.restore();
  g.fillStyle = "rgba(255,255,255,0.55)"; g.beginPath(); g.ellipse(-r * 0.45, -r * 0.5, r * 0.22, r * 0.13, -0.6, 0, TAU); g.fill();
  g.restore();
}

// Una branquia: tallo con hojitas como una pluma. vida: cuánto brilla la sangre en ella. lado -1/1.
function branquia(g, x, y, vida, t, lado) {
  g.save(); g.translate(x, y);
  g.lineCap = "round";
  for (let j = 0; j < 15; j++) {
    const yy = -100 + j * 15, lar = 52 * Math.sin(Math.PI * (j + 0.6) / 15.5);
    for (const s of [-1, 1]) {
      const mov = 4 * Math.sin(t * 3 + j * 0.7);
      g.strokeStyle = k.mezColor("#9a5a8a", "#64b8ff", vida); g.lineWidth = 9;
      g.beginPath(); g.moveTo(0, yy); g.quadraticCurveTo(s * lar * 0.6, yy - 6 + mov, s * lar, yy + 8 + mov); g.stroke();
      g.strokeStyle = `rgba(220,240,255,${0.35 + 0.4 * vida})`; g.lineWidth = 3;
      g.beginPath(); g.moveTo(0, yy - 2); g.quadraticCurveTo(s * lar * 0.6, yy - 8 + mov, s * lar * 0.9, yy + 4 + mov); g.stroke();
    }
  }
  g.strokeStyle = k.mezColor("#7d3b6d", "#2f8cff", vida); g.lineWidth = 12;
  g.beginPath(); g.moveTo(0, -110); g.lineTo(0, 115); g.stroke();
  if (vida > 0.02) k.brillo(g, 0, 0, 380, "90,170,255", 0.35 * vida);
  g.restore();
}

// Los vasos de la sangre. Devuelve los caminos (en coordenadas del pulpo) para el flujo.
function vasos(armas) {
  const [bL, bR] = ANAT.branquia, [cL, cR] = ANAT.corB, cG = ANAT.corG;
  const venas = [[[-34, 10], [-70, -60], [cL[0], cL[1] + 20]], [[34, 10], [70, -60], [cR[0], cR[1] + 20]]];
  const subeB = [[[cL[0], cL[1] - 20], [bL[0], bL[1] + 120]], [[cR[0], cR[1] - 20], [bR[0], bR[1] + 120]]];
  const dentroB = [[[bL[0], bL[1] + 110], [bL[0], bL[1] - 110]], [[bR[0], bR[1] + 110], [bR[0], bR[1] - 110]]];
  const aCorG = [[[bL[0], bL[1] - 110], [-70, -390], [cG[0] - 30, cG[1] - 30]], [[bR[0], bR[1] - 110], [70, -390], [cG[0] + 30, cG[1] - 30]]];
  const aorta = [[[cG[0], cG[1] + 40], [0, -100], [0, 0]]];
  const brazos = armas.map((p) => [[0, 0], ...p.slice(0, 24).map((q) => [q[0], q[1]])]);
  return { venas, subeB, dentroB, aCorG, aorta, brazos };
}

function trazo(g, pts, fase, al, ancho = 9, hasta = 1) {
  if (al <= 0.01) return;
  const n = Math.max(2, Math.ceil(pts.length * hasta));
  g.save(); g.lineCap = "round"; g.lineJoin = "round";
  const camino = () => {
    g.beginPath();
    if (pts.length === 3 && hasta >= 1) { g.moveTo(...pts[0]); g.quadraticCurveTo(...pts[1], ...pts[2]); }
    else { g.moveTo(...pts[0]); for (let j = 1; j < n; j++) g.lineTo(...pts[j]); }
  };
  camino(); g.strokeStyle = `rgba(20,70,170,${0.85 * al})`; g.lineWidth = ancho * 1.6; g.stroke();
  camino(); g.strokeStyle = `rgba(70,160,255,${0.95 * al})`; g.lineWidth = ancho; g.stroke();
  g.globalCompositeOperation = "lighter";
  camino(); g.setLineDash([ancho * 1.4, ancho * 2.6]); g.lineDashOffset = -fase; g.strokeStyle = `rgba(200,235,255,${0.9 * al})`; g.lineWidth = ancho * 0.7; g.stroke();
  g.restore();
}

// El pulpo entero.
// o = { x, y, s, rot, pose {relax,nada,camina}, contrae (0-1, el manto se aprieta al nadar), ver (0-1, transparente),
//       lat: { b: [izq, der, grande] (0-1 latido), on: [izq, der, grande] (0-1 encendido), al: 0-1 (se ven) },
//       sangre: { fase, al, branquias (vida 0-1), brazos (hasta dónde llega 0-1), lento (0-1, apagada) }, sinOjos }
const capaA = k.lienzo(1080, 1920), capaB = k.lienzo(1080, 1920);
export function pulpo(g, c, t, o) {
  const pose = o.pose || { relax: 1, nada: 0, camina: 0 }, contrae = o.contrae || 0, ver = o.ver || 0;
  const arms = Array.from({ length: 8 }, (_, i) => brazo(i, t, pose, contrae));
  const ponCam = (q) => { q.setTransform(1, 0, 0, 1, 0, 0); enCam(q, c); q.translate(o.x, o.y); q.rotate(o.rot || 0); q.scale(o.s, o.s); };
  // el cuerpo, en una capa aparte (para hacerlo transparente entero)
  const A = capaA.getContext("2d");
  A.setTransform(1, 0, 0, 1, 0, 0); A.clearRect(0, 0, 1080, 1920);
  A.save(); ponCam(A);
  for (const i of [1, 3, 6, 4]) dibujaBrazo(A, arms[i], true);
  // la membrana entre los brazos
  A.fillStyle = "#9b2c18"; A.beginPath(); A.moveTo(-150, 0);
  for (const i of [0, 2, 5, 7]) { const p = arms[i][5]; A.lineTo(p[0], p[1]); }
  A.lineTo(150, 0); A.closePath(); A.fill();
  for (const i of [0, 7, 2, 5]) dibujaBrazo(A, arms[i], false);
  caminoCuerpo(A, contrae);
  const cg = A.createRadialGradient(-80, -400, 20, 0, -230, 420);
  cg.addColorStop(0, "#ffb084"); cg.addColorStop(0.35, COL.base); cg.addColorStop(0.8, "#8e2516"); cg.addColorStop(1, COL.sombra);
  A.fillStyle = cg; A.fill();
  A.save(); A.clip();
  A.globalCompositeOperation = "multiply"; A.globalAlpha = 0.45; A.drawImage(k.manchas, -320, -620, 640, 700);
  A.globalCompositeOperation = "source-over"; A.globalAlpha = 1;
  for (const b of BULTOS) {
    const bg = A.createRadialGradient(b.x - b.r * 0.3, b.y - b.r * 0.3, 1, b.x, b.y, b.r);
    bg.addColorStop(0, "rgba(255,190,150,0.7)"); bg.addColorStop(1, "rgba(120,30,20,0)");
    A.fillStyle = bg; A.beginPath(); A.arc(b.x, b.y, b.r, 0, TAU); A.fill();
  }
  // brillo húmedo
  A.fillStyle = "rgba(255,235,220,0.35)"; A.beginPath(); A.ellipse(-70, -410, 55, 26, -0.6, 0, TAU); A.fill();
  A.restore();
  if (!o.sinOjos) { ojo(A, -98, -62, t, -1); ojo(A, 98, -62, t, 1); }
  A.restore();
  g.drawImage(capaA, 0, 0);

  if (ver <= 0.01) return;
  // transparente: el cuerpo se oscurece en azul (como una radiografía) y se ve lo de dentro
  const B = capaB.getContext("2d");
  B.setTransform(1, 0, 0, 1, 0, 0); B.clearRect(0, 0, 1080, 1920);
  B.globalCompositeOperation = "source-over"; B.drawImage(capaA, 0, 0);
  B.globalCompositeOperation = "source-in"; B.fillStyle = "rgba(14,24,58,1)"; B.fillRect(0, 0, 1080, 1920);
  B.globalCompositeOperation = "source-over";
  g.save(); g.globalAlpha *= 0.6 * ver; g.drawImage(capaB, 0, 0); g.restore();
  // el contorno, con luz
  g.save(); ponCam(g); g.globalAlpha *= ver;
  caminoCuerpo(g, contrae); g.strokeStyle = "rgba(255,150,120,0.55)"; g.lineWidth = 6 / o.s; g.stroke();
  const L = o.lat || { b: [0, 0, 0], on: [1, 1, 1], al: 1 }, S = o.sangre || { fase: 0, al: 1, branquias: 1, brazos: 1, lento: 0 };
  const V = vasos(arms);
  const vida = (S.branquias ?? 1) * (1 - 0.6 * (S.lento || 0));
  const alS = (S.al ?? 1) * (1 - 0.45 * (S.lento || 0));
  branquia(g, ANAT.branquia[0][0], ANAT.branquia[0][1], vida, t, -1);
  branquia(g, ANAT.branquia[1][0], ANAT.branquia[1][1], vida, t, 1);
  const f = S.fase || 0;
  for (const p of V.venas) trazo(g, p, f, alS, 10);
  for (const p of V.subeB) trazo(g, p, f, alS, 10);
  for (const p of V.aCorG) trazo(g, p, f, alS * (S.salida ?? 1), 10);
  for (const p of V.aorta) trazo(g, p, f, alS * (S.salida ?? 1), 13);
  const hasta = S.brazos ?? 1;
  if (hasta > 0.02) for (const p of V.brazos) trazo(g, p, f, alS * (S.salida ?? 1), 7, hasta);
  // los tres corazones
  const alC = L.al ?? 1;
  corazon(g, ANAT.corB[0][0], ANAT.corB[0][1], 34, L.b[0], L.on[0], alC);
  corazon(g, ANAT.corB[1][0], ANAT.corB[1][1], 34, L.b[1], L.on[1], alC);
  corazon(g, ANAT.corG[0], ANAT.corG[1], 62, L.b[2], L.on[2], alC);
  g.restore();
}
