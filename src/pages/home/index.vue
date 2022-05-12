<template>
  <div class="wrap" :style="{ backgroundColor }">
    <div>home</div>
    <Sidebar>
      <Panel>
        <Range label="test" />
      </Panel>
      <Panel>2</Panel>
    </Sidebar>
  </div>
</template>

<script setup lang="ts">
import { ref, h } from 'vue';
import Range from './components/Range.vue';
const Sidebar = h('div', { class: 'sidebar' });
const Panel = h('div', { class: 'panel' });

let backgroundColor = ref('rgb(237, 242, 247)');
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
  background-color: rgb(223, 230, 238);
  padding: 15px 20px;
  border-radius: 3px;
  & + .panel {
    margin-top: 10px;
  }
}
</style>
