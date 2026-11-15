// «Así que soñar no es basura de tu cabeza: es tu cerebro entrenándote y curándote mientras duermes.»
// «Envíaselo a un amigo que le pueda interesar.»
// El cuarto otra vez, con la burbuja del sueño sobre la cabeza.
// - «no es basura»: la burbuja se hincha y brilla dorada; la cámara se acerca.
// - «entrenándote»: dentro, en la calle de la pesadilla, él salta la grieta y deja atrás la sombra.
// - «curándote»: el sueño se vuelve un cielo azul en calma y el cuarto se llena de luz cálida.
// - «mientras duermes» y el cierre: la cámara se aleja, sale por la ventana y se ve el edificio y la ciudad: en cada
//   ventana, alguien duerme con su burbuja de sueño encendida.
import * as k from "#kit";
import { v } from "#voz";
import { RS, TAU, burbuja, cama, camino2D, corredor, cuarto, reloj, sueno, velo, vineta, vista } from "../mundo.js";
import { SUELO, calma, fondoCalle, sombra } from "../suenos.js";

const f10 = v.frase(10), f11 = v.frase(11);
export const desde = (vv) => vv.frase(10).inicio;
const { suave: su, tramo: tr, mez, azar } = k;
const T0 = f10.inicio, Tbas = f10.t("basura"), Tent = f10.t("entrenandote"), Tcur = f10.t("curandote"), Tmie = f10.t("mientras"), Tdue = f10.t("duermes");
const Tenv = f11.inicio, Tami = f11.t("amigo"), Tfin = f11.fin;
const B = [560, 800], RB = 280;

const cam = camino2D([
  [T0 - 0.05, [1.0, 540, 960]],
  [Tent - 0.2, [1.45, 560, 830]],
  [Tcur + 0.4, [1.45, 560, 830]],
  [Tdue + 0.1, [0.9, 540, 960]],
  [Tami + 0.2, [0.16, 540, 1000]],
  [Tfin + 0.8, [0.105, 540, 1000]],
]);
const calido = (t) => su(tr(t, Tcur - 0.1, Tcur + 0.6));
const salto = (t) => tr(t, Tent - 0.1, Tent + 0.75);

function suenoFinal(g, t) {
  const c = su(tr(t, Tcur - 0.15, Tcur + 0.45));
  if (c < 1) {
    if (t < Tent - 0.6) sueno(g, t, 300 + t * 150);
    else {
      // la calle: él salta la grieta y la sombra se queda atrás
      const u = salto(t), av = t * 520;
      fondoCalle(g, t, av, { grieta: 0.75, xg: 120 });
      sombra(g, mez(-300, -620, su(u)), 760, t, 1);
      const sy = -Math.sin(Math.min(1, u) * Math.PI) * 300;
      corredor(g, mez(-120, 380, su(u)), SUELO + sy, 520, t * 1.9, { miedo: 0 });
    }
    // del sueño de las islas a la calle, un fundido dentro de la burbuja
    const f = su(tr(t, Tent - 0.75, Tent - 0.5));
    if (t < Tent - 0.5 && f > 0) { g.save(); g.globalAlpha *= f; fondoCalle(g, t, t * 520, { grieta: 0.75, xg: 120 }); g.restore(); }
  }
  if (c > 0) { g.save(); g.globalAlpha *= c; calma(g, t, { sol: 0.6 + 0.4 * c }); g.restore(); }
}

// las otras ventanas del edificio y de la ciudad: cada una con alguien que duerme y su burbuja
const azV = azar(515);
const VENTANAS = [];
for (let i = -5; i <= 5; i++) for (let j = -4; j <= 4; j++) if (i || j) VENTANAS.push({ i, j, c: ["200,160,255", "255,170,120", "120,210,255", "255,140,200", "150,255,190"][Math.floor(azV() * 5)], f: azV() * TAU, on: azV() < 0.8 });
const DX = 1700, DY = 2700, HUECO = [-60, -60, 1200, 2040];
function ciudad(g, t, al) {
  if (al <= 0.01) return;
  g.save(); g.globalAlpha *= al;
  // la fachada, con el hueco de nuestra ventana
  g.beginPath(); g.rect(-12000, -14000, 24000, 28000); g.rect(HUECO[0], HUECO[1], HUECO[2], HUECO[3]);
  const fg = g.createLinearGradient(0, -14000, 0, 14000); fg.addColorStop(0, "#120a24"); fg.addColorStop(1, "#24123a");
  g.fillStyle = fg; g.fill("evenodd");
  g.save(); g.clip("evenodd"); g.globalCompositeOperation = "screen"; g.globalAlpha *= 0.06; g.drawImage(k.manchas, -12000, -14000, 24000, 28000); g.restore();
  for (const w of VENTANAS) {
    const x = HUECO[0] + w.i * DX, y = HUECO[1] + w.j * DY;
    g.fillStyle = w.on ? "#1a1c4a" : "#0a0a18"; g.fillRect(x, y, HUECO[2], HUECO[3]);
    g.strokeStyle = "#3a2a5a"; g.lineWidth = 60; g.strokeRect(x, y, HUECO[2], HUECO[3]);
    if (!w.on) continue;
    // la cama y alguien dormido, en sombra
    g.fillStyle = "#2a2c6a"; g.fillRect(x + 260, y + 1350, 900, 170); g.fillStyle = "#4a3cb0"; g.beginPath(); g.ellipse(x + 700, y + 1330, 330, 70, 0, Math.PI, TAU); g.fill();
    g.fillStyle = "#c88a72"; g.beginPath(); g.arc(x + 390, y + 1300, 70, 0, TAU); g.fill();
    // su burbuja
    const bx = x + 620, by = y + 820 + Math.sin(t * 1.3 + w.f) * 20;
    k.brillo(g, bx, by, 1300, w.c, 0.45);
    const bg = g.createRadialGradient(bx - 80, by - 90, 20, bx, by, 300); bg.addColorStop(0, `rgba(255,255,255,0.9)`); bg.addColorStop(0.5, `rgba(${w.c},0.85)`); bg.addColorStop(1, `rgba(${k.mezRgb(w.c, "40,20,80", 0.5)},0.9)`);
    g.fillStyle = bg; g.beginPath(); g.arc(bx, by, 290, 0, TAU); g.fill();
    g.strokeStyle = "rgba(255,245,255,0.9)"; g.lineWidth = 14; g.stroke();
  }
  g.restore();
}

export function dibuja(g, t) {
  const [Z, cx, cy] = cam(t);
  vista(g, Z, cx, cy);
  const cal = calido(t);
  // el cuarto (nuestra ventana), recortado al hueco cuando la cámara sale
  g.save(); g.beginPath(); g.rect(HUECO[0], HUECO[1], HUECO[2], HUECO[3]); g.clip();
  cuarto(g, t);
  reloj(g, 2.5, 0);
  cama(g, t, { cerebro: 0.5 + 0.3 * cal, ojos: 0.6 });
  const hincha = k.pulso(t, Tbas + 0.15, 0.35);
  burbuja(g, B[0], B[1], RB * (1 + 0.08 * hincha), (gg) => suenoFinal(gg, t), 1, 1 + hincha);
  for (const [u, r] of [[0.25, 14], [0.45, 22], [0.65, 32]]) {
    const x = mez(350, B[0] - 60, u), y = mez(1115, B[1] + RB * 0.75, u);
    g.fillStyle = "rgba(235,220,255,0.35)"; g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill(); g.strokeStyle = "rgba(255,240,255,0.85)"; g.lineWidth = 2.5; g.stroke();
  }
  // «curándote»: la luz cálida que llena el cuarto
  if (cal > 0) { g.save(); g.globalCompositeOperation = "lighter"; k.brillo(g, B[0], B[1], 1800, "255,200,120", 0.35 * cal); g.restore(); }
  g.restore();
  ciudad(g, t, su(tr(t, Tdue - 0.3, Tdue + 0.2)));
  vineta(g, 0.5);
  velo(g, 0.35);
}

export const momentos = { hincha: Tbas + 0.15, salto: Tent, cura: Tcur };
