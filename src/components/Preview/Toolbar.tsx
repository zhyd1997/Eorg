import React from "react";

import { useAuth } from "@/hooks/useAuth";

import { download } from "./utils";

type ToolbarProps = {
  disabled: boolean;
  onClick: () => void;
};

const Toolbar = ({ disabled, onClick }: ToolbarProps) => {
  const auth = useAuth();

  function handleZipDownload(): void {
    download(auth.token, "application/zip", "zip");
  }

  function handlePDFDownload(): void {
    download(auth.token, "application/pdf", "pdf");
  }

  const preview = (
    <button
      type="button"
      disabled={disabled}
      className="btn btn-sm btn-secondary"
      onClick={onClick}
    >
      preview
    </button>
  );

  const downloadButtons = (
    <span style={{ position: "absolute", margin: 0, left: "100px" }}>
      <i
        className="far fa-file-archive fa-2x"
        onClick={handleZipDownload}
        role="button"
        aria-label="archive-file"
        aria-hidden="true"
        aria-disabled={disabled}
        tabIndex={0}
      />
      &nbsp;&nbsp;&nbsp;&nbsp;
      <i
        className="far fa-file-pdf fa-2x"
        onClick={handlePDFDownload}
        role="button"
        aria-label="pdf"
        aria-hidden="true"
        aria-disabled={disabled}
        tabIndex={-1}
      />
    </span>
  );

  return (
    <div className="download">
      {preview}
      {!auth.isAuthenticated ? null : downloadButtons}
    </div>
  );
};

export default Toolbar;
