import React from "react";

import { useAuth } from "@/hooks/useAuth";

import { LogIn } from "./LogIn";
import { LogOut } from "./LogOut";
import { SignUp } from "./SignUp";

export const Header = () => {
  const auth = useAuth();

  return (
    <div className="Header">
      <span className={auth.tips}>{auth.response}</span>
      {!auth.isAuthenticated ? (
        <div className="nav-item-auth">
          <LogIn />
          <SignUp />
        </div>
      ) : (
        <div className="nav-item-auth">
          <div>{auth.user}</div>
          <LogOut />
        </div>
      )}
    </div>
  );
};
