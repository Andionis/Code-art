// «¿Y el verde? Son tus defensas: glóbulos blancos que mueren luchando y sueltan una sustancia con hierro, que es verde.»
// El moco por dentro. Corte en «¿Y».
// - «¿Y el verde?»: una bola de moco verde enorme, brillante; la cámara se lanza dentro.
// - «Son tus defensas»: dentro, el moco claro con virus flotando; llegan glóbulos blancos (blancos, blanditos, con su
//   núcleo morado) y cada uno se traga un virus.
// - «mueren luchando»: los glóbulos blancos revientan, uno tras otro.
// - «sustancia con hierro»: de cada uno sale una nube verde que brilla; «verde»: todo el moco se vuelve verde.
import * as k from "#kit";
import { v } from "#voz";
import { moco, velo, virus } from "../mundo.js";

export const desde = (vz) => vz.frase(11).inicio;

const { suave: su, tramo: tr, mez, azar, entra, pulso, claves } = k;
const f11 = v.frase(11);
const T0 = f11.inicio, Tver = f11.t("verde"), Tson = f11.t("son"), Tdef = f11.t("defensas"), Tglo = f11.t("globulos"), Tmue = f11.t("mueren"), Tlu = f11.t("luchando"), Tsue = f11.t("sueltan"), Thie = f11.t("hierro"), Tver2 = f11.t("verde", 2), Tfin = f11.fin;

const az = azar(1717);
const GB = [
  { x: 300, y: 820, vx: 270, vy: 1150 }, { x: 760, y: 900, vx: 600, vy: 1200 }, { x: 420, y: 1250, vx: 220, vy: 980 }, { x: 760, y: 1320, vx: 900, vy: 1100 },
].map((q, i) => ({ ...q, r: 120 + az() * 20, llega: mez(Tdef - 0.3, Tglo + 0.2, i / 3), revienta: mez(Tmue - 0.05, Tsue + 0.1, i / 3), sem: i + 70 }));
// cada glóbulo blanco va a por su virus (el virus está donde acaba el glóbulo)
const desdeFuera = [[-260, 600], [1340, 700], [-260, 1500], [1340, 1600]];
export const revientan = GB.map((q) => q.revienta);
const FONDO = Array.from({ length: 26 }, () => ({ x: az() * 1080, y: 500 + az() * 1100, r: 10 + az() * 30, ph: az() * 6 }));

const zoom = claves([[T0, 1], [Tver + 0.2, 1.4], [Tson + 0.05, 9]]);

function globulo(g, x, y, r, t, sem, rompe) {
  if (rompe >= 1) return;
  const azg = azar(sem), f = [azg() * 6, azg() * 6];
  g.save(); g.translate(x, y); g.scale(1 + 0.4 * rompe, 1 + 0.4 * rompe); g.globalAlpha *= 1 - rompe;
  g.beginPath();
  for (let i = 0; i <= 40; i++) { const a = (i / 40) * 6.2832, w = 1 + 0.08 * Math.sin(4 * a + t * 3 + f[0]) + 0.05 * Math.sin(7 * a - t * 4 + f[1]); i ? g.lineTo(Math.cos(a) * r * w, Math.sin(a) * r * w) : g.moveTo(Math.cos(a) * r * w, Math.sin(a) * r * w); }
  g.closePath();
  const gr = g.createRadialGradient(-r * 0.3, -r * 0.35, r * 0.1, 0, 0, r * 1.1);
  gr.addColorStop(0, "#ffffff"); gr.addColorStop(0.6, "#e9eef5"); gr.addColorStop(1, "#a7b2c4");
  g.fillStyle = gr; g.fill();
  g.save(); g.clip(); g.globalCompositeOperation = "multiply"; g.globalAlpha *= 0.25; g.drawImage(k.manchas, -r, -r, r * 2, r * 2); g.restore();
  // el núcleo de varios lóbulos, morado
  g.fillStyle = "#7a3fa8";
  for (const [dx, dy, s] of [[-0.25, -0.1, 0.24], [0.08, -0.22, 0.22], [0.22, 0.12, 0.23], [-0.08, 0.22, 0.2]]) { g.beginPath(); g.arc(dx * r, dy * r, s * r, 0, 6.2832); g.fill(); }
  g.fillStyle = "rgba(255,255,255,0.7)"; g.beginPath(); g.ellipse(-r * 0.4, -r * 0.5, r * 0.2, r * 0.1, -0.6, 0, 6.2832); g.fill();
  g.restore();
}

export function dibuja(g, t) {
  const Z = zoom(t), dentro = su(tr(t, Tson - 0.25, Tson + 0.05));
  const verde = su(tr(t, Tsue, Tver2 + 0.2));
  if (dentro < 1) {
    // la bola de moco verde, vista desde fuera, sobre la carne de la nariz
    const fg = g.createRadialGradient(540, 1000, 100, 540, 1000, 1200);
    fg.addColorStop(0, "#b0485c"); fg.addColorStop(1, "#3a0612");
    g.fillStyle = fg; g.fillRect(0, 0, 1080, 1920);
    g.save(); g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.35; g.drawImage(k.manchas, -200, -200, 1480, 2320); g.restore();
    g.save(); g.translate(540, 1000); g.scale(Z, Z);
    moco(g, 0, 0, 330 * entra(tr(t, T0 - 0.05, T0 + 0.3)), t, 5, { tono: 2, estira: 0.15 });
    g.restore();
    k.brillo(g, 540, 1000, 1500, "160,255,90", 0.3 * pulso(t, Tver + 0.1, 0.2));
  }
  if (dentro > 0) {
    g.save(); g.globalAlpha = dentro;
    const acerca = 1 + 0.22 * su(tr(t, Tsue, Tfin));
    g.translate(540, 1050); g.scale(acerca, acerca); g.translate(-540, -1050);
    // el moco por dentro: claro y dorado, que se vuelve verde
    const fg = g.createLinearGradient(0, 0, 0, 1920);
    fg.addColorStop(0, k.mezColor("#5d4a12", "#1f4a0c", verde)); fg.addColorStop(1, k.mezColor("#c9a640", "#5fae2a", verde));
    g.fillStyle = fg; g.fillRect(0, 0, 1080, 1920);
    g.save(); g.globalCompositeOperation = "lighter"; g.globalAlpha *= 0.3; g.drawImage(k.causticas, -200 + 25 * (t - T0), -200, 1500, 2400); g.restore();
    for (const b of FONDO) { g.strokeStyle = "rgba(255,255,220,0.25)"; g.lineWidth = 2; g.beginPath(); g.arc(b.x + 10 * Math.sin(t + b.ph), b.y - 15 * (t - T0), b.r, 0, 6.2832); g.stroke(); }
    // las nubes verdes de cada glóbulo que revienta
    for (const q of GB) {
      const u = tr(t, q.revienta, q.revienta + 1.4);
      if (u <= 0) continue;
      const R = mez(q.r * 0.8, q.r * 3.6, entra(u));
      const ng = g.createRadialGradient(q.vx, q.vy, 0, q.vx, q.vy, R);
      ng.addColorStop(0, `rgba(140,255,80,${0.75})`); ng.addColorStop(0.5, "rgba(80,210,40,0.5)"); ng.addColorStop(1, "rgba(60,180,30,0)");
      g.save(); g.globalCompositeOperation = "lighter"; g.fillStyle = ng; g.beginPath(); g.arc(q.vx, q.vy, R, 0, 6.2832); g.fill(); g.restore();
      k.brillo(g, q.vx, q.vy, q.r * 6, "200,255,140", 0.8 * pulso(t, q.revienta + 0.05, 0.1));
    }
    // los virus y los glóbulos blancos que van a por ellos
    GB.forEach((q, i) => {
      const u = entra(tr(t, q.llega, q.llega + 0.7)), [sx, sy] = desdeFuera[i];
      const x = mez(sx, q.vx, u), y = mez(sy, q.vy, u), traga = su(tr(t, q.llega + 0.6, q.llega + 1.0));
      const rompe = su(tr(t, q.revienta, q.revienta + 0.25));
      if (rompe < 1) virus(g, q.vx + 6 * Math.sin(t * 5 + i), q.vy, 50 * (1 - 0.45 * traga), t * 0.8 + i, 1 - 0.6 * traga);
      if (t > q.llega) globulo(g, x, y, q.r, t, q.sem, rompe);
      // al reventar, trocitos que salen
      if (rompe > 0 && rompe < 1) for (let j = 0; j < 10; j++) { const a = j * 0.63 + i, rr = q.r * (1 + 1.5 * rompe); g.fillStyle = `rgba(240,245,255,${1 - rompe})`; g.beginPath(); g.arc(q.vx + Math.cos(a) * rr, q.vy + Math.sin(a) * rr, 12 * (1 - rompe), 0, 6.2832); g.fill(); }
    });
    k.brillo(g, 540, 1050, 2400, "150,255,90", 0.45 * pulso(t, Tver2 + 0.1, 0.25));
    // «verde»: todo se tiñe
    g.save(); g.globalCompositeOperation = "lighter"; g.fillStyle = `rgba(60,170,30,${0.25 * su(tr(t, Thie, Tver2 + 0.3))})`; g.fillRect(0, 0, 1080, 1920); g.restore();
    g.restore();
  }
  velo(g, 0.55);
}

export const momentos = { lanza: Tver + 0.1, entra: Tson, llegan: GB.map((q) => q.llega + 0.6), revientan };
