const { useState, useEffect } = React;
const { useNavigate } = ReactRouterDOM;

// Global components and icons are expected to be on window, or just available in scope
// But destructuring from window is cleaner if we want to be explicit, or just rely on global scope.
// Since we attached them to window, we can just use them if they are globals (which window properties are).

const LandingPage = () => {
    const {
        MapPin, Calendar, Trash, ArrowDown, Plus, Check,
        Modal, Button, InputGroup, ThemeToggle
    } = window;

    const [trips, setTrips] = useState([]);
    const [isCreating, setIsCreating] = useState(false);
    const [newTripData, setNewTripData] = useState({ title: "", flag: "🇬🇧", dates: "", color: "#d97706", currencySymbol: "£", exchangeRate: "1", participants: ["Andrea Inardi"] });
    const [newParticipantName, setNewParticipantName] = useState("");

    const [themeMode, setThemeMode] = useState(localStorage.getItem('themeMode') || 'light');

    const navigate = useNavigate();
    const onSelectTrip = (id) => navigate(`/trip/${id}/itinerary`);

    // Colors Palette
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

    const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: "", message: "", onConfirm: null });

    useEffect(() => {
        if (!window.db) return;
        const unsub = db.collection("trips").onSnapshot(snapshot => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setTrips(data);
        });
        return () => unsub();
    }, []);

    // Theme Effect
    useEffect(() => {
        applyTheme('#d97706', themeMode); // Use default orange seed for landing page
        localStorage.setItem('themeMode', themeMode);
    }, [themeMode]);

    const toggleTheme = () => {
        setThemeMode(prev => prev === 'light' ? 'dark' : 'light');
    };

    const handleCreateTrip = async () => {
        if (!newTripData.title) return;
        const docRef = await db.collection("trips").add({
            title: newTripData.title,
            dates: newTripData.dates || "Date TBD",
            flag: newTripData.flag || "🌍",
            color: newTripData.color || "#000000",
            currencySymbol: newTripData.currencySymbol || "£",
            exchangeRate: parseFloat(newTripData.exchangeRate) || 1,
            participants: newTripData.participants || []
        });

        // Initialize Backpacks for each participant
        const backpackBatch = db.batch();
        const defaultItems = window.defaultBackpackItems || [];

        if (newTripData.participants && newTripData.participants.length > 0) {
            newTripData.participants.forEach(person => {
                defaultItems.forEach(item => {
                    const newDocRef = db.collection("trips").doc(docRef.id).collection("backpack").doc();
                    backpackBatch.set(newDocRef, {
                        ...item,
                        owner: person
                    });
                });
            });
            await backpackBatch.commit();
        }

        onSelectTrip(docRef.id);
        setIsCreating(false);
        setNewTripData({ title: "", flag: "🇬🇧", dates: "", color: "#d97706", currencySymbol: "£", exchangeRate: "1", participants: ["Andrea Inardi"] });
    };

    const addParticipant = () => {
        if (!newParticipantName.trim()) return;
        if (newTripData.participants.includes(newParticipantName.trim())) return;
        setNewTripData({ ...newTripData, participants: [...newTripData.participants, newParticipantName.trim()] });
        setNewParticipantName("");
    };

    const removeParticipant = (name) => {
        setNewTripData({ ...newTripData, participants: newTripData.participants.filter(p => p !== name) });
    };

    const handleDeleteTrip = async (tripId, tripTitle) => {
        setConfirmModal({
            isOpen: true,
            title: "Elimina Viaggio",
            message: `Sei sicuro di voler eliminare DEFINITIVAMENTE il viaggio "${tripTitle}"? Questa azione non può essere annullata.`,
            onConfirm: async () => {
                try {
                    // Elimina ogni subcollection manualmente
                    const subCollections = ["itinerary", "expenses", "transport", "days", "backpack"];

                    const deleteCollection = async (coll) => {
                        const snapshot = await db.collection("trips").doc(tripId).collection(coll).get();
                        const batch = db.batch();
                        snapshot.docs.forEach(doc => batch.delete(doc.ref));
                        await batch.commit();
                    };

                    await Promise.all(subCollections.map(deleteCollection));

                    // Elimina il doc principale
                    await db.collection("trips").doc(tripId).delete();

                } catch (error) {
                    console.error("Errore eliminazione:", error);
                    alert("Errore durante l'eliminazione: " + error.message);
                }
            }
        });
    };

    return (
        <div className="landing-container bg-[var(--md-sys-color-surface)] min-h-screen pb-24">
            {/* Expressive Header */}
            <header className="pt-12 pb-8 px-6">
                <div className="flex justify-between items-center mb-6">
                    <img src="img/icon-192.png" alt="App Icon" className="w-12 h-12 rounded-[16px] shadow-sm" />
                    <ThemeToggle mode={themeMode} onToggle={toggleTheme} />
                </div>
                <h1 className="display-large leading-tight text-[var(--md-sys-color-on-surface)]">
                    Trip<br />Planner
                </h1>
            </header>

            <div className="px-6">
                <div className="flex justify-between items-end mb-4">
                    <h2 className="headline-small font-bold text-[var(--md-sys-color-on-surface-variant)]">I tuoi Viaggi</h2>
                    <span className="label-medium text-[var(--md-sys-color-primary)] bg-[var(--md-sys-color-primary-container)] px-3 py-1 rounded-full">{trips.length}</span>
                </div>

                {trips.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 text-center opacity-60">
                        <div className="w-20 h-20 bg-[var(--md-sys-color-surface-container-highest)] rounded-full flex items-center justify-center mb-4 text-[var(--md-sys-color-on-surface-variant)]">
                            <MapPin size={32} />
                        </div>
                        <p className="title-medium text-[var(--md-sys-color-on-surface-variant)]">Nessun viaggio trovato.</p>
                        <p className="body-medium text-[var(--md-sys-color-outline)] mt-1">Inizia a pianificare la tua prossima avventura!</p>
                    </div>
                )}

                <div className="grid grid-cols-1 gap-4">
                    {trips.map(trip => (
                        <div
                            key={trip.id}
                            onClick={() => onSelectTrip(trip.id)}
                            className="group relative bg-[var(--md-sys-color-surface-container-low)] rounded-[28px] p-0 overflow-hidden shadow-sm transition-all hover:scale-[1.02] active:scale-95 cursor-pointer border border-[var(--md-sys-color-outline-variant)]"
                        >
                            {/* Large Color Splash */}
                            <div className="absolute top-0 right-0 w-32 h-32 rounded-bl-[100px] opacity-10 transition-transform group-hover:scale-110" style={{ backgroundColor: trip.color }}></div>

                            <div className="p-6 relative z-10">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="w-14 h-14 rounded-full bg-[var(--md-sys-color-surface)] flex items-center justify-center text-3xl shadow-sm">
                                        {trip.flag}
                                    </div>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleDeleteTrip(trip.id, trip.title); }}
                                        className="w-10 h-10 rounded-full bg-[var(--md-sys-color-surface)] text-[var(--md-sys-color-on-surface-variant)] flex items-center justify-center hover:bg-[#FFDAD6] hover:text-[#410002] transition-colors"
                                    >
                                        <Trash size={18} />
                                    </button>
                                </div>

                                <h3 className="headline-medium font-bold text-[var(--md-sys-color-on-surface)] mb-1 leading-tight">
                                    {trip.title}
                                </h3>
                                <div className="flex items-center gap-2 text-[var(--md-sys-color-on-surface-variant)]">
                                    <Calendar size={16} />
                                    <span className="label-large opacity-80">{trip.dates}</span>
                                </div>
                            </div>

                            {/* Decorative Bottom Stripe */}
                            <div className="h-2 w-full mt-2" style={{ backgroundColor: trip.color }}></div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Floating Action Button (FAB) for Create - M3 Large FAB */}
            <div className="fixed bottom-6 right-6 z-20">
                <button
                    onClick={() => setIsCreating(true)}
                    className="h-16 w-16 rounded-[20px] bg-[var(--md-sys-color-primary-container)] text-[var(--md-sys-color-on-primary-container)] shadow-lg flex items-center justify-center transition-transform hover:scale-110 active:scale-90"
                >
                    <Plus size={32} />
                </button>
            </div>

            {/* Confirmation Modal */}
            <Modal isOpen={confirmModal.isOpen} onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })} title={confirmModal.title}>
                <p className="text-[var(--md-sys-color-on-surface-variant)] mb-6 leading-relaxed">{confirmModal.message}</p>
                <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" onClick={() => setConfirmModal({ ...confirmModal, isOpen: false })}>
                        Annulla
                    </Button>
                    <Button variant="primary" onClick={() => { confirmModal.onConfirm && confirmModal.onConfirm(); setConfirmModal({ ...confirmModal, isOpen: false }); }} className="bg-[var(--md-sys-color-error)] text-[var(--md-sys-color-on-error)] border-0">
                        Conferma
                    </Button>
                </div>
            </Modal>

            {/* Create Trip Modal - Using Global Modal Component */}
            <Modal isOpen={isCreating} onClose={() => setIsCreating(false)} title="Nuovo Viaggio">
                <InputGroup label="Nome Viaggio">
                    <input
                        type="text"
                        value={newTripData.title}
                        onChange={e => setNewTripData({ ...newTripData, title: e.target.value })}
                        className="w-full p-4 bg-[var(--md-sys-color-surface-container-highest)] border border-[var(--md-sys-color-outline-variant)] rounded-xl focus:ring-2 focus:ring-[var(--md-sys-color-primary)] outline-none transition-all placeholder:text-[var(--md-sys-color-on-surface-variant)] font-bold text-lg"
                        placeholder="Es. Londra 2026"
                    />
                </InputGroup>
                <div className="grid grid-cols-2 gap-3">
                    <InputGroup label="Bandiera">
                        <input
                            type="text"
                            value={newTripData.flag}
                            onChange={e => setNewTripData({ ...newTripData, flag: e.target.value })}
                            className="w-full p-4 bg-[var(--md-sys-color-surface-container-highest)] border border-[var(--md-sys-color-outline-variant)] rounded-xl outline-none text-center text-2xl"
                            placeholder="🇬🇧"
                        />
                    </InputGroup>
                    <InputGroup label="Date">
                        <input
                            type="text"
                            value={newTripData.dates}
                            onChange={e => setNewTripData({ ...newTripData, dates: e.target.value })}
                            className="w-full p-4 bg-[var(--md-sys-color-surface-container-highest)] border border-[var(--md-sys-color-outline-variant)] rounded-xl outline-none text-sm font-medium"
                            placeholder="Es. 25 Feb - 2 Mar"
                        />
                    </InputGroup>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <InputGroup label="Valuta">
                        <input
                            type="text"
                            value={newTripData.currencySymbol}
                            onChange={e => setNewTripData({ ...newTripData, currencySymbol: e.target.value })}
                            className="w-full p-4 bg-[var(--md-sys-color-surface-container-highest)] border border-[var(--md-sys-color-outline-variant)] rounded-xl outline-none text-center text-lg font-bold"
                            placeholder="£"
                        />
                    </InputGroup>
                    <InputGroup label="Cambio (Vs Euro)">
                        <input
                            type="number"
                            step="0.01"
                            value={newTripData.exchangeRate}
                            onChange={e => setNewTripData({ ...newTripData, exchangeRate: e.target.value })}
                            className="w-full p-4 bg-[var(--md-sys-color-surface-container-highest)] border border-[var(--md-sys-color-outline-variant)] rounded-xl outline-none text-center font-bold"
                            placeholder="1"
                        />
                    </InputGroup>
                </div>

                <div className="mb-6">
                    <label className="label-medium font-bold text-[var(--md-sys-color-on-surface-variant)] uppercase mb-2 block ml-1">Partecipanti</label>
                    <div className="flex gap-2 mb-3">
                        <input
                            type="text"
                            value={newParticipantName}
                            onChange={(e) => setNewParticipantName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addParticipant()}
                            placeholder="Aggiungi persona..."
                            className="flex-1 p-3 bg-[var(--md-sys-color-surface-container-highest)] border border-[var(--md-sys-color-outline-variant)] rounded-xl outline-none"
                        />
                        <button onClick={addParticipant} className="bg-[var(--md-sys-color-primary-container)] text-[var(--md-sys-color-on-primary-container)] p-3 rounded-xl font-bold">
                            <Plus size={20} />
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {newTripData.participants && newTripData.participants.map(p => (
                            <span key={p} className="pl-3 pr-2 py-1.5 rounded-full bg-[var(--md-sys-color-secondary-container)] text-[var(--md-sys-color-on-secondary-container)] font-bold text-sm flex items-center gap-2">
                                {p}
                                <button onClick={() => removeParticipant(p)} className="w-5 h-5 rounded-full bg-[var(--md-sys-color-surface)] text-[var(--md-sys-color-on-surface)] flex items-center justify-center hover:bg-[#FFDAD6] hover:text-[#410002]">
                                    <X size={12} />
                                </button>
                            </span>
                        ))}
                    </div>
                </div>

                <div className="mb-6">
                    <label className="label-medium font-bold text-[var(--md-sys-color-on-surface-variant)] uppercase mb-2 block ml-1">Colore Tema</label>
                    <div className="flex flex-wrap gap-3">
                        {colors.map(c => (
                            <button
                                key={c.hex}
                                onClick={() => setNewTripData({ ...newTripData, color: c.hex })}
                                className={`w-12 h-12 rounded-full flex items-center justify-center transition-transform hover:scale-110 ${newTripData.color === c.hex ? 'ring-4 ring-offset-2 ring-[var(--md-sys-color-primary)]' : ''}`}
                                style={{ backgroundColor: c.hex }}
                                title={c.name}
                            >
                                {newTripData.color === c.hex && <Check size={20} className="text-white drop-shadow-md" />}
                            </button>
                        ))}
                    </div>
                </div>

                <Button onClick={handleCreateTrip} className="w-full py-4 rounded-full text-lg bg-[var(--md-sys-color-primary)] text-[var(--md-sys-color-on-primary)] shadow-lg hover:shadow-xl translate-y-0 hover:-translate-y-1 transition-all">
                    Inizia Avventura
                </Button>
            </Modal>
        </div>
    );
};

window.LandingPage = LandingPage;
