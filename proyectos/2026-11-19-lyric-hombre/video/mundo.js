// Lo que comparten los planos: la ciudad de noche, el ritmo de la canción y el color de cada línea.
import * as k from "#kit";
import { v } from "#voz";
import { readFileSync } from "node:fs";

const ritmo = JSON.parse(readFileSync(new URL("../audio/golpes.json", import.meta.url), "utf8"));
export const golpes = ritmo.golpes;

// cuánto pega el beat ahora (1 en el golpe, cae en ~0,2 s)
export function beat(t) {
  let m = 0;
  for (const b of golpes) { if (b > t) break; m = Math.max(m, Math.exp(-(t - b) / 0.16)); }
  return m;
}

// el color de cada línea [r,g,b]: rompe rojo, entonces violeta, under cian, hombre rosa, verde verde
const PALETA = { rompe: [255, 40, 60], entonces: [150, 70, 255], under: [40, 200, 255], hombre: [255, 40, 150], verde: [60, 255, 120] };
export function colorEn(t) {
  const fs = v.frases;
  let i = 0;
  while (i + 1 < fs.length && t >= fs[i + 1].inicio - 0.15) i++;
  const a = PALETA[fs[Math.max(0, i - 1)].clave], b = PALETA[fs[i].clave];
  const u = i === 0 ? 1 : k.suave(k.tramo(t, fs[i].inicio - 0.15, fs[i].inicio + 0.25));
  return a.map((x, j) => Math.round(k.mez(x, b[j], u)));
}

// la ciudad: edificios en tres capas, con ventanas, hecha una vez
const az = k.azar(7);
export const capas = [0, 1, 2].map((c) => {
  const eds = [];
  let x = -300;
  while (x < 1380) {
    const w = 70 + az() * (130 - c * 25), h = (380 + az() * 520) * (1 - c * 0.28);
    const ventanas = [];
    for (let vy = 30; vy < h - 20; vy += 34) for (let vx = 14; vx < w - 18; vx += 26) if (az() < 0.42) ventanas.push([vx, vy, az()]);
    eds.push({ x, w, h, ventanas, antena: az() < 0.2 });
    x += w + 6 + az() * 20;
  }
  return eds;
});

// la lluvia: gotas fijas que caen con t
export const gotas = Array.from({ length: 140 }, () => [az() * 1300 - 100, az() * 2200, 0.6 + az() * 0.8, az()]);
// el humo verde del final
export const humos = Array.from({ length: 26 }, () => [az() * 1080, az(), 160 + az() * 260, az() * 6.28]);
// las grietas de «rompe»
export function grietas(semilla) {
  const r = k.azar(semilla), gs = [];
  for (let i = 0; i < 11; i++) {
    let a = (i / 11) * Math.PI * 2 + r() * 0.4, x = 0, y = 0;
    const pts = [[0, 0]];
    const L = 260 + r() * 520;
    for (let d = 0; d < L; d += 40 + r() * 40) { a += (r() - 0.5) * 0.6; x += Math.cos(a) * 55; y += Math.sin(a) * 55; pts.push([x, y]); }
    gs.push(pts);
  }
  return gs;
}
