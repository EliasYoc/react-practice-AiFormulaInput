import { useState } from "react";
import "./App.css";
import GPTFormulaBuilder from "./components/GPTFormulaBuilder";
import { Chip } from "@mui/material";

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

const sectionsData = [
  {
    id: "operators",
    title: "Operadores",
    kind: "operator",
    labels: ["+", "-", "*", "/", "<", "<=", "=", ">", ">=", "!=", "and", "or"],
  },
  {
    id: "functions",
    title: "Funciones",
    kind: "function",
    labels: ["if", "sum", "round"],
  },
  // las siguientes secciones serian dinamicas por lo que deben venir por props
  {
    id: "layout",
    title: "Variables de layout",
    kind: "layout",
    labels: ["Nombretab.valor factura", "segundatab.monto total por recibir"],
  },
  {
    id: "global",
    title: "Variables globales",
    kind: "global",
    labels: [
      "Saldo insoluto",
      "Servicio de deuda",
      "Garantias adicionales",
      "Reserva efectivo",
      "Garantias de maquinaria",
      "Saldo Garantias de inmuebles",
    ],
  },
  {
    id: "section",
    title: "Sección",
    kind: "section",
    labels: [
      "variable_name",
      "variable_name",
      "variable_name",
      "variable_name",
      "variable_name",
    ],
  },
];

//hay una forma de no usar type?
const functionTokenDict = {
  if: [
    { type: "function", value: "if(" },
    { type: "statement-terminator", value: ";" },
    { type: "statement-terminator", value: ";" },
    { type: "paren", value: ")" },
  ],
  sum: [
    { type: "function", value: "sum(" },
    { type: "statement-terminator", value: ";" },
    { type: "paren", value: ")" },
  ],
  round: [
    { type: "function", value: "round(" },
    { type: "paren", value: ")" },
  ],
};

const getFunctionTokens = (functionName) => {
  return functionTokenDict[functionName] || [];
};

function App() {
  const [value, setValue] = useState([]);

  return (
    <>
      <input type="text" placeholder="input para probar tab" />
      <GPTFormulaBuilder
        fullWidth
        placeholder="Escribe una formula"
        value={value}
        onChange={setValue}
        sectionsData={sectionsData}
        tokenPatterns={patterns}
        formatSelectedToken={(tokenItem) => {
          if (tokenItem.section.kind === "function") {
            const functionTokens = getFunctionTokens(tokenItem.value);
            console.log("functionTokens", functionTokens);

            return functionTokens;
          }
        }}
        renderOption={(option) => {
          return <Chip label={option.label} />;
        }}
        renderOptionToken={(token) => {
          return <Chip size="small" label={token.value} />;
        }}
        allowedTokenKeys={[
          { regex: /[+\-*/=<>!]/, type: "operator" },
          { keys: [";"], type: "statement-terminator" },
          { keys: ["(", ")"], type: "parenthesis" },
          { keys: ["``"], type: "backtick" },
          //aqui existe type parenthesis, pero en el dict de funciones existe type paren, hay que unificar. Tal vez inutilizar type de patterns
        ]}
      />
      <input type="text" placeholder="input para probar tab" />
    </>
  );
}
export default App;
