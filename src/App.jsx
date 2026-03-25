import { useState } from "react";
import "./App.css";
import FormulaInput from "./components/GPTFormulaInput";

function App() {
  const [tokens, setTokens] = useState([]);
  return (
    <>
      <FormulaInput value={tokens} onChange={setTokens} />

      <pre>{JSON.stringify(tokens, null, 2)}</pre>
    </>
  );
}

export default App;
