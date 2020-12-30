import React, { useState } from "react";
import "./App.css";
import CovidMap from "./components/CovidMap";
import CovidData from "./components/CovidData";

function App() {
  const [selected, setSelected] = useState("AL");

  const handleMapClick = (newValue) => {
    setSelected(newValue);
  };

  return (
    <div className="App">
      <CovidMap clickHandler={handleMapClick} />
      <br />
      <CovidData abbr={selected} />
    </div>
  );
}

export default App;
