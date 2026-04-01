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
import ExpandMoreRounded from "@mui/icons-material/ExpandMoreRounded";
import { debounce } from "lodash";
import { Container, List, Header } from "./styles";

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
            const filteredLabels = section.labels.filter((item) =>
              item.toLowerCase().includes(normalizedSearch),
            );

            return {
              ...section,
              labels: filteredLabels,
            };
          })
          .filter((section) => section.labels.length > 0);
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
      style={{ width: "100%" }}
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
                    variant="outlined"
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
