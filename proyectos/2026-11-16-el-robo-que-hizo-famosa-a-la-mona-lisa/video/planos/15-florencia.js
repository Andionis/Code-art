// «Pero en vez de regalarla a un museo, intentó vendérsela a un comerciante de arte en Florencia. / El comerciante
// llamó al director de un museo, comprobaron que era la de verdad… y avisaron a la policía.»
// Un cuarto de hotel en Florencia, con la cúpula de la catedral en la ventana. Sobre la mesa, la Mona Lisa; el
// ladrón la empuja hacia el comerciante y aparece un fajo de billetes. Llega el director con una lupa: en la parte de
// atrás, el sello del Louvre; «verdad»: brilla. «policía»: la puerta se abre de golpe y entra la luz con los policías.
import * as k from "#kit";
import { v } from "#voz";
import { persona, monaEnMarco, ML_W, ML_H, oscuridad, veloArriba } from "../mundo.js";

export const desde = (vz) => vz.frase(19).inicio;
const { suave: su, tramo: tr, mez } = k;
const f19 = v.frase(19), f20 = v.frase(20);
const T0 = f19.inicio, Treg = f19.t("regalarla"), Tven = f19.t("vendersela"), Tflo = f19.t("florencia"), Tdir = f20.t("director"), Tcom = f20.t("comprobaron"), Tver = f20.t("verdad"), Tavi = f20.t("avisaron"), Fin = f20.fin;
export const empuja = Tven - 0.1, billetes = Tven + 0.15, gira = Tcom - 0.3, sello = Tver - 0.05, puerta = Tavi - 0.05;

function cupula(g, x, y, s, luz) {
  g.save(); g.translate(x, y); g.scale(s, s);
  g.fillStyle = `rgba(${Math.round(mez(60, 200, luz))},${Math.round(mez(40, 110, luz))},${Math.round(mez(40, 70, luz))},1)`;
  g.beginPath(); g.moveTo(-160, 0); g.quadraticCurveTo(-150, -230, 0, -260); g.quadraticCurveTo(150, -230, 160, 0); g.closePath(); g.fill();
  g.fillRect(-25, -320, 50, 70); g.fillRect(-200, 0, 400, 120); g.fillRect(260, -260, 70, 380);
  g.strokeStyle = "rgba(255,255,255,0.4)"; g.lineWidth = 6; for (const dx of [-80, 0, 80]) { g.beginPath(); g.moveTo(dx, -5); g.quadraticCurveTo(dx * 0.6, -200, 0, -255); g.stroke(); }
  g.restore();
}

export function dibuja(g, t) {
  const z = mez(1, 1.12, su(tr(t, T0, Fin)));
  g.save(); g.translate(540, 1100); g.scale(z, z); g.translate(-540, -1100);
  // la pared y la ventana con la cúpula al atardecer
  const gr = g.createLinearGradient(0, 0, 0, 1920); gr.addColorStop(0, "#5a3a2a"); gr.addColorStop(1, "#24140c");
  g.fillStyle = gr; g.fillRect(0, 0, 1080, 1920);
  const cielo = g.createLinearGradient(0, 560, 0, 1000); cielo.addColorStop(0, "#f0a060"); cielo.addColorStop(1, "#f6d8a0");
  g.fillStyle = cielo; g.fillRect(620, 560, 400, 440);
  const fl = su(tr(t, Tflo - 0.2, Tflo + 0.3));
  cupula(g, 800, 990, 0.95, 0.3);
  if (fl > 0) k.brillo(g, 820, 820, 500, "255,190,120", 0.6 * fl * (1 - 0.6 * tr(t, Tflo + 0.4, Tflo + 1.2)));
  g.strokeStyle = "#3a2010"; g.lineWidth = 22; g.strokeRect(620, 560, 400, 440); g.beginPath(); g.moveTo(820, 560); g.lineTo(820, 1000); g.stroke();
  // el comerciante (derecha) y el ladrón (izquierda), de pie
  persona(g, 860, 1720, 1080, { sombrero: "bombin", ropa: "#2a2420", luz: 0.5 });
  persona(g, 190, 1720, 1050, { sombrero: "gorra", ropa: "#1e1e24", luz: 0.4 });
  // el director, que llega en «director» por la derecha
  const di = su(tr(t, Tdir - 0.5, Tdir + 0.2));
  if (di > 0) persona(g, mez(1300, 720, di), 1760, 1120, { sombrero: "bombin", ropa: "#141418", anda: di < 1 ? 1 : 0, paso: t * 6, luz: 0.5 });
  // la mesa
  const m = g.createLinearGradient(0, 1400, 0, 1470); m.addColorStop(0, "#7a5230"); m.addColorStop(1, "#3a2010");
  g.fillStyle = m; g.fillRect(60, 1400, 960, 70); g.fillStyle = "#24140a"; g.fillRect(110, 1470, 40, 400); g.fillRect(930, 1470, 40, 400);
  // el cuadro, sobre la mesa: se desliza hacia el comerciante; luego se gira para ver su parte de atrás
  const desl = su(tr(t, empuja, empuja + 0.5)), giro = su(tr(t, gira, gira + 0.45));
  const cx = mez(420, 600, desl), cy = 1170, h = 420;
  const ancho = Math.abs(Math.cos(giro * Math.PI)) || 0.001;
  g.save(); g.translate(cx, cy); g.scale(ancho, 1);
  if (giro < 0.5) monaEnMarco(g, 0, 0, h);
  else {
    const w = h * ML_W / ML_H;
    g.fillStyle = "#8a6a40"; g.fillRect(-w / 2, -h / 2, w, h);
    g.strokeStyle = "rgba(60,40,20,0.5)"; g.lineWidth = 3; for (let y = -h / 2 + 20; y < h / 2; y += 26) { g.beginPath(); g.moveTo(-w / 2, y); g.lineTo(w / 2, y + 4); g.stroke(); }
    // el sello del Louvre
    const sl = su(tr(t, sello - 0.4, sello));
    g.globalAlpha = 0.85; g.strokeStyle = "#7a1a1a"; g.lineWidth = 8; g.beginPath(); g.arc(0, 0, 80, 0, Math.PI * 2); g.stroke();
    g.fillStyle = "#7a1a1a"; g.font = "800 34px Figtree"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("LOUVRE", 0, 0);
    g.globalAlpha = 1;
    if (sl > 0) { k.brillo(g, 0, 0, 500, "120,255,140", 0.55 * k.pulso(t, sello + 0.1, 0.3) + 0.15 * sl); }
  }
  g.restore();
  // la lupa recorre el cuadro
  const lu = su(tr(t, Tcom - 0.5, Tcom)) * (1 - su(tr(t, Tavi - 0.3, Tavi)));
  if (lu > 0) {
    const lx = cx + Math.sin((t - Tcom) * 2) * 40, ly = cy + Math.cos((t - Tcom) * 1.6) * 30;
    g.save(); g.globalAlpha = lu;
    g.strokeStyle = "#c8a040"; g.lineWidth = 16; g.beginPath(); g.arc(lx, ly, 120, 0, Math.PI * 2); g.stroke();
    g.strokeStyle = "#3a2010"; g.lineWidth = 30; g.lineCap = "round"; g.beginPath(); g.moveTo(lx + 90, ly + 90); g.lineTo(lx + 230, ly + 230); g.stroke();
    g.fillStyle = "rgba(200,230,255,0.18)"; g.beginPath(); g.arc(lx, ly, 112, 0, Math.PI * 2); g.fill();
    g.restore();
  }
  // los billetes que pone el ladrón en la mesa (lo que pide)
  const bi = su(tr(t, billetes, billetes + 0.35)) * (1 - su(tr(t, Tdir - 0.3, Tdir)));
  if (bi > 0) {
    g.save(); g.globalAlpha = bi;
    for (let i = 0; i < 5; i++) { g.fillStyle = i % 2 ? "#8aa070" : "#9ab080"; g.save(); g.translate(250 + i * 6, 1385 - i * 10 - (1 - bi) * 80); g.rotate(-0.08 + i * 0.03); g.fillRect(-90, -20, 180, 40); g.strokeStyle = "#4a5a3a"; g.lineWidth = 3; g.strokeRect(-80, -14, 160, 28); g.restore(); }
    g.restore();
    k.etiqueta(g, 150, 1500, "EN VENTA", "255,220,150", bi, 58);
  }
  g.restore();
  // la puerta se abre de golpe: luz y policías
  const pu = k.entra(tr(t, puerta, puerta + 0.3));
  const luces = [{ x: 820, y: 780, r: 900, al: 0.9 }, { x: 540, y: 1200, r: 700, al: 0.8 }];
  oscuridad(g, luces, 0.45);
  if (pu > 0) {
    g.save(); g.globalCompositeOperation = "lighter"; k.brillo(g, 80, 1100, 1700, "255,240,210", 0.6 * pu); g.restore();
    persona(g, mez(-200, 120, pu), 1760, 1150, { sombrero: "kepi", ropa: "#141a2a", luz: 0.8 });
    persona(g, mez(-400, -40, pu), 1820, 1250, { sombrero: "kepi", ropa: "#10162a", luz: 0.8 });
  }
  veloArriba(g, 0.35);
}
