# MX Track & Bike Manager

> ⚠️ **Progetto in fase di sviluppo (work in progress).** Le funzionalità, le API e lo schema del database possono cambiare senza preavviso. Non utilizzare in produzione.

> 📚 Questo è un progetto personale realizzato a scopo di allenamento/apprendimento, per esercitarmi con Node.js, Express e MySQL.

Backend REST per la gestione di moto da cross/enduro, sessioni in pista e manutenzioni programmate. Permette a ogni utente di tracciare le proprie moto, registrare le sessioni di guida (pista, meteo, ore, sensazioni) e tenere sotto controllo le scadenze di manutenzione in base alle ore di utilizzo.

## Stato del progetto

| Modulo | Stato |
|---|---|
| Autenticazione utenti (registrazione, login, JWT) | ✅ Implementato |
| Gestione moto (bikes) | 🚧 In sviluppo |
| Sessioni in pista (sessions) | 🚧 In sviluppo |
| Manutenzioni programmate (maintenance) | 🚧 In sviluppo |
| Middleware di autorizzazione sulle rotte protette | 🚧 In sviluppo |

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
├── middlewares/        # Middleware Express (in sviluppo)
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

Altre risorse (moto, sessioni, manutenzioni) saranno esposte man mano che il relativo modulo verrà completato.

## Licenza

ISC
