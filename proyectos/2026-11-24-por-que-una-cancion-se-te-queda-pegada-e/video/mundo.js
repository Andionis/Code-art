// Lo que comparten los planos: el fondo, la cabeza de luz de perfil, las notas musicales de neón.
import * as k from "#kit";

const { azar } = k;

// ---------------------------------------------------------------- los colores de las notas
export const NEON = ["255,70,170", "255,190,40", "60,220,255", "140,255,110", "190,110,255", "255,120,60"];

// ---------------------------------------------------------------- el fondo: violeta oscuro con un brillo
export function fondo(g, x = 540, y = 900, tono = 0) {
  const gr = g.createRadialGradient(x, y, 50, x, y, 1500);
  gr.addColorStop(0, k.mezColor("#3a1460", "#123a5a", tono));
  gr.addColorStop(0.5, k.mezColor("#170828", "#08182a", tono));
  gr.addColorStop(1, "#05020c");
  g.fillStyle = gr; g.fillRect(0, 0, 1080, 1920);
  g.save(); g.globalCompositeOperation = "screen"; g.globalAlpha = 0.06; g.drawImage(k.manchas, -200, -200, 1480, 2320); g.restore();
}

// ---------------------------------------------------------------- una nota musical de neón
// tipo 0: corchea (una bandera); 1: dos corcheas unidas; 2: negra. r: radio de la cabeza de la nota.
export function nota(g, x, y, r, color, ang = 0, al = 1, tipo = 0) {
  if (r < 1 || al <= 0.002) return;
  g.save(); g.globalAlpha *= al; g.translate(x, y); g.rotate(ang);
  const cabeza = (cx, cy) => {
    g.save(); g.translate(cx, cy); g.rotate(-0.42);
    const gr = g.createRadialGradient(-r * 0.35, -r * 0.3, r * 0.05, 0, 0, r * 1.3);
    gr.addColorStop(0, `rgb(${k.mezRgb(color, "255,255,255", 0.75)})`); gr.addColorStop(0.45, `rgb(${color})`); gr.addColorStop(1, `rgb(${k.mezRgb(color, "20,0,30", 0.55)})`);
    g.fillStyle = gr; g.beginPath(); g.ellipse(0, 0, r * 1.3, r * 0.95, 0, 0, 6.2832); g.fill();
    g.fillStyle = "rgba(255,255,255,0.75)"; g.beginPath(); g.ellipse(-r * 0.45, -r * 0.35, r * 0.38, r * 0.18, -0.3, 0, 6.2832); g.fill();
    g.restore();
  };
  const palo = (cx, cy) => {
    const gr = g.createLinearGradient(cx - r * 0.2, 0, cx + r * 0.2, 0);
    gr.addColorStop(0, `rgb(${k.mezRgb(color, "255,255,255", 0.5)})`); gr.addColorStop(1, `rgb(${k.mezRgb(color, "20,0,30", 0.35)})`);
    g.fillStyle = gr; g.fillRect(cx + r * 0.98, cy - r * 4.2, r * 0.34, r * 4.2);
  };
  // el halo de luz
  g.save(); g.globalCompositeOperation = "lighter";
  const hg = g.createRadialGradient(0, -r * 1.5, 0, 0, -r * 1.5, r * 5);
  hg.addColorStop(0, `rgba(${color},0.45)`); hg.addColorStop(1, `rgba(${color},0)`);
  g.fillStyle = hg; g.fillRect(-r * 5, -r * 6.5, r * 10, r * 10); g.restore();
  if (tipo === 1) {
    palo(0, 0); palo(r * 3.2, -r * 0.6);
    g.fillStyle = `rgb(${color})`;
    g.beginPath(); g.moveTo(r * 0.98, -r * 4.2); g.lineTo(r * 4.52, -r * 4.8); g.lineTo(r * 4.52, -r * 4.0); g.lineTo(r * 0.98, -r * 3.4); g.closePath(); g.fill();
    cabeza(0, 0); cabeza(r * 3.2, -r * 0.6);
  } else {
    palo(0, 0);
    if (tipo === 0) {
      g.fillStyle = `rgb(${color})`;
      g.beginPath(); g.moveTo(r * 1.32, -r * 4.2);
      g.bezierCurveTo(r * 1.5, -r * 3.1, r * 3.0, -r * 2.8, r * 2.4, -r * 1.2);
      g.bezierCurveTo(r * 2.6, -r * 2.4, r * 1.8, -r * 2.8, r * 1.32, -r * 3.0); g.closePath(); g.fill();
    }
    cabeza(0, 0);
  }
  g.restore();
}

// ---------------------------------------------------------------- la cabeza de luz, de perfil (mira a la izquierda)
// Coordenadas propias: la cabeza mide 1,3 de alto; (0,0) cerca del centro del cráneo.
const PERFIL = [
  [0.0, -0.56], [0.26, -0.52], [0.44, -0.36], [0.5, -0.1], [0.46, 0.14], [0.36, 0.3], [0.3, 0.45], [0.3, 0.8],
  [-0.12, 0.8], [-0.13, 0.5], [-0.2, 0.44], [-0.3, 0.4], [-0.35, 0.33], [-0.36, 0.25], [-0.4, 0.21], [-0.37, 0.17],
  [-0.41, 0.13], [-0.39, 0.06], [-0.43, 0.03], [-0.48, -0.03], [-0.42, -0.12], [-0.4, -0.22], [-0.41, -0.3],
  [-0.36, -0.42], [-0.22, -0.53],
];
export const OREJA = [0.14, 0.02];
export const CEREBRO = { x: 0.04, y: -0.22, rx: 0.34, ry: 0.24 };
export const BOCA = [-0.36, 0.2];

function caminoCabeza(g, S, mandibula = 0) {
  const P = PERFIL.map(([x, y], i) => {
    // la mandíbula (barbilla y labio de abajo) baja al masticar
    const baja = (i >= 9 && i <= 16) ? mandibula * (i <= 14 ? 1 : 0.5) : 0;
    return [x * S, (y + baja) * S];
  });
  const n = P.length, mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const m0 = mid(P[n - 1], P[0]);
  g.beginPath(); g.moveTo(m0[0], m0[1]);
  for (let i = 0; i < n; i++) { const a = P[i], b = P[(i + 1) % n], m = mid(a, b); g.quadraticCurveTo(a[0], a[1], m[0], m[1]); }
  g.closePath();
}

// cabeza(g, x, y, S, o): (x, y) es el (0,0) propio en pantalla; S, píxeles por unidad. o = { al, mandibula, brilloCerebro }
export function cabeza(g, x, y, S, o = {}) {
  const al = o.al ?? 1, mand = o.mandibula || 0, bc = o.brilloCerebro ?? 0.5;
  g.save(); g.globalAlpha *= al; g.translate(x, y);
  // el halo de fuera
  g.save(); g.globalCompositeOperation = "lighter";
  const hg = g.createRadialGradient(0, -0.1 * S, 0.3 * S, 0, -0.1 * S, 0.95 * S);
  hg.addColorStop(0, "rgba(150,70,255,0.22)"); hg.addColorStop(1, "rgba(150,70,255,0)");
  g.fillStyle = hg; g.fillRect(-S, -1.1 * S, 2 * S, 2.1 * S); g.restore();
  // el cuerpo: vidrio violeta, más claro por la izquierda-arriba (de donde viene la luz)
  caminoCabeza(g, S, mand);
  const gr = g.createRadialGradient(-0.25 * S, -0.3 * S, 0.05 * S, 0, 0, 0.9 * S);
  gr.addColorStop(0, "rgba(150,90,240,0.55)"); gr.addColorStop(0.6, "rgba(70,30,150,0.5)"); gr.addColorStop(1, "rgba(30,10,70,0.65)");
  g.fillStyle = gr; g.fill();
  g.save(); g.clip();
  g.globalCompositeOperation = "screen"; g.globalAlpha *= 0.12; g.drawImage(k.manchas, -S, -S, 2 * S, 2 * S);
  g.globalAlpha = al * 0.07; g.drawImage(k.red, -S, -S, 2 * S, 2 * S);
  g.restore();
  // el cerebro, dentro: unas circunvoluciones de luz
  g.save(); caminoCabeza(g, S, mand); g.clip();
  g.translate(CEREBRO.x * S, CEREBRO.y * S);
  const cg = g.createRadialGradient(0, 0, 0, 0, 0, CEREBRO.rx * S * 1.1);
  cg.addColorStop(0, `rgba(255,120,210,${0.3 * bc})`); cg.addColorStop(1, "rgba(255,120,210,0)");
  g.fillStyle = cg; g.beginPath(); g.ellipse(0, 0, CEREBRO.rx * S * 1.1, CEREBRO.ry * S * 1.1, 0, 0, 6.2832); g.fill();
  g.strokeStyle = `rgba(255,170,230,${0.2 + 0.35 * bc})`; g.lineWidth = Math.max(1.5, S * 0.008); g.lineCap = "round";
  g.beginPath(); g.ellipse(0, 0, CEREBRO.rx * S, CEREBRO.ry * S, 0, 0, 6.2832); g.stroke();
  const az = azar(77);
  for (let i = 0; i < 16; i++) {
    const a = az() * 6.28, rr = 0.25 + az() * 0.6, px = Math.cos(a) * CEREBRO.rx * S * rr, py = Math.sin(a) * CEREBRO.ry * S * rr;
    g.beginPath(); g.moveTo(px, py);
    g.bezierCurveTo(px + S * 0.05, py - S * 0.04, px + S * 0.08, py + S * 0.04, px + S * 0.12 * (az() - 0.3), py + S * 0.03);
    g.stroke();
  }
  g.restore();
  // la oreja
  g.save(); g.translate(OREJA[0] * S, OREJA[1] * S);
  g.strokeStyle = "rgba(200,170,255,0.7)"; g.lineWidth = Math.max(2, S * 0.012);
  g.beginPath(); g.ellipse(0, 0, 0.06 * S, 0.1 * S, 0.15, -1.9, 2.3); g.stroke();
  g.beginPath(); g.ellipse(0.005 * S, 0.01 * S, 0.028 * S, 0.05 * S, 0.15, -1.5, 2.0); g.stroke();
  g.restore();
  // el borde de luz (cian por la izquierda, magenta por la derecha)
  caminoCabeza(g, S, mand);
  const bg = g.createLinearGradient(-0.5 * S, 0, 0.5 * S, 0);
  bg.addColorStop(0, "rgba(120,230,255,0.95)"); bg.addColorStop(1, "rgba(255,90,200,0.85)");
  g.save(); g.globalCompositeOperation = "lighter";
  g.strokeStyle = bg; g.lineWidth = Math.max(2, S * 0.012); g.stroke();
  g.globalAlpha *= 0.35; g.lineWidth = Math.max(4, S * 0.04); g.stroke();
  g.restore();
  g.restore();
}

// La pared del cráneo, para que las notas reboten: ¿está (lx, ly) dentro del cerebro? (elipse)
export const dentroCerebro = (lx, ly, m = 1) => ((lx - CEREBRO.x) / (CEREBRO.rx * m)) ** 2 + ((ly - CEREBRO.y) / (CEREBRO.ry * m)) ** 2 < 1;

// El velo oscuro de arriba, para el subtítulo.
export function velo(g, al = 0.55) {
  const vg = g.createLinearGradient(0, 200, 0, 620);
  vg.addColorStop(0, `rgba(8,2,18,${al})`); vg.addColorStop(1, "rgba(8,2,18,0)");
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 620);
}
