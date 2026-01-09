const { useState, useEffect, useMemo } = React;

// --- ICONE INTEGRATE ---
const IconBase = ({ size = 24, className = "", children }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        {children}
    </svg>
);

const MapPin = (props) => (<IconBase {...props}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></IconBase>);
const Train = (props) => (<IconBase {...props}><rect width="16" height="16" x="4" y="3" rx="2" /><path d="M4 11h16" /><path d="M12 3v8" /><path d="m8 19-2 3" /><path d="m18 22-2-3" /><circle cx="8" cy="15" r="1" /><circle cx="16" cy="15" r="1" /></IconBase>);
const PoundSterling = (props) => (<IconBase {...props}><path d="M18 7c0-5.333-8-5.333-8 0" /><path d="M10 7v14" /><path d="M6 21h12" /><path d="M6 13h10" /></IconBase>);
const CheckCircle = (props) => (<IconBase {...props}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="m9 11 3 3L22 4" /></IconBase>);
const AlertCircle = (props) => (<IconBase {...props}><circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" /></IconBase>);
const Plus = (props) => (<IconBase {...props}><path d="M5 12h14" /><path d="M12 5v14" /></IconBase>);
const X = (props) => (<IconBase {...props}><path d="M18 6 6 18" /><path d="M6 6 18 18" /></IconBase>);
const Database = (props) => (<IconBase {...props}><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" /></IconBase>);
const RefreshCw = (props) => (<IconBase {...props}><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path d="M3 21v-5h5" /></IconBase>);
const Edit = (props) => (<IconBase {...props}><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" /></IconBase>);
const Trash = (props) => (<IconBase {...props}><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></IconBase>);
const User = (props) => (<IconBase {...props}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></IconBase>);
const Smartphone = (props) => (<IconBase {...props}><rect width="14" height="20" x="5" y="2" rx="2" ry="2" /><path d="M12 18h.01" /></IconBase>);
const Search = (props) => (<IconBase {...props}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></IconBase>);
const Minus = (props) => (<IconBase {...props}><path d="M5 12h14" /></IconBase>);
const Calendar = (props) => (<IconBase {...props}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></IconBase>);
const Clock = (props) => (<IconBase {...props}><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></IconBase>);
const Check = (props) => (<IconBase {...props}><polyline points="20 6 9 17 4 12" /></IconBase>);
const ArrowDown = (props) => (<IconBase {...props}><path d="M12 5v14" /><path d="m19 12-7 7-7-7" /></IconBase>);
const Backpack = (props) => (<IconBase {...props}><path d="M4 10a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" /><path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" /><path d="M8 21v-5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v5" /><path d="M8 10h8" /><path d="M9 14h6" /></IconBase>);

// --- DATI INIZIALI (SEED DATA) ---
const seedItinerary = [
    { nome: "British Museum", categoria: "Museo", quartiere: "Bloomsbury", durata: "3 ore", orari: "10.00 - 17.15", eccezioni: "Ven: 20.30 (ult vis 19.15)", visited: false, img: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/British_Museum_from_NE_2.JPG/1200px-British_Museum_from_NE_2.JPG", mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2483.2889612081244!2d-0.1292022840259966!3d51.51941331849183!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48761b323093d307%3A0x2fb199016d5642a7!2sBritish%20Museum!5e0!3m2!1sen!2sus!4v1626359556277!5m2!1sen!2sus" },
    { nome: "Tate Britain", categoria: "Museo", quartiere: "Pimlico", durata: "2 ore", orari: "10.00 - 18.00", eccezioni: "", visited: false },
    { nome: "V&A Museum", categoria: "Museo", quartiere: "South Kensington", durata: "2.5 ore", orari: "10.00 - 17.45", eccezioni: "Ven: 22.00", visited: false },
    { nome: "Museo di Storia Naturale", categoria: "Museo", quartiere: "South Kensington", durata: "2 ore", orari: "10.00 - 17.50", eccezioni: "ult vis 17.30", visited: false },
    { nome: "Westminster Abbey", categoria: "Museo", quartiere: "Westminster", durata: "2 ore", orari: "9.30 - 15.30", eccezioni: "Sab: 9.00 - 15.30 + £5.00 Queen's Galleries", visited: false },
    { nome: "Palace of Westminster", categoria: "Museo", quartiere: "Westminster", durata: "2 ore", orari: "9.00 - 18.15", eccezioni: "Aperto solo il Sabato", visited: false },
    { nome: "Buckingham Palace", categoria: "Museo", quartiere: "Westminster", durata: "1 ora", orari: "Cambio guardia 11.00", eccezioni: "Ven e Dom", visited: false },
    { nome: "Tower Bridge", categoria: "Museo", quartiere: "Southwark", durata: "2 ore", orari: "9.30 - 18.00", eccezioni: "ult vis 17.00", visited: false },
    { nome: "Torre di Londra", categoria: "Museo", quartiere: "Tower Hill", durata: "2.5 ore", orari: "09.00 - 16.30", eccezioni: "ult vis 15.30", visited: false },
    { nome: "London Eye", categoria: "Museo", quartiere: "Lambeth", durata: "30 min", orari: "11.00 - 18.00", eccezioni: "Sab-Dom: 10.00 - 20.30", visited: false },
    { nome: "Madame Tussauds", categoria: "Museo", quartiere: "Marylebone", durata: "2 ore", orari: "10.00 - 15.00", eccezioni: "", visited: false },
    { nome: "SEA LIFE London Aquarium", categoria: "Museo", quartiere: "Lambeth", durata: "3 ore", orari: "10.00 - 19.00", eccezioni: "", visited: false },
    { nome: "Tate Modern", categoria: "Museo", quartiere: "Bankside", durata: "2 ore", orari: "10.00 - 18.00", eccezioni: "", visited: false },
    { nome: "National Gallery", categoria: "Museo", quartiere: "Charing Cross", durata: "3 ore", orari: "10.00 - 18.00", eccezioni: "Ven: 21.00", visited: false },
    { nome: "Kensington Palace", categoria: "Museo", quartiere: "Kensington", durata: "3 ore", orari: "10.00 - 16.00", eccezioni: "ult vis 15.00", visited: false },
    { nome: "St. Paul's Cathedral", categoria: "Museo", quartiere: "Kensington", durata: "2 ore", orari: "08.00 - 16.30", eccezioni: "ult vis 16.00", visited: false },
    { nome: "Sky Garden", categoria: "Grattacielo", quartiere: "City of London", durata: "1.5 ore", orari: "10.00 - 18.00", eccezioni: "Sab-Dom: 11-21", visited: false },
    { nome: "The Shard", categoria: "Grattacielo", quartiere: "City of London", durata: "1.5 ore", orari: "11.00 - 19.00", eccezioni: "Sab: 10-22", visited: false },
    { nome: "Portobello Market", categoria: "Mercato", quartiere: "Notting Hill", durata: "2.5 ore", orari: "9.00 - 18.00", eccezioni: "Sab fino 19.00", visited: false },
    { nome: "Brick Lane Market", categoria: "Mercato", quartiere: "Shoreditch", durata: "4 ore", orari: "11.00 - 18.30", eccezioni: "Dom: 10-18", visited: false },
    { nome: "Borough Market", categoria: "Mercato", quartiere: "Southwark", durata: "3 ore", orari: "10.00 - 17.00", eccezioni: "Sab: 9-16, Dom: 10-16", visited: false },
    { nome: "Camden Market", categoria: "Mercato", quartiere: "Camden Town", durata: "3 ore", orari: "10.00 - 18.00", eccezioni: "Food fino 23", visited: false },
    { nome: "Hyde Park", categoria: "Parco", quartiere: "Westminster", durata: "2 ore", orari: "//", eccezioni: "", visited: false },
    { nome: "Kensington Gardens", categoria: "Parco", quartiere: "Kensington", durata: "2 ore", orari: "//", eccezioni: "", visited: false },
    { nome: "Regent's Park", categoria: "Parco", quartiere: "Marylebone", durata: "2.5 ore", orari: "//", eccezioni: "", visited: false },
    { nome: "Duck World", categoria: "Tempo libero", quartiere: "London Bridge", durata: "40 min", orari: "10.00 - 22.00", eccezioni: "", visited: false },
    { nome: "Hard Rock Cafe", categoria: "Ristorante", quartiere: "Mayfair", durata: "2 ore", orari: "09.00 - 22.00", eccezioni: "ven e sab = 09.00 - 23.00", visited: false },
    { nome: "LEGO® Store", categoria: "Tempo libero", quartiere: "Leicester Square", durata: "1.5 ore", orari: "10.00 - 22.00", eccezioni: "dom = 12.00 - 18.00", visited: false },
    { nome: "Trafalgar Square", categoria: "Piazza", quartiere: "Charing Cross", durata: "30 min", orari: "//", eccezioni: "", visited: false },
    { nome: "Big Ben", categoria: "Museo", quartiere: "Westminster", durata: "15 min", orari: "//", eccezioni: "", visited: false },
    { nome: "Piccadilly Circus", categoria: "Piazza", quartiere: "West End", durata: "1 ora", orari: "//", eccezioni: "", visited: false },
    { nome: "The Holland, Kensington", categoria: "Ristorante", quartiere: "Kensington", durata: "2 ore", orari: "12.00 - 23.00", eccezioni: "dom 12-18, lun-mar 16-22", visited: false },
    { nome: "City of London", categoria: "Piazza", quartiere: "City of London", durata: "2 ore", orari: "//", eccezioni: "", visited: false },
    { nome: "The Mitre", categoria: "Ristorante", quartiere: "Bayswater", durata: "2 ore", orari: "11.00 - 23.00", eccezioni: "dom = 11.00 - 22.30", visited: false },
    { nome: "King's Cross", categoria: "Tempo libero", quartiere: "King's Cross", durata: "30 min", orari: "5.00 - 1.36", eccezioni: "Foto Harry Potter 9-19", visited: false },
];

const seedTransport = [
    { partenza: "London Gatwick (LGW)", arrivo: "NOX Kensington", dettaglio: "Southern Train", data: "25/02/2026", ora: "19:15", costo: "£ 33.00", pagato: false, prenotato: false }
];

const seedBackpack = [
    // --- ANDREA INARDI ---
    { item: "Passaporto", categoria: "Documenti", packed: false, qty: 1, outside: false, owner: "Andrea Inardi", collocazione: "Tasca piccola" },
    { item: "Prenotazioni Voli/Hotel", categoria: "Documenti", packed: false, qty: 1, outside: false, owner: "Andrea Inardi", collocazione: "Zaino grande" },
    { item: "Adattatore UK", categoria: "Elettronica", packed: false, qty: 1, outside: false, owner: "Andrea Inardi", collocazione: "Tasca Tech" },
    { item: "Spazzolino e Dentifricio", categoria: "Toiletries", packed: false, qty: 1, outside: false, owner: "Andrea Inardi", collocazione: "Beauty Case" },

    // --- ELENA CAFASSO (From List) ---
    { item: "Termica bianca", categoria: "Maglietta", packed: false, qty: 1, outside: true, owner: "Elena Cafasso", collocazione: "Tasca centrale" },
    { item: "Collant termici marroncini", categoria: "Pantalone", packed: false, qty: 1, outside: true, owner: "Elena Cafasso", collocazione: "Tasca centrale" },
    { item: "Jeans con riga in mezzo", categoria: "Pantalone", packed: false, qty: 1, outside: true, owner: "Elena Cafasso", collocazione: "Tasca centrale" },
    { item: "Maglietta bianca con maniche nere", categoria: "Maglietta", packed: false, qty: 1, outside: true, owner: "Elena Cafasso", collocazione: "Tasca centrale" },
    { item: "Maglioncino rosa", categoria: "Maglietta", packed: false, qty: 1, outside: true, owner: "Elena Cafasso", collocazione: "Tasca centrale" },
    { item: "Pantalone comodo", categoria: "Pantalone", packed: false, qty: 1, outside: true, owner: "Elena Cafasso", collocazione: "Tasca centrale" },
    { item: "Mutande", categoria: "Intimo", packed: false, qty: 6, outside: true, owner: "Elena Cafasso", collocazione: "Tasca centrale" },
    { item: "Reggiseno bianco e nero", categoria: "Intimo", packed: false, qty: 1, outside: true, owner: "Elena Cafasso", collocazione: "Tasca centrale" },
    { item: "Canottiera grigia spessa", categoria: "Intimo", packed: false, qty: 1, outside: true, owner: "Elena Cafasso", collocazione: "Tasca centrale" },
    { item: "Carte UNO", categoria: "Svago", packed: false, qty: 1, outside: true, owner: "Elena Cafasso", collocazione: "Tasca laterale" },
    { item: "Carte normali", categoria: "Svago", packed: false, qty: 1, outside: true, owner: "Elena Cafasso", collocazione: "Tasca laterale" },
    { item: "Ombrello", categoria: "Necessità", packed: false, qty: 1, outside: false, owner: "Elena Cafasso", collocazione: "Tasca laterale" },
    { item: "Maglietta marina", categoria: "Pigiama", packed: false, qty: 1, outside: true, owner: "Elena Cafasso", collocazione: "Tasca centrale" },
    { item: "Pantalone con i cuoricini", categoria: "Pigiama", packed: false, qty: 1, outside: true, owner: "Elena Cafasso", collocazione: "Tasca centrale" },
    { item: "Calze", categoria: "Intimo", packed: false, qty: 5, outside: true, owner: "Elena Cafasso", collocazione: "Tasca centrale" },
    { item: "Calze antiscivolo", categoria: "Intimo", packed: false, qty: 1, outside: true, owner: "Elena Cafasso", collocazione: "Tasca centrale" },
    { item: "Powerbank", categoria: "Elettronica", packed: false, qty: 1, outside: false, owner: "Elena Cafasso", collocazione: "Borsa" },
    { item: "Cuffiette", categoria: "Elettronica", packed: false, qty: 1, outside: false, owner: "Elena Cafasso", collocazione: "Borsa" },
    { item: "Letterina", categoria: "Svago", packed: false, qty: 1, outside: true, owner: "Elena Cafasso", collocazione: "Borsa" },
    { item: "Specchietto", categoria: "Necessità", packed: false, qty: 1, outside: false, owner: "Elena Cafasso", collocazione: "Borsa" },
    { item: "Assorbenti", categoria: "Necessità", packed: false, qty: 5, outside: false, owner: "Elena Cafasso", collocazione: "Borsa" },
    { item: "Tampax", categoria: "Necessità", packed: false, qty: 7, outside: false, owner: "Elena Cafasso", collocazione: "Sacchetto bianco" },
    { item: "Spazzolino", categoria: "Necessità", packed: false, qty: 1, outside: false, owner: "Elena Cafasso", collocazione: "Sacchetto bianco" },
    { item: "Spugnetta x trucco", categoria: "Necessità", packed: false, qty: 1, outside: false, owner: "Elena Cafasso", collocazione: "Sacchetto bianco" },
    { item: "Aspirina", categoria: "Necessità", packed: false, qty: 1, outside: false, owner: "Elena Cafasso", collocazione: "Sacchetto bianco" },
    { item: "OKI", categoria: "Necessità", packed: false, qty: 4, outside: false, owner: "Elena Cafasso", collocazione: "Sacchetto bianco" },
    { item: "Paxabel", categoria: "Necessità", packed: false, qty: 2, outside: false, owner: "Elena Cafasso", collocazione: "Sacchetto bianco" },
    { item: "Fazzoletti", categoria: "Necessità", packed: false, qty: 1, outside: false, owner: "Elena Cafasso", collocazione: "Sacchetto bianco" },
    { item: "Salviette intime", categoria: "Necessità", packed: false, qty: 1, outside: false, owner: "Elena Cafasso", collocazione: "Sacchetto bianco" },
    { item: "Fazzoletti (pacchetti)", categoria: "Necessità", packed: false, qty: 2, outside: false, owner: "Elena Cafasso", collocazione: "Tasca piccola" },
    { item: "Borsa", categoria: "Svago", packed: false, qty: 1, outside: false, owner: "Elena Cafasso", collocazione: "Tasca piccola" },
    { item: "Occhiali da sole", categoria: "Necessità", packed: false, qty: 1, outside: true, owner: "Elena Cafasso", collocazione: "Tasca piccola" },
    { item: "Sacchetto bianco", categoria: "Necessità", packed: false, qty: 1, outside: false, owner: "Elena Cafasso", collocazione: "Tasca grande interna" },
    { item: "Intimo rosso", categoria: "Intimo", packed: false, qty: 1, outside: true, owner: "Elena Cafasso", collocazione: "Tasca centrale" },
    { item: "Caricatore cellulare", categoria: "Elettronica", packed: false, qty: 1, outside: true, owner: "Elena Cafasso", collocazione: "" },
    { item: "Caricatore powerbank", categoria: "Elettronica", packed: false, qty: 1, outside: true, owner: "Elena Cafasso", collocazione: "" },
    { item: "Vestitino nero", categoria: "Elegante", packed: false, qty: 1, outside: true, owner: "Elena Cafasso", collocazione: "" },
    { item: "Collant neri 20 den", categoria: "Elegante", packed: false, qty: 1, outside: true, owner: "Elena Cafasso", collocazione: "" },
    { item: "Dentifricio", categoria: "Liquido", packed: false, qty: 1, outside: true, ml: 50, owner: "Elena Cafasso", collocazione: "Busta trasparente" },
    { item: "Mascara", categoria: "Liquido", packed: false, qty: 1, outside: false, ml: 11, owner: "Elena Cafasso", collocazione: "Busta trasparente" },
    { item: "Matita per labbra", categoria: "Liquido", packed: false, qty: 1, outside: false, ml: 1.4, owner: "Elena Cafasso", collocazione: "Busta trasparente" },
    { item: "Rossetto", categoria: "Liquido", packed: false, qty: 1, outside: false, ml: 8, owner: "Elena Cafasso", collocazione: "Busta trasparente" },
    { item: "Lucidalabbra", categoria: "Liquido", packed: false, qty: 1, outside: false, ml: 12, owner: "Elena Cafasso", collocazione: "Busta trasparente" },
    { item: "Profumo", categoria: "Liquido", packed: false, qty: 1, outside: false, ml: 10.2, owner: "Elena Cafasso", collocazione: "Busta trasparente" },
    { item: "Amuchina", categoria: "Liquido", packed: false, qty: 1, outside: false, ml: 30, owner: "Elena Cafasso", collocazione: "Busta trasparente" },
    { item: "Felpa comoda", categoria: "Maglietta", packed: false, qty: 1, outside: true, owner: "Elena Cafasso", collocazione: "Tasca centrale" },
    { item: "Fondotinta", categoria: "Liquido", packed: false, qty: 1, outside: false, ml: 8, owner: "Elena Cafasso", collocazione: "Busta trasparente" },
    { item: "Correttore", categoria: "Liquido", packed: false, qty: 1, outside: false, ml: 10, owner: "Elena Cafasso", collocazione: "Busta trasparente" },
    { item: "Matita per sopracciglia", categoria: "Liquido", packed: false, qty: 1, outside: false, ml: 1.5, owner: "Elena Cafasso", collocazione: "Busta trasparente" },
    { item: "Bagnoschiuma", categoria: "Liquido", packed: false, qty: 1, outside: false, ml: 30, owner: "Elena Cafasso", collocazione: "Busta trasparente" },
    { item: "Crema per brufoli", categoria: "Liquido", packed: false, qty: 1, outside: false, ml: 5, owner: "Elena Cafasso", collocazione: "Busta trasparente" },
    { item: "Crema detergente", categoria: "Liquido", packed: false, qty: 1, outside: true, ml: 50, owner: "Elena Cafasso", collocazione: "Busta trasparente" },
    { item: "Shampoo", categoria: "Liquido", packed: false, qty: 1, outside: false, ml: 30, owner: "Elena Cafasso", collocazione: "Busta trasparente" },
    { item: "K-Way", categoria: "Necessità", packed: false, qty: 1, outside: true, owner: "Elena Cafasso", collocazione: "" },
    { item: "Chiavetta USB", categoria: "Elettronica", packed: false, qty: 1, outside: true, owner: "Elena Cafasso", collocazione: "" },
    { item: "Deodorante Wild", categoria: "Necessità", packed: false, qty: 1, outside: true, owner: "Elena Cafasso", collocazione: "Tasca grande interna" },
    { item: "Busta trasparente", categoria: "Necessità", packed: false, qty: 1, outside: true, owner: "Elena Cafasso", collocazione: "" },
];

const seedExpenses = [
    { item: "Viaggio volo da MXP a LGW", data: "25/02/2026", costo: 59.96, valuta: "€", pagato: true, prenotato: true, chi: "Andrea Inardi", note: "Volo aereo" },
    { item: "Viaggio volo da LGW a MXP", data: "01/03/2026", costo: 65.80, valuta: "€", pagato: true, prenotato: true, chi: "Andrea Inardi", note: "Volo aereo" },
    { item: "Pernottamento al NOX Kensington", data: "25/02/2026", costo: 464.55, valuta: "€", pagato: true, prenotato: true, chi: "Andrea Inardi", note: "Hotel" },

    // Attrazioni
    { item: "Palazzo di Westminster", data: "-", costo: 40.00, valuta: "£", pagato: false, prenotato: false, chi: "-", note: "£20.00 / persona" },
    { item: "British Museum", data: "-", costo: 0, valuta: "£", pagato: false, prenotato: false, chi: "-", note: "Gratis" },
    { item: "V&A Museum", data: "-", costo: 0, valuta: "£", pagato: false, prenotato: false, chi: "-", note: "Gratis" },
    { item: "Museo di storia naturale", data: "-", costo: 0, valuta: "£", pagato: false, prenotato: false, chi: "-", note: "Gratis" },
    { item: "Westminster Abbazia", data: "-", costo: 56.00, valuta: "£", pagato: false, prenotato: false, chi: "-", note: "£28.00 / persona" },
    { item: "Tower Bridge", data: "-", costo: 19.20, valuta: "£", pagato: false, prenotato: false, chi: "-", note: "£9.60 / persona" },
    { item: "Torre di Londra", data: "-", costo: 57.00, valuta: "£", pagato: false, prenotato: false, chi: "-", note: "£28.50 / persona (feb)" },
    { item: "London Eye", data: "-", costo: 58.00, valuta: "£", pagato: false, prenotato: false, chi: "-", note: "£29.00 / persona" },
    { item: "Madame Tussauds", data: "-", costo: 58.00, valuta: "£", pagato: false, prenotato: false, chi: "-", note: "£29.00 / persona" },
    { item: "Sea Life Aquarium", data: "-", costo: 58.00, valuta: "£", pagato: false, prenotato: false, chi: "-", note: "£29.00 / persona" },
    { item: "Tate Modern", data: "-", costo: 0, valuta: "£", pagato: false, prenotato: false, chi: "-", note: "Gratis" },
    { item: "National Gallery", data: "-", costo: 0, valuta: "£", pagato: false, prenotato: false, chi: "-", note: "Gratis" },
    { item: "Kensington Palace", data: "-", costo: 33.00, valuta: "£", pagato: false, prenotato: false, chi: "-", note: "£16.50 / persona" },
    { item: "Sky Garden", data: "-", costo: 0, valuta: "£", pagato: false, prenotato: false, chi: "-", note: "Gratis" },
    { item: "The Shard", data: "-", costo: 38.00, valuta: "£", pagato: false, prenotato: false, chi: "-", note: "£19.00 / persona" },
    { item: "St. Paul's Cathedral", data: "-", costo: 54.00, valuta: "£", pagato: false, prenotato: false, chi: "-", note: "£27.00 / persona" },
];

const seedDays = [
    {
        data: "2026-02-25",
        events: []
    }
];

// --- COMPONENTS ---

const Card = ({ children, className = "", noPadding = false, ...props }) => (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 ${noPadding ? "" : "p-4"} ${className}`} {...props}>
        {children}
    </div>
);

const Badge = ({ children, type }) => {
    let classes = "bg-gray-100 text-gray-600";
    if (type === "Museo") classes = "bg-blue-100 text-blue-700";
    if (type === "Mercato") classes = "bg-orange-100 text-orange-700";
    if (type === "Parco") classes = "bg-green-100 text-green-700";
    if (type === "Grattacielo") classes = "bg-purple-100 text-purple-700";
    if (type === "Ristorante") classes = "bg-amber-100 text-amber-700";
    if (type === "Piazza") classes = "bg-slate-200 text-slate-700";
    if (type === "Tempo libero") classes = "bg-pink-100 text-pink-700";

    // Backpack Categories
    if (type === "Liquido") classes = "bg-red-100 text-red-700";
    if (type === "Maglietta") classes = "bg-purple-100 text-purple-700";
    if (type === "Pantalone") classes = "bg-blue-600 text-white"; /* Stronger blue */
    if (type === "Intimo") classes = "bg-green-100 text-green-700 transition-colors";
    if (type === "Elettronica") classes = "bg-lime-100 text-lime-700";
    if (type === "Svago") classes = "bg-purple-200 text-purple-800";
    if (type === "Necessità") classes = "bg-teal-100 text-teal-700";
    if (type === "Pigiama") classes = "bg-yellow-900/20 text-yellow-900"; // Brown-ish
    if (type === "Elegante") classes = "bg-yellow-100 text-yellow-700";

    if (type === "Saldato") classes = "bg-green-100 text-green-700";
    if (type === "Da saldare") classes = "bg-red-100 text-red-700";
    if (type === "Gratis") classes = "bg-teal-100 text-teal-700";
    if (type === "Prenotato") classes = "bg-purple-100 text-purple-700";

    return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${classes}`}>{children}</span>;
};

const Button = ({ children, onClick, variant = "primary", className = "", icon: Icon }) => {
    let baseStyle = "w-full py-3 rounded-xl font-bold text-sm transition-all transform active:scale-95 flex items-center justify-center gap-2 shadow-sm";

    let variants = {
        primary: "bg-black text-white hover:bg-gray-800 shadow-gray-200",
        blue: "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-blue-200",
        green: "bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:from-emerald-600 hover:to-green-700 shadow-green-200",
        outline: "border-2 border-dashed border-gray-300 text-gray-400 hover:border-gray-400 hover:text-gray-600 hover:bg-gray-50",
        glass: "bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-sm"
    };

    return (
        <button onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className}`}>
            {Icon && <Icon size={18} />}
            {children}
        </button>
    );
};

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-[fade-in_0.15s_ease-out]">
            <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden scale-100 animate-[scale-in_0.15s_ease-out]">
                <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 className="font-bold text-gray-800">{title}</h3>
                    <button onClick={onClose} className="bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 p-2 rounded-full transition-all shadow-sm">
                        <X size={18} />
                    </button>
                </div>
                <div className="p-4 max-h-[75vh] overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    );
};

const InputGroup = ({ label, children }) => (
    <div className="mb-3">
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1 ml-1">{label}</label>
        {children}
    </div>
);

const App = () => {
    const [activeTab, setActiveTab] = useState("itinerary");
    const [itinerary, setItinerary] = useState([]);
    const [days, setDays] = useState([]); // NEW: Days state
    const [transport, setTransport] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [backpack, setBackpack] = useState([]); // NEW: Backpack state
    const [isLoading, setIsLoading] = useState(true);

    // Modal States
    const [activeModal, setActiveModal] = useState(null);
    const [viewingItem, setViewingItem] = useState(null);
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: "", message: "", onConfirm: null });

    // New Item States
    const [newItemItinerary, setNewItemItinerary] = useState({ nome: "", categoria: "Museo", quartiere: "", durata: "", orari: "", eccezioni: "", img: "", mapEmbed: "" });
    const [newItemDay, setNewItemDay] = useState({ data: "" });
    const [newItemEvent, setNewItemEvent] = useState({ type: 'attraction', attractionId: "", customTitle: "", time: "", notes: "" });
    const [newItemTransport, setNewItemTransport] = useState({ dettaglio: "", partenza: "", arrivo: "", data: "", ora: "", costo: "", pagato: false, prenotato: false });
    const [newItemExpense, setNewItemExpense] = useState({ item: "", costo: "", valuta: "£", pagato: false, prenotato: false, chi: "", note: "" });
    const [newItemBackpack, setNewItemBackpack] = useState({ item: "", categoria: "Altro", packed: false, qty: 1, outside: false, ml: "", owner: "Andrea Inardi", collocazione: "" });
    const [backpackOwnerFilter, setBackpackOwnerFilter] = useState("Andrea Inardi");
    const [backpackFilterLocation, setBackpackFilterLocation] = useState("Tutti"); // Tutti, Dentro, Fuori
    const [backpackFilterPlacement, setBackpackFilterPlacement] = useState("Tutti"); // Dynamic based on items

    // Editing State
    const [editingId, setEditingId] = useState(null);

    // Filters & Sorting
    const [filterCat, setFilterCat] = useState("Tutti");
    const [filterStatusItinerary, setFilterStatusItinerary] = useState("Tutti");
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatusExpenses, setFilterStatusExpenses] = useState("Tutti");

    const [sortOrder, setSortOrder] = useState("alpha"); // default, alpha

    // PWA Install State
    const [deferredPrompt, setDeferredPrompt] = useState(null);

    useEffect(() => {
        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };
        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            setDeferredPrompt(null);
        }
    };

    // --- FIREBASE LISTENERS ---
    useEffect(() => {
        if (!window.db) {
            console.error("Firebase not initialized");
            setIsLoading(false);
            return;
        }

        const unsubItinerary = db.collection("itinerary").onSnapshot(snapshot => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setItinerary(data);
        });

        const unsubTransport = db.collection("transport").onSnapshot(snapshot => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setTransport(data);
        });

        const unsubExpenses = db.collection("expenses").onSnapshot(snapshot => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setExpenses(data);
            setIsLoading(false);
        });

        const unsubDays = db.collection("days").orderBy("data").onSnapshot(snapshot => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setDays(data);
        });

        const unsubBackpack = db.collection("backpack").onSnapshot(snapshot => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setBackpack(data);
        });

        return () => {
            unsubItinerary();
            unsubTransport();
            unsubExpenses();
            unsubDays();
            unsubBackpack();
        };
    }, []);

    // --- STATS LOGIC ---
    // --- STATS LOGIC ---
    const EXCHANGE_RATE = 1.15;

    const parseCost = (costStr) => {
        if (!costStr) return { amount: 0, currency: "£" };
        const currency = costStr.includes("€") ? "€" : "£";
        const amount = parseFloat(costStr.replace(/[^0-9.]/g, "")) || 0;
        return { amount, currency };
    };

    const paidEUR = expenses.filter(e => e.valuta === "€" && e.pagato).reduce((acc, curr) => acc + Number(curr.costo), 0)
        + transport.filter(t => t.pagato).reduce((acc, curr) => {
            const { amount, currency } = parseCost(curr.costo);
            return currency === "€" ? acc + amount : acc;
        }, 0);

    const paidGBP = expenses.filter(e => e.valuta === "£" && e.pagato).reduce((acc, curr) => acc + Number(curr.costo), 0)
        + transport.filter(t => t.pagato).reduce((acc, curr) => {
            const { amount, currency } = parseCost(curr.costo);
            return currency === "£" ? acc + amount : acc;
        }, 0);

    const totalPaidEUR = paidEUR + (paidGBP * EXCHANGE_RATE);

    const toPayGBP = expenses.filter(e => e.valuta === "£" && !e.pagato).reduce((acc, curr) => acc + Number(curr.costo), 0)
        + transport.filter(t => !t.pagato).reduce((acc, curr) => {
            const { amount, currency } = parseCost(curr.costo);
            // Assuming unpaid Euro transport is rare or dealt with same way, but usually we care about currency used.
            // If it's Euro and unpaid, strictly speaking it's not GBP to pay.
            // But if we want a global "to pay" maybe we should separate or convert.
            // For now, let's stick to GBP for "Previsto (GBP)" as requested by label, so only sum £.
            return currency === "£" ? acc + amount : acc;
        }, 0);

    // --- OPTIMISTIC UPDATES ---
    const toggleVisit = (id, currentStatus) => {
        // Optimistic
        setItinerary(prev => prev.map(i => i.id === id ? { ...i, visited: !currentStatus } : i));
        db.collection("itinerary").doc(id).update({ visited: !currentStatus }).catch(err => {
            console.error("Reverting optimistic update", err);
            // Revert handled by snapshot listener automatically usually, but could be explicit here
        });
    };

    const togglePaid = (id, currentStatus) => {
        setExpenses(prev => prev.map(e => e.id === id ? { ...e, pagato: !currentStatus } : e));
        db.collection("expenses").doc(id).update({ pagato: !currentStatus });
    };

    const toggleBooked = (id, currentStatus) => {
        setExpenses(prev => prev.map(e => e.id === id ? { ...e, prenotato: !currentStatus } : e));
        db.collection("expenses").doc(id).update({ prenotato: !currentStatus });
    };

    const toggleTransportPaid = (id, currentStatus) => {
        setTransport(prev => prev.map(t => t.id === id ? { ...t, pagato: !currentStatus } : t));
        db.collection("transport").doc(id).update({ pagato: !currentStatus });
    };

    const toggleTransportBooked = (id, currentStatus) => {
        setTransport(prev => prev.map(t => t.id === id ? { ...t, prenotato: !currentStatus } : t));
        db.collection("transport").doc(id).update({ prenotato: !currentStatus });
    };



    const categories = ["Tutti", ...new Set(itinerary.map(i => i.categoria))];

    const filteredItinerary = useMemo(() => {
        let result = itinerary.filter(i => {
            const matchCat = filterCat === "Tutti" || i.categoria === filterCat;
            const matchStatus = filterStatusItinerary === "Tutti"
                ? true
                : filterStatusItinerary === "Visitati" ? i.visited : !i.visited;
            const matchSearch = i.nome.toLowerCase().includes(searchQuery.toLowerCase());
            return matchCat && matchStatus && matchSearch;
        });

        if (sortOrder === "alpha") {
            result.sort((a, b) => a.nome.localeCompare(b.nome));
        }

        return result;
    }, [itinerary, filterCat, filterStatusItinerary, sortOrder, searchQuery]);

    const filteredExpenses = useMemo(() => {
        let result = expenses.filter(e => {
            if (filterStatusExpenses === "Tutti") return true;
            if (filterStatusExpenses === "Da Pagare") return !e.pagato;
            if (filterStatusExpenses === "Pagati") return e.pagato;
            if (filterStatusExpenses === "Da Prenotare") return !e.prenotato;
            return true;
        });

        if (sortOrder === "alpha") {
            result.sort((a, b) => a.item.localeCompare(b.item));
        }

        return result;
    }, [expenses, filterStatusExpenses, sortOrder]);

    // Confirm Helper
    const requestConfirm = (title, message, onConfirm) => {
        setConfirmModal({ isOpen: true, title, message, onConfirm });
    };

    const handleConfirmAction = () => {
        if (confirmModal.onConfirm) confirmModal.onConfirm();
        setConfirmModal({ ...confirmModal, isOpen: false });
    };

    // Handlers CRUD
    const handleAddItinerary = async () => {
        if (!newItemItinerary.nome) return;

        if (editingId) {
            // Update
            setItinerary(prev => prev.map(i => i.id === editingId ? { ...i, ...newItemItinerary } : i));
            await db.collection("itinerary").doc(editingId).update(newItemItinerary);
        } else {
            // Create
            setItinerary([...itinerary, { ...newItemItinerary, id: 'temp_' + Date.now(), visited: false }]); // Optimistic
            await db.collection("itinerary").add({ ...newItemItinerary, visited: false });
        }

        setActiveModal(null);
        setEditingId(null);
        setNewItemItinerary({ nome: "", categoria: "Museo", quartiere: "", durata: "", orari: "", eccezioni: "", img: "", mapEmbed: "" });
    };

    const openEditItinerary = (item) => {
        setNewItemItinerary(item);
        setEditingId(item.id);
        setActiveModal('itinerary');
    };

    const handleDeleteItinerary = async (id) => {
        requestConfirm("Elimina Attrazione", "Sei sicuro di voler eliminare questa attrazione?", async () => {
            setItinerary(prev => prev.filter(i => i.id !== id));
            await db.collection("itinerary").doc(id).delete();
        });
    };

    const handleAddTransport = async () => {
        if (!newItemTransport.dettaglio) return;

        if (editingId) {
            setTransport(prev => prev.map(t => t.id === editingId ? { ...t, ...newItemTransport } : t));
            await db.collection("transport").doc(editingId).update(newItemTransport);
        } else {
            setTransport([...transport, { ...newItemTransport, id: 'temp_' + Date.now() }]);
            await db.collection("transport").add(newItemTransport);
        }

        setActiveModal(null);
        setEditingId(null);
        setNewItemTransport({ dettaglio: "", partenza: "", arrivo: "", data: "", ora: "", costo: "", pagato: false, prenotato: false });
    };

    const openEditTransport = (item) => {
        setNewItemTransport(item);
        setEditingId(item.id);
        setActiveModal('transport');
    };

    const handleDeleteTransport = async (id) => {
        requestConfirm("Elimina Spostamento", "Sei sicuro di voler eliminare questo spostamento?", async () => {
            setTransport(prev => prev.filter(t => t.id !== id));
            await db.collection("transport").doc(id).delete();
        });
    };

    const handleAddExpense = async () => {
        if (!newItemExpense.item) return;
        const expenseData = { ...newItemExpense, costo: Number(newItemExpense.costo) };

        if (editingId) {
            setExpenses(prev => prev.map(e => e.id === editingId ? { ...e, ...expenseData } : e));
            await db.collection("expenses").doc(editingId).update(expenseData);
        } else {
            setExpenses([...expenses, { ...expenseData, id: 'temp_' + Date.now() }]);
            await db.collection("expenses").add(expenseData);
        }

        setActiveModal(null);
        setEditingId(null);
        setNewItemExpense({ item: "", costo: "", valuta: "£", pagato: false, prenotato: false, chi: "", note: "" });
    };

    const openEditExpense = (item) => {
        setNewItemExpense(item);
        setEditingId(item.id);
        setActiveModal('expenses');
    };

    const handleDeleteExpense = async (id) => {
        requestConfirm("Elimina Spesa", "Sei sicuro di voler eliminare questa spesa?", async () => {
            setExpenses(prev => prev.filter(e => e.id !== id));
            await db.collection("expenses").doc(id).delete();
        });
    };

    // Days & Events Handlers
    const handleAddDay = async () => {
        if (!newItemDay.data) return;

        await db.collection("days").add({
            data: newItemDay.data,
            events: []
        });

        setActiveModal(null);
        setNewItemDay({ data: "" });
    };

    const handleDeleteDay = async (id) => {
        requestConfirm("Elimina Giornata", "Eliminare questa giornata e tutti i suoi eventi?", async () => {
            await db.collection("days").doc(id).delete();
        });
    };

    const openAddEvent = (dayId) => {
        setEditingId(dayId); // Using editingId to store the temporary Day ID we are adding to
        setActiveModal('event');
    };

    const handleAddEvent = async () => {
        if (!editingId) return;
        if (newItemEvent.type !== 'custom' && !newItemEvent.attractionId) return;
        if (newItemEvent.type === 'custom' && !newItemEvent.customTitle) return;

        const dayRef = db.collection("days").doc(editingId);
        const dayDoc = days.find(d => d.id === editingId);

        const newEventObj = {
            id: 'evt_' + Date.now(),
            ...newItemEvent
        };

        const updatedEvents = [...(dayDoc.events || []), newEventObj];
        // Sort events by time
        updatedEvents.sort((a, b) => a.time.localeCompare(b.time));

        await dayRef.update({ events: updatedEvents });

        setActiveModal(null);
        setEditingId(null);
        setNewItemEvent({ attractionId: "", time: "", notes: "" });
    };

    const handleDeleteEvent = async (dayId, eventId) => {
        const dayRef = db.collection("days").doc(dayId);
        const dayDoc = days.find(d => d.id === dayId);
        const updatedEvents = dayDoc.events.filter(e => e.id !== eventId);
        await dayRef.update({ events: updatedEvents });
    };

    // --- BACKPACK HANDLERS ---
    const handleAddBackpackItem = async () => {
        if (!newItemBackpack.item) return;

        await db.collection("backpack").add({
            ...newItemBackpack,
            qty: Number(newItemBackpack.qty) || 1,
            ml: newItemBackpack.categoria === 'Liquido' ? (Number(newItemBackpack.ml) || 0) : 0,
            outside: newItemBackpack.outside || false,
            owner: newItemBackpack.owner,
            collocazione: newItemBackpack.collocazione || "",
            packed: false
        });

        setNewItemBackpack({ item: "", categoria: newItemBackpack.categoria, packed: false, qty: 1, outside: false, ml: "", owner: backpackOwnerFilter, collocazione: "" }); // Keep last category & current filter owner
        // Don't close modal to allow rapid entry if desired, or maybe we do? Let's keep it open for now or add a "Salva e aggiungi altro" button? 
        // For simplicity, let's behave like others or just clear input.
        // If we want to strictly follow others pattern, we might want to close. 
        // But for a list, adding multiple things is common. 
        // Let's NOT close the modal, just clear the name.
        document.getElementById('backpack-input')?.focus();
    };

    const handleDeleteBackpackItem = async (id) => {
        await db.collection("backpack").doc(id).delete();
    };

    const togglePacked = (id, currentStatus) => {
        // Optimistic
        const newPacked = !currentStatus;
        const newOutside = !newPacked; // If Packed (True) -> Inside (Outside=False). If Unpacked (False) -> Outside (Outside=True).

        setBackpack(prev => prev.map(i => i.id === id ? { ...i, packed: newPacked, outside: newOutside } : i));
        db.collection("backpack").doc(id).update({ packed: newPacked, outside: newOutside });
    };

    const updateBackpackQty = (id, currentQty, delta) => {
        const newQty = Math.max(1, currentQty + delta);
        setBackpack(prev => prev.map(i => i.id === id ? { ...i, qty: newQty } : i));
        db.collection("backpack").doc(id).update({ qty: newQty });
    };

    const handleReloadBackpackOnly = async () => {
        requestConfirm("Ricarica Zaino", "Vuoi cancellare TUTTI gli oggetti dello zaino e ricaricare quelli predefiniti (Andrea + Elena)?", async () => {
            const batch = db.batch();

            // 1. Delete all current backpack docs
            // Note: In client SDK deleting collection is hard, so we just delete what we have in state or specific query.
            // For safety/speed in this small app, we iterate snapshot.
            const snapshot = await db.collection("backpack").get();
            snapshot.docs.forEach(doc => {
                batch.delete(doc.ref);
            });

            // 2. Add seed data
            seedBackpack.forEach(item => {
                const docRef = db.collection("backpack").doc();
                batch.set(docRef, item);
            });

            await batch.commit();
            alert("Zaino ricaricato!");
        });
    };

    const handleInitializeData = async () => {
        requestConfirm("Reset Dati", "ATTENZIONE: Questo cancellerà tutti i dati e li ripristinerà a quelli di default. Questa azione è irreversibile. Procedere?", async () => {
            const batch = db.batch();

            // Clean cleanup if needed, but for now just seed. 
            // Real app would delete collection first.

            seedItinerary.forEach(item => {
                const docRef = db.collection("itinerary").doc();
                batch.set(docRef, item);
            });
            seedTransport.forEach(item => {
                const docRef = db.collection("transport").doc();
                batch.set(docRef, item);
            });
            seedExpenses.forEach(item => {
                const docRef = db.collection("expenses").doc();
                batch.set(docRef, item);
            });
            seedDays.forEach(item => {
                const docRef = db.collection("days").doc();
                batch.set(docRef, item);
            });
            seedBackpack.forEach(item => {
                const docRef = db.collection("backpack").doc();
                batch.set(docRef, item);
            });

            await batch.commit();
            alert("Database inizializzato!");
        });
    };


    return (
        <div className="max-w-md mx-auto min-h-screen bg-gray-50 flex flex-col relative sm:max-w-xl md:max-w-3xl">

            {/* Header */}
            <header className="london-bg text-white p-6 pb-12 shadow-md">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <span>🇬🇧</span> Londra 2026
                    </h1>
                    <div className="text-xs bg-white/20 px-3 py-1 rounded-full">
                        25 Feb - 02 Mar
                    </div>
                </div>
                <div className="flex justify-between items-end mt-1">
                    <div className="flex items-center gap-2">
                        <p className="text-white/80 text-sm">Planner collaborativo</p>
                    </div>
                    {deferredPrompt && (
                        <button onClick={handleInstallClick} className="flex items-center gap-1 text-xs bg-white text-black font-bold px-3 py-1 rounded-full shadow-sm hover:bg-gray-100 transition-colors animate-bounce">
                            <Smartphone size={14} />
                            <span>Installa App</span>
                        </button>
                    )}
                </div>
            </header>

            {/* Stats Cards (Floating) */}
            <div className="px-4 -mt-8 grid grid-cols-2 gap-3 mb-4">
                <Card className="flex flex-col items-center justify-center py-3 border-b-4 border-b-green-500 shadow-md">
                    <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">Già Pagato</span>
                    <div className="flex flex-col items-center">
                        <span className="text-xl font-bold text-gray-800">€ {totalPaidEUR.toFixed(2)}</span>
                    </div>
                    <span className="text-[10px] text-gray-400">€ {(totalPaidEUR / 2).toFixed(2)} a testa</span>
                </Card>
                <Card className="flex flex-col items-center justify-center py-3 border-b-4 border-b-red-500 shadow-md">
                    <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">Previsto (GBP)</span>
                    <span className="text-xl font-bold text-gray-800">£ {toPayGBP.toFixed(2)}</span>
                    <span className="text-[10px] text-gray-400">£ {(toPayGBP / 2).toFixed(2)} a testa</span>
                </Card>
            </div>

            {/* Navigation Tabs */}
            <div className="px-4 mb-4 hidden md:block">
                <div className="flex bg-white rounded-xl p-1 shadow-sm border border-gray-100">
                    <button
                        onClick={() => setActiveTab("itinerary")}
                        className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${activeTab === 'itinerary' ? 'bg-red-50 text-red-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        Itinerario
                    </button>
                    <button
                        onClick={() => setActiveTab("attractions")}
                        className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${activeTab === 'attractions' ? 'bg-red-50 text-red-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        Attrazioni
                    </button>
                    <button
                        onClick={() => setActiveTab("expenses")}
                        className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${activeTab === 'expenses' ? 'bg-red-50 text-red-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        Spese
                    </button>
                    <button
                        onClick={() => setActiveTab("transport")}
                        className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${activeTab === 'transport' ? 'bg-red-50 text-red-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        Mezzi
                    </button>
                    <button
                        onClick={() => setActiveTab("backpack")}
                        className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${activeTab === 'backpack' ? 'bg-red-50 text-red-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        Zaino
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 px-4 pb-24 overflow-y-auto scroller">

                {/* ATTRACTIONS TAB (Old Itinerary) */}
                {activeTab === "attractions" && (
                    <div className="space-y-4">
                        {/* Compact Header Filters */}
                        <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 space-y-3">
                            {/* 1. Search Bar */}
                            <div className="bg-gray-50 p-2 rounded-lg flex items-center gap-2 border border-gray-100">
                                <Search size={18} className="text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Cerca attrazione..."
                                    className="w-full text-sm bg-transparent outline-none text-gray-700 placeholder-gray-400"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                {searchQuery && (
                                    <button onClick={() => setSearchQuery("")} className="text-gray-400 hover:text-gray-600">
                                        <X size={16} />
                                    </button>
                                )}
                            </div>

                            {/* 2. Status & Sort Row */}
                            <div className="flex justify-between items-center">
                                <div className="flex bg-gray-100 p-1 rounded-lg">
                                    {["Tutti", "Da Visitare", "Visitati"].map(status => (
                                        <button
                                            key={status}
                                            onClick={() => setFilterStatusItinerary(status)}
                                            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${filterStatusItinerary === status ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                        >
                                            {status}
                                        </button>
                                    ))}
                                </div>
                                <button
                                    onClick={() => setSortOrder(prev => prev === 'alpha' ? 'default' : 'alpha')}
                                    className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors ${sortOrder === 'alpha' ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:bg-gray-50'}`}
                                >
                                    {sortOrder === 'alpha' ? 'A-Z' : 'Default'}
                                </button>
                            </div>

                            {/* 3. Category Filters */}
                            <div className="flex gap-2 overflow-x-auto no-scrollbar pt-1 border-t border-gray-50">
                                {categories.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setFilterCat(cat)}
                                        className={`px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap border transition-colors ${filterCat === cat ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* List */}
                        <Button variant="outline" onClick={() => { setEditingId(null); setNewItemItinerary({ nome: "", categoria: "Museo", quartiere: "", durata: "", orari: "", eccezioni: "", img: "", mapEmbed: "" }); setActiveModal('itinerary'); }} icon={Plus}>
                            Aggiungi Attrazione
                        </Button>
                        {filteredItinerary.map(place => (
                            <Card key={place.id} onClick={() => setViewingItem(place)} noPadding className="relative overflow-hidden transition-all hover:shadow-md group flex flex-col cursor-pointer">
                                {place.visited && (
                                    <div className="absolute inset-0 bg-white/60 z-30 flex items-center justify-center backdrop-blur-[1px] transition-opacity pointer-events-none">
                                        <div className="bg-green-100/90 text-green-700 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1 shadow-sm border border-green-200">
                                            <CheckCircle size={16} /> Visitato
                                        </div>
                                    </div>
                                )}

                                {/* Image Section */}
                                <div className="relative w-full h-48 bg-gray-200 overflow-hidden group-hover:brightness-[0.98] transition-all">
                                    {place.img ? (
                                        <img src={place.img} alt={place.nome} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 bg-gray-100">
                                            <MapPin size={48} className="opacity-20 translate-y-2" />
                                            {/* Optional: Pattern or gradient could go here */}
                                        </div>
                                    )}

                                    {/* Overlay Gradient for Text readability if we put text on img (not doing for now, but good for style) */}
                                    {/* <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" /> */}

                                    {/* Floating Actions (Top Right) */}
                                    <div className="absolute top-2 right-2 flex gap-1 z-20 opacity-90">
                                        <button onClick={(e) => { e.stopPropagation(); openEditItinerary(place); }} className="bg-white/90 text-gray-600 hover:text-blue-600 p-1.5 rounded-lg shadow-sm backdrop-blur-sm hover:bg-white transition-all transform hover:scale-105">
                                            <Edit size={16} />
                                        </button>
                                        <button onClick={(e) => { e.stopPropagation(); handleDeleteItinerary(place.id); }} className="bg-white/90 text-gray-600 hover:text-red-600 p-1.5 rounded-lg shadow-sm backdrop-blur-sm hover:bg-white transition-all transform hover:scale-105">
                                            <Trash size={16} />
                                        </button>
                                    </div>

                                    {/* Category Badge (Top Left) */}
                                    <div className="absolute top-3 left-3 z-20">
                                        <Badge type={place.categoria}>{place.categoria}</Badge>
                                    </div>
                                </div>

                                {/* Content Section */}
                                <div className="p-4 flex flex-col flex-1 relative bg-white">

                                    {/* Header: Title & Location */}
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex-1 min-w-0 pr-2">
                                            <h3 className="font-bold text-gray-800 text-xl leading-tight truncate">{place.nome}</h3>
                                            <div className="flex items-center gap-1 text-gray-500 text-xs mt-1 font-medium">
                                                <MapPin size={12} className="text-gray-400" />
                                                <span>{place.quartiere}</span>
                                            </div>
                                        </div>

                                        {/* Actions Row (Secondary/Common) */}
                                        <div className="flex items-center gap-1 shrink-0">
                                            <button onClick={(e) => { e.stopPropagation(); toggleVisit(place.id, place.visited); }} className={`transition-all p-1.5 rounded-full ${place.visited ? 'text-green-600 bg-green-50 scale-110' : 'text-gray-300 hover:text-green-500 hover:bg-green-50'}`} title={place.visited ? "Segna come non visitato" : "Segna come visitato"}>
                                                <CheckCircle size={24} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Info Grid */}
                                    <div className="grid grid-cols-2 gap-2 text-xs mt-auto">
                                        <div className="bg-gray-50 p-2 rounded-lg border border-gray-100/50">
                                            <span className="block text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-0.5">Orari</span>
                                            <span className="font-semibold text-gray-700 truncate block" title={place.orari}>{place.orari || "//"}</span>
                                        </div>
                                        <div className="bg-gray-50 p-2 rounded-lg border border-gray-100/50">
                                            <span className="block text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-0.5">Durata</span>
                                            <span className="font-semibold text-gray-700 truncate block">{place.durata || "//"}</span>
                                        </div>
                                    </div>

                                    {/* Exceptions / Warnings */}
                                    {place.eccezioni && (
                                        <div className="mt-2 pt-2 border-t border-gray-100">
                                            <p className="text-xs text-rose-600 font-medium flex items-center gap-1.5">
                                                <AlertCircle size={12} className="shrink-0" />
                                                <span className="truncate">{place.eccezioni}</span>
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        ))}

                    </div>
                )}

                {/* EXPENSES TAB */}
                {/* EXPENSES TAB */}
                {activeTab === "expenses" && (
                    <div className="space-y-3">
                        {/* Status Filter */}
                        <div className="flex justify-between items-center bg-white p-2 rounded-xl shadow-sm border border-gray-100 mb-2">
                            <div className="flex bg-gray-100 p-1 rounded-lg">
                                {["Tutti", "Da Pagare", "Pagati"].map(status => (
                                    <button
                                        key={status}
                                        onClick={() => setFilterStatusExpenses(status)}
                                        className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${filterStatusExpenses === status ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                    >
                                        {status}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={() => setSortOrder(prev => prev === 'alpha' ? 'default' : 'alpha')}
                                className={`p-2 rounded-lg text-xs font-bold flex items-center gap-1 ${sortOrder === 'alpha' ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:bg-gray-50'}`}
                            >
                                {sortOrder === 'alpha' ? 'A-Z' : 'Default'}
                            </button>
                        </div>

                        <Button variant="green" onClick={() => setActiveModal('expenses')} icon={Plus}>
                            Aggiungi Spesa
                        </Button>

                        {filteredExpenses.map(exp => (
                            <Card key={exp.id} className="transition-all hover:shadow-md border-l-4 border-l-transparent hover:border-l-indigo-500">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-bold text-gray-800">{exp.item}</h3>
                                            <div className="flex gap-1 ml-2">
                                                <button onClick={() => openEditExpense(exp)} className="text-gray-300 hover:text-blue-500 p-1 rounded-full"><Edit size={14} /></button>
                                                <button onClick={() => handleDeleteExpense(exp.id)} className="text-gray-300 hover:text-red-500 p-1 rounded-full"><Trash size={14} /></button>
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-0.5 mb-2">{exp.note}</p>

                                        <div className="flex flex-wrap gap-2">
                                            <button
                                                onClick={() => toggleBooked(exp.id, exp.prenotato)}
                                                className={`text-[10px] font-bold px-2 py-1 rounded-md border transition-all flex items-center gap-1 ${exp.prenotato ? 'bg-purple-100 text-purple-700 border-purple-200' : 'bg-gray-50 text-gray-400 border-gray-200 hover:border-purple-300'}`}
                                            >
                                                {exp.prenotato ? '✓ Prenotato' : '○ Da Prenotare'}
                                            </button>
                                            <button
                                                onClick={() => togglePaid(exp.id, exp.pagato)}
                                                className={`text-[10px] font-bold px-2 py-1 rounded-md border transition-all flex items-center gap-1 ${exp.pagato ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-50 text-gray-400 border-gray-200 hover:border-green-300'}`}
                                            >
                                                {exp.pagato ? '✓ Pagato' : '○ Da Pagare'}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end">
                                        <span className="font-mono font-bold text-lg text-gray-800 tracking-tight">
                                            {exp.valuta} {exp.costo.toFixed(2)}
                                        </span>
                                        {exp.chi && exp.pagato && (
                                            <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded mt-1">
                                                {exp.chi}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        ))}


                        <div className="mt-6 bg-amber-50 border border-amber-100 rounded-xl p-4 text-sm text-amber-900 shadow-sm">
                            <p className="font-bold mb-1 flex items-center gap-2"><div className="w-2 h-2 bg-amber-500 rounded-full"></div>Info Budget</p>
                            <p className="opacity-80 text-xs">
                                I costi in sterline (£) sono indicativi.
                            </p>
                        </div>
                    </div>
                )}

                {/* TRANSPORT TAB */}
                {activeTab === "transport" && (
                    <div className="space-y-4">
                        <Button variant="blue" onClick={() => setActiveModal('transport')} icon={Plus}>
                            Aggiungi Viaggio
                        </Button>
                        {transport.map(trip => (
                            <Card key={trip.id} className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-2 text-blue-800 font-bold">
                                        <Train size={18} />
                                        <span>{trip.dettaglio}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="flex gap-1 ml-1">
                                            <button onClick={() => openEditTransport(trip)} className="text-gray-300 hover:text-blue-500 p-1 rounded-full"><Edit size={16} /></button>
                                            <button onClick={() => handleDeleteTransport(trip.id)} className="text-gray-300 hover:text-red-500 p-1 rounded-full"><Trash size={16} /></button>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 mb-4">
                                    <div className="text-center min-w-[60px] bg-blue-50/50 p-2 rounded-lg">
                                        <div className="text-xl font-bold text-blue-900">{trip.ora}</div>
                                        <div className="text-[10px] bg-white px-1 rounded text-blue-400 font-bold uppercase tracking-wide">{trip.data.split('/')[0]} Feb</div>
                                    </div>
                                    <div className="flex-1 flex flex-col gap-1 pl-2 relative">
                                        {/* Line visualization */}
                                        <div className="absolute left-[-10px] top-2 bottom-2 w-0.5 bg-gray-200"></div>
                                        <div className="absolute left-[-13px] top-1.5 w-2 h-2 rounded-full border-2 border-gray-300 bg-white"></div>

                                        <div className="text-sm font-bold text-gray-800">{trip.partenza}</div>
                                        <div className="text-sm font-bold text-gray-800 mt-2">{trip.arrivo}</div>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            onClick={() => toggleTransportBooked(trip.id, trip.prenotato)}
                                            className={`text-[10px] font-bold px-2 py-1 rounded-md border transition-all flex items-center gap-1 ${trip.prenotato ? 'bg-purple-100 text-purple-700 border-purple-200' : 'bg-gray-50 text-gray-400 border-gray-200 hover:border-purple-300'}`}
                                        >
                                            {trip.prenotato ? '✓ Prenotato' : '○ Da Prenotare'}
                                        </button>
                                        <button
                                            onClick={() => toggleTransportPaid(trip.id, trip.pagato)}
                                            className={`text-[10px] font-bold px-2 py-1 rounded-md border transition-all flex items-center gap-1 ${trip.pagato ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-50 text-gray-400 border-gray-200 hover:border-green-300'}`}
                                        >
                                            {trip.pagato ? '✓ Pagato' : '○ Da Pagare'}
                                        </button>
                                    </div>
                                    <div className="text-right">
                                        <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Costo</span>
                                        <span className="font-bold text-gray-900">{trip.costo}</span>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}

                {activeTab === "itinerary" && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm border border-gray-100 mb-2">
                            <h2 className="font-bold text-gray-800 flex items-center gap-2">
                                <Calendar size={20} className="text-red-500" /> Il tuo Viaggio
                            </h2>
                            <button onClick={() => setActiveModal('day')} className="bg-black text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-gray-800 transition-colors">
                                + Giornata
                            </button>
                        </div>

                        {days.map(day => {
                            const dateObj = new Date(day.data);
                            const dayName = dateObj.toLocaleDateString('it-IT', { weekday: 'long' });
                            const dayNumber = dateObj.getDate();
                            const monthName = dateObj.toLocaleDateString('it-IT', { month: 'long' });

                            // Date comparison logic
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            const checkDate = new Date(day.data);
                            checkDate.setHours(0, 0, 0, 0);

                            const isPast = checkDate < today;
                            const isToday = checkDate.getTime() === today.getTime();

                            return (
                                <div key={day.id} className={`relative pl-4 border-l-2 pb-8 last:pb-0 last:border-l-0 ${isPast ? 'border-gray-100 opacity-60 grayscale-[0.5]' : 'border-gray-200'}`}>
                                    <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-4 border-white shadow-sm ${isToday ? 'bg-blue-500 scale-125' : (isPast ? 'bg-gray-300' : 'bg-red-500')}`}></div>

                                    <div className={`rounded-xl shadow-sm border overflow-hidden mb-4 ${isToday ? 'bg-blue-50 border-blue-200 ring-2 ring-blue-100' : (isPast ? 'bg-gray-50 border-gray-100' : 'bg-white border-gray-100')}`}>
                                        <div className={`border-b p-3 flex justify-between items-center ${isToday ? 'bg-blue-100/50 border-blue-200' : (isPast ? 'bg-gray-100 border-gray-100' : 'bg-gray-50 border-gray-100')}`}>
                                            <div>
                                                <h3 className="font-black text-gray-800 text-lg capitalize flex items-center gap-2">
                                                    {dayName} <span className="text-red-500">{dayNumber}</span>
                                                </h3>
                                                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">{monthName} 2026</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button onClick={() => openAddEvent(day.id)} className="text-blue-600 bg-blue-50 hover:bg-blue-100 p-1.5 rounded-lg transition-colors text-xs font-bold flex items-center gap-1">
                                                    <Plus size={14} /> Evento
                                                </button>
                                                <button onClick={() => handleDeleteDay(day.id)} className="text-gray-400 hover:text-red-500 p-1.5 rounded-lg transition-colors">
                                                    <Trash size={16} />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="divide-y divide-gray-50">
                                            {(!day.events || day.events.length === 0) && (
                                                <div className="p-8 text-center text-gray-400 text-sm italic">
                                                    Nessun evento pianificato per oggi
                                                </div>
                                            )}
                                            {day.events && day.events.map(event => {
                                                const isCustom = event.type === 'custom';
                                                const attr = !isCustom ? itinerary.find(i => i.id === event.attractionId) : null;
                                                return (
                                                    <div key={event.id} className="p-3 hover:bg-gray-50 transition-colors flex gap-3 group">
                                                        <div className="flex flex-col items-center justify-start pt-1 min-w-[40px]">
                                                            <span className="font-bold text-gray-700 text-sm">{event.time}</span>
                                                            <div className="h-full w-0.5 bg-gray-100 mt-2 mb-[-12px] group-last:hidden"></div>
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex justify-between items-start">
                                                                <h4 className="font-bold text-gray-800 text-sm">
                                                                    {isCustom ? (
                                                                        <span className="flex items-center gap-2">
                                                                            <span className="p-1 bg-gray-100 rounded text-gray-600"><Edit size={12} /></span>
                                                                            {event.customTitle}
                                                                        </span>
                                                                    ) : (
                                                                        attr ? (
                                                                            <span>
                                                                                {attr.nome} <span className="font-normal text-gray-400 text-xs ml-1">({attr.durata})</span>
                                                                            </span>
                                                                        ) : 'Attrazione rimossa'
                                                                    )}
                                                                </h4>
                                                                <button onClick={() => handleDeleteEvent(day.id, event.id)} className="text-gray-200 group-hover:text-red-400 p-1 transition-colors">
                                                                    <X size={14} />
                                                                </button>
                                                            </div>
                                                            {!isCustom && attr && <p className="text-xs text-gray-500 flex items-center gap-1 mt-1"><MapPin size={10} /> {attr.quartiere}</p>}
                                                            {event.notes && <p className="text-xs text-amber-600 bg-amber-50 inline-block px-1.5 py-0.5 rounded mt-1 border border-amber-100">{event.notes}</p>}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* BACKPACK TAB */}
                {activeTab === "backpack" && (
                    <div className="space-y-6">

                        {/* Owner Switcher */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 mb-4 space-y-3">
                            {/* Row 1: Filters (Owner + Location) */}
                            <div className="flex flex-col gap-2">
                                <div className="flex gap-2 text-sm">
                                    <div className="flex-1 flex bg-gray-50 p-1 rounded-lg">
                                        {["Andrea Inardi", "Elena Cafasso"].map(owner => (
                                            <button
                                                key={owner}
                                                onClick={() => { setBackpackOwnerFilter(owner); setBackpackFilterPlacement("Tutti"); }}
                                                className={`flex-1 py-1.5 rounded-md font-bold transition-all flex items-center justify-center gap-1 text-xs ${backpackOwnerFilter === owner ? 'bg-white text-black shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                                            >
                                                <User size={12} /> {owner.split(' ')[0]}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="flex-[0.8] flex bg-gray-50 p-1 rounded-lg">
                                        {["Tutti", "Dentro", "Fuori"].map(loc => (
                                            <button
                                                key={loc}
                                                onClick={() => setBackpackFilterLocation(loc)}
                                                className={`flex-1 py-1.5 rounded-md font-bold transition-all text-xs ${backpackFilterLocation === loc ? 'bg-white text-black shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                                            >
                                                {loc}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Row 2: Placement Scroll (Dynamic) */}
                                {(() => {
                                    const uniquePlacements = [...new Set(backpack.filter(i => i.owner === backpackOwnerFilter && i.collocazione).map(i => i.collocazione))].sort();
                                    const placements = ["Tutti", ...uniquePlacements];

                                    if (uniquePlacements.length > 0) {
                                        return (
                                            <div className="flex gap-2 overflow-x-auto no-scrollbar pt-1 border-t border-gray-50">
                                                {placements.map(place => (
                                                    <button
                                                        key={place}
                                                        onClick={() => setBackpackFilterPlacement(place)}
                                                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap border transition-colors flex items-center gap-1 ${backpackFilterPlacement === place ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}`}
                                                    >
                                                        <MapPin size={10} /> {place}
                                                    </button>
                                                ))}
                                            </div>
                                        );
                                    }
                                })()}
                            </div>

                            {/* Row 3: Compact Stats */}
                            <div className="pt-2 border-t border-gray-50">
                                <div className="flex justify-between items-end mb-1.5">
                                    <div className="flex items-center gap-2">
                                        <Backpack size={18} className="text-gray-300" />
                                        <div className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                                            {backpack.filter(i => i.owner === backpackOwnerFilter && i.packed).length}/{backpack.filter(i => i.owner === backpackOwnerFilter).length} OGGETTI
                                        </div>
                                        {(() => {
                                            const currentBackpack = backpack.filter(i => i.owner === backpackOwnerFilter);
                                            const totalLiquids = currentBackpack
                                                .filter(i => i.categoria === 'Liquido')
                                                .reduce((acc, curr) => acc + ((Number(curr.ml) || 0) * (Number(curr.qty) || 1)), 0);

                                            if (totalLiquids > 0) {
                                                return (
                                                    <div className={`text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 ${totalLiquids > 1000 ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-500'}`}>
                                                        💧 {totalLiquids}ml {totalLiquids > 1000 && '!'}
                                                    </div>
                                                );
                                            }
                                        })()}
                                    </div>
                                    <div className="text-[10px] font-bold text-gray-400">
                                        {backpack.filter(i => i.owner === backpackOwnerFilter).length > 0 ? Math.round((backpack.filter(i => i.owner === backpackOwnerFilter && i.packed).length / backpack.filter(i => i.owner === backpackOwnerFilter).length) * 100) : 0}%
                                    </div>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                    <div
                                        className="bg-black h-1.5 rounded-full transition-all duration-500 ease-out"
                                        style={{ width: `${backpack.filter(i => i.owner === backpackOwnerFilter).length > 0 ? (backpack.filter(i => i.owner === backpackOwnerFilter && i.packed).length / backpack.filter(i => i.owner === backpackOwnerFilter).length) * 100 : 0}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>

                        <Button variant="outline" onClick={() => { setNewItemBackpack(prev => ({ ...prev, owner: backpackOwnerFilter })); setActiveModal('backpack'); }} icon={Plus}>
                            Aggiungi a {backpackOwnerFilter.split(' ')[0]}
                        </Button>

                        <div className="space-y-6">
                            {(() => {
                                let filteredBackpack = backpack.filter(i => i.owner === backpackOwnerFilter);

                                // Apply Location Filter
                                if (backpackFilterLocation === "Dentro") filteredBackpack = filteredBackpack.filter(i => !i.outside);
                                if (backpackFilterLocation === "Fuori") filteredBackpack = filteredBackpack.filter(i => i.outside);

                                // Apply Placement Filter
                                if (backpackFilterPlacement !== "Tutti") filteredBackpack = filteredBackpack.filter(i => i.collocazione === backpackFilterPlacement);

                                const activeCategories = [...new Set([...filteredBackpack.map(i => i.categoria), "Liquido", "Maglietta", "Pantalone", "Intimo", "Elettronica", "Svago", "Necessità", "Pigiama", "Elegante"])]
                                    .filter(cat => filteredBackpack.some(i => i.categoria === cat))
                                    .sort();

                                if (filteredBackpack.length === 0 && backpack.filter(i => i.owner === backpackOwnerFilter).length > 0) {
                                    return (
                                        <div className="text-center py-10 opacity-50">
                                            <Search size={48} className="mx-auto mb-2 text-gray-300" />
                                            <p className="text-gray-400 text-sm">Nessun oggetto trovato con questi filtri</p>
                                        </div>
                                    );
                                }

                                return activeCategories.map(cat => (
                                    <div key={cat}>
                                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1 flex items-center gap-2">
                                            <Badge type={cat}>{cat}</Badge>
                                        </h3>
                                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-50 overflow-hidden">
                                            {filteredBackpack.filter(i => i.categoria === cat).map(item => (
                                                <div key={item.id} className={`p-4 flex items-center gap-3 transition-colors group ${item.packed ? 'bg-green-50/30' : 'hover:bg-gray-50'}`}>

                                                    {/* Qty Controls (Moved to Start) */}
                                                    <div className="flex flex-col items-center gap-0.5 bg-gray-50 rounded-lg p-0.5 border border-gray-100 min-w-[24px]">
                                                        <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); updateBackpackQty(item.id, item.qty || 1, 1) }} className="p-0.5 hover:bg-gray-200 rounded text-gray-500 font-bold leading-none"><Plus size={10} /></button>
                                                        <span className="text-xs font-bold text-gray-700 text-center select-none">{item.qty || 1}</span>
                                                        <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); updateBackpackQty(item.id, item.qty || 1, -1) }} className="p-0.5 hover:bg-gray-200 rounded text-gray-500 font-bold leading-none"><Minus size={10} /></button>
                                                    </div>

                                                    {/* Content */}
                                                    <div className="flex-1 min-w-0" onClick={() => togglePacked(item.id, item.packed)}>
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <span className={`font-medium text-sm transition-all truncate ${item.packed ? 'text-gray-400 line-through decoration-gray-300' : 'text-gray-800'}`}>
                                                                {item.item}
                                                            </span>
                                                            {item.ml > 0 && <span className="text-[10px] font-bold text-blue-500 bg-blue-50 px-1 rounded">{item.ml}ml</span>}

                                                            {/* Location Status Tag (Linked to Button) */}
                                                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border whitespace-nowrap transition-colors ${item.packed ? 'bg-green-50 text-green-600 border-green-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                                                                {item.packed ? "DENTRO" : "FUORI"}
                                                            </span>
                                                        </div>
                                                        {item.collocazione && (
                                                            <div className="text-[10px] text-gray-400 font-semibold mt-0.5 flex items-center gap-1">
                                                                <MapPin size={10} /> {item.collocazione}
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Actions */}
                                                    <div className="flex items-center gap-1">
                                                        {/* Toggle Packed (Backpack Icon) */}
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); togglePacked(item.id, item.packed); }}
                                                            className={`p-2.5 rounded-full transition-all duration-200 ${item.packed ? 'bg-amber-50 text-amber-500 shadow-sm border border-amber-100' : 'bg-transparent text-gray-300 hover:text-gray-500 hover:bg-gray-50'}`}
                                                            title={item.packed ? "Rimuovi dallo zaino" : "Metti nello zaino"}
                                                        >
                                                            <Backpack size={20} strokeWidth={item.packed ? 2.5 : 2} />
                                                        </button>

                                                        <button onClick={(e) => { e.stopPropagation(); handleDeleteBackpackItem(item.id); }} className="text-gray-300 hover:text-red-500 p-2 rounded-full transition-colors">
                                                            <Trash size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ));
                            })()}

                            {backpack.filter(i => i.owner === backpackOwnerFilter).length === 0 && (
                                <div className="text-center py-10 opacity-50">
                                    <Backpack size={48} className="mx-auto mb-2 text-gray-300" />
                                    <p className="text-gray-400 text-sm">Zaino vuoto</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

            </div>

            {/* MODALS */}

            {/* Add Itinerary Modal */}
            <Modal isOpen={activeModal === 'itinerary'} onClose={() => setActiveModal(null)} title={editingId ? "Modifica Attrazione" : "Nuova Attrazione"}>
                <InputGroup label="Nome">
                    <input type="text" className="w-full border-2 border-gray-200 rounded-xl p-3 text-sm focus:border-black focus:outline-none transition-colors" placeholder="Es. London Eye" value={newItemItinerary.nome} onChange={e => setNewItemItinerary({ ...newItemItinerary, nome: e.target.value })} />
                </InputGroup>
                <InputGroup label="Categoria">
                    <select className="w-full border-2 border-gray-200 rounded-xl p-3 text-sm bg-white focus:border-black focus:outline-none" value={newItemItinerary.categoria} onChange={e => setNewItemItinerary({ ...newItemItinerary, categoria: e.target.value })}>
                        {[...new Set(["Museo", "Mercato", "Parco", "Piazza", "Ristorante", "Tempo libero", "Grattacielo", "Altro", ...categories.filter(c => c !== "Tutti")])].sort().map(cat => (
                            <option key={cat}>{cat}</option>
                        ))}
                    </select>
                </InputGroup>
                <InputGroup label="Quartiere">
                    <input type="text" className="w-full border-2 border-gray-200 rounded-xl p-3 text-sm focus:border-black focus:outline-none" placeholder="Es. Westminster" value={newItemItinerary.quartiere} onChange={e => setNewItemItinerary({ ...newItemItinerary, quartiere: e.target.value })} />
                </InputGroup>
                <div className="grid grid-cols-2 gap-3">
                    <InputGroup label="Durata">
                        <input type="text" className="w-full border-2 border-gray-200 rounded-xl p-3 text-sm focus:border-black focus:outline-none" placeholder="Es. 2 ore" value={newItemItinerary.durata} onChange={e => setNewItemItinerary({ ...newItemItinerary, durata: e.target.value })} />
                    </InputGroup>
                    <InputGroup label="Orari">
                        <input type="text" className="w-full border-2 border-gray-200 rounded-xl p-3 text-sm focus:border-black focus:outline-none" placeholder="10:00 - 18:00" value={newItemItinerary.orari} onChange={e => setNewItemItinerary({ ...newItemItinerary, orari: e.target.value })} />
                    </InputGroup>
                </div>
                <InputGroup label="Eccezioni">
                    <input type="text" className="w-full border-2 border-gray-200 rounded-xl p-3 text-sm focus:border-black focus:outline-none" placeholder="Es. Chiuso lunedì" value={newItemItinerary.eccezioni} onChange={e => setNewItemItinerary({ ...newItemItinerary, eccezioni: e.target.value })} />
                </InputGroup>
                <div className="grid grid-cols-1 gap-3">
                    <InputGroup label="Immagine (URL)">
                        <input type="text" className="w-full border-2 border-gray-200 rounded-xl p-3 text-sm focus:border-black focus:outline-none" placeholder="https://..." value={newItemItinerary.img} onChange={e => setNewItemItinerary({ ...newItemItinerary, img: e.target.value })} />
                    </InputGroup>
                    <InputGroup label="Mappa (Embed URL)">
                        <input type="text" className="w-full border-2 border-gray-200 rounded-xl p-3 text-sm focus:border-black focus:outline-none" placeholder="https://..." value={newItemItinerary.mapEmbed} onChange={e => setNewItemItinerary({ ...newItemItinerary, mapEmbed: e.target.value })} />
                        <p className="text-[10px] text-gray-400 mt-1">Vai su Google Maps {'>'} Condividi {'>'} Incorpora una mappa {'>'} Copia HTML (solo il link 'src')</p>
                    </InputGroup>
                </div>
                <Button onClick={handleAddItinerary} className="mt-4">Salva</Button>
            </Modal>

            {/* Add Transport Modal */}
            <Modal isOpen={activeModal === 'transport'} onClose={() => setActiveModal(null)} title="Nuovo Spostamento">
                <InputGroup label="Mezzo">
                    <input type="text" className="w-full border-2 border-gray-200 rounded-xl p-3 text-sm focus:border-blue-600 focus:outline-none" placeholder="Es. Uber" value={newItemTransport.dettaglio} onChange={e => setNewItemTransport({ ...newItemTransport, dettaglio: e.target.value })} />
                </InputGroup>
                <div className="grid grid-cols-2 gap-3">
                    <InputGroup label="Partenza">
                        <input type="text" className="w-full border-2 border-gray-200 rounded-xl p-3 text-sm focus:border-blue-600 focus:outline-none" placeholder="Da..." value={newItemTransport.partenza} onChange={e => setNewItemTransport({ ...newItemTransport, partenza: e.target.value })} />
                    </InputGroup>
                    <InputGroup label="Arrivo">
                        <input type="text" className="w-full border-2 border-gray-200 rounded-xl p-3 text-sm focus:border-blue-600 focus:outline-none" placeholder="A..." value={newItemTransport.arrivo} onChange={e => setNewItemTransport({ ...newItemTransport, arrivo: e.target.value })} />
                    </InputGroup>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <InputGroup label="Data">
                        <input type="text" className="w-full border-2 border-gray-200 rounded-xl p-3 text-sm focus:border-blue-600 focus:outline-none" placeholder="25/02" value={newItemTransport.data} onChange={e => setNewItemTransport({ ...newItemTransport, data: e.target.value })} />
                    </InputGroup>
                    <InputGroup label="Ora">
                        <input type="text" className="w-full border-2 border-gray-200 rounded-xl p-3 text-sm focus:border-blue-600 focus:outline-none" placeholder="14:00" value={newItemTransport.ora} onChange={e => setNewItemTransport({ ...newItemTransport, ora: e.target.value })} />
                    </InputGroup>
                </div>
                <InputGroup label="Costo">
                    <input type="text" className="w-full border-2 border-gray-200 rounded-xl p-3 text-sm focus:border-blue-600 focus:outline-none" placeholder="£ 10.00" value={newItemTransport.costo} onChange={e => setNewItemTransport({ ...newItemTransport, costo: e.target.value })} />
                </InputGroup>
                <Button variant="blue" onClick={handleAddTransport} className="mt-4">Salva Viaggio</Button>
            </Modal>

            {/* Add Expense Modal */}
            <Modal isOpen={activeModal === 'expenses'} onClose={() => setActiveModal(null)} title="Nuova Spesa">
                <InputGroup label="Oggetto">
                    <input type="text" className="w-full border-2 border-gray-200 rounded-xl p-3 text-sm focus:border-green-600 focus:outline-none" placeholder="Es. Cena" value={newItemExpense.item} onChange={e => setNewItemExpense({ ...newItemExpense, item: e.target.value })} />
                </InputGroup>
                <div className="grid grid-cols-2 gap-3">
                    <InputGroup label="Importo">
                        <input type="number" className="w-full border-2 border-gray-200 rounded-xl p-3 text-sm focus:border-green-600 focus:outline-none" placeholder="0.00" value={newItemExpense.costo} onChange={e => setNewItemExpense({ ...newItemExpense, costo: e.target.value })} />
                    </InputGroup>
                    <InputGroup label="Valuta">
                        <select className="w-full border-2 border-gray-200 rounded-xl p-3 text-sm bg-white focus:border-green-600 focus:outline-none" value={newItemExpense.valuta} onChange={e => setNewItemExpense({ ...newItemExpense, valuta: e.target.value })}>
                            <option value="£">Sterline (£)</option>
                            <option value="€">Euro (€)</option>
                        </select>
                    </InputGroup>
                </div>
                <div className="flex gap-4 mb-4 mt-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer p-2 hover:bg-gray-50 rounded-lg w-full border border-gray-200 transition-all">
                        <input type="checkbox" className="w-4 h-4 rounded text-green-600 focus:ring-green-500" checked={newItemExpense.prenotato} onChange={e => setNewItemExpense({ ...newItemExpense, prenotato: e.target.checked })} />
                        Già Prenotato
                    </label>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer p-2 hover:bg-gray-50 rounded-lg w-full border border-gray-200 transition-all">
                        <input type="checkbox" className="w-4 h-4 rounded text-green-600 focus:ring-green-500" checked={newItemExpense.pagato} onChange={e => setNewItemExpense({ ...newItemExpense, pagato: e.target.checked })} />
                        Già Pagato
                    </label>
                </div>
                <InputGroup label="Chi ha pagato">
                    <select className="w-full border-2 border-gray-200 rounded-xl p-3 text-sm bg-white focus:border-green-600 focus:outline-none" value={newItemExpense.chi} onChange={e => setNewItemExpense({ ...newItemExpense, chi: e.target.value })}>
                        <option value="">-- Seleziona --</option>
                        <option value="Andrea Inardi">Andrea Inardi</option>
                        <option value="Elena Cafasso">Elena Cafasso</option>
                    </select>
                </InputGroup>
                <InputGroup label="Note">
                    <input type="text" className="w-full border-2 border-gray-200 rounded-xl p-3 text-sm focus:border-green-600 focus:outline-none" placeholder="Es. Da dividere" value={newItemExpense.note} onChange={e => setNewItemExpense({ ...newItemExpense, note: e.target.value })} />
                </InputGroup>
                <Button variant="green" onClick={handleAddExpense} className="mt-4">Salva Spesa</Button>
            </Modal>

            <Modal isOpen={activeModal === 'day'} onClose={() => setActiveModal(null)} title="Nuova Giornata">
                <InputGroup label="Data">
                    <input
                        type="date"
                        className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 outline-none focus:border-black transition-all"
                        value={newItemDay.data}
                        onChange={(e) => setNewItemDay({ ...newItemDay, data: e.target.value })}
                    />
                </InputGroup>
                <Button onClick={handleAddDay}>Salva Giornata</Button>
            </Modal>

            {/* Add Event Modal with Rich Selector & Custom Mode */}
            <Modal isOpen={activeModal === 'event'} onClose={() => { setActiveModal(null); setEditingId(null); setNewItemEvent({ type: 'attraction', attractionId: "", customTitle: "", time: "", notes: "" }); }} title="Aggiungi Evento">
                {/* Type Toggle */}
                <div className="flex bg-gray-100 p-1 rounded-lg mb-4">
                    <button
                        onClick={() => setNewItemEvent({ ...newItemEvent, type: 'attraction' })}
                        className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${newItemEvent.type !== 'custom' ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Attrazione
                    </button>
                    <button
                        onClick={() => setNewItemEvent({ ...newItemEvent, type: 'custom' })}
                        className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${newItemEvent.type === 'custom' ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Altro / Note
                    </button>
                </div>

                {newItemEvent.type === 'custom' ? (
                    // Custom Event Form
                    <>
                        <InputGroup label="Titolo Attività">
                            <input
                                type="text"
                                placeholder="Es. Pranzo, Passeggiata, Shopping..."
                                className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-all"
                                value={newItemEvent.customTitle || ""}
                                onChange={(e) => setNewItemEvent({ ...newItemEvent, customTitle: e.target.value })}
                            />
                        </InputGroup>
                    </>
                ) : (
                    // Rich Attraction Selector
                    <>
                        {!newItemEvent.attractionId ? (
                            <div className="space-y-3">
                                <div className="relative">
                                    <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Cerca attrazione..."
                                        className="w-full pl-10 p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-all"
                                        onChange={(e) => {
                                            const term = e.target.value.toLowerCase();
                                            const options = document.querySelectorAll('.attraction-option');
                                            options.forEach(opt => {
                                                const name = opt.getAttribute('data-name').toLowerCase();
                                                opt.style.display = name.includes(term) ? 'flex' : 'none';
                                            });
                                        }}
                                    />
                                </div>
                                <div className="max-h-[300px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                                    {itinerary.sort((a, b) => a.nome.localeCompare(b.nome)).map(i => (
                                        <div
                                            key={i.id}
                                            data-name={i.nome}
                                            className="attraction-option flex items-center gap-3 p-2 rounded-xl border border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                                            onClick={() => setNewItemEvent({ ...newItemEvent, attractionId: i.id })}
                                        >
                                            <div className="w-12 h-12 rounded-lg bg-gray-200 overflow-hidden shrink-0">
                                                {i.img ? <img src={i.img} alt={i.nome} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-400"><MapPin size={20} /></div>}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-bold text-gray-800 text-sm truncate">{i.nome}</div>
                                                <div className="text-xs text-gray-500 flex items-center gap-2">
                                                    <span className="bg-gray-100 px-1.5 py-0.5 rounded text-[10px] font-semibold">{i.categoria}</span>
                                                    <span>{i.durata}</span>
                                                </div>
                                            </div>
                                            <div className="text-blue-600">
                                                <Plus size={18} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="relative">
                                <div className="flex items-center gap-3 p-3 rounded-xl border-2 border-blue-100 bg-blue-50 mb-4">
                                    {(() => {
                                        const i = itinerary.find(attr => attr.id === newItemEvent.attractionId);
                                        return i ? (
                                            <>
                                                <div className="w-12 h-12 rounded-lg bg-gray-200 overflow-hidden shrink-0">
                                                    {i.img ? <img src={i.img} alt={i.nome} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-400"><MapPin size={20} /></div>}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="font-bold text-blue-900 text-sm">{i.nome}</div>
                                                    <div className="text-xs text-blue-700">{i.durata}</div>
                                                </div>
                                                <button onClick={() => setNewItemEvent({ ...newItemEvent, attractionId: "" })} className="p-2 text-blue-400 hover:text-blue-700 hover:bg-blue-100 rounded-full transition-colors">
                                                    <RefreshCw size={16} />
                                                </button>
                                            </>
                                        ) : null;
                                    })()}
                                </div>

                                {/* Smart Scheduling Info */}
                                {(() => {
                                    const attr = itinerary.find(i => i.id === newItemEvent.attractionId);
                                    if (!attr) return null;

                                    const parseTime = (timeStr) => {
                                        if (!timeStr || timeStr === "//") return null;
                                        const parts = timeStr.replace('.', ':').split('-');
                                        if (parts.length < 2) return null;
                                        const start = parts[0].trim();
                                        const end = parts[1].trim();
                                        return { start, end };
                                    };

                                    const getMinutes = (timeStr) => {
                                        const [h, m] = timeStr.split(':').map(Number);
                                        return h * 60 + m;
                                    };

                                    const hours = parseTime(attr.orari);
                                    let error = null;
                                    let warning = null;
                                    let endTimeDisplay = "";

                                    if (newItemEvent.time && hours) {
                                        const eventTimeMins = getMinutes(newItemEvent.time);
                                        const openMins = getMinutes(hours.start);
                                        const closeMins = getMinutes(hours.end);

                                        if (eventTimeMins < openMins || eventTimeMins > closeMins) {
                                            error = `Chiuso! Apre alle ${hours.start} e chiude alle ${hours.end}`;
                                        } else {
                                            // Calculate End Time
                                            let durationMins = 0;
                                            if (attr.durata.includes('ore') || attr.durata.includes('ora')) {
                                                durationMins += parseFloat(attr.durata) * 60;
                                            } else if (attr.durata.includes('min')) {
                                                durationMins += parseInt(attr.durata);
                                            }

                                            if (durationMins > 0) {
                                                const endMins = eventTimeMins + durationMins;
                                                const endH = Math.floor(endMins / 60) % 24;
                                                const endM = endMins % 60;
                                                endTimeDisplay = `${endH.toString().padStart(2, '0')}:${endM.toString().padStart(2, '0')}`;

                                                if (endMins > closeMins) {
                                                    warning = `Attenzione: Finirai alle ${endTimeDisplay}, ma chiude alle ${hours.end}`;
                                                }
                                            }
                                        }
                                    }

                                    return (
                                        <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm text-sm space-y-2 mb-4">
                                            <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                                                <span className="text-gray-400 font-medium text-xs uppercase tracking-wider">Apertura</span>
                                                <span className="font-bold text-gray-700">{attr.orari}</span>
                                            </div>
                                            {attr.eccezioni && (
                                                <div className="bg-amber-50 text-amber-800 p-2 rounded-lg text-xs flex gap-2 items-start border border-amber-100">
                                                    <AlertCircle size={14} className="mt-0.5 shrink-0" />
                                                    <span>{attr.eccezioni}</span>
                                                </div>
                                            )}

                                            {error && (
                                                <div className="bg-red-50 text-red-600 p-2 rounded-lg text-xs font-bold border border-red-100 flex gap-2 items-center animate-pulse">
                                                    <AlertCircle size={14} /> {error}
                                                </div>
                                            )}
                                            {warning && !error && (
                                                <div className="bg-orange-50 text-orange-700 p-2 rounded-lg text-xs font-bold border border-orange-100 flex gap-2 items-center">
                                                    <AlertCircle size={14} /> {warning}
                                                </div>
                                            )}
                                            {!error && !warning && newItemEvent.time && endTimeDisplay && (
                                                <div className="text-xs text-center text-gray-500 mt-1 bg-gray-50 p-2 rounded-lg">
                                                    Finirai la visita circa alle <span className="font-bold text-gray-800">{endTimeDisplay}</span>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })()}
                            </div>
                        )}
                    </>
                )}

                <div className="grid grid-cols-1 gap-4">
                    <InputGroup label="Orario Inizio">
                        <input
                            type="time"
                            className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-all font-bold text-lg"
                            value={newItemEvent.time}
                            onChange={(e) => setNewItemEvent({ ...newItemEvent, time: e.target.value })}
                        />
                    </InputGroup>
                    <InputGroup label="Note (Opzionale)">
                        <input
                            type="text"
                            placeholder="Es. Ingresso prenotato, dettagli..."
                            className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-all"
                            value={newItemEvent.notes}
                            onChange={(e) => setNewItemEvent({ ...newItemEvent, notes: e.target.value })}
                        />
                    </InputGroup>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100">
                    <Button onClick={handleAddEvent} disabled={(() => {
                        if (!newItemEvent.time) return true;
                        if (newItemEvent.type === 'custom' && !newItemEvent.customTitle) return true;
                        if (newItemEvent.type !== 'custom' && !newItemEvent.attractionId) return true;

                        // Validation for attraction closing times
                        if (newItemEvent.type !== 'custom' && newItemEvent.attractionId) {
                            const attr = itinerary.find(i => i.id === newItemEvent.attractionId);
                            if (attr && attr.orari && attr.orari !== "//") {
                                const parts = attr.orari.replace('.', ':').split('-');
                                if (parts.length >= 2) {
                                    const [h, m] = newItemEvent.time.split(':').map(Number);
                                    const evtMins = h * 60 + m;
                                    const [openH, openM] = parts[0].trim().split(':').map(Number);
                                    const [closeH, closeM] = parts[1].trim().split(':').map(Number);
                                    const openMins = openH * 60 + openM;
                                    const closeMins = closeH * 60 + closeM;
                                    if (evtMins < openMins || evtMins > closeMins) return true;
                                }
                            }
                        }
                        return false;
                    })()} className="w-full py-4 text-base shadow-lg disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed">
                        Aggiungi all'Itinerario
                    </Button>
                </div>
            </Modal>

            {/* Add Backpack Item Modal */}
            <Modal isOpen={activeModal === 'backpack'} onClose={() => setActiveModal(null)} title="Nuovo Oggetto">
                <InputGroup label="Nome Oggetto">
                    <input
                        id="backpack-input"
                        type="text"
                        placeholder="Es. Caricabatterie..."
                        className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-all"
                        value={newItemBackpack.item}
                        onChange={(e) => setNewItemBackpack({ ...newItemBackpack, item: e.target.value })}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleAddBackpackItem() }}
                    />
                </InputGroup>
                <div className="grid grid-cols-2 gap-3 mb-2">
                    <InputGroup label="Quantità">
                        <input
                            type="number"
                            min="1"
                            placeholder="1"
                            className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-all"
                            value={newItemBackpack.qty}
                            onChange={(e) => setNewItemBackpack({ ...newItemBackpack, qty: e.target.value })}
                        />
                    </InputGroup>
                    <InputGroup label="Categoria">
                        <select
                            className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-all"
                            value={newItemBackpack.categoria}
                            onChange={(e) => setNewItemBackpack({ ...newItemBackpack, categoria: e.target.value })}
                        >
                            {["Liquido", "Maglietta", "Pantalone", "Intimo", "Elettronica", "Svago", "Necessità", "Pigiama", "Elegante", "Altro"].map(c => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </InputGroup>
                </div>

                {newItemBackpack.categoria === 'Liquido' && (
                    <InputGroup label="Millilitri (ml)">
                        <input
                            type="number"
                            placeholder="Es. 100"
                            className="w-full p-3 bg-blue-50 rounded-xl border border-blue-200 outline-none focus:border-blue-500 transition-all font-bold text-blue-900"
                            value={newItemBackpack.ml}
                            onChange={(e) => setNewItemBackpack({ ...newItemBackpack, ml: e.target.value })}
                        />
                    </InputGroup>
                )}

                <InputGroup label="Proprietario">
                    <select
                        className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-all"
                        value={newItemBackpack.owner}
                        onChange={(e) => setNewItemBackpack({ ...newItemBackpack, owner: e.target.value })}
                    >
                        <option value="Andrea Inardi">Andrea Inardi</option>
                        <option value="Elena Cafasso">Elena Cafasso</option>
                    </select>
                </InputGroup>

                <InputGroup label="Collocazione (Opzionale)">
                    <input
                        type="text"
                        placeholder="Es. Tasca davanti, Borsa..."
                        className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-all"
                        value={newItemBackpack.collocazione}
                        onChange={(e) => setNewItemBackpack({ ...newItemBackpack, collocazione: e.target.value })}
                    />
                </InputGroup>

                <div className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer p-3 hover:bg-gray-50 rounded-lg border border-gray-200 transition-all" onClick={() => setNewItemBackpack({ ...newItemBackpack, outside: !newItemBackpack.outside })}>
                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${newItemBackpack.outside ? 'bg-amber-500 border-amber-500 text-white' : 'border-gray-300'}`}>
                        {newItemBackpack.outside && <CheckCircle size={12} />}
                    </div>
                    <span>Fuori dallo zaino</span>
                </div>
                <Button onClick={handleAddBackpackItem} className="mt-4">
                    Aggiungi
                </Button>
            </Modal>

            {/* Confirmation Modal */}
            <Modal isOpen={confirmModal.isOpen} onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })} title={confirmModal.title}>
                <p className="text-gray-600 mb-6">{confirmModal.message}</p>
                <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" onClick={() => setConfirmModal({ ...confirmModal, isOpen: false })}>
                        Annulla
                    </Button>
                    <Button variant="primary" onClick={handleConfirmAction} className="bg-red-600 hover:bg-red-700 text-white border-0">
                        Conferma
                    </Button>
                </div>
            </Modal>

            {/* View Details Modal */}
            <Modal isOpen={!!viewingItem} onClose={() => setViewingItem(null)} title={viewingItem?.nome}>
                <div className="space-y-4">
                    {viewingItem?.img && (
                        <div className="w-full h-48 rounded-xl overflow-hidden shadow-sm">
                            <img src={viewingItem.img} alt={viewingItem.nome} className="w-full h-full object-cover" />
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                            <span className="text-[10px] text-gray-400 uppercase font-bold">Orari</span>
                            <div className="font-semibold text-gray-800 text-sm">{viewingItem?.orari}</div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                            <span className="text-[10px] text-gray-400 uppercase font-bold">Durata</span>
                            <div className="font-semibold text-gray-800 text-sm">{viewingItem?.durata}</div>
                        </div>
                    </div>

                    {viewingItem?.mapEmbed && (
                        <div className="w-full h-48 rounded-xl overflow-hidden border border-gray-200 shadow-sm relative bg-gray-100">
                            <iframe
                                width="100%"
                                height="100%"
                                src={viewingItem.mapEmbed}
                                frameBorder="0"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                            ></iframe>
                        </div>
                    )}

                    {!viewingItem?.img && !viewingItem?.mapEmbed && (
                        <div className="text-center py-8 text-gray-400 text-sm">
                            Nessun dettaglio aggiuntivo disponibile
                        </div>
                    )}
                </div>
            </Modal>


            {/* Footer Nav for Mobile */}
            <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-200 md:hidden pb-safe z-40">
                <div className="flex justify-around p-2">
                    <button onClick={() => setActiveTab("itinerary")} className={`flex flex-col items-center p-2 rounded-xl transition-all ${activeTab === 'itinerary' ? 'text-red-600 bg-red-50' : 'text-gray-400 hover:text-gray-600'}`}>
                        <Calendar size={20} className="mb-1" />
                        <span className="text-[10px] font-bold">Giornate</span>
                    </button>
                    <button onClick={() => setActiveTab("attractions")} className={`flex flex-col items-center p-2 rounded-xl transition-all ${activeTab === 'attractions' ? 'text-red-600 bg-red-50' : 'text-gray-400 hover:text-gray-600'}`}>
                        <MapPin size={20} className="mb-1" />
                        <span className="text-[10px] font-bold">Attrazioni</span>
                    </button>
                    <button onClick={() => setActiveTab("expenses")} className={`flex flex-col items-center p-2 rounded-xl transition-all ${activeTab === 'expenses' ? 'text-red-600 bg-red-50' : 'text-gray-400 hover:text-gray-600'}`}>
                        <PoundSterling size={20} className="mb-1" />
                        <span className="text-[10px] font-bold">Spese</span>
                    </button>
                    <button onClick={() => setActiveTab("transport")} className={`flex flex-col items-center p-2 rounded-xl transition-all ${activeTab === 'transport' ? 'text-red-600 bg-red-50' : 'text-gray-400 hover:text-gray-600'}`}>
                        <Train size={20} className="mb-1" />
                        <span className="text-[10px] font-bold">Mezzi</span>
                    </button>
                    <button onClick={() => setActiveTab("backpack")} className={`flex flex-col items-center p-2 rounded-xl transition-all ${activeTab === 'backpack' ? 'text-red-600 bg-red-50' : 'text-gray-400 hover:text-gray-600'}`}>
                        <Backpack size={20} className="mb-1" />
                        <span className="text-[10px] font-bold">Zaino</span>
                    </button>
                </div>
            </div>

        </div >
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
