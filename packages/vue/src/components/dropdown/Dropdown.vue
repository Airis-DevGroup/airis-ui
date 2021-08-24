<script>
import ChevronIcon from '@/icons/chevron.vue';
import SearchIcon from '@/icons/search.vue';

export default {
  name: 'Dropdown',
  components: {
    ChevronIcon,
    SearchIcon,
  },
  props: {
    value: {
      type: Object,
      required: true,
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
  computed: {
    Label() {
      if (this.value && this.label && this.value[this.label])
        return this.value[this.label];
      else return this.placeholder;
    },
    bodyMaxHeight() {
      const labelHeight = this.$refs.dropdownGroup.clientHeight;
      return {
        'max-height': labelHeight + 'px',
      };
    },
    bodyStyle() {
      const labelHeight = this.$refs.dropdownGroup.clientHeight;
      return {
        'margin-top': labelHeight * 0.9 + 'px',
        'padding-top': labelHeight * 0.1 + 'px',
      };
    },
  },
  data() {
    return {
      isOpen: false,
      searchText: '',
    };
  },
  methods: {
    toggleOpen(e) {
      const dropdownGroup = this.$refs.dropdownGroup;
      const dropdownLabel = this.$refs.dropdownLabel;

      const checkParent = (element) =>
        e.target.parentElement != element &&
        e.target.parentElement.parentElement != element;
      if (checkParent(dropdownGroup) && checkParent(dropdownLabel)) {
        this.isOpen = !this.isOpen;
      }
    },
    onLabelClick() {
      if (this.searchable) this.$refs.dropdownSearchInput.focus();
      else if (this.$refs.dropdownLabel) this.$refs.dropdownLabel.focus();
      this.isOpen = !this.isOpen;
    },
    onSearch(search) {
      this.searchText = search;
      this.$emit('search', this.searchText);
    },
    onSelect(value) {
      this.searchText = '';
      this.$emit('input', value);
    },
  },
  watch: {
    isOpen: function (value) {
      if (value) document.body.addEventListener('click', this.toggleOpen);
      else document.body.removeEventListener('click', this.toggleOpen);
    },
  },
};
</script>

<template>
  <div :class="$style['dropdown-group']" ref="dropdownGroup">
    <slot
      name="input"
      :toggle="onLabelClick"
      :onSearch="onSearch"
      :label="Label"
    >
      <div
        :class="[
          $style['dropdown-top'],
          isOpen && $style['dropdown-flat-bottom-corners'],
        ]"
        ref="dropdownLabel"
        @click="onLabelClick"
      >
        <div
          :class="$style['dropdown-search']"
          ref="dropdownSearch"
          v-if="searchable"
        >
          <slot name="search-input" :onSearch="onSearch" :label="Label">
            <input
              :class="$style['dropdown-search-input']"
              ref="dropdownSearchInput"
              type="text"
              :value="searchText"
              @input="(e) => onSearch(e.target.value)"
              :placeholder="Label"
            />
          </slot>
          <SearchIcon :class="style['dropdown-icon']" />
        </div>
        <div
          v-else
          :class="$style['dropdown-label']"
          ref="dropdownDefaultLabel"
        >
          <slot name="label" :label="Label">
            <p>{{ Label }}</p>
          </slot>
          <ChevronIcon
            :class="[
              $style['dropdown-icon'],
              $style['dropdown-chevron'],
              isOpen && $style['dropdown-rotate-180'],
            ]"
          />
        </div>
      </div>
    </slot>
    <transition name="___dropdown">
      <div
        v-if="isOpen"
        :class="$style['dropdown-body']"
        ref="dropdownBody"
        :style="bodyStyle"
      >
        <div :class="$style['dropdown-body-inner']">
          <slot :select="onSelect" />
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.___dropdown-enter-active,
.___dropdown-leave-active {
  @apply transition-all duration-200;
}
.___dropdown-enter,
.___dropdown-leave-active {
  @apply opacity-0;
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
  @apply shadow;
  @apply bg-white;
  @apply transition-all duration-200;
}

.dropdown-flat-bottom-corners {
  @apply rounded-b-none !important;
}

.dropdown-search-input {
  @apply outline-none;
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
