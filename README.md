# Echo Garden
See it live at [echogarden-live.vercel.app](https://echogarden-live.vercel.app)

**Echo Garden** is a browser-based mini operating system built with React.  
It’s a space where you can open and explore a growing collection of small, interactive web apps — all wrapped in a clean, desktop-like interface with a built-in radio and live weather display.

---

## Overview
Echo Garden started as a playground for frontend experiments and turned into a personal “digital desk.”  
You can switch between apps, listen to music, and customize your environment — just like a lightweight web OS.

Every element is built with attention to detail: soft animations, polished UI, and a calm overall vibe.

---

## Current Apps
Echo Garden currently includes:
- **Counter** — simple number counter  
- **To-Do List** — track daily tasks  
- **Calculator** — basic calculator 
- **Notes** — quick note-taking app with persistence  
- **Calendar** — minimal monthly planner  
- **Tic Tac Toe** — classic two-player game  
- **Snake** — the retro arcade game  
- *(more apps coming soon!)*  

---

## Core Features
- Built-in **radio player** with multiple stations  
- Built-in **weather widget** (auto-detects location or uses fallback)  
- Persistent user settings via **localStorage**  
- Custom **wallpaper selector** (or upload your own)  
- **Taskbar navigation** and responsive design  
- Optimized for both desktop and mobile  

---

## Technologies
- **React** — component architecture and routing  
- **Vite** — fast dev environment and bundler  
- **Bootstrap 5** — responsive layout and styling  
- **Framer Motion** — animations and transitions  
- **HTML5 Audio API** — for the radio player  
- **LocalStorage** — for user preferences and data  

---

## Run Locally
```bash
git clone https://github.com/grigoris24/echo-garden.git
cd echo-garden
yarn install     # or npm install
yarn dev         # or npm run dev
