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
const X = (props) => (<IconBase {...props}><path d="M18 6 6 18" /><path d="m6 6 18 12" /></IconBase>);

// --- DATI INIZIALI ---
const initialItinerary = [
    { id: 1, nome: "British Museum", categoria: "Museo", quartiere: "Bloomsbury", durata: "3 ore", orari: "10.00 - 17.15", eccezioni: "Ven: 20.30 (ult vis 19.15)", visited: false },
    { id: 2, nome: "Tate Britain", categoria: "Museo", quartiere: "Pimlico", durata: "2 ore", orari: "10.00 - 18.00", eccezioni: "", visited: false },
    { id: 3, nome: "V&A Museum", categoria: "Museo", quartiere: "South Kensington", durata: "2.5 ore", orari: "10.00 - 17.45", eccezioni: "Ven: 22.00", visited: false },
    { id: 4, nome: "Museo di Storia Naturale", categoria: "Museo", quartiere: "South Kensington", durata: "2 ore", orari: "10.00 - 17.50", eccezioni: "ult vis 17.30", visited: false },
    { id: 5, nome: "Westminster Abbey", categoria: "Museo", quartiere: "Westminster", durata: "2 ore", orari: "9.30 - 15.30", eccezioni: "Sab: 9.00 - 15.30 + £5.00 Queen's Galleries", visited: false },
    { id: 6, nome: "Palace of Westminster", categoria: "Museo", quartiere: "Westminster", durata: "2 ore", orari: "9.00 - 18.15", eccezioni: "Aperto solo il Sabato", visited: false },
    { id: 7, nome: "Buckingham Palace", categoria: "Museo", quartiere: "Westminster", durata: "1 ora", orari: "Cambio guardia 11.00", eccezioni: "Ven e Dom", visited: false },
    { id: 8, nome: "Tower Bridge", categoria: "Museo", quartiere: "Southwark", durata: "2 ore", orari: "9.30 - 18.00", eccezioni: "ult vis 17.00", visited: false },
    { id: 9, nome: "Torre di Londra", categoria: "Museo", quartiere: "Tower Hill", durata: "2.5 ore", orari: "09.00 - 16.30", eccezioni: "ult vis 15.30", visited: false },
    { id: 10, nome: "London Eye", categoria: "Museo", quartiere: "Lambeth", durata: "30 min", orari: "11.00 - 18.00", eccezioni: "Sab-Dom: 10.00 - 20.30", visited: false },
    { id: 11, nome: "Madame Tussauds", categoria: "Museo", quartiere: "Marylebone", durata: "2 ore", orari: "10.00 - 15.00", eccezioni: "", visited: false },
    { id: 12, nome: "SEA LIFE London Aquarium", categoria: "Museo", quartiere: "Lambeth", durata: "3 ore", orari: "10.00 - 19.00", eccezioni: "", visited: false },
    { id: 13, nome: "Tate Modern", categoria: "Museo", quartiere: "Bankside", durata: "2 ore", orari: "10.00 - 18.00", eccezioni: "", visited: false },
    { id: 14, nome: "National Gallery", categoria: "Museo", quartiere: "Charing Cross", durata: "3 ore", orari: "10.00 - 18.00", eccezioni: "Ven: 21.00", visited: false },
    { id: 15, nome: "Kensington Palace", categoria: "Museo", quartiere: "Kensington", durata: "3 ore", orari: "10.00 - 16.00", eccezioni: "ult vis 15.00", visited: false },
    { id: 16, nome: "St. Paul's Cathedral", categoria: "Museo", quartiere: "Kensington", durata: "2 ore", orari: "08.00 - 16.30", eccezioni: "ult vis 16.00", visited: false },
    { id: 17, nome: "Sky Garden", categoria: "Grattacielo", quartiere: "City of London", durata: "1.5 ore", orari: "10.00 - 18.00", eccezioni: "Sab-Dom: 11-21", visited: false },
    { id: 18, nome: "The Shard", categoria: "Grattacielo", quartiere: "City of London", durata: "1.5 ore", orari: "11.00 - 19.00", eccezioni: "Sab: 10-22", visited: false },
    { id: 19, nome: "Portobello Market", categoria: "Mercato", quartiere: "Notting Hill", durata: "2.5 ore", orari: "9.00 - 18.00", eccezioni: "Sab fino 19.00", visited: false },
    { id: 20, nome: "Brick Lane Market", categoria: "Mercato", quartiere: "Shoreditch", durata: "4 ore", orari: "11.00 - 18.30", eccezioni: "Dom: 10-18", visited: false },
    { id: 21, nome: "Borough Market", categoria: "Mercato", quartiere: "Southwark", durata: "3 ore", orari: "10.00 - 17.00", eccezioni: "Sab: 9-16, Dom: 10-16", visited: false },
    { id: 22, nome: "Camden Market", categoria: "Mercato", quartiere: "Camden Town", durata: "3 ore", orari: "10.00 - 18.00", eccezioni: "Food fino 23", visited: false },
    { id: 23, nome: "Hyde Park", categoria: "Parco", quartiere: "Westminster", durata: "2 ore", orari: "Sempre aperto", eccezioni: "", visited: false },
    { id: 24, nome: "Kensington Gardens", categoria: "Parco", quartiere: "Kensington", durata: "2 ore", orari: "Sempre aperto", eccezioni: "", visited: false },
    { id: 25, nome: "Regent's Park", categoria: "Parco", quartiere: "Marylebone", durata: "2.5 ore", orari: "Sempre aperto", eccezioni: "", visited: false },
    { id: 26, nome: "Duck World", categoria: "Tempo libero", quartiere: "London Bridge", durata: "40 min", orari: "10.00 - 22.00", eccezioni: "", visited: false },
    { id: 27, nome: "Hard Rock Cafe", categoria: "Ristorante", quartiere: "Mayfair", durata: "2 ore", orari: "09.00 - 22.00", eccezioni: "Ven-Sab: 09.00 - 23.00", visited: false },
    { id: 28, nome: "LEGO® Store", categoria: "Tempo libero", quartiere: "Leicester Square", durata: "1.5 ore", orari: "10.00 - 22.00", eccezioni: "Dom: 12.00 - 18.00", visited: false },
    { id: 29, nome: "Trafalgar Square", categoria: "Piazza", quartiere: "Charing Cross", durata: "30 min", orari: "Sempre aperto", eccezioni: "", visited: false },
    { id: 30, nome: "Big Ben", categoria: "Museo", quartiere: "Westminster", durata: "15 min", orari: "Sempre aperto", eccezioni: "", visited: false },
    { id: 31, nome: "Piccadilly Circus", categoria: "Piazza", quartiere: "West End", durata: "1 ora", orari: "Sempre aperto", eccezioni: "", visited: false },
    { id: 32, nome: "The Holland", categoria: "Ristorante", quartiere: "Kensington", durata: "2 ore", orari: "12.00 - 23.00", eccezioni: "Dom: 12-18, Lun-Mar: 16-22", visited: false },
    { id: 33, nome: "City of London", categoria: "Piazza", quartiere: "City of London", durata: "2 ore", orari: "Sempre aperto", eccezioni: "", visited: false },
    { id: 34, nome: "The Mitre", categoria: "Ristorante", quartiere: "Bayswater", durata: "2 ore", orari: "11.00 - 23.00", eccezioni: "Dom: 11.00 - 22.30", visited: false },
    { id: 35, nome: "King's Cross", categoria: "Tempo libero", quartiere: "King's Cross", durata: "30 min", orari: "05.00 - 01.36", eccezioni: "Foto binario 9 3/4: 9-21 (Sab)", visited: false },
];

const initialTransport = [
    { id: 1, partenza: "London Gatwick (LGW)", arrivo: "NOX Kensington", dettaglio: "Southern Train", data: "25/02/2026", ora: "19:15", costo: "£ 33.00", stato: "Da prenotare" }
];

const initialExpenses = [
    { id: 1, item: "Volo MXP -> LGW", data: "25/02/2026", costo: 59.96, valuta: "€", stato: "Saldato", chi: "Andrea", note: "Prenotato" },
    { id: 2, item: "Volo LGW -> MXP", data: "01/03/2026", costo: 65.80, valuta: "€", stato: "Saldato", chi: "Andrea", note: "Prenotato" },
    { id: 3, item: "Hotel NOX Kensington", data: "25/02/2026", costo: 464.55, valuta: "€", stato: "Saldato", chi: "Andrea", note: "Prenotato" },
    { id: 4, item: "Palazzo di Westminster", data: "-", costo: 40.00, valuta: "£", stato: "Da saldare", chi: "-", note: "£20 a testa" },
    { id: 5, item: "British Museum", data: "-", costo: 0, valuta: "£", stato: "Da prenotare", chi: "-", note: "Prenotare" },
    { id: 6, item: "V&A Museum", data: "-", costo: 0, valuta: "£", stato: "Da prenotare", chi: "-", note: "Prenotare" },
    { id: 7, item: "Museo di storia naturale", data: "-", costo: 0, valuta: "£", stato: "Da prenotare", chi: "-", note: "Prenotare" },
    { id: 8, item: "Westminster Abbey", data: "-", costo: 56.00, valuta: "£", stato: "Da saldare", chi: "-", note: "£28 a testa" },
    { id: 9, item: "Tower Bridge", data: "-", costo: 19.20, valuta: "£", stato: "Da saldare", chi: "-", note: "£9.60 a testa" },
    { id: 10, item: "Torre di Londra", data: "-", costo: 57.00, valuta: "£", stato: "Da saldare", chi: "-", note: "£28.50 a testa" },
    { id: 11, item: "London Eye", data: "-", costo: 58.00, valuta: "£", stato: "Da saldare", chi: "-", note: "£29.00 a testa" },
    { id: 12, item: "Madame Tussauds", data: "-", costo: 58.00, valuta: "£", stato: "Da saldare", chi: "-", note: "£29.00 a testa" },
    { id: 13, item: "Sea Life Aquarium", data: "-", costo: 58.00, valuta: "£", stato: "Da saldare", chi: "-", note: "£29.00 a testa" },
    { id: 14, item: "Tate Modern", data: "-", costo: 0, valuta: "£", stato: "Da prenotare", chi: "-", note: "Gratis" },
    { id: 15, item: "National Gallery", data: "-", costo: 0, valuta: "£", stato: "Da prenotare", chi: "-", note: "Gratis" },
    { id: 16, item: "Kensington Palace", data: "-", costo: 33.00, valuta: "£", stato: "Da saldare", chi: "-", note: "£16.50 a testa" },
    { id: 17, item: "Sky Garden", data: "-", costo: 0, valuta: "£", stato: "Da prenotare", chi: "-", note: "Gratis" },
    { id: 18, item: "The Shard", data: "-", costo: 38.00, valuta: "£", stato: "Da saldare", chi: "-", note: "£19.00 a testa" },
    { id: 19, item: "St. Paul's Cathedral", data: "-", costo: 54.00, valuta: "£", stato: "Da saldare", chi: "-", note: "£27.00 a testa" },
];

// --- COMPONENTS ---

const Card = ({ children, className = "" }) => (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-4 ${className}`}>
        {children}
    </div>
);

const Badge = ({ children, type }) => {
    let classes = "bg-gray-100 text-gray-600";
    if (type === "Museo") classes = "bg-blue-100 text-blue-700";
    if (type === "Mercato") classes = "bg-orange-100 text-orange-700";
    if (type === "Parco") classes = "bg-green-100 text-green-700";
    if (type === "Grattacielo") classes = "bg-purple-100 text-purple-700";
    if (type === "Saldato") classes = "bg-green-100 text-green-700";
    if (type === "Da saldare" || type === "Da prenotare") classes = "bg-red-100 text-red-700";
    if (type === "Gratis") classes = "bg-teal-100 text-teal-700";

    return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${classes}`}>{children}</span>;
};

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl overflow-hidden animate-[fade-in_0.2s_ease-out]">
                <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="font-bold text-gray-800">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200 transition-colors">
                        <X size={20} />
                    </button>
                </div>
                <div className="p-4 max-h-[70vh] overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    );
};

const InputGroup = ({ label, children }) => (
    <div className="mb-3">
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">{label}</label>
        {children}
    </div>
);

const App = () => {
    const [activeTab, setActiveTab] = useState("itinerary");
    const [itinerary, setItinerary] = useState(initialItinerary);
    const [transport, setTransport] = useState(initialTransport);
    const [expenses, setExpenses] = useState(initialExpenses);

    // Modal States
    const [activeModal, setActiveModal] = useState(null); // 'itinerary', 'transport', 'expense', null

    // New Item States
    const [newItemItinerary, setNewItemItinerary] = useState({ nome: "", categoria: "Museo", quartiere: "", durata: "", orari: "", eccezioni: "" });
    const [newItemTransport, setNewItemTransport] = useState({ dettaglio: "", partenza: "", arrivo: "", data: "", ora: "", costo: "", stato: "Da prenotare" });
    const [newItemExpense, setNewItemExpense] = useState({ item: "", costo: "", valuta: "£", stato: "Da saldare", chi: "", note: "" });

    // Filters
    const [filterCat, setFilterCat] = useState("Tutti");

    // Stats
    const totalSpent = expenses.filter(e => e.stato === "Saldato" && e.valuta === "€").reduce((acc, curr) => acc + Number(curr.costo), 0);
    const toPayPounds = expenses.filter(e => e.stato.includes("Da saldare") && e.valuta === "£").reduce((acc, curr) => acc + Number(curr.costo), 0);

    const toggleVisit = (id) => {
        setItinerary(itinerary.map(item => item.id === id ? { ...item, visited: !item.visited } : item));
    };

    const categories = ["Tutti", ...new Set(itinerary.map(i => i.categoria))];
    const filteredItinerary = filterCat === "Tutti" ? itinerary : itinerary.filter(i => i.categoria === filterCat);

    // Handlers per aggiungere items
    const handleAddItinerary = () => {
        if (!newItemItinerary.nome) return;
        setItinerary([...itinerary, { ...newItemItinerary, id: Date.now(), visited: false }]);
        setActiveModal(null);
        setNewItemItinerary({ nome: "", categoria: "Museo", quartiere: "", durata: "", orari: "", eccezioni: "" });
    };

    const handleAddTransport = () => {
        if (!newItemTransport.dettaglio) return;
        setTransport([...transport, { ...newItemTransport, id: Date.now() }]);
        setActiveModal(null);
        setNewItemTransport({ dettaglio: "", partenza: "", arrivo: "", data: "", ora: "", costo: "", stato: "Da prenotare" });
    };

    const handleAddExpense = () => {
        if (!newItemExpense.item) return;
        setExpenses([...expenses, { ...newItemExpense, costo: Number(newItemExpense.costo), id: Date.now() }]);
        setActiveModal(null);
        setNewItemExpense({ item: "", costo: "", valuta: "£", stato: "Da saldare", chi: "", note: "" });
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
                        25 Feb - 01 Mar
                    </div>
                </div>
                <p className="text-white/80 text-sm mt-1">Planner di viaggio collaborativo</p>
            </header>

            {/* Stats Cards (Floating) */}
            <div className="px-4 -mt-8 grid grid-cols-2 gap-3 mb-4">
                <Card className="flex flex-col items-center justify-center py-3">
                    <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">Speso (EUR)</span>
                    <span className="text-xl font-bold text-green-600">€ {totalSpent.toFixed(2)}</span>
                </Card>
                <Card className="flex flex-col items-center justify-center py-3">
                    <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">Da Pagare (GBP)</span>
                    <span className="text-xl font-bold text-red-500">£ {toPayPounds.toFixed(2)}</span>
                </Card>
            </div>

            {/* Navigation Tabs */}
            <div className="px-4 mb-4">
                <div className="flex bg-white rounded-lg p-1 shadow-sm border border-gray-200">
                    <button
                        onClick={() => setActiveTab("itinerary")}
                        className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'itinerary' ? 'bg-red-50 text-red-700' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Itinerario
                    </button>
                    <button
                        onClick={() => setActiveTab("transport")}
                        className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'transport' ? 'bg-red-50 text-red-700' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Trasporti
                    </button>
                    <button
                        onClick={() => setActiveTab("expenses")}
                        className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'expenses' ? 'bg-red-50 text-red-700' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Spese
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 px-4 pb-20 overflow-y-auto scroller">

                {/* ITINERARY TAB */}
                {activeTab === "itinerary" && (
                    <div className="space-y-4">
                        {/* Filters */}
                        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setFilterCat(cat)}
                                    className={`px-3 py-1 rounded-full text-xs whitespace-nowrap border ${filterCat === cat ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-600 border-gray-300'}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        {/* List */}
                        {filteredItinerary.map(place => (
                            <Card key={place.id} className="relative overflow-hidden transition-all hover:shadow-md">
                                {place.visited && <div className="absolute inset-0 bg-white/80 z-10 flex items-center justify-center backdrop-blur-[1px]"><div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1"><CheckCircle size={16} /> Visitato</div></div>}

                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-bold text-gray-800">{place.nome}</h3>
                                            <Badge type={place.categoria}>{place.categoria}</Badge>
                                        </div>
                                        <p className="text-xs text-gray-500 flex items-center gap-1">
                                            <MapPin size={12} /> {place.quartiere}
                                        </p>
                                    </div>
                                    <button onClick={() => toggleVisit(place.id)} className="text-gray-300 hover:text-green-600 transition-colors">
                                        <CheckCircle size={24} />
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-2 text-sm mt-3 bg-gray-50 p-2 rounded-lg">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-gray-400 uppercase font-bold">Orari</span>
                                        <span className="font-medium text-gray-700">{place.orari}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-gray-400 uppercase font-bold">Durata</span>
                                        <span className="font-medium text-gray-700">{place.durata}</span>
                                    </div>
                                    {place.eccezioni && (
                                        <div className="col-span-2 border-t border-gray-200 pt-1 mt-1">
                                            <span className="text-[10px] text-red-500 font-bold flex items-center gap-1">
                                                <AlertCircle size={10} /> Note: {place.eccezioni}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        ))}
                        <button onClick={() => setActiveModal('itinerary')} className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-400 font-medium hover:border-gray-400 hover:text-gray-500 transition-colors flex items-center justify-center gap-2">
                            <Plus size={18} /> Aggiungi Attrazione
                        </button>
                    </div>
                )}

                {/* TRANSPORT TAB */}
                {activeTab === "transport" && (
                    <div className="space-y-4">
                        {transport.map(trip => (
                            <Card key={trip.id} className="border-l-4 border-l-blue-500">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-2 text-blue-700 font-medium">
                                        <Train size={18} />
                                        <span>{trip.dettaglio}</span>
                                    </div>
                                    <Badge type={trip.stato}>{trip.stato}</Badge>
                                </div>

                                <div className="flex items-center gap-3 mb-4">
                                    <div className="text-center min-w-[60px]">
                                        <div className="text-lg font-bold text-gray-800">{trip.ora}</div>
                                        <div className="text-xs text-gray-500">{trip.data.split('/')[0]} Feb</div>
                                    </div>
                                    <div className="flex-1 flex flex-col gap-1 border-l-2 border-gray-100 pl-3">
                                        <div className="text-sm font-semibold">{trip.partenza}</div>
                                        <div className="text-xs text-gray-400">↓</div>
                                        <div className="text-sm font-semibold">{trip.arrivo}</div>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                                    <span className="text-xs text-gray-500">Costo Totale</span>
                                    <span className="font-bold text-gray-800">{trip.costo}</span>
                                </div>
                            </Card>
                        ))}
                        <button onClick={() => setActiveModal('transport')} className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-400 font-medium hover:border-gray-400 hover:text-gray-500 transition-colors flex items-center justify-center gap-2">
                            <Plus size={18} /> Aggiungi Viaggio
                        </button>
                    </div>
                )}

                {/* EXPENSES TAB */}
                {activeTab === "expenses" && (
                    <div className="space-y-3">
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 text-gray-500 border-b border-gray-100">
                                    <tr>
                                        <th className="px-4 py-3 font-medium">Spesa</th>
                                        <th className="px-4 py-3 font-medium text-right">Costo</th>
                                        <th className="px-4 py-3 font-medium text-center">Stato</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {expenses.map(exp => (
                                        <tr key={exp.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3">
                                                <div className="font-medium text-gray-800">{exp.item}</div>
                                                <div className="text-xs text-gray-400">{exp.chi !== "-" ? `Pagato da ${exp.chi}` : exp.note}</div>
                                            </td>
                                            <td className="px-4 py-3 text-right font-mono text-gray-700">
                                                {exp.valuta} {exp.costo.toFixed(2)}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <span className={`inline-block w-2 h-2 rounded-full ${exp.stato === 'Saldato' ? 'bg-green-500' : (exp.stato === 'Gratis' ? 'bg-teal-400' : 'bg-red-500')}`}></span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <button onClick={() => setActiveModal('expenses')} className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-400 font-medium hover:border-gray-400 hover:text-gray-500 transition-colors flex items-center justify-center gap-2">
                            <Plus size={18} /> Aggiungi Spesa
                        </button>

                        <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
                            <p className="font-bold mb-1">💡 Riepilogo Budget</p>
                            <ul className="list-disc pl-4 space-y-1 opacity-90">
                                <li>Le attrazioni segnate come "Gratis" richiedono comunque prenotazione.</li>
                                <li>I costi in sterline (£) sono stimati e potrebbero variare col cambio.</li>
                            </ul>
                        </div>
                    </div>
                )}
            </div>

            {/* MODALS */}

            {/* Add Itinerary Modal */}
            <Modal isOpen={activeModal === 'itinerary'} onClose={() => setActiveModal(null)} title="Nuova Attrazione">
                <InputGroup label="Nome">
                    <input type="text" className="w-full border rounded-lg p-2 text-sm" placeholder="Es. London Eye" value={newItemItinerary.nome} onChange={e => setNewItemItinerary({ ...newItemItinerary, nome: e.target.value })} />
                </InputGroup>
                <InputGroup label="Categoria">
                    <select className="w-full border rounded-lg p-2 text-sm bg-white" value={newItemItinerary.categoria} onChange={e => setNewItemItinerary({ ...newItemItinerary, categoria: e.target.value })}>
                        <option>Museo</option>
                        <option>Mercato</option>
                        <option>Parco</option>
                        <option>Grattacielo</option>
                        <option>Altro</option>
                    </select>
                </InputGroup>
                <InputGroup label="Quartiere">
                    <input type="text" className="w-full border rounded-lg p-2 text-sm" placeholder="Es. Westminster" value={newItemItinerary.quartiere} onChange={e => setNewItemItinerary({ ...newItemItinerary, quartiere: e.target.value })} />
                </InputGroup>
                <div className="grid grid-cols-2 gap-2">
                    <InputGroup label="Durata">
                        <input type="text" className="w-full border rounded-lg p-2 text-sm" placeholder="Es. 2 ore" value={newItemItinerary.durata} onChange={e => setNewItemItinerary({ ...newItemItinerary, durata: e.target.value })} />
                    </InputGroup>
                    <InputGroup label="Orari">
                        <input type="text" className="w-full border rounded-lg p-2 text-sm" placeholder="Es. 10:00 - 18:00" value={newItemItinerary.orari} onChange={e => setNewItemItinerary({ ...newItemItinerary, orari: e.target.value })} />
                    </InputGroup>
                </div>
                <InputGroup label="Note / Eccezioni">
                    <input type="text" className="w-full border rounded-lg p-2 text-sm" placeholder="Es. Chiuso lunedì" value={newItemItinerary.eccezioni} onChange={e => setNewItemItinerary({ ...newItemItinerary, eccezioni: e.target.value })} />
                </InputGroup>
                <button onClick={handleAddItinerary} className="w-full bg-black text-white py-3 rounded-lg font-bold text-sm mt-2 hover:bg-gray-800">Salva Attrazione</button>
            </Modal>

            {/* Add Transport Modal */}
            <Modal isOpen={activeModal === 'transport'} onClose={() => setActiveModal(null)} title="Nuovo Spostamento">
                <InputGroup label="Mezzo">
                    <input type="text" className="w-full border rounded-lg p-2 text-sm" placeholder="Es. National Express, Uber" value={newItemTransport.dettaglio} onChange={e => setNewItemTransport({ ...newItemTransport, dettaglio: e.target.value })} />
                </InputGroup>
                <div className="grid grid-cols-2 gap-2">
                    <InputGroup label="Partenza">
                        <input type="text" className="w-full border rounded-lg p-2 text-sm" placeholder="Da..." value={newItemTransport.partenza} onChange={e => setNewItemTransport({ ...newItemTransport, partenza: e.target.value })} />
                    </InputGroup>
                    <InputGroup label="Arrivo">
                        <input type="text" className="w-full border rounded-lg p-2 text-sm" placeholder="A..." value={newItemTransport.arrivo} onChange={e => setNewItemTransport({ ...newItemTransport, arrivo: e.target.value })} />
                    </InputGroup>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <InputGroup label="Data">
                        <input type="text" className="w-full border rounded-lg p-2 text-sm" placeholder="25/02" value={newItemTransport.data} onChange={e => setNewItemTransport({ ...newItemTransport, data: e.target.value })} />
                    </InputGroup>
                    <InputGroup label="Ora">
                        <input type="text" className="w-full border rounded-lg p-2 text-sm" placeholder="14:00" value={newItemTransport.ora} onChange={e => setNewItemTransport({ ...newItemTransport, ora: e.target.value })} />
                    </InputGroup>
                </div>
                <InputGroup label="Costo Stimato">
                    <input type="text" className="w-full border rounded-lg p-2 text-sm" placeholder="£ 10.00" value={newItemTransport.costo} onChange={e => setNewItemTransport({ ...newItemTransport, costo: e.target.value })} />
                </InputGroup>
                <button onClick={handleAddTransport} className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold text-sm mt-2 hover:bg-blue-700">Salva Viaggio</button>
            </Modal>

            {/* Add Expense Modal */}
            <Modal isOpen={activeModal === 'expenses'} onClose={() => setActiveModal(null)} title="Nuova Spesa">
                <InputGroup label="Oggetto">
                    <input type="text" className="w-full border rounded-lg p-2 text-sm" placeholder="Es. Cena pub" value={newItemExpense.item} onChange={e => setNewItemExpense({ ...newItemExpense, item: e.target.value })} />
                </InputGroup>
                <div className="grid grid-cols-2 gap-2">
                    <InputGroup label="Importo">
                        <input type="number" className="w-full border rounded-lg p-2 text-sm" placeholder="0.00" value={newItemExpense.costo} onChange={e => setNewItemExpense({ ...newItemExpense, costo: e.target.value })} />
                    </InputGroup>
                    <InputGroup label="Valuta">
                        <select className="w-full border rounded-lg p-2 text-sm bg-white" value={newItemExpense.valuta} onChange={e => setNewItemExpense({ ...newItemExpense, valuta: e.target.value })}>
                            <option value="£">Sterline (£)</option>
                            <option value="€">Euro (€)</option>
                        </select>
                    </InputGroup>
                </div>
                <InputGroup label="Stato Pagamento">
                    <select className="w-full border rounded-lg p-2 text-sm bg-white" value={newItemExpense.stato} onChange={e => setNewItemExpense({ ...newItemExpense, stato: e.target.value })}>
                        <option>Da saldare</option>
                        <option>Saldato</option>
                        <option>Gratis</option>
                    </select>
                </InputGroup>
                {newItemExpense.stato === 'Saldato' ? (
                    <InputGroup label="Chi ha pagato">
                        <input type="text" className="w-full border rounded-lg p-2 text-sm" placeholder="Es. Andrea" value={newItemExpense.chi} onChange={e => setNewItemExpense({ ...newItemExpense, chi: e.target.value })} />
                    </InputGroup>
                ) : (
                    <InputGroup label="Note">
                        <input type="text" className="w-full border rounded-lg p-2 text-sm" placeholder="Es. Da dividere" value={newItemExpense.note} onChange={e => setNewItemExpense({ ...newItemExpense, note: e.target.value })} />
                    </InputGroup>
                )}
                <button onClick={handleAddExpense} className="w-full bg-green-600 text-white py-3 rounded-lg font-bold text-sm mt-2 hover:bg-green-700">Salva Spesa</button>
            </Modal>


            {/* Footer Nav for Mobile */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden pb-safe">
                <div className="flex justify-around p-2">
                    <button onClick={() => setActiveTab("itinerary")} className={`flex flex-col items-center p-2 rounded-lg ${activeTab === 'itinerary' ? 'text-red-600 bg-red-50' : 'text-gray-400'}`}>
                        <MapPin size={20} />
                        <span className="text-[10px] mt-1">Itinerario</span>
                    </button>
                    <button onClick={() => setActiveTab("transport")} className={`flex flex-col items-center p-2 rounded-lg ${activeTab === 'transport' ? 'text-red-600 bg-red-50' : 'text-gray-400'}`}>
                        <Train size={20} />
                        <span className="text-[10px] mt-1">Mezzi</span>
                    </button>
                    <button onClick={() => setActiveTab("expenses")} className={`flex flex-col items-center p-2 rounded-lg ${activeTab === 'expenses' ? 'text-red-600 bg-red-50' : 'text-gray-400'}`}>
                        <PoundSterling size={20} />
                        <span className="text-[10px] mt-1">Spese</span>
                    </button>
                </div>
            </div>

        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
