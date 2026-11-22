// «¿Por qué el mar es salado, si los ríos que lo llenan son de agua dulce? La culpa es de la lluvia.»
// El mar delante, la costa y el río que baja de las montañas. Una sola cámara.
// - Fotograma 0: la cámara vuela a toda velocidad a ras de las olas, hacia la costa. Una ola enorme se levanta
//   delante y en «salado» revienta contra la pantalla: un golpe de espuma blanca.
// - El agua se escurre hacia abajo y en el cristal se quedan pegados cristales de sal que brillan.
// - «ríos»: la cámara sube y frena; se ve el río que baja de las montañas y entra en el mar. «dulce»: el río brilla.
// - «La culpa»: la cámara mira al cielo; entran nubes oscuras. «lluvia»: empieza a llover hacia la cámara, y una gota
//   llega al centro y crece (el plano siguiente sigue con ella, sin corte).
import * as k from "#kit";
import { v } from "#voz";
import { marcaDeAgua } from "#piezas/marca-agua.js";
import { camPaisaje, paisaje, grano, lluvia, velo, pp, rioX } from "../mundo.js";

export const desde = 0;

const { suave: su, tramo: tr, mez, claves, azar } = k;
const f1 = v.frase(1), f2 = v.frase(2);
const Tsal = f1.t("salado"), Trios = f1.t("rios"), Tdul = f1.t("dulce"), Tcul = f2.t("culpa"), Tllu = f2.t("lluvia"), Tfin = v.frase(3).inicio;
export const momentos = { ola: Tsal - 0.02, escurre: Tsal + 0.15, rios: Trios, dulce: Tdul, nubes: Tcul, lluvia: Tllu, gota: Tfin - 0.45 };

// la cámara: muy rápida y baja al principio; frena y sube para ver el río; luego mira al cielo
const camZ = claves([[0, -95], [Tsal, -68], [Trios, -56], [Tdul, -46], [Tcul, -38], [Tfin, -34]]);
const camH = claves([[0, 0.8], [Tsal, 1.2], [Trios, 17], [Tdul, 23], [Tcul, 24], [Tfin, 25]]);
const camHy = claves([[0, 880], [Tsal, 860], [Trios, 600], [f2.inicio - 0.1, 590], [Tllu, 1150], [Tfin, 1230]]);
const oscuro = claves([[f2.inicio - 0.2, 0], [Tllu, 0.72], [Tfin, 0.78]]);

// los cristales que se quedan pegados en la pantalla
const az = azar(321);
const CRISTALES = [];
while (CRISTALES.length < 46) {
  const x = 60 + az() * 960, y = 120 + az() * 1640;
  if (y > 270 && y < 540) continue;
  CRISTALES.push({ x, y, r: 7 + az() * 16, baja: 30 + az() * 90, sem: Math.floor(az() * 1e4), d: az() });
}

// las nubes de lluvia que entran: [X, Y, Z, ancho, oscuro, al, semilla]
const NUBES = [[-140, 120, 420, 260], [40, 140, 460, 300], [150, 110, 360, 220], [-60, 90, 300, 190], [80, 75, 250, 150], [-10, 70, 210, 130]];

export function dibuja(g, t) {
  const c = camPaisaje(0, camH(t), camZ(t), camHy(t));
  const os = oscuro(t), entra = su(tr(t, f2.inicio - 0.2, Tllu));
  paisaje(g, c, t, {
    oscuro: os, olas: mez(2.4, 1, su(tr(t, Tsal, Trios))),
    nubes: NUBES.map((n, i) => [n[0], n[1] + (1 - entra) * 80, n[2], n[3], os, Math.min(1, entra * 1.6 - i * 0.08), 10 + i]),
  });
  // «dulce»: el río brilla, de la costa a la montaña
  const dul = k.pulso(t, Tdul + 0.25, 0.5) * 0.9;
  if (dul > 0.02) {
    g.save(); g.globalCompositeOperation = "lighter";
    for (let z = 1; z < 200; z *= 1.25) { const P = pp(c, rioX(z), 0, z); if (P) k.brillo(g, P.x, P.y, Math.max(24, P.s * 2.2), "200,245,255", dul * 0.35); }
    g.restore();
  }
  // la lluvia y la gota que llega a la cámara
  lluvia(g, t, su(tr(t, Tllu - 0.1, Tllu + 0.35)) * 0.9, Tllu);
  const ug = tr(t, Tfin - 0.5, Tfin);
  if (ug > 0) gotaQueLlega(g, k.sale(ug));
  // la ola que revienta contra la pantalla y se escurre
  ola(g, t);
  // los cristales de sal pegados al cristal
  const escurre = t - (Tsal + 0.15);
  if (escurre > 0) for (const q of CRISTALES) {
    const sale = su(tr(t, Trios + 0.3 + q.d * 0.8, Trios + 1.0 + q.d * 0.8));
    const y = q.y + q.baja * Math.min(1.8, escurre) * 0.5 + 900 * sale * sale;
    grano(g, q.x, y, q.r, t, q.sem, su(tr(escurre, q.d * 0.2, q.d * 0.2 + 0.2)) * (1 - sale), 1.3);
  }
  velo(g, 0.35 + 0.25 * su(tr(t, Tcul, Tllu)));
  marcaDeAgua(g);
}

// La ola: una pared de agua que sube desde abajo, se curva arriba con espuma y tapa la pantalla; en «salado» revienta
// en blanco; luego el agua cae y se escurre hacia abajo, dejando gotas.
function ola(g, t) {
  const sube = k.entra(tr(t, 0.35, Tsal - 0.02)), cae = su(tr(t, Tsal + 0.06, Tsal + 0.5));
  if (cae >= 1) return;
  // el borde de arriba de la pared de agua
  const top = mez(1500, -260, sube) + 2400 * cae * cae;
  if (top > 1950) return;
  const curva = (x) => top + 60 * Math.sin(x * 0.006 + t * 3) + 40 * Math.sin(x * 0.017 - t * 5) - 120 * (1 - sube) * Math.sin(Math.PI * x / 1080);
  g.save();
  g.beginPath(); g.moveTo(-20, 1960);
  for (let x = -20; x <= 1100; x += 20) g.lineTo(x, curva(x));
  g.lineTo(1100, 1960); g.closePath();
  const gr = g.createLinearGradient(0, top - 60, 0, top + 1400);
  gr.addColorStop(0, "rgba(140,236,240,0.97)"); gr.addColorStop(0.18, "rgba(24,170,196,0.97)"); gr.addColorStop(1, "rgba(4,52,98,0.98)");
  g.fillStyle = gr; g.fill();
  g.save(); g.clip();
  g.globalCompositeOperation = "screen"; g.globalAlpha = 0.35;
  g.drawImage(k.causticas, -200, top - 200 + t * 300, 1480, 2200);
  g.restore();
  // la espuma del borde
  g.globalCompositeOperation = "source-over";
  const a = azar(55);
  for (let i = 0; i < 70; i++) {
    const x = a() * 1100 - 10, r = 18 + a() * 46;
    g.fillStyle = `rgba(250,255,255,${0.55 + 0.4 * a()})`;
    g.beginPath(); g.arc(x, curva(x) + r * 0.2 - a() * 30, r * (0.6 + 0.4 * sube), 0, Math.PI * 2); g.fill();
  }
  g.restore();
  // el golpe: un fogonazo blanco y gotas que saltan
  const golpe = tr(t, Tsal - 0.03, Tsal + 0.45);
  if (golpe > 0 && golpe < 1) {
    g.save(); g.fillStyle = `rgba(240,252,255,${0.85 * (1 - golpe) * (1 - golpe)})`; g.fillRect(0, 0, 1080, 1920); g.restore();
    const b = azar(77);
    for (let i = 0; i < 80; i++) {
      const ang = b() * 6.28, vel = 600 + b() * 1600, r = 6 + b() * 22;
      const x = 540 + Math.cos(ang) * vel * golpe * 1.2, y = 900 + Math.sin(ang) * vel * golpe + 900 * golpe * golpe;
      g.fillStyle = `rgba(230,250,255,${0.8 * (1 - golpe)})`; g.beginPath(); g.arc(x, y, r * (1 - 0.5 * golpe), 0, Math.PI * 2); g.fill();
    }
  }
}

// Una gota que viene del cielo hacia el centro y crece hasta llenar la pantalla.
function gotaQueLlega(g, u) {
  const r = mez(10, 1300, u * u), x = 540, y = mez(500, 1000, u);
  gotaGrande(g, x, y, r, u);
}
export function gotaGrande(g, x, y, r, brillo = 0) {
  g.save();
  // la forma: redonda abajo y en punta arriba
  g.beginPath();
  g.moveTo(x, y - r * 1.5);
  g.bezierCurveTo(x + r * 0.35, y - r * 0.9, x + r, y - r * 0.4, x + r, y + r * 0.1);
  g.arc(x, y + r * 0.1, r, 0, Math.PI, false);
  g.bezierCurveTo(x - r, y - r * 0.4, x - r * 0.35, y - r * 0.9, x, y - r * 1.5);
  g.closePath();
  const gr = g.createRadialGradient(x - r * 0.3, y - r * 0.2, r * 0.1, x, y, r * 1.3);
  gr.addColorStop(0, "rgba(220,245,255,0.95)"); gr.addColorStop(0.5, "rgba(110,190,240,0.9)"); gr.addColorStop(1, "rgba(30,90,170,0.95)");
  g.fillStyle = gr; g.fill();
  g.lineWidth = Math.max(1, r * 0.03); g.strokeStyle = "rgba(230,250,255,0.8)"; g.stroke();
  // el reflejo
  g.fillStyle = "rgba(255,255,255,0.8)";
  g.beginPath(); g.ellipse(x - r * 0.42, y - r * 0.25, r * 0.13, r * 0.3, 0.5, 0, Math.PI * 2); g.fill();
  g.restore();
}
