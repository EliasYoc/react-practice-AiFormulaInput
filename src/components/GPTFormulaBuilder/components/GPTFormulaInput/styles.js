// ================= STYLES =================

import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  position: relative;
  border: 1px solid #ccc;
  border-radius: 6px;
  justify-content: space-between;
  align-items: center;
  &:focus-within {
    outline: 2px solid #000;
  }

  display: ${({ $fullWidth }) => ($fullWidth ? "flex" : "inline-flex")};
  width: ${({ $fullWidth }) => ($fullWidth ? "100%" : "auto")};
  min-width: ${({ $fullWidth }) => ($fullWidth ? "auto" : "210px")};
  min-height: ${({ $size }) =>
    $size === "small" ? "32px" : "40px"}; /* Ejemplo para padding compacto */
  background-color: ${({ $disabled }) => ($disabled ? "#f5f5f5" : "white")};
  pointer-events: ${({ $disabled }) => ($disabled ? "none" : "auto")};
  opacity: ${({ $disabled }) => ($disabled ? 0.6 : 1)};
`;

export const InputContainer = styled.div`
  display: flex;
  flex: 1;
  flex-wrap: wrap;
  align-items: center;
  padding: 8px;
  cursor: text;
  gap: 1px;
`;

export const Cursor = styled.span`
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

export const HiddenInput = styled.input`
  position: absolute;
  opacity: 0;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
`;

export const PlaceholderText = styled.span`
  color: #9e9e9e;
  position: absolute;
  pointer-events: none;
  left: 10px;
  user-select: none;
`;
