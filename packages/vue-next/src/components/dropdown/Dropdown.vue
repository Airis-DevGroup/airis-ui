<script lang="ts">
import {
  computed,
  defineComponent,
  useCssModule,
  reactive,
  ref,
  VueElement,
  watchEffect,
  toRefs,
} from 'vue';

import ChevronIcon from '@/icons/chevron.vue';
import SearchIcon from '@/icons/search.vue';

export default defineComponent({
  name: 'Dropdown',
  components: {
    ChevronIcon,
    SearchIcon,
  },
  props: {
    modelValue: {
      type: Object,
      default: null,
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
      type: [Boolean, String],
      default: false,
      validator: (value: boolean | string) => {
        if (typeof value == 'boolean') return true;
        else {
          const allowed = ['sm', 'md', 'lg', 'xl', '2xl'];
          if (allowed.includes(value)) return true;
          else {
            console.error('@airis-ui/dropdown: Rounded level not allowed');
            return false;
          }
        }
      },
    },
  },
  setup(props, { emit }) {
    const style = useCssModule();

    const state = reactive({
      isOpen: false,
      searchText: '',
    });

    const dropdownGroup = ref<VueElement | null>(null);
    const dropdownLabel = ref<VueElement | null>(null);
    const dropdownSearchInput = ref<VueElement | null>(null);

    const getters = {
      Label: computed(() => {
        if (props.modelValue && props.label && props.modelValue[props.label])
          return props.modelValue[props.label];
        else return props.placeholder;
      }),
      bodyMaxHeight: computed(() => {
        const labelHeight = dropdownGroup.value?.clientHeight || 0;
        return {
          'max-height': labelHeight + 'px',
        };
      }),
      bodyStyle: computed(() => {
        const labelHeight = dropdownGroup.value?.clientHeight || 0;
        return {
          'margin-top': labelHeight * 0.9 + 'px',
          'padding-top': labelHeight * 0.1 + 'px',
        };
      }),
      roundedLevel: computed(() => {
        if (typeof props.rounded == 'string') return props.rounded;
        else {
          if (props.rounded) return 'lg';
          else return 'none';
        }
      }),
    };

    const methods = {
      onLabelClick() {
        if (props.searchable) dropdownSearchInput.value?.focus();
        else if (dropdownLabel.value) dropdownLabel.value?.focus();
        state.isOpen = !state.isOpen;
      },
      onSearch(search: string) {
        state.searchText = search;
        emit('search', state.searchText);
      },
      onSelect(value: unknown) {
        state.searchText = '';
        if (!props.searchable) state.isOpen = false;
        emit('update:modelValue', value);
        emit('change', value);
      },
      onBlur() {
        emit('blur');
        state.isOpen = false;
      },
      onWheel(e: WheelEvent) {
        emit('scroll', e.deltaY > 0 ? 'down' : 'up');
      },
    };

    watchEffect(() => {
      emit(state.isOpen ? 'open' : 'close');
    });

    return {
      style,
      dropdownGroup,
      dropdownLabel,
      dropdownSearchInput,
      ...toRefs(state),
      ...getters,
      ...methods,
    };
  },
});
</script>

<template>
  <button
    :class="[
      style['dropdown-group'],
      style[`dropdown-rounded-${roundedLevel}`],
    ]"
    ref="dropdownGroup"
    @blur="!searchable && onBlur()"
    @wheel="onWheel"
  >
    <slot
      name="input"
      :toggle="onLabelClick"
      :onSearch="onSearch"
      :label="Label"
    >
      <div
        :class="[
          style['dropdown-top'],
          isOpen && style['dropdown-flat-bottom-corners'],
        ]"
        ref="dropdownLabel"
        @click="onLabelClick"
      >
        <div
          :class="style['dropdown-search']"
          ref="dropdownSearch"
          v-if="searchable"
        >
          <slot name="search-input" :onSearch="onSearch" :label="Label">
            <input
              :class="style['dropdown-search-input']"
              ref="dropdownSearchInput"
              type="text"
              :value="searchText"
              :placeholder="Label"
              @input="(e) => onSearch(e.target.value)"
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
    <transition name="___dropdown">
      <div
        v-show="isOpen"
        :class="style['dropdown-body']"
        ref="dropdownBody"
        :style="bodyStyle"
      >
        <div :class="style['dropdown-body-inner']">
          <slot :select="onSelect" />
        </div>
      </div>
    </transition>
  </button>
</template>

<style scoped>
.___dropdown-enter-active,
.___dropdown-leave-active {
  @apply transition-all duration-200;
}
.___dropdown-enter-from,
.___dropdown-leave-active {
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

.dropdown-group {
  @apply relative;
  @apply flex flex-col;
  @apply w-full;
}

.dropdown-top {
  @apply z-30;
  @apply rounded-lg shadow;
  @apply bg-white;
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
  @apply select-none cursor-pointer outline-none rounded-lg;
  @apply bg-white py-3 px-4;
}
</style>
