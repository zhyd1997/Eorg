import React from "react";
import { UncontrolledTooltip } from "reactstrap";

type ToolTipExampleProps = {
  target: string;
  text: string;
};

const Example = ({ target, text }: ToolTipExampleProps) => (
  <span>
    <UncontrolledTooltip placement="right" target={target}>
      {text}
    </UncontrolledTooltip>
  </span>
);

export default Example;
