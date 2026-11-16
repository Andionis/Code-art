// «En 1911 era un cuadro más del Louvre: la estrella del museo era la Venus de Milo.»
// El Salon de día, lleno de cuadros; la Mona Lisa, uno más; la gente pasa de largo. «estrella»: la cámara se va a la
// derecha hasta la Venus de Milo, blanca y con luz, rodeada de gente.
import * as k from "#kit";
import { v } from "#voz";
import { dibujaSalon, persona, MLX, MLY, SUELO, veloArriba } from "../mundo.js";

export const desde = (vz) => vz.frase(3).inicio;
const { suave: su, tramo: tr, mez } = k;
const f = v.frase(3);
const T0 = f.inicio, Tcua = f.t("cuadro"), Test = f.t("estrella"), Tven = f.t("venus"), Fin = f.fin;
export const llegaVenus = Tven;
const VX = 2330;

// La Venus de Milo: mármol, sin brazos, con el manto que cae desde la cadera. (x, y) = la base del pedestal, h = alto.
export function venus(g, x, y, h) {
  g.save(); g.translate(x, y); g.scale(h / 1000, h / 1000);
  const marmol = (x0, x1) => { const m = g.createLinearGradient(x0, 0, x1, 0); m.addColorStop(0, "#fffdf6"); m.addColorStop(0.45, "#efe8da"); m.addColorStop(1, "#a89e8c"); return m; };
  const sombra = (al) => `rgba(120,105,85,${al})`;
  // pedestal
  g.fillStyle = marmol(-200, 200); g.fillRect(-200, -260, 400, 260); g.fillStyle = "rgba(0,0,0,0.22)"; g.fillRect(-200, -260, 400, 20);
  g.fillStyle = marmol(-220, 220); g.fillRect(-220, -290, 440, 34);
  g.translate(0, -290);
  // el manto: de la cadera a los pies, con la rodilla izquierda que se adelanta
  g.fillStyle = marmol(-170, 170); g.beginPath();
  g.moveTo(-118, -500); g.bezierCurveTo(-150, -380, -175, -200, -165, 0); g.lineTo(150, 0);
  g.bezierCurveTo(160, -160, 150, -330, 120, -560); g.closePath(); g.fill();
  g.strokeStyle = sombra(0.55); g.lineWidth = 7; g.lineCap = "round";
  const pl = [[-100, -470, -140, -250, -130, -20], [-60, -480, -80, -260, -90, -10], [-15, -500, 10, -300, -30, -10], [40, -520, 70, -320, 40, -10], [90, -540, 110, -300, 110, -10]];
  for (const [a1, b1, c1, d1, e1, f1] of pl) { g.beginPath(); g.moveTo(a1, b1); g.quadraticCurveTo(c1, d1, e1, f1); g.stroke(); }
  g.fillStyle = "rgba(255,255,255,0.35)"; g.beginPath(); g.ellipse(-70, -280, 40, 110, 0.1, 0, Math.PI * 2); g.fill();
  // el rollo del manto en la cadera, en diagonal
  g.fillStyle = marmol(-140, 140); g.beginPath(); g.moveTo(-135, -470); g.quadraticCurveTo(0, -530, 128, -585); g.lineTo(122, -535); g.quadraticCurveTo(0, -470, -130, -425); g.closePath(); g.fill();
  g.strokeStyle = sombra(0.5); g.lineWidth = 5; g.beginPath(); g.moveTo(-130, -440); g.quadraticCurveTo(0, -495, 124, -550); g.stroke();
  // el torso, un poco girado (contrapposto)
  g.fillStyle = marmol(-110, 110); g.beginPath();
  g.moveTo(-112, -470); g.bezierCurveTo(-100, -560, -70, -600, -88, -680);
  g.bezierCurveTo(-110, -760, -115, -800, -100, -840); g.quadraticCurveTo(0, -870, 105, -830);
  g.bezierCurveTo(118, -780, 100, -720, 85, -680); g.bezierCurveTo(70, -620, 110, -600, 125, -560); g.closePath(); g.fill();
  // el pecho y el ombligo, con su sombra suave
  g.fillStyle = sombra(0.22); g.beginPath(); g.ellipse(-45, -735, 34, 26, 0, 0, Math.PI); g.fill(); g.beginPath(); g.ellipse(48, -730, 34, 26, 0, 0, Math.PI); g.fill();
  g.beginPath(); g.ellipse(5, -590, 6, 9, 0, 0, Math.PI * 2); g.fill();
  g.fillStyle = sombra(0.18); g.beginPath(); g.ellipse(70, -690, 30, 120, 0.05, 0, Math.PI * 2); g.fill();
  // los hombros con los muñones de los brazos
  g.fillStyle = marmol(-150, -60); g.beginPath(); g.ellipse(-112, -815, 42, 34, 0.5, 0, Math.PI * 2); g.fill();
  g.fillStyle = marmol(60, 160); g.beginPath(); g.ellipse(112, -812, 40, 50, -0.2, 0, Math.PI * 2); g.fill();
  g.fillStyle = sombra(0.35); g.beginPath(); g.ellipse(-130, -800, 18, 16, 0.5, 0, Math.PI * 2); g.fill(); g.beginPath(); g.ellipse(120, -775, 18, 14, 0, 0, Math.PI * 2); g.fill();
  // cuello y cabeza, girada hacia su izquierda, con el moño
  g.fillStyle = marmol(-35, 35); g.fillRect(-26, -905, 52, 75);
  g.beginPath(); g.ellipse(-8, -955, 50, 60, -0.15, 0, Math.PI * 2); g.fill();
  g.fillStyle = "#e2d9c8"; g.beginPath(); g.ellipse(-4, -990, 52, 32, -0.15, Math.PI, Math.PI * 2); g.fill();
  g.beginPath(); g.arc(22, -998, 26, 0, Math.PI * 2); g.fill();
  g.fillStyle = sombra(0.3); g.beginPath(); g.ellipse(22, -950, 16, 44, -0.15, 0, Math.PI * 2); g.fill();
  g.restore();
}

// la gente que pasa por delante: cada una con su paso
const GENTE = [
  { x0: 600, v: 230, s: "dama", r: "#2a1a2a", h: 560, f: 0 },
  { x0: 300, v: 260, s: "bombin", r: "#16161c", h: 600, f: 1 },
  { x0: 950, v: 210, s: "dama", r: "#1e2a3a", h: 540, f: 2 },
  { x0: 1150, v: 250, s: "bombin", r: "#2a2016", h: 590, f: 3 },
  { x0: 50, v: 240, s: "dama", r: "#3a1a1a", h: 550, f: 4 },
];
const ALREDEDOR = [[-260, "bombin", "#15151a", 600], [-150, "dama", "#2a1a2a", 560], [210, "dama", "#1a2a2a", 545], [320, "bombin", "#20180f", 610], [-380, "bombin", "#1a1a20", 590]];

function cam(t) {
  const u = su(tr(t, Test - 0.2, Tven + 0.1));
  return { cx: mez(MLX - 120, VX, u) + (Math.min(t, Fin - 0.25) - T0) * 15, cy: mez(MLY + 100, 1150, u), z: mez(0.82, 0.95, u) };
}

export function dibuja(g, t) {
  const c = cam(t);
  dibujaSalon(g, c.cx, c.cy, c.z, {
    mona: {},
    encima: (g2) => {
      // la Venus, con su luz
      k.brillo(g2, VX, SUELO - 500, 1400, "255,240,210", 0.45);
      venus(g2, VX, SUELO + 60, 950);
      // la gente que la rodea, mirándola
      for (const [dx, s, r, h] of ALREDEDOR) persona(g2, VX + dx * 1.2, SUELO + 260 + Math.abs(dx) * 0.08, h * 0.9, { sombrero: s, ropa: r, paso: 0, anda: 0, luz: 0.3 });
      // la gente que pasa delante de la Mona Lisa sin mirarla, hacia la derecha
      for (const p of GENTE) {
        const tt = Math.min(t, Fin - 0.25), anda = 1 - su(tr(t, Fin - 0.6, Fin - 0.25));
        const x = p.x0 + 800 + (tt - T0) * p.v;
        persona(g2, x, SUELO + 200, p.h, { sombrero: p.s, ropa: p.r, anda, paso: (tt - T0) * 6 + p.f, luz: 0.25 });
      }
    },
  });
  veloArriba(g, 0.4);
}
