// «... como un piloto en un simulador.»
// Un simulador de vuelo: una cabina blanca sobre patas hidráulicas, en una sala.
// - «como un piloto»: de cerca, por el parabrisas: el piloto a contraluz y, en su pantalla, una tormenta con un rayo;
//   la cabina se sacude.
// - «simulador»: la cámara se aleja y se ve que está sobre sus patas, en una sala, a salvo; se calma antes del corte.
import * as k from "#kit";
import { v } from "#voz";
import { TAU, camino2D, velo, vineta, vista } from "../mundo.js";

const f6 = v.frase(6);
export const desde = (vv) => vv.frase(6).t("como");
const { suave: su, tramo: tr, mez, azar } = k;
const T0 = f6.t("como"), Tpil = f6.t("piloto"), Tsim = f6.t("simulador"), Tfin = f6.fin;
const Tray = Tpil + 0.05;

const C = [540, 900];   // el centro de la cabina
const cam = camino2D([
  [T0 - 0.05, [1.85, 540, 860]],
  [Tsim - 0.15, [1.6, 540, 880]],
  [Tfin + 0.15, [0.95, 540, 1000]],
]);
// la sacudida: fuerte con la tormenta, se calma antes del corte
const fuerza = (t) => 1 - su(tr(t, Tfin - 0.2, Tfin + 0.35));
const sac = (t) => fuerza(t) * (Math.sin(t * 17) * 0.6 + Math.sin(t * 29 + 1) * 0.4);
const azL = azar(9);
const LLUVIA = Array.from({ length: 80 }, () => ({ x: azL(), y: azL(), l: 20 + azL() * 30 }));
const LUCES = Array.from({ length: 12 }, (_, i) => ({ x: -500 + i * 190, f: azL() * TAU }));

function pantalla(g, x, y, w, h, t) {
  // la tormenta que ve el piloto
  g.save(); g.beginPath(); k.redondo(g, x, y, w, h, 40); g.clip();
  const sg = g.createLinearGradient(0, y, 0, y + h); sg.addColorStop(0, "#0a1020"); sg.addColorStop(0.6, "#25304a"); sg.addColorStop(1, "#0a0e18");
  g.fillStyle = sg; g.fillRect(x, y, w, h);
  g.globalCompositeOperation = "screen"; g.globalAlpha *= 0.35; g.drawImage(k.manchas, x - 100 + t * 30, y - 50, w + 300, h + 200); g.globalAlpha /= 0.35; g.globalCompositeOperation = "source-over";
  // el rayo
  const ray = k.pulso(t, Tray, 0.08) + 0.5 * k.pulso(t, Tray + 0.22, 0.05);
  if (ray > 0.02) {
    g.fillStyle = `rgba(200,220,255,${0.45 * ray})`; g.fillRect(x, y, w, h);
    const az = azar(3); let px = x + w * 0.62, py = y;
    g.strokeStyle = `rgba(240,248,255,${ray})`; g.lineWidth = 7; g.lineJoin = "round"; g.beginPath(); g.moveTo(px, py);
    while (py < y + h * 0.75) { px += (az() - 0.5) * 60; py += 30 + az() * 30; g.lineTo(px, py); }
    g.stroke(); k.brillo(g, px, py, 260, "200,220,255", ray);
  }
  // la lluvia contra el cristal
  g.strokeStyle = "rgba(180,200,240,0.35)"; g.lineWidth = 2;
  for (const d of LLUVIA) { const yy = y + ((d.y + t * 1.8) % 1) * h, xx = x + d.x * w; g.beginPath(); g.moveTo(xx, yy); g.lineTo(xx - 8, yy + d.l); g.stroke(); }
  // el horizonte, inclinado con la sacudida
  g.strokeStyle = "rgba(120,200,255,0.5)"; g.lineWidth = 3; g.beginPath(); g.moveTo(x, y + h * 0.62 + sac(t) * 40); g.lineTo(x + w, y + h * 0.62 - sac(t) * 40); g.stroke();
  // la cabina por dentro: el marco de los dos cristales, el tablero con sus luces y el piloto de espaldas
  g.fillStyle = "#0b0f18";
  g.beginPath(); g.rect(x, y, w, h);                                   // el marco, con dos cristales recortados
  g.moveTo(x + w * 0.06, y + h * 0.08); g.lineTo(x + w * 0.47, y + h * 0.08); g.lineTo(x + w * 0.47, y + h * 0.58); g.lineTo(x + w * 0.12, y + h * 0.5); g.closePath();
  g.moveTo(x + w * 0.53, y + h * 0.08); g.lineTo(x + w * 0.94, y + h * 0.08); g.lineTo(x + w * 0.88, y + h * 0.5); g.lineTo(x + w * 0.53, y + h * 0.58); g.closePath();
  g.fill("evenodd");
  // el tablero
  const tg = g.createLinearGradient(0, y + h * 0.58, 0, y + h); tg.addColorStop(0, "#1a2232"); tg.addColorStop(1, "#06080e");
  g.fillStyle = tg; g.beginPath(); g.moveTo(x, y + h * 0.62); g.lineTo(x + w * 0.12, y + h * 0.52); g.lineTo(x + w * 0.5, y + h * 0.6); g.lineTo(x + w * 0.88, y + h * 0.52); g.lineTo(x + w, y + h * 0.62); g.lineTo(x + w, y + h); g.lineTo(x, y + h); g.closePath(); g.fill();
  g.save(); g.globalCompositeOperation = "lighter";
  const azI = azar(41);
  for (let i = 0; i < 22; i++) { const ix = x + w * (0.08 + azI() * 0.84), iy = y + h * (0.66 + azI() * 0.2), c = ["90,255,140", "255,190,60", "90,180,255"][i % 3]; k.brillo(g, ix, iy, 18, c, 0.5 + 0.4 * Math.sin(t * 5 + i)); g.fillStyle = `rgba(${c},0.9)`; g.fillRect(ix - 4, iy - 3, 8, 6); }
  g.restore();
  // el piloto, de espaldas, con sus cascos, y las manos en los mandos
  const px = x + w * 0.5, py = y + h * 0.66, hr = h * 0.15, mueve = sac(t) * 6;
  g.fillStyle = "#020306";
  g.beginPath(); g.ellipse(px, y + h * 1.05, h * 0.36, h * 0.3, 0, Math.PI, TAU); g.fill();
  g.beginPath(); g.arc(px + mueve, py, hr, 0, TAU); g.fill();
  g.strokeStyle = "#020306"; g.lineWidth = hr * 0.25; g.beginPath(); g.arc(px + mueve, py, hr * 1.12, Math.PI * 1.05, Math.PI * 1.95); g.stroke();
  for (const sx of [-1, 1]) { g.fillStyle = "#1a1e28"; g.beginPath(); g.ellipse(px + mueve + sx * hr * 1.05, py + hr * 0.1, hr * 0.28, hr * 0.42, 0, 0, TAU); g.fill(); }
  g.strokeStyle = "#020306"; g.lineWidth = h * 0.07; g.lineCap = "round";
  for (const sx of [-1, 1]) { g.beginPath(); g.moveTo(px + sx * h * 0.3, y + h * 0.95); g.lineTo(px + sx * h * 0.2 + mueve, y + h * 0.8); g.stroke(); }
  g.fillStyle = "#2a3040"; k.redondo(g, px - h * 0.24 + mueve, y + h * 0.76, h * 0.48, h * 0.06, h * 0.03); g.fill();
  g.restore();
}

export function dibuja(g, t) {
  const [Z, cx, cy] = cam(t);
  vista(g, Z, cx, cy);
  // la sala: pared oscura, focos y suelo con rejilla
  const pg = g.createLinearGradient(0, 200, 0, 1400); pg.addColorStop(0, "#0c1424"); pg.addColorStop(1, "#1a2a44");
  g.fillStyle = pg; g.fillRect(-800, -400, 2700, 1800);
  for (const l of LUCES) { k.brillo(g, l.x + 300, 260, 220, "120,180,255", 0.35); g.fillStyle = "#cfe4ff"; g.fillRect(l.x + 280, 250, 40, 8); }
  const sg = g.createLinearGradient(0, 1400, 0, 2300); sg.addColorStop(0, "#22344e"); sg.addColorStop(1, "#0a1220");
  g.fillStyle = sg; g.fillRect(-800, 1400, 2700, 1000);
  g.strokeStyle = "rgba(120,180,255,0.15)"; g.lineWidth = 2;
  for (let i = -12; i <= 12; i++) { g.beginPath(); g.moveTo(540 + i * 60, 1400); g.lineTo(540 + i * 220, 2300); g.stroke(); }
  for (let j = 0; j < 8; j++) { const yy = 1400 + j * j * 16; g.beginPath(); g.moveTo(-800, yy); g.lineTo(1900, yy); g.stroke(); }
  // la base y las patas
  g.fillStyle = "#3a4458"; g.beginPath(); g.ellipse(540, 1440, 380, 60, 0, 0, TAU); g.fill();
  g.fillStyle = "#59647c"; g.beginPath(); g.ellipse(540, 1430, 380, 56, 0, 0, TAU); g.fill();
  const inc = sac(t) * 0.06, sube = sac(t + 0.13) * 14;
  const pata = (bx, by, tx, ty) => {
    g.lineCap = "round";
    g.strokeStyle = "#2a3040"; g.lineWidth = 34; g.beginPath(); g.moveTo(bx, by); g.lineTo(mez(bx, tx, 0.5), mez(by, ty, 0.5)); g.stroke();
    g.strokeStyle = "#c8d2e0"; g.lineWidth = 20; g.beginPath(); g.moveTo(mez(bx, tx, 0.45), mez(by, ty, 0.45)); g.lineTo(tx, ty); g.stroke();
    g.strokeStyle = "rgba(255,255,255,0.6)"; g.lineWidth = 5; g.beginPath(); g.moveTo(mez(bx, tx, 0.45) - 5, mez(by, ty, 0.45)); g.lineTo(tx - 5, ty); g.stroke();
  };
  const fondoCab = [C[0], C[1] + 230 + sube];
  for (const [bx, dx] of [[260, -250], [400, -250], [400, 0], [680, 0], [680, 250], [820, 250]]) {
    const tx = fondoCab[0] + dx * Math.cos(inc), ty = fondoCab[1] + dx * Math.sin(inc);
    pata(bx, 1425, tx, ty);
  }
  // la pasarela de entrada, a la derecha
  g.fillStyle = "#2a3448"; g.fillRect(860, 1090 + sube * 0.3, 700, 22); g.strokeStyle = "#5a6a88"; g.lineWidth = 6;
  g.beginPath(); g.moveTo(860, 1020 + sube * 0.3); g.lineTo(1560, 1020); g.stroke();
  for (let xx = 900; xx < 1560; xx += 70) { g.beginPath(); g.moveTo(xx, 1020); g.lineTo(xx, 1090); g.stroke(); }
  // la cabina: una cápsula blanca con franja azul y un parabrisas grande
  g.save(); g.translate(C[0], C[1] + sube); g.rotate(inc);
  k.brillo(g, 0, 0, 900, "120,170,255", 0.25);
  const cg = g.createLinearGradient(-330, -240, 330, 240); cg.addColorStop(0, "#ffffff"); cg.addColorStop(0.6, "#d6deea"); cg.addColorStop(1, "#8a96aa");
  g.fillStyle = cg; k.redondo(g, -330, -240, 660, 470, 120); g.fill();
  g.save(); k.redondo(g, -330, -240, 660, 470, 120); g.clip();
  g.globalCompositeOperation = "multiply"; g.globalAlpha *= 0.08; g.drawImage(k.red2, -330, -240, 660, 470); g.globalAlpha /= 0.08; g.globalCompositeOperation = "source-over";
  g.fillStyle = "#2a6ae0"; g.fillRect(-330, 140, 660, 30); g.fillStyle = "#ff8a2a"; g.fillRect(-330, 172, 660, 8);
  g.restore();
  g.fillStyle = "#1a2030"; k.redondo(g, -262, -182, 524, 290, 60); g.fill();
  pantalla(g, -250, -170, 500, 266, t);
  k.reflejo(g, -230, -160, 40, 200, 0.25);
  g.restore();
  // el destello del rayo ilumina la sala
  const ray = k.pulso(t, Tray, 0.08);
  if (ray > 0.02) { g.save(); g.globalCompositeOperation = "lighter"; k.brillo(g, C[0], C[1], 1500, "180,200,255", 0.35 * ray); g.restore(); }
  vineta(g, 0.5);
  velo(g, 0.3);
}

export const momentos = { rayo: Tray, rayo2: Tray + 0.22 };
