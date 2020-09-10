import { LGraph, LGraphCanvas, LiteGraph } from 'litegraph.js';
import { Input, HostListener, AfterViewInit } from '@angular/core';

/**
 * Components with Litegraph.js canvas
 */
export abstract class LiteGraphCanvasComponent implements AfterViewInit {
  /**
   * Is Canvas dirty
   */
  public dirty = false;
  /**
   * Litegraph graph live mode
   */
  public started = false;
  /**
   * LG graph instance
   */
  protected graph: LGraph;
  /**
   * LG canvas instance
   */
  protected canvas: LGraphCanvas;

  /**
   * Canvas html element ID
   */
  protected abstract canvasElementID: string;

  /**
   * The canvas size multiplier relative to viewsize
   */
  protected canvasSizeMultiplier = 2;

  /**
   * Compoentn and canvas size
   */
  viewHeight = window.innerHeight - 48;
  @Input() width = 1024;
  @Input() height = 720;

  /**
   * update canvas size on window resize
   * @param event resize event
   */
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.recalculateCanvasSize();
    if (this.canvas) {
      this.canvas.adjustNodesSize();
    }
  }

  /**
   * Update dimensions
   */
  protected recalculateCanvasSize() {
    this.width = this.canvasSizeMultiplier * (window.innerWidth - 0);
    this.height = this.canvasSizeMultiplier * (window.innerHeight - 48);
    this.viewHeight = window.innerHeight - 48;
  }

  /**
   * initialize canvas
   */
  ngAfterViewInit() {
    setTimeout(() => {
      this.initializeCanvas();
      this.afterGraphInitialized();
    }, 10);
  }

  /**
   * Start / stop litegraph execution
   */
  public toggleLiteGraphLiveMode() {
    if (this.started) {
      this.graph.stop();
    } else {
      this.graph.start(1000);
    }

    // toggle flag
    this.started = !this.started;
    this.setReadOnly(this.started);
  }


  /**
   * Called after graph initialized
   */
  protected abstract afterGraphInitialized(): void;

  /**
   * Init Lgraph and canvas
   */
  private initializeCanvas() {
    this.recalculateCanvasSize();
    this.graph = new LGraph();

    this.canvas = new LGraphCanvas('#' + this.canvasElementID, this.graph);
    this.canvas.canvas.addEventListener('mousedown', () => {
      // handle changes
      this.onCanvasMouseDownSideEffect();
    });
  }

  /**
   * called after mousedown event on the canvas
   */
  protected onCanvasMouseDownSideEffect() {
    this.dirty = true;
  }

  /**
   * Set's canvas read-only mode
   * @param value is readonly
   */
  protected setReadOnly(value: boolean) {
    (this.canvas as any).read_only = value;
  }

}
