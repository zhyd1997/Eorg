import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import "./modal.css";

function Modal({ children }: any) {
    const backdropEl = document.createElement("div");
    const bodyEl = document.createElement("div");
    
    backdropEl.classList.add("modal-backdrop");
    bodyEl.classList.add("modal-body");
    bodyEl.setAttribute("aria-modal", "true");

    const el = useRef(bodyEl);

    useEffect(() => {
        const modalRoot = document.getElementById("modal-root");
        modalRoot?.appendChild(backdropEl);
        modalRoot?.appendChild(el.current);
        return () => {
            modalRoot?.removeChild(backdropEl);
            modalRoot?.removeChild(el.current);
        }
    }, []);

    return createPortal(children, el.current);
}

export default Modal;
