const { useState, useEffect } = React;
const BackpackTab = ({ tripId }) => {
    const {
        User, CheckCircle, MapPin, Backpack, Search, Badge,
        Plus, Minus, Edit, Trash, Button, Modal, InputGroup
    } = window;
    const [backpack, setBackpack] = useState([]);
    const [newItemBackpack, setNewItemBackpack] = useState({ item: "", categoria: "Altro", packed: false, qty: 1, outside: false, ml: "", owner: "Andrea Inardi", collocazione: "" });
    const [backpackOwnerFilter, setBackpackOwnerFilter] = useState("Andrea Inardi");
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
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 mb-4 space-y-3">
                <div className="flex flex-col gap-2">
                    <div className="flex gap-2 text-sm">
                        <div className="flex-1 flex bg-gray-50 p-1 rounded-lg">
                            {["Andrea Inardi", "Elena Cafasso"].map(owner => {
                                const ownerItems = backpack.filter(i => i.owner === owner);
                                const isOwnerComplete = ownerItems.length > 0 && ownerItems.every(i => i.packed);

                                return (
                                    <button
                                        key={owner}
                                        onClick={() => { setBackpackOwnerFilter(owner); setBackpackFilterPlacement("Tutti"); }}
                                        className={`flex-1 py-1.5 rounded-md font-bold transition-all flex items-center justify-center gap-1 text-xs ${backpackOwnerFilter === owner ? 'bg-white text-black shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                                    >
                                        <User size={12} />
                                        {owner.split(' ')[0]}
                                        {isOwnerComplete && <CheckCircle size={12} className="text-green-500 ml-1" />}
                                    </button>
                                );
                            })}
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

                <div className="pt-2 border-t border-gray-50">
                    {(() => {
                        const currentItems = backpack.filter(i => i.owner === backpackOwnerFilter);
                        const totalItems = currentItems.length;
                        const packedItems = currentItems.filter(i => i.packed).length;
                        const percent = totalItems > 0 ? Math.round((packedItems / totalItems) * 100) : 0;
                        const isComplete = totalItems > 0 && packedItems === totalItems;

                        return (
                            <>
                                <div className="flex justify-between items-end mb-1.5">
                                    <div className="flex items-center gap-2">
                                        <Backpack size={18} className={isComplete ? "text-green-500" : "text-gray-300"} />
                                        <div className={`text-xs font-bold uppercase tracking-wide ${isComplete ? "text-green-600" : "text-gray-500"}`}>
                                            {packedItems}/{totalItems} OGGETTI
                                        </div>
                                        {(() => {
                                            const totalLiquids = currentItems
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
                                    <div className={`text-[10px] font-bold ${isComplete ? "text-green-600 text-sm" : "text-gray-400"}`}>
                                        {percent}%
                                    </div>
                                </div>

                                {isComplete && (
                                    <div className="mb-2 bg-green-50 border border-green-100 p-2 rounded-lg flex items-center justify-center gap-2 animate-pulse">
                                        <span className="text-xl">🚀</span>
                                        <span className="font-bold text-green-700 text-sm">Zaino Pronto!</span>
                                    </div>
                                )}

                                <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                    <div
                                        className={`${isComplete ? 'bg-green-500' : 'bg-black'} h-1.5 rounded-full transition-all duration-500 ease-out`}
                                        style={{ width: `${percent}%` }}
                                    ></div>
                                </div>
                            </>
                        );
                    })()}
                </div>
            </div>

            <Button variant="outline" onClick={() => { setNewItemBackpack(prev => ({ ...prev, owner: backpackOwnerFilter })); setEditingId(null); setActiveModal('backpack'); }} icon={Plus}>
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
                                        <div className="flex flex-col items-center gap-0.5 bg-gray-50 rounded-lg p-0.5 border border-gray-100 min-w-[24px]">
                                            <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); updateBackpackQty(item.id, item.qty || 1, 1) }} className="p-0.5 hover:bg-gray-200 rounded text-gray-500 font-bold leading-none"><Plus size={10} /></button>
                                            <span className="text-xs font-bold text-gray-700 text-center select-none">{item.qty || 1}</span>
                                            <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); updateBackpackQty(item.id, item.qty || 1, -1) }} className="p-0.5 hover:bg-gray-200 rounded text-gray-500 font-bold leading-none"><Minus size={10} /></button>
                                        </div>

                                        <div className="flex-1 min-w-0" onClick={() => togglePacked(item.id, item.packed)}>
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className={`font-medium text-sm transition-all truncate ${item.packed ? 'text-gray-400 line-through decoration-gray-300' : 'text-gray-800'}`}>
                                                    {item.item}
                                                </span>
                                                {item.ml > 0 && <span className="text-[10px] font-bold text-blue-500 bg-blue-50 px-1 rounded">{item.ml}ml</span>}
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

                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); togglePacked(item.id, item.packed); }}
                                                className={`p-2.5 rounded-full transition-all duration-200 ${item.packed ? 'bg-green-50 text-green-500 shadow-sm border border-green-100' : 'bg-transparent text-gray-300 hover:text-gray-500 hover:bg-gray-50'}`}
                                                title={item.packed ? "Rimuovi dallo zaino" : "Metti nello zaino"}
                                            >
                                                <Backpack size={20} strokeWidth={item.packed ? 2.5 : 2} />
                                            </button>
                                            <button onClick={(e) => { e.stopPropagation(); openEditBackpackItem(item); }} className="text-gray-300 hover:text-blue-500 p-2 rounded-full transition-colors">
                                                <Edit size={16} />
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

            <Modal isOpen={activeModal === 'backpack'} onClose={() => { setActiveModal(null); setEditingId(null); }} title={editingId ? "Modifica Oggetto" : "Nuovo Oggetto"}>
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
                    {editingId ? "Salva Modifiche" : "Aggiungi"}
                </Button>
            </Modal>
        </div>
    );
};

window.BackpackTab = BackpackTab;
