import { Node } from "typescript";
import { Node as TsNode } from "ts-morph";

export const getNodePosition = (node: Node) => {
  const { pos, end } = node;
  return JSON.stringify({ pos, end });
};

export const getTsNodePosition = (node: TsNode) => {
  const pos = node.getStart();
  const end = node.getEnd();
  return JSON.stringify({ pos, end });
};

export const getTsNodeName = (node: TsNode) => {
  return node.getText();
};

export const getNodeName = (node: Node) => {
  // @ts-ignore
  const name = node?.name?.escapedText;
  return name ?? getNodeName(node?.parent);
};

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

export const getFormattedObj = (
  complexityPerPosition,
  functionNamePerPosition
) => {
  const formattedObj = {};
  for (const [itemKey, itemValue] of Object.entries(complexityPerPosition)) {
    formattedObj[functionNamePerPosition[itemKey]] = itemValue;
  }

  return formattedObj;
};
