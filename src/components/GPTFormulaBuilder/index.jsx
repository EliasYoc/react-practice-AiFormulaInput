import { useState } from "react";
import FormulaInput from "./components/GPTFormulaInput";
import { Button } from "@mui/material";
import FormulaPopover from "./components/GPTFormulaPopover";
import { useInputTokens } from "./hooks/useFormulaInput";

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

const selectedFunctionToken = {
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
  return selectedFunctionToken[functionName] || [];
};

const GPTFormulaBuilder = ({ value, onChange }) => {
  // const [tokens, setTokens] = useState([]);
  const [popoverAnchorEl, setPopoverAnchorEl] = useState(null);
  const {
    cursorIndex,
    setCursorIndex,
    insertToken,
    removeLastToken,
    moveCursorIndex,
    clear,
  } = useInputTokens({ tokens: value, onInsertToken: onChange });

  const handlePopoverOpen = (event) => {
    setPopoverAnchorEl(popoverAnchorEl ? null : event.currentTarget);
  };

  const handlePopoverClose = () => {
    setPopoverAnchorEl(null);
  };

  const handlePopoverSelect = (item) => {
    if (item.section.kind === "function") {
      const functionTokens = getFunctionTokens(item.value);
      console.log("functionTokens", functionTokens);
      insertToken(functionTokens);

      return;
    }
    insertToken({ type: item.section.kind, value: item.value });
  };
  return (
    <>
      <FormulaInput
        value={value}
        // onChange={onChange}
        cursorIndex={cursorIndex}
        setCursorIndex={setCursorIndex}
        insertToken={insertToken}
        removeLastToken={removeLastToken}
        moveCursorIndex={moveCursorIndex}
        onClick={handlePopoverOpen}
      />

      <Button onClick={() => console.log(clear())}>Clear</Button>

      <FormulaPopover
        anchorEl={popoverAnchorEl}
        open={Boolean(popoverAnchorEl)}
        onClose={handlePopoverClose}
        sections={sectionsData}
        onSelect={handlePopoverSelect}
      />
      <pre>{JSON.stringify(value, null, 2)}</pre>
    </>
  );
};

export default GPTFormulaBuilder;
