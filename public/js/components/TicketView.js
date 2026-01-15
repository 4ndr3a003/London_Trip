const TicketView = ({ ticketData, transportItem, onClose }) => {
    const qrRef = React.useRef(null);
    const { X, Train, Calendar, Clock, Share2, Bus, Car, Plane, Ship } = window; // Add all needed icons

    const getTransportIcon = (name) => {
        if (!name) return Train;
        const n = name.toLowerCase();
        if (n.includes('volo') || n.includes('aereo') || n.includes('flight') || n.includes('stansted') || n.includes('gatwick') || n.includes('heathrow') || n.includes('luton')) return Plane;
        if (n.includes('bus') || n.includes('pullman') || n.includes('coach') || n.includes('shuttle') || n.includes('national express')) return Bus;
        if (n.includes('auto') || n.includes('taxi') || n.includes('uber') || n.includes('car')) return Car;
        if (n.includes('nave') || n.includes('traghetto') || n.includes('battello') || n.includes('boat') || n.includes('ferry') || n.includes('thames')) return Ship;
        return Train;
    };

    const getTransportColor = (name) => {
        if (!name) return 'var(--md-sys-color-primary)';
        const n = name.toLowerCase();
        if (n.includes('volo') || n.includes('aereo') || n.includes('flight')) return '#0ea5e9'; // Sky Blue
        if (n.includes('bus') || n.includes('pullman')) return '#ef4444'; // Red
        if (n.includes('auto') || n.includes('taxi')) return '#eab308'; // Yellow
        if (n.includes('nave') || n.includes('traghetto')) return '#3b82f6'; // Blue
        if (n.includes('treno') || n.includes('train') || n.includes('eurostar')) return '#16a34a'; // Green
        return 'var(--md-sys-color-primary)';
    };

    const TransportIcon = getTransportIcon(transportItem?.dettaglio);
    const headerColor = getTransportColor(transportItem?.dettaglio);

    React.useEffect(() => {
        if (qrRef.current && ticketData) {
            qrRef.current.innerHTML = ""; // Clear previous
            try {
                new QRCode(qrRef.current, {
                    text: ticketData,
                    width: 256,
                    height: 256,
                    colorDark: "#000000",
                    colorLight: "#ffffff",
                    correctLevel: QRCode.CorrectLevel.H
                });
            } catch (e) {
                console.error("QR Render Error", e);
                qrRef.current.innerHTML = "Errore rendering QR";
            }
        }
    }, [ticketData]);

    // Brightness hint? No API for that on web easily nicely.

    return (
        <div className="fixed inset-0 z-[60] bg-black/95 flex flex-col items-center justify-center p-4 backdrop-blur-md animate-in fade-in zoom-in duration-300">
            {/* Ticket Card */}
            <div className="bg-white w-full max-w-sm rounded-[32px] overflow-hidden shadow-2xl relative flex flex-col text-black">

                {/* Header Section */}
                <div className="p-6 text-white relative overflow-hidden transition-colors duration-500" style={{ backgroundColor: headerColor }}>
                    <div className="absolute top-0 right-0 p-8 bg-white/10 rounded-full -mr-8 -mt-8 w-32 h-32 blur-2xl"></div>
                    <div className="relative z-10 flex justify-between items-start">
                        <div>
                            <h2 className="headline-small font-bold">{transportItem?.dettaglio || "Biglietto"}</h2>
                            <div className="flex gap-3 text-sm font-medium opacity-90 mt-1">
                                {transportItem?.data && <span className="flex items-center gap-1"><Calendar size={14} /> {transportItem.data}</span>}
                                {transportItem?.ora && <span className="flex items-center gap-1"><Clock size={14} /> {transportItem.ora}</span>}
                            </div>
                        </div>
                        <div className="w-12 h-12 rounded-[16px] bg-white/20 backdrop-blur-md flex items-center justify-center">
                            <TransportIcon size={24} />
                        </div>
                    </div>
                </div>

                {/* Dashed Separator */}
                <div className="relative flex items-center justify-between -mt-3 px-0 z-10">
                    <div className="w-4 h-8 rounded-r-full bg-black/95"></div>
                    <div className="flex-1 border-b-2 border-dashed border-gray-300 mx-2"></div>
                    <div className="w-4 h-8 rounded-l-full bg-black/95"></div>
                </div>

                {/* QR Section */}
                <div className="p-8 flex flex-col items-center justify-center bg-white flex-1 min-h-[300px]">
                    <div ref={qrRef} className="p-4 bg-white border-2 border-gray-100 rounded-2xl shadow-sm mb-4"></div>
                    <p className="text-xs text-gray-400 font-mono text-center max-w-[200px] break-all">
                        {ticketData}
                    </p>
                </div>

                {/* Footer Actions */}
                <div className="bg-gray-50 p-4 border-t border-gray-100 flex justify-between items-center">
                    <button onClick={onClose} className="p-3 hover:bg-gray-200 rounded-full text-gray-600 transition-colors">
                        <X size={24} />
                    </button>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">SCANSIONAMI</span>
                    <button className="p-3 hover:bg-gray-200 rounded-full text-gray-600 transition-colors opacity-0 pointer-events-none">
                        <Share2 size={24} />
                    </button>
                </div>
            </div>

            <p className="text-white/70 mt-4 text-sm font-medium">Luminosità schermo consigliata: 100%</p>
        </div>
    );
};

window.TicketView = TicketView;
