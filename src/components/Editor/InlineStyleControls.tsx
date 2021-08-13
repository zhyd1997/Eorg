import React from "react";

import InlineCodeIcon from "@/icons/code.svg";
import BoldIcon from "@/icons/type-bold.svg";
import ItalicIcon from "@/icons/type-italic.svg";
import UnderlineIcon from "@/icons/type-underline.svg";

import { StyleButton } from "./StyleButton";
import { StyleControlsProps } from "./types";

const INLINE_STYLES = [
  { label: "Bold", style: "BOLD", icon: <BoldIcon /> },
  { label: "Italic", style: "ITALIC", icon: <ItalicIcon /> },
  { label: "Underline", style: "UNDERLINE", icon: <UnderlineIcon /> },
  { label: "InlineCode", style: "CODE", icon: <InlineCodeIcon /> }
];

export const InlineStyleControls = ({
  editorState,
  onToggle
}: StyleControlsProps) => {
  const currentStyle = editorState.getCurrentInlineStyle();

  return (
    <div className="RichEditor-controls">
      {INLINE_STYLES.map((type) => (
        <StyleButton
          key={type.label}
          active={currentStyle.has(type.style)}
          icon={type.icon}
          onToggle={onToggle}
          style={type.style}
        />
      ))}
    </div>
  );
};
