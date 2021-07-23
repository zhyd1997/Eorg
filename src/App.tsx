import React from "react";
import "./App.css";
import { isMobile } from "react-device-detect";
import Main from "./components/Main";

const MobileTips = () => (
  <p>
    Sorry, but&nbsp;<b>Eorg</b>&nbsp;haven&#39;t supported on mobile phone, and
    open it on PC please.
  </p>
);

const WebSupported = () => (
  <div className="App">
    <Main />
  </div>
);

function App() {
  return isMobile ? <MobileTips /> : <WebSupported />;
}

export default App;
