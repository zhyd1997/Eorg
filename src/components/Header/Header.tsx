import React, { useState } from "react";
import { LogIn } from "./LogIn";
import { LogOut } from "./LogOut";
import { SignUp } from "./SignUp";

type HeaderProps = {
  storeCollector: () => void;
  isAuthenticated: boolean;
};

export const Header = ({ storeCollector, isAuthenticated }: HeaderProps) => {
  const [response, setResponse] = useState("");
  const [tips, setTips] = useState("tips");

  return (
    <div className="Header">
      <span className={tips}>{response}</span>
      {!isAuthenticated ? (
        <div className="nav-item-auth">
          <LogIn
            storeCollector={storeCollector}
            setResponse={setResponse}
            setTips={setTips}
          />
          <SignUp setResponse={setResponse} setTips={setTips} />
        </div>
      ) : (
        <div className="nav-item-auth">
          <div>{JSON.parse(localStorage.getItem("login")!).username}</div>
          <LogOut
            storeCollector={storeCollector}
            setResponse={setResponse}
            setTips={setTips}
          />
        </div>
      )}
    </div>
  );
};
