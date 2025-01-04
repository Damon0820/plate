import type { KeyboardHandler } from '@udecode/plate-common/react';

import { isHotkey, queryNode } from '@udecode/plate-common';

import type { SoftBreakConfig } from '../../lib';

export const onKeyDownSoftBreak: KeyboardHandler<SoftBreakConfig> = ({
  editor,
  event,
  getOptions,
}) => {
  const { rules = [] } = getOptions();

  if (event.defaultPrevented) return;

  const entry = editor.api.block();

  if (!entry) return;

  rules.forEach(({ hotkey, query }) => {
    if (isHotkey(hotkey, event as any) && queryNode(entry, query)) {
      event.preventDefault();
      event.stopPropagation();

      editor.insertText('\n');
    }
  });
};
