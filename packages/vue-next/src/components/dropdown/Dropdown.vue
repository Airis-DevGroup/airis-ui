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
    };

    const methods = {
      toggleOpen(e: Event) {
        const checkParent = (element: HTMLElement | null) => {
          const target = e.target as HTMLElement;
          return (
            target.parentElement != element &&
            target.parentElement?.parentElement != element
          );
        };
        if (
          checkParent(dropdownGroup.value) &&
          checkParent(dropdownLabel.value)
        ) {
          state.isOpen = !state.isOpen;
        }
      },
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
        emit('update:modelValue', value);
        emit('change', value);
      },
    };

    watchEffect(() => {
      if (state.isOpen) {
        document.body.addEventListener('click', methods.toggleOpen);
        emit('show');
      } else {
        document.body.removeEventListener('click', methods.toggleOpen);
        emit('hide');
      }
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
  <div :class="style['dropdown-group']" ref="dropdownGroup">
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
              @input="(e) => onSearch(e.target.value)"
              :placeholder="Label"
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
  </div>
</template>

<style scoped>
.___dropdown-enter-active,
.___dropdown-leave-active {
  transition-property: all;
  transition-duration: 200ms;
}
.___dropdown-enter-from,
.___dropdown-leave-active {
  opacity: 0;
  transform: translateY(-5%);
}
</style>

<style module>
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
  border-bottom-right-radius: 0rem !important;
  border-bottom-left-radius: 0rem !important;
}

.dropdown-search-input {
  outline: 2px solid transparent;
  outline-offset: 2px;
  min-width: 0;
  width: 100%;
}

.dropdown-icon {
  width: 1.5rem;
  height: 1.5rem;
}

.dropdown-chevron {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.dropdown-rotate-180 {
  transform: rotate(180deg);
}

.dropdown-body {
  position: absolute;
  width: 100%;
  border-bottom-right-radius: 0.5rem;
  border-bottom-left-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  background-color: white;
  z-index: 10;
  overflow: hidden;
}

.dropdown-body-inner {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  max-height: 15rem;
}

.dropdown-label,
.dropdown-search {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  user-select: none;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  outline: none;
  background-color: white;
  cursor: pointer;
}
</style>
