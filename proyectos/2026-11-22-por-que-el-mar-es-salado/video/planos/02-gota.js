// «Al caer, cada gota atrapa un poco del aire y se vuelve un poquito ácida, como el agua con gas.»
// Sigue con la gota que llegó a la cámara en el plano anterior (sin corte): la cámara se aleja y cae con ella.
// - «Al caer»: la gota, grande en el centro, cae; las nubes y la lluvia pasan hacia arriba.
// - «aire»: hilos de aire se enroscan y entran en la gota, con burbujitas que se quedan dentro.
// - «ácida»: la gota se tiñe de verde limón.
// - «gas»: dentro, las burbujas suben como en un vaso de agua con gas; frenan antes del corte.
import * as k from "#kit";
import { v } from "#voz";
import { nube, velo } from "../mundo.js";
import { gotaGrande } from "./01-hook.js";

export const desde = () => v.frase(3).inicio;
export const entrada = "sigue";

const { suave: su, tramo: tr, mez, claves, azar } = k;
const f3 = v.frase(3);
const T0 = f3.inicio, Taire = f3.t("aire"), Tacida = f3.t("acida"), Tcomo = f3.t("como"), Tgas = f3.t("gas"), Tfin = v.frase(4).inicio;
export const momentos = { aire: Taire, acida: Tacida, gas: Tcomo, fin: Tfin };

const radio = claves([[T0, 1300], [T0 + 0.55, 470], [Taire, 455], [Tfin, 440]]);
const CY = 1150;
const yGota = (t) => CY + 14 * Math.sin((t - T0) * 2.3);

// el cielo que pasa hacia arriba: nubes [x, y0, ancho, semilla] y la lluvia de alrededor
const az = azar(808);
const NUBES = Array.from({ length: 9 }, (_, i) => [az() * 1080, i * 520 + az() * 200, 700 + az() * 500, 30 + i]);
const RAYAS = Array.from({ length: 70 }, () => ({ x: az() * 1080, y0: az() * 2200, v: 300 + az() * 600, l: 40 + az() * 60 }));
const OTRAS = Array.from({ length: 6 }, (_, i) => ({ x: [130, 950, 220, 880, 90, 1000][i], y0: az() * 2600, v: (az() < 0.5 ? -1 : 1) * (350 + az() * 500), r: 40 + az() * 60 }));
// el aire que entra: hilos que se enroscan desde los lados
const HILOS = Array.from({ length: 7 }, (_, i) => ({ lado: i % 2 ? 1 : -1, y: 820 + az() * 480, fase: az() * 6, d: i * 0.12 }));
// las burbujas: dónde están dentro de la gota (relativo al radio), y su velocidad
const BURBUJAS = Array.from({ length: 70 }, () => ({ x: (az() - 0.5) * 1.5, y0: az(), r: 0.012 + az() * 0.03, v: 0.35 + az() * 0.4, nace: az() }));

// antes del corte todo frena y reposa: el tiempo de lo que se mueve se para poco a poco
const TS = Tfin - 0.4, DS = 0.3;
const lento = (t) => { const d = t - TS; return d <= 0 ? t : TS + Math.min(d, DS) - Math.min(d, DS) ** 2 / (2 * DS); };

export function dibuja(g, t0) {
  const t = lento(t0);
  // el cielo de tormenta, cayendo (todo sube)
  const gr = g.createLinearGradient(0, 0, 0, 1920);
  gr.addColorStop(0, "#26324a"); gr.addColorStop(0.6, "#3c4c66"); gr.addColorStop(1, "#5c6f8a");
  g.fillStyle = gr; g.fillRect(0, 0, 1080, 1920);
  const cae = (t - T0) * 900;
  for (const n of NUBES) {
    const y = 2200 - ((n[1] + cae) % 2700);
    nube(g, n[0], y, n[2], 0.75, 0.75, n[3]);
  }
  g.save(); g.lineCap = "round";
  for (const q of RAYAS) {
    const y = 2100 - ((q.y0 + (t - T0) * q.v) % 2300);
    g.strokeStyle = "rgba(220,235,255,0.35)"; g.lineWidth = 2.5;
    g.beginPath(); g.moveTo(q.x, y); g.lineTo(q.x - q.l * 0.1, y + q.l); g.stroke();
  }
  g.restore();

  // otras gotas que caen al lado, unas más deprisa y otras más despacio que la nuestra
  for (const o of OTRAS) {
    const yy = ((((o.y0 + (t - T0) * o.v) % 2600) + 2600) % 2600) - 300;
    gotaGrande(g, o.x, yy, o.r);
  }
  const r = radio(t), x = 540, y = yGota(t);
  // los hilos de aire que entran
  // la gota, que se tiñe de ácida
  const acida = su(tr(t, Tacida - 0.45, Tacida + 0.3));
  gotaGrande(g, x, y, r);
  if (acida > 0) {
    g.save(); g.globalAlpha = 0.55 * acida; g.globalCompositeOperation = "source-atop";
    camino(g, x, y, r); g.clip();
    const ag = g.createRadialGradient(x - r * 0.3, y - r * 0.2, r * 0.1, x, y, r * 1.3);
    ag.addColorStop(0, "rgba(235,255,170,1)"); ag.addColorStop(1, "rgba(120,200,60,1)");
    g.fillStyle = ag; g.fillRect(x - r * 1.2, y - r * 1.6, r * 2.4, r * 2.8);
    g.restore();
    k.brillo(g, x, y, r * 2.5, "200,255,140", 0.2 * k.pulso(t, Tacida + 0.1, 0.35));
  }
  const aire = tr(t, Taire - 0.75, Taire + 0.95);
  if (aire > 0 && aire < 1) for (const h of HILOS) {
    const u = Math.min(1, Math.max(0, (aire - h.d) / 0.8));
    if (u <= 0 || u >= 1) continue;
    const cab = Math.min(1, u * 1.5), cola = Math.max(0, cab - 0.55);
    if (cab - cola < 0.01) continue;
    const al = Math.min(1, (1 - u) * 4);
    const punto = (p) => [x + h.lado * mez(640, 0, p) + 30 * Math.sin(p * 9 + h.fase) * (1 - p), mez(h.y, y, p) + 90 * Math.sin(p * 6 + h.fase) * (1 - p)];
    g.save(); g.lineCap = "round"; g.lineJoin = "round";
    for (const [w, c] of [[46, `rgba(170,220,255,${0.3 * al})`], [16, `rgba(240,250,255,${0.85 * al})`]]) {
      g.strokeStyle = c; g.lineWidth = w; g.beginPath();
      for (let i = 0; i <= 30; i++) { const [px, py] = punto(mez(cola, cab, i / 30)); i ? g.lineTo(px, py) : g.moveTo(px, py); }
      g.stroke();
    }
    g.restore();
  }

  // las burbujas dentro: unas pocas desde «aire»; muchas y subiendo deprisa en «gas»
  const pocas = su(tr(t, Taire + 0.3, Taire + 1.0)), gas = su(tr(t, Tcomo, Tgas)) * (1 - 0.6 * su(tr(t, Tgas + 0.3, Tfin - 0.15)));
  g.save(); camino(g, x, y, r); g.clip();
  BURBUJAS.forEach((b, i) => {
    const vis = i < 14 ? pocas : su(Math.min(1, Math.max(0, gas * 1.3 - b.nace * 0.3)));
    if (vis <= 0.01) return;
    const subir = (t - T0) * b.v * (0.15 + 1.1 * gas);
    const yy = y + r * (1.05 - ((b.y0 + subir) % 1.0) * 2.3), xx = x + b.x * r * 0.55 + 6 * Math.sin(t * 5 + i);
    const br = r * b.r * 2.2;
    g.strokeStyle = `rgba(255,255,255,${0.85 * vis})`; g.lineWidth = Math.max(1.5, br * 0.22);
    g.fillStyle = `rgba(255,255,255,${0.18 * vis})`;
    g.beginPath(); g.arc(xx, yy, br, 0, Math.PI * 2); g.fill(); g.stroke();
    g.fillStyle = `rgba(255,255,255,${0.9 * vis})`; g.beginPath(); g.arc(xx - br * 0.35, yy - br * 0.35, br * 0.25, 0, Math.PI * 2); g.fill();
  });
  g.restore();
  velo(g, 0.35);
}

function camino(g, x, y, r) {
  g.beginPath();
  g.moveTo(x, y - r * 1.5);
  g.bezierCurveTo(x + r * 0.35, y - r * 0.9, x + r, y - r * 0.4, x + r, y + r * 0.1);
  g.arc(x, y + r * 0.1, r, 0, Math.PI, false);
  g.bezierCurveTo(x - r, y - r * 0.4, x - r * 0.35, y - r * 0.9, x, y - r * 1.5);
  g.closePath();
}
