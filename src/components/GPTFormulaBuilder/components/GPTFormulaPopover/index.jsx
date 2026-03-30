import React, { useState, useMemo, useEffect } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Button,
  Typography,
  Popper,
  ClickAwayListener,
  Paper,
  Box,
  TextField,
} from "@mui/material";
import styled from "styled-components";
import ExpandMoreRounded from "@mui/icons-material/ExpandMoreRounded";
import { debounce } from "lodash";

const Container = styled.div``;

const Header = styled.div`
  display: flex;
  flex-direction: column;
`;

export default function FormulaPopover({
  anchorEl,
  open,
  onClose,
  sections = [],
  onSelect,
}) {
  const allSectionIds = useMemo(() => sections.map((s) => s.id), [sections]);

  const [expandedSectionIds, setExpandedSectionsIds] = useState(allSectionIds);
  const [search, setSearch] = useState("");
  const [filteredSections, setFilteredSections] = useState([]);

  const isAllExpanded = expandedSectionIds.length === sections.length;

  useEffect(() => {
    const filterSectionsDebounced = debounce(() => {
      const normalizedSearch = search.trim().toLowerCase();

      if (!normalizedSearch) {
        setFilteredSections(sections);
      } else {
        const filtered = sections
          .map((section) => {
            const filteredItems = section.items.filter((item) =>
              item.toLowerCase().includes(normalizedSearch),
            );

            return {
              ...section,
              items: filteredItems,
            };
          })
          .filter((section) => section.items.length > 0);
        setFilteredSections(filtered);
      }
    }, 450);

    filterSectionsDebounced();
    return () => {
      filterSectionsDebounced.cancel();
    };
  }, [sections, search]);

  const handleToggleAll = () => {
    setExpandedSectionsIds(isAllExpanded ? [] : allSectionIds);
  };

  const handleChange = (panelId) => (event, isExpanded) => {
    setExpandedSectionsIds((prev) =>
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
            onClick={() => {
              document.getElementById("hidden-input").focus();
            }}
          >
            <Header>
              <TextField
                size="small"
                placeholder="Buscar variable, función o operador..."
                onClick={(e) => e.stopPropagation()}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              <Button onClick={handleToggleAll}>
                {isAllExpanded ? "Colapsar todo" : "Expandir todo"}
              </Button>
            </Header>

            {filteredSections.map((section) => (
              <Accordion
                key={section.id}
                expanded={expandedSectionIds.includes(section.id)}
                onChange={handleChange(section.id)}
              >
                <AccordionSummary expandIcon={<ExpandMoreRounded />}>
                  <Typography>{section.title}</Typography>
                </AccordionSummary>

                <AccordionDetails>
                  <Box display="flex" flexWrap="wrap" gap={1}>
                    {section.items.map((item, index) => (
                      <Chip
                        key={`${section.id}-${index}`}
                        label={item}
                        onClick={() => handleChipClick(item, section)}
                      />
                    ))}
                  </Box>
                </AccordionDetails>
              </Accordion>
            ))}
          </Container>
        </ClickAwayListener>
      </Paper>
    </Popper>
  );
}
