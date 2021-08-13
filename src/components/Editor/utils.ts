import { ContentBlock, DraftStyleMap } from "draft-js";

// Custom overrides for "code" style.
export const styleMap: DraftStyleMap = {
  CODE: {
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    fontFamily: "\"Inconsolata\", \"Menlo\", \"Consolas\", monospace",
    fontSize: 16,
    padding: 2
  }
};

export function getBlockStyle(block: ContentBlock): any {
  switch (block.getType()) {
    case "blockquote":
      return "RichEditor-blockquote";
    default:
      return null;
  }
}
