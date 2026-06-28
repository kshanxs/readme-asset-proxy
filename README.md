# 🎌 Readme Asset Proxy (Golang Edition)

[![Go Version](https://img.shields.io/badge/Go-1.22-00ADD8?style=flat-square&logo=go)](https://golang.org)
[![Vercel Deployment](https://img.shields.io/badge/Vercel-Serverless-black?style=flat-square&logo=vercel)](https://vercel.com)
[![Upstash Redis](https://img.shields.io/badge/Upstash-Redis-red?style=flat-square&logo=redis)](https://upstash.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)

A high-performance, ultra-fast serverless microservice built in **Golang** for Vercel. Designed to bypass GitHub Camo CDN caching, decoupling asset JSON configurations, and streaming dynamic animated GIF graphics for GitHub Profile READMEs.

---

## 💡 Why This Project Exists

When adding dynamic image logic (such as random character rotators or wizard rotators) into GitHub Markdown READMEs, GitHub routes all image requests through its own caching proxy (`camo.githubusercontent.com`). By default, Camo caches edge responses for extended periods, preventing standard image rotators from shuffling on fresh page renders.

**Readme Asset Proxy** solves this by executing a compiled **Go** binary directly on Vercel's global edge network. It pipes binary asset buffers with strict anti-caching HTTP headers (`no-store, no-cache, max-age=0, s-maxage=0`).

---

## 🛠️ Architecture & Features

* 🐹 **Blazing Golang Performance:** Built with native Go compile-time file embedding (`//go:embed api/pools.json`) for 0-latency configuration reads.
* 📦 **Decoupled JSON Configuration:** Asset pools are decoupled from code into `api/pools.json`. Adding or updating assets requires zero code modifications.
* ⚡ **Upstash Serverless Redis Integration:** Supports global atomic counter incrementing (`INCR`) to cycle wizard assets seamlessly across multi-user concurrent traffic.
* 🛡️ **Fail-Open Graceful Fallback:** Automatically falls back to a 7-second time-epoch rotation algorithm if Redis credentials are absent or unreachable.

---

## 🛣️ API Reference

### Base Endpoint
`GET /api`

### Query Parameters

| Parameter | Type | Values | Description |
| :--- | :--- | :--- | :--- |
| `side` | `string` | `left` \| `right` | Selects from directional character pools to flank section headers. |
| `type` | `string` | `wizard` | Selects from the Hogwarts Professor sequential pool. |

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
    <img src="https://readme-asset-proxy-three.vercel.app/api?side=left" height="65" alt="Header Left" />
    <span>My Dojo</span>
    <img src="https://readme-asset-proxy-three.vercel.app/api?side=right" height="65" alt="Header Right" />
</h2>

<!-- Section Feature Example -->
<div align="center">
    <img src="https://readme-asset-proxy-three.vercel.app/api?type=wizard" width="120" alt="Wizard Professor" />
</div>
```

---

## ⚡ Deploying Your Own Instance

You can fork this repository and deploy your own custom asset pools in under 2 minutes:

1. **Fork this repository** to your GitHub account.
2. Update the asset URL arrays in `api/pools.json`.
3. Import your repository into [Vercel](https://vercel.com/new) and click **Deploy**.

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.
