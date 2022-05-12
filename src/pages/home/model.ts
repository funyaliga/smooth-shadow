import { defineStore } from 'pinia';

export interface RangeConfig {
  value?: number;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
}

export interface IConfig {
  shadowLayers: RangeConfig;
}

export const useModel = defineStore({
  id: 'home', // id必填，且需要唯一
  state: () => {
    return {
      config: {
        shadowLayers: {
          value: 6,
          min: 1,
          max: 10,
          step: 1,
          label: '层数',
        },
      } as IConfig,
    };
  },
  actions: {
    updateValue(key: keyof IConfig, value: number) {
      this.config[key].value = value;
    },
  },
});
