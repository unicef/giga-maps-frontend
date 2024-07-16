import PageTitleComponent from "../common-components/page-title-component"
import AlertRow from "./alert-row"

const ListAlertView = () => {
  return (
    <>
      <PageTitleComponent
        title={"Alerts"}
        subTitle={"Notification about changes and updates"}
        recentlyView={false} />
      <>
        <AlertRow />
      </>
    </>

  )
}

export default ListAlertView