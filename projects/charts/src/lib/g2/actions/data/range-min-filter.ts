import { Point, Scale } from '@antv/g2/lib/dependents';
import { FilterCondition } from '@antv/g2/lib/interface';

import { View } from '@antv/g2/lib/chart';
import Action from '@antv/g2/lib/interaction/action/base';
import { isMask } from '@antv/g2/lib/interaction/action/util';


function getFilter(scale: Scale, dim: string, point1: Point, point2: Point): FilterCondition {
  let min = Math.min(point1[dim], point2[dim]);
  let max = Math.max(point1[dim], point2[dim]);
  const [rangeMin, rangeMax] = scale.range;

  if (min < rangeMin) {
    min = rangeMin;
  }
  if (max > rangeMax) {
    max = rangeMax;
  }

  if (min === rangeMax && max === rangeMax) {
    return null;
  }
  const minValue = scale.invert(min);
  const maxValue = scale.invert(max);
  if (scale.isCategory) {
    const minIndex = scale.values.indexOf(minValue);
    const maxIndex = scale.values.indexOf(maxValue);
    const arr = scale.values.slice(minIndex, maxIndex + 1);
    return (value) => {
      return arr.includes(value);
    };
  } else {
    return (value) => {
      return value >= minValue && value <= maxValue;
    };
  }
}

/**
 * Range Min Filter Action
 * @ignore
 */
class RangeMinFilter extends Action {
  /** allow dims configuration */
  protected cfgFields: ['dims'];
  /**
   * The field/dimension for which the scope filter takes effect, which can be x, y
   */
  protected dims: string[] = ['x', 'y'];
  /** Starting point */
  protected startPoint: Point = null;

  private isStarted: boolean = false;

  /**
   * Minimal distance for taking filter action
   * % of the view width
   */
  private readonly minDistanceRatio: number = .05;
  // x,y ?
  private hasDim(dim: string) {
    return this.dims.includes(dim);
  }

  /**
   * Start range filter, record the starting point of range filter
   */
  public start() {
    const context = this.context;
    this.isStarted = true;
    this.startPoint = context.getCurrentPoint();
  }

  /**
   * Filter, filter the data with the starting point and the current point
   */
  public filter() {
    let startPoint;
    let currentPoint;
    if (isMask(this.context)) {
      const maskShape = this.context.event.target;
      const bbox = maskShape.getCanvasBBox();
      startPoint = { x: bbox.x, y: bbox.y };
      currentPoint = { x: bbox.maxX, y: bbox.maxY };
    } else {
      if (!this.isStarted) {
        // If there is no start, no filtering is performed
        return;
      }
      startPoint = this.startPoint;
      currentPoint = this.context.getCurrentPoint();
    }

    const minDistance = this.context.view.viewBBox.width * this.minDistanceRatio;
    if (Math.abs(startPoint.x - currentPoint.x) < minDistance || Math.abs(startPoint.x - currentPoint.y) < minDistance) {
      // The distance is too small and does not take effect
      return;
    }
    const view = this.context.view;
    const coord = view.getCoordinate();
    const normalCurrent = coord.invert(currentPoint);
    const normalStart = coord.invert(startPoint);
    // x filter
    if (this.hasDim('x')) {
      const xScale = view.getXScale();
      const filter = getFilter(xScale, 'x', normalCurrent, normalStart);
      this.filterView(view, xScale.field, filter);
    }
    // y filter
    if (this.hasDim('y')) {
      const yScale = view.getYScales()[0];
      const filter = getFilter(yScale, 'y', normalCurrent, normalStart);
      this.filterView(view, yScale.field, filter);
    }
    this.reRender(view);
  }

  /**
   * End filter
   */
  public end() {
    this.isStarted = false;
  }

  /**
   * Cancel the filtering related to the current Action, if specified x,y
   */
  public reset() {
    const view = this.context.view;
    this.isStarted = false;
    if (this.hasDim('x')) {
      const xScale = view.getXScale();
      // reset
      this.filterView(view, xScale.field, null);
    }
    if (this.hasDim('y')) {
      // y-axis filter only takes the first yScale
      const yScale = view.getYScales()[0];
      // reset
      this.filterView(view, yScale.field, null);
    }
    this.reRender(view);
  }

  /**
   * Filter the view
   */
  protected filterView(view: View, field: string, filter: FilterCondition) {
    view.filter(field, filter);
  }

  /**
   * Re-render the view
   * @param view
   */
  protected reRender(view: View) {
    view.render(true);
  }
}

export default RangeMinFilter;
