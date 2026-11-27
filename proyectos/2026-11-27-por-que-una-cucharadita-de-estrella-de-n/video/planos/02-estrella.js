// «Todo empieza con una estrella gigante, mucho más grande que el Sol, que se queda sin combustible. Su centro ya no
// aguanta su propio peso, y en menos de un segundo se desploma.»
// El espacio. Una sola cámara, que se aleja de la gigante.
// - Fotograma 0: la superficie roja de la gigante hierve y llena la pantalla; la cámara ya se aleja.
// - «el Sol»: el Sol, chiquito y amarillo, llega a su lado y se queda, con su nombre.
// - «combustible»: la gigante se apaga poco a poco, más oscura y roja.
// - «Su centro»: en su centro se enciende un núcleo blanco; «no aguanta»: toda la estrella tiembla y se va encogiendo.
// - «desploma»: se hunde de golpe en una bolita azul: fogonazo, y sus capas de fuera salen volando en un anillo rojo
//   que se apaga. Reposa con la bolita azul latiendo antes del corte.
import * as k from "#kit";
import { v } from "#voz";

export const desde = "todo";

const { suave: su, tramo: tr, mez, entra, sale, F, proyecta } = k;
const f3 = v.frase(3), f4 = v.frase(4);
const T0 = f3.inicio, Tsol = f3.t("sol"), Tcomb = f3.t("combustible"), Tcentro = f4.t("centro"), Tagu = f4.t("aguanta"), Tdes = f4.t("desploma");
export const Tcae = Tdes - 0.05, Tboom = Tcae + 0.22;     // se hunde; fogonazo (lo usa el sonido)

const R = 10;                                              // el radio de la gigante (en el mundo)
// la cámara se aleja: de pegada a la superficie a verla entera con el Sol al lado
const radPant = k.claves([[T0 - 0.05, 1500], [Tsol + 0.3, 400], [Tcomb - 0.1, 390], [Tagu + 0.2, 500], [Tdes, 540]]);
const entraFin = (t) => mez(1, 0.22, su(tr(t, Tboom + 0.15, Tboom + 1.0)));
const cam = (t) => { const d = ((F * R) / radPant(t)) * entraFin(t); const y = 1.2 * (entraFin(t) - 0.22) / 0.78; return k.mira([0, y, d], [0, y, 0]); };
// el Sol: llega desde abajo a la derecha y frena en su sitio
const SOL = [6.6, -9.0, 0], SOL_DE = [26, -24, 0];
const solEn = (t) => k.mezV(SOL_DE, SOL, entra(tr(t, Tsol - 0.45, Tsol + 0.1)));
const apagada = ["#e08a62", "#b0401f", "#7a2210", "#350a04", "200,60,30"];
const cielo = k.cielo(9, 2600, [0, 0, -200], 700, 40);
const az = k.azar(21);
const capas = Array.from({ length: 70 }, () => ({ a: az() * Math.PI * 2, v: 0.7 + az() * 0.6, s: 60 + az() * 120 }));

export function dibuja(g, t) {
  const c = cam(t), antes = cam(t - 1 / 60);
  k.fondo(g, c);
  k.estrellas(g, c, antes, cielo);
  const O = proyecta(c, [0, 0, 0]), rad = (F * R) / O.z;
  // el Sol, para comparar
  const S = proyecta(c, solEn(t));
  if (t >= Tsol - 0.45 && S) {
    const rs = (F * 0.9) / S.z;
    k.estrella(g, "amarilla", S.x, S.y, rs, t * 0.3, 0.2 * k.pulso(t, Tsol + 0.1, 0.15));
    k.etiqueta(g, S.x - 95, S.y + rs + 40, "el Sol", "255,214,110", tr(t, Tsol - 0.1, Tsol + 0.15) * (1 - tr(t, Tboom, Tboom + 0.3)), 50);
  }
  // la gigante: se apaga, tiembla, se encoge y se hunde
  const apaga = su(tr(t, Tcomb - 0.3, Tcomb + 0.7));
  const tiembla = su(tr(t, Tagu - 0.1, Tagu + 0.4)) * (1 - tr(t, Tcae, Tcae + 0.05));
  const encoge = mez(1, 0.8, su(tr(t, Tagu, Tcae)));
  const hunde = sale(tr(t, Tcae, Tboom));
  const r = t < Tboom ? rad * encoge * (1 + 0.045 * tiembla * Math.sin(t * 47) * (0.6 + 0.4 * Math.sin(t * 7.3))) * mez(1, 0.04, hunde) : 0;
  if (r > 0) k.estrella(g, k.paleta("gigante", apagada, apaga), O.x, O.y, r, t * 0.12, -0.2 * apaga);
  // el núcleo blanco que se enciende en su centro (y crece mientras aprieta)
  const nucleo = su(tr(t, Tcentro - 0.1, Tcentro + 0.5)) * (t < Tboom ? 1 : 0);
  if (nucleo > 0) {
    k.brillo(g, O.x, O.y, (r * 0.9 + 80) * (1 + 0.08 * Math.sin(t * 20) * tiembla), "amarilla", 0.75 * nucleo);
    k.brillo(g, O.x, O.y, 140 + 60 * tiembla, "blanca", nucleo);
  }
  // la bolita azul que queda: la estrella de neutrones
  if (t >= Tboom - 0.04) {
    const late = k.pulso(t, Tboom + 0.05, 0.25);
    const rn = (F * R * 0.063) / O.z;
    k.estrella(g, "azul", O.x, O.y, rn, t * 1.5, 0.4 + 0.6 * late);
    k.brillo(g, O.x, O.y, rn * 11, "azul", 0.7 + 0.3 * late);
  }
  // el fogonazo y las capas de fuera que salen volando en un anillo rojo, y se apagan antes del corte
  const u = t - Tboom;
  if (u > 0 && u < 1.2) {
    k.fogonazo(g, O.x, O.y, u * 0.9, 1400, "200,220,255");
    const e = 1 - Math.exp(-u * 3.2), al = Math.pow(1 - u / 1.2, 1.6);
    for (const q of capas) {
      const d = rad * 0.86 * (0.9 + 2.2 * e * q.v);
      k.brillo(g, O.x + Math.cos(q.a) * d, O.y + Math.sin(q.a) * d, q.s * (1 + u), q.v > 1 ? "naranja" : "roja", al);
    }
  }
  // un velo suave arriba mientras la superficie llena la pantalla, para que se lea el subtítulo
  const velo = 0.55 * tr(rad, 700, 1300);
  if (velo > 0.01) {
    const vg = g.createLinearGradient(0, 120, 0, 720);
    vg.addColorStop(0, `rgba(3,5,10,${velo})`); vg.addColorStop(0.6, `rgba(3,5,10,${velo * 0.7})`); vg.addColorStop(1, "rgba(3,5,10,0)");
    g.fillStyle = vg; g.fillRect(0, 0, 1080, 720);
  }
}
