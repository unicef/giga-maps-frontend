import styled, { css, createGlobalStyle } from 'styled-components';

export const FooterContainer = styled.div`
  background: ${(props) => props.theme.main};
  @media (min-width: 768px) {
    position: sticky;
    bottom: 0;
  }
`;

export const DataSourceContainer = styled.div`
  padding: 0 1rem 1.25rem;
  color: ${(props) => props.theme.titleDesc};

  .data-source {
    font-size: 12px;
  }

  .data-sources-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 1rem;
    border-top: 1px solid ${(props) => props.theme.schoolListBack};

    p {
      margin: 0;
      color: ${(props) => props.theme.text};
      font-size: 0.85rem;
    }
  }
`;

export const BadgeGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

export const SectionLabel = styled.p`
  margin: 0.75rem 0 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1rem;
  color: ${(props) => props.theme.text};

  &:first-of-type {
    margin-top: 0.25rem;
  }
`;

export const DataSourceBadgeButton = styled.button<{ $clickable?: boolean }>`
  display: inline-flex;
  align-items: center;
  max-width: 100%;
  padding: 0.375rem 0.625rem;
  border: 1px solid ${(props) => props.theme.schoolListBack};
  border-radius: 4px;
  background: ${(props) => props.theme.graphWeekMonthBorder};
  color: ${(props) => props.theme.text};
  font-size: 0.75rem;
  line-height: 1rem;
  text-align: left;
  cursor: ${(props) => (props.$clickable ? 'pointer' : 'default')};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &:hover {
    border-color: ${(props) => (props.$clickable ? props.theme.titleBlue : props.theme.schoolListBack)};
  }
`;

export const MoreLinkButton = styled.button`
  border: none;
  background: transparent;
  color: #0f62fe;
  font-size: 0.75rem;
  line-height: 1rem;
  cursor: pointer;
  padding: 0;

  &:hover {
    text-decoration: underline;
  }
`;

export const InfoSectionRow = styled.div`
  display: flex;
  gap: 0.75rem;
  padding: 1rem 0 0;

  svg {
    flex-shrink: 0;
    fill: ${(props) => props.theme.text};
    margin-top: 0.125rem;
  }
`;

export const YearRow = styled.div`
  display: flex;
  gap: 0.75rem;
  padding-top: 1rem;

  svg {
    flex-shrink: 0;
    fill: ${(props) => props.theme.text};
    margin-top: 0.125rem;
  }
`;

export const YearValue = styled.p`
  margin: 0.25rem 0 0;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: ${(props) => props.theme.text};
`;

export const $dataSourceModalContainer = css`
  width: 600px;
  max-width: calc(100vw - 2rem);
  padding: 1.5rem 1.5rem 1.25rem;
  background: ${(props) => props.theme.main};

  .cds--modal-header {
    padding: 0;
    margin-bottom: 0;
  }

  .cds--modal-close {
    display: flex;
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 1.25rem;
  }
`;

export const $dataSourceModalHeader = css`
  color: ${(props) => props.theme.text};
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.375rem;
  padding-right: 2rem;
  word-break: break-word;
`;

export const $dataSourceModalBody = css`
  padding: 0;
  margin: 0;
  color: ${(props) => props.theme.text};
`;

export const $dataSourceModalSectionTitle = css`
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.25rem;
  margin: 1rem 0 0.5rem;
  color: ${(props) => props.theme.text};
`;

export const $dataSourceModalSectionText = css`
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.375rem;
  color: ${(props) => props.theme.titleDesc};
  display: -webkit-box;
  -webkit-line-clamp: 6;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const $dataSourceModalDivider = css`
  border: none;
  border-top: 1px solid ${(props) => props.theme.schoolListBack};
  margin: 1rem 0 0;
`;

export const $dataSourceModalFooterText = css`
  margin-top: 1.25rem;
  font-size: 0.75rem;
  line-height: 1.125rem;
  color: ${(props) => props.theme.titleDesc};

  a {
    color: #0f62fe;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }
`;

export const DataSourceModalOverlayStyle = createGlobalStyle`
  .data-source-detail-modal.cds--modal.is-visible .cds--layer-one {
    background-color: rgba(0, 0, 0, 0.5);
  }
`;
