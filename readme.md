# Strava Music Service

![Website screenshot]()

This project combines **Strava workout data** and **user traits** to generate **personalized AI-generated songs and images**.
Songs are generated using the **Suno API** (via [apibox](https://apibox.ai/)).

---

## 📌 Project Idea

- Collect **user traits** during signup (e.g., "Optimistic" → Pop genre bias, Mood multiplier: 1.5).
- Gather **workout stats** from Strava (heart rate, speed, calories, etc.).
- Combine traits + stats → generate **AI prompts** for music generation.
- Deliver **personalized music + images** back to the user.

---

## ⚡ Tech Stack

- **Frontend:** Vue.js
- **Backend:** Express + TRPC
- **Database:** PostgreSQL
- **Music Generation:** Suno API (via APIBOX)

---

## 🔄 Flow Overview

1. User signs up → traits collected.
2. Strava workout data pulled via API.
3. Traits + workout stats processed → prompt generated.
4. Suno AI generates music & images.
5. User receives **playable song + cover image** in the app.

---

## 🎨 Client Views

| View                  | Path                    | Description                                                                                                         |
| --------------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------- |
| **HomeView**          | `/`                     | Shows signup message for new users. Logged-in users see app logo + Strava auth button.                              |
| **WelcomeView**       | `/welcome`              | Displays welcome or error message after signup.                                                                     |
| **AuthenticatedView** | `/authenticated`        | Handles Strava callback with one-time code. Displays success or error message.                                      |
| **SignupView**        | `/signup`               | Signup form. Redirects to `WelcomeView` on success.                                                                 |
| **SigninView**        | `/signin`               | Redirects to Dashboard on success. Shows error on failure.                                                          |
| **DashboardView**     | `/dashboard`            | Lists all user activities. Clicking activity opens `PlaybackView`. Allows reloading activities or requesting songs. |
| **PlaybackView**      | `/playback/:activityId` | Shows activity data with generated music + image. Plays generated songs.                                            |

---

## 🚀 Server Endpoints

### User Endpoints

- `POST /user/login` → `{ email, password }` → returns `{ userId }`
- `POST /user/signup` → user signup object → returns `{ userId }`
- `GET /user/getPublicUser` → returns `{ id, firstName, lastName }`
- `GET /user/getUserActivitiesWithSong` → returns activities + songs
- `GET /user/stravaAuthenticated` → returns `{ authenticated: boolean }`
- `DELETE /user/deleteUser` → `{ email }` → returns `{ deletedUserId }`
- `PATCH /user/changeEmail` → `{ email }` → returns `{ userId, updatedEmail }`

### Strava Endpoints

- `POST /strava/getAccess` → exchanges one-time code for tokens.
- `GET /strava/getClientId` → returns Strava app client id.
- `GET /strava/getAthlete` → returns athlete info.
- `POST /strava/webhooks` → listens for Strava updates → triggers prompt + music generation.

### Generator Endpoints

- `GET /generator/getSongByTaskId` → returns `ActivityWithSongs` object.
- `POST /generator/storeGenerated` → stores Suno API songs in DB.
- `POST /generator/requestSong` → unused; submits prompt for generation.

### Trait Endpoints

- `GET /trait/getAll` → returns active traits for signup.

---

## 🛠️ Running the Project

### Server

```bash
npm run dev -w server
```

### Client

```bash
npm run dev -w client
```

## Tests

### Server

```bash
npm run test -w server
```

### e2e:

```bash
npm run test:e2e -w client
```

## ⚙️ Environment Variables

Set the following in your `.env` file:

```env
# --- Strava Authentication ---
STRAVA_CLIENT_ID=your_client_id
STRAVA_CLIENT_SECRET=your_client_secret
# Create a Strava developer app: https://www.strava.com/settings/api

# --- Database ---
DATABASE_URL=your_postgres_connection_string

# --- Tokens ---
TOKEN_KEY=your_secret_key

# --- Music Generation ---
API_BOX_KEY=your_apibox_key

# --- Strava Webhooks ---
# Follow setup guide: https://developers.strava.com/docs/webhooks/

```

## Additional Notes

Currently only one user is allowed to use the app until strava approval is granted.
In this case when trying to authorize strava, athlete limit reached error will be displayed.

Also prompt generation formula needs work, music genre is currently determined by user traits with each trait having certain bias towards music genre. Weighted average formula is being used to determined music genre for prompt. User genre preference for music genre during signup will be implemented later.
