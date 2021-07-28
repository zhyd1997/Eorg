import React from "react";
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  Code,
} from "@material-ui/icons";
import { StyleButton } from "./StyleButton";
import { StyleControlsProps } from "./types";

const INLINE_STYLES = [
  { label: "Bold", style: "BOLD", icon: <FormatBold /> },
  { label: "Italic", style: "ITALIC", icon: <FormatItalic /> },
  { label: "Underline", style: "UNDERLINE", icon: <FormatUnderlined /> },
  { label: "Monospace", style: "CODE", icon: <Code /> },
];

export const InlineStyleControls = ({
  editorState,
  onToggle,
}: StyleControlsProps) => {
  const currentStyle = editorState.getCurrentInlineStyle();

  return (
    <div className="RichEditor-controls">
      {INLINE_STYLES.map((type) => (
        <StyleButton
          key={type.label}
          active={currentStyle.has(type.style)}
          label={type.label}
          icon={type.icon}
          onToggle={onToggle}
          style={type.style}
        />
      ))}
    </div>
  );
};
