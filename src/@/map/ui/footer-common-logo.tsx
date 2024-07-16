
import styled from 'styled-components';
import Itu from '../../../assets/images/itu-logo-footer.svg';
import Unicef from '../../../assets/images/unicef-logo-map-footer.svg';

const currentYear = new Date().getFullYear();

const FooterContent = styled.div`
  display: flex;
  align-items: center;
`

const FooterCommonLogo = () => {
  return (
    <FooterContent>
      <p>
        © {currentYear}{"  "}
        <a href="https://www.unicef.org/innovation/giga" className="giga-logo" target="_blank" rel="noreferrer">
          Giga
        </a>
      </p>
      <a style={{ marginTop: "0.1rem" }} href="https://www.unicef.org/" target="_blank" rel="noreferrer">
        <Unicef />
      </a>
      <a href="https://www.itu.int/en/Pages/default.aspx" target="_blank" rel="noreferrer">
        <Itu />
      </a>
    </FooterContent>
  )
}

export default FooterCommonLogo