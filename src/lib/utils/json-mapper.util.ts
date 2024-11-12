type JsonObject = Record<string, any>;
type MappedData = Record<string, any>;

const extractValue = (
  obj: any,
  keys: string[],
  currentPath: string,
  result: MappedData
) => {
  const [key, ...restKeys] = keys;
  const isString = typeof obj === 'string'
  if (!obj || (key === undefined && !isString)) {
    return;
  }

  if (key === '*') {
    if (Array.isArray(obj)) {
      obj.forEach((item, index) => {
        extractValue(item, restKeys, `${currentPath}.${index}`, result);
      });
    }
  } else if (restKeys.length === 0 && !isString) {
    result[currentPath ? `${currentPath}.${key}` : key] = obj[key];
  } else if (restKeys.length === 0 && typeof obj != 'string') {
    result[currentPath ? `${currentPath}.${key}` : key] = obj[key];
  } else if (isString && !key) {
    result[currentPath] = obj;
  } else {
    extractValue(
      obj[key],
      restKeys,
      currentPath ? `${currentPath}.${key}` : key,
      result
    );
  }
}

export const extractDataWithMapping = (
  json: JsonObject,
  paths: string[]
): MappedData => {
  const result: MappedData = {};

  paths.forEach(path => {
    const keys = path.split('.');
    extractValue(json, keys, '', result);
  });

  return result;
}

const setValue = (obj: JsonObject, keys: string[], value: any) => {
  const [key, ...restKeys] = keys;

  // Check if the key is an array index
  const arrayIndexMatch = key.match(/^(\d+)$/);
  const isArrayIndex = arrayIndexMatch !== null;

  if (isArrayIndex) {
    const index = parseInt(key, 10);

    if (!Array.isArray(obj)) {
      obj = [];
    }

    if (restKeys.length === 0) {
      obj[index] = value;
    } else {
      if (!obj[index]) {
        obj[index] = isNaN(Number(restKeys[0])) ? {} : [];
      }
      setValue(obj[index], restKeys, value);
    }
  } else {
    if (restKeys.length === 0) {
      obj[key] = value;
    } else {
      if (!obj[key]) {
        obj[key] = isNaN(Number(restKeys[0])) ? {} : [];
      }
      setValue(obj[key], restKeys, value);
    }
  }
}

export const reconstructJson = (mappedData: MappedData): JsonObject => {
  const result: JsonObject = {};

  for (const path in mappedData) {
    const value = mappedData[path];
    const keys = path.split('.');

    setValue(result, keys, value);
  }

  return result;
}
