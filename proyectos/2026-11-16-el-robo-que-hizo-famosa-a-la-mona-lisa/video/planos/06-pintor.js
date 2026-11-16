// «Nadie se dio cuenta hasta el día siguiente, cuando un pintor llegó a copiarla y encontró cuatro ganchos vacíos.»
// El Salon con la luz de la mañana: dos guardias pasan por delante del hueco sin mirarlo. Entra un pintor con su
// caballete, se para; la cámara se lanza a la pared: cuatro ganchos vacíos, que se encienden uno a uno.
import * as k from "#kit";
import { v } from "#voz";
import { dibujaSalon, persona, MLX, MLY, SUELO, GANCHOS, veloArriba } from "../mundo.js";

export const desde = (vz) => vz.frase(6).inicio;
const { suave: su, tramo: tr, mez } = k;
const f = v.frase(6);
const T0 = f.inicio, Tsig = f.t("siguiente"), Tpin = f.t("pintor"), Tcop = f.t("copiarla"), Tenc = f.t("encontro"), Tgan = f.t("ganchos"), Fin = f.fin;
export const gancho1 = Tgan - 0.05;
export const encienden = [0, 1, 2, 3].map((i) => gancho1 + i * 0.13);
export const lanza = Tenc - 0.1;

function cam(t) {
  const u = su(tr(t, lanza, Tgan - 0.1));
  return { cx: MLX + 120 * (1 - u), cy: mez(MLY + 230, MLY, u), z: mez(0.95, 1.65, u) };
}

function caballete(g, x, y, s) {
  g.save(); g.translate(x, y); g.scale(s, s);
  g.strokeStyle = "#6a4422"; g.lineWidth = 16; g.lineCap = "round";
  g.beginPath(); g.moveTo(-130, 0); g.lineTo(0, -620); g.lineTo(130, 0); g.moveTo(0, -620); g.lineTo(0, 30); g.stroke();
  g.fillStyle = "#e9e1cc"; g.fillRect(-120, -480, 240, 300); g.strokeStyle = "#8a6a44"; g.lineWidth = 8; g.strokeRect(-120, -480, 240, 300);
  g.restore();
}

export function dibuja(g, t) {
  const c = cam(t);
  dibujaSalon(g, c.cx, c.cy, c.z, {
    mona: null,
    encima: (g2) => {
      // dos guardias pasan sin mirar el hueco
      for (let i = 0; i < 2; i++) {
        const x = mez(MLX - 1100 - i * 260, MLX + 1300 - i * 260, tr(t, T0 - 0.4, Tsig + 0.9));
        persona(g2, x, SUELO + 220, 820, { sombrero: "kepi", ropa: "#1a2238", anda: 1, paso: (t - T0) * 6.5 + i * 1.7, luz: 0.3 });
      }
      // el pintor llega con su caballete y se para
      const ll = su(tr(t, Tpin - 0.6, Tcop + 0.1)), px = mez(MLX - 1150, MLX - 330, ll);
      if (t > Tpin - 0.7) {
        caballete(g2, px + 230, SUELO + 210, 1.15);
        persona(g2, px, SUELO + 240, 860, { sombrero: "bombin", ropa: "#2a2018", anda: ll < 1 ? 1 : 0, paso: (t - Tpin) * 6.5, luz: 0.35 });
      }
    },
  });
  // la luz cálida de la mañana
  g.save(); g.globalCompositeOperation = "lighter";
  k.brillo(g, 200, 300, 1500, "255,200,140", 0.18);
  g.restore();
  // los cuatro ganchos se encienden uno a uno
  for (let i = 0; i < 4; i++) {
    const [gx, gy] = GANCHOS[i], x = 540 + (gx - c.cx) * c.z, y = 960 + (gy - c.cy) * c.z;
    const e = su(tr(t, encienden[i], encienden[i] + 0.15));
    if (e > 0) {
      k.brillo(g, x, y, 260, "255,200,120", 0.7 * e);
      g.strokeStyle = `rgba(255,70,60,${0.9 * e})`; g.lineWidth = 9; g.beginPath(); g.arc(x, y, mez(120, 62, e), 0, Math.PI * 2); g.stroke();
    }
  }
  veloArriba(g, 0.35);
}
