import type { TElement } from '@udecode/plate-common';
import type { PlateEditor } from '@udecode/plate-common/react';
import type { DropTargetMonitor } from 'react-dnd';

import { Path } from 'slate';

import type { UseDropNodeOptions } from '../hooks';
import type { ElementDragItemNode } from '../types';

import { getHoverDirection } from '../utils';

/** Callback called on drag and drop a node with id. */
export const getDropPath = (
  editor: PlateEditor,
  {
    id,
    canDropNode,
    dragItem,
    monitor,
    nodeRef,
    orientation = 'vertical',
  }: {
    dragItem: ElementDragItemNode;
    monitor: DropTargetMonitor;
  } & Pick<UseDropNodeOptions, 'canDropNode' | 'id' | 'nodeRef' | 'orientation'>
) => {
  const direction = getHoverDirection({
    id,
    dragItem,
    monitor,
    nodeRef,
    orientation,
  });

  if (!direction) return;

  const dragEntry = editor.api.find<TElement>({
    at: [],
    match: { id: dragItem.id },
  });

  if (!dragEntry) return;

  const dropEntry = editor.api.find<TElement>({ at: [], match: { id } });

  if (!dropEntry) return;
  if (canDropNode && !canDropNode({ dragEntry, dragItem, dropEntry, editor })) {
    return;
  }

  const [, dragPath] = dragEntry;
  const [, hoveredPath] = dropEntry;

  editor.tf.focus();

  let dropPath: Path | undefined;

  // Treat 'right' like 'bottom' (after hovered)
  // Treat 'left' like 'top' (before hovered)
  if (direction === 'bottom' || direction === 'right') {
    // Insert after hovered node
    dropPath = hoveredPath;

    // If the dragged node is already right after hovered node, no change
    if (Path.equals(dragPath, Path.next(dropPath))) return;
  }
  if (direction === 'top' || direction === 'left') {
    // Insert before hovered node
    dropPath = [...hoveredPath.slice(0, -1), hoveredPath.at(-1)! - 1];

    // If the dragged node is already right before hovered node, no change
    if (Path.equals(dragPath, dropPath)) return;
  }

  const _dropPath = dropPath as Path;
  const before =
    Path.isBefore(dragPath, _dropPath) && Path.isSibling(dragPath, _dropPath);
  const to = before ? _dropPath : Path.next(_dropPath);

  return { direction, dragPath, to };
};

export const onDropNode = (
  editor: PlateEditor,
  {
    id,
    canDropNode,
    dragItem,
    monitor,
    nodeRef,
    orientation = 'vertical',
  }: {
    dragItem: ElementDragItemNode;
    monitor: DropTargetMonitor;
  } & Pick<UseDropNodeOptions, 'canDropNode' | 'id' | 'nodeRef' | 'orientation'>
) => {
  const result = getDropPath(editor, {
    id,
    canDropNode,
    dragItem,
    monitor,
    nodeRef,
    orientation,
  });

  if (!result) return;

  const { dragPath, to } = result;

  editor.tf.moveNodes({
    at: dragPath,
    to,
  });
};
