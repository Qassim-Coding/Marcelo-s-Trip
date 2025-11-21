
# Structure du Projet Marcelo's Trip

Voici l'arborescence actuelle du projet.

```text
/ (Racine du projet)
├── README.md                   # Le mode d'emploi
├── arborescence.md             # Ce fichier - Structure du projet
├── index.html                  # Le fichier principal qui lance l'app
├── metadata.json               # Métadonnées du projet
├── package.json                # Liste des installations nécessaires (React, Vite...)
├── postcss.config.js           # Config CSS
├── tailwind.config.js          # Config Design
├── tsconfig.json               # Config TypeScript
├── vite.config.ts              # Config du constructeur de site Vite
│
└── src/                        # TOUT LE CODE EST ICI
    ├── index.css               # Le style global
    ├── index.tsx               # Le point d'entrée React
    ├── App.tsx                 # Le cerveau de l'application
    ├── types.ts                # Les définitions de données
    │
    ├── components/             # Les briques visuelles
    │   ├── Avatar.tsx          # Le personnage 3D
    │   └── TranslationCard.tsx # La carte de traduction
    │
    └── services/               # La logique cachée
        ├── audioUtils.ts       # Gestion du micro et du son
        └── geminiService.ts    # Communication avec Google IA
```
