# MX Track & Bike Manager

> ⚠️ **Progetto in fase di sviluppo (work in progress).** Le funzionalità, le API e lo schema del database possono cambiare senza preavviso. Non utilizzare in produzione.

> 📚 Questo è un progetto personale realizzato a scopo di allenamento/apprendimento, per esercitarmi con Node.js, Express e MySQL.

Applicazione per la gestione di moto da cross/enduro, sessioni in pista e manutenzioni programmate: backend REST (Express + MySQL) e frontend React in sviluppo. Permette a ogni utente di tracciare le proprie moto, registrare le sessioni di guida (pista, meteo, ore, sensazioni) e tenere sotto controllo le scadenze di manutenzione in base alle ore di utilizzo.

## Stato del progetto

### Backend

| Modulo | Stato |
|---|---|
| Autenticazione utenti (registrazione, login, JWT) | ✅ Implementato |
| Gestione moto (bikes) | ✅ Implementato |
| Sessioni in pista (sessions) | ✅ Implementato |
| Manutenzioni programmate (maintenance) | ✅ Implementato |
| Alert di manutenzione (ore rimanenti, stato ok / in scadenza / scaduta) | ✅ Implementato |
| Middleware di autorizzazione sulle rotte protette | ✅ Implementato |
| Validazione input | 🚧 Solo presenza dei campi obbligatori, nessun controllo di formato/robustezza |

### Frontend

| Modulo | Stato |
|---|---|
| Scaffolding React + Vite, routing (`react-router-dom`) | ✅ Implementato |
| Pagina di registrazione (form, validazione client, chiamata API, gestione errori, accessibilità) | ✅ Implementato |
| Route 404 di fallback | ✅ Implementato |
| Storage del token e auto-attach alle richieste API, contesto di autenticazione (`AuthContext`/`useAuth`) | ✅ Implementato |
| Chiamata API di login (`authApi.login`) | ✅ Implementato |
| Pagina di login | 🚧 Placeholder, manca ancora il form (usa già `authApi.login` e `AuthContext` una volta completata) |
| Gestione garage (moto), log sessioni, manutenzioni | ⬜ Da implementare |

## Roadmap

Sviluppi previsti, in ordine di priorità:

- **Login (frontend)** — form di login analogo alla registrazione; API, storage del token e contesto di autenticazione sono già pronti, manca solo la UI della pagina.
- **Frontend: garage, sessioni, manutenzioni** — interfaccia per gestione moto, log allenamenti e manutenzioni, a consumo delle API REST già esposte dal backend.
- **Validazione e gestione errori centralizzata sul backend** — validazione di formato/robustezza degli input su tutti gli endpoint (oggi presente solo lato frontend per la registrazione), gestione uniforme degli errori via middleware Express.

## Stack tecnologico

**Backend**
- **Runtime:** Node.js (ESM)
- **Framework:** Express 5 (con `cors` per accettare richieste dal frontend)
- **Database:** MySQL (driver `mysql2`)
- **Autenticazione:** JWT (`jsonwebtoken`) + hashing password con `bcrypt`

**Frontend**
- **Libreria UI:** React 19
- **Build tool:** Vite
- **Routing:** `react-router-dom`
- **Styling:** CSS Modules

**Package manager:** pnpm (monorepo con workspaces)

## Struttura del progetto

Monorepo gestito con pnpm workspaces: backend in `apps/backend`, frontend in `apps/frontend`.

```
├── apps/
│   ├── backend/
│   │   ├── config/            # Configurazione connessione al database
│   │   ├── controllers/       # Logica di business delle rotte
│   │   ├── database/          # Schema SQL del database
│   │   ├── middlewares/       # Middleware Express (auth, autorizzazione, validazione id)
│   │   ├── repositories/      # Query al database, isolate per risorsa
│   │   ├── routes/            # Definizione degli endpoint
│   │   ├── utils/             # Helper condivisi (async handler, risposte API, parsing id)
│   │   ├── server.js          # Entry point dell'applicazione
│   │   └── .env.example       # Esempio di variabili d'ambiente richieste
│   └── frontend/
│       └── src/
│           ├── components/    # Componenti riusabili (es. FormField)
│           ├── context/       # Contesto di autenticazione (AuthContext, useAuth)
│           ├── pages/         # Pagine/route (RegisterPage, LoginPage, NotFoundPage, ...)
│           ├── services/      # Client HTTP verso il backend (apiFetch, authApi, tokenStorage)
│           ├── utils/         # Funzioni pure riusabili (es. validatori dei form)
│           ├── App.jsx        # Definizione delle rotte
│           └── main.jsx       # Entry point dell'applicazione
├── package.json        # Root del workspace (script di orchestrazione)
└── pnpm-workspace.yaml  # Definizione dei package del workspace
```

## Requisiti

- Node.js 18+
- pnpm
- Un'istanza MySQL raggiungibile

## Installazione

1. Clona il repository e installa le dipendenze (dalla root del workspace):

   ```bash
   pnpm install
   ```

2. Crea il file `.env` del backend a partire dall'esempio fornito:

   ```bash
   cp apps/backend/.env.example apps/backend/.env
   ```

   Poi valorizza le variabili richieste (vedi tabella sotto).

3. Crea il database ed esegui lo schema SQL:

   ```bash
   mysql -u root -p < apps/backend/database/schema.sql
   ```

4. Avvia il server (dalla root):

   ```bash
   pnpm start
   ```

   Oppure in modalità sviluppo con auto-reload:

   ```bash
   pnpm watch
   ```

   In alternativa, dalla cartella `apps/backend`, sono disponibili gli script locali `pnpm start` / `pnpm watch`.

5. Avvia il frontend in modalità sviluppo (dalla root):

   ```bash
   pnpm dev
   ```

   Il frontend gira su Vite (`http://localhost:5173` di default) e si aspetta il backend raggiungibile su `http://localhost:3000` (URL hardcoded in `apps/frontend/src/services/api.js`, non ancora configurabile via variabile d'ambiente).

## Variabili d'ambiente

| Variabile | Descrizione |
|---|---|
| `PORT` | Porta su cui Express resta in ascolto (default `3000`) |
| `DB_HOST` | Host del database MySQL |
| `DB_PORT` | Porta del database MySQL |
| `DB_USER` | Utente del database |
| `DB_PASSWORD` | Password del database |
| `DB_DATABASE` | Nome del database |
| `JWT_SECRET` | Chiave segreta per firmare/verificare i JWT (generarne una nuova per ogni ambiente) |

## API disponibili

### Autenticazione (`/auth`)

| Metodo | Endpoint | Descrizione |
|---|---|---|
| `POST` | `/auth/register` | Registra un nuovo utente (`name`, `email`, `password`) |
| `POST` | `/auth/login` | Effettua il login e restituisce un JWT valido 1 ora |

### Moto (`/bike`)

Tutte le rotte richiedono autenticazione (`Authorization: Bearer <token>`). Le rotte su una singola moto (`/:id`) verificano inoltre che la moto appartenga all'utente autenticato.

| Metodo | Endpoint | Descrizione |
|---|---|---|
| `GET` | `/bike` | Elenca le moto dell'utente loggato |
| `GET` | `/bike/:id` | Recupera il dettaglio di una moto (incluso il totale ore) |
| `GET` | `/bike/:id/total-hours` | Totale ore di utilizzo, calcolato sommando le sessioni registrate |
| `GET` | `/bike/:id/alert` | Manutenzioni scadute o in scadenza (entro 10 ore) per la moto |
| `POST` | `/bike` | Crea una nuova moto (`brand`, `model`, `year`) |
| `PUT` | `/bike/:id` | Aggiorna i dati di una moto (`brand`, `model`, `year`) |
| `DELETE` | `/bike/:id` | Elimina una moto |

### Sessioni in pista (`/bike/:id/sessions`)

Tutte le rotte richiedono autenticazione e che la moto (`:id`) appartenga all'utente autenticato. Le rotte su una singola sessione (`/:id/sessions/:id`) verificano inoltre che la sessione appartenga all'utente autenticato.

| Metodo | Endpoint | Descrizione |
|---|---|---|
| `GET` | `/bike/:id/sessions` | Elenca le sessioni registrate per la moto |
| `POST` | `/bike/:id/sessions` | Registra una nuova sessione (`date`, `track`, `weather`, `feeling`, `hours_logged`, `notes`) |
| `PUT` | `/bike/:id/sessions/:id` | Aggiorna i dati di una sessione |
| `DELETE` | `/bike/:id/sessions/:id` | Elimina una sessione |

### Manutenzioni programmate (`/bike/:id/maintenance`)

Tutte le rotte richiedono autenticazione e che la moto (`:id`) appartenga all'utente autenticato. Le rotte su una singola scadenza (`/:id/maintenance/:id`) verificano inoltre che la scadenza appartenga all'utente autenticato.

| Metodo | Endpoint | Descrizione |
|---|---|---|
| `GET` | `/bike/:id/maintenance` | Elenca le scadenze di manutenzione della moto |
| `POST` | `/bike/:id/maintenance` | Registra una nuova scadenza (`task_description`, `hour_threshold`, `last_service_hours`, `service_date`) |
| `PUT` | `/bike/:id/maintenance/:id` | Aggiorna i dati di una scadenza |
| `DELETE` | `/bike/:id/maintenance/:id` | Elimina una scadenza |

## Licenza

ISC
