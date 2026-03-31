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
  Fade,
  Grow,
} from "@mui/material";
import styled from "styled-components";
import ExpandMoreRounded from "@mui/icons-material/ExpandMoreRounded";
import { debounce } from "lodash";

const Container = styled.div`
  max-height: 480px;
  overflow-y: auto;
  position: relative;
`;

const List = styled.ul`
  display: flex;
  flex-wrap: wrap;
  list-style: none;
  padding: 0;
  margin: 0;
  gap: 0.3rem;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.2rem;
  position: sticky;
  top: 0;
  z-index: 1;
`;

export default function FormulaPopover({
  anchorEl,
  open,
  onClose,
  sections = [],
  onSelect,
  renderOption,
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
    <Popper
      open={open}
      anchorEl={anchorEl}
      transition
      style={{ maxWidth: "600px" }}
    >
      {({ TransitionProps }) => (
        <Grow
          {...TransitionProps}
          timeout={250}
          style={{ transformOrigin: "0 0 0" }}
        >
          <Paper>
            <ClickAwayListener onClickAway={onClose}>
              <Container
                onClick={() => {
                  document.getElementById("hidden-input").focus();
                }}
              >
                <Header>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Buscar variable, función o operador..."
                    onClick={(e) => e.stopPropagation()}
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                  />
                </Header>
                <Button fullWidth onClick={handleToggleAll}>
                  {isAllExpanded ? "Colapsar todo" : "Expandir todo"}
                </Button>

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
                      <List>
                        {section.labels.map((label, sectionIndex) => (
                          <li
                            key={`${section.id}-${sectionIndex}`}
                            onClick={() => handleChipClick(label, section)}
                          >
                            {renderOption ? (
                              renderOption({ label, section })
                            ) : (
                              <Chip label={label} />
                            )}
                          </li>
                        ))}
                      </List>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Container>
            </ClickAwayListener>
          </Paper>
        </Grow>
      )}
    </Popper>
  );
}
