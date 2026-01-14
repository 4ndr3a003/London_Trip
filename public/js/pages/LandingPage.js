const { useState, useEffect } = React;
const { useNavigate } = ReactRouterDOM;

// Global components and icons are expected to be on window, or just available in scope
// But destructuring from window is cleaner if we want to be explicit, or just rely on global scope.
// Since we attached them to window, we can just use them if they are globals (which window properties are).

const LandingPage = () => {
    const {
        MapPin, Calendar, Trash, ArrowDown, Plus, Check,
        Modal, Button, InputGroup
    } = window;

    const [trips, setTrips] = useState([]);
    const [isCreating, setIsCreating] = useState(false);
    const [newTripData, setNewTripData] = useState({ title: "", flag: "🇬🇧", dates: "", color: "#000000", currencySymbol: "£", exchangeRate: "1" });

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
        { hex: "#0891b2", name: "Ciano" }
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

    const handleCreateTrip = async () => {
        if (!newTripData.title) return;
        const docRef = await db.collection("trips").add({
            title: newTripData.title,
            dates: newTripData.dates || "Date TBD",
            flag: newTripData.flag || "🌍",
            color: newTripData.color || "#000000",
            currencySymbol: newTripData.currencySymbol || "£",
            exchangeRate: parseFloat(newTripData.exchangeRate) || 1
        });
        onSelectTrip(docRef.id);
        setIsCreating(false);
        setNewTripData({ title: "", flag: "🇬🇧", dates: "", color: "#000000", currencySymbol: "£", exchangeRate: "1" });
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
        <div className="landing-container">
            {/* Modern Header */}
            <header className="landing-header">
                <div className="landing-header-content">
                    <img src="img/icon-192.png" alt="App Icon" className="landing-app-icon" />
                    <h1 className="landing-title">
                        Trip Planner
                    </h1>
                </div>
            </header>

            <div className="landing-content">
                <div>
                    <h2 className="landing-section-title">I tuoi Viaggi</h2>
                    <p className="landing-subtitle">Pronto per la prossima avventura?</p>
                </div>

                {trips.length === 0 && (
                    <div className="landing-empty">
                        <div className="landing-empty-icon">
                            <MapPin size={24} className="text-gray-400" />
                        </div>
                        <p className="text-gray-500">Nessun viaggio trovato.</p>
                        <p className="text-sm text-gray-400">Creane uno nuovo per iniziare!</p>
                    </div>
                )}

                <div className="landing-grid">
                    {trips.map(trip => (
                        <div
                            key={trip.id}
                            onClick={() => onSelectTrip(trip.id)}
                            className="trip-card group"
                        >
                            {/* Color Accent (Always Visible) */}
                            <div
                                className="trip-card-accent"
                                style={{ backgroundColor: trip.color || '#000000' }}
                            />

                            <div className="trip-card-header">
                                <div className="trip-card-main">
                                    <div className="trip-card-title-row">
                                        <span className="trip-card-flag">{trip.flag}</span>
                                        <h3 className="trip-card-title">
                                            {trip.title}
                                        </h3>
                                    </div>
                                    <p className="trip-card-date">
                                        <Calendar size={12} />
                                        {trip.dates}
                                    </p>
                                </div>
                                <div className="trip-card-actions">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleDeleteTrip(trip.id, trip.title); }}
                                        className="trip-delete-btn"
                                        title="Elimina Viaggio"
                                    >
                                        <Trash size={18} />
                                    </button>
                                </div>
                            </div>

                            <div className="trip-card-footer">
                                <span className="trip-card-tag">
                                    Viaggio
                                </span>
                                <div className="trip-card-arrow-container">
                                    <ArrowDown size={16} className="trip-card-arrow" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Floating Action Button (FAB) for Create */}
            <div className="fab-create">
                <button
                    onClick={() => setIsCreating(true)}
                    className="fab-btn group"
                >
                    <Plus size={24} className="fab-icon" />
                    <span className="fab-label">Nuovo</span>
                </button>
            </div>

            {/* Confirmation Modal */}
            <Modal isOpen={confirmModal.isOpen} onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })} title={confirmModal.title}>
                <p className="text-gray-600 mb-6">{confirmModal.message}</p>
                <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" onClick={() => setConfirmModal({ ...confirmModal, isOpen: false })}>
                        Annulla
                    </Button>
                    <Button variant="primary" onClick={() => { confirmModal.onConfirm && confirmModal.onConfirm(); setConfirmModal({ ...confirmModal, isOpen: false }); }} className="bg-red-600 hover:bg-red-700 text-white border-0">
                        Conferma
                    </Button>
                </div>
            </Modal>

            {/* Create Trip Modal */}
            <Modal isOpen={isCreating} onClose={() => setIsCreating(false)} title="Nuovo Viaggio">
                <InputGroup label="Nome Viaggio">
                    <input
                        type="text"
                        value={newTripData.title}
                        onChange={e => setNewTripData({ ...newTripData, title: e.target.value })}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-black focus:outline-none transition-colors"
                        placeholder="Es. Londra 2026"
                    />
                </InputGroup>
                <div className="grid grid-cols-2 gap-3">
                    <InputGroup label="Bandiera (Emoji)">
                        <input
                            type="text"
                            value={newTripData.flag}
                            onChange={e => setNewTripData({ ...newTripData, flag: e.target.value })}
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-black focus:outline-none transition-colors text-center text-lg"
                            placeholder="🇬🇧"
                        />
                    </InputGroup>
                    <InputGroup label="Date">
                        <input
                            type="text"
                            value={newTripData.dates}
                            onChange={e => setNewTripData({ ...newTripData, dates: e.target.value })}
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-black focus:outline-none transition-colors"
                            placeholder="Es. 25 Feb - 2 Mar"
                        />
                    </InputGroup>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <InputGroup label="Valuta (Simbolo)">
                        <input
                            type="text"
                            value={newTripData.currencySymbol}
                            onChange={e => setNewTripData({ ...newTripData, currencySymbol: e.target.value })}
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-black focus:outline-none transition-colors text-center text-lg"
                            placeholder="£"
                        />
                    </InputGroup>
                    <InputGroup label="Cambio (Vs Euro)">
                        <input
                            type="number"
                            step="0.01"
                            value={newTripData.exchangeRate}
                            onChange={e => setNewTripData({ ...newTripData, exchangeRate: e.target.value })}
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-black focus:outline-none transition-colors"
                            placeholder="1"
                        />
                    </InputGroup>
                </div>

                <div className="mb-6">
                    <label className="color-picker-label">Colore Principale</label>
                    <div className="color-picker-grid">
                        {colors.map(c => (
                            <button
                                key={c.hex}
                                onClick={() => setNewTripData({ ...newTripData, color: c.hex })}
                                className={`color-swatch ${newTripData.color === c.hex ? 'selected' : ''}`}
                                style={{ backgroundColor: c.hex }}
                                title={c.name}
                            >
                                {newTripData.color === c.hex && <Check size={14} className="text-white drop-shadow-md" />}
                            </button>
                        ))}
                    </div>
                </div>

                <Button onClick={handleCreateTrip}>Crea Viaggio</Button>
            </Modal>
        </div>
    );
};

window.LandingPage = LandingPage;
