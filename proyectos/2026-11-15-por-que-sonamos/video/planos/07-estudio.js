// «En un estudio, la gente que durmió volvió a ver las mismas fotos fuertes, y le afectaron menos.»
// Una sala de estudio: una pantalla grande con una foto fuerte (una araña enorme), alguien de espaldas mirándola y, al
// lado, el medidor de lo que siente (rojo arriba).
// - «estudio»: sale la araña; el medidor se dispara hasta arriba, en rojo; él se echa atrás.
// - «durmió»: la pantalla se apaga, cae la noche por la ventana (la luna pasa), él se duerme; vuelve el día.
// - «mismas fotos»: la misma araña otra vez.
// - «menos»: el medidor apenas sube (una marca enseña hasta dónde llegó la primera vez).
import * as k from "#kit";
import { v } from "#voz";
import { TAU, camino2D, velo, vineta, vista } from "../mundo.js";

const f9 = v.frase(9);
export const desde = (vv) => vv.frase(9).inicio;
const { suave: su, tramo: tr, mez, azar } = k;
const T0 = f9.inicio, Test = f9.t("estudio"), Tgen = f9.t("gente"), Tdur = f9.t("durmio"), Tvol = f9.t("volvio"), Tmis = f9.t("mismas"), Tafe = f9.t("afectaron"), Tmen = f9.t("menos"), Tfin = f9.fin;

const cam = camino2D([
  [T0 - 0.05, [1.12, 540, 960]],
  [Tgen, [1.05, 540, 960]],
  [Tvol, [1.05, 540, 960]],
  [Tafe, [1.14, 560, 930]],
  [Tmen + 0.3, [1.2, 620, 930]],
]);
// la pantalla: encendida en la primera foto y en la segunda
const pant1 = (t) => su(tr(t, T0 - 0.05, T0 + 0.2)) * (1 - su(tr(t, Tgen - 0.1, Tgen + 0.25)));
const pant2 = (t) => su(tr(t, Tvol, Tvol + 0.35));
const noche = (t) => su(tr(t, Tgen, Tgen + 0.35)) * (1 - su(tr(t, Tdur + 0.35, Tvol)));
// el medidor: arriba con la primera; poco con la segunda
const nivel = (t) => {
  const a = 0.95 * k.entra(tr(t, Test - 0.1, Test + 0.3)) * (1 - su(tr(t, Tgen - 0.1, Tgen + 0.4)));
  const b = 0.3 * k.entra(tr(t, Tafe - 0.05, Tmen + 0.1));
  return a + b;
};
const susto = (t) => k.pulso(t, Test + 0.1, 0.35);

function arana(g, x, y, s, t) {
  g.save(); g.translate(x, y); g.scale(s, s);
  const az = azar(4);
  // las patas: cuatro por lado, dobladas
  g.lineCap = "round"; g.lineJoin = "round";
  for (const lado of [-1, 1]) for (let i = 0; i < 4; i++) {
    const mueve = Math.sin(t * 3 + i * 1.3 + lado) * 5;
    const bx = lado * 30, by = -34 + i * 16;                              // donde sale, del costado de la cabeza
    const kx = lado * (110 + i * 12), ky = -120 + i * 40 + mueve;          // la rodilla, arriba y afuera
    const px = lado * (215 - i * 6), py = -150 + i * 95 - mueve;            // la punta, abajo y afuera
    g.strokeStyle = "#1a0e08"; g.lineWidth = 17 - i * 1.5; g.beginPath(); g.moveTo(bx, by); g.quadraticCurveTo((bx + kx) / 2, ky - 25, kx, ky); g.quadraticCurveTo((kx + px) / 2 + lado * 20, (ky + py) / 2, px, py); g.stroke();
    g.strokeStyle = "rgba(170,100,60,0.55)"; g.lineWidth = 4; g.stroke();
  }
  // el cuerpo: el abdomen grande y la cabeza
  const ag = g.createRadialGradient(-10, 50, 5, 0, 70, 95); ag.addColorStop(0, "#6a3a1e"); ag.addColorStop(1, "#140804");
  g.fillStyle = ag; g.beginPath(); g.ellipse(0, 75, 72, 92, 0, 0, TAU); g.fill();
  g.fillStyle = "#c8401e"; g.beginPath(); g.moveTo(0, 50); g.lineTo(16, 80); g.lineTo(0, 110); g.lineTo(-16, 80); g.closePath(); g.fill();
  g.strokeStyle = "rgba(120,70,40,0.6)"; g.lineWidth = 2;
  for (let i = 0; i < 60; i++) { const a = az() * TAU, r = 60 + az() * 30; g.beginPath(); g.moveTo(Math.cos(a) * r * 0.8, 75 + Math.sin(a) * r); g.lineTo(Math.cos(a) * (r + 10) * 0.8, 75 + Math.sin(a) * (r + 10)); g.stroke(); }
  const cg = g.createRadialGradient(-6, -30, 3, 0, -20, 50); cg.addColorStop(0, "#5a3018"); cg.addColorStop(1, "#140804");
  g.fillStyle = cg; g.beginPath(); g.ellipse(0, -18, 46, 42, 0, 0, TAU); g.fill();
  // los ojos que brillan y los colmillos
  for (const [ex, ey, er] of [[-14, -38, 7], [14, -38, 7], [-28, -30, 4], [28, -30, 4], [-6, -48, 4], [6, -48, 4]]) { g.fillStyle = "#050202"; g.beginPath(); g.arc(ex, ey, er, 0, TAU); g.fill(); g.fillStyle = "rgba(255,255,255,0.8)"; g.beginPath(); g.arc(ex - er * 0.3, ey - er * 0.3, er * 0.35, 0, TAU); g.fill(); }
  g.fillStyle = "#2a0e06"; for (const sx of [-1, 1]) { g.beginPath(); g.moveTo(sx * 12, 14); g.quadraticCurveTo(sx * 18, 34, sx * 6, 44); g.lineTo(sx * 4, 18); g.fill(); }
  g.restore();
}

export function dibuja(g, t) {
  const [Z, cx, cy] = cam(t);
  const tiembla = susto(t) * Math.sin(t * 60) * 6;
  vista(g, Z, cx + tiembla, cy);
  const n = noche(t);
  // la sala
  const pg = g.createLinearGradient(0, 0, 0, 1920);
  pg.addColorStop(0, k.mezColor("#2a3448", "#0a0c18", n)); pg.addColorStop(1, k.mezColor("#141a26", "#04050a", n));
  g.fillStyle = pg; g.fillRect(-500, -400, 2100, 2800);
  g.save(); g.globalCompositeOperation = "multiply"; g.globalAlpha *= 0.06; g.drawImage(k.red2, -500, -400, 2100, 2800); g.restore();
  // la ventana: el día, la noche con la luna que pasa, el día otra vez
  g.save(); g.beginPath(); g.rect(-120, 560, 220, 420); g.clip();
  const vg = g.createLinearGradient(0, 560, 0, 980); vg.addColorStop(0, k.mezColor("#7ab8f0", "#0a1440", n)); vg.addColorStop(1, k.mezColor("#d8ecff", "#1a2a6a", n));
  g.fillStyle = vg; g.fillRect(-120, 560, 220, 420);
  if (n > 0.01) { const lu = tr(t, Tgen, Tvol); g.fillStyle = `rgba(245,245,255,${n})`; g.beginPath(); g.arc(mez(-100, 90, lu), 700 - Math.sin(lu * Math.PI) * 80, 30, 0, TAU); g.fill(); k.brillo(g, mez(-100, 90, lu), 700 - Math.sin(lu * Math.PI) * 80, 160, "200,210,255", 0.5 * n); }
  g.restore();
  g.strokeStyle = "#3a4458"; g.lineWidth = 14; g.strokeRect(-120, 560, 220, 420);
  // la pantalla
  const on = Math.max(pant1(t), pant2(t));
  g.fillStyle = "#0a0c12"; k.redondo(g, 150, 560, 720, 520, 22); g.fill();
  g.fillStyle = "#22283a"; g.fillRect(490, 1080, 60, 90); g.fillRect(400, 1160, 240, 18);
  g.save(); g.beginPath(); k.redondo(g, 172, 582, 676, 476, 10); g.clip();
  g.fillStyle = "#04060a"; g.fillRect(172, 582, 676, 476);
  if (on > 0.01) {
    g.globalAlpha *= on;
    const fg = g.createRadialGradient(510, 780, 40, 510, 820, 460); fg.addColorStop(0, "#f2e6d0"); fg.addColorStop(1, "#8a7a62");
    g.fillStyle = fg; g.fillRect(172, 582, 676, 476);
    const esc = t < Tgen ? mez(1.25, 1.05, k.entra(tr(t, T0, Test + 0.2))) : mez(0.85, 1.05, k.entra(tr(t, Tvol, Tmis))) + 0.18 * su(tr(t, Tmis, Tafe + 0.2));
    arana(g, 510, 760, esc, t);
    g.globalAlpha /= on;
  }
  g.restore();
  k.reflejo(g, 190, 600, 40, 300, 0.12);
  if (on > 0.01) { g.save(); g.globalCompositeOperation = "lighter"; k.brillo(g, 510, 820, 900, "255,240,210", 0.18 * on); g.restore(); }
  // el medidor: un tubo con su nivel; rojo si sube mucho
  const nv = nivel(t), mx = 905, my0 = 1100, my1 = 600;
  g.fillStyle = "#0e121c"; k.redondo(g, mx - 34, my1 - 20, 68, my0 - my1 + 40, 34); g.fill();
  const col = k.mezRgb("120,230,120", "255,50,40", su(tr(nv, 0.3, 0.8)));
  if (nv > 0.005) {
    const yN = mez(my0, my1, nv);
    const lg = g.createLinearGradient(0, my0, 0, my1); lg.addColorStop(0, "rgb(120,230,120)"); lg.addColorStop(0.5, "rgb(255,200,60)"); lg.addColorStop(1, "rgb(255,50,40)");
    g.save(); k.redondo(g, mx - 22, yN, 44, my0 - yN + 8, 22); g.clip(); g.fillStyle = lg; g.fillRect(mx - 22, my1, 44, my0 - my1 + 10); g.restore();
    g.save(); g.globalCompositeOperation = "lighter"; k.brillo(g, mx, yN, 160, col, 0.5 + 0.5 * su(tr(nv, 0.5, 0.9))); g.restore();
  }
  // la marca de hasta dónde llegó la primera vez
  const marca = su(tr(t, Tvol, Tmis));
  if (marca > 0.01) { const ym = mez(my0, my1, 0.95); g.strokeStyle = `rgba(255,90,80,${0.8 * marca})`; g.lineWidth = 6; g.setLineDash([14, 10]); g.beginPath(); g.moveTo(mx - 60, ym); g.lineTo(mx + 40, ym); g.stroke(); g.setLineDash([]); }
  // él, de espaldas, abajo: se echa atrás con el susto, se duerme y luego mira tranquilo
  const atras = susto(t), duerme = n;
  g.save(); g.translate(480, 1420 + atras * 40);
  g.fillStyle = "#1a2a4a"; g.beginPath(); g.ellipse(0, 120, 230, 150, 0, Math.PI, TAU); g.fill();
  g.rotate(-0.25 * duerme + atras * 0.05);
  const hg = g.createRadialGradient(-20, -80, 10, 0, -60, 110); hg.addColorStop(0, "#3a2a26"); hg.addColorStop(1, "#140c0a");
  g.fillStyle = hg; g.beginPath(); g.ellipse(0, -60 + duerme * 20, 92, 108, 0, 0, TAU); g.fill();
  g.fillStyle = "#c88a72"; for (const sx of [-1, 1]) { g.beginPath(); g.ellipse(sx * 92, -50 + duerme * 20, 14, 26, 0, 0, TAU); g.fill(); }
  g.restore();
  vineta(g, 0.5);
  velo(g, 0.35);
}

export const momentos = { susto: Test + 0.1, foto1: T0, foto2: Tvol, menos: Tafe };
