
const CameraCapture = ({ onCapture, onClose }) => {
    const videoRef = React.useRef(null);
    const canvasRef = React.useRef(null);
    const [stream, setStream] = React.useState(null);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
        startCamera();
        return () => stopCamera();
    }, []);

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "environment" },
                audio: false
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (err) {
            console.error("Camera Error:", err);
            setError("Impossibile accedere alla fotocamera. Verifica i permessi.");
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    };

    const takePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;

            // Set canvas dimensions to match video
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            // Draw
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Convert to Blob/File
            canvas.toBlob((blob) => {
                if (blob) {
                    const file = new File([blob], "receipt_capture.jpg", { type: "image/jpeg" });
                    onCapture(file);
                }
            }, 'image/jpeg', 0.9);
        }
    };

    // Global icons
    const { X, Camera, RefreshCw } = window;

    return (
        <div className="fixed inset-0 z-[1050] bg-black flex flex-col items-center justify-center animate-fade-in">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center bg-gradient-to-b from-black/60 to-transparent z-10">
                <h3 className="text-white font-bold text-lg drop-shadow-md">Scatta Scontrino</h3>
                <button onClick={onClose} className="p-2 bg-black/30 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all">
                    <X size={24} />
                </button>
            </div>

            {/* Viewport */}
            <div className="relative w-full h-full flex items-center justify-center bg-black overflow-hidden">
                {error ? (
                    <div className="text-white text-center p-6 bg-red-900/50 rounded-xl mx-4 backdrop-blur-sm border border-red-500/30">
                        <p className="font-bold mb-2">Errore Fotocamera</p>
                        <p className="text-sm opacity-80">{error}</p>
                        <button onClick={onClose} className="mt-4 px-4 py-2 bg-white text-black rounded-lg text-sm font-bold">Chiudi</button>
                    </div>
                ) : (
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                )}

                {/* Visual Guide Overlay */}
                {!error && (
                    <div className="absolute inset-0 border-[40px] border-black/50 pointer-events-none flex items-center justify-center">
                        <div className="w-full h-full border-2 border-white/50 relative">
                            {/* Corners */}
                            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white"></div>
                            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white"></div>
                            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white"></div>
                            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white"></div>
                        </div>
                    </div>
                )}
            </div>

            {/* Controls */}
            {!error && (
                <div className="absolute bottom-0 left-0 right-0 p-8 pb-12 flex justify-center items-center bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10">
                    <button
                        onClick={takePhoto}
                        className="w-20 h-20 rounded-full bg-white border-4 border-gray-300 flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95 transition-all"
                    >
                        <div className="w-16 h-16 rounded-full bg-white border-2 border-black/10"></div>
                    </button>
                </div>
            )}

            {/* Hidden Canvas for capture */}
            <canvas ref={canvasRef} className="hidden"></canvas>
        </div>
    );
};

window.CameraCapture = CameraCapture;
