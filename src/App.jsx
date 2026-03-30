import { useState } from "react";
import "./App.css";
import GPTFormulaBuilder from "./components/GPTFormulaBuilder";

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
      { type: "operator", value: ">" },
      { type: "operator", value: "=" },
    ],
    result: {
      type: "operator",
      value: ">=",
    },
  },
  {
    match: [
      { type: "operator", value: "!" },
      { type: "operator", value: "=" },
    ],
    result: {
      type: "operator",
      value: "!=",
    },
  },
  {
    match: [
      { type: "letter", value: "a" },
      { type: "letter", value: "n" },
      { type: "letter", value: "d" },
    ],
    result: {
      type: "operator",
      value: "and",
    },
  },
  {
    match: [
      { type: "letter", value: "o" },
      { type: "letter", value: "r" },
    ],
    result: {
      type: "operator",
      value: "or",
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
