import { useTranslation } from 'react-i18next';
import { NotFoundContainer, NotFoundIcon } from '../styles/search-result-style';

const SearchResultNotFoundView = () => {
  const { t } = useTranslation();
  return (
    <NotFoundContainer>
      <NotFoundIcon />
      <h3>
        {t('we-couldn-t-find-what-you-re-looking-for')}
      </h3>
      <p>
        {t('try-again-with-a-different-term')}
      </p>
      {/* <Button kind="secondary" renderIcon={Flash}>
        Show me any school
      </Button> */}
    </NotFoundContainer>
  )
}

export default SearchResultNotFoundView