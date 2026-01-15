const { useState, useEffect } = React;
const DocumentsTab = ({ tripId, tripDetails }) => {
    const {
        Card, FileText, LinkIcon, Trash, Database, RefreshCw, Plus, AlertTriangle, LogIn
    } = window;
    const [driveFiles, setDriveFiles] = useState([]);
    const [userEmail, setUserEmail] = useState(null);
    const [driveConnected, setDriveConnected] = useState(false); // Connected means we have an email/account associated
    const [needsReauth, setNeedsReauth] = useState(false); // True if token is expired
    const [gapiInited, setGapiInited] = useState(false);
    const [gisInited, setGisInited] = useState(false);
    const [tokenClient, setTokenClient] = useState(null);
    const [uploading, setUploading] = useState(false);

    // --- GOOGLE DRIVE INTEGRATION ---
    useEffect(() => {
        const initGapi = () => {
            if (typeof gapi === 'undefined') {
                setTimeout(initGapi, 500);
                return;
            }
            gapi.load('client', async () => {
                try {
                    await gapi.client.init({
                        apiKey: window.API_KEY,
                    });
                    await gapi.client.load('drive', 'v3');
                    await gapi.client.load('oauth2', 'v2');
                    setGapiInited(true);

                    // --- CHECK FOR STORED TOKEN ---
                    const storedToken = localStorage.getItem("google_access_token_full");
                    const storedExpiry = localStorage.getItem("google_token_expiry_full");
                    const storedEmail = localStorage.getItem("google_user_email");
                    const now = Date.now();

                    if (storedEmail) {
                        setUserEmail(storedEmail);
                        setDriveConnected(true); // We are "connected" in terms of knowing who the user is
                    }

                    if (storedToken && storedExpiry) {
                        if (now < parseInt(storedExpiry)) {
                            console.log("Restoring Google Token from Storage...");
                            gapi.client.setToken({ access_token: storedToken });
                            setNeedsReauth(false);
                        } else {
                            console.log("Token expired. Needs re-auth.");
                            setNeedsReauth(true);
                        }
                    } else if (storedEmail) {
                        // We have an email but no token/expiry (rare, but possible)
                        setNeedsReauth(true);
                    } else {
                        // No token, no email. Clean state.
                        setDriveConnected(false);
                    }

                } catch (error) {
                    console.error("GAPI Init Error:", error);
                    alert("Errore inizializzazione Google Drive: " + JSON.stringify(error));
                }
            });
        };

        const initGis = () => {
            if (typeof google === 'undefined') {
                setTimeout(initGis, 500);
                return;
            }
            const client = google.accounts.oauth2.initTokenClient({
                client_id: window.CLIENT_ID,
                scope: window.SCOPES,
                callback: (tokenResponse) => {
                    if (tokenResponse && tokenResponse.access_token) {
                        const expiresIn = tokenResponse.expires_in; // seconds
                        const expiryTime = Date.now() + (expiresIn * 1000);

                        localStorage.setItem("google_access_token_full", tokenResponse.access_token);
                        localStorage.setItem("google_token_expiry_full", expiryTime);

                        setDriveConnected(true);
                        setNeedsReauth(false);

                        // Force a reload of files immediately after successful auth
                        // We use a slight delay to ensure state and gapi client are ready
                        setTimeout(() => {
                            if (gapi.client.getToken()) {
                                loadDriveFiles();
                                fetchUserProfile();
                            }
                        }, 500);
                    }
                },
            });
            setTokenClient(client);
            setGisInited(true);
        };

        if (tripDetails && tripDetails.title) {
            initGapi();
            initGis();
        }
    }, [tripDetails]); // Run when tripDetails (title) changes

    // --- EFFECT TO LOAD FILES WHEN CONNECTED & VALID ---
    useEffect(() => {
        if (driveConnected && gapiInited && !needsReauth) {
            loadDriveFiles();
        }
    }, [driveConnected, gapiInited, needsReauth]);

    const isTokenValid = () => {
        const storedExpiry = localStorage.getItem("google_token_expiry_full");
        const now = Date.now();
        return storedExpiry && now < parseInt(storedExpiry);
    };

    const fetchUserProfile = async () => {
        try {
            if (!isTokenValid()) {
                setNeedsReauth(true);
                return;
            }
            const userInfo = await gapi.client.oauth2.userinfo.get();
            const email = userInfo.result.email;
            console.log("User Email fetched:", email);
            setUserEmail(email);
            localStorage.setItem("google_user_email", email);
        } catch (error) {
            console.error("Error fetching user profile:", error);
            // Don't disconnect here, just maybe mark as needing check
            if (error.status === 401) setNeedsReauth(true);
        }
    };

    const handleDisconnectDrive = () => {
        setDriveConnected(false);
        setDriveFiles([]);
        setUserEmail(null);
        setNeedsReauth(false);
        localStorage.removeItem("google_access_token_full");
        localStorage.removeItem("google_token_expiry_full");
        localStorage.removeItem("google_user_email");
    };

    // --- DRIVE HELPERS ---
    const findOrCreateFolder = async (folderName, parentId = 'root', searchGlobal = false) => {
        const queryStrict = `(mimeType='application/vnd.google-apps.folder' or mimeType='application/vnd.google-apps.shortcut') and name='${folderName}' and '${parentId}' in parents and trashed=false`;

        let response = await gapi.client.drive.files.list({
            q: queryStrict,
            fields: 'files(id, name, mimeType, shortcutDetails)',
            spaces: 'drive',
        });

        if (response.result.files.length > 0) {
            const file = response.result.files[0];
            if (file.mimeType === 'application/vnd.google-apps.shortcut' && file.shortcutDetails) {
                return file.shortcutDetails.targetId;
            }
            return file.id;
        }

        if (searchGlobal) {
            const queryGlobal = `(mimeType='application/vnd.google-apps.folder' or mimeType='application/vnd.google-apps.shortcut') and name='${folderName}' and trashed=false`;
            response = await gapi.client.drive.files.list({
                q: queryGlobal,
                fields: 'files(id, name, mimeType, shortcutDetails)',
                spaces: 'drive',
            });

            if (response.result.files.length > 0) {
                const file = response.result.files[0];
                if (file.mimeType === 'application/vnd.google-apps.shortcut' && file.shortcutDetails) {
                    return file.shortcutDetails.targetId;
                }
                return file.id;
            }
        }

        const fileMetadata = {
            'name': folderName,
            'mimeType': 'application/vnd.google-apps.folder',
            'parents': [parentId]
        };
        const file = await gapi.client.drive.files.create({
            resource: fileMetadata,
            fields: 'id'
        });
        return file.result.id;
    };

    const getTargetFolderId = async () => {
        const appFolderId = await findOrCreateFolder("Applicazioni", 'root', true);
        const plannerFolderId = await findOrCreateFolder("Trip Planner", appFolderId);
        const tripFolderId = await findOrCreateFolder(tripDetails.title, plannerFolderId);
        return tripFolderId;
    };

    const loadDriveFiles = async () => {
        if (!isTokenValid()) {
            console.log("Token expired during loadDriveFiles, requesting reauth");
            setNeedsReauth(true);
            return;
        }

        try {
            const folderId = await getTargetFolderId();
            const response = await gapi.client.drive.files.list({
                q: `'${folderId}' in parents and trashed=false`,
                fields: 'files(id, name, webViewLink, iconLink, thumbnailLink)',
            });
            setDriveFiles(response.result.files);
            setNeedsReauth(false); // Successful load means token is good
        } catch (err) {
            console.error("Error loading drive files", err);
            if (err.status === 401) {
                setNeedsReauth(true);
            }
        }
    };

    const handleConnectDrive = () => {
        if (tokenClient) {
            // Hint email/prompt to make flow smoother
            const config = { prompt: '' };
            if (userEmail) config.hint = userEmail;

            tokenClient.requestAccessToken(config);
        }
    };

    const handleUploadFile = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        if (!isTokenValid()) {
            setNeedsReauth(true);
            alert("Sessione scaduta. Clicca su 'Riprendi Sessione' per continuare.");
            return;
        }

        setUploading(true);
        try {
            const folderId = await getTargetFolderId();

            const metadata = {
                'name': file.name,
                'parents': [folderId]
            };

            const accessToken = gapi.auth.getToken().access_token;
            const form = new FormData();
            form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
            form.append('file', file);

            await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
                method: 'POST',
                headers: new Headers({ 'Authorization': 'Bearer ' + accessToken }),
                body: form
            });

            await loadDriveFiles();
        } catch (error) {
            console.error("Upload error", error);
            if (error.status === 401) setNeedsReauth(true);
            else alert("Errore durante il caricamento");
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteDriveFile = async (fileId) => {
        if (!isTokenValid()) {
            setNeedsReauth(true);
            return;
        }

        if (!confirm("Sei sicuro di voler eliminare questo file da Drive?")) return;
        try {
            await gapi.client.drive.files.delete({ fileId: fileId });
            setDriveFiles(prev => prev.filter(f => f.id !== fileId));
        } catch (err) {
            console.error("Delete error", err);
            if (err.status === 401) setNeedsReauth(true);
        }
    };

    return (
        <div className="space-y-4">
            {!driveConnected ? (
                // --- INITIAL VIEW NOT CONNECTED ---
                <div className="flex flex-col items-center justify-center py-12 text-center space-y-4 bg-[var(--md-sys-color-surface-container-low)] rounded-[24px] border border-[var(--md-sys-color-outline-variant)] shadow-sm">
                    <div className="bg-[var(--md-sys-color-secondary-container)] p-4 rounded-full">
                        <Database size={32} className="text-[var(--md-sys-color-on-secondary-container)]" />
                    </div>
                    <div>
                        <h3 className="headline-small font-bold text-[var(--md-sys-color-on-surface)]">Google Drive Sync</h3>
                        <p className="text-[var(--md-sys-color-on-surface-variant)] text-sm max-w-xs mx-auto mt-2">Connetti il tuo account Google per gestire i documenti del viaggio direttamente in una cartella dedicata.</p>
                    </div>
                    <button
                        onClick={handleConnectDrive}
                        disabled={!gapiInited || !gisInited}
                        className="bg-[var(--md-sys-color-primary)] hover:bg-[var(--md-sys-color-primary)]/90 text-[var(--md-sys-color-on-primary)] font-bold py-3 px-6 rounded-full flex items-center gap-2 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {(!gapiInited || !gisInited) ? 'Caricamento...' : 'Connetti Google Drive'}
                    </button>
                    <p className="text-[10px] text-[var(--md-sys-color-outline)]">Salva in: Applicazioni / Trip Planner / {tripDetails.title}</p>
                </div>
            ) : (
                // --- CONNECTED VIEW ---
                <>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="title-medium font-bold text-[var(--md-sys-color-on-surface)] flex items-center gap-2">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/1/12/Google_Drive_icon_%282020%29.svg" alt="Drive" className="w-5 h-5" />
                            Documenti Drive
                        </h3>
                        {needsReauth ? (
                            <span className="text-[var(--md-sys-color-error)] text-xs font-bold flex items-center gap-1">
                                <AlertTriangle size={14} /> Sessione Scaduta
                            </span>
                        ) : (
                            <label className={`bg-[var(--md-sys-color-primary-container)] text-[var(--md-sys-color-on-primary-container)] px-4 py-2 rounded-full text-xs font-bold hover:brightness-95 transition-all cursor-pointer flex items-center gap-2 shadow-sm ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                {uploading ? <RefreshCw size={14} className="animate-spin" /> : <Plus size={14} />}
                                {uploading ? 'Caricamento...' : 'Carica File'}
                                <input type="file" className="hidden" onChange={handleUploadFile} disabled={uploading} />
                            </label>
                        )}
                    </div>

                    {/* --- REAUTH / DISCONNECTED STATE OVERLAY/MESSAGE --- */}
                    {needsReauth && (
                        <div className="bg-[var(--md-sys-color-error-container)] text-[var(--md-sys-color-on-error-container)] p-4 rounded-[16px] mb-4 flex items-center justify-between border border-[var(--md-sys-color-error)] border-opacity-20 animate-in fade-in slide-in-from-top-2">
                            <div className="flex items-center gap-3">
                                <AlertTriangle size={20} />
                                <div>
                                    <p className="font-bold text-sm">La sessione è scaduta</p>
                                    <p className="text-xs opacity-80">Riconnettiti per visualizzare e caricare i file.</p>
                                </div>
                            </div>
                            <button
                                onClick={handleConnectDrive}
                                className="bg-[var(--md-sys-color-error)] text-[var(--md-sys-color-on-error)] px-4 py-2 rounded-full text-xs font-bold hover:brightness-110 flex items-center gap-2"
                            >
                                <LogIn size={14} /> Riprendi Sessione
                            </button>
                        </div>
                    )}

                    {!needsReauth && driveFiles.length === 0 && (
                        <div className="text-center py-12 opacity-60 bg-[var(--md-sys-color-surface-container-low)] rounded-[24px] border border-dashed border-[var(--md-sys-color-outline-variant)]">
                            <FileText size={48} className="mx-auto mb-2 text-[var(--md-sys-color-on-surface-variant)]" />
                            <p className="text-[var(--md-sys-color-on-surface-variant)] text-sm">Cartella vuota</p>
                            <p className="text-[10px] text-[var(--md-sys-color-outline)] mt-1">Carica il tuo primo documento</p>
                        </div>
                    )}

                    {!needsReauth && driveFiles.length > 0 && (
                        <div className="grid grid-cols-1 gap-3">
                            {driveFiles.map(file => (
                                <div key={file.id} className="bg-[var(--md-sys-color-surface-container-low)] p-3 rounded-[16px] shadow-sm border border-[var(--md-sys-color-outline-variant)] hover:shadow-md transition-all group">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className="bg-[var(--md-sys-color-surface-container-high)] p-2 rounded-lg shrink-0 text-[var(--md-sys-color-on-surface-variant)]">
                                                <FileText size={20} />
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="font-bold text-[var(--md-sys-color-on-surface)] text-sm truncate pr-2" title={file.name}>{file.name}</h4>
                                                <a href={`${file.webViewLink}${userEmail ? `&authuser=${userEmail}` : ''}`} target="_blank" rel="noopener noreferrer" className="text-[10px] text-[var(--md-sys-color-primary)] hover:underline flex items-center gap-1 font-bold">
                                                    Apri su Drive <LinkIcon size={10} />
                                                </a>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteDriveFile(file.id)}
                                            className="p-2 text-[var(--md-sys-color-on-surface-variant)] hover:bg-[#FFDAD6] hover:text-[#410002] rounded-full transition-colors"
                                            title="Elimina"
                                        >
                                            <Trash size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="text-center mt-4">
                        {!needsReauth && (
                            <button onClick={loadDriveFiles} className="text-xs text-[var(--md-sys-color-primary)] font-bold hover:underline flex items-center justify-center gap-1 mx-auto">
                                <RefreshCw size={12} /> Aggiorna Lista
                            </button>
                        )}
                        <button onClick={handleDisconnectDrive} className="mt-4 text-[10px] text-[var(--md-sys-color-error)] hover:text-[var(--md-sys-color-on-error-container)] block mx-auto underline">
                            Disconnetti Drive
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

window.DocumentsTab = DocumentsTab;
