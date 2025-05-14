import React, { useEffect, useRef, useState } from "react";
import { Button } from "@carbon/react";
import { FilterableMultiSelect } from "@carbon/react";
import styled, { css } from "styled-components";
import { selectAll } from "@testing-library/user-event/dist/types/event";

// Types
export interface MultiSelectItem {
  // id: string | number;
  // name: string;
  [key: string]: any; // Allow for additional properties
}

export interface MultiSelectDropdownAdvProps {
  items: MultiSelectItem[];
  onSelectItems: (selectedItems: any[]) => void;
  initialSelectedItems?: any[];
  titleText?: string;
  placeholder?: string;
  id?: string;
  name?: string;
  height?: string;
  showSelectAllButton?: boolean;
  selectAllButtonPosition?: "top-right" | "bottom-right" | "bottom-left" | "top-left";
  disabled?: boolean;
  theme?: "light" | "dark";
  customStyles?: React.CSSProperties;
  itemToElement?: (item: MultiSelectItem) => React.ReactNode;
  [key: string]: any; // Allow for additional props to be passed
}

// Styled components with theme support
interface StyledMultiSelectProps {
  height?: string;
  theme?: "light" | "dark";
}


const darkTheme = css`
    .cds--multi-select {
   
    background-color: #333333;
    } 
    .cds--text-input {
      color: #c0c0c0;
    }
    .cds--text-input::placeholder {
        color: #c0c0c0;
        opacity: 0.8;
    }
    // .cds--list-box__label {
    //     color: #c0c0c0;
    // }
        .cds--list-box__menu-icon svg {
        fill: #c0c0c0;
        }
 .cds--label {
    color: #c0c0c0;
 }
  
`;

const StyledMultiSelect = styled(FilterableMultiSelect) <StyledMultiSelectProps>`
  margin-top: 1.5rem;
  
  .cds--list-box__menu {
    height: ${(props) => props.height || "8rem"} !important;
    max-height: 10rem !important;
    overflow-y: auto;
  }
  
  ${(props) => (props.theme === "dark" ? darkTheme : undefined)}
`;

const MultiSelectContainer = styled.div<{ selectAllButtonPosition?: string }>`
  width: 100%;
  position: relative;
  
  .select-all-button {
    position: absolute;
    ${(props) => {
    switch (props.selectAllButtonPosition) {
      case "bottom-right":
        return `
            bottom: -2.5rem;
            right: 0;
          `;
      case "bottom-left":
        return `
            bottom: -2.5rem;
            left: 0;
          `;
      case "top-left":
        return `
            top: -0.5rem;
            left: 0;
          `;
      case "top-right":
      default:
        return `
            top: -0.5rem;
            right: 0;
          `;
    }
  }}
  }
`;

/**
 * Advanced Multi-Select Dropdown component
 * 
 */
export const MultiSelectDropdownAdv: React.FC<MultiSelectDropdownAdvProps> = ({
  items,
  onSelectItems,
  selectedItems,
  initialSelectedItems = [],
  titleText = "Select Items",
  placeholder = "Select Items",
  id = "multi-select-dropdown",
  name = "multiSelectDropdown",
  height = "8rem",
  showSelectAllButton = true,
  selectAllButtonPosition = "top-right",
  disabled = false,
  theme = "light",
  customStyles = {},
  itemToString,
  itemToElement,
  ...others
}) => {
  const isSelectedAll = selectedItems.length === items.length;
  // Handle select/clear all functionality
  const handleSelectAllToggle = () => {
    if (isSelectedAll) {
      onSelectItems([]);
    } else {
      onSelectItems([...items]);
    }
  };

  // Default item renderer if none provided
  const defaultItemToElement = (item: MultiSelectItem) => (
    <span>{item?.name}</span>
  );

  return (
    <MultiSelectContainer
      selectAllButtonPosition={selectAllButtonPosition}
      style={customStyles}
    >
      <StyledMultiSelect
        key={`multi-select-${isSelectedAll}`}
        height={height}
        id={id}
        name={name}
        titleText={titleText}
        placeholder={placeholder}
        items={items}
        itemToString={itemToString}
        initialSelectedItems={initialSelectedItems}
        selectedItems={selectedItems}
        itemToElement={itemToElement || defaultItemToElement}
        onChange={({ selectedItems }: { selectedItems: MultiSelectItem[] }) => {
          onSelectItems(selectedItems);
        }}
        disabled={disabled}
        theme={theme}
        {...others}
      />

      {showSelectAllButton && (
        <Button
          className="select-all-button"
          kind="ghost"
          size="sm"
          onClick={handleSelectAllToggle}
          disabled={disabled}
        >
          {isSelectedAll ? 'Clear all' : 'Select all'}
        </Button>
      )}
    </MultiSelectContainer>
  );
};

export default MultiSelectDropdownAdv;