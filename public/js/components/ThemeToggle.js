const ThemeToggle = ({ mode, onToggle }) => {
    const { Moon, Sun } = window;

    return (
        <button
            onClick={onToggle}
            className="w-10 h-10 rounded-full text-[var(--md-sys-color-primary)] flex items-center justify-center transition-all hover:bg-[var(--md-sys-color-primary)]/10 active:scale-95"
            title={mode === 'dark' ? "Passa a modalità chiara" : "Passa a modalità scura"}
        >
            {mode === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
        </button>
    );
};

window.ThemeToggle = ThemeToggle;
