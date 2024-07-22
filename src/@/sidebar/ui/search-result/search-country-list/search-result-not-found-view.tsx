import { NotFoundContainer, NotFoundIcon } from '../styles/search-result-style';

const SearchResultNotFoundView = () => {
  return (
    <NotFoundContainer>
      <NotFoundIcon />
      <h3>
        We couldn’t find what you’re looking for
      </h3>
      <p>
        Try again with a different term
      </p>
      {/* <Button kind="secondary" renderIcon={Flash}>
        Show me any school
      </Button> */}
    </NotFoundContainer>
  )
}

export default SearchResultNotFoundView