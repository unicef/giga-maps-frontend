import { Select, SelectItem, Modal } from "@carbon/react"
import { ApiKeysAdminRequestType } from "../../types/api-request.type"
import { $gigaMeterApiCategories } from "../../models/api-request-model"
import { useStore } from "effector-react"
import { updateApiCategoryFx } from "../../effects/api-request-fx"
import { useState } from "react"
import { useTranslation } from "react-i18next"

const ApiCategorySelection = ({ item, refresh, isExpired }: { item: ApiKeysAdminRequestType, refresh: () => void, isExpired?: boolean }) => {
  const isDailyCheck = item.api.code === "DAILY_CHECK_APP"
  const gigaMeterApiCategories = useStore($gigaMeterApiCategories)
  const [nextCategoryId, setNextCategory] = useState<number>();
  const isLoading = useStore(updateApiCategoryFx.pending);
  const [activeCategory, setActiveCategory] = useState<number>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!isDailyCheck) return null
  const selectedId = item.active_api_categories_list?.[0]?.id ?? gigaMeterApiCategories.find((category) => category.is_default)?.id
  const currentCategory = gigaMeterApiCategories.find(cat => cat.id === selectedId)
  const newCategory = gigaMeterApiCategories.find(cat => cat.id === nextCategoryId)

  const updateCategory = async () => {
    try {
      await updateApiCategoryFx({
        id: item.id,
        body: {
          active_api_categories_list: [nextCategoryId]
        }
      })
      setActiveCategory(undefined);
      setNextCategory(undefined);
      setIsModalOpen(false);
      refresh()
    } catch (error) {
      console.log(error)
      setActiveCategory(undefined);
      setNextCategory(undefined);
    }
  }
  const onChangeCategory = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setNextCategory(Number(value));
    setActiveCategory(item.id);
    setIsModalOpen(true);
  }

  return (
    <>
      <Select
        inline
        disabled={isExpired}
        id="select"
        value={selectedId}
        name="category"
        onChange={onChangeCategory}
        labelText=""
        placeholder="Choose a category"
      >
        {gigaMeterApiCategories.map((category) => (
          <SelectItem key={category.id} value={category.id} text={category.name} />
        ))}
      </Select>
      {isModalOpen && (
        <Modal
          open={isModalOpen}
          modalHeading={"Change API Category"}
          primaryButtonText={`${isLoading ? "Updating API Category..." : "Confirm Change"}`}
          secondaryButtonText={"Cancel"}
          primaryButtonDisabled={isLoading}
          onRequestSubmit={updateCategory}
          onRequestClose={() => {
            setIsModalOpen(false);
            setActiveCategory(undefined);
            setNextCategory(undefined);
          }}
          size="sm"
        >
          <div style={{ marginBottom: '1rem' }}>
            <p>You are about to change the API category:</p>
            <p><strong>Current Category:</strong> {currentCategory?.name}</p>
            <p><strong>New Category:</strong> {newCategory?.name}</p>
            <p style={{ marginTop: '1rem' }}>Are you sure you want to proceed?</p>
          </div>
        </Modal>
      )}
    </>
  )
}

export default ApiCategorySelection