# TD5 – Authentification Firebase

EcoEat – Programmation mobile (INF4079)

## Aperçu
- Objectif : ajouter l’authentification Firebase (email/mot de passe), navigation conditionnelle et build EAS.
- Statut : parties A-D et G réalisées ; parties optionnelles E (userId dans services) et F (build APK local) **non faites**.

## Prérequis
- TD4 Partie 1 terminé (Firestore + CRUD opérationnel, hook `useProducts`).
- Clés Firebase dans `.env` (non versionné) : `EXPO_PUBLIC_FIREBASE_API_KEY`, `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN`, `EXPO_PUBLIC_FIREBASE_PROJECT_ID`, `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET`, `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`, `EXPO_PUBLIC_FIREBASE_APP_ID`.
- Firebase Authentication activé (Email/Password) dans la console.

## Mise en place
1) Installations
```bash
npm install firebase
npm install --save-dev @types/react
```

2) Fichier `src/services/firebase.ts`
- Ajout de `getAuth` et export `auth` en plus de `db`.

3) Service `src/services/authService.ts`
- Fonctions : `register(email, password)`, `login(email, password)`, `logout()`.
- Chaque fonction retourne/consomme un `AuthUser` minimal `{ id, email }` et gère les erreurs Firebase.

4) Contexte `src/context/AuthContext.tsx`
- `AuthProvider` écoute `onAuthStateChanged(auth, ...)` et expose `{ user, loading }`.
- Hook `useAuth()` pour consommer le contexte.
- `AuthProvider` enveloppe l’app au-dessus de `AppProvider` dans `app/_layout.tsx`.

5) Écrans d’auth
- `src/screens/LoginScreen.tsx` : email/password, `login()`, gestion d’erreurs, redirection `router.replace('/(tabs)')`.
- `src/screens/RegisterScreen.tsx` : email/password/confirm, validations, `register()`, redirection vers `/login`.
- Routes : `app/login.tsx` et `app/register.tsx` exportent les écrans.

6) Navigation conditionnelle (`app/_layout.tsx`)
- Routes publiques : `/(tabs)` index (Products), `/product/[id]`, `/login`, `/register`.
- Routes protégées : `/(tabs)/donations`, `/(tabs)/profile`, le reste.
- Si non connecté et route protégée → `router.replace('/login')`. Si connecté sur route auth → `router.replace('/(tabs)')`.

7) Build EAS (Partie G)
- Fichier `eas.json` avec profils `preview` (apk interne) et `production` (app-bundle / archive).
- Commande build prod Android :
```bash
eas build --platform android --profile production
```
- Récupération du lien sur https://expo.dev (section Builds).

## Ce qui n’a pas été fait (optionnel)
- Partie E : remplacement complet de `TEMP_USER_ID` par le vrai `user.id` dans `productsService`/`useProducts`.
- Partie F : génération APK locale (`npx expo run:android --variant release`).

## Checklist de validation (A-D, G)
- [ ] Firebase Auth activé (Email/Password).
- [ ] `auth` exporté dans `src/services/firebase.ts`.
- [ ] `authService.ts` créé avec `register/login/logout`.
- [ ] `AuthContext.tsx` créé, `AuthProvider` enveloppe l’app, `useAuth` disponible.
- [ ] `LoginScreen.tsx` créé et route `/login` OK.
- [ ] `RegisterScreen.tsx` créé et route `/register` OK.
- [ ] Navigation conditionnelle : produits/détails publics, dons/profil protégés.
- [ ] `eas.json` contient le profil `production` et build lancé (`eas build --platform android --profile production`).
- [ ] Lien du build EAS récupéré et fourni.

## Captures à fournir
1. Authentification : Login ou Register avec champs remplis + message succès/erreur.
2. Navigation conditionnelle :
   - Accès à Products sans connexion (public).
   - Redirection vers Login en tentant `Donations` sans connexion (protégé).
3. Lien de build EAS de production (URL expo.dev/artifacts …).

### Emplacements captures (ajoutez vos images ou liens)
- Authentification : 
- Navigation publique/protégée : 
- Lien build EAS : 

## Questions de validation (répondre dans le dépôt ou rendu)
- Q1 – Auth Firebase vs auth custom : différences et avantages sécurité (hash bcrypt, tokens gérés, protections brute-force, HTTPS, validation).
- Q2 – Navigation conditionnelle : quelles routes sont publiques/protégées et pourquoi protéger (accès contrôlé aux actions sensibles).

## Notes finales
- .env n’est pas versionné (ajouté au .gitignore). Regénérer les clés si elles ont été exposées.
- Les fonctionnalités TD4 (CRUD Firestore, favoris, recherche/tri) restent fonctionnelles avec l’auth.
- Lien de build EAS à ajouter dès qu’il est disponible.
