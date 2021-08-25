<template>
  <transition :name="top ? '___banner-top-fade' : '___banner-bottom-fade'">
    <div
      v-if="isShown"
      :class="[
        style['banner-container'],
        top ? style['banner-top'] : style['banner-bottom'],
      ]"
    >
      <div
        :class="[
          classes,
          style.banner,
          style[`banner-rounded-${roundedLevel}`],
        ]"
      >
        <slot>
          <div>
            <p>{{ title }}</p>
            <p>{{ message }}</p>
          </div>
        </slot>
        <slot name="actions" :accept="onAccept" :cancel="onCancel">
          <div>
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

<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  ref,
  useCssModule,
  watch,
} from 'vue';

export default defineComponent({
  name: 'Banner',
  props: {
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
    classes: {
      type: String,
      default: '',
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
            console.error('@airis-ui/banner: Rounded level not allowed');
            return false;
          }
        }
      },
    },
  },
  setup(props, { emit }) {
    const style = useCssModule();

    const showBanner = ref(false);

    onMounted(() => {
      if (props.show) showBanner.value = true;
    });

    const methods = {
      onCancel() {
        emit('cancel');
        showBanner.value = false;
      },
      onAccept() {
        emit('accept');
        showBanner.value = false;
      },
    };

    const getters = {
      isShown: computed(() => {
        return showBanner.value && props.show;
      }),
      roundedLevel: computed(() => {
        if (typeof props.rounded == 'string') return props.rounded;
        else {
          if (props.rounded) return 'lg';
          else return 'none';
        }
      }),
    };

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

    return {
      style,
      ...getters,
      ...methods,
    };
  },
});
</script>

<style module>
.banner-container {
  @apply absolute left-0 right-0;
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
  @apply flex justify-between items-center;
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

<style scoped>
.___banner-bottom-fade-enter-active,
.___banner-bottom-fade-leave-active,
.___banner-top-fade-enter-active,
.___banner-top-fade-leave-active {
  @apply transition-all duration-200;
}

.___banner-bottom-fade-enter,
.___banner-bottom-fade-leave-active,
.___banner-top-fade-enter,
.___banner-top-fade-leave-active {
  @apply opacity-0 transform;
}

.___banner-bottom-fade-enter,
.___banner-bottom-fade-leave-active {
  @apply translate-y-1.5;
}

.___banner-top-fade-enter,
.___banner-top-fade-leave-active {
  @apply -translate-y-1.5;
}
</style>
