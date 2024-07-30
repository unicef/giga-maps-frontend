import { addAdminFilter, editAdminFilter } from "~/core/routes";
import AddFilterList from "./add.view";
import EditFilterList from "./edit.view";
import { useRoute } from "~/lib/router";
import ListFilterView from "./list-filter.view";

export default function AdminFilters() {

  return <>
    <ListFilterView />
    {useRoute(addAdminFilter) && <AddFilterList />}
    {useRoute(editAdminFilter) && <EditFilterList />}
  </>
}