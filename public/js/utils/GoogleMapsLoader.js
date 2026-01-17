window.GoogleMapsLoader = {
    isLoaded: false,
    isLoading: false,
    loadPromise: null,

    load: async function () {
        if (this.isLoaded) return Promise.resolve();
        if (this.isLoading) return this.loadPromise;

        this.isLoading = true;

        this.loadPromise = new Promise((resolve, reject) => {
            const apiKey = window.GOOGLE_MAPS_API_KEY || window.API_KEY;

            if (!apiKey) {
                console.error("Google Maps API Key missing in secrets.js");
                reject("API Key missing");
                return;
            }

            if (window.google && window.google.maps) {
                this.isLoaded = true;
                this.isLoading = false;
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&language=it`;
            script.async = true;
            script.defer = true;

            script.onload = () => {
                console.log("Google Maps API loaded");
                this.isLoaded = true;
                this.isLoading = false;
                resolve();
            };

            script.onerror = (err) => {
                console.error("Google Maps API load error", err);
                this.isLoading = false;
                reject(err);
            };

            document.head.appendChild(script);
        });

        return this.loadPromise;
    }
};
