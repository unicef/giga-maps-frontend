/* use this file to create global utils methods */


export const shuffleArray = (array: unknown[]): unknown[] => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    // eslint-disable-next-line no-param-reassign
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export function formatNumber(value = 0) {
  if (Math.abs(value) >= 1000000000) {
    return `${(value / 1000000000).toFixed(1)}B`;
  } if (Math.abs(value) >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  } if (Math.abs(value) >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value > 0 ? value : '0';
}

export function getId() {
  const timestamp = new Date().getTime();

  // Generate a random number between 1 and 1000
  const randomNumber = Math.floor(Math.random() * 10000) + 1;

  // Concatenate the timestamp and random number to create a unique number
  const uniqueNumber = `${timestamp}${randomNumber}`;

  // Convert the unique number to an integer
  return parseInt(uniqueNumber);
}

export const getLocalStorage = (name: string) => {
  let data = null as unknown;
  try {
    const item = window?.localStorage?.getItem(name) || 'null'
    data = JSON.parse(item) as unknown;
  } catch (e) {
    console.log('Optional Error: Invalid parser', e);
  }
  return data;
}

export const setLocalStorage = (name: string, value: string | object) => {
  try {
    window?.localStorage?.setItem(name, JSON.stringify(value));
  } catch (e) {
    console.log('Optional Error: set Item');
  }
}

export const delayMethodCall = () => {
  let timerId: ReturnType<typeof setTimeout>;
  return (timeout = 0, callback = (_args: any) => { }, props = {}) => {
    clearTimeout(timerId);
    if (timeout && timeout > 0) {
      timerId = setTimeout(() => {
        return callback(props);
      }, timeout);
    } else {
      return callback(props);
    }
  }
}

export const groupArray = <T>(arr: T[]) => arr.reduce((acc: T[][], value: T, i: number) => {
  const isEven = ((i + 1) % 2) === 0;
  if (isEven) {
    acc[acc.length - 1].push(value)
  } else {
    acc?.push([value])

  }
  return acc
}, []);

export const isProd = process.env.NODE_ENV === 'production'

export const waitFor = (seconds = 0) => {
  return new Promise((resolve) => {
    setTimeout(resolve, seconds);
  });
}

export const speedConverterUtil = (current: string, convertTo: string, value = 0) => {
  if (current === 'bps' && convertTo === 'mbps') {
    return value / 1000000;
  }
  return value;;
}

export function evaluateExpression(expression?: string, val?: string | number | null) {
  // Define a regular expression to match {val}
  if (!expression || !val) return val;
  const regex = /\{val\}/g;
  try {
    // Replace {val} with the actual number
    const modifiedExpression = expression.replace(regex, String(val));

    // Use Function constructor to create a function
    // and pass val as a parameter
    const func = new Function(`return ${modifiedExpression};`);

    // Call the function with the actual value
    const result = func(val);

    return Number(parseFloat(result).toFixed(0));
  } catch {
    return val;
  }
}