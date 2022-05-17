<template>
  <div class="wrap" :style="{ backgroundColor }">
    <div>home</div>
    <Sidebar ref="scrollContainerRef">
      <Panel>
        <Range label="test" :value="value" @change="rangeChange" />
      </Panel>
      <Panel>
        <Bezier
          v-bind="bezierEditorProps"
          :value="alphaEasingValue"
          :scroll-container-ref="scrollContainerRef"
          @change="onBezierChange"
        />
      </Panel>
    </Sidebar>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watchEffect, h } from 'vue';
import Range from './components/Range.vue';
import Bezier from './components/Bezier.vue';
const Sidebar = h('div', { class: 'sidebar' });
const Panel = h('div', { class: 'panel' });

const bezierEditorProps = {
  width: 420,
  height: 100,
};

const value = ref(70);
const scrollContainerRef = ref(null);

const alphaEasingValue = ref([0.1, 0.5, 0.9, 0.5]);

const rangeChange = (v: number) => {
  value.value = v;
};

const onBezierChange = (v: number[]) => {
  alphaEasingValue.value = v;
};

let backgroundColor = ref('rgb(237, 242, 247)');

// watchEffect(() => {
//   console.log('alphaEasingValue', alphaEasingValue.value);
// });
</script>

<style lang="less">
.wrap {
  width: 100vw;
  height: 100vh;
  color: rgb(49, 63, 78);
  display: grid;
  grid-template-columns: 1fr 500px;
}

.sidebar {
  padding: 20px;
  overflow-y: auto;
  user-select: none;
}

.panel {
  background-color: rgba(207, 217, 228, 0.5);
  backdrop-filter: blur(5px);
  padding: 15px 20px;
  border-radius: 3px;
  & + .panel {
    margin-top: 10px;
  }
}
</style>
