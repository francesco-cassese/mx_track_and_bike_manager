# MX Track & Bike Manager

> ⚠️ **Progetto in fase di sviluppo (work in progress).** Le funzionalità, le API e lo schema del database possono cambiare senza preavviso. Non utilizzare in produzione.

> 📚 Questo è un progetto personale realizzato a scopo di allenamento/apprendimento, per esercitarmi con Node.js, Express e MySQL.

Backend REST per la gestione di moto da cross/enduro, sessioni in pista e manutenzioni programmate. Permette a ogni utente di tracciare le proprie moto, registrare le sessioni di guida (pista, meteo, ore, sensazioni) e tenere sotto controllo le scadenze di manutenzione in base alle ore di utilizzo.

## Stato del progetto

| Modulo | Stato |
|---|---|
| Autenticazione utenti (registrazione, login, JWT) | ✅ Implementato |
| Gestione moto (bikes) | ✅ Implementato |
| Sessioni in pista (sessions) | ✅ Implementato |
| Manutenzioni programmate (maintenance) | 🚧 In sviluppo |
| Middleware di autorizzazione sulle rotte protette | ✅ Implementato |

## Stack tecnologico

- **Runtime:** Node.js (ESM)
- **Framework:** Express 5
- **Database:** MySQL (driver `mysql2`)
- **Autenticazione:** JWT (`jsonwebtoken`) + hashing password con `bcrypt`
- **Package manager:** pnpm

## Struttura del progetto

```
├── config/           # Configurazione connessione al database
├── controllers/       # Logica di business delle rotte
├── database/          # Schema SQL del database
├── middlewares/        # Middleware Express (auth, autorizzazione, validazione id)
├── routes/             # Definizione degli endpoint
├── server.js           # Entry point dell'applicazione
└── .env.example         # Esempio di variabili d'ambiente richieste
```

## Requisiti

- Node.js 18+
- pnpm
- Un'istanza MySQL raggiungibile

## Installazione

1. Clona il repository e installa le dipendenze:

   ```bash
   pnpm install
   ```

2. Crea il file `.env` a partire dall'esempio fornito:

   ```bash
   cp .env.example .env
   ```

   Poi valorizza le variabili richieste (vedi tabella sotto).

3. Crea il database ed esegui lo schema SQL:

   ```bash
   mysql -u root -p < database/schema.sql
   ```

4. Avvia il server:

   ```bash
   pnpm start
   ```

   Oppure in modalità sviluppo con auto-reload:

   ```bash
   pnpm watch
   ```

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
| `GET` | `/bike/:id` | Recupera il dettaglio di una moto |
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

Altre risorse (manutenzioni) saranno esposte man mano che il relativo modulo verrà completato.

## Licenza

ISC
