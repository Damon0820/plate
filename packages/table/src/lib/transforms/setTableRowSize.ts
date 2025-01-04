import type { GetAboveNodeOptions, SlateEditor } from '@udecode/plate-common';

import type { TTableElement, TTableRowElement } from '../types';

import { BaseTablePlugin } from '../BaseTablePlugin';

export const setTableRowSize = (
  editor: SlateEditor,
  { height, rowIndex }: { height: number; rowIndex: number },
  options: GetAboveNodeOptions = {}
) => {
  const table = editor.api.find<TTableElement>({
    match: { type: BaseTablePlugin.key },
    ...options,
  });

  if (!table) return;

  const [, tablePath] = table;
  const tableRowPath = [...tablePath, rowIndex];

  editor.tf.setNodes<TTableRowElement>({ size: height }, { at: tableRowPath });
};
