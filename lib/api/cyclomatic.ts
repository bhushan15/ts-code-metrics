import {
  BinaryExpression,
  Block,
  Node,
  ScriptTarget,
  SourceFile,
  SyntaxKind,
  createSourceFile,
  forEachChild,
} from "typescript";
import { existsSync, readFileSync } from "fs";

import {
  getNodePosition,
  mergeObjectPropertiesBasedOnKeys,
  getFormattedObj,
  getNodeName,
  getParentNodeClassName,
} from "../utils";
import { isFunctionWithBody } from "tsutils";

const incrComplexity = (node: Node | Block) => {
  switch (node.kind) {
    case SyntaxKind.CaseClause:
      return (node as Block).statements.length > 0;
    case SyntaxKind.CatchClause:
    case SyntaxKind.ConditionalExpression:
    case SyntaxKind.DoStatement:
    case SyntaxKind.ForStatement:
    case SyntaxKind.ForInStatement:
    case SyntaxKind.ForOfStatement:
    case SyntaxKind.IfStatement:
    case SyntaxKind.WhileStatement:
    case SyntaxKind.ConditionalExpression:
      return true;

    case SyntaxKind.BinaryExpression:
      switch ((node as BinaryExpression).operatorToken.kind) {
        case SyntaxKind.BarBarToken:
        case SyntaxKind.AmpersandAmpersandToken:
          return true;
        default:
          return false;
      }

    default:
      return false;
  }
};

export const getCylomaticComplexityForSource = (ctx: SourceFile) => {
  let complexity = 0;
  const complexityPerFunc: any = {};
  const functionalityPerPos: any = {};
  forEachChild(ctx, function cb(node: Node) {
    if (isFunctionWithBody(node)) {
      const old = complexity;
      complexity = 1;
      forEachChild(node, cb);
      const pos = getNodePosition(node);
      let name = getNodeName(node);

      const parentNodeClassName = getParentNodeClassName(node);
      name = parentNodeClassName ? `${parentNodeClassName}.${name}` : name;

      complexityPerFunc[pos] = complexity;
      complexity = old;
      functionalityPerPos[pos] = name;
    } else {
      if (incrComplexity(node)) {
        complexity += 1;
      }
      forEachChild(node, cb);
    }
  });

  return getFormattedObj(
    mergeObjectPropertiesBasedOnKeys(complexityPerFunc),
    mergeObjectPropertiesBasedOnKeys(functionalityPerPos, true)
  );
};

export const getCyclomaticComplexityForFile = (
  filePath: string,
  target: ScriptTarget
) => {
  if (!existsSync(filePath)) {
    throw new Error(`File "${filePath}" does not exists`);
  }
  const sourceText = readFileSync(filePath).toString();
  const source: SourceFile = createSourceFile(filePath, sourceText, target);
  return getCylomaticComplexityForSource(source);
};
