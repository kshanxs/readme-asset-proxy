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

## ⚙️ Rotation & State Management Mechanics

The microservice employs two distinct algorithmic strategies to deliver dynamic, zero-caching GIF graphics:

### 1. Atomic Sequence Tracking (`?type=wizard`)
For sequential rotators (such as wizard skills headers), state is managed globally using **Upstash Redis**:
* **Atomic Counter:** Incoming requests trigger a HTTP `GET` call to the Upstash Redis REST API endpoint (`/incr/wizard_counter`).
* **Sequence Modulo:** The returned atomic counter integer is mapped to the target pool via `counter % len(wizardPool)`. This guarantees strict sequential rotation across concurrent global page views.
* **Fail-Open Resilience:** If Redis credentials (`UPSTASH_REDIS_REST_URL`) are missing or temporarily unreachable, the proxy gracefully falls back to the time-epoch algorithm below to ensure zero request failures.

### 2. Synchronized Epoch Pairing (`?side=left` & `?side=right`)
For side-by-side header banners requiring matching character duels (e.g., Left vs. Right flanking graphics), rotation is stateless and deterministic:
* **7-Second Time-Epoch Window:** Both `left` and `right` requests compute their target index using system unix epoch time:
  $$\text{index} = \left\lfloor \frac{\text{UnixTime}}{7} \right\rfloor \pmod{\text{len(pool)}}$$
* **Symmetrical Alignment:** Because both pools share equal array lengths in configuration, requests made within the same 7-second window automatically resolve to matching array indices (e.g., pairing index 0 on the left with index 0 on the right).

---

## 📦 Decoupled Pool Configuration

Asset resources are decoupled from application binaries and documented directly within [`api/pools.json`](api/pools.json):

* 👈 **`left` Pool:** Directional graphics facing right, framed for left-side header placement.
* 👉 **`right` Pool:** Directional graphics facing left, framed for right-side header placement.
* 🪄 **`wizard` Pool:** Sequential assets used for interactive section headers.

To update or expand asset offerings, modify target raw CDN image URLs directly inside `api/pools.json`.

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
