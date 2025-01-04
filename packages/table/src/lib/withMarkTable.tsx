import { type ExtendEditor, TextApi } from '@udecode/plate-common';

import type { TableConfig } from '.';

import { getTableGridAbove } from './queries';

export const withMarkTable: ExtendEditor<TableConfig> = ({ editor }) => {
  const { addMark, removeMark } = editor;
  const { marks } = editor.api;

  editor.addMark = (key, value) => {
    const { selection } = editor;

    if (!selection || editor.api.isCollapsed()) return addMark(key, value);

    const matchesCell = getTableGridAbove(editor, { format: 'cell' });

    if (matchesCell.length <= 1) return addMark(key, value);

    matchesCell.forEach(([_cell, cellPath]) => {
      editor.tf.setNodes(
        {
          [key]: value,
        },
        {
          at: cellPath,
          match: (n) => TextApi.isText(n),
          split: true,
          voids: true,
        }
      );
    });
  };

  editor.removeMark = (key) => {
    const { selection } = editor;

    if (!selection || editor.api.isCollapsed()) return removeMark(key);

    const matchesCell = getTableGridAbove(editor, { format: 'cell' });

    if (matchesCell.length === 0) return removeMark(key);

    matchesCell.forEach(([_cell, cellPath]) => {
      editor.tf.unsetNodes(key, {
        at: cellPath,
        match: (n) => TextApi.isText(n),
        split: true,
        voids: true,
      });
    });
  };

  editor.api.marks = () => {
    const { selection } = editor;

    if (!selection || editor.api.isCollapsed()) return marks();

    const matchesCell = getTableGridAbove(editor, { format: 'cell' });

    if (matchesCell.length === 0) return marks();

    const totalMarks: Record<string, any> = {};

    matchesCell.forEach(([_cell, cellPath]) => {
      const textNodeEntry = editor.api.nodes({
        at: cellPath,
        match: (n) => TextApi.isText(n),
      });

      Array.from(textNodeEntry, (item) => item[0]).forEach((item) => {
        const keys = Object.keys(item);

        if (keys.length === 1) return;

        keys.splice(keys.indexOf('text'), 1);

        keys.forEach((k) => {
          totalMarks[k] = item[k];
        });
      });
    });

    return totalMarks;
  };

  return editor;
};
