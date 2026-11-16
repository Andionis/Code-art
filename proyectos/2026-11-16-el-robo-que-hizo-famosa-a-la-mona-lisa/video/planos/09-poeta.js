// «Así que buscaron por otro lado, y arrestaron a un poeta famoso.»
// Una calle de París de noche, con farolas: la linterna de un policía busca a un lado y a otro. «arrestaron»: unas
// rejas caen de golpe delante del poeta, con su sombrero; su nombre, en una etiqueta.
import * as k from "#kit";
import { v } from "#voz";
import { persona, fondoCuarto, veloArriba } from "../mundo.js";

export const desde = (vz) => vz.frase(11).inicio;
const { suave: su, tramo: tr, mez } = k;
const f = v.frase(11);
const T0 = f.inicio, Tbus = f.t("buscaron"), Tarr = f.t("arrestaron"), Tpoe = f.t("poeta"), Fin = f.fin;
export const rejas = Tarr + 0.1;

export function dibuja(g, t) {
  fondoCuarto(g, "#2a3448", "#05070c", 540, 900);
  // la pared de ladrillo de la comisaría
  g.strokeStyle = "rgba(0,0,0,0.35)"; g.lineWidth = 4;
  for (let y = 520; y < 1700; y += 60) { g.beginPath(); g.moveTo(0, y); g.lineTo(1080, y); g.stroke(); for (let x = ((y / 60) % 2) * 60; x < 1080; x += 120) { g.beginPath(); g.moveTo(x, y); g.lineTo(x, y + 60); g.stroke(); } }
  // el suelo
  const gr = g.createLinearGradient(0, 1600, 0, 1920); gr.addColorStop(0, "#15181e"); gr.addColorStop(1, "#2a2e36"); g.fillStyle = gr; g.fillRect(0, 1600, 1080, 320);
  // el poeta: entra empujado desde la izquierda y se queda en medio
  const ent = su(tr(t, T0, Tarr - 0.1));
  const px = mez(-200, 540, ent);
  // la luz de la linterna que busca y se para en él
  const busca = tr(t, T0, Tarr);
  const lx = busca < 1 ? 540 + Math.sin((t - T0) * 3.2) * 380 * (1 - busca) : 540, ly = 1150;
  k.brillo(g, lx, ly, 1100, "255,230,180", 0.45);
  persona(g, px, 1720, 1050, { sombrero: "bombin", ropa: "#1c1c24", anda: ent < 1 ? 1 : 0.1, paso: (t - T0) * 6, luz: 0.6 });
  // las rejas caen de golpe
  const r = k.sale(tr(t, rejas - 0.3, rejas));
  const rb = t > rejas ? Math.sin(tr(t, rejas, rejas + 0.25) * Math.PI) * 25 : 0;
  const yb = mez(-2200, 0, r) - rb;
  for (let i = 0; i < 9; i++) {
    const x = 70 + i * 120;
    const m = g.createLinearGradient(x - 18, 0, x + 18, 0); m.addColorStop(0, "#1a1a1a"); m.addColorStop(0.4, "#8a8a8a"); m.addColorStop(1, "#202020");
    g.fillStyle = m; g.fillRect(x - 16, yb + 480, 32, 1500);
  }
  g.fillStyle = "#3a3a3a"; g.fillRect(0, yb + 700, 1080, 40); g.fillRect(0, yb + 1500, 1080, 40);
  if (t > rejas) k.brillo(g, 540, 1100, 900, "255,240,210", 0.35 * k.pulso(t, rejas + 0.03, 0.1));
  // su nombre
  const e = su(tr(t, Tpoe - 0.1, Tpoe + 0.25));
  if (e > 0) k.etiqueta(g, 170, 1560, "Guillaume Apollinaire", "255,220,150", e, 62);
  veloArriba(g, 0.4);
}
