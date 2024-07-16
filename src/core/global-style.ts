import { createGlobalStyle, css } from 'styled-components';
import { normalize } from 'styled-normalize';

const globalStyle = css`
  ${normalize};
  :root {
    --primary-blue: #277AFF;
    --cds-button-primary: #277AFF;
    --cds-link-primary: #277AFF;
    --cds-link-secondary: #393939;
    --cds-button-secondary: #393939;
    --cds-layer-accent: #F2F2F2;
    --primary-black-80-giga-dark-grey: #474747;
    --text-color-primary: #222222;
    /* --text-text-primary: #161616; */
    /* --text-text-secondary: #fff; */
    /* --cds-text-primary: #fff; */
    --cds-icon-secondary: #fff;
    /* --cds-text-secondary: #fff; */
    --text-text-tertiary: #6F6F6F;

    // mains color
    --main-color-red: #ED1C24;
    --main-color-green: #00A651;
    --main-color-orange: #FAA61A;
    --main-color-grey: #A7A9AC;
  }
  html {
    /* Reset box sizing to border-box */
    box-sizing: border-box;
    font-size: 100%;
    height: 100%;
    width: 100%;
}

body {
  font-family: "Open Sans";
  height: 100%;
  margin: 0;
  overflow-x: hidden;
}

#root{
  display: flex;
  height: 100%;
  width: 100%;
}
a{
  text-decoration:none;
}

@keyframes pulse {
	0% {
		transform: scale(0.85);
	}

	70% {
		transform: scale(1.2);
	}

	100% {
		transform: scale(0.85);
	}
}

 @keyframes glowly {
   from {
     transform: scale(0.5) translate(-50%, -50%);
     opacity: 1;
   }

   to {
     transform: scale(1.2) translate(-50%, -50%);
     opacity: 0.4;
  }
}

  /* Make it easier to change the box-sizing later */
  *,
  *::before,
  *::after {
    box-sizing: inherit;
  }

  /* Inherit link color */
  a {
    color: inherit;
    text-decoration: none;
  }

  /* Remove the gap between the grid and the content in mobile */
  @media (max-width: 768px) {
   .row {
      display: flex;
      flex-direction: column;
    }
  }
  /* Remove the gap between the grid and the content in mobile */
  @media (max-width: 768px) {
   .row {
      display: flex;
      flex-direction: column;
    }
  }
  /* Remove the gap between the grid and the content in mobile */
  @media (max-width: 768px) {
   .row {
      display: flex;
      flex-direction: column;
    }
  }
  /* Remove the gap between the grid and the content in mobile */
  @media (max-width: 768px) {
   .row {
      display: flex;
      flex-direction: column;
    }
  }
  /* Remove the gap between the grid and the content in mobile */
  @media (max-width: 768px) {
   .row {
      display: flex;
      flex-direction: column;
    }
  }
  body {
    font-family: "Open Sans";
    height: 100%;
    margin: 0;
  }
  .preview-data-popup {
    .mapboxgl-popup-content {
      background: #222;
    }
    .mapboxgl-popup-close-button {
      font-size: 1.6rem;
      top: 0.5rem;
      right: 0.5rem;
    }
    .map-content-popup {
      /* max-width: 300px; */
      font-size: 1rem;
      color: white;
      padding: 1rem;
      padding-right: 1.2rem;
      p {
        font-size: 0.8rem;
      }
    }
  }
  .sb-tooltip-trigger {
    border: none;
    background: none;
  }
`;

export const GlobalStyle = createGlobalStyle`${globalStyle}`;
