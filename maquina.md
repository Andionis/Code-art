- Node fetch no usa el proxy de la sesión en la nube: lanzar el motor con NODE_USE_ENV_PROXY=1 NODE_EXTRA_CA_CERTS=/root/.ccr/ca-bundle.crt.

- Nube (Claude Code en la web): la clave de ElevenLabs la pone el proxy. La voz sale con
  `NODE_USE_ENV_PROXY=1 NODE_EXTRA_CA_CERTS=/root/.ccr/ca-bundle.crt ELEVENLABS_API_KEY=sk_proxy node motor/voz.mjs <proyecto>`
  (sin eso, `fetch failed`/`ENOTFOUND`).
