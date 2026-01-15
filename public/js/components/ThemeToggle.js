const ThemeToggle = ({ mode, onToggle }) => {
    const { Moon, Sun } = window;

    return (
        <button
            onClick={onToggle}
            className="w-10 h-10 rounded-full bg-[var(--md-sys-color-surface-container-highest)] text-[var(--md-sys-color-on-surface-variant)] flex items-center justify-center transition-all hover:bg-[var(--md-sys-color-surface-variant)] active:scale-95 shadow-sm"
            title={mode === 'dark' ? "Passa a modalità chiara" : "Passa a modalità scura"}
        >
            {mode === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
    );
};

window.ThemeToggle = ThemeToggle;
