import React from "react";
import { StyleButton } from "./StyleButton";
import { StyleControlsProps } from "./types";
import H1Icon from "../../icons/type-h1.svg";
import H2Icon from "../../icons/type-h2.svg";
import H3Icon from "../../icons/type-h3.svg";
import MathIcon from "../../icons/math.svg";
import ImageIcon from "../../icons/image.svg";
import ULIcon from "../../icons/list-ul.svg";

const BLOCK_TYPES = [
  { label: "H1", style: "header-one", icon: <H1Icon /> },
  { label: "H2", style: "header-two", icon: <H2Icon /> },
  { label: "H3", style: "header-three", icon: <H3Icon /> },
  { label: "Math", style: "math", icon: <MathIcon /> },
  { label: "Image", style: "image-block", icon: <ImageIcon /> },
  // {label: 'H4', style: 'header-four'},
  // {label: 'H5', style: 'header-five'},
  // {label: 'H6', style: 'header-six'},
  // {label: 'Blockquote', style: 'blockquote'},
  { label: "UL", style: "unordered-list-item", icon: <ULIcon /> },
  // {label: 'OL', style: 'ordered-list-item'},
  // {label: 'Code Block', style: 'code-block'},
];

export const BlockStyleControls = (props: StyleControlsProps) => {
  const { editorState } = props;
  const selection = editorState.getSelection();
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();

  return (
    <div className="RichEditor-controls">
      {BLOCK_TYPES.map((type) => (
        <StyleButton
          key={type.label}
          active={type.style === blockType}
          icon={type.icon}
          onToggle={props.onToggle}
          style={type.style}
        />
      ))}
    </div>
  );
};
