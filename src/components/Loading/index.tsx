import React from "react";
import { Spinner } from "reactstrap";

type LoadingProps = {
  isLoading: boolean;
};

const Loading = ({ isLoading }: LoadingProps) => {
  if (isLoading) {
    return <Spinner className="spinner" type="grow" />;
  }
  return null;
};

export default Loading;
