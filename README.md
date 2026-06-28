# 🎌 Readme Asset Proxy

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Serverless-black?style=flat-square&logo=vercel)](https://vercel.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/kshanxs/readme-asset-proxy?style=flat-square)](https://github.com/kshanxs/readme-asset-proxy)

A high-performance, lightweight Vercel Serverless Function proxy designed to bypass GitHub Camo CDN caching and serve dynamic, randomized animated GIF assets for GitHub Profile READMEs.

---

## 💡 Why This Project Exists

When adding dynamic image logic (such as random character rotators) into GitHub Markdown READMEs, GitHub routes all image requests through its own caching proxy proxy (`camo.githubusercontent.com`). By default, Camo caches edge responses for extended periods, preventing standard image rotators from shuffling on fresh page renders.

**Readme Asset Proxy** solves this by fetching binary asset buffers directly on Vercel's global edge network and piping them back with strict anti-caching HTTP headers (`no-store, no-cache, max-age=0, s-maxage=0`).

---

## 🛠️ Features

* 🚀 **0-Latency Edge Piping:** Streams binary GIF buffers directly from raw GitHub CDN sources.
* 🛡️ **Strict Cache-Busting:** Emits custom HTTP headers (`CDN-Cache-Control: no-store`, `Pragma: no-cache`) to force GitHub Camo to fetch fresh random graphics on every refresh.
* 🔀 **Directional Character Pools:** Automatically segregates left-facing vs. right-facing characters to ensure header graphics always face inward toward section titles.
* 🪄 **Multi-Topic Endpoints:** Supports separate endpoints for headers (`Dojo`) and section themes (`Dev Spellbook`).

---

## 🛣️ API Reference

### Base Endpoint
`GET /api/dojo`

### Query Parameters

| Parameter | Type | Values | Description |
| :--- | :--- | :--- | :--- |
| `side` | `string` | `left` \| `right` | Selects from directional character pools to flank section headers. |
| `type` | `string` | `wizard` | Selects from the Hogwarts Professor randomizer pool. |

---

### Asset Pools

#### 1. Left Header Pool (`?side=left`)
Characters facing right, framed for the left side of section headers:
* 🏴‍☠️ **Monkey D. Luffy** (`One Piece`)
* ⚡ **Naruto Uzumaki - Rage Form** (`Naruto`)
* 🍥 **Naruto Uzumaki - Base Form** (`Naruto`)

#### 2. Right Header Pool (`?side=right`)
Characters facing left, framed for the right side of section headers:
* 👁️ **Itachi Uchiha - Mirrored** (`Naruto`)
* 🎋 **Nezuko Kamado** (`Demon Slayer`)
* 💥 **Goku** (`Dragon Ball Z`)

#### 3. Wizard Professors Pool (`?type=wizard`)
Magical characters for technology and skills section headers:
* 🧪 **Severus Snape** (`Harry Potter`)
* 🐺 **Remus Lupin** (`Harry Potter`)
* 🐾 **Sirius Black** (`Harry Potter`)
* 🪄 **Albus Dumbledore** (`Harry Potter`)

---

## 💻 Integration Guide

To consume these endpoints inside your GitHub Profile README, wrap the API endpoints in standard HTML `<img>` tags:

```html
<!-- Flanked Header Example -->
<h2 align="center">
    <img src="https://readme-asset-proxy-three.vercel.app/api/dojo?side=left" height="65" alt="Header Left" />
    <span>My Dojo</span>
    <img src="https://readme-asset-proxy-three.vercel.app/api/dojo?side=right" height="65" alt="Header Right" />
</h2>

<!-- Section Feature Example -->
<div align="center">
    <img src="https://readme-asset-proxy-three.vercel.app/api/dojo?type=wizard" width="120" alt="Wizard Professor" />
</div>
```

> 💡 **Tip:** If browser caches persist across rapid refreshes, append a version cache-buster parameter e.g. `&v=2`.

---

## ⚡ Deploying Your Own Instance

You can fork this repository and deploy your own custom asset pools in under 2 minutes:

1. **Fork this repository** to your GitHub account.
2. Update the asset URL arrays in `api/dojo.js` to point to your raw GitHub asset URLs.
3. Import your repository into [Vercel](https://vercel.com/new) and click **Deploy**.

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.
