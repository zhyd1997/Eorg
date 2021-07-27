import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@material-ui/core";
import { Close } from "@material-ui/icons";
import TableExample from "./TableExample";
import { zoteroUrl } from "../baseUrl";

type AuthFormValues = {
  userID: string;
  APIkey: string;
};

type ModalExampleProps = {
  buttonLabel: string;
  className?: string;
  /** (biblatex entry, selected biblatex item) */
  insertCite: (text: any[], value: number) => void;
};

const ModalExample = ({
  buttonLabel,
  className,
  insertCite,
}: ModalExampleProps) => {
  const [modal, setModal] = useState(false);
  const [modalInput, setModalInput] = useState(false);
  const [targetValue, setTargetValue] = useState(0);
  const [isClick, setIsClick] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchText, setFetchText] = useState([]);
  const [feedback, setFeedback] = useState({
    isValid: true,
    text: "",
  });

  const { register, handleSubmit } = useForm<AuthFormValues>();

  function toggle(): void {
    setModal(!modal);
  }
  function toggleInput(): void {
    setModalInput(!modalInput);
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
    toggleInput();
    toggle();
    fetchItems();
  }

  function verifyState(loading: boolean, valid: boolean, detail: string): void {
    setIsLoading(loading);
    setFeedback({
      isValid: valid,
      text: detail,
    });
  }

  function verifyAuth(auth: AuthFormValues): void {
    console.log(auth);
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

  function handleNext(): void {
    // 1. open input modal
    toggleInput();
  }

  function handleClick(): void {
    // 3. close cite modal
    toggle();
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
        onClick={handleNext}
        className="math RichEditor-styleButton">
        {buttonLabel}
      </button>
      <Dialog open={modalInput}>
        <DialogTitle>
          Zotero
          <IconButton onClick={toggleInput}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {isLoading ? <CircularProgress /> : null}
          <form>
            <fieldset>
              <input
                type="text"
                id="userID"
                placeholder="userID"
                {...register("userID", { required: true })}
              />
              {localStorage.getItem("zotero-Auth") !== null ? (
                <div>
                  Still use previous API key? please click&nbsp;
                  <kbd>Restore User</kbd>
                  &nbsp;button.
                </div>
              ) : null}
            </fieldset>
            <fieldset>
              <input
                type="text"
                id="APIkey"
                placeholder="API key"
                {...register("APIkey", { required: true })}
              />
              {!feedback.isValid ? <span>{feedback.text}</span> : ""}
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
            </fieldset>
          </form>
        </DialogContent>
        <DialogActions>
          {localStorage.getItem("zotero-Auth") !== null ? (
            <Button
              variant="outlined"
              color="default"
              onClick={createCitations}>
              Restore User
            </Button>
          ) : null}
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit(verifyAuth)}>
            Next
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={modal}>
        <DialogTitle>
          Zotero
          <IconButton onClick={toggle}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {isLoading ? (
            <CircularProgress />
          ) : (
            <TableExample handleClick={selectItem} fetchText={fetchText} />
          )}
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            disabled={!isClick}
            onClick={handleClick}>
            Insert
          </Button>{" "}
          <Button variant="contained" color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ModalExample;
