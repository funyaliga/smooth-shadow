<template>
  <div
    :style="{
      width: width + frameWidth,
      height: height + frameWidth,
      position: 'relative',
      zIndex: 2,
    }"
  >
    <svg
      :width="widthWithPadding"
      :height="heightWithPadding"
      :style="{
        marginLeft: -paddingHorizontal,
        marginTop: -paddingVertical,
        pointerEvents: 'none',
      }"
    >
      <g
        :transform="`
          translate(${paddingHorizontal} ${paddingVertical})
        `"
      >
        <rect x="0" y="0" :width="width" :height="height" :fill="innerBackgroundColor" />
        <line
          :stroke="handleLineColor"
          :strokeWidth="handleLineWidth"
          strokeLinecap="round"
          :x1="bottomLeft[0]"
          :y1="bottomLeft[1]"
          :x2="handleA[0]"
          :y2="handleA[1]"
        />
        <line
          :stroke="handleLineColor"
          :strokeWidth="handleLineWidth"
          strokeLinecap="round"
          :x1="topRight[0]"
          :y1="topRight[1]"
          :x2="handleB[0]"
          :y2="handleB[1]"
        />
        <circle :cx="bottomLeft[0]" :cy="bottomLeft[1]" :r="curveLineWidth" :fill="curveColor" />
        <circle :cx="topRight[0]" :cy="topRight[1]" :r="curveLineWidth" :fill="curveColor" />
        <circle :cx="handleA[0]" :cy="handleA[1]" :r="handleSize / 2" :fill="handleColor" />
        <circle :cx="handleB[0]" :cy="handleB[1]" :r="handleSize / 2" :fill="handleColor" />
        <path
          :stroke="curveColor"
          :strokeWidth="curveLineWidth"
          strokeLinecap="round"
          fill="none"
          :d="`
            M${bottomLeft}
            C${handleA} ${handleB} ${topRight}
          `"
        />
        <circle
          ref="startRef"
          :style="{ pointerEvents: 'auto' }"
          :cx="handleA[0]"
          :cy="handleA[1]"
          :r="widthWithPadding * 0.04"
          fill="transparent"
        />
        <circle
          ref="endRef"
          :style="{ pointerEvents: 'auto' }"
          :cx="handleB[0]"
          :cy="handleB[1]"
          :r="widthWithPadding * 0.04"
          fill="transparent"
        />
      </g>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watchEffect } from 'vue';
import { useDrag } from '@vueuse/gesture';
import useMeasure from '@/hooks/use-measure';

const startRef = ref();
const endRef = ref();
const demo = ref();

const {
  width = 500,
  height = 500,
  paddingHorizontal = 10,
  paddingVertical = 100,
  innerBackgroundColor = '#fff',
  handleColor = '#f128a0',
  handleLineColor = '#f128a0',
  handleSize = 16,
  handleLineWidth = 2,
  curveColor = '#318cfc',
  curveLineWidth = 4,
  value = [0, 0, 0, 0],
  scrollContainerRef,
} = defineProps<{
  width?: number;
  height?: number;
  paddingHorizontal?: number;
  paddingVertical?: number;
  innerBackgroundColor?: string;
  handleColor?: string;
  handleLineColor?: string;
  handleSize?: number;
  handleLineWidth?: number;
  curveColor?: string;
  curveLineWidth?: number;
  value: number[];
  scrollContainerRef?: HTMLInputElement | null;
}>();

const [p0 = 0, p1 = 0, p2 = 0, p3 = 0] = value;
const [containerBoundsRef, bounds] = useMeasure({ scroll: true });
const bottomLeft = [0, height];
const topRight = [width, 0];
const handleA = computed(() => {
  return [width * value[0], height * (1 - value[1])];
});
const handleB = computed(() => [width * value[2], height * (1 - value[3])]);

const emit = defineEmits(['change']);
const holdXy = ref<[number, number] | null>(null);

const dragHandler =
  (type: string) =>
  ({ movement, first, last }: { movement: [number, number]; first: boolean; last: boolean }) => {
    if (first || !holdXy.value) {
      if (type === 'start') {
        holdXy.value = [value[0], value[1]];
      } else {
        holdXy.value = [value[2], value[3]];
      }
    }

    const x = Math.min(Math.max(movement[0] / width + holdXy.value[0], 0), 1);
    const maxY = (height + paddingVertical - handleSize) / height;
    const minY = (paddingVertical - handleSize) / height;
    const y = Math.min(Math.max(-movement[1] / height + holdXy.value[1], -minY), maxY);

    if (type === 'start') {
      emit('change', [x, y, value[2], value[3]]);
    } else if (type === 'end') {
      emit('change', [value[0], value[1], x, y]);
    }
    if (last) {
      holdXy.value = null;
    }
  };

useDrag(dragHandler('start'), {
  domTarget: startRef,
});

const widthWithPadding = width + paddingHorizontal * 2;
const heightWithPadding = height + paddingVertical * 2;
const frameWidth = 4;

useDrag(dragHandler('end'), {
  domTarget: endRef,
});
</script>

<style lang="scss" scoped>
.box {
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: #000;
}
</style>
