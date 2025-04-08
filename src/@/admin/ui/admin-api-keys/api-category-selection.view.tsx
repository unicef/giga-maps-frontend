import { RadioButtonGroup, RadioButton, Select, SelectItem } from "@carbon/react"
import { ApiKeysAdminRequestType } from "../../types/api-request.type"
import { $gigaMeterApiCategories } from "../../models/api-request-model"
import { useStore } from "effector-react"
import { updateApiCategoryFx } from "../../effects/api-request-fx"



const ApiCategorySelection = ({ item, refresh, isExpired }: { item: ApiKeysAdminRequestType, refresh: () => void, isExpired: boolean }) => {
  const isDailyCheck = item.api.code === "DAILY_CHECK_APP"
  const gigaMeterApiCategories = useStore($gigaMeterApiCategories)

  if (!isDailyCheck) return null
  const selectedId = item.active_api_categories_list?.[0]?.id ?? gigaMeterApiCategories.find((category) => category.is_default)?.id
  const onChangeCategory = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    try {
      await updateApiCategoryFx({
        id: item.id,
        body: {
          active_api_categories_list: [value]
        }
      })
      refresh()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Select inline disabled={isExpired} id="select" value={selectedId} name="category" onChange={onChangeCategory} labelText="" placeholder="Choose an category">
      {gigaMeterApiCategories.map((category) => (
        <SelectItem value={category.id} text={category.name} />
      ))}
    </Select>
  )
}

export default ApiCategorySelection