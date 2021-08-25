<template>
  <transition name="___banner-fade">
    <div v-if="show" :class="$style['banner-container']">
      <div
        :class="[
          classes,
          $style.banner,
          $style[`banner-rounded-${roundedLevel}`],
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
              :class="[$style.action, $style['action-accept']]"
            >
              {{ typeof accept == 'string' ? accept : 'Accept' }}
            </button>
            <button
              v-if="cancel"
              @click="onCancel"
              type="button"
              :class="[$style.action, $style['action-cancel']]"
            >
              {{ typeof cancel == 'string' ? cancel : 'Cancel' }}
            </button>
          </div>
        </slot>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'Banner',
  data() {
    return {
      show: true,
    };
  },
  props: {
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
      validator: (value) => {
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
  methods: {
    onCancel() {
      this.show = false;
    },
    onAccept() {
      this.show = false;
    },
  },
  computed: {
    roundedLevel() {
      if (typeof this.rounded == 'string') return this.rounded;
      else {
        if (this.rounded) return 'lg';
        else return 'none';
      }
    },
  },
};
</script>

<style module>
.banner-container {
  @apply absolute bottom-0 left-0 right-0;
}

.banner {
  @apply flex justify-between items-center;
  @apply max-w-3xl;
  @apply shadow-lg;
  @apply mb-10 mx-auto;
  @apply p-5;
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
.___banner-fade-enter-active,
.___banner-fade-leave-active {
  @apply transition-all duration-200;
}

.___banner-fade-enter,
.___banner-fade-leave-to {
  @apply opacity-0;
  @apply transform translate-y-1.5;
}
</style>
