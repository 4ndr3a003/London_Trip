const { useState, useEffect, useMemo } = React;


const Card = ({ children, className = "", noPadding = false, ...props }) => (
    <div className={`ui-card ${noPadding ? "" : "padded"} ${className}`} {...props}>
        {children}
    </div>
);

const Badge = ({ children, type }) => {
    let variant = "default";
    if (type === "Museo") variant = "blue";
    if (type === "Mercato") variant = "orange";
    if (type === "Parco") variant = "green";
    if (type === "Grattacielo") variant = "purple";
    if (type === "Ristorante") variant = "amber";
    if (type === "Piazza") variant = "slate";
    if (type === "Tempo libero") variant = "pink";

    // Backpack Categories
    if (type === "Liquido") variant = "red";
    if (type === "Maglietta") variant = "dark-purple";
    if (type === "Pantalone") variant = "dark-blue";
    if (type === "Intimo") variant = "green";
    if (type === "Elettronica") variant = "lime";
    if (type === "Svago") variant = "purple";
    if (type === "Necessità") variant = "teal";
    if (type === "Pigiama") variant = "brown";
    if (type === "Elegante") variant = "yellow";

    if (type === "Saldato") variant = "green";
    if (type === "Da saldare") variant = "red";
    if (type === "Gratis") variant = "teal";
    if (type === "Prenotato") variant = "purple";

    return <span className={`ui-badge ${variant}`}>{children}</span>;
};

const Button = ({ children, onClick, variant = "primary", className = "", icon: Icon }) => {
    return (
        <button onClick={onClick} className={`ui-btn ui-btn-${variant} ${className}`}>
            {Icon && <Icon size={18} />}
            {children}
        </button>
    );
};

const Modal = ({ isOpen, onClose, title, children }) => {
    const { X } = window;
    const { useState, useEffect } = React;
    const [isClosing, setIsClosing] = useState(false);
    const [shouldRender, setShouldRender] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setShouldRender(true);
            setIsClosing(false);
            // Prevent body scroll when modal is open
            document.body.style.overflow = 'hidden';
        } else if (shouldRender) {
            setIsClosing(true);
            const timer = setTimeout(() => {
                setShouldRender(false);
                setIsClosing(false);
                // Restore body scroll when modal is closed
                document.body.style.overflow = '';
            }, 200); // Match the exit animation duration
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    if (!shouldRender) return null;

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            onClose();
            document.body.style.overflow = '';
        }, 200);
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    // Use Portal to render modal at body level, outside any scrollable container
    return ReactDOM.createPortal(
        <div
            className={`ui-modal-overlay ${isClosing ? 'closing' : ''}`}
            onClick={handleOverlayClick}
        >
            <div className="ui-modal-container" onClick={(e) => e.stopPropagation()}>
                <div className="ui-modal-header">
                    <h3 className="ui-modal-title">{title}</h3>
                    <button onClick={handleClose} className="ui-modal-close-btn">
                        <X size={18} />
                    </button>
                </div>
                <div className="ui-modal-body">
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
};

const InputGroup = ({ label, children }) => (
    <div className="ui-input-group">
        <label className="ui-input-label">{label}</label>
        {children}
    </div>
);

// M3 Segmented Control with animated sliding pill indicator
const SegmentedControl = ({ options, value, onChange, className = "", renderLabel, size = "default" }) => {
    const { useRef, useLayoutEffect, useState } = React;
    const containerRef = useRef(null);
    const [pillStyle, setPillStyle] = useState({ width: 0, left: 0 });

    useLayoutEffect(() => {
        if (!containerRef.current) return;

        const activeIndex = options.indexOf(value);
        const buttons = containerRef.current.querySelectorAll('.segment-btn');

        if (buttons[activeIndex]) {
            const button = buttons[activeIndex];
            const containerRect = containerRef.current.getBoundingClientRect();
            const buttonRect = button.getBoundingClientRect();

            setPillStyle({
                width: buttonRect.width,
                left: buttonRect.left - containerRect.left
            });
        }
    }, [value, options]);

    const sizeClass = size === "large" ? "large" : "";

    return (
        <div
            ref={containerRef}
            className={`segmented-control-container ${sizeClass} ${className}`}
        >
            {/* Animated Pill Indicator */}
            <div
                className="segmented-pill-indicator"
                style={{
                    width: `${pillStyle.width}px`,
                    transform: `translateX(${pillStyle.left}px)`
                }}
            />

            {/* Buttons */}
            {options.map((option, index) => (
                <button
                    key={option}
                    onClick={() => onChange(option)}
                    className={`segment-btn ${value === option ? 'active' : ''}`}
                >
                    {renderLabel ? renderLabel(option, value === option) : option}
                </button>
            ))}
        </div>
    );
};

// Page transition wrapper for slide up/down animations
const PageTransition = ({ children, isEntering = true }) => {
    const { useState, useEffect } = React;
    const [animationClass, setAnimationClass] = useState(isEntering ? 'page-enter' : '');

    useEffect(() => {
        if (isEntering) {
            setAnimationClass('page-enter');
        }
    }, [isEntering]);

    return (
        <div className={`page-transition-wrapper ${animationClass}`}>
            {children}
        </div>
    );
};

window.Card = Card;
window.Badge = Badge;
window.Button = Button;
window.Modal = Modal;
window.InputGroup = InputGroup;
window.SegmentedControl = SegmentedControl;
window.PageTransition = PageTransition;

