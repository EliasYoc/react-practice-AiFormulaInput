import { useState } from "react";
import "./App.css";
import GPTFormulaBuilder from "./components/GPTFormulaBuilder";
import { Chip } from "@mui/material";

const patterns = [
  {
    match: ["i", "f", "("],
    result: {
      type: "function",
      value: "IF(",
    },
  },
  {
    match: ["<", "="],
    result: {
      type: "operator",
      value: "<=",
    },
  },
  {
    match: [">", "="],
    result: {
      type: "operator",
      value: ">=",
    },
  },
  {
    match: ["!", "="],
    result: {
      type: "operator",
      value: "!=",
    },
  },
  {
    match: ["a", "n", "d"],
    result: {
      type: "operator",
      value: "and",
    },
  },
  {
    match: ["o", "r"],
    result: {
      type: "operator",
      value: "or",
    },
  },
  {
    match: ["s", "u", "m", "("],
    result: {
      type: "function",
      value: "SUM(",
    },
  },
  {
    match: ["r", "o", "u", "n", "d", "("],
    result: {
      type: "function",
      value: "ROUND(",
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

const functionTokenDict = {
  if: ["IF(", ";", ";", ")"],
  sum: ["SUM(", ";", ")"],
  round: ["ROUND(", ")"],
};

const getFunctionTokens = (functionName) => {
  return functionTokenDict[functionName] || [];
};

const valueMock = [
  {
    order: 1,
    type: "operator",
    value: "IF(",
    color: "#B2DFDB",
  },
  {
    order: 2,
    type: "operator",
    value: "(",
    color: "#E0E0E0",
  },
  {
    order: 3,
    type: "var",
    value: "ingresos_operativos_mensuales_acumulados",
    color: "#BBDEFB",
  },
  {
    order: 4,
    type: "operator",
    value: "+",
    color: "#B2DFDB",
  },
  {
    order: 5,
    type: "var",
    value: "ingresos_extraordinarios_reportados_trimestralmente",
    color: "#BBDEFB",
  },
  {
    order: 6,
    type: "operator",
    value: ")",
    color: "#E0E0E0",
  },
  {
    order: 7,
    type: "operator",
    value: ">",
    color: "#B2DFDB",
  },
  {
    order: 8,
    type: "var",
    value: "limite_maximo_permitido_para_desviaciones_atipicas_historicas",
    color: "#BBDEFB",
  },
  {
    order: 9,
    type: "operator",
    value: ")",
    color: "#E0E0E0",
  },
  {
    order: 10,
    type: "operator",
    value: "ELSE(",
    color: "#B2DFDB",
  },
  {
    order: 11,
    type: "operator",
    value: "ROUND(",
    color: "#B2DFDB",
  },
  {
    order: 12,
    type: "var",
    value: "ingresos_operativos_mensuales_acumulados",
    color: "#BBDEFB",
  },
  {
    order: 13,
    type: "operator",
    value: ")",
    color: "#E0E0E0",
  },
  {
    order: 14,
    type: "operator",
    value: "==",
    color: "#B2DFDB",
  },
  {
    order: 15,
    type: "var",
    value: "objetivo_financiero_base_aprobado_comite",
    color: "#BBDEFB",
  },
  {
    order: 16,
    type: "operator",
    value: ")",
    color: "#E0E0E0",
  },
];

function App() {
  const [value, setValue] = useState(valueMock);

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
