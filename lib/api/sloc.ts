import { forEachChild, SourceFile } from "typescript";
import {
  getFormattedObj,
  getNodeName,
  getNodePosition,
  getTsNodePosition,
  mergeObjectPropertiesBasedOnKeys,
} from "./../utils/name";
import { isFunctionWithBody } from "tsutils";

export const getSloc = (sourceFile: SourceFile) => {
  const locPerFunction: any = {};
  const functionalityPerPos: any = {};

  // functions.forEach((functionDeclaration) => {
  //   const loc =
  //     functionDeclaration.getEndLineNumber() -
  //     functionDeclaration.getStartLineNumber() +
  //     1;
  //   const name = functionDeclaration.getName() || "function";
  //   locPerFunction[name] = loc;
  // });

  // console.log(functions);

  forEachChild(sourceFile, function cb(node) {
    forEachChild(node, cb);
    if (isFunctionWithBody(node)) {
      const start = sourceFile.getLineAndCharacterOfPosition(node.getStart());
      const end = sourceFile.getLineAndCharacterOfPosition(node.getEnd());
      const loc = end.line + 1 - (start.line + 1);
      const pos = getNodePosition(node);
      const name = getNodeName(node);
      locPerFunction[pos] = loc;
      functionalityPerPos[pos] = name;
    }
  });

  console.log(locPerFunction);
  return getFormattedObj(
    mergeObjectPropertiesBasedOnKeys(locPerFunction),
    mergeObjectPropertiesBasedOnKeys(functionalityPerPos, true)
  );
};
