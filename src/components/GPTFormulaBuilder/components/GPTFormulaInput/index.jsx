import React, { useRef, useState } from "react";
import { Chip, IconButton } from "@mui/material";
import styled from "styled-components";
import { ClearRounded } from "@mui/icons-material";

// ================= STYLES =================

const Container = styled.div`
  display: flex;
  position: relative;
  border: 1px solid #ccc;
  border-radius: 6px;
  justify-content: space-between;
  align-items: center;
  &:focus-within {
    outline: 2px solid #000;
  }
`;

const InputContainer = styled.div`
  display: flex;
  flex: 1;
  flex-wrap: wrap;
  align-items: center;
  padding: 8px;
  cursor: text;
  min-height: 40px;
  gap: 1px;
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
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
`;

// ================= COMPONENT =================

export default function FormulaInput({
  value,
  // onChange,
  cursorIndex,
  setCursorIndex,
  onClick,
  handleKeyDown,
  onClickClear,
  renderOptionToken,
}) {
  const inputRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  //mejor obtener el onfocus y onblur como props
  // ========== HELPERS ==========

  const focusInput = () => {
    inputRef.current && inputRef.current.focus();
  };

  return (
    <Container>
      <InputContainer
        onClick={(e) => {
          focusInput();
          if (onClick) {
            onClick(e);
          }
        }}
      >
        {value.map((token, i) => {
          const handleClick = (e) => {
            e.stopPropagation();
            setCursorIndex(i + 1);
            focusInput();
          };

          const defaultTokenStyle = {
            position: "relative",
            zIndex: 1,
          };
          let inputToken;
          if (["letter", "space", "number"].includes(token.type)) {
            inputToken = (
              <span
                onClick={handleClick}
                style={{
                  ...defaultTokenStyle,
                  padding: token.type === "space" ? "0 .2rem" : "",
                }}
              >
                {token.value}
              </span>
            );
          } else {
            inputToken = renderOptionToken ? (
              <div style={defaultTokenStyle} onClick={handleClick}>
                {renderOptionToken(token)}
              </div>
            ) : (
              <Chip
                style={defaultTokenStyle}
                size="small"
                onClick={handleClick}
                label={token.value}
              />
            );
          }
          return (
            <React.Fragment key={i}>
              {cursorIndex === i && isFocused && <Cursor />}
              {inputToken}
            </React.Fragment>
          );
        })}

        {cursorIndex === value.length && isFocused && <Cursor />}

        <HiddenInput
          id="hidden-input"
          value=""
          ref={inputRef}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          spellCheck={false}
        />
      </InputContainer>

      {value.length > 0 && (
        <IconButton size="small" onClick={onClickClear}>
          <ClearRounded fontSize="small" />
        </IconButton>
      )}
    </Container>
  );
}
