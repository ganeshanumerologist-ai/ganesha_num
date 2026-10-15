# Numerology VIP — React + Firebase

A modern numerology calculator and image gallery built with React (Vite) and Firebase (Hosting + Storage + Firestore).

## Features
- Life Path, Birthday, Attitude, Destiny, Soul Urge, Personality & Lucky number calculator
- Detailed meanings for numbers 1-9 and master numbers 11, 22, 33
- Image upload / gallery / delete backed by Firebase Storage
- Contact form storing inquiries in Firestore
- Responsive, dark-mystic UI with smooth gradients

## Prerequisites
- Node.js 18+ and npm
- Firebase CLI: `npm install -g firebase-tools`
- A Firebase project (Blaze plan optional, Storage listing works on free tier for small usage)

## Setup
```bash
npm install
cp .env.example .env
# Fill .env with your Firebase web app config values
```

## Run locally
```bash
npm run dev
```

## Build
```bash
npm run build
```

## Deploy to Firebase
```bash
firebase login
firebase use --add   # select your project, or set .firebaserc default
firebase deploy
```

Or:
```bash
npm run deploy
```

## Firebase Setup Checklist
1. Create a Firebase project at https://console.firebase.google.com
2. Add a Web App and copy config into `.env`.
3. Enable **Hosting**, **Firestore Database** and **Storage**.
4. Set Storage and Firestore security rules (provided in `storage.rules` / `firestore.rules`).
5. (Optional) Configure CORS for Storage if you list files from different origins.

## Project Structure
```
src/
  components/   Navbar, Footer
  pages/        Home, Calculator, Gallery, About, Contact
  utils/        numerology.js
  data/         meanings.js
  firebase.js   Firebase init
```

## Notes
- Firebase config values can also be pasted directly in `src/firebase.js` instead of using `.env`.
- Images are stored under the `images/` path in the default Storage bucket.
- Contact form requires Firestore enabled; otherwise the app still runs with calculator & gallery.
