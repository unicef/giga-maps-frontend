import styled from "styled-components";

export const WeekSliderWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  .week_control_style {
  display: flex;
  flex-flow: row nowrap;
  height: 2rem;
  align-items: center;
  column-gap: 0.5rem;
}

.previous_week_button {
  transition: all 0.3s ease-in-out;
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: black;
  font-size: 2rem;
  border: none;
  outline: none;
  cursor: pointer;
  background-color: transparent;
  padding: 0 !important;

  >svg {
    height: 1rem;
    width: 1rem;
    color: #474747;
    flex-shrink: 0;
    color:${props => props.theme.text};
  }
  
  }
  .skip-to-end{
    display:flex;
    align-items:center;
    margin-left:0.7rem;
    >svg {
      height: 1rem;
      width: 1rem;
      color:${props => props.theme.text};
      margin-left: -0.5rem;
    }
}

.next_week_button:not(:disabled) {
  transition: all 0.3s ease-in-out;
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: black;
  font-size: 2rem;
  border: none;
  outline: none;
  cursor: pointer;
  background-color: transparent;
  padding: 0 !important;

  >svg {
    height: 1rem;
    width: 1rem;
    color:${props => props.theme.text};
  }
}

.next_week_button:disabled {
  transition: all 0.3s ease-in-out;
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
 
  height: 100%;
  font-size: 2rem;
  border: none;
  outline: none;
  cursor: default;
  background-color: transparent;
  padding: 0 !important;

  svg {
    height: 1rem;
    width: 1rem;
    color: #474747;
  }
}

.week_control_text {
  display: inline-flex;
  flex: 0 1 100%;
  align-items: center;
  justify-content: center;
  font-weight: 400;
  font-size: 0.75rem;
  font-style: normal;
  font-family: "Open Sans";
  line-height: 1rem;
  letter-spacing: 0.1rem;
  text-transform: uppercase;
  color: ${props => props.theme.text};
}

.week-control-calendar {
  height: 0.875rem;
  width: 0.875rem;
  padding: 0;
  color: #474747;
  flex-shrink: 0;
  color: ${props => props.theme.text};
}

.previous_week_button:first-child {
  border-top-left-radius: 0.5rem;
  border-bottom-left-radius: 0.5rem;
}
`