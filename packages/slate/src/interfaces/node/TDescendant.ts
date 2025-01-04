import type { TEditor, Value } from '../editor/TEditor';
import type { ElementOf, TElement } from '../element/TElement';
import type { TText, TextOf } from '../text/TText';
import type { TNode } from './TNode';

import { isElement } from '../element/isElement';
import { TextApi } from '../text';

/**
 * The `Descendant` union type represents nodes that are descendants in the
 * tree. It is returned as a convenience in certain cases to narrow a value
 * further than the more generic `Node` union.
 */
export type TDescendant = TElement | TText;

/** A utility type to get all the descendant node types from a root node type. */
export type DescendantOf<N extends TNode> = N extends TEditor
  ? ElementOf<N> | TextOf<N>
  : N extends TElement
    ? ElementOf<N['children'][number]> | TextOf<N>
    : never;

export type DescendantIn<V extends Value> = DescendantOf<V[number]>;

/** A utility type to get the child node types from a root node type. */
export type ChildOf<
  N extends TNode,
  I extends number = number,
> = N extends TEditor
  ? N['children'][I]
  : N extends TElement
    ? N['children'][I]
    : never;

export const isDescendant: (value: any) => value is TDescendant = ((
  node: any
) => isElement(node) || TextApi.isText(node)) as any;
