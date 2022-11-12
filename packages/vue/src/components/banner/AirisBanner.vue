<script setup lang="ts">
import type { BorderRadius } from '@airis-ui/types/style';
import { computed, onMounted, ref, useCssModule, watch, type PropType, type Ref } from 'vue';

type BannerEvents = 'accept' | 'cancel' | 'close' | 'open';

const style = useCssModule();
const emit = defineEmits(['accept', 'cancel', 'close', 'open']);
const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  top: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '',
  },
  message: {
    type: String,
    default: '',
  },
  accept: {
    type: [Boolean, String],
    default: false,
  },
  cancel: {
    type: [Boolean, String],
    default: false,
  },
  rounded: {
    type: [Boolean, String] as PropType<boolean | BorderRadius>,
    default: false,
  },
});

const showBanner = ref(false);

onMounted(() => {
  if (typeof props.show === 'boolean') showBanner.value = props.show;
});

// Computed
const borderRadius: Ref<BorderRadius> = computed(() => {
  if (typeof props.rounded === 'string') return props.rounded;
  else return props.rounded ? 'lg' : 'none';
});

// Methods
function _onAction(action: BannerEvents) {
  emit(action);
  showBanner.value = false;
}
function onCancel() {
  _onAction('cancel');
}
function onAccept() {
  _onAction('accept');
}

// Watchers
watch(
  () => props.show,
  (value) => {
    showBanner.value = value;
  },
);

watch(
  () => showBanner.value,
  (value) => {
    emit(value ? 'open' : 'close');
  },
);
</script>

<template>
  <transition :name="top ? '___airis-banner-top-fade' : '___airis-banner-bottom-fade'">
    <div
      v-if="showBanner"
      :class="[style['banner-container'], top ? style['banner-top'] : style['banner-bottom']]"
    >
      <div :class="[style.banner, style[`banner-rounded-${borderRadius}`]]">
        <slot>
          <div>
            <p>{{ title }}</p>
            <p>{{ message }}</p>
          </div>
        </slot>
        <slot name="actions" :accept="onAccept" :cancel="onCancel">
          <div :class="$style['actions-wrapper']">
            <button
              v-if="accept"
              @click="onAccept"
              type="button"
              :class="[style.action, style['action-accept']]"
            >
              {{ typeof accept == 'string' ? accept : 'Accept' }}
            </button>
            <button
              v-if="cancel"
              @click="onCancel"
              type="button"
              :class="[style.action, style['action-cancel']]"
            >
              {{ typeof cancel == 'string' ? cancel : 'Cancel' }}
            </button>
          </div>
        </slot>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.___airis-banner-bottom-fade-enter-active,
.___airis-banner-bottom-fade-leave-active,
.___airis-banner-top-fade-enter-active,
.___airis-banner-top-fade-leave-active {
  @apply transition-all duration-200;
}

.___airis-banner-bottom-fade-enter,
.___airis-banner-bottom-fade-leave-active,
.___airis-banner-top-fade-enter,
.___airis-banner-top-fade-leave-active {
  @apply opacity-0 transform;
}

.___airis-banner-bottom-fade-enter,
.___airis-banner-bottom-fade-leave-active {
  @apply translate-y-1.5;
}

.___airis-banner-top-fade-enter,
.___airis-banner-top-fade-leave-active {
  @apply -translate-y-1.5;
}
.___airis-banner-bottom-fade-leave-active {
  @apply translate-y-1.5;
}

.___airis-banner-top-fade-enter,
.___airis-banner-top-fade-leave-active {
  @apply -translate-y-1.5;
}
</style>

<style module>
.banner-container {
  @apply fixed px-4 left-0 right-0;
  z-index: 99999;
}

.banner-top {
  @apply top-0;
}
.banner-top .banner {
  @apply mt-10;
}

.banner-bottom {
  @apply bottom-0;
}
.banner-bottom .banner {
  @apply mb-10;
}

.banner {
  @apply flex flex-col sm:flex-row justify-between items-center;
  @apply max-w-3xl mx-auto p-5;
  @apply bg-white shadow-lg;
}

.banner-rounded-none {
  @apply rounded-none;
}

.banner-rounded-sm {
  @apply rounded-b-sm;
}

.banner-rounded-md {
  @apply rounded-md;
}

.banner-rounded-lg {
  @apply rounded-lg;
}

.banner-rounded-xl {
  @apply rounded-xl;
}

.banner-rounded-2xl {
  @apply rounded-2xl;
}

.actions-wrapper {
  @apply sm:flex sm:flex-row-reverse;
  @apply w-full sm:w-auto mt-1 sm:mt-0 sm:ml-5;
}

.action {
  @apply flex justify-center items-center;
  @apply w-full sm:w-auto;
  @apply shadow-sm rounded-md;
  @apply px-6 py-2 mt-3 sm:my-0 sm:ml-2;
  @apply font-semibold sm:text-sm text-white;
}

.action-accept {
  @apply bg-blue-600;
}

.action-cancel {
  @apply bg-white text-gray-700;
  @apply border border-gray-300;
  @apply hover:text-gray-500;
}
</style>
