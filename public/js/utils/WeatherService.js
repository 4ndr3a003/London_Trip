const WeatherService = {
    // Default to London if no coordinates provided
    DEFAULT_LAT: 51.5074,
    DEFAULT_LON: -0.1278,

    async fetchWeather(lat, lon) {
        const apiKey = window.OPEN_WEATHER_API_KEY;
        if (!apiKey || apiKey === "") {
            console.warn("OpenWeatherMap API Key missing");
            return { error: true, message: "Chiave API Mancante" };
        }

        const latitude = lat || this.DEFAULT_LAT;
        const longitude = lon || this.DEFAULT_LON;

        try {
            // Fallback to Standard Forecast 5 Day / 3 Hour API (Free Tier compatible)
            // One Call 3.0 requires explicit subscription even for free tier usage
            const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&exclude=minutely,hourly,alerts&units=metric&lang=it&appid=${apiKey}`);

            if (!response.ok) {
                console.error(`Weather API Error: ${response.status} ${response.statusText}`);
                // Changed: Return error instead of mock data
                return { error: true, message: "Meteo non disponibile" };
            }
            const data = await response.json();

            // Process 3-hour data into Daily Summary
            const dailyMap = {};
            data.list.forEach(item => {
                const date = item.dt_txt.split(' ')[0]; // YYYY-MM-DD
                if (!dailyMap[date]) {
                    dailyMap[date] = {
                        dt: item.dt,
                        temp_min: item.main.temp_min,
                        temp_max: item.main.temp_max,
                        weather: item.weather[0],
                        uvi: 0 // Forecast API doesn't provide UV, assumed 0
                    };
                } else {
                    dailyMap[date].temp_min = Math.min(dailyMap[date].temp_min, item.main.temp_min);
                    dailyMap[date].temp_max = Math.max(dailyMap[date].temp_max, item.main.temp_max);
                    // Take weather icon from noon-ish (e.g. 12:00) or keep first
                    if (item.dt_txt.includes("12:00:00")) {
                        dailyMap[date].weather = item.weather[0];
                    }
                }
            });

            // Convert back to array
            const daily = Object.values(dailyMap);

            // Mimic One Call structure for compatibility
            return { daily };

        } catch (error) {
            console.error("Error fetching weather:", error);
            // Changed: Return error instead of mock data
            return { error: true, message: "Meteo non disponibile" };
        }
    },

    getMockData() {
        const today = new Date();
        const daily = [];
        for (let i = 0; i < 5; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            const dateStr = date.toISOString().split('T')[0];

            // Simulate Rain on 2nd day
            const isRain = i === 1;

            daily.push({
                dt: Math.floor(date.getTime() / 1000),
                temp_min: 10 + i,
                temp_max: 15 + i,
                weather: {
                    id: isRain ? 500 : 800,
                    main: isRain ? "Rain" : "Clear",
                    description: isRain ? "pioggia leggera" : "cielo sereno",
                    icon: isRain ? "10d" : "01d"
                }
            });
        }
        return { daily };
    },

    /**
     * Analyzes weather data to suggest packing items.
     * @param {Object} weatherData - The processed Daily API responses
     * @returns {Array} List of suggested items { item: "Name", reason: "Reason", icon: "Icon" }
     */
    getPackingSuggestions(weatherData) {
        if (!weatherData || !weatherData.daily) return [];

        const suggestions = [];
        const daily = weatherData.daily;

        let rainForecast = false;
        let snowForecast = false;
        let veryCold = false;
        let veryHot = false;

        // UV not available in standard forecast, skipping UV checks

        daily.forEach(day => {
            const weatherId = day.weather.id;
            const tempMin = day.temp_min;
            const tempMax = day.temp_max;

            // Rain: 2xx, 3xx, 5xx
            if (weatherId >= 200 && weatherId < 600) rainForecast = true;
            // Snow: 6xx
            if (weatherId >= 600 && weatherId < 700) snowForecast = true;

            if (tempMin < 5) veryCold = true;
            if (tempMax > 28) veryHot = true;
        });

        if (rainForecast) {
            suggestions.push({ item: "Ombrello", category: "Accessori", reason: "Pioggia prevista", icon: "☔" });
            suggestions.push({ item: "K-Way", category: "Abbigliamento", reason: "Possibile pioggia", icon: "🧥" });
        }
        if (snowForecast) {
            suggestions.push({ item: "Guanti", category: "Abbigliamento", reason: "Neve prevista", icon: "🧤" });
            suggestions.push({ item: "Sciarpa", category: "Abbigliamento", reason: "Neve prevista", icon: "🧣" });
        }
        if (veryCold) {
            suggestions.push({ item: "Berretto", category: "Abbigliamento", reason: "Temperature basse", icon: "🧢" });
            suggestions.push({ item: "Maglia Termica", category: "Abbigliamento", reason: "Fa freddo!", icon: "👕" });
        }
        if (veryHot) {
            suggestions.push({ item: "Ventaglio", category: "Accessori", reason: "Temperature alte", icon: "🪭" });
        }
        // UV check removed for standard API

        return suggestions;
    },

    /**
     * Gets a simple summary for the dashboard
     */
    getForecastSummary(weatherData) {
        if (!weatherData || !weatherData.daily) return null;
        // Just return the next 3 days
        return weatherData.daily.slice(0, 3).map(day => ({
            date: new Date(day.dt * 1000).toLocaleDateString("it-IT", { weekday: 'short', day: 'numeric' }),
            icon: `https://openweathermap.org/img/wn/${day.weather.icon}@2x.png`,
            tempMax: Math.round(day.temp_max),
            tempMin: Math.round(day.temp_min),
            description: day.weather.description
        }));
    }
};

window.WeatherService = WeatherService;
