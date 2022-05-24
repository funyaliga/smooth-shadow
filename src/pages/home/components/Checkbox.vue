<template>
  <label>
    <input type="checkbox" :value="value" @onChange="onChange" />
    <span>{{ label }}</span>
  </label>
</template>

<script setup lang="ts">
defineProps({
  label: {
    type: String,
    default: '',
  },
  value: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['change']);

const onChange = (event: Event) => {
  emit('change', Number((event.target as HTMLInputElement).value));
};
</script>

<style lang="scss" scoped>
input {
  margin-right: 8px;
}
</style>
