# Dojo Proxy 🎌

A lightweight Vercel serverless proxy designed to serve randomized anime GIF headers for GitHub Profile READMEs.

## Features
- Dynamic random selection between left-facing and right-facing anime GIF pools.
- Strict HTTP cache-busting headers (`no-store, max-age=0`) tailored for GitHub Camo Proxy.
- Low-latency buffer piping directly from raw GitHub repository assets.

## Deployment
Deployed via Vercel Serverless Functions.
