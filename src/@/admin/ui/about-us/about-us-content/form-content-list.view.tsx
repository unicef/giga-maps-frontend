import { Close, DocumentMultiple_02, ChooseItem } from '@carbon/icons-react'
import { Button, IconButton, Link, TextArea, TextInput, MultiSelect } from "@carbon/react";
import { useContext, useMemo } from "react"
import styled from "styled-components";

import { $imageList, $saveFormList, onAddNewContent, onChangeFormField, onRemoveContentItem } from "~/@/admin/models/about-us-model";
import { AboutFormFieldType, AboutUsImage, AboutusFormType } from "~/@/admin/types/about-us.type"

import { FormFieldList } from "./form-field-list.view"
import { ItemContext } from "./form-main-view.view";
import { useStore, useStoreMap } from 'effector-react';
import { AboutFormType, aboutUsFormList, aboutUsFormType } from '~/@/admin/constants/aboutus.constant';
import { SelectCountry } from '~/@/api-docs/ui/components/modals/modals.style';


const FormContentListWrapper = styled.div`
  margin-bottom: 10px;
  padding: 20px 0;
`

const FormContentListItem = styled.div`
margin-bottom: 10px;
margin-left: 12px;
`
const CloseWraper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  h6{
    display: flex;
    align-items: center;
    padding: 10px 0;
    svg {
      margin-right: 10px;
    }
  }
`

export const FormContentList = ({ field: content }: { field: AboutusFormType["content"]; }) => {
  const itemType = useContext(ItemContext);
  return <FormContentListWrapper>
    <p > <DocumentMultiple_02 /> {content?.name} </p>
    {
      content?.items?.map((item, index) => {
        return (
          <FormContentListItem key={`${index}${item.type}`}>
            <CloseWraper>
              <h6> <ChooseItem /> Item {index + 1}</h6>
              {index !== 0 && (content?.items.length === index + 1) && <IconButton
                label='Remove'
                onClick={() => onRemoveContentItem({ type: itemType, index, path: content.path })}
                size="sm"
                kind="ghost"
              >
                <Close size={14} />
              </IconButton>}
            </CloseWraper>
            < FormFieldList fields={item.fields} />
          </FormContentListItem>
        )
      })
    }
    {content?.items.length !== content?.maxAllow && <Button size="sm" kind="ghost" onClick={() => onAddNewContent({ type: itemType, path: content.path })} style={{ marginLeft: 'auto' }}>
      Add new item
    </Button>}
  </FormContentListWrapper>
}

const SelectSearch = styled(SelectCountry)``
const MultiSelectSearch = styled(MultiSelect)``

const TextWrapper = styled.div`
  
  .cds--text-input__field-wrapper{
    input{
      background: #fff;
    }
  }
`

export const SelectImageDropdown = ({ field }: { field: AboutFormFieldType }) => {
  const { results: imageList } = useStore($imageList) || { results: [] };
  const type = useContext(ItemContext);


  const formItem = useStoreMap({
    store: $saveFormList,
    keys: [type],
    fn: (formList, [itemType]) => {
      return formList.find(({ type }) => type === itemType)
    }
  });

  const selectedItem = useMemo(() => {
    return formItem && imageList?.find(({ image }) => image === formItem[field.path]) || {}
  }, [imageList, formItem])

  if (!formItem) return null;
  return (
    <SelectSearch
      id={field.path}
      titleText={field.name}
      placeholder={`Select ${field.name}`}
      items={imageList || []}
      itemToString={(item) => item?.name}
      itemToElement={(item) => (
        <span style={{ display: 'flex' }}>
          {item?.name}
          <Link style={{ marginLeft: '10px', background: 'grey' }} href={item?.image} onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            window.open(item.image, "_blank");
          }} target='_blank'>
            <img src={item?.image} alt={item?.name} style={{ height: '30px' }} />
          </Link>
        </span>
      )}
      initialSelectedItem={selectedItem}
      selectedItem={selectedItem}
      onChange={({ selectedItem }: { selectedItem: AboutUsImage }) => {
        onChangeFormField({
          path: field.path,
          value: selectedItem?.image ?? null,
          type
        })
      }}
    />
  );
}


export const TextInputField = ({ field }: { field: AboutFormFieldType }) => {
  const type = useContext(ItemContext);

  const formItem = useStoreMap({
    store: $saveFormList,
    keys: [type],
    fn: (formList, [itemType]) => {
      return formList.find(({ type }) => type === itemType)
    }
  });

  if (!formItem) return null;

  return (
    <TextWrapper>
      <TextInput
        min={0}
        type="text"
        id={field.path}
        labelText={field.name}
        name={field.path}
        value={formItem[field.path] ?? ''}
        onChange={(e) =>
          onChangeFormField({
            path: field.path,
            value: e.target.value,
            type
          })
        }
        placeholder={`Enter ${field.name}`}
      />
    </TextWrapper>
  );
}

export const TextAreaField = ({ field }: { field: AboutFormFieldType }) => {
  const type = useContext(ItemContext);

  const formItem = useStoreMap({
    store: $saveFormList,
    keys: [type],
    fn: (formList, [itemType]) => {
      return formList.find(({ type }) => type === itemType)
    }
  });

  if (!formItem) return null;

  return (
    <TextWrapper>
      <TextArea
        min={0}
        type="text"
        id={field.path}
        labelText={field.name}
        name={field.path}
        value={formItem[field.path] ?? ''}
        onChange={(e) =>
          onChangeFormField({
            path: field.path,
            value: e.target.value,
            type
          })
        }
        placeholder={`Enter ${field.name}`}
        {...field.typeField.props}
      />
    </TextWrapper>
  );
}

export const SelectDropDownSection = ({ field }: { field: AboutFormFieldType }) => {
  const sectionList = useMemo(() => {
    return aboutUsFormList.filter(item => !(item.type.includes('header') || item.type.includes('footer'))).map(({ type, sectionName }) => ({ label: sectionName, value: type }));
  }, [aboutUsFormList]);
  const type = useContext(ItemContext);

  const formItem = useStoreMap({
    store: $saveFormList,
    keys: [type],
    fn: (formList, [itemType]) => {
      return formList.find(({ type }) => type === itemType)
    }
  });

  const selectedItem = useMemo(() => {
    const content = (formItem?.[field.path] || "")?.split(',')
    return content && sectionList?.filter((item: { label: string; value: string }) => content.includes(item.value)) || []
  }, [sectionList, formItem?.[field.path]])
  if (!formItem) return null;

  return (
    <MultiSelectSearch
      id={field.path}
      titleText={field.name}
      label={`Choose target`}
      items={sectionList || []}
      itemToString={(item: any) => item?.label}
      itemToElement={(item: any) => (
        <span>
          {item?.label}
        </span>
      )}
      selectedItems={selectedItem}
      onChange={({ selectedItems }: { selectedItems: any[] }) => {
        const selectedValue = selectedItems.map(item => item.value).sort((a, b) => aboutUsFormType.indexOf(a) - aboutUsFormType.indexOf(b)).join(',');
        onChangeFormField({
          path: field.path,
          value: selectedValue,
          type
        })
      }}
    />
  );
}

const FormComponentTypes = {
  [AboutFormType.content]: FormContentList,
  [AboutFormType.text]: TextInputField,
  [AboutFormType.textarea]: TextAreaField,
  [AboutFormType.dropdownImage]: SelectImageDropdown,
  [AboutFormType.dropdownSectionTarget]: SelectDropDownSection,
} as Record<string, React.FC<{ field: any }>>


export const FieldItem = ({ type, field }: { type: string, field: AboutFormFieldType }) => {
  const Component = FormComponentTypes[type]
  if (!Component) return null;
  return <Component field={field} />
}