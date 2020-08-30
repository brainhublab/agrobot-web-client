// tslint:disable: space-before-function-paren only-arrow-functions

import { LGraphNode, IWidget, Vector2 } from 'litegraph.js';

const scaleNumber = (
  unscaledNum: number,
  minAllowed: number,
  maxAllowed: number,
  min: number,
  max: number) => {
  return (maxAllowed - minAllowed) * (unscaledNum - min) / (max - min) + minAllowed;
};

const WIDGET_HEIGHT = 150;
const OUTER_MOUSE_GAP = 50;
const COLORS = {
  black: '#000',
  grey: '#555',
  primary: '#782'
};

interface IEditableDataPlotWidget
  extends IWidget<number[], { max: number; min: number }> {
}

export class EditableDataPlotWidget implements IEditableDataPlotWidget {
  private valuesPositions: Array<[number, number]> = [];
  private height: number = WIDGET_HEIGHT;
  private posY = 0;

  constructor(
    public name: string,
    public options = { max: 1, min: 0 },
    public value = [0, .1, .2, .3, .4, .5, .6, .7, .8, .9, 1, .11, .12],
  ) {
  }

  callback() {
    // TODO
    alert('cb');
  }

  /**
   * Called by Lgraph before drawing
   * @param width widget width
   */
  computeSize(width: number): [number, number] {
    return [width, this.height];
  }

  /**
   * Called by `LGraphCanvas.drawNodeWidgets`
   * w.draw(ctx, node, widget_width, y, H);
   */
  draw(
    ctx: CanvasRenderingContext2D,
    node: LGraphNode,
    width: number,
    posY: number,
    _: number
  ): void {
    // save our position
    this.posY = posY;
    this.drawPlot(ctx, node, width, this.posY, this.height);
  }

  /**
   * Draw background
   * @param ctx context
   * @param node current node
   * @param width widget width
   * @param posY widget position relative to node
   * @param height widget height
   */
  private drawPlot(
    ctx: CanvasRenderingContext2D,
    node: LGraphNode,
    width: number,
    posY: number,
    height: number) {
    // save old state
    const oldCanvasState = {
      fillStyle: ctx.fillStyle,
      strokeStyle: ctx.strokeStyle,
      lineWidth: ctx.lineWidth,
    };

    const scale = 1 * height;
    const offset = 1 * height;

    // back rect
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(0, posY, width, height);

    // text
    ctx.fillStyle = COLORS.grey;
    ctx.fillText(this.name, 10, posY + 20);

    // Line
    ctx.strokeStyle = COLORS.grey;
    ctx.lineWidth = 3;
    ctx.beginPath();
    this.value.forEach((val, idx) => {
      // calculate value position inside widget view
      const normalizedV = scaleNumber(val, 0, 1, this.options.min, this.options.max);
      const k = normalizedV * scale * -1 + offset;
      this.valuesPositions[idx] = [(width / this.value.length) * (idx + .5), posY + Math.clamp(k, 0, height)];
      const [x, y] = this.valuesPositions[idx];

      // add line pointer
      ctx.lineTo(x, y);
      // add text label
      ctx.fillText(val.toPrecision(3), x - .6, y - 3, (width / this.value.length) * .5);

    });
    // stroke the line
    ctx.stroke();

    // Points
    ctx.fillStyle = COLORS.primary;
    this.valuesPositions.forEach((vpos, idx) => {
      ctx.fillRect(vpos[0] - 1, vpos[1] - 1, ctx.lineWidth, ctx.lineWidth);
    });

    // restore styles
    Object.keys(oldCanvasState).forEach(key => ctx[key] = oldCanvasState[key]);
  }

  /**
   * Called by `LGraphCanvas.processNodeWidgets`
   * https://github.com/jagenjo/litegraph.js/issues/76
   */
  mouse(
    event: MouseEvent,
    pos: Vector2,
    node: LGraphNode
  ): boolean {
    if (pos[1] > this.posY - OUTER_MOUSE_GAP && pos[1] < this.posY + this.height + OUTER_MOUSE_GAP) {
      // convert to relative Y pos
      pos = [pos[0], pos[1] - this.posY];

      const nearestPointIdx = this.findNearestPointIdx(pos);
      // change value
      const normalizedValue = Math.clamp(1 - (Math.abs(pos[1]) / this.height), 0, 1);

      this.value[nearestPointIdx] = scaleNumber(normalizedValue, this.options.min, this.options.max, 0, 1);
      return false;
    }
    return true;
  }

  /**
   * Finds the index of the nearest to the mouse position point from `valuePositions`
   * TODO: Maybe we should sort the collection
   * @param relativePosition mouse position relative to the widget view
   */
  private findNearestPointIdx(relativePosition: Vector2): number {
    let nearestPointIdx: number;
    let minDiff = Infinity;
    for (let idx = 0; idx < this.valuesPositions.length; idx++) {
      // O(n)
      const hDiff = Math.abs(this.valuesPositions[idx][0] - relativePosition[0]);
      if (hDiff < minDiff) {
        nearestPointIdx = idx;
        minDiff = hDiff;
      }
    }

    return nearestPointIdx;
  }

}
