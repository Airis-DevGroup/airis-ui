<script>
export default {
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
      validator: (value) => {
        if (typeof value == 'number') return true;
        else {
          try {
            Number(value);
          } catch (_) {
            return false;
          }
        }
      },
    },
  },
  data() {
    return {
      totalSteps: 0,
      currentIndex: 0,
      animation: 'forward',
    };
  },
  mounted() {
    this.totalSteps = this.$children.length;
    this.currentIndex =
      typeof this.initialStep == 'number'
        ? this.initialStep
        : Number(this.initialStep);
  },
  computed: {
    currentStep() {
      return this.$children[this.currentIndex];
    },
    canGoNext() {
      return (
        this.currentIndex < this.totalSteps - 1 && this.currentStep.canAdvance
      );
    },
    canGoBack() {
      return this.currentIndex > 0;
    },
    isLastStep() {
      return this.currentIndex == this.totalSteps - 1;
    },
    progress() {
      if (this.isLastStep && this.canFinish) return 100;
      else return (this.currentIndex / this.totalSteps) * 100;
    },
    direction() {
      if (this.animation == 'forward')
        return {
          '--___stepper_forward': '10%',
          '--___stepper_backward': '-10%',
        };
      else
        return {
          '--___stepper_forward': '-10%',
          '--___stepper_backward': '10%',
        };
    },
  },
  methods: {
    onNext() {
      this.currentStep.$emit('next');
      this.$emit('next');
      if (this.canGoNext) this.animateTo(this.currentIndex + 1);
    },
    onBack() {
      this.currentStep.$emit('back');
      this.$emit('back');
      if (this.canGoBack) this.animateTo(this.currentIndex - 1);
    },
    onFinish() {
      this.$emit('finish');
    },
    animateTo(index) {
      if (index > this.currentIndex) this.animation = 'forward';
      else this.animation = 'backward';
      this.$emit('change', { old: this.currentIndex, new: index });
      this.currentIndex = index;
    },
  },
};
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
