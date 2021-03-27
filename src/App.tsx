import React, { useState } from "react";
import Modal from "./components/Modal";
import { ProvideAuth } from "./hooks/useAuth";
import "./App.css";

function App() {
    const [showModal, setShowModal] = useState<boolean>(false);

    const toggle = () => setShowModal(!showModal);

    return (
        <ProvideAuth>
            { showModal && (
                <Modal>
                    <p>I am a Modal!</p>
                    <button className="modal-close" onClick={toggle}>close</button>
                </Modal>
            ) }
            <button onClick={toggle}>show</button>
        </ProvideAuth>
    );
}

export default App;
