import React, { useRef } from "react";
import { Modal } from "bootstrap";

export const tableShape = [];

// @ts-expect-error ts-migrate(7006) FIXME: Parameter 'props' implicitly has an 'any' type.
const ModalTable = (props) => {
  const {
    buttonLabel,
    className,
    // onClick,
  } = props;

  const tableModalRef = useRef<any>(null);

  function showTableModal() {
    const modalEle = tableModalRef?.current;
    const tableModal = new Modal(modalEle);
    tableModal.show();
  }

  function hideTableModal() {
    const modalEle = tableModalRef?.current;
    const tableModal = Modal.getInstance(modalEle);
    tableModal?.hide();
  }

  return (
    <>
      <button
        type="button"
        className="math RichEditor-styleButton"
        onClick={showTableModal}>
        {buttonLabel}
      </button>
      <div className="modal fade" tabIndex={-1} ref={tableModalRef}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                Tips: &nbsp;the table feature has not finished yet.
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={hideTableModal}></button>
            </div>
            <div className="modal-body">
              <p>
                You can use &nbsp;
                <a href="https://www.tablesgenerator.com/">tables generator</a>
                &nbsp; or &nbsp;
                <a href="https://ctan.org/pkg/excel2latex?lang=en">
                  excel2latex
                </a>
                &nbsp; to create a table and then click &nbsp;
                <b>Math</b>
                &nbsp; button to insert a table.
              </p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-primary"
                onClick={hideTableModal}>
                got it
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalTable;
