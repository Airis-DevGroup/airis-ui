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
    rounded: {
      type: [Boolean, String],
      default: false,
      validator: (value) => {
        if (typeof value == 'boolean') return true;
        else {
          const allowed = ['sm', 'md', 'lg', 'xl', '2xl', 'full'];
          if (allowed.includes(value)) return true;
          else {
            console.error('@airis-ui/dropdown: Rounded level not allowed');
            return false;
          }
        }
      },
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
        'margin-top':
          labelHeight * (this.rounded == 'full' ? 1.13 : 0.9) + 'px',
        'padding-top': labelHeight * (this.rounded == 'full' ? 0 : 0.1) + 'px',
      };
    },
    roundedLevel() {
      if (typeof this.rounded == 'string') return this.rounded;
      else {
        if (this.rounded) return 'lg';
        else return 'none';
      }
    },
  },
  data() {
    return {
      isOpen: false,
      searchText: '',
    };
  },
  methods: {
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
      if (!this.searchable) this.isOpen = false;
      this.$emit('input', value);
      this.$emit('change', value);
    },
    onBlur() {
      this.$emit('blur');
      this.isOpen = false;
    },
    onWheel(e) {
      this.$emit('scroll', e.deltaY > 0 ? 'down' : 'up');
    },
  },
  watch: {
    isOpen: function (value) {
      this.$emit(value ? 'open' : 'close');
    },
  },
};
</script>

<template>
  <button
    :class="[
      $style['dropdown-group'],
      $style[`dropdown-rounded-${roundedLevel}`],
    ]"
    ref="dropdownGroup"
    @blur="!searchable && onBlur"
    @wheel="onWheel"
  >
    <slot
      name="input"
      :isOpen="isOpen"
      :toggle="onLabelClick"
      :onSearch="onSearch"
      :label="Label"
    >
      <div
        :class="[
          $style['dropdown-top'],
          isOpen && rounded != 'full' && $style['dropdown-flat-bottom-corners'],
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
              :placeholder="Label"
              @input="(e) => onSearch(e.target.value)"
              @blur="onBlur"
            />
          </slot>
          <SearchIcon :class="$style['dropdown-icon']" />
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
  </button>
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
  @apply shadow;
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
  @apply shadow bg-white;
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
