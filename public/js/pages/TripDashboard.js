const TripDashboard = () => {
    const { useParams, useNavigate, useLocation } = window.ReactRouterDOM;
    // Lazy access to globals
    const {
        Card, Badge, Button, Modal, InputGroup,
        MapPin, Train, PoundSterling, Euro, DollarSign, CheckCircle, AlertCircle, Plus, X,
        Edit, Trash, User, Smartphone, Search, Minus, Calendar, Clock, Check, ArrowDown,
        Backpack, FileText, LinkIcon, RefreshCw,
        BackpackTab, DocumentsTab
    } = window;

    const { tripId, tab } = useParams();
    const navigate = useNavigate();

    const activeTab = tab || "itinerary";
    const setActiveTab = (newTab) => navigate(`/trip/${tripId}/${newTab}`);
    const onBack = () => navigate('/');

    // State
    const [itinerary, setItinerary] = useState([]);
    const [days, setDays] = useState([]);
    const [transport, setTransport] = useState([]);
    const [expenses, setExpenses] = useState([]);

    const [tripDetails, setTripDetails] = useState({ title: "Londra 2026", dates: "25 Feb - 02 Mar", flag: "🇬🇧", color: "#000000", currencySymbol: "£", exchangeRate: 1.15 });

    const [activeModal, setActiveModal] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [viewingItem, setViewingItem] = useState(null);
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: "", message: "", onConfirm: null });

    // Modals Data
    const [newItemItinerary, setNewItemItinerary] = useState({ nome: "", categoria: "Museo", quartiere: "", durata: "", orari: "", eccezioni: "", img: "", mapEmbed: "" });
    const [newItemDay, setNewItemDay] = useState({ data: "" });
    const [newItemEvent, setNewItemEvent] = useState({ type: 'attraction', attractionId: "", customTitle: "", time: "", notes: "" });
    const [newItemTransport, setNewItemTransport] = useState({ dettaglio: "", partenza: "", arrivo: "", data: "", ora: "", costo: "", pagato: false, prenotato: false });
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
        setActiveModal(null); setEditingId(null); setNewItemTransport({ dettaglio: "", partenza: "", arrivo: "", data: "", ora: "", costo: "", pagato: false, prenotato: false });
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
        const newEventObj = { id: 'evt_' + Date.now(), ...newItemEvent };
        const updatedEvents = [...(dayDoc.events || []), newEventObj];
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

    const colors = [{ hex: "#000000", name: "Nero" }, { hex: "#dc2626", name: "Rosso" }, { hex: "#2563eb", name: "Blu" }, { hex: "#16a34a", name: "Verde" }, { hex: "#d97706", name: "Arancione" }, { hex: "#9333ea", name: "Viola" }, { hex: "#db2777", name: "Rosa" }, { hex: "#0891b2", name: "Ciano" }];

    return (
        <div className="dashboard-container">
            <header className="dashboard-header" style={{ backgroundColor: tripDetails.color || '#000000' }}>
                <div className="dashboard-header-inner">
                    <div onClick={onBack} className="dashboard-back-btn">
                        <ArrowDown size={20} className="dashboard-back-icon" />
                    </div>
                    <div className="dashboard-title-container">
                        <h1 className="dashboard-title">
                            <span>{tripDetails.flag}</span> {tripDetails.title}
                            <button onClick={() => { setNewItemTripDetails(tripDetails); setActiveModal('tripDetails'); }} className="dashboard-edit-btn">
                                <Edit size={14} />
                            </button>
                        </h1>
                    </div>
                    <div className="dashboard-dates-badge">{tripDetails.dates}</div>
                </div>
                {deferredPrompt && (
                    <button onClick={handleInstallClick} className="dashboard-install-btn">
                        <Smartphone size={14} /> <span>Installa App</span>
                    </button>
                )}
            </header>

            <div className="stats-grid">
                <Card className="stats-card green">
                    <span className="stats-label">Già Pagato</span>
                    <div className="flex flex-col items-center"><span className="stats-value">€ {totalPaidEUR.toFixed(2)}</span></div>
                    <span className="stats-sub">€ {(totalPaidEUR / 2).toFixed(2)} a testa</span>
                </Card>
                <Card className="stats-card red">
                    <span className="stats-label">Previsto ({TRIP_CURRENCY})</span>
                    <span className="stats-value">{TRIP_CURRENCY} {toPayForeign.toFixed(2)}</span>
                    <span className="stats-sub">{TRIP_CURRENCY} {(toPayForeign / 2).toFixed(2)} a testa</span>
                </Card>
            </div>

            <div className="desktop-nav-container">
                <div className="desktop-nav-inner">
                    {["itinerary", "attractions", "expenses", "backpack", "documents"].map(t => (
                        <button key={t} onClick={() => setActiveTab(t)} className={`desktop-nav-btn ${activeTab === t ? 'active' : ''}`}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
                    ))}
                </div>
            </div>

            <div className="dashboard-content scroller">
                {activeTab === "attractions" && (
                    <div className="space-y-4">
                        <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 space-y-3">
                            <div className="flex bg-gray-100 p-1 rounded-lg">
                                <button onClick={() => setPlacesViewMode("places")} className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${placesViewMode === 'places' ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}><span className="flex items-center justify-center gap-2"><MapPin size={14} /> Luoghi</span></button>
                                <button onClick={() => setPlacesViewMode("transport")} className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${placesViewMode === 'transport' ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}><span className="flex items-center justify-center gap-2"><Train size={14} /> Mezzi</span></button>
                            </div>
                            {placesViewMode === "places" && (
                                <>
                                    <div className="filter-bar">
                                        <div className="search-row">
                                            <Search size={18} className="text-gray-400" />
                                            <input type="text" placeholder="Cerca..." className="search-input" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <div className="filter-toggle-row">
                                                {["Tutti", "Da Visitare", "Visitati"].map(s => (
                                                    <button key={s} onClick={() => setFilterStatusItinerary(s)} className={`filter-toggle-btn ${filterStatusItinerary === s ? 'active' : ''}`}>{s}</button>
                                                ))}
                                            </div>
                                            <button onClick={() => setSortOrder(prev => prev === 'alpha' ? 'default' : 'alpha')} className="p-1.5 rounded-lg text-xs font-bold bg-blue-50 text-blue-600">{sortOrder === 'alpha' ? 'A-Z' : 'Default'}</button>
                                        </div>
                                        <div className="filter-tags-row">
                                            <button onClick={() => setFilterCat("Tutti")} className={`filter-tag ${filterCat === "Tutti" ? 'active' : ''}`}>Tutti</button>
                                            {categories.filter(c => c !== "Tutti").map(c => (
                                                <button key={c} onClick={() => setFilterCat(c)} className={`filter-tag ${filterCat === c ? 'active' : ''}`}>{c}</button>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                        {placesViewMode === "places" && (
                            <div className="space-y-4">
                                <Button variant="outline" onClick={() => { setEditingId(null); setNewItemItinerary({ nome: "", categoria: "Museo", quartiere: "", durata: "", orari: "", eccezioni: "", img: "", mapEmbed: "" }); setActiveModal('itinerary'); }} icon={Plus}>Aggiungi Attrazione</Button>
                                {filteredItinerary.map(place => (
                                    <Card key={place.id} onClick={() => setViewingItem(place)} noPadding className="relative overflow-hidden cursor-pointer group">
                                        <div className="relative w-full h-48 bg-gray-200 overflow-hidden group-hover:brightness-[0.98] transition-all">
                                            {place.img ? <img src={place.img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" /> : <div className="w-full h-full flex items-center justify-center text-gray-300"><MapPin size={48} className="opacity-20" /></div>}
                                            <div className="absolute top-2 right-2 flex gap-1 z-20"><button onClick={(e) => { e.stopPropagation(); setNewItemItinerary(place); setEditingId(place.id); setActiveModal('itinerary'); }} className="bg-white/90 p-1.5 rounded-lg hover:bg-white"><Edit size={16} /></button><button onClick={(e) => { e.stopPropagation(); handleDeleteItinerary(place.id); }} className="bg-white/90 p-1.5 rounded-lg hover:bg-white hover:text-red-600"><Trash size={16} /></button></div>
                                            <div className="absolute top-3 left-3 z-20"><Badge type={place.categoria}>{place.categoria}</Badge></div>
                                        </div>
                                        <div className="p-4 flex flex-col bg-white">
                                            <div className="flex justify-between items-start mb-3"><h3 className="font-bold text-gray-800 text-xl truncate">{place.nome}</h3><button onClick={(e) => { e.stopPropagation(); toggleVisit(place.id, place.visited); }} className={`p-1.5 rounded-full ${place.visited ? 'text-green-600 bg-green-50' : 'text-gray-300'}`}><CheckCircle size={24} /></button></div>
                                            <div className="grid grid-cols-2 gap-2 text-xs"><div className="bg-gray-50 p-2 rounded-lg">Orari: <span className="font-semibold block">{place.orari}</span></div><div className="bg-gray-50 p-2 rounded-lg">Durata: <span className="font-semibold block">{place.durata}</span></div></div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        )}
                        {placesViewMode === "transport" && (
                            <div className="space-y-4">
                                <Button variant="blue" onClick={() => setActiveModal('transport')} icon={Plus}>Aggiungi Viaggio</Button>
                                {transport.map(t => (
                                    <Card key={t.id} className="border-l-4 border-l-blue-500">
                                        <div className="flex justify-between font-bold text-blue-900 mb-2">
                                            <div className="flex gap-2"><Train size={18} /> {t.dettaglio}</div>
                                            <div className="flex gap-1">
                                                <button onClick={() => { setNewItemTransport(t); setEditingId(t.id); setActiveModal('transport'); }}><Edit size={16} /></button>
                                                <button onClick={() => handleDeleteTransport(t.id)}><Trash size={16} /></button>
                                            </div>
                                        </div>
                                        <div className="flex gap-4 mb-4">
                                            <div className="text-center bg-blue-50/50 p-2 rounded-lg">
                                                <div className="text-xl font-bold">{t.ora}</div>
                                                <div className="text-[10px] bg-white text-blue-400 font-bold px-1 rounded">{t.data.split('/')[0]} Feb</div>
                                            </div>
                                            <div className="flex-1 flex flex-col gap-1 pl-2 border-l-2 border-gray-100">
                                                <div>{t.partenza}</div>
                                                <div>{t.arrivo}</div>
                                            </div>
                                        </div>
                                        <div className="flex justify-between pt-3 border-t border-gray-50">
                                            <div className="flex gap-2">
                                                <button onClick={() => toggleTransportBooked(t.id, t.prenotato)} className={`text-[10px] px-2 py-1 rounded border ${t.prenotato ? 'bg-purple-100 text-purple-700' : 'text-gray-400'}`}>{t.prenotato ? 'Prenotato' : 'Da Prenotare'}</button>
                                                <button onClick={() => toggleTransportPaid(t.id, t.pagato)} className={`text-[10px] px-2 py-1 rounded border ${t.pagato ? 'bg-green-100 text-green-700' : 'text-gray-400'}`}>{t.pagato ? 'Pagato' : 'Da Pagare'}</button>
                                            </div>
                                            <div className="text-right font-bold">{t.costo}</div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                )}
                {activeTab === "expenses" && (
                    <div className="space-y-3">
                        <div className="filter-bar flex-row justify-between items-center bg-white p-2 rounded-xl mb-0">
                            <div className="filter-toggle-row">
                                {["Tutti", "Da Pagare", "Pagati"].map(s => (
                                    <button key={s} onClick={() => setFilterStatusExpenses(s)} className={`filter-toggle-btn ${filterStatusExpenses === s ? 'active' : ''}`}>{s}</button>
                                ))}
                            </div>
                            <button onClick={() => setSortOrder(prev => prev === 'alpha' ? 'default' : 'alpha')} className="p-2 text-xs font-bold bg-blue-50 text-blue-600 rounded-lg">{sortOrder === 'alpha' ? 'A-Z' : 'Default'}</button>
                        </div>
                        <Button variant="green" onClick={() => { setNewItemExpense(prev => ({ ...prev, valuta: tripDetails.currencySymbol || "£" })); setActiveModal('expenses'); }} icon={Plus}>Aggiungi Spesa</Button>
                        {filteredExpenses.map(e => (
                            <Card key={e.id} className="border-l-4 border-l-transparent hover:border-l-indigo-500">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <h3 className="font-bold text-gray-800 flex justify-between">
                                            {e.item}
                                            <div className="flex gap-1">
                                                <button onClick={() => { setNewItemExpense(e); setEditingId(e.id); setActiveModal('expenses'); }} className="text-gray-300 hover:text-blue-500"><Edit size={14} /></button>
                                                <button onClick={() => handleDeleteExpense(e.id)} className="text-gray-300 hover:text-red-500"><Trash size={14} /></button>
                                            </div>
                                        </h3>
                                        <p className="text-xs text-gray-500">{e.note}</p>
                                        <div className="flex gap-2 mt-2">
                                            <button onClick={() => toggleBooked(e.id, e.prenotato)} className={`text-[10px] px-2 py-1 rounded border ${e.prenotato ? 'bg-purple-100 text-purple-700' : 'text-gray-400'}`}>{e.prenotato ? 'Prenotato' : 'Da Prenotare'}</button>
                                            <button onClick={() => togglePaid(e.id, e.pagato)} className={`text-[10px] px-2 py-1 rounded border ${e.pagato ? 'bg-green-100 text-green-700' : 'text-gray-400'}`}>{e.pagato ? 'Pagato' : 'Da Pagare'}</button>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="font-mono font-bold text-lg">{e.valuta} {e.costo.toFixed(2)}</span>
                                        <div className="text-[10px] bg-gray-100 mt-1 rounded px-1">{e.chi}</div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
                {activeTab === "itinerary" && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm border border-gray-100"><h2 className="font-bold text-gray-800 flex gap-2"><Calendar size={20} className="text-red-500" /> Il tuo Viaggio</h2><button onClick={() => setActiveModal('day')} className="bg-black text-white px-3 py-1.5 rounded-lg text-xs font-bold">+ Giornata</button></div>
                        {days.map(day => {
                            const dateObj = new Date(day.data);
                            const dayName = dateObj.toLocaleDateString('it-IT', { weekday: 'long' });
                            const dayNumber = dateObj.getDate();
                            const monthYear = dateObj.toLocaleDateString('it-IT', { month: 'long', year: 'numeric' });

                            return (
                                <div key={day.id} className="relative pl-6 border-l-2 border-gray-200 pb-8 last:border-l-transparent">
                                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full border-4 border-white bg-red-500 shadow-sm z-10"></div>

                                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-2">
                                        <div className="p-4 flex justify-between items-start">
                                            <div>
                                                <div className="flex items-baseline gap-2">
                                                    <h3 className="font-bold text-gray-800 text-xl capitalize">{dayName}</h3>
                                                    <span className="text-3xl font-black text-red-500">{dayNumber}</span>
                                                </div>
                                                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">{monthYear}</div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => { setEditingId(day.id); setActiveModal('event'); }}
                                                    className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 hover:bg-blue-100 transition-colors"
                                                >
                                                    <Plus size={14} /> Evento
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteDay(day.id)}
                                                    className="text-gray-300 hover:text-red-500 p-1 rounded-lg transition-colors"
                                                >
                                                    <Trash size={16} />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="border-t border-gray-50">
                                            {(!day.events || day.events.length === 0) ? (
                                                <div className="p-8 text-center text-gray-400 italic text-sm">
                                                    Nessun evento pianificato per oggi
                                                </div>
                                            ) : (
                                                <div className="divide-y divide-gray-50">
                                                    {day.events.map(ev => (
                                                        <div key={ev.id} className="p-3 flex gap-3 hover:bg-gray-50 cursor-pointer group">
                                                            <div className="font-bold text-gray-700 text-sm min-w-[45px] pt-1">{ev.time}</div>
                                                            <div className="flex-1">
                                                                <h4 className="font-bold text-sm flex justify-between items-start">
                                                                    <span className={ev.type === 'custom' ? 'text-gray-900' : 'text-blue-900'}>
                                                                        {ev.type === 'custom' ? ev.customTitle : (itinerary.find(i => i.id === ev.attractionId)?.nome || 'Attrazione')}
                                                                    </span>
                                                                    <button onClick={(e) => { e.stopPropagation(); handleDeleteEvent(day.id, ev.id); }} className="text-gray-300 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all"><X size={14} /></button>
                                                                </h4>
                                                                {ev.notes && <p className="text-xs text-amber-600 bg-amber-50 inline-block px-2 py-0.5 rounded mt-1">{ev.notes}</p>}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
                {activeTab === "backpack" && <BackpackTab tripId={tripId} />}
                {activeTab === "documents" && <DocumentsTab tripId={tripId} tripDetails={tripDetails} />}
            </div>

            {/* Modals */}
            <Modal isOpen={activeModal === 'itinerary'} onClose={() => { setActiveModal(null); setEditingId(null); }} title={editingId ? "Modifica Attrazione" : "Nuova Attrazione"}>
                <InputGroup label="Nome">
                    <input
                        type="text"
                        placeholder="Es. London Eye"
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-black transition-all"
                        value={newItemItinerary.nome}
                        onChange={e => setNewItemItinerary({ ...newItemItinerary, nome: e.target.value })}
                    />
                </InputGroup>
                <InputGroup label="Categoria">
                    <select
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-black transition-all appearance-none"
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
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-black transition-all"
                        value={newItemItinerary.quartiere}
                        onChange={e => setNewItemItinerary({ ...newItemItinerary, quartiere: e.target.value })}
                    />
                </InputGroup>
                <div className="grid grid-cols-2 gap-3">
                    <InputGroup label="Durata">
                        <input
                            type="text"
                            placeholder="Es. 2 ore"
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-black transition-all"
                            value={newItemItinerary.durata}
                            onChange={e => setNewItemItinerary({ ...newItemItinerary, durata: e.target.value })}
                        />
                    </InputGroup>
                    <InputGroup label="Orari">
                        <input
                            type="text"
                            placeholder="10:00 - 18:00"
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-black transition-all"
                            value={newItemItinerary.orari}
                            onChange={e => setNewItemItinerary({ ...newItemItinerary, orari: e.target.value })}
                        />
                    </InputGroup>
                </div>
                <InputGroup label="Eccezioni">
                    <input
                        type="text"
                        placeholder="Es. Chiuso lunedì"
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-black transition-all"
                        value={newItemItinerary.eccezioni}
                        onChange={e => setNewItemItinerary({ ...newItemItinerary, eccezioni: e.target.value })}
                    />
                </InputGroup>
                <InputGroup label="Immagine (URL)">
                    <input
                        type="text"
                        placeholder="https://..."
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-black transition-all"
                        value={newItemItinerary.img}
                        onChange={e => setNewItemItinerary({ ...newItemItinerary, img: e.target.value })}
                    />
                </InputGroup>
                <InputGroup label="Mappa (Embed URL)">
                    <input
                        type="text"
                        placeholder="https://..."
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-black transition-all"
                        value={newItemItinerary.mapEmbed}
                        onChange={e => setNewItemItinerary({ ...newItemItinerary, mapEmbed: e.target.value })}
                    />
                    <p className="text-[10px] text-gray-400 mt-1">Vai su Google Maps &gt; Condividi &gt; Incorpora una mappa &gt; Copia HTML (solo il link 'src')</p>
                </InputGroup>
                <Button onClick={handleAddItinerary} className="mt-4">{editingId ? "Salva Modifiche" : "Aggiungi"}</Button>
            </Modal>
            <Modal isOpen={activeModal === 'transport'} onClose={() => setActiveModal(null)} title="Spostamento">
                <InputGroup label="Mezzo"><input type="text" className="w-full border-2 rounded-xl p-3" value={newItemTransport.dettaglio} onChange={e => setNewItemTransport({ ...newItemTransport, dettaglio: e.target.value })} /></InputGroup>
                <div className="grid grid-cols-2 gap-3"><InputGroup label="Partenza"><input type="text" className="w-full border-2 rounded-xl p-3" value={newItemTransport.partenza} onChange={e => setNewItemTransport({ ...newItemTransport, partenza: e.target.value })} /></InputGroup><InputGroup label="Arrivo"><input type="text" className="w-full border-2 rounded-xl p-3" value={newItemTransport.arrivo} onChange={e => setNewItemTransport({ ...newItemTransport, arrivo: e.target.value })} /></InputGroup></div>
                <div className="grid grid-cols-2 gap-3"><InputGroup label="Data"><input type="text" className="w-full border-2 rounded-xl p-3" value={newItemTransport.data} onChange={e => setNewItemTransport({ ...newItemTransport, data: e.target.value })} /></InputGroup><InputGroup label="Ora"><input type="text" className="w-full border-2 rounded-xl p-3" value={newItemTransport.ora} onChange={e => setNewItemTransport({ ...newItemTransport, ora: e.target.value })} /></InputGroup></div>
                <InputGroup label="Costo"><input type="text" className="w-full border-2 rounded-xl p-3" value={newItemTransport.costo} onChange={e => setNewItemTransport({ ...newItemTransport, costo: e.target.value })} /></InputGroup>
                <Button onClick={handleAddTransport} className="mt-4">Salva</Button>
            </Modal>
            <Modal isOpen={activeModal === 'expenses'} onClose={() => { setActiveModal(null); setEditingId(null); }} title={editingId ? "Modifica Spesa" : "Nuova Spesa"}>
                <InputGroup label="Oggetto">
                    <input
                        type="text"
                        placeholder="Es. Cena"
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-black transition-all"
                        value={newItemExpense.item}
                        onChange={e => setNewItemExpense({ ...newItemExpense, item: e.target.value })}
                    />
                </InputGroup>
                <div className="grid grid-cols-2 gap-3">
                    <InputGroup label="Importo">
                        <input
                            type="number"
                            placeholder="0.00"
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-black transition-all font-bold"
                            value={newItemExpense.costo}
                            onChange={e => setNewItemExpense({ ...newItemExpense, costo: e.target.value })}
                        />
                    </InputGroup>
                    <InputGroup label="Valuta">
                        <select
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-black transition-all appearance-none text-sm font-medium"
                            value={newItemExpense.valuta}
                            onChange={e => setNewItemExpense({ ...newItemExpense, valuta: e.target.value })}
                        >
                            <option value={tripDetails.currencySymbol || "£"}>{tripDetails.currencySymbol || "£"} (Valuta Viaggio)</option>
                            <option value="€">€ (Euro)</option>
                        </select>
                    </InputGroup>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                    <label className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-all select-none ${newItemExpense.prenotato ? 'bg-purple-50 border-purple-200' : 'bg-white border-gray-200 hover:bg-gray-50'}`}>
                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${newItemExpense.prenotato ? 'bg-purple-500 border-purple-500' : 'bg-white border-gray-300'}`}>
                            {newItemExpense.prenotato && <Check size={12} className="text-white" />}
                        </div>
                        <span className={`text-xs font-bold ${newItemExpense.prenotato ? 'text-purple-700' : 'text-gray-500'}`}>Già Prenotato</span>
                        <input type="checkbox" className="hidden" checked={newItemExpense.prenotato} onChange={() => setNewItemExpense({ ...newItemExpense, prenotato: !newItemExpense.prenotato })} />
                    </label>

                    <label className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-all select-none ${newItemExpense.pagato ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200 hover:bg-gray-50'}`}>
                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${newItemExpense.pagato ? 'bg-green-500 border-green-500' : 'bg-white border-gray-300'}`}>
                            {newItemExpense.pagato && <Check size={12} className="text-white" />}
                        </div>
                        <span className={`text-xs font-bold ${newItemExpense.pagato ? 'text-green-700' : 'text-gray-500'}`}>Già Pagato</span>
                        <input type="checkbox" className="hidden" checked={newItemExpense.pagato} onChange={() => setNewItemExpense({ ...newItemExpense, pagato: !newItemExpense.pagato })} />
                    </label>
                </div>

                <InputGroup label="Chi Ha Pagato">
                    <select
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-black transition-all appearance-none"
                        value={newItemExpense.chi}
                        onChange={e => setNewItemExpense({ ...newItemExpense, chi: e.target.value })}
                    >
                        <option value="">-- Seleziona --</option>
                        <option value="Andrea Inardi">Andrea Inardi</option>
                        <option value="Elena Cafasso">Elena Cafasso</option>
                    </select>
                </InputGroup>

                <InputGroup label="Note">
                    <input
                        type="text"
                        placeholder="Es. Da dividere"
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-black transition-all"
                        value={newItemExpense.note || ""}
                        onChange={e => setNewItemExpense({ ...newItemExpense, note: e.target.value })}
                    />
                </InputGroup>

                <Button onClick={handleAddExpense} variant="green" className="mt-4">Salva Spesa</Button>
            </Modal>
            <Modal isOpen={activeModal === 'day'} onClose={() => setActiveModal(null)} title="Nuova Giornata">
                <InputGroup label="Data"><input type="date" className="w-full border-2 rounded-xl p-3" value={newItemDay.data} onChange={e => setNewItemDay({ ...newItemDay, data: e.target.value })} /></InputGroup>
                <Button onClick={handleAddDay} className="mt-4">Salva</Button>
            </Modal>
            <Modal isOpen={activeModal === 'event'} onClose={() => { setActiveModal(null); setEditingId(null); }} title="Aggiungi Evento">
                <div className="flex bg-gray-100 p-1 rounded-xl mb-4">
                    <button
                        onClick={() => setNewItemEvent({ ...newItemEvent, type: 'attraction' })}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${newItemEvent.type !== 'custom' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Attrazione
                    </button>
                    <button
                        onClick={() => setNewItemEvent({ ...newItemEvent, type: 'custom' })}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${newItemEvent.type === 'custom' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
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
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-black transition-all"
                                value={newItemEvent.customTitle}
                                onChange={e => setNewItemEvent({ ...newItemEvent, customTitle: e.target.value })}
                            />
                        </InputGroup>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Cerca attrazione..."
                                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-all text-sm"
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
                                            className={`flex items-center gap-3 p-2 rounded-xl border cursor-pointer transition-all group ${isSelected ? 'border-blue-500 bg-blue-50/30 ring-1 ring-blue-500' : 'border-gray-100 bg-white hover:border-gray-300'
                                                }`}
                                        >
                                            <div className="w-12 h-12 rounded-lg bg-gray-200 overflow-hidden shrink-0">
                                                {item.img ? (
                                                    <img src={item.img} alt={item.nome} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                        <MapPin size={20} />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className={`font-bold text-sm truncate ${isSelected ? 'text-blue-700' : 'text-gray-800'}`}>{item.nome}</h4>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <Badge type={item.categoria}>{item.categoria}</Badge>
                                                    <span className="text-xs text-gray-400">{item.durata}</span>
                                                </div>
                                            </div>
                                            <button className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isSelected ? 'bg-blue-600 text-white' : 'bg-gray-50 text-blue-600 group-hover:bg-blue-100'}`}>
                                                {isSelected ? <Check size={16} /> : <Plus size={18} />}
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

                <div className="mt-4 pt-4 border-t border-gray-100 space-y-4">
                    <InputGroup label="Orario Inizio">
                        <div className="relative">
                            <input
                                type="time"
                                className="w-full p-3 pl-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-black transition-all font-bold text-gray-700"
                                value={newItemEvent.time}
                                onChange={e => setNewItemEvent({ ...newItemEvent, time: e.target.value })}
                            />
                            <Clock className="absolute right-4 top-3.5 text-gray-400 pointer-events-none" size={18} />
                        </div>
                    </InputGroup>

                    <InputGroup label="Note (Opzionale)">
                        <input
                            type="text"
                            placeholder="Es. Ingresso prenotato, dettagli..."
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-black transition-all text-sm"
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
                <InputGroup label="Titolo"><input type="text" className="w-full border-2 rounded-xl p-3" value={newItemTripDetails.title} onChange={e => setNewItemTripDetails({ ...newItemTripDetails, title: e.target.value })} /></InputGroup>
                <div className="grid grid-cols-2 gap-3"><InputGroup label="Date"><input type="text" className="w-full border-2 rounded-xl p-3" value={newItemTripDetails.dates} onChange={e => setNewItemTripDetails({ ...newItemTripDetails, dates: e.target.value })} /></InputGroup><InputGroup label="Flag"><input type="text" className="w-full border-2 rounded-xl p-3" value={newItemTripDetails.flag} onChange={e => setNewItemTripDetails({ ...newItemTripDetails, flag: e.target.value })} /></InputGroup></div>
                <div className="flex flex-wrap gap-2 mt-2">{colors.map(c => <button key={c.hex} onClick={() => setNewItemTripDetails({ ...newItemTripDetails, color: c.hex })} className="w-8 h-8 rounded-full border-2" style={{ backgroundColor: c.hex, borderColor: newItemTripDetails.color === c.hex ? 'black' : 'transparent' }}></button>)}</div>
                <Button onClick={handleUpdateTripDetails} className="mt-4">Salva</Button>
            </Modal>
            <Modal isOpen={confirmModal.isOpen} onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })} title={confirmModal.title}>
                <p className="mb-4">{confirmModal.message}</p>
                <div className="grid grid-cols-2 gap-3"><Button variant="outline" onClick={() => setConfirmModal({ ...confirmModal, isOpen: false })}>No</Button><Button onClick={handleConfirmAction}>Si</Button></div>
            </Modal>
            <Modal isOpen={!!viewingItem} onClose={() => setViewingItem(null)} title={viewingItem?.nome}>
                {viewingItem?.img && <img src={viewingItem.img} className="w-full rounded-lg mb-4" />}
                <p>Orari: {viewingItem?.orari}</p>
                <p>Durata: {viewingItem?.durata}</p>
                {viewingItem?.mapEmbed && <iframe src={viewingItem.mapEmbed} className="w-full h-48 border-0 rounded-lg mt-4" />}
            </Modal>

            <div className="mobile-footer">
                {["itinerary", "attractions", "expenses", "backpack", "documents"].map(t => {
                    const labels = {
                        itinerary: "Giornate",
                        attractions: "Luoghi",
                        expenses: "Spese",
                        backpack: "Zaino",
                        documents: "Documenti"
                    };
                    const isActive = activeTab === t;
                    return (
                        <button
                            key={t}
                            onClick={() => setActiveTab(t)}
                            className={`mobile-footer-btn ${isActive ? 'active' : ''}`}
                            style={{ color: isActive ? tripDetails.color : undefined }}
                        >
                            {t === 'itinerary' && <Calendar size={20} />}
                            {t === 'attractions' && <MapPin size={20} />}
                            {t === 'expenses' && <PoundSterling size={20} />}
                            {t === 'backpack' && <Backpack size={20} />}
                            {t === 'documents' && <FileText size={20} />}
                            <span className="mobile-footer-label">{labels[t]}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

window.TripDashboard = TripDashboard;
