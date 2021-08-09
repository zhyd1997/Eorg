import React, { useState, useEffect } from "react";
import { convertToRaw, ContentState } from "draft-js";
import Toolbar from "./Toolbar";
import Loading from "../Loading";
import {
  parseRawContent,
  previewPDF,
  postBib,
  postData,
  fetchBibEntry,
} from "./utils";
import { useAuth } from "@/hooks/useAuth";

type PreviewProps = {
  contentState: ContentState;
};

const Preview = ({ contentState }: PreviewProps) => {
  const auth = useAuth();

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
    if (auth.isAuthenticated) {
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
    if (content.length !== 0 && auth.isAuthenticated) {
      // disabled initial render
      postData(content, auth.token).then((data) => {
        const { status, body } = data;
        if (status === "success") {
          previewPDF(auth.token);
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
  }, [content, auth.isAuthenticated]);

  useEffect(() => {
    const { biblatex, bib, hasCite } = citations;
    if (hasCite !== "waiting...") {
      const allTeX = parseRawContent(contentState, biblatex);
      setContent(allTeX);
    }
    if (biblatex.length !== 0) {
      postBib(bib, auth.token);
    }
  }, [citations, auth.token, contentState]);

  const ErrorMessage = () => <p className={message.style}>{message.text}</p>;

  return (
    <div className={loading.style}>
      <ErrorMessage />
      <Toolbar disabled={loading.disabled} onClick={preview} />
      <iframe id="pdf" title="hello" />
      <Loading isLoading={loading.isLoading} />
    </div>
  );
};

export default Preview;
