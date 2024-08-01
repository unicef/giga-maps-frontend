import { combine, createEvent, createStore, sample } from "effector";

import { $notification } from "~/@/common/Toast/toast.model";
import { APIListType } from "~/api/types";
import { setPayload } from "~/lib/effector-kit";

import { aboutUsFormList, defaultAboutUsList } from "../constants/aboutus.constant";
import { getAboutusContentFx, getImagesListFx, updateAboutusContentFx } from "../effects/about-us-fx";
import { AboutusFormType, AboutUsImage } from "../types/about-us.type";
import { jsonToMapping, updateContentItemPaths, updateItemContentAndPath } from '../utils/aboutus.util';



export const onChangeAdminAboutUsTab = createEvent<number>();
export const $adminAboutUsTab = createStore(0)
$adminAboutUsTab.on(onChangeAdminAboutUsTab, setPayload);


export const $imageList = createStore<APIListType<AboutUsImage> | null>(null);
$imageList.on(getImagesListFx.doneData, setPayload);

export const onRemoveContentItem = createEvent<{ type: string, path: string; index: number; }>();
export const $formItemList = createStore<AboutusFormType[]>(aboutUsFormList);
export const onAddNewContent = createEvent<{ type: string; path: string }>();
$formItemList.on(onAddNewContent, (state, payload) => updateItemContentAndPath(state, payload, 1));


export const onSubmitUpdateFormList = createEvent<SaveFormListType>();
export const $saveFormList = createStore(defaultAboutUsList);
export const $aboutUsContent = createStore<SaveFormListType>([])
export const $aboutusDataAvailable = $saveFormList.map(items => items.some((item) => item.id))
export type SaveFormListType = ReturnType<typeof $saveFormList.getState>
const updateSaveFormList = (state: SaveFormListType, payload: SaveFormListType) => {
  if (payload?.length) {
    const mappedJson = jsonToMapping(payload, JSON.parse(JSON.stringify(state)));
    return mappedJson;
  }
  return state;
}
$aboutUsContent.on(getAboutusContentFx.doneData, setPayload)
$saveFormList.on(getAboutusContentFx.doneData, updateSaveFormList);
$saveFormList.on(onSubmitUpdateFormList, updateSaveFormList);

export const onChangeFormField = createEvent<{ path: string; value: string; type: string }>();

$saveFormList.on(onChangeFormField, (state, payload) => {
  const { path, value, type } = payload;
  const newState = state.map((item) => {
    if (item.type === type) {
      item[path] = value;
    }
    return item;
  });
  return newState;
})

// on remove content item
sample({
  clock: onRemoveContentItem,
  source: combine({ saveFormList: $saveFormList, formItemList: $formItemList }),
  fn: ({ saveFormList, formItemList }, { type, index, path }) => {
    const formItem = formItemList.find((item) => item.type === type);
    if (!formItem) return saveFormList;
    return saveFormList.map((item) => {
      if (item.type !== type) {
        return item;
      }
      Object.keys(item).forEach((key) => {
        const currentItem = `${path}.${index}`;
        if (key.startsWith(currentItem)) {
          delete item[key];
        }
      });
      return !!paths ? {
        ...item,
      } : item;
    });
  },
  target: $saveFormList
})

const getContentByPath = (item: Record<string, any>, path: string) => {
  const keys = path.split(".");
  return keys.reduce((obj, key) => obj?.[key], item);
}
// add new item on new data;
sample({
  clock: getAboutusContentFx.doneData,
  source: combine({ formItemList: $formItemList }),
  fn: ({ formItemList }, aboutusContentResponse) => {
    if (aboutusContentResponse.length > 0) {
      const newState = formItemList.map((matchedItem) => {
        const currentItem = aboutusContentResponse.find(item => item.type === matchedItem.type);
        const currentContentLength = currentItem?.content?.length || 0;
        const matchContentLength = matchedItem?.content?.items.length ?? 0;
        let newItemContent = matchedItem.content;
        if (currentItem && matchedItem.content && currentContentLength > matchContentLength) {
          const newCount = currentContentLength - matchContentLength;
          newItemContent = {
            ...matchedItem.content,
            items: updateContentItemPaths(matchedItem.content.items, matchedItem.content.path, newCount),
          };
        }
        return {
          ...matchedItem,
          fields: matchedItem.fields.map((field) => {
            const { path } = field;
            if (currentItem && path.startsWith('content') && field?.items?.length) {
              const getCurrentFieldContent = getContentByPath(currentItem, path)
              const count = getCurrentFieldContent?.length - field?.items?.length || 0;
              return {
                ...field,
                items: updateContentItemPaths(field.items, path, count),
              }
            }
            return field;
          }),
          content: newItemContent
        };
      });
      return newState;
    }
    return formItemList;
  },
  target: $formItemList
})

// sync content length
sample({
  clock: onRemoveContentItem,
  source: combine({ formItemList: $formItemList }),
  fn: ({ formItemList }, { type, index, path }) => {
    const isContentType = path === 'content';
    const newState = formItemList.map((section) => {
      if (section.type === type) {
        section = {
          ...section,
        }
        if (isContentType) {
          section.content = section.content ? {
            ...section.content,
            items: section?.content?.items.filter((_, i) => i !== index)
          } : undefined
        } else if (path.startsWith('content')) {
          section.fields = section.fields.map((field) => {
            if (field.path === path) {
              return {
                ...field,
                items: field?.items?.filter((_, i: number) => i !== index)
              }
            }
            return field;
          })
        }
      }
      return section;
    });
    return newState;
  },
  target: $formItemList
})

sample({
  clock: updateAboutusContentFx.done,
  fn: () => ({
    title: `Aboutus content saved.`,
    kind: 'success',
    subtitle: ''
  }),
  target: $notification
})