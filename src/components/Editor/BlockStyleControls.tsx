import React from "react";
import { FormatListBulleted, Functions, Image } from "@material-ui/icons";
import { StyleButton } from "./StyleButton";
import { StyleControlsProps } from "./types";

const BLOCK_TYPES = [
  { label: "H1", style: "header-one", icon: "" },
  { label: "H2", style: "header-two", icon: "" },
  { label: "H3", style: "header-three", icon: "" },
  { label: "Math", style: "math", icon: <Functions /> },
  { label: "Image", style: "image-block", icon: <Image /> },
  // {label: 'H4', style: 'header-four'},
  // {label: 'H5', style: 'header-five'},
  // {label: 'H6', style: 'header-six'},
  // {label: 'Blockquote', style: 'blockquote'},
  { label: "UL", style: "unordered-list-item", icon: <FormatListBulleted /> },
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
          label={type.label}
          icon={type.icon}
          onToggle={props.onToggle}
          style={type.style}
        />
      ))}
    </div>
  );
};
