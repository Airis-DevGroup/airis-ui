<script lang="ts">
import {
  computed,
  defineComponent,
  ref,
  onMounted,
  provide,
  ComponentInternalInstance,
} from 'vue';

export default defineComponent({
  name: 'Stepper',
  props: {
    showIndicator: {
      type: Boolean,
      default: false,
    },
    hideDefaultActions: {
      type: Boolean,
      default: false,
    },
    canFinish: {
      type: Boolean,
      default: true,
    },
    keepAlive: {
      type: Boolean,
      default: false,
    },
    initialStep: {
      type: [Number, String],
      default: 0,
      validator: (value: number | string) => {
        if (typeof value == 'number') return true;
        else {
          try {
            Number(value);
            return true;
          } catch (_) {
            return false;
          }
        }
      },
    },
  },
  setup(props, { emit }) {
    const steps = ref<Array<ComponentInternalInstance>>([]);
    const currentIndex = ref(0);
    const animation = ref('forward');

    onMounted(() => {
      currentIndex.value =
        typeof props.initialStep == 'number'
          ? props.initialStep
          : Number(props.initialStep);
    });

    const currentStep = computed(() => {
      return steps.value[currentIndex.value];
    });

    const totalSteps = computed(() => {
      return steps.value.length;
    });

    const canGoNext = computed(() => {
      return (
        currentIndex.value < totalSteps.value - 1 &&
        currentStep.value?.props.canAdvance
      );
    });

    const canGoBack = computed(() => {
      return currentIndex.value > 0;
    });

    const isLastStep = computed(() => {
      return currentIndex.value == totalSteps.value - 1;
    });

    const progress = computed(() => {
      if (isLastStep.value && props.canFinish) return 100;
      else return (currentIndex.value / totalSteps.value) * 100;
    });

    const direction = computed(() => {
      if (animation.value == 'forward')
        return {
          '--___stepper_forward': '10%',
          '--___stepper_backward': '-10%',
        };
      else
        return {
          '--___stepper_forward': '-10%',
          '--___stepper_backward': '10%',
        };
    });

    // eslint-disable-next-line
    const methods: any = {
      onNext() {
        currentStep.value.emit('next');
        emit('next');
        if (canGoNext.value) methods.animateTo(currentIndex.value + 1);
      },
      onBack() {
        currentStep.value.emit('back');
        emit('back');
        if (canGoBack.value) methods.animateTo(currentIndex.value - 1);
      },
      onFinish() {
        emit('finish');
      },
      animateTo(index: number) {
        if (index > currentIndex.value) animation.value = 'forward';
        else animation.value = 'backward';
        emit('change', { old: currentIndex.value, new: index });
        currentIndex.value = index;
      },
    };

    provide('StepperState', {
      steps,
      currentIndex,
      keepAlive: props.keepAlive,
    });

    return {
      canGoNext,
      canGoBack,
      isLastStep,
      progress,
      direction,
      ...methods,
    };
  },
});
</script>

<template>
  <div :class="$style.stepper">
    <div v-if="showIndicator">
      <slot name="indicator" :progress="progress">
        <div
          :class="$style['progress-bar']"
          :style="`width: ${progress}%;
            border-top-right-radius: ${progress == 100 ? '0' : '9999px'};
            border-bottom-right-radius:  ${progress == 100 ? '0' : '9999px'};`"
        />
      </slot>
    </div>
    <div :style="direction" :class="$style['steps-container']">
      <slot
        :handlers="{
          next: onNext,
          back: onBack,
          finish: onFinish,
          animateTo: animateTo,
        }"
        :checks="{
          canGoNext,
          canGoBack,
          canFinish,
          isLastStep,
        }"
      />
    </div>
    <slot
      name="controls"
      :handlers="{
        next: onNext,
        back: onBack,
        finish: onFinish,
        animateTo: animateTo,
      }"
      :checks="{
        canGoNext,
        canGoBack,
        canFinish,
        isLastStep,
      }"
    >
      <div v-if="!hideDefaultActions" :class="$style.controls">
        <button
          :class="[$style.action, !canGoBack && $style['disabled-action']]"
          @click="onBack"
        >
          Back
        </button>
        <button
          v-if="isLastStep"
          :class="[
            $style.action,
            $style['finish-action'],
            !canFinish && $style['disabled-action'],
          ]"
          @click="onFinish"
        >
          Finish
        </button>
        <button
          v-else
          :class="[$style.action, !canGoNext && $style['disabled-action']]"
          @click="onNext"
        >
          Next
        </button>
      </div>
    </slot>
  </div>
</template>

<style module>
.action {
  @apply bg-none border-none p-0 cursor-pointer;
}

.stepper {
  @apply flex flex-col justify-between;
}

.progress-bar {
  height: 0.375rem;
  background-color: #202124;
  transition-property: all;
  transition-duration: 250ms;
  transform-origin: left;
}

.steps-container {
  @apply relative;
  @apply flex flex-grow justify-center;
}

.controls {
  @apply py-8 px-10;
  @apply flex justify-between items-center;
}

.action {
  @apply w-32 h-12;
  @apply transition-all cursor-pointer;
  @apply bg-white border rounded-lg shadow outline-none;
  -webkit-tap-highlight-color: transparent;
}

.finish-action {
  @apply text-white;
  background-color: rgb(34, 34, 34);
}

.disabled-action {
  color: rgb(155, 155, 155);
  background-color: rgb(241, 241, 241);
  @apply shadow-none border-none cursor-default;
}
</style>
