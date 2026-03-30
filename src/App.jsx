import "./App.css";
import GPTFormulaBuilder from "./components/GPTFormulaBuilder";
import { useEffect, useState } from "react";
import { transformTokens } from "./components/GPTFormulaBuilder/utils/transformTokens";
const tokens = [
  {
    type: "letter",
    value: "i",
  },
  {
    type: "letter",
    value: "f",
  },
  {
    type: "paren",
    value: "(",
  },
  {
    type: "number",
    value: "2",
  },
  {
    type: "operator",
    value: "<",
  },
  {
    type: "operator",
    value: "=",
  },
  {
    type: "number",
    value: "2",
  },
  {
    type: "paren",
    value: ")",
  },
];

const patterns = [
  {
    match: [
      { type: "letter", value: "i" },
      { type: "letter", value: "f" },
      { type: "paren", value: "(" },
    ],
    result: {
      type: "function",
      value: "if(",
    },
  },
  {
    match: [
      { type: "operator", value: "<" },
      { type: "operator", value: "=" },
    ],
    result: {
      type: "operator",
      value: "<=",
    },
  },
  {
    match: [
      { type: "letter", value: "s" },
      { type: "letter", value: "u" },
      { type: "letter", value: "m" },
      { type: "paren", value: "(" },
    ],
    result: {
      type: "function",
      value: "sum(",
    },
  },
  {
    match: [
      { type: "letter", value: "r" },
      { type: "letter", value: "o" },
      { type: "letter", value: "u" },
      { type: "letter", value: "n" },
      { type: "letter", value: "d" },
      { type: "paren", value: "(" },
    ],
    result: {
      type: "function",
      value: "round(",
    },
  },
];

function App() {
  const [value, setValue] = useState([]);

  return (
    <>
      <GPTFormulaBuilder
        value={value}
        onChange={setValue}
        tokenPatterns={patterns}
      />
    </>
  );
}

export default App;
