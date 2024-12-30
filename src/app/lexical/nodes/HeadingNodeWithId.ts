import { HeadingNode } from "@lexical/rich-text";
import { NodeKey, SerializedLexicalNode, Spread } from "lexical";

export type SerializedHeadingNodeWithId = Spread<
  {
    permanentId: string;
  },
  SerializedLexicalNode
>;

export class HeadingNodeWithId extends HeadingNode {
  __permanentId: string;

  constructor(tag: "h1" | "h2" | "h3", permanentId?: string, key?: NodeKey) {
    super(tag, key);
    this.__permanentId =
      permanentId || `heading-${Math.random().toString(36).substr(2, 9)}`;
  }

  static getType(): string {
    return "heading-with-id";
  }

  static clone(node: HeadingNodeWithId): HeadingNodeWithId {
    return new HeadingNodeWithId(node.__tag, node.__permanentId, node.__key);
  }

  exportJSON(): SerializedHeadingNodeWithId {
    return {
      ...super.exportJSON(),
      permanentId: this.__permanentId,
    };
  }

  getPermanentId(): string {
    return this.__permanentId;
  }
}
