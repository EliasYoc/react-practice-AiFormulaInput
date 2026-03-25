import { useState } from "react";
import FormulaInput from "./components/GPTFormulaInput";
import { Button } from "@mui/material";
import FormulaPopover from "./components/GPTFormulaPopover";

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

const GPTFormulaBuilder = () => {
  const [tokens, setTokens] = useState([]);
  const [popoverAnchorEl, setPopoverAnchorEl] = useState(null);

  const handlePopoverOpen = (event) => {
    setPopoverAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setPopoverAnchorEl(null);
  };

  const handlePopoverSelect = (item) => {
    console.log("Seleccionado:", item);
  };
  return (
    <>
      <FormulaInput value={tokens} onChange={setTokens} />
      <Button onClick={handlePopoverOpen}>Abrir</Button>

      <FormulaPopover
        anchorEl={popoverAnchorEl}
        open={Boolean(popoverAnchorEl)}
        onClose={handlePopoverClose}
        sections={sectionsData}
        onSelect={handlePopoverSelect}
      />
      <pre>{JSON.stringify(tokens, null, 2)}</pre>
    </>
  );
};

export default GPTFormulaBuilder;
