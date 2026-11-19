# Lyric video: Hombre (Lil Naay)

Lo decidido: del «Rompe» (12,85 s de la canción) hasta «Quemando de la verde» (39,15 s). Estilo: letra protagonista
sobre una ciudad de noche con neón que cambia de color por línea y late con el beat.

Cómo está hecho (no es un video de voz):
- audio/cancion-estereo.wav: el tramo de la canción; voz/voz.wav es la misma en mono (para el motor).
- voz/tiempos.json: la letra con el segundo de cada palabra (transcrita con ElevenLabs y desplazada al tramo).
- audio/golpes.json: los beats (~83 bpm). subtitulos: "no" en guion.json; la letra la dibuja 01-letra.js.
- Tras render.mjs se cambia el audio por el estéreo original con ffmpeg (-map 0:v -map 1:a).

Pasos:
- [x] Tramo, letra sincronizada y beats
- [x] Borrador v1 (ciudad de neón)
- [x] Borrador v2: fondo = video del creador (fondo/original.mov) en bucle, recortado en vertical siguiendo al artista (fondo/f/); letra corregida por el creador
- [x] Borrador v3: letra solo hasta «hombre» y desvanecido a negro de video y música (23,2 → 25,1 s)
- [x] Versión en blanco y negro (BN=1 al renderizar): revisar/Hombre lyric v3 blanco y negro (borrador).mp4
- [x] Aprobada la de blanco y negro
- [x] Final a 60 fps (BN=1), con el audio estéreo: salida/./Lil Naay - Hombre (letra).mp4; flyer (portada 3, SIN_LETRA=1) y descripciones

