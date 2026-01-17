const { useState, useEffect } = React;
const BackpackTab = ({ tripId, participants, weatherData, tripDetails }) => {
    const {
        User, CheckCircle, MapPin, Backpack, Search, Badge,
        Plus, Minus, Edit, Trash, Button, Modal, InputGroup, SegmentedControl, Sparkles
    } = window;

    const owners = (participants && participants.length > 0) ? participants : ["Andrea Inardi", "Elena Cafasso"];

    const [backpack, setBackpack] = useState([]);
    const [newItemBackpack, setNewItemBackpack] = useState({ item: "", categoria: "Altro", packed: false, qty: 1, outside: false, ml: "", owner: owners[0], collocazione: "" });
    const [backpackOwnerFilter, setBackpackOwnerFilter] = useState(owners[0]);
    const [backpackFilterLocation, setBackpackFilterLocation] = useState("Tutti");
    const [backpackFilterPlacement, setBackpackFilterPlacement] = useState("Tutti");
    const [activeModal, setActiveModal] = useState(null);
    const [editingId, setEditingId] = useState(null);

    const getDBCollection = (collectionName) => {
        return db.collection("trips").doc(tripId).collection(collectionName);
    };

    useEffect(() => {
        const unsubBackpack = getDBCollection("backpack").onSnapshot(snapshot => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setBackpack(data);
        });
        return () => unsubBackpack();
    }, [tripId]);

    const [suggestions, setSuggestions] = useState([]);
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (weatherData && window.GeminiService && tripDetails) {
                setIsLoadingSuggestions(true);
                try {
                    // Start with basic weather suggestions as fallback/initial
                    let allSuggestions = [];
                    if (window.WeatherService) {
                        allSuggestions = window.WeatherService.getPackingSuggestions(weatherData);
                    }

                    // Try to get AI suggestions
                    const aiSuggestions = await window.GeminiService.getBackpackSuggestions(weatherData, tripDetails);
                    if (aiSuggestions && aiSuggestions.length > 0) {
                        allSuggestions = aiSuggestions;
                    }

                    const currentItems = backpack.map(b => b.item.toLowerCase());
                    const filtered = allSuggestions.filter(s => !currentItems.some(existing => existing.includes(s.item.toLowerCase())));
                    setSuggestions(filtered);
                } catch (e) {
                    console.error("Error fetching suggestions", e);
                } finally {
                    setIsLoadingSuggestions(false);
                }
            }
        };
        fetchSuggestions();
    }, [weatherData, backpack, tripDetails]);

    const handleAddSuggestion = async (suggestion) => {
        await getDBCollection("backpack").add({
            item: suggestion.item,
            categoria: suggestion.category || "Altro",
            packed: false,
            qty: 1,
            ml: suggestion.ml || 0,
            outside: false,
            owner: backpackOwnerFilter, // Add to current view owner
            collocazione: "",
            autoSuggested: true
        });
        // Remove from local suggestions to update UI immediately (though effect will verify)
        setSuggestions(prev => prev.filter(s => s.item !== suggestion.item));
    };

    const handleAddBackpackItem = async () => {
        if (!newItemBackpack.item) return;

        const backpackData = {
            ...newItemBackpack,
            qty: Number(newItemBackpack.qty) || 1,
            ml: newItemBackpack.categoria === 'Liquido' ? (Number(newItemBackpack.ml) || 0) : 0,
            outside: newItemBackpack.outside || false,
            owner: newItemBackpack.owner,
            collocazione: newItemBackpack.collocazione || "",
        };

        if (editingId) {
            setBackpack(prev => prev.map(i => i.id === editingId ? { ...i, ...backpackData } : i));
            await getDBCollection("backpack").doc(editingId).update(backpackData);
        } else {
            await getDBCollection("backpack").add({
                ...backpackData,
                packed: false
            });
        }

        setEditingId(null);
        setNewItemBackpack({ item: "", categoria: newItemBackpack.categoria, packed: false, qty: 1, outside: false, ml: "", owner: backpackOwnerFilter, collocazione: "" });

        if (editingId) setActiveModal(null);
        if (!editingId) document.getElementById('backpack-input')?.focus();
    };

    const openEditBackpackItem = (item) => {
        setNewItemBackpack(item);
        setEditingId(item.id);
        setActiveModal('backpack');
    };

    const handleDeleteBackpackItem = async (id) => {
        await getDBCollection("backpack").doc(id).delete();
    };

    const togglePacked = (id, currentStatus) => {
        const newPacked = !currentStatus;
        const newOutside = !newPacked;
        setBackpack(prev => prev.map(i => i.id === id ? { ...i, packed: newPacked, outside: newOutside } : i));
        getDBCollection("backpack").doc(id).update({ packed: newPacked, outside: newOutside });
    };

    const updateBackpackQty = (id, currentQty, delta) => {
        const newQty = Math.max(1, currentQty + delta);
        setBackpack(prev => prev.map(i => i.id === id ? { ...i, qty: newQty } : i));
        getDBCollection("backpack").doc(id).update({ qty: newQty });
    };

    return (
        <div className="space-y-6">
            <div className="p-1 mb-4 space-y-3">

                {/* Weather Suggestions - Material 3 Expressive */}
                {isLoadingSuggestions ? (
                    <div className="flex items-center gap-2 overflow-x-auto scroller no-scrollbar pb-2 pt-1 px-1">
                        <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-[var(--md-sys-color-surface-container-highest)] border border-[var(--md-sys-color-outline-variant)] animate-pulse">
                            <span className="text-sm opacity-50">✨</span>
                        </div>
                        <div className="flex-shrink-0 w-24 h-8 rounded-full bg-[var(--md-sys-color-surface-container-high)] animate-pulse"></div>
                        <div className="flex-shrink-0 w-24 h-8 rounded-full bg-[var(--md-sys-color-surface-container-high)] animate-pulse"></div>
                        <div className="flex-shrink-0 w-24 h-8 rounded-full bg-[var(--md-sys-color-surface-container-high)] animate-pulse"></div>
                    </div>
                ) : suggestions.length > 0 && (
                    <div className="flex items-center gap-2 overflow-x-auto scroller no-scrollbar pb-2 pt-1 px-1">
                        <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 shadow-sm border border-indigo-200 dark:border-indigo-700">
                            <Sparkles size={16} />
                        </div>
                        {suggestions.map((s, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleAddSuggestion(s)}
                                className="flex-shrink-0 flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 pl-3 pr-4 py-2 rounded-[12px] border border-indigo-200 dark:border-indigo-700/50 shadow-sm hover:shadow-md active:scale-95 transition-all text-xs group"
                                title={s.reason}
                            >
                                <span className="text-sm group-hover:scale-110 transition-transform">{s.icon}</span>
                                <span className="font-bold text-indigo-900 dark:text-indigo-200 group-hover:text-indigo-950 dark:group-hover:text-indigo-100 transition-colors">{s.item}</span>
                                <Plus size={10} className="text-indigo-500 dark:text-indigo-400 ml-1 opacity-70 group-hover:opacity-100" />
                            </button>
                        ))}
                    </div>
                )}

                <div className="flex flex-col gap-3">
                    {/* Owner & Status Toggles with Sliding Pill Animation */}
                    <div className="flex flex-col gap-3">
                        <SegmentedControl
                            options={owners}
                            value={backpackOwnerFilter}
                            onChange={(owner) => { setBackpackOwnerFilter(owner); setBackpackFilterPlacement("Tutti"); }}
                            size="large"
                            renderLabel={(owner, isActive) => {
                                const ownerItems = backpack.filter(i => i.owner === owner);
                                const isOwnerComplete = ownerItems.length > 0 && ownerItems.every(i => i.packed);
                                return (
                                    <>
                                        <User size={14} />
                                        {owner.split(' ')[0]}
                                        {isOwnerComplete && <CheckCircle size={14} className="text-[#137A2F] ml-1" />}
                                    </>
                                );
                            }}
                        />

                        <SegmentedControl
                            options={["Tutti", "Dentro", "Fuori"]}
                            value={backpackFilterLocation}
                            onChange={setBackpackFilterLocation}
                        />
                    </div>

                    {(() => {
                        const uniquePlacements = [...new Set(backpack.filter(i => i.owner === backpackOwnerFilter && i.collocazione).map(i => i.collocazione))].sort();
                        const placements = ["Tutti", ...uniquePlacements];

                        if (uniquePlacements.length > 0) {
                            return (
                                <div className="flex gap-2 overflow-x-auto scroller no-scrollbar py-2">
                                    {placements.map(place => (
                                        <button
                                            key={place}
                                            onClick={() => setBackpackFilterPlacement(place)}
                                            className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap border transition-all flex items-center gap-1 ${backpackFilterPlacement === place
                                                ? 'bg-[var(--md-sys-color-secondary-container)] text-[var(--md-sys-color-on-secondary-container)] border-transparent'
                                                : 'bg-[var(--md-sys-color-surface-container-high)] text-[var(--md-sys-color-on-surface-variant)] border-[var(--md-sys-color-outline)] hover:bg-[var(--md-sys-color-surface-container-highest)]'
                                                }`}
                                        >
                                            <MapPin size={12} /> {place}
                                        </button>
                                    ))}
                                </div>
                            );
                        }
                    })()}
                </div>

                <div className="pt-2">
                    {(() => {
                        const currentItems = backpack.filter(i => i.owner === backpackOwnerFilter);
                        const totalItems = currentItems.length;
                        const packedItems = currentItems.filter(i => i.packed).length;
                        const percent = totalItems > 0 ? Math.round((packedItems / totalItems) * 100) : 0;
                        const isComplete = totalItems > 0 && packedItems === totalItems;

                        return (
                            <>
                                <div className="flex justify-between items-end mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${isComplete ? 'bg-[#C4EED0] text-[#07210F]' : 'bg-[var(--md-sys-color-surface-variant)] text-[var(--md-sys-color-on-surface-variant)]'}`}>
                                            <Backpack size={24} />
                                        </div>
                                        <div>
                                            <div className={`label-large font-bold uppercase tracking-wide ${isComplete ? "text-[#137A2F]" : "text-[var(--md-sys-color-on-surface-variant)]"}`}>
                                                {isComplete ? "Zaino Pronto!" : `${packedItems}/${totalItems} Oggetti`}
                                            </div>
                                            {(() => {
                                                const totalLiquids = currentItems
                                                    .filter(i => i.categoria === 'Liquido')
                                                    .reduce((acc, curr) => acc + ((Number(curr.ml) || 0) * (Number(curr.qty) || 1)), 0);

                                                if (totalLiquids > 0) {
                                                    return (
                                                        <div className={`text-[11px] font-bold mt-0.5 flex items-center gap-1 ${totalLiquids > 1000 ? 'text-[#BA1A1A]' : 'text-[#3E6FB0]'}`}>
                                                            <span>💧 {totalLiquids}ml</span>
                                                            {totalLiquids > 1000 && <span className="bg-[#FFDAD6] text-[#410002] px-1 rounded text-[10px]">Over</span>}
                                                        </div>
                                                    );
                                                }
                                            })()}
                                        </div>
                                    </div>
                                    <div className="display-small font-bold text-[var(--md-sys-color-primary)] opacity-20">
                                        {percent}%
                                    </div>
                                </div>

                                <div className="w-full bg-[var(--md-sys-color-surface-container-high)] rounded-full h-4 overflow-hidden">
                                    <div
                                        className={`${isComplete ? 'bg-[#137A2F]' : 'bg-[var(--md-sys-color-primary)]'} h-full rounded-full transition-all duration-700 ease-out`}
                                        style={{ width: `${percent}%` }}
                                    ></div>
                                </div>
                            </>
                        );
                    })()}
                </div>
            </div>

            <Button onClick={() => { setNewItemBackpack(prev => ({ ...prev, owner: backpackOwnerFilter })); setEditingId(null); setActiveModal('backpack'); }} icon={Plus} className="w-full shadow-md">
                Aggiungi a {backpackOwnerFilter.split(' ')[0]}
            </Button>

            <div className="space-y-6">
                {(() => {
                    let filteredBackpack = backpack.filter(i => i.owner === backpackOwnerFilter);
                    if (backpackFilterLocation === "Dentro") filteredBackpack = filteredBackpack.filter(i => !i.outside);
                    if (backpackFilterLocation === "Fuori") filteredBackpack = filteredBackpack.filter(i => i.outside);
                    if (backpackFilterPlacement !== "Tutti") filteredBackpack = filteredBackpack.filter(i => i.collocazione === backpackFilterPlacement);

                    const activeCategories = [...new Set([...filteredBackpack.map(i => i.categoria), "Liquido", "Maglietta", "Pantalone", "Intimo", "Elettronica", "Svago", "Necessità", "Pigiama", "Elegante"])]
                        .filter(cat => filteredBackpack.some(i => i.categoria === cat))
                        .sort();

                    if (filteredBackpack.length === 0 && backpack.filter(i => i.owner === backpackOwnerFilter).length > 0) {
                        return (
                            <div className="text-center py-10 opacity-50">
                                <Search size={48} className="mx-auto mb-2 text-[var(--md-sys-color-outline-variant)] opacity-50" />
                                <p className="text-[var(--md-sys-color-on-surface-variant)] text-sm opacity-70">Nessun oggetto trovato con questi filtri</p>
                            </div>
                        );
                    }

                    return activeCategories.map(cat => (
                        <div key={cat} className="mb-6">
                            <h3 className="label-large font-bold text-[var(--md-sys-color-on-surface-variant)] uppercase tracking-wider mb-3 ml-2 flex items-center gap-2 opacity-80">
                                <Badge type={cat}>{cat}</Badge>
                            </h3>
                            <div className="space-y-3">
                                {filteredBackpack.filter(i => i.categoria === cat).map(item => (
                                    <div key={item.id} className={`p-4 rounded-[20px] flex items-center gap-3 transition-colors group ${item.packed ? 'bg-[#E6F4EA] shadow-none opacity-80' : 'bg-[var(--md-sys-color-surface-container-low)] shadow-sm'}`}>
                                        <div className="flex flex-col items-center gap-1 bg-[var(--md-sys-color-surface)] rounded-xl p-1 min-w-[32px]">
                                            <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); updateBackpackQty(item.id, item.qty || 1, 1) }} className="p-1 hover:bg-[var(--md-sys-color-surface-variant)] rounded text-[var(--md-sys-color-primary)] font-bold leading-none"><Plus size={12} /></button>
                                            <span className="text-sm font-bold text-[var(--md-sys-color-on-surface)] text-center select-none">{item.qty || 1}</span>
                                            <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); updateBackpackQty(item.id, item.qty || 1, -1) }} className="p-1 hover:bg-[var(--md-sys-color-surface-variant)] rounded text-[var(--md-sys-color-primary)] font-bold leading-none"><Minus size={12} /></button>
                                        </div>

                                        <div className="flex-1 min-w-0" onClick={() => togglePacked(item.id, item.packed)}>
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className={`title-medium font-bold transition-all truncate ${item.packed ? 'text-[#137A2F] decoration-[#137A2F]' : 'text-[var(--md-sys-color-on-surface)]'}`}>
                                                    {item.item}
                                                </span>
                                                {item.ml > 0 && <span className="text-[10px] font-bold text-white bg-[#3E6FB0] px-1.5 py-0.5 rounded-full">{item.ml}ml</span>}
                                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full whitespace-nowrap transition-colors ${item.packed ? 'bg-[#C4EED0] text-[#07210F]' : 'bg-[#FFDAD6] text-[#410002]'}`}>
                                                    {item.packed ? "DENTRO" : "FUORI"}
                                                </span>
                                            </div>
                                            {item.collocazione && (
                                                <div className="text-[11px] text-[var(--md-sys-color-on-surface-variant)] font-medium mt-0.5 flex items-center gap-1">
                                                    <MapPin size={10} /> {item.collocazione}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); togglePacked(item.id, item.packed); }}
                                                className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200 ${item.packed ? 'bg-[#137A2F] text-white shadow-md' : 'bg-[var(--md-sys-color-surface-container-high)] text-[var(--md-sys-color-on-surface-variant)]'}`}
                                            >
                                                <Backpack size={20} />
                                            </button>
                                            <button onClick={(e) => { e.stopPropagation(); openEditBackpackItem(item); }} className="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--md-sys-color-surface)] text-[var(--md-sys-color-on-surface)] shadow-sm">
                                                <Edit size={16} />
                                            </button>
                                            <button onClick={(e) => { e.stopPropagation(); handleDeleteBackpackItem(item.id); }} className="w-10 h-10 flex items-center justify-center rounded-full bg-[#FFDAD6] text-[#410002] shadow-sm">
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
                        <Backpack size={48} className="mx-auto mb-2 text-[var(--md-sys-color-outline-variant)] opacity-50" />
                        <p className="text-[var(--md-sys-color-on-surface-variant)] text-sm opacity-70">Zaino vuoto</p>
                    </div>
                )}
            </div>

            <Modal isOpen={activeModal === 'backpack'} onClose={() => { setActiveModal(null); setEditingId(null); }} title={editingId ? "Modifica Oggetto" : "Nuovo Oggetto"}>
                <InputGroup label="Nome Oggetto">
                    <input
                        id="backpack-input"
                        type="text"
                        placeholder="Es. Caricabatterie..."
                        className="w-full p-4 bg-[var(--md-sys-color-surface-container-highest)] border-0 rounded-xl outline-none focus:ring-2 focus:ring-[var(--md-sys-color-primary)] transition-all text-[var(--md-sys-color-on-surface)] placeholder:opacity-50"
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
                            className="w-full p-4 bg-[var(--md-sys-color-surface-container-highest)] border-0 rounded-xl outline-none focus:ring-2 focus:ring-[var(--md-sys-color-primary)] transition-all text-[var(--md-sys-color-on-surface)] placeholder:opacity-50"
                            value={newItemBackpack.qty}
                            onChange={(e) => setNewItemBackpack({ ...newItemBackpack, qty: e.target.value })}
                        />
                    </InputGroup>
                    <InputGroup label="Categoria">
                        <select
                            className="w-full p-4 bg-[var(--md-sys-color-surface-container-highest)] border-0 rounded-xl outline-none focus:ring-2 focus:ring-[var(--md-sys-color-primary)] transition-all appearance-none text-[var(--md-sys-color-on-surface)]"
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
                            className="w-full p-4 bg-[var(--md-sys-color-surface-container-highest)] border-0 rounded-xl outline-none focus:ring-2 focus:ring-[var(--md-sys-color-primary)] transition-all font-bold text-[var(--md-sys-color-on-surface)] placeholder:opacity-50"
                            value={newItemBackpack.ml}
                            onChange={(e) => setNewItemBackpack({ ...newItemBackpack, ml: e.target.value })}
                        />
                    </InputGroup>
                )}

                <InputGroup label="Proprietario">
                    <select
                        className="w-full p-4 bg-[var(--md-sys-color-surface-container-highest)] border-0 rounded-xl outline-none focus:ring-2 focus:ring-[var(--md-sys-color-primary)] transition-all appearance-none text-[var(--md-sys-color-on-surface)]"
                        value={newItemBackpack.owner}
                        onChange={(e) => setNewItemBackpack({ ...newItemBackpack, owner: e.target.value })}
                    >
                        {owners.map(o => (
                            <option key={o} value={o}>{o}</option>
                        ))}
                    </select>
                </InputGroup>

                <InputGroup label="Collocazione (Opzionale)">
                    <input
                        type="text"
                        placeholder="Es. Tasca davanti, Borsa..."
                        className="w-full p-4 bg-[var(--md-sys-color-surface-container-highest)] border-0 rounded-xl outline-none focus:ring-2 focus:ring-[var(--md-sys-color-primary)] transition-all text-[var(--md-sys-color-on-surface)] placeholder:opacity-50"
                        value={newItemBackpack.collocazione}
                        onChange={(e) => setNewItemBackpack({ ...newItemBackpack, collocazione: e.target.value })}
                    />
                </InputGroup>

                <div className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all select-none border-0 ${newItemBackpack.outside ? 'bg-[var(--md-sys-color-secondary-container)] text-[var(--md-sys-color-on-secondary-container)]' : 'bg-[var(--md-sys-color-surface-container-highest)] text-[var(--md-sys-color-on-surface-variant)]'}`} onClick={() => setNewItemBackpack({ ...newItemBackpack, outside: !newItemBackpack.outside })}>
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${newItemBackpack.outside ? 'bg-[var(--md-sys-color-primary)] text-[var(--md-sys-color-on-primary)]' : 'bg-[var(--md-sys-color-surface)]'}`}>
                        {newItemBackpack.outside && <CheckCircle size={16} />}
                    </div>
                    <span className="font-bold">Oggetto fuori dallo zaino</span>
                </div>
                <Button onClick={handleAddBackpackItem} className="mt-4">
                    {editingId ? "Salva Modifiche" : "Aggiungi"}
                </Button>
            </Modal>
        </div>
    );
};

window.BackpackTab = BackpackTab;
