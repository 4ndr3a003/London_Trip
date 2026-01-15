// --- DATI INIZIALI (SEED DATA) ---
window.seedItinerary = [
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

window.seedTransport = [
    { partenza: "London Gatwick (LGW)", arrivo: "NOX Kensington", dettaglio: "Southern Train", data: "25/02/2026", ora: "19:15", costo: "£ 33.00", pagato: false, prenotato: false }
];

window.seedBackpack = [
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

window.seedExpenses = [
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

window.seedDays = [
    {
        data: "2026-02-25",
        events: []
    }
];


window.defaultBackpackItems = [
];

