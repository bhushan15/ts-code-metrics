import { Node } from "typescript";

export const getNodePosition = (node: Node) => {
  const { pos, end } = node;
  return JSON.stringify({ pos, end });
};

export const getNodeName = (node: Node) => {
  // @ts-ignore
  const name = node?.name?.escapedText;
  return name ?? getNodeName(node?.parent);
};
