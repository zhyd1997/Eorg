import { ContentState } from "draft-js";
import React, { useEffect, useRef, useState } from "react";

import { baseUrl } from "@/baseUrl";
import { useAuth } from "@/hooks/useAuth";

import Block from "../blockTypes";
import Image from "./image";

const ImageBlock = ({ block, contentState, blockProps }: Block) => {
  function getValue() {
    return contentState.getEntity(block.getEntityAt(0)).getData();
  }
  const { path, caption } = getValue();

  const [src, setSrc] = useState(path);
  const [title, setTitle] = useState(caption);
  const [titleValue, setTitleValue] = useState(caption);
  const [editImage, setEditImage] = useState(false);
  const [editCaption, setEditCaption] = useState(false);
  const [className, setClassName] = useState("img-initial");
  const textareaRef = useRef(null);

  const blockKey = block.getKey();
  const auth = useAuth();

  // @ts-expect-error ts-migrate(7006) FIXME: Parameter 'value' implicitly has an 'any' type.
  function usePrevious(value) {
    const ref = useRef(null);
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  }
  const previousTitle = usePrevious(caption);

  function startEdit(): void {
    blockProps.onStartEdit(block.getKey());
  }

  function finishEdit(newContentState: ContentState): void {
    blockProps.onFinishEdit(block.getKey(), newContentState);
  }

  function remove(): void {
    blockProps.onRemove(block.getKey());
  }

  function save(): void {
    const entityKey = block.getEntityAt(0);
    let currentCaption = "";
    if (previousTitle !== titleValue) {
      setTitle(titleValue);
      currentCaption = titleValue;
    } else {
      currentCaption = titleValue;
    }
    const newContentState = contentState.mergeEntityData(entityKey, {
      path,
      caption: currentCaption
    });

    setEditCaption(false);
    setTitleValue(caption);

    finishEdit(newContentState);
  }

  function saveImage(filename?: string) {
    let currentPath = "";
    if (filename !== undefined) {
      currentPath = filename;
    } else {
      currentPath = path;
    }
    const entityKey = block.getEntityAt(0);
    const newContentState = contentState.mergeEntityData(entityKey, {
      path: currentPath,
      caption
    });
    setEditImage(false);
    setClassName("img-initial");

    finishEdit(newContentState);
  }

  // @ts-ignore
  function handleClick(e) {
    if (auth === null) return;

    const targetTag = ["IMG", "FIGCAPTION"];
    const { tagName } = e.target;
    if (targetTag.indexOf(tagName) === -1) return;

    if (tagName === "IMG") {
      setEditImage(true);
      setClassName((prevState) => `${prevState} img-active`);
    } else {
      setEditCaption(true);
    }
    startEdit();
  }

  function update(filename: string) {
    const TOKEN = `Bearer ${auth.token.token}`;
    fetch(`${baseUrl}/api/v1/figures/${blockKey}`, {
      method: "GET",
      headers: {
        "Content-Type": "image/jpeg",
        Authorization: TOKEN
      }
    })
      .then((res) => res.blob())
      .then((data) => {
        const fileURL = URL.createObjectURL(data);
        setSrc(fileURL);
      })
      .then(() => {
        saveImage(filename);
      });
  }

  // @ts-ignore
  function handleCaptionChange(e): void {
    setTitleValue(e.target.value);
  }

  const editPanel = (
    <div className="TeXEditor-panel">
      <textarea
        className="TeXEditor-texValue"
        onChange={handleCaptionChange}
        ref={textareaRef.current}
        value={titleValue}
      />
      <div className="TeXEditor-buttons">
        <button className="TeXEditor-saveButton" onClick={save} type="button">
          Done
        </button>
        <button className="TeXEditor-removeButton" onClick={save} type="button">
          Cancel
        </button>
      </div>
    </div>
  );

  let spanClassName = "hello-span";
  if (editImage || editCaption) {
    spanClassName += " edit-span";
  }

  return (
  // eslint-disable-next-line max-len
    <span className={spanClassName} onClick={handleClick}>
      <img src={src} alt="defaultImage" className={className} />
      {editImage ? (
        <Image blockKey={blockKey} update={update} save={saveImage} />
      ) : null}
      <figcaption>{title}</figcaption>
      {editCaption ? editPanel : null}
      {editImage ? (
        <button type="button" className="img-remove" onClick={remove}>
          &#10005;
        </button>
      ) : null}
    </span>
  );
};

export default ImageBlock;
