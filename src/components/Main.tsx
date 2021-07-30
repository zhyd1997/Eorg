import React, { useState, useEffect } from "react";
import RichTextEditor from "./Editor";
import { Header } from "./Header";

const Main = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [store, setStore] = useState({ token: "" });

  function storeCollector(): void {
    const localStore = JSON.parse(localStorage.getItem("login")!);

    if (localStore && localStore.login) {
      setIsAuthenticated(true);
      setStore(localStore);
    } else {
      setIsAuthenticated(false);
      setStore({ token: "" });
    }
  }

  useEffect(() => {
    storeCollector();
  }, [isAuthenticated]);

  return (
    <div>
      <Header
        storeCollector={storeCollector}
        isAuthenticated={isAuthenticated}
      />
      <RichTextEditor login={isAuthenticated} store={store} />
    </div>
  );
};

export default Main;
