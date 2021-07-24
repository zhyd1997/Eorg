import { EditorState } from "draft-js";

export type StyleControlsProps = {
  editorState: EditorState;
  onToggle: (style: string) => void;
};
