import React, { useState } from "react";

import { Meta } from "@storybook/react";

import Modal from "./Modal";

export default {
    title: "Components/Modal",
    component: Modal,
} as Meta;

export function Default() {
    const [showModal, setShowModal] = useState<boolean>(false);

    React.useEffect(() => {
        console.log(showModal);
    }, [showModal]);

    const toggleOpen = () => setShowModal(true);

    const toggleClose = () => setShowModal(false);

    return (
        <>
            { showModal && (
                <Modal>
                    <p>I am a Modal!</p>
                    <button className="modal-close" onClick={toggleClose}>close</button>
                </Modal>
            ) }
            <button onClick={toggleOpen}>show</button>
        </>
    );
}