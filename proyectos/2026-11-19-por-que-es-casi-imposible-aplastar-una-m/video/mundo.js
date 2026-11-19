// Lo que comparten los planos de este vídeo: la cocina, la mesa, la mosca (de lado y desde arriba) y la mano.
import * as k from "#kit";

const { azar, mez, redondo } = k;
const TAU = Math.PI * 2;

// ---------------------------------------------------------------------------------------------------------------
// La cocina: pared cálida desenfocada, la ventana con luz y la mesa de madera de lado (horizonte en yh).
// ---------------------------------------------------------------------------------------------------------------
const azC = azar(707);
const BOKEH = Array.from({ length: 22 }, () => ({ x: azC() * 1080, y: 150 + azC() * 900, r: 40 + azC() * 120, c: ["255,214,150", "255,180,110", "190,225,255", "255,240,210"][Math.floor(azC() * 4)], a: 0.08 + azC() * 0.14 }));
const vetas = (() => {
  const az = azar(99), l = k.lienzo(1080, 900), c = l.getContext("2d");
  const fg = c.createLinearGradient(0, 0, 0, 900); fg.addColorStop(0, "#c98a52"); fg.addColorStop(1, "#7a4626");
  c.fillStyle = fg; c.fillRect(0, 0, 1080, 900);
  for (let i = 0; i < 140; i++) {
    const y = az() * 900, a = 0.05 + az() * 0.12, w = 1 + az() * 3;
    c.strokeStyle = `rgba(70,32,12,${a})`; c.lineWidth = w; c.beginPath();
    for (let x = -20; x <= 1100; x += 40) c.lineTo(x, y + Math.sin(x * 0.006 + i) * (6 + az() * 10) + Math.sin(x * 0.02 + i * 3) * 2);
    c.stroke();
  }
  for (let i = 0; i < 6; i++) { const y = 150 * i + 40; c.strokeStyle = "rgba(40,18,6,0.35)"; c.lineWidth = 3; c.beginPath(); c.moveTo(0, y); c.lineTo(1080, y); c.stroke(); }
    return k.fijar(l);
})();

export function cocina(g, yh = 1150, luz = 1) {
  const wg = g.createLinearGradient(0, 0, 0, yh);
  wg.addColorStop(0, "#2a1c16"); wg.addColorStop(0.6, "#5a3a26"); wg.addColorStop(1, "#7a5236");
  g.fillStyle = wg; g.fillRect(0, 0, 1080, yh + 2);
  // la ventana, desenfocada, arriba a la izquierda
  k.brillo(g, 230, 520, 1100, "255,226,170", 0.55 * luz);
  g.save(); g.globalCompositeOperation = "lighter";
  for (const b of BOKEH) { if (b.y > yh) continue; const gr = g.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r); gr.addColorStop(0, `rgba(${b.c},${b.a * luz})`); gr.addColorStop(0.75, `rgba(${b.c},${b.a * 0.6 * luz})`); gr.addColorStop(1, `rgba(${b.c},0)`); g.fillStyle = gr; g.beginPath(); g.arc(b.x, b.y, b.r, 0, TAU); g.fill(); }
  g.restore();
  // la mesa, en perspectiva: de la línea yh hacia abajo
  g.save(); g.beginPath(); g.rect(0, yh, 1080, 1920 - yh); g.clip();
  const H = 1920 - yh;
  for (let i = 0; i < 40; i++) {
    const v0 = i / 40, v1 = (i + 1) / 40, y0 = yh + H * Math.pow(v0, 1.6), y1 = yh + H * Math.pow(v1, 1.6);
    g.drawImage(vetas, 0, v0 * 900, 1080, 900 / 40, 0, y0, 1080, y1 - y0 + 1);
  }
  const sg = g.createLinearGradient(0, yh, 0, 1920); sg.addColorStop(0, "rgba(255,220,170,0.35)"); sg.addColorStop(0.25, "rgba(255,220,170,0.05)"); sg.addColorStop(1, "rgba(0,0,0,0.45)");
  g.fillStyle = sg; g.fillRect(0, yh, 1080, H);
  // el reflejo de la ventana en la madera
  const rg = g.createRadialGradient(260, yh + 120, 10, 260, yh + 120, 500); rg.addColorStop(0, `rgba(255,236,200,${0.35 * luz})`); rg.addColorStop(1, "rgba(255,236,200,0)");
  g.fillStyle = rg; g.fillRect(0, yh, 1080, H);
  g.restore();
  // el canto de la mesa
  g.fillStyle = "rgba(255,230,190,0.25)"; g.fillRect(0, yh - 2, 1080, 4);
}

// ---------------------------------------------------------------------------------------------------------------
// La mosca, de lado, mirando a la derecha. (x, y): el punto de la mesa bajo su cuerpo; S: su largo en píxeles.
// o: { frota (0-1, se frota las patas de delante), alas (0 quietas · 1 batiendo), aire (0-1, patas colgando),
//      inclina (radianes, se echa hacia atrás), agacha (0-1, recoge las patas del medio para saltar), t, al }
// ---------------------------------------------------------------------------------------------------------------
const azM = azar(4242);
const PELOS_T = Array.from({ length: 70 }, () => { const a = azM() * Math.PI - Math.PI * 0.95; return { a, r: 0.95 + azM() * 0.1, l: 0.012 + azM() * 0.022 }; });
const PELOS_A = Array.from({ length: 60 }, () => { const a = azM() * TAU; return { a, r: 0.97 + azM() * 0.05, l: 0.01 + azM() * 0.018 }; });
export const FACETAS = (() => {
  const l = k.lienzo(256), c = l.getContext("2d");
  c.fillStyle = "#000"; c.fillRect(0, 0, 256, 256);
  c.strokeStyle = "rgba(255,255,255,0.55)"; c.lineWidth = 1.2;
  const r = 7, h = r * Math.sqrt(3);
  for (let j = -1; j < 256 / h + 1; j++) for (let i = -1; i < 256 / (r * 1.5) + 1; i++) {
    const cx = i * r * 1.5, cy = j * h + (i % 2 ? h / 2 : 0);
    c.beginPath(); for (let s = 0; s < 6; s++) { const a = (s * Math.PI) / 3; c.lineTo(cx + r * Math.cos(a), cy + r * Math.sin(a)); } c.closePath(); c.stroke();
  }
  return k.fijar(l);
})();

function pata(g, puntos, grosor, color) {
  g.strokeStyle = color; g.lineCap = "round"; g.lineJoin = "round";
  for (let i = 0; i < puntos.length - 1; i++) {
    g.lineWidth = grosor * (1 - i * 0.22);
    g.beginPath(); g.moveTo(puntos[i][0], puntos[i][1]); g.lineTo(puntos[i + 1][0], puntos[i + 1][1]); g.stroke();
  }
  // pelitos
  g.lineWidth = grosor * 0.18;
  for (let i = 0; i < puntos.length - 1; i++) {
    const [ax, ay] = puntos[i], [bx, by] = puntos[i + 1], dx = bx - ax, dy = by - ay, L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L;
    for (let s = 0.15; s < 1; s += 0.2) { const px = ax + dx * s, py = ay + dy * s; g.beginPath(); g.moveTo(px, py); g.lineTo(px + nx * 0.011 + dx / L * 0.008, py + ny * 0.011 + dy / L * 0.008); g.stroke(); }
  }
}
// una pata de tres tramos: del cuerpo (a) a la rodilla, al tobillo, al pie
const P3 = (a, b, c, d) => [a, b, c, d];

function ala(g, ang, al, batir) {
  g.save(); g.translate(0.02, -0.11); g.rotate(ang);
  g.beginPath(); g.moveTo(0, 0);
  g.bezierCurveTo(-0.12, -0.09, -0.42, -0.1, -0.56, -0.03);
  g.bezierCurveTo(-0.6, 0.0, -0.5, 0.05, -0.36, 0.05);
  g.bezierCurveTo(-0.2, 0.05, -0.08, 0.03, 0, 0); g.closePath();
  const wg = g.createLinearGradient(0, -0.1, -0.56, 0.05);
  wg.addColorStop(0, `rgba(210,225,240,${0.42 * al})`); wg.addColorStop(0.45, `rgba(190,220,255,${0.22 * al})`); wg.addColorStop(0.7, `rgba(230,200,255,${0.26 * al})`); wg.addColorStop(1, `rgba(200,255,230,${0.18 * al})`);
  g.fillStyle = wg; g.fill();
  g.strokeStyle = `rgba(40,36,40,${0.55 * al})`; g.lineWidth = 0.006; g.stroke();
  if (!batir) {
    g.lineWidth = 0.005; g.strokeStyle = `rgba(30,28,30,${0.6 * al})`;
    const V = [[-0.02, -0.035, -0.5, -0.055], [-0.03, -0.01, -0.54, -0.01], [-0.06, 0.01, -0.45, 0.04], [-0.1, 0.025, -0.33, 0.05]];
    for (const [a, b, c, d] of V) { g.beginPath(); g.moveTo(a, b); g.quadraticCurveTo((a + c) / 2, (b + d) / 2 - 0.02, c, d); g.stroke(); }
    g.beginPath(); g.moveTo(-0.3, -0.07); g.lineTo(-0.28, 0.0); g.moveTo(-0.2, -0.05); g.lineTo(-0.2, 0.03); g.stroke();
    // el brillo tornasol
    g.globalCompositeOperation = "lighter";
    const ig = g.createLinearGradient(-0.1, -0.08, -0.45, 0.04); ig.addColorStop(0, "rgba(255,255,255,0)"); ig.addColorStop(0.5, `rgba(255,255,255,${0.25 * al})`); ig.addColorStop(0.6, "rgba(255,255,255,0)");
    g.fillStyle = ig; g.beginPath(); g.moveTo(0, 0); g.bezierCurveTo(-0.12, -0.09, -0.42, -0.1, -0.56, -0.03); g.bezierCurveTo(-0.6, 0.0, -0.5, 0.05, -0.36, 0.05); g.bezierCurveTo(-0.2, 0.05, -0.08, 0.03, 0, 0); g.fill();
  }
  g.restore();
}

export function mosca(g, x, y, S, o = {}) {
  const { frota = 0, alas = 0, aire = 0, inclina = 0, agacha = 0, t = 0, al = 1, sombra = 1, suelo = null, camina = 0 } = o;
  if (al <= 0.003) return;
  g.save(); g.translate(x, y);
  // la sombra en la mesa
  if (sombra > 0) {
    const dy = suelo == null ? 0 : suelo - y, sa = sombra * Math.max(0.15, 1 - dy / 700);
    g.save(); g.translate(0, dy); g.scale(1 + dy / 900, 0.18); const sg = g.createRadialGradient(0, 0, 0, 0, 0, S * 0.5); sg.addColorStop(0, `rgba(20,8,2,${0.55 * sa * al})`); sg.addColorStop(1, "rgba(20,8,2,0)");
    g.fillStyle = sg; g.beginPath(); g.arc(0, 0, S * 0.55, 0, TAU); g.fill(); g.restore();
  }
  g.scale(S, S); g.globalAlpha *= al;
  // el cuerpo, a la altura de las patas
  const alto = 0.26 - 0.06 * agacha;
  // patas (en coordenadas de la mesa, sin inclinar el cuerpo): pie en y = 0
  const cuerpoY = -alto;
  const bob = Math.sin(t * 9) * 0.004 * (1 - aire);
  const fr = frota * (1 - aire), ph = Math.sin(t * 14);
  const col = (lejos) => (lejos ? "#151214" : "#2a2426");
  const ins = (dx, dy) => { const c = Math.cos(inclina), s = Math.sin(inclina); return [dx * c - dy * s, cuerpoY + bob + dx * s + dy * c]; };
  const colgar = (p, q) => [mez(p[0], q[0], aire), mez(p[1], q[1], aire)];
  const patas = (lejos) => {
    const d = lejos ? -0.035 : 0, gro = lejos ? 0.019 : 0.022;
    // al caminar: trípode (delante y detrás de un lado con el medio del otro)
    const paso = (i, p) => { const f = t * 11 + (i % 2) * Math.PI + (lejos ? Math.PI : 0); return [p[0] + 0.045 * camina * Math.sin(f), p[1] - 0.03 * camina * Math.max(0, Math.cos(f))]; };
    const rod = (i, p) => [p[0] + 0.02 * camina * Math.sin(t * 11 + (i % 2) * Math.PI + (lejos ? Math.PI : 0)), p[1]];
    // delante: si se frota, las dos patas suben hacia la cabeza
    const a1 = ins(0.13 + d, 0.08);
    const n1 = [mez(0.27, 0.36, fr) + d, mez(-0.06, -0.12, fr) + (lejos ? 0 : ph * 0.015 * fr)];
    const t1 = [mez(0.31, 0.41, fr) + d, mez(-0.0, -0.03, fr) + (lejos ? ph * 0.02 * fr : 0)];
    const f1 = [mez(0.39, 0.43, fr) + d, mez(0, 0.04, fr) + (lejos ? -ph * 0.015 * fr : ph * 0.02 * fr)];
    pata(g, P3(a1, colgar(rod(0, n1), [0.2, cuerpoY + 0.18]), colgar(paso(0, t1), [0.24, cuerpoY + 0.3]), colgar(paso(0, f1), [0.26, cuerpoY + 0.36])), gro, col(lejos));
    // medio: recoge para saltar
    const a2 = ins(0.05 + d, 0.1);
    pata(g, P3(a2, colgar(rod(1, [0.09 + d, mez(-0.13, -0.06, agacha)]), [0.06, cuerpoY + 0.2]), colgar(paso(1, [0.06 + d, 0]), [0.02, cuerpoY + 0.32]), colgar(paso(1, [-0.02 + d, 0]), [0.0, cuerpoY + 0.38])), gro, col(lejos));
    // detrás
    const a3 = ins(-0.03 + d, 0.1);
    pata(g, P3(a3, colgar(rod(2, [-0.17 + d, -0.15]), [-0.08, cuerpoY + 0.2]), colgar(paso(2, [-0.22 + d, 0]), [-0.12, cuerpoY + 0.32]), colgar(paso(2, [-0.3 + d, 0]), [-0.13, cuerpoY + 0.38])), gro, col(lejos));
  };
  patas(true);
  g.save(); g.translate(0, cuerpoY + bob); g.rotate(inclina);
  // el ala del otro lado
  const batir = alas > 0.05;
  if (batir) { for (let i = 0; i < 7; i++) ala(g, -0.9 + i * 0.22 + Math.sin(t * 60 + i) * 0.05, 0.28, true); }
  else ala(g, -0.12, 0.7, false);
  // abdomen
  g.save(); g.translate(-0.2, 0.015); g.rotate(0.08);
  g.beginPath(); g.ellipse(0, 0, 0.22, 0.135, 0, 0, TAU);
  const ag = g.createRadialGradient(0.02, -0.08, 0.01, 0, 0, 0.24);
  ag.addColorStop(0, "#b69a68"); ag.addColorStop(0.45, "#6e5a3c"); ag.addColorStop(1, "#1e1710");
  g.fillStyle = ag; g.fill();
  g.save(); g.clip();
  // anillos y manchas del abdomen
  for (let i = 0; i < 4; i++) { const xx = 0.12 - i * 0.08; g.fillStyle = "rgba(25,18,10,0.45)"; g.beginPath(); g.ellipse(xx, 0.0, 0.02, 0.15, 0.1, 0, TAU); g.fill(); }
  g.fillStyle = "rgba(20,14,8,0.5)"; g.fillRect(-0.25, -0.03, 0.5, 0.025);
  g.globalCompositeOperation = "multiply"; g.globalAlpha *= 0.5; g.drawImage(k.manchas, -0.25, -0.15, 0.5, 0.3); g.globalAlpha /= 0.5;
  g.globalCompositeOperation = "lighter";
  const hg = g.createRadialGradient(0.02, -0.08, 0, 0.02, -0.08, 0.1); hg.addColorStop(0, "rgba(255,240,210,0.35)"); hg.addColorStop(1, "rgba(255,240,210,0)");
  g.fillStyle = hg; g.fillRect(-0.25, -0.15, 0.5, 0.3);
  g.restore();
  g.strokeStyle = "#120d08"; g.lineWidth = 0.0035; g.lineCap = "round";
  for (const p of PELOS_A) { const cx = Math.cos(p.a) * 0.22 * p.r, cy = Math.sin(p.a) * 0.135 * p.r; g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + Math.cos(p.a) * p.l - 0.012, cy + Math.sin(p.a) * p.l); g.stroke(); }
  g.restore();
  // tórax
  g.save(); g.translate(0.05, -0.03);
  g.beginPath(); g.ellipse(0, 0, 0.16, 0.14, -0.15, 0, TAU);
  const tg = g.createRadialGradient(-0.02, -0.08, 0.01, 0, 0, 0.17);
  tg.addColorStop(0, "#8c8c92"); tg.addColorStop(0.5, "#4a4a50"); tg.addColorStop(1, "#141416");
  g.fillStyle = tg; g.fill();
  g.save(); g.clip();
  g.fillStyle = "rgba(10,10,12,0.6)";
  for (const yy of [-0.1, -0.055, -0.01]) { g.beginPath(); g.ellipse(-0.01, yy, 0.17, 0.014, -0.1, 0, TAU); g.fill(); }
  g.globalCompositeOperation = "multiply"; g.globalAlpha *= 0.6; g.drawImage(k.red, -0.17, -0.15, 0.34, 0.3); g.globalAlpha /= 0.6;
  g.restore();
  g.strokeStyle = "#0b0b0c"; g.lineWidth = 0.004;
  for (const p of PELOS_T) { const cx = Math.cos(p.a) * 0.16 * p.r, cy = Math.sin(p.a) * 0.14 * p.r; g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + Math.cos(p.a) * p.l, cy + Math.sin(p.a) * p.l - 0.01); g.stroke(); }
  g.restore();
  // cabeza
  g.save(); g.translate(0.255, 0.0);
  g.beginPath(); g.ellipse(0, 0, 0.1, 0.115, 0.1, 0, TAU);
  const cg = g.createRadialGradient(0.0, -0.05, 0, 0, 0, 0.13); cg.addColorStop(0, "#6a6266"); cg.addColorStop(1, "#141012");
  g.fillStyle = cg; g.fill();
  // la trompa
  g.fillStyle = "#2a2224"; g.beginPath(); g.moveTo(0.02, 0.08); g.quadraticCurveTo(0.05, 0.15, 0.03, 0.2); g.lineTo(0.0, 0.2); g.quadraticCurveTo(0.0, 0.14, -0.02, 0.09); g.fill();
  g.fillStyle = "#4a3c38"; g.beginPath(); g.ellipse(0.017, 0.205, 0.035, 0.016, 0, 0, TAU); g.fill();
  // el ojo: rojo oscuro, con sus facetas y un brillo
  g.beginPath(); g.ellipse(0.005, -0.012, 0.088, 0.1, 0.15, 0, TAU);
  const eg = g.createRadialGradient(-0.02, -0.05, 0.005, 0, -0.01, 0.11);
  eg.addColorStop(0, "#e0503e"); eg.addColorStop(0.4, "#a3201a"); eg.addColorStop(0.85, "#4e0b09"); eg.addColorStop(1, "#250504");
  g.fillStyle = eg; g.fill();
  g.save(); g.clip(); g.globalCompositeOperation = "multiply"; g.globalAlpha *= 0.55; g.drawImage(FACETAS, -0.1, -0.12, 0.2, 0.2); g.restore();
  g.save(); g.globalCompositeOperation = "lighter"; const bg = g.createRadialGradient(-0.035, -0.06, 0, -0.035, -0.06, 0.04); bg.addColorStop(0, "rgba(255,230,220,0.75)"); bg.addColorStop(1, "rgba(255,230,220,0)"); g.fillStyle = bg; g.beginPath(); g.arc(-0.035, -0.06, 0.04, 0, TAU); g.fill(); g.restore();
  // antena
  g.strokeStyle = "#1a1416"; g.lineWidth = 0.01; g.beginPath(); g.moveTo(0.075, 0.0); g.lineTo(0.105, 0.035); g.stroke();
  g.restore();
  // el ala de este lado
  if (batir) { g.save(); g.globalCompositeOperation = "lighter"; for (let i = 0; i < 9; i++) ala(g, -1.1 + i * 0.25 + Math.sin(t * 70 + i * 2) * 0.06, 0.22, true); g.restore(); }
  else ala(g, -0.05, 1, false);
  g.restore();
  patas(false);
  g.restore();
}

// ---------------------------------------------------------------------------------------------------------------
// La mano, abierta, vista desde abajo mientras baja (la palma, con los dedos hacia el fondo). (x, y): el centro de
// la palma; W: su ancho; aplana: lo de lado que se ve (1 de frente, 0,4 muy de canto).
// ---------------------------------------------------------------------------------------------------------------
const LM = k.lienzo(1080, 1920);
// estela: cuánto se estira hacia arriba al bajar rápido (en píxeles)
export function mano(g, x, y, W, aplana = 0.55, al = 1, gira = 0, estela = 0) {
  if (al <= 0.003) return;
  const c = LM.getContext("2d");
  c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1; c.globalCompositeOperation = "source-over"; c.clearRect(0, 0, 1080, 1920);
  c.save(); c.translate(x, y); c.rotate(gira); c.scale(W, W * aplana);
  const piel = c.createLinearGradient(-0.6, -1, 0.6, 0.8);
  piel.addColorStop(0, "#f3c39b"); piel.addColorStop(0.5, "#d9946a"); piel.addColorStop(1, "#9c5a3a");
  const dedos = [[-0.33, -0.5, -0.42, -1.1, 0.17], [-0.11, -0.55, -0.13, -1.3, 0.18], [0.11, -0.55, 0.14, -1.24, 0.18], [0.31, -0.48, 0.41, -1.0, 0.155]];
  c.fillStyle = piel; c.strokeStyle = piel; c.lineCap = "round";
  redondo(c, -0.45, -0.6, 0.9, 1.0, 0.32); c.fill();
  for (const [x0, y0, x1, y1, w] of dedos) { c.lineWidth = w; c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y1); c.stroke(); }
  c.lineWidth = 0.21; c.beginPath(); c.moveTo(0.32, 0.12); c.quadraticCurveTo(0.62, -0.05, 0.78, -0.38); c.stroke();
  c.beginPath(); c.moveTo(-0.42, 0.1); c.quadraticCurveTo(-0.3, 0.6, -0.34, 2.6); c.lineTo(0.38, 2.6); c.quadraticCurveTo(0.33, 0.6, 0.44, 0.1); c.closePath(); c.fill();
  // volumen: luz arriba a la izquierda, sombra al borde
  c.globalCompositeOperation = "source-atop";
  const vg = c.createRadialGradient(-0.1, -0.3, 0.05, 0, -0.2, 1.3); vg.addColorStop(0, "rgba(255,228,205,0.4)"); vg.addColorStop(0.55, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(70,25,8,0.45)");
  c.fillStyle = vg; c.fillRect(-1.5, -2, 3, 5);
  c.globalAlpha = 0.1; c.drawImage(k.manchas, -1, -1.5, 2, 4); c.globalAlpha = 1;
  c.globalCompositeOperation = "source-over";
  c.strokeStyle = "rgba(120,60,35,0.5)"; c.lineWidth = 0.018; c.lineCap = "round";
  c.beginPath(); c.moveTo(-0.42, -0.28); c.quadraticCurveTo(0, -0.38, 0.3, -0.18); c.stroke();
  c.beginPath(); c.moveTo(-0.42, -0.08); c.quadraticCurveTo(-0.05, -0.12, 0.2, 0.05); c.stroke();
  c.beginPath(); c.moveTo(0.28, -0.3); c.quadraticCurveTo(0.12, 0.0, 0.18, 0.35); c.stroke();
  c.lineWidth = 0.012;
  for (const [x0, y0, x1, y1, w] of dedos) for (const s of [0.38, 0.68]) { const px = mez(x0, x1, s), py = mez(y0, y1, s); c.beginPath(); c.moveTo(px - w * 0.35, py); c.lineTo(px + w * 0.35, py); c.stroke(); }
  c.restore();
  g.save(); g.globalAlpha *= al;
  if (estela > 2) { const n = 6; for (let i = n; i >= 1; i--) { g.globalAlpha = al * 0.12; g.drawImage(LM, 0, -estela * (i / n)); } g.globalAlpha = al; }
  g.shadowColor = "rgba(30,10,0,0.5)"; g.shadowBlur = 50; g.shadowOffsetY = 20;
  g.drawImage(LM, 0, 0);
  g.restore();
}

// Un fogonazo de golpe en la mesa: anillo de polvo y destello.
export function golpe(g, x, y, u, tam = 700) {
  if (u <= 0 || u >= 1) return;
  g.save(); g.globalCompositeOperation = "lighter";
  k.brillo(g, x, y, tam * (0.6 + u), "255,236,200", 0.8 * (1 - u));
  g.strokeStyle = `rgba(255,240,215,${0.6 * (1 - u)})`; g.lineWidth = 10 * (1 - u) + 2;
  g.beginPath(); g.ellipse(x, y, tam * 0.2 + tam * 0.6 * k.entra(u), (tam * 0.2 + tam * 0.6 * k.entra(u)) * 0.16, 0, 0, TAU); g.stroke();
  g.restore();
}
