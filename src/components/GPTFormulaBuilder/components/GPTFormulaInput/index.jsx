import React, { useRef, useState } from "react";
import { Chip, IconButton } from "@mui/material";
import { ClearRounded } from "@mui/icons-material";
import {
  Container,
  InputContainer,
  Cursor,
  HiddenInput,
  PlaceholderText,
} from "./styles";

// ================= COMPONENT =================

export default function FormulaInput({
  value,
  cursorIndex,
  setCursorIndex,
  onClick,
  handleKeyDown,
  onClickClear,
  renderValue,
  fullWidth,
  size,
  disabled,
  placeholder,
  allowedTokenKeys,
}) {
  const inputRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  //mejor obtener el onfocus y onblur como props
  // ========== HELPERS ==========

  const focusInput = () => {
    inputRef.current && inputRef.current.focus();
  };

  return (
    <Container $fullWidth={fullWidth} $size={size} $disabled={disabled}>
      <InputContainer
        onClick={(e) => {
          focusInput();
          if (onClick) {
            onClick(e);
          }
        }}
      >
        {value.length === 0 && <PlaceholderText>{placeholder}</PlaceholderText>}

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

          const allowedToken = allowedTokenKeys.find(
            (allowedTokenKey) => allowedTokenKey.type === token.type,
          ) || { keepAsText: false };

          const isKeepingAsText =
            !renderValue ||
            allowedToken.keepAsText ||
            ["letter", "space", "number"].includes(token.type);

          inputToken = isKeepingAsText ? (
            <span
              onClick={handleClick}
              style={{
                ...defaultTokenStyle,
                padding: token.type === "space" ? "0 .2rem" : "",
              }}
            >
              {token.value}
            </span>
          ) : (
            <div style={defaultTokenStyle} onClick={handleClick}>
              {renderValue(token)}
            </div>
          );

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
          onChange={(e) => (e.target.value = "")}
          ref={inputRef}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          spellCheck={false}
          autoComplete="off"
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
