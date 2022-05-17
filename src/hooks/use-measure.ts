import { ref, reactive, onMounted, onUnmounted, watchEffect } from 'vue';
import _ from 'lodash';

declare type ResizeObserverCallback = (entries: any[], observer: ResizeObserver) => void;
declare class ResizeObserver {
  constructor(callback: ResizeObserverCallback);
  observe(target: Element, options?: any): void;
  unobserve(target: Element): void;
  disconnect(): void;
  static toString(): string;
}

export interface RectReadOnly {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly top: number;
  readonly right: number;
  readonly bottom: number;
  readonly left: number;
  [key: string]: number;
}

type HTMLOrSVGElement = HTMLElement | SVGElement;

type Result = [(element: HTMLOrSVGElement | null) => void, RectReadOnly, () => void];

type State = {
  element: HTMLOrSVGElement | null;
  scrollContainers: HTMLOrSVGElement[] | null;
  resizeObserver: ResizeObserver | null;
  lastBounds: RectReadOnly;
};

export type Options = {
  debounce?: number | { scroll: number; resize: number };
  scroll?: boolean;
  polyfill?: { new (cb: ResizeObserverCallback): ResizeObserver };
  offsetSize?: boolean;
};

const keys: (keyof RectReadOnly)[] = [
  'x',
  'y',
  'top',
  'bottom',
  'left',
  'right',
  'width',
  'height',
];
const areBoundsEqual = (a: RectReadOnly, b: RectReadOnly): boolean =>
  keys.every((key) => a[key] === b[key]);

// Returns a list of scroll offsets
function findScrollContainers(element: HTMLOrSVGElement | null): HTMLOrSVGElement[] {
  const result: HTMLOrSVGElement[] = [];
  if (!element || element === document.body) return result;
  const { overflow, overflowX, overflowY } = window.getComputedStyle(element);
  if ([overflow, overflowX, overflowY].some((prop) => prop === 'auto' || prop === 'scroll'))
    result.push(element);
  return [...result, ...findScrollContainers(element.parentElement)];
}

function useOnWindowScroll(onScroll: () => void, enabled: boolean) {
  const cb = onScroll;
  onMounted(() => {
    if (enabled) {
      window.addEventListener('scroll', cb, { capture: true, passive: true });
    }
  });
  onUnmounted(() => window.removeEventListener('scroll', cb, true));
}

function useOnWindowResize(onWindowResize: (event: Event) => void) {
  const cb = onWindowResize;
  onMounted(() => {
    window.addEventListener('resize', cb);
  });
  onUnmounted(() => window.removeEventListener('resize', cb));
}

function useMeasure(
  { debounce, scroll, polyfill, offsetSize }: Options = {
    debounce: 0,
    scroll: false,
    offsetSize: false,
  },
): Result {
  const ResizeObserver =
    polyfill ||
    (typeof window === 'undefined' ? class ResizeObserver {} : (window as any).ResizeObserver);

  if (!ResizeObserver) {
    throw new Error(
      'This browser does not support ResizeObserver out of the box. See: https://github.com/react-spring/react-use-measure/#resize-observer-polyfills',
    );
  }

  const bounds = reactive<RectReadOnly>({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    bottom: 0,
    right: 0,
    x: 0,
    y: 0,
  });

  const state = reactive<State>({
    element: null,
    scrollContainers: null,
    resizeObserver: null,
    lastBounds: bounds,
  });

  const mounted = ref(false);

  const scrollDebounce = debounce
    ? typeof debounce === 'number'
      ? debounce
      : debounce.scroll
    : null;

  const resizeDebounce = debounce
    ? typeof debounce === 'number'
      ? debounce
      : debounce.resize
    : null;

  const forceRefresh = () => {
    if (!state.element) return;
    const { left, top, width, height, bottom, right, x, y } =
      state.element.getBoundingClientRect() as unknown as RectReadOnly;

    const size = {
      left,
      top,
      width,
      height,
      bottom,
      right,
      x,
      y,
    };

    if (state.element instanceof HTMLElement && offsetSize) {
      size.height = state.element.offsetHeight;
      size.width = state.element.offsetWidth;
    }

    Object.freeze(size);
    if (mounted.value && !areBoundsEqual(state.lastBounds, size)) state.lastBounds = size;
  };

  const resizeChange = resizeDebounce ? _.debounce(forceRefresh, resizeDebounce) : forceRefresh;
  const scrollChange = scrollDebounce ? _.debounce(forceRefresh, scrollDebounce) : forceRefresh;

  // cleanup current scroll-listeners / observers
  function removeListeners() {
    if (state.scrollContainers) {
      state.scrollContainers.forEach((element) =>
        element.removeEventListener('scroll', scrollChange, true),
      );
      state.scrollContainers = null;
    }

    if (state.resizeObserver) {
      state.resizeObserver.disconnect();
      state.resizeObserver = null;
    }
  }

  // add scroll-listeners / observers
  function addListeners() {
    if (!state.element) return;
    state.resizeObserver = new ResizeObserver(scrollChange);
    if (state.resizeObserver) {
      state.resizeObserver.observe(state.element);
    }
    if (scroll && state.scrollContainers) {
      state.scrollContainers.forEach((scrollContainer) =>
        scrollContainer.addEventListener('scroll', scrollChange, { capture: true, passive: true }),
      );
    }
  }

  const elementRef = (node: HTMLOrSVGElement | null) => {
    if (!node || node === state.element) return;
    removeListeners();
    state.element = node;
    state.scrollContainers = findScrollContainers(node);
    addListeners();
  };

  // add general event listeners
  useOnWindowScroll(scrollChange, Boolean(scroll));
  useOnWindowResize(resizeChange);

  onMounted(() => {
    mounted.value = true;
  });
  onUnmounted(() => {
    mounted.value = false;
    removeListeners();
  });

  watchEffect(() => {
    removeListeners();
    addListeners();
  });

  return [elementRef, bounds, forceRefresh];
}

export default useMeasure;
