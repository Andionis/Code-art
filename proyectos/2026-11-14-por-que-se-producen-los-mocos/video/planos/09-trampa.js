// «Así que el moco no es basura: es tu trampa contra todo lo que respiras. Envíaselo a un amigo que le pueda interesar.»
// El túnel de la nariz, como en el hook. Corte en «Así».
// - «Así que el moco»: las paredes brillan con su capa de moco y sus gotas; la cámara avanza despacio.
// - «trampa»: una nube de polvo, polen y virus llega volando hacia el fondo y se queda pegada en las paredes.
// - «Envíaselo»: la cámara se lanza a toda velocidad por el túnel, como al empezar el vídeo (así el final enlaza con
//   el principio).
import * as k from "#kit";
import { v } from "#voz";
import { enPared, moco, polen, polvo, tunel, velo, virus } from "../mundo.js";

export const desde = (vz) => vz.frase(12).inicio;

const { suave: su, tramo: tr, mez, azar, proyecta, F, entra, pulso } = k;
const f12 = v.frase(12), f13 = v.frase(13);
const T0 = f12.inicio, Tbas = f12.t("basura"), Ttra = f12.t("trampa"), Tres = f12.t("respiras"), Tenv = f13.inicio;

const vel = (t) => 0.5 + 10 * su(tr(t, Tenv - 0.1, Tenv + 1.0));
const PASOS = [];
for (let tt = T0 - 0.1, d = 0; tt < T0 + 9; tt += 1 / 120) { PASOS.push(d); d += vel(tt) / 120; }
const avance = (t) => PASOS[Math.max(0, Math.min(PASOS.length - 1, Math.round((t - (T0 - 0.1)) * 120)))];

const az = azar(5150);
const GOTAS = Array.from({ length: 80 }, (_, i) => ({ a: az() * 6.2832, zw: 1 + az() * 60, s: 0.07 + az() * 0.1, sem: i + 900 }));
// la nube: cada cosa sale de delante de la cámara y vuela hasta su sitio en la pared, delante
const NUBE = Array.from({ length: 16 }, (_, i) => ({ tipo: ["polvo", "polen", "virus"][i % 3], a: az() * 6.2832, zw: 2.2 + az() * 4, s: 0.13 + az() * 0.06, sale: mez(Ttra - 0.75, Ttra - 0.1, az()), x0: (az() - 0.5) * 0.6, y0: (az() - 0.5) * 0.6, sem: i }));
export const pegan = NUBE.map((q) => q.sale + 0.45).sort((a, b) => a - b);

export function dibuja(g, t) {
  const d = avance(t), cam = k.mira([0, 0, 0], [0, -0.06, -1]);
  tunel(g, cam, d, { largo: 26 });
  const cosas = [];
  for (const q of GOTAS) {
    const zz = q.zw - d;
    if (zz < 0.35 || zz > 14) continue;
    const P = proyecta(cam, enPared(d, q.a, zz, 0.04));
    if (!P) continue;
    const r = (F * q.s) / P.z, al = Math.min(1, (14 - zz) / 4) * Math.min(1, (zz - 0.35) / 0.4);
    cosas.push({ z: P.z, dibuja: () => moco(g, P.x, P.y, r, t, q.sem, { tono: 0.35, estira: Math.sin(q.a) > 0 ? 0.6 : 0.1, al }) });
  }
  for (const q of NUBE) {
    if (t < q.sale) continue;
    const u = entra(tr(t, q.sale, q.sale + 0.45)), zz = q.zw - (d - avance(q.sale + 0.45)) ;
    const W = enPared(d, q.a, Math.max(0.4, zz), 0.06);
    const pos = [mez(q.x0, W[0], u), mez(q.y0, W[1], u), -mez(1.4, Math.max(0.4, zz), u)];
    const P = proyecta(cam, pos);
    if (!P || P.z < 0.3) continue;
    const r = (F * q.s) / P.z, aplasta = pulso(t, q.sale + 0.46, 0.06);
    cosas.push({ z: P.z, dibuja: () => {
      g.save(); g.translate(P.x, P.y); g.scale(1 + 0.2 * aplasta, 1 - 0.2 * aplasta);
      if (q.tipo === "virus") virus(g, 0, 0, r, q.a + (1 - u) * 4); else if (q.tipo === "polen") polen(g, 0, 0, r, q.a + (1 - u) * 4); else polvo(g, 0, 0, r, q.sem);
      g.restore();
      if (u >= 1) moco(g, P.x, P.y, r * 1.3, t, q.sem + 40, { tono: 0.35, al: 0.45 * su(tr(t, q.sale + 0.45, q.sale + 0.8)) });
    } });
  }
  k.deLejosACerca(cosas);
  velo(g, 0.55);
}

export const momentos = { pegan, lanza: Tenv };
