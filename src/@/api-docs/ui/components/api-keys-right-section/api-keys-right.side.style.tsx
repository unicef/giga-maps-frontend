import styled from "styled-components";


export const ApiKeysDataWrapper = styled.div`
margin-top: 0;
min-height:calc(100vh - 13.5rem);
  td {
    background: #FFFFFF
  }

.api-keys-data-table-over-flow-menu {
  .cds--popover {
    display: none;
  }

  .cds--popover-content.cds--tooltip-content {
    display: none;
  }
}

.cds--data-table thead {
        position: sticky;
        top: 0;
        z-index: 1;
    }
    .cds--data-table-content {
        overflow-x: initial;
    }

.api-keys-data-table-key-name {
  width: 15%;
  padding: 1.5rem 1rem;
}

.api-keys-data-table-key {
  width: 40%;
  padding: 1.5rem 1rem;
  background-color: #FFFFFF;
}

.api-keys-data-table-key-country {
  width: 15%;
  padding: 1.5rem 1rem;
  background-color: #FFFFFF;
}

.api-keys-data-table-validity {
  width: 15%;
  padding: 1.5rem 1rem;
  background-color: #FFFFFF;
  span{
    display: flex;
    width: 5rem;
  }
}

.api-keys-data-table-over-flow-menu {
  width: 5%;
  padding: 1.5rem 1rem;
  background-color: #FFFFFF;
}

.api-keys-data-table-row {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  background: #F6F6F6;
  width: 27rem;

  >p {
    font-size: 0.875rem;
    width: 23.5rem;
    overflow-wrap: break-word;
    height: 2.5rem;
    overflow: hidden;
    line-height: 1.25rem;
  }

  >.api-keys-replicate-icon {
    margin-left: 1rem;
    cursor: pointer;
  }
}
`

export const StatusWrapper = styled.div`
  color: #474747;
  font-family: Open Sans;
  font-style: normal;
  font-weight: 400;
  line-height: 1rem; 
  background: ${(props) => (props.color)};;
  border-radius: 62rem;
  width: max-content;
  height: 1.5rem;
  padding: 0.3rem 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  /* width:6rem; */
`

export const ActionButtonWrapper = styled.div`
  padding-bottom: 0.5rem;
  display:flex;
  button{
    width:50%;
  }
`
export const DateWrapper = styled.span`
  display:flex;
  width:5rem
`