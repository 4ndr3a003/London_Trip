
const GeminiScanner = {
    scanReceipt: async (file) => {
        const apiKey = window.GEMINI_API_KEY;
        if (!apiKey || apiKey.includes("YOUR_")) {
            alert("Per usare lo scanner, inserisci la tua API Key di Gemini in Config.js");
            return null;
        }

        try {
            // Convert file to Base64
            const reader = new FileReader();
            const base64Promise = new Promise((resolve) => {
                reader.onload = (e) => resolve(e.target.result.split(',')[1]); // Remove data:image/jpeg;base64, prefix
                reader.readAsDataURL(file);
            });
            const base64Data = await base64Promise;

            // Prepare Payload
            const payload = {
                contents: [{
                    parts: [
                        { text: "Analizza questa foto di uno scontrino. Estrai: 1. Totale (numero), 2. Data (YYYY-MM-DD), 3. Nome Negozio/Descrizione breve. Rispondi SOLO con un JSON valido in questo formato: { \"costo\": 12.50, \"data\": \"2024-05-20\", \"item\": \"Nome Negozio\" }. Se non trovi la data usa la data di oggi." },
                        { inline_data: { mime_type: file.type || "image/jpeg", data: base64Data } }
                    ]
                }]
            };

            // Call API
            // Using gemini-1.5-flash for speed and efficiency
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (data.candidates && data.candidates[0].content && data.candidates[0].content.parts) {
                const text = data.candidates[0].content.parts[0].text;
                // Clean up markdown fences if present
                const jsonText = text.replace(/```json/g, '').replace(/```/g, '').trim();
                return JSON.parse(jsonText);
            } else {
                console.error("Gemini Scan Error", data);
                if (data.error) alert("Errore Gemini API: " + data.error.message);
                return null;
            }
        } catch (error) {
            console.error(error);
            alert("Errore durante la scansione: " + error.message);
            return null;
        }
    }
};

window.GeminiScanner = GeminiScanner;
