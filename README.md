# 🎌 Readme Asset Proxy

[![Go Version](https://img.shields.io/badge/Go-1.22-00ADD8?style=flat-square&logo=go)](https://golang.org)
[![Vercel Deployment](https://img.shields.io/badge/Vercel-Serverless-black?style=flat-square&logo=vercel)](https://vercel.com)
[![Upstash Redis](https://img.shields.io/badge/Upstash-Redis-red?style=flat-square&logo=redis)](https://upstash.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)

A high-performance, ultra-fast serverless microservice engineered in **Golang** for Vercel edge infrastructure. Built specifically to bypass GitHub Camo CDN caching, decouple asset JSON configurations, and pipe dynamic, randomized, and atomic-counter animated GIF graphics for GitHub Markdown READMEs.

---

## ⚡ Live Production Showcase

This microservice active production instance powers the dynamic headers and interactive wizard professor rotators on [@kshanxs](https://github.com/kshanxs)'s official GitHub Profile README.

| Production Implementation | Live Showcase | Microservice Feature |
| :--- | :--- | :--- |
| **Dojo Header Rotator** | [View Profile](https://github.com/kshanxs) | Directional anime pools (`?side=left` & `?side=right`) |
| **Dev Spellbook Rotator** | [View Profile](https://github.com/kshanxs) | Atomic Upstash Redis counter (`?type=wizard`) |

---

## 💡 Problem & Solution

### The Problem: GitHub Camo Proxy Caching
When incorporating dynamic image logic (such as character rotators or state counters) inside GitHub Markdown READMEs, GitHub routes all request traffic through its proprietary caching proxy (`camo.githubusercontent.com`). Camo aggressively caches edge responses for long periods, freezing standard dynamic image scripts and serving stale graphics across page reloads.

### The Solution: Edge Buffer Piping & Atomic State
**Readme Asset Proxy** resolves this by executing a compiled **Golang** binary directly on Vercel's global edge network. The service:
1. Intercepts incoming requests and queries a serverless **Upstash Redis** instance for atomic state incrementation (`INCR`).
2. Streams binary GIF buffers directly from raw storage endpoints.
3. Emits strict HTTP anti-caching headers (`no-store, no-cache, must-revalidate, max-age=0, s-maxage=0`) to force GitHub Camo to fetch fresh assets on every render.

---

## 🛠️ Architecture & Core Features

* 🐹 **Blazing Golang Performance:** Compiled native Go 1.22 binary executing on Vercel edge runtimes.
* 📦 **Compile-Time Asset Embedding:** Uses Go native compile-time embedding (`//go:embed pools.json`) for 0ms disk I/O reads.
* ⚡ **Serverless Redis Persistence:** Integrates with Upstash Redis via REST API to guarantee strict atomic sequence rotation across concurrent multi-user traffic.
* 🛡️ **Fail-Open Graceful Resilience:** Built-in fallback to a 7-second time-epoch rotation algorithm (`time.Now().Unix() / 7`) if database credentials are unconfigured or temporarily unreachable.
* 🔀 **Directional Logic:** Automatically segregates left-facing vs. right-facing graphics to keep section headers visually balanced.

---

## 🛣️ API Reference

### Base Endpoint
`GET /api`

### Query Parameters

| Parameter | Type | Values | Description |
| :--- | :--- | :--- | :--- |
| `side` | `string` | `left` \| `right` | Selects from directional character pools to flank section headers. |
| `type` | `string` | `wizard` | Selects from the Hogwarts Professor atomic counter pool. |

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

To consume this microservice inside your own GitHub Profile README or documentation pages, wrap the endpoints inside standard HTML `<img>` tags:

```html
<!-- Flanked Header Example -->
<h2 align="center">
    <img src="https://readme-asset-proxy-three.vercel.app/api?side=left" height="65" alt="Header Left" />
    <span>My Profile Dojo</span>
    <img src="https://readme-asset-proxy-three.vercel.app/api?side=right" height="65" alt="Header Right" />
</h2>

<!-- Atomic Feature Example -->
<div align="center">
    <img src="https://readme-asset-proxy-three.vercel.app/api?type=wizard" width="120" alt="Wizard Professor" />
</div>
```

---

## ⚡ Deploying Your Own Instance

You can deploy your own instance of this microservice in under 2 minutes:

1. **Fork this repository** to your GitHub account.
2. Update asset URLs in `api/pools.json`.
3. Import your repository into [Vercel](https://vercel.com/new).
4. *(Optional)* Add `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` in Vercel Project Settings for atomic state tracking.
5. Click **Deploy**.

---

## 📜 License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.
