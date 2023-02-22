import { forEachChild, SourceFile } from "typescript";
import {
  getFormattedObj,
  getNodeName,
  getNodePosition,
  getParentNodeClassName,
  mergeObjectPropertiesBasedOnKeys,
} from "../utils";
import { isFunctionWithBody } from "tsutils";

export const getSloc = (sourceFile: SourceFile) => {
  const locPerFunction: any = {};
  const functionalityPerPos: any = {};

  forEachChild(sourceFile, function cb(node) {
    forEachChild(node, cb);
    if (isFunctionWithBody(node)) {
      const loc = node.getFullText().split("\n").length;
      const pos = getNodePosition(node);
      let name = getNodeName(node);

      const parentNodeClassName = getParentNodeClassName(node);
      name = parentNodeClassName ? `${parentNodeClassName}.${name}` : name;
      locPerFunction[pos] = loc;
      functionalityPerPos[pos] = name;
    }
  });

  return getFormattedObj(
    mergeObjectPropertiesBasedOnKeys(locPerFunction, true),
    mergeObjectPropertiesBasedOnKeys(functionalityPerPos, true)
  );
};
