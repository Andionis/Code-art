// «¿De dónde salen los mocos? Tu nariz los fabrica todos los días, aunque no estés enfermo, y casi todos... te los tragas.»
// El túnel de la nariz, con una sola cámara.
// - Fotograma 0: la cámara vuela a toda velocidad por el túnel rosado y húmedo, entre gotas que cuelgan; una bola de
//   moco viene de lejos y en «mocos» llega contra la pantalla y la llena.
// - «Tu nariz»: la bola se aparta y cae al suelo del túnel. «fabrica»: de las paredes salen gotas nuevas, una tras otra.
// - «y casi todos»: la bola resbala hacia el fondo y la cámara la sigue.
// - «tragas»: el fondo del túnel se aprieta como un trago, se traga la bola y se cierra a lo oscuro. Reposa en negro
//   antes del corte.
import * as k from "#kit";
import { v } from "#voz";
import { enPared, eje, moco, tunel, velo } from "../mundo.js";

export const desde = 0;

const { suave: su, tramo: tr, mez, azar, proyecta, F, claves } = k;
const f1 = v.frase(1), f2 = v.frase(2);
const Tmoc = f1.t("mocos"), Tnar = f2.t("nariz"), Tfab = f2.t("fabrica"), Tcasi = f2.t("casi"), Ttra = f2.t("tragas");
const Tfin = f2.fin;
export const momentos = { llega: Tmoc + 0.12, cae: Tnar + 0.55, fabrica: Tfab, trago: Ttra + 0.05, cierra: Ttra + 0.35 };

// lo que avanza la cámara: muy deprisa al principio, frena al llegar la bola; despacio siguiendo la bola; un empujón
// en el trago.
const vel = (t) => 11 * (1 - su(tr(t, 0.2, Tmoc + 0.1))) + 0.6 + 1.6 * su(tr(t, Tcasi - 0.3, Tcasi + 0.4)) + 5 * su(tr(t, Ttra - 0.1, Ttra + 0.35)) * (1 - su(tr(t, Ttra + 0.45, Ttra + 0.75)));
const PASOS = [];
for (let tt = 0, d = 0; tt < 9; tt += 1 / 120) { PASOS.push(d); d += vel(tt) / 120; }
const avance = (t) => PASOS[Math.max(0, Math.min(PASOS.length - 1, Math.round(t * 120)))];

// las gotas de la pared: unas ya están, otras nacen desde «fabrica»
const az = azar(4242);
const GOTAS = Array.from({ length: 90 }, (_, i) => {
  const arriba = az() < 0.7, a = arriba ? mez(0.35, 2.8, az()) : mez(3.4, 6.0, az());
  const nueva = i >= 40;
  return { a, zw: 1 + az() * 34, s: 0.07 + az() * 0.1, nace: nueva ? mez(Tfab - 0.05, Tcasi, az()) : -9, sem: i + 7, estira: arriba ? 0.5 + az() * 0.6 : 0.15 };
});

// la bola de moco: de lejos a la pantalla; luego cae al suelo y resbala hacia el fondo
const zzBola = claves([[0, 16], [Tmoc + 0.12, 0.85], [Tnar + 0.1, 0.95], [Tnar + 0.7, 3.0], [Tcasi, 3.2], [Ttra, 5.4], [Ttra + 0.35, 7.5]]);
const yBola = claves([[Tnar, -0.05], [Tnar + 0.6, -1.15], [Ttra, -1.05], [Ttra + 0.35, -0.5]]);
const xBola = claves([[Tnar, 0], [Tnar + 0.6, 0.12], [Ttra, 0]]);

export function dibuja(g, t) {
  const d = avance(t);
  const cam = k.mira([0, 0, 0], [0, -0.06, -1]);
  // el trago: un anillo del túnel, un poco por delante de la bola, se aprieta y se cierra
  const trago = su(tr(t, Ttra - 0.05, Ttra + 0.4));
  const zT = zzBola(t) + 0.8;
  const estrecha = (zz) => 1 - 0.96 * trago * Math.min(1, 0.55 + zz / 4);
  tunel(g, cam, d, { estrecha, largo: 26 });

  const cosas = [];
  for (const q of GOTAS) {
    if (t < q.nace) continue;
    const zz = q.zw - d;
    if (zz < 0.35 || zz > 14) continue;
    const P = proyecta(cam, enPared(d, q.a, zz, 0.04 * Math.sign(Math.sin(q.a))));
    if (!P) continue;
    const crece = q.nace < 0 ? 1 : k.entra(tr(t, q.nace, q.nace + 0.45));
    const r = (F * q.s * crece * Math.max(0.2, 1 - 0.95 * trago * (zz > zT - 1 ? 1 : 0))) / P.z;
    const al = Math.min(1, (14 - zz) / 4) * Math.min(1, (zz - 0.35) / 0.4) * (1 - trago);
    cosas.push({ z: P.z, dibuja: () => moco(g, P.x, P.y, r, t, q.sem, { tono: 0.15, estira: q.estira * crece, al }) });
  }
  // la bola
  {
    const zz = zzBola(t);
    const P = proyecta(cam, [xBola(t), yBola(t), -zz]);
    if (P) {
      const tragada = su(tr(t, Ttra + 0.05, Ttra + 0.4));
      const r = (F * 0.55 * (1 - 0.7 * tragada)) / P.z, aplasta = k.pulso(t, Tmoc + 0.14, 0.12);
      cosas.push({ z: P.z, dibuja: () => { g.save(); g.translate(P.x, P.y); g.scale(1 + 0.12 * aplasta, 1 - 0.1 * aplasta); moco(g, 0, 0, r, t, 99, { tono: 1, estira: 0.15 * su(tr(t, Tnar, Tnar + 0.6)), al: 1 - tragada }); g.restore(); } });
    }
  }
  k.deLejosACerca(cosas);
  // el fogonazo húmedo cuando la bola llega a la pantalla
  k.brillo(g, 540, 960, 2200, "255,250,200", 0.35 * k.pulso(t, Tmoc + 0.13, 0.1));
  // se cierra a lo oscuro con el trago
  const negro = su(tr(t, Ttra + 0.3, Ttra + 0.7));
  if (negro > 0) { g.fillStyle = `rgba(10,1,3,${negro})`; g.fillRect(0, 0, 1080, 1920); }
  velo(g, 0.55 + 0.35 * su(tr(zzBola(t), 3, 1.2)));
}
