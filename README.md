# Trip Planner �

Una Web App (PWA) moderna e collaborativa progettata per organizzare e gestire viaggi. L'applicazione permette di tracciare l'itinerario, le spese, gli spostamenti, i documenti e lo stato delle visite in tempo reale.

## 🚀 Funzionalità Principali

### 🗺️ Gestione Itinerario (Luoghi & Mezzi)
*   **Database Attrazioni:** Lista dettagliata di musei, parchi, mercati e punti di interesse.
*   **Dettagli Completi:** Ogni attrazione include orari, durata visita, quartiere e note su eccezioni (es. aperture serali).
*   **Stato Visita:** Contrassegna le attrazioni come "Visitate" con feedback visivo immediato.
*   **Filtri & Ricerca:** Cerca attrazioni per nome, filtra per categoria (Museo, Mercato, ecc.) o stato (Visitati/Da Visitare).
*   **Filtri Animati:** Indicatore a pill scorrevole con animazioni Material 3 Expressive.
*   **Tag Colorati per Categoria:** Tag con colori distintivi per ogni categoria (Museo, Parco, Mercato, ecc.).

### � Trasporti
*   Sezione dedicata integrata nella tab "Luoghi & Mezzi".
*   Dettagli su orari, costi e stato prenotazione.
*   Switch fluido tra Luoghi e Mezzi con sub-tab switcher.

### �💰 Gestione Spese
*   **Budgeting Intelligente:** Traccia tutte le spese (voli, hotel, biglietti).
*   **Supporto Multi-Valuta:** Supporto per spese in diverse valute (€, £, $, ecc.) con conversione automatica in Euro nei totali.
*   **Statistiche:** Visualizza quanto è stato "Già Pagato" e quanto rimane "Da Saldare" (Previsto).
*   **Stato Pagamenti:** Tieni traccia di chi ha pagato e cosa è stato prenotato.
*   **Filtri Animati:** Segmented control con pill scorrevole per filtrare spese (Tutti/Da Pagare/Pagati).
*   **Box Pagamento Stilizzati:** Design distintivo con forme Material 3 Expressive.

### 🎒 Zaino & Organizzazione
*   **Gestione Bagagli Multi-Utente:** Liste personalizzate per ogni viaggiatore (es. Andrea, Elena).
*   **Stato "Dentro/Fuori":** Traccia cosa è stato già impacchettato e cosa manca.
    *   **Tasto Smart:** Un clic sull'icona zaino per mettere/togliere l'oggetto.
    *   **Badge Visivo:** Tag colorati ("DENTRO" verde, "FUORI" giallo) per verifica immediata.
*   **Gestione Liquidi:** Calcolo automatico dei ml totali con avvisi se si supera il limite di 1000ml.
*   **Categorie e Posizione:** Organizzazione per categoria (Abbigliamento, Igiene, ecc.) e indicazione precisa della tasca o contenitore.
*   **Modalità Compatta:** Interfaccia ottimizzata per visualizzare rapidamente statistiche e oggetti mancanti.
*   **Modal con Scroll Interno:** Scroll ottimizzato che non influisce sullo sfondo dell'app.

### 📄 Documenti (Google Drive)
*   **Integrazione Google Drive:** Sincronizzazione automatica dei documenti con una cartella dedicata su Google Drive.
*   **Upload & Download:** Carica e scarica documenti direttamente dall'app.
*   **Gestione Multi-Account:** Supporto per account multipli con accesso a cartelle condivise.
*   **Persistenza Autenticazione:** Token salvati per evitare login ripetuti.
*   **Apertura Diretta:** I documenti si aprono direttamente senza prompt di selezione account.

### 🎨 Design System (Material 3 Expressive)
*   **Palette Dinamica:** Generazione automatica della palette colori da un colore seed principale.
*   **Temi per Viaggio:** Ogni viaggio può avere un colore tema personalizzato.
*   **Colori Terziari:** Shift di tonalità "decisivo" per i colori terziari secondo le linee guida M3 Expressive.
*   **Surface Tinted:** I colori Surface Container incorporano una percentuale del colore primario.
*   **Dark Mode Ready:** Sistema di colori predisposto per light e dark mode.

### 📱 Esperienza Utente (UX)
*   **Progressive Web App (PWA):** Installabile su smartphone come un'app nativa.
*   **Design Responsive:** Interfaccia ottimizzata per mobile con CSS dedicati.
*   **Aggiornamenti in Tempo Reale:** Sincronizzazione istantanea dei dati tra tutti i dispositivi grazie a Firebase Firestore.
*   **Modalità Offline:** (Basic support via Service Worker).
*   **React Router:** Navigazione con URL dedicati per ogni vista, bookmark-friendly.
*   **Transizioni di Pagina:** Animazioni di apertura e chiusura (slide up/down) per il Trip Dashboard.
*   **Navigation Bar Expressive:** Barra di navigazione con effetto notch curvo e FAB animato.
*   **Contrasti Ottimizzati:** Filter pills e campi input con contrasti migliorati per leggibilità.

### 🏠 Landing Page
*   **Gestione Multi-Viaggio:** Crea e gestisci viaggi multipli dalla home.
*   **Emoji Bandiera:** Ogni viaggio può avere una bandiera emoji rappresentativa.
*   **Date Viaggio:** Imposta date di inizio e fine per ogni viaggio.
*   **Colore Tema:** Scegli un colore principale che tematizza l'intero Trip Dashboard.
*   **Selezione Valuta:** Specifica la valuta locale della destinazione durante la creazione.

## 🛠️ Tecnologie Utilizzate

*   **Frontend:**
    *   **HTML5 & CSS3** (styling dedicato per componenti e pagine)
    *   **React 18** (gestione dell'interfaccia utente)
    *   **React Router DOM** (navigazione con HashRouter)
    *   **Babel** (compilazione JSX in-browser per sviluppo rapido senza build complex)
*   **Design System:**
    *   **Material 3 Expressive** (sistema colori dinamico)
    *   **CSS Custom Properties** (variabili CSS per tema dinamico)
*   **Backend & Data:**
    *   **Firebase Firestore** (Database NoSQL real-time)
    *   **Firebase Hosting** (Distribuzione web)
    *   **Google Drive API** (Gestione documenti)
    *   **Google Identity Services** (Autenticazione OAuth)
*   **Mobile:**
    *   **Capacitor** (Wrapper per funzionalità native Android)
    *   **PWA Standards** (Manifest, Service Worker)

## 📂 Struttura del Progetto

```
/
├── public/                     # Root del server web
│   ├── css/
│   │   ├── style.css          # Stili globali
│   │   ├── components/        # Stili per componenti UI
│   │   └── pages/             # Stili per pagine specifiche
│   ├── js/
│   │   ├── app.js             # Entry point React con Router
│   │   ├── firebase.js        # Configurazione Firebase
│   │   ├── Config.js          # Configurazione app (Google Client ID)
│   │   ├── components/        # Componenti React riutilizzabili
│   │   │   ├── UI.js          # Componenti UI base
│   │   │   ├── Icons.js       # Icone SVG
│   │   │   ├── BackpackTab.js # Tab Zaino
│   │   │   └── DocumentsTab.js# Tab Documenti (Google Drive)
│   │   ├── pages/             # Pagine principali
│   │   │   ├── LandingPage.js # Home con lista viaggi
│   │   │   └── TripDashboard.js # Dashboard viaggio completo
│   │   ├── utils/             # Utility
│   │   │   └── Theme.js       # Sistema colori Material 3
│   │   └── data/              # Dati statici
│   ├── index.html             # Entry point dell'applicazione
│   ├── manifest.json          # Configurazione PWA
│   └── sw.js                  # Service Worker
├── android/                    # Progetto nativo Android (Capacitor)
├── firebase.json              # Configurazione di deploy Firebase
└── package.json               # Dipendenze e script NPM
```

## 🚀 Installazione e Utilizzo

### Prerequisiti
*   Node.js & npm installati.
*   Account Firebase configurato (se si desidera modificare il backend).
*   Google Cloud Project con Drive API e Identity Services abilitati (per i documenti).

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

## 🔧 Configurazione Google Drive

Per abilitare l'integrazione con Google Drive:

1. Crea un progetto su [Google Cloud Console](https://console.cloud.google.com/)
2. Abilita le API: **Google Drive API** e **Google Identity Services**
3. Crea credenziali OAuth 2.0 (Web application)
4. Aggiungi le origini autorizzate (es. `http://localhost:8080`, `https://your-domain.web.app`)
5. Aggiorna `Config.js` con il tuo `CLIENT_ID`

## 🤝 Note di Sviluppo

Il progetto utilizza un approccio "no-build" per il frontend React (via Babel standalone) per semplicità di modifica e test rapido. I dati iniziali (seed) sono presenti nel codice per facilitare il reset del database se necessario.

### Architettura Componenti
- **Pages**: Componenti pagina che gestiscono stato e logica principale
- **Components**: Componenti UI riutilizzabili e tab specifici
- **Utils**: Funzioni di utilità come il sistema temi Material 3

### Sistema di Colori
Il tema dinamico è generato da `Theme.js` che implementa l'algoritmo Material 3 Expressive per creare una palette completa da un singolo colore seed.
