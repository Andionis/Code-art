// «Y no solo llega desde arriba: en el fondo del mar hay volcanes y grietas que escupen agua hirviendo, cargada de
// minerales.»
// Sigue con la misma cámara del plano anterior (sin corte): baja la mirada al mar y se hunde en él.
// - «Y no solo llega desde arriba»: la cámara baja de las nubes al mar y se mete en el agua (la superficie pasa por
//   la pantalla); dentro, agua azul con rayos de luz.
// - «en el fondo del mar»: baja a lo oscuro; aparece el fondo de roca.
// - «volcanes y grietas»: chimeneas de roca con grietas al rojo, y grietas encendidas en el suelo.
// - «escupen agua hirviendo»: de las chimeneas sale humo negro a borbotones, con burbujas que tiemblan.
// - «cargada de minerales»: dentro del humo suben chispas de colores y cristales de sal. Antes del corte todo frena.
import * as k from "#kit";
import { v } from "#voz";
import { camPaisaje, paisaje, velo, grano } from "../mundo.js";
import { camara as camAntes, dibuja as dibujaAntes } from "./05-ciclo.js";

export const desde = () => v.frase(9).inicio;
export const entrada = "sigue";

const { suave: su, tramo: tr, mez, claves, azar } = k;
const f9 = v.frase(9);
const T0 = f9.inicio, Tarr = f9.t("arriba"), Tfon = f9.t("fondo"), Tvol = f9.t("volcanes"), Tgri = f9.t("grietas"), Tesc = f9.t("escupen"), Thir = f9.t("hirviendo"), Tmin = f9.t("minerales"), Tfin = v.frase(10).inicio;
export const momentos = { zambulle: Tarr + 0.35, volcanes: Tvol, grietas: Tgri, escupen: Tesc, hirviendo: Thir, minerales: Tmin };

// fuera del agua: la cámara del plano anterior baja la mirada y se acerca al agua
const c0 = camAntes(T0);
const camH = claves([[T0, c0.h], [Tarr + 0.45, 0.05]]), camHy = claves([[T0, c0.hy], [Tarr, 620], [Tarr + 0.45, 560]]);
const Tagua = Tarr + 0.3, Tdentro = Tarr + 0.6;
// el tiempo que frena al final
const TS = Tfin - 0.45, DS = 0.35;
const lento = (t) => { const d = t - TS; return d <= 0 ? t : TS + Math.min(d, DS) - Math.min(d, DS) ** 2 / (2 * DS); };

const az = azar(9090);
const CHIMENEAS = [{ x: 300, base: 1560, alto: 520, w: 120 }, { x: 640, base: 1500, alto: 760, w: 150 }, { x: 900, base: 1600, alto: 420, w: 100 }];
const HUMO = Array.from({ length: 210 }, (_, i) => ({ ch: i % 3, f: az(), dx: (az() - 0.5), r: 60 + az() * 80, v: 0.6 + az() * 0.5 }));
const CHISPAS = Array.from({ length: 60 }, (_, i) => ({ ch: i % 3, f: az(), dx: (az() - 0.5), c: ["255,200,90", "255,255,255", "150,230,255", "255,140,200"][i % 4], sem: i * 31 }));
const BURBUJAS = Array.from({ length: 50 }, (_, i) => ({ ch: i % 3, f: az(), dx: (az() - 0.5), r: 6 + az() * 12 }));
const GRIETAS = Array.from({ length: 7 }, () => { const x = az() * 1080, y = 1640 + az() * 260; return Array.from({ length: 6 }, (_, j) => [x + j * 40 + (az() - 0.5) * 50, y + (az() - 0.5) * 30 + j * 6]); });

export function dibuja(g, t0) {
  const t = lento(t0);
  // fuera del agua
  if (t < Tdentro) {
    const c = camPaisaje(c0.x, camH(t), c0.z, camHy(t));
    dibujaAntes(g, t, c);
    if (t < Tagua) return;
  }
  // dentro del agua (la superficie sube por la pantalla al zambullirse)
  const ys = t < Tdentro ? mez(1950, -60, su(tr(t, Tagua, Tdentro))) : -60;
  g.save(); g.beginPath(); g.rect(0, ys, 1080, 1960 - ys); g.clip();
  const hondo = su(tr(t, Tdentro, Tvol));
  const gr = g.createLinearGradient(0, 0, 0, 1920);
  gr.addColorStop(0, `rgb(${k.mezRgb("40,170,220", "18,70,120", hondo)})`); gr.addColorStop(1, `rgb(${k.mezRgb("10,90,160", "4,22,46", hondo)})`);
  g.fillStyle = gr; g.fillRect(0, 0, 1080, 1920);
  k.rayos(g, t, 1500, 1 - 0.6 * hondo, 7);
  g.save(); g.globalCompositeOperation = "screen"; g.globalAlpha = 0.25 * (1 - hondo);
  g.drawImage(k.causticas, -200, -200 + t * 20, 1480, 1400); g.restore();
  // el fondo: sube desde abajo y la cámara entra un poco hacia él
  const sube = su(tr(t, Tfon - 0.3, Tvol + 0.2)), entra = su(tr(t, Tvol, Tfin));
  g.save();
  g.translate(540, 1300); g.scale(1 + 0.12 * entra, 1 + 0.12 * entra); g.translate(-540, -1300 + (1 - sube) * 1500);
  fondo(g, t);
  g.restore();
  g.restore();
  // la línea de la superficie mientras pasa
  if (ys > -50 && ys < 1950) { g.fillStyle = "rgba(230,250,255,0.85)"; g.fillRect(0, ys - 6, 1080, 12); }
  velo(g, 0.35);
}

function fondo(g, t) {
  const enciende = su(tr(t, Tvol - 0.2, Tgri + 0.3)), sopla = su(tr(t, Tesc - 0.2, Tesc + 0.3)), mineral = su(tr(t, Tmin - 0.4, Tmin + 0.3));
  for (const ch of CHIMENEAS) k.brillo(g, ch.x, ch.base - ch.alto - 300, 900, "60,140,200", 0.35);
  for (const ch of CHIMENEAS) {
    const top = ch.base - ch.alto;
    // el humo negro que sale de arriba (detrás de la chimenea siguiente no importa: van por orden)
    HUMO.forEach((h) => {
      if (CHIMENEAS[h.ch] !== ch) return;
      const u = (t * h.v * (0.3 + 0.9 * sopla) + h.f) % 1;
      const y = top - u * 1300, x = ch.x + h.dx * (40 + u * 380) + 40 * Math.sin(u * 5 + h.f * 9);
      const r = h.r * (0.4 + 1.8 * u) * (0.5 + 0.5 * sopla);
      const al = 0.9 * (1 - u) * (0.3 + 0.7 * sopla) * su(tr(t, Tfon, Tvol));
      const hg = g.createRadialGradient(x - r * 0.2, y - r * 0.2, 0, x, y, r);
      hg.addColorStop(0, `rgba(12,10,12,${Math.min(1, al * 1.2)})`); hg.addColorStop(0.6, `rgba(20,18,22,${al * 0.8})`); hg.addColorStop(1, "rgba(30,30,40,0)");
      g.fillStyle = hg; g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill();
    });
    // la chimenea: una torre de roca rugosa que se estrecha, con grietas que brillan
    g.save();
    g.beginPath(); g.moveTo(ch.x - ch.w, ch.base + 160);
    for (let i = 0; i <= 10; i++) { const u = i / 10; g.lineTo(ch.x - ch.w * mez(1, 0.42, u) + 12 * Math.sin(i * 2.3 + ch.x), ch.base - ch.alto * u); }
    for (let i = 10; i >= 0; i--) { const u = i / 10; g.lineTo(ch.x + ch.w * mez(1, 0.42, u) + 12 * Math.cos(i * 1.9 + ch.x), ch.base - ch.alto * u); }
    g.closePath();
    const cg = g.createLinearGradient(ch.x - ch.w, 0, ch.x + ch.w, 0);
    cg.addColorStop(0, "#5a5f6a"); cg.addColorStop(0.4, "#3a3d46"); cg.addColorStop(1, "#16181e");
    g.fillStyle = cg; g.fill(); g.clip();
    g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.6; g.drawImage(k.red, ch.x - ch.w - 20, top - 20, ch.w * 2 + 40, ch.alto + 80);
    g.globalCompositeOperation = "lighter"; g.globalAlpha = 1; g.lineCap = "round";
    for (let i = 0; i < 4; i++) {
      const yy = top + ch.alto * (0.2 + i * 0.2);
      g.strokeStyle = `rgba(255,120,40,${0.8 * enciende})`; g.lineWidth = 5;
      g.beginPath(); g.moveTo(ch.x - ch.w * 0.5, yy); g.lineTo(ch.x - ch.w * 0.1, yy + 30); g.lineTo(ch.x + ch.w * 0.2, yy + 10); g.lineTo(ch.x + ch.w * 0.45, yy + 45); g.stroke();
    }
    g.restore();
    // la boca encendida
    k.brillo(g, ch.x, top, ch.w * 3, "255,110,40", 0.8 * enciende);
    // las burbujas del agua hirviendo
    BURBUJAS.forEach((b) => {
      if (CHIMENEAS[b.ch] !== ch) return;
      const u = (t * 0.8 + b.f) % 1, vis = su(tr(t, Thir - 0.3, Thir + 0.3));
      if (vis <= 0) return;
      const x = ch.x + b.dx * (30 + u * 260) + 10 * Math.sin(t * 9 + b.f * 20), y = top - u * 1100;
      g.strokeStyle = `rgba(220,240,255,${0.7 * vis * (1 - u)})`; g.lineWidth = 2.5; g.beginPath(); g.arc(x, y, b.r, 0, Math.PI * 2); g.stroke();
    });
    // las chispas de minerales y los cristales de sal
    CHISPAS.forEach((q) => {
      if (CHIMENEAS[q.ch] !== ch || mineral <= 0) return;
      const u = (t * 0.45 + q.f) % 1;
      const x = ch.x + q.dx * (30 + u * 340), y = top - u * 1200;
      if (q.c === "255,255,255") grano(g, x, y, 12 + 6 * u, t, q.sem, mineral * (1 - u));
      else k.brillo(g, x, y, 60, q.c, mineral * (1 - u) * 0.9);
    });
  }
  // el suelo de roca
  const sg = g.createLinearGradient(0, 1450, 0, 2100);
  sg.addColorStop(0, "#2b3340"); sg.addColorStop(1, "#0b0e14");
  g.fillStyle = sg; g.beginPath(); g.moveTo(0, 1600);
  for (let x = 0; x <= 1080; x += 60) g.lineTo(x, 1560 + 50 * Math.sin(x * 0.011) + 30 * Math.sin(x * 0.037));
  g.lineTo(1080, 2300); g.lineTo(0, 2300); g.closePath(); g.fill();
  g.save(); g.clip(); g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.6; g.drawImage(k.manchas, -100, 1450, 1300, 900); g.restore();
  // las grietas al rojo del suelo
  g.save(); g.globalCompositeOperation = "lighter"; g.lineCap = "round"; g.lineJoin = "round";
  for (const gr of GRIETAS) {
    for (const [w, a] of [[22, 0.25], [7, 0.9]]) {
      g.strokeStyle = `rgba(255,${w > 10 ? 90 : 170},40,${a * enciende * (0.8 + 0.2 * Math.sin(t * 6 + gr[0][0]))})`; g.lineWidth = w;
      g.beginPath(); gr.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.stroke();
    }
  }
  g.restore();
}
