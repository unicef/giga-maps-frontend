import { useTranslation } from 'react-i18next';

import { docsExporeApi } from '~/core/routes';
import { Link } from '~/lib/router';

import { $dataSourceModalFooterText } from './data-sources.styles';
import styled from 'styled-components';

const FooterText = styled.p`
  ${$dataSourceModalFooterText}
`;

const DataSourcesModalFooter = () => {
  const { t } = useTranslation();

  return (
    <FooterText>
      {t('data-sources-explore-prefix')}{' '}
      <Link to={docsExporeApi} target="_blank">
        {t('data-sources-explore-api-link')}
      </Link>{' '}
      {t('data-sources-explore-middle')}{' '}
      <a href="https://giga.global/" target="_blank" rel="noopener noreferrer">
        {t('data-sources-explore-team-link')}
      </a>{' '}
      {t('data-sources-explore-suffix')}
    </FooterText>
  );
};

export default DataSourcesModalFooter;
