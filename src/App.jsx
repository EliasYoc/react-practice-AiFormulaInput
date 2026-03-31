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

const sectionsData = [
  {
    id: "operators",
    title: "Operadores",
    kind: "operator",
    items: ["+", "-", "*", "/", "<", "<=", "=", ">", ">=", "!=", "and", "or"],
  },
  {
    id: "functions",
    title: "Funciones",
    kind: "function",
    items: ["if", "sum", "round"],
  },
  // las siguientes secciones serian dinamicas por lo que deben venir por props
  {
    id: "layout",
    title: "Variables de layout",
    kind: "layout",
    items: ["Nombretab.valor factura", "segundatab.monto total por recibir"],
  },
  {
    id: "global",
    title: "Variables globales",
    kind: "global",
    items: [
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
    items: [
      "variable_name",
      "variable_name",
      "variable_name",
      "variable_name",
      "variable_name",
    ],
  },
];
function App() {
  const [value, setValue] = useState([]);

  return (
    <>
      <input type="text" placeholder="input para probar tab" />
      <GPTFormulaBuilder
        value={value}
        onChange={setValue}
        sectionsData={sectionsData}
        tokenPatterns={patterns}
      />
      <input type="text" placeholder="input para probar tab" />
    </>
  );
}

export default App;
