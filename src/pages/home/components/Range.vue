<template>
  <div>
    <label>
      {{ label }}
    </label>
    <input
      type="range"
      :min="min"
      :max="max"
      :step="step"
      :value="value"
      :style="cssVars"
      @input="onChange"
    />
    {{ value }}
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { StyleValue } from 'vue';

const props = defineProps({
  label: {
    type: String,
    default: '',
  },
  value: {
    type: Number,
    default: 0,
  },
  min: {
    type: Number,
    default: 0,
  },
  max: {
    type: Number,
    default: 100,
  },
  step: {
    type: Number,
    default: 1,
  },
});

const cssVars = computed(() => {
  return {
    '--percent': `${((props.value - props.min) * 100) / (props.max - props.min)}%`,
  } as StyleValue;
});

const emit = defineEmits(['change']);

const onChange = (event: Event) => {
  emit('change', Number((event.target as HTMLInputElement).value));
};
</script>

<style lang="scss" scoped>
input[type='range'] {
  -webkit-appearance: none;
  width: 100%;
  height: 6px;
  margin: 7px 0;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 6px;
  background-image: linear-gradient(#318cfc, #318cfc);
  background-size: var(--percent) 100%;
  background-repeat: no-repeat;
  outline: 0;
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: #fff;
    cursor: ew-resize;
    box-shadow: rgb(0 0 0 / 30%) 0px 2px 6px;
    transition: background 0.3s ease-in-out;
  }

  &::-webkit-slider-thumb:hover {
    background: #f1f1f1;
  }
  &::-webkit-slider-runnable-track {
    -webkit-appearance: none;
    box-shadow: none;
    border: none;
    background: transparent;
  }
}
</style>
