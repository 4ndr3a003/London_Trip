const { HashRouter, Routes, Route, Navigate } = ReactRouterDOM;

// Simple Error Boundary Component
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ error, errorInfo });
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="p-6 bg-red-50 text-red-900 border border-red-200 rounded-lg m-4">
                    <h1 className="text-xl font-bold mb-2">Qualcosa è andato storto.</h1>
                    <p className="font-mono text-sm bg-white p-2 border rounded overflow-auto">
                        {this.state.error && this.state.error.toString()}
                    </p>
                    <details className="mt-2 text-xs font-mono whitespace-pre-wrap">
                        {this.state.errorInfo && this.state.errorInfo.componentStack}
                    </details>
                    <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                        Ricarica Pagina
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

const App = () => {
    const LandingPage = window.LandingPage;
    const TripDashboard = window.TripDashboard;
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const checkComponents = () => {
            const lp = window.LandingPage;
            const td = window.TripDashboard;

            if (lp && td) {
                console.log("Components loaded successfully.");
                setLoading(false);
                return true;
            }
            console.warn("Waiting for components...", { LandingPage: !!lp, TripDashboard: !!td });
            return false;
        };

        // Check immediately
        if (checkComponents()) return;

        // Retry every 100ms for up to 2 seconds
        const intervalId = setInterval(() => {
            if (checkComponents()) {
                clearInterval(intervalId);
            }
        }, 100);

        const timeoutId = setTimeout(() => {
            clearInterval(intervalId);
            console.error("Component loading timed out.", {
                LandingPage: !!window.LandingPage,
                TripDashboard: !!window.TripDashboard,
                React: !!window.React,
                ReactDOM: !!window.ReactDOM,
                ReactRouterDOM: !!window.ReactRouterDOM
            });
            setLoading(false); // Stop loading to show error screen
        }, 2000);

        return () => {
            clearInterval(intervalId);
            clearTimeout(timeoutId);
        };
    }, []);

    if (loading) return <div className="p-10 text-center">Inizializzazione in corso...</div>;

    if (!LandingPage || !TripDashboard) {
        return (
            <div className="p-10 text-center text-red-600">
                <h1 className="font-bold">Errore Critico</h1>
                <p>Componenti non caricati correttamente.</p>
                <div className="text-left inline-block mt-4 p-4 bg-gray-100 rounded text-xs font-mono">
                    <p>Debug Info:</p>
                    <p>LandingPage: {window.LandingPage ? "OK" : "Mancante"}</p>
                    <p>TripDashboard: {window.TripDashboard ? "OK" : "Mancante"}</p>
                    <p>React: {window.React ? "OK" : "Mancante"}</p>
                    <p>ReactDOM: {window.ReactDOM ? "OK" : "Mancante"}</p>
                </div>
                <p className="mt-4 text-sm text-gray-500">Controlla la console per maggiori dettagli.</p>
                <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Riprova</button>
            </div>
        );
    }

    return (
        <ErrorBoundary>
            <HashRouter>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/trip/:tripId" element={<Navigate to="itinerary" replace />} />
                    <Route path="/trip/:tripId/:tab" element={<TripDashboard />} />
                </Routes>
            </HashRouter>
        </ErrorBoundary>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
