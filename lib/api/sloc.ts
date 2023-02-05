import { forEachChild, SourceFile } from "typescript";
import {
  getFormattedObj,
  getNodeName,
  getNodePosition,
  mergeObjectPropertiesBasedOnKeys,
} from "../utils";
import { isFunctionWithBody } from "tsutils";

export const getSloc = (sourceFile: SourceFile) => {
  const locPerFunction: any = {};
  const functionalityPerPos: any = {};

  forEachChild(sourceFile, function cb(node) {
    forEachChild(node, cb);
    if (isFunctionWithBody(node)) {
      // const start = sourceFile.getLineAndCharacterOfPosition(node.getStart());
      // const end = sourceFile.getLineAndCharacterOfPosition(node.getEnd());
      // const loc = end.line + 1 - (start.line + 1);
      const loc = node.getFullText().split("\n").length;
      const pos = getNodePosition(node);
      const name = getNodeName(node);
      locPerFunction[pos] = loc;
      functionalityPerPos[pos] = name;
    }
  });

  return getFormattedObj(
    mergeObjectPropertiesBasedOnKeys(locPerFunction, true),
    mergeObjectPropertiesBasedOnKeys(functionalityPerPos, true)
  );
};
