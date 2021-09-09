<template>
  <div :class="$style['base-modal']">
    <div :class="$style['modal-body']">
      <slot name="icon">
        <div v-if="!noIcon" :class="$style['icon-wrapper']">
          <svg
            :class="$style.icon"
            style="width: 1.5rem; height: 1.5rem"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
      </slot>
      <slot>
        <div :class="$style['modal-content']">
          <h3 :class="$style['modal-title']">
            {{ title }}
          </h3>
          <p :class="$style['modal-message']">
            {{ message }}
          </p>
        </div>
      </slot>
    </div>
    <slot name="actions" :accept="onAccept" :cancel="onCancel">
      <div :class="$style['actions-wrapper']">
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
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue';

export default defineComponent({
  name: 'AlertModal',
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
    noIcon: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const { CloseModal } = inject('ModalWrapper') || {};

    const onAccept = () => {
      CloseModal('accept');
    };

    const onCancel = () => {
      CloseModal('close');
    };

    return {
      onAccept,
      onCancel,
    };
  },
});
</script>

<style module>
.base-modal {
  @apply relative w-full sm:max-w-lg;
  @apply bg-white;
  @apply rounded-lg;
}

.modal-body {
  @apply flex flex-col sm:flex-row;
  @apply sm:items-start;
  @apply px-4 pb-4 pt-5 sm:px-6 sm:pt-6;
}

.modal-content {
  @apply mt-3 sm:mt-0 sm:ml-4;
  @apply text-center sm:text-left;
}

.modal-title {
  @apply font-semibold text-lg text-gray-800;
  @apply mt-0;
}

.modal-message {
  @apply text-sm text-gray-500;
  @apply mt-2;
}

.icon-wrapper {
  @apply mx-auto;
  @apply flex items-center justify-center;
  @apply h-12 w-12 min-h-12 min-w-12;
  @apply rounded-full;
  @apply bg-blue-700 bg-opacity-25;
  @apply sm:mx-0 sm:h-10 sm:w-10;
}

.icon {
  @apply h-6 w-6 min-h-6 min-w-6;
}

.actions-wrapper {
  @apply sm:flex sm:flex-row-reverse;
  @apply px-3 py-3;
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
