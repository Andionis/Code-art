// Prepara un lyric video de Michi Lyrics de una sola vez: el tramo de la canción, la letra sincronizada palabra por
// palabra, el ritmo, el video de fondo en vertical y el plano (la plantilla piezas/planos/letra.js). Luego se mira con
// ver.mjs y se hace el borrador con render.mjs como cualquier video; al final, --poner-audio pone la canción en estéreo.
import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { basename, join } from "node:path";
import { RAIZ, argumentos, ayuda, cargarClaves, escribirJson, fallo, ffmpeg, leerAudio, leerJson, r3 } from "../../motor/lib/comun.mjs";

ayuda(`
node piezas/lyric/preparar.mjs <proyecto> --cancion cancion.mp3 --desde 20 --hasta 46.6 --letra letra.txt
                               [--fondo video.mp4] [--x 0.5] [--funde 41.75] [--sin-marca] [--color]
node piezas/lyric/preparar.mjs <proyecto> --poner-audio "revisar/tmp.mp4" --salida "revisar/Nombre v1 (borrador).mp4"

<proyecto>   la carpeta (proyectos/...); si no existe, se crea con ese nombre corto (lyric-dios-primero).
--desde/--hasta  el tramo, en segundos de la canción.
--letra      un archivo de texto: una línea por frase, tal cual la escribió el creador. Lo que va entre paréntesis
             (los «Ah-ah», «Yeh») no se pone. La palabra clave de cada línea, entre *asteriscos*; si no, la más larga.
--fondo      el video de fondo (se repite en bucle). --x: dónde cortarlo en vertical, de 0 (izquierda) a 1 (derecha).
             Sin fondo: un degradado oscuro con el color de cada línea.
--funde      el segundo de la canción en que empieza el desvanecido (de la música y de la imagen, hasta el final).
             Sin nada: el último segundo y poco.
--sin-marca  sin la marca de agua Michi Lyrics. --color: el fondo a color (por defecto, blanco y negro).
--poner-audio  cambia el audio de un render por la canción en estéreo (render.mjs la mezcla en mono).
`);

const { sueltos, op } = argumentos();
if (!sueltos[0]) fallo("Falta el proyecto.");
let dir = [sueltos[0], join(RAIZ, sueltos[0]), join(RAIZ, "proyectos", sueltos[0])].find((d) => existsSync(join(d, "guion.json")));

// --- solo poner el audio estéreo a un render
if (op["poner-audio"]) {
  if (!dir) fallo(`No encuentro el proyecto ${sueltos[0]}.`);
  const ent = join(dir, op["poner-audio"]), sal = join(dir, op.salida || op["poner-audio"].replace(/\.mp4$/, " (audio).mp4"));
  ffmpeg(["-i", ent, "-i", join(dir, "audio", "cancion-estereo.wav"), "-map", "0:v", "-map", "1:a", "-c:v", "copy", "-c:a", "aac", "-b:a", "256k", "-shortest", "-movflags", "+faststart", sal]);
  rmSync(ent);
  console.log(sal);
  process.exit(0);
}

for (const k of ["cancion", "desde", "hasta", "letra"]) if (!op[k]) fallo(`Falta --${k}.`);
const desde = Number(op.desde), hasta = Number(op.hasta), D = r3(hasta - desde);
if (!(D > 1)) fallo("El tramo tiene que durar más de un segundo.");
if (!dir) {
  const salida = execFileSync("node", [join(RAIZ, "motor", "nuevo.mjs"), `Lyric video ${basename(sueltos[0])}`, "--slug", basename(sueltos[0]).replace(/^\d{4}-\d{2}-\d{2}-/, "")], { encoding: "utf8" });
  dir = salida.trim().split(/\r?\n/).pop().trim();
}
for (const c of ["audio", "voz", "fondo", "video/planos"]) mkdirSync(join(dir, c), { recursive: true });

// --- la letra del creador
const norm = (s) => s.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9ñ]/g, "");
const lineas = readFileSync(op.letra, "utf8").split(/\r?\n/).map((l) => l.replace(/\([^)]*\)/g, " ").replace(/\s+/g, " ").trim()).filter((l) => norm(l));
const frases = lineas.map((l) => {
  const palabras = l.split(" ").filter((w) => norm(w.replace(/\*/g, "")));
  let clave = palabras.find((w) => /^\*.*\*[.,!?;:]*$/.test(w));
  const limpias = palabras.map((w) => w.replace(/\*/g, ""));
  clave = clave ? norm(clave.replace(/\*/g, "")) : norm(limpias.reduce((a, b) => (norm(b).length > norm(a).length ? b : a)));
  return { texto: limpias.join(" "), palabras: limpias, clave };
});

// --- el tramo de la canción: en estéreo para el final y en mono para el motor, con el desvanecido
const funde = op.funde !== undefined ? Number(op.funde) - desde : Math.max(0, D - 1.2);
ffmpeg(["-ss", String(desde), "-t", String(D), "-i", op.cancion, "-af", `afade=t=in:d=0.03,afade=t=out:st=${r3(funde)}:d=${r3(D - funde)}:curve=qsin`, "-ar", "48000", "-ac", "2", join(dir, "audio", "cancion-estereo.wav")]);
ffmpeg(["-i", join(dir, "audio", "cancion-estereo.wav"), "-ac", "1", join(dir, "voz", "voz.wav")]);

// --- lo que se canta y cuándo (ElevenLabs), con un segundo de margen a cada lado
const m0 = Math.max(0, desde - 1), tmp = join(dir, "audio", "tramo-stt.mp3");
ffmpeg(["-ss", String(m0), "-t", String(D + 2), "-i", op.cancion, "-ac", "1", "-b:a", "128k", tmp]);
cargarClaves();
const form = new FormData();
form.append("model_id", "scribe_v1"); form.append("language_code", "spa"); form.append("timestamps_granularity", "word"); form.append("tag_audio_events", "false");
form.append("file", new Blob([readFileSync(tmp)], { type: "audio/mpeg" }), "tramo.mp3");
const resp = await fetch("https://api.elevenlabs.io/v1/speech-to-text", { method: "POST", headers: { "xi-api-key": process.env.ELEVENLABS_API_KEY || "proxy" }, body: form });
if (!resp.ok) fallo(`ElevenLabs no pudo sacar la letra (${resp.status}): ${(await resp.text()).slice(0, 300)}`);
const stt = await resp.json();
rmSync(tmp);
escribirJson(join(dir, "audio", "oido.json"), stt);
const oidas = stt.words.filter((w) => w.type === "word").map((w) => ({ t: norm(w.text), a: w.start + m0 - desde, b: w.end + m0 - desde }));

// Se alinean letra a letra la letra del creador y lo que se oyó (distancia de edición): cada letra escrita toma el
// segundo de la letra oída que le toca; las que no tienen pareja, el de sus vecinas.
const oc = [];
for (const w of oidas) { const n = w.t.length || 1; for (let j = 0; j < n; j++) oc.push({ c: w.t[j] || "", a: w.a + ((w.b - w.a) * j) / n, b: w.a + ((w.b - w.a) * (j + 1)) / n }); }
const ec = [];
frases.forEach((f, fi) => f.palabras.forEach((p, pi) => { for (const c of norm(p) || "_") ec.push({ c, fi, pi }); }));
const N = ec.length, M = oc.length, dp = Array.from({ length: N + 1 }, () => new Float64Array(M + 1));
for (let i = 0; i <= N; i++) dp[i][0] = i;
for (let j = 0; j <= M; j++) dp[0][j] = j * 0.5; // lo oído de más (antes o después) cuesta poco
for (let i = 1; i <= N; i++) for (let j = 1; j <= M; j++)
  dp[i][j] = Math.min(dp[i - 1][j - 1] + (ec[i - 1].c === oc[j - 1].c ? 0 : 1), dp[i - 1][j] + 1, dp[i][j - 1] + 0.5);
// lo oído de más al final no cuesta nada: se empieza desde la mejor pareja de la última letra escrita
let i = N, j = M;
for (let q = 0; q <= M; q++) if (dp[N][q] < dp[N][j]) j = q;
while (i > 0 && j > 0) {
  if (dp[i][j] === dp[i - 1][j - 1] + (ec[i - 1].c === oc[j - 1].c ? 0 : 1)) { ec[i - 1].a = oc[j - 1].a; ec[i - 1].b = oc[j - 1].b; i--; j--; }
  else if (dp[i][j] === dp[i - 1][j] + 1) i--;
  else j--;
}
// las letras sin pareja: entre sus vecinas
for (let x = 0; x < N; x++) if (ec[x].a === undefined) {
  let p = x - 1, s = x + 1;
  while (p >= 0 && ec[p].a === undefined) p--;
  while (s < N && ec[s].a === undefined) s++;
  const ta = p >= 0 ? ec[p].b : 0, tb = s < N ? ec[s].a : Math.min(D, ta + 0.4), u = (x - p) / (s - p);
  ec[x].a = ta + (tb - ta) * u; ec[x].b = ec[x].a + 0.05;
}
const palabras = [], fs = [];
frases.forEach((f, fi) => {
  f.palabras.forEach((p, pi) => {
    const cs = ec.filter((c) => c.fi === fi && c.pi === pi);
    const a = Math.max(0, Math.min(...cs.map((c) => c.a))), b = Math.min(D, Math.max(...cs.map((c) => c.b)));
    palabras.push({ texto: p, inicio: r3(a), fin: r3(Math.max(b, a + 0.08)), frase: fi + 1, clave: norm(p) === f.clave });
  });
  const ps = palabras.filter((w) => w.frase === fi + 1);
  // las palabras de una frase, siempre en orden
  for (let q = 1; q < ps.length; q++) if (ps[q].inicio < ps[q - 1].inicio) ps[q].inicio = ps[q - 1].inicio, ps[q].fin = Math.max(ps[q].fin, ps[q].inicio + 0.08);
  fs.push({ n: fi + 1, texto: f.texto, clave: f.clave, inicio: ps[0].inicio, fin: ps[ps.length - 1].fin });
});
escribirJson(join(dir, "voz", "tiempos.json"), { firma: "cancion", duracion: D, frases: fs, palabras });

// --- el ritmo: el pulso del bombo (graves), su periodo y su fase
const x = leerAudio(join(dir, "voz", "voz.wav"), 48000), SR = 48000, hop = 240;
const env = [];
let lp = 0, lp2 = 0;
const al = 1 - Math.exp((-2 * Math.PI * 150) / SR);
for (let s = 0, acc = 0; s < x.length; s++) {
  lp += al * (x[s] - lp); lp2 += al * (lp - lp2); acc += lp2 * lp2;
  if ((s + 1) % hop === 0) { env.push(Math.log1p(1000 * acc / hop)); acc = 0; }
}
const fl = env.map((e, n) => Math.max(0, e - (env[n - 1] ?? e)));
const media = fl.reduce((a, b) => a + b, 0) / fl.length;
for (let n = 0; n < fl.length; n++) fl[n] -= media;
const fps = SR / hop;
let mejor = { r: -Infinity, lag: 0 };
for (let lag = Math.round(0.45 * fps); lag <= Math.round(1.0 * fps); lag++) {
  let r = 0;
  for (let n = 0; n + lag < fl.length; n++) r += fl[n] * fl[n + lag];
  if (r > mejor.r) mejor = { r, lag };
}
const per = mejor.lag / fps;
let fase = { s: -Infinity, f: 0 };
for (let f0 = 0; f0 < per; f0 += 0.005) {
  let s = 0;
  for (let t = f0; t < D; t += per) s += fl[Math.round(t * fps)] || 0;
  if (s > fase.s) fase = { s, f: f0 };
}
const golpes = [];
for (let t = fase.f; t < D; t += per) golpes.push(r3(t));
escribirJson(join(dir, "audio", "golpes.json"), { periodo: r3(per), golpes });

// --- el video de fondo, en vertical (540 × 960, 30 fps)
const cf = join(dir, "fondo", "f");
if (op.fondo) {
  rmSync(cf, { recursive: true, force: true }); mkdirSync(cf, { recursive: true });
  const ext = (op.fondo.match(/\.[a-z0-9]+$/i) || [".mp4"])[0];
  copyFileSync(op.fondo, join(dir, "fondo", "original" + ext));
  const cx = op.x !== undefined ? Number(op.x) : 0.5;
  ffmpeg(["-i", op.fondo, "-vf", `scale='if(gt(a,9/16),-2,540)':'if(gt(a,9/16),960,-2)',crop=540:960:'max(0,min(iw-540,iw*${cx}-270))':'max(0,(ih-960)/2)',fps=30`, "-q:v", "3", join(cf, "f%04d.jpg")]);
}

// --- el guion y el plano
const guion = leerJson(join(dir, "guion.json"));
Object.assign(guion, { titulo: guion.titulo || basename(dir), subtitulos: "no", frases: fs.map((f) => ({ texto: f.texto, clave: f.clave })), lyric: { bn: !op.color, funde: r3(funde), marca: !op["sin-marca"] } });
escribirJson(join(dir, "guion.json"), guion);
for (const f of readdirSync(join(dir, "video", "planos"))) rmSync(join(dir, "video", "planos", f));
copyFileSync(join(RAIZ, "piezas", "planos", "letra.js"), join(dir, "video", "planos", "01-letra.js"));

console.log(dir);
console.log(`${D} s, ${fs.length} líneas, ${golpes.length} golpes (${Math.round(60 / per)} bpm)${op.fondo ? `, fondo: ${readdirSync(cf).length} fotogramas` : ""}`);
for (const f of fs) console.log(`  ${f.inicio.toFixed(2)}-${f.fin.toFixed(2)}  ${f.texto}  [${f.clave}]`);
console.log("Lo oído (para comprobar la letra): audio/oido.json");
