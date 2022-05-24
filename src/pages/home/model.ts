import { ref, reactive, watchEffect } from 'vue';
import { defineStore } from 'pinia';
import { config } from 'process';
import BezierEasing from 'bezier-easing';

export type configKeys =
  | 'shadowLayers'
  | 'alpha'
  | 'xOffset'
  | 'yOffset'
  | 'blur'
  | 'spread'
  | 'invertAlpha'
  | 'alphaBezier'
  | 'offsetBezier'
  | 'blurBezier';
export interface IConfig<T> {
  key?: configKeys;
  type: string;
  value: T;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  unit?: string;
}

export interface IBoxShadow {
  leftOffset: number;
  topOffset: number;
  blur: number;
  spread: number;
  alpha: number;
}

type config = {
  shadowLayers: IConfig<number>;
  alpha: IConfig<number>;
  xOffset: IConfig<number>;
  yOffset: IConfig<number>;
  blur: IConfig<number>;
  spread: IConfig<number>;
  invertAlpha: IConfig<boolean>;
  alphaBezier: IConfig<[number, number, number, number]>;
  offsetBezier: IConfig<[number, number, number, number]>;
  blurBezier: IConfig<[number, number, number, number]>;
};

export const useModel = defineStore('home', () => {
  const configs = reactive<config>({
    shadowLayers: {
      value: 6,
      min: 1,
      max: 10,
      step: 1,
      label: '阴影层数',
      type: 'range',
    },
    alpha: {
      value: 0.07,
      min: 0,
      max: 1,
      step: 0.01,
      label: '透明度',
      type: 'range',
    },
    xOffset: {
      value: 100,
      min: 0,
      max: 500,
      step: 1,
      label: '水平距离',
      unit: 'px',
      type: 'range',
    },
    yOffset: {
      value: 100,
      min: 0,
      max: 500,
      step: 1,
      label: '垂直距离',
      unit: 'px',
      type: 'range',
    },
    blur: {
      value: 80,
      min: 0,
      max: 500,
      step: 1,
      label: '模糊度',
      unit: 'px',
      type: 'range',
    },
    spread: {
      value: 0,
      min: -100,
      max: 0,
      step: 1,
      label: '减少传播',
      unit: 'px',
      type: 'range',
    },
    alphaBezier: { value: [0.1, 0.5, 0.9, 0.5], type: 'bezier' },
    offsetBezier: { value: [0.7, 0.1, 0.9, 0.3], type: 'bezier' },
    blurBezier: { value: [0.7, 0.1, 0.9, 0.3], type: 'bezier' },
    invertAlpha: { value: false, label: '反转透明度', type: 'checkbox' },
  });

  const alphaEased = ref<number[]>([]);
  const offsetEased = ref<number[]>([]);
  const blurEased = ref<number[]>([]);
  const boxShadowList = ref<IBoxShadow[]>([]);

  watchEffect(() => {
    const alphaBezier = BezierEasing(...configs.alphaBezier.value);
    const offsetBezier = BezierEasing(...configs.offsetBezier.value);
    const blurBezier = BezierEasing(...configs.blurBezier.value);

    const shadowLayers = configs.shadowLayers.value as number;

    const result = [...new Array(shadowLayers)].reduce(
      (data, _, i) => {
        const fraction = (i + 1) / shadowLayers;
        if (!!configs.invertAlpha.value) {
          data.alphaEased.unshift(alphaBezier(fraction));
        } else {
          data.alphaEased.push(alphaBezier(fraction));
        }
        data.offsetEased.push(offsetBezier(fraction));
        data.blurEased.push(blurBezier(fraction));
        data.boxShadowList.push({
          leftOffset: data.offsetEased[i] * configs.xOffset.value,
          topOffset: data.offsetEased[i] * configs.yOffset.value,
          blur: data.blurEased[i] * configs.blur.value,
          spread: configs.spread.value,
          alpha: data.alphaEased[i] * configs.alpha.value,
        });
        return data;
      },
      {
        alphaEased: [],
        offsetEased: [],
        blurEased: [],
        boxShadowList: [],
      },
    );

    alphaEased.value = result.alphaEased;
    offsetEased.value = result.offsetEased;
    blurEased.value = result.blurEased;
    boxShadowList.value = result.boxShadowList;
  });

  const configByKeys = (keys: configKeys[]) => {
    if (keys && keys.length) {
      return keys.map((key) => {
        configs[key].key = key;
        return configs[key];
      });
    }
    return [];
  };

  const updateValue = (
    key: configKeys | null,
    value: number | boolean | [number, number, number, number],
  ) => {
    if (key) {
      configs[key].value = value;
    }
  };

  return {
    configs,
    alphaEased,
    offsetEased,
    blurEased,
    boxShadowList,
    configByKeys,
    updateValue,
  };
});
