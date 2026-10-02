import { useEffect } from "react";
import Icon from "./Icon";

export default function Modal({ title, onClose, children, footer, wide = false }) {

    useEffect(() => {
        const handleKey = (event) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener("keydown", handleKey);
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", handleKey);
            document.body.style.overflow = "";
        };
    }, [onClose]);

    return (
        <div
            className="ui-modal-overlay"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                    onClose();
                }
            }}
        >
            <div
                className={`ui-modal ${wide ? "ui-modal-wide" : ""}`}
                role="dialog"
                aria-modal="true"
                aria-label={title}
            >
                <div className="ui-modal-header">
                    <h2>{title}</h2>

                    <button
                        type="button"
                        className="ui-icon-btn"
                        onClick={onClose}
                        aria-label="Fermer"
                    >
                        <Icon name="x" />
                    </button>
                </div>

                <div className="ui-modal-body">{children}</div>

                {footer && <div className="ui-modal-footer">{footer}</div>}
            </div>
        </div>
    );
}
