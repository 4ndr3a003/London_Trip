/**
 * BCBPParser.js
 * A utility to parse IATA Bar Coded Boarding Pass (BCBP) strings.
 * Based on IATA Resolution 792.
 */

window.BCBPParser = {
    parse: function (raw) {
        if (!raw || typeof raw !== 'string') return null;

        // Basic validation: IATA BCBP usually starts with 'M' (Format Code)
        // and scanned PDF417 often has header data. We look for the 'M'.
        // Example: M1ROSSI/MARIO       E1234567...

        let data = raw;
        const startIndex = raw.indexOf('M1');
        if (startIndex === -1) {
            console.warn("BCBPParser: Format not supported or not a valid boarding pass (missing M1 marker).");
            // Fallback for some formats that might not have M1 but are still valid? 
            // For now verify strict M1 for simplicity as per standard.
            return null;
        }

        // Strip everything before M1
        data = data.substring(startIndex);

        try {
            // Field Widths (fixed width format)
            // 0-1: Format Code 'M'
            // 1-2: Number of legs '1'
            // 2-22: Passenger Name (20 chars)
            // 22-23: Electronic Ticket Indicator
            // 23-30: PNR Code (7 chars)
            // 30-33: From City (3 chars)
            // 33-36: To City (3 chars)
            // 36-39: Operating Carrier (3 chars)
            // 39-44: Flight Number (5 chars)
            // 44-47: Date of Flight (Julian Date, 3 chars)
            // 47-48: Compartment Code (1 char)
            // 48-52: Seat Number (4 chars)
            // 52-57: Check-in Sequence (5 chars)
            // 57-58: Passenger Status (1 char)
            // 58-60: Field size of variable size field (2 chars)

            const nameRaw = data.substring(2, 22).trim();
            const pnr = data.substring(23, 30).trim();
            const from = data.substring(30, 33).trim();
            const to = data.substring(33, 36).trim();
            const carrier = data.substring(36, 39).trim();
            const flightNum = data.substring(39, 44).trim();
            const julianDate = data.substring(44, 47).trim();
            const seat = data.substring(48, 52).trim();

            // Name Parsing (SURNAME/FIRSTNAME)
            let name = nameRaw;
            if (name.includes('/')) {
                const parts = name.split('/');
                const surname = parts[0];
                const firstname = parts[1];
                // Capitalize nicely
                const formatName = (s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
                name = `${formatName(firstname)} ${formatName(surname)}`;
            }

            // Date Parsing (Julian Date -> DD/MM/YYYY)
            // Julian Date is day of year (1-366). We assume current year or next year.
            const dayOfYear = parseInt(julianDate, 10);
            const now = new Date();
            const year = now.getFullYear();

            const date = new Date(year, 0); // Jan 1st
            date.setDate(dayOfYear);

            // If parsed date is in the past (more than a few days), it might be for next year
            // Or if we are in Dec and flight is Jan.
            // Simplified logic: strict reading.
            const formattedDate = date.toLocaleDateString('it-IT'); // DD/MM/YYYY

            return {
                raw: raw,
                name: name,
                pnr: pnr,
                from: from,
                to: to,
                flight: `${carrier.trim()}${flightNum.replace(/^0+/, '')}`, // Remove leading zeros from flight num
                date: formattedDate,
                seat: seat.replace(/^0+/, ''),
                airline: carrier
            };

        } catch (e) {
            console.error("BCBPParser Error:", e);
            return null;
        }
    }
};
