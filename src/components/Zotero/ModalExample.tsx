import React, { useState, useRef } from "react";
import { Modal } from "bootstrap";
import Loading from "../Loading";
import TableExample from "./TableExample";
import { zoteroUrl } from "../baseUrl";

type ModalExampleProps = {
  buttonLabel: string;
  /** (biblatex entry, selected biblatex item) */
  insertCite: (text: any[], value: number) => void;
};

const ModalExample = ({ buttonLabel, insertCite }: ModalExampleProps) => {
  const [targetValue, setTargetValue] = useState(0);
  const [isClick, setIsClick] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchText, setFetchText] = useState([]);
  const [auth, setAuth] = useState({
    userID: "",
    APIkey: "",
  });
  const [feedback, setFeedback] = useState({
    isValid: true,
    text: "",
  });

  const authModalRef = useRef<any>(null);
  const mainRef = useRef<any>(null);

  function showAuthModal() {
    const modalEle = authModalRef?.current;
    const authModal = new Modal(modalEle);
    authModal.show();
  }

  function hideAuthModal() {
    const modalEle = authModalRef?.current;
    const authModal = Modal.getInstance(modalEle);
    authModal?.hide();
  }

  function showMainModal() {
    const modalEle = mainRef?.current;
    const mainModal = new Modal(modalEle);
    mainModal.show();
  }

  function hideMainModal() {
    const modalEle = mainRef?.current;
    const authModal = Modal.getInstance(modalEle);
    authModal?.hide();
  }

  // @ts-expect-error ts-migrate(7006) FIXME: Parameter 'e' implicitly has an 'any' type.
  function handleChange(e): void {
    setAuth({
      ...auth,
      [e.target.name]: e.target.value,
    });
  }

  function cite(): void {
    insertCite(fetchText, targetValue);
    setIsClick(false);
  }

  function fetchItems(): void {
    setIsLoading(true);
    const { userID, APIkey } = JSON.parse(localStorage.getItem("zotero-Auth")!);
    fetch(`${zoteroUrl}users/${userID}/items`, {
      method: "GET",
      headers: {
        "Zotero-API-Version": "3",
        "Zotero-API-Key": APIkey,
      },
    }).then((res) => {
      res.json().then((data) => {
        /**
         * [
         *      {
         *          key: KEY-1,
         *          parsedDate: DATE-1,
         *          title: TITLE-1
         *      },
         *      {
         *          key: KEY-2,
         *          parsedDate: DATE-2,
         *          title: TITLE-2
         *      },
         *      {
         *          key: KEY-3,
         *          parsedDate: DATE-3,
         *          title: TITLE-3
         *      },
         * ]
         *
         */
        // @ts-ignore
        const metadata = [];

        // @ts-expect-error ts-migrate(7006) FIXME: Parameter 'i' implicitly has an 'any' type.
        data.map((i) => {
          const tempObj = Object.create({});

          tempObj.key = i.key;
          tempObj.creatorSummary = i.meta.creatorSummary;
          tempObj.parsedDate = i.meta.parsedDate;
          tempObj.title = i.data.title;

          metadata.push(tempObj);

          // @ts-ignore
          return metadata;
        });

        // @ts-ignore
        setFetchText(metadata);
        setIsLoading(false);
      });
    });
  }

  function createCitations(): void {
    // 2. close input modal
    // and open cite modal, fetch citations.
    hideAuthModal();
    showMainModal();
    fetchItems();
  }

  function verifyState(loading: boolean, valid: boolean, detail: string): void {
    setIsLoading(loading);
    setFeedback({
      isValid: valid,
      text: detail,
    });
  }

  function verifyAuth(): void {
    verifyState(true, true, "");
    if (auth.userID === "" || auth.APIkey === "") {
      verifyState(false, false, "empty input");
    } else {
      fetch(`${zoteroUrl}users/${auth.userID}/items`, {
        method: "GET",
        headers: {
          "Zotero-API-Version": "3",
          "Zotero-API-Key": auth.APIkey,
        },
      }).then((res) => {
        if (res.status === 200) {
          if (localStorage.getItem("zotero-Auth") !== null) {
            /**
             * every user has unique userID, and only API-key can be changed.
             * if API-key changed, user maybe also changed.
             * and localStorage Item 'zotero-Auth' changed.
             */
            const { APIkey } = JSON.parse(localStorage.getItem("zotero-Auth")!);
            if (auth.APIkey !== APIkey) {
              localStorage.setItem(
                "zotero-Auth",
                JSON.stringify({
                  userID: auth.userID,
                  APIkey: auth.APIkey,
                })
              );
            }
          } else {
            localStorage.setItem(
              "zotero-Auth",
              JSON.stringify({
                userID: auth.userID,
                APIkey: auth.APIkey,
              })
            );
          }
          verifyState(false, true, "");
          createCitations();
        } else if (res.status === 403) {
          verifyState(false, false, `${auth.userID} has invalid API key`);
        } else {
          /**
           * TODO HTTP status codes
           * https://www.zotero.org/support/dev/web_api/v3/basics # HTTP Status Codes
           */

          verifyState(false, false, "something wrong");
        }
      });
    }
  }

  function handleClick(): void {
    // 3. close cite modal
    hideMainModal();
    cite();
  }

  // @ts-expect-error ts-migrate(7006) FIXME: Parameter 'evt' implicitly has an 'any' type.
  function selectItem(evt): null {
    if (evt.target.tagName === "TD") {
      const value = evt.target.getAttribute("data-cite");
      setTargetValue(value);
      setIsClick(true);
    }
    return null;
  }

  return (
    <>
      <button
        type="button"
        onClick={showAuthModal}
        className="math RichEditor-styleButton">
        {buttonLabel}
      </button>
      <div className="modal fade" tabIndex={-1} ref={authModalRef}>
        <div className="modal-dialog modal-sm">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Zotero</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={hideAuthModal}></button>
            </div>
            <div className="modal-body">
              {isLoading ? <Loading isLoading={isLoading} /> : null}
              <form>
                <div>
                  <input
                    type="text"
                    name="userID"
                    id="userID"
                    placeholder="userID"
                    onChange={handleChange}
                    className="form-control"
                  />
                  {localStorage.getItem("zotero-Auth") !== null ? (
                    <div>
                      Still use previous API key? please click&nbsp;
                      <kbd>Restore User</kbd>
                      &nbsp;button.
                    </div>
                  ) : null}
                </div>
                <div>
                  <input
                    type="text"
                    name="APIkey"
                    id="APIkey"
                    placeholder="API key"
                    className="form-control"
                    onChange={handleChange}
                  />
                  {!feedback.isValid ? <p>{feedback.text}</p> : ""}
                  <div>
                    You can create API keys via&nbsp;
                    <a
                      href="https://www.zotero.org/settings/keys/new"
                      rel="noopener noreferrer"
                      target="_blank">
                      your Zotero account settings
                    </a>
                    .
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              {localStorage.getItem("zotero-Auth") !== null ? (
                <button
                  type="button"
                  className="btn btn-dark"
                  onClick={createCitations}>
                  Restore User
                </button>
              ) : null}
              <button
                type="button"
                className="btn btn-primary"
                onClick={verifyAuth}>
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal fade" tabIndex={-1} ref={mainRef}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Zotero</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={hideMainModal}></button>
            </div>
            <div className="modal-body">
              {isLoading ? (
                <Loading isLoading={isLoading} />
              ) : (
                <TableExample handleClick={selectItem} fetchText={fetchText} />
              )}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-primary"
                disabled={!isClick}
                onClick={handleClick}>
                Insert
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={hideMainModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalExample;
