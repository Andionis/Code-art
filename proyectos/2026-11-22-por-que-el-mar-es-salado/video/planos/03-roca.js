// «Así, gota a gota, va deshaciendo las rocas de las montañas y les arranca sus minerales. Y entre esos minerales
// está la...»
// Corte en «Así» a una roca de montaña bajo la lluvia, vista de cerca. Una sola cámara.
// - Fotograma 0: una gota grande cae y revienta contra la roca.
// - «gota a gota»: caen más gotas, cada una con su salpicadura; donde pegan, la roca se va hundiendo en hoyos.
// - «deshaciendo»: los hoyos crecen y se oscurecen. La cámara se aleja: es la ladera de una montaña.
// - «arranca»: de los hoyos saltan granitos de colores que brillan y bajan con el agua.
// - «Y entre esos minerales»: la cámara entra hacia un granito blanco, un cristal de sal, que crece hasta llenar el
//   centro y se queda girando despacio antes del corte.
import * as k from "#kit";
import { v } from "#voz";
import { marcaDeAgua } from "#piezas/marca-agua.js";
import { grano, lluvia, velo } from "../mundo.js";

export const desde = "asi";

const { suave: su, tramo: tr, mez, claves, azar } = k;
const f4 = v.frase(4), f5 = v.frase(5);
const T0 = f4.inicio, Tgota = f4.t("gota"), Tdes = f4.t("deshaciendo"), Troc = f4.t("rocas"), Tmon = f4.t("montanas"), Tarr = f4.t("arranca");
const T5 = f5.inicio, Tmin = f5.t("minerales"), Tcorte = f5.t("misma") - 0.04;

// la cámara: zoom alrededor de un punto (de cerca → se aleja → entra hacia el cristal de sal)
const SAL = [610, 1235];           // dónde está el cristal de sal en la roca
const zoom = claves([[T0, 1.9], [Tgota, 1.75], [Troc, 1.25], [Tmon, 0.95], [Tarr + 0.3, 0.95], [T5 + 0.1, 1.0], [Tcorte - 0.35, 7.5], [Tcorte, 7.6]]);
const foco = (t) => { const u = su(tr(t, T5, Tcorte - 0.35)); return [mez(540, SAL[0], u), mez(1150, SAL[1], u)]; };

// la roca: un contorno de ladera, sus vetas y sus granos
const az = azar(2024);
const CRESTA = Array.from({ length: 40 }, (_, i) => [-600 + i * 60, 620 + 140 * Math.sin(i * 0.45) + 60 * az() - Math.max(0, 14 - Math.abs(i - 20)) * 22]);
const VETAS = Array.from({ length: 14 }, () => { const x = -300 + az() * 1700, y = 800 + az() * 1300, a = (az() - 0.5) * 0.9; return { x, y, a, l: 200 + az() * 500, c: ["232,178,170", "245,240,230", "220,190,120", "200,140,160"][Math.floor(az() * 4)], w: 6 + az() * 14 }; });
const GOLPES = Array.from({ length: 18 }, (_, i) => ({ t: i === 0 ? T0 + 0.04 : mez(Tgota - 0.1, Tarr + 0.6, az()), x: i === 0 ? 540 : 120 + az() * 840, y: i === 0 ? 1150 : 900 + az() * 820 }));
const COLORES = ["255,150,140", "255,220,120", "180,220,255", "220,160,255", "255,255,255"];
const GRANOS = Array.from({ length: 40 }, (_, i) => { const h = GOLPES[1 + (i % 17)]; return { x: h.x + (az() - 0.5) * 90, y: h.y + (az() - 0.5) * 50, c: COLORES[i % 5], r: 13 + az() * 12, sale: Tarr - 0.15 + az() * 0.9, vx: (az() - 0.5) * 120, sem: i * 7 }; });

export const momentos = { golpes: GOLPES.map((h) => h.t), arranca: Tarr, sal: Tcorte - 0.35 };

export function dibuja(g, t) {
  // el cielo de lluvia, detrás de la cresta
  const gr = g.createLinearGradient(0, 0, 0, 1920);
  gr.addColorStop(0, "#3d5578"); gr.addColorStop(1, "#8aa2c0");
  g.fillStyle = gr; g.fillRect(0, 0, 1080, 1920);
  const z = zoom(t), [fx, fy] = foco(t);
  g.save();
  g.translate(540, 1150); g.scale(z, z); g.translate(-fx, -fy);
  roca(g, t);
  // los golpes de las gotas: la gota que cae, la salpicadura y el hoyo que va creciendo
  for (const h of GOLPES) {
    const u = t - h.t;
    if (u < -0.35) continue;
    if (u < 0) { // la gota cayendo
      const yy = h.y + u * 2600;
      g.fillStyle = "rgba(200,230,255,0.9)"; g.beginPath(); g.ellipse(h.x, yy, 9, 22, 0, 0, Math.PI * 2); g.fill();
      continue;
    }
    // el hoyo: crece con «deshaciendo»
    const crece = 0.3 + 0.7 * su(tr(t, Tdes - 0.2, Tarr + 0.2));
    const hr = 52 * crece * su(tr(u, 0, 0.6));
    if (hr > 1) {
      const hg = g.createRadialGradient(h.x - hr * 0.2, h.y - hr * 0.3, 0, h.x, h.y, hr);
      hg.addColorStop(0, "rgba(50,24,18,0.9)"); hg.addColorStop(0.7, "rgba(90,50,36,0.7)"); hg.addColorStop(1, "rgba(120,70,50,0)");
      g.fillStyle = hg; g.beginPath(); g.ellipse(h.x, h.y, hr * 1.3, hr * 0.8, 0, 0, Math.PI * 2); g.fill();
      g.strokeStyle = "rgba(200,215,235,0.35)"; g.lineWidth = 2; g.beginPath(); g.ellipse(h.x, h.y + hr * 0.1, hr * 1.3, hr * 0.8, 0, 0.2, 2.9); g.stroke();
    }
    // la salpicadura
    if (u < 0.45) {
      const s = u / 0.45;
      g.strokeStyle = `rgba(230,245,255,${0.9 * (1 - s)})`; g.lineWidth = 7;
      g.beginPath(); g.ellipse(h.x, h.y, 30 + 140 * s, 12 + 45 * s, 0, 0, Math.PI * 2); g.stroke();
      for (let i = 0; i < 8; i++) {
        const a = Math.PI + (i / 7) * Math.PI, d = 110 * s;
        g.fillStyle = `rgba(220,240,255,${0.9 * (1 - s)})`;
        g.beginPath(); g.arc(h.x + Math.cos(a) * d, h.y + Math.sin(a) * d * 0.9 + 200 * s * s, 6 * (1 - s) + 2, 0, Math.PI * 2); g.fill();
      }
    }
  }
  // los hilos de agua que bajan por la roca desde «deshaciendo»
  const agua = su(tr(t, Tdes, Tarr));
  if (agua > 0) {
    g.save(); g.lineCap = "round";
    for (let i = 0; i < 9; i++) {
      const x0 = 80 + i * 115, fase = (t * 260 + i * 97) % 120;
      g.strokeStyle = `rgba(170,215,255,${0.35 * agua})`; g.lineWidth = 10;
      g.setLineDash([60, 60]); g.lineDashOffset = -fase;
      g.beginPath(); g.moveTo(x0, 760 + i * 30); g.bezierCurveTo(x0 + 40, 1100, x0 - 30, 1400, x0 + 20, 2100); g.stroke();
    }
    g.setLineDash([]); g.restore();
  }
  // los granos: incrustados; en «arranca» saltan y bajan con el agua, brillando
  for (const q of GRANOS) {
    const u = t - q.sale;
    let x = q.x, y = q.y;
    if (u > 0) { x += q.vx * Math.min(u, 1.2); y += -140 * u + 520 * u * u; }
    if (y > 2200) continue;
    if (q.c === "255,255,255") grano(g, x, y, q.r * 1.2, t, q.sem, 1, u > 0 ? 1 : 0.3);
    else {
      const gg = g.createRadialGradient(x - q.r * 0.3, y - q.r * 0.3, 0, x, y, q.r);
      gg.addColorStop(0, "rgba(255,255,255,0.95)"); gg.addColorStop(0.4, `rgba(${q.c},1)`); gg.addColorStop(1, `rgba(${k.mezRgb(q.c, "40,30,40", 0.5)},1)`);
      g.fillStyle = gg; g.beginPath(); g.moveTo(x, y - q.r); g.lineTo(x + q.r, y); g.lineTo(x, y + q.r); g.lineTo(x - q.r, y); g.closePath(); g.fill();
      if (u > 0) k.brillo(g, x, y, q.r * 5, q.c, 0.4 * Math.max(0, Math.sin(t * 4 + q.sem)));
    }
  }
  g.restore();
  // el cristal de sal: se dibuja encima, nítido, del tamaño que le da el zoom
  const S = 16 * z, sx = 540 + (SAL[0] - fx) * z, sy = 1150 + (SAL[1] - fy) * z;
  const enfoca = su(tr(t, T5, Tcorte - 0.35));
  if (enfoca > 0) { g.fillStyle = `rgba(10,14,24,${0.55 * enfoca})`; g.fillRect(0, 0, 1080, 1920); k.brillo(g, sx, sy, S * 4, "220,240,255", 0.5 * enfoca); }
  grano(g, sx, sy, S, t * (1 - 0.7 * enfoca), 4242, 1, 0.6 + 0.6 * enfoca);
  // la lluvia, delante (se va cuando entra hacia el cristal)
  lluvia(g, t, 0.75 * (1 - enfoca), 0);
  velo(g, 0.4);
  marcaDeAgua(g);
}

// La ladera: roca gris azulada con luz de arriba a la izquierda, textura, grietas y vetas de colores.
function roca(g, t) {
  g.save();
  g.beginPath(); g.moveTo(-700, 2600);
  for (const [x, y] of CRESTA) g.lineTo(x, y);
  g.lineTo(1800, 2600); g.closePath();
  const rg = g.createLinearGradient(0, 500, 400, 2100);
  rg.addColorStop(0, "#e2b48a"); rg.addColorStop(0.45, "#b97a55"); rg.addColorStop(1, "#6e4436");
  g.fillStyle = rg; g.fill();
  g.clip();
  // las capas de la roca, de colores
  for (let i = 0; i < 16; i++) {
    const y = 600 + i * 110;
    g.fillStyle = ["rgba(255,210,160,0.25)", "rgba(150,80,60,0.25)", "rgba(240,180,120,0.2)", "rgba(120,70,70,0.2)"][i % 4];
    g.beginPath(); g.moveTo(-700, y);
    for (let x = -700; x <= 1800; x += 100) g.lineTo(x, y + 30 * Math.sin(x * 0.004 + i) + x * 0.06);
    g.lineTo(1800, y + 70 + 108); g.lineTo(-700, y + 70); g.closePath(); g.fill();
  }
  // las vetas de colores
  g.lineCap = "round";
  for (const q of VETAS) {
    g.strokeStyle = `rgba(${q.c},0.55)`; g.lineWidth = q.w;
    g.beginPath(); g.moveTo(q.x, q.y);
    g.quadraticCurveTo(q.x + Math.cos(q.a) * q.l * 0.5, q.y + Math.sin(q.a) * q.l * 0.5 + 40, q.x + Math.cos(q.a) * q.l, q.y + Math.sin(q.a) * q.l);
    g.stroke();
  }
  g.globalCompositeOperation = "multiply";
  g.globalAlpha = 0.3; g.drawImage(k.manchas, -700, 400, 2500, 2300);
  g.globalAlpha = 0.3; g.drawImage(k.red, -700, 400, 2500, 2300);
  // mojada: un brillo húmedo que baja despacio
  g.globalCompositeOperation = "screen"; g.globalAlpha = 0.12;
  g.drawImage(k.causticas, -700, 300 + ((t * 40) % 300), 2500, 2400);
  g.restore();
  // el borde de luz de la cresta
  g.strokeStyle = "rgba(230,240,255,0.5)"; g.lineWidth = 5;
  g.beginPath(); CRESTA.forEach(([x, y], i) => (i ? g.lineTo(x, y + 3) : g.moveTo(x, y + 3))); g.stroke();
}
