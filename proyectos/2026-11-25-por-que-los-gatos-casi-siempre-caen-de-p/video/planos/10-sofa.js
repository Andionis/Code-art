// «Pero si caen desde muy poca altura, no les da tiempo a girar. Por eso es «casi» siempre.»
// Corte en «Pero»: la sala; un gato duerme panza arriba en el borde de un sofá bajo. «caen»: resbala del borde; «muy
// poca altura»: cae, empieza a girar la mitad de delante y en «tiempo» se da contra la alfombra de lado, con un golpe.
// «girar»: se queda tumbado, ofendido. «casi»: se levanta de mal humor y se sacude; reposa antes del corte en «Así».
import * as k from "#kit";
import { v } from "#voz";
import { gato, sala, sofa, polvo, veloArriba } from "../mundo.js";

export const desde = "pero#2";
const { suave: su, tramo: tr, mez, claves } = k;
const PI = Math.PI;
const f10 = v.frase(10);
const Tcaen = f10.t("caen"), Tpoca = f10.t("poca"), Ttiem = f10.t("tiempo"), Tgir = f10.t("girar"), Tcasi = f10.t("casi"), Tfin = f10.fin;
const Tres = Tpoca + 0.2, Tgolpe = Ttiem + 0.05;
export const momentos = { resbala: Tres, golpe: Tgolpe, levanta: Tcasi - 0.1 };
const YA = 1180; // el asiento
const S = 0.85;

// otra sala: pared mostaza con un cuadro y una lámpara (no la de los gatitos)
const PARED = (() => {
  const c = k.lienzo(1080, 1270), g = c.getContext("2d");
  const gr = g.createLinearGradient(0, 0, 0, 1270); gr.addColorStop(0, "#c9792a"); gr.addColorStop(1, "#f0b552");
  g.fillStyle = gr; g.fillRect(0, 0, 1080, 1270);
  g.fillStyle = "rgba(255,255,255,0.06)"; for (let y = 0; y < 1270; y += 70) g.fillRect(0, y, 1080, 28);
  // el cuadro: un pez
  g.fillStyle = "#5a3418"; g.fillRect(160, 560, 330, 250); g.fillStyle = "#8fd3e8"; g.fillRect(180, 580, 290, 210);
  g.fillStyle = "#ff8a3d"; g.beginPath(); g.ellipse(320, 690, 80, 42, 0, 0, Math.PI * 2); g.fill();
  g.beginPath(); g.moveTo(240, 690); g.lineTo(195, 655); g.lineTo(195, 725); g.closePath(); g.fill();
  g.fillStyle = "#222"; g.beginPath(); g.arc(365, 680, 7, 0, Math.PI * 2); g.fill();
  return k.fijar(c);
})();
function lampara(g) {
  g.fillStyle = "#3b2414"; g.fillRect(905, 700, 12, 570); g.fillRect(860, 1250, 100, 20);
  const gl = g.createLinearGradient(0, 600, 0, 720); gl.addColorStop(0, "#fff1c4"); gl.addColorStop(1, "#f6c35b");
  g.fillStyle = gl; g.beginPath(); g.moveTo(855, 720); g.lineTo(965, 720); g.lineTo(935, 600); g.lineTo(885, 600); g.closePath(); g.fill();
  k.brillo(g, 910, 700, 700, "255,210,130", 0.5);
}

export function dibuja(g, t) {
  sala(g);
  g.drawImage(PARED, 0, 0);
  lampara(g);
  sofa(g, 300, YA, 640);
  // el gato: en el borde (x 600), resbala hacia la derecha y cae a la alfombra (y 1600)
  const x = claves([[0, 380], [Tcaen, 380], [Tres, 520], [Tgolpe, 540]])(t);
  const cayendo = tr(t, Tres, Tgolpe);
  const y = t < Tres ? YA - 150 : t < Tgolpe ? mez(YA - 150, 1560, cayendo * cayendo) : 1560;
  const rf = t < Tres ? PI : t < Tgolpe ? mez(PI, PI * 0.6, su(cayendo)) : PI * 0.6;
  const rb = t < Tgolpe ? PI : PI * 0.75;
  const ang = t < Tres ? 0 : t < Tgolpe ? 0.5 * cayendo : 0.25;
  const golpe = k.pulso(t, Tgolpe + 0.04, 0.06);
  // se levanta en «casi»
  const lev = su(tr(t, Tcasi - 0.1, Tcasi + 0.45));
  const sac = Math.sin(PI * 6 * tr(t, Tcasi + 0.5, Tcasi + 1.0)) * (1 - tr(t, Tcasi + 0.5, Tcasi + 1.0));
  const RF = mez(rf, 0, lev), RB = mez(rb, 0, lev), A = mez(ang, 0, lev) + 0.06 * sac;
  const Y = mez(y, 1560 - 210, lev) + 14 * golpe;
  gato(g, x, Y, S, A, RF, RB, t < Tgolpe ? 0.5 : 0.35 * (1 - lev), t < Tgolpe ? 0.5 : 0.35 * (1 - lev), 0, t * (t < Tres ? 0.3 : 1),
    { agita: t > Tres && t < Tgolpe ? 1 : 0, ojos: t < Tcaen + 0.2 ? 0.12 : t > Tgolpe + 0.15 && lev < 1 ? 0.45 : 1 });
  polvo(g, x + 40, 1660, tr(t, Tgolpe, Tgolpe + 0.6), 380);
  veloArriba(g, 1.6);
}
