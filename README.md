
# Marcelo's Trip 🌍✈️

Votre compagnon de voyage et tuteur d'anglais/thaï alimenté par l'IA.

## 🚀 Mise en ligne (Méthode simple)

### 1. GitHub (Héberger le code)

1.  Téléchargez tous les fichiers de ce projet sur votre ordinateur.
2.  Allez sur [GitHub.com](https://github.com) et créez un nouveau Repository (Dépôt) nommé `marcelos-trip`.
3.  Cliquez sur **"Upload an existing file"**.
4.  Glissez-déposez tous les dossiers et fichiers **SAUF** le fichier `.env` (s'il existe sur votre ordinateur).
    *   *Note : Le dossier `node_modules` ne doit pas être envoyé s'il existe.*
5.  Validez en cliquant sur **"Commit changes"**.

### 2. Vercel (Mettre le site en ligne)

1.  Allez sur [Vercel.com](https://vercel.com) et connectez-vous avec GitHub.
2.  Cliquez sur **"Add New..."** > **"Project"**.
3.  Sélectionnez `marcelos-trip` (cliquez sur "Import").
4.  **ÉTAPE CRUCIALE : La Clé API**
    *   Dans la section **"Environment Variables"** :
    *   **Key** : `VITE_API_KEY`
    *   **Value** : Votre clé Google Gemini (commençant par `AIzaSy...`).
    *   *(Si vous n'avez pas de clé, créez-en une gratuite sur [Google AI Studio](https://aistudio.google.com/app/apikey))*.
5.  Cliquez sur **Deploy**.

---

## 🛠 Installation Locale (Pour tester sur votre ordi)

Si vous voulez modifier le code plus tard sur votre ordinateur :

1.  Installez [Node.js](https://nodejs.org/).
2.  Ouvrez un terminal dans le dossier.
3.  Tapez `npm install`.
4.  Créez un fichier `.env` et collez votre clé : `VITE_API_KEY=Votre_Clé`.
5.  Tapez `npm run dev` pour lancer l'app.

