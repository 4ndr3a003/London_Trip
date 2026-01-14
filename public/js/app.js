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
        // Simple check to see if components are loaded, retry buffer could be added here
        if (LandingPage && TripDashboard) {
            setLoading(false);
        } else {
            // If not found immediately, give it a split second in case of async race (though we are at bottom of body)
            setTimeout(() => setLoading(false), 500);
        }
    }, []);

    if (loading) return <div className="p-10 text-center">Inizializzazione...</div>;

    if (!LandingPage || !TripDashboard) {
        return (
            <div className="p-10 text-center text-red-600">
                <h1 className="font-bold">Errore Critico</h1>
                <p>Componenti non caricati correttamente.</p>
                <p>LandingPage: {LandingPage ? "OK" : "Mancante"}</p>
                <p>TripDashboard: {TripDashboard ? "OK" : "Mancante"}</p>
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
