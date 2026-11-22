// «...capa más alta que un edificio de cuarenta pisos.»
// Corte en «capa» a una calle a pie de suelo: un rascacielos de cristal y, a su lado, la capa de sal.
// - Fotograma 0: el edificio, alto, con el cielo detrás; la sal ya asoma abajo a la izquierda.
// - «más alta»: la pared de sal sube deprisa y frena por encima del tejado del edificio.
// - «cuarenta pisos»: «40 pisos» en el edificio y «+150 m» en la sal. Reposa antes del corte.
import * as k from "#kit";
import { v } from "#voz";
import { grano, velo } from "../mundo.js";

export const desde = "capa";

const { suave: su, tramo: tr, mez, azar } = k;
const f11 = v.frase(11), T0 = f11.t("capa") - 0.04, Tmas = f11.t("mas"), Talta = f11.t("alta"), Tedi = f11.t("edificio"), Tcua = f11.t("cuarenta"), Tfin = v.frase(12).inicio;
export const momentos = { sube: Tmas, frena: Tedi, cuarenta: Tcua };
const SUELO = 1560, BX = 760, BW = 280, BTOP = 640, STOP = 540;  // el edificio y lo alto de la sal
const az = azar(1010);
const CRIST = Array.from({ length: 50 }, (_, i) => ({ x: 30 + az() * 520, y: az(), r: 8 + az() * 14, sem: 300 + i }));

export function dibuja(g, t) {
  // el cielo de la tarde
  const gr = g.createLinearGradient(0, 0, 0, SUELO);
  gr.addColorStop(0, "#2a6fc4"); gr.addColorStop(0.7, "#8cc4ee"); gr.addColorStop(1, "#ffd9a8");
  g.fillStyle = gr; g.fillRect(0, 0, 1080, SUELO);
  k.brillo(g, 200, 1200, 900, "255,220,170", 0.35);
  // edificios bajos del fondo
  const a = azar(3);
  for (let i = 0; i < 9; i++) { const x = i * 130 - 20, h = 140 + a() * 220; g.fillStyle = "rgba(90,110,150,0.55)"; g.fillRect(x, SUELO - h, 110, h); }
  // el rascacielos: cristal azul con 40 filas de ventanas, luz por la izquierda
  const bg = g.createLinearGradient(BX - BW / 2, 0, BX + BW / 2, 0);
  bg.addColorStop(0, "#9fd0f2"); bg.addColorStop(0.5, "#3f7fb8"); bg.addColorStop(1, "#1d3f68");
  g.fillStyle = bg; g.fillRect(BX - BW / 2, BTOP, BW, SUELO - BTOP);
  g.fillStyle = "#16304f"; g.fillRect(BX + BW / 2 - 40, BTOP + 10, 40, SUELO - BTOP - 10);
  const piso = (SUELO - BTOP) / 40;
  g.fillStyle = "rgba(10,25,45,0.45)";
  for (let i = 0; i < 40; i++) g.fillRect(BX - BW / 2, BTOP + i * piso, BW, 2.5);
  for (let j = 1; j < 6; j++) g.fillRect(BX - BW / 2 + j * (BW / 6), BTOP, 2.5, SUELO - BTOP);
  g.fillStyle = "rgba(255,240,210,0.35)"; g.fillRect(BX - BW / 2, BTOP, 18, SUELO - BTOP);
  g.fillStyle = "#284a72"; g.fillRect(BX - BW / 2 - 10, BTOP - 18, BW + 20, 22); g.fillRect(BX - 6, BTOP - 90, 12, 72);
  // el suelo, la calle
  const sg = g.createLinearGradient(0, SUELO, 0, 1920);
  sg.addColorStop(0, "#5a5f68"); sg.addColorStop(1, "#2a2d33");
  g.fillStyle = sg; g.fillRect(0, SUELO, 1080, 360);
  g.fillStyle = "rgba(255,255,255,0.6)"; for (let x = 20; x < 1080; x += 140) g.fillRect(x, SUELO + 170, 80, 10);
  // la pared de sal: sube desde el suelo hasta pasar el tejado
  const sube = k.entra(tr(t, T0 - 0.05, Tedi));
  const top = mez(SUELO - 120, STOP, sube);
  g.save();
  g.beginPath(); g.moveTo(-20, SUELO + 40); g.lineTo(-20, top + 20);
  for (let x = -20; x <= 600; x += 30) g.lineTo(x, top + 16 * Math.sin(x * 0.05) + 10 * Math.sin(x * 0.13));
  g.lineTo(600, SUELO + 40); g.closePath();
  const wg = g.createLinearGradient(0, 0, 600, 0);
  wg.addColorStop(0, "#ffffff"); wg.addColorStop(0.75, "#e4edf6"); wg.addColorStop(1, "#b4c4d6");
  g.fillStyle = wg; g.fill(); g.clip();
  g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.25; g.drawImage(k.red2, -20, top - 20, 640, SUELO - top + 80);
  g.globalCompositeOperation = "source-over"; g.globalAlpha = 1;
  for (const c of CRIST) grano(g, c.x, top + 30 + c.y * (SUELO - top - 40), c.r, t, c.sem, 0.9, 0.6);
  g.restore();
  // la sombra de la sal sobre el edificio y su borde
  g.fillStyle = "rgba(255,255,255,0.9)"; g.fillRect(596, top + 10, 6, SUELO - top);
  // las cifras
  const cifras = su(tr(t, Tcua - 0.1, Tcua + 0.25));
  k.pastilla(g, BX, BTOP + 300, "40", "pisos", "255,255,255", cifras, 110);
  k.pastilla(g, 290, top + 220, "+150", "m", "255,90,80", cifras, 130);
  velo(g, 0.35);
}
