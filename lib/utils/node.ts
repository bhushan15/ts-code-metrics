import { Node } from "typescript";

export const getNodePosition = (node: Node) => {
  const { pos, end } = node;
  return JSON.stringify({ pos, end });
};

export const getNodeName = (node: Node, count=0) => {
  // @ts-ignore
  const name = node?.name?.escapedText;
  const iteration = count + 1;
  return name ?? (count <=5 ? getNodeName(node?.parent, iteration) : undefined);
};
