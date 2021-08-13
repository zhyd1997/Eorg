import { ContentState } from "draft-js";
import katex from "katex";
import React, { useEffect, useRef, useState } from "react";

import Block from "../blockTypes";

type KaTeXOutputProps = {
  content: string;
  onClick: () => void;
};

const KaTexOutput = ({ content, onClick }: KaTeXOutputProps) => {
  const container = useRef<HTMLElement>(null!);

  // @ts-expect-error ts-migrate(7006) FIXME: Parameter 'value' implicitly has an 'any' type.
  function usePrevious(value) {
    const ref = useRef(null);
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  }
  const prevProps = usePrevious(content);

  function update() {
    katex.render(content, container.current, { displayMode: true });
  }

  useEffect(() => {
    if (prevProps !== content) {
      update();
    }
  });
  // eslint-disable-next-line max-len
  // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
  return <span ref={container} onClick={onClick} />;
};

const TeXBlock = ({ block, contentState, blockProps }: Block) => {
  const [editMode, setEditMode] = useState(false);
  const [texValue, setTexValue] = useState("");
  const [invalidTeX, setInvalidTeX] = useState(false);
  const textareaRef = useRef(null);

  function getValue(): string {
    return contentState.getEntity(block.getEntityAt(0)).getData().content;
  }

  // @ts-ignore
  function onValueChange(evt): void {
    const { value } = evt.target;
    let invalid = false;
    try {
      katex.renderToString(value);
    } catch (e) {
      invalid = true;
    } finally {
      setInvalidTeX(invalid);
      setTexValue(value);
    }
  }

  function remove(): void {
    blockProps.onRemove(block.getKey());
  }

  function startEdit(): void {
    blockProps.onStartEdit(block.getKey());
  }

  function finishEdit(newContentState: ContentState): void {
    blockProps.onFinishEdit(block.getKey(), newContentState);
  }

  function onClick(): void {
    if (editMode) {
      return;
    }
    setEditMode(true);
    setTexValue(getValue());
    startEdit();
  }

  function save(): void {
    const entityKey = block.getEntityAt(0);
    const newContentState = contentState.mergeEntityData(entityKey, {
      content: texValue
    });
    setInvalidTeX(false);
    setEditMode(false);
    setTexValue("");
    finishEdit(newContentState);
  }

  let texContent: string;
  if (editMode) {
    if (invalidTeX) {
      texContent = "";
    } else {
      texContent = texValue;
    }
  } else {
    texContent = getValue();
  }

  let className = "TeXEditor-tex";
  if (editMode) {
    className += " TeXEditor-activeTeX";
  }

  let editPanel = null;
  if (editMode) {
    let buttonClass = "TeXEditor-saveButton";
    if (invalidTeX) {
      buttonClass += " TeXEditor-invalidButton";
    }

    editPanel = (
      <div className="TeXEditor-panel">
        <textarea
          className="TeXEditor-texValue"
          onChange={onValueChange}
          ref={textareaRef.current}
          value={texValue}
        />
        <div className="TeXEditor-buttons">
          <button
            className={buttonClass}
            disabled={invalidTeX}
            onClick={save}
            type="button"
          >
            {invalidTeX ? "Invalid TeX" : "Done"}
          </button>
          <button
            className="TeXEditor-removeButton"
            onClick={remove}
            type="button"
          >
            Remove
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <KaTexOutput content={texContent} onClick={onClick} />
      {editPanel}
    </div>
  );
};

export default TeXBlock;
