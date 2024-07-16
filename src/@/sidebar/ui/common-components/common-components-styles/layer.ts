import styled from "styled-components";

export const LayerWrapper = styled.div`

.sidebar-worldview-layer-connectivityIndicator-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 1rem;
  width: 91%;
  margin-left: 1rem;
  margin-top: 1.5rem;
  margin-right: 1rem;
  margin-bottom: 0.5rem;

  >.sidebar-worldview-filterIcon-container {
    justify-content: flex-end;
    display: flex;

    .cds--modal.is-visible {
      .cds--modal-container {
        .cds--modal-content {
          margin-bottom: 0;

        }
      }
    }

    .filter-popover-trigger {
      height: 2rem;

      margin-right: 1.7rem;
    }
  }
}

.sidebar-worldview-shareIcon.cds--btn.cds--btn--sm.cds--btn--ghost {
  display: flex;
  align-items: center;
  margin: 0;
  padding: 0;
  height: 2rem;
  width: 2rem;
  color: #fff;
}

.sidebar-worldview-shareIcon.cds--btn.cds--btn--sm.cds--btn--ghost:disabled>svg {
  height: 1rem;
  width: 1rem;
  color: #C6C6C6;
}

.sidebar-worldview-shareIcon.cds--btn.cds--btn--sm.cds--btn--ghost>svg {
  height: 1rem;
  width: 1rem;
  color: #fff;
  fill: #fff;
  // margin-right: 0.5rem;
}

.cds--popover-container.cds--popover--caret.cds--popover--drop-shadow.cds--popover--open.cds--popover--bottom>.cds--popover>.cds--popover-content {
  left: -270%;
  padding: 1rem;
  min-width: 22rem;
}

@media (max-width: 520px) {
  .cds--popover-container.cds--popover--caret.cds--popover--drop-shadow.cds--popover--open.cds--popover--bottom>.cds--popover>.cds--popover-content {
    height: 20rem;
    overflow-y: auto;
  }
}

// .filter-popover-title {
//   color: var(--text-text-inverse, #FFF);
//   font-family: "Open Sans";
//   font-size: 0.75rem;
//   font-style: normal;
//   font-weight: 400;
//   line-height: 1.125rem;
//   margin-bottom: 0.25rem;
// }

// .filter-popover-explanation {
//   margin-bottom: 0.75rem;
//   color: var(--primary-black-60, #7E7E7E);
//   font-size: 0.75rem;
//   font-weight: 400;
//   line-height: 1rem;
// }

// .filter-popover-title-explanation {
//   color: var(--text-text-placeholder, #9E9E9E);
//   font-size: 0.75rem;
//   font-weight: 400;
//   line-height: 1.125rem;
// }

.popover-filter-content-benchmark>.cds--form-item {
  margin-top: 0.5rem;
}

.popover-filter-content-benchmark>.cds--form-item>.cds--radio-button-group.cds--radio-button-group--label-right {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.popover-filter-content-benchmark>.cds--form-item>.cds--radio-button-group.cds--radio-button-group--label-right>.cds--radio-button-wrapper {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  // margin-left: 0.5rem;
  margin-bottom: 0.3125rem;
}

.popover-filter-content-benchmark>.cds--form-item>.cds--radio-button-group.cds--radio-button-group--label-right>.cds--radio-button-wrapper>.cds--radio-button__label {
  font-size: 0.75rem;
  display: flex;
  align-items: center;

  >.cds--radio-button__appearance {
    width: 1.25rem;
    height: 1.25rem;
    border-color: #fff;
  }

  .cds--radio-button__appearance::before {
    background-color: var(--cds-icon-primary, #fff);
  }

  >span:last-child {
    color: #fff;
    font-family: "Open Sans";
    font-size: 0.75rem;
    font-style: normal;
    font-weight: 400;
    line-height: 1rem;
  }
}

// .popover-filter-content-speed {
//   margin-top: 1.5rem;

//   >.cds--fieldset {
//     padding: 0 0 0.625em 0;
//     display: flex;
//     flex-direction: column;
//     align-items: flex-start;
//     gap: 0.5rem;
//     margin-top: 0.5rem;

//     >.cds--form-item.cds--checkbox-wrapper {
//       margin-bottom: 0;

//       >.cds--checkbox-label {
//         font-size: 0.6rem;
//         align-items: center;

//         >.cds--checkbox-label-text {
//           margin-left: 0.5rem;
//         }
//       }

//       >.cds--checkbox-label::before {
//         height: 1.25rem;
//         width: 1.25rem;
//       }

//       >.cds--checkbox-label::after {
//         top: 0.5rem;
//         left: 0.5rem;
//       }

//     }
//   }
// }

// .popover-filter-content-coverage-connectivityStatus {
//   margin-top: 0rem;

//   >.cds--fieldset {
//     padding: 0 0 0.625em 0;
//     display: flex;
//     flex-direction: column;
//     align-items: flex-start;
//     gap: 0.5rem;
//     margin-top: 0.5rem;

//     >.cds--form-item.cds--checkbox-wrapper {
//       margin-bottom: 0;

//       >.cds--checkbox-label {
//         font-size: 0.6rem;
//         align-items: center;

//         >.cds--checkbox-label-text {
//           margin-left: 0.5rem;
//         }
//       }

//       >.cds--checkbox-label::before {
//         height: 1.25rem;
//         width: 1.25rem;
//       }

//       >.cds--checkbox-label::after {
//         top: 0.5rem;
//         left: 0.5rem;
//       }

//     }
//   }
// }

// .cds--checkbox-label-text {
//   padding-left: 0px;
//   color: #222;

//   /* Utility styles/Label 01 */
//   font-family: "Open Sans";
//   font-size: 0.75rem;
//   font-style: normal;
//   font-weight: 400;
//   line-height: 1rem;
// }

.popover-filter-content-benchmark {
  margin-top: 1.5rem;
}

.filter-popover-bottom-buttons-container {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin: 1.5rem 0rem 0.5rem 0rem;
}

.filter-popover-bottom-buttons {
  justify-content: center;
  width: 50%;
  align-items: center;
  padding: 0px;
}

.sidebar-worldview-selectedLayer {
  color: var(--primary-black-100-giga-black, #222);
  font-size: 1rem;
  font-style: normal;
  font-weight: 500;
  line-height: 1.5rem;
  font-family: 'Open Sans';
}
.cds--radio-button-wrapper:not(:last-of-type) {
  margin-right: 0
}

.sidebar-worldview-layer-connectivityIndicator-dropdownContainer {
  height: 2rem;
  display: flex;
  align-items: center;
  min-width: 93%;

}


.sidebar-connectivity-status-container {
  display: flex;
  width: 100%;
  // margin-top: 0.7rem;

  .sidebar-connectivity-status-heading-text {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 1rem;
    min-width: 84%;
    margin-left: 1rem;
    margin-top: 1.5rem;
    margin-bottom: 0.5rem;

  }

  .sidebar-worldview-shareIcon.cds--btn.cds--btn--sm.cds--btn--ghost {
    margin-top: 0.5rem;
  }
}

.layer-selection-filter-header.cds--modal-header {
  padding-top: 1rem;
  padding-right: 3rem;
  padding-left: 1rem;
  margin-bottom: 0.25rem;
  grid-column: 1/-1;
  grid-row: 1/1;
}

.layer-selection-filter-body {
  margin-bottom: 0;
  overflow-y: unset;
}

.layer-selection-filter-body-scroll {
  height: auto;
  padding-bottom: 1rem;
}

@media (max-width:768px) {

  .layer-selection-filter-body-scroll {
    height: 100%;
    width: 100%;
  }

}
`   
