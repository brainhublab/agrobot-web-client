import { Chart, View } from '@antv/g2';


export interface IDrawConfig {
  color: string;
  valueFormatter: (v: number) => string;
}

const defaultDrawConfig: IDrawConfig = {
  color: '#d0db34',
  valueFormatter: (v: number) => v.toPrecision(2)
}

export const drawUniformLine = (
  chart: Chart | View,
  value: number,
  config?: Partial<IDrawConfig>
) => {
  chart.annotation().line({
    start: ['min', value],
    end: ['max', value],
    style: {
      stroke: config && config.color || defaultDrawConfig.color,
      lineWidth: 2,
      lineDash: [3, 3]
    },
    text: {
      position: 'end',
      style: {
        fill: '#777',
        fontSize: 11,
        fontWeight: 'normal'
      },
      content: config && config.valueFormatter ? config.valueFormatter(value) : defaultDrawConfig.valueFormatter(value),
      offsetY: -5,
      offsetX: -50
    }
  });
};
