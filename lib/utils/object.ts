export const mergeObjectPropertiesBasedOnKeys = (
  metricPerFunction,
  skipMergingValues?: boolean
) => {
  let objWithMergedProperties = {};
  for (const [functionPosition, metricValue] of Object.entries(
    metricPerFunction
  )) {
    const parsedFunctionPosition = JSON.parse(functionPosition);
    //@ts-ignore
    objWithMergedProperties[functionPosition] = metricValue;
    for (const [itemKey, itemValue] of Object.entries(metricPerFunction)) {
      const parsedItemKey = JSON.parse(itemKey);

      if (
        parsedItemKey["pos"] >= parsedFunctionPosition["pos"] &&
        parsedItemKey["pos"] <= parsedFunctionPosition["end"] &&
        parsedItemKey["end"] >= parsedFunctionPosition["pos"] &&
        parsedItemKey["end"] <= parsedFunctionPosition["end"] &&
        !(
          parsedItemKey["pos"] === parsedFunctionPosition["pos"] &&
          parsedItemKey["end"] === parsedFunctionPosition["end"]
        )
      ) {
        if (!skipMergingValues) {
          // @ts-ignore
          objWithMergedProperties[functionPosition] =
            objWithMergedProperties[functionPosition] + itemValue;
        }
        // @ts-ignore
        delete objWithMergedProperties[itemKey];
      }
    }
  }

  return objWithMergedProperties;
};

export const getFormattedObj = (metricPerPosition, functionNamePerPosition) => {
  const formattedObj = {};
  for (const [itemKey, itemValue] of Object.entries(metricPerPosition)) {
    formattedObj[functionNamePerPosition[itemKey]] = itemValue;
  }

  return formattedObj;
};
