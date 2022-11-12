<script setup lang="ts">
import type { BorderRadius } from '@airis-ui/types/style';
import { computed, ref, useCssModule, watchEffect, type PropType } from 'vue';

const dropdownRoot = ref<HTMLButtonElement | null>(null);
const dropdownLabel = ref<HTMLDivElement | null>(null);
const dropdownSearch = ref<HTMLInputElement | null>(null);

const style = useCssModule();
const emit = defineEmits([
  'blur',
  'change',
  'close',
  'open',
  'scroll',
  'search',
  'update:modelValue',
]);
const props = defineProps({
  modelValue: {
    type: [Object, String] as PropType<Record<string, string> | string>,
    default: () => ({}),
  },
  placeholder: {
    type: String,
    default: '',
  },
  label: {
    type: String,
    default: '',
  },
  searchable: {
    type: Boolean,
    default: false,
  },
  rounded: {
    type: [Boolean, String] as PropType<boolean | BorderRadius>,
    default: false,
  },
});

const isOpen = ref(false);
const searchInput = ref('');

// Computed
const Label = computed(() => {
  if (!props.modelValue) return props.placeholder;
  if (typeof props.modelValue === 'string') return props.modelValue;
  if (!props.label) return props.placeholder;
  if (typeof props.modelValue !== 'object') return props.placeholder;
  if (!props.modelValue[props.label]) return props.placeholder;
  return props.modelValue[props.label];
});
const bodyStyle = computed(() => {
  const rootHeight = dropdownRoot.value?.clientHeight || 0;
  return {
    'margin-top': `${rootHeight * (props.rounded === 'full' ? 1.13 : 0.9)}px`,
    'padding-top': `${rootHeight * (props.rounded === 'full' ? 0 : 0.1)}px`,
  };
});
const borderRadius = computed(() => {
  if (typeof props.rounded === 'string') return props.rounded;
  else return props.rounded ? 'lg' : 'none';
});

// Methods
function toggle(value?: boolean) {
  if (value === true || isOpen.value === false) {
    if (props.searchable) dropdownSearch.value?.focus();
    else dropdownLabel.value?.focus();
  }
  isOpen.value = value ?? !isOpen.value;
}
function onSearch(input: string) {
  searchInput.value = input;
  emit('search', searchInput.value);
}
function onSelect(value: unknown) {
  searchInput.value = '';
  if (!props.searchable) isOpen.value = false;
  emit('update:modelValue', value);
  emit('change', value);
}
function onBlur() {
  emit('blur');
  isOpen.value = false;
}
function onScroll(e: WheelEvent) {
  emit('scroll', e.deltaY > 0 ? 'down' : 'up');
}

// Watchers
watchEffect(() => {
  emit(isOpen.value ? 'open' : 'close');
});
</script>

<template>
  <button
    :class="[style['dropdown-group'], style[`dropdown-rounded-${borderRadius}`]]"
    ref="dropdownGroup"
    @blur="!searchable && onBlur()"
    @wheel="onScroll"
  >
    <slot name="input" :isOpen="isOpen" :toggle="toggle" :onSearch="onSearch" :label="Label">
      <div
        :class="[
          style['dropdown-top'],
          isOpen && rounded != 'full' && style['dropdown-flat-bottom-corners'],
        ]"
        ref="dropdownLabel"
        @click="toggle()"
      >
        <div :class="style['dropdown-search']" ref="dropdownSearch" v-if="searchable">
          <slot name="search-input" :onSearch="onSearch" :label="Label">
            <input
              :class="style['dropdown-search-input']"
              ref="dropdownSearchInput"
              type="text"
              :value="searchInput"
              :placeholder="Label"
              @input="(e: any) => onSearch(e.target.value)"
              @blur="onBlur"
            />
          </slot>
          <SearchIcon :class="style['dropdown-icon']" />
        </div>
        <div v-else :class="style['dropdown-label']" ref="dropdownDefaultLabel">
          <slot name="label" :label="Label">
            <p>{{ Label }}</p>
          </slot>
          <ChevronIcon
            :class="[
              style['dropdown-icon'],
              style['dropdown-chevron'],
              isOpen && style['dropdown-rotate-180'],
            ]"
          />
        </div>
      </div>
    </slot>
    <transition name="___airis-dropdown">
      <div v-show="isOpen" :class="style['dropdown-body']" ref="dropdownBody" :style="bodyStyle">
        <div :class="style['dropdown-body-inner']">
          <slot :select="onSelect" />
        </div>
      </div>
    </transition>
  </button>
</template>

<style scoped>
.___airis-dropdown-enter-active,
.___airis-dropdown-leave-active {
  @apply transition-all duration-200;
}
.___airis-dropdown-enter-from,
.___airis-dropdown-leave-active {
  @apply opacity-0;
  transform: translateY(-5%);
}
</style>

<style module>
.dropdown-rounded-none .dropdown-top,
.dropdown-rounded-none .dropdown-label,
.dropdown-rounded-none .dropdown-search {
  @apply rounded-none;
}
.dropdown-rounded-none .dropdown-body {
  @apply rounded-b-none;
}

.dropdown-rounded-sm .dropdown-top,
.dropdown-rounded-sm .dropdown-label,
.dropdown-rounded-sm .dropdown-search {
  @apply rounded-sm;
}
.dropdown-rounded-sm .dropdown-body {
  @apply rounded-b-sm;
}

.dropdown-rounded-md .dropdown-top,
.dropdown-rounded-md .dropdown-label,
.dropdown-rounded-md .dropdown-search {
  @apply rounded;
}
.dropdown-rounded-md .dropdown-body {
  @apply rounded-b;
}

.dropdown-rounded-lg .dropdown-top,
.dropdown-rounded-lg .dropdown-label,
.dropdown-rounded-lg .dropdown-search {
  @apply rounded-lg;
}
.dropdown-rounded-lg .dropdown-body {
  @apply rounded-b-lg;
}

.dropdown-rounded-xl .dropdown-top,
.dropdown-rounded-xl .dropdown-label,
.dropdown-rounded-xl .dropdown-search {
  @apply rounded-xl;
}
.dropdown-rounded-xl .dropdown-body {
  @apply rounded-b-xl;
}

.dropdown-rounded-2xl .dropdown-top,
.dropdown-rounded-2xl .dropdown-label,
.dropdown-rounded-2xl .dropdown-search {
  @apply rounded-2xl;
}
.dropdown-rounded-2xl .dropdown-body {
  @apply rounded-b-2xl;
}

.dropdown-rounded-full .dropdown-top,
.dropdown-rounded-full .dropdown-label,
.dropdown-rounded-full .dropdown-search {
  @apply rounded-full;
}
.dropdown-rounded-full .dropdown-body {
  @apply rounded-xl;
}

.dropdown-group {
  @apply relative;
  @apply flex flex-col;
  @apply w-full;
}

.dropdown-top {
  @apply z-30;
  @apply rounded-lg shadow;
  @apply w-full bg-white;
  @apply transition-all duration-200;
}

.dropdown-flat-bottom-corners {
  @apply rounded-b-none !important;
}

.dropdown-search-input {
  @apply outline-none focus:outline-none;
  @apply min-w-0 w-full;
}

.dropdown-icon {
  @apply w-6 h-6;
}

.dropdown-chevron {
  @apply transform transition-transform;
}

.dropdown-rotate-180 {
  @apply rotate-180;
}

.dropdown-body {
  @apply absolute w-full overflow-hidden z-10;
  @apply rounded-b-lg shadow bg-white;
}

.dropdown-body-inner {
  @apply flex flex-col max-h-64;
  @apply overflow-y-auto overflow-x-hidden;
}

.dropdown-label,
.dropdown-search {
  @apply flex items-center justify-between w-full;
  @apply select-none cursor-pointer outline-none;
  @apply bg-white py-3 px-4;
}
</style>
