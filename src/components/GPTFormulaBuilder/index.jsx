import React, { useEffect, useMemo, useState } from "react";
import FormulaInput from "./components/GPTFormulaInput";
import { Button } from "@mui/material";
import FormulaPopover from "./components/GPTFormulaPopover";
import { useInputTokens } from "./hooks/useInputTokens";
import { transformTokens } from "./utils/transformTokens";
import { debounce } from "lodash";

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

const GPTFormulaBuilder = ({ value, onChange, tokenPatterns = [] }) => {
  const [popoverAnchorEl, setPopoverAnchorEl] = useState(null);
  const {
    cursorIndex,
    setCursorIndex,
    insertToken,
    removeLastToken,
    moveCursorIndex,
    clear,
    replaceTokens,
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

  // ========== KEYBOARD ==========

  const handleKeyDown = (e) => {
    e.preventDefault();
    if (e.key === "Backspace") {
      removeLastToken();
      return;
    }

    if (e.key === "ArrowLeft") {
      moveCursorIndex("left");
      return;
    }

    if (e.key === "ArrowRight") {
      moveCursorIndex("right");
      return;
    }

    // números
    if (e.code === "Space") {
      insertToken({ type: "space", value: " " });
      return;
    }

    if (/^[0-9]$/.test(e.key)) {
      insertToken({ type: "number", value: e.key });
      return;
    }

    if (/^[a-zA-Z]$/.test(e.key)) {
      insertToken({ type: "letter", value: e.key });
      return;
    }

    // operadores simples
    if (
      [
        "+",
        "-",
        "*",
        "/",
        "=",
        "<",
        ">",
        // "and",
        // "or",
        // "<=",
        // ">=",
        // "!=",
        "!",
      ].includes(e.key)
    ) {
      insertToken({ type: "operator", value: e.key });
      return;
    }

    if ([";"].includes(e.key)) {
      insertToken({ type: "statement-terminator", value: e.key });
      return;
    }

    // paréntesis
    if (["(", ")"].includes(e.key)) {
      insertToken({ type: "paren", value: e.key });
      return;
    }
  };

  const transformTokensDebounced = useMemo(() => {
    return debounce((tokens) => {
      const transformedTokens = transformTokens(tokens, tokenPatterns);
      if (transformedTokens.length !== tokens.length) {
        // para evvitar loop infinito, aunque no se si esté bien corregir que transformTokens devuelva true si hizo match
        replaceTokens(transformedTokens);
      }
      console.log("transformedTokens", transformedTokens);
    }, 350);
  }, [tokenPatterns, replaceTokens]);

  useEffect(() => {
    console.log("effect", value);
    //este se ejecuta al usar la key y el popper (evitar ejecutarse al seleccionar en popper)
    transformTokensDebounced(value);
    return () => {
      transformTokensDebounced.cancel();
    };
  }, [value, transformTokensDebounced]);

  return (
    <>
      <FormulaInput
        value={value}
        // onChange={onChange}
        cursorIndex={cursorIndex}
        setCursorIndex={setCursorIndex}
        onClick={handlePopoverOpen}
        handleKeyDown={handleKeyDown}
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
