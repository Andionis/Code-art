// «Así que la policía llamó a declarar a Picasso, aunque ninguno de los dos tenía la Mona Lisa.»
// La sala de interrogatorios: una lámpara que se balancea sobre una mesa; enfrente, Picasso y el poeta, de pie.
// «aunque ninguno…»: entre ellos aparece un marco de oro vacío con un «?»: la Mona Lisa no está.
import * as k from "#kit";
import { v } from "#voz";
import { persona, marcoOro, fondoCuarto, veloArriba } from "../mundo.js";

export const desde = (vz) => vz.frase(13).inicio;
const { suave: su, tramo: tr, mez } = k;
const f = v.frase(13);
const T0 = f.inicio, Tdec = f.t("declarar"), Tpic = f.t("picasso"), Tnin = f.t("ninguno"), Tmon = f.t("mona"), Fin = f.fin;
export const marco = Tnin + 0.1, pregunta = Tmon;

export function dibuja(g, t) {
  fondoCuarto(g, "#2c2a24", "#060504", 540, 760);
  const z = mez(1, 1.12, su(tr(t, T0, Fin)));
  g.save(); g.translate(540, 1000); g.scale(z, z); g.translate(-540, -1000);
  // la lámpara se balancea
  const ang = Math.sin((t - T0) * 2.4) * 0.12 * (0.6 + 0.4 * k.pulso(t, Tpic, 0.6));
  const lx = 540 + Math.sin(ang) * 520, ly = 520 + Math.cos(ang) * 120;
  g.strokeStyle = "#111"; g.lineWidth = 6; g.beginPath(); g.moveTo(540, 0); g.lineTo(lx, ly); g.stroke();
  g.fillStyle = "#2a3a2a"; g.beginPath(); g.moveTo(lx - 110, ly + 70); g.lineTo(lx + 110, ly + 70); g.lineTo(lx + 40, ly); g.lineTo(lx - 40, ly); g.closePath(); g.fill();
  g.save(); g.globalCompositeOperation = "lighter";
  const cono = g.createLinearGradient(0, ly + 70, 0, 1700); cono.addColorStop(0, "rgba(255,230,170,0.35)"); cono.addColorStop(1, "rgba(255,230,170,0.02)");
  g.fillStyle = cono; g.beginPath(); g.moveTo(lx - 100, ly + 70); g.lineTo(lx + 100, ly + 70); g.lineTo(lx + 600, 1750); g.lineTo(lx - 600, 1750); g.closePath(); g.fill();
  g.restore();
  // los dos, de pie a cada lado
  persona(g, 230, 1700, 1000, { ropa: "#1c1c22", luz: 0.6 });
  persona(g, 850, 1700, 1000, { sombrero: "bombin", ropa: "#22201a", luz: 0.6 });
  // la mesa
  const m = g.createLinearGradient(0, 1500, 0, 1580); m.addColorStop(0, "#6a4626"); m.addColorStop(1, "#2a160a");
  g.fillStyle = m; g.fillRect(120, 1500, 840, 80); g.fillStyle = "#1a0e06"; g.fillRect(170, 1580, 40, 260); g.fillRect(870, 1580, 40, 260);
  g.restore();
  // las etiquetas
  const e = su(tr(t, Tpic - 0.1, Tpic + 0.2)) * (1 - su(tr(t, marco - 0.2, marco + 0.1)));
  if (e > 0) { k.etiqueta(g, 60, 1760, "Picasso", "255,220,150", e, 60); k.etiqueta(g, 640, 1760, "el poeta", "255,220,150", e, 60); }
  // el marco vacío con su «?»
  const mU = k.entra(tr(t, marco, marco + 0.45));
  if (mU > 0) {
    const h = 520 * mU, w = h * 0.688;
    g.save(); g.globalAlpha = Math.min(1, mU * 1.5);
    marcoOro(g, 540 - w / 2, 1060 - h / 2, w, h, 40 * mU);
    g.fillStyle = "#1a1612"; g.fillRect(540 - w / 2, 1060 - h / 2, w, h);
    const q = su(tr(t, pregunta - 0.1, pregunta + 0.2));
    g.fillStyle = `rgba(255,70,60,${q})`; g.font = "800 300px Figtree"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("?", 540, 1075);
    g.restore();
  }
  veloArriba(g, 0.4);
}
