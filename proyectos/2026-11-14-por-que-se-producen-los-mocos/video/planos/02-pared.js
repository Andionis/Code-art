// «Por dentro, tu nariz está forrada de una capa que suelta gotas de moco sin parar.
//  Es casi toda agua, pero con unas proteínas que la vuelven espesa, como gelatina.
//  Y funciona como un papel atrapamoscas: el polvo, el polen y los virus que respiras se quedan pegados.»
// La pared de la nariz, de cerca, con una sola cámara que entra en una gota y vuelve a salir.
// - «Por dentro»: la pared rosada, hecha de células con relieve; la cámara se acerca despacio.
// - «gotas»: de sus poros salen gotas que se hinchan y brillan, una tras otra, por toda la pared.
// - «Es casi toda»: la cámara entra en la gota del centro. «agua»: dentro, agua clara azul con su luz que se mueve.
// - «proteínas»: llegan hebras doradas que se enredan; «espesa»: todo se vuelve dorado y espeso; «gelatina»: tiembla.
// - «Y funciona»: la cámara sale: las gotas se han juntado en una capa dorada que cubre la pared.
// - «polvo», «polen», «virus»: cada uno llega volando, choca con la capa y se queda pegado.
// - «pegados»: la capa tiembla con todo pegado. Reposa antes del corte.
import * as k from "#kit";
import { v } from "#voz";
import { moco, polen, polvo, virus, velo } from "../mundo.js";

export const desde = (vz) => vz.frase(3).inicio;

const { suave: su, tramo: tr, mez, azar, entra, claves, pulso } = k;
const f3 = v.frase(3), f4 = v.frase(4), f5 = v.frase(5);
const T0 = f3.inicio, Tgot = f3.t("gotas"), Tsin = f3.t("sin");
const Tes = f4.inicio, Tagu = f4.t("agua"), Tpro = f4.t("proteinas"), Tesp = f4.t("espesa"), Tgel = f4.t("gelatina");
const Tfun = f5.inicio, Tpap = f5.t("papel"), Tpol = f5.t("polvo"), Tpln = f5.t("polen"), Tvir = f5.t("virus"), Tpeg = f5.t("pegados"), Tfin = f5.fin;

// ---------------------------------------------------------------- la pared: células rosadas con relieve (una vez)
const W = 1500, H = 2300, OX = (W - 1080) / 2, OY = (H - 1920) / 2; // el lienzo de la pared, un poco más grande que la pantalla
const az = azar(777);
const CEL = [];
for (let y = -40; y < H + 60; y += 78) for (let x = -40 + ((y / 78) % 2) * 39; x < W + 60; x += 78) CEL.push({ x: x + (az() - 0.5) * 30, y: y + (az() - 0.5) * 30, r: 40 + az() * 14 });
const PARED = (() => {
  const l = k.lienzo(W, H), g = l.getContext("2d");
  g.fillStyle = "#7a1b2c"; g.fillRect(0, 0, W, H);
  for (const c of CEL) {
    const gr = g.createRadialGradient(c.x - c.r * 0.35, c.y - c.r * 0.4, c.r * 0.1, c.x, c.y, c.r * 1.05);
    gr.addColorStop(0, "#ffc2c6"); gr.addColorStop(0.45, "#ea7d8c"); gr.addColorStop(0.85, "#b2394f"); gr.addColorStop(1, "rgba(110,20,40,0)");
    g.fillStyle = gr; g.beginPath(); g.arc(c.x, c.y, c.r * 1.05, 0, 6.2832); g.fill();
  }
  g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.35; g.drawImage(k.manchas, 0, 0, W, H);
  g.globalAlpha = 0.25; g.drawImage(k.red, 0, 0, W, H);
  return k.fijar(l);
})();

// ---------------------------------------------------------------- las gotas que salen de los poros
const CENTRO = { x: 540, y: 1060 }; // la gota en la que entra la cámara (en coordenadas de pantalla a zoom 1)
const GOTAS = [{ x: CENTRO.x, y: CENTRO.y, r: 92, nace: Tgot - 0.15, sem: 1 }];
for (let i = 0; i < 120; i++) {
  const c = CEL[Math.floor(az() * CEL.length)], x = c.x - OX, y = c.y - OY;
  if (y < 560 || y > 1650 || Math.hypot(x - CENTRO.x, y - CENTRO.y) < 200 || GOTAS.some((o) => Math.hypot(o.x - x, o.y - y) < 150)) continue;
  GOTAS.push({ x, y, r: 45 + az() * 35, nace: mez(Tgot - 0.1, Tsin + 0.6, az()), sem: i + 5 });
}
export const gotas = GOTAS.map((q) => q.nace).sort((a, b) => a - b);

// ---------------------------------------------------------------- lo que se pega
const PEG = [];
const tipos = [["polvo", Tpol, 3], ["polen", Tpln, 3], ["virus", Tvir, 3]];
const azp = azar(31337);
for (const [tipo, T, n] of tipos) for (let i = 0; i < n; i++) {
  const x = mez(340, 740, azp()), y = mez(800, 1280, azp()), lado = azp() < 0.5 ? -1 : 1;
  PEG.push({ tipo, x, y, r: tipo === "virus" ? 40 + azp() * 8 : tipo === "polen" ? 38 + azp() * 8 : 44 + azp() * 8,
    llega: T + i * 0.1 + 0.05, desde: { x: x + lado * mez(500, 800, azp()), y: y - mez(400, 900, azp()) }, ang: azp() * 6.28, sem: i + 50 });
}
export const choques = PEG.map((p) => ({ t: p.llega + 0.32, tipo: p.tipo })).sort((a, b) => a.t - b.t);

// ---------------------------------------------------------------- dentro de la gota: el agua y las hebras de proteína
const azh = azar(2024);
const HEBRAS = Array.from({ length: 34 }, (_, i) => ({ x: azh() * 1080, y: 300 + azh() * 1400, a: azh() * 6.28, l: 500 + azh() * 700, f: 0.5 + azh() * 1.4, ph: azh() * 6.28, nace: mez(Tpro - 0.15, Tesp + 0.3, i / 34) }));
const BURB = Array.from({ length: 30 }, () => ({ x: azh() * 1080, y: azh() * 1920, r: 6 + azh() * 22, v: 40 + azh() * 80 }));

function dentro(g, t) {
  const esp = su(tr(t, Tesp - 0.3, Tesp + 0.5));
  const fondo = g.createLinearGradient(0, 0, 0, 1920);
  fondo.addColorStop(0, k.mezColor("#0c3b63", "#5a3a08", esp)); fondo.addColorStop(1, k.mezColor("#1f86b0", "#d99a1c", esp));
  g.fillStyle = fondo; g.fillRect(0, 0, 1080, 1920);
  // la luz del agua, que se mueve despacio (más lenta cuando espesa)
  g.save(); g.globalCompositeOperation = "lighter"; g.globalAlpha *= 0.45 * (1 - 0.5 * esp);
  const dx = 30 * Math.max(0, t - Tes) - 21 * Math.max(0, t - Tesp);
  g.drawImage(k.causticas, -200 + dx, -200, 1500, 2400); g.restore();
  if (esp > 0) { g.save(); g.globalCompositeOperation = "lighter"; g.globalAlpha *= 0.4 * esp; g.drawImage(CAUS_ORO(), -200 + dx, -200, 1500, 2400); g.restore(); }
  // burbujitas que suben (más despacio cuando espesa)
  for (const b of BURB) {
    const y = ((b.y - t * b.v * (1 - 0.8 * esp)) % 1920 + 1920) % 1920;
    g.strokeStyle = `rgba(255,255,255,${0.35})`; g.lineWidth = 2.5; g.beginPath(); g.arc(b.x, y, b.r, 0, 6.2832); g.stroke();
    g.fillStyle = "rgba(255,255,255,0.4)"; g.beginPath(); g.arc(b.x - b.r * 0.35, y - b.r * 0.35, b.r * 0.22, 0, 6.2832); g.fill();
  }
  // las hebras de proteína: llegan, se enredan y engordan
  g.save(); g.lineCap = "round"; g.lineJoin = "round";
  for (const h of HEBRAS) {
    if (t < h.nace) continue;
    const u = entra(tr(t, h.nace, h.nace + 0.6)), largo = h.l * u, gruesa = mez(7, 16, esp);
    const pts = [];
    for (let s = 0; s <= 24; s++) {
      const q = (s / 24) * largo, a = h.a + 0.9 * Math.sin(q / 160 * h.f + h.ph + t * 0.8);
      pts.push([h.x + Math.cos(h.a) * q + Math.cos(a + 1.57) * 40 * Math.sin(q / 90 + t), h.y + Math.sin(h.a) * q + Math.sin(a + 1.57) * 40 * Math.sin(q / 90 + t)]);
    }
    const linea = (w, c) => { g.strokeStyle = c; g.lineWidth = w; g.beginPath(); pts.forEach((p, i) => (i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]))); g.stroke(); };
    linea(gruesa * 1.9, "rgba(120,60,0,0.35)");
    linea(gruesa, "rgba(255,190,60,0.95)");
    linea(gruesa * 0.35, "rgba(255,245,200,0.9)");
  }
  g.restore();
}
let causOro = null;
const CAUS_ORO = () => (causOro ??= k.tenir(k.causticas, "#ffd27a"));

// ---------------------------------------------------------------- la cámara: zoom hacia la gota del centro y vuelta
const zoom = claves([[T0, 2.4], [T0 + 1.5, 1.05], [Tgot, 1.12], [Tsin + 0.5, 1.35], [Tes + 0.1, 1.9], [Tes + 0.55, 12], [Tfun - 0.05, 12], [Tfun + 0.35, 6], [Tpap + 0.2, 1.7], [Tfin, 1.8]]);
const adentro = (t) => su(tr(t, Tes + 0.25, Tes + 0.5)) * (1 - su(tr(t, Tfun - 0.05, Tfun + 0.3)));

export function dibuja(g, t) {
  const Z = zoom(t), capa = su(tr(t, Tfun - 0.05, Tfun + 0.6)), tiembla = pulso(t, Tpeg + 0.2, 0.35) * Math.sin((t - Tpeg) * 30);
  const ad = adentro(t);
  if (ad < 1) {
    g.save();
    g.translate(CENTRO.x, CENTRO.y); g.scale(Z, Z); g.translate(-CENTRO.x, -CENTRO.y);
    g.drawImage(PARED, -OX, -OY);
    // la capa húmeda: un brillo que barre la pared en «forrada»
    const barre = tr(t, T0 + 1.0, Tgot - 0.1);
    if (barre > 0 && barre < 1) {
      const by = mez(-200, 2100, barre), bg = g.createLinearGradient(0, by - 260, 0, by + 260);
      bg.addColorStop(0, "rgba(255,230,235,0)"); bg.addColorStop(0.5, "rgba(255,230,235,0.32)"); bg.addColorStop(1, "rgba(255,230,235,0)");
      g.save(); g.globalCompositeOperation = "lighter"; g.fillStyle = bg; g.fillRect(-OX, by - 260, W, 520); g.restore();
    }
    // las gotas (doradas cuando son gelatina)
    const oro = su(tr(t, Tesp - 0.3, Tesp + 0.5));
    for (const q of GOTAS) {
      if (t < q.nace) continue;
      const crece = entra(tr(t, q.nace, q.nace + 0.5)), r = q.r * crece * (1 + 0.15 * capa);
      g.save(); g.translate(q.x, q.y); g.scale(1 + 0.05 * tiembla, 1 - 0.05 * tiembla);
      moco(g, 0, 0, r, t, q.sem, { tono: 0.08 + 0.45 * oro, temblor: 0.6 });
      g.restore();
    }
    // la capa dorada que lo cubre todo
    if (capa > 0) {
      g.save(); g.globalAlpha = capa;
      g.fillStyle = "rgba(240,190,70,0.38)"; g.fillRect(-OX, -OY, W, H);
      g.globalCompositeOperation = "lighter"; g.globalAlpha = 0.22 * capa;
      g.drawImage(CAUS_ORO(), -OX + 6 * tiembla, -OY + 12 * Math.max(0, t - Tfun), W, H);
      g.restore();
    }
    // lo que llega y se pega
    for (const p of PEG) {
      if (t < p.llega) continue;
      const u = tr(t, p.llega, p.llega + 0.35), e = entra(u);
      const x = mez(p.desde.x, p.x, e), y = mez(p.desde.y, p.y, e) + (u >= 1 ? 4 * tiembla : 0);
      const aplasta = pulso(t, p.llega + 0.35, 0.08);
      g.save(); g.translate(x, y); g.scale(1 + 0.15 * aplasta, 1 - 0.15 * aplasta);
      if (p.tipo === "virus") virus(g, 0, 0, p.r, p.ang + (1 - e) * 3);
      else if (p.tipo === "polen") polen(g, 0, 0, p.r, p.ang + (1 - e) * 3);
      else polvo(g, 0, 0, p.r, p.sem);
      g.restore();
      // la capa los envuelve un poco: un velo dorado y un brillo alrededor
      if (u >= 1) {
        g.save(); g.globalAlpha = 0.22 * su(tr(t, p.llega + 0.35, p.llega + 0.7));
        g.fillStyle = "#ffd36b"; g.beginPath(); g.arc(p.x, p.y + 4 * tiembla, p.r * 1.45, 0, 6.2832); g.fill(); g.restore();
      }
      k.brillo(g, p.x, p.y, p.r * 6, "255,220,120", 0.5 * pulso(t, p.llega + 0.36, 0.1));
    }
    g.restore();
  }
  if (ad > 0) {
    g.save(); g.globalAlpha = ad;
    const j = Math.sin((t - Tgel) * 26) * Math.exp(-Math.max(0, t - Tgel) * 3) * (t > Tgel ? 1 : 0);
    g.translate(540, 960); g.scale(1 + 0.05 * j, 1 - 0.05 * j); g.translate(-540, -960);
    dentro(g, t);
    g.restore();
  }
  velo(g, 0.55);
}

export const momentos = { gotas, choques, entra: Tes + 0.1, agua: Tagu, proteinas: Tpro, espesa: Tesp, gelatina: Tgel, sale: Tfun, pegados: Tpeg };
