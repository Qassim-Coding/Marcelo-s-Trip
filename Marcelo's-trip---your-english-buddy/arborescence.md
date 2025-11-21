
# Structure du Projet Marcelo's Trip

Voici comment organiser vos dossiers avant de les mettre sur GitHub.

```text
/ (Racine du projet)
├── .env.example                # Modèle pour la clé API (ne pas mettre la vraie clé ici pour GitHub)
├── .gitignore                  # Indique à Git d'ignorer les fichiers sensibles
├── index.html                  # Le fichier principal qui lance l'app
├── package.json                # Liste des installations nécessaires (React, Vite...)
├── postcss.config.js           # Config CSS
├── tailwind.config.js          # Config Design
├── tsconfig.json               # (Optionnel) Config TypeScript si présente
├── vite.config.ts              # Config du constructeur de site Vite
├── README.md                   # Le mode d'emploi
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
