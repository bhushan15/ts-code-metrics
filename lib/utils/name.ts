import { Node, isIdentifier } from "typescript";

export const getNodeName = (node: Node) => {
  // @ts-ignore
  const { name = undefined, pos, end } = node;
  const nodeName =
    name !== undefined && isIdentifier(name)
      ? name.text
      : // @ts-ignore
        node.parent?.name?.escapedText;
  return nodeName ?? JSON.stringify({ pos, end });
};
