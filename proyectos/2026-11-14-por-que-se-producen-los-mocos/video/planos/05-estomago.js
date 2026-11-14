// «Y en el estómago, el ácido deshace todo lo que atrapó.»
// El estómago: un pozo de ácido verde amarillo que burbujea, entre paredes con pliegues. Corte en «Y».
// - Primer fotograma: el ácido ya burbujea; la bola de moco, con su polen y sus virus, cae desde arriba.
// - «estómago»: la bola cae en el ácido y salpica.
// - «deshace»: la bola se deshace en burbujas; el polen y los virus se rompen y se apagan. Reposa antes del corte.
import * as k from "#kit";
import { v } from "#voz";
import { moco, polen, virus, velo } from "../mundo.js";

export const desde = (vz) => vz.frase(8).inicio;

const { suave: su, tramo: tr, mez, azar, entra, pulso } = k;
const f8 = v.frase(8);
const T0 = f8.inicio, Test = f8.t("estomago"), Taci = f8.t("acido"), Tdes = f8.t("deshace"), Tatr = f8.t("atrapo"), Tfin = f8.fin;
export const salpica = Test + 0.3;

const NIVEL = 1080; // la superficie del ácido
const az = azar(55);
const BURB = Array.from({ length: 60 }, () => ({ x: az() * 1080, r: 8 + az() * 26, per: 0.8 + az() * 1.4, ph: az() }));
const FIZZ = Array.from({ length: 80 }, () => ({ a: az() * 6.28, d: az(), v: 0.6 + az() * 1.2, r: 4 + az() * 12 }));
const GOTAS = Array.from({ length: 22 }, () => ({ a: mez(-2.8, -0.35, az()), v: 500 + az() * 700, r: 8 + az() * 14 }));

// la bola: cae al ácido, se hunde un poco y se deshace
const yBola = (t) => (t < salpica ? mez(-200, NIVEL - 40, entra(tr(t, T0, salpica)) ** 1.6) : NIVEL - 40 + 60 * su(tr(t, salpica, Tdes)));

export function dibuja(g, t) {
  // las paredes del estómago: rosa oscuro con pliegues
  const fg = g.createLinearGradient(0, 0, 0, 1920);
  fg.addColorStop(0, "#3a0a18"); fg.addColorStop(0.55, "#8a2a40"); fg.addColorStop(1, "#2a0610");
  g.fillStyle = fg; g.fillRect(0, 0, 1080, 1920);
  g.save(); g.lineCap = "round";
  for (let i = 0; i < 9; i++) {
    const x0 = -100 + i * 160;
    g.strokeStyle = "rgba(255,150,170,0.18)"; g.lineWidth = 40;
    g.beginPath(); g.moveTo(x0, 0); g.bezierCurveTo(x0 + 120, 300, x0 - 80, 600, x0 + 60, NIVEL); g.stroke();
    g.strokeStyle = "rgba(40,0,10,0.35)"; g.lineWidth = 18;
    g.beginPath(); g.moveTo(x0 + 34, 0); g.bezierCurveTo(x0 + 154, 300, x0 - 46, 600, x0 + 94, NIVEL); g.stroke();
  }
  g.restore();
  g.save(); g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.4; g.drawImage(k.manchas, -200, -200, 1480, 1600); g.restore();
  // el brillo del ácido sobre las paredes
  k.brillo(g, 540, NIVEL, 1900, "170,255,90", 0.35);
  // la bola, antes de entrar (por encima del ácido)
  const des = su(tr(t, Tdes - 0.1, Tatr + 0.3));
  const bola = (encima) => {
    const y = yBola(t), r = 210 * (1 - 0.95 * des);
    if (r < 2) return;
    g.save();
    if (encima) { g.beginPath(); g.rect(0, 0, 1080, NIVEL + 8 * Math.sin(t * 3)); g.clip(); }
    g.globalAlpha = 1 - su(tr(des, 0.7, 1));
    moco(g, 540, y, r, t, 31, { tono: 0.55 });
    const rr = (1 - des);
    polen(g, 540 - r * 0.35, y - r * 0.1, 42 * rr, 0.4 + des * 3, 1 - des);
    virus(g, 540 + r * 0.3, y + r * 0.2, 42 * rr, 1.2 - des * 3, 1 - des);
    g.restore();
  };
  // el ácido: verde amarillo, brillante, con olas
  const ag = g.createLinearGradient(0, NIVEL, 0, 1920);
  ag.addColorStop(0, "rgba(210,255,90,0.92)"); ag.addColorStop(0.25, "rgba(120,200,40,0.95)"); ag.addColorStop(1, "rgba(30,80,10,1)");
  const ola = (x) => NIVEL + 10 * Math.sin(x * 0.012 + t * 3) + 6 * Math.sin(x * 0.03 - t * 4) - 50 * pulso(t, salpica, 0.18) * Math.exp(-Math.pow((x - 540) / 200, 2));
  // la parte de la bola hundida se ve por dentro, más verde
  g.fillStyle = ag; g.beginPath(); g.moveTo(0, 1920);
  for (let x = 0; x <= 1080; x += 20) g.lineTo(x, ola(x));
  g.lineTo(1080, 1920); g.closePath(); g.fill();
  if (t >= salpica) bola(false);
  g.save(); g.globalAlpha = 0.5; g.fillStyle = "rgba(120,220,40,0.6)"; g.beginPath(); g.moveTo(0, 1920);
  for (let x = 0; x <= 1080; x += 20) g.lineTo(x, ola(x));
  g.lineTo(1080, 1920); g.closePath(); g.fill(); g.restore();
  // la luz que se mueve dentro del ácido
  g.save(); g.beginPath(); g.rect(0, NIVEL, 1080, 920); g.clip();
  g.globalCompositeOperation = "lighter"; g.globalAlpha = 0.25; g.drawImage(k.causticas, -200 + (t * 40) % 200, NIVEL - 100, 1500, 1200); g.restore();
  // el borde brillante de la superficie
  g.strokeStyle = "rgba(240,255,170,0.9)"; g.lineWidth = 6; g.beginPath();
  for (let x = 0; x <= 1080; x += 20) x ? g.lineTo(x, ola(x)) : g.moveTo(x, ola(x));
  g.stroke();
  // las burbujas que suben y revientan en la superficie
  for (const b of BURB) {
    const u = ((t / b.per + b.ph) % 1), y = mez(1750, ola(b.x), u);
    const r = b.r * (0.5 + 0.5 * u);
    g.strokeStyle = `rgba(230,255,170,${0.6})`; g.lineWidth = 3; g.beginPath(); g.arc(b.x, y, r, 0, 6.2832); g.stroke();
    g.fillStyle = "rgba(255,255,230,0.6)"; g.beginPath(); g.arc(b.x - r * 0.35, y - r * 0.35, r * 0.25, 0, 6.2832); g.fill();
  }
  // la salpicadura
  if (t > salpica) {
    const s = t - salpica;
    for (const q of GOTAS) {
      const x = 540 + Math.cos(q.a) * q.v * s, y = NIVEL - 30 + Math.sin(q.a) * q.v * s + 1600 * s * s;
      if (y > NIVEL + 10) continue;
      g.fillStyle = "rgba(210,255,110,0.9)"; g.beginPath(); g.arc(x, y, q.r, 0, 6.2832); g.fill();
    }
  }
  // al deshacerse: un hervidero de burbujitas alrededor de la bola
  if (des > 0 && des < 1) {
    const y = yBola(t);
    for (const f of FIZZ) {
      const u = (t * f.v + f.d) % 1, rr = 60 + 260 * u;
      g.fillStyle = `rgba(240,255,190,${0.8 * (1 - u) * Math.sin(des * 3.14)})`;
      g.beginPath(); g.arc(540 + Math.cos(f.a) * rr, y + Math.sin(f.a) * rr * 0.6 - 120 * u, f.r, 0, 6.2832); g.fill();
    }
    k.brillo(g, 540, y, 900, "200,255,120", 0.4 * Math.sin(des * 3.14));
  }
  // la bola, encima del ácido
  if (t < salpica) bola(false);
  velo(g, 0.55);
}

export const momentos = { salpica, deshace: Tdes };
