import type { GetAboveNodeOptions, SlateEditor } from '@udecode/plate-common';

import type { TTableElement } from '../types';

import { BaseTablePlugin } from '../BaseTablePlugin';
import { getTableColumnCount } from '../queries/getTableColumnCount';

export const setTableColSize = (
  editor: SlateEditor,
  { colIndex, width }: { colIndex: number; width: number },
  options: GetAboveNodeOptions = {}
) => {
  const table = editor.api.find<TTableElement>({
    match: { type: BaseTablePlugin.key },
    ...options,
  });

  if (!table) return;

  const [tableNode, tablePath] = table;

  const colSizes = tableNode.colSizes
    ? [...tableNode.colSizes]
    : Array.from({ length: getTableColumnCount(tableNode) }).fill(0);

  colSizes[colIndex] = width;

  editor.tf.setNodes<TTableElement>({ colSizes }, { at: tablePath });
};
