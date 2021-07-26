import React, { useState, useEffect } from "react";
import { convertToRaw, ContentState } from "draft-js";
import Toolbar from "./Toolbar";
import {
  parseRawContent,
  previewPDF,
  postBib,
  postData,
  fetchBibEntry,
} from "./utils";
import { CircularProgress } from "@material-ui/core";

type PreviewProps = {
  contentState: ContentState;
  store: {
    token: string;
  };
  login: boolean;
};

const Preview = ({ contentState, store, login }: PreviewProps) => {
  const [content, setContent] = useState<string[]>([]);
  const [citations, setCitations] = useState<{
    biblatex: string[];
    bib: {};
    hasCite: string;
  }>({
    biblatex: [],
    bib: {},
    hasCite: "waiting...",
  });
  const [loading, setLoading] = useState({
    isLoading: false,
    style: "preview",
    disabled: false,
  });
  const [message, setMessage] = useState({
    text: "",
    style: "error-message",
  });

  function displayError(errorMessage: string): void {
    setMessage((prevState) => ({
      text: errorMessage,
      style: `${prevState.style} error-message-active`,
    }));
    setTimeout(() => {
      setMessage({
        ...message,
        style: "tips-fade",
      });
    }, 3000);
  }

  function saveCitations() {
    const editorContentRaw = convertToRaw(contentState);
    const { entityMap } = editorContentRaw;
    const tempBiblatex: string[] = [];
    const tempBib = Object.create({});
    /**
     * filter items that @entityMap type === 'CITATION'
     * and then fetch biblatex entries.
     */

    const citationEntityKeys = Object.values(entityMap);
    const citationEntities = citationEntityKeys.filter(
      (value) => value.type === "CITATION"
    );
    if (citationEntities.length === 0) {
      setCitations({
        biblatex: [],
        bib: {},
        hasCite: "no",
      });
    } else {
      const { userID, APIkey } = JSON.parse(
        localStorage.getItem("zotero-Auth")!
      );
      citationEntities.forEach((entity, index, array) => {
        const { key } = entity.data;
        fetchBibEntry(key, userID, APIkey)
          .then((data) => {
            /** find identifier of bib entry, for example:
             *
             * '@bib_type{identifier,
             * 		title = {...},
             * 		author = {...},
             * 		...other metadata,
             * 	}'
             *
             * 	we need the 'identifier' between '{' and ','
             */
            const position = data.indexOf("{") + 1; // the starting position of the desired substring
            const length = data.indexOf(",") - position;

            const identifier = data.substr(position, length);

            const temp = Object.create({});
            temp[key] = identifier;

            /**
             * set temporary citations
             */

            const newBiblatexIndex = tempBiblatex.findIndex(
              (item) => item[key] === identifier
            );

            if (newBiblatexIndex === -1) {
              // deduplicate
              tempBiblatex.push(temp);
            }
            tempBib[key] = data;
          })
          .then(() => {
            if (index === array.length - 1) {
              setCitations({
                biblatex: tempBiblatex,
                bib: tempBib,
                hasCite: "yes",
              });
            }
          });
      });
    }
  }

  function loadPDF(): void {
    setLoading((prevState) => ({
      isLoading: true,
      style: `${prevState.style} loading`,
      disabled: true,
    }));
    saveCitations();
  }

  function preview(): void {
    if (login) {
      /**
       * TODO load pdf
       *  if and only if
       *      - [x] this.state.data is not empty
       *      - [ ] and not equal to prevState.data
       */

      if (contentState.hasText()) {
        loadPDF();
      } else {
        setLoading({
          isLoading: false,
          style: "preview",
          disabled: false,
        });
        displayError("Nothing you wrote");
      }
    } else {
      displayError("You need to login first!");
    }
  }

  useEffect(() => {
    // do not postData when logout.
    if (content.length !== 0 && store.token.length !== 0) {
      // disabled initial render
      postData(content, store).then((data) => {
        const { status, body } = data;
        if (status === "success") {
          previewPDF(store);
        } else {
          displayError(body);
        }
        setLoading({
          isLoading: false,
          style: "preview",
          disabled: false,
        });
        setCitations({
          biblatex: [],
          bib: {},
          hasCite: "waiting...",
        });
      });
    }
  }, [content, store]);

  useEffect(() => {
    const { biblatex, bib, hasCite } = citations;
    if (hasCite !== "waiting...") {
      const allTeX = parseRawContent(contentState, biblatex);
      setContent(allTeX);
    }
    if (biblatex.length !== 0) {
      postBib(bib, store);
    }
  }, [citations, store, contentState]);

  const ErrorMessage = () => <p className={message.style}>{message.text}</p>;

  return (
    <div className={loading.style}>
      <ErrorMessage />
      <Toolbar
        login={login}
        store={store}
        disabled={loading.disabled}
        onClick={preview}
      />
      <iframe id="pdf" title="hello" />
      {loading.isLoading ? <CircularProgress /> : null}
    </div>
  );
};

export default Preview;
