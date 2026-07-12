# SomaWote — Jifunze Kila Wakati

> **"Soma Wote"** — Swahili for *"Read Together"*

An inclusive, bilingual (English / Swahili) progressive web app for primary school learners, educators, and caregivers in Tanzania. Designed from the ground up for students with diverse learning needs — visual, cognitive, and physical.

**Live:** [https://somawote.vercel.app](https://somawote.vercel.app)

---

## Features

### Three Portals
| Portal | Who It's For | What It Does |
|--------|-------------|--------------|
| **Student Portal** | Learners (ages 6–12) | Spelling adventures, counting games, full voice guidance, and badge rewards |
| **Teacher Portal** | Educators | Student roster, UDL course library, AI lesson planner, caregiver announcements |
| **Caregiver Portal** | Parents & guardians | Milestone tracking, at-home activity playbooks, community forum |

### Accessibility Toolbar (Universal Design for Learning)
- **Voice Guide** — spoken narration on hover/click for every UI element
- **Voice Engine Picker** — Auto / Cloud (Intron Sahara-v2) / On-device (Piper WASM) / Browser
- **Reading Ruler** — moveable highlight guide for focus support
- **Text Size** — Normal / Large / Extra-Large
- **Font** — Inter (default) / Lexend (dyslexia-friendly) / Mono
- **Colour Support** — Normal / High-Contrast Light / High-Contrast Dark / Soft Pastel
- **Language Toggle** — full EN ↔ SW interface switch with matching TTS

### Swahili Text-to-Speech Pipeline
```
Intron Sahara-v2 (cloud, natural Swahili)
  → Piper WASM sw_CD-lanfrica-medium (on-device, ~60 MB, works offline)
    → Web Speech API fallback
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + Vite 6, TypeScript, Tailwind CSS v4 |
| Animations | Motion (Framer Motion) |
| PWA | vite-plugin-pwa (service worker, offline cache) |
| On-device TTS | `@mintplex-labs/piper-tts-web` + onnxruntime-web (WASM) |
| Cloud TTS | Intron Health Sahara-v2 API |
| Database | Neon (serverless PostgreSQL) |
| ORM | Prisma 7 with `@prisma/adapter-neon` |
| API | Express (serverless via Vercel Functions) |
| Deployment | Vercel |

---

## Getting Started

### Prerequisites
- Node.js 20+
- A [Neon](https://neon.tech) database (free tier works)
- (Optional) An [Intron](https://voice.intron.io) integrator API key for cloud Swahili TTS

### 1. Clone & install
```bash
git clone https://github.com/topsailcashew/SomaWote.git
cd SomaWote
npm install
```

### 2. Configure environment
Create a `.env` file at the project root (never commit this):
```env
DATABASE_URL="postgresql://..."       # Neon connection string
VITE_INTRON_API_KEY="..."             # Optional — Intron integrator key
```

### 3. Set up the database
```bash
npx prisma generate
npx prisma db push
```

### 4. Run locally
```bash
npm run dev
# → http://localhost:3000
```

> **Swahili voice:** on first use the ~60 MB Piper model downloads once and is cached in OPFS for offline use.

---

## Deployment (Vercel)

The project is pre-configured for Vercel. `vercel.json` routes `/api/*` to Express serverless functions and `/*` to the SPA.

Set these environment variables in your Vercel project settings:
- `DATABASE_URL` — Neon connection string
- `VITE_INTRON_API_KEY` — (optional) Intron cloud TTS key

```bash
vercel --prod
```

---

## Project Structure

```
src/
├── components/
│   ├── accessibility/    # AccessibilityToolbar (voice, font, contrast, ruler)
│   ├── portals/          # StudentPortal, TeacherPortal, CaregiverPortal
│   └── voice/            # VoiceModelDownload
├── lib/
│   └── i18n.ts           # EN/SW translation dictionary + tts.* helpers
├── modules/
│   └── voice/
│       ├── tts.ts         # speakText — main TTS entry point
│       ├── cloudVoice.ts  # Intron Sahara-v2 cloud TTS
│       └── wasmVoice.ts   # Piper on-device WASM TTS
├── types.ts
└── App.tsx
server/
├── lib/prismaClient.ts    # Neon + Prisma adapter
└── routes/                # curriculum, assessment, sms
api/
└── index.ts               # Vercel serverless handler
public/
├── favicon.svg
├── manifest.json
└── piper/                 # WASM runtime (espeak-ng + onnxruntime)
```

---

## Accessibility

SomaWote follows **Universal Design for Learning (UDL)** principles:
- Multiple means of **representation** — text, audio narration, visual icons
- Multiple means of **engagement** — adaptive games, badge rewards, sensory modes
- Multiple means of **action** — large touch targets, keyboard-navigable, reading ruler

---

## Licence

Apache 2.0
