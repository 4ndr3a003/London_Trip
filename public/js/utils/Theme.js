// Theme.js - Material 3 Expressive Color System
// Generates dynamic color tokens based on a seed color

/**
 * Convert hex color to HSL
 */
function hexToHsl(hex) {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
            case g: h = ((b - r) / d + 2) / 6; break;
            case b: h = ((r - g) / d + 4) / 6; break;
        }
    }
    return { h: h * 360, s: s * 100, l: l * 100 };
}

/**
 * Convert HSL to hex color
 */
function hslToHex(h, s, l) {
    h /= 360;
    s /= 100;
    l /= 100;

    let r, g, b;
    if (s === 0) {
        r = g = b = l;
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }
    const toHex = x => {
        const hex = Math.round(x * 255).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

/**
 * Generate a tonal palette (0-100) from a base hue
 */
function generateTonalPalette(hue, saturation) {
    const tones = [0, 5, 10, 15, 20, 25, 30, 35, 40, 50, 60, 70, 80, 90, 95, 98, 99, 100];
    const palette = {};

    tones.forEach(tone => {
        // Adjust saturation based on tone for more natural colors
        let adjustedSat = saturation;
        if (tone < 20) adjustedSat = Math.min(saturation, 40);
        else if (tone > 90) adjustedSat = Math.max(saturation * 0.5, 10);

        palette[tone] = hslToHex(hue, adjustedSat, tone);
    });

    return palette;
}

/**
 * Generate Material 3 color scheme from a seed color
 */
function generateM3Scheme(seedHex) {
    const seed = hexToHsl(seedHex);

    // Primary palette - based on seed
    const primaryHue = seed.h;
    const primarySat = Math.min(seed.s, 65);

    // Secondary palette - slightly desaturated seed
    const secondaryHue = seed.h;
    const secondarySat = Math.max(seed.s * 0.4, 20);

    // Tertiary palette - M3 Expressive: 60° hue shift for bold accent
    const tertiaryHue = (seed.h + 60) % 360;
    const tertiarySat = Math.min(seed.s * 0.85, 65);

    // Neutral palette - M3 Expressive: warmer tint, avoid clinical grays
    const neutralHue = seed.h;
    const neutralSat = 12; // Higher saturation for warm "bonewhite" surfaces

    // Neutral variant - more saturated for visible tint
    const neutralVariantHue = seed.h;
    const neutralVariantSat = 18;

    // Error colors (red tones)
    const errorHue = 0;
    const errorSat = 75;

    return {
        palettes: {
            primary: generateTonalPalette(primaryHue, primarySat),
            secondary: generateTonalPalette(secondaryHue, secondarySat),
            tertiary: generateTonalPalette(tertiaryHue, tertiarySat),
            neutral: generateTonalPalette(neutralHue, neutralSat),
            neutralVariant: generateTonalPalette(neutralVariantHue, neutralVariantSat),
            error: generateTonalPalette(errorHue, errorSat)
        },
        // Light scheme tokens
        light: {
            primary: hslToHex(primaryHue, primarySat, 40),
            onPrimary: '#FFFFFF',
            primaryContainer: hslToHex(primaryHue, primarySat * 0.8, 90),
            onPrimaryContainer: hslToHex(primaryHue, primarySat, 30),

            secondary: hslToHex(secondaryHue, secondarySat, 40),
            onSecondary: '#FFFFFF',
            secondaryContainer: hslToHex(secondaryHue, secondarySat * 0.9, 90),
            onSecondaryContainer: hslToHex(secondaryHue, secondarySat, 30),

            tertiary: hslToHex(tertiaryHue, tertiarySat, 40),
            onTertiary: '#FFFFFF',
            tertiaryContainer: hslToHex(tertiaryHue, tertiarySat * 0.7, 90),
            onTertiaryContainer: hslToHex(tertiaryHue, tertiarySat, 30),

            error: '#BA1A1A',
            onError: '#FFFFFF',
            errorContainer: '#FFDAD6',
            onErrorContainer: '#410002',

            background: hslToHex(neutralHue, neutralSat * 0.5, 98),
            onBackground: hslToHex(neutralHue, neutralSat, 10),

            surface: hslToHex(neutralHue, neutralSat * 0.5, 98),
            onSurface: hslToHex(neutralHue, neutralSat, 10),
            surfaceVariant: hslToHex(neutralVariantHue, neutralVariantSat, 90),
            onSurfaceVariant: hslToHex(neutralVariantHue, neutralVariantSat, 30),

            surfaceDim: hslToHex(neutralHue, neutralSat, 87),
            surfaceBright: hslToHex(neutralHue, neutralSat * 0.5, 98),
            // M3 Expressive: All surface containers tinted with primary warmth
            surfaceContainerLowest: hslToHex(neutralHue, neutralSat * 0.3, 99),
            surfaceContainerLow: hslToHex(neutralHue, neutralSat * 0.6, 96),
            surfaceContainer: hslToHex(neutralHue, neutralSat * 0.8, 94),
            surfaceContainerHigh: hslToHex(neutralHue, neutralSat * 0.9, 92),
            surfaceContainerHighest: hslToHex(neutralHue, neutralSat, 90),

            outline: hslToHex(neutralVariantHue, neutralVariantSat, 50),
            outlineVariant: hslToHex(neutralVariantHue, neutralVariantSat, 80),

            shadow: '#000000',
            scrim: '#000000',

            inverseSurface: hslToHex(neutralHue, neutralSat, 20),
            inverseOnSurface: hslToHex(neutralHue, neutralSat, 95),
            inversePrimary: hslToHex(primaryHue, primarySat * 0.9, 80)
        },
        // Dark scheme tokens
        dark: {
            primary: hslToHex(primaryHue, primarySat * 0.9, 80),
            onPrimary: hslToHex(primaryHue, primarySat, 20),
            primaryContainer: hslToHex(primaryHue, primarySat, 30),
            onPrimaryContainer: hslToHex(primaryHue, primarySat * 0.8, 90),

            secondary: hslToHex(secondaryHue, secondarySat * 0.9, 80),
            onSecondary: hslToHex(secondaryHue, secondarySat, 20),
            secondaryContainer: hslToHex(secondaryHue, secondarySat, 30),
            onSecondaryContainer: hslToHex(secondaryHue, secondarySat * 0.9, 90),

            tertiary: hslToHex(tertiaryHue, tertiarySat * 0.8, 80),
            onTertiary: hslToHex(tertiaryHue, tertiarySat, 20),
            tertiaryContainer: hslToHex(tertiaryHue, tertiarySat, 30),
            onTertiaryContainer: hslToHex(tertiaryHue, tertiarySat * 0.7, 90),

            error: '#FFB4AB',
            onError: '#690005',
            errorContainer: '#93000A',
            onErrorContainer: '#FFDAD6',

            background: hslToHex(neutralHue, neutralSat, 6),
            onBackground: hslToHex(neutralHue, neutralSat, 90),

            surface: hslToHex(neutralHue, neutralSat, 6),
            onSurface: hslToHex(neutralHue, neutralSat, 90),
            surfaceVariant: hslToHex(neutralVariantHue, neutralVariantSat, 30),
            onSurfaceVariant: hslToHex(neutralVariantHue, neutralVariantSat, 80),

            surfaceDim: hslToHex(neutralHue, neutralSat, 6),
            surfaceBright: hslToHex(neutralHue, neutralSat, 24),
            surfaceContainerLowest: hslToHex(neutralHue, neutralSat, 4),
            surfaceContainerLow: hslToHex(neutralHue, neutralSat, 10),
            surfaceContainer: hslToHex(neutralHue, neutralSat, 12),
            surfaceContainerHigh: hslToHex(neutralHue, neutralSat, 17),
            surfaceContainerHighest: hslToHex(neutralHue, neutralSat, 22),

            outline: hslToHex(neutralVariantHue, neutralVariantSat, 60),
            outlineVariant: hslToHex(neutralVariantHue, neutralVariantSat, 30),

            shadow: '#000000',
            scrim: '#000000',

            inverseSurface: hslToHex(neutralHue, neutralSat, 90),
            inverseOnSurface: hslToHex(neutralHue, neutralSat, 20),
            inversePrimary: hslToHex(primaryHue, primarySat, 40)
        }
    };
}

/**
 * Apply Material 3 theme to the document
 * @param {string} seedColor - Hex color code (e.g., "#DC2626")
 * @param {string} mode - "light" or "dark" (default: "light")
 */
function applyTheme(seedColor, mode = 'light') {
    if (!seedColor || !seedColor.startsWith('#')) {
        console.warn('Invalid seed color provided to applyTheme:', seedColor);
        seedColor = '#DC2626'; // Default to red
    }

    const scheme = generateM3Scheme(seedColor);
    const tokens = scheme[mode] || scheme.light;
    const root = document.documentElement;

    // Map token names to CSS variable names
    const tokenToCss = {
        primary: '--md-sys-color-primary',
        onPrimary: '--md-sys-color-on-primary',
        primaryContainer: '--md-sys-color-primary-container',
        onPrimaryContainer: '--md-sys-color-on-primary-container',

        secondary: '--md-sys-color-secondary',
        onSecondary: '--md-sys-color-on-secondary',
        secondaryContainer: '--md-sys-color-secondary-container',
        onSecondaryContainer: '--md-sys-color-on-secondary-container',

        tertiary: '--md-sys-color-tertiary',
        onTertiary: '--md-sys-color-on-tertiary',
        tertiaryContainer: '--md-sys-color-tertiary-container',
        onTertiaryContainer: '--md-sys-color-on-tertiary-container',

        error: '--md-sys-color-error',
        onError: '--md-sys-color-on-error',
        errorContainer: '--md-sys-color-error-container',
        onErrorContainer: '--md-sys-color-on-error-container',

        background: '--md-sys-color-background',
        onBackground: '--md-sys-color-on-background',

        surface: '--md-sys-color-surface',
        onSurface: '--md-sys-color-on-surface',
        surfaceVariant: '--md-sys-color-surface-variant',
        onSurfaceVariant: '--md-sys-color-on-surface-variant',

        surfaceDim: '--md-sys-color-surface-dim',
        surfaceBright: '--md-sys-color-surface-bright',
        surfaceContainerLowest: '--md-sys-color-surface-container-lowest',
        surfaceContainerLow: '--md-sys-color-surface-container-low',
        surfaceContainer: '--md-sys-color-surface-container',
        surfaceContainerHigh: '--md-sys-color-surface-container-high',
        surfaceContainerHighest: '--md-sys-color-surface-container-highest',

        outline: '--md-sys-color-outline',
        outlineVariant: '--md-sys-color-outline-variant',

        shadow: '--md-sys-color-shadow',
        scrim: '--md-sys-color-scrim',

        inverseSurface: '--md-sys-color-inverse-surface',
        inverseOnSurface: '--md-sys-color-inverse-on-surface',
        inversePrimary: '--md-sys-color-inverse-primary'
    };

    // Apply each token as a CSS variable
    Object.entries(tokenToCss).forEach(([token, cssVar]) => {
        if (tokens[token]) {
            root.style.setProperty(cssVar, tokens[token]);
        }
    });

    // Store seed color for reference
    root.style.setProperty('--md-sys-color-seed', seedColor);

    console.log(`[Theme] Applied M3 ${mode} theme with seed: ${seedColor}`);
}

// Expose globally
window.applyTheme = applyTheme;
window.generateM3Scheme = generateM3Scheme;
