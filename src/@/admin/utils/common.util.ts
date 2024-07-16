
export const checkForChangeFields = (currentData: any, oldData: any) => {
  const newData = {} as Record<string, unknown>
  if (!currentData || !oldData) return newData;
  const formEntires = Object.entries(currentData);
  formEntires.forEach(([key, value]) => {
    if (oldData[key] !== value) {
      newData[key] = value;
    }
  })
  return newData;
}