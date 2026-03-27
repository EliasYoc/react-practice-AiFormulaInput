import React, { useRef, useState } from "react";
import { Chip, ClickAwayListener } from "@mui/material";
import styled from "styled-components";

// ================= STYLES =================

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 6px;
  cursor: text;
  min-height: 40px;
  gap: 2px;
`;

// const TokenBox = styled.span`
//   padding: 4px 6px;
//   margin: 2px;
//   border-radius: 4px;
//   background: #eee;
//   font-size: 14px;
// `;

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

export default function FormulaInput({
  value,
  onChange,
  cursorIndex,
  setCursorIndex,
  insertToken,
  removeToken,
  moveCursorIndex,
}) {
  const inputRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);

  // ========== HELPERS ==========

  const focusInput = () => {
    inputRef.current && inputRef.current.focus();
  };

  const handleClickAway = () => {
    inputRef.current && inputRef.current.blur();
  };

  // ========== KEYBOARD ==========

  const handleKeyDown = (e) => {
    e.preventDefault();
    if (e.key === "Backspace") {
      removeToken();
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
    <ClickAwayListener onClickAway={handleClickAway}>
      <Container onClick={focusInput}>
        {value.map((token, i) => (
          <React.Fragment key={i}>
            {cursorIndex === i && isFocused && <Cursor />}

            {["letter", "space", "number"].includes(token.type) ? (
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  setCursorIndex(i + 1);
                  focusInput();
                }}
                style={{ padding: token.type === "space" ? "0 .2rem" : "" }}
              >
                {token.value}
              </span>
            ) : (
              <Chip
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  setCursorIndex(i + 1);
                  focusInput();
                }}
                label={token.value}
              />
            )}
          </React.Fragment>
        ))}

        {cursorIndex === value.length && isFocused && <Cursor />}

        <HiddenInput
          id="hidden-input"
          ref={inputRef}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </Container>
    </ClickAwayListener>
  );
}
