# 🌍 Marcelo's Trip - Your AI Language Buddy

> *Parce que se perdre en traduction, c'est moins drôle qu'on ne le croit.* 😅

**Une app de traduction vocale propulsée par l'IA pour ne jamais dire "I don't spik inglish" à Bangkok.**

[![Made for Marcelo](https://img.shields.io/badge/Made%20for-Marcelo-blue?style=for-the-badge)](https://github.com)
[![Powered by Gemini](https://img.shields.io/badge/Powered%20by-Google%20Gemini-orange?style=for-the-badge&logo=google)](https://ai.google.dev)
[![Deploy on Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com)

---

## 🎯 Le Concept

Marcelo part en voyage et ne parle que malheureusement que...français. Quelle farce ?!?!
C'est un problème car les locaux ne parlent qu'anglais ou thaï. La solution ? **Cette app !**

Parlez dans votre langue, laissez Marcelo (l'IA) traduire en temps réel, et recevez même des tips culturels pour ne pas commettre d'impair ou finir avec des ladyboy... Parce qu'un voyage réussi commence par une bonne communication ! 🗣️✨

---

## ✨ Fonctionnalités qui Déchirent

| Feature | Description | Status |
|---------|-------------|--------|
| 🎤 **Traduction vocale** | Parlez, l'IA traduit en live | ✅ |
| � **3 langues** | FR ↔️ EN ↔️ TH | ✅ |
| 🔄 **Bidirectionnel** | Traduisez dans les deux sens | ✅ |
| 💡 **Tips culturels** | Apprenez en traduisant | ✅ |
| 📖 **Mini-dictionnaire** | 100 phrases essentielles | ✅ |
| ⭐ **Système de favoris** | Gardez vos phrases préférées | ✅ |
| 📱 **Mobile-first** | Design iPhone-like | ✅ |
| 🎨 **Avatar animé** | Marcelo réagit en temps réel | ✅ |
| 🔊 **Audio playback** | Rejouez les traductions | 🚧 (WIP) |

---

## 🎬 Demo en Action

```
� Vous: "Bonjour, où sont les toilettes ?"
         ↓
🤖 Gemini traduit...
         ↓
🇬🇧 EN: "Hello, where is the bathroom?"
💡 Tip: "En anglais, 'bathroom' est plus poli que 'toilet' en public."
         ↓
� Audio joue la traduction
         ↓
✨ Sauvegardé dans l'historique !
```

---

## 🚀 Installation & Démarrage

### Prérequis

```bash
node --version  # v18+ requis
npm --version   # v9+ requis
```

### Configuration en 3 étapes

```bash
# 1. Cloner le repo
git clone <votre-repo>
cd marcelos-trip

# 2. Installer les dépendances
npm install

# 3. Configurer la clé API
cp .env.example .env.local
# Éditez .env.local et ajoutez votre clé Gemini
# 🔑 Obtenez-la ici: https://aistudio.google.com/app/apikey
```

### Lancement

```bash
# Mode développement (hot reload activé)
npm run dev
# 🎉 Ouvrir http://localhost:5173

# Build production
npm run build

# Prévisualiser le build
npm run preview
```

---

## 🌐 Déploiement sur Vercel

**Pourquoi Vercel ?** Parce que c'est gratuit, rapide, et ça gère les variables d'environnement comme un chef ! 👨‍🍳

### Méthode Express (5 minutes chrono ⏱️)

```bash
# 1. Installer Vercel CLI
npm install -g vercel

# 2. Se connecter
vercel login

# 3. Déployer (suivez les prompts)
vercel

# 4. Configurer la variable d'environnement
# Dashboard Vercel → Settings → Environment Variables
# Ajouter: VITE_GEMINI_API_KEY = votre_clé
```

📚 **Guide complet** → [DEPLOY.md](./DEPLOY.md)

---

## 🛠️ Stack Technique (AKA "Les Ingrédients")

### Frontend
- ⚛️ **React 18** - Parce qu'on aime les hooks
- 🔷 **TypeScript** - Parce qu'on n'est pas des sauvages
- ⚡ **Vite** - Parce qu'on aime la vitesse
- 🎨 **Tailwind CSS** - Parce qu'on aime le style sans effort
- 🎭 **Lucide React** - Icons magnifiques

### Backend (enfin, presque)
- 🤖 **Google Gemini API** - Le cerveau de l'opération
- 🎤 **Web Audio API** - Pour capturer et jouer l'audio
- 📦 **Base64 Encoding** - Pour envoyer l'audio à l'API

### DevOps
- 🚀 **Vercel** - Déploiement en un clic
- 🐙 **Git/GitHub** - Versionnement et portfolio
- 🔐 **Env Variables** - Sécurité des clés API

---

## 📁 Architecture du Projet

```
src/
├── 🧠 App.tsx                    # Chef d'orchestre
├── 📐 types.ts                   # Contrats TypeScript
├── 🎭 components/
│   ├── Avatar.tsx                # Star du show
│   └── TranslationCard.tsx       # Affichage des résultats
└── 🛠️ services/
    ├── geminiService.ts          # Communication avec l'IA
    └── audioUtils.ts             # Magie audio
```

📖 **Documentation complète** → [arborescence.md](./arborescence.md)

---

## 🎓 Compétences Démontrées

### Pour les Recruteurs 👔

Ce projet illustre la maîtrise de :

- ✅ **State Management complexe** (useState, useRef, useEffect)
- ✅ **API REST Integration** (Google Gemini)
- ✅ **Audio Processing** (MediaRecorder, AudioContext, Blob manipulation)
- ✅ **TypeScript avancé** (Interfaces, Types, Enums)
- ✅ **Responsive Design** (Mobile-first avec Tailwind)
- ✅ **Component Architecture** (Découpage intelligent)
- ✅ **Environment Variables Management** (Sécurité)
- ✅ **CI/CD** (Vercel deployment)
- ✅ **Documentation** (README, guides de déploiement)

**Bonus :** Animation SVG custom, UX fluide, et sens du design ! 🎨

---

## 🐛 Problèmes Connus & Roadmap

### 🚧 Work In Progress

- [ ] **Audio TTS natif** - Pour l'instant, la lecture audio est désactivée
  - *Raison :* Le SDK standard ne supporte pas le TTS Gemini
  - *Solution prévue :* Intégrer Google Cloud Text-to-Speech API

### 🎯 Futures Features (v2.0)

- [ ] Mode offline avec phrases pré-enregistrées
- [ ] Historique persistent (LocalStorage/Firebase)
- [ ] Partage de phrases via QR Code
- [ ] Support de plus de langues (Espagnol, Japonais...)
- [ ] Mode nuit 🌙
- [ ] PWA (Progressive Web App)

<div align="center">

### ⭐ Si ce projet vous a aidé, une petite étoile fait toujours plaisir ! ⭐

**Made by Qassim-Coding for Marcelo's Adventures**

*Bon voyage, et que les traductions soient avec toi !* 🌟

</div>
