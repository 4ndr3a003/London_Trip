const TicketScanner = ({ onScan, onClose }) => {
    const [mode, setMode] = React.useState('initial'); // initial, camera, file
    const [error, setError] = React.useState(null);
    const [scanning, setScanning] = React.useState(false);

    // Camera Scan
    const startCamera = () => {
        setMode('camera');
        setScanning(true);
        setError(null);
        // Add a slight delay to ensure the DOM element exists
        setTimeout(() => {
            const html5QrCode = new Html5Qrcode("reader");
            const config = { fps: 10, qrbox: { width: 250, height: 250 } };

            html5QrCode.start(
                { facingMode: "environment" },
                config,
                (decodedText, decodedResult) => {
                    // Success
                    html5QrCode.stop().then(() => {
                        onScan(decodedText);
                    });
                },
                (errorMessage) => {
                    // Parse error, ignore usually
                }
            ).catch(err => {
                setError("Errore avvio fotocamera: " + err);
                setScanning(false);
            });

            // Store instance to stop later if needed
            window.currentQrScanner = html5QrCode;
        }, 100);
    };

    // File Scan
    const handleFileChange = (e) => {
        if (e.target.files.length === 0) return;

        const imageFile = e.target.files[0];
        const html5QrCode = new Html5Qrcode("reader");

        // Render image locally to show user? No need, just scan.
        setMode('processing');

        html5QrCode.scanFile(imageFile, true)
            .then(decodedText => {
                onScan(decodedText);
            })
            .catch(err => {
                setError("Nessun QR code trovato nell'immagine.");
                setMode('initial');
            });
    };

    // Cleanup
    React.useEffect(() => {
        return () => {
            if (window.currentQrScanner && window.currentQrScanner.isScanning) {
                window.currentQrScanner.stop().catch(console.error);
            }
        };
    }, []);

    const { Button, X, Camera, Image, AlertCircle } = window;

    return (
        <div className="fixed inset-0 z-[60] bg-black/90 flex flex-col items-center justify-center p-4 backdrop-blur-sm animation-fade-in">
            <div className="bg-[var(--md-sys-color-surface)] w-full max-w-md rounded-[28px] overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="p-4 border-b border-[var(--md-sys-color-outline-variant)] flex justify-between items-center bg-[var(--md-sys-color-surface-container)]">
                    <h3 className="title-large font-bold text-[var(--md-sys-color-on-surface)]">Scansiona Biglietto</h3>
                    <button onClick={onClose} className="p-2 hover:bg-[var(--md-sys-color-surface-variant)] rounded-full transition-colors">
                        <X size={24} className="text-[var(--md-sys-color-on-surface)]" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col items-center gap-6 flex-1 overflow-y-auto">

                    {error && (
                        <div className="w-full bg-red-100 text-red-900 p-3 rounded-lg flex items-center gap-2 text-sm font-medium">
                            <AlertCircle size={18} /> {error}
                        </div>
                    )}

                    {mode === 'initial' && (
                        <div className="grid grid-cols-2 gap-4 w-full">
                            <button
                                onClick={startCamera}
                                className="flex flex-col items-center justify-center gap-3 p-6 rounded-[24px] bg-[var(--md-sys-color-secondary-container)] text-[var(--md-sys-color-on-secondary-container)] hover:shadow-lg transition-all active:scale-95 aspect-square"
                            >
                                <Camera size={48} />
                                <span className="font-bold text-lg">Fotocamera</span>
                            </button>

                            <label className="flex flex-col items-center justify-center gap-3 p-6 rounded-[24px] bg-[var(--md-sys-color-tertiary-container)] text-[var(--md-sys-color-on-tertiary-container)] hover:shadow-lg transition-all active:scale-95 aspect-square cursor-pointer">
                                <Image size={48} />
                                <span className="font-bold text-lg">Galleria</span>
                                <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                            </label>
                        </div>
                    )}

                    {mode === 'camera' && (
                        <div id="reader" className="w-full h-64 bg-black rounded-xl overflow-hidden shadow-inner border-2 border-[var(--md-sys-color-primary)]"></div>
                    )}

                    {mode === 'processing' && (
                        <div className="flex flex-col items-center justify-center p-8">
                            <div className="w-12 h-12 border-4 border-[var(--md-sys-color-primary)] border-t-transparent rounded-full animate-spin mb-4"></div>
                            <p className="font-medium text-[var(--md-sys-color-on-surface-variant)]">Analisi immagine in corso...</p>
                        </div>
                    )}

                    <div className="text-center text-sm text-[var(--md-sys-color-on-surface-variant)] max-w-xs">
                        {mode === 'initial' ? "Inquadra il QR code sul biglietto o seleziona una foto dalla galleria." :
                            mode === 'camera' ? "Posiziona il QR code al centro del riquadro." : ""}
                    </div>
                </div>
            </div>
        </div>
    );
};

window.TicketScanner = TicketScanner;
