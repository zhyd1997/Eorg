import React from "react";
import { ContentBlock, EditorState } from "draft-js";

interface Toggle {
  onToggle: (style: string) => void;
}

interface StyleButtonProps extends Toggle {
  style: string;
  active: boolean;
  label: string;
}

interface StyleControlsProps extends Toggle {
  editorState: EditorState;
}

const StyleButton = ({ onToggle, style, active, label }: StyleButtonProps) => {
  // @ts-expect-error ts-migrate(7006) FIXME: Parameter 'e' implicitly has an 'any' type.
  function onToggleStyle(e): void {
    e.preventDefault();
    onToggle(style);
  }
  let className = "RichEditor-styleButton";
  if (active) {
    className += " RichEditor-activeButton";
  }

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <span className={className} onMouseDown={onToggleStyle}>
      {label}
    </span>
  );
};

const INLINE_STYLES = [
  { label: "Bold", style: "BOLD" },
  { label: "Italic", style: "ITALIC" },
  { label: "Underline", style: "UNDERLINE" },
  { label: "Monospace", style: "CODE" },
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
          onToggle={onToggle}
          style={type.style}
        />
      ))}
    </div>
  );
};

const BLOCK_TYPES = [
  { label: "H1", style: "header-one" },
  { label: "H2", style: "header-two" },
  { label: "H3", style: "header-three" },
  { label: "Math", style: "math" },
  { label: "Image", style: "image-block" },
  // {label: 'H4', style: 'header-four'},
  // {label: 'H5', style: 'header-five'},
  // {label: 'H6', style: 'header-six'},
  // {label: 'Blockquote', style: 'blockquote'},
  { label: "UL", style: "unordered-list-item" },
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
          onToggle={props.onToggle}
          style={type.style}
        />
      ))}
    </div>
  );
};

// Custom overrides for "code" style.
export const styleMap = {
  CODE: {
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
    fontSize: 16,
    padding: 2,
  },
};

export function getBlockStyle(block: ContentBlock): null | string {
  switch (block.getType()) {
    case "blockquote":
      return "RichEditor-blockquote";
    default:
      return null;
  }
}
