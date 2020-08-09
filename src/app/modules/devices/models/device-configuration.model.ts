export enum MCUTypes {
  WATER_LEVEL = 'water_level',
  NUTRITION_CONTROL = 'nutrition_control',
  LIGHT_CONTROL = 'light_control',
}

export interface DeviceConfiguration {
  mcuType: MCUTypes;
  title: string;
  isConfigured: boolean;
}

export class WaterLevelConfig implements DeviceConfiguration {
  readonly mcuType = MCUTypes.WATER_LEVEL;
  readonly title = 'Water level';
  isConfigured = true;
  in = {
    valve: 100,
    levelPercents: 100,
    PID: {
      agKp: 0.0,
      agKi: 0.0,
      agKd: 0.0,
      consKp: 0.0,
      consKi: 0.0,
      consKd: 0.0

    }
  };
  out = {
    valve: 100,
    waterLevel: 100,
    waterFlowIn: 2000,
    waterFlowOut: 2000,
    PID: {
      agKp: 0.0,
      agKi: 0.0,
      agKd: 0.0,
      consKp: 0.0,
      consKi: 0.0,
      consKd: 0.0

    }
  };
}

export interface LightControlInputs {
  lightMode: number;
  targetLigstLevel: number;
  currentTime: string;
  lightIntensityMap: Array<number>;
}

export class LightControlConfig implements DeviceConfiguration {
  public readonly mcuType = MCUTypes.LIGHT_CONTROL;
  public readonly title = 'Light control';
  public isConfigured = true;
  public in: LightControlInputs = {
    lightMode: 100,
    targetLigstLevel: 100,
    currentTime: '12:30',
    lightIntensityMap: [
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 1, 2, 3,
      4, 5, 9, 13,
      14, 15, 15, 16,
      18, 20, 22, 24,
      28, 32, 36, 40,
      44, 46, 50, 56,
      62, 68, 74, 80,
      86, 92, 98, 100,
      100, 100, 100, 100,
      100, 100, 100, 100,
      100, 94, 88, 82,
      76, 70, 64, 58,
      52, 46, 40, 36,
      32, 28, 24, 20,
      18, 17, 16, 15,
      14, 13, 12, 11,
      10, 10, 5, 5,
      5, 4, 3, 2,
      1, 0, 0, 0,
      0, 0, 0, 0
    ]
  };
  public out = {
    lightMode: 100,
    currentLightLevel: 100,
    targetLightLevel: 100,
    currentTime: '12:30'
  };
}

export class NutritionControlConfig implements DeviceConfiguration {
  readonly mcuType = MCUTypes.NUTRITION_CONTROL;
  readonly title = 'Nutrition control';
  isConfigured = true;
  dispensers = [
    {
      in: {
        nutritionMode: 100,
        targetConcentration: 100,
      },
      out: {
        nutritionMode: 100,
        currentConcentration: 100,
        targetConcentration: 2000
      }
    },
    {
      in: {
        nutritionMode: 100,
        targetConcentration: 100,
      },
      out: {
        nutritionMode: 100,
        currentConcentration: 100,
        targetConcentration: 2000
      }
    },
    {
      in: {
        nutritionMode: 100,
        targetConcentration: 100,
      },
      out: {
        nutritionMode: 100,
        currentConcentration: 100,
        targetConcentration: 2000
      }
    },
  ];
}


export const defaultDeviceConfigurationTemplates = {
  [MCUTypes.WATER_LEVEL]: new WaterLevelConfig(),
  [MCUTypes.LIGHT_CONTROL]: new LightControlConfig(),
  [MCUTypes.NUTRITION_CONTROL]: new NutritionControlConfig(),
};
