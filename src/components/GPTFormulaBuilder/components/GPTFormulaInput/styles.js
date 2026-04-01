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
`;

export const InputContainer = styled.div`
  display: flex;
  flex: 1;
  flex-wrap: wrap;
  align-items: center;
  padding: 8px;
  cursor: text;
  min-height: 40px;
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
