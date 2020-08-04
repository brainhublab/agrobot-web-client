import { registerInteraction, registerAction } from '@antv/g2';
import { IInteractionContext } from '@antv/g2/lib/interface';
import DataRangeFilter from '@antv/g2/lib/interaction/action/data/range-filter';

import { CUSTOM_G2_ACTIONS } from './config';

function isPointInView(context: IInteractionContext) {
  return context.isInPlot();
}

// brush horizonal with btn
registerAction(CUSTOM_G2_ACTIONS.BRUSH_HORIZONTAL_RESET_BUTTON, DataRangeFilter, { dims: ['x'] });

registerInteraction(CUSTOM_G2_ACTIONS.BRUSH_HORIZONTAL_RESET_BUTTON, {
  showEnable: [
    { trigger: 'plot:mouseenter', action: 'cursor:crosshair' },
    { trigger: 'plot:mouseleave', action: 'cursor:default' },
  ],
  start: [
    {
      trigger: 'mousedown',
      isEnable: isPointInView,
      action: [`${CUSTOM_G2_ACTIONS.BRUSH_HORIZONTAL_RESET_BUTTON}:start`, 'x-rect-mask:start', 'x-rect-mask:show'],
    },
  ],
  processing: [
    {
      trigger: 'mousemove',
      isEnable: isPointInView,
      action: ['x-rect-mask:resize'],
    },
  ],
  end: [
    {
      trigger: 'mouseup',
      isEnable: isPointInView,
      action: [
        `${CUSTOM_G2_ACTIONS.BRUSH_HORIZONTAL_RESET_BUTTON}:filter`,
        `${CUSTOM_G2_ACTIONS.BRUSH_HORIZONTAL_RESET_BUTTON}:end`,
        'x-rect-mask:end',
        'x-rect-mask:hide',
        'reset-button:show'
      ],
    },
    {
      // apply on mouseleave
      trigger: 'mouseleave',
      action: [
        `${CUSTOM_G2_ACTIONS.BRUSH_HORIZONTAL_RESET_BUTTON}:filter`,
        `${CUSTOM_G2_ACTIONS.BRUSH_HORIZONTAL_RESET_BUTTON}:end`,
        'x-rect-mask:end',
        'x-rect-mask:hide',
        'reset-button:show'
      ],
    },
  ],
  rollback: [
    { trigger: 'reset-button:click', action: [`${CUSTOM_G2_ACTIONS.BRUSH_HORIZONTAL_RESET_BUTTON}:reset`, 'reset-button:hide', 'cursor:crosshair'] },
    { trigger: 'dblclick', action: [`${CUSTOM_G2_ACTIONS.BRUSH_HORIZONTAL_RESET_BUTTON}:reset`, 'reset-button:hide', 'cursor:crosshair'] }

  ],
});
