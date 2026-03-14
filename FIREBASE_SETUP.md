# Firebase setup (auth + sync)

## 1. Create a Firebase project

1. Go to [Firebase Console](https://console.firebase.google.com/) and create a project (or use an existing one).
2. Enable **Authentication** → **Sign-in method** → **Email/Password** (enable).
3. Create a **Firestore Database** (start in test mode for development; then add rules below).
4. In **Project settings** → **Your apps**, add a **Web** app and copy the config.

## 2. Environment variables

Copy `.env.local.example` to `.env.local` and fill in:

```bash
cp .env.local.example .env.local
```

Set:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

## 3. Firestore security rules

In Firebase Console → **Firestore** → **Rules**, paste the contents of `firestore.rules` (or deploy via CLI):

```bash
npm i -g firebase-tools
firebase login
firebase init firestore  # choose your project, use firestore.rules as rules file)
firebase deploy --only firestore:rules
```

Rules ensure each user can only read/write their own `users/{userId}/...` data.

## 4. Data model

- **`users/{uid}/private/appData`**  
  - `memorized`: array of `{ surahName, ayatNum, surahNum, memorizedAt, reviewCount, ... }` (dates as ISO strings)  
  - `settings`: `{ autoPlayNext, defaultLoopCount, defaultSpeed, showTranslation, theme, audioQuality }`  
  - `updatedAt`: server timestamp  

Optional for future “sessions”:

- **`users/{uid}/sessions/{dateKey}`** (e.g. `2025-03-15`)  
  - `ayats`: array of memorized ayat refs for that day  
  - `lastUpdated`: timestamp  

## 5. Behaviour

- **Signed out:** All data is local (memorized verses and settings). Nothing is sent to Firebase.
- **Signed in:** Memorized verses and settings are stored in Firestore and synced in real time across tabs/devices. Sign in is available under **Settings** → **Account**.
