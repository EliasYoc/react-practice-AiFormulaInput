import { useState, useCallback } from "react";

export function useInputTokens({ tokens, onInsertToken }) {
  // Inicializamos el cursor al final de los tokens actuales
  const [cursorIndex, setCursorIndex] = useState(tokens.length);

  // Usamos useCallback para evitar recrear la función innecesariamente en cada render
  const insertToken = useCallback(
    (tokenOrTokens) => {
      // Asegurarnos de que siempre sea un array
      const tokensArray = Array.isArray(tokenOrTokens)
        ? tokenOrTokens
        : [tokenOrTokens];

      const newTokens = [...tokens];
      // Insertamos todos los tokens de golpe en la posición del cursor
      newTokens.splice(cursorIndex, 0, ...tokensArray);
      setCursorIndex(cursorIndex + tokensArray.length);
      onInsertToken(newTokens);
    },
    [tokens, onInsertToken, cursorIndex],
  );

  const removeLastToken = useCallback(() => {
    if (cursorIndex === 0) return;

    const newTokens = [...tokens];
    newTokens.splice(cursorIndex - 1, 1);

    setCursorIndex(cursorIndex - 1);
    onInsertToken(newTokens);

    return newTokens;
  }, [tokens, onInsertToken, cursorIndex]);

  const moveCursorIndex = useCallback(
    (direction) => {
      if (direction === "left") {
        setCursorIndex((i) => Math.max(0, i - 1));
      }
      if (direction === "right") {
        setCursorIndex((i) => Math.min(tokens.length, i + 1));
      }
    },
    [tokens.length],
  );

  const clear = () => {
    onInsertToken([]);
    setCursorIndex(0);
    return tokens;
  };

  // Retornamos todo lo que el componente necesitará
  return {
    cursorIndex,
    setCursorIndex,
    insertToken,
    removeLastToken,
    moveCursorIndex,
    clear,
  };
}
