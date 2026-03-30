import "./App.css";
import GPTFormulaBuilder from "./components/GPTFormulaBuilder";
import { useState } from "react";

function App() {
  const [value, setValue] = useState([]);

  return (
    <>
      <GPTFormulaBuilder value={value} onChange={setValue} />
    </>
  );
}

export default App;
