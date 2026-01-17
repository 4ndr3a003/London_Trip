# Trip Planner ✈️

Una Web App (PWA) moderna e collaborativa progettata per organizzare e gestire viaggi. L'applicazione permette di tracciare l'itinerario, le spese, gli spostamenti, i documenti e lo stato delle visite in tempo reale.

## 🚀 Funzionalità Principali

### 🗺️ Gestione Itinerario (Luoghi & Mezzi)
*   **Database Attrazioni:** Lista dettagliata di musei, parchi, mercati e punti di interesse.
*   **Smart Map Embeds:** Generazione automatica delle mappe di Google Maps per ogni luogo.
*   **Dettagli Completi:** Ogni attrazione include orari, durata visita, quartiere e note su eccezioni.
*   **Stato Visita:** Contrassegna le attrazioni come "Visitate" con feedback visivo immediato.
*   **Filtri & Ricerca:** Cerca attrazioni per nome, filtra per categoria o stato.
*   **Filtri Animati:** Indicatore a pill scorrevole con animazioni Material 3 Expressive.

### ✈️ Trasporti & Biglietti
*   **Integrazione Amadeus:** Ricerca automatica dettagli voli e orari in tempo reale.
*   **Archivio Fotografico Biglietti:** Carica e conserva le foto dei tuoi biglietti (QR code, carte d'imbarco) per averli sempre a portata di mano, anche offline.
*   **Switch Fluido:** Passa rapidamente dalla vista Itinerario a quella Trasporti.

### 💸💰 Gestione Spese & AI
*   **OCR Scontrini con Gemini AI:** Scansiona le foto degli scontrini e lascia che l'Intelligenza Artificiale estragga automaticamente importo e data per creare la spesa.
*   **Budgeting Intelligente:** Traccia tutte le spese (voli, hotel, biglietti).
*   **Supporto Multi-Valuta:** Supporto per spese in diverse valute (€, £, $, ecc.) con conversione automatica in Euro.
*   **Debiti e Saldin:** Calcolo automatico di "Chi deve a Chi" con report dettagliati.
*   **Statistiche:** Visualizza "Già Pagato" vs "Da Saldare".

### 🎒 Zaino & Meteo Smart
*   **Meteo Integrato:** Previsioni meteo in tempo reale per la destinazione del viaggio direttamente nella dashboard.
*   **Suggerimenti AI:** Consigli intelligenti su cosa mettere in valigia basati sul meteo previsto (es. "Porta l'ombrello" se piove).
*   **Gestione Bagagli Multi-Utente:** Liste personalizzate per ogni viaggiatore.
*   **Gestione Liquidi:** Calcolo automatico dei ml totali con avvisi limite 1000ml.

### 📄 Documenti (Google Drive)
*   **Integrazione Google Drive:** Sincronizzazione automatica dei documenti.
*   **Upload & Download:** Gestione diretta dei file in cloud.
*   **Sicurezza:** Token salvati per accesso rapido e sicuro.

### 🎨 Design System (Material 3 Expressive)
*   **Palette Dinamica:** Generazione automatica temi dai colori seed.
*   **Animazioni:** Transizioni fluide, hover effects e micro-interazioni curate.
*   **Dark Mode Ready:** Design ottimizzato per temi chiari e scuri.
*   **PWA:** Installabile su mobile come app nativa.

## 🛠️ Tecnologie Utilizzate

*   **Frontend:** React 18, HTML5, CSS3 (Vanilla + Variables).
*   **AI & Data:**
    *   **Google Gemini Pro Vision:** OCR e analisi immagini scontrini.
    *   **Amadeus API:** Dati voli in tempo reale.
    *   **OpenWeatherMap:** Dati meteo.
    *   **ExchangeRate-API:** Tassi di cambio valuta.
*   **Backend (Serverless):**
    *   **Firebase Firestore:** Database Real-time.
    *   **Firebase Hosting:** Deploy globale.
    *   **Google Drive API:** Cloud storage.

## 📂 Struttura del Progetto

```
/
├── public/
│   ├── js/
│   │   ├── components/        # Componenti UI (TicketScanner, ExpenseForm, etc.)
│   │   ├── pages/             # TripDashboard, LandingPage
│   │   ├── utils/             # Theme, Helpers
│   │   ├── secrets.js         # (Gitignored) API Keys sicure
│   │   └── Config.js          # Configurazione pubblica
│   └── index.html
└── firebase.json
```

## 🚀 Installazione e Utilizzo

### Prerequisiti
1.  Node.js & npm.
2.  Account Firebase & Google Cloud Platform.
3.  API Keys per: Gemini, Amadeus, OpenWeather, ExchangeRate, Google Drive.

### Configurazione Chiavi Sicura
Il progetto utilizza un file `secrets.js` (non tracciato da git) per le chiavi API.
Copia `secrets.template.js` in `public/js/secrets.js` e inserisci le tue chiavi:
```javascript
window.GEMINI_API_KEY = "...";
window.AMADEUS_CLIENT_ID = "...";
// ecc...
```

### Avvio Locale
```bash
npm install
npm start
```

## 📱 Installazione su Mobile
L'applicazione è una PWA completa. Apri il browser su mobile e seleziona "Aggiungi a schermata Home" per installarla.
