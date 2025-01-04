import { type Point, Path } from 'slate';

import type { TEditor } from '../../interfaces/index';

/**
 * If the start point is inside an inline void, get the point before or after
 * it.
 */
export const getPointNextToVoid = (
  editor: TEditor,
  {
    after,
    at,
  }: {
    at: Point;
    /** Get the point after (instead of before) the void node. */
    after?: boolean;
  }
) => {
  const startVoid = editor.api.void({ at, mode: 'highest' });

  if (startVoid) {
    const blockAbove = editor.api.block({ at });

    if (blockAbove) {
      const nextPoint = after ? editor.api.after(at) : editor.api.before(at);

      if (
        nextPoint &&
        blockAbove &&
        Path.isAncestor(blockAbove[1], nextPoint.path)
      ) {
        at = nextPoint;
      }
    }
  }

  return at;
};
