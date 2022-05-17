<template>
  <!-- Bind it to a component -->
  <div class="wrap">
    <div ref="demo" class="box" :style="style" />
  </div>
</template>

<script lang="ts" setup>
import { useDrag } from '@vueuse/gesture';
import { ref, reactive, computed, watchEffect } from 'vue';
import { defineComponent } from 'vue';

const demo = ref();
const position = reactive({ x: 0, y: 0 });

// Find more about `set()` on the "Motion Integration" page

const dragHandler = ({ movement: [x, y], dragging }) => {
  console.log(x, y, dragging);

  if (!dragging) {
    position.x = 0;
    position.y = 0;
    return;
  }

  position.x = x;
  position.y = y;
};

const style = computed(() => ({
  transform: `translate3d(${position.x}px,${position.y}px,0)`,
  touchAction: 'none',
}));

// Composable usage
useDrag(dragHandler, {
  domTarget: demo,
});
</script>

<style lang="scss" scoped>
.wrap {
  position: relative;
  width: 100vw;
  height: 100vh;
}
.box {
  touch-action: none;
  cursor: grab;
  width: 20px;
  height: 20px;
  background: blue;
}
</style>
