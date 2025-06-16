import { Select, SelectItem, ActionableNotification } from "@carbon/react"
import { ApiKeysAdminRequestType } from "../../types/api-request.type"
import { $gigaMeterApiCategories } from "../../models/api-request-model"
import { useStore } from "effector-react"
import { updateApiCategoryFx } from "../../effects/api-request-fx"
import { useState } from "react"



const ApiCategorySelection = ({ item, refresh, isExpired }: { item: ApiKeysAdminRequestType, refresh: () => void, isExpired?: boolean }) => {
  const isDailyCheck = item.api.code === "DAILY_CHECK_APP"
  const gigaMeterApiCategories = useStore($gigaMeterApiCategories)
  const [nextCategoryId, setNextCategory] = useState<number>();
  const [activeCategory, setActiveCategory] = useState<number>();
  if (!isDailyCheck) return null
  const selectedId = item.active_api_categories_list?.[0]?.id ?? gigaMeterApiCategories.find((category) => category.is_default)?.id
  const updateCategory = async () => {
    try {
      setActiveCategory(undefined);
      setNextCategory(undefined);
      await updateApiCategoryFx({
        id: item.id,
        body: {
          active_api_categories_list: [nextCategoryId]
        }
      })
      refresh()
    } catch (error) {
      console.log(error)
    }
  }
  const onChangeCategory = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setNextCategory(Number(value));
    setActiveCategory(item.id);
  }

  return (<>
    <Select inline disabled={isExpired} id="select" value={selectedId} name="category" onChange={onChangeCategory} labelText="" placeholder="Choose an category">
      {gigaMeterApiCategories.map((category) => (
        <SelectItem value={category.id} text={category.name} />
      ))}
    </Select>
    {activeCategory && item.id === activeCategory && <ActionableNotification
      style={{ maxWidth: "100%" }}
      lowContrast inline
      title=""
      kind="warning-alt"
      subtitle={`Change to '${gigaMeterApiCategories.find(category => category.id === nextCategoryId)?.name}'?`}
      closeOnEscape
      actionButtonLabel="Yes"
      onActionButtonClick={updateCategory}
      onClose={() => {
        setActiveCategory(undefined);
        setNextCategory(undefined);
      }}
    />}
  </>)
}

export default ApiCategorySelection