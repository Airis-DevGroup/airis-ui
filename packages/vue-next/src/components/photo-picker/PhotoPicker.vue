<script lang="ts">
import { computed, defineComponent, ref, VueElement } from 'vue';

export default defineComponent({
  name: 'PhotoPicker',
  props: {
    src: {
      type: String,
      default: '',
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    sizeLimit: {
      type: [Number, String],
      default: 5,
    },
    extensions: {
      type: Array,
      default: () => ['jpeg', 'png', 'pdf'],
    },
    noOverlay: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const profilePhoto = ref<VueElement | null>(null);

    const previewImage = ref<string | undefined>(undefined);
    const image = ref<File | undefined>(undefined);
    const isPdf = ref(false);

    const getters = {
      SizeLimit: computed(() => {
        const value =
          typeof props.sizeLimit == 'number'
            ? props.sizeLimit
            : Number(props.sizeLimit);
        return value * 1000000;
      }),
    };

    const methods = {
      OpenDialog() {
        profilePhoto.value?.click();
        emit('dialog');
      },
      Clear() {
        image.value = undefined;
        previewImage.value = undefined;
        isPdf.value = false;
        emit('clear');
      },
      UploadImage(e: Event) {
        const target = e.target as HTMLInputElement;
        image.value = target.files?.[0];
        if (!image.value) return;
        if (image.value.size > getters.SizeLimit.value) {
          emit('error', { code: 'SizeLimitExceeded' });
          return;
        }
        const reader = new FileReader();
        reader.readAsDataURL(image.value);
        reader.onload = (e) => {
          const renderTarget = e.target as FileReader;
          const imageData = renderTarget.result as string;
          const extension = imageData.split(';')[0].split('/')[1];
          if (!props.extensions.includes(extension)) {
            emit('error', { code: 'InvalidExtension' });
            return;
          }
          if (extension === 'pdf') isPdf.value = true;
          else isPdf.value = false;
          previewImage.value = renderTarget.result as string;
          emit('upload', previewImage.value);
        };
      },
    };

    return {
      profilePhoto,
      previewImage,
      image,
      isPdf,
      ...getters,
      ...methods,
    };
  },
});
</script>

<template>
  <div :class="$style['picker-wrapper']">
    <input
      ref="profilePhoto"
      :class="$style['display-none']"
      type="file"
      :disabled="readonly"
      name="filename"
      accept="image/*, application/pdf"
      @change="UploadImage"
    />
    <div
      :class="[
        $style['preview-wrapper'],
        !readonly && $style['preview-wrapper-action'],
      ]"
    >
      <slot
        v-if="!noOverlay"
        name="overlay"
        :readonly="readonly"
        :image="previewImage"
      >
        <div
          :class="[
            $style['picker-text'],
            !readonly ? $style['picker-text-action'] : $style['display-none'],
          ]"
          @click="OpenDialog"
        >
          {{ src || previewImage ? 'Change' : 'Upload' }}
        </div>
      </slot>
      <slot
        v-if="src || previewImage"
        name="preview"
        :preview="previewImage || src"
        :isPdf="isPdf"
        :filename="image ? image.name : ''"
      >
        <div v-if="previewImage" class="w-full h-full">
          <img
            v-if="!isPdf"
            :class="$style['preview-image']"
            :src="previewImage"
          />
          <div v-else :class="$style['preview-filename']">
            {{ image.name }}
          </div>
        </div>
        <img v-else :class="$style['preview-image']" :src="src" />
      </slot>
      <slot v-else name="placeholder">
        <svg
          :class="$style['placeholder-icon']"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
          ></path>
        </svg>
      </slot>
    </div>
  </div>
</template>

<style module>
.picker-wrapper {
  @apply flex justify-center;
  @apply overflow-hidden;
}

.preview-wrapper {
  @apply relative w-full group;
}

.picker-text {
  @apply absolute inset-0 z-20;
  @apply flex justify-center items-center;
  @apply bg-white opacity-0 text-gray-900;
  @apply uppercase font-light text-center text-xl;
  @apply transition-all duration-150;
}

.picker-text-action {
  @apply flex hover:opacity-75 cursor-pointer;
}

.preview-image {
  @apply w-full h-full object-cover;
}

.preview-filename {
  @apply flex w-full h-full justify-center items-center;
}

.placeholder-icon {
  @apply w-20 h-64 mx-auto;
}

.display-none {
  @apply hidden;
}
</style>
