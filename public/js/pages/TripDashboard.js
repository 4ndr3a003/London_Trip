// Theme utility loaded globally

const TripDashboard = () => {
    const { useParams, useNavigate, useLocation } = window.ReactRouterDOM;
    // Lazy access to globals
    const {
        Card, Badge, Button, Modal, InputGroup, SegmentedControl,
        MapPin, Train, PoundSterling, Euro, DollarSign, CheckCircle, AlertCircle, Plus, X,
        Edit, Trash, User, Smartphone, Search, Minus, Calendar, Clock, Check, ArrowDown,
        Backpack, FileText, LinkIcon, RefreshCw, Hourglass, Star,
        BackpackTab, DocumentsTab, ThemeToggle,
        TicketScanner, TicketView, QrCode, Bus, Car, Plane, Ship
    } = window;

    const { tripId, tab } = useParams();
    const navigate = useNavigate();

    const activeTab = tab || "itinerary";
    const setActiveTab = (newTab) => navigate(`/trip/${tripId}/${newTab}`);

    // Page transition state
    const [isExiting, setIsExiting] = useState(false);

    const onBack = () => {
        setIsExiting(true);
        setTimeout(() => {
            navigate('/');
        }, 400); // Match exit animation duration
    };

    // State
    const [itinerary, setItinerary] = useState([]);
    const [days, setDays] = useState([]);
    const [transport, setTransport] = useState([]);
    const [expenses, setExpenses] = useState([]);

    const [tripDetails, setTripDetails] = useState({ title: "Londra 2026", dates: "25 Feb - 02 Mar", flag: "🇬🇧", color: "#000000", currencySymbol: "£", exchangeRate: 1.15 });
    const [themeMode, setThemeMode] = useState(localStorage.getItem('themeMode') || 'light');


    // Theme Effect
    // Theme Effect
    useEffect(() => {
        if (tripDetails.color) {
            applyTheme(tripDetails.color, themeMode);
        }
        localStorage.setItem('themeMode', themeMode);
    }, [tripDetails.color, themeMode]);

    const toggleTheme = () => {
        setThemeMode(prev => prev === 'light' ? 'dark' : 'light');
    };

    const [activeModal, setActiveModal] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [viewingItem, setViewingItem] = useState(null);
    const [viewingTicket, setViewingTicket] = useState(null); // Transport object with ticket data
    const [isScanning, setIsScanning] = useState(false);
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: "", message: "", onConfirm: null });

    // Modals Data
    const [newItemItinerary, setNewItemItinerary] = useState({ nome: "", categoria: "Museo", quartiere: "", durata: "", orari: "", eccezioni: "", img: "", mapEmbed: "" });
    const [newItemDay, setNewItemDay] = useState({ data: "" });
    const [newItemEvent, setNewItemEvent] = useState({ type: 'attraction', attractionId: "", customTitle: "", time: "", notes: "" });
    const [newItemTransport, setNewItemTransport] = useState({ dettaglio: "", partenza: "", arrivo: "", data: "", ora: "", costo: "", pagato: false, prenotato: false, ticket: "" });
    const [newItemExpense, setNewItemExpense] = useState({ item: "", costo: "", valuta: "£", pagato: false, prenotato: false, chi: "", note: "" });
    const [newItemTripDetails, setNewItemTripDetails] = useState({ title: "", dates: "", flag: "" });

    // Filters
    const [placesViewMode, setPlacesViewMode] = useState("places");
    const [filterCat, setFilterCat] = useState("Tutti");
    const [filterStatusItinerary, setFilterStatusItinerary] = useState("Tutti");
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatusExpenses, setFilterStatusExpenses] = useState("Tutti");
    const [sortOrder, setSortOrder] = useState("alpha");
    const [eventSearch, setEventSearch] = useState("");

    const [deferredPrompt, setDeferredPrompt] = useState(null);

    // Helpers
    const getDBCollection = (collectionName) => db.collection("trips").doc(tripId).collection(collectionName);

    // Listeners
    useEffect(() => {
        setItinerary([]); setExpenses([]); setTransport([]); setDays([]);

        const unsubs = [
            getDBCollection("itinerary").onSnapshot(s => setItinerary(s.docs.map(d => ({ id: d.id, ...d.data() })))),
            getDBCollection("transport").onSnapshot(s => setTransport(s.docs.map(d => ({ id: d.id, ...d.data() })))),
            getDBCollection("expenses").onSnapshot(s => setExpenses(s.docs.map(d => ({ id: d.id, ...d.data() })))),
            getDBCollection("days").orderBy("data").onSnapshot(s => setDays(s.docs.map(d => ({ id: d.id, ...d.data() })))),
            db.collection("trips").doc(tripId).onSnapshot(d => { if (d.exists) setTripDetails(prev => ({ ...prev, ...d.data() })) })
        ];
        return () => unsubs.forEach(u => u());
    }, [tripId]);

    // PWA Install
    useEffect(() => {
        const handler = (e) => { e.preventDefault(); setDeferredPrompt(e); };
        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') setDeferredPrompt(null);
    };

    // Actions
    const requestConfirm = (title, message, onConfirm) => setConfirmModal({ isOpen: true, title, message, onConfirm });
    const handleConfirmAction = () => { if (confirmModal.onConfirm) confirmModal.onConfirm(); setConfirmModal({ ...confirmModal, isOpen: false }); };

    // Itinerary Handlers
    const handleAddItinerary = async () => {
        if (!newItemItinerary.nome) return;
        if (editingId) await getDBCollection("itinerary").doc(editingId).update(newItemItinerary);
        else await getDBCollection("itinerary").add({ ...newItemItinerary, visited: false });
        setActiveModal(null); setEditingId(null); setNewItemItinerary({ nome: "", categoria: "Museo", quartiere: "", durata: "", orari: "", eccezioni: "", img: "", mapEmbed: "" });
    };
    const handleDeleteItinerary = (id) => requestConfirm("Elimina Attrazione", "Sicuro?", async () => await getDBCollection("itinerary").doc(id).delete());
    const toggleVisit = (id, status) => { setItinerary(p => p.map(i => i.id === id ? { ...i, visited: !status } : i)); getDBCollection("itinerary").doc(id).update({ visited: !status }); };

    // Transport Handlers
    const handleAddTransport = async () => {
        if (!newItemTransport.dettaglio) return;
        if (editingId) await getDBCollection("transport").doc(editingId).update(newItemTransport);
        else await getDBCollection("transport").add(newItemTransport);
        setActiveModal(null); setEditingId(null); setNewItemTransport({ dettaglio: "", partenza: "", arrivo: "", data: "", ora: "", costo: "", pagato: false, prenotato: false, ticket: "" });
    };
    const handleDeleteTransport = (id) => requestConfirm("Elimina Spostamento", "Sicuro?", async () => await getDBCollection("transport").doc(id).delete());
    const toggleTransportPaid = (id, status) => getDBCollection("transport").doc(id).update({ pagato: !status });
    const toggleTransportBooked = (id, status) => getDBCollection("transport").doc(id).update({ prenotato: !status });

    // Expense Handlers
    const handleAddExpense = async () => {
        if (!newItemExpense.item) return;
        const data = { ...newItemExpense, costo: Number(newItemExpense.costo) };
        if (editingId) await getDBCollection("expenses").doc(editingId).update(data);
        else await getDBCollection("expenses").add(data);
        setActiveModal(null); setEditingId(null); setNewItemExpense({ item: "", costo: "", valuta: tripDetails.currencySymbol || "£", pagato: false, prenotato: false, chi: "", note: "" });
    };
    const handleDeleteExpense = (id) => requestConfirm("Elimina Spesa", "Sicuro?", async () => await getDBCollection("expenses").doc(id).delete());
    const togglePaid = (id, status) => getDBCollection("expenses").doc(id).update({ pagato: !status });
    const toggleBooked = (id, status) => getDBCollection("expenses").doc(id).update({ prenotato: !status });

    // Days & Events
    const handleAddDay = async () => {
        if (!newItemDay.data) return;
        await getDBCollection("days").add({ data: newItemDay.data, events: [] });
        setActiveModal(null); setNewItemDay({ data: "" });
    };
    const handleDeleteDay = (id) => requestConfirm("Elimina Giornata", "Sicuro?", async () => await getDBCollection("days").doc(id).delete());
    const handleAddEvent = async () => {
        if (!editingId) return;
        const dayDoc = days.find(d => d.id === editingId);

        let updatedEvents;
        if (newItemEvent.id) {
            // Edit existing event
            updatedEvents = dayDoc.events.map(e => e.id === newItemEvent.id ? newItemEvent : e);
        } else {
            // Add new event
            const newEventObj = { id: 'evt_' + Date.now(), ...newItemEvent };
            updatedEvents = [...(dayDoc.events || []), newEventObj];
        }

        updatedEvents.sort((a, b) => a.time.localeCompare(b.time));
        await getDBCollection("days").doc(editingId).update({ events: updatedEvents });
        setActiveModal(null); setEditingId(null); setNewItemEvent({ type: 'attraction', attractionId: "", customTitle: "", time: "", notes: "" });
    };
    const handleDeleteEvent = async (dayId, eventId) => {
        const dayDoc = days.find(d => d.id === dayId);
        const updatedEvents = dayDoc.events.filter(e => e.id !== eventId);
        await getDBCollection("days").doc(dayId).update({ events: updatedEvents });
    };

    // Trip Details
    const handleUpdateTripDetails = async () => {
        if (!newItemTripDetails.title) return;
        await db.collection("trips").doc(tripId).update(newItemTripDetails);
        setTripDetails(p => ({ ...p, ...newItemTripDetails }));
        setActiveModal(null);
    };

    // Derived State
    const TRIP_CURRENCY = tripDetails.currencySymbol || "£";
    const EXCHANGE_RATE = parseFloat(tripDetails.exchangeRate) || 1.15;
    const parseCost = (costStr) => {
        if (!costStr) return { amount: 0, currency: TRIP_CURRENCY };
        const currency = costStr.includes("€") ? "€" : TRIP_CURRENCY;
        const amount = parseFloat(costStr.replace(/[^0-9.]/g, "")) || 0;
        return { amount, currency };
    };
    const paidEUR = expenses.filter(e => e.valuta === "€" && e.pagato).reduce((acc, curr) => acc + Number(curr.costo), 0)
        + transport.filter(t => t.pagato).reduce((acc, curr) => { const { amount, currency } = parseCost(curr.costo); return currency === "€" ? acc + amount : acc; }, 0);
    const paidForeign = expenses.filter(e => e.valuta === TRIP_CURRENCY && e.pagato).reduce((acc, curr) => acc + Number(curr.costo), 0)
        + transport.filter(t => t.pagato).reduce((acc, curr) => { const { amount, currency } = parseCost(curr.costo); return currency === TRIP_CURRENCY ? acc + amount : acc; }, 0);
    const totalPaidEUR = paidEUR + (paidForeign * EXCHANGE_RATE);
    const toPayForeign = expenses.filter(e => e.valuta === TRIP_CURRENCY && !e.pagato).reduce((acc, curr) => acc + Number(curr.costo), 0)
        + transport.filter(t => !t.pagato).reduce((acc, curr) => { const { amount, currency } = parseCost(curr.costo); return currency === TRIP_CURRENCY ? acc + amount : acc; }, 0);

    const participantCount = tripDetails.participants?.length || 2;

    const categories = ["Tutti", ...new Set(itinerary.map(i => i.categoria))];
    const filteredItinerary = useMemo(() => {
        let result = itinerary.filter(i => {
            const matchCat = filterCat === "Tutti" || i.categoria === filterCat;
            const matchStatus = filterStatusItinerary === "Tutti" ? true : filterStatusItinerary === "Visitati" ? i.visited : !i.visited;
            const matchSearch = i.nome.toLowerCase().includes(searchQuery.toLowerCase());
            return matchCat && matchStatus && matchSearch;
        });
        if (sortOrder === "alpha") result.sort((a, b) => a.nome.localeCompare(b.nome));
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
        if (sortOrder === "alpha") result.sort((a, b) => a.item.localeCompare(b.item));
        return result;
    }, [expenses, filterStatusExpenses, sortOrder]);

    const colors = [
        { hex: "#000000", name: "Nero" },
        { hex: "#dc2626", name: "Rosso" },
        { hex: "#2563eb", name: "Blu" },
        { hex: "#16a34a", name: "Verde" },
        { hex: "#d97706", name: "Arancione" },
        { hex: "#9333ea", name: "Viola" },
        { hex: "#db2777", name: "Rosa" },
        { hex: "#0891b2", name: "Ciano" },
        { hex: "#EAB308", name: "Giallo" },
        { hex: "#4F46E5", name: "Indaco" },
        { hex: "#84CC16", name: "Lime" },
        { hex: "#0D9488", name: "Ottanio" },
        { hex: "#64748B", name: "Grigio Blu" },
        { hex: "#795548", name: "Marrone" }
    ];

    const getTransportIcon = (name) => {
        if (!name) return Train;
        const n = name.toLowerCase();
        if (n.includes('volo') || n.includes('aereo') || n.includes('flight') || n.includes('stansted') || n.includes('gatwick') || n.includes('heathrow') || n.includes('luton')) return Plane;
        if (n.includes('bus') || n.includes('pullman') || n.includes('coach') || n.includes('shuttle') || n.includes('national express')) return Bus;
        if (n.includes('auto') || n.includes('taxi') || n.includes('uber') || n.includes('car')) return Car;
        if (n.includes('nave') || n.includes('traghetto') || n.includes('battello') || n.includes('boat') || n.includes('ferry') || n.includes('thames')) return Ship;
        return Train;
    };

    return (
        <>
            <div className={`dashboard-container page-transition-wrapper ${isExiting ? 'page-exit' : 'page-enter'}`} style={{ background: `linear-gradient(180deg, var(--md-sys-color-primary-container) 0%, var(--md-sys-color-surface) 35%)` }}>
                {/* Expressive Header - Balanced Layout */}
                <header className="pt-6 pb-4 px-6">
                    <div className="flex justify-between items-start">
                        {/* Left: Back Button + Install */}
                        <div className="flex flex-col items-start gap-2">
                            <div onClick={onBack} className="w-12 h-12 rounded-full flex items-center justify-center cursor-pointer text-[var(--md-sys-color-primary)] hover:bg-[var(--md-sys-color-primary)]/10 transition-colors active:scale-95">
                                <ArrowDown size={28} />
                            </div>
                            <ThemeToggle mode={themeMode} onToggle={toggleTheme} />
                            {deferredPrompt && (
                                <button onClick={(e) => { e.stopPropagation(); handleInstallClick(); }} className="bg-[var(--md-sys-color-primary)] text-[var(--md-sys-color-on-primary)] px-4 py-2 rounded-full font-bold text-sm shadow-lg flex items-center gap-2">
                                    <Smartphone size={16} /> <span>Installa</span>
                                </button>
                            )}
                        </div>

                        {/* Right: Trip Info */}
                        <div className="flex flex-col items-end text-right cursor-pointer" onClick={() => { setNewItemTripDetails(tripDetails); setActiveModal('tripDetails'); }}>
                            <span className="text-4xl hover:scale-110 transition-transform mb-1">{tripDetails.flag}</span>
                            <h1 className="headline-large leading-tight text-[var(--md-sys-color-primary)] font-bold">
                                {tripDetails.title}
                            </h1>
                            <span className="label-large uppercase tracking-widest text-[var(--md-sys-color-on-primary-container)] opacity-70 mt-1">{tripDetails.dates}</span>
                        </div>
                    </div>
                </header>

                {/* Content Area - Rounded Top with Shadow Separator */}
                <div className="flex-1 bg-[var(--md-sys-color-surface-container)] rounded-t-[32px] overflow-hidden flex flex-col shadow-[0_-8px_30px_rgba(0,0,0,0.08)] relative z-0">
                    {/* Desktop Nav removed or redundant for mobile-first view? Keeping it if needed but hiding for now or simplifying */}
                    {/* We rely on Bottom Nav for mobile. */}

                    <div className="p-4 flex-1 overflow-y-auto scroller pb-24 space-y-4 pt-6">
                        {activeTab === "attractions" && (
                            <div className="space-y-4">

                                {/* Top Layout: View Toggle with sliding pill */}
                                <SegmentedControl
                                    options={["places", "transport"]}
                                    value={placesViewMode}
                                    onChange={setPlacesViewMode}
                                    size="large"
                                    renderLabel={(option, isActive) => (
                                        <>
                                            {option === "places" ? <MapPin size={18} /> : <Train size={18} />}
                                            {option === "places" ? "LUOGHI" : "MEZZI"}
                                        </>
                                    )}
                                />

                                {placesViewMode === "places" && (
                                    <div className="flex flex-col gap-3">
                                        {/* Filter Chips Row 1 - Status + A-Z */}
                                        <div className="flex justify-between items-center gap-2 py-1">
                                            <SegmentedControl
                                                options={["Tutti", "Da Visitare", "Visitati"]}
                                                value={filterStatusItinerary}
                                                onChange={setFilterStatusItinerary}
                                                className="flex-1 mr-2"
                                            />
                                            <button
                                                onClick={() => setSortOrder(prev => prev === 'alpha' ? 'default' : 'alpha')}
                                                className={`p-2 rounded-full text-sm font-bold shrink-0 transition-colors ${sortOrder === 'alpha'
                                                    ? 'bg-[var(--md-sys-color-tertiary-container)] text-[var(--md-sys-color-on-tertiary-container)]'
                                                    : 'bg-[var(--md-sys-color-surface-container-high)] text-[var(--md-sys-color-on-surface-variant)] border border-[var(--md-sys-color-outline)]'
                                                    }`}
                                            >
                                                {sortOrder === 'alpha' ? 'A-Z' : 'Default'}
                                            </button>
                                        </div>

                                        {/* Search Bar - M3 Filled Tonal */}
                                        <div className="flex items-center gap-3 bg-[var(--md-sys-color-surface-container-high)] rounded-full px-4 py-3 transition-colors focus-within:bg-[var(--md-sys-color-surface-container-highest)]">
                                            <Search size={20} className="text-[var(--md-sys-color-on-surface-variant)]" />
                                            <input
                                                type="text"
                                                placeholder="Cerca attrazione..."
                                                className="bg-transparent border-none outline-none w-full text-base text-[var(--md-sys-color-on-surface)] placeholder:text-[var(--md-sys-color-on-surface-variant)]"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                            />
                                        </div>

                                        {/* Filter Chips Row 2 - Categories */}
                                        <div className="flex gap-2 overflow-x-auto scroller no-scrollbar pb-1">
                                            <button
                                                onClick={() => setFilterCat("Tutti")}
                                                className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all border ${filterCat === "Tutti"
                                                    ? 'bg-[var(--md-sys-color-secondary-container)] text-[var(--md-sys-color-on-secondary-container)] border-transparent'
                                                    : 'bg-[var(--md-sys-color-surface-container-high)] text-[var(--md-sys-color-on-surface-variant)] border-[var(--md-sys-color-outline)] hover:bg-[var(--md-sys-color-surface-container-highest)]'
                                                    }`}
                                            >
                                                Tutti
                                            </button>
                                            {categories.filter(c => c !== "Tutti").map(c => (
                                                <button
                                                    key={c}
                                                    onClick={() => setFilterCat(c)}
                                                    className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all border ${filterCat === c
                                                        ? 'bg-[var(--md-sys-color-secondary-container)] text-[var(--md-sys-color-on-secondary-container)] border-transparent'
                                                        : 'bg-[var(--md-sys-color-surface-container-high)] text-[var(--md-sys-color-on-surface-variant)] border-[var(--md-sys-color-outline)] hover:bg-[var(--md-sys-color-surface-container-highest)]'
                                                        }`}
                                                >
                                                    {filterCat === c && <Check size={14} className="inline mr-1" />}
                                                    {c}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {placesViewMode === "places" && (
                                    <div className="space-y-4">
                                        <Button onClick={() => { setEditingId(null); setNewItemItinerary({ nome: "", categoria: "Museo", quartiere: "", durata: "", orari: "", eccezioni: "", img: "", mapEmbed: "" }); setActiveModal('itinerary'); }} icon={Plus} className="w-full shadow-md">Aggiungi Attrazione</Button>
                                        {filteredItinerary.map(place => (
                                            <div key={place.id} className="relative group rounded-[28px] overflow-hidden bg-[var(--md-sys-color-surface-container-low)] shadow-sm transition-all hover:shadow-md mb-4">
                                                {/* Image Area - Taller and distinctive */}
                                                <div className="relative h-56 w-full" onClick={() => setViewingItem(place)}>
                                                    {place.img ? (
                                                        <img src={place.img} className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${place.visited ? 'grayscale opacity-50' : ''}`} />
                                                    ) : (
                                                        <div className={`w-full h-full flex items-center justify-center text-[var(--md-sys-color-on-surface-variant)] ${place.visited ? 'bg-[var(--md-sys-color-surface-variant)]' : 'bg-[var(--md-sys-color-surface-variant)]'}`}>
                                                            <MapPin size={48} className="opacity-20" />
                                                        </div>
                                                    )}

                                                    {/* Gradient Overlay */}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>

                                                    {/* Visited Badge Overlay */}
                                                    {place.visited && (
                                                        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                                                            <div className="bg-[#C4EED0]/90 backdrop-blur-sm border-2 border-[#07210F] text-[#07210F] px-6 py-2 rounded-full transform -rotate-12 shadow-xl">
                                                                <span className="text-xl font-black tracking-widest uppercase">Visitato</span>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Float Actions - Always Visible */}
                                                    <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); setNewItemItinerary(place); setEditingId(place.id); setActiveModal('itinerary'); }}
                                                            className="w-10 h-10 rounded-[12px] bg-[var(--md-sys-color-surface)] text-[var(--md-sys-color-on-surface)] flex items-center justify-center shadow-md active:scale-90 transition-transform"
                                                        >
                                                            <Edit size={18} />
                                                        </button>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleDeleteItinerary(place.id); }}
                                                            className="w-10 h-10 rounded-[12px] bg-[#FFDAD6] text-[#410002] flex items-center justify-center shadow-md active:scale-90 transition-transform"
                                                        >
                                                            <Trash size={18} />
                                                        </button>
                                                    </div>

                                                    {/* Title & Category on Image */}
                                                    <div className={`absolute bottom-4 left-4 right-4 z-10 pointer-events-none transition-opacity ${place.visited ? 'opacity-50' : 'opacity-100'}`}>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className={`backdrop-blur-md px-2 py-0.5 rounded-md text-xs font-bold uppercase tracking-wide border border-white/10 text-white bg-black/30`}>
                                                                {place.categoria}
                                                            </span>
                                                            {place.quartiere && <span className="text-white text-xs opacity-90 font-medium flex items-center gap-1"><MapPin size={10} /> {place.quartiere}</span>}
                                                        </div>
                                                        <h3 className="headline-small leading-tight font-bold text-white drop-shadow-sm">{place.nome}</h3>
                                                    </div>
                                                </div>

                                                {/* Info Bar */}
                                                <div className="p-4 flex justify-between items-center">
                                                    <div className="flex flex-wrap gap-2 text-[var(--md-sys-color-on-surface-variant)] text-sm font-medium">
                                                        {place.orari && <span className="flex items-center gap-1 bg-[var(--md-sys-color-surface)] px-3 py-1.5 rounded-full"><Clock size={14} /> {place.orari}</span>}
                                                        {place.durata && <span className="flex items-center gap-1 bg-[var(--md-sys-color-surface)] px-3 py-1.5 rounded-full"><Hourglass size={14} /> {place.durata}</span>}
                                                        {place.eccezioni && <span className="flex items-center gap-1 bg-amber-100 text-amber-700 px-3 py-1.5 rounded-full"><AlertCircle size={14} /> {place.eccezioni}</span>}
                                                    </div>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); toggleVisit(place.id, place.visited); }}
                                                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${place.visited ? 'bg-[#C4EED0] text-[#07210F]' : 'bg-[var(--md-sys-color-surface-variant)] text-[var(--md-sys-color-on-surface-variant)]'}`}
                                                    >
                                                        {place.visited ? <Check size={24} strokeWidth={3} /> : <CheckCircle size={24} className="opacity-50" />}
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {placesViewMode === "transport" && (
                                    <div className="space-y-4">
                                        <Button onClick={() => setActiveModal('transport')} icon={Plus} className="w-full shadow-md">Aggiungi Spostamento</Button>
                                        {transport.map(t => (
                                            <div key={t.id} className="relative bg-[var(--md-sys-color-surface-container)] rounded-[20px] p-0 overflow-hidden mb-4 shadow-sm border border-[var(--md-sys-color-outline-variant)]">
                                                {/* Header Stripe */}
                                                <div className="h-2 w-full bg-[var(--md-sys-color-primary)] opacity-80"></div>

                                                <div className="p-5" onClick={() => {
                                                    if (t.ticket) setViewingTicket(t);
                                                    else { setNewItemTransport(t); setEditingId(t.id); setActiveModal('transport'); }
                                                }}>
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-full bg-[var(--md-sys-color-secondary-container)] flex items-center justify-center text-[var(--md-sys-color-on-secondary-container)]">
                                                                {React.createElement(getTransportIcon(t.dettaglio), { size: 20 })}
                                                            </div>
                                                            <div>
                                                                <h3 className="title-medium font-bold text-[var(--md-sys-color-on-surface)]">{t.dettaglio}</h3>
                                                                <span className="label-small text-[var(--md-sys-color-on-surface-variant)] uppercase tracking-wider">{t.data} • {t.ora}</span>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                                                            {t.ticket && (
                                                                <button onClick={() => setViewingTicket(t)} className="p-2 text-[var(--md-sys-color-primary)] bg-[var(--md-sys-color-primary-container)] hover:shadow-md transition-all rounded-full mr-1">
                                                                    <QrCode size={18} />
                                                                </button>
                                                            )}
                                                            <button onClick={() => { setNewItemTransport(t); setEditingId(t.id); setActiveModal('transport'); }} className="p-2 text-[var(--md-sys-color-on-surface-variant)] hover:bg-[#F0F4F8] rounded-full"><Edit size={18} /></button>
                                                            <button onClick={() => handleDeleteTransport(t.id)} className="p-2 text-[var(--md-sys-color-on-surface-variant)] hover:bg-[#FFDAD6] hover:text-[#410002] rounded-full"><Trash size={18} /></button>
                                                        </div>
                                                    </div>

                                                    <div className="flex gap-4 items-center mb-5">
                                                        <div className="flex-1">
                                                            <div className="text-[15px] font-bold text-[var(--md-sys-color-on-surface)]">{t.partenza}</div>
                                                            <div className="h-4 border-l-2 border-dashed border-[#8E9193] ml-2 my-1"></div>
                                                            <div className="text-[15px] font-bold text-[var(--md-sys-color-on-surface)]">{t.arrivo}</div>
                                                        </div>
                                                        <div className="text-right">
                                                            <span className="headline-small font-bold text-[var(--md-sys-color-primary)]">{t.costo}</span>
                                                        </div>
                                                    </div>

                                                    <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                                                        <button onClick={() => toggleTransportBooked(t.id, t.prenotato)} className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-colors ${t.prenotato ? 'bg-[#E8DEF8] text-[#1D192B] border-transparent' : 'border-[var(--md-sys-color-outline)] text-[var(--md-sys-color-on-surface-variant)]'}`}>
                                                            {t.prenotato ? 'Prenotato' : 'Prenota'}
                                                        </button>
                                                        <button onClick={() => toggleTransportPaid(t.id, t.pagato)} className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-colors ${t.pagato ? 'bg-[#C4EED0] text-[#07210F] border-transparent' : 'border-[var(--md-sys-color-outline)] text-[var(--md-sys-color-on-surface-variant)]'}`}>
                                                            {t.pagato ? 'Pagato' : 'Paga'}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                        {activeTab === "expenses" && (
                            <div className="space-y-4">
                                {/* Moved Stats Here - Only for Expenses - Material 3 Expressive Complementary Shapes */}
                                <div className="grid grid-cols-2 gap-3">
                                    {/* GIÀ PAGATO - Left rounded shape */}
                                    <div className={`payment-card payment-card-paid relative overflow-hidden p-5 rounded-l-[32px] rounded-r-[12px] flex flex-col items-start gap-2 shadow-lg border-2 ${themeMode === 'dark' ? 'bg-green-900 border-green-700 text-green-100' : 'bg-gradient-to-br from-[#C4EED0] via-[#D8F5E0] to-[#E6F9EE] border-[#A3E4B5]/50 text-[#0A5C1F]'}`}>
                                        {/* Decorative background element */}
                                        <div className={`absolute -right-4 -top-4 w-20 h-20 rounded-full ${themeMode === 'dark' ? 'bg-green-800/20' : 'bg-[#0A5C1F]/5'}`}></div>
                                        <div className={`absolute -right-1 -bottom-1 w-12 h-12 rounded-full ${themeMode === 'dark' ? 'bg-green-800/30' : 'bg-[#0A5C1F]/8'}`}></div>
                                        {/* Icon */}
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${themeMode === 'dark' ? 'bg-green-800/50' : 'bg-[#0A5C1F]/15'}`}>
                                            <Check size={18} strokeWidth={3} className={themeMode === 'dark' ? 'text-green-200' : 'text-[#0A5C1F]'} />
                                        </div>
                                        <span className="label-medium font-bold uppercase tracking-wider opacity-80">Già Pagato</span>
                                        <span className="display-small font-black tracking-tight">€{Math.round(totalPaidEUR)}</span>
                                        <span className={`label-small font-semibold opacity-70 px-2 py-0.5 rounded-full ${themeMode === 'dark' ? 'bg-green-800/40' : 'bg-[#0A5C1F]/10'}`}>€{(totalPaidEUR / participantCount).toFixed(0)} /testa</span>
                                    </div>
                                    {/* PREVISTO - Right rounded shape */}
                                    <div className={`payment-card payment-card-due relative overflow-hidden p-5 rounded-r-[32px] rounded-l-[12px] flex flex-col items-end gap-2 shadow-lg border-2 ${themeMode === 'dark' ? 'bg-red-900 border-red-700 text-red-100' : 'bg-gradient-to-bl from-[#FECACA] via-[#FFD9D9] to-[#FFE8E8] border-[#FCA5A5]/50 text-[#991B1B]'}`}>
                                        {/* Decorative background element */}
                                        <div className={`absolute -left-4 -top-4 w-20 h-20 rounded-full ${themeMode === 'dark' ? 'bg-red-800/20' : 'bg-[#991B1B]/5'}`}></div>
                                        <div className={`absolute -left-1 -bottom-1 w-12 h-12 rounded-full ${themeMode === 'dark' ? 'bg-red-800/30' : 'bg-[#991B1B]/8'}`}></div>
                                        {/* Icon */}
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${themeMode === 'dark' ? 'bg-red-800/50' : 'bg-[#991B1B]/15'}`}>
                                            <Hourglass size={18} strokeWidth={2.5} className={themeMode === 'dark' ? 'text-red-200' : 'text-[#991B1B]'} />
                                        </div>
                                        <span className="label-medium font-bold uppercase tracking-wider opacity-80 text-right">Previsto</span>
                                        <span className="display-small font-black tracking-tight">{TRIP_CURRENCY}{Math.round(toPayForeign)}</span>
                                        <span className={`label-small font-semibold opacity-70 px-2 py-0.5 rounded-full ${themeMode === 'dark' ? 'bg-red-800/40' : 'bg-[#991B1B]/10'}`}>{TRIP_CURRENCY}{(toPayForeign / participantCount).toFixed(0)} /testa</span>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3 mb-4">
                                    <div className="flex justify-between items-center gap-2 py-1">
                                        <SegmentedControl
                                            options={["Tutti", "Da Pagare", "Pagati"]}
                                            value={filterStatusExpenses}
                                            onChange={setFilterStatusExpenses}
                                            className="flex-1 mr-2"
                                        />
                                        <button
                                            onClick={() => setSortOrder(prev => prev === 'alpha' ? 'default' : 'alpha')}
                                            className={`p-2 rounded-full text-sm font-bold shrink-0 transition-colors ${sortOrder === 'alpha'
                                                ? 'bg-[var(--md-sys-color-tertiary-container)] text-[var(--md-sys-color-on-tertiary-container)]'
                                                : 'bg-[var(--md-sys-color-surface-container-high)] text-[var(--md-sys-color-on-surface-variant)] border border-[var(--md-sys-color-outline)]'
                                                }`}
                                        >
                                            {sortOrder === 'alpha' ? 'A-Z' : 'Default'}
                                        </button>
                                    </div>
                                </div>

                                <Button onClick={() => { setNewItemExpense(prev => ({ ...prev, valuta: tripDetails.currencySymbol || "£" })); setActiveModal('expenses'); }} icon={Plus} className="w-full shadow-md">Aggiungi Spesa</Button>
                                {filteredExpenses.map(e => (
                                    <div key={e.id} className="bg-[var(--md-sys-color-surface-container-low)] rounded-[24px] p-4 flex items-center justify-between shadow-sm border border-[var(--md-sys-color-outline-variant)]">
                                        <div className="flex items-center gap-4 flex-1">
                                            <div className={`w-12 h-12 rounded-[16px] flex items-center justify-center text-xl font-bold ${e.valuta === '€' ? 'bg-[#E6F4EA] text-[#137A2F]' : 'bg-[#FCE8E6] text-[#C5221F]'}`}>
                                                {e.valuta}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="title-medium font-bold text-[var(--md-sys-color-on-surface)]">{e.item}</h3>
                                                <div className="flex flex-col items-start gap-1 mt-1">
                                                    {e.prenotato && <span className="text-[10px] text-[#6750A4] bg-[#E8DEF8] px-2 py-0.5 rounded-md font-bold">PRENOTATO</span>}
                                                    {e.chi && <span className="text-[10px] bg-[var(--md-sys-color-surface-variant)] px-2 py-0.5 rounded-md font-bold text-[var(--md-sys-color-on-surface-variant)] uppercase">{e.chi.split(' ')[0]}</span>}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-end gap-1">
                                            <span className={`headline-small font-bold ${e.pagato ? 'text-[var(--md-sys-color-primary)] opacity-50 decoration-slate-400' : 'text-[var(--md-sys-color-on-surface)]'}`}>
                                                {e.costo.toFixed(2)}
                                            </span>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => togglePaid(e.id, e.pagato)}
                                                    className={`w-10 h-10 rounded-[12px] flex items-center justify-center transition-all duration-200 active:scale-90 ${e.pagato
                                                        ? 'bg-[#C4EED0] text-[#0A5C1F] shadow-sm hover:shadow-md'
                                                        : 'bg-[var(--md-sys-color-surface-container-highest)] text-[var(--md-sys-color-on-surface-variant)] hover:bg-[var(--md-sys-color-surface-variant)]'}`}
                                                >
                                                    {e.pagato ? <Check size={20} strokeWidth={3} /> : <div className="w-5 h-5 border-2 border-current rounded-full"></div>}
                                                </button>
                                                <button
                                                    onClick={() => { setNewItemExpense(e); setEditingId(e.id); setActiveModal('expenses'); }}
                                                    className="w-10 h-10 rounded-[12px] bg-[var(--md-sys-color-secondary-container)] text-[var(--md-sys-color-on-secondary-container)] flex items-center justify-center transition-all duration-200 active:scale-90 hover:shadow-md"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteExpense(e.id)}
                                                    className="w-10 h-10 rounded-[12px] bg-[#FFDAD6] text-[#410002] flex items-center justify-center transition-all duration-200 active:scale-90 hover:shadow-md hover:bg-[#FFB4AB]"
                                                >
                                                    <Trash size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        {activeTab === "itinerary" && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center bg-[var(--md-sys-color-surface-container-low)] p-3 rounded-xl shadow-sm border border-[var(--md-sys-color-outline-variant)]"><h2 className="font-bold text-[var(--md-sys-color-on-surface)] flex gap-2"><Calendar size={20} className="text-[var(--md-sys-color-primary)]" /> Il tuo Viaggio</h2><button onClick={() => setActiveModal('day')} className="bg-[var(--md-sys-color-primary)] text-[var(--md-sys-color-on-primary)] px-3 py-1.5 rounded-full text-xs font-bold">+ Giornata</button></div>
                                {days.map(day => {
                                    const dateObj = new Date(day.data);
                                    const dayName = dateObj.toLocaleDateString('it-IT', { weekday: 'long' });
                                    const dayNumber = dateObj.getDate();
                                    const monthYear = dateObj.toLocaleDateString('it-IT', { month: 'long', year: 'numeric' });

                                    return (
                                        <div key={day.id} className="relative pl-6 border-l-2 border-[var(--md-sys-color-outline-variant)] pb-8 last:border-l-transparent">
                                            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full border-4 border-[var(--md-sys-color-surface)] bg-[var(--md-sys-color-primary)] shadow-sm z-10"></div>

                                            <div className="bg-[var(--md-sys-color-surface-container-low)] rounded-[24px] shadow-sm overflow-hidden mb-2">
                                                <div className="p-5 flex justify-between items-start">
                                                    <div>
                                                        <div className="flex items-baseline gap-3">
                                                            <h3 className="headline-small font-bold text-[var(--md-sys-color-on-surface)] capitalize">{dayName}</h3>
                                                            <span className="display-small font-bold text-[var(--md-sys-color-primary)]">{dayNumber}</span>
                                                        </div>
                                                        <div className="label-medium font-bold text-[var(--md-sys-color-on-surface-variant)] uppercase tracking-wider">{monthYear}</div>
                                                    </div>
                                                    <div className="flex flex-col gap-2 items-end">
                                                        <button
                                                            onClick={() => handleDeleteDay(day.id)}
                                                            className="w-10 h-10 rounded-[12px] bg-[#FFDAD6] text-[#410002] flex items-center justify-center transition-all duration-200 active:scale-90 hover:shadow-md hover:bg-[#FFB4AB]"
                                                        >
                                                            <Trash size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => { setEditingId(day.id); setActiveModal('event'); }}
                                                            className="h-10 px-4 rounded-[12px] bg-[var(--md-sys-color-secondary-container)] text-[var(--md-sys-color-on-secondary-container)] text-xs font-bold flex items-center gap-1.5 transition-all duration-200 active:scale-95 hover:shadow-md"
                                                        >
                                                            <Plus size={16} /> Evento
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="border-t border-[var(--md-sys-color-outline-variant)] pt-4">
                                                    {(!day.events || day.events.length === 0) ? (
                                                        <div className="p-8 text-center text-[var(--md-sys-color-on-surface-variant)] italic text-sm">
                                                            Nessun evento pianificato per oggi
                                                        </div>
                                                    ) : (
                                                        <div className="space-y-0 pb-4">
                                                            {day.events.map((ev, evIndex) => {
                                                                const attraction = ev.type === 'attraction' ? itinerary.find(i => i.id === ev.attractionId) : null;
                                                                const isLast = evIndex === day.events.length - 1;

                                                                return (
                                                                    <div
                                                                        key={ev.id}
                                                                        onClick={() => { setEditingId(day.id); setNewItemEvent(ev); setActiveModal('event'); }}
                                                                        className="relative pl-4 pb-6 last:pb-0 group"
                                                                    >
                                                                        {/* Timeline Line */}
                                                                        {!isLast && (
                                                                            <div className="absolute left-[27px] top-[40px] bottom-[-10px] w-0.5 bg-[var(--md-sys-color-outline-variant)] opacity-50 z-0"></div>
                                                                        )}

                                                                        <div className="flex gap-4 relative z-10">
                                                                            {/* Time & Dot */}
                                                                            <div className="flex flex-col items-center gap-2 pt-1 min-w-[50px]">
                                                                                <div className="text-sm font-bold text-[var(--md-sys-color-primary)] font-mono bg-[var(--md-sys-color-surface-container-low)] z-10 py-1">{ev.time}</div>
                                                                                <div className="w-3 h-3 rounded-full border-2 border-[var(--md-sys-color-primary)] bg-[var(--md-sys-color-surface-container-low)] z-10"></div>
                                                                            </div>

                                                                            {/* Card Content */}
                                                                            <div className="flex-1 bg-[var(--md-sys-color-surface-container-high)] rounded-[20px] p-3 shadow-sm border border-[var(--md-sys-color-outline-variant)] hover:shadow-md transition-all active:scale-[0.98] cursor-pointer overflow-hidden flex gap-3">

                                                                                {/* Image Thumbnail */}
                                                                                <div className="w-20 h-20 rounded-[12px] bg-[var(--md-sys-color-surface-variant)] overflow-hidden shrink-0 relative">
                                                                                    {attraction && attraction.img ? (
                                                                                        <img src={attraction.img} alt={attraction.nome} className={`w-full h-full object-cover transition-all ${attraction.visited ? 'grayscale opacity-60' : ''}`} />
                                                                                    ) : (
                                                                                        <div className={`w-full h-full flex items-center justify-center text-[var(--md-sys-color-on-surface-variant)] opacity-50 ${attraction?.visited ? 'grayscale opacity-60' : ''}`}>
                                                                                            {ev.type === 'custom' ? <Star size={24} /> : <MapPin size={24} />}
                                                                                        </div>
                                                                                    )}
                                                                                    {/* Category Overlay on Image (Small) */}
                                                                                    {attraction && (
                                                                                        <div className="absolute bottom-0 left-0 right-0 p-1 bg-black/40 backdrop-blur-[2px] flex justify-center">
                                                                                            <span className="text-[8px] font-bold text-white uppercase tracking-wider truncate px-1">{attraction.categoria}</span>
                                                                                        </div>
                                                                                    )}
                                                                                    {/* Visited Check Overlay */}
                                                                                    {attraction && attraction.visited && (
                                                                                        <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-[1px]">
                                                                                            <div className="bg-[#C4EED0] text-[#07210F] rounded-full p-1 shadow-sm">
                                                                                                <Check size={14} strokeWidth={4} />
                                                                                            </div>
                                                                                        </div>
                                                                                    )}
                                                                                </div>

                                                                                <div className="flex-1 min-w-0 py-1 flex flex-col justify-between">
                                                                                    <div>
                                                                                        <div className="flex justify-between items-start">
                                                                                            <h4 className={`font-bold text-[15px] leading-tight line-clamp-2 ${ev.type === 'custom' ? 'text-[var(--md-sys-color-on-surface)]' : 'text-[var(--md-sys-color-primary)]'} ${attraction?.visited ? 'line-through opacity-60' : ''}`}>
                                                                                                {ev.type === 'custom' ? ev.customTitle : (attraction?.nome || 'Attrazione')}
                                                                                            </h4>
                                                                                            <div className="flex gap-1">
                                                                                                {attraction && (
                                                                                                    <button
                                                                                                        onClick={(e) => { e.stopPropagation(); toggleVisit(attraction.id, attraction.visited); }}
                                                                                                        className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${attraction.visited ? 'bg-[#C4EED0] text-[#07210F]' : 'bg-[var(--md-sys-color-surface-container-highest)] text-[var(--md-sys-color-on-surface-variant)] hover:bg-[var(--md-sys-color-surface-variant)]'}`}
                                                                                                        title={attraction.visited ? "Segna come non visitato" : "Segna come visitato"}
                                                                                                    >
                                                                                                        <Check size={16} strokeWidth={attraction.visited ? 3 : 2} />
                                                                                                    </button>
                                                                                                )}
                                                                                                <button onClick={(e) => { e.stopPropagation(); handleDeleteEvent(day.id, ev.id); }} className="w-8 h-8 flex items-center justify-center text-[var(--md-sys-color-on-surface-variant)] hover:bg-[#FFDAD6] hover:text-[#410002] rounded-full transition-colors"><X size={16} /></button>
                                                                                            </div>
                                                                                        </div>

                                                                                        {/* Meta Info */}
                                                                                        {attraction && attraction.quartiere && (
                                                                                            <div className="flex items-center gap-1 text-xs text-[var(--md-sys-color-on-surface-variant)] mt-1 truncate">
                                                                                                <MapPin size={10} /> {attraction.quartiere}
                                                                                            </div>
                                                                                        )}
                                                                                    </div>

                                                                                    {/* Badges & Notes */}
                                                                                    <div className="flex flex-wrap gap-1.5 mt-2">
                                                                                        {ev.type === 'custom' && (
                                                                                            <span className="text-[10px] bg-[var(--md-sys-color-secondary-container)] text-[var(--md-sys-color-on-secondary-container)] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">
                                                                                                {ev.customTitle ? 'Note' : 'Altro'}
                                                                                            </span>
                                                                                        )}
                                                                                        {ev.notes && <span className="text-[10px] text-[var(--md-sys-color-on-surface-variant)] flex items-center gap-1 bg-[var(--md-sys-color-surface-variant)]/30 px-2 py-0.5 rounded-md font-medium truncate max-w-full"><FileText size={10} /> {ev.notes}</span>}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                        {activeTab === "backpack" && <BackpackTab tripId={tripId} participants={tripDetails.participants} />}
                        {activeTab === "documents" && <DocumentsTab tripId={tripId} tripDetails={tripDetails} />}
                    </div>

                </div>

                {isScanning && (
                    <TicketScanner
                        onScan={(data) => {
                            setNewItemTransport(prev => ({ ...prev, ticket: data }));
                            setIsScanning(false);
                            // Optional: Show success toast
                        }}
                        onClose={() => setIsScanning(false)}
                    />
                )}

                {viewingTicket && (
                    <TicketView
                        ticketData={viewingTicket.ticket}
                        transportItem={viewingTicket}
                        onClose={() => setViewingTicket(null)}
                    />
                )}

                {/* Modals outside main container flow for better z-index management */}
                <Modal isOpen={activeModal === 'itinerary'} onClose={() => { setActiveModal(null); setEditingId(null); }} title={editingId ? "Modifica Attrazione" : "Nuova Attrazione"} >
                    <InputGroup label="Nome">
                        <input
                            type="text"
                            placeholder="Es. London Eye"
                            className="w-full p-4 bg-[var(--md-sys-color-surface-container-highest)] border border-[var(--md-sys-color-outline-variant)] rounded-xl outline-none focus:ring-2 focus:ring-[var(--md-sys-color-primary)] transition-all text-[var(--md-sys-color-on-surface)] placeholder:text-[var(--md-sys-color-on-surface-variant)]"
                            value={newItemItinerary.nome}
                            onChange={e => setNewItemItinerary({ ...newItemItinerary, nome: e.target.value })}
                        />
                    </InputGroup>
                    <InputGroup label="Categoria">
                        <select
                            className="w-full p-4 bg-[var(--md-sys-color-surface-container-highest)] border border-[var(--md-sys-color-outline-variant)] rounded-xl outline-none focus:ring-2 focus:ring-[var(--md-sys-color-primary)] transition-all appearance-none text-[var(--md-sys-color-on-surface)]"
                            value={newItemItinerary.categoria}
                            onChange={e => setNewItemItinerary({ ...newItemItinerary, categoria: e.target.value })}
                        >
                            {["Museo", "Mercato", "Parco", "Piazza", "Ristorante", "Tempo libero", "Grattacielo", "Altro"].map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </InputGroup>
                    <InputGroup label="Quartiere">
                        <input
                            type="text"
                            placeholder="Es. Westminster"
                            className="w-full p-4 bg-[var(--md-sys-color-surface-container-highest)] border border-[var(--md-sys-color-outline-variant)] rounded-xl outline-none focus:ring-2 focus:ring-[var(--md-sys-color-primary)] transition-all text-[var(--md-sys-color-on-surface)] placeholder:text-[var(--md-sys-color-on-surface-variant)]"
                            value={newItemItinerary.quartiere}
                            onChange={e => setNewItemItinerary({ ...newItemItinerary, quartiere: e.target.value })}
                        />
                    </InputGroup>
                    <div className="grid grid-cols-2 gap-3">
                        <InputGroup label="Durata">
                            <input
                                type="text"
                                placeholder="Es. 2 ore"
                                className="w-full p-4 bg-[var(--md-sys-color-surface-container-highest)] border border-[var(--md-sys-color-outline-variant)] rounded-xl outline-none focus:ring-2 focus:ring-[var(--md-sys-color-primary)] transition-all text-[var(--md-sys-color-on-surface)] placeholder:text-[var(--md-sys-color-on-surface-variant)]"
                                value={newItemItinerary.durata}
                                onChange={e => setNewItemItinerary({ ...newItemItinerary, durata: e.target.value })}
                            />
                        </InputGroup>
                        <InputGroup label="Orari">
                            <input
                                type="text"
                                placeholder="10:00 - 18:00"
                                className="w-full p-4 bg-[var(--md-sys-color-surface-container-highest)] border border-[var(--md-sys-color-outline-variant)] rounded-xl outline-none focus:ring-2 focus:ring-[var(--md-sys-color-primary)] transition-all text-[var(--md-sys-color-on-surface)] placeholder:text-[var(--md-sys-color-on-surface-variant)]"
                                value={newItemItinerary.orari}
                                onChange={e => setNewItemItinerary({ ...newItemItinerary, orari: e.target.value })}
                            />
                        </InputGroup>
                    </div>
                    <InputGroup label="Eccezioni">
                        <input
                            type="text"
                            placeholder="Es. Chiuso lunedì"
                            className="w-full p-4 bg-[var(--md-sys-color-surface-container-highest)] border border-[var(--md-sys-color-outline-variant)] rounded-xl outline-none focus:ring-2 focus:ring-[var(--md-sys-color-primary)] transition-all text-[var(--md-sys-color-on-surface)] placeholder:text-[var(--md-sys-color-on-surface-variant)]"
                            value={newItemItinerary.eccezioni}
                            onChange={e => setNewItemItinerary({ ...newItemItinerary, eccezioni: e.target.value })}
                        />
                    </InputGroup>
                    <InputGroup label="Immagine (URL)">
                        <input
                            type="text"
                            placeholder="https://..."
                            className="w-full p-4 bg-[var(--md-sys-color-surface-container-highest)] border border-[var(--md-sys-color-outline-variant)] rounded-xl outline-none focus:ring-2 focus:ring-[var(--md-sys-color-primary)] transition-all text-[var(--md-sys-color-on-surface)] placeholder:text-[var(--md-sys-color-on-surface-variant)]"
                            value={newItemItinerary.img}
                            onChange={e => setNewItemItinerary({ ...newItemItinerary, img: e.target.value })}
                        />
                    </InputGroup>
                    <InputGroup label="Mappa (Embed URL)">
                        <input
                            type="text"
                            placeholder="https://..."
                            className="w-full p-4 bg-[var(--md-sys-color-surface-container-highest)] border border-[var(--md-sys-color-outline-variant)] rounded-xl outline-none focus:ring-2 focus:ring-[var(--md-sys-color-primary)] transition-all text-[var(--md-sys-color-on-surface)] placeholder:text-[var(--md-sys-color-on-surface-variant)]"
                            value={newItemItinerary.mapEmbed}
                            onChange={e => setNewItemItinerary({ ...newItemItinerary, mapEmbed: e.target.value })}
                        />
                        <p className="text-[10px] text-gray-400 mt-1">Vai su Google Maps &gt; Condividi &gt; Incorpora una mappa &gt; Copia HTML (solo il link 'src')</p>
                    </InputGroup>
                    <Button onClick={handleAddItinerary} className="mt-4">{editingId ? "Salva Modifiche" : "Aggiungi"}</Button>
                </Modal >
                <Modal isOpen={activeModal === 'transport'} onClose={() => setActiveModal(null)} title="Spostamento">
                    <InputGroup label="Mezzo"><input type="text" className="w-full p-4 bg-[var(--md-sys-color-surface-container-highest)] border border-[var(--md-sys-color-outline-variant)] rounded-xl outline-none focus:ring-2 focus:ring-[var(--md-sys-color-primary)] transition-all text-[var(--md-sys-color-on-surface)] placeholder:text-[var(--md-sys-color-on-surface-variant)]" value={newItemTransport.dettaglio} onChange={e => setNewItemTransport({ ...newItemTransport, dettaglio: e.target.value })} /></InputGroup>
                    <div className="grid grid-cols-2 gap-3"><InputGroup label="Partenza"><input type="text" className="w-full p-4 bg-[var(--md-sys-color-surface-container-highest)] border border-[var(--md-sys-color-outline-variant)] rounded-xl outline-none focus:ring-2 focus:ring-[var(--md-sys-color-primary)] transition-all text-[var(--md-sys-color-on-surface)] placeholder:text-[var(--md-sys-color-on-surface-variant)]" value={newItemTransport.partenza} onChange={e => setNewItemTransport({ ...newItemTransport, partenza: e.target.value })} /></InputGroup><InputGroup label="Arrivo"><input type="text" className="w-full p-4 bg-[var(--md-sys-color-surface-container-highest)] border border-[var(--md-sys-color-outline-variant)] rounded-xl outline-none focus:ring-2 focus:ring-[var(--md-sys-color-primary)] transition-all text-[var(--md-sys-color-on-surface)] placeholder:text-[var(--md-sys-color-on-surface-variant)]" value={newItemTransport.arrivo} onChange={e => setNewItemTransport({ ...newItemTransport, arrivo: e.target.value })} /></InputGroup></div>
                    <div className="grid grid-cols-2 gap-3"><InputGroup label="Data"><input type="text" className="w-full p-4 bg-[var(--md-sys-color-surface-container-highest)] border border-[var(--md-sys-color-outline-variant)] rounded-xl outline-none focus:ring-2 focus:ring-[var(--md-sys-color-primary)] transition-all text-[var(--md-sys-color-on-surface)] placeholder:text-[var(--md-sys-color-on-surface-variant)]" value={newItemTransport.data} onChange={e => setNewItemTransport({ ...newItemTransport, data: e.target.value })} /></InputGroup><InputGroup label="Ora"><input type="text" className="w-full p-4 bg-[var(--md-sys-color-surface-container-highest)] border border-[var(--md-sys-color-outline-variant)] rounded-xl outline-none focus:ring-2 focus:ring-[var(--md-sys-color-primary)] transition-all text-[var(--md-sys-color-on-surface)] placeholder:text-[var(--md-sys-color-on-surface-variant)]" value={newItemTransport.ora} onChange={e => setNewItemTransport({ ...newItemTransport, ora: e.target.value })} /></InputGroup></div>
                    <InputGroup label="Costo"><input type="text" className="w-full p-4 bg-[var(--md-sys-color-surface-container-highest)] border border-[var(--md-sys-color-outline-variant)] rounded-xl outline-none focus:ring-2 focus:ring-[var(--md-sys-color-primary)] transition-all text-[var(--md-sys-color-on-surface)] placeholder:text-[var(--md-sys-color-on-surface-variant)]" value={newItemTransport.costo} onChange={e => setNewItemTransport({ ...newItemTransport, costo: e.target.value })} /></InputGroup>

                    <div className="mt-4 p-4 rounded-xl bg-[var(--md-sys-color-surface-container-high)] border border-[var(--md-sys-color-outline-variant)]">
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-sm font-bold text-[var(--md-sys-color-on-surface)]">Biglietto / QR</label>
                            {newItemTransport.ticket && <span className="text-xs text-green-600 font-bold bg-green-100 px-2 py-0.5 rounded-full">Salvato</span>}
                        </div>

                        {newItemTransport.ticket ? (
                            <div className="flex gap-2">
                                <div className="flex-1 p-3 bg-white rounded-lg border border-gray-200 text-xs text-gray-500 font-mono truncate">
                                    {newItemTransport.ticket}
                                </div>
                                <button onClick={() => setNewItemTransport({ ...newItemTransport, ticket: "" })} className="p-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200">
                                    <Trash size={18} />
                                </button>
                            </div>
                        ) : (
                            <button onClick={() => setIsScanning(true)} className="w-full py-3 bg-[var(--md-sys-color-secondary-container)] text-[var(--md-sys-color-on-secondary-container)] rounded-lg font-bold flex items-center justify-center gap-2 hover:shadow-md transition-all">
                                <QrCode size={20} />
                                Scansiona QR Biglietto
                            </button>
                        )}
                    </div>

                    <Button onClick={handleAddTransport} className="mt-4">Salva</Button>
                </Modal>
                <Modal isOpen={activeModal === 'expenses'} onClose={() => { setActiveModal(null); setEditingId(null); }} title={editingId ? "Modifica Spesa" : "Nuova Spesa"}>
                    <InputGroup label="Oggetto">
                        <input
                            type="text"
                            placeholder="Es. Cena"
                            className="w-full p-4 bg-[var(--md-sys-color-surface-container-highest)] border border-[var(--md-sys-color-outline-variant)] rounded-xl outline-none focus:ring-2 focus:ring-[var(--md-sys-color-primary)] transition-all text-[var(--md-sys-color-on-surface)] placeholder:text-[var(--md-sys-color-on-surface-variant)]"
                            value={newItemExpense.item}
                            onChange={e => setNewItemExpense({ ...newItemExpense, item: e.target.value })}
                        />
                    </InputGroup>
                    <div className="grid grid-cols-2 gap-3">
                        <InputGroup label="Importo">
                            <input
                                type="number"
                                placeholder="0.00"
                                className="w-full p-4 bg-[var(--md-sys-color-surface-container-highest)] border border-[var(--md-sys-color-outline-variant)] rounded-xl outline-none focus:ring-2 focus:ring-[var(--md-sys-color-primary)] transition-all font-bold text-[var(--md-sys-color-on-surface)] placeholder:text-[var(--md-sys-color-on-surface-variant)]"
                                value={newItemExpense.costo}
                                onChange={e => setNewItemExpense({ ...newItemExpense, costo: e.target.value })}
                            />
                        </InputGroup>
                        <InputGroup label="Valuta">
                            <select
                                className="w-full p-4 bg-[var(--md-sys-color-surface-container-highest)] border border-[var(--md-sys-color-outline-variant)] rounded-xl outline-none focus:ring-2 focus:ring-[var(--md-sys-color-primary)] transition-all appearance-none text-sm font-medium text-[var(--md-sys-color-on-surface)]"
                                value={newItemExpense.valuta}
                                onChange={e => setNewItemExpense({ ...newItemExpense, valuta: e.target.value })}
                            >
                                <option value={tripDetails.currencySymbol || "£"}>{tripDetails.currencySymbol || "£"} (Valuta Viaggio)</option>
                                <option value="€">€ (Euro)</option>
                            </select>
                        </InputGroup>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                        <label className={`flex items-center gap-3 p-4 border-0 rounded-xl cursor-pointer transition-all select-none ${newItemExpense.prenotato ? 'bg-[var(--md-sys-color-secondary-container)]' : 'bg-[var(--md-sys-color-surface-container-highest)]'}`}>
                            <div className={`w-5 h-5 rounded border-0 flex items-center justify-center transition-colors ${newItemExpense.prenotato ? 'bg-[var(--md-sys-color-on-secondary-container)]' : 'bg-[var(--md-sys-color-surface-variant)]'}`}>
                                {newItemExpense.prenotato && <Check size={12} className="text-[var(--md-sys-color-secondary-container)]" />}
                            </div>
                            <span className={`text-sm font-bold ${newItemExpense.prenotato ? 'text-[var(--md-sys-color-on-secondary-container)]' : 'text-[var(--md-sys-color-on-surface-variant)]'}`}>Già Prenotato</span>
                            <input type="checkbox" className="hidden" checked={newItemExpense.prenotato} onChange={() => setNewItemExpense({ ...newItemExpense, prenotato: !newItemExpense.prenotato })} />
                        </label>

                        <label className={`flex items-center gap-3 p-4 border-0 rounded-xl cursor-pointer transition-all select-none ${newItemExpense.pagato ? 'bg-[var(--md-sys-color-tertiary-container)]' : 'bg-[var(--md-sys-color-surface-container-highest)]'}`}>
                            <div className={`w-5 h-5 rounded border-0 flex items-center justify-center transition-colors ${newItemExpense.pagato ? 'bg-[var(--md-sys-color-on-tertiary-container)]' : 'bg-[var(--md-sys-color-surface-variant)]'}`}>
                                {newItemExpense.pagato && <Check size={12} className="text-[var(--md-sys-color-tertiary-container)]" />}
                            </div>
                            <span className={`text-sm font-bold ${newItemExpense.pagato ? 'text-[var(--md-sys-color-on-tertiary-container)]' : 'text-[var(--md-sys-color-on-surface-variant)]'}`}>Già Pagato</span>
                            <input type="checkbox" className="hidden" checked={newItemExpense.pagato} onChange={() => setNewItemExpense({ ...newItemExpense, pagato: !newItemExpense.pagato })} />
                        </label>
                    </div>

                    <InputGroup label="Chi Ha Pagato">
                        <select
                            className="w-full p-4 bg-[var(--md-sys-color-surface-container-highest)] border border-[var(--md-sys-color-outline-variant)] rounded-xl outline-none focus:ring-2 focus:ring-[var(--md-sys-color-primary)] transition-all appearance-none text-[var(--md-sys-color-on-surface)]"
                            value={newItemExpense.chi}
                            onChange={e => setNewItemExpense({ ...newItemExpense, chi: e.target.value })}
                        >
                            <option value="">-- Seleziona --</option>
                            {(tripDetails.participants && tripDetails.participants.length > 0) ? (
                                tripDetails.participants.map(p => (
                                    <option key={p} value={p}>{p}</option>
                                ))
                            ) : (
                                <>
                                    <option value="Andrea Inardi">Andrea Inardi</option>
                                    <option value="Elena Cafasso">Elena Cafasso</option>
                                </>
                            )}
                        </select>
                    </InputGroup>

                    <InputGroup label="Note">
                        <input
                            type="text"
                            placeholder="Es. Da dividere"
                            className="w-full p-4 bg-[var(--md-sys-color-surface-container-highest)] border border-[var(--md-sys-color-outline-variant)] rounded-xl outline-none focus:ring-2 focus:ring-[var(--md-sys-color-primary)] transition-all text-[var(--md-sys-color-on-surface)] placeholder:text-[var(--md-sys-color-on-surface-variant)]"
                            value={newItemExpense.note || ""}
                            onChange={e => setNewItemExpense({ ...newItemExpense, note: e.target.value })}
                        />
                    </InputGroup>

                    <Button onClick={handleAddExpense} className="mt-4 !bg-[#B3261E] !text-white shadow-md hover:!bg-[#8C1D18]">Salva Spesa</Button>
                </Modal>
                <Modal isOpen={activeModal === 'day'} onClose={() => setActiveModal(null)} title="Nuova Giornata">
                    <InputGroup label="Data"><input type="date" className="w-full p-4 bg-[var(--md-sys-color-surface-container-highest)] border border-[var(--md-sys-color-outline-variant)] rounded-xl outline-none focus:ring-2 focus:ring-[var(--md-sys-color-primary)] transition-all text-[var(--md-sys-color-on-surface)] placeholder:text-[var(--md-sys-color-on-surface-variant)]" value={newItemDay.data} onChange={e => setNewItemDay({ ...newItemDay, data: e.target.value })} /></InputGroup>
                    <Button onClick={handleAddDay} className="mt-4">Salva</Button>
                </Modal>
                <Modal isOpen={activeModal === 'event'} onClose={() => { setActiveModal(null); setEditingId(null); }} title="Aggiungi Evento">
                    <div className="flex p-1 bg-[var(--md-sys-color-surface-container-high)] rounded-full border border-[var(--md-sys-color-outline-variant)] mb-4 w-full">
                        <button
                            onClick={() => setNewItemEvent({ ...newItemEvent, type: 'attraction' })}
                            className={`flex-1 py-2 rounded-full text-sm font-bold transition-all ${newItemEvent.type !== 'custom' ? 'bg-[var(--md-sys-color-secondary-container)] text-[var(--md-sys-color-on-secondary-container)] shadow-sm' : 'text-[var(--md-sys-color-on-surface-variant)] hover:bg-[var(--md-sys-color-surface-container-highest)]'}`}
                        >
                            Attrazione
                        </button>
                        <button
                            onClick={() => setNewItemEvent({ ...newItemEvent, type: 'custom' })}
                            className={`flex-1 py-2 rounded-full text-sm font-bold transition-all ${newItemEvent.type === 'custom' ? 'bg-[var(--md-sys-color-secondary-container)] text-[var(--md-sys-color-on-secondary-container)] shadow-sm' : 'text-[var(--md-sys-color-on-surface-variant)] hover:bg-[var(--md-sys-color-surface-container-highest)]'}`}
                        >
                            Altro / Note
                        </button>
                    </div>

                    {newItemEvent.type === 'custom' ? (
                        <div className="space-y-4">
                            <InputGroup label="Titolo Evento">
                                <input
                                    type="text"
                                    placeholder="Es. Pranzo, Shopping, Relax..."
                                    className="w-full p-4 bg-[var(--md-sys-color-surface-container-highest)] border border-[var(--md-sys-color-outline-variant)] rounded-xl outline-none focus:ring-2 focus:ring-[var(--md-sys-color-primary)] transition-all text-[var(--md-sys-color-on-surface)] placeholder:text-[var(--md-sys-color-on-surface-variant)]"
                                    value={newItemEvent.customTitle}
                                    onChange={e => setNewItemEvent({ ...newItemEvent, customTitle: e.target.value })}
                                />
                            </InputGroup>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-3.5 text-[var(--md-sys-color-on-surface-variant)]" size={18} />
                                <input
                                    type="text"
                                    placeholder="Cerca attrazione..."
                                    className="w-full pl-10 pr-4 py-4 bg-[var(--md-sys-color-surface-container-highest)] border border-[var(--md-sys-color-outline-variant)] rounded-xl outline-none focus:ring-2 focus:ring-[var(--md-sys-color-primary)] transition-all text-sm text-[var(--md-sys-color-on-surface)] placeholder:text-[var(--md-sys-color-on-surface-variant)]"
                                    value={eventSearch}
                                    onChange={(e) => setEventSearch(e.target.value)}
                                />
                            </div>

                            <div className="max-h-[240px] overflow-y-auto space-y-2 pr-1 scroller">
                                {itinerary
                                    .filter(i => i.nome.toLowerCase().includes(eventSearch.toLowerCase()))
                                    .map(item => {
                                        const isSelected = newItemEvent.attractionId === item.id;
                                        return (
                                            <div
                                                key={item.id}
                                                onClick={() => setNewItemEvent({ ...newItemEvent, attractionId: item.id })}
                                                className={`flex items-center gap-3 p-3 rounded-2xl border-0 cursor-pointer transition-all group ${isSelected ? 'bg-[var(--md-sys-color-secondary-container)] text-[var(--md-sys-color-on-secondary-container)] ring-2 ring-[var(--md-sys-color-primary)]' : 'bg-[var(--md-sys-color-surface-container-low)] text-[var(--md-sys-color-on-surface)] hover:bg-[var(--md-sys-color-surface-container)]'
                                                    }`}
                                            >
                                                <div className="w-12 h-12 rounded-xl bg-[var(--md-sys-color-surface-container-highest)] overflow-hidden shrink-0">
                                                    {item.img ? (
                                                        <img src={item.img} alt={item.nome} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-[var(--md-sys-color-on-surface-variant)]">
                                                            <MapPin size={20} />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className={`font-bold text-sm truncate ${isSelected ? 'text-[var(--md-sys-color-on-secondary-container)]' : 'text-[var(--md-sys-color-on-surface)]'}`}>{item.nome}</h4>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <Badge type={item.categoria}>{item.categoria}</Badge>
                                                        <span className={`text-xs ${isSelected ? 'text-[var(--md-sys-color-on-secondary-container)] opacity-80' : 'text-[var(--md-sys-color-on-surface-variant)]'}`}>{item.durata}</span>
                                                    </div>
                                                </div>
                                                <button className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isSelected ? 'bg-[var(--md-sys-color-primary)] text-[var(--md-sys-color-on-primary)]' : 'bg-[var(--md-sys-color-surface-container-highest)] text-[var(--md-sys-color-primary)] group-hover:bg-[var(--md-sys-color-primary-container)]'}`}>
                                                    {isSelected ? <Check size={20} /> : <Plus size={20} />}
                                                </button>
                                            </div>
                                        );
                                    })}
                                {itinerary.filter(i => i.nome.toLowerCase().includes(eventSearch.toLowerCase())).length === 0 && (
                                    <div className="text-center py-8 text-gray-400 text-sm">
                                        Nessuna attrazione trovata
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="mt-4 pt-4 border-t border-[var(--md-sys-color-outline-variant)] space-y-4">
                        <InputGroup label="Orario Inizio">
                            <div className="relative">
                                <input
                                    type="time"
                                    className="w-full p-4 pl-4 bg-[var(--md-sys-color-surface-container-highest)] border border-[var(--md-sys-color-outline-variant)] rounded-xl outline-none focus:ring-2 focus:ring-[var(--md-sys-color-primary)] transition-all font-bold text-[var(--md-sys-color-on-surface)] placeholder:text-[var(--md-sys-color-on-surface-variant)]"
                                    value={newItemEvent.time}
                                    onChange={e => setNewItemEvent({ ...newItemEvent, time: e.target.value })}
                                />
                                <Clock className="absolute right-4 top-3.5 text-[var(--md-sys-color-on-surface-variant)] pointer-events-none" size={18} />
                            </div>
                        </InputGroup>

                        <InputGroup label="Note (Opzionale)">
                            <input
                                type="text"
                                placeholder="Es. Ingresso prenotato, dettagli..."
                                className="w-full p-4 bg-[var(--md-sys-color-surface-container-highest)] border border-[var(--md-sys-color-outline-variant)] rounded-xl outline-none focus:ring-2 focus:ring-[var(--md-sys-color-primary)] transition-all text-sm text-[var(--md-sys-color-on-surface)] placeholder:text-[var(--md-sys-color-on-surface-variant)]"
                                value={newItemEvent.notes}
                                onChange={e => setNewItemEvent({ ...newItemEvent, notes: e.target.value })}
                            />
                        </InputGroup>
                    </div>

                    <Button onClick={handleAddEvent} className="mt-4" disabled={!newItemEvent.time || (newItemEvent.type !== 'custom' && !newItemEvent.attractionId)}>
                        {editingId && editingId.startsWith('evt_') ? "Salva Modifiche" : "Aggiungi Evento"}
                    </Button>
                </Modal>
                <Modal isOpen={activeModal === 'tripDetails'} onClose={() => setActiveModal(null)} title="Dettagli Viaggio">
                    <InputGroup label="Titolo"><input type="text" className="w-full p-4 bg-[var(--md-sys-color-surface-container-highest)] border border-[var(--md-sys-color-outline-variant)] rounded-xl outline-none focus:ring-2 focus:ring-[var(--md-sys-color-primary)] transition-all text-[var(--md-sys-color-on-surface)] placeholder:text-[var(--md-sys-color-on-surface-variant)]" value={newItemTripDetails.title} onChange={e => setNewItemTripDetails({ ...newItemTripDetails, title: e.target.value })} /></InputGroup>
                    <div className="grid grid-cols-2 gap-3"><InputGroup label="Date"><input type="text" className="w-full p-4 bg-[var(--md-sys-color-surface-container-highest)] border border-[var(--md-sys-color-outline-variant)] rounded-xl outline-none focus:ring-2 focus:ring-[var(--md-sys-color-primary)] transition-all text-[var(--md-sys-color-on-surface)] placeholder:text-[var(--md-sys-color-on-surface-variant)]" value={newItemTripDetails.dates} onChange={e => setNewItemTripDetails({ ...newItemTripDetails, dates: e.target.value })} /></InputGroup><InputGroup label="Flag"><input type="text" className="w-full p-4 bg-[var(--md-sys-color-surface-container-highest)] border border-[var(--md-sys-color-outline-variant)] rounded-xl outline-none focus:ring-2 focus:ring-[var(--md-sys-color-primary)] transition-all text-[var(--md-sys-color-on-surface)] placeholder:text-[var(--md-sys-color-on-surface-variant)]" value={newItemTripDetails.flag} onChange={e => setNewItemTripDetails({ ...newItemTripDetails, flag: e.target.value })} /></InputGroup></div>
                    <div className="flex flex-wrap gap-2 mt-2">{colors.map(c => <button key={c.hex} onClick={() => setNewItemTripDetails({ ...newItemTripDetails, color: c.hex })} className="w-8 h-8 rounded-full border-2" style={{ backgroundColor: c.hex, borderColor: newItemTripDetails.color === c.hex ? 'black' : 'transparent' }}></button>)}</div>
                    <Button onClick={handleUpdateTripDetails} className="mt-4">Salva</Button>
                </Modal>
                <Modal isOpen={confirmModal.isOpen} onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })} title={confirmModal.title}>
                    <p className="mb-4">{confirmModal.message}</p>
                    <div className="grid grid-cols-2 gap-3"><Button variant="outline" onClick={() => setConfirmModal({ ...confirmModal, isOpen: false })}>No</Button><Button onClick={handleConfirmAction}>Si</Button></div>
                </Modal>
                <Modal isOpen={!!viewingItem} onClose={() => setViewingItem(null)} title={viewingItem?.nome || "Dettaglio"}>
                    {viewingItem && (
                        <div className="space-y-4 -mt-2">
                            {/* Hero Image Header */}
                            <div className="relative h-48 -mx-5 -mt-4 overflow-hidden rounded-t-[20px]">
                                {viewingItem.img ? (
                                    <img src={viewingItem.img} alt={viewingItem.nome} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-[var(--md-sys-color-surface-variant)] flex items-center justify-center">
                                        <MapPin size={64} className="text-[var(--md-sys-color-on-surface-variant)] opacity-30" />
                                    </div>
                                )}
                            </div>

                            {/* Info Grid */}
                            <div className="grid grid-cols-2 gap-3 pt-2">
                                {viewingItem.orari && (
                                    <div className="flex items-center gap-3 p-3 bg-[var(--md-sys-color-surface-container-high)] rounded-xl">
                                        <div className="w-10 h-10 rounded-full bg-[var(--md-sys-color-primary-container)] flex items-center justify-center">
                                            <Clock size={20} className="text-[var(--md-sys-color-on-primary-container)]" />
                                        </div>
                                        <div>
                                            <span className="label-small text-[var(--md-sys-color-on-surface-variant)] uppercase tracking-wider">Orari</span>
                                            <p className="title-small font-bold text-[var(--md-sys-color-on-surface)]">{viewingItem.orari}</p>
                                        </div>
                                    </div>
                                )}
                                {viewingItem.durata && (
                                    <div className="flex items-center gap-3 p-3 bg-[var(--md-sys-color-surface-container-high)] rounded-xl">
                                        <div className="w-10 h-10 rounded-full bg-[var(--md-sys-color-secondary-container)] flex items-center justify-center">
                                            <Hourglass size={20} className="text-[var(--md-sys-color-on-secondary-container)]" />
                                        </div>
                                        <div>
                                            <span className="label-small text-[var(--md-sys-color-on-surface-variant)] uppercase tracking-wider">Durata</span>
                                            <p className="title-small font-bold text-[var(--md-sys-color-on-surface)]">{viewingItem.durata}</p>
                                        </div>
                                    </div>
                                )}
                                {viewingItem.quartiere && (
                                    <div className="flex items-center gap-3 p-3 bg-[var(--md-sys-color-surface-container-high)] rounded-xl col-span-2">
                                        <div className="w-10 h-10 rounded-full bg-[var(--md-sys-color-tertiary-container)] flex items-center justify-center">
                                            <MapPin size={20} className="text-[var(--md-sys-color-on-tertiary-container)]" />
                                        </div>
                                        <div>
                                            <span className="label-small text-[var(--md-sys-color-on-surface-variant)] uppercase tracking-wider">Quartiere</span>
                                            <p className="title-small font-bold text-[var(--md-sys-color-on-surface)]">{viewingItem.quartiere}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Exceptions Note */}
                            {viewingItem.eccezioni && (
                                <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                                    <AlertCircle size={20} className="text-amber-600 shrink-0 mt-0.5" />
                                    <div>
                                        <span className="label-medium text-amber-800 font-bold">Note</span>
                                        <p className="text-sm text-amber-700">{viewingItem.eccezioni}</p>
                                    </div>
                                </div>
                            )}

                            {/* Map Section */}
                            {viewingItem.mapEmbed && (
                                <div className="space-y-2">
                                    <h3 className="title-small font-bold text-[var(--md-sys-color-on-surface)] flex items-center gap-2">
                                        <MapPin size={16} className="text-[var(--md-sys-color-primary)]" /> Posizione
                                    </h3>
                                    <div className="rounded-xl overflow-hidden shadow-md border border-[var(--md-sys-color-outline-variant)]">
                                        <iframe src={viewingItem.mapEmbed} className="w-full h-52 border-0" loading="lazy" />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </Modal>

                {/* M3 Expressive Navigation */}
                {
                    (() => {
                        const tabs = ["itinerary", "attractions", "expenses", "backpack", "documents"];
                        const labels = {
                            itinerary: "Giornate",
                            attractions: "Luoghi",
                            expenses: "Spese",
                            backpack: "Zaino",
                            documents: "Doc"
                        };
                        const activeIndex = tabs.indexOf(activeTab);

                        // Calculate floating FAB position (each tab is 20% of width, FAB is 48px so offset by 24px)
                        const fabLeft = `calc(${activeIndex * 20}% + 10% - 24px)`;

                        // SVG path parameters
                        const barHeight = 64;
                        const notchRadius = 26; // Half of FAB 48px + some padding
                        const notchDepth = 24; // How deep the notch goes

                        // Calculate notch center X (viewBox is 400 units wide)
                        const notchCenterX = (activeIndex * 20 + 10) * 4;

                        return (
                            <nav className="expressive-nav">
                                <div className="expressive-nav-inner">
                                    {/* SVG Background with curved notch */}
                                    <div className="expressive-nav-bg">
                                        <svg viewBox="0 0 400 64" preserveAspectRatio="none">
                                            <path
                                                className="nav-bg-path"
                                                d={`
                                            M 0 0
                                            L ${notchCenterX - notchRadius - 8} 0
                                            C ${notchCenterX - notchRadius} 0
                                              ${notchCenterX - notchRadius} ${notchDepth}
                                              ${notchCenterX} ${notchDepth}
                                            C ${notchCenterX + notchRadius} ${notchDepth}
                                              ${notchCenterX + notchRadius} 0
                                              ${notchCenterX + notchRadius + 8} 0
                                            L 400 0
                                            L 400 ${barHeight}
                                            L 0 ${barHeight}
                                            Z
                                        `}
                                            />
                                        </svg>
                                    </div>

                                    {/* Floating Active Button */}
                                    <div
                                        className="floating-fab"
                                        style={{ left: fabLeft }}
                                    >
                                        {activeTab === 'itinerary' && <Calendar size={20} />}
                                        {activeTab === 'attractions' && <MapPin size={20} />}
                                        {activeTab === 'expenses' && <PoundSterling size={20} />}
                                        {activeTab === 'backpack' && <Backpack size={20} />}
                                        {activeTab === 'documents' && <FileText size={20} />}
                                    </div>

                                    {/* Navigation Items */}
                                    <div className="nav-items-container">
                                        {tabs.map((t, index) => {
                                            const isActive = activeTab === t;
                                            return (
                                                <button
                                                    key={t}
                                                    onClick={() => setActiveTab(t)}
                                                    className={`expressive-nav-item ${isActive ? 'active' : ''}`}
                                                >
                                                    <div className="nav-icon">
                                                        {t === 'itinerary' && <Calendar size={22} />}
                                                        {t === 'attractions' && <MapPin size={22} />}
                                                        {t === 'expenses' && <PoundSterling size={22} />}
                                                        {t === 'backpack' && <Backpack size={22} />}
                                                        {t === 'documents' && <FileText size={22} />}
                                                    </div>
                                                    <span className="nav-label">{labels[t]}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </nav>
                        );
                    })()
                }
            </div >
            {
                isScanning && (
                    <div className="fixed inset-0 z-[1000] content-center">
                        <TicketScanner
                            onScan={(data) => {
                                setNewItemTransport(prev => ({ ...prev, ticket: data }));
                                setIsScanning(false);
                                // Optional: Show success toast
                            }}
                            onClose={() => setIsScanning(false)}
                        />
                    </div>
                )
            }

            {
                viewingTicket && (
                    <div className="fixed inset-0 z-[1000] content-center">
                        <TicketView
                            ticketData={viewingTicket.ticket}
                            transportItem={viewingTicket}
                            onClose={() => setViewingTicket(null)}
                        />
                    </div>
                )
            }
        </>
    );
};

window.TripDashboard = TripDashboard;
