# Quran Loop Player

A production-grade Quran memorization app with Mishary Rashid Alafasy's recitation on loop.

## Features

- 🔊 **Mishary Alafasy audio** via cdn.islamic.network (with fallbacks)
- 🔁 **Loop any single ayat** — set loop count (1–20) or infinite
- 📖 **Arabic text + English translation** for every ayat
- ☪️ **Bismillah handling** — correct display for all 114 surahs:
  - Al-Fatihah (1): Bismillah IS ayat 1 — labeled correctly
  - At-Tawbah (9): No Bismillah — user is notified
  - All others: Golden Bismillah banner shown above ayat 1 with a note that it's recited before but not numbered
- ⚡ **Speed control** — 0.6×, 0.75×, 1×, 1.25×
- ✅ **Loop progress pills** — visual tracking per loop
- 📝 **Today's memorized log** — tracks ayats marked as memorized
- 🎯 **Validation** — ayat number validated against surah max

## Deploy to Vercel

### Option 1: Vercel CLI
```bash
npm i -g vercel
vercel
```

### Option 2: GitHub + Vercel Dashboard
1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project
3. Import your GitHub repo
4. Vercel auto-detects Next.js — click Deploy

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **AlQuran Cloud API** — text + audio URLs
- **cdn.islamic.network** — Mishary Alafasy 128kbps MP3s

## Bismillah Rules (Islamic Accuracy)

| Surah | Rule |
|-------|------|
| Al-Fatihah (1) | Bismillah **is** ayat 1 |
| At-Tawbah (9) | **No** Bismillah |
| All others (ayat 1) | Bismillah shown as banner, recited before ayat 1 but not numbered |
