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
    if (!isOpen) return null;
    return (
        <div className="ui-modal-overlay">
            <div className="ui-modal-container">
                <div className="ui-modal-header">
                    <h3 className="ui-modal-title">{title}</h3>
                    <button onClick={onClose} className="ui-modal-close-btn">
                        <X size={18} />
                    </button>
                </div>
                <div className="ui-modal-body">
                    {children}
                </div>
            </div>
        </div>
    );
};

const InputGroup = ({ label, children }) => (
    <div className="ui-input-group">
        <label className="ui-input-label">{label}</label>
        {children}
    </div>
);

window.Card = Card;
window.Badge = Badge;
window.Button = Button;
window.Modal = Modal;
window.InputGroup = InputGroup;
