<template>
  <div class="wrap" :style="{ backgroundColor }">
    <Container>
      <ColorTool>
        <label>
          <input v-model="backgroundColor" type="color" />
          背景
        </label>
        <label>
          <input v-model="boxColor" type="color" />
          盒子
        </label>
        <label>
          <input v-model="shadowColor" type="color" />
          阴影
        </label>
      </ColorTool>
      <div :style="boxStyle">
        <div class="inner" @click="handleSelect">
          <span>box-shadow:</span>
          <template
            v-for="({ leftOffset, topOffset, blur, spread, alpha }, index) in boxShadowList"
            :key="index.toString()"
          >
            <div :style="{ marginTop: '5px', marginBottom: '5px' }">
              <span class="val">{{ ' ' }} {{ fixed(leftOffset) }}</span>
              <span class="text">px{{ ' ' }}</span>
              <span class="val">{{ fixed(topOffset) }}</span>
              <span class="text">px{{ ' ' }}</span>
              <span class="val">{{ fixed(blur) }}</span>
              <span class="text">px{{ ' ' }}</span>
              <template v-if="spread !== 0">
                <span class="val">
                  {{ fixed(spread) }}
                </span>
                <span class="text">px{{ ' ' }}</span>
              </template>
              <span class="text">rgba(0, 0, 0,{{ ' ' }}</span>
              <span class="val">{{ fixed(alpha, 3) }}</span>
              <span class="text">)</span>
              <span v-if="index < boxShadowList.length - 1" class="text">,</span>
            </div>
          </template>
          <span>;</span>
        </div>
      </div>
    </Container>
    <Sidebar ref="scrollContainerRef">
      <Panel :keys="['shadowLayers']" />
      <Panel :keys="['alpha', 'alphaBezier', 'invertAlpha']" />
      <Panel :keys="['xOffset', 'yOffset', 'offsetBezier']" />
      <Panel :keys="['blur', 'blurBezier']" />
      <Panel :keys="['spread']" />
    </Sidebar>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed } from '@vue/reactivity';
import { ref, h } from 'vue';
import Panel from './components/Panel.vue';
import { useModel } from './model';
const Sidebar = h('div', { class: 'sidebar' });
const Container = h('div', { class: 'container' });
const ColorTool = h('div', { class: 'color-tool' });

function shadow(left: number, top: number, blur: number, spread: number, color: string): string {
  return `${left}px ${top}px ${blur}px ${spread}px ${color}`;
}

function rgba(r: number, g: number, b: number, a: number): string {
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) {
    throw '类型错误';
  }
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  };
}

const fixed = (num: number, precision = 1) => parseFloat(num.toFixed(precision)).toString();

// https://stackoverflow.com/questions/3942878/how-to-decide-font-color-in-white-or-black-depending-on-background-color
// true -> dark
// false -> right
const checkColorDepth = function (hexColor: string, simple = false): boolean {
  const { r, g, b } = hexToRgb(hexColor);
  if (simple) {
    return r * 0.299 + g * 0.587 + b * 0.114 > 186;
  }

  const c = [r, g, b].map((item) => {
    const c = item / 255;
    if (c <= 0.03928) {
      return c / 12.92;
    } else {
      return Math.pow((c + 0.055) / 1.055, 2.4);
    }
  });
  var L = 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  return L > 0.179;
};

const backgroundColor = ref('#edf2f7');
const boxColor = ref('#ffffff');
const shadowColor = ref('#000000');

const model = useModel();
const { boxShadowList } = storeToRefs(model);

const textColor = computed(() => {
  return checkColorDepth(boxColor.value) ? '#666666' : '#ffffff';
});

const boxStyle = computed(() => {
  const shadowRgbColor = hexToRgb(shadowColor.value);
  return {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '35vw',
    minHeight: '25vh',
    borderRadius: '6px',
    marginTop: '-15vh',
    backgroundColor: boxColor.value,
    padding: '30px',
    boxShadow: boxShadowList.value
      .map(({ leftOffset, topOffset, blur, spread, alpha }) =>
        shadow(
          leftOffset,
          topOffset,
          blur,
          spread,
          rgba(shadowRgbColor.r, shadowRgbColor.g, shadowRgbColor.b, alpha),
        ),
      )
      .join(',\n'),
    color: textColor.value,
    transition: 'color .3s',
  };
});

const handleSelect = (e: Event) => {
  const range = document.createRange();
  range.selectNode(e.currentTarget as HTMLInputElement);
  const selection = window.getSelection();
  if (selection) {
    selection.removeAllRanges();
    selection.addRange(range);
  }
};
</script>

<style lang="less">
.wrap {
  width: 100vw;
  height: 100vh;
  color: rgb(49, 63, 78);
  display: grid;
  grid-template-columns: 1fr 500px;
}

.container {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  .inner {
    padding: 10px;
    border-radius: 3px;
    font-family: monospace;
    font-size: 16px;
    overflow: hidden;
    white-space: pre;
  }

  .val {
    font-weight: bold;
  }

  .text {
    opacity: 0.7;
  }
}

.sidebar {
  padding: 20px;
  overflow-y: auto;
  user-select: none;
}

.color-tool {
  position: absolute;
  bottom: 0;
  left: 20px;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  // border-radius: 3px;
  // transform: translate3d(-50%, 0, 0);
  // background-color: rgba(207, 217, 228, 0.5);
  label {
    margin: 10px;
    padding: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 12px;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 1.3px 1.3px 2.3px rgba(0, 0, 0, 0.028), 4.5px 4.5px 7.8px rgba(0, 0, 0, 0.042),
      20px 20px 35px rgba(0, 0, 0, 0.07);
  }
  input[type='color'] {
    width: 36px;
    height: 36px;
    padding: 0;
    border: none;
    background: transparent;
    margin-bottom: 6px;
    border-radius: 8px;
    &::-webkit-color-swatch {
      border: 2px solid #ccc;
      // border: 0;
      border-radius: 8px;
    }
  }
}
</style>
