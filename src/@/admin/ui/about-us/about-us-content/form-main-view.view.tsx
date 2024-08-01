import { Accordion, AccordionItem, Button, Form } from "@carbon/react"
import { useStore } from "effector-react";
import { createContext, FormEvent, useEffect } from "react";

import { getAboutusContentFx, getImagesListFx, updateAboutusContentFx } from "~/@/admin/effects/about-us-fx";
import { $aboutusDataAvailable, $formItemList, $imageList, $saveFormList } from "~/@/admin/models/about-us-model";
import { MappingItem, convertMappingToJson } from "~/@/admin/utils/aboutus.util";

import { AdminTableScroll, BottomButtonWrapper } from "../../styles/admin-styles";
import { FormContentList } from "./form-content-list.view"
import { FormFieldList } from "./form-field-list.view"

export const ItemContext = createContext("");
function FormMainView() {
  const isEditMode = useStore($aboutusDataAvailable);
  const { results: imageList } = useStore($imageList) ?? {};
  const aboutusFormList = useStore($formItemList);
  const savedFormList = useStore($saveFormList);
  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      let formData = convertMappingToJson(savedFormList as MappingItem[]);
      formData = formData.map((item) => ({
        cta: [],
        text: [],
        content: [],
        ...item,
      }))
      const newFormData = formData.filter(item => !item.id);
      const updatedFormData = formData.filter(item => !!item.id);
      if (newFormData.length > 0) {
        await updateAboutusContentFx({ formData: newFormData, isUpdate: false });
      }
      if (updatedFormData.length > 0) {
        await updateAboutusContentFx({ formData: updatedFormData, isUpdate: true });
      }
      // get update list;
      await getAboutusContentFx();
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    if (!imageList) {
      void getImagesListFx();
    }
  }, [imageList]);

  useEffect(() => {
    void getAboutusContentFx();
  }, [])

  return (<Form id="formElem"
    onSubmit={handleFormSubmit} autoComplete="off" data-testid="admin-about-us-form">
    <AdminTableScroll $contentHeight="10rem">
      <Accordion>
        {aboutusFormList.map((item, index) => {
          return (<ItemContext.Provider key={item.type} value={item.type}>
            <AccordionItem title={item.sectionName} open={!!index} key={`${index}-${item.type}`}>
              {item.fields?.length > 0 && <FormFieldList fields={item.fields} />}
              {item.content && <FormContentList field={item.content} />}
            </AccordionItem>
          </ItemContext.Provider>
          )
        })
        }
      </Accordion>
    </AdminTableScroll>
    <BottomButtonWrapper>
      <Button
        type='submit'
        kind="primary">
        {isEditMode ? 'Update' : 'Submit'}
      </Button>
    </BottomButtonWrapper>
  </Form>
  )
}

export default FormMainView
