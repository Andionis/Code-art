// Lo que comparten los planos: el valle al atardecer con el balancín, la cucharita con su luz azul y la montaña (el
// hook y el final).
import * as k from "#kit";
import { v } from "#voz";

const { mez, azar } = k;

// ---------------------------------------------------------------- el balancín
// Pivote, medio largo del brazo y ángulo (positivo: baja el lado derecho, el de la montaña).
// Como una palanca: el brazo de la cucharita (izquierda) es más largo que el de la montaña.
export const PIV = [610, 1210], BI = 430, BD = 250;

// ---------------------------------------------------------------- el valle (fondo fijo, se dibuja una vez)
const SUELO = 1395;
let valleHecho = null;
function hacerValle() {
  const l = k.lienzo(1680, 1920), g = l.getContext("2d");
  g.translate(300, 0);
  // el cielo del atardecer
  const cg = g.createLinearGradient(0, 0, 0, SUELO);
  cg.addColorStop(0, "#0d0b2a"); cg.addColorStop(0.35, "#2c1955"); cg.addColorStop(0.62, "#7a2f6e"); cg.addColorStop(0.83, "#e0604f"); cg.addColorStop(1, "#ffb067");
  g.fillStyle = cg; g.fillRect(-300, 0, 1680, SUELO);
  // el sol que se pone, detrás de las montañas lejanas
  const sg = g.createRadialGradient(250, SUELO - 120, 0, 250, SUELO - 120, 520);
  sg.addColorStop(0, "rgba(255,236,190,0.95)"); sg.addColorStop(0.12, "rgba(255,190,120,0.6)"); sg.addColorStop(1, "rgba(255,120,80,0)");
  g.fillStyle = sg; g.fillRect(-300, 0, 1680, SUELO);
  // estrellas arriba
  const az = azar(31);
  for (let i = 0; i < 400; i++) {
    const y = Math.pow(az(), 1.8) * 900, x = -300 + az() * 1680, r = 0.6 + az() * 1.6;
    g.fillStyle = `rgba(255,255,255,${(0.25 + az() * 0.6) * (1 - y / 900)})`; g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill();
  }
  // dos filas de montañas lejanas, violetas
  const fila = (y0, alto, sem, c1, c2) => {
    const a = azar(sem); g.beginPath(); g.moveTo(-300, SUELO);
    let x = -340; g.lineTo(x, y0);
    while (x < 1420) { const w = 90 + a() * 160; g.lineTo(x + w / 2, y0 - alto * (0.4 + a() * 0.6)); x += w; g.lineTo(x, y0 - a() * alto * 0.25); }
    g.lineTo(1380, SUELO); g.closePath();
    const fg = g.createLinearGradient(0, y0 - alto, 0, SUELO); fg.addColorStop(0, c1); fg.addColorStop(1, c2);
    g.fillStyle = fg; g.fill();
  };
  fila(SUELO - 40, 230, 7, "#8a4a86", "#5a2c5e");
  fila(SUELO - 5, 150, 9, "#4e2550", "#2c1430");
  // el suelo del valle: hierba oscura con la luz del atardecer
  const tg = g.createLinearGradient(0, SUELO, 0, 1920);
  tg.addColorStop(0, "#3d2a3a"); tg.addColorStop(0.15, "#2a2030"); tg.addColorStop(1, "#0c0a12");
  g.fillStyle = tg; g.fillRect(-300, SUELO, 1680, 1920 - SUELO);
  g.save(); g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.5; g.drawImage(k.manchas, -300, SUELO, 1680, 600); g.restore();
  const bg = g.createRadialGradient(250, SUELO, 0, 250, SUELO, 700);
  bg.addColorStop(0, "rgba(255,150,90,0.35)"); bg.addColorStop(1, "rgba(255,150,90,0)");
  g.fillStyle = bg; g.fillRect(-300, SUELO, 1680, 600);
  return k.fijar(l);
}
export function valle(g) { valleHecho ??= hacerValle(); g.drawImage(valleHecho, -300, 0); }

// ---------------------------------------------------------------- la montaña (dibujada una vez, 440 × 420)
let montHecha = null;
function hacerMontana() {
  const W = 400, H = 420, l = k.lienzo(W, H), g = l.getContext("2d");
  const pico = [[0, H], [30, 310], [80, 250], [125, 150], [168, 70], [202, 8], [240, 62], [274, 120], [310, 175], [340, 245], [372, 300], [W, H]];
  const camino = () => { g.beginPath(); pico.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.closePath(); };
  camino(); g.save(); g.clip();
  // roca: luz del atardecer por la izquierda, sombra violeta a la derecha
  const rg = g.createLinearGradient(0, 0, W, 0);
  rg.addColorStop(0, "#c27a5e"); rg.addColorStop(0.45, "#8a5a50"); rg.addColorStop(0.55, "#4c3546"); rg.addColorStop(1, "#2a1d2c");
  g.fillStyle = rg; g.fillRect(0, 0, W, H);
  g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.55; g.drawImage(k.red, 0, 0, W * 1.4, H * 1.4); g.globalAlpha = 0.5; g.drawImage(k.manchas, -40, 0, W + 80, H);
  g.globalCompositeOperation = "source-over"; g.globalAlpha = 1;
  // la arista del medio, con su luz
  g.strokeStyle = "rgba(255,190,150,0.35)"; g.lineWidth = 5; g.beginPath(); g.moveTo(202, 8); g.lineTo(195, 120); g.lineTo(212, 210); g.lineTo(200, 330); g.stroke();
  // la nieve de arriba
  g.beginPath(); g.moveTo(125, 150); g.lineTo(168, 70); g.lineTo(202, 8); g.lineTo(240, 62); g.lineTo(274, 120);
  g.lineTo(258, 135); g.lineTo(240, 118); g.lineTo(224, 150); g.lineTo(202, 128); g.lineTo(186, 165); g.lineTo(164, 140); g.lineTo(144, 170); g.closePath();
  const ng = g.createLinearGradient(125, 0, 274, 0); ng.addColorStop(0, "#fff4ec"); ng.addColorStop(0.5, "#f3e4ea"); ng.addColorStop(0.55, "#b9a8cc"); ng.addColorStop(1, "#8a7aa6");
  g.fillStyle = ng; g.fill();
  // pinos al pie
  const a = azar(3);
  for (let i = 0; i < 40; i++) {
    const x = 20 + a() * 360, y = 340 + a() * 80, h = 22 + a() * 26;
    g.fillStyle = a() < 0.5 ? "#1f3a2e" : "#173026"; g.beginPath(); g.moveTo(x, y - h); g.lineTo(x - h * 0.32, y); g.lineTo(x + h * 0.32, y); g.closePath(); g.fill();
  }
  g.restore();
  return k.fijar(l);
}
// La montaña con su base en (x, y), girada ang y escalada s.
export function montana(g, x, y, ang = 0, s = 1) {
  montHecha ??= hacerMontana();
  g.save(); g.translate(x, y); g.rotate(ang); g.scale(s, s);
  g.drawImage(montHecha, -200, -420, 400, 420);
  g.restore();
}

// ---------------------------------------------------------------- la cucharita con la estrella de neutrones
// Una cucharita de metal de perfil, con el cuenco en (x, y), girada ang, escala s, y su puñito de luz azul que late
// (brillo 0 a 1). El mango sale hacia la izquierda.
export function cuchara(g, x, y, ang, s, t, brilla = 0) {
  g.save(); g.translate(x, y); g.rotate(ang); g.scale(s, s);
  // el resplandor azul detrás
  k.brillo(g, 0, -20, 460 + 160 * brilla, "azul", 0.7 + 0.3 * brilla);
  // la sombra que deja en el plato
  g.fillStyle = "rgba(0,0,0,0.3)"; g.beginPath(); g.ellipse(-40, 40, 150, 10, 0, 0, Math.PI * 2); g.fill();
  // el mango, vista un poco desde arriba: se estrecha y acaba en su óvalo
  g.beginPath(); g.moveTo(-62, -8); g.quadraticCurveTo(-140, -14, -205, -30); g.bezierCurveTo(-230, -48, -262, -40, -256, -22);
  g.bezierCurveTo(-252, -8, -230, -4, -205, -14); g.quadraticCurveTo(-140, 6, -62, 12); g.closePath();
  k.metal(g, -260, -60, ["#6c7380", "#eef2f7", "#9aa3b0", "#ffffff", "#5a606a"]);
  // el cuenco, por fuera
  g.beginPath(); g.ellipse(0, 0, 76, 46, 0, 0, Math.PI * 2);
  const cg = g.createLinearGradient(0, -46, 0, 46); cg.addColorStop(0, "#ffffff"); cg.addColorStop(0.45, "#b8c0cc"); cg.addColorStop(1, "#555c67");
  g.fillStyle = cg; g.fill();
  // por dentro, oscuro, y lleno de la estrella de neutrones: una montañita de luz azul que hierve y asoma del borde
  g.beginPath(); g.ellipse(0, -6, 66, 34, 0, 0, Math.PI * 2); g.fillStyle = "#2b3140"; g.fill();
  g.save();
  g.beginPath(); g.ellipse(0, -6, 64, 32, 0, 0, Math.PI); g.moveTo(64, -6); g.bezierCurveTo(56, -48, 30, -62, 0, -62); g.bezierCurveTo(-30, -62, -56, -48, -64, -6); g.closePath(); g.clip();
  k.estrella(g, "azul", 0, 2, 66, t * 0.6, 0.5 + 0.5 * brilla);
  g.restore();
  // el borde de delante del cuenco, brillante
  g.beginPath(); g.ellipse(0, -6, 67, 35, 0, 0.15, Math.PI - 0.15);
  g.strokeStyle = "rgba(245,248,255,0.95)"; g.lineWidth = 5; g.stroke();
  k.brillo(g, 0, -30, 180, "blanca", 0.45 + 0.45 * brilla);
  g.restore();
}

// ---------------------------------------------------------------- el balancín entero
// ang: inclinación. alzaMontana: lo que la montaña se separa de su plato (px, hacia arriba), giroM: su giro.
// cuch: { x, y, ang } de la cucharita si no está en su plato (cayendo); si es null, está en el plato.
export const CUCH_ESC = 1.3, CUCH_ALTO = 34 + 44 * 1.3;
export function balancin(g, t, ang, { alzaMontana = 0, giroM = 0, cuch = null, brilla = 0 } = {}) {
  const [px, py] = PIV;
  // la sombra en el suelo
  g.save(); g.fillStyle = "rgba(0,0,0,0.35)"; g.beginPath(); g.ellipse(px - 90, SUELO + 30, 470, 26, 0, 0, Math.PI * 2); g.fill(); g.restore();
  // el pie de piedra
  g.beginPath(); g.moveTo(px, py - 10); g.lineTo(px - 120, SUELO + 34); g.lineTo(px + 120, SUELO + 34); g.closePath();
  const pg = g.createLinearGradient(px - 120, 0, px + 120, 0); pg.addColorStop(0, "#9b7d74"); pg.addColorStop(0.5, "#5d4752"); pg.addColorStop(1, "#2c2130");
  g.fillStyle = pg; g.fill();
  g.save(); g.clip(); g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.5; g.drawImage(k.red, px - 200, py - 40, 400, 400); g.restore();
  // el brazo de metal, con sus dos platos
  g.save(); g.translate(px, py); g.rotate(ang);
  k.redondo(g, -BI - 30, -16, BI + BD + 60, 32, 14); k.metal(g, -BI, BD, ["#4a4f58", "#c9ced6", "#7d848f", "#e6e9ee", "#3e434b"]);
  for (const [cx, w] of [[-BI, 260], [BD, 300]]) {
    k.redondo(g, cx - w / 2, -34, w, 20, 10); k.metal(g, cx - w / 2, cx + w / 2, ["#5c616b", "#e8ebf0", "#8f96a1", "#f6f7f9", "#4b5058"]);
    k.redondo(g, cx - 12, -16, 24, 20, 4); g.fillStyle = "#3a3e45"; g.fill();
  }
  // la montaña sobre su plato (a la derecha)
  g.save(); g.translate(BD, -34 - alzaMontana); g.rotate(giroM); montana(g, 0, 0, 0, 1.05); g.restore();
  // la cucharita en su plato (a la izquierda)
  if (!cuch) cuchara(g, -BI + 30, -CUCH_ALTO, 0, CUCH_ESC, t, brilla);
  g.restore();
  // el eje
  g.beginPath(); g.arc(px, py, 22, 0, Math.PI * 2); k.metal(g, px - 22, px + 22);
  if (cuch) cuchara(g, cuch.x, cuch.y, cuch.ang, CUCH_ESC, t, brilla);
}
export { SUELO };

// ---------------------------------------------------------------- los átomos
// Una partícula del núcleo: una bolita con luz (protón rojo, neutrón gris azulado).
const TONOS = { p: ["#ffb0a0", "#ff4a36", "#8a160c"], n: ["#eef2fa", "#8f9bb4", "#2e3648"] };
export function particula(g, x, y, r, tipo = "p") {
  if (r < 0.4) return;
  const c = TONOS[tipo], gr = g.createRadialGradient(x - r * 0.35, y - r * 0.4, r * 0.05, x, y, r);
  gr.addColorStop(0, c[0]); gr.addColorStop(0.55, c[1]); gr.addColorStop(1, c[2]);
  g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill();
}
// El núcleo: un racimo de protones y neutrones de radio rn. neutro (0 a 1): cuántos protones se han vuelto neutrones.
const RACIMO = (() => { const a = azar(5), l = []; for (let i = 0; i < 12; i++) { const an = i * 2.4, d = Math.sqrt(i / 12) * 0.62; l.push([Math.cos(an) * d, Math.sin(an) * d, a() < 0.5 ? "p" : "n", a()]); } return l; })();
export function nucleo(g, x, y, rn, neutro = 0) {
  k.brillo(g, x, y, rn * 6, "roja", 0.5 * (1 - neutro));
  k.brillo(g, x, y, rn * 5, "azul", 0.35 * neutro);
  for (const [dx, dy, tipo, u] of RACIMO) particula(g, x + dx * rn, y + dy * rn, rn * 0.42, tipo === "p" && u > neutro ? "p" : "n");
}
// Un átomo de radio R en (x, y): su nube azul de electrones, tres órbitas y sus electrones girando, y el núcleo en el
// centro (radio R·ratio). sem: para que cada átomo gire distinto. cae (0 a 1): los electrones caen al núcleo en espiral.
export function atomo(g, x, y, R, t, sem = 0, { ratio = 0.13, cae = 0, neutro = 0, al = 1 } = {}) {
  if (R < 2 || al <= 0.01) return;
  const A = g.globalAlpha; g.save(); g.globalAlpha = A * al;
  const Re = R * (1 - cae);
  if (Re > 1) {
    const ng = g.createRadialGradient(x, y, 0, x, y, Re);
    ng.addColorStop(0, "rgba(90,150,255,0.10)"); ng.addColorStop(0.7, "rgba(70,130,255,0.16)"); ng.addColorStop(0.95, "rgba(110,180,255,0.22)"); ng.addColorStop(1, "rgba(110,180,255,0)");
    g.fillStyle = ng; g.beginPath(); g.arc(x, y, Re, 0, Math.PI * 2); g.fill();
  }
  for (let i = 0; i < 3; i++) {
    const rot = sem * 1.7 + i * (Math.PI / 3), ra = Re * 0.92, rb = Re * 0.34;
    if (ra > 3) { g.strokeStyle = `rgba(150,205,255,${0.28 * (1 - cae)})`; g.lineWidth = Math.max(1, R / 160); g.beginPath(); g.ellipse(x, y, ra, rb, rot, 0, Math.PI * 1.98); g.stroke(); }
    const fa = t * (2.2 + i * 0.4) + sem * 3 + i * 2.1 + cae * 9;
    const ex = Math.cos(fa) * ra, ey = Math.sin(fa) * rb;
    const px = x + ex * Math.cos(rot) - ey * Math.sin(rot), py = y + ex * Math.sin(rot) + ey * Math.cos(rot);
    k.brillo(g, px, py, Math.max(10, R * 0.16), "cian", 1);
  }
  nucleo(g, x, y, Math.max(1.2, R * ratio), neutro);
  g.restore();
}
