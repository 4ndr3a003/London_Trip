# London Trip Planner 🇬🇧

Una Web App (PWA) moderna e collaborativa progettata per organizzare e gestire un viaggio a Londra. L'applicazione permette di tracciare l'itinerario, le spese, gli spostamenti e lo stato delle visite in tempo reale.

## 🚀 Funzionalità Principali

### 🗺️ Gestione Itinerario
*   **Database Attrazioni:** Lista dettagliata di musei, parchi, mercati e punti di interesse.
*   **Dettagli Completi:** Ogni attrazione include orari, durata visita, quartiere e note su eccezioni (es. aperture serali).
*   **Stato Visita:** Contrassegna le attrazioni come "Visitate" con feedback visivo immediato.
*   **Filtri & Ricerca:** Cerca attrazioni per nome, filtra per categoria (Museo, Mercato, ecc.) o stato (Visitati/Da Visitare).

### 💰 Gestione Spese
*   **Budgeting Intelligente:** Traccia tutte le spese (voli, hotel, biglietti).
*   **Valuta Mista:** Supporto automatico per spese in Euro (€) e Sterline (£) con conversione in tempo reale nei totali.
*   **Statistiche:** Visualizza quanto è stato "Già Pagato" e quanto rimane "Da Saldare" (Previsto).
*   **Stato Pagamenti:** Tieni traccia di chi ha pagato e cosa è stato prenotato.

### 🚆 Trasporti
*   sezione dedicata per voli, treni e spostamenti interni.
*   Dettagli su orari, costi e stato prenotazione.

### 📱 Esperienza Utente (UX)
*   **Progressive Web App (PWA):** Installabile su smartphone come un'app nativa.
*   **Design Responsive:** Interfaccia ottimizzata per mobile, costruita con Tailwind CSS.
*   **Aggiornamenti in Tempo Reale:** Sincronizzazione istantanea dei dati tra tutti i dispositivi grazie a Firebase Firestore.
*   **Modalità Offline:** (Basic support via Service Worker).

## 🛠️ Tecnologie Utilizzate

*   **Frontend:**
    *   **HTML5 & CSS3**
    *   **Tailwind CSS** (per lo styling rapido e responsive)
    *   **React 18** (gestione dell'interfaccia utente)
    *   **Babel** (compilazione JSX in-browser per sviluppo rapido senza build complex)
*   **Backend & Data:**
    *   **Firebase Firestore** (Database NoSQL real-time)
    *   **Firebase Hosting** (Distribuzione web)
*   **Mobile:**
    *   **Capacitor** (Wrapper per funzionalità native Android)
    *   **PWA Standards** (Manifest, Service Worker)

## 📂 Struttura del Progetto

```
/
├── public/                 # Root del server web
│   ├── css/               # Fogli di stile custom
│   ├── js/
│   │   ├── app.js         # Logica principale React (Single File Component)
│   │   └── firebase.js    # Configurazione Firebase
│   ├── index.html         # Entry point dell'applicazione
│   ├── manifest.json      # Configurazione PWA
│   └── sw.js              # Service Worker
├── android/               # Progetto nativo Android (Capacitor)
├── firebase.json          # Configurazione di deploy Firebase
└── package.json           # Dipendenze e script NPM
```

## 🚀 Installazione e Utilizzo

### Prerequisiti
*   Node.js & npm installati.
*   Account Firebase configurato (se si desidera modificare il backend).

### Avvio Locale
Per avviare l'applicazione in locale:

1.  Installa le dipendenze:
    ```bash
    npm install
    ```
2.  Avvia il server di sviluppo:
    ```bash
    npm start
    ```
    L'app sarà accessibile a `http://127.0.0.1:8080`.

### Deploy
Per pubblicare le modifiche su Firebase Hosting:

```bash
npm run deploy
```

## 📱 Installazione su Mobile

L'applicazione è configurata come PWA. Visitando il sito da mobile, apparirà un pulsante "Installa App" (o tramite menu del browser "Aggiungi a schermata home") per installarla come applicazione standalone.

## 🤝 Note di Sviluppo
Il progetto utilizza un approccio "no-build" per il frontend React (via Babel standalone) per semplicità di modifica e test rapido. I dati iniziali (seed) sono presenti nel codice per facilitare il reset del database se necessario.
