import React, { useEffect, useMemo, useState } from "react";
import FormulaInput from "./components/GPTFormulaInput";
import { Button } from "@mui/material";
import FormulaPopover from "./components/GPTFormulaPopover";
import { useInputTokens } from "./hooks/useInputTokens";
import { transformTokens } from "./utils/transformTokens";
import { debounce } from "lodash";
const getAllowedTokenRule = (value, allowedTokens) => {
  if (allowedTokens && allowedTokens.length > 0) {
    const foundTokenRule = allowedTokens.find((tokenRule) => {
      if (tokenRule.keys && tokenRule.keys.includes(value)) {
        return true;
      }

      if (tokenRule.regex && tokenRule.regex.test(value)) {
        return true;
      }
      return false;
    });
    return foundTokenRule;
  }
};
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
  fullWidth,
  size,
  disabled,
  placeholder,
  allowedTokenKeys,
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
    console.log("select item", item);
    if (formatSelectedToken) {
      const tokenValues = formatSelectedToken(item);

      const tokens =
        tokenValues &&
        tokenValues.map((tokenValue) => {
          const allowedTokenRule = getAllowedTokenRule(
            tokenValue,
            allowedTokenKeys,
          );
          const tokenType = allowedTokenRule && allowedTokenRule.type;
          return {
            type: tokenType || item.section.kind,
            value: tokenValue,
          };
        });
      //si el token es undefinde entonces instertará el token por defecto
      insertToken(tokens || { type: item.section.kind, value: item.value });
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

    const allowedTokenRule = getAllowedTokenRule(e.key, allowedTokenKeys);
    console.log("allowedTokenRule", allowedTokenRule);
    if (allowedTokenRule) {
      insertToken({ type: allowedTokenRule.type, value: e.key });
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
    }, 600);
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
        cursorIndex={cursorIndex}
        setCursorIndex={setCursorIndex}
        onClick={handlePopoverOpen}
        handleKeyDown={handleKeyDown}
        onClickClear={() => clear()}
        renderOptionToken={renderOptionToken}
        fullWidth={fullWidth}
        size={size}
        disabled={disabled}
        placeholder={placeholder}
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
