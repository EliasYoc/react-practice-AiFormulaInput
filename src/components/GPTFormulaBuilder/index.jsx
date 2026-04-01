import React, { useEffect, useMemo, useState } from "react";
import FormulaInput from "./components/GPTFormulaInput";
import { Button } from "@mui/material";
import FormulaPopover from "./components/GPTFormulaPopover";
import { useInputTokens } from "./hooks/useInputTokens";
import { transformTokens } from "./utils/transformTokens";
import { debounce } from "lodash";
//un token abarca un caracter individual dentro del input y si das formato el token puede abarcar mas de un caracter
//el nombre "opcion" se refiere al item que se ubica en el menu que se divide en secciones, al seleccionar se agrega el token al input. Por lo tanto puede haber muchas opciones en las secciones
const GPTFormulaBuilder = ({
  value,
  onChange,
  tokenPatterns = [],
  sectionsData,
  formatSelectedToken,
  renderOption,
  renderOptionToken,
}) => {
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
    if (formatSelectedToken) {
      const token = formatSelectedToken(item);
      //si el token es undefinde entonces instertará el token por defecto
      insertToken(token || { type: item.section.kind, value: item.value });
      return;
    }

    insertToken({ type: item.section.kind, value: item.value });
  };

  // ========== KEYBOARD ==========

  const handleKeyDown = (e) => {
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
    if (["+", "-", "*", "/", "=", "<", ">", "!"].includes(e.key)) {
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
        onClickClear={() => clear()}
        renderOptionToken={renderOptionToken}
      />

      <FormulaPopover
        anchorEl={popoverAnchorEl}
        open={Boolean(popoverAnchorEl)}
        onClose={handlePopoverClose}
        sections={sectionsData}
        onSelect={handlePopoverSelect}
        renderOption={renderOption}
      />
      <pre>{JSON.stringify(value, null, 2)}</pre>
    </>
  );
};

export default GPTFormulaBuilder;
