import { AboutUsContentType, AboutusFormType } from "../types/about-us.type";

type NestedObject = {
  [key: string]: NestedObject | string | string[]; // Handles nesting, strings, string arrays
}
export function convertMappingToJson(mapping: MappingItem[]): NestedObject[] {

  const result: NestedObject[] = [];

  for (const item of mapping) {

    const obj: NestedObject = {};

    for (const key in item) {

      const keys = key.split('.');
      let current: NestedObject = obj;

      for (let i = 0; i < keys.length - 1; i++) {
        const k = keys[i];
        if (!isNaN(parseInt(keys[i + 1]))) {
          current[k] = current[k] || [];
        } else {
          current[k] = current[k] || {};
        }
        current = current[k] as NestedObject;
      }

      current[keys[keys.length - 1]] = item[key];

    }

    result.push(obj);

  }

  return result;

}





interface JsonData {
  [key: string]: any;
}

export interface MappingItem {
  [key: string]: string;
}

function flattenObject(obj: any, prefix = '', mappingItem: MappingItem = {}) {
  for (const innerKey in obj) {
    const newPrefix = prefix ? `${prefix}.${innerKey}` : innerKey;

    if (typeof obj[innerKey] === 'object' && obj[innerKey] !== null) {
      flattenObject(obj[innerKey], newPrefix, mappingItem);
    } else if (Array.isArray(obj[innerKey])) {
      mappingItem[newPrefix] = obj[innerKey].join('');
    } else {
      mappingItem[newPrefix] = obj[innerKey];
    }
  }
}
export function jsonToMapping(jsonData: JsonData[], mapping = []): MappingItem[] {

  for (const item of jsonData) {
    const mappingItem = mapping.find(({ type }) => item.type === type);
    flattenObject(item, '', mappingItem);
  }
  return mapping;
}


export const updateItemContentAndPath = (originalState: AboutusFormType[], payload: { type: string; path?: string }, newCount = 1) => {
  const { type, path } = payload
  const isContentType = path === 'content';
  return originalState.map((matchedItem) => {
    if (matchedItem.type === type) {
      if (matchedItem.content && isContentType) {
        const newItemContent = {
          ...matchedItem.content,
          items: updateContentItemPaths(matchedItem.content.items, path, newCount),
        };
        return { ...matchedItem, content: newItemContent };
      } else {
        return {
          ...matchedItem,
          fields: matchedItem.fields.map((field) => {
            if (field.path === path) {
              return {
                ...field,
                items: updateContentItemPaths(field.items, field.path, newCount),
              };
            }
            return field;
          })
        }
      }
    }
    return matchedItem; // No change needed
  });
};

// Helper to update paths
export const updateContentItemPaths = (targetContentItems: AboutUsContentType['items'], path: string, newCount: number) => {
  const targetContentItemsCopy = structuredClone(targetContentItems[0]);
  const prevsLength = targetContentItems.length;
  const newItems = Array.from({ length: newCount }).map((_, index) => ({
    ...targetContentItemsCopy,
    fields: targetContentItemsCopy.fields.map((field) => ({
      ...field,
      path: field.path.replace(new RegExp(`${path}.\\d+`), `${path}.${prevsLength + index}`)
    }))
  }))
  return [
    ...targetContentItems
  ].concat(newItems);
};


