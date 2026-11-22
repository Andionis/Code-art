// «¿Y las nubes? Sus gotitas son mucho más grandes, y rebotan todos los colores por igual. Todos juntos: blanco.»
// Corte en «Y»: una nube blanca enorme en el cielo azul; la cámara se lanza hacia ella y entra. «gotitas»: dentro,
// gotas de agua grandes y brillantes flotando; «grandes»: al lado de una, las partículas del aire, diminutas. «rebotan
// todos los colores»: llegan bolitas de los siete colores y rebotan en las gotas, todas igual. «Todos juntos»: los
// colores se juntan en el centro; «blanco»: un fogonazo blanco que lo llena todo.
import * as k from "#kit";
import { v } from "#voz";
import { COLORES, NUBES_DIA, cieloMar, camCielo } from "../mundo.js";

const f11 = v.frase(11);
export const desde = () => f11.inicio - 0.03;
const T0 = f11.inicio, Tgot = f11.t("gotitas"), Tgra = f11.t("grandes"), Treb = f11.t("rebotan"), Tigu = f11.t("igual"), Tjun = f11.t("todos", 2), Tbla = f11.t("blanco"), Tfin = f11.fin;

const { suave: su, tramo: tr, mez, entra, azar } = k;
const Tdentro = Tgot - 0.35;
export const momentos = { entra: Tdentro, gotas: Tgot, rebotes: [], blanco: Tbla };

const az = azar(1717);
const GOTAS = [
  { x: 330, y: 1120, r: 175 }, { x: 790, y: 860, r: 140 }, { x: 760, y: 1420, r: 120 }, { x: 180, y: 720, r: 95 },
  { x: 560, y: 650, r: 80 }, { x: 960, y: 1180, r: 100 }, { x: 140, y: 1500, r: 110 }, { x: 470, y: 1660, r: 90 },
].map((g) => ({ ...g, f: az() * 6.28 }));
const pos = (gt, t) => [gt.x + 10 * Math.sin(t * 0.8 + gt.f), gt.y + 14 * Math.sin(t * 0.6 + gt.f * 2)];

function gota(g, x, y, r) {
  const gr = g.createRadialGradient(x - r * 0.3, y - r * 0.35, r * 0.05, x, y, r);
  gr.addColorStop(0, "rgba(255,255,255,0.95)"); gr.addColorStop(0.25, "rgba(220,238,255,0.55)"); gr.addColorStop(0.8, "rgba(150,195,245,0.45)"); gr.addColorStop(1, "rgba(70,120,200,0.85)");
  g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill();
  g.strokeStyle = "rgba(255,255,255,0.8)"; g.lineWidth = 3; g.stroke();
  // reflejo y brillo de abajo
  g.fillStyle = "rgba(255,255,255,0.9)"; g.beginPath(); g.ellipse(x - r * 0.38, y - r * 0.42, r * 0.18, r * 0.1, -0.6, 0, Math.PI * 2); g.fill();
  g.strokeStyle = "rgba(255,255,255,0.55)"; g.lineWidth = r * 0.06; g.beginPath(); g.arc(x, y, r * 0.8, 0.4, 1.3); g.stroke();
}

// las bolitas de colores: cada una llega por la izquierda, rebota en una gota y sale en otra dirección
const BOLAS = Array.from({ length: 21 }, (_, i) => {
  const c = i % 7, gt = GOTAS[i % GOTAS.length];
  const t0 = Treb - 0.35 + (i / 21) * 1.1;
  const a0 = -0.4 + az() * 0.8, sal = az() * 6.28;
  return { c, gt, t0, tb: t0 + 0.45, a0, sal };
});
for (const b of BOLAS) momentos.rebotes.push(b.tb);

function bola(g, x, y, col, r, al = 1) {
  g.save();
  g.shadowColor = `rgba(${col},${al})`; g.shadowBlur = r * 1.6;
  g.fillStyle = `rgba(${col},${al})`; g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill();
  g.shadowBlur = 0;
  g.fillStyle = `rgba(255,255,255,${0.7 * al})`; g.beginPath(); g.arc(x, y, r * 0.45, 0, Math.PI * 2); g.fill();
  g.restore();
}
// el punto donde se juntan
const J = [540, 1080];

export function dibuja(g, t) {
  const dentro = su(tr(t, Tdentro - 0.15, Tdentro + 0.25));
  if (dentro < 1) {
    // la nube, desde fuera: la cámara se lanza hacia ella
    const cam = camCielo(3000, 8, 0, 0);
    cieloMar(g, t, { cam, u: 0, sol: 34, nubes: 0.5 });
    const u = tr(t, T0 - 0.05, Tdentro + 0.1), s = Math.exp(mez(Math.log(1.0), Math.log(7), Math.pow(u, 2.2)));
    const w = 1000 * s, h = w * 0.47;
    g.drawImage(NUBES_DIA[1], 540 - w / 2, 1050 - h * 0.55, w, h);
  }
  if (dentro > 0) {
    g.save(); g.globalAlpha = dentro;
    const gr = g.createLinearGradient(0, 0, 0, 1920);
    gr.addColorStop(0, "#6f93c8"); gr.addColorStop(0.35, "#b9cdea"); gr.addColorStop(1, "#eef4fc");
    g.fillStyle = gr; g.fillRect(0, 0, 1080, 1920);
    // la niebla de la nube
    g.globalAlpha = dentro * 0.35; g.globalCompositeOperation = "screen";
    g.drawImage(k.manchas, -200 + 30 * Math.sin(t * 0.3), -200, 1500, 2300);
    g.restore();
    // las gotas, que crecen al entrar
    const crece = entra(tr(t, Tdentro - 0.1, Tgot + 0.5));
    g.save(); g.globalAlpha = dentro;
    for (const gt of GOTAS) { const [x, y] = pos(gt, t); gota(g, x, y, gt.r * mez(0.3, 1, crece)); }
    g.restore();
    // las partículas del aire, diminutas, junto a la gota grande
    const pa = su(tr(t, Tgra - 0.4, Tgra + 0.2)) * (1 - su(tr(t, Treb, Treb + 0.5)));
    if (pa > 0) {
      const [x, y] = pos(GOTAS[0], t);
      g.save(); g.globalAlpha = pa;
      for (let i = 0; i < 9; i++) { const a = -0.9 + i * 0.22, d = GOTAS[0].r + 40 + (i % 3) * 22; g.fillStyle = "#4b56b0"; g.beginPath(); g.arc(x + Math.cos(a) * d, y + Math.sin(a) * d, 6, 0, Math.PI * 2); g.fill(); }
      g.restore();
    }
    // los colores
    const junta = su(tr(t, Tjun - 0.1, Tbla - 0.05));
    for (const b of BOLAS) {
      const w = t - b.t0; if (w < 0) continue;
      const [gx, gy] = pos(b.gt, t), R = b.gt.r;
      const hit = [gx - Math.cos(b.a0) * R, gy - Math.sin(b.a0) * R];
      let x, y;
      if (t < b.tb) { const u = w / 0.45; x = mez(hit[0] - 700, hit[0], u); y = mez(hit[1] - 700 * Math.tan(b.a0) * 0.3, hit[1], u); }
      else { const d = (t - b.tb) * 520 * (1 - 0.3 * Math.min(1, t - b.tb)); x = hit[0] + Math.cos(b.sal) * d; y = hit[1] + Math.sin(b.sal) * d; }
      x = mez(x, J[0] + 60 * Math.cos(b.c + t * 6), junta); y = mez(y, J[1] + 60 * Math.sin(b.c + t * 6), junta);
      bola(g, x, y, COLORES[b.c], 24, 1 - su(tr(t, Tbla, Tbla + 0.3)));
      if (Math.abs(t - b.tb) < 0.15) { g.save(); k.brillo(g, hit[0], hit[1], 160, COLORES[b.c], 0.8 * (1 - Math.abs(t - b.tb) / 0.15)); g.restore(); }
    }
    // blanco
    const bl = su(tr(t, Tbla - 0.15, Tbla + 0.35));
    if (bl > 0) {
      g.save(); g.globalCompositeOperation = "lighter"; k.brillo(g, J[0], J[1], 2400 * bl + 200, "255,255,255", 0.95 * bl); g.restore();
      k.pastilla(g, 540, 1420, "blanco", "", "255,255,255", su(tr(t, Tbla, Tbla + 0.25)), 120);
    }
    // un velo bajo el subtítulo
    const vg = g.createLinearGradient(0, 240, 0, 560); vg.addColorStop(0, "rgba(10,25,60,0)"); vg.addColorStop(0.4, `rgba(10,25,60,${0.25 + 0.45 * su(tr(t, Tbla - 0.2, Tbla + 0.3))})`); vg.addColorStop(1, "rgba(10,25,60,0)");
    g.fillStyle = vg; g.fillRect(0, 240, 1080, 320);
  }
}
