<template>
  <div>
    <label>
      {{ label }}
    </label>
    <input type="range" />
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps } from 'vue';

defineProps({
  label: {
    type: String,
    default: '',
  },
});
</script>

<style lang="scss" scoped>
input[type='range'] {
  &::-webkit-slider-runnable-track {
    background-color: #eee;
  }
  &::-webkit-slider-runnable-track {
    background: linear-gradient(to right, #1ab1e2 0%, #1ab1e2 80%, #eee 80%, #eee);
  }
}
</style>
