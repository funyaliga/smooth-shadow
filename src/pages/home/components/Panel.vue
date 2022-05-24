<template>
  <div class="panel">
    <div v-for="config in configs" :key="config.key" class="floor">
      <Range
        v-if="config.type === 'range' && !!config.key"
        v-bind="config"
        :value="(config.value as number)"
        @change="(value) => updateValue(config.key || null, value)"
      />
      <Bezier
        v-if="config.type === 'bezier' && !!config.key"
        :width="420"
        :height="100"
        :value="(config.value as [number, number, number, number])"
        @change="(value) => updateValue(config.key || null, value)"
      >
        <template v-if="config.key === 'alphaBezier'">
          <div
            v-for="(alpha, index) in alphaEased"
            :key="index"
            :style="{ flexGrow: 1, backgroundColor: `rgba(0, 0, 0, ${alpha})` }"
          />
        </template>
        <template v-if="config.key === 'offsetBezier'">
          <div
            v-for="(value, index) in offsetEased"
            :key="index"
            :style="{
              flexGrow: value,
              marginLeft: index !== 0 ? '2px' : 0,
            }"
          >
            <div
              :style="{
                height: '100%',
                borderRadius: '5px',
                backgroundColor: '#d2dce9',
              }"
            />
          </div>
        </template>
        <template v-if="config.key === 'blurBezier'">
          <div
            v-for="(value, index) in blurEased"
            :key="index"
            :style="{
              flexGrow: 1,
              marginLeft: index !== 0 ? '1px' : 0,
              display: 'flex',
              alignItems: 'center',
            }"
          >
            <div
              :style="{
                width: '100%',
                height: `${value * 100}%`,
                borderRadius: '5px',
                backgroundColor: '#d2dce9',
              }"
            />
          </div>
        </template>
      </Bezier>
      <Checkbox
        v-if="config.type === 'checkbox' && !!config.key"
        :value="(config.value as boolean)"
        :label="config.label"
        @change="(value) => updateValue(config.key || null, value)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import Range from './Range.vue';
import Bezier from './Bezier.vue';
import Checkbox from './Checkbox.vue';
import { useModel } from '../model';
import type { configKeys } from '../model';

const { keys } = defineProps<{
  keys: configKeys[];
}>();

const model = useModel();
const { alphaEased, offsetEased, blurEased } = storeToRefs(model);
const { configByKeys } = model;
const { updateValue } = model;
const configs = configByKeys(keys);
</script>

<style lang="less">
.panel {
  background-color: rgba(207, 217, 228, 0.5);
  // backdrop-filter: blur(5px);
  padding: 15px 20px;
  border-radius: 3px;
  & + .panel {
    margin-top: 10px;
  }
}
.floor + .floor {
  margin-top: 20px;
}
</style>
