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
  // onChange,
  cursorIndex,
  setCursorIndex,
  onClick,
  handleKeyDown,
}) {
  const inputRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  //mejor obtener el onfocus y onblur como props
  // ========== HELPERS ==========

  const focusInput = () => {
    inputRef.current && inputRef.current.focus();
  };

  // const handleClickAway = () => {
  //   inputRef.current && inputRef.current.blur();
  // };

  // ========== RENDER ==========

  return (
    <>
      <Container
        onClick={(e) => {
          focusInput();
          if (onClick) {
            onClick(e);
          }
        }}
      >
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
    </>
  );
}
