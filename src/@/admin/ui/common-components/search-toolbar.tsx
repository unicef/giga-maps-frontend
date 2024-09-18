import { Form, IconButton, TableToolbarSearch } from "@carbon/react";
import { useState } from "react";
import { styled } from "styled-components";
import { Search } from '@carbon/icons-react';
import { TableToolbarSearchProps } from "@carbon/react/lib/components/DataTable/TableToolbarSearch";

const SearchCustom = styled(TableToolbarSearch)`
  .cds--search-magnifier-icon {
    fill: #222;
  }
`;

const FormWrapper = styled(Form)`
  display: flex;
  width: 100%;
`

type SearchToolbarType = { onSearchChange: (value: string) => void } & Partial<TableToolbarSearchProps>;
export default function SearchToolbar({ onSearchChange, ...otherProps }: SearchToolbarType) {
  const [searchValue, setSearchValue] = useState('');

  const onSubmit = (e: any) => {
    e.preventDefault();
    console.log(searchValue, 'searchvalue');
    onSearchChange?.(searchValue);
  }

  return <FormWrapper onSubmit={onSubmit}>
    <SearchCustom
      expanded={true}
      placeholder=""
      defaultValue={searchValue}
      onClear={() => {
        setSearchValue('');
        onSearchChange?.('');
      }}
      onChange={(e) => {
        setSearchValue(e?.target?.value ?? '');
      }}
      {...otherProps}
    />
    <IconButton
      kind="secondary"
      type="submit"
      renderIcon={Search}
      tooltipAlignment="center"
      tooltipPosition="bottom"
      tooltipText="Search"
      iconDescription="Search"
      label="Search"
    />
  </FormWrapper>;
}