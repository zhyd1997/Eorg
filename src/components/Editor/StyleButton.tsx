import React from "react";
import { ToggleButton } from "@material-ui/lab";

type StyleButtonProps = {
  style: string;
  active: boolean;
  label: string;
  icon: any;
  onToggle: (style: string) => void;
};

export const StyleButton = ({
  onToggle,
  style,
  active,
  label,
  icon,
}: StyleButtonProps) => {
  function onToggleStyle(e: any): void {
    e.preventDefault();
    onToggle(style);
  }

  let className = "RichEditor-styleButton";
  if (active) {
    className += " RichEditor-activeButton";
  }

  if (icon === "") {
    return (
      // eslint-disable-next-line jsx-a11y/no-static-element-interactions
      <span className={className} onMouseDown={onToggleStyle}>
        {label}
      </span>
    );
  }

  return (
    <ToggleButton value={label} aria-label={label} onMouseDown={onToggleStyle}>
      {icon}
    </ToggleButton>
  );
};
