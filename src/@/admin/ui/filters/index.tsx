import { addAdminFilter, editAdminFilter } from "~/core/routes";
import AddFilterList from "./add-filter.view";
import EditFilterList from "./edit-filter.view";
import { useRoute } from "~/lib/router";
import ListFilterView from "./filter-list.view";

export default function AdminFilters() {

  return <>
    <ListFilterView />
    {useRoute(addAdminFilter) && <AddFilterList />}
    {useRoute(editAdminFilter) && <EditFilterList />}
  </>
}