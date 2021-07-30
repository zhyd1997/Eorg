import React from "react";
import { baseUrl } from "../baseUrl";

type LogOutProps = {
  setResponse: any;
  setTips: any;
  storeCollector: any;
};

export const LogOut = ({
  setResponse,
  setTips,
  storeCollector,
}: LogOutProps) => {
  function logOut(): void {
    fetch(`${baseUrl}users/logout`, {
      method: "GET",
    }).then(() => {
      localStorage.removeItem("login");
      storeCollector();
      setResponse("Logout Successfully!");
      setTips("tips success");
      setTimeout(() => setTips("tips-fade"), 3000);
    });
  }

  return (
    <div>
      <button
        type="button"
        className="btn btn-outline-secondary"
        onClick={logOut}>
        LogOut
      </button>
    </div>
  );
};
