import { ExpandableSearch } from "@carbon/react";
import { useEffect } from "react";

import { setSearchExploreApi } from "~/@/api-docs/models/explore-api.model";

import ApiBreadcrumb from "../api-breadcrumb/api-breadcrumb.view";
import { HeaderContainer, HeaderTitleBar, TitleWrapper } from "./right-section.header.style";

export default function RightSectonHeader({ title, description, showSearch = false }: { readonly title: string; readonly description: string; readonly showSearch?: boolean; }) {

  useEffect(() => {
    setSearchExploreApi('')
  }, [])

  return <HeaderContainer>
    <ApiBreadcrumb />
    <HeaderTitleBar>
      <TitleWrapper>
        <h2>{title}</h2>
        <p>{description}</p>
      </TitleWrapper>
      {showSearch && (
        <ExpandableSearch size="lg"
          labelText="Search"
          closeButtonLabelText="Clear search input"
          id="search-expandable-1"
          onChange={(event) => setSearchExploreApi(event.target.value)}
          onClear={() => setSearchExploreApi('')}
        />
      )}

    </HeaderTitleBar>
  </HeaderContainer>
}