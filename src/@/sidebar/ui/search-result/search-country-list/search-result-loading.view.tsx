import { LoadingText } from "~/@/common/style/styled-component-style";
import { ChevronDownIcon, LeftItem, RightItem, SearchItem, SearchTopHead } from "../styles/search-result-style";

export default function SearchResultLoading({ count = 20 }: { count?: number; }) {
  return <>
    <SearchTopHead>
      <LoadingText width='80%' />
    </SearchTopHead>
    {Array(count).fill(0).map((_, index) => (
      <SearchItem key={index} $border>
        <LeftItem style={{ width: '40%' }}>
          <LoadingText width="100%" $marginEnd='0' />
        </LeftItem>
        <RightItem style={{ width: '30%' }}>
          <LoadingText $marginEnd='0' />
          <ChevronDownIcon />
        </RightItem>
      </SearchItem>
    ))}
  </>
}