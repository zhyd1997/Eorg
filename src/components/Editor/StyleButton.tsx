import React from "react";

type StyleButtonProps = {
  style: string;
  active: boolean;
  label: string;
  onToggle: (style: string) => void;
};

export const StyleButton = ({
  onToggle,
  style,
  active,
  label,
}: StyleButtonProps) => {
  function onToggleStyle(e: any): void {
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
