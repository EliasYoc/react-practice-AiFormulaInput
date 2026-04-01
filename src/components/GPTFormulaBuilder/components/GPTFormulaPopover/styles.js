import styled from "styled-components";

export const Container = styled.div`
  max-height: 480px;
  overflow-y: auto;
  position: relative;
`;

export const List = styled.ul`
  display: flex;
  flex-wrap: wrap;
  list-style: none;
  padding: 0;
  margin: 0;
  gap: 0.3rem;
`;

export const Header = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.2rem;
  position: sticky;
  top: 0;
  z-index: 1;
`;
