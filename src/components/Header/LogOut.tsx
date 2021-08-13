import React from "react";

import { useAuth } from "@/hooks/useAuth";

export const LogOut = () => {
  const auth = useAuth();

  function logOut(): void {
    auth.signout();
  }

  return (
    <div>
      <button
        type="button"
        className="btn btn-outline-secondary"
        onClick={logOut}
      >
        LogOut
      </button>
    </div>
  );
};
