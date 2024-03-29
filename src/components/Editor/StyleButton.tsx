import React from "react";

type StyleButtonProps = {
  style: string;
  active: boolean;
  icon: any;
  onToggle: (style: string) => void;
};

export const StyleButton = ({
  onToggle,
  style,
  active,
  icon
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
    <span className={className} onMouseDown={onToggleStyle}>
      {icon}
    </span>
  );
};
