import React, { useState, useMemo } from "react";
import {
  Popover,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Button,
  Typography,
  Stack,
  Popper,
  ClickAwayListener,
  Paper,
} from "@mui/material";
import styled from "styled-components";
import ExpandMoreRounded from "@mui/icons-material/ExpandMoreRounded";

const Container = styled.div``;

const Header = styled.div``;

const ChipsContainer = styled.div``;

export default function FormulaPopover({
  anchorEl,
  open,
  onClose,
  sections = [],
  onSelect,
}) {
  const [expanded, setExpanded] = useState([]);

  const allIds = useMemo(() => sections.map((s) => s.id), [sections]);

  const isAllExpanded = expanded.length === sections.length;

  const handleToggleAll = () => {
    setExpanded(isAllExpanded ? [] : allIds);
  };

  const handleChange = (panelId) => (event, isExpanded) => {
    setExpanded((prev) =>
      isExpanded ? [...prev, panelId] : prev.filter((id) => id !== panelId),
    );
  };

  const handleChipClick = (item, section) => {
    if (onSelect) {
      onSelect({ value: item, section });
    }
  };

  return (
    <Popper open={open} anchorEl={anchorEl}>
      <Paper>
        <ClickAwayListener onClickAway={onClose}>
          <Container
            onClick={(e) => {
              document.getElementById("hidden-input").focus();
            }}
          >
            <Header>
              <Button onClick={handleToggleAll}>
                {isAllExpanded ? "Colapsar todo" : "Expandir todo"}
              </Button>
            </Header>

            {sections.map((section) => (
              <Accordion
                key={section.id}
                expanded={expanded.includes(section.id)}
                onChange={handleChange(section.id)}
              >
                <AccordionSummary expandIcon={<ExpandMoreRounded />}>
                  <Typography>{section.title}</Typography>
                </AccordionSummary>

                <AccordionDetails>
                  <ChipsContainer>
                    <Stack direction="row" flexWrap="wrap" gap={1}>
                      {section.items.map((item, index) => (
                        <Chip
                          key={`${section.id}-${index}`}
                          label={item}
                          onClick={() => handleChipClick(item, section)}
                        />
                      ))}
                    </Stack>
                  </ChipsContainer>
                </AccordionDetails>
              </Accordion>
            ))}
          </Container>
        </ClickAwayListener>
      </Paper>
    </Popper>
  );
}
