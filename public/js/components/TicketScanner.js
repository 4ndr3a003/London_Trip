const TicketScanner = ({ onScan, onClose }) => {
    const { X, Image, UploadCloud, Camera, RefreshCw } = window; // Added RefreshCw for switch camera if needed, or just cleaner icons
    const [loading, setLoading] = React.useState(false);
    const [isCameraOpen, setIsCameraOpen] = React.useState(false);
    const videoRef = React.useRef(null);
    const streamRef = React.useRef(null);

    React.useEffect(() => {
        return () => {
            stopCamera();
        };
    }, []);

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        setIsCameraOpen(false);
    };

    const startCamera = async () => {
        setLoading(true);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            });
            streamRef.current = stream;

            // Wait for video ref to be available
            setIsCameraOpen(true);

            // Small timeout to allow render
            setTimeout(() => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.play();
                }
            }, 100);

        } catch (err) {
            console.error("Camera Error:", err);
            alert("Impossibile accedere alla fotocamera. Verifica i permessi.");
            setIsCameraOpen(false);
        } finally {
            setLoading(false);
        }
    };

    const capturePhoto = () => {
        if (!videoRef.current) return;

        const video = videoRef.current;
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const context = canvas.getContext('2d');
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        const base64 = canvas.toDataURL('image/jpeg', 0.8);
        stopCamera();
        onScan(base64);
    };

    const handleFileChange = async (e) => {
        if (e.target.files.length === 0) return;
        const file = e.target.files[0];
        setLoading(true);
        try {
            const base64 = await readFileAsBase64(file);
            onScan(base64);
        } catch (err) {
            console.error(err);
            alert("Errore caricamento immagine");
        } finally {
            setLoading(false);
        }
    };

    const readFileAsBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    return (
        <div className="fixed inset-0 z-[60] bg-black/95 flex flex-col items-center justify-center p-4 backdrop-blur-sm animate-in fade-in zoom-in duration-300">
            <div className={`bg-[var(--md-sys-color-surface)] w-full max-w-md rounded-[28px] overflow-hidden shadow-2xl relative flex flex-col ${isCameraOpen ? 'h-full max-h-[80vh]' : ''}`}>

                {/* Header */}
                <div className="p-4 border-b border-[var(--md-sys-color-outline-variant)] flex justify-between items-center bg-[var(--md-sys-color-surface-container)] z-10">
                    <h3 className="title-large font-bold text-[var(--md-sys-color-on-surface)]">
                        {isCameraOpen ? "Scatta Foto" : "Carica Biglietto"}
                    </h3>
                    <button onClick={() => { stopCamera(); onClose(); }} className="p-2 hover:bg-[var(--md-sys-color-surface-variant)] rounded-full transition-colors">
                        <X size={24} className="text-[var(--md-sys-color-on-surface)]" />
                    </button>
                </div>

                <div className="flex-1 overflow-hidden relative flex flex-col items-center justify-center bg-black">
                    {activeMode()}
                </div>
            </div>
        </div>
    );

    function activeMode() {
        if (loading) {
            return (
                <div className="flex flex-col items-center p-8 bg-[var(--md-sys-color-surface)] w-full h-full justify-center">
                    <div className="w-12 h-12 border-4 border-[var(--md-sys-color-primary)] border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-[var(--md-sys-color-on-surface)]">Caricamento...</p>
                </div>
            );
        }

        if (isCameraOpen) {
            return (
                <div className="relative w-full h-full flex flex-col bg-black">
                    <video
                        ref={videoRef}
                        className="w-full h-full object-cover"
                        autoPlay
                        playsInline
                        muted
                    />

                    {/* Camera Controls Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 flex justify-center items-center gap-8 bg-gradient-to-t from-black/80 to-transparent">
                        <button
                            onClick={stopCamera}
                            className="p-3 rounded-full bg-white/20 text-white backdrop-blur-md hover:bg-white/30 transition-all"
                        >
                            <X size={24} />
                        </button>

                        <button
                            onClick={capturePhoto}
                            className="w-16 h-16 rounded-full bg-white border-4 border-[var(--md-sys-color-primary)] flex items-center justify-center shadow-lg active:scale-95 transition-all"
                        >
                            <div className="w-12 h-12 rounded-full bg-transparent border-2 border-gray-300"></div>
                        </button>

                        <div className="w-12"></div> {/* Spacer for balance */}
                    </div>
                </div>
            );
        }

        return (
            <div className="p-8 flex flex-col items-center gap-6 w-full h-full bg-[var(--md-sys-color-surface)] overflow-y-auto">

                {/* Option 1: Camera */}
                <button
                    onClick={startCamera}
                    className="flex flex-col items-center justify-center gap-3 p-8 w-full rounded-[24px] bg-[var(--md-sys-color-primary-container)] text-[var(--md-sys-color-on-primary-container)] hover:shadow-lg transition-all active:scale-[0.98]"
                >
                    <div className="w-16 h-16 rounded-full bg-[var(--md-sys-color-on-primary-container)] text-[var(--md-sys-color-primary-container)] flex items-center justify-center mb-2">
                        <Camera size={32} />
                    </div>
                    <div className="text-center">
                        <span className="font-bold text-xl block">Scatta Foto</span>
                        <span className="text-sm opacity-80">Usa la fotocamera</span>
                    </div>
                </button>

                <div className="w-full flex items-center gap-4 opacity-50">
                    <div className="h-px bg-gray-400 flex-1"></div>
                    <span className="text-xs uppercase font-bold text-gray-500">oppure</span>
                    <div className="h-px bg-gray-400 flex-1"></div>
                </div>

                {/* Option 2: Upload */}
                <label className="flex flex-col items-center justify-center gap-3 p-8 w-full rounded-[24px] bg-[var(--md-sys-color-surface-container-high)] border-2 border-dashed border-[var(--md-sys-color-outline)] hover:border-[var(--md-sys-color-primary)] hover:bg-[var(--md-sys-color-surface-container-highest)] transition-all cursor-pointer active:scale-[0.98]">
                    <UploadCloud size={40} className="text-[var(--md-sys-color-primary)]" />
                    <div className="text-center">
                        <span className="font-bold text-lg block text-[var(--md-sys-color-on-surface)]">Carica File</span>
                        <span className="text-sm text-[var(--md-sys-color-on-surface-variant)]">Galleria, Screenshot...</span>
                    </div>
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                </label>
            </div>
        );
    }
};

window.TicketScanner = TicketScanner;
