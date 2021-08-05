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
          <SearchIcon />
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

<style module>
.dropdown-group {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.dropdown-top {
  z-index: 30;
  border-radius: 0.5rem;
  background-color: white;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  transition: all 200ms;
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

.dropdown_icon {
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

.dropdown-enter-active,
.dropdown-leave-active {
  transition-property: all;
  transition-duration: 200ms;
}
.dropdown-enter,
.dropdown-leave-active {
  opacity: 0;
  transform: translateY(-5%);
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
