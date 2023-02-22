import { Node, SyntaxKind } from "typescript";

export const getNodePosition = (node: Node) => {
  const { pos, end } = node;
  return JSON.stringify({ pos, end });
};

export const getNodeName = (node: Node) => {
  // node?.name?.escapedText;
  // @ts-ignore
  const name = node?.name?.getText();
  return name ?? getNodeName(node?.parent);
};

export const hasParentNodeOfTypeClass = (node: Node) => {
  const hasParent = node?.parent;
  const hasParentOfTypeClass = hasParent
    ? node.parent.kind === SyntaxKind.ClassDeclaration
      ? true
      : hasParentNodeOfTypeClass(node.parent)
    : false;

  return hasParentOfTypeClass;
};

export const getClassTypeParentNodeName = (node: Node) => {
  const hasParent = node?.parent;
  const nodeName = hasParent
    ? node.parent.kind === SyntaxKind.ClassDeclaration
      ? getNodeName(node.parent)
      : getClassTypeParentNodeName(node.parent)
    : "";

  return nodeName;
}

export const getParentNodeClassName = (node: Node) => {
  return getClassTypeParentNodeName(node);
};
