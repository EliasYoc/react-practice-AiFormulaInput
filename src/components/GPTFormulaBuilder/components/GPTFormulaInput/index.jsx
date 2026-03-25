import React, { useRef, useState } from "react";
import { Box } from "@mui/material";
import styled from "styled-components";

// ================= STYLES =================

const Container = styled(Box)`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 6px;
  cursor: text;
  min-height: 40px;
`;

const TokenBox = styled.span`
  padding: 4px 6px;
  margin: 2px;
  border-radius: 4px;
  background: #eee;
  font-size: 14px;
`;

const Cursor = styled.span`
  display: inline-block;
  width: 1px;
  height: 20px;
  background: black;
  margin: 0 1px;
  animation: blink 1s infinite;

  @keyframes blink {
    0%,
    50%,
    100% {
      opacity: 1;
    }
    25%,
    75% {
      opacity: 0;
    }
  }
`;

const HiddenInput = styled.input`
  position: absolute;
  opacity: 0;
  pointer-events: none;
`;

// ================= COMPONENT =================

export default function FormulaInput({ value, onChange }) {
  const [cursorIndex, setCursorIndex] = useState(value.length);
  const inputRef = useRef(null);

  // ========== HELPERS ==========

  const focusInput = () => {
    inputRef.current?.focus();
  };

  const insertToken = (token) => {
    const newTokens = [...value];
    newTokens.splice(cursorIndex, 0, token);

    setCursorIndex(cursorIndex + 1);
    onChange(newTokens);
  };

  const handleBackspace = () => {
    if (cursorIndex === 0) return;

    const newTokens = [...value];
    newTokens.splice(cursorIndex - 1, 1);

    setCursorIndex(cursorIndex - 1);
    onChange(newTokens);
  };

  // ========== KEYBOARD ==========

  const handleKeyDown = (e) => {
    e.preventDefault();
    if (e.key === "Backspace") {
      handleBackspace();
      return;
    }

    if (e.key === "ArrowLeft") {
      setCursorIndex((i) => Math.max(0, i - 1));
      return;
    }

    if (e.key === "ArrowRight") {
      setCursorIndex((i) => Math.min(value.length, i + 1));
      return;
    }
    console.log("key", e);
    console.log("key", e.target.value);
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
        "and",
        "or",
        "<=",
        ">=",
        "!=",
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

  // ========== RENDER ==========

  return (
    <Container onClick={focusInput}>
      {value.map((token, i) => (
        <React.Fragment key={i}>
          {cursorIndex === i && <Cursor />}

          {token.type === "letter" ||
          token.type === "space" ||
          token.type === "number" ? (
            <span style={{ padding: token.type === "space" ? "0 .2rem" : "" }}>
              {token.value}
            </span>
          ) : (
            <TokenBox
              onClick={(e) => {
                e.stopPropagation();
                setCursorIndex(i + 1);
                focusInput();
              }}
            >
              {token.value}
            </TokenBox>
          )}
        </React.Fragment>
      ))}

      {cursorIndex === value.length && <Cursor />}

      <HiddenInput ref={inputRef} onKeyDown={handleKeyDown} />
    </Container>
  );
}
