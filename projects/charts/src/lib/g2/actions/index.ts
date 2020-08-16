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
        'sibling-x-filter:filter',
        'x-rect-mask:end',
        'x-rect-mask:hide',
        'reset-button:show',
        'tooltip:hide',
      ],
    },
    {
      // apply on mouseleave
      trigger: 'mouseleave',
      action: [
        `${CUSTOM_G2_ACTIONS.BRUSH_HORIZONTAL_RESET_BUTTON}:filter`,
        `${CUSTOM_G2_ACTIONS.BRUSH_HORIZONTAL_RESET_BUTTON}:end`,
        'sibling-x-filter:filter',
        'x-rect-mask:end',
        'x-rect-mask:hide',
        'reset-button:show',
        'tooltip:hide',
      ],
    },
  ],
  rollback: [
    {
      trigger: 'reset-button:click', action: [`${CUSTOM_G2_ACTIONS.BRUSH_HORIZONTAL_RESET_BUTTON}:reset`, 'reset-button:hide', 'cursor:crosshair', 'tooltip:hide', 'sibling-x-filter:reset']
    },
    { trigger: 'dblclick', action: [`${CUSTOM_G2_ACTIONS.BRUSH_HORIZONTAL_RESET_BUTTON}:reset`, 'reset-button:hide', 'cursor:crosshair', 'tooltip:hide', 'sibling-x-filter:reset'] }

  ],
});

registerInteraction('sibling-rect-filter', {
  showEnable: [
    { trigger: 'plot:mouseenter', action: 'cursor:crosshair' },
    { trigger: 'mask:mouseenter', action: 'cursor:move' },
    { trigger: 'plot:mouseleave', action: 'cursor:default' },
    { trigger: 'mask:mouseleave', action: 'cursor:crosshair' },
  ],
  start: [
    {
      trigger: 'plot:mousedown', isEnable(context) {
        return !context.isInShape('mask');
      }, action: ['x-rect-mask:start', 'x-rect-mask:show']
    },
    { trigger: 'mask:dragstart', action: 'x-rect-mask:moveStart' }
  ],
  processing: [
    { trigger: 'plot:mousemove', action: 'x-rect-mask:resize' },
    { trigger: 'mask:drag', action: 'x-rect-mask:move' },
    { trigger: 'mask:change', action: 'sibling-x-filter:filter' }
  ],
  end: [
    { trigger: 'plot:mouseup', action: 'x-rect-mask:end' },
    { trigger: 'mask:dragend', action: 'x-rect-mask:moveEnd' }
  ],
  rollback: [
    { trigger: 'dblclick', action: ['x-rect-mask:hide', 'sibling-x-filter:reset'] }
  ]
});
