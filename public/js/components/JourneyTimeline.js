const JourneyTimeline = ({ days, itinerary, transport, expenses, weatherData, onEditEvent, onAddEvent, onToggleVisit, onDeleteDay, onDeleteEvent }) => {
    const { useState, useEffect, useRef } = React;
    const { MapPin, Train, PoundSterling, Clock, Check, Plus, AlertCircle, Sun, Cloud, CloudRain, CloudSnow, Wind, Calendar, ArrowRight, Navigation, MoreVertical, Trash } = window;

    // Helper to merge and sort events for a day
    const getDayEvents = (day) => {
        const dayDate = day.data; // YYYY-MM-DD
        const formats = { weekday: 'long', day: 'numeric', month: 'long' };
        const formattedDate = new Date(dayDate).toLocaleDateString('it-IT', formats);

        // 1. Manual Events (from 'days' collection)
        const manualEvents = (day.events || []).map(e => ({
            ...e,
            source: 'manual',
            sortTime: e.time
        }));

        // 2. Transport (from 'transport' collection) - automatically mapped to day
        // transport.data is DD/MM/YYYY or YYYY-MM-DD. Need to normalize.
        // Actually, TripDashboard normalize this slightly differently, let's try to match strings.
        const dayTransport = transport.filter(t => {
            // normalizing t.data to YYYY-MM-DD for comparison
            let transDate = t.data;
            if (transDate.includes('/')) {
                const [d, m, y] = transDate.split('/');
                transDate = `${y}-${m}-${d}`;
            }
            return transDate === dayDate;
        }).map(t => ({
            id: t.id,
            type: 'transport',
            time: t.ora,
            sortTime: t.ora,
            data: t,
            source: 'transport'
        }));

        const allEvents = [...manualEvents, ...dayTransport].sort((a, b) => a.sortTime.localeCompare(b.sortTime));
        return { formattedDate, allEvents, dayId: day.id };
    };

    const getWeatherIcon = (iconName) => {
        // Simple mapping, can be expanded
        if (!iconName) return <Sun size={24} />;
        if (iconName.includes('rain')) return <CloudRain size={24} />;
        if (iconName.includes('cloud')) return <Cloud size={24} />;
        if (iconName.includes('snow')) return <CloudSnow size={24} />;
        return <Sun size={24} />;
    };

    // Styling constants
    const cardBaseClass = "relative rounded-[24px] overflow-hidden transition-all duration-300 transform";

    return (
        <div className="journey-timeline-container w-full h-[calc(100vh-180px)] overflow-x-auto overflow-y-hidden whitespace-nowrap snap-x snap-mandatory flex gap-4 px-4 pb-4 select-none scroller">
            {/* CSS for hiding scrollbar if desired, but 'scroller' class handles it usually */}
            <style>{`
                .journey-timeline-container {
                    -webkit-overflow-scrolling: touch;
                    scrollbar-width: none; /* Firefox */
                }
                .journey-timeline-container::-webkit-scrollbar {
                    display: none; /* Chrome/Safari */
                }
            `}</style>

            {days.map((day, index) => {
                const { formattedDate, allEvents, dayId } = getDayEvents(day);

                // Weather for this day (simplified logic, assuming weatherData has matching dates or generic forecast)
                // In a real scenario, we'd match dates. For now, we take idx if available or random/first.
                const dayWeather = window.WeatherService && window.WeatherService.getForecastSummary(weatherData)
                    ? window.WeatherService.getForecastSummary(weatherData)[index]
                    : null;

                return (
                    <div key={dayId} className="snap-center shrink-0 w-[85vw] md:w-[400px] h-full whitespace-normal flex flex-col gap-3">
                        {/* Day Card Header */}
                        <div className="bg-[var(--md-sys-color-surface-container-high)] p-5 rounded-[28px] shadow-sm border border-[var(--md-sys-color-outline-variant)] flex flex-col relative overflow-hidden group/header">
                            {/* Decorative Background Blob */}
                            <div className="absolute -right-10 -top-10 w-32 h-32 bg-[var(--md-sys-color-primary)] opacity-5 rounded-full blur-2xl pointer-events-none"></div>

                            <div className="flex justify-between items-start z-10">
                                <div>
                                    <div className="text-[var(--md-sys-color-primary)] font-bold text-sm tracking-widest uppercase mb-1">Giorno {index + 1}</div>
                                    <h2 className="text-2xl font-black text-[var(--md-sys-color-on-surface)] capitalize leading-none">{formattedDate}</h2>
                                </div>
                                <div className="flex gap-2">
                                    {dayWeather && (
                                        <div className="flex flex-col items-center bg-[var(--md-sys-color-surface)] p-2 rounded-xl shadow-sm">
                                            <img src={dayWeather.icon} className="w-8 h-8" alt="weather" />
                                            <span className="text-xs font-bold">{dayWeather.tempMax}°</span>
                                        </div>
                                    )}
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onDeleteDay(dayId); }}
                                        className="w-10 h-10 rounded-xl bg-[var(--md-sys-color-surface)] text-[var(--md-sys-color-error)] flex items-center justify-center transition-opacity shadow-sm hover:bg-[#FFDAD6] hover:text-[#410002]"
                                        title="Elimina Giornata"
                                    >
                                        <Trash size={18} />
                                    </button>
                                </div>
                            </div>

                            {/* Day Progress / Status */}
                            <div className="mt-4 flex items-center gap-2">
                                <div className="flex-1 h-1.5 bg-[var(--md-sys-color-surface-variant)] rounded-full overflow-hidden">
                                    <div className="h-full bg-[var(--md-sys-color-primary)] w-1/3 rounded-full"></div>
                                    {/* TODO: Calculate real progress based on checked items */}
                                </div>
                                <span className="text-[10px] font-bold text-[var(--md-sys-color-on-surface-variant)]">ON TRACK</span>
                            </div>
                        </div>

                        {/* Events Feed */}
                        <div className="flex-1 overflow-y-auto scroller space-y-3 pb-20 pr-1 snap-y snap-proximity">
                            {allEvents.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-[var(--md-sys-color-on-surface-variant)] opacity-60">
                                    <div className="w-16 h-16 rounded-full bg-[var(--md-sys-color-surface-container-highest)] flex items-center justify-center mb-3">
                                        <Calendar size={24} />
                                    </div>
                                    <p className="font-medium text-sm">Nessun evento</p>
                                    <button onClick={() => onAddEvent(dayId)} className="mt-4 text-[var(--md-sys-color-primary)] font-bold text-sm flex items-center gap-1">
                                        <Plus size={16} /> Aggiungi
                                    </button>
                                </div>
                            ) : (
                                allEvents.map((ev, evIdx) => {
                                    const isTransport = ev.type === 'transport';
                                    const isCustom = ev.type === 'custom';
                                    const attraction = ev.attractionId ? itinerary.find(i => i.id === ev.attractionId) : null;
                                    const title = isTransport ? ev.data.dettaglio : (isCustom ? ev.customTitle : (attraction?.nome || "Attrazione"));
                                    const location = isTransport ? `${ev.data.partenza} → ${ev.data.arrivo}` : (attraction?.quartiere || "");
                                    const isVisited = isTransport ? ev.data.pagato : (attraction ? attraction.visited : false); // Logic differs slightly, transport uses pagato? No maybe just time passed. 
                                    // For timeline, 'visited' usually means 'done'. For transport usually we check if it happened. 
                                    // Let's rely on manually toggled 'visited' for attractions. 
                                    // For transport, maybe we don't have a 'done' status, so we ignore or use time.

                                    const statusColor = isVisited ? 'bg-[#C4EED0] text-[#07210F]' : 'bg-[var(--md-sys-color-surface-container-low)] text-[var(--md-sys-color-on-surface)]';
                                    const borderColor = isVisited ? 'border-transparent' : 'border-[var(--md-sys-color-outline-variant)]';

                                    return (
                                        <div key={ev.id || evIdx} className={`snap-start scroll-m-4 border ${borderColor} ${statusColor} rounded-[24px] p-4 shadow-sm relative group transition-all duration-200`}>
                                            {/* Time Line Connector (Visual only) */}

                                            <div className="flex items-start gap-4">
                                                {/* Time Column */}
                                                <div className="flex flex-col items-center gap-1 pt-1 min-w-[45px]">
                                                    <span className="text-sm font-black font-mono opacity-80">{ev.time}</span>
                                                    {isTransport ? <Train size={16} className="opacity-50" /> : <MapPin size={16} className="opacity-50" />}
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-lg font-bold leading-tight mb-1">{title}</h3>
                                                    {location && (
                                                        <p className="text-xs font-medium opacity-70 flex items-center gap-1 mb-2">
                                                            {isTransport ? <Navigation size={10} /> : <MapPin size={10} />}
                                                            {location}
                                                        </p>
                                                    )}

                                                    {/* Rich Content - Image or Ticket */}
                                                    {!isTransport && attraction && attraction.img && (
                                                        <div className="w-full h-32 rounded-xl bg-[var(--md-sys-color-surface-variant)] overflow-hidden mb-3 relative">
                                                            <img src={attraction.img} alt={title} className="w-full h-full object-cover" />
                                                            {/* Gradient for text readability if we overlay something */}
                                                        </div>
                                                    )}

                                                    {/* Actions / Badges */}
                                                    <div className="flex items-center gap-2 mt-1">
                                                        {isTransport && (
                                                            <span className="text-[10px] font-bold bg-[var(--md-sys-color-surface-variant)]/50 px-2 py-1 rounded-md">
                                                                {ev.data.costo}
                                                            </span>
                                                        )}
                                                        {ev.notes && (
                                                            <span className="text-[10px] font-bold bg-yellow-100 text-yellow-800 px-2 py-1 rounded-md border border-yellow-200">
                                                                Note
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Interact */}
                                                <div className="flex flex-col gap-2 items-center">
                                                    {!isTransport && attraction && (
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); onToggleVisit(attraction.id, attraction.visited); }}
                                                            className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 ${attraction.visited ? 'bg-transparent border-[#07210F] text-[#07210F]' : 'border-[var(--md-sys-color-outline)] text-[var(--md-sys-color-on-surface-variant)]'}`}
                                                        >
                                                            {attraction.visited ? <Check size={20} strokeWidth={3} /> : <div className="w-4 h-4 rounded-full bg-[var(--md-sys-color-outline)] opacity-30"></div>}
                                                        </button>
                                                    )}
                                                    {!isTransport && (
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); onDeleteEvent(dayId, ev.id); }}
                                                            className="w-10 h-10 rounded-full bg-[var(--md-sys-color-error-container)] text-[var(--md-sys-color-error)] flex items-center justify-center transition-opacity hover:shadow-md"
                                                            title="Elimina Evento"
                                                        >
                                                            <Trash size={18} />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}

                            {/* "Add Event" Button at bottom of list */}
                            <button
                                onClick={() => onAddEvent(dayId)}
                                className="w-full py-3 rounded-[20px] border-2 border-dashed border-[var(--md-sys-color-outline-variant)] text-[var(--md-sys-color-on-surface-variant)] font-bold text-sm flex items-center justify-center gap-2 hover:bg-[var(--md-sys-color-surface-container-highest)] transition-colors"
                            >
                                <Plus size={18} /> Aggiungi a questa giornata
                            </button>
                        </div>
                    </div>
                );
            })}

            {/* End Spacer */}
            <div className="w-4 shrink-0"></div>
        </div>
    );
};

window.JourneyTimeline = JourneyTimeline;
