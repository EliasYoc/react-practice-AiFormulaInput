import { useState, useCallback } from "react";

export function useFormulaInput({ value, onChange }) {
  // Inicializamos el cursor al final de los tokens actuales
  const [cursorIndex, setCursorIndex] = useState(value.length);

  // Usamos useCallback para evitar recrear la función innecesariamente en cada render
  const insertToken = useCallback(
    (tokenOrTokens) => {
      // Asegurarnos de que siempre sea un array
      const tokensArray = Array.isArray(tokenOrTokens)
        ? tokenOrTokens
        : [tokenOrTokens];

      const newTokens = [...value];
      // Insertamos todos los tokens de golpe en la posición del cursor
      newTokens.splice(cursorIndex, 0, ...tokensArray);
      setCursorIndex(cursorIndex + tokensArray.length);
      onChange(newTokens);
    },
    [value, onChange, cursorIndex],
  );

  const removeToken = useCallback(() => {
    if (cursorIndex === 0) return;

    const newTokens = [...value];
    newTokens.splice(cursorIndex - 1, 1);

    setCursorIndex(cursorIndex - 1);
    onChange(newTokens);
  }, [value, onChange, cursorIndex]);

  const moveCursorIndex = useCallback(
    (direction) => {
      if (direction === "left") {
        setCursorIndex((i) => Math.max(0, i - 1));
      }
      if (direction === "right") {
        setCursorIndex((i) => Math.min(value.length, i + 1));
      }
    },
    [value.length],
  );

  // Retornamos todo lo que el componente necesitará
  return {
    cursorIndex,
    setCursorIndex,
    insertToken,
    removeToken,
    moveCursorIndex,
  };
}
