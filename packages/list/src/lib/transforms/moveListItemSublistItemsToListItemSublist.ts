import {
  type SlateEditor,
  type TElement,
  type TElementEntry,
  getLastChildPath,
  insertElements,
  moveChildren,
} from '@udecode/plate-common';
import { Path } from 'slate';

import { getListTypes } from '../queries/getListTypes';

export interface MoveListItemSublistItemsToListItemSublistOptions {
  /** The list item to merge. */
  fromListItem: TElementEntry;

  /** The list item where to merge. */
  toListItem: TElementEntry;

  /** Move to the start of the list instead of the end. */
  start?: boolean;
}

/**
 * Move fromListItem sublist list items to the end of `toListItem` sublist. If
 * there is no `toListItem` sublist, insert one.
 */
export const moveListItemSublistItemsToListItemSublist = (
  editor: SlateEditor,
  {
    fromListItem,
    start,
    toListItem,
  }: MoveListItemSublistItemsToListItemSublistOptions
) => {
  const [, fromListItemPath] = fromListItem;
  const [, toListItemPath] = toListItem;
  let moved = 0;

  editor.tf.withoutNormalizing(() => {
    const fromListItemSublist = editor.api.descendant<TElement>({
      at: fromListItemPath,
      match: {
        type: getListTypes(editor),
      },
    });

    if (!fromListItemSublist) return;

    const [, fromListItemSublistPath] = fromListItemSublist;

    const toListItemSublist = editor.api.descendant<TElement>({
      at: toListItemPath,
      match: {
        type: getListTypes(editor),
      },
    });

    let to: Path;

    if (!toListItemSublist) {
      const fromList = editor.api.parent(fromListItemPath);

      if (!fromList) return;

      const [fromListNode] = fromList;

      const fromListType = fromListNode.type;

      const toListItemSublistPath = toListItemPath.concat([1]);

      insertElements(
        editor,
        { children: [], type: fromListType as string },
        { at: toListItemSublistPath }
      );

      to = toListItemSublistPath.concat([0]);
    } else if (start) {
      const [, toListItemSublistPath] = toListItemSublist;
      to = toListItemSublistPath.concat([0]);
    } else {
      to = Path.next(getLastChildPath(toListItemSublist));
    }

    moved = moveChildren(editor, {
      at: fromListItemSublistPath,
      to,
    });

    // Remove the empty list
    editor.tf.delete({ at: fromListItemSublistPath });
  });

  return moved;
};
